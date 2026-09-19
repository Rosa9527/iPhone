// ===== iPhone 第三方注入捕获：把别的扩展注入酒馆提示词的内容带进本插件的提示词 =====
//
// 背景：本插件的子请求（QQ / 微信 / 朋友圈 / 小红书）不经过酒馆生成管线（自己拼
// messages 直连 API），因此别的扩展（万华镜的 <Values> 变量、SoulLink 的 NPC 推理、
// World 的世界状态、生物追踪等）经 setExtensionPrompt 注册进酒馆主提示词的内容，
// 本插件的请求一律看不到——手机上聊天的模型于是不知道当前变量状态，与主线剧情脱节。
//
// 机制：SillyTavern / TauriTavern 的 setExtensionPrompt(key, value, position, depth,
// scan, role) 只是往宿主内部的 extension_prompts 注册表里写一条记录，
// getContext() 把这个注册表按 extensionPrompts 暴露出来（同一份活对象）。本模块
// 读它、按 position 过滤出「会进提示词正文」的条目，拼进本插件各请求的 system。
// 完全不认识任何具体扩展，也不需要对方配合——谁写的都读得到。
//
// 时机（关键）：万华镜这类扩展在 generationEnded 后会把注入清空，下一轮发送前才
// 重新注入。也就是说注册表里平时没有它那条，只有在「宿主正在组装主请求」的那一
// 刻才有内容。因此快照不能等用户点开手机时再取，而是在宿主事件里抓：
//   - chat_completion_prompt_ready（对话补全，eventData.chat 是最终消息数组）
//   - generate_after_combine_prompts（文本补全，eventData.prompt 是最终整串）
// 这两个事件在宿主拼完提示词、即将发请求时触发，此刻注册表里正是本轮注入。
// 抓到的快照留在内存（最近一次），手机发子请求时读它拼段。
//
// 第二条取材路径（实时读）：只在手机里聊天、从不往酒馆发消息时，宿主永远不组装主
// 提示词，上面两个事件永远不触发，快照就一直是空的。这类插件（常驻型：生物追踪、
// 世界引擎等）的特点是把注入长期留在注册表里，所以直接读当前注册表即可——不需要
// 认识任何具体插件，也不需要对方配合。
//
// 合并规则（iphoneInjectEffectiveEntries）：实时读到的条目打底，快照里的条目按
// 键补齐。即「同一键以实时值为准」——实时非空就是插件此刻要注入的版本；实时为空
// 或键已消失时保留快照里的上一份，好让只在手机里聊天的用户也能看到上一轮酒馆组装
// 时的注入（发送期注入只在「点发送 → 生成结束」之间存在，之后被扩展清空，不在快照
// 里留一份就永远看不到）。代价：插件关掉注入后，旧值会留到下一次酒馆组装为止——
// 这是通用机制下无法区分的（清空与关闭在注册表里都表现为空值），可接受。
//
// 不做什么：不去调其他插件的内部函数、不读它们的存储、不替它们跑发送前任务。
// 宿主以 <script type="module"> 加载扩展，顶层函数本来也拿不到（不挂 globalThis），
// 而各家私有接口/存储格式各不相同——按插件逐个适配既做不完也一改就坏。
//
// 过滤：只收「进正文」的位置（IN_PROMPT=0 / IN_CHAT=1），BEFORE_PROMPT=2 与
// NONE=-1 不算；空值与 filter() 返回 false 的条目跳过（与宿主的判定一致，见
// script.js 的 getAllExtensionPrompts / getExtensionPrompt）。
//
// 排除宿主的核心注入：世界书（并进作者注槽 2_floating_prompt 的条目、深度条目
// customDepthWI_*）、记忆 / 向量库 / 数据银行、DEPTH_PROMPT 系列等是酒馆自己每轮
// 注册的，不是「别的扩展」。世界书本插件已按自己的方式发（<world_info> 段），
// 再抄一遍只会重复占上下文、把真正想看的第三方内容（万华镜变量表）挤下去。
//
// 排除自身：本插件也会往注册表写东西（楼层同步等），用 IPHONE_INJECT_SELF_KEYS
// 里的键前缀挡掉，避免自己抄自己。
//
// 逐条排除（v0.32.0）：「设置 · 第三方注入」里每条前的勾选框，勾中 = 这条不随
// 手机请求附带。排除按条目键记在 settings.injectExcluded（纯配置、跨聊天共享）
// ——快照每轮都在换、内容也在变，键才是扩展的稳定身份；某个扩展本轮没跑，它的
// 键留在表里不碍事，下次注入进来照样是排除状态。见 iphoneInjectAttachableEntries。
//
// 默认排除（v1.0.1）：个别条目不必等玩家动手，检测到键名就直接按排除算——名单
// 在 IPHONE_INJECT_DEFAULT_EXCLUDED_KEYS（首个 baibai_book_time_tag：时间标签，
// 本插件的手机请求已自带「当前时间」上下文，再带一份属于重复背景）。玩家在设置
// 里取消勾选即恢复附带，选择记在 settings.injectIncludeOverrides（只收名单里的
// 键）覆盖出厂默认；「全部恢复附带」也按「全部都附带」处理，连默认排除的一并
// 恢复。
//
// 降级：宿主不暴露 extensionPrompts（本地 test.html 预览、或将来版本换了形状）时
// 静默跳过——快照为空，各请求与从前完全一样。

