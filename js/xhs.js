// ===== 小红书应用（v0.26.0） =====
// 与微信朋友圈最本质的差别：朋友圈是「联系人发帖」（发布者都在剧情名单里），
// 小红书是「网友发帖」——发布者是一群与玩家素不相识的互联网陌生人，由 AI 现场
// 发明，发过一次就沉淀进「网友池」，之后复用同一个身份继续发帖、互相评论。
// 封面由模型报一个题材、插件从内置图库挑同题材的一张（模型选不了图），保证图文
// 相符；网友头像按加入网友池的顺序从内置头像里循环取用（与 QQ / 微信同一份款式表）。
// 数据独立：chatMetadata.IPhone 的 xhsData / xhsProfile（与 qqData / wechatData
// 并列），换聊天自动切换。楼层段头 `小红书笔记：`（段标签 [小红书笔记]）。
// 复用已建好的基础设施：host.js 的上下文 / 存储 / 对话 API / 楼层读写、apps.js 的
// 头像选择器与预设编辑器、世界书引擎与宏解析。

// ---------- 小红书图形（手绘 SVG，24×24 viewBox） ----------
function iphoneXhsIcons() {
  return {
    // 底部标签栏：首页 / 市集 / 消息 / 我（中间的红色圆形「+」由 CSS 画）
    home: '<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M4 10.4 12 4l8 6.4V19a1.6 1.6 0 0 1-1.6 1.6H5.6A1.6 1.6 0 0 1 4 19z"/><path d="M9.6 20.6v-6h4.8v6"/></g></svg>',
    market: '<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M4.6 8h14.8l-1.2 11.2a1.8 1.8 0 0 1-1.8 1.6H7.6a1.8 1.8 0 0 1-1.8-1.6z"/><path d="M8.6 10.4V6.6a3.4 3.4 0 0 1 6.8 0v3.8"/></g></svg>',
    message: '<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M12 3.6c-4.8 0-8.4 2.9-8.4 6.7 0 2.2 1.2 4.1 3.1 5.3l-.7 3.2c-.1.5.4.9.8.6l3.4-1.9c.6.1 1.2.2 1.8.2 4.8 0 8.4-2.9 8.4-6.9S16.8 3.6 12 3.6z"/></g></svg>',
    me: '<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="7.8" r="3.8"/><path d="M4.4 20c0-3.9 3.4-6.1 7.6-6.1s7.6 2.2 7.6 6.1"/></g></svg>',
    // 通用：搜索 / 返回 / 右箭头 / 更多 / 关闭 / 加号
    search: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="5.6" fill="none" stroke="currentColor" stroke-width="1.9"/><path d="M15.1 15.1l4.2 4.2" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/></svg>',
    back: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 4.6 7.6 12l7.4 7.4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    chevronRight: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9.5 5.5 6.5 6.5-6.5 6.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    chevronDown: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5.5 9.5 6.5 6.5 6.5-6.5" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    more: '<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="currentColor"><circle cx="5.2" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="18.8" cy="12" r="1.6"/></g></svg>',
    close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/></svg>',
    plus: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4.8v14.4M4.8 12h14.4" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/></svg>',
    // 视频封面右上角的播放三角（真机那个半透明圆标里的白色实心三角）
    playFill: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9.2 7.4v9.2l7.6-4.6z" fill="currentColor"/></svg>',
    // 笔记互动：心形（赞）/ 星形（收藏）/ 气泡（评论）/ 分享 / 不喜欢
    heart: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.2S3.4 15.4 3.4 9.4a4.7 4.7 0 0 1 8.6-2.7 4.7 4.7 0 0 1 8.6 2.7c0 6-8.6 10.8-8.6 10.8z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
    heartFill: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.2S3.4 15.4 3.4 9.4a4.7 4.7 0 0 1 8.6-2.7 4.7 4.7 0 0 1 8.6 2.7c0 6-8.6 10.8-8.6 10.8z" fill="currentColor"/></svg>',
    star: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4.2l2.35 4.76 5.25.77-3.8 3.7.9 5.23L12 16.2l-4.7 2.46.9-5.23-3.8-3.7 5.25-.77z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
    starFill: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4.2l2.35 4.76 5.25.77-3.8 3.7.9 5.23L12 16.2l-4.7 2.46.9-5.23-3.8-3.7 5.25-.77z" fill="currentColor"/></svg>',
    comment: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4.6c-4.8 0-8.2 3-8.2 7 0 2.2 1.1 4.1 2.9 5.3l-.7 3c-.1.5.4.9.8.6l3.3-1.8c.6.1 1.2.2 1.9.2 4.8 0 8.2-3 8.2-7.3s-3.4-7-8.2-7z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>',
    share: '<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3.6v11.2"/><path d="m8.2 7.2 3.8-3.6 3.8 3.6"/><path d="M5.4 13.4v5.4a1.8 1.8 0 0 0 1.8 1.8h9.6a1.8 1.8 0 0 0 1.8-1.8v-5.4"/></g></svg>',
    dislike: '<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="8.4"/><path d="M8.6 8.6l6.8 6.8M15.4 8.6l-6.8 6.8"/></g></svg>',
    // 消息页三条聚合入口：赞和收藏（心）/ 新增关注（人+）/ 评论和@（气泡）
    heartSquare: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.2S3.4 15.4 3.4 9.4a4.7 4.7 0 0 1 8.6-2.7 4.7 4.7 0 0 1 8.6 2.7c0 6-8.6 10.8-8.6 10.8z" fill="currentColor"/></svg>',
    followSquare: '<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="currentColor"><circle cx="9.4" cy="8" r="3.6"/><path d="M2.8 19.4c0-3.6 2.9-5.6 6.6-5.6s6.6 2 6.6 5.6z"/><path d="M18.4 7.6v6.4M15.2 10.8h6.4" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/></g></svg>',
    atSquare: '<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M16 8v5a2.6 2.6 0 0 0 5.2 0V12a9.2 9.2 0 1 0-3.6 7.3"/></g></svg>',
    // 笔记详情 / 发布页：编辑 / 相机 / 定位 / 私密
    edit: '<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M15.6 4.6l3.8 3.8L9 18.8l-4.6.8.8-4.6z"/><path d="M13.4 6.8l3.8 3.8"/></g></svg>',
    camera: '<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M8.7 6.8 10 4.6h4l1.3 2.2"/><rect x="3.4" y="6.8" width="17.2" height="13" rx="3"/><circle cx="12" cy="13" r="3.3"/></g></svg>',
    location: '<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M12 21s-6.4-5.3-6.4-10.4a6.4 6.4 0 0 1 12.8 0C18.4 15.7 12 21 12 21z"/><circle cx="12" cy="10.4" r="2.4"/></g></svg>',
    lock: '<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><rect x="5.2" y="10.4" width="13.6" height="9.4" rx="2.4"/><path d="M8.2 10.4V7.8a3.8 3.8 0 0 1 7.6 0v2.6"/></g></svg>',
    // 「我」页面右上角：菜单 / 二维码
    menu: '<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><path d="M4.4 7.2h15.2M4.4 12h15.2M4.4 16.8h15.2"/></g></svg>',
    qr: '<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><rect x="3.6" y="3.6" width="6.4" height="6.4" rx="1.2"/><rect x="14" y="3.6" width="6.4" height="6.4" rx="1.2"/><rect x="3.6" y="14" width="6.4" height="6.4" rx="1.2"/><path d="M14 14h2.8v2.8H14zM17.6 17.6h2.8v2.8h-2.8zM14 20.4h1.2M20.4 14h-1.2"/></g></svg>',
    // 笔记详情顶栏的分享（iOS 样式：方框带向上箭头）
    iosShare: '<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 15V3.6M8.2 7.2 12 3.4l3.8 3.8"/><rect x="4.6" y="9" width="14.8" height="11" rx="2.4"/></g></svg>',
    // 消息页右上角：搜索 + 圆圈加号；「我」页快捷卡：浏览记录 / 钱包
    plusCircle: '<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="8.4"/><path d="M12 8.2v7.6M8.2 12h7.6"/></g></svg>',
    clock: '<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="12" cy="12" r="8.4"/><path d="M12 7.2V12l3.2 2.1"/></g></svg>',
    wallet: '<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><rect x="3.4" y="6.4" width="17.2" height="12.2" rx="2.6"/><path d="M3.4 10.2h17.2"/><circle cx="16.6" cy="14.6" r="1.1" fill="currentColor" stroke="none"/></g></svg>',
    // 系统消息行（消息列表里的蓝铃铛圆标）
    bell: '<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="currentColor"><path d="M12 3.2a5.6 5.6 0 0 0-5.6 5.6v3.7l-1.4 3a1 1 0 0 0 .9 1.4h12.2a1 1 0 0 0 .9-1.4l-1.4-3V8.8A5.6 5.6 0 0 0 12 3.2z"/><path d="M9.8 18.9a2.3 2.3 0 0 0 4.4 0z"/></g></svg>',
    // 占位图标：市集页
    bag: '<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><path d="M4.6 8h14.8l-1.2 11.2a1.8 1.8 0 0 1-1.8 1.6H7.6a1.8 1.8 0 0 1-1.8-1.6z"/><path d="M8.6 10.4V6.6a3.4 3.4 0 0 1 6.8 0v3.8"/></g></svg>',
  };
}

// ---------- 小红书数据（我的资料 / 网友池 / 笔记） ----------
const IPHONE_XHS_USER_MACRO = IPHONE_QQ_USER_MACRO;

function iphoneXhsGenId(prefix) {
  return `${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

// 归一化头像：null = 默认（灰底人形占位）；{ preset } 只认内置款式
//（a1~a21，与 QQ / 微信同一份 IPHONE_ME_AVATAR_PRESETS；me 等价于默认）；
// { url } 只认 http(s) 与 data:image 并限长。
function iphoneNormalizeXhsAvatar(raw) {
  if (!raw || typeof raw !== 'object') return null;
  const preset = String(raw.preset || '').trim();
  if (preset && preset !== 'me' && IPHONE_ME_AVATAR_PRESETS.some((p) => p.id === preset)) {
    return { preset };
  }
  const url = String(raw.url || '').trim();
  if (/^(https?:\/\/|data:image\/)/i.test(url) && url.length <= 400000) return { url };
  return null;
}

function iphoneNormalizeXhsProfile(raw) {
  const source = raw && typeof raw === 'object' ? raw : {};
  return {
    name: String(source.name || '').trim().slice(0, 24),
    xhsId: String(source.xhsId || '').replace(/[^\w.-]/g, '').slice(0, 32),
    ip: String(source.ip || '').trim().slice(0, 16),
    bio: String(source.bio || '').replace(/[\r\n]+/g, ' ').trim().slice(0, 120),
    avatar: iphoneNormalizeXhsAvatar(source.avatar),
  };
}

// 网友：昵称是身份主键（评论里只存名字，与 QQ 的点赞 / 评论同规则），xhsId / ip /
// bio 是 AI 发帖时顺手写的资料，缺了就不显示；avatar 是内置头像款式 id
//（加入网友池时按序号循环分配）。
function iphoneNormalizeXhsNetizen(raw) {
  const source = raw && typeof raw === 'object' ? raw : {};
  const name = String(source.name || '').replace(/[\r\n]+/g, ' ').trim().slice(0, 24);
  if (!name) return null;
  const preset = String(source.avatar || '').trim();
  return {
    id: String(source.id || '').trim() || iphoneXhsGenId('xn'),
    name,
    xhsId: String(source.xhsId || '').replace(/[^\w.-]/g, '').slice(0, 32),
    ip: String(source.ip || '').trim().slice(0, 16),
    bio: String(source.bio || '').replace(/[\r\n]+/g, ' ').trim().slice(0, 120),
    avatar: IPHONE_ME_AVATAR_PRESETS.some((p) => p.id === preset && p.id !== 'me') ? preset : '',
  };
}

// 评论：{ name, text, replyName?, ts? }，名字是署名本体（玩家写 {{user}} 宏或自定义
// 昵称，展示时再解析）。自己回复自己无意义，直接丢掉 replyName。
function iphoneNormalizeXhsComment(raw) {
  if (!raw || typeof raw !== 'object') return null;
  const name = String(raw.name || '').replace(/[\r\n]+/g, ' ').trim().slice(0, 24);
  const text = String(raw.text || '').replace(/[\r\n]+/g, ' ').trim().slice(0, IPHONE_XHS_COMMENT_CAP);
  if (!name || !text) return null;
  const out = { name, text };
  const replyName = String(raw.replyName ?? raw.reply ?? '').replace(/[\r\n]+/g, ' ').trim().slice(0, 24);
  if (replyName && replyName !== name) out.replyName = replyName;
  const ts = Math.max(0, Math.floor(Number(raw.ts) || 0));
  if (ts) out.ts = ts;
  return out;
}

// 点赞数 / 收藏数：整数（AI 写「1.2万」也认），上限 9999 万。
function iphoneXhsParseCount(raw) {
  const text = String(raw ?? '').trim().toLowerCase();
  if (!text) return 0;
  const matched = text.match(/([0-9]+(?:\.[0-9]+)?)\s*(万|w|k|千)?/);
  if (!matched) return 0;
  const base = Number(matched[1]);
  if (!Number.isFinite(base)) return 0;
  const unit = matched[2];
  const scale = unit === '万' || unit === 'w' ? 10000 : (unit === 'k' || unit === '千' ? 1000 : 1);
  return Math.max(0, Math.min(99999999, Math.round(base * scale)));
}

// 话题：# 开头、空格 / 顿号分隔，最多 4 个（去重、去空）。
function iphoneXhsTopicList(raw) {
  const text = Array.isArray(raw) ? raw.join(' ') : String(raw ?? '');
  const topics = [];
  for (const part of text.split(/[\s、,，]+/)) {
    const name = part.trim().replace(/^#+/, '').replace(/[#\s]+$/, '');
    if (!name || name.length > 20) continue;
    if (!topics.includes(name)) topics.push(name);
    if (topics.length >= 4) break;
  }
  return topics;
}

// 笔记：作者是 '__me__'（玩家自己发的）或网友池里的 id；作者名另存一份，网友池
// 满了被裁掉时笔记照常显示。封面存图库 id（c01~c16），展示时算回题材与宽高比。
function iphoneNormalizeXhsNote(raw) {
  const source = raw && typeof raw === 'object' ? raw : {};
  const authorId = String(source.authorId || '').trim();
  if (!authorId) return null;
  const authorName = String(source.authorName || '').replace(/[\r\n]+/g, ' ').trim().slice(0, 24);
  if (authorId !== '__me__' && !authorName) return null;
  const title = String(source.title || '').replace(/[\r\n]+/g, ' ').trim().slice(0, IPHONE_XHS_TITLE_CAP);
  const text = String(source.text || '').trim().slice(0, IPHONE_XHS_TEXT_CAP);
  if (!title && !text) return null;
  const coverId = IPHONE_XHS_COVERS.some((c) => c.id === source.coverId) ? source.coverId : '';
  const comments = (Array.isArray(source.comments) ? source.comments : [])
    .map(iphoneNormalizeXhsComment)
    .filter(Boolean)
    .slice(-40);
  return {
    id: String(source.id || '').trim() || iphoneXhsGenId('n'),
    authorId,
    authorName,
    ts: Math.max(0, Math.floor(Number(source.ts) || Date.now())),
    coverId,
    title,
    text,
    topics: iphoneXhsTopicList(source.topics),
    location: String(source.location || '').trim().slice(0, 24),
    ip: String(source.ip || '').trim().slice(0, 16),
    likes: iphoneXhsParseCount(source.likes),
    collects: iphoneXhsParseCount(source.collects),
    comments,
    likeMine: Boolean(source.likeMine),
    collectMine: Boolean(source.collectMine),
    private: Boolean(source.private),
  };
}

// 好友池裁剪：网友池超过上限时，先保住笔记作者（笔记要能显示头像与资料），
// 其余按「后加入的优先」保留；顺序不变。
function iphoneXhsPruneNetizens(netizens, notes) {
  if (netizens.length <= IPHONE_XHS_NETIZEN_CAP) return netizens;
  const referenced = new Set(notes.map((n) => n.authorId));
  const keep = new Set();
  for (const netizen of netizens) {
    if (referenced.has(netizen.id)) keep.add(netizen.id);
  }
  const budget = Math.max(0, IPHONE_XHS_NETIZEN_CAP - keep.size);
  let taken = 0;
  for (let i = netizens.length - 1; i >= 0 && taken < budget; i -= 1) {
    if (keep.has(netizens[i].id)) continue;
    keep.add(netizens[i].id);
    taken += 1;
  }
  return netizens.filter((netizen) => keep.has(netizen.id));
}

function iphoneNormalizeXhsData(raw) {
  const source = raw && typeof raw === 'object' ? raw : {};
  const netizens = (Array.isArray(source.netizens) ? source.netizens : [])
    .map(iphoneNormalizeXhsNetizen)
    .filter(Boolean);
  const notes = (Array.isArray(source.notes) ? source.notes : [])
    .map(iphoneNormalizeXhsNote)
    .filter(Boolean)
    .slice(-200);
  const following = [...new Set((Array.isArray(source.following) ? source.following : [])
    .map((id) => String(id || '').trim())
    .filter(Boolean))];
  // 消息未读态：三条聚合入口各自记一串「已点进去看过的通知 id」。通知本身是从
  // 真实数据（赞 / 收藏 / 关注 / 评论）派生出来的、没有独立实体，所以「已读」只能
  // 按 id 记账——派生出来的 id 稳定（见 iphoneXhsCollectNotifications），新出现的
  // 通知不在名单里，于是一眼就能算出未读数。
  const msgReadSource = source.msgRead && typeof source.msgRead === 'object' ? source.msgRead : {};
  const msgRead = {};
  for (const entry of IPHONE_XHS_MSG_ENTRIES) {
    const list = Array.isArray(msgReadSource[entry.id]) ? msgReadSource[entry.id] : [];
    msgRead[entry.id] = [...new Set(list.map((id) => String(id || '').trim()).filter(Boolean))]
      .slice(-IPHONE_XHS_MSG_READ_CAP);
  }
  return {
    netizens: iphoneXhsPruneNetizens(netizens, notes),
    notes,
    following,
    msgRead,
    notesFloorSynced: Math.max(0, Math.floor(Number(source.notesFloorSynced) || 0)),
  };
}

// 未读列表：按类型过滤掉看过的 id（顺序沿用收集时的时序）。没有 msgRead 的老存档
// 视为全部未读——装上插件时的未读数是真实数据推出来的，不该凭空清零。
function iphoneXhsUnreadOf(inbox, msgRead, type) {
  const seen = new Set(msgRead?.[type] || []);
  return (inbox[type] || []).filter((item) => !seen.has(item.id));
}

// 未读总数：底栏「消息」数字气泡与首页头像角标都用它。三类都清零 → 0 →
// 两个气泡一起消失（这就是「三个都点过看了，右下角红点也该消失」）。
function iphoneXhsUnreadTotal(data) {
  const inbox = iphoneXhsCollectNotifications(data);
  return IPHONE_XHS_MSG_ENTRIES
    .reduce((sum, entry) => sum + iphoneXhsUnreadOf(inbox, data.msgRead, entry.id).length, 0);
}

// 把某个入口当前的全部通知标记成已读并落盘。返回是否有变化（没变化就不必重渲染）。
// 在「点开子页」这一刻记账而不是关闭时：真机点进去红点当场就没了。
function iphoneXhsMarkInboxRead(type) {
  const data = iphoneGetXhsData();
  const seen = new Set(data.msgRead[type] || []);
  const ids = (iphoneXhsCollectNotifications(data)[type] || [])
    .map((item) => item.id)
    .filter((id) => !seen.has(id));
  if (!ids.length) return false;
  const next = {
    ...data,
    msgRead: { ...data.msgRead, [type]: [...(data.msgRead[type] || []), ...ids].slice(-IPHONE_XHS_MSG_READ_CAP) },
  };
  iphoneGetQqStorage().xhsData = iphoneNormalizeXhsData(next);
  iphoneSaveQqStorage();
  return true;
}

function iphoneGetXhsData() {
  return iphoneNormalizeXhsData(iphoneGetQqStorage().xhsData);
}

function iphoneSetXhsData(xhsScreen, next) {
  iphoneGetQqStorage().xhsData = iphoneNormalizeXhsData(next);
  iphoneSaveQqStorage();
  if (xhsScreen) xhsScreen._renderXhs?.();
}

// 取「我」的小红书资料（随聊天文件存取）：昵称默认跟随酒馆 {{user}}，小红书号与
// IP 属地留空回退占位演示值；顺手把脏数据写回聊天文件。
function iphoneGetXhsProfile() {
  const storage = iphoneGetQqStorage();
  const normalized = iphoneNormalizeXhsProfile(storage.xhsProfile);
  const raw = storage.xhsProfile && typeof storage.xhsProfile === 'object' ? storage.xhsProfile : {};
  if (JSON.stringify(normalized) !== JSON.stringify(iphoneNormalizeXhsProfile(raw))) {
    storage.xhsProfile = normalized;
    iphoneSaveQqStorage();
  }
  return {
    name: normalized.name || iphoneGetTavernUserName() || IPHONE_QQ_ME_FALLBACK_NAME,
    xhsId: normalized.xhsId || IPHONE_XHS_ME.xhsId,
    ip: normalized.ip || IPHONE_XHS_ME.ip,
    bio: normalized.bio,
    avatar: normalized.avatar,
  };
}

function iphoneGetXhsCustomNick() {
  return iphoneNormalizeXhsProfile(iphoneGetQqStorage().xhsProfile).name;
}

// 玩家在小红书数据（评论署名 / 被回复人）里的本体：填过昵称用昵称，否则写
// {{user}} 宏本体，楼层与提示词组装时才解析成人设名（与 QQ / 微信同一套规则）。
function iphoneGetXhsPlayerAuthor() {
  return iphoneGetXhsCustomNick() || IPHONE_XHS_USER_MACRO;
}

function iphoneResolveXhsPlayerAuthor(name) {
  const value = String(name || '').trim();
  if (!value) return '';
  if (/\{\{user\}\}/i.test(value) || iphoneIsQqLegacyPlayerName(value)) {
    return iphoneGetTavernUserName() || IPHONE_QQ_ME_FALLBACK_NAME;
  }
  return value;
}

function iphoneIsXhsPlayerAuthor(name) {
  const value = String(name || '').trim();
  if (!value) return false;
  if (/\{\{user\}\}/i.test(value) || iphoneIsQqLegacyPlayerName(value)) return true;
  const aliases = new Set([iphoneGetTavernUserName(), iphoneGetXhsProfile().name].filter(Boolean));
  return aliases.has(value);
}

function iphoneUpdateXhsProfile(xhsScreen, patch) {
  const storage = iphoneGetQqStorage();
  storage.xhsProfile = iphoneNormalizeXhsProfile({
    ...iphoneNormalizeXhsProfile(storage.xhsProfile),
    ...patch,
  });
  iphoneSaveQqStorage();
  iphoneRefreshXhsMeIdentity(xhsScreen);
}

// 把「我的头像」应用到节点：内置款式换 CSS 覆盖类，自定义图走内联 background-image，
// 默认清掉两者（回落到 CSS 里的灰底人形占位）。
function iphoneApplyXhsMeAvatarToEl(el, profile) {
  if (!el) return;
  if (el._xhsAvatarCls) {
    el.classList.remove(el._xhsAvatarCls);
    el._xhsAvatarCls = null;
  }
  el.style.backgroundImage = '';
  const avatar = profile.avatar;
  if (avatar && avatar.preset) {
    const cls = `iphone-xhs__avatar--${avatar.preset}`;
    el.classList.add(cls);
    el._xhsAvatarCls = cls;
  } else if (avatar && avatar.url) {
    el.style.backgroundImage = `url("${avatar.url.replace(/"/g, '%22')}")`;
  }
}

