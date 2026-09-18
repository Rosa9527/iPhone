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
          <div id="${IPHONE_HOME_INDICATOR_ID}" class="iphone-home-indicator" aria-hidden="true"></div>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  renderIphoneGrid();
  renderIphoneDock();
  renderIphonePageDots();
  initIphoneClock();
  initIphoneBattery();
  initIphoneGestures(overlay);
  initIphoneDragScroll(overlay);
  return overlay;
}

// 主屏图标网格：注册表里 dock !== true 的应用（常用应用进停靠栏，见 renderIphoneDock）。
// 当前只有一页，后续应用多了再分页。
function renderIphoneGrid() {
  const grid = document.getElementById(IPHONE_GRID_ID);
  if (!grid) return;
  grid.innerHTML = '';
  for (const app of IPHONE_APPS) {
    if (app.dock) continue;
    const cell = buildIphoneAppIcon(app);
    cell.addEventListener('click', () => openIphoneApp(app, cell));
    grid.appendChild(cell);
  }
}

// 停靠栏（iOS 的常用应用区）：注册表里 dock === true 的应用渲染进屏幕下方的
// 毛玻璃框，图标布局与网格一致但隐藏名称（真机 Dock 只有图标），打开动画的
// transform-origin 仍按图标位置计算，两处入口共用 openIphoneApp。
function renderIphoneDock() {
  const dock = document.getElementById(IPHONE_DOCK_ID);
  if (!dock) return;
  dock.innerHTML = '';
  for (const app of IPHONE_APPS) {
    if (!app.dock) continue;
    const cell = buildIphoneAppIcon(app);
    cell.classList.add('iphone-app-cell--dock');
    cell.addEventListener('click', () => openIphoneApp(app, cell));
    dock.appendChild(cell);
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
//
// 可用空间取遮罩自身的盒子而不是 window.innerWidth / innerHeight：遮罩由 CSS 按
// 视口单位铺满（见 style.css 的 .iphone-overlay），量它才与整机实际所在的容器
// 一致——移动端地址栏收放、宿主给 body 设 fixed 等情况下 innerHeight 与遮罩
// 高度不总是相等，按 innerHeight 算会让整机比遮罩略大、上下被裁掉一截。
function fitIphoneStage() {
  const stage = getIphoneStage();
  if (!stage) return;
  const outerW = IPHONE_DESIGN_W + IPHONE_FRAME_PADDING * 2;
  const outerH = IPHONE_DESIGN_H + IPHONE_FRAME_PADDING * 2;
  // 遮罩未装配 / 尚未布局（宽高为 0）时回退到窗口尺寸。
  const box = getIphoneOverlay()?.getBoundingClientRect?.();
  const availW = (box?.width || window.innerWidth) - IPHONE_EDGE_GAP * 2;
  const availH = (box?.height || window.innerHeight) - IPHONE_EDGE_GAP * 2;
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

// ---------- 鼠标拖拽滚动 ----------
// 触摸端的上下滑动是浏览器原生的（滚动容器 + touchmove 默认行为），桌面端缺的
// 就是这一条：鼠标按住拖动在 div 上什么也不做，用户于是「长按拖动滑不动」。
// 这里给鼠标补上：按下后位移超过阈值即接管这一段拖动，按指针位移反向滚动最近的
// 可滚动祖先，松手释放。阈值以内仍算点击（短按卡片要能打开笔记），所以只在真正
// 动起来之后才吞掉随后的 click。
//
// 三种情况不接管，否则会跟别人抢手势：
// - 触摸 / 手写笔：原生滚动就够，重复处理反而打架，只认 pointerType === 'mouse'；
// - 起点在屏幕底部感应带（Home 条那一带）：真机从那儿上滑是返回主屏，
//   手势归 phone.js 的 Home 手势，鼠标不该例外；
// - 落点在自己管拖动的地方（输入框选字、`touch-action: none` 的自绘拖动区，
//   如头像裁剪舞台、悬浮球）：那些元素自带指针逻辑。
// 从落点往上找最近的可滚动祖先。搜索范围**止于屏幕**：走到机身之外就可能摸到
// 宿主页面自己的滚动容器，鼠标在手机里拖一下会把酒馆的聊天记录一起拖走。
function iphoneFindScrollable(node) {
  for (let el = node; el && el.id !== IPHONE_SCREEN_ID; el = el.parentElement) {
    const style = globalThis.getComputedStyle?.(el);
    if (!style) return null;
    if (style.overflowY !== 'auto' && style.overflowY !== 'scroll') continue;
    if (el.scrollHeight - el.clientHeight > 1) return el;
  }
  return null;
}

function initIphoneDragScroll(overlay) {
  const screen = getIphoneScreen();
  let drag = null;

  // 起点是否落在 Home 感应带里（与 Home 手势同一套换算，见 initIphoneGestures）。
  const inHomeZone = (y) => {
    if (!screen) return false;
    const rect = screen.getBoundingClientRect();
    if (!rect.height) return false;
    const zone = Math.max(IPHONE_HOME_ZONE_H * (iphoneScale || 1), IPHONE_HOME_ZONE_H_MIN);
    return rect.bottom - y <= zone;
  };

  // 自己管拖动的元素（`touch-action: none` 的自绘拖动区，如头像裁剪舞台）：
  // 往祖辈查，落点常是舞台里的图片而不是舞台本身。
  const ownsItsDrag = (node) => {
    for (let el = node; el && el !== screen; el = el.parentElement) {
      if (globalThis.getComputedStyle?.(el)?.touchAction === 'none') return true;
    }
    return false;
  };

  const onPointerDown = (event) => {
    drag = null;
    if (event.button !== 0 || event.pointerType !== 'mouse') return;
    if (!isIphoneOpen()) return;
    const target = event.target;
    if (!target || target.nodeType !== 1) return;
    // 只认屏幕内的按下：机身之外（遮罩空白）拖动不该带动任何东西。
    if (!screen?.contains?.(target)) return;
    if (target.closest?.(IPHONE_DRAG_SCROLL_SKIP_SELECTOR)) return;
    if (ownsItsDrag(target) || inHomeZone(event.clientY)) return;
    drag = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      // 按「起手点」找滚动区，而不是拖动途中的落点：从底栏 / 顶栏这种不滚动的
      // 地方起手就什么也不滚（真机同款），拖出滚动区之后也还是原来那个列表在滚。
      target,
      scroller: null,
      scrollTop: 0,
      active: false,
    };
  };

  const onPointerMove = (event) => {
    if (!drag || event.pointerId !== drag.pointerId) return;
    const dy = event.clientY - drag.startY;
    const dx = event.clientX - drag.startX;
    if (!drag.active) {
      // 竖直位移还不够（或横向更大）时不接管：留给点开卡片 / 横向滑频道条。
      if (Math.abs(dy) < IPHONE_DRAG_SCROLL_SLOP || Math.abs(dy) <= Math.abs(dx)) return;
      drag.scroller = iphoneFindScrollable(drag.target);
      if (!drag.scroller) { drag = null; return; }
      drag.active = true;
      drag.scrollTop = drag.scroller.scrollTop;
      drag.scroller.classList.add('is-drag-scrolling');
    }
    // 内容跟手：往上拖（dy < 0）看下面的内容，滚动量取反。
    const want = drag.scrollTop - dy;
    drag.scroller.scrollTop = want;
    // 撞到顶 / 底之后把基准跟着走，回拖时不用先把空走的那段补回来。
    if (drag.scroller.scrollTop !== want) drag.scrollTop = drag.scroller.scrollTop + dy;
    event.preventDefault();
  };

  const endDrag = (event) => {
    if (!drag || (event?.pointerId != null && event.pointerId !== drag.pointerId)) return;
    const wasActive = drag.active;
    drag.scroller?.classList.remove('is-drag-scrolling');
    drag = null;
    // 真正拖动过才吞掉随后的 click：阈值内的短按是点击，不能拦。
    if (wasActive) iphoneSwallowClickUntil = Date.now() + 350;
  };

  overlay.addEventListener('pointerdown', onPointerDown);
  window.addEventListener('pointermove', onPointerMove);
  window.addEventListener('pointerup', endDrag);
  window.addEventListener('pointercancel', endDrag);
  window.addEventListener('blur', () => endDrag(null));
}

// ---------- 手势 ----------
// 交互入口统一收口：应用内 Home 条 → 返回主屏；主屏 Home 条 / 遮罩空白 / Esc → 收起整机。
//
// 判定不落在 5px 高的指示条本体上——手机上那条细线的命中率太低，是「不灵敏」的
// 主因——而是屏幕底部一条全宽感应带（IPHONE_HOME_ZONE_H）：上滑在带内任意横向
// 位置都生效，点击只认中央 IPHONE_HOME_TAP_SPAN（对应指示条的视觉位置）。
//
// 三条关键约束：
// - **点击**落在页面自己的控件上时让给控件（见 isIphoneControlTarget），上滑不受
//   此限——真机上从列表 / 底栏边缘上滑同样能返回主屏。底栏按钮都在感应带之上的
//   安全区里，本就碰不到；日志页那种压进带里的下拉框靠这条让位，于是「想点控件
//   却返回主屏」不会再发生。识别分两层：语义标签（选择器）与手型光标——代码库里
//   可点击的 div 都标了 cursor: pointer（笔记卡、列表行、会话行…），单靠标签
//   选择器兜不住；光标还得沿祖先查，卡片里的标题 / 摘要子元素自身是 cursor: auto，
//   手型标在卡片上，只看落点元素会漏判。
// - 手势触发后短期吞掉紧跟的 click：返回主屏的同时，手指落点下（应用关闭动画里
//   还挂着的）底栏按钮 / 主屏图标不该被顺手点一次。
// - 触摸开始拖动时压掉原生滚动（touchmove preventDefault）。不这么做的话，列表会
//   先接住这次滑动并派发 pointercancel，手势在中途被系统收走——触屏上「滑不动」
//   的根因。被系统中断（来电、切换应用）走 pointercancel 复位，状态不会留到
//   下一次抬手造成误触发。
// 手势触发后短时间内吞掉紧跟的 click：返回主屏时手指落点下（应用关闭动画里还挂
// 着的）底栏按钮 / 主屏图标不该被顺手点一次；鼠标拖拽滚动松手时落点下的卡片
// 也不该被当成一次点击点开。两处手势共用这一个截止时刻。
let iphoneSwallowClickUntil = 0;

function isIphoneControlTarget(target) {
  if (!target || target.nodeType !== 1) return false;
  if (target.closest?.(IPHONE_HOME_SKIP_SELECTOR)) return true;
  try {
    for (let node = target; node && node.id !== IPHONE_SCREEN_ID; node = node.parentElement) {
      if (globalThis.getComputedStyle?.(node)?.cursor === 'pointer') return true;
    }
  } catch {}
  return false;
}

function initIphoneGestures(overlay) {
  overlay.addEventListener('click', (event) => {
    // 只响应点在遮罩空白处（stage 之外）的点击：点手机本体不冒泡关闭。
    if (event.target === overlay) closeIphoneUi();
  });

  const screen = getIphoneScreen();
  const indicator = document.getElementById(IPHONE_HOME_INDICATOR_ID);
  if (!screen) return;

  // 设计稿像素 → 当前屏幕像素。手机上整机会缩到七成多，纯按比例算出来的命中区
  // 会小到点不中（手指的物理尺寸不随界面缩放），所以每个阈值都有 CSS 像素下限，
  // 取两者中较大的那个；大屏上仍是等比手感。
  const designPx = (design, min) => Math.max(design * (iphoneScale || 1), min ?? 0);

  const handleHomeAction = () => {
    if (iphoneAppOpen) closeIphoneApp();
    else closeIphoneUi();
  };

  // tracking 一次只跟一条指针：第二个指头按下即取消，多指拖拽不误判。
  let tracking = null;

  const resetTracking = () => {
    tracking = null;
    indicator?.classList.remove('is-tracking');
    screen.classList.remove('is-home-tracking');
  };

  const markTracking = () => {
    indicator?.classList.add('is-tracking');
    screen.classList.add('is-home-tracking');
  };

  const onPointerDown = (event) => {
    if (event.button !== 0 || !isIphoneOpen()) return;
    if (tracking) {
      // 同一指针的旧状态可能是「在窗口外松开」留下的（收不到 pointerup）：
      // 超过 3 秒视为残留，清掉后继续处理本次按下，手势不会因此永久失效。
      if (tracking.pointerId !== event.pointerId || Date.now() - tracking.startedAt > 3000) resetTracking();
      else return;
    }
    const rect = screen.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    if (event.clientX < rect.left || event.clientX > rect.right) return;
    if (event.clientY < rect.top || event.clientY > rect.bottom) return;
    if (rect.bottom - event.clientY > designPx(IPHONE_HOME_ZONE_H, IPHONE_HOME_ZONE_H_MIN)) return;
    const centerX = rect.left + rect.width / 2;
    // 落点是不是页面自己的控件：是则这次按下**整套让给控件**——不吞它的 click、
    // 不拦它的滚动（列表从底栏按钮上起手照样能滑），点击与拖动都归控件。
    const onControl = isIphoneControlTarget(event.target);
    tracking = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startedAt: Date.now(),
      // 点击要同时满足三个条件：起点落在指示条视觉所在的中段（底栏左右两端
      // 的空白不该算返回）、不压在页面自己的控件上、抬手时是短促的轻点。
      canTap: Math.abs(event.clientX - centerX) <= designPx(IPHONE_HOME_TAP_SPAN) / 2 && !onControl,
      onControl,
      triggered: false,
    };
    markTracking();
    // 鼠标：压掉拖拽选字与图片原生拖拽（触屏的文本长按选择由 is-home-tracking
    // 的 user-select: none 兜住）。控件上的按下不压，免得连带影响它自己的交互。
    if (event.pointerType === 'mouse' && !onControl) event.preventDefault();
  };

  const onPointerMove = (event) => {
    if (!tracking || event.pointerId !== tracking.pointerId || tracking.triggered) return;
    const up = tracking.startY - event.clientY;
    const lateral = Math.abs(event.clientX - tracking.startX);
    if (up <= 0 || up <= lateral) return; // 只认竖直向上的滑动
    // 慢拖够距离，或快速轻扫（iOS 的甩动手感）都算数。
    const flick =
      up >= designPx(IPHONE_HOME_FLICK_UP, IPHONE_HOME_FLICK_UP_MIN) &&
      Date.now() - tracking.startedAt <= IPHONE_HOME_FLICK_MS;
    if (up >= designPx(IPHONE_HOME_SWIPE_UP, IPHONE_HOME_SWIPE_UP_MIN) || flick) {
      tracking.triggered = true;
      iphoneSwallowClickUntil = Date.now() + 350;
      handleHomeAction();
    }
  };

  const onPointerUp = (event) => {
    if (!tracking || event.pointerId !== tracking.pointerId) return;
    const state = tracking;
    resetTracking();
    if (state.triggered) return;
    const moved = Math.hypot(event.clientX - state.startX, event.clientY - state.startY);
    // 位移在容差内、时长够短、起点在指示条中段且没压着控件 → 算点击
    // （按住不放不触发）。
    if (state.canTap && moved <= designPx(IPHONE_HOME_TAP_SLOP, IPHONE_HOME_TAP_SLOP_MIN) && Date.now() - state.startedAt <= IPHONE_HOME_TAP_MS) {
      iphoneSwallowClickUntil = Date.now() + 350;
      handleHomeAction();
    }
  };

  const onPointerCancel = (event) => {
    if (!tracking || event.pointerId !== tracking.pointerId) return;
    resetTracking();
  };

  const onTouchMove = (event) => {
    if (!tracking || tracking.triggered) return;
    const touch = event.touches?.[0];
    if (!touch) return;
    // 一旦开始向上拖就交出滚动权（含阈值之前的那一小段），手势才不会被
    // 列表的滚动接管后 pointercancel 掉。
    if (tracking.startY - touch.clientY > 2) event.preventDefault();
  };

  // 捕获阶段吞掉手势后的那次 click：返回主屏与拖拽滚动都可能紧接着补发一次
  // click，落点下的卡片 / 图标不该被顺手点开。两处手势共用一个截止时刻。
  const onClickCapture = (event) => {
    if (!iphoneSwallowClickUntil) return;
    if (Date.now() > iphoneSwallowClickUntil) {
      iphoneSwallowClickUntil = 0;
      return;
    }
    iphoneSwallowClickUntil = 0;
    event.stopPropagation();
    event.preventDefault();
  };

  // 监听挂在 overlay 而不是 screen 上：机身圆角外的底部角落（仍在屏幕矩形内）
  // 命中测试落在 device 上，挂在 screen 上会收不到那次 pointerdown。
  overlay.addEventListener('pointerdown', onPointerDown);
  window.addEventListener('pointermove', onPointerMove);
  window.addEventListener('pointerup', onPointerUp);
  window.addEventListener('pointercancel', onPointerCancel);
  window.addEventListener('blur', resetTracking);
  overlay.addEventListener('touchmove', onTouchMove, { passive: false });
  overlay.addEventListener('click', onClickCapture, true);

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

  // 移动端旋转屏幕、软键盘收放与地址栏伸缩都可能只改视觉视口而不派发 resize：
  // 补一条 visualViewport 监听（老浏览器没有这个对象就只留 resize）。
  globalThis.visualViewport?.addEventListener?.('resize', () => {
    if (!isIphoneOpen()) return;
    fitIphoneStage();
  });
}
