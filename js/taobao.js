// ===== 淘宝应用（v0.28.0） =====
// 与小红书同一套范式：首页起步是空的，下拉刷新调一次对话 API 生成「猜你喜欢」的
// 商品入口；搜索框里输入关键词也调 API 生成相关商品。点商品进详情页，详情页可以
// 「立即购买」——付款走本插件微信的「零钱」余额（wechat.js 的
// iphoneChangeWechatBalance），这是与另外几个应用最不一样的地方：淘宝会花钱，
// 余额不足就买不成。购物车 / 我的订单 / 待收货等页面都落在同一份数据上。
//
// 商品没有图片：展示卡是「品类渐变底色 + 品类词 + 标签」的文字图块，标题 / 价格 /
// 销量 / 店铺 / 评价全走文字。模型只报品类（IPHONE_TAOBAO_CATEGORIES），插件按
// 品类挑底色，同一个商品每次渲染都是同一块颜色。
//
// 数据独立：chatMetadata.IPhone 的 taobaoData（与 qqData / wechatData / xhsData
// 并列），换聊天自动切换。楼层段头 `淘宝订单：`（段标签 [淘宝订单]），只同步订单
// （商品列表是浏览行为，不必进楼层）。
// 复用已建好的基础设施：host.js 的上下文 / 存储 / 对话 API / 楼层读写、
// wechat.js 的钱包（余额读写与金额格式化）、apps.js 的世界书与宏解析。

// ---------- 淘宝图形（手绘 SVG，24×24 viewBox） ----------
function iphoneTaobaoIcons() {
  return {
    // 底部标签栏：首页（淘，实心圆底）/ 分类（宫格）/ 消息 / 购物车 / 我的淘宝
    home: '<svg viewBox="0 0 24 24" aria-hidden="true"><text x="12" y="17.4" text-anchor="middle" font-size="14.5" font-family="PingFang SC,Hiragino Sans GB,Microsoft YaHei,sans-serif" font-weight="700" fill="currentColor">淘</text></svg>',
    category: '<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><rect x="3.6" y="3.6" width="7" height="7" rx="1.8"/><rect x="13.4" y="3.6" width="7" height="7" rx="1.8"/><rect x="3.6" y="13.4" width="7" height="7" rx="1.8"/><rect x="13.4" y="13.4" width="7" height="7" rx="1.8"/></g></svg>',
    message: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4.2c-4.6 0-8.2 2.9-8.2 6.6 0 2.2 1.2 4.1 3.1 5.3l-.7 3.2c-.1.5.4.9.8.6l3.5-1.9c.5.1 1 .1 1.5.1 4.6 0 8.2-2.9 8.2-6.9s-3.6-7-8.2-7z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
    cart: '<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2.8 3.6h2.9l2.2 10.6h9.9l2.4-7.4H6.4"/><circle cx="9.4" cy="19.4" r="1.5"/><circle cx="17" cy="19.4" r="1.5"/></g></svg>',
    me: '<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="8" r="3.9"/><path d="M4.4 20.2c0-3.9 3.4-6.2 7.6-6.2s7.6 2.3 7.6 6.2"/></g></svg>',
    // 通用：搜索 / 扫码 / 相机 / 返回 / 右箭头 / 更多 / 关闭 / 加减 / 对勾 / 分享
    search: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="5.6" fill="none" stroke="currentColor" stroke-width="1.9"/><path d="M15.1 15.1l4.2 4.2" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/></svg>',
    scan: '<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3.6 8.6V5.4a1.8 1.8 0 0 1 1.8-1.8h3.2M15.4 3.6h3.2a1.8 1.8 0 0 1 1.8 1.8v3.2M20.4 15.4v3.2a1.8 1.8 0 0 1-1.8 1.8h-3.2M8.6 20.4H5.4a1.8 1.8 0 0 1-1.8-1.8v-3.2"/><path d="M3.6 12h16.8"/></g></svg>',
    camera: '<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M8.7 6.8 10 4.6h4l1.3 2.2"/><rect x="3.4" y="6.8" width="17.2" height="13" rx="3"/><circle cx="12" cy="13" r="3.3"/></g></svg>',
    back: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 4.6 7.6 12l7.4 7.4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    chevronRight: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9.5 5.5 6.5 6.5-6.5 6.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    chevronDown: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5.5 9.5 6.5 6.5 6.5-6.5" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    more: '<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="currentColor"><circle cx="5.2" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="18.8" cy="12" r="1.6"/></g></svg>',
    close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/></svg>',
    minus: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5.4 12h13.2" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/></svg>',
    plus: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5.4v13.2M5.4 12h13.2" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/></svg>',
    check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12.6 4.6 4.4L19 7.4" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    share: '<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3.6v11.2"/><path d="m8.2 7.2 3.8-3.6 3.8 3.6"/><path d="M5.4 13.4v5.4a1.8 1.8 0 0 0 1.8 1.8h9.6a1.8 1.8 0 0 0 1.8-1.8v-5.4"/></g></svg>',
    // 服务行：店铺 / 客服 / 收藏 / 足迹 / 退款 / 物流 / 待付款 / 待收货 / 评价 / 红包
    shop: '<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><path d="M3.8 9.4 5.4 4.6h13.2l1.6 4.8"/><path d="M4.8 9.4v9.2a1 1 0 0 0 1 1h12.4a1 1 0 0 0 1-1V9.4"/><path d="M9.6 19.6v-5.4h4.8v5.4"/></g></svg>',
    service: '<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4.6 14.6v-3a7.4 7.4 0 0 1 14.8 0v3"/><rect x="2.8" y="12.6" width="3.6" height="5.6" rx="1.6"/><rect x="17.6" y="12.6" width="3.6" height="5.6" rx="1.6"/><path d="M19.4 18.2v.8a2.4 2.4 0 0 1-2.4 2.4h-2.6"/></g></svg>',
    star: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4.2l2.35 4.76 5.25.77-3.8 3.7.9 5.23L12 16.2l-4.7 2.46.9-5.23-3.8-3.7 5.25-.77z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
    history: '<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3.8 12a8.2 8.2 0 1 0 2.4-5.8"/><path d="M3.6 4.6v3.6h3.6"/><path d="M12 7.8V12l3 1.8"/></g></svg>',
    refund: '<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3.8 12a8.2 8.2 0 1 0 2.4-5.8"/><path d="M3.6 4.6v3.6h3.6"/><path d="m9.4 12.2 1.9 1.9 3.5-3.7"/></g></svg>',
    truck: '<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M2.8 6.4h10.4v9.2H2.8z"/><path d="M13.2 9.2h3.6l3 3.2v3.2h-6.6z"/><circle cx="6.6" cy="18" r="1.7"/><circle cx="16.4" cy="18" r="1.7"/></g></svg>',
    wallet: '<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><path d="M4 7.6a2.6 2.6 0 0 1 2.6-2.6h9.8a1.6 1.6 0 0 1 1.6 1.6v1.4"/><rect x="3.6" y="7.4" width="16.8" height="12.2" rx="2.6"/><path d="M15.4 13.5h1.6"/></g></svg>',
    // 空态：购物袋
    bag: '<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><path d="M4.6 8h14.8l-1.2 11.2a1.8 1.8 0 0 1-1.8 1.6H7.6a1.8 1.8 0 0 1-1.8-1.6z"/><path d="M8.6 10.4V6.6a3.4 3.4 0 0 1 6.8 0v3.8"/></g></svg>',
  };
}

// ---------- 淘宝数据（商品 / 购物车 / 订单 / 搜索历史） ----------
const IPHONE_TAOBAO_USER_MACRO = IPHONE_QQ_USER_MACRO;