function iphoneRefreshXhsMeIdentity(root) {
  if (!root) return;
  const profile = iphoneGetXhsProfile();
  root.querySelectorAll('[data-xhs-me-name]').forEach((el) => { el.textContent = profile.name; });
  root.querySelectorAll('[data-xhs-me-avatar]').forEach((el) => iphoneApplyXhsMeAvatarToEl(el, profile));
  root.querySelectorAll('[data-xhs-me-id]').forEach((el) => { el.textContent = `小红书号：${profile.xhsId}`; });
  root.querySelectorAll('[data-xhs-me-ip]').forEach((el) => { el.textContent = `IP属地：${profile.ip}`; });
}

// ---------- 网友池 ----------
// 按名字查网友（昵称是身份主键：AI 复用同名网友时就接上 TA 原来的资料与头像）。
function iphoneXhsFindNetizen(data, name) {
  const target = String(name || '').trim();
  if (!target) return null;
  return data.netizens.find((netizen) => netizen.name === target) || null;
}

// 注册网友（AI 新造的发布者 / 评论人）：同名沿用旧身份，只补空缺字段；新面孔按
// 加入顺序循环分配内置头像。返回归一化后的网友对象。
function iphoneXhsEnsureNetizen(data, name, info) {
  const clean = String(name || '').replace(/[\r\n]+/g, ' ').trim().slice(0, 24);
  if (!clean) return null;
  const patch = info && typeof info === 'object' ? info : {};
  const existing = iphoneXhsFindNetizen(data, clean);
  if (existing) {
    if (!existing.xhsId && patch.xhsId) existing.xhsId = String(patch.xhsId).replace(/[^\w.-]/g, '').slice(0, 32);
    if (!existing.ip && patch.ip) existing.ip = String(patch.ip).trim().slice(0, 16);
    if (!existing.bio && patch.bio) existing.bio = String(patch.bio).replace(/[\r\n]+/g, ' ').trim().slice(0, 120);
    return existing;
  }
  const netizen = iphoneNormalizeXhsNetizen({
    ...patch,
    name: clean,
    id: iphoneXhsGenId('xn'),
    avatar: `a${(data.netizens.length % IPHONE_XHS_AVATAR_POOL) + 1}`,
  });
  if (!netizen) return null;
  data.netizens.push(netizen);
  return netizen;
}

// 网友头像节点：池里有就用 TA 的款式；池里没有（旧数据 / 被裁掉的网友）就按名字
// 哈希落到某一款，保证同一个人每次渲染都是同一张头像。
function iphoneXhsBuildNetizenAvatar(data, name) {
  const el = document.createElement('span');
  el.className = 'iphone-xhs__avatar';
  const netizen = iphoneXhsFindNetizen(data, name);
  let preset = netizen?.avatar || '';
  if (!preset) {
    const text = String(name || '');
    let hash = 0;
    for (let i = 0; i < text.length; i += 1) hash = (hash * 31 + text.charCodeAt(i)) % 100000;
    preset = `a${(hash % IPHONE_XHS_AVATAR_POOL) + 1}`;
  }
  el.classList.add(`iphone-xhs__avatar--${preset}`);
  return el;
}

// 玩家自己的头像节点（灰底人形占位 + 款式覆盖类）。
function iphoneXhsBuildMeAvatar(profile) {
  const el = document.createElement('span');
  el.className = 'iphone-xhs__avatar iphone-xhs__me-avatar';
  iphoneApplyXhsMeAvatarToEl(el, profile);
  return el;
}

// ---------- 封面 ----------
function iphoneXhsCoverById(id) {
  return IPHONE_XHS_COVERS.find((cover) => cover.id === id) || null;
}

// 按题材挑封面：同题材里按种子（笔记 id / 标题）哈希稳定选一张；题材没命中就
// 从整个图库挑——保证任何情况下都有图，且同一条笔记每次渲染都是同一张。
function iphoneXhsPickCover(topic, seed) {
  const want = String(topic || '').trim();
  let pool = IPHONE_XHS_COVERS.filter((cover) => cover.topic === want);
  if (!pool.length) pool = IPHONE_XHS_COVERS.slice();
  const text = String(seed || '');
  let hash = 0;
  for (let i = 0; i < text.length; i += 1) hash = (hash * 131 + text.charCodeAt(i)) % 1000033;
  return pool[hash % pool.length];
}

// 笔记封面（含宽高比）：没存封面时按标题哈希现挑一张，展示永远有图。
function iphoneXhsCoverFor(note) {
  const saved = note && note.coverId ? iphoneXhsCoverById(note.coverId) : null;
  return saved || iphoneXhsPickCover('', `${note?.id || ''}${note?.title || ''}`);
}

function iphoneXhsCoverClass(cover) {
  return `iphone-xhs__cover--${cover.id}`;
}

// 纯文字笔记（对照真实小红书的文字卡）：按 id 哈希稳定决定，约四成笔记不配图，
// 首页瀑布流才有真实的长短错落。玩家自己发的总是带图（封面是手选的）。
function iphoneXhsIsTextNote(note) {
  if (!note) return false;
  if (note.authorId === '__me__') return false;
  const text = String(note.id || '');
  let hash = 0;
  for (let i = 0; i < text.length; i += 1) hash = (hash * 37 + text.charCodeAt(i)) % 100000;
  return hash % 10 < 4;
}

// 视频笔记：封面款式自带 video 标记（真机的视频卡右上角有播放圆标）。
function iphoneXhsIsVideoNote(note) {
  if (!note || iphoneXhsIsTextNote(note)) return false;
  return !!iphoneXhsCoverFor(note).video;
}

// 信息流列高估算（两列平衡用）：有图按封面宽高比折算，文字卡按字数折行。
function iphoneXhsCardEstimate(note) {
  if (iphoneXhsIsTextNote(note)) {
    const lines = Math.min(8, Math.max(3, Math.ceil(String(note.text || '').length / 17)));
    return lines * 0.27 + 0.86;
  }
  return 1 / iphoneXhsCoverFor(note).ratio + 0.62;
}

const IPHONE_XHS_COVER_TOPIC_LABEL = Object.freeze({
  美食: '美食', 宠物: '萌宠', 旅行: '旅行', 家居: '家居', 数码: '数码', 穿搭: '穿搭', 探店: '探店',
  美妆: '美妆', 健身: '健身', 学习: '学习',
});

function iphoneXhsCoverTopicLabel(cover) {
  return IPHONE_XHS_COVER_TOPIC_LABEL[cover?.topic] || cover?.topic || '日常';
}

// ---------- 展示辅助 ----------
// 计数缩写：1286 / 1.3万（小红书同款，1 万以上保留一位小数）。
function iphoneXhsFormatCount(value) {
  const num = Math.max(0, Math.floor(Number(value) || 0));
  if (num < 10000) return String(num);
  const wan = num / 10000;
  return `${(wan >= 100 ? Math.round(wan) : Math.round(wan * 10) / 10)}万`;
}

// 笔记展示时间：与 QQ空间 / 朋友圈同款相对时间（刚刚 / N分钟前 / …）。
function iphoneXhsTimeLabel(ts) {
  return iphoneQqDynamicsTimeLabel({ ts });
}

// 评论的小心心数：评论本身不存点赞数（AI 也不写），按内容哈希稳定生成一个演示值，
// 同一条评论每次渲染都一样。
function iphoneXhsCommentLikes(comment) {
  const text = `${comment?.name || ''}${comment?.text || ''}`;
  let hash = 0;
  for (let i = 0; i < text.length; i += 1) hash = (hash * 37 + text.charCodeAt(i)) % 100000;
  return hash % 268 + 1;
}

// 评论的 IP 属地：网友池里有就用 TA 的，玩家评论用「我」的，都取不到就借笔记的。
function iphoneXhsCommentIp(data, comment, note) {
  if (iphoneIsXhsPlayerAuthor(comment?.name)) return iphoneGetXhsProfile().ip;
  const netizen = iphoneXhsFindNetizen(data, comment?.name);
  return netizen?.ip || note?.ip || IPHONE_XHS_ME.ip;
}

// 笔记作者展示信息：网友池优先，玩家自己的笔记走「我」的资料。
function iphoneXhsAuthorOf(data, note) {
  if (note.authorId === '__me__') {
    const profile = iphoneGetXhsProfile();
    return { id: '__me__', name: profile.name, xhsId: profile.xhsId, ip: note.ip || profile.ip, bio: profile.bio, mine: true };
  }
  const netizen = data.netizens.find((n) => n.id === note.authorId) || null;
  return {
    id: note.authorId,
    name: netizen?.name || note.authorName || '小红书用户',
    xhsId: netizen?.xhsId || '',
    ip: netizen?.ip || note.ip || '',
    bio: netizen?.bio || '',
    mine: false,
  };
}

function iphoneXhsIsFollowing(data, authorId) {
  return authorId === '__me__' || data.following.includes(authorId);
}

// 笔记点赞 / 收藏数：玩家自己点过的在原数上 +1（数据里的数是「别人」的）。
function iphoneXhsLikeCount(note) {
  return (Number(note?.likes) || 0) + (note?.likeMine ? 1 : 0);
}

function iphoneXhsCollectCount(note) {
  return (Number(note?.collects) || 0) + (note?.collectMine ? 1 : 0);
}

// ---------- 首页频道筛选 ----------
// 「推荐」= 全部；其余频道按标题、正文与话题里的关键词过滤（对照真实小红书的
// 发现页横滑条，是题材聚合而不是独立数据源）。
const IPHONE_XHS_CHANNEL_KEYS = Object.freeze({
  推荐: [],
  RED: ['red', '好物', '测评', '开箱', '数码', '美妆', '口红'],
  热点: ['热点', '热搜', '刷屏', '新闻', '爆火', '全网'],
  直播: ['直播', '开播', '预告'],
  短剧: ['短剧', '追剧', '剧情', '演员'],
  穿搭: ['穿搭', '搭配', '显瘦', '外套', '裙', '鞋', '包'],
});

function iphoneXhsNoteMatchesChannel(note, channel) {
  const keys = IPHONE_XHS_CHANNEL_KEYS[channel] || [];
  if (!keys.length) return true;
  const haystack = `${note.title} ${note.text} ${note.topics.join(' ')}`.toLowerCase();
  return keys.some((key) => haystack.includes(key));
}

