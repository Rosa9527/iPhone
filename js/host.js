// ===== iPhone（悬浮球手机）宿主适配层：上下文 / 设置持久化 / API 连接 =====
// 设计参考同目录 Kaleidoscope 的 host.js + utils.js：
// - 上下文：globalThis.Luker / SillyTavern 的 getContext()，取不到不阻塞装配（纯 UI 兜底）；
// - 设置：优先挂宿主 extensionSettings.IPhone（随宿主配置持久化）；上下文不可用或
//   冻结不可扩展时回退 localStorage（本地 test.html 预览即走这条路）；
// - API：OpenAI 兼容 /models。跨域直连可能被 CORS 拦截，先走宿主代理
//   /api/backends/chat-completions/status，失败再回退直连。

function iphoneGetContextSafe() {
  try {
    return globalThis.Luker?.getContext?.() || globalThis.SillyTavern?.getContext?.() || null;
  } catch (error) {
    iphoneLog('warn', 'unable to read host context', error);
    return null;
  }
}

// ---------- 宿主事件 ----------
// 订阅宿主事件总线（与 Kaleidoscope 同款 globalThis 钩子键：重复订阅先解绑旧的，
// 不会叠加）。返回 false = 宿主没就绪 / 不支持，调用方可稍后重试。
function iphoneOnHostEvent(ctx, eventName, handler, ownerKey) {
  try {
    const source = ctx?.eventSource || globalThis.eventSource;
    const types = ctx?.event_types || globalThis.event_types;
    const type = types ? types[eventName] : null;
    if (!source || !type || typeof source.on !== 'function' || typeof source.removeListener !== 'function') return false;
    const key = `__iphone_evt_${ownerKey}__`;
    if (globalThis[key]) source.removeListener(type, globalThis[key]);
    const wrapped = (...args) => {
      try {
        handler(...args);
      } catch (error) {
        iphoneLog('warn', `处理宿主事件 ${eventName} 失败`, error);
      }
    };
    globalThis[key] = wrapped;
    source.on(type, wrapped);
    return true;
  } catch (error) {
    iphoneLog('warn', `订阅宿主事件 ${eventName} 失败`, error);
    return false;
  }
}

// ---------- 设置读写 ----------
let iphoneSettingsFallback = null;
let iphoneSettingsUseFallback = false;

function iphoneApplyDefaultSettings(settings) {
  let changed = false;
  for (const [key, value] of Object.entries(IPHONE_DEFAULT_SETTINGS)) {
    if (settings[key] === undefined) {
      // 对象默认值必须深拷贝：直接引用会把冻结的 DEFAULT 塞进设置里，后续改不动。
      settings[key] = Array.isArray(value)
        ? []
        : (value && typeof value === 'object' ? JSON.parse(JSON.stringify(value)) : value);
      changed = true;
    }
  }
  if (!Array.isArray(settings.modelOptions)) {
    settings.modelOptions = [];
    changed = true;
  }
  return changed;
}

function iphoneReadFallbackSettings() {
  try {
    const raw = globalThis.localStorage?.getItem(IPHONE_SETTINGS_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) return parsed;
  } catch (error) {
    iphoneLog('warn', '读取本地设置失败', error);
  }
  return {};
}