// 最近一次快照：{ ts, reason, entries: [{ key, value, position, depth }] }。
// 只在内存，不落盘（注入内容每轮都在变，存下来只会误导）。
let iphoneInjectSnapshot = null;

// 本插件自己注册进宿主的键（前缀）：捕获时跳过，别把自己的注入抄回来。
const IPHONE_INJECT_SELF_KEYS = Object.freeze(['iPhone_']);

// 宿主（酒馆本体）自己注册的注入键，不算「第三方」：
//   - 2_floating_prompt：作者注槽。世界书勾了「并进作者注」时，酒馆把
//     WI 条目拼进这个槽（见 world-info.js 的 shouldWIAddPrompt 分支），
//     所以它常常是一整块世界书内容，而非扩展注入。
//   - customDepthWI_<depth>_<role>：深度世界书条目（script.js 的 flushWIInjections）。
//   - customWIOutlet_*：世界书的 outlet 条目（走 NONE 位置，本就收不到，一并挡）。
//   - 1_memory / 3_vectors / 4_vectors_data_bank / DEPTH_PROMPT*：记忆、向量库、
//     数据银行、深度提示词槽，也都是核心功能而非第三方扩展。
// 这些内容要么本插件已按自己的方式发送（世界书 → <world_info> 段），要么属于
// 酒馆主请求的固有部分，抄进来只会重复占上下文。
const IPHONE_INJECT_HOST_KEYS = Object.freeze([
  '2_floating_prompt',
  '1_memory',
  '3_vectors',
  '4_vectors_data_bank',
  'chromadb',
  'PERSONA_DESCRIPTION',
  'QUIET_PROMPT',
]);
// 前缀式宿主键（带动态后缀）：自定义深度世界书 / 深度提示词槽 / outlet。
const IPHONE_INJECT_HOST_KEY_PREFIXES = Object.freeze([
  'customDepthWI',
  'customWIOutlet',
  'DEPTH_PROMPT',
]);

// 默认排除的条目键（v1.0.1）：检测到这些键的注入一律不随手机请求附带，不必等
// 玩家逐条勾选。首个 baibai_book_time_tag——时间标签，本插件的手机请求已自带
// 「当前时间」上下文（见 apps.js 各请求的「当前时间：…」），再带一份属于重复
// 背景。玩家仍可在「设置 · 第三方注入」里取消勾选恢复附带（选择记在
// settings.injectIncludeOverrides，覆盖这里的默认）；以后要新增默认排除项，
// 往这个数组里加键名即可。
const IPHONE_INJECT_DEFAULT_EXCLUDED_KEYS = Object.freeze([
  'baibai_book_time_tag',
]);

// 单条注入的保留上限：变量表这类内容通常几 KB，给足余量；离谱的大块（整本世界书
// 误注册成注入）截断，免得一条就吃掉整个上下文。
const IPHONE_INJECT_ENTRY_CAP = 20000;
// 拼进请求的总上限：多条注入合计截断，保证手机请求的 system 不至于爆掉。
const IPHONE_INJECT_TOTAL_CAP = 40000;

// ---------- 读取宿主注册表 ----------

// 取宿主的 extension_prompts 活对象；不暴露或形状不对时返回 null。
function iphoneInjectRegistry() {
  try {
    const ctx = iphoneGetContextSafe();
    const registry = ctx?.extensionPrompts;
    return registry && typeof registry === 'object' && !Array.isArray(registry) ? registry : null;
  } catch {
    return null;
  }
}