// ---------- 小红书提示词预设（存 settings.promptPresets.xhsNotes） ----------
function iphoneGetXhsPreset() {
  const defaults = IPHONE_XHS_PRESET_DEFAULT;
  const raw = iphoneGetSettings().promptPresets?.xhsNotes || {};
  const persona = typeof raw.persona === 'string' ? raw.persona : defaults.persona;
  const worldBook = typeof raw.worldBook === 'boolean' ? raw.worldBook : defaults.worldBook;
  const latestFloor = typeof raw.latestFloor === 'boolean' ? raw.latestFloor : defaults.latestFloor;
  const npcLogic = typeof raw.npcLogic === 'string' ? raw.npcLogic : IPHONE_QQ_NPC_LOGIC;
  const dialogueGuidance = typeof raw.dialogueGuidance === 'string' ? raw.dialogueGuidance : IPHONE_QQ_DIALOGUE_GUIDANCE;
  let historyFloors = Math.round(Number(raw.historyFloors));
  if (!Number.isFinite(historyFloors)) historyFloors = defaults.historyFloors;
  historyFloors = Math.min(50, Math.max(0, historyFloors));
  const format = typeof raw.format === 'string' ? raw.format : defaults.format;
  const guidance = typeof raw.guidance === 'string' ? raw.guidance : defaults.guidance;
  const replyGuidance = typeof raw.replyGuidance === 'string' ? raw.replyGuidance : defaults.replyGuidance;
  const replyFormat = typeof raw.replyFormat === 'string' ? raw.replyFormat : defaults.replyFormat;
  return { persona, worldBook, latestFloor, historyFloors, format, npcLogic, dialogueGuidance, guidance, replyGuidance, replyFormat };
}

// 生成请求的公共部分：世界书 / 酒馆最近楼层 / 记录楼层（与两个动态页同一套开关）。
// 返回 { worldText, tavernText, floorLogText, resolve }。
async function iphoneXhsCollectContext(preset) {
  const ctx = iphoneGetContextSafe();
  const resolve = (text) => iphoneResolveTavernMacros(text, ctx);
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
  return { worldText: worldText.trim(), tavernText: historyLines.join('\n'), floorLogText, resolve };
}

// ---------- 小红书笔记生成（下拉刷新调用一次对话 API） ----------
// system 依次装：角色扮演指令 + 提示词结构说明 + 扮演逻辑与对白规范 + 已有网友
// 名单 + 世界书 + 酒馆最近楼层（均可由「设置 · 小红书提示词」预设控制）+ 笔记写作
// 指导与输出格式（预设里可改写、清空即不附带）；user 下达生成指令。与朋友圈最大的
// 差别：名单里给的是「已有网友」，模型可以复用熟面孔，也可以现场发明新网友。
// 返回新建的笔记数组（已写回数据）。
async function iphoneGenerateXhsNotes(xhsScreen) {
  const data = iphoneGetXhsData();
  const settings = iphoneGetSettings();
  const preset = iphoneGetXhsPreset();
  const { worldText, tavernText, floorLogText, resolve } = await iphoneXhsCollectContext(preset);

  // 已有网友名单：昵称 + TA 一贯的人设（简介 / 属地 / 小红书号），让熟面孔回归时
  // 能延续同样的内容方向；池子空了就写「暂无」，全靠模型新造。
  const rosterText = data.netizens.length
    ? data.netizens.map((n) => {
      const extras = [n.xhsId ? `小红书号 ${n.xhsId}` : '', n.ip ? `IP ${n.ip}` : '', n.bio ? `简介：${n.bio}` : '']
        .filter(Boolean).join('｜');
      return `- ${n.name}${extras ? `（${extras}）` : ''}`;
    }).join('\n')
    : '（暂无，可以全部新造）';

  const persona = preset.persona.trim();
  const npcLogic = preset.npcLogic.trim();
  const dialogueGuidance = preset.dialogueGuidance.trim();
  const guidance = String(preset.guidance ?? '').trim();
  const format = String(preset.format ?? '').trim();
  // 第三方扩展注入酒馆提示词的内容（万华镜的变量状态等）：随 system 附带。
  const injectParts = iphoneInjectPromptParts();

  const sysParts = [];
  if (persona) sysParts.push(`<roleplay_instructions>\n${resolve(persona)}\n</roleplay_instructions>`);
  const outlineItems = [];
  if (persona) outlineItems.push('<roleplay_instructions>…</roleplay_instructions>：角色扮演指令，约束人物设定与世界观基线；');
  if (npcLogic) outlineItems.push('<npc_logic>…</npc_logic>：扮演逻辑——「先是人，后是设定」，按自身立场与动机行事；');
  if (dialogueGuidance) outlineItems.push('<dialogue_guidance>…</dialogue_guidance>：表达规范——口语化、生活化、带情绪与立场，禁止播报腔；');
  outlineItems.push('<netizens>…</netizens>：小红书里已经出现过的网友名单——可以复用（熟面孔回归，延续其人设），也可以新造网友；');
  if (worldText) outlineItems.push('<world_info>…</world_info>：当前场景的世界书设定，包含世界观与相关人物的资料；');
  if (injectParts) outlineItems.push(injectParts.outline);
  if (tavernText) outlineItems.push('<tavern_context>…</tavern_context>：酒馆主线的最近对话（时间旧→新），是当前正在发生的剧情背景；');
  if (floorLogText) outlineItems.push('<xhs_chat_log>…</xhs_chat_log>：最近一次同步到酒馆楼层的手机记录，可能包含多个记录段（每段各自用方括号标签包裹，如 [微信_私聊_名字] / [朋友圈动态] / [小红书笔记]），供你了解最近的动态；');
  if (guidance) outlineItems.push('<xhs_guidance>…</xhs_guidance>：小红书笔记的写作指导；');
  if (format) outlineItems.push('<output_format>…</output_format>：回复格式要求，位于提示词末尾，必须严格遵守；');
  sysParts.push('【提示词结构说明】本次请求的提示词由以下部分组成，均已用 XML 标签包裹并附介绍：\n'
    + outlineItems.map((item) => `- ${item}`).join('\n'));
  if (npcLogic) sysParts.push(`以下是扮演逻辑指导（决定你如何理解与演绎角色）：\n<npc_logic>\n${resolve(npcLogic)}\n</npc_logic>`);
  if (dialogueGuidance) sysParts.push(`以下是表达规范（决定你如何说话与写内容）：\n<dialogue_guidance>\n${resolve(dialogueGuidance)}\n</dialogue_guidance>`);
  sysParts.push(`以下是小红书里已经出现过的网友名单（可以复用其中的熟面孔，也可以新造网友）：\n<netizens>\n${rosterText}\n</netizens>`);
  if (worldText) sysParts.push(`以下是当前场景的世界书设定（世界观与人物资料）：\n<world_info>\n${worldText}\n</world_info>`);
  if (tavernText) sysParts.push(`以下是酒馆主线的最近对话（时间旧→新），是你当前所处的剧情背景：\n<tavern_context>\n${tavernText}\n</tavern_context>`);
  if (injectParts) sysParts.push(injectParts.system);
  if (floorLogText) sysParts.push(`以下是最近一次同步到酒馆楼层的手机记录，可能包含多个记录段（每段各自用方括号标签包裹，如 [微信_私聊_名字] / [朋友圈动态] / [小红书笔记]）：\n<xhs_chat_log>\n${floorLogText}\n</xhs_chat_log>`);
  if (guidance) sysParts.push(`以下是小红书笔记的写作指导：\n<xhs_guidance>\n${resolve(guidance)}\n</xhs_guidance>`);
  if (format) sysParts.push(`以下是回复格式要求，必须严格遵守：\n<output_format>\n${resolve(format)}\n</output_format>`);

  // user 里再点一次「与剧情 / 世界观挂钩」：这是本页内容生成的核心要求（写作指导
  // 可被玩家改写或清空，而这一句始终在最后、最靠近生成位置），并重申三种写法分散开。
  const userContent = `请根据以上信息，为小红书首页生成新的网友笔记（1~3 篇）。`
    + `每篇都要与当前剧情或世界观设定相关联——直接相关 / 间接相关 / 背景与世界观三种写法里选一种，几篇之间分散开。`
    + `当前时间：${new Date().toLocaleString('zh-CN', { hour12: false })}。`;
  const reply = await iphoneRequestChatCompletion(settings, [
    { role: 'system', content: sysParts.join('\n\n') },
    { role: 'user', content: userContent },
  ]);

  const parsed = iphoneParseXhsNotesReply(reply);
  if (!parsed.length) {
    throw new Error('AI 没有返回有效笔记（需要「昵称：发布者」开头的笔记区块，含标题与正文）。');
  }
  const now = Date.now();
  const fresh = iphoneGetXhsData();
  const created = [];
  const usedNames = new Set();
  for (const item of parsed.slice(0, IPHONE_XHS_REFRESH_MAX_NOTES)) {
    const name = String(item.name || '').trim();
    if (!name || usedNames.has(name)) continue;
    const title = String(item.title || '').replace(/[\r\n]+/g, ' ').trim().slice(0, IPHONE_XHS_TITLE_CAP);
    const text = String(item.text || '').trim().slice(0, IPHONE_XHS_TEXT_CAP);
    if (!title && !text) continue;
    usedNames.add(name);
    // 发布者：玩家自己的昵称一律让位（网友不是玩家），其余进网友池
    if (iphoneIsXhsPlayerAuthor(name)) continue;
    const netizen = iphoneXhsEnsureNetizen(fresh, name, {
      xhsId: item.xhsId, ip: item.ip, bio: item.bio,
    });
    if (!netizen) continue;
    const cover = iphoneXhsPickCover(item.topic, `${item.title || ''}${netizen.id}`);
    const note = iphoneNormalizeXhsNote({
      id: iphoneXhsGenId('n'),
      authorId: netizen.id,
      authorName: netizen.name,
      ts: now,
      coverId: cover.id,
      title,
      text,
      topics: item.topics,
      location: item.location,
      ip: item.ip || netizen.ip,
      likes: item.likes,
      collects: item.collects,
      comments: [],
    });
    // 评论区：评论人可以是已有网友 / 新网友 / 作者本人（都会自动进网友池）
    const comments = [];
    for (const rawComment of item.comments || []) {
      const cname = String(rawComment.name || '').trim();
      if (!cname || iphoneIsXhsPlayerAuthor(cname)) continue;
      if (cname !== netizen.name) iphoneXhsEnsureNetizen(fresh, cname, {});
      const rawReply = String(rawComment.replyName || '').trim();
      let replyName = '';
      if (rawReply && rawReply !== cname && !iphoneIsXhsPlayerAuthor(rawReply)) {
        if (rawReply !== netizen.name) iphoneXhsEnsureNetizen(fresh, rawReply, {});
        replyName = rawReply;
      }
      const comment = iphoneNormalizeXhsComment({
        name: cname,
        text: rawComment.text,
        replyName: replyName || undefined,
        ts: now,
      });
      if (comment) comments.push(comment);
    }
    note.comments = comments.slice(-40);
    fresh.notes.push(note);
    created.push(note);
  }
  if (!created.length) {
    throw new Error('AI 没有返回有效笔记（发布者昵称或标题正文为空）。');
  }
  iphoneSetXhsData(xhsScreen, fresh);
  iphoneLog('info', `小红书刷新成功：生成 ${created.length} 篇新笔记`);
  return created;
}