function iphoneWriteFallbackSettings(settings) {
  try {
    globalThis.localStorage?.setItem(IPHONE_SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    iphoneLog('warn', '写入本地设置失败', error);
  }
}

// 取设置对象（引用语义：直接改字段后调 iphoneSaveSettings() 持久化）。
function iphoneGetSettings() {
  if (!iphoneSettingsUseFallback) {
    const ctx = iphoneGetContextSafe();
    try {
      if (ctx && typeof ctx === 'object') {
        if (!ctx.extensionSettings || typeof ctx.extensionSettings !== 'object') {
          ctx.extensionSettings = {};
        }
        // 某些宿主（TauriTavern 2.x）的 context 可能冻结不可扩展，赋值会抛错，
        // 与 Kaleidoscope 一致地回退（这里回退到 localStorage，比 WeakMap 多一层持久化）。
        const root = ctx.extensionSettings;
        if (!root[IPHONE_MODULE_NAME] || typeof root[IPHONE_MODULE_NAME] !== 'object') {
          root[IPHONE_MODULE_NAME] = {};
        }
        const settings = root[IPHONE_MODULE_NAME];
        if (iphoneApplyDefaultSettings(settings)) iphoneSaveSettings(settings);
        return settings;
      }
    } catch (error) {
      iphoneLog('warn', '宿主设置不可用，回退 localStorage', error);
    }
    iphoneSettingsUseFallback = true;
  }
  if (!iphoneSettingsFallback) iphoneSettingsFallback = iphoneReadFallbackSettings();
  iphoneApplyDefaultSettings(iphoneSettingsFallback);
  return iphoneSettingsFallback;
}

function iphoneSaveSettings(settings) {
  if (iphoneSettingsUseFallback) {
    iphoneWriteFallbackSettings(settings || iphoneSettingsFallback || {});
    return;
  }
  try {
    const ctx = iphoneGetContextSafe();
    const save = ctx?.saveSettingsDebounced || ctx?.saveSettings;
    if (typeof save === 'function') {
      const result = save.call(ctx);
      if (result && typeof result.catch === 'function') result.catch(() => {});
    }
  } catch (error) {
    iphoneLog('warn', '保存宿主设置失败', error);
  }
}

// 「连接」成功后立即落盘（防抖版在窗口突然关闭时可能丢最后一次状态）。
function iphoneSaveSettingsNow(settings) {
  if (iphoneSettingsUseFallback) {
    iphoneWriteFallbackSettings(settings || iphoneSettingsFallback || {});
    return;
  }
  try {
    const ctx = iphoneGetContextSafe();
    const save = ctx?.saveSettings || ctx?.saveSettingsDebounced;
    if (typeof save === 'function') {
      const result = save.call(ctx);
      if (result && typeof result.catch === 'function') result.catch(() => {});
    }
  } catch (error) {
    iphoneLog('warn', '保存宿主设置失败', error);
  }
}

// ---------- 聊天文件绑定（v0.15.0，方式同 Kaleidoscope 的 kaleidoscope_values） ----------
// 手机上的剧情数据（联系人 / 群聊 / 聊天记录 / QQ空间动态 / 我的资料）存
// chatMetadata.IPhone = { qqData, qqProfile }，随聊天文件（jsonl 首行 chat_metadata）
// 保存 / 加载：换聊天自动携带，开启新对话就是一台空手机。API 连接 / 提示词预设 /
// 日志设置等纯配置仍在 extensionSettings（跨聊天共享）。
// 无宿主上下文（本地裸预览）时把 localStorage 的 IPHONE_CHAT_FALLBACK_STORAGE_KEY
// 当作「当前聊天」回退存储，保持预览可用。
let iphoneChatFallback = null;

function iphoneReadChatFallback() {
  try {
    const raw = globalThis.localStorage?.getItem(IPHONE_CHAT_FALLBACK_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) return parsed;
  } catch (error) {
    iphoneLog('warn', '读取本地聊天数据失败', error);
  }
  return {};
}

function iphoneWriteChatFallback(state) {
  try {
    globalThis.localStorage?.setItem(IPHONE_CHAT_FALLBACK_STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    iphoneLog('warn', '写入本地聊天数据失败', error);
  }
}

// 取当前聊天的 chatMetadata；没有（宿主没挂 / 字段缺失）时按 create 决定是否在
// ctx 上补一个空对象。取不到返回 null（调用方走回退存储）。
function iphoneGetChatMetadata(create) {
  const ctx = iphoneGetContextSafe();
  if (!ctx || typeof ctx !== 'object') return null;
  if (!ctx.chatMetadata || typeof ctx.chatMetadata !== 'object') {
    if (!create) return null;
    try {
      ctx.chatMetadata = {};
    } catch (error) {
      iphoneLog('warn', '聊天元数据不可写', error);
      return null;
    }
  }
  return ctx.chatMetadata;
}

// 保存聊天文件：写完 chatMetadata 后调宿主保存接口（与 Kaleidoscope 相同的回退
// 链：saveChat → saveChatConditional → saveMetadata → saveMetadataDebounced）。
function iphonePersistChatMetadata() {
  const call = (fn, thisArg) => {
    try {
      const result = fn.call(thisArg);
      if (result && typeof result.catch === 'function') result.catch(() => {});
      return true;
    } catch (error) {
      return false;
    }
  };
  try {
    const ctx = iphoneGetContextSafe();
    if (ctx && typeof ctx.saveChat === 'function' && call(ctx.saveChat, ctx)) return;
    if (typeof globalThis.saveChatConditional === 'function' && call(globalThis.saveChatConditional)) return;
    if (typeof globalThis.saveChat === 'function' && call(globalThis.saveChat)) return;
    if (ctx && typeof ctx.saveMetadata === 'function' && call(ctx.saveMetadata, ctx)) return;
    if (typeof globalThis.saveMetadataDebounced === 'function') call(globalThis.saveMetadataDebounced);
  } catch (error) {
    iphoneLog('warn', '保存聊天文件失败', error);
  }
}

// 取当前聊天绑定的手机数据（引用语义：改完字段调 iphoneSaveQqStorage() 落盘），
// 形如 { qqData?, qqProfile? }。首次访问时做一次性迁移：把旧版本（v0.14 及之前）
// 存在 extensionSettings 里的非空数据搬进「当时打开的聊天」，并从设置里删除——
// 之后开启新聊天自然从空开始，旧聊天的数据则随各自的聊天文件恢复。
function iphoneGetQqStorage() {
  const metadata = iphoneGetChatMetadata(true);
  if (metadata) {
    let state = metadata[IPHONE_CHAT_META_KEY];
    if (!state || typeof state !== 'object' || Array.isArray(state)) {
      state = {};
      try {
        metadata[IPHONE_CHAT_META_KEY] = state;
      } catch (error) {
        iphoneLog('warn', '聊天元数据不可写，本次改动不会持久化', error);
      }
    }
    if (state.qqData === undefined || state.qqProfile === undefined) {
      const settings = iphoneGetSettings();
      const legacyData = settings.qqData;
      const legacyProfile = settings.qqProfile;
      const hasData = !!(legacyData && ((legacyData.friends?.length) || (legacyData.groups?.length) || (legacyData.dynamics?.length)));
      const hasProfile = !!(legacyProfile && (legacyProfile.name || legacyProfile.qqId || legacyProfile.avatar));
      if (hasData && state.qqData === undefined) state.qqData = legacyData;
      if (hasProfile && state.qqProfile === undefined) state.qqProfile = legacyProfile;
      if (hasData || hasProfile) {
        // 从设置里删掉旧数据：默认值补回的是空壳，不会再触发任何迁移
        delete settings.qqData;
        delete settings.qqProfile;
        iphoneSaveSettings(settings);
        iphoneLog('info', '已把旧版QQ数据迁移到当前聊天文件（新聊天将从空手机开始）');
      }
    }
    return state;
  }
  if (!iphoneChatFallback) iphoneChatFallback = iphoneReadChatFallback();
  return iphoneChatFallback;
}

// 持久化聊天绑定的手机数据（引用语义写完之后调用）。
function iphoneSaveQqStorage() {
  if (iphoneGetChatMetadata(false)) {
    iphonePersistChatMetadata();
    return;
  }
  if (iphoneChatFallback) iphoneWriteChatFallback(iphoneChatFallback);
}

// ---------- API 基础 ----------
// 归一化 Base URL：去尾部斜杠；误把完整接口路径粘进来时摘掉 /models、/chat/completions。
function iphoneGetApiBase(settings) {
  let apiBase = String(settings?.apiUrl || '').trim().replace(/\/+$/, '');
  apiBase = apiBase.replace(/\/(chat\/completions|models)$/i, '');
  return apiBase.replace(/\/+$/, '');
}

function iphoneGetAuthHeaders(settings) {
  const headers = { 'Content-Type': 'application/json' };
  const apiKey = String(settings?.apiKey || '').trim();
  if (apiKey) headers.Authorization = `Bearer ${apiKey}`;
  return headers;
}

function iphoneIsCrossOriginUrl(url) {
  try {
    if (typeof location === 'undefined' || !location?.origin) return false;
    return new URL(url, location.href).origin !== location.origin;
  } catch {
    return false;
  }
}

// 宿主代理请求头：带上 session 请求头与 CSRF Token，否则宿主代理 POST 会 403。
function iphoneGetHostProxyHeaders() {
  const headers = { 'Content-Type': 'application/json' };
  try {
    const ctx = iphoneGetContextSafe();
    const hostHeaders = ctx?.getRequestHeaders?.() || globalThis.getRequestHeaders?.() || null;
    if (hostHeaders && typeof hostHeaders === 'object') {
      Object.entries(hostHeaders).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') headers[key] = String(value);
      });
    }
  } catch {}
  try {
    const csrfToken = document?.cookie?.match(/(?:^|;\s*)csrf_token=([^;]+)/)?.[1];
    if (csrfToken && !headers['X-CSRF-Token']) headers['X-CSRF-Token'] = decodeURIComponent(csrfToken);
  } catch {}
  return headers;
}