// 条目是否「会进提示词正文」：宿主只把 IN_PROMPT(0) / IN_CHAT(1) 两种位置拼进
// 提示词，BEFORE_PROMPT(2) 走别的通路、NONE(-1) 是清除标记，都不收。
function iphoneInjectIsInjectable(entry) {
  const position = Number(entry?.position);
  return position === 0 || position === 1;
}

// 本插件自己写的键（楼层同步 / 预设等）不捕获。
function iphoneInjectIsSelfKey(key) {
  return IPHONE_INJECT_SELF_KEYS.some((prefix) => String(key).startsWith(prefix));
}

// 宿主核心注入（世界书 / 作者注槽、记忆、向量库、深度提示词等）不捕获：
// 它们不是「别的扩展」，且世界书本插件已自带 <world_info> 段。
function iphoneInjectIsHostKey(key) {
  const name = String(key);
  if (IPHONE_INJECT_HOST_KEYS.includes(name)) return true;
  return IPHONE_INJECT_HOST_KEY_PREFIXES.some((prefix) => name.startsWith(prefix));
}

// 宿主对 filter() 的判定是「有 filter 且返回 false 才跳过」，可能是同步或异步。
// 捕获时同步取；返回 Promise 的（异步 filter）按 true 处理，宁可留着也别误删。
function iphoneInjectFilterPasses(entry) {
  const filter = entry?.filter;
  if (typeof filter !== 'function') return true;
  try {
    const result = filter();
    if (result && typeof result.then === 'function') return true;
    return !!result;
  } catch {
    return true;
  }
}

// 宿主在把注入拼进提示词前会做一次宏替换（openai.js 的 getPromptAssemblyExtensionPrompt
// 末尾调 substitutePromptParams），快照跟着替换，手机看到的才是主线模型真正看到的
// 那一份（{{user}} / {{char}} / 变量等已展开）。宿主不提供该 API 时原样保留。
function iphoneInjectSubstitute(text) {
  const raw = String(text ?? '');
  if (!raw) return '';
  try {
    const ctx = iphoneGetContextSafe();
    const substitute = typeof ctx?.substituteParams === 'function' ? ctx.substituteParams : null;
    if (!substitute) return raw;
    const result = substitute.call(ctx, raw);
    return typeof result === 'string' && result ? result : raw;
  } catch {
    return raw;
  }
}

// 从注册表按当前状态收集可注入条目（快照用）。返回按宿主拼装顺序（键名排序，
// 与 script.js 的 getExtensionPrompt sort() 一致）排列的数组。
function iphoneInjectCollectEntries() {
  const registry = iphoneInjectRegistry();
  if (!registry) return [];
  const entries = [];
  for (const key of Object.keys(registry).sort()) {
    if (iphoneInjectIsSelfKey(key)) continue;
    if (iphoneInjectIsHostKey(key)) continue;
    const entry = registry[key];
    if (!entry || typeof entry !== 'object') continue;
    const value = String(entry.value ?? '').trim();
    if (!value) continue;
    if (!iphoneInjectIsInjectable(entry)) continue;
    if (!iphoneInjectFilterPasses(entry)) continue;
    const resolved = iphoneInjectSubstitute(value);
    entries.push({
      key: String(key),
      value: resolved.length > IPHONE_INJECT_ENTRY_CAP ? `${resolved.slice(0, IPHONE_INJECT_ENTRY_CAP)}…（已截断）` : resolved,
      position: Number(entry.position),
      depth: Number(entry.depth) || 0,
    });
  }
  return entries;
}

// ---------- 快照 ----------

// 抓一份快照（宿主组装主提示词时调用）。返回是否抓到内容。
// dryRun（提示词管理器预览 / 干跑）不算：那种组装拿不到真实的本轮注入，抓到空会
// 把上一份有效快照冲掉——只更新，不清空。
function iphoneInjectCapture(reason, dryRun) {
  try {
    const entries = iphoneInjectCollectEntries();
    if (!entries.length) {
      if (dryRun) return false;
      // 本轮没有任何第三方注入：保留上一份也没意义（变量会变），清掉更干净，
      // 避免把上一轮的状态当成这一轮的。
      iphoneInjectSnapshot = null;
      return false;
    }
    iphoneInjectSnapshot = { ts: Date.now(), reason: String(reason || ''), entries };
    iphoneLog('debug', `捕获第三方注入 ${entries.length} 条（${entries.map((e) => e.key).join(', ')}）`);
    return true;
  } catch (error) {
    iphoneLog('warn', '捕获第三方注入失败', error);
    return false;
  }
}