// ---------- 小红书评论生成（玩家留言后的回复 / 玩家自己发帖后的网友评论） ----------
// 与朋友圈回复同一套范式：`<dynamic_post>` 换成 `<xhs_note>`（含封面题材、标题、
// 正文、话题、完整评论区），评论人可以是已有网友、新网友或笔记作者本人。
// published = true（v0.33.0）是玩家自己发布笔记后的那一次：作者就是玩家本人，评论区
// 一般还空着，网友来抢首评。两种情形共用同一份指导与行格式，差别只在 user 侧那一句、
// `<xhs_note>` 段的介绍语与解析兜底——玩家留言时解析失败整段兜底成作者的一条回复，
// 玩家自己发的笔记不做这种兜底（那等于替玩家发言），解析不了就抛错交给调用方提示。
async function iphoneGenerateXhsComments(note, xhsScreen, { published = false } = {}) {
  const settings = iphoneGetSettings();
  const data = iphoneGetXhsData();
  const post = data.notes.find((n) => n.id === note?.id) || note;
  if (!post) throw new Error('这篇笔记已经不在了');
  const author = iphoneXhsAuthorOf(data, post);
  const preset = iphoneGetXhsPreset();
  const { worldText, tavernText, floorLogText, resolve } = await iphoneXhsCollectContext(preset);

  const playerName = iphoneGetTavernUserName() || IPHONE_QQ_ME_FALLBACK_NAME;
  const playerAuthor = iphoneGetXhsPlayerAuthor();
  const customNick = iphoneGetXhsCustomNick();
  const playerAliases = new Set([playerName, customNick].filter(Boolean));
  const playerDesc = customNick && customNick !== playerName
    ? `玩家「${playerName}」（TA 的小红书昵称是「${customNick}」，评论区里署「${customNick}」的就是 TA）`
    : `玩家「${playerName}」`;

  const rosterText = data.netizens.length
    ? data.netizens.map((n) => `- ${n.name}`).join('\n')
    : '（暂无，可以新造）';
  const inline = (value) => String(value || '').replace(/[\r\n]+/g, ' ').trim();
  const cover = iphoneXhsCoverFor(post);
  const postLines = [
    `作者：${inline(author.name)}${author.xhsId ? `（小红书号 ${inline(author.xhsId)}）` : ''}`,
    `封面题材：${cover.topic}`,
    `标题：${inline(post.title)}`,
    `正文：${inline(post.text)}`,
  ];
  if (post.topics.length) postLines.push(`话题：${post.topics.map((t) => `#${t}`).join(' ')}`);
  postLines.push(`点赞：${iphoneXhsLikeCount(post)}｜收藏：${iphoneXhsCollectCount(post)}`);
  postLines.push(published ? '评论区（这篇笔记刚发布，一般还空着）：' : '评论区（时间旧→新）：');
  if (!post.comments.length) {
    postLines.push('（暂无评论）');
  } else {
    for (const c of post.comments) {
      const name = iphoneResolveXhsPlayerAuthor(c.name);
      postLines.push(c.replyName
        ? `- ${inline(name)} 回复 ${inline(iphoneResolveXhsPlayerAuthor(c.replyName))}：${inline(c.text)}`
        : `- ${inline(name)}：${inline(c.text)}`);
    }
  }
  const postText = postLines.join('\n');

  const persona = preset.persona.trim();
  const npcLogic = preset.npcLogic.trim();
  const dialogueGuidance = preset.dialogueGuidance.trim();
  const replyGuidance = String(preset.replyGuidance ?? '').trim();
  const replyFormat = String(preset.replyFormat ?? '').trim();
  // 第三方扩展注入酒馆提示词的内容（万华镜的变量状态等）：随 system 附带。
  const injectParts = iphoneInjectPromptParts();

  const sysParts = [];
  if (persona) sysParts.push(`<roleplay_instructions>\n${resolve(persona)}\n</roleplay_instructions>`);
  const outlineItems = [];
  if (persona) outlineItems.push('<roleplay_instructions>…</roleplay_instructions>：角色扮演指令，约束人物设定与世界观基线；');
  if (npcLogic) outlineItems.push('<npc_logic>…</npc_logic>：扮演逻辑——「先是人，后是设定」，按自身立场与动机行事；');
  if (dialogueGuidance) outlineItems.push('<dialogue_guidance>…</dialogue_guidance>：表达规范——口语化、生活化、带情绪与立场，禁止播报腔；');
  outlineItems.push('<netizens>…</netizens>：小红书里已经出现过的网友名单——评论人可以从中挑选，也可以新造网友；');
  if (worldText) outlineItems.push('<world_info>…</world_info>：当前场景的世界书设定，包含世界观与相关人物的资料；');
  if (injectParts) outlineItems.push(injectParts.outline);
  if (tavernText) outlineItems.push('<tavern_context>…</tavern_context>：酒馆主线的最近对话（时间旧→新），是当前正在发生的剧情背景；');
  if (floorLogText) outlineItems.push('<xhs_chat_log>…</xhs_chat_log>：最近一次同步到酒馆楼层的手机记录，供你了解最近的动态；');
  outlineItems.push(published
    ? '<xhs_note>…</xhs_note>：玩家「{{user}}」刚发布的那篇笔记——作者就是玩家本人，含封面题材、标题、正文、话题与评论区（一般还空着）；'
    : '<xhs_note>…</xhs_note>：玩家正在评论的那篇笔记——作者、封面题材、标题、正文、话题与完整评论区（时间旧→新，最后一条是玩家本人留下的新评论）；');
  if (replyGuidance) outlineItems.push('<reply_guidance>…</reply_guidance>：评论回复的写作指导；');
  if (replyFormat) outlineItems.push('<output_format>…</output_format>：回复格式要求，位于提示词末尾，必须严格遵守；');
  sysParts.push('【提示词结构说明】本次请求的提示词由以下部分组成，均已用 XML 标签包裹并附介绍：\n'
    + outlineItems.map((item) => `- ${item}`).join('\n'));
  if (npcLogic) sysParts.push(`以下是扮演逻辑指导（决定你如何理解与演绎角色）：\n<npc_logic>\n${resolve(npcLogic)}\n</npc_logic>`);
  if (dialogueGuidance) sysParts.push(`以下是表达规范（决定你如何说话与写内容）：\n<dialogue_guidance>\n${resolve(dialogueGuidance)}\n</dialogue_guidance>`);
  sysParts.push(`以下是小红书里已经出现过的网友名单（评论人可以从中挑选，也可以新造网友）：\n<netizens>\n${rosterText}\n</netizens>`);
  if (worldText) sysParts.push(`以下是当前场景的世界书设定（世界观与人物资料）：\n<world_info>\n${worldText}\n</world_info>`);
  if (tavernText) sysParts.push(`以下是酒馆主线的最近对话（时间旧→新），是你当前所处的剧情背景：\n<tavern_context>\n${tavernText}\n</tavern_context>`);
  if (injectParts) sysParts.push(injectParts.system);
  if (floorLogText) sysParts.push(`以下是最近一次同步到酒馆楼层的手机记录：\n<xhs_chat_log>\n${floorLogText}\n</xhs_chat_log>`);
  const identityNote = customNick && customNick !== playerName
    ? `评论区里署名「${customNick}」的评论也是 TA 写的。`
    : '评论区的署名用的就是 TA 的名字。';
  sysParts.push(`以下是玩家身份说明：${playerDesc}。${identityNote}不要把 TA 当成网友或替 TA 发言。`);
  sysParts.push(published
    ? `以下是玩家刚刚发布的那篇笔记（作者就是 TA 本人，含评论区）：\n<xhs_note>\n${postText}\n</xhs_note>`
    : `以下是玩家正在评论的那篇笔记（含完整评论区）：\n<xhs_note>\n${postText}\n</xhs_note>`);
  if (replyGuidance) sysParts.push(`以下是评论回复的写作指导：\n<reply_guidance>\n${resolve(replyGuidance)}\n</reply_guidance>`);
  if (replyFormat) sysParts.push(`以下是回复格式要求，必须严格遵守：\n<output_format>\n${resolve(replyFormat)}\n</output_format>`);

  const userContent = published
    ? `${playerDesc}刚刚发布了这篇笔记（作者就是 TA 本人），请根据以上信息生成新的网友评论。当前时间：${new Date().toLocaleString('zh-CN', { hour12: false })}。`
    : `${playerDesc}在这篇笔记的评论区留下了新评论（评论区最后一条），请根据以上信息生成新的评论回复。当前时间：${new Date().toLocaleString('zh-CN', { hour12: false })}。`;
  const reply = await iphoneRequestChatCompletion(settings, [
    { role: 'system', content: sysParts.join('\n\n') },
    { role: 'user', content: userContent },
  ]);

  const existingKeys = new Set();
  for (const c of post.comments) {
    const text = String(c.text || '').trim();
    for (const name of [String(c.name || '').trim(), iphoneResolveXhsPlayerAuthor(c.name)]) {
      if (name) existingKeys.add(`${name}|${text}`);
    }
  }
  const fresh = iphoneGetXhsData();
  const created = [];
  const knownNames = new Set(fresh.netizens.map((n) => n.name));
  for (const entry of iphoneParseQqDynamicReplyLines(reply)) {
    const name = String(entry.name || '').trim();
    const text = String(entry.text || '').trim();
    if (!name || !text || playerAliases.has(name) || iphoneIsXhsPlayerAuthor(name)) continue;
    const key = `${name}|${text}`;
    if (existingKeys.has(key)) continue;
    existingKeys.add(key);
    // 名单外的新面孔（模型新造的网友）也收进网友池，之后就是熟面孔了
    if (!knownNames.has(name)) {
      if (!iphoneXhsEnsureNetizen(fresh, name, {})) continue;
      knownNames.add(name);
    }
    const rawReply = String(entry.replyName || '').trim();
    const replyName = (rawReply === playerName || iphoneIsXhsPlayerAuthor(rawReply)) ? playerAuthor : rawReply;
    const knownReply = replyName && replyName !== name
      && (iphoneIsXhsPlayerAuthor(replyName) || playerAliases.has(replyName)
        || knownNames.has(replyName) || replyName === author.name);
    created.push(knownReply
      ? { name, text, replyName, ts: Date.now() }
      : { name, text, ts: Date.now() });
  }
  let fallbackUsed = false;
  if (!created.length) {
    // 玩家自己发的笔记不能走「兜底成作者回复」：那篇的作者就是玩家，兜底等于替玩家
    // 发言（也与「不要替玩家说话」的指导相冲突），解析不了就直接失败、由调用方提示。
    if (published) throw new Error('AI 没有返回有效的网友评论（需要「评论人：内容」格式的行）。');
    const whole = String(reply ?? '').replace(/\s+/g, ' ').trim()
      .replace(/^[^：:\n]{1,30}?(?:\s+回复\s+[^：:\n]{1,30}?)?\s*[:：]\s*/, '')
      .slice(0, IPHONE_XHS_COMMENT_CAP);
    if (!whole) throw new Error('AI 没有返回有效回复内容。');
    created.push({ name: author.name, text: whole, ts: Date.now() });
    fallbackUsed = true;
  }
  iphoneSetXhsData(xhsScreen, fresh);
  iphoneLog('info', published
    ? `小红书发帖成功：生成 ${created.length} 条网友评论`
    : `小红书回复成功：生成 ${created.length} 条新评论${fallbackUsed ? '（整段兜底为作者回复）' : ''}`);
  return created;
}

// ---------- 笔记区块解析 ----------
// 把模型回复按「笔记区块」拆成 { name, xhsId, ip, bio, topic, title, text, topics,
// location, likes, collects, comments }。对格式抖动做容错：容忍代码围栏、行首序号
// 与列表符号、「昵称 / 作者 / 博主」三种发布者字段名、封面题材的同义写法；
// 评论区里每行一条「评论人：内容」（「评论人 回复 被回复人：内容」亦可）。
function iphoneParseXhsNotesReply(text) {
  const notes = [];
  const lines = String(text ?? '').split(/\r?\n/)
    .map((l) => l.trim().replace(/^(?:```+.*|[-•*◆]\s+|\d{1,2}[.、)]\s+)/, '').trim())
    .filter((l) => l && !l.startsWith('```'));
  let cur = null;
  let inComments = false;
  const flush = () => {
    if (cur && (cur.title || cur.text)) notes.push(cur);
    cur = null;
  };
  const fieldOf = (line) => {
    const matched = line.match(/^(昵称|作者|博主|小红书号|小红书ID|小红书id|IP属地|IP|属地|简介|介绍|封面|题材|图片|配图|标题|正文|内容|话题|标签|位置|定位|点赞|赞|收藏|评论)[:：]\s*(.*)$/);
    return matched ? { key: matched[1], value: matched[2].trim() } : null;
  };
  for (const line of lines) {
    // 「评论：」之后的「名字：内容」全部按评论收（评论区里不会再有别的字段）
    const field = fieldOf(line);
    if (field) {
      const isAuthor = /^(昵称|作者|博主)$/.test(field.key);
      if (isAuthor) {
        flush();
        cur = {
          name: field.value, xhsId: '', ip: '', bio: '', topic: '',
          title: '', text: '', topics: [], location: '', likes: 0, collects: 0, comments: [],
        };
        inComments = false;
        continue;
      }
      if (!cur) continue;
      if (/^评论$/.test(field.key)) {
        inComments = true;
        if (field.value) {
          const inline = field.value.match(/^([^：:\n]{1,30}?)(?:\s+回复\s+([^：:\n]{1,30}?))?\s*[:：](.+)$/);
          if (inline) cur.comments.push({ name: inline[1].trim(), replyName: (inline[2] || '').trim(), text: inline[3].trim() });
        }
        continue;
      }
      inComments = false;
      if (/^小红书号|^小红书ID|^小红书id$/.test(field.key)) cur.xhsId = field.value;
      else if (/^IP属地|^IP|^属地$/.test(field.key)) cur.ip = field.value.replace(/^属地[:：]?/, '').trim();
      else if (/^简介|^介绍$/.test(field.key)) cur.bio = field.value;
      else if (/^封面|^题材|^图片|^配图$/.test(field.key)) cur.topic = field.value;
      else if (/^标题$/.test(field.key)) cur.title = field.value;
      else if (/^正文|^内容$/.test(field.key)) cur.text = field.value;
      else if (/^话题|^标签$/.test(field.key)) cur.topics = iphoneXhsTopicList(field.value);
      else if (/^位置|^定位$/.test(field.key)) cur.location = field.value;
      else if (/^点赞|^赞$/.test(field.key)) cur.likes = field.value;
      else if (/^收藏$/.test(field.key)) cur.collects = field.value;
      continue;
    }
    if (!cur) continue;
    // 评论区内的自由行：`评论人：内容`（也容忍「评论人 回复 被回复人：内容」）
    if (inComments) {
      const matched = line.match(/^([^：:\n]{1,30}?)(?:\s+回复\s+([^：:\n]{1,30}?))?\s*[:：]\s*(.+)$/);
      if (matched) {
        cur.comments.push({ name: matched[1].trim(), replyName: (matched[2] || '').trim(), text: matched[3].trim() });
        continue;
      }
      // 续行并进上一条评论
      const last = cur.comments[cur.comments.length - 1];
      if (last) last.text = `${last.text} ${line}`.trim();
      continue;
    }
    // 没写字段名的正文行：并进正文（模型偶尔漏写「正文：」）
    if (!cur.title && !cur.text && line.length <= IPHONE_XHS_TITLE_CAP && !/[。！？!?]$/.test(line)) {
      cur.title = line;
    } else {
      cur.text = `${cur.text} ${line}`.trim();
    }
  }
  flush();
  return notes
    .map((note) => ({
      ...note,
      comments: (note.comments || [])
        .map((c) => ({ name: c.name, replyName: c.replyName, text: c.text }))
        .filter((c) => c.name && c.text)
        .slice(0, 3),
    }))
    .filter((note) => note.name && (note.title || note.text));
}

// ---------- 小红书记录楼层同步 ----------
// 与两个动态页同一套「整段重写」（点赞 / 收藏 / 评论变化要如实反映），段头
// `小红书笔记：`，段标签 [小红书笔记]（与 QQ / 微信的段并列互不干扰）：
//   ◆ 昵称：标题
//     正文：…
//     话题：#a #b
//     位置：上海
//     点赞：1286
//     收藏：734
//     评论：
//     - 名字：内容
function iphoneSyncXhsNotesFloor() {
  const run = async () => {
    const ctx = iphoneGetFloorChatContext();
    if (!ctx) return;
    const data = iphoneGetXhsData();
    if (!data.notes.length) return;
    const sanitize = (value, fallback) => String(value || '').replace(/[\r\n:：]+/g, ' ').trim() || fallback;
    const lines = [];
    for (const note of data.notes) {
      const author = iphoneXhsAuthorOf(data, note);
      const name = sanitize(author.name, '小红书用户');
      const title = String(note.title || '').replace(/[\r\n]+/g, ' ').trim();
      lines.push(`◆ ${name}：${title || '（无标题）'}`);
      if (note.text) lines.push(`  正文：${String(note.text).replace(/[\r\n]+/g, ' ').trim()}`);
      if (note.topics.length) lines.push(`  话题：${note.topics.map((t) => `#${t}`).join(' ')}`);
      if (note.location) lines.push(`  位置：${sanitize(note.location, '')}`);
      lines.push(`  点赞：${iphoneXhsLikeCount(note)}｜收藏：${iphoneXhsCollectCount(note)}`);
      if (note.comments.length) {
        lines.push('  评论：');
        const authorName = (value) => (
          iphoneIsXhsPlayerAuthor(value) ? IPHONE_XHS_USER_MACRO : sanitize(value, '小红书用户')
        );
        for (const c of note.comments) {
          const ctext = String(c.text || '').replace(/[\r\n]+/g, ' ').trim();
          if (!ctext) continue;
          lines.push(c.replyName
            ? `  - ${authorName(c.name)} 回复 ${authorName(c.replyName)}：${ctext}`
            : `  - ${authorName(c.name)}：${ctext}`);
        }
      }
    }
    const sectionHeader = '小红书笔记：';
    const sectionTag = IPHONE_FLOOR_SECTION_TAG_HEADS.xhsNotes;
    const chat = ctx.chat;
    const last = chat[chat.length - 1];
    const existingInner = last ? iphoneExtractMessageFloorInner(last.mes) : null;
    if (existingInner == null) {
      const sections = [{ tag: sectionTag, header: sectionHeader, lines }];
      await iphoneAppendChatFloor(ctx, iphoneWrapMessageFloorInner(iphoneFloorBuildInner(sections)));
      iphoneLog('info', `已同步 ${data.notes.length} 篇小红书笔记到 iPhone_Message 楼层`);
      return;
    }
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
    iphoneLog('info', `已更新小红书笔记段到 iPhone_Message 楼层（${data.notes.length} 篇笔记）`);
  };
  const guarded = async () => {
    try {
      await run();
    } catch (error) {
      iphoneLog('warn', '同步小红书笔记到 iPhone_Message 楼层失败', error);
    }
  };
  iphoneQqFloorSyncChain = iphoneQqFloorSyncChain.then(guarded, guarded);
  return iphoneQqFloorSyncChain;
}

// ---------- 头像选择浮层（小红书版） ----------
function iphoneXhsBuildAvatarPicker(icons, { getCurrent, onPick, commit }) {
  return iphoneQqBuildAvatarPicker(icons, {
    getCurrent: () => iphoneNormalizeXhsAvatar(getCurrent()),
    onPick: (avatar) => onPick(iphoneNormalizeXhsAvatar(avatar)),
    commit: commit ? (avatar) => commit(iphoneNormalizeXhsAvatar(avatar)) : undefined,
    presets: IPHONE_ME_AVATAR_PRESETS,
    clsPrefix: 'iphone-xhs__avatar--',
    meClass: 'iphone-xhs__me-avatar',
  });
}

// ---------- 首页瀑布流 ----------
// 卡片：封面（纯文字笔记是黄底引言卡）+ 标题 + 作者行（头像 / 昵称 / 小心心数）。
// 两列高度用封面宽高比估算，逐张丢进当前更矮的一列——真机的错落感就是这么来的。
function iphoneXhsBuildNoteCard(data, note, icons, onOpen) {
  const card = document.createElement('article');
  card.className = 'iphone-xhs__card';
  card.dataset.noteId = note.id;

  const textOnly = iphoneXhsIsTextNote(note);
  const cover = document.createElement('div');
  if (textOnly) {
    // 纯文字笔记在首图位放一张黄底引言卡（对照真机：米黄底 + 大引号 + 大字摘录 + 短横）
    cover.className = 'iphone-xhs__card-cover iphone-xhs__card-cover--quote';
    const quote = document.createElement('p');
    quote.className = 'iphone-xhs__card-quote';
    quote.textContent = note.text;
    cover.appendChild(quote);
  } else {
    const coverInfo = iphoneXhsCoverFor(note);
    cover.className = `iphone-xhs__card-cover ${iphoneXhsCoverClass(coverInfo)}`;
    cover.style.aspectRatio = String(coverInfo.ratio);
    // 视频笔记在封面右上角有半透明播放圆标（真机每张视频卡都有）
    if (iphoneXhsIsVideoNote(note)) {
      const play = document.createElement('span');
      play.className = 'iphone-xhs__card-play';
      play.innerHTML = icons.playFill || '';
      cover.appendChild(play);
    }
  }
  card.appendChild(cover);

  const title = document.createElement('p');
  title.className = 'iphone-xhs__card-title';
  title.textContent = note.title || note.text;
  card.appendChild(title);

  const foot = document.createElement('div');
  foot.className = 'iphone-xhs__card-foot';
  const author = iphoneXhsAuthorOf(data, note);
  foot.appendChild(author.mine
    ? iphoneXhsBuildMeAvatar(iphoneGetXhsProfile())
    : iphoneXhsBuildNetizenAvatar(data, author.name));
  const name = document.createElement('span');
  name.className = 'iphone-xhs__card-name';
  name.textContent = author.name;
  foot.appendChild(name);
  const like = document.createElement('span');
  like.className = 'iphone-xhs__card-like';
  like.innerHTML = `${note.likeMine ? icons.heartFill : icons.heart}<i>${iphoneXhsFormatCount(iphoneXhsLikeCount(note))}</i>`;
  foot.appendChild(like);
  card.appendChild(foot);

  card.addEventListener('click', () => onOpen(note));
  return card;
}

function iphoneXhsBuildHomePage({ icons, onOpenNote, screen }) {
  const page = document.createElement('div');
  page.className = 'iphone-xhs__tabpage iphone-xhs__home';

  const scroll = document.createElement('div');
  scroll.className = 'iphone-xhs__scroll';

  // 下拉刷新指示器（与朋友圈同一套手势逻辑）
  const indicator = document.createElement('div');
  indicator.className = 'iphone-xhs__refresh';
  indicator.innerHTML = '<span class="iphone-xhs__refresh-spin" aria-hidden="true"></span><span class="iphone-xhs__refresh-text">下拉刷新</span>';
  const refreshText = indicator.querySelector('.iphone-xhs__refresh-text');
  scroll.appendChild(indicator);

  const feed = document.createElement('div');
  feed.className = 'iphone-xhs__feed';

  // 频道横滑条在滚动区里（真机滚动时它会跟着内容一起滚走，顶栏只留关注/发现）
  const channels = document.createElement('nav');
  channels.className = 'iphone-xhs__channels';
  channels.innerHTML = IPHONE_XHS_CHANNELS
    .map((name, i) => `<button type="button" class="iphone-xhs__channel${i === 0 ? ' is-active' : ''}">${name}</button>`)
    .join('') + `<button type="button" class="iphone-xhs__chevron" aria-label="频道管理">${icons.chevronDown}</button>`;
  scroll.appendChild(channels);
  scroll.appendChild(feed);
  page.appendChild(scroll);

  const state = { channel: '推荐', tab: 'discover' };

  function visibleNotes(data) {
    const base = data.notes.filter((note) => !note.private);
    if (state.tab === 'follow') {
      return base.filter((note) => iphoneXhsIsFollowing(data, note.authorId));
    }
    return base.filter((note) => iphoneXhsNoteMatchesChannel(note, state.channel));
  }

  function renderFeed() {
    const data = iphoneGetXhsData();
    const list = visibleNotes(data).slice(-60).reverse();
    feed.innerHTML = '';
    if (!list.length) {
      const empty = document.createElement('div');
      empty.className = 'iphone-xhs__empty';
      empty.textContent = state.tab === 'follow'
        ? '还没有关注的博主，去笔记里点「关注」吧'
        : (data.notes.length ? '这个频道暂时没有笔记，换个频道看看' : '还没有笔记，下拉刷新试试');
      feed.appendChild(empty);
      return;
    }
    const colLeft = document.createElement('div');
    colLeft.className = 'iphone-xhs__col';
    const colRight = document.createElement('div');
    colRight.className = 'iphone-xhs__col';
    let heightLeft = 0;
    let heightRight = 0;
    for (const note of list) {
      const estimate = iphoneXhsCardEstimate(note);
      const target = heightLeft <= heightRight ? colLeft : colRight;
      if (target === colLeft) heightLeft += estimate;
      else heightRight += estimate;
      target.appendChild(iphoneXhsBuildNoteCard(data, note, icons, onOpenNote));
    }
    feed.appendChild(colLeft);
    feed.appendChild(colRight);
  }

  // 下拉刷新：与朋友圈同一套手势（阈值 64px），松手调一次 API 生成 1~3 篇笔记
  const PULL_THRESHOLD = 64;
  let pulling = false;
  let pullStartY = 0;
  let pullDy = 0;
  let refreshing = false;
  const endPull = (trigger) => {
    if (!pulling) return;
    pulling = false;
    page.classList.remove('is-pulling');
    indicator.classList.add('is-anim');
    if (trigger && !refreshing && pullDy >= PULL_THRESHOLD) {
      refreshing = true;
      indicator.style.height = '72px';
      indicator.classList.add('is-refreshing');
      refreshText.textContent = '正在生成新笔记…';
      (async () => {
        let failText = '';
        try {
          await iphoneGenerateXhsNotes(screen);
          renderFeed();
          void iphoneSyncXhsNotesFloor();
        } catch (error) {
          iphoneLog('warn', '小红书刷新笔记失败', error);
          failText = '刷新失败';
        }
        if (failText) {
          refreshText.textContent = failText;
          await new Promise((resolve) => setTimeout(resolve, 1200));
        }
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
      page.classList.remove('is-pulling');
      indicator.style.height = '0px';
      refreshText.textContent = '下拉刷新';
      return;
    }
    if (pullDy > 8) page.classList.add('is-pulling');
    indicator.style.height = `${Math.min(72, pullDy * 0.5)}px`;
    refreshText.textContent = pullDy >= PULL_THRESHOLD ? '松开刷新' : '下拉刷新';
  });
  scroll.addEventListener('pointerup', () => endPull(true));
  scroll.addEventListener('pointercancel', () => endPull(false));
  scroll.addEventListener('pointerleave', () => endPull(false));
  scroll.addEventListener('touchmove', (e) => {
    if (pulling && pullDy > 0) e.preventDefault();
  }, { passive: false });

  page._setChannel = (channel) => {
    state.channel = channel;
    renderFeed();
  };
  page._setTab = (tab) => {
    state.tab = tab;
    renderFeed();
  };
  // 「关注」页只留关注流：频道条收起（真机行为，顶栏点「关注」后横滑条整条消失）
  page._setFollowTab = (following) => {
    channels.classList.toggle('is-hidden', following);
  };
  page._channels = channels;
  channels.querySelectorAll('.iphone-xhs__channel').forEach((btn) => {
    btn.addEventListener('click', () => {
      channels.querySelectorAll('.iphone-xhs__channel').forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      state.channel = btn.textContent.trim();
      renderFeed();
    });
  });
  channels.querySelector('.iphone-xhs__chevron')?.addEventListener('click', () => {
    screen.dispatchEvent(new CustomEvent('iphone-xhs-toast', { detail: '频道管理仅作演示' }));
  });
  page._render = renderFeed;
  return page;
}

// ---------- 笔记详情 ----------
// 打开一篇笔记：封面大图 + 标题正文话题 + 时间与 IP + 作者行（头像 / 昵称 /
//「关注」/ 徽章，对照真实详情页排在图下方）+ 评论区 + 底部互动条（留言输入 /
// 赞 / 收藏 / 评论数）。「不喜欢」藏在右上「更多」里（真实小红书同款），
// 点「更多」弹出底部动作条：不感兴趣 / 取消。
function iphoneXhsBuildNoteView({ icons, screen, onClose, onChanged }) {
  const view = document.createElement('div');
  view.className = 'iphone-xhs__noteview';

  const nav = document.createElement('header');
  nav.className = 'iphone-xhs__note-nav';
  const scroll = document.createElement('div');
  scroll.className = 'iphone-xhs__note-scroll';
  const bar = document.createElement('div');
  bar.className = 'iphone-xhs__note-bar';
  bar.innerHTML = `
    <input type="text" class="iphone-xhs__note-input" maxlength="${IPHONE_XHS_COMMENT_CAP}"
      placeholder="说点什么..." aria-label="评论这篇笔记" autocomplete="off" spellcheck="false">
    <button type="button" class="iphone-xhs__note-send">发送</button>
    <span class="iphone-xhs__note-acts">
      <button type="button" class="iphone-xhs__note-act iphone-xhs__note-like" aria-label="点赞"></button>
      <button type="button" class="iphone-xhs__note-act iphone-xhs__note-collect" aria-label="收藏"></button>
      <button type="button" class="iphone-xhs__note-act iphone-xhs__note-comment" aria-label="评论"></button>
    </span>
  `;
  const input = bar.querySelector('.iphone-xhs__note-input');
  const sendBtn = bar.querySelector('.iphone-xhs__note-send');
  const likeBtn = bar.querySelector('.iphone-xhs__note-like');
  const collectBtn = bar.querySelector('.iphone-xhs__note-collect');
  const commentBtn = bar.querySelector('.iphone-xhs__note-comment');

  const errRow = document.createElement('p');
  errRow.className = 'iphone-xhs__note-err';
  errRow.hidden = true;

  view.appendChild(nav);
  view.appendChild(scroll);
  view.appendChild(errRow);
  view.appendChild(bar);

  // 「更多」的底部动作条（真实小红书把「不感兴趣」收在这里）：灰字大按钮 + 取消
  const sheet = document.createElement('div');
  sheet.className = 'iphone-xhs__sheet-actions';
  sheet.innerHTML = `
    <div class="iphone-xhs__sheet-mask" data-sheet-cancel></div>
    <div class="iphone-xhs__sheet-panel">
      <button type="button" class="iphone-xhs__sheet-act" data-act-dislike>不感兴趣</button>
      <button type="button" class="iphone-xhs__sheet-cancel" data-sheet-cancel>取消</button>
    </div>
  `;
  view.appendChild(sheet);
  const closeSheet = () => sheet.classList.remove('is-open');
  sheet.querySelectorAll('[data-sheet-cancel]').forEach((el) => {
    el.addEventListener('click', closeSheet);
  });

  let noteId = '';
  let sending = false;

  const currentNote = () => iphoneGetXhsData().notes.find((n) => n.id === noteId) || null;

  // 顶栏只留返回 / 分享 / 更多（真实详情页同款：作者资料在图下方）
  function renderNav() {
    nav.innerHTML = `
      <button type="button" class="iphone-xhs__note-back" aria-label="返回">${icons.back}</button>
      <span class="iphone-xhs__note-navtitle"></span>
      <button type="button" class="iphone-xhs__note-share" aria-label="分享">${icons.iosShare}</button>
      <button type="button" class="iphone-xhs__note-more" aria-label="更多">${icons.more}</button>
    `;
    nav.querySelector('.iphone-xhs__note-back')?.addEventListener('click', () => onClose?.());
    nav.querySelector('.iphone-xhs__note-share')?.addEventListener('click', () => {
      view.dispatchEvent(new CustomEvent('iphone-xhs-toast', { detail: '分享面板仅作演示' }));
    });
    nav.querySelector('.iphone-xhs__note-more')?.addEventListener('click', () => sheet.classList.add('is-open'));
  }

  function buildCommentRow(data, note, comment, index) {
    const row = document.createElement('div');
    row.className = 'iphone-xhs__c';
    const isMe = iphoneIsXhsPlayerAuthor(comment.name);
    row.appendChild(isMe
      ? iphoneXhsBuildMeAvatar(iphoneGetXhsProfile())
      : iphoneXhsBuildNetizenAvatar(data, comment.name));
    const body = document.createElement('div');
    body.className = 'iphone-xhs__c-body';
    const head = document.createElement('p');
    head.className = 'iphone-xhs__c-name';
    head.textContent = isMe ? iphoneGetXhsProfile().name : comment.name;
    if (index === 0) {
      const badge = document.createElement('span');
      badge.className = 'iphone-xhs__c-badge';
      badge.textContent = '首评';
      head.appendChild(badge);
    }
    body.appendChild(head);
    const text = document.createElement('p');
    text.className = 'iphone-xhs__c-text';
    if (comment.replyName) {
      const reply = document.createElement('span');
      reply.className = 'iphone-xhs__c-replyto';
      reply.textContent = `回复 ${iphoneResolveXhsPlayerAuthor(comment.replyName)}`;
      text.appendChild(reply);
      text.appendChild(document.createTextNode(' '));
    }
    text.appendChild(document.createTextNode(comment.text));
    body.appendChild(text);
    const meta = document.createElement('p');
    meta.className = 'iphone-xhs__c-meta';
    const when = document.createElement('span');
    when.textContent = iphoneXhsTimeLabel(comment.ts || note.ts);
    const where = document.createElement('span');
    where.textContent = `IP属地：${iphoneXhsCommentIp(data, comment, note)}`;
    const replyBtn = document.createElement('button');
    replyBtn.type = 'button';
    replyBtn.className = 'iphone-xhs__c-reply';
    replyBtn.textContent = '回复';
    replyBtn.addEventListener('click', () => {
      input.value = `@${isMe ? iphoneGetXhsProfile().name : comment.name} `;
      input.focus();
    });
    meta.append(when, where, replyBtn);
    body.appendChild(meta);
    row.appendChild(body);
    const like = document.createElement('div');
    like.className = 'iphone-xhs__c-like';
    like.innerHTML = `${icons.heart}<i>${iphoneXhsFormatCount(iphoneXhsCommentLikes(comment))}</i>`;
    row.appendChild(like);
    return row;
  }

  function render() {
    const note = currentNote();
    if (!note) {
      onClose?.();
      return;
    }
    const data = iphoneGetXhsData();
    const author = iphoneXhsAuthorOf(data, note);
    const cover = iphoneXhsCoverFor(note);
    renderNav();

    scroll.innerHTML = '';
    if (iphoneXhsIsTextNote(note)) {
      // 文字笔记：详情页首屏就是摘录本身，不铺图（与首页文字卡一致）
      const quote = document.createElement('div');
      quote.className = 'iphone-xhs__note-image iphone-xhs__note-image--text';
      const text = document.createElement('p');
      text.className = 'iphone-xhs__note-quote';
      text.textContent = note.text;
      quote.appendChild(text);
      scroll.appendChild(quote);
    } else {
      const image = document.createElement('div');
      image.className = `iphone-xhs__note-image ${iphoneXhsCoverClass(cover)}`;
      image.style.aspectRatio = String(cover.ratio);
      scroll.appendChild(image);
    }

    const body = document.createElement('div');
    body.className = 'iphone-xhs__note-body';
    if (note.title) {
      const title = document.createElement('h1');
      title.className = 'iphone-xhs__note-title';
      title.textContent = note.title;
      body.appendChild(title);
    }
    if (note.text && !iphoneXhsIsTextNote(note)) {
      const text = document.createElement('p');
      text.className = 'iphone-xhs__note-text';
      text.textContent = note.text;
      body.appendChild(text);
    }
    if (note.topics.length) {
      const topics = document.createElement('p');
      topics.className = 'iphone-xhs__note-topics';
      for (const topic of note.topics) {
        const chip = document.createElement('span');
        chip.className = 'iphone-xhs__note-topic';
        chip.textContent = `#${topic}`;
        topics.appendChild(chip);
      }
      body.appendChild(topics);
    }
    const meta = document.createElement('p');
    meta.className = 'iphone-xhs__note-meta';
    meta.textContent = [
      iphoneXhsTimeLabel(note.ts),
      note.location ? note.location : '',
      `IP属地：${note.ip || author.ip || IPHONE_XHS_ME.ip}`,
      author.xhsId ? `小红书号：${author.xhsId}` : '',
    ].filter(Boolean).join(' · ');
    body.appendChild(meta);

    // 作者行（真实详情页：图下方左侧头像 + 昵称 + 徽章，右侧「关注」）
    const authorRow = document.createElement('div');
    authorRow.className = 'iphone-xhs__author';
    authorRow.appendChild(author.mine
      ? iphoneXhsBuildMeAvatar(iphoneGetXhsProfile())
      : iphoneXhsBuildNetizenAvatar(data, author.name));
    const authorInfo = document.createElement('span');
    authorInfo.className = 'iphone-xhs__author-info';
    const authorName = document.createElement('b');
    authorName.textContent = author.name;
    authorInfo.appendChild(authorName);
    if (author.mine) {
      const badge = document.createElement('i');
      badge.className = 'iphone-xhs__author-badge';
      badge.textContent = '我';
      authorInfo.appendChild(badge);
    } else if (note.comments.length && note.comments[0].name === author.name) {
      const badge = document.createElement('i');
      badge.className = 'iphone-xhs__author-badge';
      badge.textContent = '作者';
      authorInfo.appendChild(badge);
    }
    authorRow.appendChild(authorInfo);
    if (!author.mine) {
      const following = iphoneXhsIsFollowing(data, author.id);
      const followBtn = document.createElement('button');
      followBtn.type = 'button';
      followBtn.className = `iphone-xhs__author-follow${following ? ' is-on' : ''}`;
      followBtn.textContent = following ? '已关注' : '关注';
      followBtn.addEventListener('click', () => {
        const fresh = iphoneGetXhsData();
        const has = fresh.following.includes(author.id);
        fresh.following = has
          ? fresh.following.filter((id) => id !== author.id)
          : [...fresh.following, author.id];
        iphoneSetXhsData(screen, fresh);
        render();
      });
      authorRow.appendChild(followBtn);
    }
    body.appendChild(authorRow);
    scroll.appendChild(body);

    const commentsWrap = document.createElement('section');
    commentsWrap.className = 'iphone-xhs__note-comments';
    const head = document.createElement('p');
    head.className = 'iphone-xhs__note-chead';
    head.textContent = `共 ${note.comments.length} 条评论`;
    commentsWrap.appendChild(head);
    if (!note.comments.length) {
      const empty = document.createElement('p');
      empty.className = 'iphone-xhs__note-cempty';
      empty.textContent = '还没有评论，快来抢首评';
      commentsWrap.appendChild(empty);
    } else {
      note.comments.forEach((comment, index) => {
        commentsWrap.appendChild(buildCommentRow(data, note, comment, index));
      });
    }
    scroll.appendChild(commentsWrap);

    // 底部互动条：赞 / 收藏可点（就地点亮并落盘），评论数随评论区更新
    likeBtn.innerHTML = `${note.likeMine ? icons.heartFill : icons.heart}<i>${iphoneXhsFormatCount(iphoneXhsLikeCount(note))}</i>`;
    likeBtn.classList.toggle('is-on', note.likeMine);
    collectBtn.innerHTML = `${note.collectMine ? icons.starFill : icons.star}<i>${iphoneXhsFormatCount(iphoneXhsCollectCount(note))}</i>`;
    collectBtn.classList.toggle('is-on', note.collectMine);
    commentBtn.innerHTML = `${icons.comment}<i>${note.comments.length}</i>`;
    refreshSend();
  }

  sheet.querySelector('[data-act-dislike]')?.addEventListener('click', () => {
    closeSheet();
    const note = currentNote();
    if (!note) return;
    const fresh = iphoneGetXhsData();
    fresh.notes = fresh.notes.filter((n) => n.id !== note.id);
    iphoneSetXhsData(screen, fresh);
    void iphoneSyncXhsNotesFloor();
    onChanged?.();
    onClose?.();
  });

  function refreshSend() {
    sendBtn.classList.toggle('is-active', Boolean(input.value.trim()));
  }
  input.addEventListener('input', refreshSend);
  commentBtn.addEventListener('click', () => input.focus());

  likeBtn.addEventListener('click', () => {
    const note = currentNote();
    if (!note) return;
    const fresh = iphoneGetXhsData();
    const target = fresh.notes.find((n) => n.id === note.id);
    if (!target) return;
    target.likeMine = !target.likeMine;
    iphoneSetXhsData(screen, fresh);
    void iphoneSyncXhsNotesFloor();
    render();
    onChanged?.();
  });
  collectBtn.addEventListener('click', () => {
    const note = currentNote();
    if (!note) return;
    const fresh = iphoneGetXhsData();
    const target = fresh.notes.find((n) => n.id === note.id);
    if (!target) return;
    target.collectMine = !target.collectMine;
    iphoneSetXhsData(screen, fresh);
    void iphoneSyncXhsNotesFloor();
    render();
    onChanged?.();
  });

  const submit = async () => {
    if (sending) return;
    const text = input.value.trim();
    if (!text) return;
    const note = currentNote();
    if (!note) return;
    sending = true;
    errRow.hidden = true;
    sendBtn.textContent = '发送中…';
    sendBtn.disabled = true;
    // 先落盘玩家的评论（楼层同步不等人设解析），再调 API 生成网友的回应
    const playerAuthor = iphoneGetXhsPlayerAuthor();
    const withPlayer = iphoneGetXhsData();
    const target = withPlayer.notes.find((n) => n.id === note.id);
    if (!target) {
      sending = false;
      sendBtn.textContent = '发送';
      sendBtn.disabled = false;
      return;
    }
    target.comments = [...target.comments, { name: playerAuthor, text, ts: Date.now() }].slice(-40);
    iphoneSetXhsData(screen, withPlayer);
    void iphoneSyncXhsNotesFloor();
    input.value = '';
    render();
    onChanged?.();
    try {
      const created = await iphoneGenerateXhsComments(target, screen);
      const data = iphoneGetXhsData();
      const t2 = data.notes.find((n) => n.id === note.id);
      if (!t2) throw new Error('这篇笔记已经不在了');
      t2.comments = [...t2.comments, ...created].slice(-40);
      iphoneSetXhsData(screen, data);
      void iphoneSyncXhsNotesFloor();
      render();
      onChanged?.();
    } catch (error) {
      iphoneLog('warn', '小红书评论回复失败', error);
      errRow.hidden = false;
      errRow.textContent = `回复失败：${String(error?.message || error)}`;
    }
    sending = false;
    sendBtn.textContent = '发送';
    sendBtn.disabled = false;
    const stream = scroll;
    stream.scrollTop = stream.scrollHeight;
  };
  sendBtn.addEventListener('click', submit);
  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      submit();
    }
  });

  view._open = (note) => {
    noteId = note.id;
    render();
    scroll.scrollTop = 0;
  };
  view._render = () => {
    if (view.classList.contains('is-open') && noteId) render();
  };
  return view;
}

// ---------- 消息页 ----------
// 三条聚合入口（赞和收藏 / 新增关注 / 评论和@）+ 消息列表。列表内容全部从真实
// 数据派生：玩家点过的赞与收藏、关注过的博主、笔记下的评论往来——不编造数据。
function iphoneXhsCollectNotifications(data) {
  const likes = [];
  const follows = [];
  const comments = [];
  for (const note of [...data.notes].reverse()) {
    const author = iphoneXhsAuthorOf(data, note);
    if (note.likeMine) {
      likes.push({ id: `lk-${note.id}`, type: 'likes', name: author.name, noteId: note.id, ts: note.ts, text: `你赞了「${note.title || note.text}」` });
    }
    if (note.collectMine) {
      likes.push({ id: `cl-${note.id}`, type: 'likes', name: author.name, noteId: note.id, ts: note.ts, text: `你收藏了「${note.title || note.text}」` });
    }
    for (const comment of note.comments) {
      if (iphoneIsXhsPlayerAuthor(comment.name)) continue;
      comments.push({
        id: `cm-${note.id}-${comment.name}-${comment.text.slice(0, 8)}`,
        type: 'comments',
        name: comment.name,
        noteId: note.id,
        ts: comment.ts || note.ts,
        text: comment.replyName && iphoneIsXhsPlayerAuthor(comment.replyName)
          ? `回复了你的评论：${comment.text}`
          : `评论了「${note.title || note.text}」：${comment.text}`,
      });
    }
  }
  for (const id of data.following) {
    const netizen = data.netizens.find((n) => n.id === id);
    if (!netizen) continue;
    follows.push({ id: `fw-${id}`, type: 'follows', name: netizen.name, noteId: '', ts: 0, text: '你关注了 TA' });
  }
  const byTs = (a, b) => (b.ts || 0) - (a.ts || 0);
  return {
    likes: likes.sort(byTs).slice(0, 30),
    follows: follows.slice(0, 30),
    comments: comments.sort(byTs).slice(0, 30),
  };
}

function iphoneXhsBuildMessagesPage({ icons, onOpenNote, onOpenInbox }) {
  const page = document.createElement('div');
  // 初始 is-hidden：四个 Tab 页都是 inset:0 的绝对定位层，不藏起来会全部叠在首页上
  page.className = 'iphone-xhs__tabpage iphone-xhs__msg is-hidden';

  const scroll = document.createElement('div');
  scroll.className = 'iphone-xhs__scroll';
  const entries = document.createElement('div');
  entries.className = 'iphone-xhs__msg-entries';
  const list = document.createElement('div');
  list.className = 'iphone-xhs__msg-list';
  scroll.appendChild(entries);
  scroll.appendChild(list);
  page.appendChild(scroll);

  const toneClass = { pink: 'is-pink', blue: 'is-blue', green: 'is-green' };
  const entryIcon = { likes: icons.heartSquare, follows: icons.followSquare, comments: icons.atSquare };

  function render() {
    const data = iphoneGetXhsData();
    const inbox = iphoneXhsCollectNotifications(data);
    entries.innerHTML = '';
    for (const entry of IPHONE_XHS_MSG_ENTRIES) {
      const row = document.createElement('button');
      row.type = 'button';
      row.className = 'iphone-xhs__msg-entry';
      // 红点看的是**未读**：这条入口点进去看过之后，红点就没了
      const unread = iphoneXhsUnreadOf(inbox, data.msgRead, entry.id).length;
      row.innerHTML = `
        <span class="iphone-xhs__msg-icowrap">
          <span class="iphone-xhs__msg-ico ${toneClass[entry.tone] || ''}" aria-hidden="true">${entryIcon[entry.id] || ''}</span>
          ${unread ? `<span class="iphone-xhs__msg-dot"></span>` : ''}
        </span>
        <span class="iphone-xhs__msg-label">${entry.label}</span>
      `;
      row.addEventListener('click', () => onOpenInbox(entry.id, entry.label));
      entries.appendChild(row);
    }

    // 消息列表：三类通知按时序混排，最前面再补两条系统级会话
    //（活动消息 / 系统消息，对照真实小红书消息页的常驻条目）
    const systemRows = [
      { id: 'sys-activity', name: '活动消息', text: '官方活动与话题邀约', ts: 0, tone: 'blue', icon: icons.comment },
      { id: 'sys-notice', name: '系统消息', text: '一起聊聊你眼中的「智能眼镜」吧', ts: 0, tone: 'blue', icon: icons.bell },
    ];
    const all = [...inbox.likes, ...inbox.follows, ...inbox.comments]
      .sort((a, b) => (b.ts || 0) - (a.ts || 0))
      .slice(0, 30);
    list.innerHTML = '';
    for (const sys of systemRows) {
      const row = document.createElement('div');
      row.className = 'iphone-xhs__msg-row';
      const ico = document.createElement('span');
      ico.className = `iphone-xhs__msg-ico iphone-xhs__msg-ico--row ${toneClass[sys.tone] || ''}`;
      ico.innerHTML = sys.icon;
      row.appendChild(ico);
      const body = document.createElement('div');
      body.className = 'iphone-xhs__msg-body';
      const name = document.createElement('p');
      name.className = 'iphone-xhs__msg-name';
      name.textContent = sys.name;
      const text = document.createElement('p');
      text.className = 'iphone-xhs__msg-text';
      text.textContent = sys.text;
      body.append(name, text);
      row.appendChild(body);
      list.appendChild(row);
    }
    if (!all.length) {
      const empty = document.createElement('div');
      empty.className = 'iphone-xhs__empty';
      empty.textContent = '暂无新消息';
      list.appendChild(empty);
      return;
    }
    for (const item of all) {
      const row = document.createElement('div');
      row.className = 'iphone-xhs__msg-row';
      row.appendChild(iphoneXhsBuildNetizenAvatar(data, item.name));
      const body = document.createElement('div');
      body.className = 'iphone-xhs__msg-body';
      const name = document.createElement('p');
      name.className = 'iphone-xhs__msg-name';
      name.textContent = item.name;
      const text = document.createElement('p');
      text.className = 'iphone-xhs__msg-text';
      text.textContent = item.text;
      body.append(name, text);
      row.appendChild(body);
      const time = document.createElement('span');
      time.className = 'iphone-xhs__msg-time';
      time.textContent = item.ts ? iphoneXhsTimeLabel(item.ts) : '';
      row.appendChild(time);
      if (item.noteId) {
        row.addEventListener('click', () => {
          const fresh = iphoneGetXhsData();
          const note = fresh.notes.find((n) => n.id === item.noteId);
          if (note) onOpenNote(note);
        });
      }
      list.appendChild(row);
    }
  }

  page._render = render;
  return page;
}

// ---------- 我（个人主页） ----------
// 对照真实小红书「我」页：深色渐变头图（顶行菜单 / 编辑主页 / 扫码 / 分享，往下
// 大头像 + 昵称 + 小红书号 / IP + 统计行 + 简介 + 标签 + 两张快捷卡），下接白底
// 的「笔记 / 收藏 / 赞」Tab 与笔记子筛选（公开 / 私密 / 合集）三列图墙。数据全部
// 从真实状态派生（收藏 / 赞 = 玩家自己点过的笔记），编辑走「编辑资料」覆盖层。
function iphoneXhsBuildMePage({ icons, onOpenNote, onEditProfile }) {
  const page = document.createElement('div');
  page.className = 'iphone-xhs__tabpage iphone-xhs__me is-hidden';

  const scroll = document.createElement('div');
  scroll.className = 'iphone-xhs__me-scroll';

  const header = document.createElement('div');
  header.className = 'iphone-xhs__me-header';
  header.innerHTML = `
    <div class="iphone-xhs__me-actions">
      <span class="iphone-xhs__me-action" aria-hidden="true">${icons.menu}</span>
      <button type="button" class="iphone-xhs__me-editpill" data-xhs-open-profile>
        ${icons.edit}<span>编辑主页</span>
      </button>
      <span class="iphone-xhs__me-action" aria-hidden="true">${icons.qr}</span>
      <span class="iphone-xhs__me-action" aria-hidden="true">${icons.iosShare}</span>
    </div>
    <div class="iphone-xhs__me-top">
      <span class="iphone-xhs__me-avatar iphone-xhs__me-avatar--lg" data-xhs-me-avatar data-xhs-open-profile role="button" aria-label="编辑资料" tabindex="0"></span>
      <p class="iphone-xhs__me-name" data-xhs-me-name></p>
    </div>
    <div class="iphone-xhs__me-ids">
      <p class="iphone-xhs__me-id" data-xhs-me-id></p>
      <p class="iphone-xhs__me-ip" data-xhs-me-ip></p>
    </div>
    <div class="iphone-xhs__me-stats">
      <button type="button" class="iphone-xhs__me-stat" data-stat="follow"><b data-xhs-stat-follow>0</b><i>关注</i></button>
      <button type="button" class="iphone-xhs__me-stat" data-stat="fans"><b data-xhs-stat-fans>0</b><i>粉丝</i></button>
      <button type="button" class="iphone-xhs__me-stat" data-stat="likes"><b data-xhs-stat-likes>0</b><i>获赞与收藏</i></button>
    </div>
    <p class="iphone-xhs__me-bio" data-xhs-me-bio></p>
    <div class="iphone-xhs__me-tags" data-xhs-me-tags></div>
    <div class="iphone-xhs__me-cards">
      <div class="iphone-xhs__me-card2">
        <span class="iphone-xhs__me-card2-ico" aria-hidden="true">${icons.clock}</span>
        <span class="iphone-xhs__me-card2-body">
          <b>浏览记录</b>
          <i data-xhs-history-hint>看过的笔记</i>
        </span>
      </div>
      <div class="iphone-xhs__me-card2">
        <span class="iphone-xhs__me-card2-ico" aria-hidden="true">${icons.wallet}</span>
        <span class="iphone-xhs__me-card2-body">
          <b>钱包</b>
          <i>查看详情</i>
        </span>
      </div>
    </div>
  `;
  scroll.appendChild(header);

  const tabs = document.createElement('nav');
  tabs.className = 'iphone-xhs__me-tabs';
  // 三个内容 Tab 全部从真实数据派生：笔记 = 我发的；收藏 / 赞 = 玩家收藏过 / 点过赞的
  const tabDefs = [
    { id: 'notes', label: '笔记' },
    { id: 'collects', label: '收藏' },
    { id: 'likes', label: '赞' },
  ];
  const tabButtons = [];
  for (const def of tabDefs) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `iphone-xhs__me-tab${def.id === 'notes' ? ' is-active' : ''}`;
    btn.innerHTML = `<i>${def.label}</i>`;
    btn.addEventListener('click', () => {
      tabButtons.forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      state.tab = def.id;
      state.sub = 'public';
      renderSubs();
      renderGrid();
    });
    tabButtons.push(btn);
    tabs.appendChild(btn);
  }
  const tabSearch = document.createElement('span');
  tabSearch.className = 'iphone-xhs__me-tabsearch';
  tabSearch.innerHTML = icons.search;
  tabs.appendChild(tabSearch);
  scroll.appendChild(tabs);

  // 笔记 Tab 下的子筛选行（真实「我」页：公开 / 私密 / 合集 + 计数）
  const subs = document.createElement('div');
  subs.className = 'iphone-xhs__me-subs';
  scroll.appendChild(subs);

  const grid = document.createElement('div');
  grid.className = 'iphone-xhs__me-grid';
  scroll.appendChild(grid);
  page.appendChild(scroll);

  const state = { tab: 'notes', sub: 'public' };

  function renderSubs() {
    const data = iphoneGetXhsData();
    const mine = data.notes.filter((n) => n.authorId === '__me__');
    // 子筛选只属于「笔记」Tab（收藏 / 赞 没有公开与私密之分）
    subs.hidden = state.tab !== 'notes';
    if (subs.hidden) return;
    subs.innerHTML = '';
    const defs = [
      { id: 'public', label: '公开', count: mine.filter((n) => !n.private).length },
      { id: 'private', label: '私密', count: mine.filter((n) => n.private).length, lock: true },
      { id: 'album', label: '合集', count: 0 },
    ];
    for (const def of defs) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `iphone-xhs__me-sub${state.sub === def.id ? ' is-active' : ''}`;
      btn.innerHTML = `${def.lock ? `<span class="iphone-xhs__me-sublock" aria-hidden="true">${icons.lock}</span>` : ''}<span>${def.label}</span><i>${def.count}</i>`;
      btn.addEventListener('click', () => {
        state.sub = def.id;
        renderSubs();
        renderGrid();
      });
      subs.appendChild(btn);
    }
  }

  function renderHeader() {
    const profile = iphoneGetXhsProfile();
    const data = iphoneGetXhsData();
    const mine = data.notes.filter((n) => n.authorId === '__me__');
    iphoneRefreshXhsMeIdentity(page);
    const bio = page.querySelector('[data-xhs-me-bio]');
    if (bio) {
      bio.textContent = profile.bio || '点击「编辑主页」，写一句介绍自己吧～';
      bio.classList.toggle('is-empty', !profile.bio);
    }
    const tags = page.querySelector('[data-xhs-me-tags]');
    if (tags) {
      tags.innerHTML = '';
      for (const tag of [`♀ ${profile.ip}`, '小红书创作者', mine.length ? `笔记 ${mine.length}` : '还没发过笔记']) {
        const chip = document.createElement('span');
        chip.className = 'iphone-xhs__me-tag';
        chip.textContent = tag;
        tags.appendChild(chip);
      }
    }
    const historyHint = page.querySelector('[data-xhs-history-hint]');
    if (historyHint) {
      const seen = data.notes.filter((n) => n.likeMine || n.collectMine).length;
      historyHint.textContent = seen ? `${seen} 篇看过的笔记` : '看过的笔记';
    }
    // 粉丝数由「我」自己的笔记互动量派生（没人互动就没有粉丝），获赞与收藏是
    // 全部笔记的点赞 + 收藏合计
    const likes = mine.reduce((sum, n) => sum + iphoneXhsLikeCount(n) + iphoneXhsCollectCount(n), 0);
    const fans = mine.reduce((sum, n) => sum + Math.floor((iphoneXhsLikeCount(n) + iphoneXhsCollectCount(n)) / 12), 0);
    const set = (key, value) => {
      const el = page.querySelector(`[data-xhs-stat-${key}]`);
      if (el) el.textContent = iphoneXhsFormatCount(value);
    };
    set('follow', data.following.length);
    set('fans', fans);
    set('likes', likes);
  }

  // 三列图墙的封面卡：真实「我」页是正方形封面、底部一行点赞数；私密笔记挂锁标
  function buildGridCard(data, note) {
    const card = document.createElement('article');
    card.className = 'iphone-xhs__me-card';
    const cover = document.createElement('div');
    cover.className = `iphone-xhs__card-cover ${iphoneXhsCoverClass(iphoneXhsCoverFor(note))}`;
    cover.style.aspectRatio = '1';
    if (note.private) {
      const lock = document.createElement('span');
      lock.className = 'iphone-xhs__me-lock';
      lock.innerHTML = icons.lock;
      cover.appendChild(lock);
    }
    card.appendChild(cover);
    const foot = document.createElement('p');
    foot.className = 'iphone-xhs__me-cardfoot';
    foot.innerHTML = `${note.likeMine ? icons.heartFill : icons.heart}<i>${iphoneXhsFormatCount(iphoneXhsLikeCount(note))}</i>`;
    card.appendChild(foot);
    card.addEventListener('click', () => onOpenNote(note));
    return card;
  }

  // 收藏 / 赞 Tab 的瀑布卡：真实「我」页这两页是双列瀑布流——原比例的封面 +
  // 标题 + 作者行，而不是笔记 Tab 那种正方形图墙。
  function buildWaterfallCard(data, note) {
    const card = document.createElement('article');
    card.className = 'iphone-xhs__me-waterfall-card';
    const cover = document.createElement('div');
    const coverInfo = iphoneXhsCoverFor(note);
    cover.className = `iphone-xhs__card-cover ${iphoneXhsCoverClass(coverInfo)}`;
    cover.style.aspectRatio = String(coverInfo.ratio);
    card.appendChild(cover);
    const title = document.createElement('p');
    title.className = 'iphone-xhs__card-title';
    title.textContent = note.title || note.text;
    card.appendChild(title);
    const foot = document.createElement('div');
    foot.className = 'iphone-xhs__card-foot';
    const author = iphoneXhsAuthorOf(data, note);
    foot.appendChild(author.mine
      ? iphoneXhsBuildMeAvatar(iphoneGetXhsProfile())
      : iphoneXhsBuildNetizenAvatar(data, author.name));
    const name = document.createElement('span');
    name.className = 'iphone-xhs__card-name';
    name.textContent = author.name;
    foot.appendChild(name);
    const like = document.createElement('span');
    like.className = 'iphone-xhs__card-like';
    like.innerHTML = `${note.likeMine ? icons.heartFill : icons.heart}<i>${iphoneXhsFormatCount(iphoneXhsLikeCount(note))}</i>`;
    foot.appendChild(like);
    card.appendChild(foot);
    card.addEventListener('click', () => onOpenNote(note));
    return card;
  }

  function renderGrid() {
    const data = iphoneGetXhsData();
    grid.innerHTML = '';
    // 只有笔记 Tab 是正方形图墙，收藏 / 赞 走双列瀑布（与真机一致）
    grid.classList.toggle('is-waterfall', state.tab !== 'notes');
    let list = [];
    let emptyText = '';
    if (state.tab === 'notes') {
      const mine = data.notes.filter((n) => n.authorId === '__me__');
      if (state.sub === 'album') {
        const empty = document.createElement('div');
        empty.className = 'iphone-xhs__empty iphone-xhs__empty--grid';
        empty.textContent = '还没有创建合集';
        grid.appendChild(empty);
        return;
      }
      // 私密笔记排在公开前面（真实「我」页私密内容置顶），私密卡左上挂锁标
      list = state.sub === 'private'
        ? mine.filter((n) => n.private)
        : mine.filter((n) => !n.private);
      emptyText = state.sub === 'private' ? '还没有私密笔记' : '还没有发布过笔记，点底部红「+」发一篇吧';
    } else if (state.tab === 'collects') {
      list = data.notes.filter((n) => n.collectMine);
      emptyText = '还没有收藏过笔记';
    } else {
      list = data.notes.filter((n) => n.likeMine);
      emptyText = '还没有给笔记点过赞';
    }
    if (!list.length) {
      const empty = document.createElement('div');
      empty.className = 'iphone-xhs__empty iphone-xhs__empty--grid';
      empty.textContent = emptyText;
      grid.appendChild(empty);
      return;
    }
    const build = state.tab === 'notes' ? buildGridCard : buildWaterfallCard;
    for (const note of list) grid.appendChild(build(data, note));
  }

  header.querySelectorAll('[data-xhs-open-profile]').forEach((el) => {
    el.addEventListener('click', () => onEditProfile?.());
  });
  header.querySelector('[data-stat="follow"]')?.addEventListener('click', () => {
    const data = iphoneGetXhsData();
    if (!data.following.length) return;
    const first = data.notes.find((n) => n.authorId === data.following[0]);
    if (first) onOpenNote(first);
  });

  page._render = () => {
    renderHeader();
    renderSubs();
    renderGrid();
  };
  return page;
}

// ---------- 市集页（占位） ----------
// 真实小红书的市集是电商频道，与本插件无关，这里只做与真机同构的占位页。
function iphoneXhsBuildMarketPage(icons) {
  const page = document.createElement('div');
  page.className = 'iphone-xhs__tabpage iphone-xhs__market is-hidden';
  page.innerHTML = `
    <div class="iphone-xhs__market-search">
      <span aria-hidden="true">${icons.search}</span>
      <i>搜索商品</i>
    </div>
    <div class="iphone-xhs__market-empty">
      <span aria-hidden="true">${icons.bag}</span>
      <p>市集还在筹备中</p>
      <i>去首页看看网友们的笔记吧</i>
    </div>
  `;
  page._render = () => {};
  return page;
}

// ---------- 编辑资料 ----------
function iphoneXhsBuildProfileView({ icons, screen, onClose }) {
  const view = document.createElement('div');
  view.className = 'iphone-xhs__prof';
  view.innerHTML = `
    <header class="iphone-xhs__prof-nav">
      <button type="button" class="iphone-xhs__prof-back" aria-label="返回">${icons.back}</button>
      <p class="iphone-xhs__prof-title">编辑资料</p>
      <button type="button" class="iphone-xhs__prof-save">保存</button>
    </header>
    <div class="iphone-xhs__prof-body">
      <button type="button" class="iphone-xhs__prof-row iphone-xhs__prof-row--avatar">
        <span class="iphone-xhs__prof-label">头像</span>
        <span class="iphone-xhs__me-avatar iphone-xhs__prof-avatar" data-xhs-me-avatar aria-hidden="true"></span>
        <span class="iphone-xhs__prof-chev" aria-hidden="true">${icons.chevronRight}</span>
      </button>
      <label class="iphone-xhs__prof-row">
        <span class="iphone-xhs__prof-label">昵称</span>
        <input class="iphone-xhs__prof-input" type="text" data-field="name" maxlength="24" placeholder="填写昵称" autocomplete="off">
      </label>
      <label class="iphone-xhs__prof-row">
        <span class="iphone-xhs__prof-label">小红书号</span>
        <input class="iphone-xhs__prof-input" type="text" data-field="xhsId" maxlength="32" placeholder="字母 / 数字" autocomplete="off" spellcheck="false">
      </label>
      <label class="iphone-xhs__prof-row">
        <span class="iphone-xhs__prof-label">IP 属地</span>
        <input class="iphone-xhs__prof-input" type="text" data-field="ip" maxlength="16" placeholder="如：${IPHONE_XHS_ME.ip}" autocomplete="off">
      </label>
      <label class="iphone-xhs__prof-row iphone-xhs__prof-row--bio">
        <span class="iphone-xhs__prof-label">简介</span>
        <textarea class="iphone-xhs__prof-input iphone-xhs__prof-bio" data-field="bio" maxlength="120" rows="3" placeholder="介绍一下自己"></textarea>
      </label>
      <p class="iphone-xhs__prof-foot">昵称留空时跟随酒馆当前人设名；小红书号与 IP 属地留空时用内置演示值。所有改动即时保存。</p>
    </div>
  `;

  const inputs = {
    name: view.querySelector('[data-field="name"]'),
    xhsId: view.querySelector('[data-field="xhsId"]'),
    ip: view.querySelector('[data-field="ip"]'),
    bio: view.querySelector('[data-field="bio"]'),
  };

  // 头像选择浮层（小红书款式）：点保存才写回，返回丢弃
  const avatarPicker = iphoneXhsBuildAvatarPicker(icons, {
    getCurrent: () => iphoneGetXhsProfile().avatar,
    onPick: () => {},
    commit: (avatar) => {
      iphoneUpdateXhsProfile(screen, { avatar });
      refresh();
    },
  });
  view.appendChild(avatarPicker.el);
  view.querySelector('.iphone-xhs__prof-row--avatar').addEventListener('click', () => avatarPicker.open());

  function refresh() {
    const profile = iphoneGetXhsProfile();
    iphoneRefreshXhsMeIdentity(view);
    inputs.name.value = iphoneGetXhsCustomNick() || '';
    inputs.name.placeholder = profile.name;
    inputs.xhsId.value = iphoneNormalizeXhsProfile(iphoneGetQqStorage().xhsProfile).xhsId || '';
    inputs.xhsId.placeholder = IPHONE_XHS_ME.xhsId;
    inputs.ip.value = iphoneNormalizeXhsProfile(iphoneGetQqStorage().xhsProfile).ip || '';
    inputs.ip.placeholder = IPHONE_XHS_ME.ip;
    inputs.bio.value = profile.bio;
  }

  const save = () => {
    iphoneUpdateXhsProfile(screen, {
      name: inputs.name.value.trim(),
      xhsId: inputs.xhsId.value.trim(),
      ip: inputs.ip.value.trim(),
      bio: inputs.bio.value.trim(),
    });
    iphoneLog('info', '已保存小红书资料');
    onClose?.();
  };
  view.querySelector('.iphone-xhs__prof-back').addEventListener('click', () => onClose?.());
  view.querySelector('.iphone-xhs__prof-save').addEventListener('click', save);
  for (const input of Object.values(inputs)) {
    input.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        save();
      }
    });
  }

  view._open = refresh;
  return view;
}