// fetch + 超时控制：超时到点 abort，避免「连接中」状态永久卡死。
async function iphoneFetchText(url, options = {}) {
  const { timeoutMs, ...fetchOptions } = options;
  const limitMs = Number(timeoutMs) > 0 ? Number(timeoutMs) : IPHONE_MODEL_LIST_TIMEOUT_MS;
  const controller = typeof AbortController === 'function' ? new AbortController() : null;
  let timer = null;
  if (controller) {
    fetchOptions.signal = controller.signal;
    timer = setTimeout(() => {
      try { controller.abort(); } catch {}
    }, limitMs);
  }
  try {
    const response = await fetch(url, fetchOptions);
    const responseText = await response.text();
    return { response, responseText };
  } finally {
    if (timer) clearTimeout(timer);
  }
}

// 宿主代理的模型列表探测：POST /api/backends/chat-completions/status（TauriTavern）。
// custom_include_headers 的值需带引号（`Authorization: "Bearer xxx"`），参数格式参考宿主自带扩展。
function iphoneRequestHostProxyModelList(apiBase, settings) {
  const apiKey = String(settings?.apiKey || '').trim();
  return iphoneFetchText('/api/backends/chat-completions/status', {
    method: 'POST',
    headers: iphoneGetHostProxyHeaders(),
    body: JSON.stringify({
      chat_completion_source: 'custom',
      custom_url: apiBase,
      reverse_proxy: apiBase,
      proxy_password: apiKey,
      custom_include_headers: apiKey ? `Authorization: "Bearer ${apiKey}"` : '',
    }),
    cache: 'no-cache',
  });
}

