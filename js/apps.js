// ===== iPhone（悬浮球手机）应用注册表：图标渲染 + 应用内页 =====
// 应用内页目前全部是占位演示；后续把某个应用做成真功能时，替换对应
// buildXxxScreen 即可，图标与打开动画的管线不用动。
// 图标图片由 CSS background-image 加载（见 style.css 的 .iphone-app-icon--qq 与
// .iphone-qq__ 头像类），这里只负责撑出容器，不写 DOM <img> / 内联 url()，
// 避免相对路径被宿主页面的 URL 带偏。

// ---------- 主屏图标 ----------
// 返回一个可点按的应用图标按钮（含图形与名称标签）。
// 图形两种来源：位图走 CSS background-image（iconClass，见 .iphone-app-icon--qq，
// 相对 style.css 解析到扩展目录内，避免 DOM <img> 相对路径被宿主页面 URL 带偏）；
// 矢量图直接内联 SVG（iconSvg，见 .iphone-app-icon--settings，与 QQ 页内图标同思路）。
function buildIphoneAppIcon(app) {
  const cell = document.createElement('button');
  cell.type = 'button';
  cell.className = 'iphone-app-cell';
  cell.dataset.appId = app.id;
  cell.setAttribute('aria-label', app.name);

  const icon = document.createElement('span');
  icon.className = `iphone-app-icon ${app.iconClass || ''}`;
  if (app.iconSvg) icon.innerHTML = app.iconSvg;

  const label = document.createElement('span');
  label.className = 'iphone-app-label';
  label.textContent = app.name;

  cell.appendChild(icon);
  cell.appendChild(label);
  return cell;
}

// ---------- QQ 图形（对照参考截图手绘 SVG，24×24 viewBox） ----------
// 注意：按需求 QQ 频道不在仿真范围内，故无频道图标与任何频道入口。
function iphoneQqIcons() {
  return {
    // 消息：实心气泡 + 左下小尾巴 + 两个白点
    chat: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 3.1c-5.3 0-9.1 3.6-9.1 7.8 0 2.4 1.3 4.5 3.3 5.9l-.8 3.2c-.13.52.4.94.87.7l3.6-1.8c.7.13 1.4.2 2.13.2 5.3 0 9.1-3.6 9.1-7.9 0-4.3-3.8-8.1-9.1-8.1z"/><circle cx="9" cy="11.1" r="1.25" fill="#fff"/><circle cx="14.6" cy="11.1" r="1.25" fill="#fff"/></svg>',
    // 联系人：圆头 + 开放肩弧
    contact: '<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><circle cx="12" cy="7.6" r="3.7"/><path d="M4.6 19.4c0-3.8 3.3-5.9 7.4-5.9s7.4 2.1 7.4 5.9"/></g></svg>',
    // 动态：缺口圆环 + 右上四角星
    feed: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" d="M19.5 9.9A8 8 0 1 1 13.4 4.7"/><path fill="currentColor" d="M17.6 1.3c.36 1.83 1.34 2.8 3.17 3.17-1.83.36-2.8 1.34-3.17 3.17-.36-1.83-1.34-2.8-3.17-3.17 1.83-.36 2.8-1.34 3.17-3.17z"/></svg>',
    // 聊天页：返回 / 菜单 / 右箭头
    back: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 4.6 7.6 12l7.4 7.4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    menu: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6.6h16M4 12h16M4 17.4h16" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round"/></svg>',
    chevronRight: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9.5 5.5 6.5 6.5-6.5 6.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    chevronDown: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5.5 9.5 6.5 6.5 6.5-6.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    // 好友资料：QQ空间入口的空心星
    starO: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3.4 2.6 5.3 5.8.8-4.2 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.2-4.1 5.8-.8z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
    // 聊天输入工具排：麦克风 / 图片 / 相机 / 墨镜表情 / 笑脸 / 加号圆圈
    mic: '<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="9.2" y="2.8" width="5.6" height="10.2" rx="2.8"/><path d="M5.8 11.2c0 3.5 2.8 5.9 6.2 5.9s6.2-2.4 6.2-5.9"/><path d="M12 17.2v3.4"/></g></svg>',
    image: '<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3.4" y="4.8" width="17.2" height="14.4" rx="3.4"/><circle cx="15.9" cy="9.3" r="1.5" fill="currentColor" stroke="none"/><path d="m6.4 16.4 3.3-3.9 2.9 3.1 2.2-2.3 2.8 3.1"/></g></svg>',
    camera: '<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M8.7 6.8 10 4.6h4l1.3 2.2"/><rect x="3.4" y="6.8" width="17.2" height="13" rx="3"/><circle cx="12" cy="13" r="3.3"/></g></svg>',
    cool: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11.4" cy="13" r="7.9" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M5.9 11.9c1.7-1.5 3.9-1.5 5.2-.2 1.3-1.3 3.5-1.3 5.2.2l-1.2 2.6c-.9 1.1-2.6 1.1-3.5 0l-.5-.6-.5.6c-.9 1.1-2.6 1.1-3.5 0z" fill="currentColor"/><path fill="currentColor" d="M19.4 1.6c.3 1.5 1.1 2.3 2.6 2.6-1.5.3-2.3 1.1-2.6 2.6-.3-1.5-1.1-2.3-2.6-2.6 1.5-.3 2.3-1.1 2.6-2.6z"/></svg>',
    smiley: '<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="8.2"/><path d="M9.1 9.6v1.5M14.9 9.6v1.5"/><path d="M8.4 13.9c.9 1.5 2.2 2.3 3.6 2.3s2.7-.8 3.6-2.3"/></g></svg>',
    plusCircle: '<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="8.2"/><path d="M12 8.2v7.6M8.2 12h7.6"/></g></svg>',
    // 搜索 / 添加
    search: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="5.6" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M15.1 15.1l4.2 4.2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    plus: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4.8v14.4M4.8 12h14.4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
    // 头像裁剪：缩小 / 放大（放大镜内加减号，滑杆两端用）
    zoomOut: '<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="10.8" cy="10.8" r="5.6"/><path d="M15.1 15.1l4.2 4.2"/><path d="M8.4 10.8h4.8"/></g></svg>',
    zoomIn: '<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="10.8" cy="10.8" r="5.6"/><path d="M15.1 15.1l4.2 4.2"/><path d="M8.4 10.8h4.8M10.8 8.4v4.8"/></g></svg>',
    // 联系人功能行：新朋友 / 群聊 / 通讯录 / 设备
    friendNew: '<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="10.5" cy="8.5" r="3.4"/><path d="M4.5 19.2c0-3.3 2.7-5.2 6-5.2 1.5 0 2.9.4 4 1.1"/><path d="M17.8 14.6v5M15.3 17.1h5"/></g></svg>',
    friendGroup: '<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="9" cy="8.8" r="3.1"/><circle cx="16.2" cy="9.8" r="2.4"/><path d="M3.8 18.8c0-2.9 2.3-4.7 5.2-4.7s5.2 1.8 5.2 4.7"/><path d="M16.6 14.6c2.1.3 3.6 1.8 3.6 4"/></g></svg>',
    friendBook: '<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4.6" y="3.8" width="14.8" height="16.4" rx="2.6"/><path d="M8 3.8v16.4"/><circle cx="14.3" cy="9.6" r="2"/><path d="M11.4 15.4c.5-1.2 1.6-1.9 2.9-1.9s2.4.7 2.9 1.9"/></g></svg>',
    friendDevice: '<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3.6" y="5" width="13.4" height="9.4" rx="1.8"/><path d="M2.8 17.4h14.8"/><rect x="16.4" y="9.4" width="4.8" height="8" rx="1.4"/></g></svg>',
    // QQ空间：黄色五角星 / 更多 / 转发 / 评论 / 赞
    star: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#fff" d="M12 2.8l2.7 5.6 6.1.8-4.5 4.2 1.2 6-5.5-3-5.5 3 1.2-6L3.2 9.2l6.1-.8z"/></svg>',
    more: '<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="currentColor"><circle cx="5.2" cy="12" r="1.7"/><circle cx="12" cy="12" r="1.7"/><circle cx="18.8" cy="12" r="1.7"/></g></svg>',
    comment: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4.6c-4.8 0-8.2 3-8.2 7 0 2.2 1.1 4.1 2.9 5.3l-.7 3c-.1.5.4.9.8.6l3.3-1.8c.6.1 1.2.2 1.9.2 4.8 0 8.2-3 8.2-7.3s-3.4-7-8.2-7z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>',
    // —— QQ空间页（空间动态流 + 个人空间）所需图标 ——
    heartHands: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 12.8s-3.5-2.2-3.5-4.7c0-1.4 1-2.5 2.2-2.5.6 0 1 .3 1.3.8.3-.5.7-.8 1.3-.8 1.2 0 2.2 1.1 2.2 2.5 0 2.5-3.5 4.7-3.5 4.7z"/><path fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" d="M4.4 15.3c1.9 0 2.8 1 4.1 1.8 1 .6 2.2.9 3.5.9s2.5-.3 3.5-.9c1.3-.8 2.2-1.8 4.1-1.8"/></svg>',
    bell: '<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4.2c-2.9 0-4.8 2.2-4.8 5v3c0 .9-.3 1.7-.9 2.4l-.9 1h13.2l-.9-1c-.6-.7-.9-1.5-.9-2.4v-3c0-2.8-1.9-5-4.8-5z"/><path d="M10.3 18.7a1.8 1.8 0 0 0 3.4 0"/></g></svg>',
    gear: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.49.49 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96a.49.49 0 0 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32a.49.49 0 0 0-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>',
    pencil: '<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4.8 19.2l.9-3.4L16 5.5a1.7 1.7 0 0 1 2.4 0l.1.1a1.7 1.7 0 0 1 0 2.4L8.2 18.3l-3.4.9z"/><path d="M14.7 6.8l2.5 2.5"/></g></svg>',
    thumbUp: '<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M7.2 10.8v8.8"/><path d="M3.9 11.6h3.3v7.4a.8.8 0 0 1-.8.8H4.7a.8.8 0 0 1-.8-.8z"/><path d="M7.2 12.2l3-6c.8-1.6 3.1-1 2.9.7l-.4 2.9h4.5c1.2 0 2.1 1.1 1.8 2.2l-1.4 5.2a1.8 1.8 0 0 1-1.7 1.3H7.2"/></g></svg>',
    share: '<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7"/><path d="M9.6 7H17v7.4"/></g></svg>',
    eye: '<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><path d="M2.9 12S6.3 6.5 12 6.5 21.1 12 21.1 12 17.7 17.5 12 17.5 2.9 12 2.9 12z"/><circle cx="12" cy="12" r="2.5"/></g></svg>',
    photoUp: '<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3.6" y="5.2" width="16.8" height="13.6" rx="2.2"/><circle cx="8.7" cy="9.7" r="1.5"/><path d="M4.8 16.8l4.5-4.2 3.7 3.4 2.4-2.2 3.8 3.4"/></g></svg>',
    ai: '<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M7.6 17.2 10.9 7h1.4l3.3 10.2"/><path d="M8.9 13.6h5.4"/><path d="M18.7 4.4l.5 1.4 1.4.5-1.4.5-.5 1.4-.5-1.4-1.4-.5 1.4-.5z" fill="currentColor" stroke="none"/></g></svg>',
    fSay: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4.4c-4.6 0-8 2.9-8 6.7 0 2.1 1.1 4 2.8 5.2l-.6 2.9c-.1.5.4.9.8.6l3-1.7c.6.1 1.3.2 2 .2 4.6 0 8-2.9 8-6.7s-3.4-7.2-8-7.2z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><g fill="currentColor"><circle cx="8.6" cy="11.3" r="1"/><circle cx="12" cy="11.3" r="1"/><circle cx="15.4" cy="11.3" r="1"/></g></svg>',
    fLog: '<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="4.8" y="4" width="14.4" height="16" rx="2.2"/><path d="M8.4 8.7h7.2M8.4 12h7.2M8.4 15.3h4.4"/></g></svg>',
    fAlbum: '<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3.6" y="5" width="16.8" height="14" rx="2.2"/><circle cx="8.8" cy="9.8" r="1.6"/><path d="M4.6 16.8l4.6-4.4 3.6 3.4 2.6-2.4 4 3.6"/></g></svg>',
    fMsg: '<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4.6" width="16" height="14.8" rx="2.2"/><path d="M7.6 9h8.8M7.6 12.4h8.8M7.6 15.8h5.2"/></g></svg>',
    fMore: '<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4.8 7.4h14.4M4.8 12h14.4M4.8 16.6h14.4"/></g></svg>',
    // —— 动态页入口图标（圆头描边风格，颜色对齐真实界面） ——
    dynStar: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4.3l2.05 5.76 6.03.11-4.76 3.78 1.68 5.73L12 16.4l-5 3.28 1.68-5.73-4.76-3.78 6.03-.11z" fill="none" stroke="#f5b91d" stroke-width="2" stroke-linejoin="round"/><path d="M9.7 10h4.4l-4.4 3.7h4.4" fill="none" stroke="#f5b91d" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    dynBrain: '<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="#f5b91d" stroke-width="2.1" stroke-linecap="round"><path d="M6.9 16.9A7.4 7.4 0 1 1 16.4 18.9"/><path d="M19.7 8.7c1.8.4 2.7 1.5 2.2 2.7-.5 1.2-1.9 1.7-3.6 1.3"/></g><path d="M8.7 6.2l1.05 2.6 2.6 1.05-2.6 1.05L8.7 13.5l-1.05-2.6-2.6-1.05 2.6-1.05z" fill="#f5b91d"/><path d="M14.3 3.7l.62 1.55 1.55.62-1.55.62-.62 1.55-.62-1.55-1.55-.62 1.55-.62z" fill="#f5b91d"/><path d="M4.1 4l.44 1.1 1.1.44-1.1.44L4.1 7.12l-.44-1.1-1.1-.44 1.1-.44z" fill="#f5b91d"/></svg>',
    dynGame: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.9 6.9c.9.75 2 1.15 3.2 1.15h1.8c1.2 0 2.3-.4 3.2-1.15 2.4-1.95 5.9-.3 6.1 2.8l.25 4.1c.13 1.95-1.4 3.6-3.35 3.6-1.15 0-2.2-.6-2.8-1.6-.5-.85-1.4-1.35-2.35-1.35h-3.5c-.95 0-1.85.5-2.35 1.35-.6 1-1.65 1.6-2.8 1.6-1.95 0-3.48-1.65-3.35-3.6l.25-4.1c.2-3.1 3.7-4.75 6.1-2.8z" fill="none" stroke="#1294ec" stroke-width="2.1" stroke-linejoin="round"/><circle cx="16.1" cy="11.2" r="1.9" fill="none" stroke="#1294ec" stroke-width="1.9"/></svg>',
    dynMini: '<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="#1294ec" stroke-width="2.1" stroke-linecap="round"><circle cx="12" cy="6.4" r="4"/><path d="M12 10.6v6"/><ellipse cx="12" cy="18.8" rx="7" ry="2.4"/></g><circle cx="13.7" cy="5" r="1.15" fill="#1294ec"/></svg>',
    dynFarm: '<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="#3fcb7e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19.4v-7.1"/><path d="M12 12.3C12 8.85 9.35 6.2 5.9 6.2c0 3.45 2.65 6.1 6.1 6.1z"/><path d="M12 10.8c0-2.85 2.3-5.15 5.15-5.15 0 2.85-2.3 5.15-5.15 5.15z"/><path d="M4.6 17.6c1.9 2 4.4 3.1 7.4 3.1 3 0 5.5-1.1 7.4-3.1"/></g></svg>',
    dynManhua: '<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="#f2543b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3.9a8.1 8.1 0 1 1-6.9 12.4L3.6 19.9l1-3.6A8.1 8.1 0 0 1 12 3.9z"/><path d="M10.3 9.1l5 2.9-5 2.9z"/></g></svg>',
    dynCheese: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17.3 4.9l2.4 14.5H3.9z" fill="none" stroke="#f3bd5b" stroke-width="2.1" stroke-linejoin="round"/><ellipse cx="9" cy="15.4" rx="1.5" ry="1.75" fill="#f3bd5b" transform="rotate(-14 9 15.4)"/><path d="M14.3 13.4l-1.9 1.9 1.9 1.9" fill="none" stroke="#f3bd5b" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    gridIcon: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><rect x="3.2" y="3.2" width="8" height="8" rx="2.4"/><rect x="13.4" y="3.7" width="7" height="7" rx="2" transform="rotate(45 16.9 7.2)"/><rect x="3.2" y="13.4" width="8" height="8" rx="2.4"/><rect x="13.4" y="13.4" width="8" height="8" rx="2.4"/></svg>',
    personAdd: '<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="10.2" cy="8.2" r="3.7"/><path d="M4.2 19.6c.8-3.5 3.1-5.3 6-5.3 1.5 0 2.9.5 4 1.3"/><path d="M17.6 13.6v5.2"/><path d="M15 16.2h5.2"/></g></svg>',
  };
}

// ---------- QQ 页面数据（占位演示，字段贴近后续真实数据结构） ----------
// 仿真范围：消息 / 联系人 / 动态(完整入口列表，仅空间动态可点) / 文字聊天 / QQ空间。
// 不含：QQ频道 Tab，各入口真实功能（游戏/漫剧/农场等仅展示），登录、收发消息等。

// 「我」的昵称默认跟随酒馆的 {{user}}（当前人设名，见 iphoneGetTavernUserName），
// 不在这里写死；这里只剩 QQ 号与状态行的占位演示值（编辑资料页留空时回退）。
const IPHONE_QQ_ME = Object.freeze({
  qqId: '2831475926',
  status: '在线 - 5G',
});

// 玩家署名在 QQ 数据里的本体（评论作者、被回复人）：默认写酒馆宏 {{user}}，
// 显示与提示词组装时才解析成当前人设名——与 iPhone_Message 楼层里用户行的写法
// 同一套规则，换人设后旧评论的署名跟着变；编辑资料填过自定义昵称则直接用昵称。
const IPHONE_QQ_USER_MACRO = '{{user}}';

// 无宿主上下文（本地 test.html 预览）时的兜底昵称：有酒馆时一律用 {{user}}。
const IPHONE_QQ_ME_FALLBACK_NAME = '小橘子';

// 「我的头像」内置可选款式：Microsoft Fluent Emoji 3D 可爱小动物（MIT 许可），
// 经 CSS 背景类加载（相对路径只能走 CSS，见 style.css 对应类）；me = 默认头像
//（同为 Fluent Emoji 3D 小熊），无覆盖类。
const IPHONE_QQ_ME_AVATAR_PRESETS = Object.freeze([
  { id: 'me', label: '默认' },
  { id: 'cat', label: '小猫' },
  { id: 'dog', label: '小狗' },
  { id: 'fox', label: '小狐狸' },
  { id: 'rabbit', label: '小兔' },
  { id: 'panda', label: '熊猫' },
  { id: 'frog', label: '青蛙' },
  { id: 'penguin', label: '企鹅' },
  { id: 'pig', label: '小猪' },
  { id: 'hamster', label: '仓鼠' },
  { id: 'chick', label: '小鸡' },
]);

// ---------- 我的资料（设置里的 qqProfile ↔ 界面显示值） ----------
// 归一化头像：null = 默认；{ preset } 仅收内置款式（me 等价于默认，归一为 null）；
// { url } 仅收 http(s) 与 data:image（上传头像走 data URL），并限长防止设置膨胀。
function iphoneNormalizeQqAvatar(raw) {
  if (!raw || typeof raw !== 'object') return null;
  const preset = String(raw.preset || '').trim();
  if (preset && preset !== 'me' && IPHONE_QQ_ME_AVATAR_PRESETS.some((p) => p.id === preset)) {
    return { preset };
  }
  const url = String(raw.url || '').trim();
  if (/^(https?:\/\/|data:image\/)/i.test(url) && url.length <= 400000) return { url };
  return null;
}

function iphoneNormalizeQqProfile(raw) {
  const source = raw && typeof raw === 'object' ? raw : {};
  return {
    name: String(source.name || '').trim().slice(0, 24),
    qqId: String(source.qqId || '').replace(/\D/g, '').slice(0, 12),
    avatar: iphoneNormalizeQqAvatar(source.avatar),
  };
}

// 酒馆的 {{user}} 当前值 = 人设名（无宿主上下文时为空串）。全插件唯一的玩家
// 名字来源：显示、署名、提示词都从这里取，保证与私聊 / 群聊 / 楼层一致。
function iphoneGetTavernUserName() {
  const ctx = iphoneGetContextSafe();
  return String(ctx?.name1 || '').trim();
}

// 取「我」的显示资料（随聊天文件存取）：昵称默认是酒馆 {{user}}（人设名），
// 编辑资料填过昵称才用填的；QQ 号留空回退占位演示值；顺手把脏数据写回聊天文件。
function iphoneGetQqProfile() {
  const storage = iphoneGetQqStorage();
  const normalized = iphoneNormalizeQqProfile(storage.qqProfile);
  const raw = storage.qqProfile && typeof storage.qqProfile === 'object' ? storage.qqProfile : {};
  if (JSON.stringify(normalized) !== JSON.stringify(iphoneNormalizeQqProfile(raw))) {
    storage.qqProfile = normalized;
    iphoneSaveQqStorage();
  }
  return {
    name: normalized.name || iphoneGetTavernUserName() || IPHONE_QQ_ME_FALLBACK_NAME,
    qqId: normalized.qqId || IPHONE_QQ_ME.qqId,
    avatar: normalized.avatar,
  };
}

// 编辑资料里填过的自定义昵称（没填过 = 空串，昵称跟随酒馆 {{user}}）。
function iphoneGetQqCustomNick() {
  return iphoneNormalizeQqProfile(iphoneGetQqStorage().qqProfile).name;
}

// 玩家在 QQ 数据（评论作者 / 被回复人）里的署名：编辑资料填过昵称就用昵称，
// 否则写酒馆宏 {{user}} 本体——楼层同步与提示词组装时才解析成人设名，
// 换人设后旧数据跟着变（与 iPhone_Message 楼层里用户行的写法一致）。
function iphoneGetQqPlayerAuthor() {
  return iphoneGetQqCustomNick() || IPHONE_QQ_USER_MACRO;
}

// 旧数据兼容（v0.17.1）：v0.17.0 及以前「我的QQ昵称」留空时，玩家评论的署名写的是
// 插件默认昵称「小橘子」，这些评论其实都是玩家写的。展示与解析时把「小橘子」也当
// 玩家的旧署名——仅限没设过自定义昵称、且它当前不是联系人名字（避免误伤同名好友）、
// 且有宿主上下文（能解析出人设名）的情况。新数据一律写署名本体，不依赖这条兜底。
function iphoneIsQqLegacyPlayerName(name) {
  const value = String(name || '').trim();
  if (!value || value !== IPHONE_QQ_ME_FALLBACK_NAME) return false;
  if (iphoneGetQqCustomNick()) return false;
  if (!iphoneGetTavernUserName()) return false;
  // 轻量读名单（不做整表归一化）：这里只关心名字，且会被评论渲染逐行调用
  const friends = iphoneGetQqStorage().qqData?.friends;
  return !(Array.isArray(friends) && friends.some((f) => String(f?.name || '').trim() === value));
}

// 把署名（可能是宏本体、人设名或旧数据里的历史昵称）解析成当前显示名。
function iphoneResolveQqPlayerAuthor(name) {
  const value = String(name || '').trim();
  if (!value) return '';
  if (/\{\{user\}\}/i.test(value) || iphoneIsQqLegacyPlayerName(value)) {
    return iphoneGetTavernUserName() || IPHONE_QQ_ME_FALLBACK_NAME;
  }
  return value;
}

// 评论 / 被回复人是不是玩家本人：宏本体、当前人设名、编辑资料里的昵称、旧默认
// 昵称（见 iphoneIsQqLegacyPlayerName）都算。
function iphoneIsQqPlayerAuthor(name) {
  const value = String(name || '').trim();
  if (!value) return false;
  if (/\{\{user\}\}/i.test(value) || iphoneIsQqLegacyPlayerName(value)) return true;
  const aliases = new Set([iphoneGetTavernUserName(), iphoneGetQqProfile().name].filter(Boolean));
  return aliases.has(value);
}

// 局部更新我的资料（写入聊天文件）并即时同步到已挂载的各视图（消息页 / 聊天页 /
// QQ空间）。
function iphoneUpdateQqProfile(qqScreen, patch) {
  const storage = iphoneGetQqStorage();
  storage.qqProfile = iphoneNormalizeQqProfile({ ...iphoneNormalizeQqProfile(storage.qqProfile), ...patch });
  iphoneSaveQqStorage();
  iphoneRefreshQqMeIdentity(qqScreen);
}

// 把「我的头像」应用到一个头像节点：内置款式换 CSS 覆盖类，自定义图走内联
// background-image（绝对/data URL 不受页面 URL 基准影响），默认则清掉两者。
function iphoneApplyMeAvatarToEl(el, profile) {
  if (!el) return;
  if (el._meAvatarPresetCls) {
    el.classList.remove(el._meAvatarPresetCls);
    el._meAvatarPresetCls = null;
  }
  el.style.backgroundImage = '';
  const avatar = profile.avatar;
  if (avatar && avatar.preset) {
    const cls = `iphone-qq__avatar--${avatar.preset}`;
    el.classList.add(cls);
    el._meAvatarPresetCls = cls;
  } else if (avatar && avatar.url) {
    el.style.backgroundImage = `url("${avatar.url.replace(/"/g, '%22')}")`;
  }
}

// 刷新 root 内所有标注 data-me-name / data-me-avatar 的节点（各视图构建后调用）。
function iphoneRefreshQqMeIdentity(root) {
  if (!root) return;
  const profile = iphoneGetQqProfile();
  root.querySelectorAll('[data-me-name]').forEach((el) => { el.textContent = profile.name; });
  root.querySelectorAll('[data-me-avatar]').forEach((el) => iphoneApplyMeAvatarToEl(el, profile));
}