// ---------- 发布笔记 ----------
// 封面从内置图库挑（与生成笔记同一套素材，保证观感一致），标题 / 正文 / 话题 /
// 位置手填；发布后进「我」的公开笔记，并同步进记录楼层，AI 在后续刷新里能看到它。
function iphoneXhsBuildComposeView({ icons, screen, onClose, onPublished }) {
  const view = document.createElement('div');
  view.className = 'iphone-xhs__compose';
  view.innerHTML = `
    <header class="iphone-xhs__prof-nav">
      <button type="button" class="iphone-xhs__prof-back" aria-label="取消">${icons.close}</button>
      <p class="iphone-xhs__prof-title">发布笔记</p>
      <button type="button" class="iphone-xhs__prof-save iphone-xhs__compose-pub">发布</button>
    </header>
    <div class="iphone-xhs__compose-body">
      <div class="iphone-xhs__compose-topics-bar" data-topics></div>
      <div class="iphone-xhs__compose-covers" data-covers></div>
      <div class="iphone-xhs__compose-fields">
        <input class="iphone-xhs__compose-title" type="text" maxlength="${IPHONE_XHS_TITLE_CAP}" placeholder="填写标题会有更多赞哦～" autocomplete="off">
        <textarea class="iphone-xhs__compose-text" maxlength="${IPHONE_XHS_TEXT_CAP}" rows="6" placeholder="分享此刻的想法…"></textarea>
        <input class="iphone-xhs__compose-topics" type="text" maxlength="80" placeholder="添加话题（空格分隔，如：减脂餐 便当）" autocomplete="off">
        <input class="iphone-xhs__compose-loc" type="text" maxlength="24" placeholder="添加地点" autocomplete="off">
      </div>
      <label class="iphone-xhs__compose-private">
        <input type="checkbox">
        <span>仅自己可见</span>
        <i>${icons.lock}</i>
      </label>
      <p class="iphone-xhs__compose-foot">封面从内置图库挑选（42 张，按题材筛选），与网友笔记同一套素材；发布后可在「我」里看到，并同步进酒馆楼层的 [小红书笔记] 记录段。发布后还会调一次对话 API 让网友来评论（勾选「仅自己可见」不调）。</p>
    </div>
  `;

  // 封面选择：图库扩到 42 张后一次铺满会看花眼，加一排题材筛选（「全部」+ 图库
  // 里出现过的题材，按首次出现顺序）。筛选只影响显示，选中的那张跨题材保留。
  const coversWrap = view.querySelector('[data-covers]');
  const topicsWrap = view.querySelector('[data-topics]');
  let coverId = IPHONE_XHS_COVERS[0].id;
  const coverTopics = [];
  for (const cover of IPHONE_XHS_COVERS) {
    if (!coverTopics.includes(cover.topic)) coverTopics.push(cover.topic);
  }

  const coverButtons = IPHONE_XHS_COVERS.map((cover) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `iphone-xhs__compose-cover ${iphoneXhsCoverClass(cover)}${cover.id === coverId ? ' is-active' : ''}`;
    btn.dataset.coverId = cover.id;
    btn.dataset.coverTopic = cover.topic;
    btn.setAttribute('aria-label', `封面 ${iphoneXhsCoverTopicLabel(cover)}`);
    btn.addEventListener('click', () => {
      coverId = cover.id;
      for (const el of coverButtons) el.classList.toggle('is-active', el.dataset.coverId === coverId);
    });
    return btn;
  });

  const applyTopicFilter = (topic) => {
    for (const btn of coverButtons) {
      btn.hidden = Boolean(topic) && btn.dataset.coverTopic !== topic;
    }
  };

  for (const topic of ['全部', ...coverTopics]) {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = `iphone-xhs__compose-topics-chip${topic === '全部' ? ' is-active' : ''}`;
    chip.textContent = IPHONE_XHS_COVER_TOPIC_LABEL[topic] || topic;
    chip.dataset.topic = topic;
    chip.addEventListener('click', () => {
      topicsWrap.querySelectorAll('.iphone-xhs__compose-topics-chip').forEach((el) => {
        el.classList.toggle('is-active', el === chip);
      });
      applyTopicFilter(topic === '全部' ? '' : topic);
    });
    topicsWrap.appendChild(chip);
  }
  for (const btn of coverButtons) coversWrap.appendChild(btn);

  const titleInput = view.querySelector('.iphone-xhs__compose-title');
  const textInput = view.querySelector('.iphone-xhs__compose-text');
  const topicInput = view.querySelector('.iphone-xhs__compose-topics');
  const locInput = view.querySelector('.iphone-xhs__compose-loc');
  const privateBox = view.querySelector('.iphone-xhs__compose-private input');
  const pubBtn = view.querySelector('.iphone-xhs__compose-pub');
  const errRow = document.createElement('p');
  errRow.className = 'iphone-xhs__note-err';
  errRow.hidden = true;
  view.querySelector('.iphone-xhs__compose-body').appendChild(errRow);

  function refreshSend() {
    pubBtn.classList.toggle('is-active', Boolean(titleInput.value.trim() || textInput.value.trim()));
  }
  titleInput.addEventListener('input', refreshSend);
  textInput.addEventListener('input', refreshSend);

  // 玩家自己发的笔记也调一次 API（v0.33.0）：发布后让网友来评论区应声。
  // 不等 API：笔记先落地、发布页立即关掉（发布本身是本机操作，不该卡在网络上），
  // 评论生成完再补进评论区，成功 / 失败各浮一条轻提示。勾选「仅自己可见」时不调
  // ——私密笔记网友看不到，评论区自然是空的。
  const requestNetizenComments = async (note) => {
    screen.dispatchEvent(new CustomEvent('iphone-xhs-toast', { detail: '已发布，网友评论生成中…' }));
    try {
      const created = await iphoneGenerateXhsComments(note, screen, { published: true });
      const fresh = iphoneGetXhsData();
      const target = fresh.notes.find((n) => n.id === note.id);
      // 等 API 期间笔记被删掉了（「不喜欢」）：什么也不做，评论随笔记一起没了
      if (!target) return;
      target.comments = [...target.comments, ...created].slice(-40);
      iphoneSetXhsData(screen, fresh);
      void iphoneSyncXhsNotesFloor();
      screen.dispatchEvent(new CustomEvent('iphone-xhs-toast', { detail: `网友评论已生成（${created.length} 条）` }));
    } catch (error) {
      iphoneLog('warn', '小红书发帖后生成网友评论失败', error);
      screen.dispatchEvent(new CustomEvent('iphone-xhs-toast', { detail: `网友评论生成失败：${String(error?.message || error)}` }));
    }
  };

  const publish = () => {
    const title = titleInput.value.trim();
    const text = textInput.value.trim();
    if (!title && !text) {
      errRow.hidden = false;
      errRow.textContent = '标题或正文至少写一样。';
      return;
    }
    const profile = iphoneGetXhsProfile();
    const data = iphoneGetXhsData();
    const note = iphoneNormalizeXhsNote({
      id: iphoneXhsGenId('n'),
      authorId: '__me__',
      ts: Date.now(),
      coverId,
      title,
      text,
      topics: iphoneXhsTopicList(topicInput.value),
      location: locInput.value.trim() || profile.ip,
      ip: profile.ip,
      likes: 0,
      collects: 0,
      comments: [],
      private: Boolean(privateBox.checked),
    });
    data.notes.push(note);
    iphoneSetXhsData(screen, data);
    void iphoneSyncXhsNotesFloor();
    iphoneLog('info', '已发布一篇小红书笔记');
    titleInput.value = '';
    textInput.value = '';
    topicInput.value = '';
    locInput.value = '';
    privateBox.checked = false;
    refreshSend();
    errRow.hidden = true;
    onPublished?.();
    onClose?.();
    if (!note.private) void requestNetizenComments(note);
  };
  pubBtn.addEventListener('click', publish);
  view.querySelector('.iphone-xhs__prof-back').addEventListener('click', () => onClose?.());

  view._open = () => {
    const profile = iphoneGetXhsProfile();
    locInput.value = profile.ip;
    titleInput.value = '';
    textInput.value = '';
    topicInput.value = '';
    privateBox.checked = false;
    errRow.hidden = true;
    refreshSend();
  };
  return view;
}