function iphoneTaobaoGenId(prefix) {
  return `${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

// 金额：非负数、按分归一、超上限收住（与微信钱包同一套口径，保证「价格」与
// 「扣款」在两个应用里是同一个数）。
function iphoneTaobaoMoney(value, fallback) {
  const num = Number(value);
  if (!Number.isFinite(num) || num < 0) return fallback;
  return Math.round(Number((Math.min(num, IPHONE_TAOBAO_PRICE_CAP) * 100).toPrecision(12))) / 100;
}

// 从模型写的金额文本里抠出数字：容错「¥3489」「3,489」「3489 元」「3489起」
// 这些写法（格式要求是纯数字，但模型经常多写货币符号与单位）。
function iphoneTaobaoParseAmount(value) {
  if (typeof value === 'number') return value;
  const text = String(value ?? '')
    .replace(/[,，\s]/g, '')
    .replace(/^[¥￥$]/, '')
    .replace(/(元|人民币|块)(起)?$/, '');
  const matched = text.match(/-?\d+(?:\.\d+)?/);
  return matched ? Number(matched[0]) : NaN;
}

// 金额显示：淘宝的价格样式——整数不带小数（3489），有零头才保留两位（9.9 → 9.9、
// 92.65 → 92.65），大额带千分位（10199 → 10,199）。
function iphoneTaobaoPriceText(value) {
  const num = iphoneTaobaoMoney(value, 0);
  const fixed = num.toFixed(2);
  const [intPart, decPart] = fixed.split('.');
  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  if (decPart === '00') return grouped;
  if (decPart.endsWith('0')) return `${grouped}.${decPart[0]}`;
  return `${grouped}.${decPart}`;
}

// 品类归一：模型写的品类词可能是大类（数码）也可能是具体东西（耳机），统一映射到
// IPHONE_TAOBAO_CATEGORIES 的某一项——找不到就按标题 / 卖点里的关键词再猜一次，
// 都猜不到落兜底品类（卡片仍是同一套版式，只是底色走 default）。
function iphoneTaobaoFindCategory(value) {
  const text = String(value || '').trim();
  if (!text) return null;
  const exact = IPHONE_TAOBAO_CATEGORIES.find((c) => c.label === text);
  if (exact) return exact;
  const lower = text.toLowerCase();
  for (const category of IPHONE_TAOBAO_CATEGORIES) {
    if (category.keys.some((key) => lower.includes(key.toLowerCase()))) return category;
  }
  return null;
}

// 商品品类：先看显式品类，再拿标题 + 卖点猜（生成时模型漏写「品类：」也救得回来）。
function iphoneTaobaoCategoryOf(product) {
  return iphoneTaobaoFindCategory(product?.category)
    || iphoneTaobaoFindCategory(`${product?.title || ''}${product?.selling || ''}`)
    || null;
}

function iphoneTaobaoCategoryLabel(product) {
  return iphoneTaobaoCategoryOf(product)?.label || IPHONE_TAOBAO_CATEGORY_FALLBACK;
}

// 品类展示样式类：.iphone-tb__thumb--<id>（未命中走 --default）。
function iphoneTaobaoCategoryClass(product) {
  const category = iphoneTaobaoCategoryOf(product);
  return `iphone-tb__thumb--${category ? category.id : 'default'}`;
}

// 标签：模型用「、」分隔（逗号也认），去重、限 4 个。
function iphoneTaobaoTagList(raw) {
  const text = Array.isArray(raw) ? raw.join('、') : String(raw ?? '');
  const tags = [];
  for (const part of text.split(/[、,，/｜|]+/)) {
    const tag = part.trim().replace(/^#/, '');
    if (!tag || tag.length > 12) continue;
    if (!tags.includes(tag)) tags.push(tag);
    if (tags.length >= 4) break;
  }
  return tags;
}

// 评价：{ name, text }，名字是「t**8」这类买家昵称。
function iphoneNormalizeTaobaoReview(raw) {
  if (!raw || typeof raw !== 'object') return null;
  const name = String(raw.name || '').replace(/[\r\n]+/g, ' ').trim().slice(0, 24);
  const text = String(raw.text || '').replace(/[\r\n]+/g, ' ').trim().slice(0, IPHONE_TAOBAO_REVIEW_CAP);
  if (!name || !text) return null;
  return { name, text };
}

// 商品：模型生成的内容与玩家浏览行为（收藏）都落在这里。价格必填（没有价格的
// 商品卡片没法看），其余字段缺了就不显示。
function iphoneNormalizeTaobaoProduct(raw) {
  const source = raw && typeof raw === 'object' ? raw : {};
  const title = String(source.title || '').replace(/[\r\n]+/g, ' ').trim().slice(0, IPHONE_TAOBAO_TITLE_CAP);
  if (!title) return null;
  const price = iphoneTaobaoMoney(iphoneTaobaoParseAmount(source.price), NaN);
  if (!Number.isFinite(price)) return null;
  const original = iphoneTaobaoMoney(iphoneTaobaoParseAmount(source.original), NaN);
  // 划线价必须高于现价，否则不显示（模型偶尔把两个写反或写成同一个数）
  const hasOriginal = Number.isFinite(original) && original > price;
  const category = iphoneTaobaoCategoryOf(source)?.label || '';
  return {
    id: String(source.id || '').trim() || iphoneTaobaoGenId('p'),
    title,
    category,
    selling: String(source.selling || '').replace(/[\r\n]+/g, ' ').trim().slice(0, IPHONE_TAOBAO_SELLING_CAP),
    price,
    original: hasOriginal ? original : 0,
    sales: String(source.sales || '').replace(/[\r\n]+/g, ' ').trim().slice(0, 24),
    shop: String(source.shop || '').replace(/[\r\n]+/g, ' ').trim().slice(0, IPHONE_TAOBAO_SHOP_CAP),
    city: String(source.city || '').replace(/[\r\n]+/g, ' ').trim().slice(0, 16),
    tags: iphoneTaobaoTagList(source.tags),
    coupon: String(source.coupon || '').replace(/[\r\n]+/g, ' ').trim().slice(0, 40),
    installment: String(source.installment || '').replace(/[\r\n]+/g, ' ').trim().slice(0, 40),
    detail: String(source.detail || '').replace(/[\r\n]+/g, ' ').trim().slice(0, IPHONE_TAOBAO_DETAIL_CAP),
    reviews: (Array.isArray(source.reviews) ? source.reviews : [])
      .map(iphoneNormalizeTaobaoReview)
      .filter(Boolean)
      .slice(0, IPHONE_TAOBAO_REVIEW_MAX),
    keyword: String(source.keyword || '').trim().slice(0, 30),
    ts: Math.max(0, Math.floor(Number(source.ts) || Date.now())),
    starMine: Boolean(source.starMine),
  };
}

// 购物车条目：同一件商品只有一条，数量累加（与真实购物车一致）。
function iphoneNormalizeTaobaoCartItem(raw) {
  const source = raw && typeof raw === 'object' ? raw : {};
  const product = iphoneNormalizeTaobaoProduct(source.product);
  if (!product) return null;
  const qty = Math.max(1, Math.min(99, Math.floor(Number(source.qty) || 1)));
  return { id: String(source.id || '').trim() || iphoneTaobaoGenId('c'), product, qty };
}

// 订单：下单时把商品快照一份（商品之后被刷新掉也不影响订单）。
function iphoneNormalizeTaobaoOrder(raw) {
  const source = raw && typeof raw === 'object' ? raw : {};
  const product = iphoneNormalizeTaobaoProduct(source.product);
  if (!product) return null;
  const qty = Math.max(1, Math.min(99, Math.floor(Number(source.qty) || 1)));
  const total = iphoneTaobaoMoney(source.total, NaN);
  const status = ['paid', 'shipped', 'done'].includes(source.status) ? source.status : 'paid';
  return {
    id: String(source.id || '').trim() || iphoneTaobaoGenId('o'),
    no: String(source.no || '').trim() || iphoneTaobaoGenId('tb').toUpperCase().slice(0, 18),
    product,
    qty,
    total: Number.isFinite(total) ? total : iphoneTaobaoMoney(product.price * qty, 0),
    status,
    ts: Math.max(0, Math.floor(Number(source.ts) || Date.now())),
  };
}

function iphoneNormalizeTaobaoData(raw) {
  const source = raw && typeof raw === 'object' ? raw : {};
  return {
    products: (Array.isArray(source.products) ? source.products : [])
      .map(iphoneNormalizeTaobaoProduct)
      .filter(Boolean)
      .slice(-120),
    cart: (Array.isArray(source.cart) ? source.cart : [])
      .map(iphoneNormalizeTaobaoCartItem)
      .filter(Boolean)
      .slice(-40),
    orders: (Array.isArray(source.orders) ? source.orders : [])
      .map(iphoneNormalizeTaobaoOrder)
      .filter(Boolean)
      .slice(-60),
    history: [...new Set((Array.isArray(source.history) ? source.history : [])
      .map((item) => String(item || '').replace(/[\r\n]+/g, ' ').trim().slice(0, 30))
      .filter(Boolean))].slice(-IPHONE_TAOBAO_HISTORY_CAP),
  };
}

function iphoneGetTaobaoData() {
  return iphoneNormalizeTaobaoData(iphoneGetQqStorage().taobaoData);
}

function iphoneSetTaobaoData(taobaoScreen, next) {
  iphoneGetQqStorage().taobaoData = iphoneNormalizeTaobaoData(next);
  iphoneSaveQqStorage();
  if (taobaoScreen) taobaoScreen._renderTaobao?.();
}

// 购物车角标：条目数（不是件数，与真实淘宝一致）。
function iphoneTaobaoCartCount(data) {
  return (data?.cart || []).length;
}

// ---------- 淘宝提示词预设（存 settings.promptPresets.taobaoProducts） ----------
function iphoneGetTaobaoPreset() {
  const defaults = IPHONE_TAOBAO_PRESET_DEFAULT;
  const raw = iphoneGetSettings().promptPresets?.taobaoProducts || {};
  const persona = typeof raw.persona === 'string' ? raw.persona : defaults.persona;
  const worldBook = typeof raw.worldBook === 'boolean' ? raw.worldBook : defaults.worldBook;
  const latestFloor = typeof raw.latestFloor === 'boolean' ? raw.latestFloor : defaults.latestFloor;
  const npcLogic = typeof raw.npcLogic === 'string' ? raw.npcLogic : IPHONE_QQ_NPC_LOGIC;
  const dialogueGuidance = typeof raw.dialogueGuidance === 'string' ? raw.dialogueGuidance : IPHONE_QQ_DIALOGUE_GUIDANCE;
  let historyFloors = Math.round(Number(raw.historyFloors));
  if (!Number.isFinite(historyFloors)) historyFloors = defaults.historyFloors;
  historyFloors = Math.min(50, Math.max(0, historyFloors));
  const guidance = typeof raw.guidance === 'string' ? raw.guidance : defaults.guidance;
  const format = typeof raw.format === 'string' ? raw.format : defaults.format;
  return { persona, worldBook, latestFloor, historyFloors, npcLogic, dialogueGuidance, guidance, format };
}

// 生成请求的公共部分（与小红书同一套开关）：世界书 / 酒馆最近楼层 / 记录楼层。
async function iphoneTaobaoCollectContext(preset) {
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

// ---------- 商品生成（下拉刷新 / 搜索各调一次对话 API） ----------
// keyword 为空 = 首页「猜你喜欢」（贴合剧情推荐）；非空 = 搜索（严格围绕搜索词）。
// system 依次装：角色扮演指令 + 提示词结构说明 + 扮演逻辑与对白规范 + 已有商品
// 名单（避免反复推同几件）+ 世界书 + 酒馆最近楼层 + 生成指导与输出格式；user
// 下达生成指令。返回新建的商品数组（已写回数据）。
async function iphoneGenerateTaobaoProducts(taobaoScreen, keyword) {
  const settings = iphoneGetSettings();
  const data = iphoneGetTaobaoData();
  const preset = iphoneGetTaobaoPreset();
  const { worldText, tavernText, floorLogText, resolve } = await iphoneTaobaoCollectContext(preset);
  const query = String(keyword || '').trim().slice(0, 30);

  // 已推过的商品：只报标题，让模型避开重复推荐（淘宝的推荐流不该翻来覆去就这几件）。
  const recent = data.products.slice(-30);
  const seenText = recent.length
    ? recent.map((p) => `- ${p.title}`).join('\n')
    : '（暂无）';
  const wallet = iphoneGetWechatWallet();

  const persona = preset.persona.trim();
  const npcLogic = preset.npcLogic.trim();
  const dialogueGuidance = preset.dialogueGuidance.trim();
  const guidance = String(preset.guidance ?? '').trim();
  const format = String(preset.format ?? '').trim();
  const injectParts = iphoneInjectPromptParts();

  const sysParts = [];
  if (persona) sysParts.push(`<roleplay_instructions>\n${resolve(persona)}\n</roleplay_instructions>`);
  const outlineItems = [];
  if (persona) outlineItems.push('<roleplay_instructions>…</roleplay_instructions>：角色扮演指令，约束平台风格与选品取向；');
  if (npcLogic) outlineItems.push('<npc_logic>…</npc_logic>：扮演逻辑——「先是人，后是设定」，按自身立场与动机行事；');
  if (dialogueGuidance) outlineItems.push('<dialogue_guidance>…</dialogue_guidance>：表达规范——口语化、生活化、带情绪与立场，禁止播报腔；');
  outlineItems.push('<shown_products>…</shown_products>：已经推荐过的商品标题（避免重复推荐）；');
  if (query) outlineItems.push('<search_query>…</search_query>：玩家在淘宝搜索框里输入的关键词，本次商品必须围绕它；');
  if (worldText) outlineItems.push('<world_info>…</world_info>：当前场景的世界书设定，包含世界观与相关人物的资料；');
  if (injectParts) outlineItems.push(injectParts.outline);
  if (tavernText) outlineItems.push('<tavern_context>…</tavern_context>：酒馆主线的最近对话（时间旧→新），是当前正在发生的剧情背景；');
  if (floorLogText) outlineItems.push('<taobao_chat_log>…</taobao_chat_log>：最近一次同步到酒馆楼层的手机记录，可能包含多个记录段（每段各自用方括号标签包裹，如 [微信_私聊_名字] / [小红书笔记] / [淘宝订单]）；');
  outlineItems.push('<shopper_account>…</shopper_account>：玩家「{{user}}」的账户与消费能力（微信零钱余额），选品的价位要与之相称；');
  if (guidance) outlineItems.push('<taobao_guidance>…</taobao_guidance>：商品生成指导；');
  if (format) outlineItems.push('<output_format>…</output_format>：回复格式要求，位于提示词末尾，必须严格遵守；');
  sysParts.push('【提示词结构说明】本次请求的提示词由以下部分组成，均已用 XML 标签包裹并附介绍：\n'
    + outlineItems.map((item) => `- ${item}`).join('\n'));
  if (npcLogic) sysParts.push(`以下是扮演逻辑指导（决定你如何理解与演绎角色）：\n<npc_logic>\n${resolve(npcLogic)}\n</npc_logic>`);
  if (dialogueGuidance) sysParts.push(`以下是表达规范（决定你如何说话与写内容）：\n<dialogue_guidance>\n${resolve(dialogueGuidance)}\n</dialogue_guidance>`);
  sysParts.push(`以下是淘宝上已经推荐过的商品（不要再推荐这些）：\n<shown_products>\n${seenText}\n</shown_products>`);
  if (query) sysParts.push(`以下是玩家在搜索框里输入的关键词：\n<search_query>\n${query}\n</search_query>`);
  if (worldText) sysParts.push(`以下是当前场景的世界书设定（世界观与人物资料）：\n<world_info>\n${worldText}\n</world_info>`);
  if (tavernText) sysParts.push(`以下是酒馆主线的最近对话（时间旧→新），是你当前所处的剧情背景：\n<tavern_context>\n${tavernText}\n</tavern_context>`);
  if (injectParts) sysParts.push(injectParts.system);
  if (floorLogText) sysParts.push(`以下是最近一次同步到酒馆楼层的手机记录，可能包含多个记录段（每段各自用方括号标签包裹，如 [微信_私聊_名字] / [小红书笔记] / [淘宝订单]）：\n<taobao_chat_log>\n${floorLogText}\n</taobao_chat_log>`);
  const playerName = iphoneGetTavernUserName() || IPHONE_WECHAT_ME_FALLBACK_NAME;
  const accountLines = [
    `买家：${playerName}`,
    `微信零钱余额：¥${iphoneWechatMoney(wallet.balance)}`,
  ];
  if (data.orders.length) {
    // 买过什么能反映需求与消费水平：最近的几单报给模型（只报标题与价格）
    accountLines.push('最近买过：');
    for (const order of data.orders.slice(-5)) {
      accountLines.push(`- ${order.product.title}（¥${iphoneTaobaoPriceText(order.total)}）`);
    }
  }
  sysParts.push(`以下是买家的账户与消费能力（选品的价位要与之相称）：\n<shopper_account>\n${accountLines.join('\n')}\n</shopper_account>`);
  if (guidance) sysParts.push(`以下是淘宝商品的生成指导：\n<taobao_guidance>\n${resolve(guidance)}\n</taobao_guidance>`);
  if (format) sysParts.push(`以下是回复格式要求，必须严格遵守：\n<output_format>\n${resolve(format)}\n</output_format>`);

  const userContent = query
    ? `请根据以上信息，为淘宝生成与搜索词「${query}」相关的商品（1~6 个）。当前时间：${new Date().toLocaleString('zh-CN', { hour12: false })}。`
    : `请根据以上信息，为淘宝首页生成新的推荐商品（1~6 个）。当前时间：${new Date().toLocaleString('zh-CN', { hour12: false })}。`;
  const reply = await iphoneRequestChatCompletion(settings, [
    { role: 'system', content: sysParts.join('\n\n') },
    { role: 'user', content: userContent },
  ]);

  const parsed = iphoneParseTaobaoProductsReply(reply);
  if (!parsed.length) {
    throw new Error('AI 没有返回有效商品（需要「标题：」开头的商品区块，含价格）。');
  }
  const now = Date.now();
  const fresh = iphoneGetTaobaoData();
  const created = [];
  for (const item of parsed.slice(0, IPHONE_TAOBAO_REFRESH_MAX_PRODUCTS)) {
    const product = iphoneNormalizeTaobaoProduct({ ...item, keyword: query, ts: now });
    if (!product) continue;
    fresh.products.push(product);
    created.push(product);
  }
  if (!created.length) {
    throw new Error('AI 没有返回有效商品（标题或价格为空）。');
  }
  if (query) {
    // 搜索历史：搜过的词进历史（最近优先、去重），搜索页的空态与历史区都要用
    fresh.history = [...fresh.history.filter((item) => item !== query), query].slice(-IPHONE_TAOBAO_HISTORY_CAP);
  }
  iphoneSetTaobaoData(taobaoScreen, fresh);
  iphoneLog('info', `淘宝生成成功：${query ? `搜索「${query}」` : '首页推荐'} → ${created.length} 个商品`);
  return created;
}

// ---------- 商品区块解析 ----------
// 把模型回复按「商品区块」拆成 { category, title, selling, price, original, sales,
// shop, city, tags, coupon, installment, detail, reviews }。对格式抖动做容错：容忍
// 代码围栏、行首序号与列表符号、字段名的同义写法（现价 / 售价 / 价格、划线价 /
// 原价、已售 / 销量、店名 / 店铺），评价区里每行一条「评价人：内容」。
function iphoneParseTaobaoProductsReply(text) {
  const products = [];
  const lines = String(text ?? '').split(/\r?\n/)
    .map((l) => l.trim().replace(/^(?:```+.*|[-•*◆]\s+|\d{1,2}[.、)]\s+)/, '').trim())
    .filter((l) => l && !l.startsWith('```'));
  let cur = null;
  let inReviews = false;
  // 「品类」写在「标题」之前（格式说明里就是这么示范的），此时还没开新块。先存下来，
  // 等标题开块时补进去——否则这一行会被丢掉，而下个区块的品类会错写到上一个商品头上。
  let pendingCategory = '';
  const flush = () => {
    if (cur && cur.title) products.push(cur);
    cur = null;
  };
  const fieldOf = (line) => {
    const matched = line.match(/^(品类|分类|类目|标题|名称|商品名|卖点|亮点|价格|现价|售价|原价|划线价|市场价|销量|已售|付款|店铺|店名|商家|城市|发货地|产地|标签|标记|优惠|促销|券|分期|详情|介绍|描述|评价|评论|买家评价)[:：]\s*(.*)$/);
    return matched ? { key: matched[1], value: matched[2].trim() } : null;
  };
  for (const line of lines) {
    const field = fieldOf(line);
    if (field) {
      const isTitle = /^(标题|名称|商品名)$/.test(field.key);
      if (isTitle) {
        // 「标题」既是开新商品的信号，也是商品内的字段——已有商品且尚未有标题时
        // 补进当前商品，否则开新块。
        if (cur && !cur.title && !cur.price) {
          cur.title = field.value;
          if (pendingCategory) { cur.category = pendingCategory; pendingCategory = ''; }
          inReviews = false;
          continue;
        }
        flush();
        cur = {
          category: pendingCategory, title: field.value, selling: '', price: '', original: '',
          sales: '', shop: '', city: '', tags: [], coupon: '', installment: '',
          detail: '', reviews: [],
        };
        pendingCategory = '';
        inReviews = false;
        continue;
      }
      if (/^品类|^分类|^类目$/.test(field.key)) {
        if (cur && !cur.title) cur.category = field.value;
        else pendingCategory = field.value;
        inReviews = false;
        continue;
      }
      if (!cur) continue;
      if (/^评价|^评论|^买家评价$/.test(field.key)) {
        inReviews = true;
        if (field.value) {
          const inline = field.value.match(/^([^：:\n]{1,24}?)\s*[:：]\s*(.+)$/);
          if (inline) cur.reviews.push({ name: inline[1].trim(), text: inline[2].trim() });
        }
        continue;
      }
      inReviews = false;
      if (/^品类|^分类|^类目$/.test(field.key)) cur.category = field.value;
      else if (/^卖点|^亮点$/.test(field.key)) cur.selling = field.value;
      else if (/^价格|^现价|^售价$/.test(field.key)) cur.price = field.value;
      else if (/^原价|^划线价|^市场价$/.test(field.key)) cur.original = field.value;
      else if (/^销量|^已售|^付款$/.test(field.key)) cur.sales = field.value;
      else if (/^店铺|^店名|^商家$/.test(field.key)) cur.shop = field.value;
      else if (/^城市|^发货地|^产地$/.test(field.key)) cur.city = field.value;
      else if (/^标签|^标记$/.test(field.key)) cur.tags = iphoneTaobaoTagList(field.value);
      else if (/^优惠|^促销|^券$/.test(field.key)) cur.coupon = field.value;
      else if (/^分期$/.test(field.key)) cur.installment = field.value;
      else if (/^详情|^介绍|^描述$/.test(field.key)) cur.detail = field.value;
      continue;
    }
    if (!cur) continue;
    if (inReviews) {
      const matched = line.match(/^([^：:\n]{1,24}?)\s*[:：]\s*(.+)$/);
      if (matched) {
        cur.reviews.push({ name: matched[1].trim(), text: matched[2].trim() });
        continue;
      }
      const last = cur.reviews[cur.reviews.length - 1];
      if (last) last.text = `${last.text} ${line}`.trim();
      continue;
    }
    // 没写字段名的正文行：并进详情（模型偶尔漏写「详情：」）
    if (line.length <= IPHONE_TAOBAO_DETAIL_CAP) {
      cur.detail = `${cur.detail} ${line}`.trim();
    }
  }
  flush();
  return products.filter((item) => item.title && item.price);
}