// 代理返回这些状态时基本可断定代理路由不可用，回退直连再试一次。
// 501/「Unsupported method」= 静态服务器或无该路由的后端对 POST 的标准回应。
function iphoneShouldFallbackFromHostProxy(responseText, status) {
  return status === 401 || status === 403 || status === 404 || status === 405 || status === 501
    || /cannot\s+post|not\s+found|no\s+route|ENOENT|unsupported\s+method/i.test(String(responseText || ''));
}

// ---------- API 并发限制（参考 Kaleidoscope 的同名机制） ----------
// 请求前占住一个名额；并发已满时排队等待，前面的请求完成再放行。
// 一次拉取（含代理回退直连两跳）占用同一个名额，结束即释放。
const iphoneApiConcurrencyState = { running: 0, queue: [] };

function iphoneClampConcurrencyLimit(settings) {
  const num = Number(settings?.apiConcurrencyLimit);
  return Math.min(99, Math.max(1, Math.floor(Number.isFinite(num) ? num : 3)));
}

function iphoneReleaseApiConcurrencySlot() {
  iphoneApiConcurrencyState.running = Math.max(0, iphoneApiConcurrencyState.running - 1);
  const next = iphoneApiConcurrencyState.queue.shift();
  if (next) next();
}

async function iphoneAcquireApiConcurrencySlot(settings) {
  const enabled = settings?.apiConcurrencyEnabled !== false;
  const limit = iphoneClampConcurrencyLimit(settings);
  if (!enabled || iphoneApiConcurrencyState.running < limit) {
    iphoneApiConcurrencyState.running += 1;
    return;
  }
  iphoneLog('debug', 'API 并发已满，请求排队等待', `上限 ${limit} · 队列 ${iphoneApiConcurrencyState.queue.length}`);
  await new Promise((resolve) => iphoneApiConcurrencyState.queue.push(resolve));
  iphoneApiConcurrencyState.running += 1;
}

// 拉取 OpenAI 兼容 /models 列表；跨域先走宿主代理，失败自动回退直连。
// 兼容三种响应形状：{data:[…]} / {models:[…]} / 裸数组，并解包 TauriTavern 代理的
// { response: "…json…" } 信封。
async function iphoneFetchModelList(settings) {
  const apiBase = iphoneGetApiBase(settings);
  if (!apiBase) throw new Error('请先填写 API Base URL');
  const url = `${apiBase}/models`;
  const useHostProxy = iphoneIsCrossOriginUrl(url);
  let response = null;
  let responseText = '';
  let transport = useHostProxy ? 'host-proxy' : 'direct';
  await iphoneAcquireApiConcurrencySlot(settings);
  try {
    try {
      if (useHostProxy) {
        let proxyError = null;
        try {
          ({ response, responseText } = await iphoneRequestHostProxyModelList(apiBase, settings));
        } catch (error) {
          proxyError = error;
          iphoneLog('warn', '宿主代理拉取模型列表失败，尝试直连', error);
        }
        if (proxyError || (!response?.ok && iphoneShouldFallbackFromHostProxy(responseText, response?.status))) {
          transport = 'direct-after-proxy-fallback';
          ({ response, responseText } = await iphoneFetchText(url, {
            method: 'GET',
            headers: iphoneGetAuthHeaders(settings),
          }));
        }
      } else {
        ({ response, responseText } = await iphoneFetchText(url, {
          method: 'GET',
          headers: iphoneGetAuthHeaders(settings),
        }));
      }
    } catch (error) {
      throw new Error(`模型列表连接失败（${transport}）。请检查 Base URL / API Key，也可手动填写模型名称。原始错误: ${String(error?.message || error)}`);
    }
    if (!response?.ok) {
      throw new Error(`模型列表请求失败 ${response?.status}（${transport}）: ${String(responseText || '').slice(0, 240)}。如果此 API 不支持 /models，可手动填写模型名称。`);
    }
    let data;
    try {
      data = JSON.parse(responseText);
    } catch {
      throw new Error(`模型列表响应不是 JSON（${transport}）: ${String(responseText || '').slice(0, 180)}`);
    }
    if (data && typeof data === 'object' && data.data == null && data.models == null && data.response) {
      try {
        const nested = typeof data.response === 'string' ? JSON.parse(data.response) : data.response;
        if (nested && typeof nested === 'object') data = nested;
      } catch {}
    }
    const modelItems = Array.isArray(data?.data)
      ? data.data
      : (Array.isArray(data?.models) ? data.models : (Array.isArray(data) ? data : []));
    const models = modelItems
      .map((item) => (typeof item === 'string'
        ? item.trim()
        : String(item?.id || item?.name || item?.model || '').trim()))
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b));
    if (models.length === 0) throw new Error('API 有响应，但没有返回可用模型；可手动填写模型名称。');
    iphoneLog('info', `模型列表拉取成功（${transport}）: ${models.length} 个模型`);
    return models;
  } finally {
    iphoneReleaseApiConcurrencySlot();
  }
}