function iphoneInjectGetSnapshot() {
  return iphoneInjectSnapshot;
}

// ---------- 实时读：当前注册表里有什么 ----------
//
// 与快照同源（iphoneInjectCollectEntries），区别只在时机：快照抓的是「宿主正在组装
// 主提示词」那一刻的注册表，这里读的是「手机要发请求」这一刻的注册表。常驻型扩展
// （注入长期留在注册表里）两条路都能看到；发送期扩展（发送前写入、生成结束清空）
// 只有快照那条能看到。
//
// 内容与格式完全由对方决定，本插件只负责搬运，不解析也不重写。

// 合并：实时读到的打底（同一键以它为准），快照里的按键补齐。
// 排序按 key，与宿主拼装顺序（script.js 的 getExtensionPrompt sort()）一致。
// 条目带 live 标记：true = 此刻注册表里的实时值，false = 上一轮快照里带过来的
// （发送期注入在被清空后只能这样取到），设置页据此标注新鲜度。
function iphoneInjectEffectiveEntries() {
  const live = iphoneInjectCollectEntries().map((entry) => ({ ...entry, live: true }));
  const liveKeys = new Set(live.map((entry) => entry.key));
  const snapshot = iphoneInjectSnapshot;
  const snapshotEntries = snapshot && Array.isArray(snapshot.entries) ? snapshot.entries : [];
  const carried = snapshotEntries
    .filter((entry) => !liveKeys.has(String(entry?.key ?? '')))
    .map((entry) => ({ ...entry, live: false }));
  const merged = live.concat(carried);
  merged.sort((a, b) => String(a?.key ?? '').localeCompare(String(b?.key ?? '')));
  return merged;
}

// 切换聊天 / 开新对话时清掉：快照里的变量状态属于上一个聊天，带进新聊天只会
// 让手机上聊天的模型看到别人的状态；新聊天首次发送前会有自己的捕获。
// 逐条排除表（settings.injectExcluded）不清：它记的是「哪个扩展的注入不要」，
// 与聊天内容无关，属于配置。
function iphoneInjectClearSnapshot() {
  iphoneInjectSnapshot = null;
}

// ---------- 逐条排除（v0.32.0）+ 默认排除（v1.0.1） ----------
//
// 设置页每条前的勾选框写这里：勾中 = 这条不随手机请求附带。
// 存的是条目键名数组（不是实时条目），键由各扩展自己决定、不随内容变，
// 所以扩展重开 / 内容更新后排除状态都还在。
//
// 排除状态有两个来源，逐条判定时合并（见 iphoneInjectIsExcluded）：
//   - settings.injectExcluded：玩家手动勾选的（任意键）；
//   - IPHONE_INJECT_DEFAULT_EXCLUDED_KEYS：出厂默认排除的键，玩家没有显式
//     恢复附带（settings.injectIncludeOverrides 里没有它）就按排除算。

// 是否属于默认排除名单。
function iphoneInjectIsDefaultExcludedKey(key) {
  return IPHONE_INJECT_DEFAULT_EXCLUDED_KEYS.includes(String(key));
}

// 排除键集合（设置里的数组 → Set，便于逐条查询）。
function iphoneInjectExcludedKeys() {
  const list = iphoneGetSettings().injectExcluded;
  return new Set(Array.isArray(list) ? list.map((key) => String(key)) : []);
}

// 玩家显式恢复附带的默认排除键集合（settings.injectIncludeOverrides → Set）。
// 只在「键属于默认名单」时有意义；普通条目排除与否只看 injectExcluded。
function iphoneInjectIncludeOverrides() {
  const list = iphoneGetSettings().injectIncludeOverrides;
  return new Set(Array.isArray(list) ? list.map((key) => String(key)) : []);
}

// 逐条判定：玩家排除表命中，或属于默认名单且未被显式恢复附带。
// excludedKeys / includeOverrides 可由调用方传入（同一批条目复用同一份 Set，
// 省得每条各建一次）；不传就现场读设置。
function iphoneInjectIsExcluded(key, excludedKeys, includeOverrides) {
  const name = String(key);
  if ((excludedKeys || iphoneInjectExcludedKeys()).has(name)) return true;
  if (!iphoneInjectIsDefaultExcludedKey(name)) return false;
  return !(includeOverrides || iphoneInjectIncludeOverrides()).has(name);
}

