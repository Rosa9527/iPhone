// ===== iPhone（悬浮球手机）入口：启动装配 =====
// 纯 UI 插件：不依赖宿主上下文（无需 API / 设置），只要 document.body 就绪即可装配。
// 仍按万华镜的方式留出重试与防重入，保证宿主加载时序不定时也能稳定出现悬浮球。

function bootstrapIphone() {
  if (globalThis[IPHONE_BOOTSTRAP_RUNTIME_KEY]) return;
  if (!document.body) return;
  globalThis[IPHONE_BOOTSTRAP_RUNTIME_KEY] = true;
  try {
    createIphoneBall();
    createIphoneUi();
    iphoneLog('info', `扩展就绪 v${IPHONE_MODULE_VERSION}：点击悬浮球打开手机`);
  } catch (error) {
    globalThis[IPHONE_BOOTSTRAP_RUNTIME_KEY] = false;
    throw error;
  }
}

// 宿主脚本加载时机不确定（body 未就绪 / 宿主尚未挂载），轮询重试兜底。
function scheduleIphoneBootstrap(retries = IPHONE_BOOTSTRAP_RETRY_COUNT) {
  const attempt = () => {
    try {
      bootstrapIphone();
    } catch (error) {
      iphoneLog('error', 'bootstrap failed', error);
    }
    if (!globalThis[IPHONE_BOOTSTRAP_RUNTIME_KEY] && retries > 0) {
      retries -= 1;
      setTimeout(attempt, 500);
    }
  };
  attempt();
}

// v0.15.0：剧情数据全部绑定聊天文件后，切换聊天（含开新对话）要重建已打开的
// 应用界面。宿主事件源可能晚于装配就绪，按 Kaleidoscope 的做法订阅 CHAT_CHANGED，
// 订不上就短暂重试（挂上后手机若开着会整体重铺当前应用）。
function iphoneEnsureChatChangedSubscription(retries = 10) {
  const ctx = iphoneGetContextSafe();
  if (iphoneOnHostEvent(ctx, 'CHAT_CHANGED', iphoneRebuildActiveApp, 'chat_changed')) {
    iphoneLog('info', '已订阅聊天切换事件（应用界面随聊天文件重建）');
    return;
  }
  if (retries > 0) setTimeout(() => iphoneEnsureChatChangedSubscription(retries - 1), 1000);
  else iphoneLog('warn', '未能订阅聊天切换事件：切聊天后需手动重开应用刷新界面');
}
scheduleIphoneBootstrap();
setTimeout(() => iphoneEnsureChatChangedSubscription(), 600);