// ---------- 对话请求（OpenAI 兼容 /chat/completions；QQ 好友聊天页发消息用） ----------
// 跨域先走宿主代理 /api/backends/chat-completions/generate（请求体与 /status 不同，
// 参考 Kaleidoscope：custom_include_headers 的值需带引号），代理失败或返回无可用
// 内容时回退直连再试一次。
function iphoneBuildHostProxyChatBody(apiBase, settings, body) {
  const apiKey = String(settings?.apiKey || '').trim();
  return {
    chat_completion_source: 'custom',
    custom_url: apiBase,
    custom_include_headers: apiKey ? `Authorization: "Bearer ${apiKey}"` : '',
    ...body,
  };
}

// TauriTavern 代理在后端请求失败时，会把错误文本包装成 chat.completion 形状的响应
//（content 以 [API 错误] / [后端错误] 开头，或直接是 "Network request failed."），
// 这类内容不是模型回复：代理阶段遇到就回退直连，最终结果遇到就报错。
function iphoneIsHostErrorContent(content) {
  const text = String(content || '').trim();
  return /^\[[^\]]*错误\]/.test(text)
    || /^(?:网络请求失败|Network request failed)/i.test(text);
}

// 从各形状的响应里取回复文本：解包 TauriTavern 代理的 { response: "…json…" } 信封，
// 取 choices[0].message.content ?? text；思考模型偶发把答案写进 reasoning_content、
// content 留空——兜底取用，两者皆无才返回 null。
function iphoneExtractChatContent(data) {
  if (data && typeof data === 'object' && data.response != null && data.choices == null) {
    try {
      const nested = typeof data.response === 'string' ? JSON.parse(data.response) : data.response;
      if (nested && typeof nested === 'object') data = nested;
    } catch {}
  }
  const choice = data?.choices?.[0];
  const content = choice?.message?.content ?? choice?.text;
  if (typeof content === 'string' && content.trim()) return content;
  const reasoning = typeof choice?.message?.reasoning_content === 'string'
    ? choice.message.reasoning_content
    : (typeof choice?.message?.reasoning === 'string' ? choice.message.reasoning : '');
  return typeof reasoning === 'string' && reasoning.trim() ? reasoning : null;
}