// ---------- 淘宝订单楼层同步 ----------
// 与其余记录段同一套「整段重写」（订单状态变化要如实反映），段头 `淘宝订单：`，
// 段标签 [淘宝订单]。只同步订单：商品列表是浏览行为，不进货架（订单才是剧情事件）。
function iphoneSyncTaobaoOrdersFloor() {
  const run = async () => {
    const ctx = iphoneGetFloorChatContext();
    if (!ctx) return;
    const data = iphoneGetTaobaoData();
    if (!data.orders.length) return;
    const sanitize = (value, fallback) => String(value || '').replace(/[\r\n:：]+/g, ' ').trim() || fallback;
    const statusLabel = (status) => ({
      paid: '已付款，待发货',
      shipped: '已发货，待收货',
      done: '已收货',
    }[status] || '已付款，待发货');
    const lines = [];
    lines.push(`买家：${sanitize(iphoneGetTavernUserName() || IPHONE_TAOBAO_USER_MACRO, '买家')}`
      + `｜零钱余额：¥${iphoneWechatMoney(iphoneGetWechatWallet().balance)}`);
    for (const order of data.orders) {
      const title = String(order.product.title || '').replace(/[\r\n]+/g, ' ').trim();
      lines.push(`◆ ${title}${order.qty > 1 ? ` ×${order.qty}` : ''}`);
      if (order.product.shop) lines.push(`  店铺：${sanitize(order.product.shop, '')}`);
      lines.push(`  实付款：¥${iphoneTaobaoPriceText(order.total)}｜${statusLabel(order.status)}`);
      lines.push(`  订单号：${sanitize(order.no, '')}`);
    }
    const sectionHeader = '淘宝订单：';
    const sectionTag = IPHONE_FLOOR_SECTION_TAG_HEADS.taobaoOrders;
    const chat = ctx.chat;
    const last = chat[chat.length - 1];
    const existingInner = last ? iphoneExtractMessageFloorInner(last.mes) : null;
    if (existingInner == null) {
      const sections = [{ tag: sectionTag, header: sectionHeader, lines }];
      await iphoneAppendChatFloor(ctx, iphoneWrapMessageFloorInner(iphoneFloorBuildInner(sections)));
      iphoneLog('info', `已同步 ${data.orders.length} 笔淘宝订单到 iPhone_Message 楼层`);
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
    iphoneLog('info', `已更新淘宝订单段到 iPhone_Message 楼层（${data.orders.length} 笔订单）`);
  };
  const guarded = async () => {
    try {
      await run();
    } catch (error) {
      iphoneLog('warn', '同步淘宝订单到 iPhone_Message 楼层失败', error);
    }
  };
  iphoneQqFloorSyncChain = iphoneQqFloorSyncChain.then(guarded, guarded);
  return iphoneQqFloorSyncChain;
}

// ---------- 购买（扣微信零钱） ----------
// 下单是一次真实扣款：iphoneChangeWechatBalance 传负数，余额不足时不写入并返回
// { ok: false }（见 wechat.js）。下单成功后写订单 + 同步楼层，返回订单对象；
// 失败抛带可读文案的 Error（界面直接展示）。
function iphoneTaobaoPurchase(product, qty, taobaoScreen) {
  const quantity = Math.max(1, Math.min(99, Math.floor(Number(qty) || 1)));
  const total = iphoneTaobaoMoney(product.price * quantity, 0);
  const wallet = iphoneGetWechatWallet();
  if (total > wallet.balance) {
    throw new Error(`微信零钱余额不足（¥${iphoneWechatMoney(wallet.balance)}），还需 ¥${iphoneWechatMoney(total - wallet.balance)}`);
  }
  const result = iphoneChangeWechatBalance(-total);
  if (!result.ok) {
    throw new Error(`零钱扣款失败（余额 ¥${iphoneWechatMoney(wallet.balance)}）`);
  }
  const fresh = iphoneGetTaobaoData();
  const order = iphoneNormalizeTaobaoOrder({
    id: iphoneTaobaoGenId('o'),
    no: `TB${Date.now().toString().slice(-13)}${Math.floor(Math.random() * 90 + 10)}`,
    product,
    qty: quantity,
    total,
    status: 'paid',
    ts: Date.now(),
  });
  if (!order) {
    // 商品数据异常时把钱退回去（宁可订单不落，也不能白扣钱）
    iphoneChangeWechatBalance(total);
    throw new Error('商品数据异常，下单失败');
  }
  fresh.orders.push(order);
  iphoneSetTaobaoData(taobaoScreen, fresh);
  void iphoneSyncTaobaoOrdersFloor();
  iphoneLog('info', `淘宝下单成功：${product.title} ×${quantity}，实付 ¥${iphoneTaobaoPriceText(total)}，零钱余额 ¥${iphoneWechatMoney(result.balance)}`);
  return { order, balance: result.balance };
}

// 加入购物车：同款合并数量（与真实购物车一致），返回购物车总条目数。
function iphoneTaobaoAddToCart(product, qty, taobaoScreen) {
  const quantity = Math.max(1, Math.min(99, Math.floor(Number(qty) || 1)));
  const fresh = iphoneGetTaobaoData();
  const existing = fresh.cart.find((item) => item.product.title === product.title);
  if (existing) {
    existing.qty = Math.min(99, existing.qty + quantity);
  } else {
    fresh.cart.push(iphoneNormalizeTaobaoCartItem({ product, qty: quantity }));
  }
  iphoneSetTaobaoData(taobaoScreen, fresh);
  iphoneLog('info', `已加入购物车：${product.title} ×${quantity}`);
  return iphoneTaobaoCartCount(iphoneGetTaobaoData());
}

// 收藏 / 取消收藏：商品上的星标（与小红书点赞同款的就地切换）。
function iphoneTaobaoToggleStar(productId, taobaoScreen) {
  const fresh = iphoneGetTaobaoData();
  const target = fresh.products.find((p) => p.id === productId);
  if (!target) return false;
  target.starMine = !target.starMine;
  iphoneSetTaobaoData(taobaoScreen, fresh);
  return target.starMine;
}

// ---------- 展示辅助 ----------
// 评价的时间：订单 / 评价不带时间，按内容哈希稳定生成一个「N天前」，同一件商品
// 每次渲染都一样（与小红书的评论点赞数同一套做法）。
function iphoneTaobaoReviewTime(review) {
  const text = `${review?.name || ''}${review?.text || ''}`;
  let hash = 0;
  for (let i = 0; i < text.length; i += 1) hash = (hash * 37 + text.charCodeAt(i)) % 100000;
  const days = hash % 60;
  if (days === 0) return '今天';
  if (days === 1) return '昨天';
  return `${days}天前`;
}

// 订单时间：与 QQ空间 / 朋友圈同款相对时间。
function iphoneTaobaoTimeLabel(ts) {
  return iphoneQqDynamicsTimeLabel({ ts });
}

// 订单状态文案（列表页与详情页共用）。
function iphoneTaobaoOrderStatusLabel(status) {
  return {
    paid: '待发货',
    shipped: '待收货',
    done: '交易成功',
  }[status] || '待发货';
}

// 商品搜索 / 频道筛选：按标题、品类、卖点、标签里的关键词过滤（与小红书频道同一
// 套思路，是聚合而不是独立数据源）。
// 关键词要避开通用的标签词：「包邮」是大多数商品都带的标签，所以这里用「包包 /
// 背包」而不是「包」；「米」会命中「小米」这类商品，所以写成「大米」。
const IPHONE_TAOBAO_CHANNEL_KEYS = Object.freeze({
  推荐: [],
  包邮: ['包邮', '免邮', '顺丰'],
  '3C数码': ['数码', '手机', '电脑', '耳机', '相机', '键盘', '显卡', '平板', '显示', '路由', '硬盘', '充电', '鼠标', '音箱'],
  穿搭: ['服饰', '女装', '男装', '连衣裙', '裤', '裙', '外套', '卫衣', '衬衫', 'T恤', '毛衣', '鞋', '帽', '包包', '背包', '双肩包', '穿搭'],
  美食: ['食品', '零食', '咖啡', '茶', '牛奶', '水果', '面包', '酒', '大米', '坚果', '巧克力', '螺蛳粉'],
  家居: ['家居', '收纳', '床', '沙发', '桌', '椅', '灯', '锅', '碗', '杯', '置物', '地毯'],
});

function iphoneTaobaoProductMatchesChannel(product, channel) {
  const keys = IPHONE_TAOBAO_CHANNEL_KEYS[channel] || [];
  if (!keys.length) return true;
  const haystack = `${product.title} ${product.category} ${product.selling} ${product.tags.join(' ')}`.toLowerCase();
  return keys.some((key) => haystack.includes(key.toLowerCase()));
}

// 商品搜索匹配：搜索词与标题 / 品类 / 卖点 / 标签做子串匹配；搜索词里的多个词
// 只要命中一个就算（淘宝的搜索本来就是模糊的）。
function iphoneTaobaoProductMatchesQuery(product, query) {
  const words = String(query || '').split(/\s+/).map((w) => w.trim()).filter(Boolean);
  if (!words.length) return false;
  const haystack = `${product.title} ${product.category} ${product.selling} ${product.tags.join(' ')} ${product.shop}`.toLowerCase();
  return words.some((word) => haystack.includes(word.toLowerCase()));
}

// ---------- 商品卡片（文字版「图片」+ 标题 + 价格行） ----------
// 封面位是一块品类渐变底色的方图块，里面只写品类词——没有图片素材，
// 这块「文字封面」就是商品的视觉标识（同一商品每次渲染同色）。标签由
// 右侧信息区的标签行负责，封面里不再重复，小尺寸（购物车 72px / 订单 62px）才不挤。
function iphoneTaobaoBuildThumb(product) {
  const thumb = document.createElement('div');
  thumb.className = `iphone-tb__thumb ${iphoneTaobaoCategoryClass(product)}`;
  const label = document.createElement('span');
  label.className = 'iphone-tb__thumb-label';
  label.textContent = iphoneTaobaoCategoryLabel(product);
  thumb.appendChild(label);
  if (product.original) {
    const off = document.createElement('span');
    off.className = 'iphone-tb__thumb-off';
    off.textContent = '限时优惠';
    thumb.appendChild(off);
  }
  return thumb;
}

// 一行标签（天猫 / 包邮 / 官方正品…），列表与详情页共用。
function iphoneTaobaoBuildTagRow(tags) {
  const row = document.createElement('span');
  row.className = 'iphone-tb__tags';
  for (const tag of tags) {
    const chip = document.createElement('i');
    chip.className = `iphone-tb__tag iphone-tb__tag--${IPHONE_TAOBAO_TAG_TONES[tag] || 'gray'}`;
    chip.textContent = tag;
    row.appendChild(chip);
  }
  return row;
}

// 列表卡片：左封面 / 右信息（标题、卖点、价格行、销量、店铺、优惠），对照淘宝
// 搜索结果的行式布局。
function iphoneTaobaoBuildProductCard(product, onOpen) {
  const card = document.createElement('article');
  card.className = 'iphone-tb__card';
  card.dataset.productId = product.id;
  card.appendChild(iphoneTaobaoBuildThumb(product));

  const info = document.createElement('div');
  info.className = 'iphone-tb__card-info';
  if (product.tags.length) info.appendChild(iphoneTaobaoBuildTagRow(product.tags.slice(0, 3)));
  const title = document.createElement('h3');
  title.className = 'iphone-tb__card-title';
  title.textContent = product.title;
  info.appendChild(title);
  if (product.selling) {
    const selling = document.createElement('p');
    selling.className = 'iphone-tb__card-selling';
    selling.textContent = product.selling;
    info.appendChild(selling);
  }
  const priceRow = document.createElement('p');
  priceRow.className = 'iphone-tb__card-price';
  const price = document.createElement('b');
  price.innerHTML = `<i>¥</i>${iphoneTaobaoPriceText(product.price)}`;
  priceRow.appendChild(price);
  if (product.original) {
    const original = document.createElement('s');
    original.textContent = `¥${iphoneTaobaoPriceText(product.original)}`;
    priceRow.appendChild(original);
  }
  if (product.sales) {
    const sales = document.createElement('em');
    sales.textContent = product.sales;
    priceRow.appendChild(sales);
  }
  info.appendChild(priceRow);
  if (product.coupon || product.installment) {
    const promo = document.createElement('p');
    promo.className = 'iphone-tb__card-promo';
    if (product.coupon) {
      const coupon = document.createElement('span');
      coupon.className = 'iphone-tb__card-coupon';
      coupon.textContent = product.coupon;
      promo.appendChild(coupon);
    }
    if (product.installment) {
      const installment = document.createElement('span');
      installment.className = 'iphone-tb__card-installment';
      installment.textContent = product.installment;
      promo.appendChild(installment);
    }
    info.appendChild(promo);
  }
  if (product.shop) {
    const shop = document.createElement('p');
    shop.className = 'iphone-tb__card-shop';
    const shopName = document.createElement('span');
    shopName.textContent = product.shop;
    const chev = document.createElement('em');
    chev.setAttribute('aria-hidden', 'true');
    chev.innerHTML = iphoneTaobaoIcons().chevronRight;
    shop.append(shopName, chev);
    info.appendChild(shop);
  }
  card.appendChild(info);
  card.addEventListener('click', () => onOpen(product));
  return card;
}

// ---------- 首页 ----------
// 顶部频道（推荐 / 包邮 / 3C数码…）+ 瀑布式单列商品流；起步是空态，下拉刷新调
// API 生成商品（与小红书同一套手势）。
function iphoneTaobaoBuildHomePage({ icons, onOpenProduct, screen }) {
  const page = document.createElement('div');
  page.className = 'iphone-tb__tabpage iphone-tb__home';

  const scroll = document.createElement('div');
  scroll.className = 'iphone-tb__scroll';

  const indicator = document.createElement('div');
  indicator.className = 'iphone-tb__refresh';
  indicator.innerHTML = '<span class="iphone-tb__refresh-spin" aria-hidden="true"></span><span class="iphone-tb__refresh-text">下拉刷新</span>';
  const refreshText = indicator.querySelector('.iphone-tb__refresh-text');
  scroll.appendChild(indicator);

  const feed = document.createElement('div');
  feed.className = 'iphone-tb__feed';
  scroll.appendChild(feed);
  page.appendChild(scroll);

  const state = { channel: '推荐' };

  function visibleProducts(data) {
    const base = data.products;
    if (state.channel === '推荐') return base;
    return base.filter((product) => iphoneTaobaoProductMatchesChannel(product, state.channel));
  }

  function renderFeed() {
    const data = iphoneGetTaobaoData();
    const list = visibleProducts(data).slice(-40).reverse();
    feed.innerHTML = '';
    if (!list.length) {
      const empty = document.createElement('div');
      empty.className = 'iphone-tb__empty';
      empty.innerHTML = `${icons.bag}<p>${data.products.length ? '这个频道暂时没有商品，换个频道看看' : '还没有商品，下拉刷新试试'}</p>`;
      feed.appendChild(empty);
      return;
    }
    for (const product of list) {
      feed.appendChild(iphoneTaobaoBuildProductCard(product, onOpenProduct));
    }
  }

  // 下拉刷新：与小红书同一套手势（阈值 64px），松手调一次 API 生成 1~6 个商品
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
      refreshText.textContent = '正在挑商品…';
      (async () => {
        let failText = '';
        try {
          await iphoneGenerateTaobaoProducts(screen, '');
          renderFeed();
        } catch (error) {
          iphoneLog('warn', '淘宝刷新商品失败', error);
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
  page._render = renderFeed;
  return page;
}

// ---------- 搜索页 ----------
// 搜索框 + 热搜榜 / 搜索历史（空态）+ 结果列表。提交搜索调一次 API 生成商品，
// 结果落在同一份数据里（与首页共用 product 池，频道筛选照常生效）。
function iphoneTaobaoBuildSearchView({ icons, screen, onClose, onOpenProduct }) {
  const view = document.createElement('div');
  view.className = 'iphone-tb__searchview';
  view.innerHTML = `
    <header class="iphone-tb__search-nav">
      <button type="button" class="iphone-tb__search-back" aria-label="返回">${icons.back}</button>
      <div class="iphone-tb__search-box">
        <span class="iphone-tb__search-ico" aria-hidden="true">${icons.search}</span>
        <input type="text" class="iphone-tb__search-input" maxlength="30" placeholder="搜索宝贝" aria-label="搜索宝贝" autocomplete="off" spellcheck="false">
        <button type="button" class="iphone-tb__search-clear" aria-label="清除" hidden>${icons.close}</button>
        <span class="iphone-tb__search-scan" aria-hidden="true">${icons.camera}</span>
      </div>
      <button type="button" class="iphone-tb__search-go">搜索</button>
    </header>
    <div class="iphone-tb__search-scroll">
      <div class="iphone-tb__search-empty">
        <section class="iphone-tb__search-block">
          <p class="iphone-tb__search-head">热搜榜</p>
          <div class="iphone-tb__hotlist"></div>
        </section>
        <section class="iphone-tb__search-block iphone-tb__search-history" hidden>
          <p class="iphone-tb__search-head">搜索历史<button type="button" class="iphone-tb__search-clearall">清空</button></p>
          <div class="iphone-tb__historylist"></div>
        </section>
      </div>
      <div class="iphone-tb__search-result" hidden>
        <p class="iphone-tb__search-status"></p>
        <div class="iphone-tb__search-list"></div>
      </div>
    </div>
  `;
  const input = view.querySelector('.iphone-tb__search-input');
  const clearBtn = view.querySelector('.iphone-tb__search-clear');
  const goBtn = view.querySelector('.iphone-tb__search-go');
  const emptyWrap = view.querySelector('.iphone-tb__search-empty');
  const historyBlock = view.querySelector('.iphone-tb__search-history');
  const hotList = view.querySelector('.iphone-tb__hotlist');
  const historyList = view.querySelector('.iphone-tb__historylist');
  const resultWrap = view.querySelector('.iphone-tb__search-result');
  const statusEl = view.querySelector('.iphone-tb__search-status');
  const listEl = view.querySelector('.iphone-tb__search-list');
  const scrollEl = view.querySelector('.iphone-tb__search-scroll');
  let query = '';
  let searching = false;

  function renderEmptyState() {
    hotList.innerHTML = '';
    IPHONE_TAOBAO_HOT_SEARCHES.forEach((word, index) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'iphone-tb__hotitem';
      btn.innerHTML = `<i>${index + 1}</i><span>${word}</span>`;
      if (index < 3) btn.classList.add('is-top');
      btn.addEventListener('click', () => {
        input.value = word;
        runSearch(word);
      });
      hotList.appendChild(btn);
    });
    const data = iphoneGetTaobaoData();
    const history = [...data.history].reverse();
    historyBlock.hidden = !history.length;
    historyList.innerHTML = '';
    for (const word of history) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'iphone-tb__historyitem';
      btn.textContent = word;
      btn.addEventListener('click', () => {
        input.value = word;
        runSearch(word);
      });
      historyList.appendChild(btn);
    }
  }

  function renderResults() {
    const data = iphoneGetTaobaoData();
    const list = data.products.filter((product) => iphoneTaobaoProductMatchesQuery(product, query)).slice(-30).reverse();
    listEl.innerHTML = '';
    statusEl.textContent = list.length
      ? `为你找到 ${list.length} 件「${query}」相关宝贝`
      : '没有找到相关宝贝，换个词试试';
    for (const product of list) {
      listEl.appendChild(iphoneTaobaoBuildProductCard(product, onOpenProduct));
    }
  }

  async function runSearch(raw) {
    const word = String(raw ?? input.value).trim();
    if (!word || searching) return;
    query = word;
    input.value = word;
    clearBtn.hidden = false;
    searching = true;
    emptyWrap.hidden = true;
    resultWrap.hidden = false;
    statusEl.textContent = `正在搜索「${word}」…`;
    listEl.innerHTML = '';
    goBtn.disabled = true;
    goBtn.textContent = '搜索中';
    try {
      await iphoneGenerateTaobaoProducts(screen, word);
      renderResults();
    } catch (error) {
      iphoneLog('warn', `淘宝搜索「${word}」失败`, error);
      statusEl.textContent = `搜索失败：${String(error?.message || error)}`;
    }
    searching = false;
    goBtn.disabled = false;
    goBtn.textContent = '搜索';
    scrollEl.scrollTop = 0;
  }

  input.addEventListener('input', () => {
    clearBtn.hidden = !input.value;
  });
  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      runSearch();
    }
  });
  clearBtn.addEventListener('click', () => {
    input.value = '';
    clearBtn.hidden = true;
    query = '';
    emptyWrap.hidden = false;
    resultWrap.hidden = true;
    renderEmptyState();
    input.focus();
  });
  goBtn.addEventListener('click', () => runSearch());
  view.querySelector('.iphone-tb__search-back').addEventListener('click', () => onClose?.());
  view.querySelector('.iphone-tb__search-clearall').addEventListener('click', () => {
    const fresh = iphoneGetTaobaoData();
    fresh.history = [];
    iphoneSetTaobaoData(screen, fresh);
    renderEmptyState();
  });

  view._open = (presetQuery) => {
    query = '';
    input.value = '';
    clearBtn.hidden = true;
    resultWrap.hidden = true;
    emptyWrap.hidden = false;
    renderEmptyState();
    scrollEl.scrollTop = 0;
    if (presetQuery) {
      input.value = presetQuery;
      clearBtn.hidden = false;
      runSearch(presetQuery);
    }
  };
  view._render = () => {
    if (!view.classList.contains('is-open')) return;
    if (query) renderResults();
    else renderEmptyState();
  };
  return view;
}

