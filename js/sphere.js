// ===== iPhone（悬浮球手机）悬浮球：拖拽 / 点击打开 =====
// 与万华镜悬浮球同构：pointer 事件统一处理鼠标与触屏；位移超过阈值算拖拽，
// 未位移算点击；位置持久化到 localStorage，窗口 resize 后 clamp 回视口内。

function getIphoneBall() {
  return document.getElementById(IPHONE_BALL_ID);
}

function clampIphoneBallPosition(ball, left, top) {
  const width = ball?.offsetWidth || IPHONE_BALL_SIZE;
  const height = ball?.offsetHeight || IPHONE_BALL_SIZE;
  return {
    left: iphoneClamp(left, 0, Math.max(0, window.innerWidth - width)),
    top: iphoneClamp(top, 0, Math.max(0, window.innerHeight - height)),
  };
}

function setIphoneBallPosition(ball, left, top, persist = true) {
  if (!ball) return;
  const next = clampIphoneBallPosition(ball, left, top);
  ball.style.left = `${next.left}px`;
  ball.style.top = `${next.top}px`;
  if (!persist) return;
  try {
    globalThis.localStorage?.setItem(IPHONE_BALL_POSITION_KEY, JSON.stringify(next));
  } catch {}
}

function restoreIphoneBallPosition(ball) {
  if (!ball) return false;
  let stored = null;
  try {
    stored = JSON.parse(globalThis.localStorage?.getItem(IPHONE_BALL_POSITION_KEY) || 'null');
  } catch {}
  const left = iphoneParseNumber(stored?.left);
  const top = iphoneParseNumber(stored?.top);
  if (left === null || top === null) return false;
  setIphoneBallPosition(ball, left, top, false);
  return true;
}

function showIphoneBall() {
  const ball = getIphoneBall();
  if (!ball || ball.style.display !== 'none') return;
  setIphoneBallPosition(ball, Number.parseFloat(ball.style.left) || 0, Number.parseFloat(ball.style.top) || 0, false);
  ball.style.display = 'flex';
}

function hideIphoneBall() {
  const ball = getIphoneBall();
  if (!ball) return;
  ball.style.display = 'none';
}

function createIphoneBall() {
  let ball = getIphoneBall();
  if (ball) return ball;
  ball = document.createElement('button');
  ball.type = 'button';
  ball.id = IPHONE_BALL_ID;
  ball.className = 'iphone-ball';
  ball.title = `${IPHONE_MODULE_DISPLAY_NAME}：拖拽移动 / 点击打开`;
  ball.setAttribute('aria-label', IPHONE_MODULE_DISPLAY_NAME);
  // 造型为 Apple LOGO（simple-icons「Apple」，路径见 constants.js）：
  // 白色苹果本体 + 双层投影，任意壁纸上都清晰可辨。
  ball.innerHTML = `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#fff" d="${IPHONE_APPLE_LOGO_PATH}"/>
    </svg>
  `;
  document.body.appendChild(ball);
  initIphoneBallDrag(ball);
  if (!restoreIphoneBallPosition(ball)) {
    // 默认停靠在屏幕右侧居上位置（避开万华镜等常驻右侧下方的悬浮球）。
    const defaultLeft = Math.max(IPHONE_EDGE_GAP, window.innerWidth - ball.offsetWidth - IPHONE_EDGE_GAP);
    const defaultTop = Math.round(window.innerHeight * 0.18);
    setIphoneBallPosition(ball, defaultLeft, defaultTop, false);
  }
  window.addEventListener('resize', () => {
    const left = Number.parseFloat(ball.style.left);
    const top = Number.parseFloat(ball.style.top);
    if (!Number.isFinite(left) || !Number.isFinite(top)) return;
    setIphoneBallPosition(ball, left, top, false);
  });
  return ball;
}

function initIphoneBallDrag(ball) {
  let dragState = null;
  let hasMoved = false;
  let pointerDownX = 0;
  let pointerDownY = 0;

  const onPointerMove = (event) => {
    if (!dragState) return;
    const deltaX = event.clientX - pointerDownX;
    const deltaY = event.clientY - pointerDownY;
    if (!hasMoved && Math.hypot(deltaX, deltaY) >= IPHONE_BALL_DRAG_THRESHOLD) hasMoved = true;
    if (!hasMoved) return;
    setIphoneBallPosition(ball, event.clientX - dragState.offsetX, event.clientY - dragState.offsetY, false);
  };

  const onPointerUp = () => {
    if (!dragState) return;
    dragState = null;
    ball.classList.remove('is-dragging');
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', onPointerUp);
    if (hasMoved) {
      // 拖拽结束才落盘：拖动过程中不写 localStorage，避免高频写入。
      const left = Number.parseFloat(ball.style.left);
      const top = Number.parseFloat(ball.style.top);
      if (Number.isFinite(left) && Number.isFinite(top)) setIphoneBallPosition(ball, left, top);
      return;
    }
    if (isIphoneOpen()) closeIphoneUi();
    else openIphoneUi();
  };

  ball.addEventListener('pointerdown', (event) => {
    if (event.button !== 0) return;
    dragState = {
      offsetX: event.clientX - ball.offsetLeft,
      offsetY: event.clientY - ball.offsetTop,
    };
    pointerDownX = event.clientX;
    pointerDownY = event.clientY;
    hasMoved = false;
    ball.classList.add('is-dragging');
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    event.preventDefault();
  });
}