// 发一轮对话：messages 为 OpenAI 格式 [{ role, content }]（是否带系统提示词由调用方
// 决定），返回模型回复文本；失败抛带可读文案的 Error。占用 API 并发名额。
async function iphoneRequestChatCompletion(settings, messages) {
  const apiBase = iphoneGetApiBase(settings);
  if (!apiBase) throw new Error('请先到「设置 · API 连接」填写服务器地址并连接。');
  const model = String(settings.model || '').trim();
  if (!model) throw new Error('请先到「设置 · API 连接」选择或填写模型。');
  const body = { model, messages, stream: false };
  const effort = String(settings.apiReasoningEffort || '').trim();
  if (effort) body.reasoning_effort = effort;
  const url = `${apiBase}/chat/completions`;
  const useHostProxy = iphoneIsCrossOriginUrl(url);
  let response = null;
  let responseText = '';
  let transport = useHostProxy ? 'host-proxy' : 'direct';
  await iphoneAcquireApiConcurrencySlot(settings);
  try {
    try {
      if (useHostProxy) {
        let proxyError = null;
        try {
          ({ response, responseText } = await iphoneFetchText('/api/backends/chat-completions/generate', {
            method: 'POST',
            headers: iphoneGetHostProxyHeaders(),
            body: JSON.stringify(iphoneBuildHostProxyChatBody(apiBase, settings, body)),
            cache: 'no-cache',
            timeoutMs: IPHONE_CHAT_TIMEOUT_MS,
          }));
        } catch (error) {
          proxyError = error;
          iphoneLog('warn', '宿主代理对话请求失败，尝试直连', error);
        }
        let proxyData = null;
        try { proxyData = JSON.parse(responseText); } catch {}
        const proxyReply = iphoneExtractChatContent(proxyData);
        const proxyUsable = !!response?.ok && proxyReply != null && !iphoneIsHostErrorContent(proxyReply);
        if (proxyError || !proxyUsable || iphoneShouldFallbackFromHostProxy(responseText, response?.status)) {
          transport = 'direct-after-proxy-fallback';
          ({ response, responseText } = await iphoneFetchText(url, {
            method: 'POST',
            headers: iphoneGetAuthHeaders(settings),
            body: JSON.stringify(body),
            timeoutMs: IPHONE_CHAT_TIMEOUT_MS,
          }));
        }
      } else {
        ({ response, responseText } = await iphoneFetchText(url, {
          method: 'POST',
          headers: iphoneGetAuthHeaders(settings),
          body: JSON.stringify(body),
          timeoutMs: IPHONE_CHAT_TIMEOUT_MS,
        }));
      }
    } catch (error) {
      throw new Error(`对话请求失败（${transport}）。请检查 API 配置。原始错误: ${String(error?.message || error)}`);
    }
    if (!response?.ok) {
      throw new Error(`对话请求失败 ${response?.status}（${transport}）: ${String(responseText || '').slice(0, 240)}`);
    }
    let data;
    try {
      data = JSON.parse(responseText);
    } catch {
      throw new Error(`对话响应不是 JSON（${transport}）: ${String(responseText || '').slice(0, 180)}`);
    }
    if (data && typeof data === 'object' && data.error) {
      const message = typeof data.error === 'string' ? data.error : (data.error.message || JSON.stringify(data.error));
      throw new Error(`上游 API 返回错误（${transport}）: ${String(message).slice(0, 240)}`);
    }
    const content = iphoneExtractChatContent(data);
    if (content == null) throw new Error(`API 没有返回可用内容（${transport}）。`);
    if (iphoneIsHostErrorContent(content)) {
      throw new Error(`上游 API 返回错误（${transport}）: ${String(content).slice(0, 240)}`);
    }
    iphoneLog('info', `对话请求成功（${transport}）`);
    return content;
  } finally {
    iphoneReleaseApiConcurrencySlot();
  }
}

// ---------- iPhone_Message 楼层（QQ 聊天记录同步到酒馆聊天） ----------
// 规则：只认「最外层完整包裹」——楼层全文（去首尾空白）以 <iPhone_Message> 开头、
// 以 </iPhone_Message> 结尾，中间全部内容都算标签内部。标签名固定（constants.js）。
// 返回标签内部文本；不是 iPhone_Message 楼层时返回 null。
function iphoneExtractMessageFloorInner(text) {
  const trimmed = String(text ?? '').trim();
  if (!trimmed.startsWith(IPHONE_FLOOR_TAG_OPEN) || !trimmed.endsWith(IPHONE_FLOOR_TAG_CLOSE)) {
    return null;
  }
  return trimmed.slice(IPHONE_FLOOR_TAG_OPEN.length, trimmed.length - IPHONE_FLOOR_TAG_CLOSE.length);
}

// 把标签内部文本包回完整楼层文本（最外层标签永远原样重建，不破坏）。
function iphoneWrapMessageFloorInner(inner) {
  return `${IPHONE_FLOOR_TAG_OPEN}\n${String(inner ?? '')}\n${IPHONE_FLOOR_TAG_CLOSE}`;
}

// 可写楼层的宿主上下文：要求 chat 是数组（TauriTavern/SillyTavern 的 getContext）。
function iphoneGetFloorChatContext() {
  const ctx = iphoneGetContextSafe();
  return ctx && Array.isArray(ctx.chat) ? ctx : null;
}

// 楼层消息形状：按 {{char}} 的普通楼层创建（is_user / is_system 均为 false，名字用
// 当前角色名）。注意：TauriTavern 的 is_system 就是「隐藏楼层」标记（眼图标隐藏
// 功能改的就是它）——is_system: true 的楼层既被界面隐藏、又被排除出 AI 上下文，
// 所以记录楼层绝不能用 is_system。
function iphoneBuildQqFloorMessage(text) {
  const ctx = iphoneGetContextSafe();
  const charName = String(ctx?.name2 || '').trim() || IPHONE_FLOOR_TAG_NAME;
  return {
    name: charName,
    is_user: false,
    is_system: false,
    send_date: new Date().toISOString(),
    mes: text,
    extra: {},
  };
}