// ---------- 商品详情 ----------
// 与真实淘宝详情页同构：顶部大图位（文字封面块）+ 价格区（现价 / 原价 / 优惠 /
// 分期）+ 标题与标签 + 店铺行 + 保障条 + 评价区 + 详情文字 + 底部购买条（店铺 /
// 客服 / 收藏 + 加入购物车 + 立即购买）。立即购买弹数量与付款确认，扣微信零钱。
function iphoneTaobaoBuildProductView({ icons, screen, onClose, onChanged, onOpenCart }) {
  const view = document.createElement('div');
  view.className = 'iphone-tb__productview';

  const nav = document.createElement('header');
  nav.className = 'iphone-tb__prod-nav';
  const scroll = document.createElement('div');
  scroll.className = 'iphone-tb__prod-scroll';
  const bar = document.createElement('div');
  bar.className = 'iphone-tb__prod-bar';
  const errRow = document.createElement('p');
  errRow.className = 'iphone-tb__prod-err';
  errRow.hidden = true;

  view.appendChild(nav);
  view.appendChild(scroll);
  view.appendChild(errRow);
  view.appendChild(bar);

  let productId = '';
  const current = () => iphoneGetTaobaoData().products.find((p) => p.id === productId) || null;

  function renderNav(product, data) {
    const starred = Boolean(product.starMine);
    nav.innerHTML = `
      <button type="button" class="iphone-tb__prod-back" aria-label="返回">${icons.back}</button>
      <span class="iphone-tb__prod-nav-title">宝贝详情</span>
      <button type="button" class="iphone-tb__prod-navbtn" aria-label="分享">${icons.share}</button>
      <button type="button" class="iphone-tb__prod-navbtn iphone-tb__prod-navcart" aria-label="购物车">${icons.cart}</button>
      <button type="button" class="iphone-tb__prod-navbtn" aria-label="更多">${icons.more}</button>
    `;
    nav.querySelector('.iphone-tb__prod-back').addEventListener('click', () => onClose?.());
    nav.querySelector('.iphone-tb__prod-navcart').addEventListener('click', () => onOpenCart?.());
    const count = iphoneTaobaoCartCount(data);
    if (count) {
      const badge = document.createElement('i');
      badge.className = 'iphone-tb__prod-navbadge';
      badge.textContent = String(count > 99 ? '99+' : count);
      nav.querySelector('.iphone-tb__prod-navcart').appendChild(badge);
    }
  }

  function renderBar(product) {
    bar.innerHTML = `
      <button type="button" class="iphone-tb__prod-tab" data-act="shop">${icons.shop}<i>店铺</i></button>
      <button type="button" class="iphone-tb__prod-tab" data-act="service">${icons.service}<i>客服</i></button>
      <button type="button" class="iphone-tb__prod-tab" data-act="star">${icons.star}<i>收藏</i></button>
      <button type="button" class="iphone-tb__prod-addcart">加入购物车</button>
      <button type="button" class="iphone-tb__prod-buy">立即购买</button>
    `;
    const starBtn = bar.querySelector('[data-act="star"]');
    starBtn.classList.toggle('is-on', Boolean(product.starMine));
    starBtn.querySelector('i').textContent = product.starMine ? '已收藏' : '收藏';
    starBtn.addEventListener('click', () => {
      const starred = iphoneTaobaoToggleStar(productId, screen);
      starBtn.classList.toggle('is-on', starred);
      starBtn.querySelector('i').textContent = starred ? '已收藏' : '收藏';
      onChanged?.();
    });
    bar.querySelector('[data-act="shop"]').addEventListener('click', () => {
      errRow.hidden = false;
      errRow.textContent = product.shop ? `${product.shop}：这是一家演示店铺，页面未实现。` : '这家店铺还没有名字。';
    });
    bar.querySelector('[data-act="service"]').addEventListener('click', () => {
      errRow.hidden = false;
      errRow.textContent = '客服不在线（演示）：有问题请直接下单，或去微信找店家聊聊。';
    });
    bar.querySelector('.iphone-tb__prod-addcart').addEventListener('click', () => {
      iphoneTaobaoAddToCart(current(), 1, screen);
      errRow.hidden = false;
      errRow.textContent = `已加入购物车（共 ${iphoneTaobaoCartCount(iphoneGetTaobaoData())} 件宝贝）`;
      renderNav(current(), iphoneGetTaobaoData());
      onChanged?.();
    });
    bar.querySelector('.iphone-tb__prod-buy').addEventListener('click', () => openBuySheet(product));
  }

  // 购买浮层：选数量 → 确认付款（扣微信零钱）。余额不足时挡在确认前。
  function openBuySheet(product) {
    const wallet = iphoneGetWechatWallet();
    const sheet = document.createElement('div');
    sheet.className = 'iphone-tb__sheet';
    let qty = 1;
    const total = () => iphoneTaobaoMoney(product.price * qty, 0);
    sheet.innerHTML = `
      <div class="iphone-tb__sheet-mask"></div>
      <div class="iphone-tb__sheet-body">
        <div class="iphone-tb__sheet-top">
          <span class="iphone-tb__sheet-thumb">${iphoneTaobaoCategoryLabel(product)}</span>
          <div class="iphone-tb__sheet-info">
            <p class="iphone-tb__sheet-price">¥<b data-sheet-price>${iphoneTaobaoPriceText(product.price)}</b></p>
            <p class="iphone-tb__sheet-stock">库存充足｜${product.city ? `发货地 ${product.city}` : '现货速发'}</p>
            <p class="iphone-tb__sheet-balance" data-sheet-balance></p>
          </div>
          <button type="button" class="iphone-tb__sheet-close" aria-label="关闭">${icons.close}</button>
        </div>
        <div class="iphone-tb__sheet-qty">
          <span>购买数量</span>
          <span class="iphone-tb__stepper">
            <button type="button" data-step="-1" aria-label="减少">${icons.minus}</button>
            <i data-sheet-qty>1</i>
            <button type="button" data-step="1" aria-label="增加">${icons.plus}</button>
          </span>
        </div>
        <p class="iphone-tb__sheet-foot">实付款 <b data-sheet-total></b>｜从微信零钱扣款</p>
        <button type="button" class="iphone-tb__sheet-pay">确认付款</button>
      </div>
    `;
    const priceEl = sheet.querySelector('[data-sheet-price]');
    const qtyEl = sheet.querySelector('[data-sheet-qty]');
    const totalEl = sheet.querySelector('[data-sheet-total]');
    const balanceEl = sheet.querySelector('[data-sheet-balance]');
    const payBtn = sheet.querySelector('.iphone-tb__sheet-pay');
    const syncSheet = () => {
      const sum = total();
      const enough = sum <= wallet.balance;
      priceEl.textContent = iphoneTaobaoPriceText(product.price);
      qtyEl.textContent = String(qty);
      totalEl.textContent = `¥${iphoneTaobaoPriceText(sum)}`;
      balanceEl.textContent = `微信零钱余额 ¥${iphoneWechatMoney(wallet.balance)}${enough ? '' : '（不足）'}`;
      balanceEl.classList.toggle('is-short', !enough);
      payBtn.classList.toggle('is-disabled', !enough);
      payBtn.textContent = enough ? '确认付款' : '零钱不足';
    };
    sheet.querySelectorAll('[data-step]').forEach((btn) => {
      btn.addEventListener('click', () => {
        qty = Math.max(1, Math.min(99, qty + Number(btn.dataset.step)));
        syncSheet();
      });
    });
    sheet.querySelector('.iphone-tb__sheet-mask').addEventListener('click', () => sheet.remove());
    sheet.querySelector('.iphone-tb__sheet-close').addEventListener('click', () => sheet.remove());
    payBtn.addEventListener('click', () => {
      if (total() > wallet.balance) return;
      try {
        const { order, balance } = iphoneTaobaoPurchase(product, qty, screen);
        sheet.remove();
        errRow.hidden = false;
        errRow.textContent = `下单成功：${order.product.title} ×${order.qty}，实付 ¥${iphoneTaobaoPriceText(order.total)}｜零钱余额 ¥${iphoneWechatMoney(balance)}`;
        render();
        onChanged?.();
      } catch (error) {
        errRow.hidden = false;
        errRow.textContent = String(error?.message || error);
        sheet.remove();
      }
    });
    syncSheet();
    view.appendChild(sheet);
  }

  function render() {
    const product = current();
    if (!product) {
      onClose?.();
      return;
    }
    const data = iphoneGetTaobaoData();
    renderNav(product, data);
    renderBar(product);

    scroll.innerHTML = '';
    const hero = document.createElement('div');
    hero.className = `iphone-tb__prod-hero ${iphoneTaobaoCategoryClass(product)}`;
    const heroLabel = document.createElement('span');
    heroLabel.className = 'iphone-tb__prod-hero-label';
    heroLabel.textContent = iphoneTaobaoCategoryLabel(product);
    hero.appendChild(heroLabel);

    // 价格区：现价（大号橙字）+ 划线原价 + 已售 + 优惠 / 分期 / 券后
    const priceCard = document.createElement('section');
    priceCard.className = 'iphone-tb__prod-price';
    const priceMain = document.createElement('p');
    priceMain.className = 'iphone-tb__prod-price-main';
    priceMain.innerHTML = `<span>店铺优惠后</span><b>¥<i>${iphoneTaobaoPriceText(product.price)}</i></b><em>起</em>`;
    if (product.original) {
      const original = document.createElement('s');
      original.textContent = `优惠前 ¥${iphoneTaobaoPriceText(product.original)}`;
      priceMain.appendChild(original);
    }
    priceCard.appendChild(priceMain);
    if (product.sales) {
      const sales = document.createElement('span');
      sales.className = 'iphone-tb__prod-sales';
      sales.textContent = `已售 ${product.sales.replace(/人付款|付款|已售/g, '') || product.sales}`;
      priceCard.appendChild(sales);
    }
    if (product.coupon) {
      const coupon = document.createElement('p');
      coupon.className = 'iphone-tb__prod-coupon';
      coupon.append(
        (() => { const s = document.createElement('span'); s.textContent = '已享受'; return s; })(),
        (() => { const b = document.createElement('b'); b.textContent = product.coupon; return b; })(),
        (() => { const e = document.createElement('em'); e.setAttribute('aria-hidden', 'true'); e.innerHTML = icons.chevronRight; return e; })(),
      );
      priceCard.appendChild(coupon);
    }
    if (product.installment) {
      const installment = document.createElement('p');
      installment.className = 'iphone-tb__prod-installment';
      installment.append(
        (() => { const s = document.createElement('span'); s.textContent = '可再享'; return s; })(),
        (() => { const b = document.createElement('b'); b.textContent = product.installment; return b; })(),
        (() => { const e = document.createElement('em'); e.setAttribute('aria-hidden', 'true'); e.innerHTML = icons.chevronRight; return e; })(),
      );
      priceCard.appendChild(installment);
    }
    hero.appendChild(priceCard);

    const body = document.createElement('section');
    body.className = 'iphone-tb__prod-body';
    if (product.tags.length) body.appendChild(iphoneTaobaoBuildTagRow(product.tags));
    const title = document.createElement('h1');
    title.className = 'iphone-tb__prod-title';
    title.textContent = product.title;
    body.appendChild(title);
    if (product.selling) {
      const selling = document.createElement('p');
      selling.className = 'iphone-tb__prod-selling';
      selling.textContent = product.selling.split(/[｜|]/).map((part) => part.trim()).filter(Boolean).join('｜');
      body.appendChild(selling);
    }
    const badges = document.createElement('p');
    badges.className = 'iphone-tb__prod-badges';
    const badgeTexts = [
      product.shop ? `${product.shop}${product.sales ? `月销${product.sales.replace(/[^0-9+万亿]/g, '') || '热卖'}` : ''}` : '',
      product.sales ? '超 2 千人加购' : '',
      '多人评价“质量不错”',
    ].filter(Boolean);
    for (const text of badgeTexts) {
      const span = document.createElement('span');
      span.textContent = text;
      badges.appendChild(span);
    }
    body.appendChild(badges);
    scroll.appendChild(hero);
    scroll.appendChild(body);

    const shopCard = document.createElement('section');
    shopCard.className = 'iphone-tb__prod-shop';
    const shopIco = document.createElement('span');
    shopIco.className = 'iphone-tb__prod-shop-ico';
    shopIco.setAttribute('aria-hidden', 'true');
    shopIco.innerHTML = icons.shop;
    const shopInfo = document.createElement('div');
    shopInfo.className = 'iphone-tb__prod-shop-info';
    const shopName = document.createElement('p');
    shopName.className = 'iphone-tb__prod-shop-name';
    shopName.textContent = product.shop || '淘宝店铺';
    const shopMeta = document.createElement('p');
    shopMeta.className = 'iphone-tb__prod-shop-meta';
    shopMeta.textContent = [product.city ? `发货地 ${product.city}` : '', '店铺评分 4.8', '物流 4.8'].filter(Boolean).join('｜');
    shopInfo.append(shopName, shopMeta);
    const shopChev = document.createElement('em');
    shopChev.setAttribute('aria-hidden', 'true');
    shopChev.innerHTML = icons.chevronRight;
    shopCard.append(shopIco, shopInfo, shopChev);
    scroll.appendChild(shopCard);

    const guarantee = document.createElement('p');
    guarantee.className = 'iphone-tb__prod-guarantee';
    guarantee.innerHTML = IPHONE_TAOBAO_GUARANTEES.map((item) => `<span>${icons.check}${item}</span>`).join('');
    scroll.appendChild(guarantee);

    // 评价区：AI 生成时写的买家评价（没有就整段不显示）
    if (product.reviews.length) {
      const reviews = document.createElement('section');
      reviews.className = 'iphone-tb__prod-reviews';
      const head = document.createElement('p');
      head.className = 'iphone-tb__prod-review-head';
      head.innerHTML = `宝贝评价 <span>${product.reviews.length} 条</span>`;
      reviews.appendChild(head);
      for (const review of product.reviews) {
        const row = document.createElement('div');
        row.className = 'iphone-tb__prod-review';
        const name = document.createElement('p');
        name.className = 'iphone-tb__prod-review-name';
        name.textContent = review.name;
        const text = document.createElement('p');
        text.className = 'iphone-tb__prod-review-text';
        text.textContent = review.text;
        const meta = document.createElement('p');
        meta.className = 'iphone-tb__prod-review-meta';
        meta.textContent = iphoneTaobaoReviewTime(review);
        row.append(name, text, meta);
        reviews.appendChild(row);
      }
      scroll.appendChild(reviews);
    }

    if (product.detail) {
      const detail = document.createElement('section');
      detail.className = 'iphone-tb__prod-detail';
      const head = document.createElement('p');
      head.className = 'iphone-tb__prod-detail-head';
      head.textContent = '宝贝详情';
      const text = document.createElement('p');
      text.className = 'iphone-tb__prod-detail-text';
      text.textContent = product.detail;
      detail.append(head, text);
      scroll.appendChild(detail);
    }
  }

  view._open = (product) => {
    productId = product.id;
    errRow.hidden = true;
    render();
    scroll.scrollTop = 0;
  };
  view._render = () => {
    if (view.classList.contains('is-open') && productId) render();
  };
  return view;
}

