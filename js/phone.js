// ===== iPhone（悬浮球手机）手机界面：外壳 / 状态栏 / 主屏 / 应用切换 =====
// 结构：overlay（全屏遮罩，点击空白关闭）> stage（按窗口缩放的定位盒）>
// device（边框壳体）> screen（393×852 设计稿屏幕）> 壁纸 / 主屏 / 应用层 / 状态栏。
// 内部所有尺寸都是设计稿像素，整体缩放由 fitStage 计算，保证任意窗口下不走样。

let iphoneScale = 1;
let iphoneAppOpen = false;
let iphoneAnimating = false;
// 当前打开的应用对象（v0.15.0）：切换聊天文件时若手机开着且停在某个应用里，
// 用它整体重建该应用界面（数据随聊天走，旧聊天的内容不能残留）。
let iphoneActiveApp = null;
const iphoneBattery = { level: IPHONE_BATTERY_FALLBACK_LEVEL, source: null };

// 动画收尾只允许执行一次：finish 事件与超时兜底可能都会触发。
function iphoneOnce(fn) {
  let called = false;
  return () => {
    if (called) return;
    called = true;
    fn();
  };
}

// rAF/定时器被节流（窗口失焦、后台标签）时 finish 事件可能长时间不派发，
// 动画锁若只依赖事件会永久卡死：每个动画都挂一个超时兜底，到点强制 cancel
// （回退到 style 上的终态）并解锁；事件先到时 once 包装保证不重复执行。
function iphoneArmAnimationFallback(animation, release, durationMs) {
  if (animation) {
    animation.addEventListener('finish', release);
    setTimeout(() => {
      try { animation.cancel(); } catch {}
      release();
    }, durationMs + 120);
  } else {
    release();
  }
}

function getIphoneOverlay() { return document.getElementById(IPHONE_OVERLAY_ID); }
function getIphoneScreen() { return document.getElementById(IPHONE_SCREEN_ID); }
function getIphoneStage() { return document.getElementById(IPHONE_STAGE_ID); }
function getIphoneAppLayer() { return document.getElementById(IPHONE_APP_LAYER_ID); }
function getIphoneHome() { return document.getElementById(IPHONE_HOME_ID); }