// 上传头像第一步：把用户选的图片读成 Image 对象（不裁剪，交给编辑器摆位）。
function iphoneReadAvatarFile(file) {
  return new Promise((resolve, reject) => {
    if (!file || !/^image\//.test(file.type || '')) {
      reject(new Error('请选择图片文件'));
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('图片读取失败'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('图片解码失败'));
      img.onload = () => resolve(img);
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

// 上传头像第二步：把原图上的一块方形区域绘到 256px 画布上。
// crop = { sx, sy, sw, sh } 全部是**原图像素**坐标（编辑器负责把预览坐标换算
// 过来）：sx/sy 是方形区域左上角，sw/sh 是边长（二者相等）。这里只做夹取与
// 绘制，不再做缩放换算——预览与最终结果的对应关系由调用方那一次换算保证。
function iphoneCropAvatarToDataUrl(img, crop) {
  const size = IPHONE_AVATAR_CROP_SIZE;
  const W = img.naturalWidth;
  const H = img.naturalHeight;
  const side = Math.max(1, Math.min(
    Number(crop?.sw) || Math.min(W, H),
    Number(crop?.sh) || Math.min(W, H),
    W,
    H,
  ));
  const clamp = (value, max) => Math.min(Math.max(0, max), Math.max(0, Number(value) || 0));
  const sx = clamp(crop?.sx, W - side);
  const sy = clamp(crop?.sy, H - side);
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, size, size);
  ctx.drawImage(img, sx, sy, side, side, 0, 0, size, size);
  return canvas.toDataURL('image/jpeg', 0.92);
}

// ---------- QQ 好友与群聊（聊天文件里的 qqData ↔ 消息页会话 / 联系人列表） ----------
// 数据全部来自「添加好友 / 创建群聊」表单：friend = { id, name, qqId, avatar }，
// group = { id, name, qqId, avatar, memberIds, messages, floorSynced }
//（memberIds 指向好友 id；messages / floorSynced 与好友同义——群聊聊天记录与
// iPhone_Message 楼层同步游标，v0.12.0 起群聊可真正聊天）。
// avatar 形状与「我的资料」一致：null = 名字首字渐变字牌；{ preset } / { url } 同上。

function iphoneQqGenEntityId(prefix) {
  return `${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

// 好友/群聊聊天记录归一化：[{ role: 'user'|'assistant', content, name? }]，只留
// 文本气泡必要字段，空内容丢弃，最多保留最近 200 条（防聊天记录无限膨胀拖慢
// 设置读写）。name 是 assistant 消息的发言人（群聊区分气泡归属用；私聊恒为
// 联系人本身，旧数据没有该字段，原样兼容）。
function iphoneNormalizeQqMessages(raw) {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item) => {
      if (!item || typeof item !== 'object') return null;
      const role = item.role === 'assistant' ? 'assistant' : 'user';
      const content = String(item.content || '').trim();
      if (!content) return null;
      const name = String(item.name || '').trim();
      if (role === 'assistant' && name) return { role, content, name };
      return { role, content };
    })
    .filter(Boolean)
    .slice(-200);
}

function iphoneNormalizeQqFriend(raw) {
  const source = raw && typeof raw === 'object' ? raw : {};
  const name = String(source.name || '').trim().slice(0, 24);
  if (!name) return null;
  return {
    id: String(source.id || '').trim() || iphoneQqGenEntityId('f'),
    name,
    qqId: String(source.qqId || '').replace(/\D/g, '').slice(0, 12),
    avatar: iphoneNormalizeQqAvatar(source.avatar),
    messages: iphoneNormalizeQqMessages(source.messages),
    // 已同步进 iPhone_Message 楼层的消息条数（去重游标：每次只追加新消息）。
    floorSynced: Math.max(0, Math.floor(Number(source.floorSynced) || 0)),
  };
}

function iphoneNormalizeQqGroup(raw, friendIds) {
  const source = raw && typeof raw === 'object' ? raw : {};
  const name = String(source.name || '').trim().slice(0, 24);
  if (!name) return null;
  const members = Array.isArray(source.memberIds) ? source.memberIds : [];
  return {
    id: String(source.id || '').trim() || iphoneQqGenEntityId('g'),
    name,
    qqId: String(source.qqId || '').replace(/\D/g, '').slice(0, 12),
    avatar: iphoneNormalizeQqAvatar(source.avatar),
    // 成员只保留仍存在的好友 id 并去重（好友被删后群成员自动收缩）
    memberIds: [...new Set(members.map(String).filter((id) => friendIds.has(id)))],
    messages: iphoneNormalizeQqMessages(source.messages),
    // 已同步进 iPhone_Message 楼层的消息条数（去重游标），与好友同义。
    floorSynced: Math.max(0, Math.floor(Number(source.floorSynced) || 0)),
  };
}

// 空间动态归一化（v0.15.0）：动态 = { id, friendId, ts, text, likes, comments }，
// 数组按时间旧→新追加，QQ空间页倒序展示。发布者必须是已有联系人——friendId 不在
// 联系人列表里的动态直接剔除（联系人被删后 TA 的动态随之消失，与群成员自动收缩
// 同理）；必须有正文；最多保留最近 50 条（新的追加在尾部，旧的溢出丢弃）。
// likes = 点赞的联系人名字列表（去重）；comments = 评论 { name, text, replyName? }，
// replyName 是被回复人（贴主回复 = name 为贴主名字且带 replyName）。点赞 / 评论
// 存名字不存 id：联系人删除后旧动态里 TA 的痕迹按「注销号」保留，与真实 QQ 一致。
// 旧字段 likeNames / reply 读取时一并识别。
function iphoneNormalizeQqDynamics(raw, friendIds) {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item) => {
      if (!item || typeof item !== 'object') return null;
      const friendId = String(item.friendId || '').trim();
      const text = String(item.text || '').trim();
      if (!friendIds.has(friendId) || !text) return null;
      const likeNames = (Array.isArray(item.likes) && item.likes.length)
        ? item.likes
        : (Array.isArray(item.likeNames) ? item.likeNames : []);
      const likes = [];
      const seenLikes = new Set();
      for (const rawName of likeNames) {
        const name = String(rawName || '').trim().slice(0, 24);
        if (name && !seenLikes.has(name)) {
          seenLikes.add(name);
          likes.push(name);
        }
      }
      const comments = (Array.isArray(item.comments) ? item.comments : [])
        .map((c) => {
          if (!c || typeof c !== 'object') return null;
          const name = String(c.name || '').trim().slice(0, 24);
          const ctext = String(c.text || '').trim().slice(0, 300);
          if (!name || !ctext) return null;
          const out = { name, text: ctext };
          // 自己回复自己无意义，直接丢掉 replyName
          const replyName = String(c.replyName ?? c.reply ?? '').trim().slice(0, 24);
          if (replyName && replyName !== name) out.replyName = replyName;
          return out;
        })
        .filter(Boolean)
        // 上限 20（v0.17.0 起由 8 放宽）：玩家回复会持续追加评论，容量太小会把
        // 早先的对话顶掉；评论按时间旧→新追加，保留最近 20 条（QQ 评论区本身
        // 也不折叠，20 条足够撑起几轮往复）。
        .slice(-20);
      return {
        id: String(item.id || '').trim() || iphoneQqGenEntityId('d'),
        friendId,
        // 创建时刻（毫秒）：QQ空间页据此显示「刚刚 / N分钟前 / …」相对时间
        ts: Math.max(0, Math.floor(Number(item.ts) || Date.now())),
        text: text.slice(0, 600),
        likes: likes.slice(0, 8),
        comments,
      };
    })
    .filter(Boolean)
    .slice(-50);
}

function iphoneNormalizeQqData(raw) {
  const source = raw && typeof raw === 'object' ? raw : {};
  const friends = (Array.isArray(source.friends) ? source.friends : [])
    .map(iphoneNormalizeQqFriend)
    .filter(Boolean);
  const friendIds = new Set(friends.map((friend) => friend.id));
  const groups = (Array.isArray(source.groups) ? source.groups : [])
    .map((group) => iphoneNormalizeQqGroup(group, friendIds))
    .filter(Boolean);
  const dynamics = iphoneNormalizeQqDynamics(source.dynamics, friendIds);
  // 空间动态已同步进 iPhone_Message 楼层的条数（去重游标，与好友/群聊的
  // floorSynced 同义；动态按时间旧→新追加，新动态都在数组尾部）。
  const dynamicsFloorSynced = Math.max(0, Math.floor(Number(source.dynamicsFloorSynced) || 0));
  return { friends, groups, dynamics, dynamicsFloorSynced };
}

// 读取好友/群聊数据（读时归一化，脏数据不落盘）。数据随当前聊天文件走
//（chatMetadata.IPhone.qqData，见 host.js 的 iphoneGetQqStorage），换聊天自动切换。
function iphoneGetQqData() {
  return iphoneNormalizeQqData(iphoneGetQqStorage().qqData);
}

// 覆盖保存好友/群聊数据（写回聊天文件），并刷新消息页会话列表与联系人各面板
//（qqScreen 挂钩）。
function iphoneSetQqData(qqScreen, next) {
  iphoneGetQqStorage().qqData = iphoneNormalizeQqData(next);
  iphoneSaveQqStorage();
  if (qqScreen) qqScreen._renderQqSocial?.();
}

// ---------- iPhone_Message 楼层同步 ----------
// 好友/群聊每次产生新记录（发出消息 / 收到回复）后调用：先扫描酒馆最新楼层——
// 已是 <iPhone_Message> 楼层就原地把新对话追加进标签内部，否则新建一个专用
// 记录楼层（楼层全文用 <iPhone_Message>...</iPhone_Message> 包裹）。同步进度记在
// entity.floorSynced（已写入的消息条数），保证只追加新消息、不重不漏。
// 好友与群聊的记录段（v0.21.0 起每段各有自己的标签，段头留在标签内首行；
// v0.23.0 起段标签改用方括号）：
// 私聊 `[QQ_私聊_联系人]` 包 `与「联系人」的QQ聊天记录：`，群聊
// `[QQ_群聊_群名]` 包 `群「群名」的QQ群聊记录：`；同一会话永远只有一段、一个
// 标签，同楼层的多个会话记录按段分开。
// 单条队列串行执行：聊天页发送与回复两条同步不会交错，也绝不相互吞掉。
let iphoneQqFloorSyncChain = Promise.resolve();
function iphoneSyncQqChatFloor(entityId) {
  const run = async () => {
    const ctx = iphoneGetFloorChatContext();
    if (!ctx || !entityId) return; // 无宿主（test.html 裸预览）：静默跳过
    const stored = iphoneGetQqStorage().qqData;
    // 好友优先；群聊（v0.12.0 起）有自己的聊天记录与楼层游标
    const friend = Array.isArray(stored?.friends)
      ? stored.friends.find((f) => f && f.id === entityId)
      : null;
    const group = friend ? null : (Array.isArray(stored?.groups)
      ? stored.groups.find((g) => g && g.id === entityId)
      : null);
    const entity = friend || group;
    const isGroup = Boolean(group);
    if (!entity || !entity.messages.length) return;
    const from = Math.min(Math.max(0, Math.floor(Number(entity.floorSynced) || 0)), entity.messages.length);
    const newMessages = entity.messages.slice(from);
    if (!newMessages.length) return;
    // 名字里的换行与「」会破坏段头/行的结构，统一替换成空格；消息内容里的换行
    // 也会把一行拆成两行（v0.21.0 起同步要按行重新解析楼层，内容必须单行）
    const sanitizeName = (value, fallback) => String(value || '').replace(/[\r\n「」]+/g, ' ').trim() || fallback;
    const sanitizeContent = (value) => String(value ?? '').replace(/[\r\n]+/g, ' ').trim();
    const speakerName = isGroup ? '' : sanitizeName(entity.name, '对方');
    // 行格式：段头 + 逐条 `{{user}}：「…」` / `联系人或成员名：「…」`。用户侧直接
    // 写酒馆宏 {{user}}，宿主构建提示词时才解析成人设名（楼层 UI 里显示的就是宏
    // 本体）；群聊 assistant 行首写各消息的发言人；内容统一包进「」。
    const lines = newMessages.map((msg) => {
      const speaker = msg.role === 'assistant'
        ? (isGroup ? sanitizeName(msg.name, '群成员') : speakerName)
        : '{{user}}';
      return `${speaker}：「${sanitizeContent(msg.content)}」`;
    });
    const sectionHeader = isGroup
      ? `群「${sanitizeName(entity.name, '群聊')}」的QQ群聊记录：`
      : `与「${speakerName}」的QQ聊天记录：`;
    // 本段的标签（v0.21.0，v0.23.0 起方括号）：如 [QQ_私聊_小明] / [QQ_群聊_同学群]，
    // 段头仍在标签内首行（标签是段的分隔，段头是可读的标题，两者都在）。
    const sectionTag = (isGroup
      ? IPHONE_FLOOR_SECTION_TAG_HEADS.qqGroup
      : IPHONE_FLOOR_SECTION_TAG_HEADS.qqChat)
      .replace('{name}', iphoneFloorSectionTagName(entity.name, isGroup ? '未知群聊' : '未知联系人'));
    const chat = ctx.chat;
    const last = chat[chat.length - 1];
    // 首尾去空白：包裹时补的换行不算楼层内容，反复追加也不会在标签内积累空行。
    const existingInner = last ? iphoneExtractMessageFloorInner(last.mes) : null;
    if (existingInner == null) {
      // 最新楼层不是 iPhone_Message 楼层：新建（floorSynced 之前的旧记录一并补写）。
      const sections = [{ tag: sectionTag, header: sectionHeader, lines }];
      await iphoneAppendChatFloor(ctx, iphoneWrapMessageFloorInner(iphoneFloorBuildInner(sections)));
    } else {
      // 已是 iPhone_Message 楼层：按段切开，本会话的段（标签或段头认出，旧格式的
      // 裸段顺带补上标签完成迁移）续写新对话并挪到楼层末尾；没有本段就新开一段。
      // 同一会话永远只有一段、一个标签，不会像 v0.18.0 前那样每轮另起一个段头。
      const sections = iphoneFloorParseInner(existingInner);
      iphoneFloorUpsertSection(sections, sectionTag, sectionHeader, lines);
      await iphoneUpdateChatFloor(ctx, chat.length - 1, iphoneWrapMessageFloorInner(iphoneFloorBuildInner(sections)));
    }
    entity.floorSynced = entity.messages.length;
    iphoneSaveQqStorage();
    iphoneLog('info', `已同步 ${newMessages.length} 条QQ聊天记录到 iPhone_Message 楼层`);
  };
  const guarded = async () => {
    try {
      await run();
    } catch (error) {
      iphoneLog('warn', '同步QQ聊天记录到 iPhone_Message 楼层失败', error);
    }
  };
  iphoneQqFloorSyncChain = iphoneQqFloorSyncChain.then(guarded, guarded);
  return iphoneQqFloorSyncChain;
}

// ---------- QQ空间动态楼层同步（v0.14.0；v0.17.0 起整段重写；v0.21.0 起段标签） ----------
// 与聊天记录共用同一条串行链（iphoneQqFloorSyncChain），两类同步不交错互吞。
// 下拉刷新生成动态、玩家在动态下回复（评论增长）后都会调用：把「QQ空间动态：」
// 段（v0.21.0 起外面包 <QQ空间动态> 标签，v0.23.0 起改方括号 [QQ空间动态]）按当前全部动态整段重写——动态按时间
// 旧→新排列，每条一个小块（正文 + 点赞 + 评论）。v0.17.0 前用「已同步条数」
// 游标做增量追加，评论只增不改的时代够用；玩家回复会让旧动态的评论区变化，
// 游标察觉不到，改成整段重写后点赞 / 评论的任何变化都会如实反映到楼层（重复的
// 旧「QQ空间动态：」段一并合并清理，只留一段）。最新楼层不是记录楼层就新建一个
//（Append/Update 逻辑与聊天记录同步相同）。
function iphoneSyncQqDynamicsFloor() {
  const run = async () => {
    const ctx = iphoneGetFloorChatContext();
    if (!ctx) return; // 无宿主：静默跳过
    const stored = iphoneGetQqStorage().qqData;
    const dynamics = Array.isArray(stored?.dynamics) ? stored.dynamics : [];
    if (!dynamics.length) return;
    // 行格式（v0.15.0）：每条动态一个小块，与聊天记录的 `名：「内容」` 行区分开，
    // 楼层里的动态自带点赞名单与评论（含贴主 / 互评 / 玩家回复）。名字里的换行与
    // 冒号统一替换成空格，防止破坏块的行结构。
    const sanitize = (value, fallback) => String(value || '').replace(/[\r\n:：]+/g, ' ').trim() || fallback;
    const lines = [];
    for (const dyn of dynamics) {
      const friend = (Array.isArray(stored.friends) ? stored.friends : [])
        .find((f) => f && f.id === dyn.friendId);
      const name = sanitize(friend?.name, 'QQ用户');
      const text = String(dyn.text || '').replace(/[\r\n]+/g, ' ').trim();
      lines.push(`◆ ${name}：${text}`);
      if (Array.isArray(dyn.likes) && dyn.likes.length) {
        lines.push(`  点赞：${dyn.likes.map((n) => sanitize(n, 'QQ用户')).join('、')}`);
      }
      if (Array.isArray(dyn.comments) && dyn.comments.length) {
        lines.push('  评论：');
        // 署名与聊天记录用户行同一套规则：写玩家的署名本体（{{user}} 宏或自定义
        // 昵称）；v0.17.0 前的旧署名（默认昵称）归一成宏，别让模型把它当成第三人
        const author = (value) => (
          iphoneIsQqLegacyPlayerName(value) ? IPHONE_QQ_USER_MACRO : sanitize(value, 'QQ用户')
        );
        for (const c of dyn.comments) {
          const ctext = String(c.text || '').replace(/[\r\n]+/g, ' ').trim();
          if (!ctext) continue;
          lines.push(c.replyName
            ? `  - ${author(c.name)} 回复 ${author(c.replyName)}：${ctext}`
            : `  - ${author(c.name)}：${ctext}`);
        }
      }
    }
    const sectionHeader = 'QQ空间动态：';
    const sectionTag = IPHONE_FLOOR_SECTION_TAG_HEADS.qqDynamics;
    const chat = ctx.chat;
    const last = chat[chat.length - 1];
    const existingInner = last ? iphoneExtractMessageFloorInner(last.mes) : null;
    if (existingInner == null) {
      const sections = [{ tag: sectionTag, header: sectionHeader, lines }];
      await iphoneAppendChatFloor(ctx, iphoneWrapMessageFloorInner(iphoneFloorBuildInner(sections)));
      iphoneLog('info', `已同步 ${dynamics.length} 条QQ空间动态到 iPhone_Message 楼层`);
      return;
    }
    // 已是记录楼层：按段切开，把动态段整段替换成最新全文（重复的旧动态段一并
    // 合并清理，只留一段；旧格式的裸段顺带补上标签完成迁移），聊天记录段原样
    // 保留；空行统一由拼装重建（段间不空行、段内也不空行）。内容没变化时不动
    // 楼层（不产生无谓的存档写入）。
    const sections = iphoneFloorParseInner(existingInner);
    const target = iphoneFloorFindSection(sections, sectionTag, sectionHeader);
    if (target) {
      target.tag = sectionTag;
      target.header = sectionHeader;
      target.lines = lines;
      iphoneFloorDropDuplicates(sections, sectionTag, sectionHeader, target);
    } else {
      sections.push({ tag: sectionTag, header: sectionHeader, lines });
    }
    const next = iphoneFloorBuildInner(sections);
    if (next === existingInner.trim()) return;
    await iphoneUpdateChatFloor(ctx, chat.length - 1, iphoneWrapMessageFloorInner(next));
    iphoneLog('info', `已更新QQ空间动态段到 iPhone_Message 楼层（${dynamics.length} 条动态）`);
  };
  const guarded = async () => {
    try {
      await run();
    } catch (error) {
      iphoneLog('warn', '同步QQ空间动态到 iPhone_Message 楼层失败', error);
    }
  };
  iphoneQqFloorSyncChain = iphoneQqFloorSyncChain.then(guarded, guarded);
  return iphoneQqFloorSyncChain;
}

// ---------- QQ空间动态生成（v0.14.0：下拉刷新调用一次对话 API） ----------
// system 依次装：角色扮演指令 + 提示词结构说明 + 扮演逻辑与对白规范 + 全部联系人
// 名单 + 世界书 + 酒馆最近楼层（均可由「设置 · 动态提示词」预设控制，v0.16.0 起
// 独立成组）、动态写作指导与输出格式（预设里可改写、清空即不附带）；user 下达
// 生成指令。预设里的 {{char}} 一律替换成「联系人」（各段指导面向名单里的每个人），
// {{user}} 照常解析。回复按 `联系人名：「动态内容」` 解析（动态区块格式，自带
// 点赞与评论），发言人必须是名单中的联系人（名单外的丢弃、每位联系人每次最多
// 一条），返回 { friendId, ts, text, likes, comments } 数组。
// ownerId（v0.20.0）：在「她的QQ空间」里下拉刷新时传访客 id，本次只为 TA 生成
// 一条动态——指令收窄成单人，名单与点赞/评论人仍用完整联系人名单，模型没写对
// 发布者就报错让用户重试（不能把别人的动态混进 TA 的空间）。
async function iphoneGenerateQqDynamics(ownerId) {
  const data = iphoneGetQqData();
  const friends = data.friends;
  if (!friends.length) throw new Error('还没有联系人，无法生成动态');
  const owner = ownerId ? friends.find((f) => f.id === ownerId) || null : null;
  if (ownerId && !owner) throw new Error('还没有联系人，无法生成动态');
  const settings = iphoneGetSettings();
  const ctx = iphoneGetContextSafe();
  const preset = iphoneGetQqChatPreset('qzone');
  const resolve = (text) => iphoneResolveTavernMacros(text, ctx);
  const fillGuide = (text) => resolve(String(text ?? '').replace(/\{\{char\}\}/gi, owner ? owner.name : '联系人'));
  // 访客模式：<contacts> 只列 TA 一人（发布者只能是 TA），点赞/评论人另附完整
  // 名单；我的空间两者相同
  const rosterText = (owner ? [owner] : friends).map((f) => `- ${String(f.name || '').trim()}`).join('\n');
  const allNamesRosterText = owner
    ? friends.map((f) => `- ${String(f.name || '').trim()}`).join('\n')
    : rosterText;

  let worldText = '';
  if (preset.worldBook) {
    try {
      worldText = resolve(iphoneWbBuildPromptText(await iphoneWbCollectState()) || '');
    } catch (error) {
      iphoneLog('warn', '世界书内容注入失败，本次请求不带世界书', error);
    }
  }

  // 酒馆最近楼层：跳过隐藏楼层与 <iPhone_Message> 记录楼层（那是本插件的记录，
  // 回灌只会自我重复），时间旧→新；楼层数由预设的 historyFloors 控制（0 = 不附带，
  // 注意 slice(-0) 返回整个数组，必须先夹紧步长为 0）。
  const historyFloors = Math.max(0, Math.round(Number(preset.historyFloors) || 0));
  const historyLines = historyFloors > 0
    ? (Array.isArray(ctx?.chat) ? ctx.chat : [])
      .filter((mes) => mes && !mes.is_system
        && iphoneExtractMessageFloorInner(mes.mes) == null
        && String(mes.mes ?? '').trim())
      .slice(-historyFloors)
      .map((mes) => `${String(mes.name || '').trim() || '旁白'}：${resolve(String(mes.mes).trim())}`)
    : [];

  // 最新的 iPhone_Message 记录楼层（选项默认关闭）：楼层里是同步过的 QQ 聊天
  // 记录，可能包含多位联系人的记录段；只取最新一块，超长截尾保留最近记录。
  let floorLogText = '';
  if (preset.latestFloor) {
    const chatFloors = Array.isArray(ctx?.chat) ? ctx.chat : [];
    for (let i = chatFloors.length - 1; i >= 0; i -= 1) {
      const inner = iphoneExtractMessageFloorInner(chatFloors[i]?.mes);
      if (inner == null) continue;
      const text = resolve(String(inner).trim());
      if (!text) break;
      if (text.length > IPHONE_QQ_FLOOR_LOG_CAP) {
        let cut = text.slice(-IPHONE_QQ_FLOOR_LOG_CAP);
        const newlineAt = cut.indexOf('\n');
        if (newlineAt >= 0) cut = cut.slice(newlineAt + 1);
        floorLogText = `……（更早的记录已略）\n${cut}`;
      } else {
        floorLogText = text;
      }
      break;
    }
  }

  const persona = preset.persona.trim();
  const npcLogic = preset.npcLogic.trim();
  const dialogueGuidance = preset.dialogueGuidance.trim();
  const guidance = String(preset.guidance ?? '').trim();
  const format = String(preset.format ?? '').trim();
  const worldTextTrimmed = worldText.trim();
  const tavernText = historyLines.join('\n');

  const sysParts = [];
  if (persona) sysParts.push(`<roleplay_instructions>\n${resolve(persona)}\n</roleplay_instructions>`);
  // 结构说明：把本次实际附带的段一一点名（没附带的段不列，免得模型去找不存在
  // 的标签）
  const outlineItems = [];
  if (persona) outlineItems.push('<roleplay_instructions>…</roleplay_instructions>：角色扮演指令，约束人物设定与世界观基线；');
  if (npcLogic) outlineItems.push('<npc_logic>…</npc_logic>：扮演逻辑——「先是人，后是设定」，按自身立场与动机行事；');
  if (dialogueGuidance) outlineItems.push('<dialogue_guidance>…</dialogue_guidance>：表达规范——口语化、生活化、带情绪与立场，禁止播报腔；');
  outlineItems.push(owner
    ? '<contacts>…</contacts>：本次动态的唯一发布者——只能由 TA 发这一条动态；'
    : '<contacts>…</contacts>：QQ联系人名单——动态的发布者只能从名单中挑选；');
  if (owner) outlineItems.push('<contacts_all>…</contacts_all>：QQ全部联系人名单——点赞与评论只认这份名单里的人；');
  if (worldTextTrimmed) outlineItems.push('<world_info>…</world_info>：当前场景的世界书设定，包含世界观与相关人物的资料；');
  if (tavernText) outlineItems.push('<tavern_context>…</tavern_context>：酒馆主线的最近对话（时间旧→新），是当前正在发生的剧情背景；');
  if (floorLogText) outlineItems.push('<qq_chat_log>…</qq_chat_log>：最近一次同步到酒馆楼层的QQ聊天记录，可能包含多个联系人的记录段（每段各自用方括号标签包裹，如 [QQ_私聊_名字] / [微信_群聊_群名] / [朋友圈动态]），供你了解最近的聊天情况；');
  if (guidance) outlineItems.push('<dynamics_guidance>…</dynamics_guidance>：QQ空间动态的写作指导；');
  if (format) outlineItems.push('<output_format>…</output_format>：回复格式要求，位于提示词末尾，必须严格遵守；');
  sysParts.push('【提示词结构说明】本次请求的提示词由以下部分组成，均已用 XML 标签包裹并附介绍：\n'
    + outlineItems.map((item) => `- ${item}`).join('\n'));
  if (npcLogic) sysParts.push(`以下是扮演逻辑指导（决定你如何理解与演绎角色）：\n<npc_logic>\n${fillGuide(npcLogic)}\n</npc_logic>`);
  if (dialogueGuidance) sysParts.push(`以下是表达规范（决定你如何说话与写内容）：\n<dialogue_guidance>\n${fillGuide(dialogueGuidance)}\n</dialogue_guidance>`);
  sysParts.push(owner
    ? `以下是这条动态唯一的发布者，动态必须由 TA 发出（其他人不许发）：\n<contacts>\n${rosterText}\n</contacts>`
    : `以下是QQ联系人名单（动态的发布者只能从中挑选）：\n<contacts>\n${rosterText}\n</contacts>`);
  if (owner) sysParts.push(`以下是QQ全部联系人名单（点赞与评论只认这份名单里的人）：\n<contacts_all>\n${allNamesRosterText}\n</contacts_all>`);
  if (worldTextTrimmed) sysParts.push(`以下是当前场景的世界书设定（世界观与人物资料）：\n<world_info>\n${worldTextTrimmed}\n</world_info>`);
  if (tavernText) sysParts.push(`以下是酒馆主线的最近对话（时间旧→新），是你当前所处的剧情背景：\n<tavern_context>\n${tavernText}\n</tavern_context>`);
  if (floorLogText) sysParts.push(`以下是最近一次同步到酒馆楼层的QQ聊天记录，可能包含多个联系人的记录段（每段各自用方括号标签包裹，如 [QQ_私聊_名字] / [微信_群聊_群名] / [朋友圈动态]）：\n<qq_chat_log>\n${floorLogText}\n</qq_chat_log>`);
  if (guidance) sysParts.push(`以下是QQ空间动态的写作指导：\n<dynamics_guidance>\n${resolve(guidance)}\n</dynamics_guidance>`);
  if (format) sysParts.push(`以下是回复格式要求，必须严格遵守：\n<output_format>\n${resolve(format)}\n</output_format>`);

  const userContent = owner
    ? `请根据以上信息，为 ${owner.name} 的 QQ 空间生成一条新的动态，只由 ${owner.name} 发布。当前时间：${new Date().toLocaleString('zh-CN', { hour12: false })}。`
    : `请根据以上信息，为 QQ 空间生成新的动态。当前时间：${new Date().toLocaleString('zh-CN', { hour12: false })}。`;
  const reply = await iphoneRequestChatCompletion(settings, [
    { role: 'system', content: sysParts.join('\n\n') },
    { role: 'user', content: userContent },
  ]);
  // 先按动态区块格式解析（自带点赞 / 评论）；模型没按格式输出时回退聊天行格式，
  // 退化成纯文字动态（无点赞无评论）
  let parsed = iphoneParseQqDynamicsReply(reply);
  let fallbackUsed = false;
  if (!parsed.length) {
    parsed = iphoneParseQqReplyEntries(reply).map((entry) => ({
      name: entry.name,
      text: entry.content,
      likes: [],
      comments: [],
    }));
    fallbackUsed = true;
  }
  const friendNames = new Set(friends.map((f) => String(f.name || '').trim()).filter(Boolean));
  const now = Date.now();
  const created = [];
  const usedFriendIds = new Set();
  for (const dyn of parsed) {
    const name = String(dyn.name || '').trim();
    const text = String(dyn.text || '').trim();
    if (!name || !text) continue;
    const friend = friends.find((f) => f.name === name);
    // 名单外的发言人（模型自创）直接丢弃：发布者必须是已有联系人；同一位联系
    // 人在一次刷新里最多一条
    if (!friend || usedFriendIds.has(friend.id)) continue;
    // 访客模式：只认 TA 发的，别人（模型跑偏）一律作废，由外层报错重试
    if (owner && friend.id !== owner.id) continue;
    usedFriendIds.add(friend.id);
    // 点赞人 / 评论人同样只认联系人名单：名单外的名字丢弃、重复的去掉；回复
    // 对象不在名单里就降级成普通评论
    const likes = [];
    for (const rawName of dyn.likes || []) {
      if (friendNames.has(rawName) && !likes.includes(rawName)) likes.push(rawName);
    }
    const comments = [];
    const seenComments = new Set();
    for (const rawComment of dyn.comments || []) {
      const cname = String(rawComment.name || '').trim();
      const ctext = String(rawComment.text || '').trim();
      if (!friendNames.has(cname) || !ctext) continue;
      const replyName = String(rawComment.replyName || '').trim();
      const knownReply = replyName && friendNames.has(replyName);
      const key = `${cname}|${knownReply ? replyName : ''}|${ctext}`;
      if (seenComments.has(key)) continue;
      seenComments.add(key);
      comments.push(knownReply
        ? { name: cname, text: ctext, replyName }
        : { name: cname, text: ctext });
    }
    created.push({ friendId: friend.id, ts: now, text, likes, comments });
  }
  if (!created.length) {
    throw new Error(owner
      ? `AI 没有返回 TA 的有效动态（需要「${owner.name}：「动态正文」」开头的动态区块）。`
      : 'AI 没有返回有效动态（需要「联系人名：「动态正文」」开头的动态区块，且发布者必须是已有联系人）。');
  }
  iphoneLog('info', `QQ空间刷新成功：生成 ${created.length} 条新动态${owner ? `（${owner.name} 的空间）` : ''}${fallbackUsed ? '（回退纯文字格式）' : ''}`);
  return created;
}

// ---------- QQ空间「回复帖子」（v0.17.0） ----------
// 玩家在某条动态下留言后调用一次对话 API：system 复用「设置 · 动态提示词」预设
//（角色扮演指令 / 扮演与对白指导 / 世界书 / 酒馆上下文 / 记录楼层，与动态生成
// 同源），另加联系人名单、`<dynamic_post>`（目标动态：发布者、正文、点赞名单、
// 按时间旧→新的完整评论区——玩家刚发的评论就在最后一条）、`<reply_guidance>`
//（回复写作指导，预设里可改、清空不附带）与 `<output_format>`（回复格式）；
// user 点明玩家留了新评论，请生成回应。返回 [{ name, text, replyName? }]：
// 评论人必须是名单里的联系人（不替玩家发言、名单外的丢弃、与已有评论重复的去掉），
// 被回复人可以是玩家 / 贴主 / 评论区里的联系人，其余降级成普通评论；模型没按
// 格式输出时整段作为贴主的一条回复兜底，保证玩家留言总有回应。
async function iphoneGenerateQqDynamicReply(dyn) {
  const settings = iphoneGetSettings();
  const data = iphoneGetQqData();
  const friends = data.friends;
  if (!friends.length) throw new Error('还没有联系人，无法生成回复');
  const post = data.dynamics.find((d) => d.id === dyn?.id) || dyn;
  if (!post) throw new Error('这条动态已经不在了');
  const publisher = friends.find((f) => f.id === post.friendId);
  if (!publisher) throw new Error('动态发布者已不在联系人列表中');
  const ctx = iphoneGetContextSafe();
  const preset = iphoneGetQqChatPreset('qzone');
  const resolve = (text) => iphoneResolveTavernMacros(text, ctx);
  const fillGuide = (text) => resolve(String(text ?? '').replace(/\{\{char\}\}/gi, '联系人'));
  const rosterText = friends.map((f) => `- ${String(f.name || '').trim()}`).join('\n');
  // 玩家身份：{{user}} 照常解析成酒馆人设名（与私聊 / 群聊一致），评论区里 TA
  // 的署名默认就是这个名字；只有编辑资料填过自定义QQ昵称时两个名字才会不同，
  // 这时显式说明对应关系，模型才不会把 QQ 昵称当成第三人（判定被回复人、
  // 过滤评论人也要认得这两个名字）。
  const playerName = iphoneGetTavernUserName() || IPHONE_QQ_ME_FALLBACK_NAME;
  const playerAuthor = iphoneGetQqPlayerAuthor();
  const customNick = iphoneGetQqCustomNick();
  const playerAliases = new Set([playerName, customNick].filter(Boolean));
  const playerDesc = customNick && customNick !== playerName
    ? `玩家「${playerName}」（TA 的QQ昵称是「${customNick}」，评论区里署「${customNick}」的就是 TA）`
    : `玩家「${playerName}」`;

  let worldText = '';
  if (preset.worldBook) {
    try {
      worldText = resolve(iphoneWbBuildPromptText(await iphoneWbCollectState()) || '');
    } catch (error) {
      iphoneLog('warn', '世界书内容注入失败，本次请求不带世界书', error);
    }
  }
  const historyFloors = Math.max(0, Math.round(Number(preset.historyFloors) || 0));
  const historyLines = historyFloors > 0
    ? (Array.isArray(ctx?.chat) ? ctx.chat : [])
      .filter((mes) => mes && !mes.is_system
        && iphoneExtractMessageFloorInner(mes.mes) == null
        && String(mes.mes ?? '').trim())
      .slice(-historyFloors)
      .map((mes) => `${String(mes.name || '').trim() || '旁白'}：${resolve(String(mes.mes).trim())}`)
    : [];
  let floorLogText = '';
  if (preset.latestFloor) {
    const chatFloors = Array.isArray(ctx?.chat) ? ctx.chat : [];
    for (let i = chatFloors.length - 1; i >= 0; i -= 1) {
      const inner = iphoneExtractMessageFloorInner(chatFloors[i]?.mes);
      if (inner == null) continue;
      const text = resolve(String(inner).trim());
      if (!text) break;
      if (text.length > IPHONE_QQ_FLOOR_LOG_CAP) {
        let cut = text.slice(-IPHONE_QQ_FLOOR_LOG_CAP);
        const newlineAt = cut.indexOf('\n');
        if (newlineAt >= 0) cut = cut.slice(newlineAt + 1);
        floorLogText = `……（更早的记录已略）\n${cut}`;
      } else {
        floorLogText = text;
      }
      break;
    }
  }

  // 目标动态：发布者 / 正文 / 点赞名单 / 评论区（时间旧→新，一条一行，回复行带
  // 「A 回复 B」），玩家刚发的评论就在最后一条——AI 顺着这条往下接话。
  const inline = (value) => String(value || '').replace(/[\r\n]+/g, ' ').trim();
  const postLines = [
    `发布者：${inline(publisher.name)}`,
    `正文：${inline(post.text)}`,
  ];
  if (Array.isArray(post.likes) && post.likes.length) postLines.push(`点赞：${post.likes.map(inline).join('、')}`);
  postLines.push('评论区（时间旧→新）：');
  if (!Array.isArray(post.comments) || !post.comments.length) {
    postLines.push('（暂无评论）');
  } else {
    // 署名在数据里可能是 {{user}} 宏本体，发请求前就地解析成当前人设名
    //（子请求不过酒馆生成管线，没有人替我们解析宏）
    for (const c of post.comments) {
      postLines.push(c.replyName
        ? `- ${inline(iphoneResolveQqPlayerAuthor(c.name))} 回复 ${inline(iphoneResolveQqPlayerAuthor(c.replyName))}：${inline(c.text)}`
        : `- ${inline(iphoneResolveQqPlayerAuthor(c.name))}：${inline(c.text)}`);
    }
  }
  const postText = postLines.join('\n');

  const persona = preset.persona.trim();
  const npcLogic = preset.npcLogic.trim();
  const dialogueGuidance = preset.dialogueGuidance.trim();
  const replyGuidance = String(preset.replyGuidance ?? '').trim();
  const replyFormat = String(preset.replyFormat ?? '').trim();
  const worldTextTrimmed = worldText.trim();
  const tavernText = historyLines.join('\n');

  const sysParts = [];
  if (persona) sysParts.push(`<roleplay_instructions>\n${resolve(persona)}\n</roleplay_instructions>`);
  const outlineItems = [];
  if (persona) outlineItems.push('<roleplay_instructions>…</roleplay_instructions>：角色扮演指令，约束人物设定与世界观基线；');
  if (npcLogic) outlineItems.push('<npc_logic>…</npc_logic>：扮演逻辑——「先是人，后是设定」，按自身立场与动机行事；');
  if (dialogueGuidance) outlineItems.push('<dialogue_guidance>…</dialogue_guidance>：表达规范——口语化、生活化、带情绪与立场，禁止播报腔；');
  outlineItems.push('<contacts>…</contacts>：QQ联系人名单——评论人只能从名单中挑选；');
  if (worldTextTrimmed) outlineItems.push('<world_info>…</world_info>：当前场景的世界书设定，包含世界观与相关人物的资料；');
  if (tavernText) outlineItems.push('<tavern_context>…</tavern_context>：酒馆主线的最近对话（时间旧→新），是当前正在发生的剧情背景；');
  if (floorLogText) outlineItems.push('<qq_chat_log>…</qq_chat_log>：最近一次同步到酒馆楼层的QQ聊天记录，供你了解最近的聊天情况；');
  outlineItems.push('<dynamic_post>…</dynamic_post>：玩家正在回复的那条动态——发布者、正文、点赞名单与评论区（时间旧→新，最后一条是玩家本人留下的新评论）；');
  if (replyGuidance) outlineItems.push('<reply_guidance>…</reply_guidance>：评论回复的写作指导；');
  if (replyFormat) outlineItems.push('<output_format>…</output_format>：回复格式要求，位于提示词末尾，必须严格遵守；');
  sysParts.push('【提示词结构说明】本次请求的提示词由以下部分组成，均已用 XML 标签包裹并附介绍：\n'
    + outlineItems.map((item) => `- ${item}`).join('\n'));
  if (npcLogic) sysParts.push(`以下是扮演逻辑指导（决定你如何理解与演绎角色）：\n<npc_logic>\n${fillGuide(npcLogic)}\n</npc_logic>`);
  if (dialogueGuidance) sysParts.push(`以下是表达规范（决定你如何说话与写内容）：\n<dialogue_guidance>\n${fillGuide(dialogueGuidance)}\n</dialogue_guidance>`);
  sysParts.push(`以下是QQ联系人名单（评论人只能从中挑选）：\n<contacts>\n${rosterText}\n</contacts>`);
  if (worldTextTrimmed) sysParts.push(`以下是当前场景的世界书设定（世界观与人物资料）：\n<world_info>\n${worldTextTrimmed}\n</world_info>`);
  if (tavernText) sysParts.push(`以下是酒馆主线的最近对话（时间旧→新），是你当前所处的剧情背景：\n<tavern_context>\n${tavernText}\n</tavern_context>`);
  if (floorLogText) sysParts.push(`以下是最近一次同步到酒馆楼层的QQ聊天记录，可能包含多个联系人的记录段（每段各自用方括号标签包裹，如 [QQ_私聊_名字] / [微信_群聊_群名] / [朋友圈动态]）：\n<qq_chat_log>\n${floorLogText}\n</qq_chat_log>`);
  const identityNote = customNick && customNick !== playerName
    ? `评论区里署名「${customNick}」的评论也是 TA 写的。`
    : '评论区的署名用的就是 TA 的名字。';
  sysParts.push(`以下是玩家身份说明：${playerDesc}。${identityNote}不要把 TA 当成联系人或替 TA 发言。`);
  sysParts.push(`以下是玩家正在回复的那条动态（含完整评论区）：\n<dynamic_post>\n${postText}\n</dynamic_post>`);
  if (replyGuidance) sysParts.push(`以下是评论回复的写作指导：\n<reply_guidance>\n${resolve(replyGuidance)}\n</reply_guidance>`);
  if (replyFormat) sysParts.push(`以下是回复格式要求，必须严格遵守：\n<output_format>\n${resolve(replyFormat)}\n</output_format>`);

  const userContent = `${playerDesc}在评论区留下了新评论（评论区最后一条），请根据以上信息生成新的评论回复。当前时间：${new Date().toLocaleString('zh-CN', { hour12: false })}。`;
  const reply = await iphoneRequestChatCompletion(settings, [
    { role: 'system', content: sysParts.join('\n\n') },
    { role: 'user', content: userContent },
  ]);

  const friendNames = new Set(friends.map((f) => String(f.name || '').trim()).filter(Boolean));
  // 去重键：名字的原始写法与解析后写法各记一份（旧数据里的 {{user}} 宏与当前
  // 人设名视为同一人），模型复读玩家或联系人说过的话时能正确命中
  const existingKeys = new Set();
  for (const c of (Array.isArray(post.comments) ? post.comments : [])) {
    const text = String(c.text || '').trim();
    const rawName = String(c.name || '').trim();
    for (const name of [rawName, iphoneResolveQqPlayerAuthor(rawName)]) {
      if (name) existingKeys.add(`${name}|${text}`);
    }
  }
  const created = [];
  for (const entry of iphoneParseQqDynamicReplyLines(reply)) {
    const name = String(entry.name || '').trim();
    const text = String(entry.text || '').trim();
    // 不替玩家发言（酒馆人设名 / QQ昵称 / 署名本体 {{user}} 都算玩家）；
    // 评论人必须是名单里的联系人；与已有评论完全重复的丢掉
    if (!name || !text || playerAliases.has(name) || iphoneIsQqPlayerAuthor(name) || !friendNames.has(name)) continue;
    const key = `${name}|${text}`;
    if (existingKeys.has(key)) continue;
    existingKeys.add(key);
    // 被回复人：玩家（人设名 / QQ昵称 / 「{{user}}」）或名单里的联系人（含贴主）
    // 才保留，其余降级成普通评论；模型写人设名或宏回复玩家时统一存成玩家的
    // 署名本体（宏或自定义昵称），与玩家自己发评论时的写法保持一致
    const rawReply = String(entry.replyName || '').trim();
    const replyName = (rawReply === playerName || iphoneIsQqPlayerAuthor(rawReply)) ? playerAuthor : rawReply;
    const knownReply = replyName && replyName !== name
      && (iphoneIsQqPlayerAuthor(replyName) || playerAliases.has(replyName) || friendNames.has(replyName));
    created.push(knownReply
      ? { name, text, replyName }
      : { name, text });
  }
  let fallbackUsed = false;
  if (!created.length) {
    // 整段兜底：模型没按格式输出（或写的名字都不在名单里）也保留回应，记在贴主
    // 名下（详情看「日志」）；行首残留的 `名字：` / `名字 回复 名字：` 标签剥掉，
    // 免得渲染成「贴主：某人：…」
    const whole = String(reply ?? '').replace(/\s+/g, ' ').trim()
      .replace(/^[^：:\n]{1,30}?(?:\s+回复\s+[^：:\n]{1,30}?)?\s*[:：]\s*/, '')
      .slice(0, 300);
    if (!whole) throw new Error('AI 没有返回有效回复内容。');
    created.push({ name: publisher.name, text: whole });
    fallbackUsed = true;
  }
  iphoneLog('info', `QQ空间回复成功：生成 ${created.length} 条新评论${fallbackUsed ? '（整段兜底为贴主回复）' : ''}`);
  return created;
}

// 动态展示时间：旧数据带固定 time 文案就原样用；否则按创建时刻算相对时间
//（刚刚 / N分钟前 / N小时前 / M月D日 HH:MM），每次渲染重算，不会停留在过时文案。
function iphoneQqDynamicsTimeLabel(dyn) {
  if (dyn.time) return dyn.time;
  const ts = Math.floor(Number(dyn.ts) || 0);
  if (!ts) return '';
  const diff = Date.now() - ts;
  if (diff < 60 * 1000) return '刚刚';
  if (diff < 60 * 60 * 1000) return `${Math.floor(diff / (60 * 1000))}分钟前`;
  if (diff < 24 * 60 * 60 * 1000) return `${Math.floor(diff / (60 * 60 * 1000))}小时前`;
  const date = new Date(ts);
  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  return `${date.getMonth() + 1}月${date.getDate()}日 ${hh}:${mm}`;
}

// ---------- QQ 聊天提示词（v0.10.0 重做；v0.10.4 起各段可在「设置 · 私聊提示词」
// 编辑；v0.11.2 起各段用 XML 标签包裹并附显眼介绍，聊天记录也按格式发送；
// v0.12.0 起同一套组装服务群聊，多一段群成员列表，可在「设置 · 群聊提示词」编辑） ----------
// system 一条消息按顺序装：角色扮演指令（<roleplay_instructions>）、提示词结构
// 说明（把本次实际附带的段逐一点名）、扮演逻辑与对白规范（<npc_logic> /
// <dialogue_guidance>，默认附带，可在设置里改写、留空不附带）、群成员列表
//（<group_members>，仅群聊，按建群成员自动生成）、世界书内容（<world_info>，
// 引擎激活 − 玩家排除，可关）、酒馆 history 最近若干楼（<tavern_context>，
// 楼层数可调，0 = 不附带）、最新 iPhone_Message 记录楼层（<qq_chat_log>，可关）、
// 输出格式约定（<output_format>，可空）；之后拼本会话已存在的消息，每条按
// 「发送者：「内容」」排版——与输出格式同款，让模型在上下文里看到的就是它该
// 输出的样子。旧版把聊天记录原样直传，历史记录与格式约定自相矛盾，模型跟着
// 历史样板走、不理会格式约定。群聊的 assistant 消息行首带发言人名字。
// 酒馆 history 指 SillyTavern 的聊天楼层（ctx.chat），不是本插件或本会话的记录。
// 注意：本插件的子请求不经过酒馆完整生成管线，{{user}} / {{char}} 宏要在发送
// 前就地解析；楼层同步里写 {{user}} 字面量是另一条路径（宿主构建主提示词时
// 解析），两者不冲突。

// 读取 QQ 的提示词预设：kind = 'friend'（私聊，「设置 · 私聊提示词」编辑的
// settings.promptPresets.qqChat）、'group'（群聊，「设置 · 群聊提示词」编辑的
// settings.promptPresets.groupChat）或 'qzone'（动态生成与回复，「设置 · 动态
// 提示词」编辑的 settings.promptPresets.qzone）。逐字段回退默认值并规范化：
// persona/format/npcLogic/dialogueGuidance 必须是字符串；historyFloors 取整夹在
// 0–50；guidance / replyGuidance / replyFormat 仅 qzone 有（动态写作指导与回复
// 指导/格式），其余场景为 undefined。
function iphoneGetQqChatPreset(kind = 'friend') {
  const presetKey = kind === 'group' ? 'groupChat' : (kind === 'qzone' ? 'qzone' : 'qqChat');
  const defaults = kind === 'group'
    ? IPHONE_QQ_GROUP_PRESET_DEFAULT
    : (kind === 'qzone' ? IPHONE_QZONE_PRESET_DEFAULT : IPHONE_QQ_CHAT_PRESET_DEFAULT);
  const raw = iphoneGetSettings().promptPresets?.[presetKey] || {};
  const persona = typeof raw.persona === 'string' ? raw.persona : defaults.persona;
  const worldBook = typeof raw.worldBook === 'boolean' ? raw.worldBook : defaults.worldBook;
  const latestFloor = typeof raw.latestFloor === 'boolean' ? raw.latestFloor : defaults.latestFloor;
  const format = typeof raw.format === 'string' ? raw.format : defaults.format;
  // npcLogic / dialogueGuidance 没存过时回落内置常量；存过（含清空成空串）
  // 就完全以设置为准——空串 = 不附带该段。
  const npcLogic = typeof raw.npcLogic === 'string' ? raw.npcLogic : IPHONE_QQ_NPC_LOGIC;
  const dialogueGuidance = typeof raw.dialogueGuidance === 'string' ? raw.dialogueGuidance : IPHONE_QQ_DIALOGUE_GUIDANCE;
  let historyFloors = Math.round(Number(raw.historyFloors));
  if (!Number.isFinite(historyFloors)) historyFloors = defaults.historyFloors;
  historyFloors = Math.min(50, Math.max(0, historyFloors));
  const guidance = typeof raw.guidance === 'string' ? raw.guidance : defaults.guidance;
  const replyGuidance = typeof raw.replyGuidance === 'string' ? raw.replyGuidance : defaults.replyGuidance;
  const replyFormat = typeof raw.replyFormat === 'string' ? raw.replyFormat : defaults.replyFormat;
  return { persona, worldBook, latestFloor, historyFloors, format, npcLogic, dialogueGuidance, guidance, replyGuidance, replyFormat };
}

function iphoneResolveTavernMacros(text, ctx) {
  const user = String(ctx?.name1 || '').trim() || '用户';
  const char = String(ctx?.name2 || '').trim() || '角色';
  return String(text ?? '')
    .replace(/\{\{user\}\}/gi, user)
    .replace(/\{\{char\}\}/gi, char);
}

async function iphoneBuildQqChatRequestMessages(entity, conversation) {
  const ctx = iphoneGetContextSafe();
  const isGroup = entity?.kind === 'group';
  const preset = iphoneGetQqChatPreset(isGroup ? 'group' : 'friend');
  const resolve = (text) => iphoneResolveTavernMacros(text, ctx);
  const entityName = String(entity?.name || '').trim() || (isGroup ? '群聊' : '对方');
  // 预设占位符：{{group}} / {{char}} 先替换成本会话名再走宏解析，否则会被酒馆
  // 的 {{char}}（角色卡名）抢先覆盖；{{user}} 由 resolve 换成玩家名。
  const fill = (text) => resolve(String(text ?? '')
    .replace(/\{\{group\}\}/gi, () => entityName)
    .replace(/\{\{char\}\}/gi, () => entityName));
  // 扮演逻辑 / 对白规范面向「要扮演的人」：私聊是联系人本人；群聊是除玩家外的
  // 全体群成员，{{char}} 统一换成「群成员」，指导文案才能通顺地面向每个人。
  const fillGuide = (text) => resolve(String(text ?? '')
    .replace(/\{\{char\}\}/gi, () => (isGroup ? '群成员' : entityName)));
  const userName = String(ctx?.name1 || '').trim() || '用户';

  // 先把各段内容收齐，再按「介绍行 + XML 标签」逐段装配——结构说明要插在
  // 角色扮演指令之后，得先知道本次实际附带了哪些段。
  const persona = preset.persona.trim();
  // 扮演逻辑与对白规范：默认用内置文案，设置里可改写，清空即整段不附带
  // （与 persona / format 同一套「留空 = 不附带」约定）。
  const npcLogic = preset.npcLogic.trim();
  const dialogueGuidance = preset.dialogueGuidance.trim();

  // 群成员列表（仅群聊）：把成员 id 映射回好友名逐行列出；「{{user}}」也是群
  // 成员但由玩家亲自扮演，不列入（介绍行里说明）。
  let membersText = '';
  if (isGroup) {
    const data = iphoneGetQqData();
    membersText = (Array.isArray(entity.memberIds) ? entity.memberIds : [])
      .map((id) => data.friends.find((f) => f.id === id))
      .filter(Boolean)
      .map((f) => String(f.name || '').trim())
      .filter(Boolean)
      .map((name) => `- ${name}`)
      .join('\n');
  }

  // 选定的世界书内容：引擎激活的条目，去掉玩家在世界书应用里勾选排除的。
  let worldText = '';
  if (preset.worldBook) {
    try {
      worldText = resolve(iphoneWbBuildPromptText(await iphoneWbCollectState()) || '');
    } catch (error) {
      iphoneLog('warn', '世界书内容注入失败，本次请求不带世界书', error);
    }
  }

  // 酒馆 history 最近 N 楼：跳过隐藏楼层与 <iPhone_Message> 记录楼层（那是本
  // 插件的 QQ 记录，回灌进提示词只会自我重复）。
  let tavernText = '';
  if (preset.historyFloors > 0) {
    const historyLines = (Array.isArray(ctx?.chat) ? ctx.chat : [])
      .filter((mes) => mes && !mes.is_system
        && iphoneExtractMessageFloorInner(mes.mes) == null
        && String(mes.mes ?? '').trim())
      .slice(-preset.historyFloors)
      .map((mes) => `${String(mes.name || '').trim() || '旁白'}：${resolve(String(mes.mes).trim())}`);
    if (historyLines.length) tavernText = historyLines.join('\n');
  }

  // 最新的 iPhone_Message 记录楼层（与上面的酒馆 history 相反，这里只要它）：
  // 楼层里是同步过的 QQ 聊天记录，可能包含多位联系人的记录段；清空聊天后它就
  // 是仅存的历史。只取最新一块（从最后一楼往前找），超长截尾保留最近记录。
  let floorLogText = '';
  if (preset.latestFloor) {
    const chatFloors = Array.isArray(ctx?.chat) ? ctx.chat : [];
    for (let i = chatFloors.length - 1; i >= 0; i -= 1) {
      const inner = iphoneExtractMessageFloorInner(chatFloors[i]?.mes);
      if (inner == null) continue;
      const text = resolve(String(inner).trim());
      if (!text) break;
      if (text.length > IPHONE_QQ_FLOOR_LOG_CAP) {
        let cut = text.slice(-IPHONE_QQ_FLOOR_LOG_CAP);
        const newlineAt = cut.indexOf('\n');
        if (newlineAt >= 0) cut = cut.slice(newlineAt + 1);
        floorLogText = `……（更早的记录已略）\n${cut}`;
      } else {
        floorLogText = text;
      }
      break;
    }
  }

  // 输出格式约定。兼容旧版存储的预设：正文自带「【输出格式】」标题，如今标识
  // 由介绍行 + XML 标签承担，剥掉避免重复。
  const format = preset.format.trim().replace(/^【输出格式】\s*/, '');

  const sysParts = [];
  if (persona) {
    sysParts.push(`<roleplay_instructions>\n${fill(persona)}\n</roleplay_instructions>`);
  }

  // 结构说明：把本次实际附带的段一一点名（没附带的段不列，免得模型去找不存
  // 在的标签）；聊天记录不是一段文本，单独说明其呈现方式与两个角色的身份。
  const outlineItems = [];
  if (persona) outlineItems.push('<roleplay_instructions>…</roleplay_instructions>：角色扮演指令，约束你的扮演方式；');
  if (npcLogic) outlineItems.push('<npc_logic>…</npc_logic>：扮演逻辑——「先是人，后是设定」，按自身立场与动机行事；');
  if (dialogueGuidance) outlineItems.push('<dialogue_guidance>…</dialogue_guidance>：对白规范——口语化、生活化、带情绪与立场，禁止播报腔；');
  if (membersText) outlineItems.push(`<group_members>…</group_members>：本群成员列表——除玩家（${userName}）外的每位成员都由你扮演，输出时用行首名字区分发言人；`);
  if (worldText) outlineItems.push('<world_info>…</world_info>：当前场景的世界书设定，包含世界观与相关人物的资料；');
  if (tavernText) outlineItems.push('<tavern_context>…</tavern_context>：酒馆主线的最近对话（时间旧→新），是你当前所处的剧情背景；');
  if (floorLogText) outlineItems.push('<qq_chat_log>…</qq_chat_log>：最近一次同步到酒馆楼层的QQ聊天记录，可能包含多个联系人/群聊的记录段（每段各自用方括号标签包裹，如 [QQ_私聊_名字] / [微信_群聊_群名] / [朋友圈动态]），供你了解最近的聊天情况；');
  if (format) outlineItems.push('<output_format>…</output_format>：回复格式要求，位于提示词末尾，必须严格遵守；');
  if (outlineItems.length) {
    outlineItems.push(isGroup
      ? `聊天记录：接下来的 user / assistant 消息就是本群聊的聊天记录，每条按「发送者：「消息内容」」的样式呈现——user 是玩家（${userName}）发出的消息，assistant 是群成员以前发出的消息（行首名字标明发言人）。`
      : `聊天记录：接下来的 user / assistant 消息就是本 QQ 会话的聊天记录，每条按「发送者：「消息内容」」的样式呈现——user 是「${userName}」发出的消息，assistant 是你（${entityName}）以前发出的消息。`);
    sysParts.push('【提示词结构说明】本次请求的提示词由以下部分组成，除聊天记录外均已用 XML 标签包裹并附介绍：\n'
      + outlineItems.map((item) => `- ${item}`).join('\n'));
  }

  // 扮演逻辑与对白规范：默认附带，插在结构说明之后、世界书之前——先讲清楚
  // 「怎么演、怎么说」，再看背景资料；设置里清空即整段不附带。内置文案按
  // 聊天场景改写自写作向的指导框架。
  if (npcLogic) {
    sysParts.push(`以下是扮演逻辑指导（决定你如何理解与演绎角色）：\n<npc_logic>\n${fillGuide(npcLogic)}\n</npc_logic>`);
  }
  if (dialogueGuidance) {
    sysParts.push(`以下是对白规范（决定你如何说话）：\n<dialogue_guidance>\n${fillGuide(dialogueGuidance)}\n</dialogue_guidance>`);
  }

  // 群成员列表：插在对白规范之后、世界书之前——先明确「群里都有谁」再看资料。
  if (membersText) {
    sysParts.push(`以下是本群成员列表（玩家「${userName}」也是群成员，由玩家亲自扮演，不在此列）：\n<group_members>\n${membersText}\n</group_members>`);
  }

  if (worldText) {
    sysParts.push(`以下是当前场景的世界书设定（世界观与人物资料）：\n<world_info>\n${worldText}\n</world_info>`);
  }
  if (tavernText) {
    sysParts.push(`以下是酒馆主线的最近对话（时间旧→新），是你当前所处的剧情背景：\n<tavern_context>\n${tavernText}\n</tavern_context>`);
  }
  if (floorLogText) {
    sysParts.push(`以下是最近一次同步到酒馆楼层的QQ聊天记录，可能包含多个联系人/群聊的记录段（每段各自用方括号标签包裹，如 [QQ_私聊_名字] / [微信_群聊_群名] / [朋友圈动态]）：\n<qq_chat_log>\n${floorLogText}\n</qq_chat_log>`);
  }
  if (format) {
    sysParts.push(`以下是回复格式要求，必须严格遵守：\n<output_format>\n${fill(format)}\n</output_format>`);
  }

  // 聊天记录按输出格式同款「发送者：「内容」」排版；多行内容按行拆成多条，
  // 与「一行一条消息」的约定一致。群聊 assistant 行首写当时的发言人。
  const formatHistoryMessage = (msg) => {
    const speaker = msg.role === 'assistant'
      ? (isGroup ? (String(msg.name || '').trim() || '群成员') : entityName)
      : userName;
    const paras = resolve(String(msg.content ?? '')).split(/\n+/).map((p) => p.trim()).filter(Boolean);
    return paras.map((p) => `${speaker}：「${p}」`).join('\n');
  };

  return [
    { role: 'system', content: sysParts.join('\n\n') },
    ...conversation.map((msg) => ({ role: msg.role, content: formatHistoryMessage(msg) })),
  ];
}

// 解析 AI 回复为多条 QQ 消息：约定每条 `名字：「内容」`。通常一条一行；也容忍
// 模型把多条挤在同一行（逐段扫描，段间残余文字并入上一条），内容里嵌套「」时
// 取到本段最后一个」收尾。没有任何格式段的行并入上一条（多行内容）；整段没
// 有任何格式段时把原文整体作为一条消息兜底，保证总有回复可显示。上限 10 条，
// 防模型失控刷屏。返回 [{ name, content }]：name 是行首发言人（私聊忽略，群聊
// 用它区分气泡归属；裸行并入的条目 name 为空，由调用方补全）。
function iphoneParseQqReplyEntries(text) {
  const source = String(text ?? '').replace(/\r\n?/g, '\n');
  const parsed = [];
  const pushBare = (line) => {
    if (!line) return;
    if (parsed.length) parsed[parsed.length - 1].content += `\n${line}`;
    else parsed.push({ name: '', content: line });
  };
  for (const raw of source.split('\n')) {
    const line = raw.trim();
    if (!line) continue;
    // 名字字符类排除 」：否则第二段的匹配会把前一段的收尾括号连同内容吞进
    // 「名字」里，整行只剩最后一段能解析出来。
    const openers = [...line.matchAll(/([^：「」\n]{1,30})：「/g)];
    if (!openers.length) {
      pushBare(line);
      continue;
    }
    for (let i = 0; i < openers.length; i += 1) {
      const opener = openers[i];
      if (i === 0 && opener.index > 0) pushBare(line.slice(0, opener.index).trim());
      const nameEnd = opener.index + opener[0].length;
      const region = line.slice(nameEnd, i + 1 < openers.length ? openers[i + 1].index : line.length);
      const close = region.lastIndexOf('」');
      if (close < 0) {
        pushBare(region.trim());
        continue;
      }
      const content = region.slice(0, close).trim();
      if (content) parsed.push({ name: opener[1].trim(), content });
      const remainder = region.slice(close + 1).trim();
      if (remainder) pushBare(remainder);
    }
  }
  if (!parsed.length) {
    const fallback = source.trim();
    if (fallback) parsed.push({ name: '', content: fallback });
  }
  return parsed.slice(0, 10);
}

// 私聊解析：发言人恒为联系人本身，只取内容。
function iphoneParseQqChatReply(text) {
  return iphoneParseQqReplyEntries(text).map((entry) => entry.content);
}

// 群聊解析：在通用解析之上补全发言人——name 为空的条目（裸行并入 / 整段兜底）
// 沿用上一条的发言成员，开头没有可沿用时落到成员列表第一位；名单外的名字
//（模型自创的）原样保留，渲染时以名字首字字牌兜底。
function iphoneParseQqGroupReply(text, memberNames) {
  const names = (Array.isArray(memberNames) ? memberNames : [])
    .map((name) => String(name || '').trim())
    .filter(Boolean);
  const entries = iphoneParseQqReplyEntries(text);
  let last = names[0] || '群成员';
  for (const entry of entries) {
    if (entry.name) last = entry.name;
    else entry.name = last;
  }
  return entries;
}

// QQ空间动态解析（v0.15.0 区块格式）：一条动态一个区块——首行 `联系人名：「动态
// 正文」`，后接可选的 `点赞：A、B` 行与 `评论：` 块（块内每行一条评论：`评论人：
// 内容`；回复写作 `回复人 回复 被回复人：内容`）。返回
// [{ name, text, likes: [名], comments: [{ name, text, replyName? }] }]；一个区块都
// 没解析出来时返回 []（调用方回退聊天行格式，退化成纯文字动态）。区块首行与评论
// 行的分界：动态正文必须用「」包裹，评论内容不包裹。
// QQ空间动态解析：把模型回复按「动态区块」拆成 {name, text, likes, comments}。
// 对真实模型的格式抖动做容错：容忍代码围栏、行首序号 / 列表符号；正文行支持
// 「」『』与英文引号，漏写引号的 `名字：内容` 也按动态收；点赞行支持 @ 前缀与
// 中英文分隔符；评论块内每行一条评论，容忍「A 回复 B：内容」与「B 回复 A 的评论」。
// 评论块内的引号行默认按评论收（模型给评论内容也裹引号）；只有当它后面紧跟
// 「点赞：/评论：」时才视为下一条动态的开头——评论不会自带点赞，动态块会。
function iphoneParseQqDynamicsReply(text) {
  const dynamics = [];
  const pushComment = (name, replyName, ctext) => {
    const last = dynamics[dynamics.length - 1];
    const raw = String(ctext || '').trim();
    if (!last || !name || !raw) return;
    // 模型把引号带进评论内容时，剥掉对称的包裹
    const paired = raw.length > 1
      && ((raw.startsWith('「') && raw.endsWith('」'))
        || (raw.startsWith('『') && raw.endsWith('』'))
        || (raw.startsWith('\x22') && raw.endsWith('\x22'))
        || (raw.startsWith('“') && raw.endsWith('”')));
    const comment = { name, text: paired ? raw.slice(1, -1).trim() : raw };
    const reply = String(replyName || '').trim().replace(/的评论$|的回复$/, '').trim();
    if (reply && reply !== name) comment.replyName = reply;
    last.comments.push(comment);
  };
  const pushDynamic = (name, text) => {
    dynamics.push({ name: String(name || '').trim(), text: String(text || '').trim(), likes: [], comments: [] });
  };
  const lines = String(text ?? '').split(/\r?\n/)
    // 行首的 `◆` 是楼层动态段的块标记（见 QQ空间 / 朋友圈的楼层同步），预设里开了
    // 「最近楼层」时模型会照着楼层日志把它抄进回复：不剥掉的话发布者名会带上标记，
    // 对不上联系人名单，整条动态被丢
    .map((l) => l.trim().replace(/^(?:```+.*|[-•*◆]\s+|\d{1,2}[.、)]\s+)/, '').trim())
    .filter((l) => !l.startsWith('```'));
  // i 行之后的第一条非空行（用于判断评论块里的引号行是不是新动态的开头）
  const nextNonEmpty = (i) => {
    for (let j = i + 1; j < lines.length; j += 1) {
      if (lines[j]) return lines[j];
    }
    return '';
  };
  const matchQuotedDynamic = (line) => line.match(/^([^：「」『』\x22\u201C\u201D']{1,30})[:：]\s*[「『](.+)[」』]\s*$/)
    || line.match(/^([^：「」『』\x22\u201C\u201D']{1,30})[:：]\s*[\x22\u201C](.+)[\x22\u201D]\s*$/);
  let inComments = false;
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    if (!line) continue;
    // 点赞行：`点赞：A、B`（支持 @ 前缀与中英文分隔符，「无 / 暂无」不收）
    const likeMatch = line.match(/^点赞[:：]\s*(.+)$/);
    if (likeMatch && dynamics.length) {
      inComments = false;
      const last = dynamics[dynamics.length - 1];
      for (const part of likeMatch[1].split(/[、，,]/)) {
        const name = part.trim().replace(/^@+/, '').slice(0, 24);
        if (!name || /^(无|暂无|没人|无人)$/.test(name)) continue;
        if (!last.likes.includes(name)) last.likes.push(name);
      }
      continue;
    }
    // 评论块头：`评论：`（同一行带内容时顺带解析出第一条评论）
    const commentHead = line.match(/^评论[:：]\s*(.*)$/);
    if (commentHead && dynamics.length) {
      inComments = true;
      if (commentHead[1]) {
        const inline = commentHead[1].match(/^([^：:\n]{1,30}?)(?:\s+回复\s+([^：:\n]{1,30}?))?\s*[:：](.+)$/);
        if (inline) pushComment(inline[1].trim(), (inline[2] || '').trim(), inline[3]);
      }
      continue;
    }
    // 评论块内的行默认按评论收，不再当动态（引号开头的下一条动态靠前瞻识别）
    if (inComments && dynamics.length) {
      const startsBlock = matchQuotedDynamic(line)
        && /^(点赞|评论)[:：]/.test(nextNonEmpty(i));
      if (!startsBlock) {
        const cMatch = line.match(/^(?:[-•*]\s*)?([^：:\n]{1,30}?)(?:\s+回复\s+([^：:\n]{1,30}?))?\s*[:：]\s*(.+)$/);
        if (cMatch) pushComment(cMatch[1].trim(), (cMatch[2] || '').trim(), cMatch[3]);
        continue;
      }
    }
    // 区块首行：`联系人名：「动态正文」`（正文贪婪匹配到行尾的收引号）
    const dynMatch = matchQuotedDynamic(line);
    if (dynMatch) {
      pushDynamic(dynMatch[1], dynMatch[2]);
      inComments = false;
      continue;
    }
    if (inComments && dynamics.length) continue;
    // 无引号的动态行：`联系人名：动态正文`（模型漏写引号时别把整条丢掉）；
    // 跳过点赞 / 评论等保留字开头的行
    const bare = line.match(/^([^：:\n]{1,30})[:：]\s*(.+)$/);
    if (bare && !/^(点赞|评论|转发|分享|浏览|阅读|来源|位置|心情|说明|备注)$/.test(bare[1].trim())) {
      pushDynamic(bare[1], bare[2]);
    }
  }
  return dynamics;
}

// QQ空间回复解析（v0.17.0）：把 AI 回复按评论行拆成 [{ name, text, replyName? }]。
// 约定每行一条 `评论人：内容`，回复写作 `评论人 回复 被回复人：内容`；对格式抖动
// 做容错：容忍代码围栏、行首序号 / 列表符号、对称包裹的引号（模型给评论内容裹
// 引号）、「B 回复 A 的评论」式后缀与「评论：/点赞：」等保留行；没有任何格式段
// 的行并入上一条（多行内容）；整段都没有格式段时返回 []，由调用方做兜底。
function iphoneParseQqDynamicReplyLines(text) {
  const entries = [];
  const pushBare = (line) => {
    if (!line || !entries.length) return;
    entries[entries.length - 1].text += ` ${line}`;
  };
  const pushEntry = (name, replyName, content) => {
    const cname = String(name || '').trim();
    let ctext = String(content || '').trim();
    if (!cname || !ctext) return;
    // 模型把引号带进评论内容时，剥掉对称的包裹
    const paired = ctext.length > 1
      && ((ctext.startsWith('「') && ctext.endsWith('」'))
        || (ctext.startsWith('『') && ctext.endsWith('』'))
        || (ctext.startsWith('\x22') && ctext.endsWith('\x22'))
        || (ctext.startsWith('“') && ctext.endsWith('”')));
    if (paired) ctext = ctext.slice(1, -1).trim();
    if (!ctext) return;
    const entry = { name: cname, text: ctext };
    const reply = String(replyName || '').trim().replace(/的评论$|的回复$/, '').trim();
    if (reply && reply !== cname) entry.replyName = reply;
    entries.push(entry);
  };
  const lines = String(text ?? '').split(/\r?\n/)
    .map((l) => l.trim().replace(/^(?:```+.*|[-•*]\s+|\d{1,2}[.、)]\s+)/, '').trim())
    .filter((l) => l && !l.startsWith('```'));
  for (const line of lines) {
    // 保留行：点赞 / 评论块头（评论块头带内容时按第一条评论收）
    if (/^点赞[:：]/.test(line)) continue;
    const head = line.match(/^评论[:：]\s*(.*)$/);
    if (head) {
      if (head[1]) {
        const inline = head[1].match(/^([^：:\n]{1,30}?)(?:\s+回复\s+([^：:\n]{1,30}?))?\s*[:：](.+)$/);
        if (inline) pushEntry(inline[1], inline[2], inline[3]);
        else pushBare(head[1].trim());
      }
      continue;
    }
    const matched = line.match(/^([^：:\n]{1,30}?)(?:\s+回复\s+([^：:\n]{1,30}?))?\s*[:：]\s*(.+)$/);
    if (matched && !/^(转发|分享|浏览|阅读|来源|位置|心情|说明|备注)$/.test(matched[1].trim())) {
      pushEntry(matched[1], matched[2], matched[3]);
      continue;
    }
    pushBare(line);
  }
  return entries.slice(0, 6);
}

// QQ空间 · 个人空间头资料（同页顶部：横幅 / 昵称徽章 / 五宫格 / 分享条）。
// 昵称与大头像不在此处写死：统一走「我的资料」（data-me-name / data-me-avatar）。
const IPHONE_QZONE_PROFILE = Object.freeze({
  total: '3568',
  funcs: [
    { icon: 'fSay', label: '说说' },
    { icon: 'fLog', label: '日志' },
    { icon: 'fAlbum', label: '相册' },
    { icon: 'fMsg', label: '留言' },
    { icon: 'fMore', label: '更多' },
  ],
});

// 好友/群聊通用头像：内置款式加覆盖类，自定义图直接内联背景（引号转义防注入），
// 否则回退名字首字字牌（群聊蓝渐变 --g1、好友橙渐变 --g2）。
function iphoneQqBuildEntityAvatar(entity, kind) {
  const el = document.createElement('span');
  el.className = 'iphone-qq__avatar';
  const avatar = entity.avatar;
  if (avatar && avatar.preset) {
    el.classList.add(`iphone-qq__avatar--${avatar.preset}`);
  } else if (avatar && avatar.url) {
    el.style.backgroundImage = `url("${String(avatar.url).replace(/"/g, '%22')}")`;
  } else {
    el.classList.add(kind === 'group' ? 'iphone-qq__avatar--g1' : 'iphone-qq__avatar--g2');
    el.textContent = (entity.name || '?').trim().charAt(0).toUpperCase() || '?';
  }
  return el;
}

// ---------- QQ 消息页会话行（好友 / 群聊各一行，预览最后一条消息） ----------
function iphoneQqBuildChatItem(entity, onOpen) {
  const item = document.createElement('li');
  item.className = 'iphone-qq__chat';
  item.appendChild(iphoneQqBuildEntityAvatar(entity, entity.kind));
  const main = document.createElement('div');
  main.className = 'iphone-qq__chat-main';
  const line = document.createElement('div');
  line.className = 'iphone-qq__chat-line';
  const title = document.createElement('span');
  title.className = 'iphone-qq__chat-title';
  title.textContent = entity.name;
  line.appendChild(title);
  const preview = document.createElement('p');
  preview.className = 'iphone-qq__chat-preview';
  const lastMsg = Array.isArray(entity.messages) && entity.messages.length
    ? entity.messages[entity.messages.length - 1]
    : null;
  if (lastMsg) {
    // 群聊里别人发的消息带发言人名；多行内容压成一行预览
    const who = lastMsg.role === 'user'
      ? '我：'
      : (entity.kind === 'group' && lastMsg.name ? `${lastMsg.name}：` : '');
    preview.textContent = `${who}${String(lastMsg.content).replace(/\s+/g, ' ')}`.slice(0, 40);
  } else {
    preview.textContent = '暂无消息';
  }
  main.append(line, preview);
  item.appendChild(main);
  item.addEventListener('click', () => onOpen(entity));
  return item;
}

// ---------- QQ 聊天页（好友 / 群聊会话） ----------
// onMenu：右上角菜单回调，参数是聊天页操作集 { clearMessages }（好友进好友资料页、
// 群聊进群聊资料页，操作集与「删除联系人/删除群聊」回调转交资料页）；
// qqScreen：发消息写回 qqData 后刷新会话列表用。
// 好友会话：聊天记录渲染成气泡，「发送」按系统提示词 + 世界书 + 酒馆 history +
// 输出格式约定请求模型，回复解析成多条气泡；长按 / 右键气泡可删除单条。
// 群聊会话（v0.12.0 起）：AI 同时扮演除玩家外的所有群成员——请求多带一段
// <group_members> 成员列表，回复按「成员名：「内容」」解析，气泡左侧带头像与
// 发言人名字标签；长按 / 右键气泡可删除单条，右上角菜单进群聊资料页
//（编辑群资料、拉人入群、清空聊天消息、删除群聊）；记录与楼层游标都挂在群聊实体上，与好友同套读写。
function iphoneQqBuildChatView(entity, icons, onBack, onMenu, qqScreen) {
  const isGroup = entity.kind === 'group';
  const view = document.createElement('div');
  view.className = 'iphone-qqc';

  // 头部：返回 + 标题（群聊为「群名(成员数)」，对照真实 QQ）+ 状态行 + 菜单
  //（无头像无耳朵；状态行：好友绿点在线、群聊成员数（含自己））
  const header = document.createElement('header');
  header.className = 'iphone-qqc__header';
  header.innerHTML = `
    <button type="button" class="iphone-qqc__back" aria-label="返回">${icons.back}</button>
    <div class="iphone-qqc__identity">
      <p class="iphone-qqc__title"></p>
      <p class="iphone-qqc__status"></p>
    </div>
    <button type="button" class="iphone-qqc__menu" aria-label="聊天设置">${icons.menu}</button>
  `;
  header.querySelector('.iphone-qqc__back').addEventListener('click', onBack);
  if (onMenu) header.querySelector('.iphone-qqc__menu').addEventListener('click', () => onMenu(chatApi));
  header.querySelector('.iphone-qqc__title').textContent = isGroup
    ? `${entity.name}(${entity.memberIds.length + 1})`
    : entity.name || '';

  const status = header.querySelector('.iphone-qqc__status');
  if (isGroup) {
    status.textContent = `${entity.memberIds.length + 1} 位成员`;
  } else {
    status.innerHTML = '<i class="iphone-qq__status-dot"></i>';
    status.appendChild(document.createTextNode('在线'));
  }

  // 消息流：按聊天记录渲染气泡（我方右蓝、对方/群成员左白带头像），无记录以系统行开场
  const stream = document.createElement('div');
  stream.className = 'iphone-qqc__stream';
  const messages = Array.isArray(entity.messages) ? entity.messages.slice() : [];
  const scrollStreamToBottom = () => { stream.scrollTop = stream.scrollHeight; };

  // 群聊成员头像表：发言人名字 → 好友头像；查不到（名单外名字）由头像构建器
  // 以名字首字字牌兜底。建表一次，会话期间成员头像不变。
  const memberAvatars = new Map();
  if (isGroup) {
    const data = iphoneGetQqData();
    (Array.isArray(entity.memberIds) ? entity.memberIds : []).forEach((id) => {
      const member = data.friends.find((f) => f.id === id);
      if (member) memberAvatars.set(member.name, member.avatar);
    });
  }

  // 在 qqData 里找本会话（好友或群聊）：聊天记录、楼层游标的读写都落在它身上
  const findEntity = (data) => data.friends.find((f) => f.id === entity.id)
    || data.groups.find((g) => g.id === entity.id);

  // 删除单条消息：本地数组与 qqData 一起删。楼层是追加式记录，旧行保留；只把
  // floorSynced 游标回退（删的是已同步消息时减一），保证之后的同步不重不漏。
  const deleteMessage = (index) => {
    if (index < 0 || index >= messages.length) return;
    messages.splice(index, 1);
    const data = iphoneGetQqData();
    const target = findEntity(data);
    if (target) {
      if (index < (Number(target.floorSynced) || 0)) {
        target.floorSynced = Math.max(0, (Number(target.floorSynced) || 0) - 1);
      }
      target.messages = messages.slice();
    }
    iphoneSetQqData(qqScreen, data);
    renderMessages();
  };

  // 长按（按住 550ms）或右键气泡：弹出深色操作菜单（删除）。点空白处收起。
  const attachBubbleActions = (row, bubble, index) => {
    const showMenu = () => {
      stream.querySelectorAll('.iphone-qqc__msgmenu').forEach((el) => el.remove());
          const menu = document.createElement('div');
          menu.className = 'iphone-qqc__msgmenu';
          // 贴近消息流顶部的气泡菜单朝下弹，避免被流上缘裁掉
          const topGap = row.getBoundingClientRect().top - stream.getBoundingClientRect().top;
          menu.classList.toggle('iphone-qqc__msgmenu--below', topGap < 140);
      const item = document.createElement('button');
      item.type = 'button';
      item.className = 'iphone-qqc__msgmenu-item';
      item.textContent = '删除';
      item.addEventListener('click', (event) => {
        event.stopPropagation();
        menu.remove();
        deleteMessage(index);
      });
      menu.appendChild(item);
      row.appendChild(menu);
    };
    let pressTimer = 0;
    const cancelPress = () => globalThis.clearTimeout(pressTimer);
    bubble.addEventListener('contextmenu', (event) => {
      event.preventDefault();
      showMenu();
    });
    bubble.addEventListener('pointerdown', (event) => {
      if (event.button !== undefined && event.button !== 0) return;
      const startX = event.clientX;
      const startY = event.clientY;
      cancelPress();
      pressTimer = globalThis.setTimeout(showMenu, 550);
      bubble.addEventListener('pointerup', cancelPress, { once: true });
      bubble.addEventListener('pointercancel', cancelPress, { once: true });
      bubble.addEventListener('pointermove', (move) => {
        if (Math.abs(move.clientX - startX) > 10 || Math.abs(move.clientY - startY) > 10) {
          cancelPress();
        }
      }, { once: true });
    });
  };

  const renderMessages = () => {
    stream.innerHTML = '';
    if (!messages.length) {
      const sys = document.createElement('p');
      sys.className = 'iphone-qqc__sys';
      sys.textContent = isGroup
        ? `欢迎加入「${entity.name}」，和大家打个招呼吧！`
        : '你们已经是好友了，现在可以开始聊天了！';
      stream.appendChild(sys);
      return;
    }
    messages.forEach((msg, index) => {
      const isMine = msg.role === 'user';
      const row = document.createElement('div');
      row.className = `iphone-qqc__msg${isMine ? ' iphone-qqc__msg--out' : ''}`;
      const bubble = document.createElement('div');
      bubble.className = 'iphone-qqc__bubble';
      for (const para of String(msg.content).split(/\n+/)) {
        if (!para.trim()) continue;
        const p = document.createElement('p');
        p.textContent = para;
        bubble.appendChild(p);
      }
      if (isMine) {
        row.appendChild(bubble);
      } else {
        // 对方 / 群成员：左白气泡带头像；群聊再加一列（发言人名字标签 + 气泡）
        row.appendChild(isGroup
          ? iphoneQqBuildEntityAvatar({ name: msg.name, avatar: memberAvatars.get(msg.name) ?? null }, 'friend')
          : iphoneQqBuildEntityAvatar(entity, 'friend'));
        const col = document.createElement('div');
        col.className = 'iphone-qqc__msgcol';
        if (isGroup) {
          const nameEl = document.createElement('p');
          nameEl.className = 'iphone-qqc__mname';
          nameEl.textContent = String(msg.name || '').trim() || '群成员';
          col.appendChild(nameEl);
        }
        col.appendChild(bubble);
        row.appendChild(col);
      }
      attachBubbleActions(row, bubble, index);
      stream.appendChild(row);
    });
  };
  renderMessages();
  // 点消息流空白处收起气泡菜单
  stream.addEventListener('click', () => {
    stream.querySelectorAll('.iphone-qqc__msgmenu').forEach((el) => el.remove());
  });

  // 输入栏：真输入框 + 发送（好友/群聊会话都调 API 对话）
  const composer = document.createElement('footer');
  composer.className = 'iphone-qqc__composer';
  composer.innerHTML = `
    <div class="iphone-qqc__inputrow">
      <input type="text" class="iphone-qqc__input" aria-label="输入消息"
        maxlength="2000" autocomplete="off" spellcheck="false">
      <button type="button" class="iphone-qqc__send">发送</button>
    </div>
    <div class="iphone-qqc__tools" aria-hidden="true">
      <span class="iphone-qqc__tool">${icons.mic}</span>
      <span class="iphone-qqc__tool">${icons.image}</span>
      <span class="iphone-qqc__tool">${icons.camera}</span>
      <span class="iphone-qqc__tool">${icons.cool}</span>
      <span class="iphone-qqc__tool">${icons.smiley}</span>
      <span class="iphone-qqc__tool">${icons.plusCircle}</span>
    </div>
  `;
  const input = composer.querySelector('.iphone-qqc__input');
  const sendBtn = composer.querySelector('.iphone-qqc__send');

  // 发送键随输入变色（QQ 同款）：输入框有字时转深色高亮，清空后回到浅色
  const refreshSendState = () => {
    sendBtn.classList.toggle('is-active', Boolean(input.value.trim()));
  };
  input.addEventListener('input', refreshSendState);
  refreshSendState();

  // 聊天记录写回 qqData（iphoneSetQqData 顺带刷新会话列表）
  const persistMessages = () => {
    const data = iphoneGetQqData();
    const target = findEntity(data);
    if (!target) return;
    target.messages = messages.slice();
    iphoneSetQqData(qqScreen, data);
  };

  // 清空聊天消息（好友资料页「清空聊天消息」经 onMenu 传出的 chatApi 调用）：
  // 本地数组、qqData 与楼层游标一起清零——楼层已写入的旧行保留，之后的新消息
  // 从空记录续写，不会把旧行重写一遍。
  const clearMessages = () => {
    messages.length = 0;
    const data = iphoneGetQqData();
    const target = findEntity(data);
    if (target) {
      target.messages = [];
      target.floorSynced = 0;
    }
    iphoneSetQqData(qqScreen, data);
    renderMessages();
    scrollStreamToBottom();
  };
  const chatApi = { clearMessages };

  // 「对方正在输入…」占位气泡：请求期间挂在消息流尾部，完成后移除（群聊为
  // 「有人正在输入…」，配群头像字牌）
  let typingRow = null;
  const showTyping = () => {
    typingRow = document.createElement('div');
    typingRow.className = 'iphone-qqc__msg';
    typingRow.appendChild(iphoneQqBuildEntityAvatar(entity, isGroup ? 'group' : 'friend'));
    const bubble = document.createElement('div');
    bubble.className = 'iphone-qqc__bubble iphone-qqc__bubble--typing';
    bubble.textContent = isGroup ? '有人正在输入…' : '对方正在输入…';
    typingRow.appendChild(bubble);
    stream.appendChild(typingRow);
    scrollStreamToBottom();
  };
  const hideTyping = () => {
    typingRow?.remove();
    typingRow = null;
  };

  let sending = false;
  const sendMessage = async () => {
    if (sending) return;
    const text = input.value.trim();
    if (!text) return;
    input.value = '';
    refreshSendState();
    messages.push({ role: 'user', content: text });
    persistMessages();
    renderMessages();
    scrollStreamToBottom();
    // 新记录落 iPhone_Message 楼层（纵使 API 调用失败，发出的消息也已同步）
    void iphoneSyncQqChatFloor(entity.id);
    sending = true;
    showTyping();
    try {
      // system（角色扮演指令 / 结构说明 / 扮演与对白指导 / 群成员列表 / 世界书 /
      // 酒馆 history / 记录楼层 / 输出格式，各段 XML 包裹）+ 按格式排版的会话记录
      const requestMessages = await iphoneBuildQqChatRequestMessages(entity, messages);
      const reply = await iphoneRequestChatCompletion(iphoneGetSettings(), requestMessages);
      // 约定格式 `名：「内容」` 每行一条：解析成多条消息（无格式行则整段兜底一条）；
      // 群聊带发言人名字，解析不到名字时沿用上一条 / 落到成员列表第一位
      if (isGroup) {
        const data = iphoneGetQqData();
        const memberNames = (Array.isArray(entity.memberIds) ? entity.memberIds : [])
          .map((id) => data.friends.find((f) => f.id === id))
          .filter(Boolean)
          .map((f) => f.name)
          .filter(Boolean);
        for (const entry of iphoneParseQqGroupReply(reply, memberNames)) {
          messages.push({ role: 'assistant', content: entry.content, name: entry.name });
        }
      } else {
        for (const content of iphoneParseQqChatReply(reply)) {
          messages.push({ role: 'assistant', content });
        }
      }
      persistMessages();
      renderMessages();
      void iphoneSyncQqChatFloor(entity.id);
    } catch (error) {
      renderMessages();
      const errRow = document.createElement('p');
      errRow.className = 'iphone-qqc__sys iphone-qqc__sys--error';
      errRow.textContent = `消息发送失败：${String(error?.message || error)}`;
      stream.appendChild(errRow);
    } finally {
      hideTyping();
      sending = false;
      scrollStreamToBottom();
    }
  };
  sendBtn.addEventListener('click', sendMessage);
  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      sendMessage();
    }
  });

  view.appendChild(header);
  view.appendChild(stream);
  view.appendChild(composer);
  iphoneRefreshQqMeIdentity(view);
  return view;
}

// ---------- QQ 联系人页（按真实界面复刻：搜索 + 新朋友/群通知 + 分组/好友/群聊子页签） ----------
// 好友/群聊来自聊天文件（qqData）：页面骨架只建一次，面板内容可经 _render() 重建
//（添加好友 / 创建群聊后由 buildQqAppScreen 的 _renderQqSocial 调用）。
function iphoneQqBuildContactsPage(icons, onOpenChat, getData) {
  const page = document.createElement('div');
  // 必须保留 iphone-qq__tabpage + 初始 is-hidden：Tab 显隐全靠 .iphone-qq__tabpage.is-hidden
  page.className = 'iphone-qq__tabpage is-hidden iphone-qq__ctc';

  // 好友行：头像 + 名字 + 状态行（绿点 + 在线；QQ号不外显）
  function friendRow(friend) {
    const row = document.createElement('div');
    row.className = 'iphone-qq__ctc-friend';
    row.appendChild(iphoneQqBuildEntityAvatar(friend, 'friend'));
    const main = document.createElement('div');
    main.className = 'iphone-qq__ctc-fmain';
    const name = document.createElement('p');
    name.className = 'iphone-qq__ctc-fname';
    name.textContent = friend.name;
    const statusLine = document.createElement('p');
    statusLine.className = 'iphone-qq__ctc-fstatus';
    statusLine.innerHTML = '<i class="iphone-qq__ctc-dot"></i>';
    statusLine.appendChild(Object.assign(document.createElement('span'), { className: 'iphone-qq__ctc-online', textContent: '在线' }));
    main.append(name, statusLine);
    row.appendChild(main);
    row.addEventListener('click', () => onOpenChat({ kind: 'friend', ...friend }));
    return row;
  }

  // 群聊行：头像 + 群名 + 灰色成员数（含自己），点开聊天
  function groupRow(group) {
    const row = document.createElement('div');
    row.className = 'iphone-qq__ctc-friend';
    row.appendChild(iphoneQqBuildEntityAvatar(group, 'group'));
    const main = document.createElement('div');
    main.className = 'iphone-qq__ctc-fmain';
    const name = document.createElement('p');
    name.className = 'iphone-qq__ctc-fname';
    name.textContent = group.name;
    const statusLine = document.createElement('p');
    statusLine.className = 'iphone-qq__ctc-fstatus';
    statusLine.appendChild(Object.assign(document.createElement('span'), { className: 'iphone-qq__ctc-fsign', textContent: `${group.memberIds.length + 1}人` }));
    main.append(name, statusLine);
    row.appendChild(main);
    row.addEventListener('click', () => onOpenChat({ kind: 'group', ...group }));
    return row;
  }

  // 面板空态提示行
  function emptyHint(text) {
    const el = document.createElement('p');
    el.className = 'iphone-qq__ctc-empty';
    el.textContent = text;
    return el;
  }

  // —— 白色块一：搜索 + 新朋友 / 群通知（仅展示） ——
  const block1 = document.createElement('div');
  block1.className = 'iphone-qq__ctc-block';
  const search = document.createElement('div');
  search.className = 'iphone-qq__search';
  search.innerHTML = `${icons.search}<span>搜索</span>`;
  block1.appendChild(search);

  const notices = document.createElement('div');
  notices.className = 'iphone-qq__ctc-notices';
  for (const label of ['新朋友', '群通知']) {
    const row = document.createElement('div');
    row.className = 'iphone-qq__ctc-notice';
    row.innerHTML = `<span class="iphone-qq__ctc-notice-name">${label}</span><span class="iphone-qq__ctc-chev" aria-hidden="true">${icons.chevronRight}</span>`;
    notices.appendChild(row);
  }
  block1.appendChild(notices);

  // —— 白色块二：子页签（仅 分组/好友/群聊）+ 三个面板 ——
  const block2 = document.createElement('div');
  block2.className = 'iphone-qq__ctc-block';

  const tabBar = document.createElement('div');
  tabBar.className = 'iphone-qq__ctc-tabs';
  const panels = {};

  // 分组面板：分组头（▶/▼ 三角 + 计数，点击折叠/展开）+ 好友行
  const groupPanel = document.createElement('div');
  groupPanel.className = 'iphone-qq__ctc-panel';
  panels.group = groupPanel;

  // 好友面板：全部好友平铺
  const friendsPanel = document.createElement('div');
  friendsPanel.className = 'iphone-qq__ctc-panel is-hidden';
  panels.friends = friendsPanel;

  // 群聊面板
  const groupsPanel = document.createElement('div');
  groupsPanel.className = 'iphone-qq__ctc-panel is-hidden';
  panels.groups = groupsPanel;

  // 按当前 qqData 重建三个面板（特别关心固定为空；我的好友全员在线）
  function render() {
    const { friends, groups } = getData();
    groupPanel.innerHTML = '';
    const careSec = document.createElement('div');
    careSec.className = 'iphone-qq__ctc-group';
    careSec.innerHTML = `<div class="iphone-qq__ctc-ghead"><span class="iphone-qq__ctc-gtri" aria-hidden="true">${icons.chevronRight}</span><span class="iphone-qq__ctc-gname">特别关心</span><span class="iphone-qq__ctc-gcount">0/0</span></div><div class="iphone-qq__ctc-gbody" style="display:none;"></div>`;
    careSec.querySelector('.iphone-qq__ctc-ghead').addEventListener('click', () => {
      const open = careSec.classList.toggle('is-open');
      careSec.querySelector('.iphone-qq__ctc-gbody').style.display = open ? '' : 'none';
    });
    const mineSec = document.createElement('div');
    mineSec.className = 'iphone-qq__ctc-group is-open';
    mineSec.innerHTML = `<div class="iphone-qq__ctc-ghead"><span class="iphone-qq__ctc-gtri" aria-hidden="true">${icons.chevronRight}</span><span class="iphone-qq__ctc-gname">我的好友</span><span class="iphone-qq__ctc-gcount">${friends.length}/${friends.length}</span></div>`;
    const mineBody = document.createElement('div');
    mineBody.className = 'iphone-qq__ctc-gbody';
    for (const friend of friends) mineBody.appendChild(friendRow(friend));
    if (!friends.length) mineBody.appendChild(emptyHint('暂无好友'));
    mineSec.appendChild(mineBody);
    // 与「特别关心」同款：点分组头折叠/展开（默认展开）
    mineSec.querySelector('.iphone-qq__ctc-ghead').addEventListener('click', () => {
      const open = mineSec.classList.toggle('is-open');
      mineBody.style.display = open ? '' : 'none';
    });
    groupPanel.append(careSec, mineSec);

    friendsPanel.innerHTML = '';
    for (const friend of friends) friendsPanel.appendChild(friendRow(friend));
    if (!friends.length) friendsPanel.appendChild(emptyHint('暂无好友，去消息页右上角「+」添加'));

    groupsPanel.innerHTML = '';
    for (const group of groups) groupsPanel.appendChild(groupRow(group));
    if (!groups.length) groupsPanel.appendChild(emptyHint('暂无群聊，去消息页右上角「+」创建'));
  }
  page._render = render;
  render();

  const subTabs = [
    { key: 'group', label: '分组', active: true },
    { key: 'friends', label: '好友' },
    { key: 'groups', label: '群聊' },
  ];
  for (const tab of subTabs) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `iphone-qq__ctc-tab${tab.active ? ' is-active' : ''}`;
    btn.textContent = tab.label;
    btn.addEventListener('click', () => {
      tabBar.querySelectorAll('.iphone-qq__ctc-tab').forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      Object.entries(panels).forEach(([key, el]) => el.classList.toggle('is-hidden', key !== tab.key));
    });
    tabBar.appendChild(btn);
  }

  block2.appendChild(tabBar);
  block2.appendChild(groupPanel);
  block2.appendChild(friendsPanel);
  block2.appendChild(groupsPanel);

  const gap = document.createElement('div');
  gap.className = 'iphone-qq__ctc-gap';
  const tail = document.createElement('div');
  tail.className = 'iphone-qq__ctc-tail';

  page.appendChild(block1);
  page.appendChild(gap);
  page.appendChild(block2);
  page.appendChild(tail);
  return page;
}

// ---------- QQ 动态页（按需求仅保留“空间动态”入口） ----------
// ---------- QQ 动态页（入口列表；按真实界面复刻，仅「空间动态」可点，
// 其余入口纯展示不响应；缩略图为 GitHub fluent-emoji 位图，经 CSS 背景类加载） ----------
function iphoneQqBuildDynamicsPage(icons, onOpenQzone) {
  const page = document.createElement('div');
  // 必须保留 iphone-qq__tabpage + 初始 is-hidden：Tab 切换的显隐全靠它
  page.className = 'iphone-qq__tabpage is-hidden iphone-qq__dyn2';

  const groups = [
    [
      { icon: 'dynStar', label: '空间动态', action: onOpenQzone },
      { icon: 'dynBrain', label: '脑洞秀' },
    ],
    [
      { icon: 'dynGame', label: '游戏中心', sub: '金铲铲新赛季', thumb: 'game', dot: true },
      { icon: 'dynMini', label: '小游戏' },
      { icon: 'dynFarm', label: 'QQ经典农场', sub: '比熊狗狗上线', thumb: 'scroll', dot: true },
    ],
    [
      { icon: 'dynManhua', label: '漫剧' },
      { icon: 'dynCheese', label: '小说与动漫', sub: '我有个历史微信群', thumb: 'book', dot: true },
    ],
  ];

  groups.forEach((group, gi) => {
    // 第一块与搜索条同属一块白底；块间垫灰色间隔带
    const block = document.createElement('div');
    block.className = 'iphone-qq__dyn2-block';
    if (gi === 0) {
      const search = document.createElement('div');
      search.className = 'iphone-qq__search';
      search.innerHTML = `${icons.search}<span>搜索</span>`;
      block.appendChild(search);
    }
    for (const entry of group) {
      const row = document.createElement('div');
      row.className = `iphone-qq__dyn2-row${entry.action ? ' is-click' : ' is-static'}`;
      const side = (entry.sub || entry.thumb)
        ? `<span class="iphone-qq__dyn2-side">${
            entry.sub ? `<span class="iphone-qq__dyn2-sub">${entry.sub}</span>` : ''
          }${
            entry.thumb
              ? `<span class="iphone-qq__dyn2-thumb iphone-qq__dyn2-thumb--${entry.thumb}">${entry.dot ? '<i></i>' : ''}</span>`
              : ''
          }</span>`
        : '';
      row.innerHTML = `
        <span class="iphone-qq__dyn2-ico" aria-hidden="true">${icons[entry.icon]}</span>
        <p class="iphone-qq__dyn2-label">${entry.label}</p>
        ${side}
        <span class="iphone-qq__dyn2-chev" aria-hidden="true">${icons.chevronRight}</span>
      `;
      if (entry.action) row.addEventListener('click', entry.action);
      block.appendChild(row);
    }
    page.appendChild(block);
    if (gi < groups.length - 1) {
      const gap = document.createElement('div');
      gap.className = 'iphone-qq__dyn2-gap';
      page.appendChild(gap);
    }
  });

  // 列表之后的留白保持页面灰底
  const tail = document.createElement('div');
  tail.className = 'iphone-qq__dyn2-tail';
  page.appendChild(tail);
  return page;
}

// ---------- QQ空间 · 个人空间（同页滚动：顶部横幅/资料区，向下即好友动态流） ----------
// identity：传好友资料时渲染「她的QQ空间」（头像/名字用她，不带 data-me 钩子）；
// 不传即「我的空间」，昵称与头像走 data-me 钩子统一由「我的资料」刷新。
// visitorId：访客空间的归属联系人 id；有值时动态流只渲染 TA 发的动态，下拉刷新
// 也只让 TA 发新动态（我的空间不传，看到的是所有联系人的动态）。
// qqScreen：宿主屏幕挂钩，动态改动经 iphoneSetQqData 落盘并刷新会话列表。
// 动态流（v0.14.0）：默认一条没有；顶部下拉刷新时调用一次对话 API，由 AI 结合
// 提示词（世界书 + 酒馆最近 5 楼 + 联系人名单）挑选 1~3 位联系人各发一条纯文字
// 动态，成功后落盘并同步进 iPhone_Message 楼层的「QQ空间动态：」段（外层包
// <QQ空间动态> 标签，v0.21.0 起，v0.23.0 起改方括号）；发布者必须
// 是已有联系人，联系人被删后其动态随归一化自动消失。
function iphoneQqBuildQzoneView(icons, onBack, onOpenProfile, identity, qqScreen, visitorId) {
  const view = document.createElement('div');
  view.className = 'iphone-qqz';
  const p = IPHONE_QZONE_PROFILE;

  // 悬浮导航：未滚动时是横幅上的透明圆钮 /「空友爱看」胶囊；
  // 滚过横幅后切换为白色「空间动态」标题栏（.is-scrolled，见 CSS）。
  const nav = document.createElement('header');
  nav.className = 'iphone-qqz__nav';
  nav.innerHTML = `
    <div class="iphone-qqz__nav-cover">
      <button type="button" class="iphone-qqz__navcircle iphone-qqz__cover-back" aria-label="返回">${icons.back}</button>
      <span class="iphone-qqz__navpill" aria-hidden="true">${icons.heartHands}<i>空友爱看</i></span>
      <span class="iphone-qqz__navcircle" aria-hidden="true">${icons.bell}</span>
      <span class="iphone-qqz__navcircle" aria-hidden="true">${icons.gear}</span>
    </div>
    <div class="iphone-qqz__nav-solid">
      <button type="button" class="iphone-qqz__back" aria-label="返回">${icons.back}</button>
      <p class="iphone-qqz__title">空间动态</p>
      <div class="iphone-qqz__nav-right">
        <span class="iphone-qqz__nav-ico" aria-hidden="true">${icons.heartHands}</span>
        <button type="button" class="iphone-qqz__compose" aria-label="发动态">${icons.pencil}</button>
      </div>
    </div>
  `;
  nav.querySelectorAll('.iphone-qqz__cover-back, .iphone-qqz__back').forEach((btn) => {
    btn.addEventListener('click', onBack);
  });

  const scroll = document.createElement('div');
  scroll.className = 'iphone-qqz__scroll';

  // —— 下拉刷新指示器：滚动区第一个子元素，高度由手势驱动（0 = 收起） ——
  const indicator = document.createElement('div');
  indicator.className = 'iphone-qqz__refresh';
  indicator.innerHTML = '<span class="iphone-qqz__refresh-spin" aria-hidden="true"></span><span class="iphone-qqz__refresh-text">下拉刷新</span>';
  const refreshText = indicator.querySelector('.iphone-qqz__refresh-text');
  scroll.appendChild(indicator);

  // —— 页面顶部：个人空间头（横幅 + 资料 + 五宫格 + 分享条），随内容滚动 ——
  const cover = document.createElement('div');
  cover.className = 'iphone-qqp';
  cover.innerHTML = `
    <div class="iphone-qqp__banner" aria-hidden="true"></div>
    <div class="iphone-qqp__idrow">
      ${identity
        ? '<span class="iphone-qq__avatar" data-qq-guest-avatar aria-hidden="true"></span>'
        : '<span class="iphone-qq__me-avatar iphone-qq__me-avatar--big" data-me-avatar data-qq-open-profile role="button" aria-label="编辑我的资料" tabindex="0"></span>'}
      <div class="iphone-qqp__nameline">
        <p class="iphone-qqp__name"${identity ? ' data-qq-guest-name' : ' data-me-name'}></p>
        <span class="iphone-qqp__lv">LV4</span>
        <span class="iphone-qqp__vip">续费</span>
      </div>
      <p class="iphone-qqp__total">${icons.eye}总量 <b>${p.total}</b></p>
    </div>
    <div class="iphone-qqp__funcs">
      ${p.funcs
        .map((f) => `<span class="iphone-qqp__func"><span class="iphone-qqp__func-ico">${icons[f.icon]}</span>${f.label}</span>`)
        .join('')}
    </div>
    <div class="iphone-qqp__composer">
      <span class="iphone-qqp__composer-hint">分享新鲜事...</span>
      <span class="iphone-qqp__composer-ico" aria-hidden="true">${icons.photoUp}</span>
      <span class="iphone-qqp__composer-sep" aria-hidden="true"></span>
      <span class="iphone-qqp__composer-ico" aria-hidden="true">${icons.ai}</span>
    </div>
  `;
  if (identity) {
    // 她的空间：头像换成她的（实体头像组件，含首字字牌回退），名字写死文本
    cover.querySelector('[data-qq-guest-avatar]')?.replaceWith(
      iphoneQqBuildEntityAvatar({ name: identity.name, avatar: identity.avatar }, 'friend'),
    );
    const guestName = cover.querySelector('[data-qq-guest-name]');
    if (guestName) guestName.textContent = identity.name || '';
  } else {
    cover.querySelector('[data-qq-open-profile]')?.addEventListener('click', () => onOpenProfile?.());
  }
  scroll.appendChild(cover);

  // —— 下方：动态流（默认为空；下拉刷新调一次 API 由 AI 生成，见 endPull） ——
  const feed = document.createElement('div');
  feed.className = 'iphone-qqz__feed';
  scroll.appendChild(feed);

  // 单条动态卡片：头像/名字来自发布者联系人（缺失时首字字牌兜底）；正文、点赞、
  // 评论里的联系人名一律走 textContent，避免表单输入的名字被当 HTML 解析。
  function buildDynamicCard(dyn, publisher) {
    const card = document.createElement('article');
    card.className = 'iphone-qqz__post';
    card.dataset.dynId = dyn.id;

    const head = document.createElement('header');
    head.className = 'iphone-qqz__head';
    const avatar = iphoneQqBuildEntityAvatar(publisher || { name: 'QQ用户', avatar: null }, 'friend');
    avatar.classList.add('iphone-qq__avatar--xs');
    head.appendChild(avatar);
    const nameEl = document.createElement('p');
    nameEl.className = 'iphone-qqz__name';
    nameEl.textContent = publisher ? publisher.name : 'QQ用户';
    head.appendChild(nameEl);
    const more = document.createElement('span');
    more.className = 'iphone-qqz__more';
    more.setAttribute('aria-hidden', 'true');
    more.innerHTML = icons.more;
    head.appendChild(more);
    card.appendChild(head);

    // 正文一段（纯文字动态；点赞 / 评论按数据渲染在下方）
    const esc = (v) => String(v).replace(/[&<>"']/g, (ch) => (
      { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]
    ));
    if (dyn.text) {
      const para = document.createElement('p');
      para.className = 'iphone-qqz__text';
      para.textContent = dyn.text;
      card.appendChild(para);
    }

    const meta = document.createElement('div');
    meta.className = 'iphone-qqz__meta';
    meta.innerHTML = `
      <span class="iphone-qqz__time">${esc(iphoneQqDynamicsTimeLabel(dyn))}</span>
      <span class="iphone-qqz__ops" aria-hidden="true">
        <span class="iphone-qqz__op">${icons.thumbUp}</span>
        <span class="iphone-qqz__op">${icons.comment}</span>
        <span class="iphone-qqz__op">${icons.share}</span>
      </span>
    `;
    card.appendChild(meta);

    // 点赞名单：蓝色小手 + 蓝色名字（点赞的联系人，由 AI 按剧情生成、生成时
    // 限定在联系人名单内）
    if (dyn.likes.length) {
      const likes = document.createElement('p');
      likes.className = 'iphone-qqz__likes';
      likes.innerHTML = `<span class="iphone-qqz__likes-ico" aria-hidden="true">${icons.thumbUp}</span>`;
      likes.appendChild(document.createTextNode(dyn.likes.join('、')));
      card.appendChild(likes);
    }

    // 评论区：蓝色昵称 + 内容，支持「A 回复 B」（贴主回复 = A 为贴主名字）；
    // 玩家自己发的评论加「我」标，和联系人的评论区分开（署名在数据里是
    // {{user}} 宏本体或人设名，统一解析成当前显示名）
    if (dyn.comments.length) {
      const comments = document.createElement('div');
      comments.className = 'iphone-qqz__comments';
      for (const c of dyn.comments) {
        const row = document.createElement('p');
        row.className = 'iphone-qqz__c-row';
        if (iphoneIsQqPlayerAuthor(c.name)) row.classList.add('is-me');
        const who = document.createElement('span');
        who.className = 'iphone-qqz__c-name';
        const author = iphoneResolveQqPlayerAuthor(c.name);
        who.textContent = c.replyName
          ? `${author} 回复 ${iphoneResolveQqPlayerAuthor(c.replyName)}`
          : author;
        row.appendChild(who);
        row.appendChild(document.createTextNode('：'));
        row.appendChild(document.createTextNode(c.text));
        comments.appendChild(row);
      }
      card.appendChild(comments);
    }

    // 每条动态下方各带一个「说点什么吧…」输入胶囊（小头像即「我的头像」）：
    // 点开转成真输入行（QQ 同款，聚焦即弹出软键盘），回车或点「发送」把评论
    // 挂到这条动态下、立刻落盘重渲染，再调一次对话 API 由 AI 生成新的评论回复
    //（贴主 / 其他联系人应声），回复同样落盘并刷新楼层；请求期间输入行禁用，
    // 失败在卡片里显示红字原因（详情看「日志」）。
    const reply = createDynamicReplyBar(dyn, publisher);
    card.appendChild(reply.el);
    return card;
  }

  // 动态卡片的回复输入行：收起态是一条胶囊提示，点开后变成输入框 + 发送；
  // 发送期间「发送」转成「发送中…」并禁用，成功后由 renderFeed 重建整个动态流
  //（本卡片连同输入行一起重建，输入行随之收起）。
  function createDynamicReplyBar(dyn, publisher) {
    const el = document.createElement('div');
    el.className = 'iphone-qqz__replybar';

    const pill = document.createElement('button');
    pill.type = 'button';
    pill.className = 'iphone-qqz__pill';
    pill.innerHTML = `
      <span class="iphone-qq__me-avatar iphone-qq__me-avatar--mini" data-me-avatar aria-hidden="true"></span>
      <span class="iphone-qqz__pill-hint">说点什么吧...</span>
    `;

    const row = document.createElement('div');
    row.className = 'iphone-qqz__replyrow';
    row.innerHTML = `
      <input type="text" class="iphone-qqz__replyinput" aria-label="回复这条动态"
        maxlength="300" autocomplete="off" spellcheck="false">
      <button type="button" class="iphone-qqz__replysend">发送</button>
    `;
    const input = row.querySelector('.iphone-qqz__replyinput');
    const sendBtn = row.querySelector('.iphone-qqz__replysend');
    input.placeholder = `回复 ${publisher ? publisher.name : 'TA'}...`;

    const errRow = document.createElement('p');
    errRow.className = 'iphone-qqz__replyerr';
    errRow.hidden = true;

    // 输入有字：发送键转深蓝（QQ 同款）
    const refreshSend = () => {
      sendBtn.classList.toggle('is-active', Boolean(input.value.trim()));
    };
    input.addEventListener('input', refreshSend);
    refreshSend();

    let sending = false;
    const openEditor = () => {
      if (sending) return;
      el.classList.add('is-open');
      input.focus();
    };
    pill.addEventListener('click', openEditor);

    const submit = async () => {
      if (sending) return;
      const text = input.value.trim();
      if (!text) return;
      sending = true;
      errRow.hidden = true;
      sendBtn.textContent = '发送中…';
      sendBtn.disabled = true;
      const playerAuthor = iphoneGetQqPlayerAuthor();
      // 先落盘玩家评论并整表重渲染（发出的评论绝不因 API 失败而丢失），
      // 再同步楼层——评论变化要写进 iPhone_Message
      const withPlayer = iphoneGetQqData();
      const target = withPlayer.dynamics.find((d) => d.id === dyn.id);
      if (!target) {
        sending = false;
        errRow.hidden = false;
        errRow.textContent = '这条动态已经不在了。';
        return;
      }
      target.comments = [...target.comments, { name: playerAuthor, text }];
      iphoneSetQqData(qqScreen, withPlayer);
      renderFeed();
      void iphoneSyncQqDynamicsFloor();
      try {
        const created = await iphoneGenerateQqDynamicReply(target);
        const data = iphoneGetQqData();
        const t2 = data.dynamics.find((d) => d.id === dyn.id);
        if (!t2) return;
        t2.comments = [...t2.comments, ...created];
        iphoneSetQqData(qqScreen, data);
        renderFeed();
        void iphoneSyncQqDynamicsFloor();
      } catch (error) {
        iphoneLog('warn', 'QQ空间回复失败', error);
        // 重渲染后本卡片已重建：错误行挂到新卡片的回复条上（并重新展开输入行，
        // 方便直接重试；找不到对应卡片就只记日志）
        const freshBar = feed.querySelector(`[data-dyn-id="${dyn.id}"] .iphone-qqz__replybar`);
        if (freshBar) {
          freshBar.classList.add('is-open');
          const freshErr = freshBar.querySelector('.iphone-qqz__replyerr');
          if (freshErr) {
            freshErr.hidden = false;
            freshErr.textContent = `回复失败：${String(error?.message || error)}`;
          }
        }
        sending = false;
        sendBtn.textContent = '发送';
        sendBtn.disabled = false;
        return;
      }
      sending = false;
      sendBtn.textContent = '发送';
      sendBtn.disabled = false;
    };
    sendBtn.addEventListener('click', submit);
    input.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        submit();
      }
    });

    el.appendChild(pill);
    el.appendChild(row);
    el.appendChild(errRow);
    return { el };
  }

  function renderFeed() {
    const data = iphoneGetQqData();
    feed.innerHTML = '';
    // 访客空间（visitorId 有值）：只留 TA 发的动态，别人的帖子不出现在这里
    const list = visitorId
      ? data.dynamics.filter((d) => d.friendId === visitorId)
      : data.dynamics;
    if (!list.length) {
      const empty = document.createElement('div');
      empty.className = 'iphone-qqz__empty';
      empty.textContent = visitorId
        ? (data.friends.length ? 'TA 还没有发过动态，下拉刷新试试' : '还没有联系人，先去添加好友吧')
        : (data.friends.length ? '还没有动态，下拉刷新试试' : '还没有联系人，先去添加好友吧');
      feed.appendChild(empty);
      return;
    }
    // 新动态在尾部（旧→新追加），展示时倒序：最新的在最上面
    for (const dyn of [...list].reverse()) {
      const publisher = data.friends.find((f) => f.id === dyn.friendId) || null;
      feed.appendChild(buildDynamicCard(dyn, publisher));
    }
    // 每条动态的回复胶囊里都有「我的头像」小图标：卡片构建晚于视图级刷新，
    // 这里补刷一次，改过头像 / 昵称后重渲染也能跟上
    iphoneRefreshQqMeIdentity(feed);
  }

  // 下拉刷新：滚动区停在顶部时向下拖，松手超过阈值即调一次对话 API，由 AI 挑选
  // 合适的联系人生成 1~3 条纯文字动态（iphoneGenerateQqDynamics），落盘渲染后再
  // 同步进 iPhone_Message 楼层
  const PULL_THRESHOLD = 64;
  let pulling = false;
  let pullStartY = 0;
  let pullDy = 0;
  let refreshing = false;
  const endPull = (trigger) => {
    if (!pulling) return;
    pulling = false;
    view.classList.remove('is-pulling');
    indicator.classList.add('is-anim');
    if (trigger && !refreshing && pullDy >= PULL_THRESHOLD) {
      refreshing = true;
      // 72px：内容贴条带底边，小圈（15px）+ 8px 下边距正好落在状态栏图标
      // （约 24~44px）下方的净空里
      indicator.style.height = '72px';
      indicator.classList.add('is-refreshing');
      refreshText.textContent = visitorId ? '正在生成 TA 的新动态…' : '正在生成新的动态…';
      (async () => {
        let failText = '';
        try {
          // 访客空间只让 TA 发一条；我的空间照旧挑 1~3 位联系人
          const created = await iphoneGenerateQqDynamics(visitorId);
          const data = iphoneGetQqData();
          iphoneSetQqData(qqScreen, { ...data, dynamics: [...data.dynamics, ...created] });
          renderFeed();
          // 访客空间的新动态也要进楼层同步：只同步，不改动 TA 空间之外的展示
          void iphoneSyncQqDynamicsFloor();
        } catch (error) {
          iphoneLog('warn', 'QQ空间刷新动态失败', error);
          // 指示器只有一行空间：只显示短原因（没联系人 / 请求或解析失败），详情看「日志」
          failText = String(error?.message || '').includes('还没有联系人') ? '还没有联系人' : '刷新失败';
        }
        if (failText) {
          refreshText.textContent = failText;
          // 失败提示停留 1.2s，让用户看清原因再收起
          await new Promise((resolve) => setTimeout(resolve, 1200));
        }
        // 直接收起（rAF 在后台页不触发，不能依赖它复位状态）
        indicator.classList.remove('is-refreshing');
        indicator.style.height = '0px';
        setTimeout(() => {
          refreshing = false;
          refreshText.textContent = '下拉刷新';
        }, 280);
      })();
    } else {
      indicator.style.height = '0px';
    }
    pullDy = 0;
  };
  scroll.addEventListener('pointerdown', (e) => {
    if (refreshing || pulling || scroll.scrollTop > 0) return;
    pulling = true;
    pullStartY = e.clientY;
    pullDy = 0;
    indicator.classList.remove('is-anim');
  });
  scroll.addEventListener('pointermove', (e) => {
    if (!pulling || refreshing) return;
    pullDy = e.clientY - pullStartY;
    if (pullDy <= 0) {
      view.classList.remove('is-pulling');
      indicator.style.height = '0px';
      refreshText.textContent = '下拉刷新';
      return;
    }
    if (pullDy > 8) view.classList.add('is-pulling');
    // 拖动阶段最多露 72px（与刷新态同高）：小圈在状态栏图标下方也能看清
    indicator.style.height = `${Math.min(72, pullDy * 0.5)}px`;
    refreshText.textContent = pullDy >= PULL_THRESHOLD ? '松开刷新' : '下拉刷新';
  });
  scroll.addEventListener('pointerup', () => endPull(true));
  scroll.addEventListener('pointercancel', () => endPull(false));
  scroll.addEventListener('pointerleave', () => endPull(false));
  // 触屏：进入下拉手势后拦住原生滚动，否则页面直接滚走、手势会被打断
  scroll.addEventListener('touchmove', (e) => {
    if (pulling && pullDy > 0) e.preventDefault();
  }, { passive: false });

  view.appendChild(nav);
  view.appendChild(scroll);
  iphoneRefreshQqMeIdentity(view);

  // 滚过横幅（255px）后，顶部导航由透明悬浮态切为白色标题栏
  scroll.addEventListener('scroll', () => {
    view.classList.toggle('is-scrolled', scroll.scrollTop > 170);
  });

  // 每次打开都会调用（含缓存的「我的空间」）：按最新数据重渲染
  view._refreshQzoneFeed = renderFeed;
  return view;
}

// ---------- 上传头像裁剪编辑器（通用组件，QQ / 微信共用） ----------
// 选图后进入的第二层：正方形裁剪框固定在中间，图片可以在下面拖动、用滑杆缩放，
// 右上角「保存」把当前取景写成 256px 的 JPEG data URL 交给 onSave 回调；「取消」
// 原样退回。取景状态只有 { scale, dx, dy } 三个数（scale 相对「短边铺满」的倍数，
// dx/dy 是图片坐标系里裁剪框的左上角），所以预览与最终画布天然一致。
//
// 布局用纯 CSS 完成（裁剪框 100% 宽高比 1:1，图片层 absolute + transform），
// 拖动按指针位移直接累加 dx/dy，不依赖 getBoundingClientRect 的尺寸换算——
// 手机整机在缩放下（transform: scale）clientX 是屏幕像素、容器是设计稿像素，
// 直接用 clientX 差值会随缩放倍数漂移；这里改用「容器宽度 / transform 后的
// 实际宽度」把屏幕位移换算回设计稿位移。
function iphoneQqBuildAvatarCropper(icons, { onSave, onCancel }) {
  const cropper = document.createElement('div');
  cropper.className = 'iphone-qq__avcrop';
  cropper.innerHTML = `
    <header class="iphone-qq__prof-nav">
      <button type="button" class="iphone-qq__prof-back" aria-label="取消">${icons.back}</button>
      <p class="iphone-qq__prof-title">调整头像</p>
      <button type="button" class="iphone-qq__prof-action iphone-qq__avcrop-save">保存</button>
    </header>
  `;
  const body = document.createElement('div');
  body.className = 'iphone-qq__avcrop-body';
  const stage = document.createElement('div');
  stage.className = 'iphone-qq__avcrop-stage';
  const frame = document.createElement('div');
  frame.className = 'iphone-qq__avcrop-frame';
  const imgEl = document.createElement('img');
  imgEl.className = 'iphone-qq__avcrop-img';
  imgEl.alt = '';
  imgEl.draggable = false;
  stage.appendChild(frame);
  stage.appendChild(imgEl);

  // 缩放滑杆：1 = 短边铺满裁剪框，4 = 放大 4 倍；数值越大越"放大"
  const zoomRow = document.createElement('div');
  zoomRow.className = 'iphone-qq__avcrop-zoomrow';
  zoomRow.innerHTML = `
    <span class="iphone-qq__avcrop-zoomico iphone-qq__avcrop-zoomico--out" aria-hidden="true">${icons.zoomOut}</span>
  `;
  const zoom = document.createElement('input');
  zoom.type = 'range';
  zoom.className = 'iphone-qq__avcrop-zoom';
  zoom.min = String(IPHONE_AVATAR_CROP_MIN_SCALE);
  zoom.max = String(IPHONE_AVATAR_CROP_MAX_SCALE);
  zoom.step = String(IPHONE_AVATAR_CROP_STEP);
  zoom.value = '1';
  zoom.setAttribute('aria-label', '缩放');
  const zoomIn = document.createElement('span');
  zoomIn.className = 'iphone-qq__avcrop-zoomico iphone-qq__avcrop-zoomico--in';
  zoomIn.setAttribute('aria-hidden', 'true');
  zoomIn.innerHTML = icons.zoomIn;
  zoomRow.appendChild(zoom);
  zoomRow.appendChild(zoomIn);

  const hint = document.createElement('p');
  hint.className = 'iphone-qq__avcrop-hint';
  hint.textContent = '拖动图片调整位置，滑杆缩放；保存后立即生效。';

  const stageWrap = document.createElement('div');
  stageWrap.className = 'iphone-qq__avcrop-stagewrap';
  stageWrap.appendChild(stage);
  body.appendChild(stageWrap);
  body.appendChild(zoomRow);
  body.appendChild(hint);
  cropper.appendChild(body);

  // —— 取景状态 ——
  // dx / dy 是裁剪框在「预览图片坐标系」里的左上角（设计稿像素，不是原图像素）；
  // base 是让短边刚好等于裁剪框边长所需的缩放，scale 是用户在其之上的倍数。
  const state = { img: null, base: 1, scale: 1, dx: 0, dy: 0 };
  const viewW = () => stage.clientWidth || 1;
  const viewH = () => stage.clientHeight || 1;
  const scaledSize = () => {
    const img = state.img;
    if (!img) return { w: 0, h: 0 };
    const k = state.base * state.scale;
    return { w: img.naturalWidth * k, h: img.naturalHeight * k };
  };
  const computeBase = () => {
    const img = state.img;
    if (!img) return 1;
    return Math.max(viewW() / img.naturalWidth, viewH() / img.naturalHeight);
  };
  // 把 dx / dy 夹进合法范围（图片始终盖满裁剪框），再应用到预览
  const applyView = () => {
    const { w, h } = scaledSize();
    const maxDx = Math.max(0, w - viewW());
    const maxDy = Math.max(0, h - viewH());
    state.dx = Math.min(maxDx, Math.max(0, state.dx));
    state.dy = Math.min(maxDy, Math.max(0, state.dy));
    imgEl.style.width = `${w}px`;
    imgEl.style.height = `${h}px`;
    imgEl.style.transform = `translate(${-state.dx}px, ${-state.dy}px)`;
  };
  // 屏幕（client）像素 → 设计稿像素：整机缩放后两者差一个倍数，用容器自身
  // 的实际宽度比换算，避免拖动速度随手机缩放漂移。
  const toDesignScale = () => {
    const rect = stage.getBoundingClientRect();
    return rect.width > 0 ? viewW() / rect.width : 1;
  };

  let dragging = false;
  let dragStart = null;
  imgEl.addEventListener('pointerdown', (event) => {
    if (event.button !== undefined && event.button !== 0) return;
    event.preventDefault();
    dragging = true;
    dragStart = { x: event.clientX, y: event.clientY, dx: state.dx, dy: state.dy };
    imgEl.classList.add('is-dragging');
    imgEl.setPointerCapture?.(event.pointerId);
  });
  imgEl.addEventListener('pointermove', (event) => {
    if (!dragging || !dragStart) return;
    const k = toDesignScale();
    state.dx = dragStart.dx - (event.clientX - dragStart.x) * k;
    state.dy = dragStart.dy - (event.clientY - dragStart.y) * k;
    applyView();
  });
  const endDrag = (event) => {
    if (!dragging) return;
    dragging = false;
    dragStart = null;
    imgEl.classList.remove('is-dragging');
    if (event?.pointerId != null) imgEl.releasePointerCapture?.(event.pointerId);
  };
  imgEl.addEventListener('pointerup', endDrag);
  imgEl.addEventListener('pointercancel', endDrag);
  // 滚轮缩放（桌面端顺手）：只认缩放方向，换算成滑杆档位
  stage.addEventListener('wheel', (event) => {
    if (!state.img) return;
    event.preventDefault();
    const next = state.scale * (event.deltaY < 0 ? 1.08 : 1 / 1.08);
    zoom.value = String(Math.min(IPHONE_AVATAR_CROP_MAX_SCALE, Math.max(IPHONE_AVATAR_CROP_MIN_SCALE, next)));
    state.scale = Number(zoom.value);
    applyView();
  }, { passive: false });

  zoom.addEventListener('input', () => {
    if (!state.img) return;
    // 缩放围绕裁剪框中心：改倍率前后保持画面中心对应的图片点不动
    const { w: oldW, h: oldH } = scaledSize();
    const cx = state.dx + viewW() / 2;
    const cy = state.dy + viewH() / 2;
    const ratioX = oldW ? cx / oldW : 0.5;
    const ratioY = oldH ? cy / oldH : 0.5;
    state.scale = Number(zoom.value) || 1;
    const { w, h } = scaledSize();
    state.dx = ratioX * w - viewW() / 2;
    state.dy = ratioY * h - viewH() / 2;
    applyView();
  });

  cropper.querySelector('.iphone-qq__prof-back').addEventListener('click', () => {
    cropper.classList.remove('is-open');
    onCancel?.();
  });
  cropper.querySelector('.iphone-qq__avcrop-save').addEventListener('click', () => {
    if (!state.img) return;
    try {
      // 预览 → 原图：预览里图片按 k = base × scale 缩放、再向左上平移 (dx, dy)，
      // 所以裁剪框左上角在原图上就是 (dx / k, dy / k)，原图上要取的边长是
      // 裁剪框边长 / k（裁剪框边长就等于 stage 边长，方形）。
      const k = state.base * state.scale;
      const side = viewW() / k;
      const dataUrl = iphoneCropAvatarToDataUrl(state.img, {
        sx: state.dx / k,
        sy: state.dy / k,
        sw: side,
        sh: side,
      });
      cropper.classList.remove('is-open');
      onSave?.(dataUrl);
    } catch (error) {
      hint.textContent = String(error?.message || error);
    }
  });

  // open(img)：装载新图并复位取景（居中、1 倍）。必须在 cropper 可见之后量尺寸：
  // display:none 期间 clientWidth 为 0，base 会算成 1 而让图片退化成原始像素大小。
  const open = (img) => {
    state.img = img;
    cropper.classList.add('is-open');
    state.scale = 1;
    zoom.value = '1';
    state.base = computeBase();
    const { w, h } = scaledSize();
    state.dx = Math.max(0, (w - viewW()) / 2);
    state.dy = Math.max(0, (h - viewH()) / 2);
    imgEl.src = img.src;
    applyView();
  };
  // 屏幕尺寸变化（整机缩放随窗口变）时重算 base，保持取景画面不变
  const onResize = () => {
    if (!state.img || !cropper.classList.contains('is-open')) return;
    const { w: oldW, h: oldH } = scaledSize();
    const ratioX = oldW ? (state.dx + viewW() / 2) / oldW : 0.5;
    const ratioY = oldH ? (state.dy + viewH() / 2) / oldH : 0.5;
    state.base = computeBase();
    const { w, h } = scaledSize();
    state.dx = ratioX * w - viewW() / 2;
    state.dy = ratioY * h - viewH() / 2;
    applyView();
  };
  globalThis.addEventListener?.('resize', onResize);
  return { el: cropper, open };
}

// ---------- 选择头像浮层（通用组件） ----------
// 内置款式九宫格 + 上传（选图后进裁剪编辑器）+ 图片链接，多处复用（编辑资料 /
// 好友资料 / 群聊资料 / 添加好友 / 创建群聊；v0.18.0 起微信的资料页与表单也复用，
// 经 presets / clsPrefix / meClass 换成微信自己的款式与类名）。
// getCurrent() 取当前头像，onPick(avatar) 回传归一化结果（默认 → null）。
// 返回 { el, open }：el 要挂进 position:relative 的父容器（absolute inset 0 盖住父层）。
// commit(avatar)（可选）在「保存」时调用：编辑资料这类即改即存的入口传它，
// 让上传的头像保存后立即写回；表单类入口不传，等表单自己的「保存」一起提交。
function iphoneQqBuildAvatarPicker(icons, { getCurrent, onPick, commit, presets, clsPrefix, meClass }) {
  const presetList = Array.isArray(presets) && presets.length ? presets : IPHONE_QQ_ME_AVATAR_PRESETS;
  const avatarCls = clsPrefix || 'iphone-qq__avatar--';
  const meCls = meClass || 'iphone-qq__me-avatar';
  const picker = document.createElement('div');
  picker.className = 'iphone-qq__avpick';

  const pickerNav = document.createElement('header');
  pickerNav.className = 'iphone-qq__prof-nav';
  pickerNav.innerHTML = `
    <button type="button" class="iphone-qq__prof-back" aria-label="返回">${icons.back}</button>
    <p class="iphone-qq__prof-title">选择头像</p>
    <button type="button" class="iphone-qq__prof-action iphone-qq__avpick-save">保存</button>
  `;
  pickerNav.querySelector('.iphone-qq__prof-back').addEventListener('click', () => {
    picker.classList.remove('is-open');
  });

  const pickerBody = document.createElement('div');
  pickerBody.className = 'iphone-qq__prof-body';
  const grid = document.createElement('div');
  grid.className = 'iphone-qq__avpick-grid';
  const checkSvg = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5.5 12.6 4.2 4.2 8.8-9.6" fill="none" stroke="#fff" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  // 待保存的头像：点了款式 / 链接 / 上传裁剪后只更新这里的选中态，点右上角
  // 「保存」才真正写回（onPick / commit）；返回键丢弃（取消）。未改动时沿用
  // getCurrent()，所以打开浮层看到的勾仍是当前头像。
  let pending = null;
  let pendingTouched = false;
  const currentAvatar = () => (pendingTouched ? pending : getCurrent());

  // 九宫格：自定义图（如有）+ 内置款式 + 上传入口；选中项带蓝勾角标
  const rebuildTiles = () => {
    const current = currentAvatar();
    grid.innerHTML = '';
    const tiles = [];
    if (current && current.url) tiles.push({ kind: 'url', label: '自定义' });
    for (const preset of presetList) tiles.push({ kind: 'preset', preset });
    tiles.push({ kind: 'upload', label: '上传' });
    for (const tile of tiles) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'iphone-qq__avpick-tile';
      const selected = tile.kind === 'url'
        ? Boolean(current && current.url)
        : tile.kind === 'preset' && (tile.preset.id === 'me' ? !current : current?.preset === tile.preset.id);

      const face = document.createElement('span');
      face.className = 'iphone-qq__avpick-face';
      if (tile.kind === 'preset') {
        // me = 默认头像本身（用 me-avatar 的默认背景），其余款式用对应覆盖类
        face.classList.add(tile.preset.id === 'me' ? meCls : `${avatarCls}${tile.preset.id}`);
      } else if (tile.kind === 'url') {
        face.style.backgroundImage = `url("${current.url.replace(/"/g, '%22')}")`;
      } else {
        face.classList.add('iphone-qq__avpick-face--upload');
        face.innerHTML = icons.plus;
      }
      const badge = document.createElement('span');
      badge.className = 'iphone-qq__avpick-badge';
      badge.innerHTML = checkSvg;
      const name = document.createElement('span');
      name.className = 'iphone-qq__avpick-name';
      name.textContent = tile.kind === 'preset' ? tile.preset.label : tile.label;
      btn.append(face, badge, name);

      if (tile.kind === 'upload') {
        btn.addEventListener('click', () => fileInput.click());
      } else if (tile.kind === 'preset') {
        btn.addEventListener('click', () => {
          pending = tile.preset.id === 'me' ? null : { preset: tile.preset.id };
          pendingTouched = true;
          rebuildTiles();
          setStatus('点右上角「保存」应用这个头像。');
        });
      }
      if (selected) btn.classList.add('is-selected');
      grid.appendChild(btn);
    }
  };

  // 图片链接行：粘贴 https 图片地址 → 应用
  const urlInput = document.createElement('input');
  urlInput.className = 'iphone-qq__prof-input iphone-qq__avpick-url';
  urlInput.type = 'url';
  urlInput.placeholder = '粘贴图片链接（https://…）';
  urlInput.autocomplete = 'off';
  urlInput.spellcheck = false;
  const urlBtn = document.createElement('button');
  urlBtn.type = 'button';
  urlBtn.className = 'iphone-qq__avpick-use';
  urlBtn.textContent = '使用';
  const urlRow = document.createElement('div');
  urlRow.className = 'iphone-qq__prof-card iphone-qq__avpick-urlrow';
  urlRow.appendChild(urlInput);
  urlRow.appendChild(urlBtn);
  urlBtn.addEventListener('click', () => {
    const url = urlInput.value.trim();
    if (!/^(https?:\/\/|data:image\/)/i.test(url)) {
      setStatus('请输入 http(s) 或 data:image 的图片链接。', 'error');
      return;
    }
    pending = { url };
    pendingTouched = true;
    rebuildTiles();
    setStatus('点右上角「保存」应用这个头像。');
  });

  const statusEl = document.createElement('p');
  statusEl.className = 'iphone-qq__avpick-status';
  const setStatus = (message, state = 'idle') => {
    statusEl.textContent = message;
    statusEl.dataset.state = state;
  };

  // 上传：原生选图 → 进裁剪编辑器摆位（拖动 / 缩放）→ 保存为 256px data URL →
  // 应用。编辑器盖在浮层之上（第三层），取消则原样退回。
  const cropper = iphoneQqBuildAvatarCropper(icons, {
    onCancel: () => setStatus('已取消上传。'),
    onSave: (dataUrl) => {
      pending = { url: dataUrl };
      pendingTouched = true;
      rebuildTiles();
      setStatus('已裁剪，点右上角「保存」应用。');
    },
  });
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'image/*';
  fileInput.hidden = true;
  fileInput.addEventListener('change', async () => {
    const file = fileInput.files && fileInput.files[0];
    fileInput.value = '';
    if (!file) return;
    setStatus('读取图片中…', 'busy');
    try {
      const img = await iphoneReadAvatarFile(file);
      setStatus('');
      cropper.open(img);
    } catch (error) {
      setStatus(String(error?.message || error), 'error');
    }
  });

  const pickerFoot = document.createElement('p');
  pickerFoot.className = 'iphone-qq__prof-foot';
  pickerFoot.textContent = '内置款式为扩展自带的占位素材；上传的图片可在编辑器里拖动、缩放取景，'
    + '保存时在本机压缩为 256px。';

  pickerBody.appendChild(grid);
  pickerBody.appendChild(urlRow);
  pickerBody.appendChild(statusEl);
  pickerBody.appendChild(pickerFoot);
  picker.appendChild(pickerNav);
  picker.appendChild(pickerBody);
  picker.appendChild(fileInput);
  picker.appendChild(cropper.el);

  // 右上角「保存」：把待保存的头像写回调用方（onPick 更新草稿 / 预览，
  // commit 直接落盘——编辑资料这类即改即存的入口两样都会传）。
  pickerNav.querySelector('.iphone-qq__avpick-save').addEventListener('click', () => {
    if (!pendingTouched) {
      picker.classList.remove('is-open');
      return;
    }
    const avatar = pending;
    onPick(avatar);
    commit?.(avatar);
    pendingTouched = false;
    pending = null;
    rebuildTiles();
    // 即改即存的入口（编辑资料）已经在 commit 里落盘；表单入口只写进草稿，
    // 提示要说清楚还要等表单自己的「保存」。
    setStatus(commit ? '已保存头像。' : '已选好头像，点本页「保存」后生效。', 'ok');
    picker.classList.remove('is-open');
  });

  const open = () => {
    // 每次打开都从当前头像重新起算：上次没保存的选择不残留
    pending = null;
    pendingTouched = false;
    rebuildTiles();
    urlInput.value = '';
    setStatus('');
    picker.classList.add('is-open');
  };
  return { el: picker, open };
}

// ---------- QQ 编辑资料（自定义我的头像 / 昵称 / QQ号） ----------
// 入口：消息页头部点「我的头像」（QQ空间大头像同入口）。资料存插件设置
//（宿主 extensionSettings.IPhone，本地预览回退 localStorage），改动即时生效。
// 结构：编辑资料页（返回 + 大头像卡 + 昵称/QQ号输入卡）⊃ 选择头像浮层，与
// 聊天/空间覆盖层同一套滑入范式。
function iphoneQqBuildProfileView(icons, onClose, qqScreen) {
  const view = document.createElement('div');
  view.className = 'iphone-qq__prof';

  const nav = document.createElement('header');
  nav.className = 'iphone-qq__prof-nav';
  nav.innerHTML = `
    <button type="button" class="iphone-qq__prof-back" aria-label="返回">${icons.back}</button>
    <p class="iphone-qq__prof-title">编辑资料</p>
    <span class="iphone-qq__prof-navspace" aria-hidden="true"></span>
  `;
  nav.querySelector('.iphone-qq__prof-back').addEventListener('click', onClose);

  const body = document.createElement('div');
  body.className = 'iphone-qq__prof-body';

  // 头像卡：点按推开「选择头像」浮层
  const avCard = document.createElement('button');
  avCard.type = 'button';
  avCard.className = 'iphone-qq__prof-avcard';
  avCard.innerHTML = `
    <span class="iphone-qq__me-avatar iphone-qq__me-avatar--prof" data-me-avatar aria-hidden="true"></span>
    <span class="iphone-qq__prof-avhint">点击更换头像</span>
  `;

  // 资料卡：昵称 / QQ号，右侧无边框输入，即点即改
  const card = document.createElement('div');
  card.className = 'iphone-qq__prof-card';
  const nameInput = document.createElement('input');
  nameInput.className = 'iphone-qq__prof-input';
  nameInput.type = 'text';
  nameInput.maxLength = 24;
  nameInput.placeholder = '留空 = 酒馆 {{user}}';
  nameInput.autocomplete = 'off';
  nameInput.spellcheck = false;
  const qqInput = document.createElement('input');
  qqInput.className = 'iphone-qq__prof-input';
  qqInput.type = 'text';
  qqInput.inputMode = 'numeric';
  qqInput.maxLength = 12;
  qqInput.placeholder = '留空 = 占位演示号码';
  qqInput.autocomplete = 'off';
  qqInput.spellcheck = false;
  const makeRow = (labelText, input) => {
    const row = document.createElement('div');
    row.className = 'iphone-qq__prof-row';
    const label = document.createElement('label');
    label.className = 'iphone-qq__prof-label';
    label.textContent = labelText;
    row.appendChild(label);
    row.appendChild(input);
    return row;
  };
  card.appendChild(makeRow('昵称', nameInput));
  card.appendChild(makeRow('QQ号', qqInput));

  const foot = document.createElement('p');
  foot.className = 'iphone-qq__prof-foot';
  foot.textContent = '头像与资料保存在本机插件的设置中，改动即时同步到消息、聊天与空间各页；'
    + '昵称留空时使用酒馆的 {{user}}（当前人设名），QQ号留空则使用占位演示资料。';

  nameInput.addEventListener('input', () => iphoneUpdateQqProfile(qqScreen, { name: nameInput.value }));
  qqInput.addEventListener('input', () => iphoneUpdateQqProfile(qqScreen, { qqId: qqInput.value }));

  // 选择头像浮层（通用组件：选中的头像写进「我的资料」）
  const picker = iphoneQqBuildAvatarPicker(icons, {
    getCurrent: () => iphoneGetQqProfile().avatar,
    onPick: (avatar) => iphoneUpdateQqProfile(qqScreen, { avatar }),
    commit: (avatar) => iphoneUpdateQqProfile(qqScreen, { avatar }),
  });
  avCard.addEventListener('click', picker.open);

  body.appendChild(avCard);
  body.appendChild(card);
  body.appendChild(foot);
  view.appendChild(nav);
  view.appendChild(body);
  view.appendChild(picker.el);

  // 重新打开时同步输入框（资料可能在上次打开后被改动）：昵称框只显示「自定义
  // 昵称」本体，留空即跟随酒馆 {{user}}（占位符提示当前值）
  view._syncProfileInputs = () => {
    const profile = iphoneGetQqProfile();
    nameInput.value = iphoneGetQqCustomNick();
    nameInput.placeholder = profile.name ? `留空 = ${profile.name}` : '留空 = 酒馆 {{user}}';
    qqInput.value = profile.qqId;
  };
  return view;
}

// ---------- 添加好友 / 创建群聊（共用表单页） ----------
// 结构与编辑资料页同范式：返回 + 标题 + 右上角动作，头像卡 + 行式输入；
// 群聊多一个「选择群成员」勾选卡。onSubmit(fields) 返回错误文案，null = 成功
//（由调用方关闭表单）。每次打开都重建，无残留草稿。
function iphoneQqBuildSocialForm(icons, kind, onClose, onSubmit) {
  const isGroup = kind === 'group';
  const view = document.createElement('div');
  view.className = 'iphone-qq__prof';

  const nav = document.createElement('header');
  nav.className = 'iphone-qq__prof-nav';
  nav.innerHTML = `
    <button type="button" class="iphone-qq__prof-back" aria-label="返回">${icons.back}</button>
    <p class="iphone-qq__prof-title">${isGroup ? '创建群聊' : '添加好友'}</p>
    <button type="button" class="iphone-qq__prof-action">${isGroup ? '创建' : '添加'}</button>
  `;
  nav.querySelector('.iphone-qq__prof-back').addEventListener('click', onClose);

  const body = document.createElement('div');
  body.className = 'iphone-qq__prof-body';

  // 草稿：头像默认空（首字字牌占位），群成员为勾选的好友 id 集合
  const draft = { avatar: null, memberIds: new Set() };

  // 头像卡：点按推开「选择头像」浮层
  const avCard = document.createElement('button');
  avCard.type = 'button';
  avCard.className = 'iphone-qq__prof-avcard';
  const avPreviewWrap = document.createElement('span');
  avPreviewWrap.className = 'iphone-qq__prof-avcard-avatar';
  const avHint = document.createElement('span');
  avHint.className = 'iphone-qq__prof-avhint';
  avHint.textContent = '点击设置头像';
  avCard.append(avPreviewWrap, avHint);
  const renderPreview = () => {
    avPreviewWrap.innerHTML = '';
    avPreviewWrap.appendChild(iphoneQqBuildEntityAvatar(
      { name: nameInput.value, avatar: draft.avatar },
      isGroup ? 'group' : 'friend',
    ));
  };

  // 输入卡：昵称（群名称）/ QQ号（群号）
  const card = document.createElement('div');
  card.className = 'iphone-qq__prof-card';
  const nameInput = document.createElement('input');
  nameInput.className = 'iphone-qq__prof-input';
  nameInput.type = 'text';
  nameInput.maxLength = 24;
  nameInput.placeholder = isGroup ? '填写群名称' : '填写昵称';
  nameInput.autocomplete = 'off';
  nameInput.spellcheck = false;
  const qqInput = document.createElement('input');
  qqInput.className = 'iphone-qq__prof-input';
  qqInput.type = 'text';
  qqInput.inputMode = 'numeric';
  qqInput.maxLength = 12;
  qqInput.placeholder = isGroup ? '填写群号' : '填写QQ号';
  qqInput.autocomplete = 'off';
  qqInput.spellcheck = false;
  const makeRow = (labelText, input) => {
    const row = document.createElement('div');
    row.className = 'iphone-qq__prof-row';
    const label = document.createElement('label');
    label.className = 'iphone-qq__prof-label';
    label.textContent = labelText;
    row.appendChild(label);
    row.appendChild(input);
    return row;
  };
  card.appendChild(makeRow(isGroup ? '群名称' : '昵称', nameInput));
  card.appendChild(makeRow(isGroup ? '群号' : 'QQ号', qqInput));

  // 群成员卡：勾选加入群聊的好友（至少 2 人，含自己共 3 人起群）
  let memList = null;
  if (isGroup) {
    const memCard = document.createElement('div');
    memCard.className = 'iphone-qq__prof-card iphone-qq__memcard';
    const memHint = document.createElement('p');
    memHint.className = 'iphone-qq__mem-hint';
    memHint.textContent = '勾选加入群聊的好友（至少 2 人）';
    memList = document.createElement('div');
    memList.className = 'iphone-qq__memlist';
    memCard.append(memHint, memList);
    body.appendChild(memCard);
  }
  const renderMembers = () => {
    if (!memList) return;
    const { friends } = iphoneGetQqData();
    memList.innerHTML = '';
    if (!friends.length) {
      const empty = document.createElement('p');
      empty.className = 'iphone-qq__ctc-empty';
      empty.textContent = '还没有好友，先「添加好友」吧';
      memList.appendChild(empty);
      return;
    }
    for (const friend of friends) {
      const row = document.createElement('button');
      row.type = 'button';
      row.className = `iphone-qq__memrow${draft.memberIds.has(friend.id) ? ' is-on' : ''}`;
      row.appendChild(iphoneQqBuildEntityAvatar(friend, 'friend'));
      const main = document.createElement('span');
      main.className = 'iphone-qq__memmain';
      main.textContent = friend.name;
      const sub = document.createElement('span');
      sub.className = 'iphone-qq__memsub';
      sub.textContent = friend.qqId || ' ';
      const check = document.createElement('i');
      check.className = 'iphone-qq__memcheck';
      check.setAttribute('aria-hidden', 'true');
      row.append(main, sub, check);
      row.addEventListener('click', () => {
        const on = draft.memberIds.has(friend.id);
        if (on) draft.memberIds.delete(friend.id);
        else draft.memberIds.add(friend.id);
        row.classList.toggle('is-on', !on);
        setStatus('');
      });
      memList.appendChild(row);
    }
  };

  const statusEl = document.createElement('p');
  statusEl.className = 'iphone-qq__avpick-status';
  const setStatus = (message, state = 'idle') => {
    statusEl.textContent = message;
    statusEl.dataset.state = state;
  };

  const foot = document.createElement('p');
  foot.className = 'iphone-qq__prof-foot';
  foot.textContent = isGroup
    ? '群聊保存在本机插件的设置中，创建后出现在消息页会话与联系人 · 群聊里。'
    : '好友保存在本机插件的设置中，添加后出现在消息页会话与联系人列表里。';

  // 选择头像浮层（通用组件：选中的头像写进草稿）
  const picker = iphoneQqBuildAvatarPicker(icons, {
    getCurrent: () => draft.avatar,
    onPick: (avatar) => {
      draft.avatar = avatar;
      renderPreview();
    },
  });
  avCard.addEventListener('click', picker.open);

  // 右上角动作：校验 → 提交（onSubmit 返回错误文案则留在本页，返回 null 即成功关表单）
  nav.querySelector('.iphone-qq__prof-action').addEventListener('click', () => {
    const name = nameInput.value.trim();
    if (!name) {
      setStatus(isGroup ? '先填群名称。' : '先填昵称。', 'error');
      return;
    }
    const qqId = qqInput.value.trim();
    if (!qqId) {
      setStatus(isGroup ? '再填个群号吧。' : '再填个QQ号吧。', 'error');
      return;
    }
    if (isGroup && draft.memberIds.size < 2) {
      setStatus('至少选择 2 位好友加入群聊。', 'error');
      return;
    }
    const error = onSubmit({ name, qqId, avatar: draft.avatar, memberIds: [...draft.memberIds] });
    if (error) setStatus(error, 'error');
    else onClose();
  });

  nameInput.addEventListener('input', renderPreview);

  body.appendChild(avCard);
  body.appendChild(card);
  body.appendChild(statusEl);
  body.appendChild(foot);
  view.appendChild(nav);
  view.appendChild(body);
  view.appendChild(picker.el);

  renderPreview();
  renderMembers();
  return view;
}

// ---------- 好友资料页（聊天页右上角菜单进入） ----------
// 与添加好友表单同范式：头像卡 + 昵称/QQ号行式输入，另加「她的QQ空间」入口行
// 与两条红色警示行：「清空聊天消息」（onClearMessages 由聊天页经 chatApi 提供，
// 确认后清空并回聊天页）与「删除联系人」（onDeleteContact 确认后删好友并关闭
// 聊天页与资料页）；回调未提供时对应行隐藏。
function iphoneQqBuildFriendProfile(icons, friend, onClose, onSubmit, onOpenQzone, onClearMessages, onDeleteContact) {
  const view = document.createElement('div');
  view.className = 'iphone-qq__prof';

  const nav = document.createElement('header');
  nav.className = 'iphone-qq__prof-nav';
  nav.innerHTML = `
    <button type="button" class="iphone-qq__prof-back" aria-label="返回">${icons.back}</button>
    <p class="iphone-qq__prof-title">好友资料</p>
    <button type="button" class="iphone-qq__prof-action">保存</button>
  `;
  nav.querySelector('.iphone-qq__prof-back').addEventListener('click', onClose);

  const body = document.createElement('div');
  body.className = 'iphone-qq__prof-body';

  // 草稿：以好友当前资料为初值
  const draft = { avatar: friend.avatar || null };

  // 头像卡：点按推开「选择头像」浮层
  const avCard = document.createElement('button');
  avCard.type = 'button';
  avCard.className = 'iphone-qq__prof-avcard';
  const avPreviewWrap = document.createElement('span');
  avPreviewWrap.className = 'iphone-qq__prof-avcard-avatar';
  const avHint = document.createElement('span');
  avHint.className = 'iphone-qq__prof-avhint';
  avHint.textContent = '点击更换头像';
  avCard.append(avPreviewWrap, avHint);
  const renderPreview = () => {
    avPreviewWrap.innerHTML = '';
    avPreviewWrap.appendChild(iphoneQqBuildEntityAvatar(
      { name: nameInput.value, avatar: draft.avatar },
      'friend',
    ));
  };

  // 输入卡：昵称 / QQ号（预填当前资料）
  const card = document.createElement('div');
  card.className = 'iphone-qq__prof-card';
  const nameInput = document.createElement('input');
  nameInput.className = 'iphone-qq__prof-input';
  nameInput.type = 'text';
  nameInput.maxLength = 24;
  nameInput.value = friend.name || '';
  nameInput.placeholder = '填写昵称';
  nameInput.autocomplete = 'off';
  nameInput.spellcheck = false;
  const qqInput = document.createElement('input');
  qqInput.className = 'iphone-qq__prof-input';
  qqInput.type = 'text';
  qqInput.inputMode = 'numeric';
  qqInput.maxLength = 12;
  qqInput.value = friend.qqId || '';
  qqInput.placeholder = '填写QQ号';
  qqInput.autocomplete = 'off';
  qqInput.spellcheck = false;
  const makeRow = (labelText, input) => {
    const row = document.createElement('div');
    row.className = 'iphone-qq__prof-row';
    const label = document.createElement('label');
    label.className = 'iphone-qq__prof-label';
    label.textContent = labelText;
    row.appendChild(label);
    row.appendChild(input);
    return row;
  };
  card.appendChild(makeRow('昵称', nameInput));
  card.appendChild(makeRow('QQ号', qqInput));

  // 空间入口行：空心星 + 「她的QQ空间」 + 右箭头
  const qzoneRow = document.createElement('button');
  qzoneRow.type = 'button';
  qzoneRow.className = 'iphone-qq__prof-link';
  qzoneRow.innerHTML = `
    <span class="iphone-qq__prof-link-ico" aria-hidden="true">${icons.starO}</span>她的QQ空间
    <span class="iphone-qq__prof-chev" aria-hidden="true">${icons.chevronRight}</span>
  `;
  qzoneRow.addEventListener('click', () => onOpenQzone?.());

  // 确认小卡（「清空聊天消息」与「删除联系人」共用）：showConfirm 换标题、
  // 正文与确认键文案，确认键执行对应回调。
  const confirmBox = document.createElement('div');
  confirmBox.className = 'iphone-qq__prof-confirm';
  confirmBox.hidden = true;
  const confirmCard = document.createElement('div');
  confirmCard.className = 'iphone-qq__prof-confirm-card';
  const confirmTitle = document.createElement('p');
  confirmTitle.className = 'iphone-qq__prof-confirm-title';
  const confirmText = document.createElement('p');
  confirmText.className = 'iphone-qq__prof-confirm-text';
  const confirmActions = document.createElement('div');
  confirmActions.className = 'iphone-qq__prof-confirm-actions';
  const confirmCancel = document.createElement('button');
  confirmCancel.type = 'button';
  confirmCancel.className = 'iphone-qq__prof-confirm-cancel';
  confirmCancel.textContent = '取消';
  const confirmOk = document.createElement('button');
  confirmOk.type = 'button';
  confirmOk.className = 'iphone-qq__prof-confirm-ok';
  confirmActions.append(confirmCancel, confirmOk);
  confirmCard.append(confirmTitle, confirmText, confirmActions);
  confirmBox.appendChild(confirmCard);
  let pendingConfirm = null;
  const showConfirm = ({ title, text, okText, onOk }) => {
    confirmTitle.textContent = title;
    confirmText.textContent = text;
    confirmOk.textContent = okText;
    pendingConfirm = onOk || null;
    confirmBox.hidden = false;
  };
  confirmCancel.addEventListener('click', () => {
    confirmBox.hidden = true;
    pendingConfirm = null;
  });
  confirmOk.addEventListener('click', () => {
    confirmBox.hidden = true;
    const action = pendingConfirm;
    pendingConfirm = null;
    action?.();
  });

  // 清空聊天消息：红色警示行，确认后清空并回聊天页
  const clearRow = document.createElement('button');
  clearRow.type = 'button';
  clearRow.className = 'iphone-qq__prof-clear';
  clearRow.textContent = '清空聊天消息';
  clearRow.hidden = typeof onClearMessages !== 'function';
  clearRow.addEventListener('click', () => showConfirm({
    title: '清空聊天消息？',
    text: `将删除与「${friend.name || '她'}」的全部聊天记录，不可恢复。`,
    okText: '清空',
    onOk: () => {
      onClearMessages?.();
      onClose();
    },
  }));

  // 删除联系人：红色警示行，确认后交给 onDeleteContact（删数据、关聊天页与资料页）
  const deleteRow = document.createElement('button');
  deleteRow.type = 'button';
  deleteRow.className = 'iphone-qq__prof-clear';
  deleteRow.textContent = '删除联系人';
  deleteRow.hidden = typeof onDeleteContact !== 'function';
  deleteRow.addEventListener('click', () => showConfirm({
    title: '删除联系人？',
    text: `将删除「${friend.name || '她'}」及她的全部聊天记录，并把她移出所在群聊，不可恢复。`,
    okText: '删除',
    onOk: () => onDeleteContact?.(),
  }));

  const statusEl = document.createElement('p');
  statusEl.className = 'iphone-qq__avpick-status';
  const setStatus = (message, state = 'idle') => {
    statusEl.textContent = message;
    statusEl.dataset.state = state;
  };

  // 右上角动作：校验 → 提交（成功关表单，回到聊天页）
  nav.querySelector('.iphone-qq__prof-action').addEventListener('click', () => {
    const name = nameInput.value.trim();
    if (!name) {
      setStatus('先填昵称。', 'error');
      return;
    }
    const qqId = qqInput.value.trim();
    if (!qqId) {
      setStatus('再填个QQ号吧。', 'error');
      return;
    }
    const error = onSubmit({ name, qqId, avatar: draft.avatar });
    if (error) setStatus(error, 'error');
    else onClose();
  });

  nameInput.addEventListener('input', renderPreview);

  // 选择头像浮层（通用组件：选中的头像写进草稿）
  const picker = iphoneQqBuildAvatarPicker(icons, {
    getCurrent: () => draft.avatar,
    onPick: (avatar) => {
      draft.avatar = avatar;
      renderPreview();
    },
  });
  avCard.addEventListener('click', picker.open);

  const foot = document.createElement('p');
  foot.className = 'iphone-qq__prof-foot';
  foot.textContent = '头像与资料保存在本机插件的设置中，保存后即时同步到会话、联系人与她的QQ空间。';

  body.appendChild(avCard);
  body.appendChild(card);
  body.appendChild(qzoneRow);
  body.appendChild(clearRow);
  body.appendChild(deleteRow);
  body.appendChild(statusEl);
  body.appendChild(foot);
  view.appendChild(nav);
  view.appendChild(body);
  view.appendChild(picker.el);
  view.appendChild(confirmBox);

  renderPreview();
  return view;
}

// ---------- 群聊资料页（聊天页右上角菜单进入，v0.12.1） ----------
// 与好友资料页同范式：头像卡 + 群名/群号行式输入，另加「群成员」卡（当前成员
// 列表 + 「添加成员」入口行，v0.12.2 起支持拉人入群）与两条红色警示行：
// 「清空聊天消息」（onClearMessages 由聊天页经 chatApi 提供，确认后清空并回聊天页）
// 与「删除群聊」（onDeleteGroup 确认后删群并关闭聊天页与资料页）；回调未提供时
// 对应行隐藏。群聊没有QQ空间，因此没有空间入口行。
function iphoneQqBuildGroupProfile(icons, group, onClose, onSubmit, onClearMessages, onDeleteGroup, onOpenMembers) {
  const view = document.createElement('div');
  view.className = 'iphone-qq__prof';

  const nav = document.createElement('header');
  nav.className = 'iphone-qq__prof-nav';
  nav.innerHTML = `
    <button type="button" class="iphone-qq__prof-back" aria-label="返回">${icons.back}</button>
    <p class="iphone-qq__prof-title">群聊资料</p>
    <button type="button" class="iphone-qq__prof-action">保存</button>
  `;
  nav.querySelector('.iphone-qq__prof-back').addEventListener('click', onClose);

  const body = document.createElement('div');
  body.className = 'iphone-qq__prof-body';

  // 草稿：以群聊当前资料为初值
  const draft = { avatar: group.avatar || null };

  // 头像卡：点按推开「选择头像」浮层
  const avCard = document.createElement('button');
  avCard.type = 'button';
  avCard.className = 'iphone-qq__prof-avcard';
  const avPreviewWrap = document.createElement('span');
  avPreviewWrap.className = 'iphone-qq__prof-avcard-avatar';
  const avHint = document.createElement('span');
  avHint.className = 'iphone-qq__prof-avhint';
  avHint.textContent = '点击更换头像';
  avCard.append(avPreviewWrap, avHint);
  const renderPreview = () => {
    avPreviewWrap.innerHTML = '';
    avPreviewWrap.appendChild(iphoneQqBuildEntityAvatar(
      { name: nameInput.value, avatar: draft.avatar },
      'group',
    ));
  };

  // 输入卡：群名 / 群号（预填当前资料）
  const card = document.createElement('div');
  card.className = 'iphone-qq__prof-card';
  const nameInput = document.createElement('input');
  nameInput.className = 'iphone-qq__prof-input';
  nameInput.type = 'text';
  nameInput.maxLength = 24;
  nameInput.value = group.name || '';
  nameInput.placeholder = '填写群名';
  nameInput.autocomplete = 'off';
  nameInput.spellcheck = false;
  const qqInput = document.createElement('input');
  qqInput.className = 'iphone-qq__prof-input';
  qqInput.type = 'text';
  qqInput.inputMode = 'numeric';
  qqInput.maxLength = 12;
  qqInput.value = group.qqId || '';
  qqInput.placeholder = '填写群号';
  qqInput.autocomplete = 'off';
  qqInput.spellcheck = false;
  const makeRow = (labelText, input) => {
    const row = document.createElement('div');
    row.className = 'iphone-qq__prof-row';
    const label = document.createElement('label');
    label.className = 'iphone-qq__prof-label';
    label.textContent = labelText;
    row.appendChild(label);
    row.appendChild(input);
    return row;
  };
  card.appendChild(makeRow('群名', nameInput));
  card.appendChild(makeRow('群号', qqInput));

  // 群成员卡：列出当前成员（不含你），末行「添加成员」推入选择页；暴露
  // _renderGroupMembers 供「添加成员」页保存后重渲染（资料页此时还开着）。
  const memCard = document.createElement('div');
  memCard.className = 'iphone-qq__prof-card iphone-qq__memcard';
  const memHint = document.createElement('p');
  memHint.className = 'iphone-qq__mem-hint';
  const memList = document.createElement('div');
  memList.className = 'iphone-qq__memlist';
  memCard.append(memHint, memList);
  const renderMembers = () => {
    const data = iphoneGetQqData();
    const target = data.groups.find((g) => g.id === group.id) || group;
    const memberIds = Array.isArray(target.memberIds) ? target.memberIds : [];
    memHint.textContent = `群聊成员（${memberIds.length} 位，不含你自己）`;
    memList.innerHTML = '';
    for (const id of memberIds) {
      const member = data.friends.find((f) => f.id === id);
      if (!member) continue;
      const row = document.createElement('div');
      row.className = 'iphone-qq__memrow';
      row.appendChild(iphoneQqBuildEntityAvatar(member, 'friend'));
      const main = document.createElement('span');
      main.className = 'iphone-qq__memmain';
      main.textContent = member.name;
      const sub = document.createElement('span');
      sub.className = 'iphone-qq__memsub';
      sub.textContent = member.qqId || ' ';
      row.append(main, sub);
      memList.appendChild(row);
    }
    if (!memList.children.length) {
      const empty = document.createElement('p');
      empty.className = 'iphone-qq__ctc-empty';
      empty.textContent = '暂无其他成员';
      memList.appendChild(empty);
    }
    const addRow = document.createElement('button');
    addRow.type = 'button';
    addRow.className = 'iphone-qq__memrow';
    const plus = document.createElement('i');
    plus.className = 'iphone-qq__memplus';
    plus.textContent = '＋';
    plus.setAttribute('aria-hidden', 'true');
    const addMain = document.createElement('span');
    addMain.className = 'iphone-qq__memmain';
    addMain.textContent = '添加成员';
    addRow.append(plus, addMain);
    addRow.hidden = typeof onOpenMembers !== 'function';
    addRow.addEventListener('click', () => onOpenMembers?.());
    memList.appendChild(addRow);
  };
  renderMembers();
  view._renderGroupMembers = renderMembers;

  // 确认小卡（「清空聊天消息」与「删除群聊」共用）：showConfirm 换标题、
  // 正文与确认键文案，确认键执行对应回调。
  const confirmBox = document.createElement('div');
  confirmBox.className = 'iphone-qq__prof-confirm';
  confirmBox.hidden = true;
  const confirmCard = document.createElement('div');
  confirmCard.className = 'iphone-qq__prof-confirm-card';
  const confirmTitle = document.createElement('p');
  confirmTitle.className = 'iphone-qq__prof-confirm-title';
  const confirmText = document.createElement('p');
  confirmText.className = 'iphone-qq__prof-confirm-text';
  const confirmActions = document.createElement('div');
  confirmActions.className = 'iphone-qq__prof-confirm-actions';
  const confirmCancel = document.createElement('button');
  confirmCancel.type = 'button';
  confirmCancel.className = 'iphone-qq__prof-confirm-cancel';
  confirmCancel.textContent = '取消';
  const confirmOk = document.createElement('button');
  confirmOk.type = 'button';
  confirmOk.className = 'iphone-qq__prof-confirm-ok';
  confirmActions.append(confirmCancel, confirmOk);
  confirmCard.append(confirmTitle, confirmText, confirmActions);
  confirmBox.appendChild(confirmCard);
  let pendingConfirm = null;
  const showConfirm = ({ title, text, okText, onOk }) => {
    confirmTitle.textContent = title;
    confirmText.textContent = text;
    confirmOk.textContent = okText;
    pendingConfirm = onOk || null;
    confirmBox.hidden = false;
  };
  confirmCancel.addEventListener('click', () => {
    confirmBox.hidden = true;
    pendingConfirm = null;
  });
  confirmOk.addEventListener('click', () => {
    confirmBox.hidden = true;
    const action = pendingConfirm;
    pendingConfirm = null;
    action?.();
  });

  // 清空聊天消息：红色警示行，确认后清空并回聊天页
  const clearRow = document.createElement('button');
  clearRow.type = 'button';
  clearRow.className = 'iphone-qq__prof-clear';
  clearRow.textContent = '清空聊天消息';
  clearRow.hidden = typeof onClearMessages !== 'function';
  clearRow.addEventListener('click', () => showConfirm({
    title: '清空聊天消息？',
    text: `将删除群「${group.name || '本群'}」的全部聊天记录，不可恢复。`,
    okText: '清空',
    onOk: () => {
      onClearMessages?.();
      onClose();
    },
  }));

  // 删除群聊：红色警示行，确认后交给 onDeleteGroup（删数据、关聊天页与资料页）
  const deleteRow = document.createElement('button');
  deleteRow.type = 'button';
  deleteRow.className = 'iphone-qq__prof-clear';
  deleteRow.textContent = '删除群聊';
  deleteRow.hidden = typeof onDeleteGroup !== 'function';
  deleteRow.addEventListener('click', () => showConfirm({
    title: '删除群聊？',
    text: `将删除群「${group.name || '本群'}」及全部聊天记录，不可恢复。`,
    okText: '删除',
    onOk: () => onDeleteGroup?.(),
  }));

  const statusEl = document.createElement('p');
  statusEl.className = 'iphone-qq__avpick-status';
  const setStatus = (message, state = 'idle') => {
    statusEl.textContent = message;
    statusEl.dataset.state = state;
  };

  // 右上角动作：校验 → 提交（成功关表单，回到聊天页）
  nav.querySelector('.iphone-qq__prof-action').addEventListener('click', () => {
    const name = nameInput.value.trim();
    if (!name) {
      setStatus('先填群名。', 'error');
      return;
    }
    const qqId = qqInput.value.trim();
    if (!qqId) {
      setStatus('再填个群号吧。', 'error');
      return;
    }
    const error = onSubmit({ name, qqId, avatar: draft.avatar });
    if (error) setStatus(error, 'error');
    else onClose();
  });

  nameInput.addEventListener('input', renderPreview);

  // 选择头像浮层（通用组件：选中的头像写进草稿）
  const picker = iphoneQqBuildAvatarPicker(icons, {
    getCurrent: () => draft.avatar,
    onPick: (avatar) => {
      draft.avatar = avatar;
      renderPreview();
    },
  });
  avCard.addEventListener('click', picker.open);

  const foot = document.createElement('p');
  foot.className = 'iphone-qq__prof-foot';
  foot.textContent = '头像与资料保存在本机插件的设置中，保存后即时同步到会话与联系人列表。';

  body.appendChild(avCard);
  body.appendChild(card);
  body.appendChild(memCard);
  body.appendChild(clearRow);
  body.appendChild(deleteRow);
  body.appendChild(statusEl);
  body.appendChild(foot);
  view.appendChild(nav);
  view.appendChild(body);
  view.appendChild(picker.el);
  view.appendChild(confirmBox);

  renderPreview();
  return view;
}

// ---------- 添加成员页（群聊资料「添加成员」进入，v0.12.2） ----------
// 与创建群聊的成员勾选同范式：列出还没进群的好友，勾选后右上角「添加」批量
// 拉入；onSubmit(ids) 返回错误文案则留在本页，返回 null 即成功关页。
function iphoneQqBuildGroupMemberPicker(icons, group, onClose, onSubmit) {
  const view = document.createElement('div');
  view.className = 'iphone-qq__prof';

  const nav = document.createElement('header');
  nav.className = 'iphone-qq__prof-nav';
  nav.innerHTML = `
    <button type="button" class="iphone-qq__prof-back" aria-label="返回">${icons.back}</button>
    <p class="iphone-qq__prof-title">添加成员</p>
    <button type="button" class="iphone-qq__prof-action">添加</button>
  `;
  nav.querySelector('.iphone-qq__prof-back').addEventListener('click', onClose);

  const body = document.createElement('div');
  body.className = 'iphone-qq__prof-body';

  // 草稿：勾选待拉入的好友 id 集合；右上角动作实时显示已选人数
  const draft = new Set();
  const action = nav.querySelector('.iphone-qq__prof-action');
  const refreshAction = () => {
    action.textContent = draft.size ? `添加(${draft.size})` : '添加';
  };

  // 只列还没进群的好友；没有候选人时给一句说明
  const { friends } = iphoneGetQqData();
  const memberIds = new Set((Array.isArray(group.memberIds) ? group.memberIds : []).map(String));
  const candidates = friends.filter((f) => !memberIds.has(String(f.id)));

  const memCard = document.createElement('div');
  memCard.className = 'iphone-qq__prof-card iphone-qq__memcard';
  const memHint = document.createElement('p');
  memHint.className = 'iphone-qq__mem-hint';
  memHint.textContent = '勾选要拉进群的好友';
  const memList = document.createElement('div');
  memList.className = 'iphone-qq__memlist';
  memCard.append(memHint, memList);
  for (const friend of candidates) {
    const row = document.createElement('button');
    row.type = 'button';
    row.className = 'iphone-qq__memrow';
    row.appendChild(iphoneQqBuildEntityAvatar(friend, 'friend'));
    const main = document.createElement('span');
    main.className = 'iphone-qq__memmain';
    main.textContent = friend.name;
    const sub = document.createElement('span');
    sub.className = 'iphone-qq__memsub';
    sub.textContent = friend.qqId || ' ';
    const check = document.createElement('i');
    check.className = 'iphone-qq__memcheck';
    check.setAttribute('aria-hidden', 'true');
    row.append(main, sub, check);
    row.addEventListener('click', () => {
      const on = draft.has(friend.id);
      if (on) draft.delete(friend.id);
      else draft.add(friend.id);
      row.classList.toggle('is-on', !on);
      refreshAction();
      setStatus('');
    });
    memList.appendChild(row);
  }
  if (!candidates.length) {
    const empty = document.createElement('p');
    empty.className = 'iphone-qq__ctc-empty';
    empty.textContent = friends.length ? '所有好友都已在群里' : '还没有好友，先「添加好友」吧';
    memList.appendChild(empty);
  }

  const statusEl = document.createElement('p');
  statusEl.className = 'iphone-qq__avpick-status';
  const setStatus = (message, state = 'idle') => {
    statusEl.textContent = message;
    statusEl.dataset.state = state;
  };

  const foot = document.createElement('p');
  foot.className = 'iphone-qq__prof-foot';
  foot.textContent = '新成员立即出现在群成员列表与聊天页的成员数里。';

  action.addEventListener('click', () => {
    if (!draft.size) {
      setStatus('先勾选要拉进群的好友。', 'error');
      return;
    }
    const error = onSubmit([...draft]);
    if (error) setStatus(error, 'error');
    else onClose();
  });

  body.appendChild(memCard);
  body.appendChild(statusEl);
  body.appendChild(foot);
  view.appendChild(nav);
  view.appendChild(body);
  return view;
}

// ---------- QQ 消息页（入口：三 Tab 切换 + 聊天/空间两层覆盖） ----------
function buildQqAppScreen() {
  const icons = iphoneQqIcons();

  const screen = document.createElement('div');
  screen.className = 'iphone-app iphone-qq';

  // —— 主视图：共享头部 + 三个 Tab 页 + 底部标签栏 ——
  const listView = document.createElement('div');
  listView.className = 'iphone-qq__listview';

  const header = document.createElement('header');
  header.className = 'iphone-qq__header';
  header.innerHTML = `
    <span class="iphone-qq__me-avatar" data-me-avatar title="编辑资料" aria-hidden="true"></span>
    <div class="iphone-qq__me-info">
      <p class="iphone-qq__me-name" data-me-name></p>
      <p class="iphone-qq__me-status"><i class="iphone-qq__status-dot"></i>${IPHONE_QQ_ME.status}</p>
    </div>
    <button type="button" class="iphone-qq__add" aria-label="添加">${icons.plus}</button>
  `;

  // 动态/联系人页头部变体（切换 Tab 时替换内容）
  const headerMain = header.innerHTML;
  const headerDyn = `
    <span class="iphone-qq__me-avatar" data-me-avatar aria-hidden="true"></span>
    <p class="iphone-qq__dyn2-heading">动态</p>
    <span class="iphone-qq__dyn2-gridbtn" aria-hidden="true">${icons.gridIcon}</span>
  `;
  // 联系人页头部：头像 + 居中「联系人」（蓝色下划线）+ 加好友按钮（真实界面无「扩列」，按需求去除）
  const headerContacts = `
    <span class="iphone-qq__me-avatar" data-me-avatar aria-hidden="true"></span>
    <p class="iphone-qq__ctc-heading">联系人<i aria-hidden="true"></i></p>
    <button type="button" class="iphone-qq__ctc-addbtn" aria-label="加好友">${icons.personAdd}</button>
  `;
  function setQqHeader(mode) {
    if (header._mode === mode) return;
    header._mode = mode;
    header.classList.toggle('is-dyn', mode === 'dyn');
    header.classList.toggle('is-contacts', mode === 'contacts');
    header.innerHTML = mode === 'dyn' ? headerDyn : mode === 'contacts' ? headerContacts : headerMain;
    // 头部是整段 innerHTML 重建的：重建后立刻同步「我的资料」节点
    iphoneRefreshQqMeIdentity(header);
  }

  // —— 右上角「+」弹出菜单（创建群聊 / 加好友，对照真实 QQ 的加号面板） ——
  const addMenu = document.createElement('div');
  addMenu.className = 'iphone-qq__addmenu';
  addMenu.innerHTML = `
    <button type="button" class="iphone-qq__addmenu-item" data-act="group">${icons.plusCircle}<span>创建群聊</span></button>
    <button type="button" class="iphone-qq__addmenu-item" data-act="friend">${icons.personAdd}<span>加好友</span></button>
  `;
  function closeAddMenu() {
    addMenu.classList.remove('is-open');
  }
  addMenu.addEventListener('click', (event) => {
    const item = event.target.closest('.iphone-qq__addmenu-item');
    if (!item) return;
    closeAddMenu();
    openQqEntityForm(item.dataset.act);
  });
  // 点菜单与加号以外的任意位置收起
  listView.addEventListener('click', (event) => {
    if (!addMenu.classList.contains('is-open')) return;
    if (!event.target.closest('.iphone-qq__addmenu') && !event.target.closest('.iphone-qq__add')) closeAddMenu();
  });

  // 头部点击代理（头部是整段 innerHTML 重建的，监听必须挂在 header 元素上）：
  // 头像 → 编辑资料；+ → 弹菜单；联系人页加好友钮 → 直接开表单
  header.addEventListener('click', (event) => {
    if (event.target.closest('.iphone-qq__me-avatar')) {
      closeAddMenu();
      openQqProfileView();
      return;
    }
    if (event.target.closest('.iphone-qq__add')) {
      addMenu.classList.toggle('is-open');
      return;
    }
    if (event.target.closest('.iphone-qq__ctc-addbtn')) {
      closeAddMenu();
      openQqEntityForm('friend');
    }
  });

  const sheet = document.createElement('section');
  sheet.className = 'iphone-qq__sheet';

  // Tab 1：消息（会话列表由 qqData 渲染：好友在前、群聊在后）
  const pageChats = document.createElement('div');
  pageChats.className = 'iphone-qq__tabpage';
  const search = document.createElement('div');
  search.className = 'iphone-qq__search';
  search.innerHTML = `${icons.search}<span>搜索</span>`;
  const chats = document.createElement('ul');
  chats.className = 'iphone-qq__chats';
  function renderChats() {
    const { friends, groups } = iphoneGetQqData();
    chats.innerHTML = '';
    if (!friends.length && !groups.length) {
      const empty = document.createElement('li');
      empty.className = 'iphone-qq__chats-empty';
      empty.textContent = '暂无会话，点右上角「+」添加好友或创建群聊';
      chats.appendChild(empty);
      return;
    }
    for (const friend of friends) chats.appendChild(iphoneQqBuildChatItem({ kind: 'friend', ...friend }, openQqConversation));
    for (const group of groups) chats.appendChild(iphoneQqBuildChatItem({ kind: 'group', ...group }, openQqConversation));
  }
  pageChats.appendChild(search);
  pageChats.appendChild(chats);

  // Tab 2/3：联系人 / 动态
  const pageContacts = iphoneQqBuildContactsPage(icons, openQqConversation, iphoneGetQqData);
  const pageDynamics = iphoneQqBuildDynamicsPage(icons, () => openQzoneView());

  sheet.appendChild(pageChats);
  sheet.appendChild(pageContacts);
  sheet.appendChild(pageDynamics);

  // 底部标签栏：消息 / 联系人 / 动态（无频道）
  const tabs = [
    { label: '消息', icon: icons.chat, page: pageChats },
    { label: '联系人', icon: icons.contact, page: pageContacts },
    { label: '动态', icon: icons.feed, page: pageDynamics },
  ];
  const tabbar = document.createElement('nav');
  tabbar.className = 'iphone-qq__tabbar';
  const tabButtons = [];
  tabs.forEach((tab, i) => {
    const el = document.createElement('button');
    el.type = 'button';
    el.className = `iphone-qq__tab${i === 0 ? ' is-active' : ''}`;
    el.innerHTML = `${tab.icon}<i>${tab.label}</i>`;
    el.addEventListener('click', () => {
      tabButtons.forEach((b) => b.classList.remove('is-active'));
      el.classList.add('is-active');
      tabs.forEach((t) => t.page.classList.toggle('is-hidden', t.page !== tab.page));
      setQqHeader(tab.page === pageDynamics ? 'dyn' : tab.page === pageContacts ? 'contacts' : 'main');
    });
    tabButtons.push(el);
    tabbar.appendChild(el);
  });

  function switchQqTab(index) {
    if (tabButtons[index]) tabButtons[index].click();
  }

  listView.appendChild(header);
  listView.appendChild(sheet);
  listView.appendChild(tabbar);
  listView.appendChild(addMenu);

  // —— 覆盖层一：聊天页（好友 / 群聊实体） ——
  const chatView = document.createElement('div');
  chatView.className = 'iphone-qq__chatview';
  function openQqConversation(entity) {
    if (!entity) return;
    chatView.innerHTML = '';
    chatView.appendChild(iphoneQqBuildChatView(entity, icons, () => {
      chatView.classList.remove('is-open');
    }, (api) => {
      // 右上角菜单：好友进好友资料页、群聊进群聊资料页（按 id 取最新数据，改名后
      // 打开仍是新值），并把聊天页操作集（清空聊天消息）与「删除联系人/删除群聊」
      // 回调转交资料页
      if (entity.kind === 'friend') {
        const fresh = iphoneGetQqData().friends.find((f) => f.id === entity.id);
        if (!fresh) return;
        openQqFriendProfile(fresh, api, () => {
          // 删除联系人：从数据移除（群成员自动收缩、会话与联系人列表即时刷新），
          // 聊天页与资料页一起关闭；楼层的既有记录按设计保留
          const data = iphoneGetQqData();
          data.friends = data.friends.filter((f) => f.id !== entity.id);
          iphoneSetQqData(screen, data);
          chatView.classList.remove('is-open');
          friendProfView.classList.remove('is-open');
        });
        return;
      }
      const freshGroup = iphoneGetQqData().groups.find((g) => g.id === entity.id);
      if (!freshGroup) return;
      openQqGroupProfile(freshGroup, api, () => {
        // 删除群聊：从数据移除（会话与联系人列表即时刷新），聊天页与资料页一起
        // 关闭；楼层的既有记录按设计保留
        const data = iphoneGetQqData();
        data.groups = data.groups.filter((g) => g.id !== entity.id);
        iphoneSetQqData(screen, data);
        chatView.classList.remove('is-open');
        groupProfView.classList.remove('is-open');
      });
    }, screen));
    chatView.classList.add('is-open');
    const stream = chatView.querySelector('.iphone-qqc__stream');
    if (stream) stream.scrollTop = stream.scrollHeight;
  }

  // —— 覆盖层二：好友资料（改头像/昵称/QQ号 + 她的QQ空间入口；每次打开重建） ——
  const friendProfView = document.createElement('div');
  friendProfView.className = 'iphone-qq__profview';
  function openQqFriendProfile(friend, api, onDeleteContact) {
    if (!friend) return;
    friendProfView.innerHTML = '';
    friendProfView.appendChild(iphoneQqBuildFriendProfile(icons, friend, () => {
      friendProfView.classList.remove('is-open');
    }, (fields) => {
      const data = iphoneGetQqData();
      const target = data.friends.find((f) => f.id === friend.id);
      if (!target) return '该好友已被删除。';
      target.name = fields.name;
      target.qqId = fields.qqId;
      target.avatar = fields.avatar;
      iphoneSetQqData(screen, data);
      // 聊天页还开着，标题同步新昵称
      const title = chatView.querySelector('.iphone-qqc__title');
      if (title) title.textContent = fields.name;
      return null;
    }, () => openQzoneView(friend), api?.clearMessages, () => onDeleteContact?.()));
    friendProfView.classList.add('is-open');
  }

  // —— 覆盖层三：群聊资料（改头像/群名/群号 + 清空/删除；每次打开重建） ——
  const groupProfView = document.createElement('div');
  groupProfView.className = 'iphone-qq__profview';
  function openQqGroupProfile(group, api, onDeleteGroup) {
    if (!group) return;
    groupProfView.innerHTML = '';
    groupProfView.appendChild(iphoneQqBuildGroupProfile(icons, group, () => {
      groupProfView.classList.remove('is-open');
    }, (fields) => {
      const data = iphoneGetQqData();
      const target = data.groups.find((g) => g.id === group.id);
      if (!target) return '该群聊已被删除。';
      target.name = fields.name;
      target.qqId = fields.qqId;
      target.avatar = fields.avatar;
      iphoneSetQqData(screen, data);
      // 聊天页还开着，标题同步新群名与成员数
      const title = chatView.querySelector('.iphone-qqc__title');
      const memberCount = (Array.isArray(target.memberIds) ? target.memberIds.length : 0) + 1;
      if (title) title.textContent = `${fields.name}(${memberCount})`;
      return null;
    }, api?.clearMessages, () => onDeleteGroup?.(), () => openQqGroupMembers(group)));
    groupProfView.classList.add('is-open');
  }

  // —— 覆盖层四：添加成员（从群聊资料进入，勾选好友批量拉入群聊；每次打开重建） ——
  const groupMemView = document.createElement('div');
  groupMemView.className = 'iphone-qq__profview';
  function openQqGroupMembers(group) {
    if (!group) return;
    groupMemView.innerHTML = '';
    groupMemView.appendChild(iphoneQqBuildGroupMemberPicker(icons, group, () => {
      groupMemView.classList.remove('is-open');
    }, (ids) => {
      const data = iphoneGetQqData();
      const target = data.groups.find((g) => g.id === group.id);
      if (!target) return '该群聊已被删除。';
      const memberIds = Array.isArray(target.memberIds) ? target.memberIds : [];
      target.memberIds = [...new Set([...memberIds, ...ids.map(String)])];
      iphoneSetQqData(screen, data);
      // 聊天页还开着，标题与状态行同步新成员数
      const memberCount = target.memberIds.length + 1;
      const title = chatView.querySelector('.iphone-qqc__title');
      if (title) title.textContent = `${target.name}(${memberCount})`;
      const chatStatus = chatView.querySelector('.iphone-qqc__status');
      if (chatStatus) chatStatus.textContent = `${memberCount} 位成员`;
      // 底下的群聊资料页还开着，成员列表同步重渲染
      groupProfView.firstChild?._renderGroupMembers?.();
      return null;
    }));
    groupMemView.classList.add('is-open');
  }

  // —— 覆盖层五：QQ空间（个人空间头 + 动态流同页滚动；传好友即「她的QQ空间」） ——
  const qzoneView = document.createElement('div');
  qzoneView.className = 'iphone-qq__qzoneview';
  function openQzoneView(friend) {
    // 自己的空间构建一次缓存；她的空间每次重建，头像/昵称始终取最新
    if (friend || !qzoneView.firstChild || qzoneView._identity !== 'me') {
      qzoneView._identity = friend ? 'friend' : 'me';
      qzoneView.innerHTML = '';
      qzoneView.appendChild(iphoneQqBuildQzoneView(icons, () => {
        qzoneView.classList.remove('is-open');
      }, openQqProfileView, friend ? { name: friend.name, avatar: friend.avatar } : null, screen, friend ? friend.id : ''));
    }
    // 动态流按最新数据渲染（缓存页也要跟上联系人与动态的变化）
    qzoneView.firstChild?._refreshQzoneFeed?.();
    qzoneView.classList.add('is-open');
    const scroll = qzoneView.querySelector('.iphone-qqz__scroll');
    if (scroll) scroll.scrollTop = 0;
  }

  // —— 覆盖层六：编辑资料（我的头像 / 昵称 / QQ号，改动即时同步各视图） ——
  const profView = document.createElement('div');
  profView.className = 'iphone-qq__profview';
  function openQqProfileView() {
    if (!profView.firstChild) {
      profView.appendChild(iphoneQqBuildProfileView(icons, () => {
        profView.classList.remove('is-open');
      }, screen));
    }
    profView.firstChild._syncProfileInputs?.();
    profView.classList.add('is-open');
  }

  // —— 覆盖层七：添加好友 / 创建群聊（共用容器，每次打开重建以重置草稿） ——
  const formView = document.createElement('div');
  formView.className = 'iphone-qq__profview';
  function openQqEntityForm(kind) {
    const isGroup = kind === 'group';
    formView.innerHTML = '';
    formView.appendChild(iphoneQqBuildSocialForm(icons, kind, () => {
      formView.classList.remove('is-open');
    }, (fields) => {
      const data = iphoneGetQqData();
      if (isGroup) {
        data.groups.push({ id: iphoneQqGenEntityId('g'), ...fields });
      } else {
        data.friends.push({ id: iphoneQqGenEntityId('f'), ...fields });
      }
      iphoneSetQqData(screen, data);
      return null;
    }));
    formView.classList.add('is-open');
  }

  // 好友/群聊数据变化后的统一刷新：会话列表 + 联系人各面板
  screen._renderQqSocial = () => {
    renderChats();
    pageContacts._render();
  };

  screen.appendChild(listView);
  screen.appendChild(chatView);
  screen.appendChild(friendProfView);
  screen.appendChild(groupProfView);
  screen.appendChild(groupMemView);
  screen.appendChild(qzoneView);
  screen.appendChild(profView);
  screen.appendChild(formView);
  screen._switchQqTab = switchQqTab;
  renderChats();
  iphoneRefreshQqMeIdentity(screen);
  return screen;
}

// ---------- 设置应用（iOS 设置高保真仿真） ----------
// 主页：搜索框（布局缓冲，iOS 设置首页同款）+ 两项 —— Apple 账户行（昵称跟随
// 酒馆 {{user}}，与 QQ 里「我」的昵称同源）与其下方的「API 连接」入口。
// 功能参考同目录 Kaleidoscope 的「API 连接」：服务器地址 + API 密钥 → 右上角
// 「连接」拉取 OpenAI 兼容 /models 列表 →「模型」行推入选择子页（蓝勾选中），
// 也支持自定义输入。界面按 iOS 设置逐项还原：大标题滚动折叠入毛玻璃导航、
// 内嵌分组圆角列表、彩色扁平行图标；设置持久化见 js/host.js。
function iphoneSettingsIcons() {
  return {
    globe: '<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="12" r="8.2"/><path d="M3.8 12h16.4"/><path d="M12 3.8c2.5 2.3 3.8 5.1 3.8 8.2s-1.3 5.9-3.8 8.2c-2.5-2.3-3.8-5.1-3.8-8.2s1.3-5.9 3.8-8.2z"/></g></svg>',
    chat: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5.2 4.5h13.6c.94 0 1.7.76 1.7 1.7v8.1c0 .94-.76 1.7-1.7 1.7H9.9l-4.4 3.6v-3.6h-.3c-.94 0-1.7-.76-1.7-1.7V6.2c0-.94.76-1.7 1.7-1.7z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>',
    back: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 4.6 7.6 12l7.4 7.4" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    chevron: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9.5 5.5 6.5 6.5-6.5 6.5" fill="none" stroke="currentColor" stroke-width="2.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    eye: '<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><path d="M2.9 12S6.3 6.5 12 6.5 21.1 12 21.1 12 17.7 17.5 12 17.5 2.9 12 2.9 12z"/><circle cx="12" cy="12" r="2.5"/></g></svg>',
    eyeOff: '<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"><path d="M4.6 8.2C3.4 9.7 2.9 12 2.9 12s3.4 5.5 9.1 5.5c1.6 0 3-.4 4.2-1"/><path d="M9.3 7c.9-.3 1.8-.5 2.7-.5 5.7 0 9.1 5.5 9.1 5.5s-.9 1.5-2.6 3"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/><path d="m4.5 4 15 16"/></g></svg>',
    check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12.8 4.5 4.5L19 7.4" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    search: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="5.6" fill="none" stroke="currentColor" stroke-width="2"/><path d="M15.1 15.1l4.2 4.2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    // 「群聊提示词」行图标（与 QQ 图标集的 friendGroup 同款；此前漏加导致渲染成 undefined）
    friendGroup: '<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="9" cy="8.8" r="3.1"/><circle cx="16.2" cy="9.8" r="2.4"/><path d="M3.8 18.8c0-2.9 2.3-4.7 5.2-4.7s5.2 1.8 5.2 4.7"/><path d="M16.6 14.6c2.1.3 3.6 1.8 3.6 4"/></g></svg>',
    // 「动态提示词」行图标（缺口圆环 + 四角星，与 QQ 图标集的 feed 同款）
    feed: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" d="M19.5 9.9A8 8 0 1 1 13.4 4.7"/><path fill="currentColor" d="M17.6 1.3c.36 1.83 1.34 2.8 3.17 3.17-1.83.36-2.8 1.34-3.17 3.17-.36-1.83-1.34-2.8-3.17-3.17 1.83-.36 2.8-1.34 3.17-3.17z"/></svg>',
  };
}

// ---------- 世界书应用 ----------
// 设计参照同目录 SoulLink 扩展：条目激活交给宿主酒馆引擎（ctx.getWorldInfoPrompt
// 干跑，插件不自己实现关键词扫描），插件只做「按书分组展示 + 勾选排除」。
// 排除状态持久化在 settings.worldInfo.excluded = { 世界书名: [uid, …] }（shape 与
// SoulLink 的 worldInfo.excluded 一致）；被排除的条目拼 QQ 聊天提示词时跳过。
// 降级：宿主没有世界书引擎时 mode='none'；引擎只回整段文本（无条目粒度）时
// mode='strings'，此时无法按条目排除，UI 给出提示。

const IPHONE_WB_POSITION_LABELS = Object.freeze({
  0: '之前', 1: '之后', 2: '作者注·顶', 3: '作者注·底',
  4: '深度', 5: '示例·顶', 6: '示例·底', 7: '出口',
});

// 条目身份键 = 书名 + uid（uid 在单本书内唯一；显示名会重复、会被改，不作键）。
function iphoneWbEntryKey(bookName, uid) {
  return `${bookName}\u0000${String(uid)}`;
}

function iphoneWbExcludedMap() {
  const excluded = iphoneGetSettings().worldInfo?.excluded;
  return excluded && typeof excluded === 'object' ? excluded : {};
}

function iphoneWbIsExcluded(map, bookName, uid) {
  const list = Array.isArray(map[bookName]) ? map[bookName] : [];
  return list.includes(String(uid));
}

function iphoneWbToggleExcluded(bookName, uid, excluded) {
  const settings = iphoneGetSettings();
  if (!settings.worldInfo || typeof settings.worldInfo !== 'object') {
    settings.worldInfo = { excluded: {} };
  }
  const map = settings.worldInfo.excluded && typeof settings.worldInfo.excluded === 'object'
    ? settings.worldInfo.excluded
    : (settings.worldInfo.excluded = {});
  const list = Array.isArray(map[bookName]) ? map[bookName].slice() : [];
  const key = String(uid);
  const index = list.indexOf(key);
  if (excluded && index < 0) list.push(key);
  if (!excluded && index >= 0) list.splice(index, 1);
  if (list.length) map[bookName] = list; else delete map[bookName];
  iphoneSaveSettings(settings);
}

function iphoneWbCountExcluded(map) {
  return Object.values(map)
    .reduce((sum, list) => sum + (Array.isArray(list) ? list.length : 0), 0);
}

// 条目显示名：comment → 首个 key → uid（与 SoulLink 同一套兜底链）。
function iphoneWbEntryDisplayName(entry) {
  const comment = String(entry?.comment || '').trim();
  if (comment) return comment;
  const keys = Array.isArray(entry?.key)
    ? entry.key
    : (typeof entry?.keys === 'string' ? entry.keys.split(',') : []);
  const first = keys.map((k) => String(k).trim()).filter(Boolean)[0];
  return first || `#${entry?.uid ?? '?'}`;
}

function iphoneWbPositionLabel(position) {
  return IPHONE_WB_POSITION_LABELS[Number(position)] || '';
}

// 引擎干跑的扫描数据：角色卡字段（TauriTavern 内部要求必传，缺了会抛错）。
function iphoneWbBuildScanData(ctx) {
  let fields = null;
  try {
    if (typeof ctx.getCharacterCardFields === 'function') fields = ctx.getCharacterCardFields();
  } catch (error) {
    iphoneLog('warn', '读取角色卡字段失败', error);
  }
  return {
    personaDescription: String(fields?.personaDescription || ''),
    characterDescription: String(fields?.characterDescription || ''),
    characterPersonality: String(fields?.characterPersonality || ''),
    characterDepthPrompt: String(fields?.characterDepthPrompt || ''),
    scenario: String(fields?.scenario || ''),
    creatorNotes: String(fields?.creatorNotes || ''),
    trigger: 'normal',
  };
}

// 枚举「当前生效的世界书」：激活结果里的书 + 角色书（/getcharbook 兜底）+
// 聊天绑定 + 人设书 + 全局多选框（与 SoulLink 同一套来源）。
async function iphoneWbGetActiveBookNames(ctx, activationEntries) {
  const names = new Set();
  for (const entry of activationEntries || []) {
    const world = String(entry?.world || '').trim();
    if (world) names.add(world);
  }
  const char = Array.isArray(ctx.characters) ? ctx.characters[ctx.characterId] : null;
  const charBook = String(char?.data?.extensions?.world || '').trim();
  if (charBook) {
    names.add(charBook);
  } else {
    // 角色卡没写书名时兜底问一次斜杠命令（标准 ST 与 TauriTavern 各有入口）。
    try {
      let pipe = null;
      if (typeof globalThis.STscript === 'function') {
        const result = await globalThis.STscript('/getcharbook');
        pipe = result?.pipe ?? result;
      } else if (typeof ctx.executeSlashCommandsWithOptions === 'function') {
        const result = await ctx.executeSlashCommandsWithOptions('/getcharbook');
        pipe = result?.pipe;
      }
      const name = String(pipe || '').trim();
      if (name && name.toLowerCase() !== 'none') names.add(name);
    } catch (error) {
      iphoneLog('warn', '/getcharbook 查询角色世界书失败', error);
    }
  }
  const chatBooks = ctx.chatMetadata?.world_info;
  if (Array.isArray(chatBooks)) {
    for (const name of chatBooks) {
      const trimmed = String(name || '').trim();
      if (trimmed) names.add(trimmed);
    }
  }
  const personaBook = String(ctx.powerUserSettings?.persona_description_lorebook || '').trim();
  if (personaBook) names.add(personaBook);
  try {
    const select = document.getElementById('world_info');
    if (select?.selectedOptions) {
      for (const option of select.selectedOptions) {
        const name = String(option.textContent || '').trim();
        if (name) names.add(name);
      }
    }
  } catch {}
  return [...names];
}

// 收集世界书现状：引擎干跑拿激活条目 → 展开生效书的全部条目 → 标记本次触发。
async function iphoneWbCollectState() {
  const ctx = iphoneGetContextSafe();
  if (!ctx || typeof ctx.getWorldInfoPrompt !== 'function') {
    return { mode: 'none', books: [], triggeredKeys: new Set(), stringsText: '' };
  }
  // 扫描聊天 = 酒馆楼层（最新在前，跳隐藏楼层）；「包含名字」沿用宿主页的同名开关。
  const includeNames = !!document.getElementById('world_info_include_names')?.checked;
  const scanChat = (Array.isArray(ctx.chat) ? ctx.chat : [])
    .filter((mes) => mes && !mes.is_system && String(mes.mes ?? '').trim())
    .reverse()
    .map((mes) => (includeNames && mes.name
      ? `${mes.name}: ${String(mes.mes).trim()}`
      : String(mes.mes).trim()));
  let result = null;
  try {
    result = await ctx.getWorldInfoPrompt(
      scanChat,
      typeof ctx.maxContext === 'number' && ctx.maxContext > 0 ? ctx.maxContext : undefined,
      true,
      iphoneWbBuildScanData(ctx),
    );
  } catch (error) {
    iphoneLog('warn', '世界书引擎干跑失败', error);
  }
  const activationEntries = result?.worldInfoActivation?.entries;
  if (!Array.isArray(activationEntries)) {
    // 降级：引擎只回拼好的文本（标准 ST 语义），拿不到条目粒度。
    const stringsText = [result?.worldInfoBefore, result?.worldInfoAfter]
      .map((text) => String(text || '').trim())
      .filter(Boolean)
      .join('\n');
    return { mode: 'strings', books: [], triggeredKeys: new Set(), stringsText };
  }
  const triggeredKeys = new Set(activationEntries
    .map((entry) => iphoneWbEntryKey(String(entry?.world || '').trim(), entry?.uid)));
  const bookNames = await iphoneWbGetActiveBookNames(ctx, activationEntries);
  const books = [];
  for (const name of bookNames) {
    let raw = null;
    try {
      if (typeof ctx.loadWorldInfo === 'function') raw = await ctx.loadWorldInfo(name);
    } catch (error) {
      iphoneLog('warn', `读取世界书「${name}」失败`, error);
    }
    const list = Array.isArray(raw?.entries)
      ? raw.entries
      : (raw?.entries && typeof raw.entries === 'object' ? Object.values(raw.entries) : []);
    const entries = list.map((entry) => ({
      world: name,
      uid: String(entry?.uid ?? ''),
      name: iphoneWbEntryDisplayName(entry),
      constant: entry?.constant === true,
      disabled: entry?.disable === true,
      position: iphoneWbPositionLabel(entry?.position),
      content: String(entry?.content || '').trim(),
    }));
    if (entries.length) books.push({ name, entries });
  }
  if (!books.length && activationEntries.length && typeof ctx.loadWorldInfo !== 'function') {
    // 连 loadWorldInfo 都没有的宿主：退而用激活结果本身展示（全是已激活条目）。
    const byWorld = new Map();
    for (const entry of activationEntries) {
      const world = String(entry?.world || '').trim() || '（未知世界书）';
      if (!byWorld.has(world)) byWorld.set(world, []);
      byWorld.get(world).push({
        world,
        uid: String(entry?.uid ?? ''),
        name: `#${entry?.uid ?? '?'}`,
        constant: false,
        disabled: false,
        position: iphoneWbPositionLabel(entry?.position),
        content: String(entry?.content || '').trim(),
      });
    }
    for (const [name, entries] of byWorld) books.push({ name, entries });
  }
  return { mode: 'entries', books, triggeredKeys, stringsText: '' };
}

// 提示词用的世界书文本：本次激活（含常驻）− 禁用 − 玩家排除，content 换行直连。
function iphoneWbBuildPromptText(state) {
  if (!state) return '';
  if (state.mode === 'strings') return state.stringsText;
  if (state.mode !== 'entries') return '';
  const map = iphoneWbExcludedMap();
  const lines = [];
  for (const book of state.books) {
    for (const entry of book.entries) {
      if (entry.disabled || !entry.content) continue;
      if (!state.triggeredKeys.has(iphoneWbEntryKey(book.name, entry.uid))) continue;
      if (iphoneWbIsExcluded(map, book.name, entry.uid)) continue;
      lines.push(entry.content);
    }
  }
  return lines.join('\n');
}

function iphoneBuildWorldBookScreen() {
  const screen = document.createElement('div');
  screen.className = 'iphone-app iphone-wb';

  const header = document.createElement('header');
  header.className = 'iphone-wb__header';
  header.innerHTML = `
    <div class="iphone-wb__nav">
      <span class="iphone-wb__title">世界书</span>
      <button type="button" class="iphone-wb__refresh" aria-label="刷新">↻</button>
    </div>
    <p class="iphone-wb__status" data-state="idle">正在读取世界书…</p>
  `;
  const statusEl = header.querySelector('.iphone-wb__status');

  const banner = document.createElement('p');
  banner.className = 'iphone-wb__banner';
  banner.hidden = true;

  const note = document.createElement('p');
  note.className = 'iphone-wb__note';
  note.textContent = '勾选条目即可排除：被排除的条目不会随 QQ 聊天发给 AI。未激活的条目本次不会发送（与酒馆行为一致）。';

  const toolbar = document.createElement('div');
  toolbar.className = 'iphone-wb__toolbar';
  const clearBtn = document.createElement('button');
  clearBtn.type = 'button';
  clearBtn.className = 'iphone-wb__clear';
  clearBtn.textContent = '清除全部排除';
  toolbar.appendChild(clearBtn);

  const list = document.createElement('div');
  list.className = 'iphone-wb__list';
  let currentState = null; // 最近一次 render 的世界书状态（清除排除后刷新状态栏用）

  const refreshStatus = () => {
    const excludedCount = iphoneWbCountExcluded(iphoneWbExcludedMap());
    return { excludedCount };
  };
  const refreshChrome = (state) => {
    const { excludedCount } = refreshStatus();
    if (state.mode === 'entries') {
      const total = state.books.reduce((sum, book) => sum + book.entries.length, 0);
      statusEl.dataset.state = 'ok';
      statusEl.textContent = `条目模式 · ${state.books.length} 本书 · ${total} 条 · 已排除 ${excludedCount} 条`;
    } else if (state.mode === 'strings') {
      statusEl.dataset.state = 'warn';
      statusEl.textContent = `文本模式 · 无法按条目排除 · 已排除 ${excludedCount} 条（暂不生效）`;
    } else {
      statusEl.dataset.state = 'error';
      statusEl.textContent = '未检测到世界书引擎';
    }
    banner.hidden = state.mode !== 'strings';
    if (state.mode === 'strings') {
      banner.textContent = '宿主未返回按条目的激活结果，世界书只能整段文本注入，暂不能按条目排除。';
    }
    clearBtn.hidden = excludedCount === 0;
  };

  const buildEntryRow = (book, entry, triggered) => {
    const row = document.createElement('label');
    row.className = 'iphone-wb__entry';
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    const excluded = iphoneWbIsExcluded(iphoneWbExcludedMap(), book.name, entry.uid);
    checkbox.checked = excluded;
    const main = document.createElement('span');
    main.className = 'iphone-wb__entry-main';
    const name = document.createElement('span');
    name.className = 'iphone-wb__entry-name';
    name.textContent = entry.name;
    if (entry.content) name.title = entry.content;
    const badges = document.createElement('span');
    badges.className = 'iphone-wb__entry-badges';
    main.append(name, badges);
    row.append(checkbox, main);

    const paint = () => {
      const isExcluded = iphoneWbIsExcluded(iphoneWbExcludedMap(), book.name, entry.uid);
      checkbox.checked = isExcluded;
      row.classList.toggle('is-excluded', isExcluded);
      row.classList.toggle('is-triggered', triggered && !entry.disabled);
      row.classList.toggle('is-disabled', entry.disabled);
      const parts = [];
      if (entry.constant) parts.push('常驻');
      if (entry.disabled) parts.push('禁用');
      if (entry.position) parts.push(entry.position);
      if (triggered && !entry.disabled) parts.push('本次触发');
      if (isExcluded) parts.push('已排除');
      badges.textContent = parts.map((text) => ` ${text} `).join('') || '';
    };
    paint();
    checkbox.addEventListener('change', () => {
      iphoneWbToggleExcluded(book.name, entry.uid, checkbox.checked);
      paint();
      // 状态栏计数与「清除全部排除」按钮要跟着这次勾选即时刷新
      if (currentState) refreshChrome(currentState);
    });
    row.__paint = paint;
    return row;
  };

  const render = async () => {
    statusEl.dataset.state = 'busy';
    statusEl.textContent = '正在读取世界书…';
    banner.hidden = true;
    clearBtn.hidden = true;
    list.innerHTML = '';
    const state = await iphoneWbCollectState();
    currentState = state;
    if (!state.books.length) {
      const empty = document.createElement('p');
      empty.className = 'iphone-wb__empty';
      empty.textContent = state.mode === 'none'
        ? '没有检测到世界书引擎（需在酒馆页面内使用）。'
        : '没有找到生效的世界书。';
      list.appendChild(empty);
      refreshChrome(state);
      return;
    }
    for (const book of state.books) {
      const block = document.createElement('section');
      block.className = 'iphone-wb__book';
      const head = document.createElement('button');
      head.type = 'button';
      head.className = 'iphone-wb__book-head';
      const title = document.createElement('span');
      title.className = 'iphone-wb__book-name';
      title.textContent = book.name;
      const count = document.createElement('span');
      count.className = 'iphone-wb__book-count';
      count.textContent = `${book.entries.length} 条`;
      head.append(title, count);
      const body = document.createElement('div');
      body.className = 'iphone-wb__book-body';
      const search = document.createElement('input');
      search.type = 'search';
      search.className = 'iphone-wb__search';
      search.placeholder = '搜索条目名称…';
      const rowsBox = document.createElement('div');
      body.append(search, rowsBox);
      const rows = book.entries.map((entry) => {
        const triggered = state.triggeredKeys.has(iphoneWbEntryKey(book.name, entry.uid));
        return buildEntryRow(book, entry, triggered);
      });
      rows.forEach((row) => rowsBox.appendChild(row));
      search.addEventListener('input', () => {
        const query = search.value.trim().toLowerCase();
        rows.forEach((row, index) => {
          const entry = book.entries[index];
          const hit = !query
            || entry.name.toLowerCase().includes(query)
            || entry.content.toLowerCase().includes(query);
          row.hidden = !hit;
        });
        count.textContent = `${rows.filter((row) => !row.hidden).length} / ${book.entries.length} 条`;
      });
      head.addEventListener('click', () => block.classList.toggle('is-collapsed'));
      block.append(head, body);
      list.appendChild(block);
    }
    refreshChrome(state);
  };

  clearBtn.addEventListener('click', () => {
    const settings = iphoneGetSettings();
    if (settings.worldInfo && typeof settings.worldInfo === 'object') {
      settings.worldInfo.excluded = {};
      iphoneSaveSettings(settings);
    }
    list.querySelectorAll('.iphone-wb__entry').forEach((row) => row.__paint?.());
    refreshChrome(currentState || { mode: 'none', books: [], triggeredKeys: new Set(), stringsText: '' });
  });
  header.querySelector('.iphone-wb__refresh').addEventListener('click', () => {
    void render();
  });
  void render();

  screen.append(header, banner, note, toolbar, list);
  return screen;
}

function buildSettingsAppScreen() {
  const icons = iphoneSettingsIcons();
  const settings = iphoneGetSettings();

  const screen = document.createElement('div');
  screen.className = 'iphone-app iphone-st';

  /* ============ 主页面（iOS 设置首页仿真） ============ */
  const mainPage = document.createElement('div');
  mainPage.className = 'iphone-st__page iphone-st__page--main';

  // 顶部导航：未滚动时透明，滚过大标题后淡入毛玻璃背景与居中标题
  const mainNav = document.createElement('header');
  mainNav.className = 'iphone-st__mainnav';
  mainNav.innerHTML = '<p class="iphone-st__nav-title iphone-st__mainnav-title">设置</p>';

  const mainScroll = document.createElement('div');
  mainScroll.className = 'iphone-st__scroll';
  mainScroll.addEventListener('scroll', () => {
    mainPage.classList.toggle('is-scrolled', mainScroll.scrollTop > 30);
  });

  const largeTitle = document.createElement('header');
  largeTitle.className = 'iphone-st__large-title';
  largeTitle.textContent = '设置';

  const makeGroup = () => {
    const el = document.createElement('div');
    el.className = 'iphone-st__group';
    return el;
  };

  // 行构建：可选彩色小方块图标 + 标签 + 灰色详情 + 灰色箭头（iOS 系统行观感）
  function makeRow({ icon, tone, label, detail, detailNode, action, chevron, modifier }) {
    const row = document.createElement(action ? 'button' : 'div');
    if (action) row.type = 'button';
    row.className = `iphone-st__row${icon ? ' has-ico' : ''}${action ? ' is-link' : ''}${modifier ? ` ${modifier}` : ''}`;
    let html = icon
      ? `<span class="iphone-st__row-ico" style="background:${tone || '#8e8e93'}" aria-hidden="true">${icons[icon]}</span>`
      : '';
    html += `<span class="iphone-st__row-label">${label}</span>`;
    row.innerHTML = html;
    if (detailNode) {
      detailNode.classList.add('iphone-st__row-value');
      row.appendChild(detailNode);
    } else if (detail) {
      const value = document.createElement('span');
      value.className = 'iphone-st__row-value';
      value.textContent = detail;
      row.appendChild(value);
    } else {
      const value = document.createElement('span');
      value.className = 'iphone-st__row-value';
      row.appendChild(value);
    }
    if (chevron !== false) {
      const chev = document.createElement('span');
      chev.className = 'iphone-st__chev';
      chev.setAttribute('aria-hidden', 'true');
      chev.innerHTML = icons.chevron;
      row.appendChild(chev);
    }
    if (action) row.addEventListener('click', action);
    return row;
  }

  // 「API 连接」入口（行尾灰字 = 当前模型 / 服务器地址 / 未配置）
  const apiDetail = document.createElement('span');
  const refreshMainDetail = () => {
    apiDetail.textContent = String(settings.model || '').trim()
      || iphoneGetApiBase(settings)
      || '未配置';
  };
  const apiRow = makeRow({
    icon: 'globe',
    tone: '#007aff',
    label: 'API 连接',
    detailNode: apiDetail,
    action: () => screen.classList.add('is-api-open'),
  });

  // Apple 账户行：昵称跟随酒馆 {{user}}（与 QQ 里「我」的昵称同源，不写死；
  // 头像走 CSS 背景类，见 style.css）
  const accountRow = document.createElement('div');
  accountRow.className = 'iphone-st__row iphone-st__row--account';
  accountRow.innerHTML = `
    <span class="iphone-st__account-avatar" aria-hidden="true"></span>
    <span class="iphone-st__account-main">
      <span class="iphone-st__account-name" data-me-name></span>
      <span class="iphone-st__account-sub">Apple ID、iCloud、媒体与购买项目</span>
    </span>
    <span class="iphone-st__chev" aria-hidden="true">${icons.chevron}</span>
  `;

  // 「私聊提示词」/「群聊提示词」/「动态提示词」入口：分别编辑 QQ 联系人聊天、
  // 群聊与 QQ空间动态生成的提示词组合（三个子页共用同一套编辑器 buildPresetPage）。
  const presetRow = makeRow({
    icon: 'chat',
    tone: '#5856d6',
    label: '私聊提示词',
    action: () => screen.classList.add('is-preset-open'),
  });
  const groupPresetRow = makeRow({
    icon: 'friendGroup',
    tone: '#3fcb7e',
    label: '群聊提示词',
    action: () => screen.classList.add('is-grouppreset-open'),
  });
  const qzonePresetRow = makeRow({
    icon: 'feed',
    tone: '#f5a623',
    label: '动态提示词',
    action: () => screen.classList.add('is-qzonepreset-open'),
  });

  // 「微信私聊」/「微信群聊」/「朋友圈」提示词入口（v0.18.0）：编辑微信三组
  // 提示词组合，与 QQ 的三个入口并列（同一套 buildPresetPage 编辑器）。
  const wechatChatRow = makeRow({
    icon: 'chat',
    tone: '#07c160',
    label: '微信私聊提示词',
    action: () => screen.classList.add('is-wechatpreset-open'),
  });
  const wechatGroupRow = makeRow({
    icon: 'friendGroup',
    tone: '#07c160',
    label: '微信群聊提示词',
    action: () => screen.classList.add('is-wechatgrouppreset-open'),
  });
  const wechatMomentsRow = makeRow({
    icon: 'feed',
    tone: '#07c160',
    label: '朋友圈提示词',
    action: () => screen.classList.add('is-wechatmomentspreset-open'),
  });

  // 组装主页：大标题 → 搜索框（布局缓冲）→ 账户卡（昵称 = 酒馆 {{user}}）→
  // 「API 连接」/提示词入口
  const accountGroup = makeGroup();
  accountGroup.appendChild(accountRow);
  const apiGroup = makeGroup();
  apiGroup.appendChild(apiRow);
  const presetGroup = makeGroup();
  presetGroup.appendChild(presetRow);
  presetGroup.appendChild(groupPresetRow);
  presetGroup.appendChild(qzonePresetRow);
  const wechatPresetGroup = makeGroup();
  wechatPresetGroup.appendChild(wechatChatRow);
  wechatPresetGroup.appendChild(wechatGroupRow);
  wechatPresetGroup.appendChild(wechatMomentsRow);
  const searchBox = document.createElement('div');
  searchBox.className = 'iphone-st__search';
  searchBox.innerHTML = `
    <span class="iphone-st__search-ico" aria-hidden="true">${icons.search}</span>
    <input class="iphone-st__search-input" type="text" placeholder="搜索" aria-label="搜索">
  `;
  mainScroll.appendChild(largeTitle);
  mainScroll.appendChild(searchBox);
  mainScroll.appendChild(accountGroup);
  mainScroll.appendChild(apiGroup);
  mainScroll.appendChild(presetGroup);
  mainScroll.appendChild(wechatPresetGroup);
  mainPage.appendChild(mainNav);
  mainPage.appendChild(mainScroll);

  /* ============ API 连接子页 ============ */
  const apiPage = document.createElement('div');
  apiPage.className = 'iphone-st__page iphone-st__page--api';

  // iOS 表单动作放导航栏右侧：蓝色文字「连接」
  const apiNav = document.createElement('header');
  apiNav.className = 'iphone-st__nav';
  apiNav.innerHTML = `
    <button type="button" class="iphone-st__back">
      <span class="iphone-st__back-chev" aria-hidden="true">${icons.back}</span>设置
    </button>
    <p class="iphone-st__nav-title">API 连接</p>
    <button type="button" class="iphone-st__nav-action">连接</button>
  `;
  apiNav.querySelector('.iphone-st__back').addEventListener('click', () => {
    screen.classList.remove('is-api-open');
  });
  const connectBtn = apiNav.querySelector('.iphone-st__nav-action');

  const apiScroll = document.createElement('div');
  apiScroll.className = 'iphone-st__scroll iphone-st__form';

  const sectionTitle = (text) => {
    const el = document.createElement('p');
    el.className = 'iphone-st__section-title';
    el.textContent = text;
    return el;
  };
  // iOS 表单行：标签居左、输入居右占余下宽度（如「添加 VPN 配置」页）
  const fieldRow = (labelText, input, trailing) => {
    const row = document.createElement('div');
    row.className = 'iphone-st__fieldrow';
    const label = document.createElement('label');
    label.className = 'iphone-st__fieldrow-label';
    label.textContent = labelText;
    row.appendChild(label);
    row.appendChild(input);
    if (trailing) row.appendChild(trailing);
    return row;
  };
  const formGroup = () => {
    const el = document.createElement('div');
    el.className = 'iphone-st__group';
    return el;
  };

  const urlInput = document.createElement('input');
  urlInput.className = 'iphone-st__input';
  urlInput.type = 'text';
  urlInput.placeholder = 'https://api.example.com/v1';
  urlInput.autocomplete = 'off';
  urlInput.spellcheck = false;
  urlInput.value = settings.apiUrl || '';
  urlInput.addEventListener('input', () => {
    settings.apiUrl = urlInput.value.trim();
    iphoneSaveSettings(settings);
    refreshMainDetail();
  });

  const keyInput = document.createElement('input');
  keyInput.className = 'iphone-st__input';
  keyInput.type = 'password';
  keyInput.placeholder = 'sk-...';
  keyInput.autocomplete = 'off';
  keyInput.spellcheck = false;
  keyInput.value = settings.apiKey || '';
  keyInput.addEventListener('input', () => {
    settings.apiKey = keyInput.value.trim();
    iphoneSaveSettings(settings);
  });

  const eyeBtn = document.createElement('button');
  eyeBtn.type = 'button';
  eyeBtn.className = 'iphone-st__eye';
  eyeBtn.title = '显示密钥';
  eyeBtn.innerHTML = icons.eye;
  eyeBtn.addEventListener('click', () => {
    const show = keyInput.type === 'password';
    keyInput.type = show ? 'text' : 'password';
    eyeBtn.innerHTML = show ? icons.eyeOff : icons.eye;
    eyeBtn.title = show ? '隐藏密钥' : '显示密钥';
  });

  const serverGroup = formGroup();
  serverGroup.appendChild(fieldRow('服务器地址', urlInput));
  serverGroup.appendChild(fieldRow('API 密钥', keyInput, eyeBtn));

  // 状态行：iOS 式分组脚注（左对齐小字；ok 绿 / error 红）
  const status = document.createElement('p');
  status.className = 'iphone-st__foot';
  status.dataset.state = 'idle';
  const setStatus = (message, state = 'idle') => {
    status.textContent = message;
    status.dataset.state = state;
  };

  // 「模型」行 → 推入模型选择子页（iOS 的勾选列表页）
  const modelValue = document.createElement('span');
  const modelRow = makeRow({
    label: '模型',
    detailNode: modelValue,
    action: () => {
      buildModelOptions();
      refreshModelUi();
      screen.classList.add('is-models-open');
    },
  });
  const modelGroup = formGroup();
  modelGroup.appendChild(modelRow);

  // 「请求」组：并发限制与思考强度（功能同 Kaleidoscope；均为 iOS 勾选子页）
  const limitValue = document.createElement('span');
  const concurrencyRow = makeRow({
    label: '并发限制',
    detailNode: limitValue,
    action: () => {
      buildLimitOptions();
      screen.classList.add('is-limit-open');
    },
  });

  const effortValue = document.createElement('span');
  const effortRow = makeRow({
    label: '思考强度',
    detailNode: effortValue,
    action: () => {
      buildReasoningOptions();
      screen.classList.add('is-reasoning-open');
    },
  });

  const requestGroup = formGroup();
  requestGroup.appendChild(concurrencyRow);
  requestGroup.appendChild(effortRow);

  const refreshRequestUi = () => {
    const enabled = settings.apiConcurrencyEnabled !== false;
    const limit = iphoneClampConcurrencyLimit(settings);
    limitValue.textContent = enabled ? `${limit} 个` : '不限制';
    const current = String(settings.apiReasoningEffort || '');
    effortValue.textContent = (IPHONE_REASONING_EFFORT_OPTIONS.find((opt) => opt.value === current)
      || IPHONE_REASONING_EFFORT_OPTIONS[0]).label;
  };

  const proxyFoot = document.createElement('p');
  proxyFoot.className = 'iphone-st__foot';
  proxyFoot.textContent = '兼容 OpenAI 接口格式（/models）。跨域地址优先经 TauriTavern 宿主代理转发，失败自动回退直连；配置保存在宿主设置中，供手机内其他应用使用。';

  apiScroll.appendChild(sectionTitle('服务器'));
  apiScroll.appendChild(serverGroup);
  apiScroll.appendChild(status);
  apiScroll.appendChild(sectionTitle('模型'));
  apiScroll.appendChild(modelGroup);
  apiScroll.appendChild(sectionTitle('请求'));
  apiScroll.appendChild(requestGroup);
  apiScroll.appendChild(proxyFoot);

  apiPage.appendChild(apiNav);
  apiPage.appendChild(apiScroll);

  /* ============ 模型选择子页（iOS 勾选列表） ============ */
  const modelsPage = document.createElement('div');
  modelsPage.className = 'iphone-st__page iphone-st__page--models';

  const modelsNav = document.createElement('header');
  modelsNav.className = 'iphone-st__nav';
  modelsNav.innerHTML = `
    <button type="button" class="iphone-st__back">
      <span class="iphone-st__back-chev" aria-hidden="true">${icons.back}</span>API 连接
    </button>
    <p class="iphone-st__nav-title">模型</p>
    <span class="iphone-st__nav-spacer" aria-hidden="true"></span>
  `;
  modelsNav.querySelector('.iphone-st__back').addEventListener('click', () => {
    screen.classList.remove('is-models-open');
  });

  const modelsScroll = document.createElement('div');
  modelsScroll.className = 'iphone-st__scroll iphone-st__form';

  const modelsList = formGroup();
  const modelsFoot = document.createElement('p');
  modelsFoot.className = 'iphone-st__foot';
  modelsFoot.textContent = '点击列表中的模型即可选用；也可以在下方直接输入模型名称。';

  const customInput = document.createElement('input');
  customInput.className = 'iphone-st__input';
  customInput.type = 'text';
  customInput.placeholder = '例如 gpt-4o-mini';
  customInput.autocomplete = 'off';
  customInput.spellcheck = false;
  customInput.addEventListener('input', () => {
    settings.model = customInput.value.trim();
    iphoneSaveSettings(settings);
    refreshModelUi();
  });
  const customGroup = formGroup();
  customGroup.appendChild(fieldRow('自定义模型', customInput));

  const buildModelOptions = () => {
    const models = Array.isArray(settings.modelOptions) ? settings.modelOptions : [];
    const values = [...models];
    if (settings.model && !values.includes(settings.model)) values.push(settings.model);
    modelsList.innerHTML = '';
    if (values.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'iphone-st__empty';
      empty.textContent = '尚未拉取到模型列表，请先连接。';
      modelsList.appendChild(empty);
      return;
    }
    values.forEach((model, index) => {
      const row = document.createElement('button');
      row.type = 'button';
      row.className = `iphone-st__option${index === 0 ? ' no-sep' : ''}`;
      row.dataset.model = model;
      row.innerHTML = `
        <span class="iphone-st__option-name">${model}</span>
        <span class="iphone-st__option-check" aria-hidden="true">${icons.check}</span>
      `;
      row.addEventListener('click', () => {
        settings.model = model;
        iphoneSaveSettings(settings);
        refreshModelUi();
      });
      modelsList.appendChild(row);
    });
  };

  const refreshModelUi = () => {
    const current = String(settings.model || '').trim();
    modelValue.textContent = current || '未选择';
    customInput.value = current;
    modelsList.querySelectorAll('.iphone-st__option').forEach((row) => {
      row.classList.toggle('is-selected', row.dataset.model === current);
    });
    refreshMainDetail();
  };

  modelsScroll.appendChild(modelsList);
  modelsScroll.appendChild(modelsFoot);
  modelsScroll.appendChild(customGroup);

  modelsPage.appendChild(modelsNav);
  modelsPage.appendChild(modelsScroll);

  /* ============ 思考强度子页（iOS 勾选列表） ============ */
  const reasoningPage = document.createElement('div');
  reasoningPage.className = 'iphone-st__page iphone-st__page--reasoning';

  const reasoningNav = document.createElement('header');
  reasoningNav.className = 'iphone-st__nav';
  reasoningNav.innerHTML = `
    <button type="button" class="iphone-st__back">
      <span class="iphone-st__back-chev" aria-hidden="true">${icons.back}</span>API 连接
    </button>
    <p class="iphone-st__nav-title">思考强度</p>
    <span class="iphone-st__nav-spacer" aria-hidden="true"></span>
  `;
  reasoningNav.querySelector('.iphone-st__back').addEventListener('click', () => {
    screen.classList.remove('is-reasoning-open');
  });

  const reasoningScroll = document.createElement('div');
  reasoningScroll.className = 'iphone-st__scroll iphone-st__form';
  const reasoningList = formGroup();
  const reasoningFoot = document.createElement('p');
  reasoningFoot.className = 'iphone-st__foot';
  reasoningFoot.textContent = '控制带思考能力模型的思考预算（reasoning_effort，OpenAI 兼容参数）；选「默认」时不随请求发送。';

  const buildReasoningOptions = () => {
    const current = String(settings.apiReasoningEffort || '');
    reasoningList.innerHTML = '';
    IPHONE_REASONING_EFFORT_OPTIONS.forEach((opt, index) => {
      const row = document.createElement('button');
      row.type = 'button';
      row.className = `iphone-st__option${index === 0 ? ' no-sep' : ''}${opt.value === current ? ' is-selected' : ''}`;
      row.innerHTML = `
        <span class="iphone-st__option-name">${opt.label}</span>
        <span class="iphone-st__option-check" aria-hidden="true">${icons.check}</span>
      `;
      row.addEventListener('click', () => {
        settings.apiReasoningEffort = opt.value;
        iphoneSaveSettings(settings);
        refreshRequestUi();
        screen.classList.remove('is-reasoning-open');
      });
      reasoningList.appendChild(row);
    });
  };

  reasoningScroll.appendChild(reasoningList);
  reasoningScroll.appendChild(reasoningFoot);
  reasoningPage.appendChild(reasoningNav);
  reasoningPage.appendChild(reasoningScroll);

  /* ============ 并发限制子页（预设勾选 + 自定义输入，交互同「模型」页） ============ */
  const limitPage = document.createElement('div');
  limitPage.className = 'iphone-st__page iphone-st__page--limit';

  const limitNav = document.createElement('header');
  limitNav.className = 'iphone-st__nav';
  limitNav.innerHTML = `
    <button type="button" class="iphone-st__back">
      <span class="iphone-st__back-chev" aria-hidden="true">${icons.back}</span>API 连接
    </button>
    <p class="iphone-st__nav-title">并发限制</p>
    <span class="iphone-st__nav-spacer" aria-hidden="true"></span>
  `;
  limitNav.querySelector('.iphone-st__back').addEventListener('click', () => {
    screen.classList.remove('is-limit-open');
  });

  const limitScroll = document.createElement('div');
  limitScroll.className = 'iphone-st__scroll iphone-st__form';
  const limitList = formGroup();
  const limitFoot = document.createElement('p');
  limitFoot.className = 'iphone-st__foot';
  limitFoot.textContent = '「不限制」时请求不做排队；选择或输入 1–99 的数值，限制同时进行的请求数，超出的请求自动排队等待。';

  const limitInput = document.createElement('input');
  limitInput.className = 'iphone-st__input';
  limitInput.type = 'text';
  limitInput.inputMode = 'numeric';
  limitInput.placeholder = '1–99';
  limitInput.autocomplete = 'off';
  limitInput.spellcheck = false;
  limitInput.addEventListener('input', () => {
    const num = parseInt(limitInput.value, 10);
    if (!Number.isFinite(num)) return;
    settings.apiConcurrencyEnabled = true;
    settings.apiConcurrencyLimit = Math.min(99, Math.max(1, num));
    iphoneSaveSettings(settings);
    buildLimitOptions();
    refreshRequestUi();
  });
  const limitCustomGroup = formGroup();
  limitCustomGroup.appendChild(fieldRow('自定义上限', limitInput));

  const setConcurrencyState = (enabled, limit) => {
    settings.apiConcurrencyEnabled = enabled;
    if (limit != null) settings.apiConcurrencyLimit = limit;
    iphoneSaveSettings(settings);
    buildLimitOptions();
    refreshRequestUi();
    screen.classList.remove('is-limit-open');
  };

  const buildLimitOptions = () => {
    const enabled = settings.apiConcurrencyEnabled !== false;
    const limit = iphoneClampConcurrencyLimit(settings);
    const options = [{ label: '不限制', value: null }]
      .concat(IPHONE_CONCURRENCY_PRESETS.map((n) => ({ label: String(n), value: n })));
    limitList.innerHTML = '';
    options.forEach((opt, index) => {
      const selected = opt.value == null ? !enabled : enabled && limit === opt.value;
      const row = document.createElement('button');
      row.type = 'button';
      row.className = `iphone-st__option${index === 0 ? ' no-sep' : ''}${selected ? ' is-selected' : ''}`;
      row.innerHTML = `
        <span class="iphone-st__option-name">${opt.label}</span>
        <span class="iphone-st__option-check" aria-hidden="true">${icons.check}</span>
      `;
      row.addEventListener('click', () => setConcurrencyState(opt.value != null, opt.value));
      limitList.appendChild(row);
    });
    limitInput.value = enabled ? String(limit) : '';
  };

  limitScroll.appendChild(limitList);
  limitScroll.appendChild(limitFoot);
  limitScroll.appendChild(limitCustomGroup);
  limitPage.appendChild(limitNav);
  limitPage.appendChild(limitScroll);

  // 「连接」：拉取模型列表（跨域先走宿主代理再回退直连，见 js/host.js）
  connectBtn.addEventListener('click', async () => {
    settings.apiUrl = urlInput.value.trim();
    settings.apiKey = keyInput.value.trim();
    iphoneSaveSettings(settings);
    if (!iphoneGetApiBase(settings)) {
      setStatus('请先填写服务器地址。', 'error');
      return;
    }
    connectBtn.disabled = true;
    connectBtn.textContent = '连接中…';
    setStatus('连接中，正在拉取模型…', 'busy');
    try {
      const models = await iphoneFetchModelList(settings);
      settings.modelOptions = models;
      if (!settings.model || !models.includes(settings.model)) settings.model = models[0];
      iphoneSaveSettingsNow(settings);
      refreshModelUi();
      setStatus(`已连接，拉取到 ${models.length} 个模型。`, 'ok');
    } catch (error) {
      setStatus(String(error?.message || error), 'error');
    } finally {
      connectBtn.disabled = false;
      connectBtn.textContent = '连接';
    }
  });

  /* ============ 提示词预设子页（私聊 / 群聊共用同一套编辑器） ============ */
  // 写回 settings.promptPresets 的对应键并保存：以默认值打底合并，历史遗留的
  // 半截配置也会被补全；所有改动即时保存，无需确认按钮。
  const savePromptPreset = (key, defaults, patch) => {
    if (!settings.promptPresets || typeof settings.promptPresets !== 'object') {
      settings.promptPresets = {};
    }
    settings.promptPresets[key] = {
      ...defaults,
      ...settings.promptPresets[key],
      ...patch,
    };
    iphoneSaveSettings(settings);
  };
  const saveQqPreset = (patch) => savePromptPreset('qqChat', IPHONE_QQ_CHAT_PRESET_DEFAULT, patch);
  const saveGroupPreset = (patch) => savePromptPreset('groupChat', IPHONE_QQ_GROUP_PRESET_DEFAULT, patch);
  const saveQzonePreset = (patch) => savePromptPreset('qzone', IPHONE_QZONE_PRESET_DEFAULT, patch);
  const saveWechatChatPreset = (patch) => savePromptPreset('wechatChat', IPHONE_WECHAT_CHAT_PRESET_DEFAULT, patch);
  const saveWechatGroupPreset = (patch) => savePromptPreset('wechatGroup', IPHONE_WECHAT_GROUP_PRESET_DEFAULT, patch);
  const saveWechatMomentsPreset = (patch) => savePromptPreset('wechatMoments', IPHONE_WECHAT_MOMENTS_PRESET_DEFAULT, patch);

  // 预设编辑器（v0.12.0 从私聊子页抽取成工厂，私聊/群聊/动态三页共用；v0.18.0
  // 起微信的三组提示词页也复用，经 floorLog 换成微信的楼层段称谓）：导航 +
  // 角色扮演指令 + 扮演与对白指导 + 上下文注入（世界书开关 / 记录楼层开关 /
  // 主线楼层数）+ 可选写作指导（guidanceSection，仅「动态提示词」页）+ 可选
  // 回复指导与回复格式（replySection，仅「动态提示词」页，v0.17.0）+ 输出格式 +
  // 占位符说明 + 恢复默认；仅标题、存档键、个别脚注与默认值不同。
  const buildPresetPage = ({ pageClass, openClass, navTitle, sectionPrefix, formatFootText, footText, resetLabel, save, getPreset, defaults, guidanceSection, replySection, floorLogLabels }) => {
    // 记录楼层的称谓（QQ 页用「QQ」，微信页用「微信」；<qq_chat_log> / <wechat_chat_log>）
    const floorLogOn = floorLogLabels?.on ?? '附带最新QQ记录楼层';
    const floorLogOff = floorLogLabels?.off ?? '不附带QQ记录楼层';
    const floorLogFootText = floorLogLabels?.footText
      ?? '把酒馆里最新一楼的 iPhone_Message 聊天记录（每段各自用方括号标签包裹，可能含多个联系人/群聊的记录段，超长截尾保留最近记录）包进 <qq_chat_log> 随 system 发送；清空聊天后它就是仅存的历史。';
    const preset = getPreset();
    const page = document.createElement('div');
    page.className = `iphone-st__page ${pageClass}`;

    const nav = document.createElement('header');
    nav.className = 'iphone-st__nav';
    nav.innerHTML = `
      <button type="button" class="iphone-st__back">
        <span class="iphone-st__back-chev" aria-hidden="true">${icons.back}</span>设置
      </button>
      <p class="iphone-st__nav-title">${navTitle}</p>
      <span class="iphone-st__nav-spacer" aria-hidden="true"></span>
    `;
    nav.querySelector('.iphone-st__back').addEventListener('click', () => {
      screen.classList.remove(openClass);
    });

    const scroll = document.createElement('div');
    scroll.className = 'iphone-st__scroll iphone-st__form';

    /* -- 角色扮演指令（多行文本域） -- */
    scroll.appendChild(sectionTitle(`${sectionPrefix} · 角色扮演指令`));
    const personaInput = document.createElement('textarea');
    personaInput.className = 'iphone-st__textarea';
    personaInput.rows = 4;
    personaInput.spellcheck = false;
    personaInput.placeholder = '（留空则不附带角色扮演指令）';
    personaInput.value = preset.persona;
    personaInput.addEventListener('input', () => save({ persona: personaInput.value }));
    const personaGroup = formGroup();
    personaGroup.appendChild(personaInput);
    scroll.appendChild(personaGroup);
    const personaFoot = document.createElement('p');
    personaFoot.className = 'iphone-st__foot';
    personaFoot.textContent = '拼在 system 最前、包在 <roleplay_instructions> 里的角色扮演指令。';
    scroll.appendChild(personaFoot);

    /* -- 扮演逻辑 + 对白规范（多行文本域，留空不附带） -- */
    scroll.appendChild(sectionTitle(`${sectionPrefix} · 扮演与对白指导`));
    const npcInput = document.createElement('textarea');
    npcInput.className = 'iphone-st__textarea';
    npcInput.rows = 8;
    npcInput.spellcheck = false;
    npcInput.placeholder = '（留空则不附带扮演逻辑指导）';
    npcInput.value = preset.npcLogic;
    npcInput.addEventListener('input', () => save({ npcLogic: npcInput.value }));
    const npcGroup = formGroup();
    npcGroup.appendChild(npcInput);
    scroll.appendChild(npcGroup);
    const npcFoot = document.createElement('p');
    npcFoot.className = 'iphone-st__foot';
    npcFoot.textContent = '随 system 附带的扮演逻辑（包在 <npc_logic> 里）：「先是人，后是设定」、主体性与行为动机等；改写后即时生效，留空则整段不发送。';
    scroll.appendChild(npcFoot);
    const dialogueInput = document.createElement('textarea');
    dialogueInput.className = 'iphone-st__textarea';
    dialogueInput.rows = 8;
    dialogueInput.spellcheck = false;
    dialogueInput.placeholder = '（留空则不附带对白规范）';
    dialogueInput.value = preset.dialogueGuidance;
    dialogueInput.addEventListener('input', () => save({ dialogueGuidance: dialogueInput.value }));
    const dialogueGroup = formGroup();
    dialogueGroup.appendChild(dialogueInput);
    scroll.appendChild(dialogueGroup);
    const dialogueFoot = document.createElement('p');
    dialogueFoot.className = 'iphone-st__foot';
    dialogueFoot.textContent = '随 system 附带的对白规范（包在 <dialogue_guidance> 里）：口语化、生活化、带情绪与立场、禁播报腔；改写后即时生效，留空则整段不发送。';
    scroll.appendChild(dialogueFoot);

    /* -- 可选写作指导（仅「动态提示词」页：<dynamics_guidance>） -- */
    let guidanceInput = null;
    if (guidanceSection) {
      scroll.appendChild(sectionTitle(`${sectionPrefix} · ${guidanceSection.title}`));
      guidanceInput = document.createElement('textarea');
      guidanceInput.className = 'iphone-st__textarea';
      guidanceInput.rows = 10;
      guidanceInput.spellcheck = false;
      guidanceInput.placeholder = '（留空则不附带写作指导）';
      guidanceInput.value = String(preset.guidance ?? '');
      guidanceInput.addEventListener('input', () => save({ guidance: guidanceInput.value }));
      const guidanceGroup = formGroup();
      guidanceGroup.appendChild(guidanceInput);
      scroll.appendChild(guidanceGroup);
      const guidanceFoot = document.createElement('p');
      guidanceFoot.className = 'iphone-st__foot';
      guidanceFoot.textContent = guidanceSection.footText;
      scroll.appendChild(guidanceFoot);
    }

    /* -- 可选回复指导与回复格式（仅「动态提示词」页：<reply_guidance> /
          <output_format>，玩家在动态下留言后的回复用，v0.17.0） -- */
    let replyGuidanceInput = null;
    let replyFormatInput = null;
    if (replySection) {
      scroll.appendChild(sectionTitle(`${sectionPrefix} · ${replySection.title}`));
      replyGuidanceInput = document.createElement('textarea');
      replyGuidanceInput.className = 'iphone-st__textarea';
      replyGuidanceInput.rows = 8;
      replyGuidanceInput.spellcheck = false;
      replyGuidanceInput.placeholder = '（留空则不附带回复指导）';
      replyGuidanceInput.value = String(preset.replyGuidance ?? '');
      replyGuidanceInput.addEventListener('input', () => save({ replyGuidance: replyGuidanceInput.value }));
      const replyGuidanceGroup = formGroup();
      replyGuidanceGroup.appendChild(replyGuidanceInput);
      scroll.appendChild(replyGuidanceGroup);
      const replyGuidanceFoot = document.createElement('p');
      replyGuidanceFoot.className = 'iphone-st__foot';
      replyGuidanceFoot.textContent = replySection.guidanceFootText;
      scroll.appendChild(replyGuidanceFoot);
      replyFormatInput = document.createElement('textarea');
      replyFormatInput.className = 'iphone-st__textarea';
      replyFormatInput.rows = 5;
      replyFormatInput.spellcheck = false;
      replyFormatInput.placeholder = '（留空则不附带回复格式约定）';
      replyFormatInput.value = String(preset.replyFormat ?? '');
      replyFormatInput.addEventListener('input', () => save({ replyFormat: replyFormatInput.value }));
      const replyFormatGroup = formGroup();
      replyFormatGroup.appendChild(replyFormatInput);
      scroll.appendChild(replyFormatGroup);
      const replyFormatFoot = document.createElement('p');
      replyFormatFoot.className = 'iphone-st__foot';
      replyFormatFoot.textContent = replySection.formatFootText;
      scroll.appendChild(replyFormatFoot);
    }

    /* -- 上下文注入（世界书开关 + 最新QQ记录楼层开关 + 主线楼层数） -- */
    scroll.appendChild(sectionTitle(`${sectionPrefix} · 上下文注入`));
    const worldGroup = formGroup();
    const worldOptions = [
      { value: true, label: '附带世界书设定' },
      { value: false, label: '不附带世界书设定' },
    ];
    worldOptions.forEach((opt, index) => {
      const row = document.createElement('button');
      row.type = 'button';
      row.className = `iphone-st__option${index === 0 ? ' no-sep' : ''}${preset.worldBook === opt.value ? ' is-selected' : ''}`;
      row.innerHTML = `
        <span class="iphone-st__option-name">${opt.label}</span>
        <span class="iphone-st__option-check" aria-hidden="true">${icons.check}</span>
      `;
      row.addEventListener('click', () => {
        save({ worldBook: opt.value });
        worldGroup.querySelectorAll('.iphone-st__option').forEach((el) => el.classList.toggle('is-selected', el === row));
      });
      worldGroup.appendChild(row);
    });
    scroll.appendChild(worldGroup);
    /* -- 最新记录楼层开关（<qq_chat_log> / <wechat_chat_log>） -- */
    const floorLogGroup = formGroup();
    const floorLogOptions = [
      { value: true, label: floorLogOn },
      { value: false, label: floorLogOff },
    ];
    floorLogOptions.forEach((opt, index) => {
      const row = document.createElement('button');
      row.type = 'button';
      row.className = `iphone-st__option${index === 0 ? ' no-sep' : ''}${preset.latestFloor === opt.value ? ' is-selected' : ''}`;
      row.innerHTML = `
        <span class="iphone-st__option-name">${opt.label}</span>
        <span class="iphone-st__option-check" aria-hidden="true">${icons.check}</span>
      `;
      row.addEventListener('click', () => {
        save({ latestFloor: opt.value });
        floorLogGroup.querySelectorAll('.iphone-st__option').forEach((el) => el.classList.toggle('is-selected', el === row));
      });
      floorLogGroup.appendChild(row);
    });
    scroll.appendChild(floorLogGroup);
    const floorLogFoot = document.createElement('p');
    floorLogFoot.className = 'iphone-st__foot';
    floorLogFoot.textContent = floorLogFootText;
    scroll.appendChild(floorLogFoot);
    const floorsInput = document.createElement('input');
    floorsInput.className = 'iphone-st__input';
    floorsInput.type = 'number';
    floorsInput.min = '0';
    floorsInput.max = '50';
    floorsInput.step = '1';
    floorsInput.inputMode = 'numeric';
    floorsInput.value = String(preset.historyFloors);
    floorsInput.addEventListener('input', () => {
      const n = Math.round(Number(floorsInput.value));
      save({ historyFloors: Number.isFinite(n) ? Math.min(50, Math.max(0, n)) : 0 });
    });
    // 失焦时把显示值吸附回规范化结果（输入越界或留空时生效值是夹紧后的）。
    floorsInput.addEventListener('blur', () => {
      floorsInput.value = String(getPreset().historyFloors);
    });
    const floorsGroup = formGroup();
    floorsGroup.appendChild(fieldRow('主线楼层数', floorsInput));
    scroll.appendChild(floorsGroup);
    const contextFoot = document.createElement('p');
    contextFoot.className = 'iphone-st__foot';
    contextFoot.textContent = '主线楼层数 = 随 system 附带酒馆主线最近对话（包在 <tavern_context> 里）的楼层数（0 = 不附带），始终跳过本插件的聊天记录楼层。';
    scroll.appendChild(contextFoot);

    /* -- 输出格式（多行文本域） -- */
    scroll.appendChild(sectionTitle(`${sectionPrefix} · 输出格式`));
    const formatInput = document.createElement('textarea');
    formatInput.className = 'iphone-st__textarea';
    formatInput.rows = 4;
    formatInput.spellcheck = false;
    formatInput.placeholder = '（留空则不附带输出格式约定）';
    formatInput.value = preset.format;
    formatInput.addEventListener('input', () => save({ format: formatInput.value }));
    const formatGroup = formGroup();
    formatGroup.appendChild(formatInput);
    scroll.appendChild(formatGroup);
    const formatFoot = document.createElement('p');
    formatFoot.className = 'iphone-st__foot';
    formatFoot.textContent = formatFootText;
    scroll.appendChild(formatFoot);

    /* -- 占位符说明 + 恢复默认 -- */
    const foot = document.createElement('p');
    foot.className = 'iphone-st__foot';
    foot.textContent = footText;
    scroll.appendChild(foot);
    const resetGroup = formGroup();
    const resetRow = document.createElement('button');
    resetRow.type = 'button';
    resetRow.className = 'iphone-st__reset';
    resetRow.textContent = resetLabel;
    resetRow.addEventListener('click', () => {
      save({
        ...defaults,
        npcLogic: IPHONE_QQ_NPC_LOGIC,
        dialogueGuidance: IPHONE_QQ_DIALOGUE_GUIDANCE,
      });
      personaInput.value = defaults.persona;
      formatInput.value = defaults.format;
      npcInput.value = IPHONE_QQ_NPC_LOGIC;
      dialogueInput.value = IPHONE_QQ_DIALOGUE_GUIDANCE;
      if (guidanceInput) guidanceInput.value = String(defaults.guidance ?? '');
      if (replyGuidanceInput) replyGuidanceInput.value = String(defaults.replyGuidance ?? '');
      if (replyFormatInput) replyFormatInput.value = String(defaults.replyFormat ?? '');
      floorsInput.value = String(defaults.historyFloors);
      worldGroup.querySelectorAll('.iphone-st__option').forEach((el, index) => {
        el.classList.toggle('is-selected', worldOptions[index].value === defaults.worldBook);
      });
      floorLogGroup.querySelectorAll('.iphone-st__option').forEach((el, index) => {
        el.classList.toggle('is-selected', floorLogOptions[index].value === defaults.latestFloor);
      });
    });
    resetGroup.appendChild(resetRow);
    scroll.appendChild(resetGroup);

    page.appendChild(nav);
    page.appendChild(scroll);
    return page;
  };

  const presetPage = buildPresetPage({
    pageClass: 'iphone-st__page--preset',
    openClass: 'is-preset-open',
    navTitle: '私聊提示词',
    sectionPrefix: '联系人聊天',
    formatFootText: 'AI 回复按每行「联系人：「内容」」解析成聊天气泡；这段包在 <output_format> 里随 system 发送，聊天记录也会按同款样式排版，方便模型照做。',
    footText: '可用占位符：{{char}} = 联系人名，{{user}} = 你的名字。修改即时保存。',
    resetLabel: '恢复联系人聊天默认预设',
    save: saveQqPreset,
    getPreset: () => iphoneGetQqChatPreset(),
    defaults: IPHONE_QQ_CHAT_PRESET_DEFAULT,
  });

  const groupPresetPage = buildPresetPage({
    pageClass: 'iphone-st__page--grouppreset',
    openClass: 'is-grouppreset-open',
    navTitle: '群聊提示词',
    sectionPrefix: '群聊',
    formatFootText: 'AI 回复按每行「成员名：「内容」」解析成群聊气泡（行首成员名区分发言人）；这段包在 <output_format> 里随 system 发送，聊天记录也会按同款样式排版，方便模型照做。',
    footText: '可用占位符：{{group}} = 群名（角色扮演指令与输出格式里的 {{char}} 也替换成群名；扮演与对白指导里的 {{char}} 替换成「群成员」），{{user}} = 你的名字。群成员列表按建群成员自动生成，无需配置。修改即时保存。',
    resetLabel: '恢复群聊默认预设',
    save: saveGroupPreset,
    getPreset: () => iphoneGetQqChatPreset('group'),
    defaults: IPHONE_QQ_GROUP_PRESET_DEFAULT,
  });

  const qzonePresetPage = buildPresetPage({
    pageClass: 'iphone-st__page--qzonepreset',
    openClass: 'is-qzonepreset-open',
    navTitle: '动态提示词',
    sectionPrefix: '空间动态',
    guidanceSection: {
      title: '动态写作指导',
      footText: '包在 <dynamics_guidance> 里随 system 发送的写作指导：挑选发布者、贴合人设、点赞与评论要有来有回等；改写后即时生效，留空则整段不发送（输出格式里仍有基本的区块示例可依）。',
    },
    replySection: {
      title: '回复写作指导',
      guidanceFootText: '包在 <reply_guidance> 里随 system 发送：玩家在动态下留言后，由 AI 生成新的评论回复（贴主 / 其他联系人应声）。改写后即时生效，留空则整段不发送。',
      formatFootText: 'AI 回复按每行「评论人：内容」解析成新评论（回复某人写作「评论人 回复 被回复人：内容」）；这段包在 <output_format> 里随 system 发送，模型没按格式输出时整段兜底成贴主的一条回复。',
    },
    formatFootText: 'AI 回复按「联系人名：「动态正文」」的动态区块解析（点赞行 + 评论区，支持「A 回复 B」）；这段包在 <output_format> 里随 system 发送，模型没按格式输出时回退成纯文字动态（没有点赞与评论）。',
    footText: '可用占位符：{{user}} = 你的名字；各段里的 {{char}} 统一替换成「联系人」（指导面向联系人名单里的每个人）。联系人名单与酒馆剧情上下文自动附带，无需配置。修改即时保存。',
    resetLabel: '恢复动态默认预设',
    save: saveQzonePreset,
    getPreset: () => iphoneGetQqChatPreset('qzone'),
    defaults: IPHONE_QZONE_PRESET_DEFAULT,
  });

  /* -- 微信三组提示词页（v0.18.0：与 QQ 的三页同构，仅称谓 / 存档键 / 默认值不同） -- */
  const wxFloorLogLabels = {
    on: '附带最新微信记录楼层',
    off: '不附带微信记录楼层',
    footText: '把酒馆里最新一楼的 iPhone_Message 聊天记录（每段各自用方括号标签包裹，可能含多个联系人/群聊的记录段，含微信与QQ的记录，超长截尾保留最近记录）包进 <wechat_chat_log> 随 system 发送；清空聊天后它就是仅存的历史。',
  };

  const wechatPresetPage = buildPresetPage({
    pageClass: 'iphone-st__page--wechatpreset',
    openClass: 'is-wechatpreset-open',
    navTitle: '微信私聊提示词',
    sectionPrefix: '微信联系人聊天',
    formatFootText: 'AI 回复按每行「联系人：「内容」」解析成聊天气泡；这段包在 <output_format> 里随 system 发送，聊天记录也会按同款样式排版，方便模型照做。',
    footText: '可用占位符：{{char}} = 联系人名，{{user}} = 你的名字。修改即时保存。',
    resetLabel: '恢复微信私聊默认预设',
    save: saveWechatChatPreset,
    getPreset: () => iphoneGetWechatChatPreset(),
    defaults: IPHONE_WECHAT_CHAT_PRESET_DEFAULT,
    floorLogLabels: wxFloorLogLabels,
  });

  const wechatGroupPresetPage = buildPresetPage({
    pageClass: 'iphone-st__page--wechatgrouppreset',
    openClass: 'is-wechatgrouppreset-open',
    navTitle: '微信群聊提示词',
    sectionPrefix: '微信群聊',
    formatFootText: 'AI 回复按每行「成员名：「内容」」解析成群聊气泡（行首成员名区分发言人）；这段包在 <output_format> 里随 system 发送，聊天记录也会按同款样式排版，方便模型照做。',
    footText: '可用占位符：{{group}} = 群名（角色扮演指令与输出格式里的 {{char}} 也替换成群名；扮演与对白指导里的 {{char}} 替换成「群成员」），{{user}} = 你的名字。群成员列表按建群成员自动生成，无需配置。修改即时保存。',
    resetLabel: '恢复微信群聊默认预设',
    save: saveWechatGroupPreset,
    getPreset: () => iphoneGetWechatChatPreset('group'),
    defaults: IPHONE_WECHAT_GROUP_PRESET_DEFAULT,
    floorLogLabels: wxFloorLogLabels,
  });

  const wechatMomentsPresetPage = buildPresetPage({
    pageClass: 'iphone-st__page--wechatmomentspreset',
    openClass: 'is-wechatmomentspreset-open',
    navTitle: '朋友圈提示词',
    sectionPrefix: '朋友圈动态',
    guidanceSection: {
      title: '动态写作指导',
      footText: '包在 <moments_guidance> 里随 system 发送的写作指导：挑选发布者、贴合人设、点赞与评论要有来有回等；改写后即时生效，留空则整段不发送（输出格式里仍有基本的区块示例可依）。',
    },
    replySection: {
      title: '回复写作指导',
      guidanceFootText: '包在 <reply_guidance> 里随 system 发送：玩家在朋友圈动态下留言后，由 AI 生成新的评论回复（贴主 / 其他联系人应声）。改写后即时生效，留空则整段不发送。',
      formatFootText: 'AI 回复按每行「评论人：内容」解析成新评论（回复某人写作「评论人 回复 被回复人：内容」）；这段包在 <output_format> 里随 system 发送，模型没按格式输出时整段兜底成贴主的一条回复。',
    },
    formatFootText: 'AI 回复按「联系人名：「动态正文」」的动态区块解析（点赞行 + 评论区，支持「A 回复 B」）；这段包在 <output_format> 里随 system 发送，模型没按格式输出时回退成纯文字动态（没有点赞与评论）。',
    footText: '可用占位符：{{user}} = 你的名字；各段里的 {{char}} 统一替换成「联系人」（指导面向联系人名单里的每个人）。联系人名单与酒馆剧情上下文自动附带，无需配置。修改即时保存。',
    resetLabel: '恢复朋友圈默认预设',
    save: saveWechatMomentsPreset,
    getPreset: () => iphoneGetWechatChatPreset('moments'),
    defaults: IPHONE_WECHAT_MOMENTS_PRESET_DEFAULT,
    floorLogLabels: wxFloorLogLabels,
  });

  screen.appendChild(mainPage);
  screen.appendChild(apiPage);
  screen.appendChild(modelsPage);
  screen.appendChild(reasoningPage);
  screen.appendChild(limitPage);
  screen.appendChild(presetPage);
  screen.appendChild(groupPresetPage);
  screen.appendChild(qzonePresetPage);
  screen.appendChild(wechatPresetPage);
  screen.appendChild(wechatGroupPresetPage);
  screen.appendChild(wechatMomentsPresetPage);
  refreshMainDetail();
  refreshModelUi();
  refreshRequestUi();
  // 账户行昵称跟随酒馆 {{user}}（构建后统一填 data-me-name 节点）
  iphoneRefreshQqMeIdentity(screen);
  const cachedCount = (settings.modelOptions || []).length;
  setStatus(
    cachedCount > 0 ? `已缓存 ${cachedCount} 个模型，可点击右上角「连接」刷新。` : '填写服务器地址与密钥后，点击右上角「连接」拉取模型列表。',
  );
  return screen;
}

// 应用 id → 内页构建器；注册表里没有内页的应用点击后回落到通用占位页。
// buildLogsAppScreen 定义在 js/logs.js（拼接后同一作用域，函数声明提升可引用）。
const IPHONE_APP_SCREEN_BUILDERS = Object.freeze({
  qq: buildQqAppScreen,
  wechat: buildWechatAppScreen,
  worldbook: iphoneBuildWorldBookScreen,
  settings: buildSettingsAppScreen,
  logs: iphoneBuildLogsAppScreen,
});

function buildIphoneAppScreen(app) {
  const builder = IPHONE_APP_SCREEN_BUILDERS[app.id];
  if (builder) return builder();
  // 通用占位页：后续接入新应用但还没写内页时的兜底。
  const screen = document.createElement('div');
  screen.className = 'iphone-app iphone-app--generic';
  screen.innerHTML = `
    <div class="iphone-app__header"><span class="iphone-app__title">${app.name}</span></div>
    <div class="iphone-app__body">
      <p class="iphone-app__name">${app.name}</p>
      <p class="iphone-app__hint">占位应用 · 功能开发中</p>
    </div>
  `;
  return screen;
}

function getIphoneAppById(appId) {
  return IPHONE_APPS.find((app) => app.id === appId) || null;
}