// ---------- 消息聚合子页 ----------
// 点「赞和收藏 / 新增关注 / 评论和@」进入的列表页：与消息页同一份派生数据，
// 按类型过滤后逐条列出，点条目跳到对应笔记。
function iphoneXhsBuildInboxView({ icons, onClose, onOpenNote }) {
  const view = document.createElement('div');
  view.className = 'iphone-xhs__inbox';
  view.innerHTML = `
    <header class="iphone-xhs__prof-nav">
      <button type="button" class="iphone-xhs__prof-back" aria-label="返回">${icons.back}</button>
      <p class="iphone-xhs__prof-title" data-inbox-title></p>
    </header>
    <div class="iphone-xhs__inbox-list"></div>
  `;
  const titleEl = view.querySelector('[data-inbox-title]');
  const listEl = view.querySelector('.iphone-xhs__inbox-list');

  view._open = (type, label) => {
    titleEl.textContent = label || '消息';
    const data = iphoneGetXhsData();
    const inbox = iphoneXhsCollectNotifications(data);
    const items = inbox[type] || [];
    listEl.innerHTML = '';
    if (!items.length) {
      const empty = document.createElement('div');
      empty.className = 'iphone-xhs__empty';
      empty.textContent = '暂无这类消息';
      listEl.appendChild(empty);
      return;
    }
    for (const item of items) {
      const row = document.createElement('div');
      row.className = 'iphone-xhs__msg-row';
      row.appendChild(iphoneXhsBuildNetizenAvatar(data, item.name));
      const body = document.createElement('div');
      body.className = 'iphone-xhs__msg-body';
      const name = document.createElement('p');
      name.className = 'iphone-xhs__msg-name';
      name.textContent = item.name;
      const text = document.createElement('p');
      text.className = 'iphone-xhs__msg-text';
      text.textContent = item.text;
      body.append(name, text);
      row.appendChild(body);
      const time = document.createElement('span');
      time.className = 'iphone-xhs__msg-time';
      time.textContent = item.ts ? iphoneXhsTimeLabel(item.ts) : '';
      row.appendChild(time);
      if (item.noteId) {
        row.addEventListener('click', () => {
          const fresh = iphoneGetXhsData();
          const note = fresh.notes.find((n) => n.id === item.noteId);
          if (note) onOpenNote(note);
        });
      }
      listEl.appendChild(row);
    }
  };
  view.querySelector('.iphone-xhs__prof-back').addEventListener('click', () => onClose?.());
  return view;
}