// ---------- 分类页 ----------
// 品类宫格：点一格 = 带着该品类词去搜索（真实淘宝的分类页是导航，这里做成入口）。
function iphoneTaobaoBuildCategoryPage({ icons, onSearch }) {
  const page = document.createElement('div');
  // 初始 is-hidden：五个 Tab 页都是 inset:0 的绝对定位层，不藏起来会全部叠在首页上
  page.className = 'iphone-tb__tabpage iphone-tb__category is-hidden';
  const scroll = document.createElement('div');
  scroll.className = 'iphone-tb__scroll';
  page.appendChild(scroll);
  page._render = () => {
    scroll.innerHTML = '';
    const hint = document.createElement('p');
    hint.className = 'iphone-tb__cat-hint';
    hint.textContent = '点击品类，看相关的宝贝';
    scroll.appendChild(hint);
    const grid = document.createElement('div');
    grid.className = 'iphone-tb__cat-grid';
    for (const category of IPHONE_TAOBAO_CATEGORIES) {
      const cell = document.createElement('button');
      cell.type = 'button';
      cell.className = `iphone-tb__cat-cell iphone-tb__thumb--${category.id}`;
      cell.innerHTML = `<span>${category.label}</span>`;
      cell.addEventListener('click', () => onSearch(category.label));
      grid.appendChild(cell);
    }
    scroll.appendChild(grid);
    const foot = document.createElement('p');
    foot.className = 'iphone-tb__cat-foot';
    foot.textContent = '品类只列出常见的大类；想找别的，直接去搜索框里写。';
    scroll.appendChild(foot);
  };
  return page;
}