// ---------- 装配 ----------
function createIphoneUi() {
  if (getIphoneOverlay()) return getIphoneOverlay();
  const overlay = document.createElement('div');
  overlay.id = IPHONE_OVERLAY_ID;
  overlay.className = 'iphone-overlay';
  overlay.setAttribute('aria-hidden', 'true');
  overlay.innerHTML = `
    <div id="${IPHONE_STAGE_ID}" class="iphone-stage">
      <div id="${IPHONE_DEVICE_ID}" class="iphone-device">
        <div id="${IPHONE_SCREEN_ID}" class="iphone-screen">
          <div id="${IPHONE_WALLPAPER_ID}" class="iphone-wallpaper" aria-hidden="true"></div>
          <div id="${IPHONE_HOME_ID}" class="iphone-home">
            <div id="${IPHONE_GRID_ID}" class="iphone-app-grid"></div>
            <div id="${IPHONE_PAGE_DOTS_ID}" class="iphone-page-dots"></div>
            <div id="${IPHONE_DOCK_ID}" class="iphone-dock"></div>
          </div>
          <div id="${IPHONE_APP_LAYER_ID}" class="iphone-app-layer" aria-hidden="true"></div>
          <div id="${IPHONE_ISLAND_ID}" class="iphone-island" aria-hidden="true"><span class="iphone-island__camera"></span></div>
          <div class="iphone-statusbar">
            <span id="${IPHONE_CLOCK_ID}" class="iphone-statusbar__time">9:41</span>
            <span class="iphone-statusbar__right" aria-hidden="true">
              <svg class="iphone-statusbar__signal" viewBox="0 0 18 12"><rect x="0" y="7.5" width="3" height="4.5" rx="1" fill="currentColor"/><rect x="5" y="5.5" width="3" height="6.5" rx="1" fill="currentColor"/><rect x="10" y="3" width="3" height="9" rx="1" fill="currentColor"/><rect x="15" y="0.5" width="3" height="11.5" rx="1" fill="currentColor"/></svg>
              <svg class="iphone-statusbar__wifi" viewBox="0 0 16 12"><path fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" d="M1.6 4.4C4.9 1.4 11.1 1.4 14.4 4.4"/><path fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" d="M3.9 7.2c2.3-2 6-2 8.2 0"/><circle cx="8" cy="10.2" r="1.5" fill="currentColor"/></svg>
              <span class="iphone-statusbar__battery">
                <svg viewBox="0 0 28 13"><rect x="0.75" y="0.75" width="23.5" height="11.5" rx="3.5" fill="none" stroke="currentColor" stroke-opacity="0.4" stroke-width="1.2"/><path d="M26 4.5v4a2.2 2.2 0 0 0 0-4z" fill="currentColor" fill-opacity="0.4"/><rect id="${IPHONE_BATTERY_FILL_ID}" x="2.6" y="2.6" width="19.8" height="7.8" rx="2" fill="currentColor"/></svg>
                <i id="${IPHONE_BATTERY_TEXT_ID}">88</i>
              </span>
            </span>
          </div>
          <div id="${IPHONE_HOME_INDICATOR_ID}" class="iphone-home-indicator" title="上滑或点击：返回主屏 / 收起手机"></div>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  renderIphoneGrid();
  renderIphonePageDots();
  initIphoneClock();
  initIphoneBattery();
  initIphoneGestures(overlay);
  return overlay;
}

// 主屏图标网格：当前只有一页，后续应用多了再分页。
function renderIphoneGrid() {
  const grid = document.getElementById(IPHONE_GRID_ID);
  if (!grid) return;
  grid.innerHTML = '';
  for (const app of IPHONE_APPS) {
    const cell = buildIphoneAppIcon(app);
    cell.addEventListener('click', () => openIphoneApp(app, cell));
    grid.appendChild(cell);
  }
}

function renderIphonePageDots() {
  const dots = document.getElementById(IPHONE_PAGE_DOTS_ID);
  if (!dots) return;
  dots.innerHTML = '<span class="iphone-page-dot is-current"></span>';
}

// ---------- 状态栏：时钟 / 电量 ----------
function updateIphoneClock() {
  const clock = document.getElementById(IPHONE_CLOCK_ID);
  if (!clock) return;
  const now = new Date();
  const minutes = String(now.getMinutes()).padStart(2, '0');
  // 24 小时制、小时不补零：与 iOS 中文地区的状态栏观感一致。
  clock.textContent = `${now.getHours()}:${minutes}`;
}

function initIphoneClock() {
  updateIphoneClock();
  if (globalThis[IPHONE_CLOCK_TIMER_KEY]) return;
  globalThis[IPHONE_CLOCK_TIMER_KEY] = setInterval(updateIphoneClock, IPHONE_CLOCK_TICK_MS);
}

function applyIphoneBatteryLevel() {
  const fill = document.getElementById(IPHONE_BATTERY_FILL_ID);
  const text = document.getElementById(IPHONE_BATTERY_TEXT_ID);
  if (!fill) return;
  const percent = Math.round(iphoneBattery.level * 100);
  // 内部填充宽度按 20px 满格换算（SVG 内坐标），左右各留 1.8px 边距。
  fill.setAttribute('width', String(iphoneClamp(19.8 * iphoneBattery.level, 1.6, 19.8)));
  if (text) text.textContent = String(percent);
  fill.style.color = '';
  if (percent <= 20) fill.setAttribute('fill', '#ff453a');
  else fill.setAttribute('fill', 'currentColor');
}

function initIphoneBattery() {
  iphoneBattery.source = iphoneGetBattery();
  iphoneBattery.level = iphoneBattery.source.level;
  applyIphoneBatteryLevel();
  iphoneBattery.source.watch((level) => {
    iphoneBattery.level = level;
    applyIphoneBatteryLevel();
  });
}

// ---------- 缩放适配 ----------
// stage 是 flex 居中的定位盒，尺寸 = 设计稿外框 × scale；device 以左上角为原点
// 缩放，避免 transform scale 后布局盒仍占原尺寸导致溢出。
function fitIphoneStage() {
  const stage = getIphoneStage();
  if (!stage) return;
  const outerW = IPHONE_DESIGN_W + IPHONE_FRAME_PADDING * 2;
  const outerH = IPHONE_DESIGN_H + IPHONE_FRAME_PADDING * 2;
  const availW = window.innerWidth - IPHONE_EDGE_GAP * 2;
  const availH = window.innerHeight - IPHONE_EDGE_GAP * 2;
  const scale = Math.min(availW / outerW, availH / outerH, IPHONE_SCALE_MAX);
  iphoneScale = scale;
  stage.style.width = `${outerW * scale}px`;
  stage.style.height = `${outerH * scale}px`;
  const device = document.getElementById(IPHONE_DEVICE_ID);
  if (device) device.style.transform = `scale(${scale})`;
}

// ---------- 打开 / 关闭整机 ----------
function isIphoneOpen() {
  const overlay = getIphoneOverlay();
  return Boolean(overlay && overlay.classList.contains('is-open'));
}

function openIphoneUi() {
  const overlay = createIphoneUi();
  if (isIphoneOpen() || iphoneAnimating) return;
  hideIphoneBall();
  fitIphoneStage();
  overlay.classList.add('is-open');
  overlay.setAttribute('aria-hidden', 'false');
  const device = document.getElementById(IPHONE_DEVICE_ID);
  iphoneAnimating = true;
  const releaseOpenUi = iphoneOnce(() => { iphoneAnimating = false; });
  const animation = device?.animate?.(
    [
      { transform: `scale(${iphoneScale * 0.72})`, opacity: 0 },
      { transform: `scale(${iphoneScale})`, opacity: 1 },
    ],
    { duration: 340, easing: 'cubic-bezier(0.32, 0.72, 0.35, 1)', fill: 'both' },
  );
  // 结束即 cancel：fill 常驻效果会压过 fitStage 写入的新缩放（resize 后失真），
  // 最终帧与 style.transform 一致，cancel 不产生跳变。
  if (animation) animation.addEventListener('finish', () => { animation.cancel(); releaseOpenUi(); });
  iphoneArmAnimationFallback(animation, releaseOpenUi, 340);
  iphoneLog('info', '手机界面已打开');
}

function closeIphoneUi() {
  const overlay = getIphoneOverlay();
  if (!overlay || !isIphoneOpen() || iphoneAnimating) return;
  if (iphoneAppOpen) {
    closeIphoneApp();
    return;
  }
  const device = document.getElementById(IPHONE_DEVICE_ID);
  iphoneAnimating = true;
  const releaseCloseUi = iphoneOnce(() => {
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
    animation?.cancel?.();
    iphoneAnimating = false;
    showIphoneBall();
    iphoneLog('info', '手机界面已收起');
  });
  const animation = device?.animate?.(
    [
      { transform: `scale(${iphoneScale})`, opacity: 1 },
      { transform: `scale(${iphoneScale * 0.78})`, opacity: 0 },
    ],
    { duration: 220, easing: 'ease-in', fill: 'both' },
  );
  iphoneArmAnimationFallback(animation, releaseCloseUi, 220);
}

// ---------- 应用打开 / 返回主屏 ----------
// iOS 式应用放大：应用层从图标位置（transform-origin）以小尺寸放大到全屏，
// 主屏同时略微缩小下压，模拟系统的层级纵深感。
function openIphoneApp(app, iconCell) {
  const appLayer = getIphoneAppLayer();
  const screen = getIphoneScreen();
  if (!appLayer || !screen || iphoneAppOpen || iphoneAnimating) return;
  appLayer.innerHTML = '';
  appLayer.appendChild(buildIphoneAppScreen(app));

  // transform-origin 需要设计稿坐标：图标中心相对屏幕左上角的距离按当前缩放还原。
  let originX = IPHONE_DESIGN_W / 2;
  let originY = IPHONE_DESIGN_H / 2;
  if (iconCell && screen) {
    const iconRect = iconCell.getBoundingClientRect();
    const screenRect = screen.getBoundingClientRect();
    originX = iphoneClamp((iconRect.left + iconRect.width / 2 - screenRect.left) / iphoneScale, 0, IPHONE_DESIGN_W);
    originY = iphoneClamp((iconRect.top + iconRect.height / 2 - screenRect.top) / iphoneScale, 0, IPHONE_DESIGN_H);
  }

  iphoneAppOpen = true;
  iphoneAnimating = true;
  iphoneActiveApp = app;
  screen.dataset.context = 'app';
  appLayer.setAttribute('aria-hidden', 'false');
  appLayer.style.transformOrigin = `${originX}px ${originY}px`;
  getIphoneHome()?.classList.add('is-under-app');
  const animation = appLayer.animate?.(
    [
      { transform: 'scale(0.12)', opacity: 0 },
      { transform: 'scale(1)', opacity: 1 },
    ],
    { duration: 320, easing: 'cubic-bezier(0.32, 0.72, 0.35, 1)', fill: 'both' },
  );
  iphoneArmAnimationFallback(animation, iphoneOnce(() => { iphoneAnimating = false; }), 320);
  iphoneLog('info', `打开应用: ${app.name}`);
}

function closeIphoneApp() {
  const appLayer = getIphoneAppLayer();
  const screen = getIphoneScreen();
  if (!appLayer || !screen || !iphoneAppOpen || iphoneAnimating) return;
  iphoneAnimating = true;
  const origin = appLayer.style.transformOrigin || '50% 50%';
  const animation = appLayer.animate?.(
    [
      { transform: 'scale(1)', opacity: 1 },
      { transform: 'scale(0.12)', opacity: 0 },
    ],
    { duration: 240, easing: 'ease-in', fill: 'both' },
  );
  const finishCloseApp = iphoneOnce(() => {
    appLayer.innerHTML = '';
    appLayer.style.transformOrigin = origin;
    appLayer.setAttribute('aria-hidden', 'true');
    screen.dataset.context = 'home';
    getIphoneHome()?.classList.remove('is-under-app');
    animation?.cancel?.();
    iphoneAppOpen = false;
    iphoneAnimating = false;
    iphoneActiveApp = null;
  });
  iphoneArmAnimationFallback(animation, finishCloseApp, 240);
}

// 切换聊天文件后重建当前打开的应用（v0.15.0）：应用界面每次都是按最新数据
// 现拼的，这里整体重铺应用层即可让界面回到新聊天的数据上。动画进行中或
// 没有打开应用时不动，避免打断开合动画。
function iphoneRebuildActiveApp() {
  const appLayer = getIphoneAppLayer();
  if (!appLayer || !iphoneAppOpen || iphoneAnimating || !iphoneActiveApp) return;
  appLayer.innerHTML = '';
  appLayer.appendChild(buildIphoneAppScreen(iphoneActiveApp));
  iphoneLog('info', `聊天已切换，重建应用: ${iphoneActiveApp.name}`);
}

// ---------- 手势 ----------
// 交互入口统一收口：应用内 Home 条 → 返回主屏；主屏 Home 条 / 遮罩空白 / Esc → 收起整机。
// Home 条支持点击与上滑两种触发，上滑阈值参照 iOS 手势的行进距离判定。
function initIphoneGestures(overlay) {
  overlay.addEventListener('click', (event) => {
    // 只响应点在遮罩空白处（stage 之外）的点击：点手机本体不冒泡关闭。
    if (event.target === overlay) closeIphoneUi();
  });

  const indicator = document.getElementById(IPHONE_HOME_INDICATOR_ID);
  if (!indicator) return;
  let gestureActive = false;
  let startY = 0;
  let triggered = false;

  const handleHomeAction = () => {
    if (iphoneAppOpen) closeIphoneApp();
    else closeIphoneUi();
  };

  indicator.addEventListener('pointerdown', (event) => {
    if (event.button !== 0) return;
    gestureActive = true;
    triggered = false;
    startY = event.clientY;
    event.preventDefault();
  });
  window.addEventListener('pointermove', (event) => {
    if (!gestureActive || triggered) return;
    // 上滑超过 36px 判定为手势返回（鼠标场景是拖拽，触屏即真实上滑）。
    if (startY - event.clientY >= 36) {
      triggered = true;
      handleHomeAction();
    }
  });
  window.addEventListener('pointerup', () => {
    if (!gestureActive) return;
    gestureActive = false;
    if (!triggered) handleHomeAction();
  });

  if (!globalThis[IPHONE_ESC_KEY_HANDLER_KEY]) {
    globalThis[IPHONE_ESC_KEY_HANDLER_KEY] = (event) => {
      if (event.key !== 'Escape' || !isIphoneOpen()) return;
      if (iphoneAppOpen) closeIphoneApp();
      else closeIphoneUi();
    };
    document.addEventListener('keydown', globalThis[IPHONE_ESC_KEY_HANDLER_KEY]);
  }

  window.addEventListener('resize', () => {
    if (!isIphoneOpen()) return;
    fitIphoneStage();
  });
}