// ---------- 应用主界面 ----------
// 骨架与微信同构：listView（头部 + 内容面板 + 标签栏）在下，笔记详情 / 编辑资料 /
// 发布 / 消息子页都是压在它上面的覆盖层。头部随 Tab 变形：首页是顶部频道
//（关注 / 发现 + 城市 + 搜索 + 题材横滑条），市集与消息是居中标题，「我」没有
// 头部（个人主页自带深色头图，从状态栏下铺下来）。
function buildXhsAppScreen() {
  const icons = iphoneXhsIcons();
  const screen = document.createElement('div');
  screen.className = 'iphone-app iphone-xhs';

  const listView = document.createElement('div');
  listView.className = 'iphone-xhs__listview';

  const header = document.createElement('header');
  header.className = 'iphone-xhs__header';

  const sheet = document.createElement('section');
  sheet.className = 'iphone-xhs__sheet';

  const noteView = iphoneXhsBuildNoteView({
    icons,
    screen,
    onClose: () => {
      noteView.classList.remove('is-open');
      setOverlay(false);
    },
    onChanged: () => screen._renderXhs?.(),
  });

  const openNote = (note) => {
    if (!note) return;
    noteView._open(note);
    noteView.classList.add('is-open');
    setOverlay(true);
  };

  const setOverlay = (open) => {
    screen.classList.toggle('is-xhs-overlay', Boolean(open));
  };

  // 小红书里的轻提示（发布后的网友评论进度等）：屏幕内浮一条，2 秒后消失
  const toast = document.createElement('p');
  toast.className = 'iphone-xhs__toast';
  let toastTimer = 0;
  screen.addEventListener('iphone-xhs-toast', (event) => {
    toast.textContent = String(event.detail || '');
    toast.classList.add('is-show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-show'), 2400);
  });

  const pageHome = iphoneXhsBuildHomePage({ icons, onOpenNote: openNote, screen });
  const pageMarket = iphoneXhsBuildMarketPage(icons);
  const pageMessages = iphoneXhsBuildMessagesPage({
    icons,
    onOpenNote: openNote,
    onOpenInbox: (type, label) => {
      // 点进去即算看过：三条聚合入口各自的红点、底栏「消息」的数字气泡、
      // 首页头像上的「更新」角标都跟着重算（三个都看过 → 底栏红点消失）
      iphoneXhsMarkInboxRead(type);
      renderHeaderBadges();
      inboxView._open(type, label);
      inboxView.classList.add('is-open');
      setOverlay(true);
    },
  });
  const pageMe = iphoneXhsBuildMePage({
    icons,
    onOpenNote: openNote,
    onEditProfile: () => {
      profileView._open();
      profileView.classList.add('is-open');
      setOverlay(true);
    },
  });

  const inboxView = iphoneXhsBuildInboxView({
    icons,
    onClose: () => {
      inboxView.classList.remove('is-open');
      setOverlay(false);
    },
    onOpenNote: openNote,
  });
  const profileView = iphoneXhsBuildProfileView({
    icons,
    screen,
    onClose: () => {
      profileView.classList.remove('is-open');
      setOverlay(false);
    },
  });
  const composeView = iphoneXhsBuildComposeView({
    icons,
    screen,
    onClose: () => {
      composeView.classList.remove('is-open');
      setOverlay(false);
    },
    onPublished: () => {
      switchXhsTab(3);
      pageMe._render();
    },
  });

  sheet.appendChild(pageHome);
  sheet.appendChild(pageMarket);
  sheet.appendChild(pageMessages);
  sheet.appendChild(pageMe);

  // 顶部频道条：关注 / 发现（点关注只显示已关注的博主）+ 城市 + 搜索 + 题材横滑条
  function renderHeader(mode) {
    if (header._mode === mode) return;
    header._mode = mode;
    header._lastMode = mode;
    if (mode === 'home') {
      // 顶栏左侧那一格（真机 = 「关注」所在的定位点）有两种形态，互斥：
      //   发现流 + 有未读互动 → 我的圆头像，右上角压一枚红色「更新」气泡
      //   其余情况           → 灰字「关注」（切到关注流时变深并带下划线）
      // 三种元素（关注槽 / 发现 / 城市）在真机上是等距平铺的，发现正好落在屏幕
      // 中线上，所以整行用等宽三格平分；搜索绝对定位钉在最右。
      const data = iphoneGetXhsData();
      const unread = iphoneXhsUnreadTotal(data);
      const homeTab = header._homeTab || 'discover';
      const showAvatar = unread > 0 && homeTab === 'discover';
      header.innerHTML = `
        <div class="iphone-xhs__hdrow">
          <button type="button" class="iphone-xhs__hdnote" aria-label="通知">${icons.message}</button>
          <div class="iphone-xhs__hdtabs">
            <span class="iphone-xhs__hdcell">
              ${showAvatar
                ? `<button type="button" class="iphone-xhs__hdme" data-htab="follow" aria-label="关注更新"><i>更新</i></button>`
                : `<button type="button" class="iphone-xhs__hdtab${homeTab === 'follow' ? ' is-active' : ''}" data-htab="follow">关注${
                  unread ? `<i class="iphone-xhs__hdtab-num">${unread > 99 ? '99+' : unread}</i>` : ''
                }</button>`}
            </span>
            <span class="iphone-xhs__hdcell">
              <button type="button" class="iphone-xhs__hdtab${homeTab === 'discover' ? ' is-active' : ''}" data-htab="discover">发现</button>
            </span>
            <span class="iphone-xhs__hdcell">
              <button type="button" class="iphone-xhs__hdcity" data-xhs-city>${IPHONE_XHS_CITY_DEFAULT}</button>
            </span>
          </div>
          <button type="button" class="iphone-xhs__hdsearch" aria-label="搜索">${icons.search}</button>
        </div>
      `;
      // 头像即「我」的个人入口：气泡是 <i>，头像作为按钮首个子元素插进去
      const hdMe = header.querySelector('.iphone-xhs__hdme');
      if (hdMe) {
        const avatarEl = iphoneXhsBuildMeAvatar(iphoneGetXhsProfile());
        avatarEl.classList.add('iphone-xhs__hdme-img');
        hdMe.insertBefore(avatarEl, hdMe.firstChild);
      }
      header.querySelectorAll('[data-htab]').forEach((btn) => {
        btn.addEventListener('click', () => {
          header._homeTab = btn.dataset.htab;
          // 关注 / 发现切换会改变本槽位的形态（头像 ↔ 文字），必须强制重渲染
          header._mode = null;
          renderHeader('home');
          pageHome._setFollowTab(btn.dataset.htab === 'follow');
          pageHome._setTab(btn.dataset.htab === 'follow' ? 'follow' : 'discover');
        });
      });
      return;
    }
    if (mode === 'messages') {
      header.innerHTML = `
        <div class="iphone-xhs__hdmsg">
          <p class="iphone-xhs__hdtitle">消息</p>
          <button type="button" class="iphone-xhs__hdmsgbtn" aria-label="搜索">${icons.search}</button>
          <button type="button" class="iphone-xhs__hdmsgbtn" aria-label="新建消息">${icons.plusCircle}</button>
        </div>
      `;
      return;
    }
    header.innerHTML = `<p class="iphone-xhs__hdtitle">${mode === 'market' ? '市集' : '消息'}</p>`;
  }

  // 未读数变了（点开某条聚合入口看过、或新通知进来）就重算三处红点：
  // 首页头像的「更新」角标 / 关注槽的数字气泡 / 底栏「消息」的数字气泡。
  // 头部的渲染带 _mode 缓存，得先清掉才会真重画。
  function renderHeaderBadges() {
    pageMessages._render();
    header._mode = null;
    renderHeader(header._lastMode || 'home');
    refreshMsgBadge();
  }

  // 底部标签栏：真机是纯文字标签（首页 / 市集 / ＋ / 消息 / 我），中间是红色圆角
  // 方块加号；「消息」有未读时右上角挂一个红色数字气泡。气泡可增可减（点开某条
  // 聚合入口就少一批），所以不进 innerHTML、由 refreshMsgBadge 单独维护。
  const tabs = [
    { key: 'home', label: '首页', page: pageHome, head: 'home' },
    { key: 'market', label: '市集', page: pageMarket, head: 'market' },
    { key: 'compose', label: '', icon: icons.plus, page: null, head: '' },
    { key: 'messages', label: '消息', page: pageMessages, head: 'messages' },
    { key: 'me', label: '我', page: pageMe, head: 'me' },
  ];
  const tabbar = document.createElement('nav');
  tabbar.className = 'iphone-xhs__tabbar';
  const tabButtons = [];
  let msgTabEl = null;
  tabs.forEach((tab, i) => {
    const el = document.createElement('button');
    el.type = 'button';
    el.className = `iphone-xhs__tab${tab.key === 'compose' ? ' iphone-xhs__tab--compose' : ''}${i === 0 ? ' is-active' : ''}`;
    el.innerHTML = tab.key === 'compose'
      ? `<span class="iphone-xhs__tab-plus" aria-hidden="true">${tab.icon}</span>`
      : `<span class="iphone-xhs__tab-label">${tab.label}</span>`;
    if (tab.key === 'messages') msgTabEl = el;
    el.addEventListener('click', () => {
      if (tab.key === 'compose') {
        composeView._open();
        composeView.classList.add('is-open');
        setOverlay(true);
        return;
      }
      tabButtons.forEach((b) => b.classList.remove('is-active'));
      el.classList.add('is-active');
      tabs.forEach((t) => t.page?.classList.toggle('is-hidden', t.page !== tab.page));
      renderHeader(tab.head);
      header.classList.toggle('is-hidden', tab.head === 'me');
      // 「我」是深色头图，状态栏文字要翻白（.iphone-screen:has(.is-me-active)）
      screen.classList.toggle('is-me-active', tab.head === 'me');
      tab.page?._render?.();
    });
    tabButtons.push(el);
    tabbar.appendChild(el);
  });

  // 「消息」数字气泡：未读为 0 就整个摘掉（三类都点进去看过之后，底栏红点跟着消失）
  function refreshMsgBadge() {
    if (!msgTabEl) return;
    const unread = iphoneXhsUnreadTotal(iphoneGetXhsData());
    let badge = msgTabEl.querySelector('.iphone-xhs__tab-badge');
    if (!unread) {
      badge?.remove();
      return;
    }
    if (!badge) {
      badge = document.createElement('span');
      badge.className = 'iphone-xhs__tab-badge';
      msgTabEl.appendChild(badge);
    }
    badge.textContent = unread > 99 ? '99+' : String(unread);
  }

  function switchXhsTab(index) {
    if (tabButtons[index]) tabButtons[index].click();
  }

  listView.appendChild(header);
  listView.appendChild(sheet);
  listView.appendChild(tabbar);

  screen.appendChild(listView);
  screen.appendChild(noteView);
  screen.appendChild(inboxView);
  screen.appendChild(profileView);
  screen.appendChild(composeView);
  screen.appendChild(toast);

  screen._renderXhs = () => {
    pageHome._render();
    pageMe._render();
    noteView._render();
    // 消息页与三处红点都随数据（含未读态）走，一并在这里刷新
    renderHeaderBadges();
  };
  // 给本地测试台（test.html）的深链用：切 Tab / 打开第 N 篇笔记 / 各覆盖层
  screen._switchXhsTab = switchXhsTab;
  screen._openXhsNote = (index) => {
    const data = iphoneGetXhsData();
    const list = data.notes.filter((n) => !n.private).slice(-60).reverse();
    const note = list[Number(index) - 1];
    if (note) openNote(note);
    return Boolean(note);
  };
  screen._openXhsProfile = () => {
    profileView._open();
    profileView.classList.add('is-open');
    setOverlay(true);
  };
  screen._openXhsCompose = () => {
    composeView._open();
    composeView.classList.add('is-open');
    setOverlay(true);
  };
  screen._openXhsInbox = (type) => {
    const entry = IPHONE_XHS_MSG_ENTRIES.find((e) => e.id === type) || IPHONE_XHS_MSG_ENTRIES[0];
    // 与真点一次聚合入口同一条路径：看过了 → 该入口红点清掉
    iphoneXhsMarkInboxRead(entry.id);
    renderHeaderBadges();
    inboxView._open(entry.id, entry.label);
    inboxView.classList.add('is-open');
    setOverlay(true);
  };

  renderHeader('home');
  pageHome._render();
  refreshMsgBadge();
  pageMessages._render();
  pageMe._render();
  iphoneRefreshXhsMeIdentity(screen);
  return screen;
}