// 持久化聊天（context.saveChat 即 saveChatConditional），等待落盘但吞掉错误。
async function iphoneSaveChatQuiet(ctx) {
  try {
    if (typeof ctx?.saveChat === 'function') await ctx.saveChat();
  } catch (error) {
    iphoneLog('warn', '保存聊天失败', error);
  }
}

// 新建一个 iPhone_Message 楼层（追加到聊天末尾并渲染 + 落盘）。
async function iphoneAppendChatFloor(ctx, text) {
  const mes = iphoneBuildQqFloorMessage(text);
  ctx.chat.push(mes);
  try {
    if (typeof ctx.addOneMessage === 'function') ctx.addOneMessage(mes);
  } catch (error) {
    iphoneLog('warn', '渲染 iPhone_Message 楼层失败', error);
  }
  await iphoneSaveChatQuiet(ctx);
  return mes;
}

// 原地更新已有 iPhone_Message 楼层的文本（不新建楼层）并落盘。
async function iphoneUpdateChatFloor(ctx, index, text) {
  const mes = ctx.chat[index];
  if (!mes) return null;
  mes.mes = text;
  try {
    if (typeof ctx.updateMessageBlock === 'function') ctx.updateMessageBlock(index, mes);
  } catch (error) {
    iphoneLog('warn', '刷新 iPhone_Message 楼层显示失败', error);
  }
  await iphoneSaveChatQuiet(ctx);
  return mes;
}

// ---------- 记录段的标签（v0.21.0；v0.23.0 起改方括号） ----------
// 段标签名 = 「应用_类型_对象名」，名字部分只允许安全字符：空白、定界符与
// 「」等统一换成下划线，首尾下划线去掉，空名回退成「未知」。
function iphoneFloorSectionTagName(value, fallback) {
  const name = String(value ?? '')
    .replace(/[\s<>/「」\[\]]+/g, '_')
    .replace(/[^\w\u4e00-\u9fff_-]+/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '');
  return name || fallback;
}

// 识别整行是否是段标签行（整行只有一对开 / 闭标签）。返回 { tag, closing } 或 null。
// 方括号是现行写法（[微信_私聊_杨知世] / [/微信_私聊_杨知世]）；尖括号是
// v0.21.0–v0.22.x 的旧写法，照常读入，重建时统一输出方括号完成迁移。
function iphoneFloorParseTagLine(line) {
  const trimmed = String(line ?? '').trim();
  let inner = null;
  let closing = false;
  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    inner = trimmed.slice(1, -1);
  } else if (trimmed.startsWith('<') && trimmed.endsWith('>')) {
    inner = trimmed.slice(1, -1);
  }
  if (inner == null) return null;
  if (inner.startsWith('/')) {
    closing = true;
    inner = inner.slice(1);
  }
  return IPHONE_FLOOR_SECTION_TAG_NAME_RE.test(inner) ? { tag: inner, closing } : null;
}

// 由段头反推该段的标签名：段头是六种固定写法之一，名字从段头里剥出。旧格式
// （裸段头、无标签）的段在同步时靠它补上标签，完成原地迁移；段头认不出来
// （不属于六种）时返回 null，该段原样保留、不包标签。
function iphoneFloorSectionTagFor(header) {
  const text = String(header ?? '').trim();
  let matched = text.match(/^与?「(.+)」的QQ聊天记录：$/);
  if (matched) return IPHONE_FLOOR_SECTION_TAG_HEADS.qqChat.replace('{name}', iphoneFloorSectionTagName(matched[1], '未知联系人'));
  matched = text.match(/^群「(.+)」的QQ群聊记录：$/);
  if (matched) return IPHONE_FLOOR_SECTION_TAG_HEADS.qqGroup.replace('{name}', iphoneFloorSectionTagName(matched[1], '未知群聊'));
  if (text === 'QQ空间动态：') return IPHONE_FLOOR_SECTION_TAG_HEADS.qqDynamics;
  matched = text.match(/^与?「(.+)」的微信聊天记录：$/);
  if (matched) return IPHONE_FLOOR_SECTION_TAG_HEADS.wechatChat.replace('{name}', iphoneFloorSectionTagName(matched[1], '未知联系人'));
  matched = text.match(/^群「(.+)」的微信群聊记录：$/);
  if (matched) return IPHONE_FLOOR_SECTION_TAG_HEADS.wechatGroup.replace('{name}', iphoneFloorSectionTagName(matched[1], '未知群聊'));
  if (text === '朋友圈动态：') return IPHONE_FLOOR_SECTION_TAG_HEADS.wechatMoments;
  return null;
}