// ---------- 购物车页 ----------
// 条目行（封面块 / 标题 / 价格 / 数量步进 / 删除）+ 底部合计与结算。结算按条目
// 逐一下单（扣微信零钱），全成功才清掉对应条目。
function iphoneTaobaoBuildCartPage({ icons, screen, onOpenProduct, onChanged }) {
  const page = document.createElement('div');
  page.className = 'iphone-tb__tabpage iphone-tb__cart is-hidden';
  const scroll = document.createElement('div');
  scroll.className = 'iphone-tb__scroll';
  const foot = document.createElement('div');
  foot.className = 'iphone-tb__cart-foot';
  page.appendChild(scroll);
  page.appendChild(foot);

  const selected = new Set();

  function render() {
    const data = iphoneGetTaobaoData();
    scroll.innerHTML = '';
    foot.innerHTML = '';
    if (!data.cart.length) {
      const empty = document.createElement('div');
      empty.className = 'iphone-tb__empty';
      empty.innerHTML = `${icons.bag}<p>购物车还是空的，去首页逛逛吧</p>`;
      scroll.appendChild(empty);
      return;
    }
    for (const item of data.cart) {
      const row = document.createElement('div');
      row.className = 'iphone-tb__cart-row';
      const check = document.createElement('button');
      check.type = 'button';
      check.className = `iphone-tb__cart-check${selected.has(item.id) ? ' is-on' : ''}`;
      check.setAttribute('aria-label', '选择');
      check.innerHTML = icons.check;
      check.addEventListener('click', () => {
        if (selected.has(item.id)) selected.delete(item.id);
        else selected.add(item.id);
        render();
      });
      row.appendChild(check);
      const thumb = iphoneTaobaoBuildThumb(item.product);
      thumb.classList.add('iphone-tb__thumb--cart');
      thumb.addEventListener('click', () => onOpenProduct(item.product));
      row.appendChild(thumb);
      const info = document.createElement('div');
      info.className = 'iphone-tb__cart-info';
      const title = document.createElement('p');
      title.className = 'iphone-tb__cart-title';
      title.textContent = item.product.title;
      title.addEventListener('click', () => onOpenProduct(item.product));
      const price = document.createElement('p');
      price.className = 'iphone-tb__cart-price';
      price.innerHTML = `<b>¥${iphoneTaobaoPriceText(item.product.price)}</b>`;
      const qtyRow = document.createElement('p');
      qtyRow.className = 'iphone-tb__cart-qty';
      qtyRow.innerHTML = `
        <span class="iphone-tb__stepper">
          <button type="button" data-step="-1" aria-label="减少">${icons.minus}</button>
          <i>${item.qty}</i>
          <button type="button" data-step="1" aria-label="增加">${icons.plus}</button>
        </span>
        <button type="button" class="iphone-tb__cart-del">删除</button>
      `;
      qtyRow.querySelectorAll('[data-step]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const fresh = iphoneGetTaobaoData();
          const target = fresh.cart.find((c) => c.id === item.id);
          if (!target) return;
          target.qty = Math.max(1, Math.min(99, target.qty + Number(btn.dataset.step)));
          iphoneSetTaobaoData(screen, fresh);
          onChanged?.();
          render();
        });
      });
      qtyRow.querySelector('.iphone-tb__cart-del').addEventListener('click', () => {
        const fresh = iphoneGetTaobaoData();
        fresh.cart = fresh.cart.filter((c) => c.id !== item.id);
        selected.delete(item.id);
        iphoneSetTaobaoData(screen, fresh);
        onChanged?.();
        render();
      });
      info.append(title, price, qtyRow);
      row.appendChild(info);
      scroll.appendChild(row);
    }
    const wallet = iphoneGetWechatWallet();
    const chosen = data.cart.filter((item) => selected.has(item.id));
    const total = iphoneTaobaoMoney(chosen.reduce((sum, item) => sum + item.product.price * item.qty, 0), 0);
    const enough = total <= wallet.balance;
    foot.innerHTML = `
      <button type="button" class="iphone-tb__cart-all${chosen.length === data.cart.length ? ' is-on' : ''}">全选</button>
      <div class="iphone-tb__cart-sum">
        <p>合计：<b>¥${iphoneTaobaoPriceText(total)}</b></p>
        <p class="iphone-tb__cart-balance">零钱余额 ¥${iphoneWechatMoney(wallet.balance)}${chosen.length && !enough ? '（不足）' : ''}</p>
      </div>
      <button type="button" class="iphone-tb__cart-pay${chosen.length && enough ? '' : ' is-disabled'}">结算${chosen.length ? `(${chosen.length})` : ''}</button>
    `;
    foot.querySelector('.iphone-tb__cart-all').addEventListener('click', () => {
      if (chosen.length === data.cart.length) selected.clear();
      else data.cart.forEach((item) => selected.add(item.id));
      render();
    });
    foot.querySelector('.iphone-tb__cart-pay').addEventListener('click', () => {
      if (!chosen.length || !enough) return;
      const failed = [];
      for (const item of chosen) {
        try {
          // 下单（扣零钱 + 落订单）由 iphoneTaobaoPurchase 完成，这里只负责把
          // 已结算的条目从购物车摘掉——重读数据再摘，避免用旧快照覆盖新订单。
          iphoneTaobaoPurchase(item.product, item.qty, screen);
          const fresh = iphoneGetTaobaoData();
          fresh.cart = fresh.cart.filter((c) => c.id !== item.id);
          iphoneSetTaobaoData(screen, fresh);
          selected.delete(item.id);
        } catch (error) {
          failed.push(`${item.product.title}：${String(error?.message || error)}`);
        }
      }
      onChanged?.();
      render();
      if (failed.length) {
        const err = document.createElement('p');
        err.className = 'iphone-tb__cart-err';
        err.textContent = failed.join('；');
        scroll.appendChild(err);
      }
    });
  }

  page._render = render;
  return page;
}

