// ===== iPhone（悬浮球手机）日志系统：后台捕获 + 内存缓冲 + 「日志」应用 =====
// 架构参考 SoulLink 的 views-log.js（同目录扩展）：
//   1) 后台常驻捕获：console 包装 / window 错误 / Promise 拒绝 / 全局 fetch 旁路 /
//      宿主事件桥接（ctx.eventSource），统一进内存环形缓冲；
//   2) 热重载安全：缓冲与捕获包装挂在 globalThis 上，脚本重新执行时只把「捕获
//      目标」换成当前实例的函数，日志不中断、不重复包装；
//   3) 「日志」应用只是这块缓冲的查看器：关闭应用捕获不中断，重开即重渲染。
// 与 SoulLink 的差异：手机端渲染上限更小（RENDER_CAP 300）、用「回到最新」
// 浮钮代替显式跟随开关（贴底即跟随）、完整请求体并入导出 JSON（不再单列按钮）、
// 操作反馈用应用内 toast（不依赖 toastr）。

// ---------- 捕获原语 ----------
const IPHONE_LOG_CONSOLE_ORIGINALS = {};
// 热重载共享状态：新旧实例共用同一份缓冲与暂停/序列状态。
const iphoneLogState = globalThis[IPHONE_LOG_STATE_KEY] || (globalThis[IPHONE_LOG_STATE_KEY] = {
  entries: [],
  sequence: 0,
  paused: false,
  pausedCount: 0,
  pausedAtId: 0,
  fullBodies: [], // 对话接口的完整请求/响应体（导出用，环形保留最近 IPHONE_LOG_FULL_BODY_MAX 份）
});
const iphoneLogEntries = iphoneLogState.entries;

// ---------- 视图状态（仅当前实例） ----------
let iphoneLogMaxEntries = IPHONE_LOG_MAX_ENTRIES_DEFAULT;
let iphoneLogNoise = true;
let iphoneLogLevelFilter = '';
let iphoneLogSourceFilter = '';
let iphoneLogSearchQuery = '';
let iphoneLogVisibleCount = 0;
let iphoneLogStatsRaf = 0;
let iphoneLogSearchTimer = null;
// 当前打开的「日志」应用视图引用；应用关闭时 DOM 被移除，靠 root.isConnected 失效。
let iphoneLogViewRef = null;

function iphoneLogClampInt(value, min, max, fallback) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.max(min, Math.min(max, Math.round(number)));
}