// 楼层内部文本 → 段列表 [{ tag, header, lines }]。段由「标签行」或「段头行」开启：
//   [微信_私聊_杨知世]            ← 标签行（整行一对开 / 闭标签，闭合标签由重建补回）
//   与「杨知世」的微信聊天记录：    ← 段头行（旧格式的段靠它开段并反推标签）
//   …段内容…
// 两种开段方式混搭（半迁移状态）也能正确切分；旧尖括号段标签（v0.22.x 及以前）
// 照常识别，重建时统一输出方括号；段头不是六种固定写法时 tag 为空，该段原样
// 保留、不包标签；空行一律丢弃（重建时段间不空行，旧楼层的空行顺带收掉）。
function iphoneFloorParseInner(inner) {
  const sections = [];
  let open = false; // 当前段是否仍开着（闭合标签 / 新段开启时翻转）
  for (const raw of String(inner ?? '').split('\n')) {
    const line = raw.trimEnd();
    const trimmed = line.trim();
    if (!trimmed) continue;
    const tagLine = iphoneFloorParseTagLine(trimmed);
    if (tagLine) {
      if (tagLine.closing) {
        open = false;
      } else {
        sections.push({ tag: tagLine.tag, header: '', lines: [] });
        open = true;
      }
      continue;
    }
    if (IPHONE_FLOOR_SECTION_RE.test(trimmed)) {
      const current = sections[sections.length - 1];
      if (open && current && !current.header && !current.lines.length) {
        current.header = trimmed; // 开标签后紧跟的段头行：算作该段的段头
      } else if (current && current.header === trimmed) {
        // 同一段被重复的段头拆开（旧数据里的历史遗留）：并回上一段，重复段头丢掉
        open = true;
      } else {
        const inferred = iphoneFloorSectionTagFor(trimmed) || '';
        if (!open && inferred && current && current.tag === inferred) {
          // 半迁移遗留：同一段被标签与段头拆成两段，合并回上一段（重复段头丢掉）
          current.header = current.header || trimmed;
          open = true;
        } else {
          sections.push({ tag: inferred, header: trimmed, lines: [] });
          open = true;
        }
      }
      continue;
    }
    const current = sections[sections.length - 1];
    if (open && current) current.lines.push(line);
    else sections.push({ tag: '', header: '', lines: [line] }); // 段外散行：原样保留、不包标签
  }
  return sections;
}

// 段列表 → 楼层内部文本：有标签的段包一层方括号标签（段头在标签内首行），
// 没标签的段原样输出（段头认不出来的散段不硬塞标签），段间不空行——闭合标签
// 下一行直接就是下一段的开标签（v0.24.1 起；旧楼层里的段间空行读取时丢弃，
// 重建后自然收掉）。旧尖括号标签的段重建后换成方括号（tag 里只存名字，
// 定界符在这里统一加）。
function iphoneFloorBuildInner(sections) {
  const out = [];
  for (const section of sections) {
    const body = [
      ...(section.header ? [section.header] : []),
      ...section.lines,
    ];
    if (!section.tag) {
      if (body.length) out.push(body.join('\n'));
      continue;
    }
    out.push([`[${section.tag}]`, ...body, `[/${section.tag}]`].join('\n'));
  }
  return out.join('\n');
}

// 在段列表里找目标段：标签相同、或段头完全相同（旧格式的裸段没有标签，只能靠
// 段头认出来——认出来之后由调用方补上标签，完成原地迁移）。返回命中的最后一段
//（同一种记录的历史遗留可能有多段，末尾那段最新）。
function iphoneFloorFindSection(sections, tag, header) {
  const list = Array.isArray(sections) ? sections : [];
  for (let i = list.length - 1; i >= 0; i -= 1) {
    const s = list[i];
    if ((tag && s.tag === tag) || (header && s.header === header)) return s;
  }
  return null;
}

// 把一段记录写进段列表（聊天的追加写）：同种的旧段（标签或段头命中）先合并成
// 一段——旧行按先后顺序拼好，再追加本次的新行，整段挪到楼层末尾；这样一段记录
// 永远只有一个标签，半迁移状态下标签段与裸段头段也不会并存。返回该段。
function iphoneFloorUpsertSection(sections, tag, header, lines) {
  const merged = [];
  for (let i = sections.length - 1; i >= 0; i -= 1) {
    const s = sections[i];
    if ((tag && s.tag === tag) || (header && s.header === header)) {
      merged.unshift(...s.lines);
      sections.splice(i, 1);
    }
  }
  const section = { tag, header, lines: [...merged, ...lines] };
  sections.push(section);
  return section;
}

// 删掉目标段之外的重复段（动态整段重写前的遗留，或半迁移状态下标签段与裸段头段
// 并存），只留 keep 那一段。
function iphoneFloorDropDuplicates(sections, tag, header, keep) {
  for (let i = sections.length - 1; i >= 0; i -= 1) {
    const s = sections[i];
    if (s === keep) continue;
    if ((tag && s.tag === tag) || (header && s.header === header)) sections.splice(i, 1);
  }
}