// 勾选 / 取消勾选一条（设置页调用）。excluded = true 表示不附带这条。
// 默认名单里的键两边都可能沾：勾选 = 记进排除表 + 从恢复表撤掉；
// 取消勾选 = 从排除表撤掉 + 记进恢复表（不然下次判定仍按默认排除算）。
// 两张表互斥，同一键不会同时存在于两边，计数也不会重复。
function iphoneInjectSetExcluded(key, excluded) {
  const settings = iphoneGetSettings();
  const list = Array.isArray(settings.injectExcluded) ? settings.injectExcluded.slice() : [];
  const included = Array.isArray(settings.injectIncludeOverrides) ? settings.injectIncludeOverrides.slice() : [];
  const name = String(key);
  const listIndex = list.indexOf(name);
  const includedIndex = included.indexOf(name);
  if (excluded) {
    if (listIndex < 0) list.push(name);
    if (includedIndex >= 0) included.splice(includedIndex, 1);
  } else {
    if (listIndex >= 0) list.splice(listIndex, 1);
    if (iphoneInjectIsDefaultExcludedKey(name) && includedIndex < 0) included.push(name);
  }
  settings.injectExcluded = list;
  settings.injectIncludeOverrides = included;
  iphoneSaveSettings(settings);
}

// 当前处于排除状态的键总数（设置页计数用）：
//   - 玩家排除表里的键，含幽灵键（扩展卸载后遗留的）——「全部恢复附带」按钮
//     的可见性以它为准，不然幽灵键就没法清掉了；
//   - 默认名单里未被恢复附带、且本轮真出现在合并列表里的键。没装对应扩展的
//     玩家不该看到凭空的「排除 1」，所以不出现在列表里的默认键不计。
// 与逐条判定同源（用户排除过的默认键只算一次）。
function iphoneInjectCountExcluded() {
  const names = iphoneInjectExcludedKeys();
  const included = iphoneInjectIncludeOverrides();
  const present = new Set(iphoneInjectEffectiveEntries().map((entry) => String(entry?.key ?? '')));
  for (const key of IPHONE_INJECT_DEFAULT_EXCLUDED_KEYS) {
    if (present.has(key) && !included.has(key)) names.add(key);
  }
  return names.size;
}

// 清掉全部排除（「全部恢复附带」按钮）。按钮叫「全部」恢复附带，点了之后列表里
// 不该再有划掉的名字：玩家排除表清空之外，默认名单也整体记入恢复表（覆盖出厂
// 默认）。之后想恢复某条的默认排除，在列表里重新勾上即可。
function iphoneInjectClearExcluded() {
  const settings = iphoneGetSettings();
  settings.injectExcluded = [];
  settings.injectIncludeOverrides = IPHONE_INJECT_DEFAULT_EXCLUDED_KEYS.slice();
  iphoneSaveSettings(settings);
}

// 本次请求「将要附带」的条目：实时 + 快照合并的结果，再减去被排除的
// （玩家逐条排除 + 未被恢复附带的默认排除项）。
// 设置页预览与各请求拼段都走这里，两边看到的永远是同一份。
function iphoneInjectAttachableEntries() {
  const excludedKeys = iphoneInjectExcludedKeys();
  const includeOverrides = iphoneInjectIncludeOverrides();
  return iphoneInjectEffectiveEntries()
    .filter((entry) => !iphoneInjectIsExcluded(String(entry?.key ?? ''), excludedKeys, includeOverrides));
}

// ---------- 拼段 ----------

// 取「本次请求要附带」的注入段文本；未开启 / 无内容时返回 ''。
// settings.injectCapture 为「设置 · 第三方注入」里的开关（默认开启：捕获的内容
// 本身就来自玩家已启用的扩展，本插件只是把它带给手机上的对话）。
function iphoneInjectBuildSection() {
  if (!iphoneInjectCaptureEnabled()) return '';
  const entries = iphoneInjectAttachableEntries();
  if (!entries.length) return '';
  const lines = [];
  let total = 0;
  for (const entry of entries) {
    const text = String(entry?.value ?? '').trim();
    if (!text) continue;
    if (total + text.length > IPHONE_INJECT_TOTAL_CAP) break;
    total += text.length;
    lines.push(text);
  }
  return lines.join('\n\n');
}