// ---------- 消息页 ----------
// 淘宝的消息是「通知 / 物流 / 互动」三条聚合入口 + 订单动态派生出来的消息列表
// （与小红书的「消息全部从真实数据派生」同一套做法，不编造数据）。
function iphoneTaobaoCollectMessages(data) {
  const list = [];
  for (const order of [...data.orders].reverse()) {
    list.push({
      id: `od-${order.id}`,
      kind: '物流',
      name: order.product.shop || '淘宝卖家',
      text: order.status === 'paid'
        ? `你的「${order.product.title}」已付款成功，卖家正在打包，实付 ¥${iphoneTaobaoPriceText(order.total)}`
        : `你有一笔订单待收货：${order.product.title}`,
      ts: order.ts,
    });
  }
  for (const product of [...data.products].reverse()) {
    if (!product.starMine) continue;
    list.push({
      id: `st-${product.id}`,
      kind: '收藏',
      name: product.shop || '淘宝',
      text: `你收藏的「${product.title}」降价了，现在 ¥${iphoneTaobaoPriceText(product.price)}`,
      ts: product.ts,
    });
  }
  return list.sort((a, b) => (b.ts || 0) - (a.ts || 0)).slice(0, 40);
}

function iphoneTaobaoBuildMessagesPage({ icons, onOpenProduct, onOpenCart }) {
  const page = document.createElement('div');
  page.className = 'iphone-tb__tabpage iphone-tb__messages is-hidden';
  const scroll = document.createElement('div');
  scroll.className = 'iphone-tb__scroll';
  page.appendChild(scroll);
  page._render = () => {
    scroll.innerHTML = '';
    const entries = document.createElement('div');
    entries.className = 'iphone-tb__msg-entries';
    [
      { key: 'notice', label: '通知', tone: 'orange' },
      { key: 'logistics', label: '物流', tone: 'blue' },
      { key: 'interact', label: '互动', tone: 'red' },
    ].forEach((entry) => {
      const cell = document.createElement('button');
      cell.type = 'button';
      cell.className = `iphone-tb__msg-entry is-${entry.tone}`;
      cell.innerHTML = `<span class="iphone-tb__msg-entry-ico" aria-hidden="true">${icons.message}</span><i>${entry.label}</i>`;
      cell.addEventListener('click', () => {
        const list = scroll.querySelector('.iphone-tb__msg-list');
        if (list) list.dataset.filter = entry.key;
        render();
      });
      entries.appendChild(cell);
    });
    scroll.appendChild(entries);

    const data = iphoneGetTaobaoData();
    const messages = iphoneTaobaoCollectMessages(data);
    const listWrap = document.createElement('div');
    listWrap.className = 'iphone-tb__msg-list';
    if (!messages.length) {
      const empty = document.createElement('div');
      empty.className = 'iphone-tb__empty';
      empty.innerHTML = `${icons.message}<p>还没有消息，下单后物流通知会出现在这里</p>`;
      listWrap.appendChild(empty);
    }
    for (const message of messages) {
      const row = document.createElement('div');
      row.className = 'iphone-tb__msg-row';
      const avatar = document.createElement('span');
      avatar.className = 'iphone-tb__msg-avatar';
      avatar.textContent = message.kind;
      row.appendChild(avatar);
      const bodyEl = document.createElement('div');
      bodyEl.className = 'iphone-tb__msg-body';
      const head = document.createElement('p');
      head.className = 'iphone-tb__msg-name';
      head.textContent = message.name;
      const text = document.createElement('p');
      text.className = 'iphone-tb__msg-text';
      text.textContent = message.text;
      bodyEl.append(head, text);
      row.appendChild(bodyEl);
      const time = document.createElement('span');
      time.className = 'iphone-tb__msg-time';
      time.textContent = iphoneTaobaoTimeLabel(message.ts);
      row.appendChild(time);
      row.addEventListener('click', () => onOpenCart?.());
      listWrap.appendChild(row);
    }
    scroll.appendChild(listWrap);
  };
  return page;
}

// ---------- 「我的淘宝」页 ----------
// 头像昵称（跟随酒馆 {{user}}）+ 零钱余额卡 + 订单状态行（待付款 / 待发货 / 待收货 /
// 评价）+ 收藏 / 足迹 / 退款 / 客服等入口。余额卡直接读微信钱包，与微信零钱页同源。
function iphoneTaobaoBuildMePage({ icons, screen, onOpenOrders, onOpenWallet, onChanged }) {
  const page = document.createElement('div');
  page.className = 'iphone-tb__tabpage iphone-tb__me is-hidden';
  const scroll = document.createElement('div');
  scroll.className = 'iphone-tb__scroll';
  page.appendChild(scroll);

  const displayName = () => iphoneGetTavernUserName() || IPHONE_WECHAT_ME_FALLBACK_NAME;

  function render() {
    const data = iphoneGetTaobaoData();
    const wallet = iphoneGetWechatWallet();
    scroll.innerHTML = '';

    const hero = document.createElement('header');
    hero.className = 'iphone-tb__me-hero';
    hero.innerHTML = `
      <span class="iphone-tb__me-avatar" aria-hidden="true"></span>
      <div class="iphone-tb__me-who">
        <p class="iphone-tb__me-name" data-me-name></p>
        <p class="iphone-tb__me-meta">${IPHONE_TAOBAO_ME.nick}｜${data.orders.length} 笔订单</p>
      </div>
      <button type="button" class="iphone-tb__me-setting" aria-label="设置">${icons.more}</button>
    `;
    hero.querySelector('[data-me-name]').textContent = displayName();
    // 头像位写昵称首字（真实淘宝没头像时是默认灰头像，这里用首字更有辨识度）
    hero.querySelector('.iphone-tb__me-avatar').textContent = displayName().slice(0, 1);
    scroll.appendChild(hero);

    const walletCard = document.createElement('button');
    walletCard.type = 'button';
    walletCard.className = 'iphone-tb__me-wallet';
    walletCard.innerHTML = `
      <span class="iphone-tb__me-wallet-ico" aria-hidden="true">${icons.wallet}</span>
      <span class="iphone-tb__me-wallet-info">
        <i>微信零钱</i>
        <b>¥${iphoneWechatMoney(wallet.balance)}</b>
      </span>
      <em>去微信零钱看看 ${icons.chevronRight}</em>
    `;
    walletCard.addEventListener('click', () => onOpenWallet?.());
    scroll.appendChild(walletCard);

    // 订单状态行：待付款 / 待发货 / 待收货 / 评价（计数从订单里派生）
    const states = [
      { key: 'unpaid', label: '待付款', count: 0 },
      { key: 'paid', label: '待发货', count: data.orders.filter((o) => o.status === 'paid').length },
      { key: 'shipped', label: '待收货', count: data.orders.filter((o) => o.status === 'shipped').length },
      { key: 'review', label: '评价', count: data.orders.filter((o) => o.status === 'done').length },
    ];
    const orderCard = document.createElement('section');
    orderCard.className = 'iphone-tb__me-orders';
    const orderHead = document.createElement('p');
    orderHead.className = 'iphone-tb__me-orders-head';
    orderHead.innerHTML = `<span>我的订单</span><button type="button" class="iphone-tb__me-more">查看全部 ${icons.chevronRight}</button>`;
    orderCard.appendChild(orderHead);
    const orderGrid = document.createElement('div');
    orderGrid.className = 'iphone-tb__me-order-grid';
    for (const state of states) {
      const cell = document.createElement('button');
      cell.type = 'button';
      cell.className = 'iphone-tb__me-order-cell';
      cell.innerHTML = `<span>${state.label}</span>${state.count ? `<i>${state.count}</i>` : ''}`;
      cell.addEventListener('click', () => onOpenOrders?.(state.key));
      orderGrid.appendChild(cell);
    }
    orderCard.appendChild(orderGrid);
    orderHead.querySelector('.iphone-tb__me-more').addEventListener('click', () => onOpenOrders?.('all'));
    scroll.appendChild(orderCard);

    const tools = document.createElement('section');
    tools.className = 'iphone-tb__me-tools';
    const rows = [
      { icon: 'star', label: '我的收藏', detail: `${data.products.filter((p) => p.starMine).length} 件` },
      { icon: 'history', label: '我的足迹', detail: `${data.products.length} 件` },
      { icon: 'cart', label: '购物车', detail: `${iphoneTaobaoCartCount(data)} 件` },
      { icon: 'refund', label: '退款 / 售后', detail: '' },
      { icon: 'service', label: '官方客服', detail: '' },
    ];
    for (const row of rows) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'iphone-tb__me-row';
      btn.innerHTML = `<span class="iphone-tb__me-row-ico" aria-hidden="true">${icons[row.icon]}</span><i>${row.label}</i><em>${row.detail || ''}</em>${icons.chevronRight}`;
      btn.addEventListener('click', () => {
        if (row.label === '购物车') onOpenOrders?.('cart');
        else if (row.label === '我的收藏' || row.label === '我的足迹') onOpenOrders?.(row.label === '我的收藏' ? 'star' : 'history');
        else onOpenWallet?.();
      });
      tools.appendChild(btn);
    }
    scroll.appendChild(tools);
  }

  page._render = render;
  return page;
}

