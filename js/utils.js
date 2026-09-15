// ===== iPhone（悬浮球手机）通用工具：日志 / 数值 =====
// 轻量控制台日志：统一前缀，便于在宿主控制台里过滤本插件输出。
// 同时写入日志系统（js/logs.js 的环形缓冲，source=iphone，「日志」应用可见）；
// 控制台输出走 iphoneConsoleWrite（绕过捕获包装，避免同一条重复入账）。
function iphoneLog(level, ...args) {
  iphoneConsoleWrite(level, args);
  try {
    iphonePushLogEntry(level === 'log' ? 'info' : level, 'iphone', args);
  } catch {}
}

function iphoneClamp(value, min, max) {
  return Math.max(min, Math.min(value, max));
}

// 把字符串样式数值解析为有限数字（localStorage 位置恢复用），失败返回 null。
function iphoneParseNumber(value) {
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}

// 读取设备电量：Battery Status API 可用时返回真实电量并挂上变化回调，
// 否则返回演示兜底值。返回 { level: 0~1, watch(cb) }。
function iphoneGetBattery() {
  let currentLevel = IPHONE_BATTERY_FALLBACK_LEVEL;
  const listeners = new Set();
  const notify = () => listeners.forEach((cb) => { try { cb(currentLevel); } catch {} });
  try {
    const nav = globalThis.navigator;
    if (nav && typeof nav.getBattery === 'function') {
      nav.getBattery().then((battery) => {
        const sync = () => {
          currentLevel = Number(battery.level) || currentLevel;
          notify();
        };
        sync();
        battery.addEventListener?.('levelchange', sync);
      }).catch(() => {});
    }
  } catch {}
  return {
    get level() { return currentLevel; },
    watch(cb) { listeners.add(cb); },
  };
}