// 拼成 system 里的一段（带标签与介绍行），无内容返回 ''。
//
// 措辞要点（这段内容与插件的其他段性质不同，不能只丢个标签就了事）：
// 1) 定位：告诉模型这是「其他扩展提供的背景信息」，而不是台词或旁白——不提
//    「酒馆主提示词」「注入」这类实现细节，模型不需要知道这套管线；
// 2) 用法：是既成事实，角色处境 / 关系 / 剧情进展要与之一致；
// 3) 禁止：内容多是「好感度: 42」「体力: 78/100」这种状态数据，必须明确说
//    不要直接念进对话、不要提起这份资料本身，否则模型会把 YAML 抄进聊天里。
// 标签用 <context_injection>：内容来自别的扩展、格式由对方决定（万华镜是 YAML、
// SoulLink 是推理文本），本插件不解析、不裁剪，原样带给模型。
function iphoneInjectSystemPart(body) {
  const text = String(body ?? '');
  if (!text) return '';
  return '以下是其他扩展为当前剧情提供的背景信息（如变量状态、数值与剧情事件，'
    + '格式由各扩展自行决定，已原样带给你）。把它们当作既成事实：角色的处境、'
    + '关系与剧情进展都要与之相符；但不要把这些数值或标签直接念进对话，'
    + '也不要向玩家提起这份资料本身：\n'
    + `<context_injection>\n${text}\n</context_injection>`;
}

// 结构说明行（拼进【提示词结构说明】的条目列表），无内容返回 ''。
function iphoneInjectOutlineItem(body) {
  if (!String(body ?? '')) return '';
  return '<context_injection>…</context_injection>：其他扩展提供的当前状态与剧情背景（变量、数值、剧情事件）——按它来演，但不要直接引用或提及；';
}

// 各提示词组装点用这一个入口：一次算出「system 段 + 结构说明行」，没有内容时
// 返回 null（调用方据此跳过）。body 只算一次，避免两次拼接开销。
function iphoneInjectPromptParts() {
  const body = iphoneInjectBuildSection();
  if (!body) return null;
  return {
    system: iphoneInjectSystemPart(body),
    outline: iphoneInjectOutlineItem(body),
  };
}

// ---------- 设置 ----------

function iphoneInjectCaptureEnabled() {
  const value = iphoneGetSettings().injectCaptureEnabled;
  return value === undefined ? true : !!value;
}

// ---------- 宿主事件订阅 ----------

// 两个「提示词就绪」事件：对话补全（chat 数组）与文本补全（整串）。事件在本轮
// 拼接完成后、发请求前触发，此刻注册表里正是本轮注入。
// 宿主事件源可能晚于装配就绪，按 main.js 的惯例重试订阅。
function iphoneInjectEnsureSubscriptions(retries = 10) {
  const ctx = iphoneGetContextSafe();
  if (!ctx?.eventSource) {
    if (retries > 0) {
      setTimeout(() => iphoneInjectEnsureSubscriptions(retries - 1), 1000);
    }
    return;
  }
  const chatReady = iphoneOnHostEvent(ctx, 'CHAT_COMPLETION_PROMPT_READY', (eventData) => {
    iphoneInjectCapture('chat_completion_prompt_ready', eventData?.dryRun);
  }, 'inject_chat_ready');
  const textReady = iphoneOnHostEvent(ctx, 'GENERATE_AFTER_COMBINE_PROMPTS', (eventData) => {
    iphoneInjectCapture('generate_after_combine_prompts', eventData?.dryRun);
  }, 'inject_text_ready');
  if (chatReady || textReady) {
    iphoneLog('info', '已订阅提示词就绪事件（捕获第三方扩展的提示词注入）');
    // 切聊天 / 开新对话：快照属于上一个聊天，清掉（见 iphoneInjectClearSnapshot）。
    iphoneOnHostEvent(ctx, 'CHAT_CHANGED', () => iphoneInjectClearSnapshot(), 'inject_chat_changed');
    return;
  }
  if (retries > 0) setTimeout(() => iphoneInjectEnsureSubscriptions(retries - 1), 1000);
  else iphoneLog('warn', '未能订阅提示词就绪事件：手机请求不带第三方扩展的注入内容');
}

// 本轮的注入内容在生成结束后会被各扩展自行清空，快照留到下一次捕获即可——
// 手机子请求大多发生在主生成之后，正好用得上上一轮的注入；新一轮捕获会覆盖。
iphoneInjectEnsureSubscriptions();