function iphoneLogFormatTime(timestamp) {
  const date = new Date(timestamp);
  const pad = (n) => String(n).padStart(2, '0');
  return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}.${String(date.getMilliseconds()).padStart(3, '0')}`;
}

function iphoneLogSafeStringify(value) {
  if (value === undefined) return 'undefined';
  if (typeof value === 'string') return value;
  try {
    const seen = new WeakSet();
    const text = JSON.stringify(value, (key, item) => {
      if (typeof item === 'bigint') return `${item}n`;
      if (item instanceof Error) return `[${item.name || 'Error'}: ${item.message}]`;
      if (typeof item === 'function') return '[function]';
      if (item && typeof item === 'object') {
        if (seen.has(item)) return '[circular]';
        seen.add(item);
      }
      return item;
    });
    return text === undefined ? String(value) : text;
  } catch {
    return String(value);
  }
}

function iphoneLogArgToText(arg) {
  if (typeof arg === 'string') return arg;
  if (arg instanceof Error) return `${arg.name || 'Error'}: ${arg.message}`;
  if (arg && typeof arg === 'object' && arg.nodeType === 1) return `<${String(arg.tagName || 'element').toLowerCase()}>`;
  if (typeof arg === 'symbol') return String(arg);
  const text = iphoneLogSafeStringify(arg);
  return text.length > 800 ? `${text.slice(0, 800)}…(截断)` : text;
}

function iphoneLogBuildMessage(args) {
  const parts = [];
  for (const arg of args) {
    try {
      parts.push(iphoneLogArgToText(arg));
    } catch {
      parts.push('[unserializable]');
    }
  }
  const message = parts.join(' ');
  return message.length > 4000 ? `${message.slice(0, 4000)}…(截断)` : message;
}

// ---------- 脱敏与格式化（网络捕获） ----------
function iphoneLogRedact(text) {
  return String(text || '')
    .replace(/("(?:api[_-]?key|zapikey|key|password|proxy_password|authorization|token)"\s*:\s*")[^"]*(")/gi, '$1***$2')
    .replace(/(Authorization:\s*Bearer\s+)[A-Za-z0-9._-]+/gi, '$1***')
    .replace(/(Bearer\s+)[A-Za-z0-9._-]+/gi, '$1***')
    .replace(/\b(sk-[A-Za-z0-9_-]{12,})\b/g, 'sk-***')
    .replace(/\b(tauri-invoke-key:\s*)[^\s]+/gi, '$1***');
}

function iphoneLogPrettyJson(text, cap) {
  const trimmed = String(text || '');
  if (!trimmed) return '(无)';
  try {
    const parsed = JSON.parse(trimmed);
    const pretty = JSON.stringify(parsed, null, 2);
    return pretty.length > cap ? `${pretty.slice(0, cap)}…(截断)` : pretty;
  } catch {
    return trimmed.length > cap ? `${trimmed.slice(0, cap)}…(截断)` : trimmed;
  }
}

function iphoneLogFormatHeaders(headers) {
  try {
    const normalized = new Headers(headers || {});
    const lines = [];
    normalized.forEach((value, key) => {
      const lower = key.toLowerCase();
      const redacted = /authorization|api[_-]?key|password|proxy_password|token|cookie|invoke/i.test(lower) ? '***' : value;
      lines.push(`${key}: ${redacted}`);
    });
    return lines.join('\n') || '(无)';
  } catch {
    return '(无法读取)';
  }
}

function iphoneLogFormatBody(body) {
  if (body === undefined || body === null) return '(无)';
  if (typeof body === 'string') return iphoneLogRedact(iphoneLogPrettyJson(body, IPHONE_LOG_REQUEST_BODY_CAP));
  if (body instanceof URLSearchParams) return iphoneLogRedact(String(body).slice(0, IPHONE_LOG_REQUEST_BODY_CAP));
  if (typeof FormData !== 'undefined' && body instanceof FormData) {
    const lines = [];
    body.forEach((value, key) => {
      const text = typeof value === 'string' ? value : `[File ${value.name || '?'} ${value.size || '?'}B]`;
      lines.push(`${key}: ${/key|password|token/i.test(key) ? '***' : text}`);
    });
    return lines.join('\n') || '(空)';
  }
  if (body instanceof Blob) return `[Blob ${body.size} 字节]`;
  if (body instanceof ArrayBuffer) return `[ArrayBuffer ${body.byteLength} 字节]`;
  if (body instanceof ReadableStream) return '[ReadableStream]';
  return `[${Object.prototype.toString.call(body)}]`;
}

async function iphoneLogReadStreamText(stream, cap) {
  if (!stream) return '';
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let text = '';
  try {
    while (text.length < cap) {
      const { done, value } = await reader.read();
      if (done) break;
      text += decoder.decode(value, { stream: true });
    }
    if (text.length >= cap) {
      try {
        await reader.cancel();
      } catch {}
      text = `${text.slice(0, cap)}…(截断)`;
    }
  } finally {
    try {
      reader.releaseLock();
    } catch {}
  }
  return text;
}

function iphoneLogIsChatUrl(url) {
  // 对话接口（含酒馆后台代理与 OpenAI 兼容直连）：完整保留请求/响应体供导出。
  return /chat-completions|generate_chat_completion|\/v1\/chat\/completions/i.test(String(url || ''));
}

async function iphoneLogReadStreamFully(stream) {
  if (!stream) return '';
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let text = '';
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      text += decoder.decode(value, { stream: true });
    }
    text += decoder.decode();
  } finally {
    try {
      reader.releaseLock();
    } catch {}
  }
  return text;
}

// ---------- 捕获目标：入缓冲 ----------
function iphonePushLogEntry(level, source, args, detail) {
  try {
    const safeLevel = IPHONE_LOG_LEVELS.includes(level) ? level : 'info';
    const timestamp = Date.now();
    const entry = {
      id: ++iphoneLogState.sequence,
      ts: timestamp,
      time: iphoneLogFormatTime(timestamp),
      level: safeLevel,
      source: String(source || 'app').slice(0, 24),
      message: iphoneLogRedact(iphoneLogBuildMessage(Array.isArray(args) ? args : [args])),
    };
    if (detail) entry.detail = iphoneLogRedact(String(detail)).slice(0, IPHONE_LOG_DETAIL_CAP);
    // 噪音过滤：console 刷屏（debug+info 都过滤，[WI] 等常以 info 输出）、
    // 非模型网络调用（debug 级）、宿主扩展更新检查的已知 error。warn/error 永不误伤。
    if (iphoneLogNoise) {
      if (source === 'console' && (safeLevel === 'debug' || safeLevel === 'info')
        && IPHONE_LOG_NOISE_PREFIXES.some((prefix) => entry.message.startsWith(prefix))) return;
      if (source === 'network' && safeLevel === 'debug'
        && IPHONE_LOG_NETWORK_NOISE_PATTERNS.some((pattern) => pattern.test(entry.message))) return;
      if (IPHONE_LOG_ERROR_NOISE_PATTERNS.some((pattern) => pattern.test(entry.message))) return;
    }
    // 连续重复折叠：同级别/来源/内容/详情紧挨着出现时，只更新最后一条的计数与时间
    const last = iphoneLogEntries[iphoneLogEntries.length - 1];
    if (last && last.level === entry.level && last.source === entry.source
      && last.message === entry.message && (last.detail || '') === (entry.detail || '')) {
      last.repeat = (last.repeat || 1) + 1;
      last.ts = timestamp;
      last.time = entry.time;
      if (iphoneLogState.paused) iphoneLogState.pausedCount += 1;
      iphoneLogRefreshLastRow();
      iphoneLogUpdateStatusText();
      iphoneLogScheduleStats();
      return;
    }
    iphoneLogEntries.push(entry);
    if (iphoneLogEntries.length > iphoneLogMaxEntries) {
      iphoneLogEntries.splice(0, iphoneLogEntries.length - iphoneLogMaxEntries);
    }
    if (iphoneLogState.paused) iphoneLogState.pausedCount += 1;
    iphoneLogAppendLive(entry);
    iphoneLogUpdateStatusText();
    iphoneLogScheduleStats();
  } catch (error) {
    try {
      IPHONE_LOG_CONSOLE_ORIGINALS.error?.apply(globalThis.console, ['[iPhone] 日志捕获失败', error]);
    } catch {}
  }
}

// 插件自身日志的原生输出：绕过捕获包装（避免同一条既进 console 捕获又进插件
// 源，重复入账），捕获未初始化时退回普通 console。
function iphoneConsoleWrite(level, args) {
  try {
    const method = level === 'info' ? 'log' : level;
    const original = IPHONE_LOG_CONSOLE_ORIGINALS[method] || globalThis.console[method] || globalThis.console.log;
    original.apply(globalThis.console, [`[${IPHONE_MODULE_DISPLAY_NAME}]`, ...args]);
  } catch {}
}

// ---------- console / window / Promise 捕获 ----------
function iphoneInitLogCapture() {
  if (typeof globalThis.window === 'undefined') return;
  try {
    const state = globalThis[IPHONE_LOG_CAPTURE_KEY] || (globalThis[IPHONE_LOG_CAPTURE_KEY] = { handlers: [], originals: {} });
    if (state.handlers.length === 0) {
      ['log', 'info', 'warn', 'error', 'debug'].forEach((method) => {
        const original = globalThis.console?.[method]?.bind?.(globalThis.console);
        if (typeof original !== 'function') return;
        state.originals[method] = original;
        globalThis.console[method] = (...args) => {
          try {
            (state.originals[method] || globalThis.console[method])(...args);
          } catch {}
          for (const handler of state.handlers) {
            try {
              handler(method === 'log' ? 'info' : method, 'console', args);
            } catch {}
          }
        };
      });
      globalThis.window.addEventListener('error', (event) => {
        const where = event?.filename ? ` @ ${event.filename}${event.lineno ? `:${event.lineno}` : ''}` : '';
        for (const handler of state.handlers) {
          try {
            handler('error', 'window', [String(event?.message || '未知错误') + where]);
          } catch {}
        }
      });
      globalThis.window.addEventListener('unhandledrejection', (event) => {
        for (const handler of state.handlers) {
          try {
            handler('error', 'promise', [event?.reason ?? '未捕获的 Promise 拒绝']);
          } catch {}
        }
      });
    }
    // 热重载（扩展脚本重新执行）时，沿用已有的 console 包装与窗口监听，
    // 只把捕获目标换成当前实例的 iphonePushLogEntry，日志不中断、不重复包装。
    state.handlers = [iphonePushLogEntry];
    for (const method of Object.keys(state.originals)) {
      if (!IPHONE_LOG_CONSOLE_ORIGINALS[method]) IPHONE_LOG_CONSOLE_ORIGINALS[method] = state.originals[method];
    }
  } catch (error) {
    try {
      globalThis.console?.error?.('[iPhone] 日志捕获初始化失败', error);
    } catch {}
  }
}

function iphoneResolveHostEventType(ctx, eventName) {
  const typeKey = IPHONE_LOG_HOST_EVENT_TYPE_KEYS[eventName];
  if (typeKey && ctx?.event_types && ctx.event_types[typeKey] !== undefined && ctx.event_types[typeKey] !== null) {
    return ctx.event_types[typeKey];
  }
  return eventName;
}

// 宿主事件桥接：宿主上下文未就绪（如本地 test.html 预览）时静默跳过。
function iphoneInitHostEventLogging() {
  const ctx = iphoneGetContextSafe();
  const eventSource = ctx?.eventSource;
  if (!eventSource || typeof eventSource.on !== 'function') return;
  const wrappers = globalThis[IPHONE_LOG_EVENT_KEY] || (globalThis[IPHONE_LOG_EVENT_KEY] = {});
  for (const eventName of IPHONE_LOG_HOST_EVENTS) {
    const eventType = iphoneResolveHostEventType(ctx, eventName);
    const previous = wrappers[eventName];
    if (previous && typeof eventSource.removeListener === 'function') {
      eventSource.removeListener(eventType, previous);
    }
    const wrapped = (...args) => iphonePushLogEntry('debug', 'host', [`[${eventName}]`, ...args]);
    wrappers[eventName] = wrapped;
    eventSource.on(eventType, wrapped);
  }
}

// ---------- 全局 fetch 旁路（网络捕获） ----------
async function iphoneDescribeFetchRequest(args) {
  const [input, init] = args;
  let url = '';
  let method = 'GET';
  let headers = null;
  let bodyText = '(无)';
  let fullBody = '';
  if (input instanceof Request) {
    url = input.url;
    method = input.method || 'GET';
    headers = input.headers;
    try {
      const clone = input.clone();
      const rawBody = await iphoneLogReadStreamText(clone.body, IPHONE_LOG_REQUEST_BODY_CAP);
      bodyText = rawBody ? iphoneLogRedact(iphoneLogPrettyJson(rawBody, IPHONE_LOG_REQUEST_BODY_CAP)) : '(无)';
      if (iphoneLogIsChatUrl(url)) {
        fullBody = iphoneLogRedact(await iphoneLogReadStreamFully(input.clone().body));
      }
    } catch {
      bodyText = '(请求体已消费，无法读取)';
    }
  } else {
    url = String(input);
    method = String(init?.method || 'GET').toUpperCase();
    headers = init?.headers || null;
    bodyText = iphoneLogFormatBody(init?.body);
    if (iphoneLogIsChatUrl(url)) {
      fullBody = iphoneLogRedact(iphoneLogPrettyJson(String(init?.body ?? ''), Number.MAX_SAFE_INTEGER));
    }
  }
  return {
    url,
    method,
    fullBody,
    detail: `请求头:\n${iphoneLogFormatHeaders(headers)}\n请求体:\n${bodyText}`,
  };
}

async function iphoneReadResponseBodyForLog(response, url) {
  try {
    const cappedClone = response.clone();
    let capped = '';
    let full = '';
    // 对话接口的响应体直接从同一个 clone 完整读完（再截断出展示文本），
    // 避免二次 clone 在原响应体已被消费后抛错、把已读到的内容一起丢掉。
    if (iphoneLogIsChatUrl(url)) {
      full = iphoneLogRedact(await iphoneLogReadStreamFully(cappedClone.body));
      capped = full.length > IPHONE_LOG_RESPONSE_BODY_CAP ? `${full.slice(0, IPHONE_LOG_RESPONSE_BODY_CAP)}…(截断)` : full;
    } else {
      capped = await iphoneLogReadStreamText(cappedClone.body, IPHONE_LOG_RESPONSE_BODY_CAP);
    }
    return { capped, full };
  } catch {
    return { capped: '', full: '' };
  }
}

function iphonePushFullBody(capture) {
  iphoneLogState.fullBodies.push(capture);
  if (iphoneLogState.fullBodies.length > IPHONE_LOG_FULL_BODY_MAX) {
    iphoneLogState.fullBodies.splice(0, iphoneLogState.fullBodies.length - IPHONE_LOG_FULL_BODY_MAX);
  }
  iphonePushLogEntry('debug', 'network', ['完整请求体已捕获', `${capture.method} ${capture.url}`]);
}

function iphoneHandleNetworkEvent(event) {
  try {
    if (event.kind === 'request') {
      iphonePushLogEntry('debug', 'network', [`${event.method} ${event.url}`], event.detail);
      return;
    }
    if (event.kind === 'error') {
      iphonePushLogEntry('error', 'network', [`请求失败 ${event.method} ${event.url}`, String(event.error?.message || event.error)], event.detail);
      return;
    }
    const { response, method, url, detail, fullBody, startedAt } = event;
    const duration = Date.now() - startedAt;
    const level = response.status >= 500 ? 'error' : (response.status >= 400 ? 'warn' : 'debug');
    const message = `${response.status} ${method} ${url} · ${duration}ms`;
    iphoneReadResponseBodyForLog(response, url)
      .then(({ capped, full }) => {
        iphonePushLogEntry(level, 'network', [message],
          `${detail}\n\n响应头:\n${iphoneLogFormatHeaders(response.headers)}\n响应体:\n${iphoneLogRedact(capped) || '(空)'}`);
        if (fullBody || full) {
          iphonePushFullBody({ url, method, requestBody: fullBody, responseBody: full, at: new Date().toISOString() });
        }
      })
      .catch(() => {
        iphonePushLogEntry(level, 'network', [message], `${detail}\n\n响应体: (读取失败)`);
      });
  } catch (error) {
    try {
      IPHONE_LOG_CONSOLE_ORIGINALS.error?.apply(globalThis.console, ['[iPhone] 网络日志处理失败', error]);
    } catch {}
  }
}

function iphoneInitNetworkCapture() {
  if (typeof globalThis.window === 'undefined') return;
  try {
    const state = globalThis[IPHONE_LOG_NETWORK_KEY] || (globalThis[IPHONE_LOG_NETWORK_KEY] = { handlers: [], original: null });
    if (!state.original && typeof globalThis.fetch === 'function') {
      state.original = globalThis.fetch.bind(globalThis);
      globalThis.fetch = async (...args) => {
        const requestInfo = await iphoneDescribeFetchRequest(args);
        const startedAt = Date.now();
        for (const handler of state.handlers) {
          try {
            handler({ kind: 'request', ...requestInfo, startedAt });
          } catch {}
        }
        let response;
        try {
          response = await state.original(...args);
        } catch (error) {
          for (const handler of state.handlers) {
            try {
              handler({ kind: 'error', ...requestInfo, error, startedAt });
            } catch {}
          }
          throw error;
        }
        for (const handler of state.handlers) {
          try {
            handler({ kind: 'response', ...requestInfo, response, startedAt });
          } catch {}
        }
        return response;
      };
    }
    // 热重载时沿用已安装的 fetch 包装，只替换捕获目标。
    state.handlers = [iphoneHandleNetworkEvent];
  } catch (error) {
    try {
      globalThis.console?.error?.('[iPhone] 网络日志捕获初始化失败', error);
    } catch {}
  }
}

// ---------- 缓冲 → 视图 ----------
function iphoneLogScheduleFrame(callback) {
  if (typeof globalThis.requestAnimationFrame === 'function') return globalThis.requestAnimationFrame(callback);
  return setTimeout(callback, 16);
}

function iphoneLogEntryMatches(entry) {
  if (iphoneLogLevelFilter && entry.level !== iphoneLogLevelFilter) return false;
  if (iphoneLogSourceFilter && entry.source !== iphoneLogSourceFilter) return false;
  const query = iphoneLogSearchQuery.trim().toLowerCase();
  if (!query) return true;
  return `${entry.time} ${entry.level} ${entry.source} ${entry.message} ${entry.detail || ''}`.toLowerCase().includes(query);
}

function iphoneLogVisibleEntries() {
  // 暂停时只渲染暂停时刻之前的快照：暂停期间缓冲的新日志不会因过滤/搜索/重开视图泄漏到列表
  const base = iphoneLogState.paused && iphoneLogState.pausedAtId > 0
    ? iphoneLogEntries.filter((entry) => entry.id <= iphoneLogState.pausedAtId)
    : iphoneLogEntries;
  return base.filter(iphoneLogEntryMatches);
}

function iphoneLogCreateRow(entry) {
  const row = document.createElement('div');
  row.className = `iphone-log__row iphone-log__row--${entry.level}`;
  row.title = '点击展开 / 收起完整内容';
  const time = document.createElement('span');
  time.className = 'iphone-log__time';
  time.textContent = entry.time;
  const level = document.createElement('span');
  level.className = 'iphone-log__level';
  level.textContent = entry.level;
  const source = document.createElement('span');
  source.className = 'iphone-log__source';
  source.textContent = entry.source;
  source.title = `来源: ${entry.source}`;
  const text = document.createElement('span');
  text.className = 'iphone-log__text';
  text.textContent = entry.message;
  text.title = entry.message;
  row.dataset.id = String(entry.id);
  row.append(time, level, source, text);
  if (entry.detail) {
    const detail = document.createElement('pre');
    detail.className = 'iphone-log__detail';
    detail.textContent = entry.detail;
    row.appendChild(detail);
  }
  if (entry.repeat > 1) {
    const repeat = document.createElement('span');
    repeat.className = 'iphone-log__repeat';
    repeat.textContent = `×${entry.repeat}`;
    repeat.title = `同一内容连续出现 ${entry.repeat} 次`;
    row.appendChild(repeat);
  }
  row.addEventListener('click', () => row.classList.toggle('is-expanded'));
  return row;
}

function iphoneLogScrollBottom(list) {
  if (!list) return;
  list.scrollTop = list.scrollHeight;
}

function iphoneLogAtBottom(list) {
  return list.scrollHeight - list.scrollTop - list.clientHeight < 24;
}

function iphoneLogSyncNote(list) {
  if (!list) return;
  if (iphoneLogVisibleCount <= IPHONE_LOG_RENDER_CAP) {
    list.querySelector('.iphone-log__note')?.remove();
    return;
  }
  let note = list.querySelector('.iphone-log__note');
  if (!note) {
    note = document.createElement('div');
    note.className = 'iphone-log__note';
    list.insertBefore(note, list.firstChild);
  }
  note.textContent = `仅显示最近 ${IPHONE_LOG_RENDER_CAP} 条 · 共 ${iphoneLogVisibleCount} 条`;
}

function iphoneLogUpdateBack() {
  const view = iphoneLogViewRef;
  if (!view || !view.root.isConnected) return;
  view.back.hidden = iphoneLogAtBottom(view.list);
}

function iphoneLogRenderList(force) {
  const view = iphoneLogViewRef;
  // force：构建应用时的首屏渲染（此刻还没挂进 DOM）；平时靠 isConnected 拦下已销毁视图
  if (!view || (!force && !view.root.isConnected)) return;
  const list = view.list;
  list.textContent = '';
  const entries = iphoneLogVisibleEntries();
  iphoneLogVisibleCount = entries.length;
  const slice = entries.slice(-IPHONE_LOG_RENDER_CAP);
  const fragment = document.createDocumentFragment();
  for (const entry of slice) fragment.appendChild(iphoneLogCreateRow(entry));
  list.appendChild(fragment);
  iphoneLogSyncNote(list);
  if (entries.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'iphone-log__empty';
    empty.textContent = '暂无日志 —— 后台会自动记录控制台、网络与宿主事件。';
    list.appendChild(empty);
  }
  iphoneLogScrollBottom(list);
  iphoneLogUpdateBack();
}

function iphoneLogRefreshLastRow() {
  const view = iphoneLogViewRef;
  const entry = iphoneLogEntries[iphoneLogEntries.length - 1];
  if (!view || !view.root.isConnected || !entry || iphoneLogState.paused) return;
  const lastRow = view.list.querySelector('.iphone-log__row:last-child');
  if (!lastRow || lastRow.dataset.id !== String(entry.id)) return;
  const timeEl = lastRow.querySelector('.iphone-log__time');
  if (timeEl) timeEl.textContent = entry.time;
  let badge = lastRow.querySelector('.iphone-log__repeat');
  if (entry.repeat > 1) {
    if (!badge) {
      badge = document.createElement('span');
      badge.className = 'iphone-log__repeat';
      lastRow.appendChild(badge);
    }
    badge.textContent = `×${entry.repeat}`;
    badge.title = `同一内容连续出现 ${entry.repeat} 次`;
  } else if (badge) {
    badge.remove();
  }
}

function iphoneLogAppendLive(entry) {
  const view = iphoneLogViewRef;
  if (!view || !view.root.isConnected || !entry) return;
  if (iphoneLogState.paused) return;
  if (!iphoneLogEntryMatches(entry)) return;
  const list = view.list;
  list.querySelector('.iphone-log__empty')?.remove();
  list.appendChild(iphoneLogCreateRow(entry));
  iphoneLogVisibleCount += 1;
  // 贴底即跟随（「回到最新」浮钮出现时表示用户翻看了历史，不强拉滚动）
  const shouldFollow = iphoneLogAtBottom(list) || view.follow;
  let rowCount = list.querySelectorAll('.iphone-log__row').length;
  while (rowCount > IPHONE_LOG_RENDER_CAP) {
    const firstRow = list.querySelector('.iphone-log__row');
    if (!firstRow) break;
    firstRow.remove();
    rowCount -= 1;
  }
  iphoneLogSyncNote(list);
  if (shouldFollow) iphoneLogScrollBottom(list);
  iphoneLogUpdateBack();
}

// 状态文字（共 N 条 / 已暂停 +N）：便宜到可以每条同步更新，不依赖 rAF——
// 后台标签里 rAF 会被节流，标题计数不该等它。
function iphoneLogUpdateStatusText() {
  const view = iphoneLogViewRef;
  if (!view || !view.root.isConnected) return;
  if (iphoneLogState.paused) {
    view.status.textContent = `已暂停 · 新增 +${iphoneLogState.pausedCount}`;
    view.status.classList.add('is-paused');
  } else {
    view.status.textContent = `共 ${iphoneLogEntries.length} 条`;
    view.status.classList.remove('is-paused');
  }
}

function iphoneLogUpdateStats(force) {
  const view = iphoneLogViewRef;
  if (!view || (!force && !view.root.isConnected)) return;
  const counts = { debug: 0, info: 0, warn: 0, error: 0 };
  for (const entry of iphoneLogEntries) counts[entry.level] = (counts[entry.level] || 0) + 1;
  view.root.querySelectorAll('.iphone-log__chip-count').forEach((node) => {
    const level = node.dataset.level || '';
    node.textContent = level ? counts[level] || 0 : iphoneLogEntries.length;
  });
  iphoneLogUpdateStatusText();
  iphoneLogVisibleCount = iphoneLogVisibleEntries().length;
  iphoneLogSyncNote(view.list);
}

function iphoneLogScheduleStats() {
  if (iphoneLogStatsRaf) return;
  iphoneLogStatsRaf = iphoneLogScheduleFrame(() => {
    iphoneLogStatsRaf = 0;
    try {
      iphoneLogUpdateStats();
    } catch {}
  });
}

// ---------- 导出 / 复制 / 清空 ----------
function iphoneLogExportText() {
  return `${iphoneLogEntries
    .map((entry) => {
      const suffix = entry.repeat > 1 ? ` (×${entry.repeat})` : '';
      const line = `${entry.time} [${entry.level}] (${entry.source}) ${entry.message}${suffix}`;
      if (!entry.detail) return line;
      return `${line}\n${entry.detail.split('\n').map((detailLine) => `  ${detailLine}`).join('\n')}`;
    })
    .join('\n')}\n`;
}

function iphoneLogDownloadJson(name, payload) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = name;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function iphoneLogSavePrefs(patch) {
  try {
    const settings = iphoneGetSettings();
    if (!settings) return;
    Object.assign(settings, patch);
    iphoneSaveSettings(settings);
  } catch {}
}

function iphoneLogRefreshPrefs() {
  try {
    const settings = iphoneGetSettings();
    if (!settings) return;
    iphoneLogMaxEntries = iphoneLogClampInt(settings.logMaxEntries, 100, 20000, IPHONE_LOG_MAX_ENTRIES_DEFAULT);
    iphoneLogNoise = settings.logConsoleNoise !== false;
  } catch {}
}

function iphoneLogClear() {
  iphoneLogEntries.length = 0;
  iphoneLogState.pausedCount = 0;
  iphoneLogState.pausedAtId = 0;
  iphoneLogRenderList();
  iphoneLogUpdateStats();
}

// ---------- 「日志」应用内页 ----------
// 应用内页每次打开都重建（openIphoneApp 会清空应用层），这里构建整棵视图树并
// 把当前实例的视图引用登记到 iphoneLogViewRef，供后台捕获实时追加。
function iphoneBuildLogsAppScreen() {
  iphoneLogRefreshPrefs();
  iphoneInitHostEventLogging(); // 宿主上下文可能晚于脚本加载就绪，打开应用时补一次桥接

  const screen = document.createElement('div');
  screen.className = 'iphone-app iphone-log';

  const make = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };

  // 头部：标题 + 状态 / 级别筛选 chips / 搜索 + 来源 / 工具行
  const header = make('header', 'iphone-log__header');
  const titlebar = make('div', 'iphone-log__titlebar');
  titlebar.appendChild(make('p', 'iphone-log__title', '日志'));
  const status = make('span', 'iphone-log__status', `共 ${iphoneLogEntries.length} 条`);
  titlebar.appendChild(status);
  header.appendChild(titlebar);

  const chips = make('div', 'iphone-log__chips');
  const chipDefs = [
    ['', '全部'],
    ['debug', '调试'],
    ['info', '信息'],
    ['warn', '警告'],
    ['error', '错误'],
  ];
  for (const [level, label] of chipDefs) {
    const chip = make('button', `iphone-log__chip${level === iphoneLogLevelFilter ? ' is-active' : ''}`, label);
    chip.type = 'button';
    chip.dataset.level = level;
    chip.appendChild(make('b', 'iphone-log__chip-count', '0')).dataset.level = level;
    chip.addEventListener('click', () => {
      iphoneLogLevelFilter = level;
      chips.querySelectorAll('.iphone-log__chip').forEach((node) => node.classList.toggle('is-active', node === chip));
      iphoneLogRenderList();
      iphoneLogUpdateStats();
    });
    chips.appendChild(chip);
  }
  header.appendChild(chips);

  const filters = make('div', 'iphone-log__filters');
  const search = make('div', 'iphone-log__search');
  search.insertAdjacentHTML('afterbegin',
    '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="5.6" fill="none" stroke="currentColor" stroke-width="2"/><path d="M15.1 15.1l4.2 4.2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>');
  const searchInput = make('input');
  searchInput.type = 'search';
  searchInput.placeholder = '搜索日志（含详情）';
  searchInput.addEventListener('input', () => {
    clearTimeout(iphoneLogSearchTimer);
    iphoneLogSearchTimer = setTimeout(() => {
      iphoneLogSearchQuery = String(searchInput.value || '').trim();
      iphoneLogRenderList();
      iphoneLogUpdateStats();
    }, IPHONE_LOG_SEARCH_DEBOUNCE_MS);
  });
  search.appendChild(searchInput);
  const sourceSelect = make('select', 'iphone-log__source');
  const sourceDefs = [
    ['', '全部来源'],
    ['network', '网络'],
    ['iphone', '插件'],
    ['console', '控制台'],
    ['host', '宿主'],
    ['window', '页面异常'],
    ['promise', 'Promise'],
    ['external', '外部'],
  ];
  for (const [value, label] of sourceDefs) {
    const option = make('option', '', label);
    option.value = value;
    sourceSelect.appendChild(option);
  }
  sourceSelect.value = iphoneLogSourceFilter;
  sourceSelect.addEventListener('change', () => {
    iphoneLogSourceFilter = sourceSelect.value || '';
    iphoneLogRenderList();
    iphoneLogUpdateStats();
  });
  filters.append(search, sourceSelect);
  header.appendChild(filters);

  const tools = make('div', 'iphone-log__tools');
  const toast = make('span', 'iphone-log__toast');
  let toastTimer = 0;
  const showToast = (text, isError) => {
    toast.textContent = text;
    toast.classList.toggle('is-error', Boolean(isError));
    toast.classList.add('is-show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-show'), 1800);
  };

  const pauseBtn = make('button', 'iphone-log__tool', iphoneLogState.paused ? '继续' : '暂停');
  pauseBtn.type = 'button';
  pauseBtn.classList.toggle('is-active', iphoneLogState.paused);
  pauseBtn.addEventListener('click', () => {
    iphoneLogState.paused = !iphoneLogState.paused;
    iphoneLogState.pausedCount = 0;
    if (iphoneLogState.paused) {
      // 记录暂停时刻的可见边界：暂停期间的新日志只入内存，恢复后一次性显示
      iphoneLogState.pausedAtId = iphoneLogEntries.length ? iphoneLogEntries[iphoneLogEntries.length - 1].id : 0;
    } else {
      iphoneLogState.pausedAtId = 0;
      iphoneLogRenderList();
    }
    pauseBtn.textContent = iphoneLogState.paused ? '继续' : '暂停';
    pauseBtn.classList.toggle('is-active', iphoneLogState.paused);
    iphoneLogUpdateStats();
  });

  const noiseBtn = make('button', `iphone-log__tool${iphoneLogNoise ? ' is-active' : ''}`, '噪音过滤');
  noiseBtn.type = 'button';
  noiseBtn.title = '过滤已知噪音（世界书扫描 / 宏变量 dump / 正则跳过 / 事件总线 / 内部保存 / 非模型网络调用 / 宿主扩展更新检查报错）';
  noiseBtn.addEventListener('click', () => {
    iphoneLogNoise = !iphoneLogNoise;
    noiseBtn.classList.toggle('is-active', iphoneLogNoise);
    iphoneLogSavePrefs({ logConsoleNoise: iphoneLogNoise });
    iphoneLogRenderList();
    iphoneLogUpdateStats();
  });

  const copyBtn = make('button', 'iphone-log__tool', '复制');
  copyBtn.type = 'button';
  copyBtn.addEventListener('click', async () => {
    const text = iphoneLogExportText();
    try {
      if (globalThis.navigator?.clipboard?.writeText) {
        await globalThis.navigator.clipboard.writeText(text);
      } else {
        const area = document.createElement('textarea');
        area.value = text;
        area.style.position = 'fixed';
        area.style.opacity = '0';
        document.body.appendChild(area);
        area.select();
        document.execCommand?.('copy');
        area.remove();
      }
      showToast(`已复制 ${iphoneLogEntries.length} 条日志`);
    } catch (error) {
      showToast(`复制失败：${error?.message || error}`, true);
    }
  });

  const exportBtn = make('button', 'iphone-log__tool', '导出');
  exportBtn.type = 'button';
  exportBtn.addEventListener('click', () => {
    if (iphoneLogEntries.length === 0) {
      showToast('暂无日志可导出', true);
      return;
    }
    const payload = {
      app: IPHONE_MODULE_DISPLAY_NAME,
      version: IPHONE_MODULE_VERSION,
      exportedAt: new Date().toISOString(),
      count: iphoneLogEntries.length,
      entries: iphoneLogEntries.slice(),
    };
    const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    iphoneLogDownloadJson(`iphone-log-${stamp}.json`, payload);
    showToast(`已导出 ${iphoneLogEntries.length} 条日志（JSON）`);
  });

  // 完整请求体单独导出（与 SoulLink 的分立设计一致）：对话接口的请求/响应体
  // 不截断地留在 fullBodies 环形缓冲里，排查提示词时导出最近几份即可。
  const fullBodyBtn = make('button', 'iphone-log__tool', '请求体');
  fullBodyBtn.type = 'button';
  fullBodyBtn.title = `导出最近 ${IPHONE_LOG_FULL_BODY_EXPORT_COUNT} 份对话接口的完整请求/响应体（发一次消息后自动捕获，不脱敏截断，供排查提示词）`;
  fullBodyBtn.addEventListener('click', () => {
    const captures = iphoneLogState.fullBodies.slice(-IPHONE_LOG_FULL_BODY_EXPORT_COUNT);
    if (captures.length === 0) {
      showToast('暂无完整请求体（触发一次对话请求后自动捕获）', true);
      return;
    }
    const payload = {
      app: IPHONE_MODULE_DISPLAY_NAME,
      version: IPHONE_MODULE_VERSION,
      exportedAt: new Date().toISOString(),
      count: captures.length,
      captures,
    };
    const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    iphoneLogDownloadJson(`iphone-fullbody-${stamp}.json`, payload);
    showToast(`已导出最近 ${captures.length} 份完整请求体（JSON）`);
  });

  const clearBtn = make('button', 'iphone-log__tool iphone-log__tool--danger', '清空');
  clearBtn.type = 'button';
  clearBtn.addEventListener('click', () => {
    iphoneLogClear();
    showToast('日志已清空');
  });

  tools.append(pauseBtn, noiseBtn, copyBtn, exportBtn, fullBodyBtn, clearBtn);
  header.append(tools, toast);
  screen.appendChild(header);

  // 列表
  const list = make('div', 'iphone-log__list');
  list.addEventListener('scroll', () => iphoneLogUpdateBack());
  screen.appendChild(list);

  const back = make('button', 'iphone-log__back', '↓ 回到最新');
  back.type = 'button';
  back.hidden = true;
  back.addEventListener('click', () => {
    view.follow = true;
    iphoneLogScrollBottom(list);
    iphoneLogUpdateBack();
  });
  screen.appendChild(back);

  // 底栏：内存容量选择
  const footer = make('footer', 'iphone-log__footer');
  footer.appendChild(make('span', 'iphone-log__footer-label', '内存保留'));
  const maxSelect = make('select', 'iphone-log__max');
  for (const option of [500, 1000, 2000, 5000, 10000, 20000]) {
    const node = make('option', '', `${option} 条`);
    node.value = String(option);
    maxSelect.appendChild(node);
  }
  if (![...maxSelect.options].some((node) => node.value === String(iphoneLogMaxEntries))) {
    const custom = make('option', '', `${iphoneLogMaxEntries} 条`);
    custom.value = String(iphoneLogMaxEntries);
    maxSelect.appendChild(custom);
  }
  maxSelect.value = String(iphoneLogMaxEntries);
  maxSelect.addEventListener('change', () => {
    iphoneLogMaxEntries = iphoneLogClampInt(maxSelect.value, 100, 20000, IPHONE_LOG_MAX_ENTRIES_DEFAULT);
    if (iphoneLogEntries.length > iphoneLogMaxEntries) {
      iphoneLogEntries.splice(0, iphoneLogEntries.length - iphoneLogMaxEntries);
    }
    iphoneLogSavePrefs({ logMaxEntries: iphoneLogMaxEntries });
    iphoneLogRenderList();
    iphoneLogUpdateStats();
  });
  footer.appendChild(maxSelect);
  footer.appendChild(make('span', 'iphone-log__footer-hint', '捕获运行中 · 详细内容点行展开'));
  screen.appendChild(footer);

  const view = { root: screen, list, status, back, follow: true };
  iphoneLogViewRef = view;
  list.addEventListener('scroll', () => {
    // 用户向上翻历史时停止自动跟随；拉回底部恢复
    view.follow = iphoneLogAtBottom(list);
  }, { passive: true });
  // 首屏渲染：此刻 screen 还没挂进 DOM（openIphoneApp 在本函数返回后才
  // appendChild），isConnected 守卫会拦下同步渲染，故用 force 强制渲染一次；
  // 不用 rAF 延后——后台标签里 rAF 可能被无限节流，首屏会一直空着。
  iphoneLogRenderList(true);
  iphoneLogUpdateStats(true);
  return screen;
}

// ---------- 对外 API ----------
function iphoneExposeLogApi() {
  // 每次脚本（重新）执行都整体重建 API，保证热重载后仍指向当前实例的缓冲。
  globalThis.iPhoneLogs = {
    debug: (...args) => iphonePushLogEntry('debug', 'external', args),
    info: (...args) => iphonePushLogEntry('info', 'external', args),
    warn: (...args) => iphonePushLogEntry('warn', 'external', args),
    error: (...args) => iphonePushLogEntry('error', 'external', args),
    log: (...args) => iphonePushLogEntry('info', 'external', args),
    clear: () => iphoneLogClear(),
    getEntries: () => iphoneLogEntries.slice(),
    setMaxEntries: (count) => {
      iphoneLogMaxEntries = iphoneLogClampInt(count, 100, 20000, IPHONE_LOG_MAX_ENTRIES_DEFAULT);
      if (iphoneLogEntries.length > iphoneLogMaxEntries) {
        iphoneLogEntries.splice(0, iphoneLogEntries.length - iphoneLogMaxEntries);
      }
      iphoneLogSavePrefs({ logMaxEntries: iphoneLogMaxEntries });
      iphoneLogRenderList();
      iphoneLogUpdateStats();
    },
  };
}

// ---------- 启动捕获（热重载安全） ----------
try {
  iphoneInitLogCapture();
  iphoneExposeLogApi();
  iphoneInitNetworkCapture();
  iphoneInitHostEventLogging();
} catch (error) {
  try {
    globalThis.console?.error?.('[iPhone] 日志系统启动失败', error);
  } catch {}
}