// ---------- 订单列表（子页） ----------
// 待付款 / 待发货 / 待收货 / 评价 / 全部 + 收藏 / 足迹视图：同一个列表骨架，
// 按 key 换数据源。订单行可以「确认收货」（就地改状态并同步楼层）。
function iphoneTaobaoBuildOrdersView({ icons, screen, onClose, onOpenProduct }) {
  const view = document.createElement('div');
  view.className = 'iphone-tb__orders';
  view.innerHTML = `
    <header class="iphone-tb__orders-nav">
      <button type="button" class="iphone-tb__orders-back" aria-label="返回">${icons.back}</button>
      <p class="iphone-tb__orders-title" data-orders-title></p>
    </header>
    <div class="iphone-tb__orders-scroll"></div>
  `;
  const titleEl = view.querySelector('[data-orders-title]');
  const scrollEl = view.querySelector('.iphone-tb__orders-scroll');
  const KEY_LABEL = {
    all: '全部订单', unpaid: '待付款', paid: '待发货', shipped: '待收货', review: '待评价',
    star: '我的收藏', history: '我的足迹', cart: '购物车',
  };

  function render() {
    const key = view._key || 'all';
    titleEl.textContent = KEY_LABEL[key] || '订单';
    const data = iphoneGetTaobaoData();
    scrollEl.innerHTML = '';
    if (key === 'star' || key === 'history') {
      const list = key === 'star'
        ? data.products.filter((p) => p.starMine)
        : [...data.products].reverse();
      if (!list.length) {
        scrollEl.appendChild(iphoneTaobaoEmpty(icons, key === 'star' ? '还没有收藏的宝贝' : '还没有逛过的足迹'));
        return;
      }
      for (const product of list.slice(0, 40)) {
        scrollEl.appendChild(iphoneTaobaoBuildProductCard(product, onOpenProduct));
      }
      return;
    }
    if (key === 'cart') {
      const count = iphoneTaobaoCartCount(data);
      scrollEl.appendChild(iphoneTaobaoEmpty(icons, count ? `购物车里有 ${count} 件宝贝，去底部标签栏的购物车结算吧` : '购物车还是空的'));
      return;
    }
    const orders = data.orders.filter((order) => {
      if (key === 'unpaid') return false; // 下单即付款，没有待付款状态
      if (key === 'paid' || key === 'shipped') return order.status === key;
      if (key === 'review') return order.status === 'done';
      return true;
    }).reverse();
    if (!orders.length) {
      scrollEl.appendChild(iphoneTaobaoEmpty(icons, '这里还没有订单'));
      return;
    }
    for (const order of orders) {
      const row = document.createElement('article');
      row.className = 'iphone-tb__order';
      const head = document.createElement('p');
      head.className = 'iphone-tb__order-head';
      const headShop = document.createElement('span');
      headShop.textContent = order.product.shop || '淘宝店铺';
      const headStatus = document.createElement('i');
      headStatus.textContent = iphoneTaobaoOrderStatusLabel(order.status);
      head.append(headShop, headStatus);
      row.appendChild(head);
      const bodyEl = document.createElement('div');
      bodyEl.className = 'iphone-tb__order-body';
      const thumb = iphoneTaobaoBuildThumb(order.product);
      thumb.classList.add('iphone-tb__thumb--order');
      bodyEl.appendChild(thumb);
      const info = document.createElement('div');
      info.className = 'iphone-tb__order-info';
      const title = document.createElement('p');
      title.className = 'iphone-tb__order-title';
      title.textContent = order.product.title;
      const qty = document.createElement('p');
      qty.className = 'iphone-tb__order-qty';
      qty.textContent = `×${order.qty}`;
      info.append(title, qty);
      bodyEl.appendChild(info);
      const price = document.createElement('p');
      price.className = 'iphone-tb__order-price';
      price.innerHTML = `实付款 <b>¥${iphoneTaobaoPriceText(order.total)}</b>`;
      bodyEl.appendChild(price);
      row.appendChild(bodyEl);
      const foot = document.createElement('div');
      foot.className = 'iphone-tb__order-foot';
      foot.innerHTML = `
        <span class="iphone-tb__order-no">订单号 ${order.no}｜${iphoneTaobaoTimeLabel(order.ts)}</span>
        ${order.status === 'paid' ? '<button type="button" class="iphone-tb__order-btn" data-act="ship">模拟发货</button>' : ''}
        ${order.status === 'shipped' ? '<button type="button" class="iphone-tb__order-btn is-main" data-act="done">确认收货</button>' : ''}
        ${order.status === 'done' ? '<button type="button" class="iphone-tb__order-btn" data-act="buy">再买一单</button>' : ''}
      `;
      const shipBtn = foot.querySelector('[data-act="ship"]');
      if (shipBtn) {
        shipBtn.addEventListener('click', () => {
          const fresh = iphoneGetTaobaoData();
          const target = fresh.orders.find((o) => o.id === order.id);
          if (!target) return;
          target.status = 'shipped';
          iphoneSetTaobaoData(screen, fresh);
          void iphoneSyncTaobaoOrdersFloor();
          render();
        });
      }
      const doneBtn = foot.querySelector('[data-act="done"]');
      if (doneBtn) {
        doneBtn.addEventListener('click', () => {
          const fresh = iphoneGetTaobaoData();
          const target = fresh.orders.find((o) => o.id === order.id);
          if (!target) return;
          target.status = 'done';
          iphoneSetTaobaoData(screen, fresh);
          void iphoneSyncTaobaoOrdersFloor();
          render();
        });
      }
      const buyBtn = foot.querySelector('[data-act="buy"]');
      if (buyBtn) {
        buyBtn.addEventListener('click', () => {
          const fresh = iphoneGetTaobaoData();
          const product = fresh.products.find((p) => p.title === order.product.title) || order.product;
          onOpenProduct?.(product);
        });
      }
      row.appendChild(foot);
      row.addEventListener('click', (event) => {
        if (event.target.closest('button')) return;
        onOpenProduct?.(order.product);
      });
      scrollEl.appendChild(row);
    }
  }

  function iphoneTaobaoEmpty(iconSet, text) {
    const empty = document.createElement('div');
    empty.className = 'iphone-tb__empty';
    empty.innerHTML = `${iconSet.bag}<p>${text}</p>`;
    return empty;
  }

  view.querySelector('.iphone-tb__orders-back').addEventListener('click', () => onClose?.());
  view._open = (key) => {
    view._key = key || 'all';
    render();
    scrollEl.scrollTop = 0;
  };
  view._render = () => {
    if (view.classList.contains('is-open')) render();
  };
  return view;
}

// ---------- 应用主界面 ----------
// 骨架与小红书同构：listView（头部 + 内容面板 + 标签栏）在下，详情 / 搜索 / 订单
// 子页压在它上面的覆盖层。淘宝没有「我」的独立头部——顶部是频道条 + 搜索框，
// 所有 Tab 共用一个头部（搜索框常驻，与真实淘宝一致）。
function buildTaobaoAppScreen() {
  const icons = iphoneTaobaoIcons();
  const screen = document.createElement('div');
  screen.className = 'iphone-app iphone-tb';

  const listView = document.createElement('div');
  listView.className = 'iphone-tb__listview';

  const header = document.createElement('header');
  header.className = 'iphone-tb__header';

  const sheet = document.createElement('section');
  sheet.className = 'iphone-tb__sheet-area';

  const setOverlay = (open) => {
    screen.classList.toggle('is-tb-overlay', Boolean(open));
  };

  const productView = iphoneTaobaoBuildProductView({
    icons,
    screen,
    onClose: () => {
      productView.classList.remove('is-open');
      setOverlay(false);
    },
    onChanged: () => screen._renderTaobao?.(),
    onOpenCart: () => switchTaobaoTab(3),
  });

  const openProduct = (product) => {
    if (!product) return;
    productView._open(product);
    productView.classList.add('is-open');
    setOverlay(true);
  };

  const searchView = iphoneTaobaoBuildSearchView({
    icons,
    screen,
    onClose: () => {
      searchView.classList.remove('is-open');
      setOverlay(false);
    },
    onOpenProduct: openProduct,
  });

  const pageHome = iphoneTaobaoBuildHomePage({ icons, onOpenProduct: openProduct, screen });
  const pageCategory = iphoneTaobaoBuildCategoryPage({
    icons,
    onSearch: (word) => {
      searchView._open(word);
      searchView.classList.add('is-open');
      setOverlay(true);
    },
  });
  const pageMessages = iphoneTaobaoBuildMessagesPage({
    icons,
    onOpenProduct: openProduct,
    onOpenCart: () => switchTaobaoTab(3),
  });
  const pageCart = iphoneTaobaoBuildCartPage({
    icons,
    screen,
    onOpenProduct: openProduct,
    onChanged: () => screen._renderTaobao?.(),
  });
  const pageMe = iphoneTaobaoBuildMePage({
    icons,
    screen,
    onOpenOrders: (key) => {
      ordersView._open(key);
      ordersView.classList.add('is-open');
      setOverlay(true);
    },
    onOpenWallet: () => {
      // 「我的淘宝」里的零钱卡是入口不是页面：提示去微信看（真正的零钱页在微信里）
      const wallet = iphoneGetWechatWallet();
      screen.dispatchEvent(new CustomEvent('iphone-tb-toast', {
        detail: `微信零钱余额 ¥${iphoneWechatMoney(wallet.balance)}（去微信「我 → 服务 → 钱包 → 零钱」查看）`,
      }));
    },
    onChanged: () => screen._renderTaobao?.(),
  });
  const ordersView = iphoneTaobaoBuildOrdersView({
    icons,
    screen,
    onClose: () => {
      ordersView.classList.remove('is-open');
      setOverlay(false);
    },
    onOpenProduct: openProduct,
  });

  sheet.appendChild(pageHome);
  sheet.appendChild(pageCategory);
  sheet.appendChild(pageMessages);
  sheet.appendChild(pageCart);
  sheet.appendChild(pageMe);

  // 顶部：频道横滑条（推荐 / 包邮 / 3C数码…）+ 搜索框（点击进搜索页）
  function renderHeader() {
    header.innerHTML = `
      <nav class="iphone-tb__channels">
        ${IPHONE_TAOBAO_CHANNELS.map((name, i) => `<button type="button" class="iphone-tb__channel${i === 0 ? ' is-active' : ''}">${name}</button>`).join('')}
      </nav>
      <div class="iphone-tb__searchbar">
        <span class="iphone-tb__searchbar-ico" aria-hidden="true">${icons.search}</span>
        <button type="button" class="iphone-tb__searchbar-input">搜索宝贝</button>
        <span class="iphone-tb__searchbar-city">${IPHONE_TAOBAO_CITY_DEFAULT}${icons.chevronDown}</span>
      </div>
    `;
    header.querySelectorAll('.iphone-tb__channel').forEach((btn) => {
      btn.addEventListener('click', () => {
        header.querySelectorAll('.iphone-tb__channel').forEach((b) => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        pageHome._setChannel(btn.textContent.trim());
      });
    });
    header.querySelector('.iphone-tb__searchbar-input').addEventListener('click', () => {
      searchView._open('');
      searchView.classList.add('is-open');
      setOverlay(true);
    });
  }

  // 底部标签栏：首页 / 分类 / 消息 / 购物车 / 我的淘宝（购物车带角标）
  const tabs = [
    { key: 'home', label: '首页', icon: icons.home, page: pageHome },
    { key: 'category', label: '分类', icon: icons.category, page: pageCategory },
    { key: 'messages', label: '消息', icon: icons.message, page: pageMessages },
    { key: 'cart', label: '购物车', icon: icons.cart, page: pageCart },
    { key: 'me', label: '我的淘宝', icon: icons.me, page: pageMe },
  ];
  const tabbar = document.createElement('nav');
  tabbar.className = 'iphone-tb__tabbar';
  const tabButtons = [];
  tabs.forEach((tab, i) => {
    const el = document.createElement('button');
    el.type = 'button';
    el.className = `iphone-tb__tab${i === 0 ? ' is-active' : ''}`;
    el.dataset.tab = tab.key;
    el.innerHTML = `<span class="iphone-tb__tab-ico" aria-hidden="true">${tab.icon}</span><i>${tab.label}</i>`;
    el.addEventListener('click', () => {
      tabButtons.forEach((b) => b.classList.remove('is-active'));
      el.classList.add('is-active');
      tabs.forEach((t) => t.page?.classList.toggle('is-hidden', t.page !== tab.page));
      tab.page?._render?.();
    });
    tabButtons.push(el);
    tabbar.appendChild(el);
  });

  function switchTaobaoTab(index) {
    if (tabButtons[index]) tabButtons[index].click();
  }

  // 购物车角标：条目数，随数据刷新
  const syncCartBadge = () => {
    const count = iphoneTaobaoCartCount(iphoneGetTaobaoData());
    const cartBtn = tabButtons[3];
    let badge = cartBtn.querySelector('.iphone-tb__tab-badge');
    if (!count) {
      badge?.remove();
      return;
    }
    if (!badge) {
      badge = document.createElement('i');
      badge.className = 'iphone-tb__tab-badge';
      cartBtn.querySelector('.iphone-tb__tab-ico').appendChild(badge);
    }
    badge.textContent = String(count > 99 ? '99+' : count);
  };

  // 淘宝里的轻提示（「我的淘宝」的零钱说明等）：屏幕内浮一条，2 秒后消失
  const toast = document.createElement('p');
  toast.className = 'iphone-tb__toast';
  let toastTimer = 0;
  screen.addEventListener('iphone-tb-toast', (event) => {
    toast.textContent = String(event.detail || '');
    toast.classList.add('is-show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-show'), 2400);
  });

  listView.appendChild(header);
  listView.appendChild(sheet);
  listView.appendChild(tabbar);
  screen.appendChild(listView);
  screen.appendChild(productView);
  screen.appendChild(searchView);
  screen.appendChild(ordersView);
  screen.appendChild(toast);

  screen._renderTaobao = () => {
    pageHome._render();
    pageCategory._render();
    pageMessages._render();
    pageCart._render();
    pageMe._render();
    productView._render();
    ordersView._render();
    searchView._render();
    syncCartBadge();
  };
  // 给本地测试台（test.html）的深链用：切 Tab / 打开第 N 个商品 / 各覆盖层
  screen._switchTaobaoTab = switchTaobaoTab;
  screen._openTaobaoProduct = (index) => {
    const data = iphoneGetTaobaoData();
    const list = [...data.products].reverse();
    const product = list[Number(index) - 1];
    if (product) openProduct(product);
    return Boolean(product);
  };
  screen._openTaobaoSearch = (query) => {
    searchView._open(query || '');
    searchView.classList.add('is-open');
    setOverlay(true);
  };
  screen._openTaobaoOrders = (key) => {
    ordersView._open(key || 'all');
    ordersView.classList.add('is-open');
    setOverlay(true);
  };

  renderHeader();
  screen._renderTaobao();
  return screen;
}
