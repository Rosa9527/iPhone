// ===== 微信应用（v0.18.0）：与 QQ 平行的一套仿真 =====
// 功能对齐 QQ：我的资料（昵称 / 微信号 / 头像，内置款式 + 上传 + 链接）、添加好友 /
// 创建群聊、好友资料、群资料（改名 / 换头像 / 拉人入群 / 清空消息 / 删除）、
// 消息列表、私聊与群聊（AI 接入）、单条删除与清空、朋友圈（下拉刷新生成动态、
// 点赞评论、玩家留言后 AI 回复）、iPhone_Message 楼层同步、设置里的三组提示词。
// 复用 QQ 已建好的基础设施：host.js 的上下文 / 存储 / 对话 API / 楼层读写、
// apps.js 的头像选择器与资料页范式、世界书引擎与宏解析。
// 数据独立：chatMetadata.IPhone 的 wechatData / wechatProfile（与 QQ 的
// qqData / qqProfile 并列），换聊天自动切换。

// ---------- 微信图形（手绘 SVG，24×24 viewBox，描边风格对齐微信） ----------
function iphoneWechatIcons() {
  return {
    // 底部标签栏：微信（双气泡）/ 通讯录（人形）/ 发现（指南针）/ 我（单人）
    chat: '<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="currentColor"><path d="M9.4 3.2C5.2 3.2 1.8 6 1.8 9.5c0 2 1.1 3.8 2.9 5l-.7 2.8c-.1.4.3.7.7.5l3-1.5c.55.12 1.1.18 1.7.18.3 0 .6-.02.9-.05-.35-.72-.55-1.5-.55-2.33 0-3.3 3.1-5.9 7-5.9.2 0 .4 0 .6.02-.7-2.9-3.8-5.07-7.9-5.07z"/><circle cx="6.6" cy="8.6" r="1.15" fill="#fff"/><circle cx="12.2" cy="8.6" r="1.15" fill="#fff"/><path d="M16.1 8.6c-3.4 0-6.1 2.2-6.1 4.9 0 2.7 2.7 4.9 6.1 4.9.5 0 1-.06 1.5-.16l2.6 1.3c.35.18.75-.13.63-.5l-.55-2.2c1.5-1 2.42-2.5 2.42-4.14 0-2.7-2.7-4.9-6.1-4.9z"/><circle cx="14" cy="12.6" r="1" fill="#fff"/><circle cx="18.4" cy="12.6" r="1" fill="#fff"/></g></svg>',
    contacts: '<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4.2" y="2.8" width="15.6" height="18.4" rx="2.4"/><circle cx="12" cy="9.4" r="2.6"/><path d="M7.6 18.2c.5-1.9 2.3-3 4.4-3s3.9 1.1 4.4 3"/><path d="M1.6 8h2.6M1.6 12h2.6M1.6 16h2.6"/></g></svg>',
    discover: '<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><circle cx="12" cy="12" r="8.6"/><path d="m15.9 8.1-2.1 5.7-5.7 2.1 2.1-5.7z"/></g></svg>',
    me: '<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="7.8" r="3.8"/><path d="M4.4 20c0-3.9 3.4-6.1 7.6-6.1s7.6 2.2 7.6 6.1"/></g></svg>',
    // 通讯录功能行：新的朋友 / 群聊 / 标签 / 公众号
    friendNew: '<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="9.6" cy="8" r="3.5"/><path d="M3.6 19.4c0-3.5 2.7-5.5 6-5.5 1.4 0 2.7.4 3.8 1"/><path d="M18 13.4v5.4M15.3 16.1h5.4"/></g></svg>',
    groupChat: '<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="8.6" cy="8.6" r="3"/><circle cx="15.8" cy="9.6" r="2.3"/><path d="M3.4 18.6c0-2.8 2.2-4.6 5.2-4.6s5.2 1.8 5.2 4.6"/><path d="M16.2 14.4c2 .3 3.4 1.8 3.4 3.9"/></g></svg>',
    tag: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11.4 3.4H5.2a1.8 1.8 0 0 0-1.8 1.8v6.2c0 .48.19.94.53 1.27l7.4 7.4a1.8 1.8 0 0 0 2.54 0l6.2-6.2a1.8 1.8 0 0 0 0-2.54l-7.4-7.4a1.8 1.8 0 0 0-1.27-.53z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><circle cx="8.4" cy="8.4" r="1.35" fill="currentColor"/></svg>',
    official: '<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5.6h16v11.4H9.2L5.4 20.4v-3.4H4z"/><path d="M8.2 9.6h7.6M8.2 12.8h5"/></g></svg>',
    // 发现页功能行：朋友圈 / 视频号 / 扫一扫 / 看一看 / 搜一搜 / 直播 / 购物 / 游戏
    moments: '<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="2.2"/><circle cx="12" cy="4.6" r="1.8"/><circle cx="18.3" cy="8.2" r="1.8"/><circle cx="18.3" cy="15.8" r="1.8"/><circle cx="12" cy="19.4" r="1.8"/><circle cx="5.7" cy="15.8" r="1.8"/><circle cx="5.7" cy="8.2" r="1.8"/></g></svg>',
    channels: '<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3.4" y="5.4" width="17.2" height="13.2" rx="3"/><path d="m10.3 9.2 4.6 2.8-4.6 2.8z"/></g></svg>',
    scan: '<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><path d="M3.6 8.4V5.4a1.8 1.8 0 0 1 1.8-1.8h3"/><path d="M15.6 3.6h3a1.8 1.8 0 0 1 1.8 1.8v3"/><path d="M20.4 15.6v3a1.8 1.8 0 0 1-1.8 1.8h-3"/><path d="M8.4 20.4h-3a1.8 1.8 0 0 1-1.8-1.8v-3"/><path d="M3.6 12h16.8"/></g></svg>',
    look: '<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M2.6 12S6.2 6.2 12 6.2 21.4 12 21.4 12 17.8 17.8 12 17.8 2.6 12 2.6 12z"/><circle cx="12" cy="12" r="2.6"/></g></svg>',
    search: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="5.6" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M15.1 15.1l4.2 4.2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    live: '<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="3"/><path d="M7.4 7.4a6.5 6.5 0 0 0 0 9.2M16.6 7.4a6.5 6.5 0 0 1 0 9.2"/><path d="M4.6 4.6a10.4 10.4 0 0 0 0 14.8M19.4 4.6a10.4 10.4 0 0 1 0 14.8"/></g></svg>',
    shopping: '<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4.6 8h14.8l-1.2 11.2a1.8 1.8 0 0 1-1.8 1.6H7.6a1.8 1.8 0 0 1-1.8-1.6z"/><path d="M8.6 10.4V6.6a3.4 3.4 0 0 1 6.8 0v3.8"/></g></svg>',
    games: '<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7.6 8.6h8.8a5 5 0 0 1 4.9 5.9l-.4 2.1a2.6 2.6 0 0 1-4.6 1.1l-1-1.3H8.7l-1 1.3a2.6 2.6 0 0 1-4.6-1.1l-.4-2.1a5 5 0 0 1 4.9-5.9z"/><path d="M8.4 11.8v3M6.9 13.3h3"/><circle cx="15.6" cy="12.6" r="1.05" fill="currentColor" stroke="none"/><circle cx="17.6" cy="14.4" r="1.05" fill="currentColor" stroke="none"/></g></svg>',
    // 我页面功能行：服务 / 收藏 / 朋友圈 / 卡包 / 表情 / 设置
    service: '<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3.4" y="4.6" width="17.2" height="15" rx="2.6"/><path d="M7.6 9.4h3.2M7.6 12.6h3.2M13.6 9.4h2.8M13.6 12.6h2.8M7.6 16h8.8"/></g></svg>',
    fav: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4.2l2.35 4.76 5.25.77-3.8 3.7.9 5.23L12 16.2l-4.7 2.46.9-5.23-3.8-3.7 5.25-.77z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
    card: '<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><rect x="3.2" y="5.6" width="17.6" height="12.8" rx="2.6"/><path d="M3.2 10h17.6"/><path d="M7 14.8h4"/></g></svg>',
    emoji: '<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="8.2"/><path d="M9.2 9.9v1.4M14.8 9.9v1.4"/><path d="M8.6 14.1c.9 1.4 2.1 2.1 3.4 2.1s2.5-.7 3.4-2.1"/></g></svg>',
    settings: '<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3.1"/><path d="M19.3 14.5a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1.03 1.56V21a2 2 0 1 1-4 0v-.09A1.7 1.7 0 0 0 8.8 19.3a1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.56-1.03H2.8a2 2 0 1 1 0-4h.09A1.7 1.7 0 0 0 4.45 8.8a1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.87.34H8.9a1.7 1.7 0 0 0 1.03-1.56V2.8a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1.03 1.56 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87v.01a1.7 1.7 0 0 0 1.56 1.03h.09a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.56 1.03z"/></g></svg>',
    // 通用：返回 / 加号 / 右箭头 / 更多 / 相机 / 表情
    back: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 4.6 7.6 12l7.4 7.4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    plus: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4.8v14.4M4.8 12h14.4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
    chevronRight: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9.5 5.5 6.5 6.5-6.5 6.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    more: '<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="currentColor"><circle cx="5.2" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="18.8" cy="12" r="1.6"/></g></svg>',
    camera: '<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M8.7 6.8 10 4.6h4l1.3 2.2"/><rect x="3.4" y="6.8" width="17.2" height="13" rx="3"/><circle cx="12" cy="13" r="3.3"/></g></svg>',
    smiley: '<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="8.2"/><path d="M9.1 9.6v1.5M14.9 9.6v1.5"/><path d="M8.4 13.9c.9 1.5 2.2 2.3 3.6 2.3s2.7-.8 3.6-2.3"/></g></svg>',
    mic: '<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="9.2" y="2.8" width="5.6" height="10.2" rx="2.8"/><path d="M5.8 11.2c0 3.5 2.8 5.9 6.2 5.9s6.2-2.4 6.2-5.9"/><path d="M12 17.2v3.4"/></g></svg>',
    plusCircle: '<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="12" cy="12" r="8.6"/><path d="M12 8v8M8 12h8"/></g></svg>',
    // 头像裁剪滑杆两端：缩小 / 放大（放大镜内加减号，与 QQ 同款图形）
    zoomOut: '<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="10.8" cy="10.8" r="5.6"/><path d="M15.1 15.1l4.2 4.2"/><path d="M8.4 10.8h4.8"/></g></svg>',
    zoomIn: '<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="10.8" cy="10.8" r="5.6"/><path d="M15.1 15.1l4.2 4.2"/><path d="M8.4 10.8h4.8M10.8 8.4v4.8"/></g></svg>',
    // 朋友圈：心形点赞 / 评论 / 相机（朋友圈头部）
    heart: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.2S3.4 15.4 3.4 9.4a4.7 4.7 0 0 1 8.6-2.7 4.7 4.7 0 0 1 8.6 2.7c0 6-8.6 10.8-8.6 10.8z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
    heartFill: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.2S3.4 15.4 3.4 9.4a4.7 4.7 0 0 1 8.6-2.7 4.7 4.7 0 0 1 8.6 2.7c0 6-8.6 10.8-8.6 10.8z" fill="currentColor"/></svg>',
    comment: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4.6c-4.8 0-8.2 3-8.2 7 0 2.2 1.1 4.1 2.9 5.3l-.7 3c-.1.5.4.9.8.6l3.3-1.8c.6.1 1.2.2 1.9.2 4.8 0 8.2-3 8.2-7.3s-3.4-7-8.2-7z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>',
    commentFill: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4.6c-4.8 0-8.2 3-8.2 7 0 2.2 1.1 4.1 2.9 5.3l-.7 3c-.1.5.4.9.8.6l3.3-1.8c.6.1 1.2.2 1.9.2 4.8 0 8.2-3 8.2-7.3s-3.4-7-8.2-7z" fill="currentColor"/></svg>',
    // 「我」页面：二维码 / 二维码名片 / 右箭头小
    qr: '<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><rect x="3.6" y="3.6" width="6.4" height="6.4" rx="1.2"/><rect x="14" y="3.6" width="6.4" height="6.4" rx="1.2"/><rect x="3.6" y="14" width="6.4" height="6.4" rx="1.2"/><path d="M14 14h2.8v2.8H14zM17.6 17.6h2.8v2.8h-2.8zM14 20.4h1.2M20.4 14h-1.2"/></g></svg>',
    // 朋友圈发表页：定位 / 提醒谁看 / 谁可以看
    location: '<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M12 21s-6.4-5.3-6.4-10.4a6.4 6.4 0 0 1 12.8 0C18.4 15.7 12 21 12 21z"/><circle cx="12" cy="10.4" r="2.4"/></g></svg>',
    at: '<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M16 8v5a2.6 2.6 0 0 0 5.2 0V12a9.2 9.2 0 1 0-3.6 7.3"/></g></svg>',
    lock: '<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><rect x="5.2" y="10.4" width="13.6" height="9.4" rx="2.4"/><path d="M8.2 10.4V7.8a3.8 3.8 0 0 1 7.6 0v2.6"/></g></svg>',
    // 语音消息：声波
    voice: '<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4.6 10.2v3.6M8.4 7.8v8.4M12 5.6v12.8M15.6 7.8v8.4M19.4 10.2v3.6"/></g></svg>',
    // 聊天「+」面板图标（v0.24.0）：实心款路径取自 GitHub tabler/tabler-icons
    //（MIT，见 README「素材来源」）；红包与转账两枚手绘（Tabler 无对应实心图形）。
    album: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8.813 11.612c.457 -.38 .918 -.38 1.386 .011l.108 .098l4.986 4.986l.094 .083a1 1 0 0 0 1.403 -1.403l-.083 -.094l-1.292 -1.293l.292 -.293l.106 -.095c.457 -.38 .918 -.38 1.386 .011l.108 .098l4.674 4.675a4 4 0 0 1 -3.775 3.599l-.206 .005h-12a4 4 0 0 1 -3.98 -3.603l6.687 -6.69l.106 -.095zm9.187 -9.612a4 4 0 0 1 3.995 3.8l.005 .2v9.585l-3.293 -3.292l-.15 -.137c-1.256 -1.095 -2.85 -1.097 -4.096 -.017l-.154 .14l-.307 .306l-2.293 -2.292l-.15 -.137c-1.256 -1.095 -2.85 -1.097 -4.096 -.017l-.154 .14l-5.307 5.306v-9.585a4 4 0 0 1 3.8 -3.995l.2 -.005h12zm-2.99 5l-.127 .007a1 1 0 0 0 0 1.986l.117 .007l.127 -.007a1 1 0 0 0 0 -1.986l-.117 -.007z" fill="currentColor"/></svg>',
    cameraFill: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 3a2 2 0 0 1 1.995 1.85l.005 .15a1 1 0 0 0 .883 .993l.117 .007h1a3 3 0 0 1 2.995 2.824l.005 .176v9a3 3 0 0 1 -2.824 2.995l-.176 .005h-14a3 3 0 0 1 -2.995 -2.824l-.005 -.176v-9a3 3 0 0 1 2.824 -2.995l.176 -.005h1a1 1 0 0 0 1 -1a2 2 0 0 1 1.85 -1.995l.15 -.005h6zm-3 7a3 3 0 0 0 -2.985 2.698l-.011 .152l-.004 .15l.004 .15a3 3 0 1 0 2.996 -3.15z" fill="currentColor"/></svg>',
    videoCall: '<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="currentColor"><path d="M20.117 7.625a1 1 0 0 0 -.564 .1l-4.553 2.275v4l4.553 2.275a1 1 0 0 0 1.447 -.892v-6.766a1 1 0 0 0 -.883 -.992z" /><path d="M5 5c-1.645 0 -3 1.355 -3 3v8c0 1.645 1.355 3 3 3h8c1.645 0 3 -1.355 3 -3v-8c0 -1.645 -1.355 -3 -3 -3z" /></g></svg>',
    locationFill: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18.364 4.636a9 9 0 0 1 .203 12.519l-.203 .21l-4.243 4.242a3 3 0 0 1 -4.097 .135l-.144 -.135l-4.244 -4.243a9 9 0 0 1 12.728 -12.728zm-6.364 3.364a3 3 0 1 0 0 6a3 3 0 0 0 0 -6" fill="currentColor"/></svg>',
    gift: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 14v8h-4a3 3 0 0 1 -3 -3v-4a1 1 0 0 1 1 -1h6zm8 0a1 1 0 0 1 1 1v4a3 3 0 0 1 -3 3h-4v-8h6zm-2.5 -12a3.5 3.5 0 0 1 3.163 5h.337a2 2 0 0 1 2 2v1a2 2 0 0 1 -2 2h-7v-5h-2v5h-7a2 2 0 0 1 -2 -2v-1a2 2 0 0 1 2 -2h.337a3.486 3.486 0 0 1 -.337 -1.5c0 -1.933 1.567 -3.5 3.483 -3.5c1.755 -.03 3.312 1.092 4.381 2.934l.136 .243c1.033 -1.914 2.56 -3.114 4.291 -3.175l.209 -.002zm-9 2a1.5 1.5 0 0 0 0 3h3.143c-.741 -1.905 -1.949 -3.02 -3.143 -3zm8.983 0c-1.18 -.02 -2.385 1.096 -3.126 3h3.143a1.5 1.5 0 1 0 -.017 -3z" fill="currentColor"/></svg>',
    redPacket: '<svg viewBox="0 0 24 24" aria-hidden="true"><g><rect x="4.2" y="2.8" width="15.6" height="18.4" rx="2.6" fill="currentColor"/><path d="M4.6 9.4c3.1 0 5.4 1.3 6.6 3.7a2.4 2.4 0 0 0 4.2 0c1.2 -2.4 3.5 -3.7 6.6 -3.7" fill="none" stroke="#fff" stroke-width="1.8"/></g></svg>',
    // 转账：两枚实心箭头（「+」面板用）
    transfer: '<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="currentColor"><path d="M13.06 4.9a1 1 0 0 1 1.42 -1.41l3.9 3.9a1 1 0 0 1 0 1.41l-3.9 3.9a1 1 0 1 1 -1.42 -1.41l2.2 -2.2H4.5a1 1 0 0 1 0 -2h10.66z"/><path d="M10.94 19.1a1 1 0 0 1 -1.42 1.41l-3.9 -3.9a1 1 0 0 1 0 -1.41l3.9 -3.9a1 1 0 1 1 1.42 1.41l-2.2 2.2h10.76a1 1 0 0 1 0 2H8.74z"/></g></svg>',
    // 转账气泡图标（v0.24.2，按微信截图逐像素量过再手绘）：白描圆内双向箭头
    //（上行箭头朝左、下行朝右，各带一条 45° 箭羽；圆环与箭杆同粗）/ 对勾（已收款）
    transferCircle: '<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><circle cx="12" cy="12" r="11.3"/><path d="M5.95 10.15H17.5M5.95 10.15 10.05 6.7M5.95 13.85h11.9M17.85 13.85l-4.5 3.3"/></g></svg>',
    transferCheck: '<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="11.3"/><path d="m7.1 12.6 3.9 3.9 6.7-7.1"/></g></svg>',
    micFill: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 9a1 1 0 0 1 1 1a8 8 0 0 1 -6.999 7.938l-.001 2.062h3a1 1 0 0 1 0 2h-8a1 1 0 0 1 0 -2h3v-2.062a8 8 0 0 1 -7 -7.938a1 1 0 1 1 2 0a6 6 0 0 0 12 0a1 1 0 0 1 1 -1m-7 -8a4 4 0 0 1 4 4v5a4 4 0 1 1 -8 0v-5a4 4 0 0 1 4 -4" fill="currentColor"/></svg>',
    backspace: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 5a2 2 0 0 1 1.995 1.85l.005 .15v10a2 2 0 0 1 -1.85 1.995l-.15 .005h-11a1 1 0 0 1 -.608 -.206l-.1 -.087l-5.037 -5.04c-.809 -.904 -.847 -2.25 -.083 -3.23l.12 -.144l5 -5a1 1 0 0 1 .577 -.284l.131 -.009h11zm-7.489 4.14a1 1 0 0 0 -1.301 1.473l.083 .094l1.292 1.293l-1.292 1.293l-.083 .094a1 1 0 0 0 1.403 1.403l.094 -.083l1.293 -1.292l1.293 1.292l.094 .083a1 1 0 0 0 1.403 -1.403l-.083 -.094l-1.292 -1.293l1.292 -1.293l.083 -.094a1 1 0 0 0 -1.403 -1.403l-.094 .083l-1.293 1.292l-1.293 -1.292l-.094 -.083l-.102 -.07z" fill="currentColor"/></svg>',
  };
}

// ---------- 微信数据（我的资料 / 联系人 / 群聊 / 朋友圈） ----------
// 与 QQ 的 qqProfile / qqData 平行：存 chatMetadata.IPhone 的
// wechatProfile / wechatData，结构逐字段对应（friend / group / dynamic / messages /
// floorSynced / dynamicsFloorSynced），归一化规则也一致——两套数据各自的
// 归一化函数互不影响，共用 host.js 的存储与楼层机制。
const IPHONE_WECHAT_USER_MACRO = IPHONE_QQ_USER_MACRO;

// 归一化微信头像（内置款式见 IPHONE_ME_AVATAR_PRESETS，与 QQ / 小红书同一份；me 等价于默认）。
function iphoneNormalizeWechatAvatar(raw) {
  if (!raw || typeof raw !== 'object') return null;
  const preset = String(raw.preset || '').trim();
  if (preset && preset !== 'me' && IPHONE_ME_AVATAR_PRESETS.some((p) => p.id === preset)) {
    return { preset };
  }
  const url = String(raw.url || '').trim();
  if (/^(https?:\/\/|data:image\/)/i.test(url) && url.length <= 400000) return { url };
  return null;
}

function iphoneNormalizeWechatProfile(raw) {
  const source = raw && typeof raw === 'object' ? raw : {};
  return {
    name: String(source.name || '').trim().slice(0, 24),
    wxId: String(source.wxId || '').trim().slice(0, 32),
    avatar: iphoneNormalizeWechatAvatar(source.avatar),
  };
}

// 取「我」的微信资料（随聊天文件存取）：昵称默认跟随酒馆 {{user}}，微信号留空
// 回退占位演示值；顺手把脏数据写回聊天文件。
function iphoneGetWechatProfile() {
  const storage = iphoneGetQqStorage();
  const normalized = iphoneNormalizeWechatProfile(storage.wechatProfile);
  const raw = storage.wechatProfile && typeof storage.wechatProfile === 'object' ? storage.wechatProfile : {};
  if (JSON.stringify(normalized) !== JSON.stringify(iphoneNormalizeWechatProfile(raw))) {
    storage.wechatProfile = normalized;
    iphoneSaveQqStorage();
  }
  return {
    name: normalized.name || iphoneGetTavernUserName() || IPHONE_WECHAT_ME_FALLBACK_NAME,
    wxId: normalized.wxId || IPHONE_WECHAT_ME.wxId,
    avatar: normalized.avatar,
  };
}

function iphoneGetWechatCustomNick() {
  return iphoneNormalizeWechatProfile(iphoneGetQqStorage().wechatProfile).name;
}

// 玩家在微信数据（评论作者 / 被回复人）里的署名：与 QQ 同一套规则——填过自定义
// 昵称用昵称，否则写 {{user}} 宏本体，楼层与提示词组装时才解析成人设名。
function iphoneGetWechatPlayerAuthor() {
  return iphoneGetWechatCustomNick() || IPHONE_WECHAT_USER_MACRO;
}

// 旧署名兼容与解析：微信 v0.18.0 是新应用，没有历史旧数据，直接复用 QQ 的
// 兜底判定（同一份默认昵称常量），保证玩家身份识别与 QQ 一致。
function iphoneIsWechatLegacyPlayerName(name) {
  return iphoneIsQqLegacyPlayerName(name);
}

function iphoneResolveWechatPlayerAuthor(name) {
  const value = String(name || '').trim();
  if (!value) return '';
  if (/\{\{user\}\}/i.test(value) || iphoneIsWechatLegacyPlayerName(value)) {
    return iphoneGetTavernUserName() || IPHONE_WECHAT_ME_FALLBACK_NAME;
  }
  return value;
}

function iphoneIsWechatPlayerAuthor(name) {
  const value = String(name || '').trim();
  if (!value) return false;
  if (/\{\{user\}\}/i.test(value) || iphoneIsWechatLegacyPlayerName(value)) return true;
  const aliases = new Set([iphoneGetTavernUserName(), iphoneGetWechatProfile().name].filter(Boolean));
  return aliases.has(value);
}

function iphoneUpdateWechatProfile(wxScreen, patch) {
  const storage = iphoneGetQqStorage();
  storage.wechatProfile = iphoneNormalizeWechatProfile({
    ...iphoneNormalizeWechatProfile(storage.wechatProfile),
    ...patch,
  });
  iphoneSaveQqStorage();
  iphoneRefreshWechatMeIdentity(wxScreen);
}

// ---------- 微信「服务 / 钱包」页图标（v0.22.1） ----------
// 扁平彩色线性图标：路径取自 GitHub 上的 tabler/tabler-icons（MIT 许可），
// 与真实微信服务页的彩色线稿图标同风格；收付款 / 钱包两枚按微信截图手绘
//（取景框 + 对钩 / 钱包包体，Tabler 无对应图形）。渲染时 stroke 继承
// currentColor，调用处用 style="color:…" 上色。
const IPHONE_WECHAT_SVC_ICON_PATHS = Object.freeze({
  scanPay: '<path d="M4 8v-2a2 2 0 0 1 2 -2h2"/><path d="M16 4h2a2 2 0 0 1 2 2v2"/><path d="M20 16v2a2 2 0 0 1 -2 2h-2"/><path d="M8 20h-2a2 2 0 0 1 -2 -2v-2"/><path d="M8.5 12.2l2.4 2.4l4.6 -5"/>',
  wallet: '<path d="M4 7.6a2.6 2.6 0 0 1 2.6 -2.6h9.8a1.6 1.6 0 0 1 1.6 1.6v1.4"/><rect x="3.6" y="7.4" width="16.8" height="12.2" rx="2.6"/><path d="M15.4 13.5h1.6"/>',
  creditCard: '<path d="M12 19h-6a3 3 0 0 1 -3 -3v-8a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v4.5" /> <path d="M3 10h18" /> <path d="M16 19h6" /> <path d="M19 16l3 3l-3 3" /> <path d="M7.005 15h.005" /> <path d="M11 15h2" />',
  wealth: '<path d="M4 19l16 0" /> <path d="M4 15l4 -6l4 2l4 -5l4 4" />',
  insurance: '<path d="M11.46 20.846a12 12 0 0 1 -7.96 -14.846a12 12 0 0 0 8.5 -3a12 12 0 0 0 8.5 3a12 12 0 0 1 -.09 7.06" /> <path d="M15 19l2 2l4 -4" />',
  mobileTop: '<path d="M13 21h-5a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v5" /> <path d="M11 4h2" /> <path d="M12 17v.01" /> <path d="M21 15h-2.5a1.5 1.5 0 0 0 0 3h1a1.5 1.5 0 0 1 0 3h-2.5" /> <path d="M19 21v1m0 -8v1" />',
  utilities: '<path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" /> <path d="M9 12l2 2l4 -4" />',
  qcoin: '<path d="M6 9.748a14.716 14.716 0 0 0 11.995 -.052c.275 -9.236 -11.104 -11.256 -11.995 .052" /> <path d="M18 10c.984 2.762 1.949 4.765 2 7.153c.014 .688 -.664 1.346 -1.184 .303c-.346 -.696 -.952 -1.181 -1.816 -1.456" /> <path d="M17 16c.031 1.831 .147 3.102 -1 4" /> <path d="M8 20c-1.099 -.87 -.914 -2.24 -1 -4" /> <path d="M6 10c-.783 2.338 -1.742 4.12 -1.968 6.43c-.217 2.227 .716 1.644 1.16 .917c.296 -.487 .898 -.934 1.808 -1.347" /> <path d="M15.898 13l-.476 -2" /> <path d="M8 20l-1.5 1c-.5 .5 -.5 1 .5 1h10c1 0 1 -.5 .5 -1l-1.5 -1" /> <path d="M12.75 7a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /> <path d="M9.25 7a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />',
  city: '<path d="M4 21v-15c0 -1 1 -2 2 -2h5c1 0 2 1 2 2v15" /> <path d="M16 8h2c1 0 2 1 2 2v11" /> <path d="M3 21h18" /> <path d="M10 12v.01" /> <path d="M10 16v.01" /> <path d="M10 8v.01" /> <path d="M7 12v.01" /> <path d="M7 16v.01" /> <path d="M7 8v.01" /> <path d="M17 12v.01" /> <path d="M17 16v.01" />',
  charity: '<path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" /> <path d="M12 6l-3.293 3.293a1 1 0 0 0 0 1.414l.543 .543c.69 .69 1.81 .69 2.5 0l1 -1a3.182 3.182 0 0 1 4.5 0l2.25 2.25" /> <path d="M12.5 15.5l2 2" /> <path d="M15 13l2 2" />',
  medical: '<path d="M13 3a1 1 0 0 1 1 1v4.535l3.928 -2.267a1 1 0 0 1 1.366 .366l1 1.732a1 1 0 0 1 -.366 1.366l-3.927 2.268l3.927 2.269a1 1 0 0 1 .366 1.366l-1 1.732a1 1 0 0 1 -1.366 .366l-3.928 -2.269v4.536a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1v-4.536l-3.928 2.268a1 1 0 0 1 -1.366 -.366l-1 -1.732a1 1 0 0 1 .366 -1.366l3.927 -2.268l-3.927 -2.268a1 1 0 0 1 -.366 -1.366l1 -1.732a1 1 0 0 1 1.366 -.366l3.928 2.267v-4.535a1 1 0 0 1 1 -1h2" />',
  travel: '<path d="M10 14l11 -11" /> <path d="M21 3l-6.5 18a.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a.55 .55 0 0 1 0 -1l18 -6.5" />',
  train: '<path d="M21 13c0 -3.87 -3.37 -7 -10 -7h-8" /> <path d="M3 15h16a2 2 0 0 0 2 -2" /> <path d="M3 6v5h17.5" /> <path d="M3 11v4" /> <path d="M8 11v-5" /> <path d="M13 11v-4.5" /> <path d="M3 19h18" />',
  didi: '<path d="M5 17a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /> <path d="M15 17a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /> <path d="M5 17h-2v-6l2 -5h9l4 5h1a2 2 0 0 1 2 2v4h-2m-4 0h-6m-6 -6h15m-6 0v-5" />',
  hotel: '<path d="M5 9a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /> <path d="M22 17v-3h-20" /> <path d="M2 8v9" /> <path d="M12 14h10v-2a3 3 0 0 0 -3 -3h-7v5" />',
  coinYen: '<path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" /> <path d="M9 12h6" /> <path d="M9 15h6" /> <path d="M9 8l3 4.5" /> <path d="M15 8l-3 4.5v4.5" />',
  diamond: '<path d="M6 5h12l3 5l-8.5 9.5a.7 .7 0 0 1 -1 0l-8.5 -9.5l3 -5" /> <path d="M10 12l-2 -2.2l.6 -1" />',
  bankCard: '<path d="M12 19h-6a3 3 0 0 1 -3 -3v-8a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v4.5" /> <path d="M3 10h18" /> <path d="M16 19h6" /> <path d="M19 16l3 3l-3 3" /> <path d="M7.005 15h.005" /> <path d="M11 15h2" />',
  family: '<path d="M14.017 18l-2.017 2l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 0 1 8.153 5.784" /> <path d="M15.99 20l4.197 -4.223a2.81 2.81 0 0 0 0 -3.948a2.747 2.747 0 0 0 -3.91 -.007l-.28 .282l-.279 -.283a2.747 2.747 0 0 0 -3.91 -.007a2.81 2.81 0 0 0 -.007 3.948l4.182 4.238l.007 0" />',
  fenfu: '<path d="M8 7a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" /> <path d="M2.5 17a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" /> <path d="M13.5 17a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />',
  payScore: '<path d="M5 7.2a2.2 2.2 0 0 1 2.2 -2.2h1a2.2 2.2 0 0 0 1.55 -.64l.7 -.7a2.2 2.2 0 0 1 3.12 0l.7 .7c.412 .41 .97 .64 1.55 .64h1a2.2 2.2 0 0 1 2.2 2.2v1c0 .58 .23 1.138 .64 1.55l.7 .7a2.2 2.2 0 0 1 0 3.12l-.7 .7a2.2 2.2 0 0 0 -.64 1.55v1a2.2 2.2 0 0 1 -2.2 2.2h-1a2.2 2.2 0 0 0 -1.55 .64l-.7 .7a2.2 2.2 0 0 1 -3.12 0l-.7 -.7a2.2 2.2 0 0 0 -1.55 -.64h-1a2.2 2.2 0 0 1 -2.2 -2.2v-1a2.2 2.2 0 0 0 -.64 -1.55l-.7 -.7a2.2 2.2 0 0 1 0 -3.12l.7 -.7a2.2 2.2 0 0 0 .64 -1.55v-1" />',
  service: '<path d="M8 9h8" /> <path d="M8 13h6" /> <path d="M10.99 19.206l-2.99 1.794v-3h-2a3 3 0 0 1 -3 -3v-8a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v6" /> <path d="M15 19l2 2l4 -4" />',
});
// ---------- 微信钱包（v0.22.1，前端占位数据） ----------
// 数据存 chatMetadata.IPhone.wechatWallet，与「我」的资料同一份聊天文件；当前
// 没有充值 / 提现 / 绑卡等写入入口，读时按 IPHONE_WECHAT_WALLET_DEFAULTS 补齐
// 并顺手回写脏数据（与 iphoneGetWechatProfile 同一套做法）。
// 金额上限（元）：钱包余额不可能超过一万亿，超出按上限收住——既防脏数据，
// 也让下面的格式化不必处理 toFixed 会改写成科学计数法的超大数。
const IPHONE_WECHAT_MONEY_CAP = 1e12;

// 金额归一到「分」：先按 12 位有效数字抹掉二进制浮点尾巴（8888.005 实为
// 8888.00499999…，直接 *100 取整会少一分），再四舍五入到分；负数 / 非数字
// 按 fallback 收住，超过上限按上限收住。归一与显示共用这一套，避免两处不一致。
function iphoneWechatRoundMoney(value, fallback) {
  const num = Number(value);
  if (!Number.isFinite(num) || num < 0) return fallback;
  return Math.round(Number((Math.min(num, IPHONE_WECHAT_MONEY_CAP) * 100).toPrecision(12))) / 100;
}

function iphoneNormalizeWechatWallet(raw) {
  const source = raw && typeof raw === 'object' ? raw : {};
  const defaults = IPHONE_WECHAT_WALLET_DEFAULTS;
  // 收益率：0~100 的百分数，同样抹掉浮点尾巴（1.10 要显示成 1.1）
  const rate = (value, fallback) => {
    const num = Number(value);
    if (!Number.isFinite(num) || num < 0 || num > 100) return fallback;
    return Math.round(Number(num.toPrecision(6)) * 100) / 100;
  };
  const cards = Array.isArray(source.cards) ? source.cards : defaults.cards;
  // 上次「评估」（v0.27.0）：时间戳 + 模型给的理由，只作展示与下次评估的参考。
  const assessedAt = Math.max(0, Math.floor(Number(source.assessedAt) || 0));
  const assessNote = String(source.assessNote || '').replace(/\s+/g, ' ').trim()
    .slice(0, IPHONE_WECHAT_ASSESS_NOTE_CAP);
  return {
    balance: iphoneWechatRoundMoney(source.balance, defaults.balance),
    lctRate: rate(source.lctRate, defaults.lctRate),
    ...(assessedAt ? { assessedAt } : {}),
    ...(assessNote ? { assessNote } : {}),
    cards: cards
      .map((card, index) => {
        if (!card || typeof card !== 'object') return null;
        const bank = String(card.bank || '').trim().slice(0, 20);
        const tail = String(card.tail || '').trim().replace(/\D/g, '').slice(-4);
        if (!bank || !tail) return null;
        return { id: String(card.id || `wc${index + 1}`), bank, tail };
      })
      .filter(Boolean)
      .slice(0, 8),
  };
}

// 读取钱包数据：没存过就返回默认值（不落盘，保持聊天文件干净），存过脏值
//（字符串金额 / 尾号带空格等）归一化后顺手写回。默认余额为 0（v0.27.0 起）——
// 余额由「零钱 · 评估」按剧情核定，或由转账 / 收款增减。
function iphoneGetWechatWallet() {
  const storage = iphoneGetQqStorage();
  const raw = storage.wechatWallet && typeof storage.wechatWallet === 'object' ? storage.wechatWallet : null;
  const normalized = iphoneNormalizeWechatWallet(raw);
  if (raw && JSON.stringify(normalized) !== JSON.stringify(raw)) {
    storage.wechatWallet = normalized;
    iphoneSaveQqStorage();
  }
  return normalized;
}

// 改写零钱余额（v0.24.0 转账用）：传负数为扣款，余额不足时不写入并返回
// { ok: false, balance }。金额按分归一，避免扣出 0.01 的浮点误差。
function iphoneChangeWechatBalance(delta) {
  const wallet = iphoneGetWechatWallet();
  const next = iphoneWechatRoundMoney(Math.round(Number(wallet.balance) * 100) + Math.round(Number(delta) * 100), 0) / 100;
  const amount = Number(delta);
  if (!Number.isFinite(amount) || amount === 0) return { ok: false, balance: wallet.balance };
  if (next < 0) return { ok: false, balance: wallet.balance };
  const storage = iphoneGetQqStorage();
  storage.wechatWallet = { ...wallet, balance: next };
  iphoneSaveQqStorage();
  return { ok: true, balance: next };
}

// 金额显示：两位小数 + 千分位（1288.5 → 1,288.50；32000 → 32,000.00），
// 与微信钱包的「¥」大字同款；异常数据（非数字 / 超大数）按同规则收住。
// 先按分归一再补零，避免 8888.005 直接 toFixed 显示成 8,888.00。
function iphoneWechatMoney(value) {
  const num = Number(value);
  if (!Number.isFinite(num)) return '0.00';
  const capped = Math.max(-IPHONE_WECHAT_MONEY_CAP, Math.min(num, IPHONE_WECHAT_MONEY_CAP));
  const rounded = iphoneWechatRoundMoney(Math.abs(capped), 0);
  const fixed = rounded.toFixed(2);
  const [intPart, decPart] = fixed.split('.');
  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `${capped < 0 ? '-' : ''}${grouped}.${decPart}`;
}

// 服务 / 钱包页的彩色线稿图标：把路径常量渲染成内联 SVG（24×24，stroke 取
// currentColor，线宽与圆头端点按微信图标观感定），调用处只负责给颜色。
function iphoneWechatServiceIcons() {
  const out = {};
  for (const [key, inner] of Object.entries(IPHONE_WECHAT_SVC_ICON_PATHS)) {
    out[key] = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;
  }
  return out;
}

// ---------- 微信零钱「评估」（v0.27.0） ----------
// 零钱余额的来源：v0.22.1 起是写死的演示值，v0.27.0 起改由「我 → 服务 → 钱包 →
// 零钱 → 评估」调一次对话 API 现场评出来——把提示词与上下文（世界书 / 第三方
// 注入 / 酒馆主线 / 记录楼层 / 玩家微信资料 / 联系人名单 / 当前钱包状态）一起
// 发给模型，由它按剧情里玩家的资产状况给出一个合适的余额，覆盖写回
// wechatWallet.balance。转账 / 收款仍在这份余额之上加减，两边即时联动。
// 预设存 settings.promptPresets.wechatAssess（「设置 · 零钱评估提示词」）。

// 评估预设：字段与其余预设同义，但 npcLogic / dialogueGuidance 默认留空——评估
// 是一次后台计算而非对话，那两段指导在这里没有意义（编辑页也不显示）。
function iphoneGetWechatAssessPreset() {
  const defaults = IPHONE_WECHAT_ASSESS_PRESET_DEFAULT;
  const raw = iphoneGetSettings().promptPresets?.wechatAssess || {};
  const persona = typeof raw.persona === 'string' ? raw.persona : defaults.persona;
  const worldBook = typeof raw.worldBook === 'boolean' ? raw.worldBook : defaults.worldBook;
  const latestFloor = typeof raw.latestFloor === 'boolean' ? raw.latestFloor : defaults.latestFloor;
  const npcLogic = typeof raw.npcLogic === 'string' ? raw.npcLogic : defaults.npcLogic;
  const dialogueGuidance = typeof raw.dialogueGuidance === 'string' ? raw.dialogueGuidance : defaults.dialogueGuidance;
  let historyFloors = Math.round(Number(raw.historyFloors));
  if (!Number.isFinite(historyFloors)) historyFloors = defaults.historyFloors;
  historyFloors = Math.min(50, Math.max(0, historyFloors));
  const guidance = typeof raw.guidance === 'string' ? raw.guidance : defaults.guidance;
  const format = typeof raw.format === 'string' ? raw.format : defaults.format;
  return { persona, worldBook, latestFloor, historyFloors, npcLogic, dialogueGuidance, guidance, format };
}

// 解析评估回复：只认「金额 + 理由」两样，金额拿不到就当整次评估失败（宁可报错
// 让玩家重试，也不要凭空改余额——余额是剧情数据，写错比不写更糟）。
// 金额容错：先认约定的「零钱余额：」，再认「余额 / 金额 / balance」等同义标签
//（模型偶发把标签写简略），最后退到 JSON 形状的 balance 字段；金额里的千分位、
// 货币符号、`元` 后缀都吃掉。负数按 0 收住——零钱不可能是负的（欠款在剧情里
// 走别的说法，不体现为零钱为负）。
function iphoneParseWechatAssessReply(reply) {
  const text = String(reply ?? '').replace(/\r\n?/g, '\n').trim();
  if (!text) return null;
  const amountSources = [
    /零钱余额\s*[:：]?\s*[¥￥]?\s*(-?[0-9][0-9,]*(?:\.[0-9]{1,2})?)/,
    /(?:^|\n)\s*(?:余额|金额|数值)\s*[:：]\s*[¥￥]?\s*(-?[0-9][0-9,]*(?:\.[0-9]{1,2})?)/,
    /["'【]?\s*balance\s*["'】]?\s*[:：]\s*[¥￥]?\s*(-?[0-9][0-9,]*(?:\.[0-9]{1,2})?)/i,
  ];
  let amount = null;
  for (const re of amountSources) {
    const match = re.exec(text);
    if (!match) continue;
    const rawValue = Number(match[1].replace(/,/g, ''));
    if (!Number.isFinite(rawValue)) continue;
    // 负数按 0 收住：零钱不可能是负的（欠款在剧情里走别的说法，不体现为余额为负），
    // 模型算出负数说明它按「透支」理解了，收成 0 比整次作废更贴近它想表达的处境。
    const parsed = iphoneWechatRoundMoney(rawValue < 0 ? 0 : rawValue, NaN);
    if (Number.isFinite(parsed)) { amount = parsed; break; }
  }
  if (amount == null) return null;
  // 理由：优先认「理由：」标签，其次取金额那一行之后的第一行有字内容
  //（模型偶尔只给一行金额、不写理由，此时宁可留空，也别把金额行当成理由抄一遍）
  let note = '';
  const noteMatch = /理由\s*[:：]\s*([^\n]+)/.exec(text);
  if (noteMatch) {
    note = noteMatch[1];
  } else {
    const lines = text.split('\n').map((line) => line.trim());
    const amountLine = lines.findIndex((line) => /余额|金额|数值|balance/i.test(line) && /\d/.test(line));
    const after = lines
      .slice(amountLine >= 0 ? amountLine + 1 : 0)
      .find((line) => line && !/^[[{`]/.test(line) && !/[:：]\s*[¥￥]?\s*-?[\d,]+(?:\.\d+)?\s*元?\s*$/.test(line));
    note = after || '';
  }
  return {
    balance: amount,
    note: String(note)
      .replace(/^["'`\s]+|["'`\s]+$/g, '')
      .replace(/\s+/g, ' ')
      .slice(0, IPHONE_WECHAT_ASSESS_NOTE_CAP),
  };
}

// 直接落一个新余额（评估用；转账 / 收款走 iphoneChangeWechatBalance 的增量接口）。
// assessNote / assessedAt 一并写入，供零钱页展示「上次评估」与下次评估作参考。
// 数值不可用（非有限数 / 超出上限）时原样保留旧余额，也不落评估时间——没评出结果
// 就不是一次评估，别在界面上留下「已评估」的痕迹。
function iphoneSetWechatBalance(balance, note) {
  const wallet = iphoneGetWechatWallet();
  const next = iphoneWechatRoundMoney(balance, NaN);
  if (!Number.isFinite(next)) return wallet.balance;
  const storage = iphoneGetQqStorage();
  storage.wechatWallet = {
    ...wallet,
    balance: next,
    assessedAt: Date.now(),
    ...(note ? { assessNote: note } : {}),
  };
  iphoneSaveQqStorage();
  return next;
}

// 微信里已建立关系的人（联系人 + 群聊）：评估时给模型当社会关系参考——收入来源
// 与消费层级常常能从「跟谁打交道」推出来。
function iphoneWechatAssessRosterText() {
  const data = iphoneGetWechatData();
  const friends = data.friends.map((f) => String(f.name || '').trim()).filter(Boolean);
  const groups = data.groups.map((g) => String(g.name || '').trim()).filter(Boolean);
  const lines = [];
  if (friends.length) lines.push(`联系人（${friends.length} 位）：${friends.join('、')}`);
  if (groups.length) lines.push(`群聊（${groups.length} 个）：${groups.join('、')}`);
  return lines.join('\n');
}

// 调一次对话 API 评估零钱余额并写回，返回 { balance, note, previous }。
// 上下文尽量给全（见下 sysParts 各段）：评估结论的质量取决于模型对「玩家是什么
// 人、身处何处、最近发生了什么」的了解程度，能带的段都带上——世界书给身份，
// 主线与记录楼层给近期收支，第三方注入给变量状态（万华镜的金钱类变量就在里面），
// 微信资料与联系人名单给消费层级的旁证，当前钱包状态则让结论能自洽（已有余额高
// 就没必要推翻重来，模型多数时候会给出相近量级）。
async function iphoneAssessWechatWallet() {
  const settings = iphoneGetSettings();
  const ctx = iphoneGetContextSafe();
  const preset = iphoneGetWechatAssessPreset();
  const resolve = (text) => iphoneResolveTavernMacros(text, ctx);
  const wallet = iphoneGetWechatWallet();
  const profile = iphoneGetWechatProfile();
  const playerName = String(ctx?.name1 || '').trim() || '用户';

  let worldText = '';
  if (preset.worldBook) {
    try {
      worldText = resolve(iphoneWbBuildPromptText(await iphoneWbCollectState()) || '');
    } catch (error) {
      iphoneLog('warn', '世界书内容注入失败，本次评估不带世界书', error);
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

  const accountLines = [
    `微信昵称：${profile.name}`,
    `微信号：${profile.wxId || '（未设置）'}`,
    `当前零钱余额：¥${iphoneWechatMoney(wallet.balance)}`,
  ];
  if (wallet.assessedAt) {
    accountLines.push(`上次评估：${new Date(wallet.assessedAt).toLocaleString('zh-CN', { hour12: false })}`
      + (wallet.assessNote ? `（当时的理由：${wallet.assessNote}）` : ''));
  }
  const accountText = accountLines.join('\n');

  const rosterText = iphoneWechatAssessRosterText();
  const persona = preset.persona.trim();
  const npcLogic = preset.npcLogic.trim();
  const dialogueGuidance = preset.dialogueGuidance.trim();
  const guidance = String(preset.guidance ?? '').trim();
  const format = String(preset.format ?? '').trim();
  const worldTextTrimmed = worldText.trim();
  const tavernText = historyLines.join('\n');
  // 第三方扩展注入酒馆提示词的内容（万华镜的变量状态等）：随 system 附带。
  const injectParts = iphoneInjectPromptParts();

  const sysParts = [];
  if (persona) sysParts.push(`<roleplay_instructions>\n${resolve(persona)}\n</roleplay_instructions>`);
  const outlineItems = [];
  if (persona) outlineItems.push('<roleplay_instructions>…</roleplay_instructions>：你的职责与视角——微信支付的资产风控系统；');
  if (npcLogic) outlineItems.push('<npc_logic>…</npc_logic>：扮演逻辑——「先是人，后是设定」，按自身立场与动机行事；');
  if (dialogueGuidance) outlineItems.push('<dialogue_guidance>…</dialogue_guidance>：表达规范——口语化、生活化、带情绪与立场，禁止播报腔；');
  if (worldTextTrimmed) outlineItems.push('<world_info>…</world_info>：当前场景的世界书设定，包含世界观与相关人物的资料；');
  if (injectParts) outlineItems.push(injectParts.outline);
  if (tavernText) outlineItems.push('<tavern_context>…</tavern_context>：酒馆主线的最近对话（时间旧→新），是当前正在发生的剧情背景；');
  if (floorLogText) outlineItems.push('<wechat_chat_log>…</wechat_chat_log>：最近一次同步到酒馆楼层的手机记录，可能包含多个记录段（每段各自用方括号标签包裹，如 [QQ_私聊_名字] / [微信_群聊_群名] / [朋友圈动态]）——近期的收支与消费线索多在这里；');
  if (rosterText) outlineItems.push('<wechat_contacts>…</wechat_contacts>：玩家微信里的联系人与群聊名单，可辅助判断 TA 的社交圈与消费层级；');
  outlineItems.push('<wechat_account>…</wechat_account>：玩家的微信资料与账户当前状态（昵称 / 微信号 / 当前零钱余额 / 上次评估）；');
  if (guidance) outlineItems.push('<assess_guidance>…</assess_guidance>：资产评估的评定标准——评什么、凭什么是合理的；');
  if (format) outlineItems.push('<output_format>…</output_format>：输出格式要求，位于提示词末尾，必须严格遵守；');
  sysParts.push('【提示词结构说明】本次请求的提示词由以下部分组成，均已用 XML 标签包裹并附介绍：\n'
    + outlineItems.map((item) => `- ${item}`).join('\n'));
  if (npcLogic) sysParts.push(`以下是扮演逻辑指导（决定你如何理解与演绎角色）：\n<npc_logic>\n${resolve(npcLogic)}\n</npc_logic>`);
  if (dialogueGuidance) sysParts.push(`以下是表达规范（决定你如何说话与写内容）：\n<dialogue_guidance>\n${resolve(dialogueGuidance)}\n</dialogue_guidance>`);
  if (worldTextTrimmed) sysParts.push(`以下是当前场景的世界书设定（世界观与人物资料）：\n<world_info>\n${worldTextTrimmed}\n</world_info>`);
  if (injectParts) sysParts.push(injectParts.system);
  if (tavernText) sysParts.push(`以下是酒馆主线的最近对话（时间旧→新），是你当前所处的剧情背景：\n<tavern_context>\n${tavernText}\n</tavern_context>`);
  if (floorLogText) sysParts.push(`以下是最近一次同步到酒馆楼层的手机记录（每段各自用方括号标签包裹，如 [QQ_私聊_名字] / [微信_群聊_群名] / [朋友圈动态]），近期的收支与消费线索多在这里：\n<wechat_chat_log>\n${floorLogText}\n</wechat_chat_log>`);
  if (rosterText) sysParts.push(`以下是玩家微信里的联系人与群聊名单（辅助判断 TA 的社交圈与消费层级）：\n<wechat_contacts>\n${rosterText}\n</wechat_contacts>`);
  sysParts.push(`以下是玩家的微信资料与账户当前状态：\n<wechat_account>\n${accountText}\n</wechat_account>`);
  if (guidance) sysParts.push(`以下是资产评估的评定标准（决定你怎么评）：\n<assess_guidance>\n${resolve(guidance)}\n</assess_guidance>`);
  if (format) sysParts.push(`以下是输出格式要求，必须严格遵守：\n<output_format>\n${resolve(format)}\n</output_format>`);

  const userContent = `请评估「${playerName}」此刻的资产状况，给出 TA 微信零钱应有的余额。`;
  const reply = await iphoneRequestChatCompletion(settings, [
    { role: 'system', content: sysParts.join('\n\n') },
    { role: 'user', content: userContent },
  ]);

  const parsed = iphoneParseWechatAssessReply(reply);
  if (!parsed) {
    throw new Error('AI 没有返回可用的评估结果（需要「零钱余额：金额」一行）。');
  }
  const previous = wallet.balance;
  const balance = iphoneSetWechatBalance(parsed.balance, parsed.note);
  iphoneLog('info', `零钱评估完成：¥${iphoneWechatMoney(previous)} → ¥${iphoneWechatMoney(balance)}`
    + (parsed.note ? `（${parsed.note}）` : ''));
  return { balance, note: parsed.note, previous };
}


// ---------- 微信转账 / 收款（v0.24.0；行内容错与 [已收款] 记账 v0.24.3） ----------
// 约定（AI 与玩家共用一套写法）：消息内容写 `[转账]金额 说明`，渲染成转账气泡；
// `[收款]金额` 不是新气泡，而是「确认收下对方转来的钱」的动作——解析时把它对应
// 的待确认转账标记为已完成。金额复用钱包的入分规则归一，非法 / 非正数一律当
// 普通文本（宁可显示成文字，也不要凭空造出一笔钱）。方括号兼容中英文与 ¥ 前缀。
// 群聊转账（v0.25.0）在标记里带收款人：`[转账@群友名]金额`——@ 与名字写在方括号
// 内（名字允许带空格，靠右方括号收尾），没写就是默认转给玩家。
const IPHONE_WECHAT_PAY_RE = /^[[【]\s*(转账|收款)\s*(?:[@＠]\s*([^\]】]{1,24}?))?\s*[\]】]\s*[¥￥]?\s*([0-9][0-9,]*(?:\.[0-9]{1,2})?)\s*(.*)$/;
// 行内版本（v0.24.3，不带 ^ 锚）：模型把标记挂在叙述句尾时用它找标记的位置
const IPHONE_WECHAT_PAY_INLINE_RE = /[[【]\s*(?:转账|收款)\s*(?:[@＠]\s*[^\]】]{1,24}?)?\s*[\]】]\s*[¥￥]?\s*[0-9][0-9,]*(?:\.[0-9]{1,2})?/;
// [已收款]金额：转账被任何一方收下后由插件写的「记账行」，只进记录不上屏
const IPHONE_WECHAT_RECEIPT_RE = /^[[【]\s*已收款\s*[\]】]\s*[¥￥]?\s*([0-9][0-9,]*(?:\.[0-9]{1,2})?)\s*$/;

function iphoneParseWechatPay(content) {
  const match = IPHONE_WECHAT_PAY_RE.exec(String(content ?? '').trim());
  if (!match) return null;
  const amount = iphoneWechatRoundMoney(match[3].replace(/,/g, ''), 0);
  if (!(amount > 0)) return null;
  return {
    kind: match[1] === '转账' ? 'transfer' : 'collect',
    amount,
    note: match[4].replace(/\s+/g, ' ').trim().slice(0, 40),
    // 收款人（群聊才有；私聊留空，收款人按对话双方推定）
    payee: String(match[2] || '').trim().slice(0, 24),
  };
}

// 收款记账行的正文：金额照模型写标记的习惯给最简写法（50000 → `50000`、
// 88.8 → `88.8`），不留多余的 .00 与千分位——楼层里读起来和 `[转账]金额`
// 一个样式，模型不会把逗号误当成格式的一部分。
function iphoneWechatPlainAmount(amount) {
  const rounded = iphoneWechatRoundMoney(amount, 0);
  if (!(rounded > 0)) return '0';
  return String(rounded);
}

function iphoneWechatReceiptContent(amount) {
  return `[已收款]${iphoneWechatPlainAmount(amount)}`;
}

function iphoneParseWechatReceipt(content) {
  const match = IPHONE_WECHAT_RECEIPT_RE.exec(String(content ?? '').trim());
  if (!match) return null;
  const amount = iphoneWechatRoundMoney(match[1].replace(/,/g, ''), 0);
  if (!(amount > 0)) return null;
  return { amount };
}

// ---------- 转账的发起人 / 收款人（v0.25.0 群聊转账） ----------
// 一笔转账归谁：内容里写了 `@名字`（群聊写法 `[转账@群友名]金额`）就用它，没写按场景
// 推定——群聊默认转给玩家「{{user}}」，私聊按发送方推定（玩家发的转给对方、对方发
// 来的转给玩家）。玩家一律折成空串这一个「演员」标识，群友各用自己的名字，这样
// 「谁能点收款」「[收款] 归哪一笔」都只用比一次字符串。
// 模型指玩家时可能写名字、也可能写「我 / 你 / 自己」这类代词（群成员列表里没有玩家，
// 它没有可抄的名字），这几种都当玩家——群里真叫「我」的成员现实中不存在。
const IPHONE_WECHAT_PLAYER_ALIASES = new Set(['我', '你', '自己', '玩家', '本人', 'user']);
function iphoneWechatActorOfName(name) {
  const value = String(name || '').trim();
  if (!value || iphoneIsWechatPlayerAuthor(value)) return '';
  return value;
}

// 标记里的 @名字 是不是指玩家（名字本身 / 代词 / {{user}} 宏）
function iphoneWechatIsPlayerTarget(name) {
  const value = String(name || '').trim();
  if (!value) return false;
  if (iphoneIsWechatPlayerAuthor(value)) return true;
  return IPHONE_WECHAT_PLAYER_ALIASES.has(value.toLowerCase());
}

function iphoneGetWechatPlayerName() {
  return iphoneGetWechatProfile().name || IPHONE_WECHAT_ME_FALLBACK_NAME;
}

// 收款人标识：'' = 玩家，其余是群成员名。私聊里玩家发的那笔收款人是对方，所以用
// 会话名当标识——与私聊里「发言人=对方」的解析结果天然对上。
function iphoneWechatPayeeIdentity(pay, msg, meta) {
  const explicit = String(pay?.payee || '').trim();
  if (explicit) return iphoneWechatIsPlayerTarget(explicit) ? '' : explicit;
  if (meta?.isGroup) return '';
  return msg?.role === 'user' ? String(meta?.entityName || '').trim() : '';
}

// 发起人标识：玩家发的（role=user）恒为 ''，对方发的在群聊取行首发言成员名、私聊
// 取会话名（私聊回复解析不带名字，按对话双方推定）。
function iphoneWechatPayerIdentity(msg, meta) {
  if (msg?.role === 'user') return '';
  return meta?.isGroup
    ? iphoneWechatActorOfName(msg?.name)
    : String(meta?.entityName || '').trim();
}

// collector 能不能收下这笔转账：必须转给 TA，且不能是 TA 自己发的那笔。
function iphoneWechatCanCollect(pay, msg, collector, meta) {
  const target = String(collector || '').trim();
  if (iphoneWechatPayeeIdentity(pay, msg, meta) !== target) return false;
  return iphoneWechatPayerIdentity(msg, meta) !== target;
}

// 转账气泡首行「向X转账」的 X：收款人是谁就叫谁，收款人是玩家时用玩家昵称
//（真实微信里收到的那笔也这么显示——向「我」转账）。
function iphoneWechatPayeeLabel(pay, msg, meta) {
  const identity = iphoneWechatPayeeIdentity(pay, msg, meta);
  return identity || iphoneGetWechatPlayerName();
}

// 把一条回复内容按行内转账标记切开（v0.24.3）：模型常把 `[转账]金额` 挂在叙述
// 句尾（「……先跟我说一声。[转账]50000 这个月先撑过去」），严格锚定的
// iphoneParseWechatPay 认不出来、整条只能当普通文字。这里按行扫描，把「标记
// 独占一行」与「标记挂在行尾」两种写法都拆成「前文」「标记行」两条内容——前文
// 照常落成普通消息（多行原样保留），标记单独成条（金额之后到行尾的文字归它当
// 说明）。整条里找不到可识别标记时原样返回一条，不做任何改写。
function iphoneSplitWechatPayLine(content) {
  const text = String(content ?? '').replace(/\r\n?/g, '\n').trim();
  if (!text) return [];
  if (iphoneParseWechatPay(text)) return [{ content: text }];
  const out = [];
  let buffer = [];
  const flush = () => {
    const joined = buffer.join('\n').trim();
    if (joined) out.push({ content: joined });
    buffer = [];
  };
  for (const raw of text.split('\n')) {
    const line = raw.trim();
    if (!line) continue;
    if (iphoneParseWechatPay(line)) {
      flush();
      out.push({ content: line });
      continue;
    }
    const matched = IPHONE_WECHAT_PAY_INLINE_RE.exec(line);
    const tail = matched && matched.index > 0 ? line.slice(matched.index).trim() : '';
    if (tail && iphoneParseWechatPay(tail)) {
      const before = line.slice(0, matched.index).trim();
      if (before) buffer.push(before);
      flush();
      out.push({ content: tail });
      continue;
    }
    buffer.push(line);
  }
  flush();
  if (!out.some((entry) => iphoneParseWechatPay(entry.content))) return [{ content: text }];
  // 前文只剩「名字：」前缀（模型写成无引号的 名字：[转账]…）时丢掉，别落成空壳气泡
  return out.filter((entry) => !/^[^：:「」\n]{1,30}：$/.test(entry.content));
}

// 把一组 AI 回复条目整理成可落库的消息（v0.24.0；v0.24.3 起容忍行内标记并补记账行；
// v0.25.0 起认出群聊转账的收款人）：`[收款]金额` 是动作——回填到「收款人自己那笔
// 金额一致的待确认转账」上标记 done（对方的确认收款），自己不产出气泡，改补一条
// 隐藏的 `[已收款]金额` 记账行；`[转账]金额`（群聊可带 `@群友名`）产出带
// pay.pending 的消息（渲染成待收款的卡片）；其余按普通消息。AI 抄错金额时以最近的
// 待确认转账兜底，避免模型写错数字就确认不了。meta 说明这是哪个会话
//（{ isGroup, entityName }），收款人归属与气泡上的「向X转账」都靠它定位。
function iphoneBuildWechatReplyMessages(entries, existing, meta, baseTs = Date.now()) {
  const conversation = Array.isArray(existing) ? existing : [];
  const ctx = meta && typeof meta === 'object' ? meta : {};
  const list = [];
  let ts = baseTs;
  let step = 0;
  const push = (entry, pay) => {
    const msg = { role: 'assistant', content: entry.content, ts: ts + (step += 1) };
    if (entry.name) msg.name = entry.name;
    if (pay) msg.pay = pay;
    list.push(msg);
    return msg;
  };
  // 记账行（hidden）：只进聊天记录与提示词，界面上不上屏（转账气泡自己会翻成已收款）
  const pushHidden = (content, name) => {
    const msg = { role: 'assistant', content, ts: ts + (step += 1), hidden: true };
    if (name) msg.name = name;
    list.push(msg);
    return msg;
  };
  // 收款人 collector 名下、还没被收下的转账（在既有会话与本次新回复里一起找）。
  // 金额对得上优先，对不上退到最近一笔——群聊里模型常把金额抄走样。
  const findPendingFor = (collector, amount) => {
    const all = [...conversation, ...list];
    let fallback = null;
    for (let i = all.length - 1; i >= 0; i -= 1) {
      const msg = all[i];
      if (msg.pay?.status !== 'pending') continue;
      const pay = iphoneParseWechatPay(msg.content);
      if (!pay || pay.kind !== 'transfer') continue;
      if (!iphoneWechatCanCollect(pay, msg, collector, ctx)) continue;
      if (!amount || pay.amount === amount) return msg;
      if (!fallback) fallback = msg;
    }
    return fallback;
  };
  const handleEntry = (entry) => {
    const pay = iphoneParseWechatPay(entry.content);
    if (!pay) {
      push(entry);
      return;
    }
    if (pay.kind === 'transfer') {
      push(entry, { status: 'pending' });
      return;
    }
    // 收款人：群聊看行首发言人（玩家一律折成空串），私聊恒为对方
    const collector = ctx.isGroup
      ? iphoneWechatActorOfName(entry.name)
      : String(ctx.entityName || '').trim();
    const target = findPendingFor(collector, pay.amount);
    if (!target) return;
    target.pay = { status: 'done' };
    // 记账金额以被确认的那笔转账为准（模型抄错数字时也别把账记歪）
    const targetPay = iphoneParseWechatPay(target.content);
    pushHidden(iphoneWechatReceiptContent(targetPay ? targetPay.amount : pay.amount), entry.name);
  };
  for (const entry of entries) {
    for (const part of iphoneSplitWechatPayLine(entry.content)) {
      handleEntry({ content: part.content, name: entry.name });
    }
  }
  return list;
}

// 转账气泡第二行的状态文案（按微信截图）：我方发出待收 = 你发起了一笔转账、
// 收完 = 已被接收；对方转来待收 = 点击收款（点一下直接收下，微信是弹确认框，
// 这里省掉那一步所以把动作写在脸上）、收完 = 已收款。
function iphoneWechatPayStatusLabel(status, isMine) {
  if (status === 'done') return isMine ? '已被接收' : '已收款';
  return isMine ? '你发起了一笔转账' : '点击收款';
}

// 转账气泡（v0.24.0，按微信 8.x 截图手绘；v0.25.0 群聊加「向X转账」行）：整块橙色
// 气泡，左侧白描圆图标（待确认 = 双向箭头 / 已收款 = 对勾），右侧第一行收款人
//（群聊/来账才显示，与真实微信的群里转账气泡一致——「向雾蒙天际晓转账」）、第二行
// 金额、第三行状态或转账说明，左下角一枚淡字「转账」。待收款状态用亮橙，收完转成
// 浅橙（微信同款）。转给我且待确认时整块可点（收款）。图标用 innerHTML（可信的
// 内联 SVG），金额与说明走 textContent。
function iphoneWechatBuildPayCard(icons, pay, isMine, status, onReceive, payeeLabel) {
  const wrap = document.createElement('div');
  wrap.className = 'iphone-wxc__paywrap';

  const done = status === 'done';
  const card = document.createElement('div');
  card.className = `iphone-wxc__pay${done ? ' iphone-wxc__pay--done' : ''}`;

  const ico = document.createElement('span');
  ico.className = 'iphone-wxc__pay-ico';
  ico.setAttribute('aria-hidden', 'true');
  ico.innerHTML = done ? icons.transferCheck : icons.transferCircle;

  const main = document.createElement('span');
  main.className = 'iphone-wxc__pay-main';
  // 首行「向X转账」：真实微信的转账气泡就这么写（私聊里也写对方名字），收款人是谁
  // 一目了然——群聊里尤其必要，否则分不清这笔钱是转给谁的。
  const who = document.createElement('span');
  who.className = 'iphone-wxc__pay-who';
  who.textContent = payeeLabel ? `向${payeeLabel}转账` : '';
  const amount = document.createElement('span');
  amount.className = 'iphone-wxc__pay-amount';
  amount.textContent = `¥${iphoneWechatMoney(pay.amount)}`;
  const sub = document.createElement('span');
  sub.className = 'iphone-wxc__pay-sub';
  // 末行：未收款时优先显示转账说明，没有说明显示状态；收完（点过收款）后说明让位给
  // 收款结果——微信就是这么变的（对方那条自动出现「已收款」）。
  sub.textContent = (!done && pay.note) || iphoneWechatPayStatusLabel(status, isMine);
  if (who.textContent) main.append(who);
  main.append(amount, sub);
  card.append(ico, main);

  const tag = document.createElement('span');
  tag.className = 'iphone-wxc__pay-tag';
  tag.textContent = '转账';
  card.appendChild(tag);

  // 收完的转账只剩说明/状态，状态另用 title 提示，便于悬停确认
  card.title = iphoneWechatPayStatusLabel(status, isMine);

  if (!isMine && !done && typeof onReceive === 'function') {
    card.classList.add('is-click');
    card.addEventListener('click', () => onReceive());
  }

  wrap.appendChild(card);
  return wrap;
}

// 把「我」的钱包资料套到一个头像节点上（微信款式类前缀与 QQ 不同，单独一套）。
function iphoneApplyWechatMeAvatarToEl(el, profile) {
  if (!el) return;
  if (el._meAvatarPresetCls) {
    el.classList.remove(el._meAvatarPresetCls);
    el._meAvatarPresetCls = null;
  }
  el.style.backgroundImage = '';
  const avatar = profile.avatar;
  if (avatar && avatar.preset) {
    const cls = `iphone-wx__avatar--${avatar.preset}`;
    el.classList.add(cls);
    el._meAvatarPresetCls = cls;
  } else if (avatar && avatar.url) {
    el.style.backgroundImage = `url("${String(avatar.url).replace(/"/g, '%22')}")`;
  }
}

function iphoneRefreshWechatMeIdentity(root) {
  if (!root) return;
  const profile = iphoneGetWechatProfile();
  root.querySelectorAll('[data-me-name]').forEach((el) => { el.textContent = profile.name; });
  root.querySelectorAll('[data-me-avatar]').forEach((el) => iphoneApplyWechatMeAvatarToEl(el, profile));
  root.querySelectorAll('[data-me-wxid]').forEach((el) => { el.textContent = profile.wxId; });
}

// ---------- 微信联系人 / 群聊 / 朋友圈数据归一化 ----------
// friend = { id, name, wxId, avatar, messages, floorSynced }；
// group = { id, name, wxId, avatar, memberIds, messages, floorSynced }（结构与 QQ 相同）；
// moment = { id, friendId, ts, text, likes, comments }（同 QQ 的 dynamic）。
function iphoneWechatGenEntityId(prefix) {
  return `${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

// 聊天记录归一化：与 QQ 同构（role / content / name，最多 200 条），额外保留 ts——
// 微信会话列表要按最后一条消息的时间显示「HH:MM / 昨天 / M月D日」，QQ 的归一化
// 会把这个字段丢掉，所以这里不能直接复用。转账消息（v0.24.0）另存 pay.status：
// 金额不落库、一律从 content 现解析（content 是唯一事实来源，手改 / 模型写偏了
// 也能自洽），所以只在 content 确实是转账标记时才认这个状态。v0.24.3 另加
// hidden 的 `[已收款]金额` 记账行：只进记录与提示词、界面上不上屏。
function iphoneNormalizeWechatMessages(raw) {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item) => {
      if (!item || typeof item !== 'object') return null;
      const role = item.role === 'assistant' ? 'assistant' : 'user';
      const content = String(item.content || '').trim();
      if (!content) return null;
      const name = String(item.name || '').trim();
      const out = { role, content };
      if (role === 'assistant' && name) out.name = name;
      const ts = Math.max(0, Math.floor(Number(item.ts) || 0));
      if (ts) out.ts = ts;
      if (iphoneParseWechatReceipt(content)) {
        out.hidden = true;
      } else {
        const pay = iphoneParseWechatPay(content);
        if (pay && pay.kind === 'transfer') {
          out.pay = { status: item.pay && item.pay.status === 'done' ? 'done' : 'pending' };
        }
      }
      return out;
    })
    .filter(Boolean)
    .slice(-200);
}

function iphoneNormalizeWechatFriend(raw) {
  const source = raw && typeof raw === 'object' ? raw : {};
  const name = String(source.name || '').trim().slice(0, 24);
  if (!name) return null;
  return {
    id: String(source.id || '').trim() || iphoneWechatGenEntityId('wf'),
    name,
    wxId: String(source.wxId || '').trim().slice(0, 32),
    avatar: iphoneNormalizeWechatAvatar(source.avatar),
    messages: iphoneNormalizeWechatMessages(source.messages),
    floorSynced: Math.max(0, Math.floor(Number(source.floorSynced) || 0)),
  };
}

function iphoneNormalizeWechatGroup(raw, friendIds) {
  const source = raw && typeof raw === 'object' ? raw : {};
  const name = String(source.name || '').trim().slice(0, 24);
  if (!name) return null;
  const members = Array.isArray(source.memberIds) ? source.memberIds : [];
  return {
    id: String(source.id || '').trim() || iphoneWechatGenEntityId('wg'),
    name,
    wxId: String(source.wxId || '').trim().slice(0, 32),
    avatar: iphoneNormalizeWechatAvatar(source.avatar),
    memberIds: [...new Set(members.map(String).filter((id) => friendIds.has(id)))],
    messages: iphoneNormalizeWechatMessages(source.messages),
    floorSynced: Math.max(0, Math.floor(Number(source.floorSynced) || 0)),
  };
}

// 朋友圈动态归一化：与 QQ 的 dynamics 完全同构（含点赞与评论的清洗规则）。
function iphoneNormalizeWechatMoments(raw, friendIds) {
  return iphoneNormalizeQqDynamics(raw, friendIds);
}

function iphoneNormalizeWechatData(raw) {
  const source = raw && typeof raw === 'object' ? raw : {};
  const friends = (Array.isArray(source.friends) ? source.friends : [])
    .map(iphoneNormalizeWechatFriend)
    .filter(Boolean);
  const friendIds = new Set(friends.map((friend) => friend.id));
  const groups = (Array.isArray(source.groups) ? source.groups : [])
    .map((group) => iphoneNormalizeWechatGroup(group, friendIds))
    .filter(Boolean);
  const moments = iphoneNormalizeWechatMoments(source.moments, friendIds);
  const momentsFloorSynced = Math.max(0, Math.floor(Number(source.momentsFloorSynced) || 0));
  return { friends, groups, moments, momentsFloorSynced };
}

function iphoneGetWechatData() {
  return iphoneNormalizeWechatData(iphoneGetQqStorage().wechatData);
}

function iphoneSetWechatData(wxScreen, next) {
  iphoneGetQqStorage().wechatData = iphoneNormalizeWechatData(next);
  iphoneSaveQqStorage();
  if (wxScreen) wxScreen._renderWechatSocial?.();
}

// ---------- 微信记录楼层同步（v0.18.0；v0.21.0 起每段各有标签，v0.23.0 起方括号） ----------
// 与 QQ 共用同一条串行链（iphoneQqFloorSyncChain）与同一个 iPhone_Message 楼层：
// 私聊段 `[微信_私聊_联系人]` 包 `与「联系人」的微信聊天记录：`，群聊段
// `[微信_群聊_群名]` 包 `群「群名」的微信群聊记录：`，与 QQ 的段标签并列
//（见 IPHONE_FLOOR_SECTION_TAG_HEADS），同一楼层的多段记录按段分开。
function iphoneSyncWechatChatFloor(entityId) {
  const run = async () => {
    const ctx = iphoneGetFloorChatContext();
    if (!ctx || !entityId) return;
    const stored = iphoneGetQqStorage().wechatData;
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
    const sanitizeName = (value, fallback) => String(value || '').replace(/[\r\n「」]+/g, ' ').trim() || fallback;
    // 消息内容里的换行把一行拆成两行，同步按行解析楼层时会破坏段结构（v0.21.0），
    // 与 QQ 同规则压成单行
    const sanitizeContent = (value) => String(value ?? '').replace(/[\r\n]+/g, ' ').trim();
    const speakerName = isGroup ? '' : sanitizeName(entity.name, '对方');
    const lines = newMessages.map((msg) => {
      const speaker = msg.role === 'assistant'
        ? (isGroup ? sanitizeName(msg.name, '群成员') : speakerName)
        : '{{user}}';
      return `${speaker}：「${sanitizeContent(msg.content)}」`;
    });
    const sectionHeader = isGroup
      ? `群「${sanitizeName(entity.name, '群聊')}」的微信群聊记录：`
      : `与「${speakerName}」的微信聊天记录：`;
    // 本段的标签（v0.21.0，v0.23.0 起方括号）：如 [微信_私聊_苏晚] / [微信_群聊_同学群]
    const sectionTag = (isGroup
      ? IPHONE_FLOOR_SECTION_TAG_HEADS.wechatGroup
      : IPHONE_FLOOR_SECTION_TAG_HEADS.wechatChat)
      .replace('{name}', iphoneFloorSectionTagName(entity.name, isGroup ? '未知群聊' : '未知联系人'));
    const chat = ctx.chat;
    const last = chat[chat.length - 1];
    const existingInner = last ? iphoneExtractMessageFloorInner(last.mes) : null;
    if (existingInner == null) {
      const sections = [{ tag: sectionTag, header: sectionHeader, lines }];
      await iphoneAppendChatFloor(ctx, iphoneWrapMessageFloorInner(iphoneFloorBuildInner(sections)));
    } else {
      // 已是记录楼层：本会话的段（标签或段头认出，旧格式的裸段顺带补上标签完成
      // 迁移）续写新对话并挪到楼层末尾；没有本段就新开一段。
      const sections = iphoneFloorParseInner(existingInner);
      iphoneFloorUpsertSection(sections, sectionTag, sectionHeader, lines);
      await iphoneUpdateChatFloor(ctx, chat.length - 1, iphoneWrapMessageFloorInner(iphoneFloorBuildInner(sections)));
    }
    entity.floorSynced = entity.messages.length;
    iphoneSaveQqStorage();
    iphoneLog('info', `已同步 ${newMessages.length} 条微信聊天记录到 iPhone_Message 楼层`);
  };
  const guarded = async () => {
    try {
      await run();
    } catch (error) {
      iphoneLog('warn', '同步微信聊天记录到 iPhone_Message 楼层失败', error);
    }
  };
  iphoneQqFloorSyncChain = iphoneQqFloorSyncChain.then(guarded, guarded);
  return iphoneQqFloorSyncChain;
}

// 朋友圈动态楼层同步：与 QQ空间动态同一套「整段重写」（评论变化要如实反映），
// 段头为 `朋友圈动态：`（v0.21.0 起外面包标签，v0.23.0 起为 [朋友圈动态]），块格式与 QQ空间
// 动态段一致（◆ 名前缀 + 点赞 + 评论）。
function iphoneSyncWechatMomentsFloor() {
  const run = async () => {
    const ctx = iphoneGetFloorChatContext();
    if (!ctx) return;
    const stored = iphoneGetQqStorage().wechatData;
    const moments = Array.isArray(stored?.moments) ? stored.moments : [];
    if (!moments.length) return;
    const sanitize = (value, fallback) => String(value || '').replace(/[\r\n:：]+/g, ' ').trim() || fallback;
    const lines = [];
    for (const moment of moments) {
      const friend = (Array.isArray(stored.friends) ? stored.friends : [])
        .find((f) => f && f.id === moment.friendId);
      const name = sanitize(friend?.name, '微信用户');
      const text = String(moment.text || '').replace(/[\r\n]+/g, ' ').trim();
      lines.push(`◆ ${name}：${text}`);
      if (Array.isArray(moment.likes) && moment.likes.length) {
        lines.push(`  点赞：${moment.likes.map((n) => sanitize(n, '微信用户')).join('、')}`);
      }
      if (Array.isArray(moment.comments) && moment.comments.length) {
        lines.push('  评论：');
        const author = (value) => (
          iphoneIsWechatLegacyPlayerName(value) ? IPHONE_WECHAT_USER_MACRO : sanitize(value, '微信用户')
        );
        for (const c of moment.comments) {
          const ctext = String(c.text || '').replace(/[\r\n]+/g, ' ').trim();
          if (!ctext) continue;
          lines.push(c.replyName
            ? `  - ${author(c.name)} 回复 ${author(c.replyName)}：${ctext}`
            : `  - ${author(c.name)}：${ctext}`);
        }
      }
    }
    const sectionHeader = '朋友圈动态：';
    const sectionTag = IPHONE_FLOOR_SECTION_TAG_HEADS.wechatMoments;
    const chat = ctx.chat;
    const last = chat[chat.length - 1];
    const existingInner = last ? iphoneExtractMessageFloorInner(last.mes) : null;
    if (existingInner == null) {
      const sections = [{ tag: sectionTag, header: sectionHeader, lines }];
      await iphoneAppendChatFloor(ctx, iphoneWrapMessageFloorInner(iphoneFloorBuildInner(sections)));
      iphoneLog('info', `已同步 ${moments.length} 条朋友圈动态到 iPhone_Message 楼层`);
      return;
    }
    // 已是记录楼层：按段切开，动态段整段替换成最新全文（重复的旧段一并合并清理，
    // 旧格式的裸段顺带补上标签完成迁移），聊天记录段原样保留。
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
    iphoneLog('info', `已更新朋友圈动态段到 iPhone_Message 楼层（${moments.length} 条动态）`);
  };
  const guarded = async () => {
    try {
      await run();
    } catch (error) {
      iphoneLog('warn', '同步朋友圈动态到 iPhone_Message 楼层失败', error);
    }
  };
  iphoneQqFloorSyncChain = iphoneQqFloorSyncChain.then(guarded, guarded);
  return iphoneQqFloorSyncChain;
}

// ---------- 微信聊天提示词（v0.18.0） ----------
// 与 QQ 同一套组装范式：system 依次装角色扮演指令 + 结构说明 + 扮演与对白指导 +
// 群成员列表（仅群聊）+ 世界书 + 酒馆最近楼层 + 最新记录楼层 + 输出格式；
// 会话记录按「发送者：「内容」」排版。预设存 settings.promptPresets 的
// wechatChat / wechatGroup / wechatMoments（见 iphoneGetWechatChatPreset）。
function iphoneGetWechatChatPreset(kind = 'friend') {
  const presetKey = kind === 'group' ? 'wechatGroup' : (kind === 'moments' ? 'wechatMoments' : 'wechatChat');
  const defaults = kind === 'group'
    ? IPHONE_WECHAT_GROUP_PRESET_DEFAULT
    : (kind === 'moments' ? IPHONE_WECHAT_MOMENTS_PRESET_DEFAULT : IPHONE_WECHAT_CHAT_PRESET_DEFAULT);
  const raw = iphoneGetSettings().promptPresets?.[presetKey] || {};
  const persona = typeof raw.persona === 'string' ? raw.persona : defaults.persona;
  const worldBook = typeof raw.worldBook === 'boolean' ? raw.worldBook : defaults.worldBook;
  const latestFloor = typeof raw.latestFloor === 'boolean' ? raw.latestFloor : defaults.latestFloor;
  const format = typeof raw.format === 'string' ? raw.format : defaults.format;
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

// 提示词组装（好友 / 群聊）：与 iphoneBuildQqChatRequestMessages 同一套结构与
// 段落顺序，仅产品名与记录楼层段的称谓不同（<qq_chat_log> 改成 <wechat_chat_log>，
// 面向模型的介绍文案同步换成微信）。
async function iphoneBuildWechatChatRequestMessages(entity, conversation) {
  const ctx = iphoneGetContextSafe();
  const isGroup = entity?.kind === 'group';
  const preset = iphoneGetWechatChatPreset(isGroup ? 'group' : 'friend');
  const resolve = (text) => iphoneResolveTavernMacros(text, ctx);
  const entityName = String(entity?.name || '').trim() || (isGroup ? '群聊' : '对方');
  const fill = (text) => resolve(String(text ?? '')
    .replace(/\{\{group\}\}/gi, () => entityName)
    .replace(/\{\{char\}\}/gi, () => entityName));
  const fillGuide = (text) => resolve(String(text ?? '')
    .replace(/\{\{char\}\}/gi, () => (isGroup ? '群成员' : entityName)));
  const userName = String(ctx?.name1 || '').trim() || '用户';

  const persona = preset.persona.trim();
  const npcLogic = preset.npcLogic.trim();
  const dialogueGuidance = preset.dialogueGuidance.trim();

  let membersText = '';
  if (isGroup) {
    const data = iphoneGetWechatData();
    membersText = (Array.isArray(entity.memberIds) ? entity.memberIds : [])
      .map((id) => data.friends.find((f) => f.id === id))
      .filter(Boolean)
      .map((f) => String(f.name || '').trim())
      .filter(Boolean)
      .map((name) => `- ${name}`)
      .join('\n');
  }

  let worldText = '';
  if (preset.worldBook) {
    try {
      worldText = resolve(iphoneWbBuildPromptText(await iphoneWbCollectState()) || '');
    } catch (error) {
      iphoneLog('warn', '世界书内容注入失败，本次请求不带世界书', error);
    }
  }

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

  const format = preset.format.trim().replace(/^【输出格式】\s*/, '');
  // 第三方扩展注入酒馆提示词的内容（万华镜的变量状态等）：随 system 附带。
  const injectParts = iphoneInjectPromptParts();

  const sysParts = [];
  if (persona) {
    sysParts.push(`<roleplay_instructions>\n${fill(persona)}\n</roleplay_instructions>`);
  }
  const outlineItems = [];
  if (persona) outlineItems.push('<roleplay_instructions>…</roleplay_instructions>：角色扮演指令，约束你的扮演方式；');
  if (npcLogic) outlineItems.push('<npc_logic>…</npc_logic>：扮演逻辑——「先是人，后是设定」，按自身立场与动机行事；');
  if (dialogueGuidance) outlineItems.push('<dialogue_guidance>…</dialogue_guidance>：对白规范——口语化、生活化、带情绪与立场，禁止播报腔；');
  if (membersText) outlineItems.push(`<group_members>…</group_members>：本群成员列表——除玩家（${userName}）外的每位成员都由你扮演，输出时用行首名字区分发言人；`);
  if (worldText) outlineItems.push('<world_info>…</world_info>：当前场景的世界书设定，包含世界观与相关人物的资料；');
  if (injectParts) outlineItems.push(injectParts.outline);
  if (tavernText) outlineItems.push('<tavern_context>…</tavern_context>：酒馆主线的最近对话（时间旧→新），是你当前所处的剧情背景；');
  if (floorLogText) outlineItems.push('<wechat_chat_log>…</wechat_chat_log>：最近一次同步到酒馆楼层的微信聊天记录，可能包含多个联系人/群聊的记录段（每段各自用方括号标签包裹，如 [QQ_私聊_名字] / [微信_群聊_群名] / [朋友圈动态]），供你了解最近的聊天情况；');
  outlineItems.push('<transfer_guidance>…</transfer_guidance>：转账与收款的写法约定——按 `[转账]金额` / `[收款]金额` 标记钱款往来，标记必须单独成条（挂在叙述句尾会认不出来），`[已收款]金额` 是界面写的记账行、不用自己写；');
  if (format) outlineItems.push('<output_format>…</output_format>：回复格式要求，位于提示词末尾，必须严格遵守；');
  if (outlineItems.length) {
    outlineItems.push(isGroup
      ? `聊天记录：接下来的 user / assistant 消息就是本群聊的聊天记录，每条按「发送者：「消息内容」」的样式呈现——user 是玩家（${userName}）发出的消息，assistant 是群成员以前发出的消息（行首名字标明发言人）。`
      : `聊天记录：接下来的 user / assistant 消息就是本微信会话的聊天记录，每条按「发送者：「消息内容」」的样式呈现——user 是「${userName}」发出的消息，assistant 是你（${entityName}）以前发出的消息。`);
    sysParts.push('【提示词结构说明】本次请求的提示词由以下部分组成，除聊天记录外均已用 XML 标签包裹并附介绍：\n'
      + outlineItems.map((item) => `- ${item}`).join('\n'));
  }
  if (npcLogic) {
    sysParts.push(`以下是扮演逻辑指导（决定你如何理解与演绎角色）：\n<npc_logic>\n${fillGuide(npcLogic)}\n</npc_logic>`);
  }
  if (dialogueGuidance) {
    sysParts.push(`以下是对白规范（决定你如何说话）：\n<dialogue_guidance>\n${fillGuide(dialogueGuidance)}\n</dialogue_guidance>`);
  }
  if (membersText) {
    sysParts.push(`以下是本群成员列表（玩家「${userName}」也是群成员，由玩家亲自扮演，不在此列）：\n<group_members>\n${membersText}\n</group_members>`);
  }
  if (worldText) {
    sysParts.push(`以下是当前场景的世界书设定（世界观与人物资料）：\n<world_info>\n${worldText}\n</world_info>`);
  }
  if (injectParts) {
    sysParts.push(injectParts.system);
  }
  if (tavernText) {
    sysParts.push(`以下是酒馆主线的最近对话（时间旧→新），是你当前所处的剧情背景：\n<tavern_context>\n${tavernText}\n</tavern_context>`);
  }
  if (floorLogText) {
    sysParts.push(`以下是最近一次同步到酒馆楼层的微信聊天记录，可能包含多个联系人/群聊的记录段（每段各自用方括号标签包裹，如 [QQ_私聊_名字] / [微信_群聊_群名] / [朋友圈动态]）：\n<wechat_chat_log>\n${floorLogText}\n</wechat_chat_log>`);
  }
  sysParts.push(`以下是转账与收款的写法约定（决定钱款往来怎么表达）：\n<transfer_guidance>\n${fillGuide(IPHONE_WECHAT_TRANSFER_GUIDANCE)}\n</transfer_guidance>`);
  if (format) {
    sysParts.push(`以下是回复格式要求，必须严格遵守：\n<output_format>\n${fill(format)}\n</output_format>`);
  }

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

// 朋友圈动态生成：与 iphoneGenerateQqDynamics 同一套流程（下拉刷新时调用一次），
// 预设来自「设置 · 朋友圈提示词」，联系人名单 + 世界书 + 酒馆上下文；回复按
// 动态区块解析（点赞 / 评论），名单外的发布者与互动人丢弃。
// ownerId（v0.20.0）：从「TA的朋友圈」下拉刷新时传访客 id，本次只为 TA 生成一条，
// `<contacts>` 收窄成 TA 一人（<contacts_all> 仍给全名单做点赞/评论人）
async function iphoneGenerateWechatMoments(ownerId) {
  const data = iphoneGetWechatData();
  const friends = data.friends;
  if (!friends.length) throw new Error('还没有联系人，无法生成动态');
  const owner = ownerId ? friends.find((f) => f.id === ownerId) || null : null;
  if (ownerId && !owner) throw new Error('还没有联系人，无法生成动态');
  const settings = iphoneGetSettings();
  const ctx = iphoneGetContextSafe();
  const preset = iphoneGetWechatChatPreset('moments');
  const resolve = (text) => iphoneResolveTavernMacros(text, ctx);
  const fillGuide = (text) => resolve(String(text ?? '').replace(/\{\{char\}\}/gi, owner ? owner.name : '联系人'));
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

  const persona = preset.persona.trim();
  const npcLogic = preset.npcLogic.trim();
  const dialogueGuidance = preset.dialogueGuidance.trim();
  const guidance = String(preset.guidance ?? '').trim();
  const format = String(preset.format ?? '').trim();
  const worldTextTrimmed = worldText.trim();
  const tavernText = historyLines.join('\n');
  // 第三方扩展注入酒馆提示词的内容（万华镜的变量状态等）：随 system 附带。
  const injectParts = iphoneInjectPromptParts();

  const sysParts = [];
  if (persona) sysParts.push(`<roleplay_instructions>\n${resolve(persona)}\n</roleplay_instructions>`);
  const outlineItems = [];
  if (persona) outlineItems.push('<roleplay_instructions>…</roleplay_instructions>：角色扮演指令，约束人物设定与世界观基线；');
  if (npcLogic) outlineItems.push('<npc_logic>…</npc_logic>：扮演逻辑——「先是人，后是设定」，按自身立场与动机行事；');
  if (dialogueGuidance) outlineItems.push('<dialogue_guidance>…</dialogue_guidance>：表达规范——口语化、生活化、带情绪与立场，禁止播报腔；');
  outlineItems.push(owner
    ? '<contacts>…</contacts>：本次朋友圈动态的唯一发布者——只能由 TA 发这一条动态；'
    : '<contacts>…</contacts>：微信联系人名单——动态的发布者只能从名单中挑选；');
  if (owner) outlineItems.push('<contacts_all>…</contacts_all>：微信全部联系人名单——点赞与评论只认这份名单里的人；');
  if (worldTextTrimmed) outlineItems.push('<world_info>…</world_info>：当前场景的世界书设定，包含世界观与相关人物的资料；');
  if (injectParts) outlineItems.push(injectParts.outline);
  if (tavernText) outlineItems.push('<tavern_context>…</tavern_context>：酒馆主线的最近对话（时间旧→新），是当前正在发生的剧情背景；');
  if (floorLogText) outlineItems.push('<wechat_chat_log>…</wechat_chat_log>：最近一次同步到酒馆楼层的微信记录，可能包含多个联系人的记录段（每段各自用方括号标签包裹，如 [QQ_私聊_名字] / [微信_群聊_群名] / [朋友圈动态]），供你了解最近的聊天情况；');
  if (guidance) outlineItems.push('<moments_guidance>…</moments_guidance>：朋友圈动态的写作指导；');
  if (format) outlineItems.push('<output_format>…</output_format>：回复格式要求，位于提示词末尾，必须严格遵守；');
  sysParts.push('【提示词结构说明】本次请求的提示词由以下部分组成，均已用 XML 标签包裹并附介绍：\n'
    + outlineItems.map((item) => `- ${item}`).join('\n'));
  if (npcLogic) sysParts.push(`以下是扮演逻辑指导（决定你如何理解与演绎角色）：\n<npc_logic>\n${fillGuide(npcLogic)}\n</npc_logic>`);
  if (dialogueGuidance) sysParts.push(`以下是表达规范（决定你如何说话与写内容）：\n<dialogue_guidance>\n${fillGuide(dialogueGuidance)}\n</dialogue_guidance>`);
  sysParts.push(owner
    ? `以下是这条朋友圈动态唯一的发布者，动态必须由 TA 发出（其他人不许发）：\n<contacts>\n${rosterText}\n</contacts>`
    : `以下是微信联系人名单（动态的发布者只能从中挑选）：\n<contacts>\n${rosterText}\n</contacts>`);
  if (owner) sysParts.push(`以下是微信全部联系人名单（点赞与评论只认这份名单里的人）：\n<contacts_all>\n${allNamesRosterText}\n</contacts_all>`);
  if (worldTextTrimmed) sysParts.push(`以下是当前场景的世界书设定（世界观与人物资料）：\n<world_info>\n${worldTextTrimmed}\n</world_info>`);
  if (injectParts) sysParts.push(injectParts.system);
  if (tavernText) sysParts.push(`以下是酒馆主线的最近对话（时间旧→新），是你当前所处的剧情背景：\n<tavern_context>\n${tavernText}\n</tavern_context>`);
  if (floorLogText) sysParts.push(`以下是最近一次同步到酒馆楼层的微信记录，可能包含多个联系人的记录段（每段各自用方括号标签包裹，如 [QQ_私聊_名字] / [微信_群聊_群名] / [朋友圈动态]）：\n<wechat_chat_log>\n${floorLogText}\n</wechat_chat_log>`);
  if (guidance) sysParts.push(`以下是朋友圈动态的写作指导：\n<moments_guidance>\n${resolve(guidance)}\n</moments_guidance>`);
  if (format) sysParts.push(`以下是回复格式要求，必须严格遵守：\n<output_format>\n${resolve(format)}\n</output_format>`);

  const userContent = owner
    ? `请根据以上信息，为 ${owner.name} 的微信朋友圈生成一条新的动态，只由 ${owner.name} 发布。`
    : `请根据以上信息，为微信朋友圈生成新的动态。`;
  const reply = await iphoneRequestChatCompletion(settings, [
    { role: 'system', content: sysParts.join('\n\n') },
    { role: 'user', content: userContent },
  ]);
  // 先按动态区块格式解析（与 QQ空间同款区块格式，复用同一个解析器）；
  // 模型没按格式输出时回退聊天行格式，退化成纯文字动态
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
    if (!friend || usedFriendIds.has(friend.id)) continue;
    // 访客模式：只认 TA 发的，别人（模型跑偏）一律作废，由外层报错重试
    if (owner && friend.id !== owner.id) continue;
    usedFriendIds.add(friend.id);
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
  iphoneLog('info', `朋友圈刷新成功：生成 ${created.length} 条新动态${owner ? `（${owner.name} 的朋友圈）` : ''}${fallbackUsed ? '（回退纯文字格式）' : ''}`);
  return created;
}

// 朋友圈「回复帖子」：与 iphoneGenerateQqDynamicReply 同一套流程，`<dynamic_post>`
// 换成朋友圈语境，预设用「设置 · 朋友圈提示词」里的回复指导与格式。
async function iphoneGenerateWechatMomentReply(moment) {
  const settings = iphoneGetSettings();
  const data = iphoneGetWechatData();
  const friends = data.friends;
  if (!friends.length) throw new Error('还没有联系人，无法生成回复');
  const post = data.moments.find((m) => m.id === moment?.id) || moment;
  if (!post) throw new Error('这条动态已经不在了');
  const publisher = friends.find((f) => f.id === post.friendId);
  if (!publisher) throw new Error('动态发布者已不在联系人列表中');
  const ctx = iphoneGetContextSafe();
  const preset = iphoneGetWechatChatPreset('moments');
  const resolve = (text) => iphoneResolveTavernMacros(text, ctx);
  const fillGuide = (text) => resolve(String(text ?? '').replace(/\{\{char\}\}/gi, '联系人'));
  const rosterText = friends.map((f) => `- ${String(f.name || '').trim()}`).join('\n');
  const playerName = iphoneGetTavernUserName() || IPHONE_WECHAT_ME_FALLBACK_NAME;
  const playerAuthor = iphoneGetWechatPlayerAuthor();
  const customNick = iphoneGetWechatCustomNick();
  const playerAliases = new Set([playerName, customNick].filter(Boolean));
  const playerDesc = customNick && customNick !== playerName
    ? `玩家「${playerName}」（TA 的微信昵称是「${customNick}」，评论区里署「${customNick}」的就是 TA）`
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
    for (const c of post.comments) {
      postLines.push(c.replyName
        ? `- ${inline(iphoneResolveWechatPlayerAuthor(c.name))} 回复 ${inline(iphoneResolveWechatPlayerAuthor(c.replyName))}：${inline(c.text)}`
        : `- ${inline(iphoneResolveWechatPlayerAuthor(c.name))}：${inline(c.text)}`);
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
  // 第三方扩展注入酒馆提示词的内容（万华镜的变量状态等）：随 system 附带。
  const injectParts = iphoneInjectPromptParts();

  const sysParts = [];
  if (persona) sysParts.push(`<roleplay_instructions>\n${resolve(persona)}\n</roleplay_instructions>`);
  const outlineItems = [];
  if (persona) outlineItems.push('<roleplay_instructions>…</roleplay_instructions>：角色扮演指令，约束人物设定与世界观基线；');
  if (npcLogic) outlineItems.push('<npc_logic>…</npc_logic>：扮演逻辑——「先是人，后是设定」，按自身立场与动机行事；');
  if (dialogueGuidance) outlineItems.push('<dialogue_guidance>…</dialogue_guidance>：表达规范——口语化、生活化、带情绪与立场，禁止播报腔；');
  outlineItems.push('<contacts>…</contacts>：微信联系人名单——评论人只能从名单中挑选；');
  if (worldTextTrimmed) outlineItems.push('<world_info>…</world_info>：当前场景的世界书设定，包含世界观与相关人物的资料；');
  if (injectParts) outlineItems.push(injectParts.outline);
  if (tavernText) outlineItems.push('<tavern_context>…</tavern_context>：酒馆主线的最近对话（时间旧→新），是当前正在发生的剧情背景；');
  if (floorLogText) outlineItems.push('<wechat_chat_log>…</wechat_chat_log>：最近一次同步到酒馆楼层的微信记录，供你了解最近的聊天情况；');
  outlineItems.push('<dynamic_post>…</dynamic_post>：玩家正在回复的那条朋友圈——发布者、正文、点赞名单与评论区（时间旧→新，最后一条是玩家本人留下的新评论）；');
  if (replyGuidance) outlineItems.push('<reply_guidance>…</reply_guidance>：评论回复的写作指导；');
  if (replyFormat) outlineItems.push('<output_format>…</output_format>：回复格式要求，位于提示词末尾，必须严格遵守；');
  sysParts.push('【提示词结构说明】本次请求的提示词由以下部分组成，均已用 XML 标签包裹并附介绍：\n'
    + outlineItems.map((item) => `- ${item}`).join('\n'));
  if (npcLogic) sysParts.push(`以下是扮演逻辑指导（决定你如何理解与演绎角色）：\n<npc_logic>\n${fillGuide(npcLogic)}\n</npc_logic>`);
  if (dialogueGuidance) sysParts.push(`以下是表达规范（决定你如何说话与写内容）：\n<dialogue_guidance>\n${fillGuide(dialogueGuidance)}\n</dialogue_guidance>`);
  sysParts.push(`以下是微信联系人名单（评论人只能从中挑选）：\n<contacts>\n${rosterText}\n</contacts>`);
  if (worldTextTrimmed) sysParts.push(`以下是当前场景的世界书设定（世界观与人物资料）：\n<world_info>\n${worldTextTrimmed}\n</world_info>`);
  if (injectParts) sysParts.push(injectParts.system);
  if (tavernText) sysParts.push(`以下是酒馆主线的最近对话（时间旧→新），是你当前所处的剧情背景：\n<tavern_context>\n${tavernText}\n</tavern_context>`);
  if (floorLogText) sysParts.push(`以下是最近一次同步到酒馆楼层的微信记录，可能包含多个联系人的记录段（每段各自用方括号标签包裹，如 [QQ_私聊_名字] / [微信_群聊_群名] / [朋友圈动态]）：\n<wechat_chat_log>\n${floorLogText}\n</wechat_chat_log>`);
  const identityNote = customNick && customNick !== playerName
    ? `评论区里署名「${customNick}」的评论也是 TA 写的。`
    : '评论区的署名用的就是 TA 的名字。';
  sysParts.push(`以下是玩家身份说明：${playerDesc}。${identityNote}不要把 TA 当成联系人或替 TA 发言。`);
  sysParts.push(`以下是玩家正在回复的那条朋友圈（含完整评论区）：\n<dynamic_post>\n${postText}\n</dynamic_post>`);
  if (replyGuidance) sysParts.push(`以下是评论回复的写作指导：\n<reply_guidance>\n${resolve(replyGuidance)}\n</reply_guidance>`);
  if (replyFormat) sysParts.push(`以下是回复格式要求，必须严格遵守：\n<output_format>\n${resolve(replyFormat)}\n</output_format>`);

  const userContent = `${playerDesc}在朋友圈评论区留下了新评论（评论区最后一条），请根据以上信息生成新的评论回复。`;
  const reply = await iphoneRequestChatCompletion(settings, [
    { role: 'system', content: sysParts.join('\n\n') },
    { role: 'user', content: userContent },
  ]);

  const friendNames = new Set(friends.map((f) => String(f.name || '').trim()).filter(Boolean));
  const existingKeys = new Set();
  for (const c of (Array.isArray(post.comments) ? post.comments : [])) {
    const text = String(c.text || '').trim();
    const rawName = String(c.name || '').trim();
    for (const name of [rawName, iphoneResolveWechatPlayerAuthor(rawName)]) {
      if (name) existingKeys.add(`${name}|${text}`);
    }
  }
  const created = [];
  for (const entry of iphoneParseQqDynamicReplyLines(reply)) {
    const name = String(entry.name || '').trim();
    const text = String(entry.text || '').trim();
    if (!name || !text || playerAliases.has(name) || iphoneIsWechatPlayerAuthor(name) || !friendNames.has(name)) continue;
    const key = `${name}|${text}`;
    if (existingKeys.has(key)) continue;
    existingKeys.add(key);
    const rawReply = String(entry.replyName || '').trim();
    const replyName = (rawReply === playerName || iphoneIsWechatPlayerAuthor(rawReply)) ? playerAuthor : rawReply;
    const knownReply = replyName && replyName !== name
      && (iphoneIsWechatPlayerAuthor(replyName) || playerAliases.has(replyName) || friendNames.has(replyName));
    created.push(knownReply
      ? { name, text, replyName }
      : { name, text });
  }
  let fallbackUsed = false;
  if (!created.length) {
    const whole = String(reply ?? '').replace(/\s+/g, ' ').trim()
      .replace(/^[^：:\n]{1,30}?(?:\s+回复\s+[^：:\n]{1,30}?)?\s*[:：]\s*/, '')
      .slice(0, 300);
    if (!whole) throw new Error('AI 没有返回有效回复内容。');
    created.push({ name: publisher.name, text: whole });
    fallbackUsed = true;
  }
  iphoneLog('info', `朋友圈回复成功：生成 ${created.length} 条新评论${fallbackUsed ? '（整段兜底为贴主回复）' : ''}`);
  return created;
}

// 动态展示时间：与 QQ空间同款（刚刚 / N分钟前 / N小时前 / M月D日 HH:MM）。
function iphoneWechatMomentsTimeLabel(moment) {
  return iphoneQqDynamicsTimeLabel(moment);
}

// ---------- 微信通用头像组件 ----------
// 与 iphoneQqBuildEntityAvatar 同构：内置款式（微信自己的类前缀）、自定义图内联
// 背景、否则名字首字字牌（群聊绿渐变、联系人蓝渐变，见 style.css）。
function iphoneWechatBuildEntityAvatar(entity, kind) {
  const el = document.createElement('span');
  el.className = 'iphone-wx__avatar';
  const avatar = entity.avatar;
  if (avatar && avatar.preset) {
    el.classList.add(`iphone-wx__avatar--${avatar.preset}`);
  } else if (avatar && avatar.url) {
    el.style.backgroundImage = `url("${String(avatar.url).replace(/"/g, '%22')}")`;
  } else {
    el.classList.add(kind === 'group' ? 'iphone-wx__avatar--g1' : 'iphone-wx__avatar--g2');
    el.textContent = (entity.name || '?').trim().charAt(0).toUpperCase() || '?';
  }
  return el;
}

// 头像选择浮层（微信版）：复用 QQ 的通用组件，把款式类前缀与默认头像类换成
// 微信的（clsPrefix / meClass）；款式表自 v0.31.0 起三个应用是同一份，直接沿用
// 组件默认的 IPHONE_ME_AVATAR_PRESETS，其余（上传、链接、选中逻辑）完全共用。
// ---------- 微信回复解析 ----------
// 回复格式与 QQ 完全同款：私聊每行 `联系人：「内容」`，群聊每行 `成员名：「内容」`。
// 解析器直接复用 QQ 的实现（apps.js，定义在拼接后的同一作用域），这里保留
// 微信名字的别名，方便按产品查找调用点。
const iphoneParseWechatChatReply = iphoneParseQqChatReply;
const iphoneParseWechatGroupReply = iphoneParseQqGroupReply;

function iphoneWechatBuildAvatarPicker(icons, { getCurrent, onPick, commit }) {
  return iphoneQqBuildAvatarPicker(icons, {
    getCurrent: () => iphoneNormalizeWechatAvatar(getCurrent()),
    onPick: (avatar) => onPick(iphoneNormalizeWechatAvatar(avatar)),
    commit: commit ? (avatar) => commit(iphoneNormalizeWechatAvatar(avatar)) : undefined,
    presets: IPHONE_ME_AVATAR_PRESETS,
    clsPrefix: 'iphone-wx__avatar--',
    meClass: 'iphone-wx__me-avatar',
  });
}

// ---------- 微信消息页会话行（联系人 / 群聊各一行，预览最后一条消息） ----------
// 对照真实微信：圆角方头像 + 名字 + 灰色预览 + 右上角时间；群聊预览带「发言人：」。
function iphoneWechatBuildChatItem(entity, onOpen) {
  const item = document.createElement('li');
  item.className = 'iphone-wx__chat';
  item.appendChild(iphoneWechatBuildEntityAvatar(entity, entity.kind));
  const main = document.createElement('div');
  main.className = 'iphone-wx__chat-main';
  const line = document.createElement('div');
  line.className = 'iphone-wx__chat-line';
  const title = document.createElement('span');
  title.className = 'iphone-wx__chat-title';
  title.textContent = entity.name;
  const time = document.createElement('span');
  time.className = 'iphone-wx__chat-time';
  const lastMsg = Array.isArray(entity.messages) && entity.messages.length
    ? [...entity.messages].reverse().find((m) => m && !m.hidden) || null
    : null;
  // 时间取该会话最后一条消息的落库时间（旧数据没有 ts：留空不显示）
  if (lastMsg && Number(lastMsg.ts) > 0) time.textContent = iphoneWechatChatTimeLabel(Number(lastMsg.ts));
  line.append(title, time);
  const preview = document.createElement('p');
  preview.className = 'iphone-wx__chat-preview';
  if (lastMsg) {
    const who = lastMsg.role === 'user'
      ? ''
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

// 会话列表时间：今天显示 HH:MM，昨天显示「昨天」，更早显示 M月D日（微信同款）。
function iphoneWechatChatTimeLabel(ts) {
  const date = new Date(ts);
  if (!Number.isFinite(date.getTime())) return '';
  const now = new Date();
  const sameDay = date.toDateString() === now.toDateString();
  if (sameDay) {
    return `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
  }
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) return '昨天';
  return `${date.getMonth() + 1}月${date.getDate()}日`;
}

// 名字首字母（通讯录 / 收款方列表的分组用）：英文取首字母大写、数字与符号归 #、
// 中文按常用姓氏表近似，其余归 #。
function iphoneWechatLetterOf(name) {
  const ch = String(name || '').trim().charAt(0);
  if (!ch) return '#';
  if (/[a-zA-Z]/.test(ch)) return ch.toUpperCase();
  if (/[0-9]/.test(ch)) return '#';
  return IPHONE_WECHAT_PINYIN_HINTS[ch] || '#';
}

// 把一组人按首字母分组（返回 [{ letter, items }]，字母序、# 垫底），通讯录与
// 收款方列表共用。
function iphoneWechatGroupByLetter(items) {
  const buckets = new Map();
  for (const item of items) {
    const letter = iphoneWechatLetterOf(item.name);
    if (!buckets.has(letter)) buckets.set(letter, []);
    buckets.get(letter).push(item);
  }
  return [...buckets.keys()]
    .sort((a, b) => {
      if (a === '#') return 1;
      if (b === '#') return -1;
      return a.localeCompare(b);
    })
    .map((letter) => ({ letter, items: buckets.get(letter) }));
}

// ---------- 选择收款方（v0.25.0 群聊转账） ----------
// 按真实微信的「选择收款方」页复刻：顶部返回 + 居中标题，下方圆角搜索框，列表按
// 名字首字母分组（灰底分组头 + 头像行），右侧一列首字母索引条（顶上带放大镜，
// 点字母跳到对应分组）。只列群成员——不含玩家自己，微信里不能给自己转账。
function iphoneWechatBuildPayeePicker(icons, members, onPick, onClose) {
  const view = document.createElement('div');
  view.className = 'iphone-wxc__payee';

  const nav = document.createElement('header');
  nav.className = 'iphone-wxc__payee-nav';
  nav.innerHTML = `
    <button type="button" class="iphone-wxc__payee-back" aria-label="返回">${icons.back}</button>
    <p class="iphone-wxc__payee-title">选择收款方</p>
  `;
  nav.querySelector('.iphone-wxc__payee-back').addEventListener('click', onClose);

  const searchBox = document.createElement('div');
  searchBox.className = 'iphone-wxc__payee-search';
  searchBox.innerHTML = `<span class="iphone-wxc__payee-searchico" aria-hidden="true">${icons.search}</span>`;
  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.className = 'iphone-wxc__payee-input';
  searchInput.placeholder = '搜索';
  searchInput.setAttribute('aria-label', '搜索收款方');
  searchInput.autocomplete = 'off';
  searchBox.appendChild(searchInput);

  const body = document.createElement('div');
  body.className = 'iphone-wxc__payee-body';
  const scroller = document.createElement('div');
  scroller.className = 'iphone-wxc__payee-scroll';
  const indexBar = document.createElement('div');
  indexBar.className = 'iphone-wxc__payee-index';
  body.append(scroller, indexBar);

  const render = () => {
    const keyword = searchInput.value.trim().toLowerCase();
    const list = keyword
      ? members.filter((m) => `${m.name || ''}`.toLowerCase().includes(keyword)
        || `${m.wxId || ''}`.toLowerCase().includes(keyword))
      : members;
    scroller.innerHTML = '';
    indexBar.innerHTML = '';
    if (!list.length) {
      const empty = document.createElement('p');
      empty.className = 'iphone-wxc__payee-empty';
      empty.textContent = keyword ? '没有匹配的群成员' : '本群还没有其他成员';
      scroller.appendChild(empty);
      return;
    }
    const groups = iphoneWechatGroupByLetter(list);
    for (const group of groups) {
      const sec = document.createElement('section');
      sec.className = 'iphone-wxc__payee-sec';
      sec.dataset.letter = group.letter;
      const head = document.createElement('p');
      head.className = 'iphone-wxc__payee-sechead';
      head.textContent = group.letter;
      sec.appendChild(head);
      for (const member of group.items) {
        const row = document.createElement('button');
        row.type = 'button';
        row.className = 'iphone-wxc__payee-row';
        row.appendChild(iphoneWechatBuildEntityAvatar(member, 'friend'));
        const name = document.createElement('span');
        name.className = 'iphone-wxc__payee-name';
        name.textContent = member.name;
        row.appendChild(name);
        row.addEventListener('click', () => onPick(member));
        sec.appendChild(row);
      }
      scroller.appendChild(sec);
    }
    // 索引条：顶上放大镜（点它回到列表顶部）+ 每个字母一枚（点它跳到该分组）
    const searchIco = document.createElement('button');
    searchIco.type = 'button';
    searchIco.className = 'iphone-wxc__payee-indexico';
    searchIco.setAttribute('aria-label', '回到顶部');
    searchIco.innerHTML = icons.search;
    searchIco.addEventListener('click', () => { scroller.scrollTop = 0; });
    indexBar.appendChild(searchIco);
    for (const group of groups) {
      const item = document.createElement('button');
      item.type = 'button';
      item.className = 'iphone-wxc__payee-indexitem';
      item.textContent = group.letter;
      item.addEventListener('click', () => {
        const sec = scroller.querySelector(`.iphone-wxc__payee-sec[data-letter="${group.letter}"]`);
        if (sec) scroller.scrollTop = sec.offsetTop;
      });
      indexBar.appendChild(item);
    }
  };
  searchInput.addEventListener('input', render);
  render();

  view.append(nav, searchBox, body);
  return view;
}

// ---------- 微信聊天页（联系人 / 群聊会话） ----------
// 与 iphoneQqBuildChatView 同一套交互（长按/右键删除单条、清空消息、发送与回复、
// 楼层同步、输入态占位），观感换成微信：浅灰底、白/绿气泡（绿=自己）、
// 圆角方头像、群聊显示发言人名、输入栏含语音/表情/加号（展示用）。
function iphoneWechatBuildChatView(entity, icons, onBack, onMenu, wxScreen) {
  const isGroup = entity.kind === 'group';
  // 转账归属的上下文（v0.25.0）：群聊里收款人写在标记里，没写就默认转给玩家；
  // 私聊里收款人按对话双方推定，所以要带上会话名。
  const msgMeta = { isGroup, entityName: String(entity.name || '').trim() };
  const view = document.createElement('div');
  view.className = 'iphone-wxc';

  const header = document.createElement('header');
  header.className = 'iphone-wxc__header';
  header.innerHTML = `
    <button type="button" class="iphone-wxc__back" aria-label="返回">${icons.back}</button>
    <p class="iphone-wxc__title"></p>
    <button type="button" class="iphone-wxc__menu" aria-label="聊天设置">${icons.more}</button>
  `;
  header.querySelector('.iphone-wxc__back').addEventListener('click', onBack);
  if (onMenu) header.querySelector('.iphone-wxc__menu').addEventListener('click', () => onMenu(chatApi));
  header.querySelector('.iphone-wxc__title').textContent = isGroup
    ? `${entity.name}(${entity.memberIds.length + 1})`
    : entity.name || '';

  const stream = document.createElement('div');
  stream.className = 'iphone-wxc__stream';
  const messages = Array.isArray(entity.messages) ? entity.messages.slice() : [];
  const scrollStreamToBottom = () => { stream.scrollTop = stream.scrollHeight; };

  const memberAvatars = new Map();
  if (isGroup) {
    const data = iphoneGetWechatData();
    (Array.isArray(entity.memberIds) ? entity.memberIds : []).forEach((id) => {
      const member = data.friends.find((f) => f.id === id);
      if (member) memberAvatars.set(member.name, member.avatar);
    });
  }

  const findEntity = (data) => data.friends.find((f) => f.id === entity.id)
    || data.groups.find((g) => g.id === entity.id);

  const deleteMessage = (index) => {
    if (index < 0 || index >= messages.length) return;
    messages.splice(index, 1);
    const data = iphoneGetWechatData();
    const target = findEntity(data);
    if (target) {
      if (index < (Number(target.floorSynced) || 0)) {
        target.floorSynced = Math.max(0, (Number(target.floorSynced) || 0) - 1);
      }
      target.messages = messages.slice();
    }
    iphoneSetWechatData(wxScreen, data);
    renderMessages();
  };

  const attachBubbleActions = (row, bubble, index) => {
    const showMenu = () => {
      stream.querySelectorAll('.iphone-wxc__msgmenu').forEach((el) => el.remove());
      const menu = document.createElement('div');
      menu.className = 'iphone-wxc__msgmenu';
      const topGap = row.getBoundingClientRect().top - stream.getBoundingClientRect().top;
      menu.classList.toggle('iphone-wxc__msgmenu--below', topGap < 140);
      const item = document.createElement('button');
      item.type = 'button';
      item.className = 'iphone-wxc__msgmenu-item';
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
      sys.className = 'iphone-wxc__sys';
      sys.textContent = isGroup
        ? `你邀请 ${(Array.isArray(entity.memberIds) ? entity.memberIds.length : 0) + 1} 位朋友加入了群聊，和大家打个招呼吧！`
        : '你们已经是好友了，现在可以开始聊天了！';
      stream.appendChild(sys);
      return;
    }
    messages.forEach((msg, index) => {
      // 记账行（[已收款]金额）只进记录与楼层，不占聊天气泡
      if (msg.hidden) return;
      const isMine = msg.role === 'user';
      const row = document.createElement('div');
      row.className = `iphone-wxc__msg${isMine ? ' iphone-wxc__msg--out' : ''}`;
      const avatarEntity = isMine
        ? null
        : (isGroup
          ? { name: msg.name, avatar: memberAvatars.get(msg.name) ?? null }
          : entity);
      if (!isMine) row.appendChild(iphoneWechatBuildEntityAvatar(avatarEntity || {}, isGroup ? 'friend' : 'friend'));
      const col = document.createElement('div');
      col.className = 'iphone-wxc__msgcol';
      if (isGroup && !isMine) {
        const nameEl = document.createElement('p');
        nameEl.className = 'iphone-wxc__mname';
        nameEl.textContent = String(msg.name || '').trim() || '群成员';
        col.appendChild(nameEl);
      }
      const bubble = document.createElement('div');
      bubble.className = 'iphone-wxc__bubble';
      // 转账 / 收款标记（v0.24.0）渲染成转账气泡；[收款] 是动作，不产生新气泡。
      // 群聊气泡上多一行「向X转账」（v0.25.0，对齐真实微信的群里转账），且只有
      // 转给玩家的那笔才可点收款——转给别的群友的钱轮不到玩家收。
      const pay = iphoneParseWechatPay(msg.content);
      if (pay && pay.kind === 'transfer') {
        bubble.classList.add('iphone-wxc__bubble--pay');
        const canCollect = !isMine && iphoneWechatCanCollect(pay, msg, '', msgMeta);
        bubble.appendChild(iphoneWechatBuildPayCard(
          icons, pay, isMine, msg.pay?.status,
          // 转给玩家的钱：点一下即收款，余额入账并落库
          canCollect ? () => receiveTransfer(index) : null,
          isGroup ? iphoneWechatPayeeLabel(pay, msg, msgMeta) : '',
        ));
      } else {
        for (const para of String(msg.content).split(/\n+/)) {
          if (!para.trim()) continue;
          const p = document.createElement('p');
          p.textContent = para;
          bubble.appendChild(p);
        }
      }
      col.appendChild(bubble);
      row.appendChild(col);
      if (isMine) {
        // 我方头像在右侧（微信同款）：默认占位图，编辑资料里可换
        const meAvatar = document.createElement('span');
        meAvatar.className = 'iphone-wx__me-avatar iphone-wx__out-avatar';
        meAvatar.setAttribute('data-me-avatar', '');
        meAvatar.setAttribute('aria-hidden', 'true');
        row.appendChild(meAvatar);
      }
      attachBubbleActions(row, bubble, index);
      stream.appendChild(row);
    });
    iphoneRefreshWechatMeIdentity(stream);
  };
  renderMessages();
  stream.addEventListener('click', () => {
    stream.querySelectorAll('.iphone-wxc__msgmenu').forEach((el) => el.remove());
  });

  const composer = document.createElement('footer');
  composer.className = 'iphone-wxc__composer';
  composer.innerHTML = `
    <div class="iphone-wxc__inputrow">
      <span class="iphone-wxc__tool" aria-hidden="true">${icons.voice}</span>
      <input type="text" class="iphone-wxc__input" aria-label="输入消息"
        maxlength="2000" autocomplete="off" spellcheck="false">
      <button type="button" class="iphone-wxc__send">发送</button>
      <span class="iphone-wxc__tool" aria-hidden="true">${icons.smiley}</span>
      <button type="button" class="iphone-wxc__tool iphone-wxc__plus" aria-label="更多功能">${icons.plusCircle}</button>
    </div>
    <div class="iphone-wxc__pluspanel" hidden>
      <button type="button" class="iphone-wxc__plusitem" data-act="album">${icons.album}<span>相册</span></button>
      <button type="button" class="iphone-wxc__plusitem" data-act="camera">${icons.cameraFill}<span>拍摄</span></button>
      <button type="button" class="iphone-wxc__plusitem" data-act="videocall">${icons.videoCall}<span>视频通话</span></button>
      <button type="button" class="iphone-wxc__plusitem" data-act="location">${icons.locationFill}<span>位置</span></button>
      <button type="button" class="iphone-wxc__plusitem" data-act="redpacket">${icons.redPacket}<span>红包</span></button>
      <button type="button" class="iphone-wxc__plusitem" data-act="gift">${icons.gift}<span>礼物</span></button>
      <button type="button" class="iphone-wxc__plusitem" data-act="transfer">${icons.transfer}<span>转账</span></button>
      <button type="button" class="iphone-wxc__plusitem" data-act="voice">${icons.micFill}<span>语音输入</span></button>
    </div>
  `;
  const input = composer.querySelector('.iphone-wxc__input');
  const sendBtn = composer.querySelector('.iphone-wxc__send');
  const plusBtn = composer.querySelector('.iphone-wxc__plus');
  const plusPanel = composer.querySelector('.iphone-wxc__pluspanel');

  // 微信同款：输入框有字时发送键转绿可点，无字时灰态
  const refreshSendState = () => {
    sendBtn.classList.toggle('is-active', Boolean(input.value.trim()));
  };
  input.addEventListener('input', refreshSendState);
  refreshSendState();

  const persistMessages = () => {
    const data = iphoneGetWechatData();
    const target = findEntity(data);
    if (!target) return;
    target.messages = messages.slice();
    iphoneSetWechatData(wxScreen, data);
  };

  // 收下转给玩家的钱（v0.24.0；v0.24.3 起补记账行；v0.25.0 起只收转给玩家的那笔）：
  // 余额入账 → 该条转账标记完成 → 追加一条 hidden 的 `[已收款]金额` 记账行（只进
  // 记录与酒馆楼层，界面上不上屏，转账气泡自己会翻成已收款）→ 落库并重绘。同一条
  // 只记一次（status 已 done 时直接返回）。群聊里转给别的群友的转账玩家收不了。
  const receiveTransfer = (index) => {
    const msg = messages[index];
    if (!msg || msg.role === 'user') return;
    const pay = iphoneParseWechatPay(msg.content);
    if (!pay || pay.kind !== 'transfer') return;
    if (!iphoneWechatCanCollect(pay, msg, '', msgMeta)) return;
    if (msg.pay?.status === 'done') return;
    const result = iphoneChangeWechatBalance(pay.amount);
    if (!result.ok) {
      iphoneLog('warn', '收款失败：余额数据异常');
      return;
    }
    msg.pay = { status: 'done' };
    messages.push({
      role: 'user',
      content: iphoneWechatReceiptContent(pay.amount),
      ts: Date.now(),
      hidden: true,
    });
    persistMessages();
    renderMessages();
    scrollStreamToBottom();
    void iphoneSyncWechatChatFloor(entity.id);
    iphoneLog('info', `已收款 ¥${iphoneWechatMoney(pay.amount)}，零钱余额 ¥${iphoneWechatMoney(result.balance)}`);
  };

  const clearMessages = () => {
    messages.length = 0;
    const data = iphoneGetWechatData();
    const target = findEntity(data);
    if (target) {
      target.messages = [];
      target.floorSynced = 0;
    }
    iphoneSetWechatData(wxScreen, data);
    renderMessages();
    scrollStreamToBottom();
  };
  const chatApi = { clearMessages };

  let typingRow = null;
  const showTyping = () => {
    typingRow = document.createElement('div');
    typingRow.className = 'iphone-wxc__msg';
    typingRow.appendChild(iphoneWechatBuildEntityAvatar(entity, isGroup ? 'group' : 'friend'));
    const bubble = document.createElement('div');
    bubble.className = 'iphone-wxc__bubble iphone-wxc__bubble--typing';
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
  // 取一次 AI 回复并把解析出的消息追加进会话（普通消息与转账后共用；v0.24.0
  // 起转账也要对方接话，所以抽出来单独一段）。AI 写 `[转账]金额`（群聊可带
  // `@群友名` 指定收款人）生成待收款卡片，写 `[收款]金额` 则由收款人本人确认。
  const requestReply = async () => {
    const requestMessages = await iphoneBuildWechatChatRequestMessages(entity, messages);
    const reply = await iphoneRequestChatCompletion(iphoneGetSettings(), requestMessages);
    if (isGroup) {
      const data = iphoneGetWechatData();
      const memberNames = (Array.isArray(entity.memberIds) ? entity.memberIds : [])
        .map((id) => data.friends.find((f) => f.id === id))
        .filter(Boolean)
        .map((f) => f.name)
        .filter(Boolean);
      messages.push(...iphoneBuildWechatReplyMessages(
        iphoneParseWechatGroupReply(reply, memberNames), messages, msgMeta,
      ));
    } else {
      messages.push(...iphoneBuildWechatReplyMessages(
        iphoneParseWechatChatReply(reply).map((content) => ({ content })),
        messages, msgMeta,
      ));
    }
    persistMessages();
    renderMessages();
    scrollStreamToBottom();
    void iphoneSyncWechatChatFloor(entity.id);
  };

  const sendMessage = async () => {
    if (sending) return;
    const text = input.value.trim();
    if (!text) return;
    input.value = '';
    refreshSendState();
    messages.push({ role: 'user', content: text, ts: Date.now() });
    persistMessages();
    renderMessages();
    scrollStreamToBottom();
    void iphoneSyncWechatChatFloor(entity.id);
    sending = true;
    showTyping();
    try {
      await requestReply();
    } catch (error) {
      renderMessages();
      scrollStreamToBottom();
      const errRow = document.createElement('p');
      errRow.className = 'iphone-wxc__sys iphone-wxc__sys--error';
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

  // ---------- 转账输入页（v0.24.0；v0.25.0 群聊加选择收款方） ----------
  // 按真实微信的「转账给 X」页复刻：顶部对方头像 + 「转账给 昵称 / 微信号」，
  // 白色大卡里是「转账金额」+ ¥ 大字 + 说明输入行，底部自绘数字键盘（1-9/0/./
  // 退格 + 绿色「转账」键）。确认后从我方零钱扣款并发出转账气泡。
  // 群聊里先弹「选择收款方」（不给自己转账），选了谁就转到谁名下。
  const payView = document.createElement('div');
  payView.className = 'iphone-wxc__payform';
  payView.hidden = true;
  // 选择收款方（v0.25.0，群聊转账的第一步）：覆盖在聊天页上的整页列表
  const payeeView = document.createElement('div');
  payeeView.className = 'iphone-wxc__payeeview';
  const payApi = {
    // 金额字符串 → 分（整数），再按钱包规则归一到元；非法 / 0 返回 0
    parseAmount: (raw) => {
      const num = Number(String(raw || '').replace(/,/g, ''));
      if (!Number.isFinite(num) || num <= 0) return 0;
      return iphoneWechatRoundMoney(Math.floor(num * 100) / 100, 0);
    },
  };
  let payAmount = '';
  // 本次转账的收款人：群聊里由「选择收款方」页选中（群成员对象），私聊恒为会话对方
  let payTarget = null;
  // 群成员（不含玩家自己，微信不能给自己转账）——选择收款方页的数据源
  const getPayableMembers = () => {
    if (!isGroup) return [];
    const data = iphoneGetWechatData();
    return (Array.isArray(entity.memberIds) ? entity.memberIds : [])
      .map((id) => data.friends.find((f) => f.id === id))
      .filter(Boolean);
  };
  const buildPayForm = () => {
    const target = payTarget || entity;
    const profileName = String(target.name || '对方');
    const wallet = iphoneGetWechatWallet();
    payView.innerHTML = `
      <header class="iphone-wxc__paynav">
        <button type="button" class="iphone-wxc__payback" aria-label="返回">${icons.back}</button>
        <span class="iphone-wxc__paynavgap" aria-hidden="true"></span>
      </header>
      <div class="iphone-wxc__payhead">
        <span class="iphone-wxc__payhead-main">
          <span class="iphone-wxc__payhead-name"></span>
          <span class="iphone-wxc__payhead-sub"></span>
        </span>
      </div>
      <div class="iphone-wxc__paycard">
        <p class="iphone-wxc__paycard-label">转账金额</p>
        <p class="iphone-wxc__paycard-amount"><span class="iphone-wxc__paycard-yen">¥</span><span class="iphone-wxc__paycard-num"></span></p>
        <input type="text" class="iphone-wxc__paycard-note" placeholder="添加转账说明" maxlength="40">
        <p class="iphone-wxc__paycard-hint"></p>
      </div>
      <div class="iphone-wxc__paykeys"></div>
    `;
    payView.querySelector('.iphone-wxc__payhead-name').textContent = `转账给 ${profileName}`;
    const wxId = String(target.wxId || '').trim();
    payView.querySelector('.iphone-wxc__payhead-sub').textContent = wxId ? `微信号：${wxId}` : '';
    // 头像：群聊里是选中的群成员，私聊里是会话对方（微信显示的都是收款方）
    const headAvatar = iphoneWechatBuildEntityAvatar(target, isGroup ? 'friend' : 'friend');
    headAvatar.classList.add('iphone-wxc__payhead-avatar');
    payView.querySelector('.iphone-wxc__payhead').appendChild(headAvatar);

    const keys = payView.querySelector('.iphone-wxc__paykeys');
    // 键盘按真实微信排布（4 列 4 行）：1-9 三列，⌫ 在右上角，`.` `0` 在末行
    // 左两格，「转账」占最右列靠下两行。逐键给格位，别依赖自动流式（否则 1-9
    // 会按行铺成拨号盘）。
    const layout = [
      ['1', '1 / 1'], ['2', '1 / 2'], ['3', '1 / 3'], ['del', '1 / 4'],
      ['4', '2 / 1'], ['5', '2 / 2'], ['6', '2 / 3'],
      ['7', '3 / 1'], ['8', '3 / 2'], ['9', '3 / 3'],
      ['.', '4 / 1'], ['0', '4 / 2'],
    ];
    for (const [key, area] of layout) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `iphone-wxc__paykey${key === 'del' ? ' iphone-wxc__paykey--del' : ''}`;
      btn.dataset.key = key;
      btn.style.gridArea = area;
      if (key === 'del') btn.innerHTML = icons.backspace;
      else btn.textContent = key;
      keys.appendChild(btn);
    }
    const submit = document.createElement('button');
    submit.type = 'button';
    submit.className = 'iphone-wxc__paysubmit';
    submit.textContent = '转账';
    keys.appendChild(submit);

    const numEl = payView.querySelector('.iphone-wxc__paycard-num');
    const hintEl = payView.querySelector('.iphone-wxc__paycard-hint');
    const refreshPay = () => {
      numEl.textContent = payAmount;
      const amount = payApi.parseAmount(payAmount);
      const over = amount > wallet.balance;
      hintEl.textContent = over
        ? `零钱余额不足（¥${iphoneWechatMoney(wallet.balance)}）`
        : '';
      hintEl.classList.toggle('is-error', over);
      submit.classList.toggle('is-active', amount > 0 && !over);
    };
    refreshPay();
    payView._refreshPay = refreshPay;

    payView.querySelector('.iphone-wxc__payback').addEventListener('click', () => closePayForm());
    keys.addEventListener('click', (event) => {
      const key = event.target.closest('.iphone-wxc__paykey');
      if (key) {
        const value = key.dataset.key;
        if (value === 'del') payAmount = payAmount.slice(0, -1);
        else if (value === '.') {
          if (!payAmount.includes('.')) payAmount = payAmount ? `${payAmount}.` : '0.';
        } else if (!/\.\d{2}$/.test(payAmount)) {
          // 最多两位小数；首位 0 不叠成 00
          payAmount = payAmount === '0' ? value : payAmount + value;
        }
        refreshPay();
        return;
      }
      if (event.target.closest('.iphone-wxc__paysubmit')) void submitTransfer();
    });
  };
  const openPayForm = () => {
    payAmount = '';
    payTarget = null;
    // 群聊：先选收款方（微信同款；只列群成员，不给自己转账），选完再进金额页
    if (isGroup) {
      const members = getPayableMembers();
      if (!members.length) {
        const errRow = document.createElement('p');
        errRow.className = 'iphone-wxc__sys iphone-wxc__sys--error';
        errRow.textContent = '本群还没有其他成员，无法转账。';
        stream.appendChild(errRow);
        scrollStreamToBottom();
        return;
      }
      closePayeePicker();
      payeeView.innerHTML = '';
      payeeView.appendChild(iphoneWechatBuildPayeePicker(
        icons, members,
        (member) => { payTarget = member; closePayeePicker(); openPayAmountForm(); },
        () => closePayeePicker(),
      ));
      payeeView.classList.add('is-open');
      return;
    }
    openPayAmountForm();
  };
  const openPayAmountForm = () => {
    payAmount = '';
    buildPayForm();
    payView.hidden = false;
    payView.querySelector('.iphone-wxc__paycard-num').textContent = '0.00';
  };
  const closePayeePicker = () => payeeView.classList.remove('is-open');
  const closePayForm = () => {
    payView.hidden = true;
    payAmount = '';
    payTarget = null;
    closePayeePicker();
  };

  // 确认转账：扣我方零钱 → 发出转账气泡 → 让对方接话（对方可能回一条 [收款]）
  const submitTransfer = async () => {
    if (sending) return;
    const amount = payApi.parseAmount(payAmount);
    if (!(amount > 0)) return;
    const wallet = iphoneGetWechatWallet();
    if (amount > wallet.balance) return;
    const note = String(payView.querySelector('.iphone-wxc__paycard-note')?.value || '').trim().slice(0, 40);
    const result = iphoneChangeWechatBalance(-amount);
    if (!result.ok) {
      iphoneLog('warn', '转账失败：零钱余额不足或数据异常');
      return;
    }
    const payeeName = isGroup ? String(payTarget?.name || '').trim() : '';
    closePayForm();
    // 群聊把收款人写进标记（`[转账@群友名]金额`——@ 与名字在方括号里），AI 与解析器
    // 都按它认归属；私聊不带 @（收款人就是对话双方）。
    const content = `[转账${payeeName ? `@${payeeName}` : ''}]${iphoneWechatMoney(amount)}${note ? ` ${note}` : ''}`;
    messages.push({ role: 'user', content, ts: Date.now(), pay: { status: 'pending' } });
    persistMessages();
    renderMessages();
    scrollStreamToBottom();
    void iphoneSyncWechatChatFloor(entity.id);
    iphoneLog('info', `已向${payeeName || String(entity.name || '对方')}转账 ¥${iphoneWechatMoney(amount)}，零钱余额 ¥${iphoneWechatMoney(result.balance)}`);
    sending = true;
    showTyping();
    try {
      await requestReply();
    } catch (error) {
      renderMessages();
      scrollStreamToBottom();
      const errRow = document.createElement('p');
      errRow.className = 'iphone-wxc__sys iphone-wxc__sys--error';
      errRow.textContent = `转账已发出，但对方未回复：${String(error?.message || error)}`;
      stream.appendChild(errRow);
    } finally {
      hideTyping();
      sending = false;
      scrollStreamToBottom();
    }
  };

  // 「+」面板：展开 / 收起（微信同款，点面板外任意处收起）
  const closePlusPanel = () => {
    plusPanel.hidden = true;
    plusBtn.classList.remove('is-open');
  };
  plusBtn.addEventListener('click', () => {
    const open = plusPanel.hidden;
    plusPanel.hidden = !open;
    plusBtn.classList.toggle('is-open', open);
    if (open) stream.scrollTop = stream.scrollHeight;
  });
  plusPanel.addEventListener('click', (event) => {
    const item = event.target.closest('.iphone-wxc__plusitem');
    if (!item) return;
    if (item.dataset.act === 'transfer') {
      closePlusPanel();
      openPayForm();
      return;
    }
    // 其余入口（相册 / 红包 / 礼物等）暂为占位，与 QQ 的加号菜单同一策略
    iphoneLog('info', `聊天「+」面板的「${item.textContent.trim()}」暂未实装（占位）`);
  });
  stream.addEventListener('click', closePlusPanel);

  view.appendChild(header);
  view.appendChild(stream);
  view.appendChild(composer);
  view.appendChild(payView);
  view.appendChild(payeeView);
  return view;
}

// ---------- 微信通讯录页 ----------
// 按真实微信通讯录复刻：四个功能行（新的朋友 / 群聊 / 标签 / 公众号）+ 联系人
// 首字母分组列表（A-Z 分组，本例按名字首字拼音近似分组：非中英文的归「#」）。
// 好友行点击直接进会话；群聊行在「群聊」功能行里展开（同真实微信的做法）。
function iphoneWechatBuildContactsPage(icons, onOpenChat, getData) {
  const page = document.createElement('div');
  // 必须保留 iphone-wx__tabpage + 初始 is-hidden：Tab 显隐全靠它
  page.className = 'iphone-wx__tabpage is-hidden';

  // 分组首字母：英文取首字母大写、数字/符号归 #、中文按常用姓氏表近似，其余归 #
  const letterOf = iphoneWechatLetterOf;

  function friendRow(friend) {
    const row = document.createElement('div');
    row.className = 'iphone-wx__ctc-row';
    row.appendChild(iphoneWechatBuildEntityAvatar(friend, 'friend'));
    const name = document.createElement('p');
    name.className = 'iphone-wx__ctc-name';
    name.textContent = friend.name;
    row.appendChild(name);
    row.addEventListener('click', () => onOpenChat({ kind: 'friend', ...friend }));
    return row;
  }

  function groupRow(group) {
    const row = document.createElement('div');
    row.className = 'iphone-wx__ctc-row';
    row.appendChild(iphoneWechatBuildEntityAvatar(group, 'group'));
    const main = document.createElement('div');
    main.className = 'iphone-wx__ctc-main';
    const name = document.createElement('p');
    name.className = 'iphone-wx__ctc-name';
    name.textContent = group.name;
    const sub = document.createElement('p');
    sub.className = 'iphone-wx__ctc-sub';
    sub.textContent = `${group.memberIds.length + 1}人`;
    main.append(name, sub);
    row.appendChild(main);
    row.addEventListener('click', () => onOpenChat({ kind: 'group', ...group }));
    return row;
  }

  // 功能行（四个）：图标 + 名字 + 右侧箭头；「群聊」行点开显示群聊列表
  const funcBlock = document.createElement('div');
  funcBlock.className = 'iphone-wx__ctc-block';
  const groupsPanel = document.createElement('div');
  groupsPanel.className = 'iphone-wx__ctc-groups';
  groupsPanel.hidden = true;
  const funcRows = [
    { icon: 'friendNew', label: '新的朋友', color: '#fa9d3b' },
    { icon: 'groupChat', label: '群聊', color: '#07c160' },
    { icon: 'tag', label: '标签', color: '#3a7afe' },
    { icon: 'official', label: '公众号', color: '#3a7afe' },
  ];
  for (const entry of funcRows) {
    const row = document.createElement('button');
    row.type = 'button';
    row.className = 'iphone-wx__ctc-func';
    row.innerHTML = `
      <span class="iphone-wx__ctc-funcico" style="color:${entry.color}" aria-hidden="true">${icons[entry.icon]}</span>
      <span class="iphone-wx__ctc-funname">${entry.label}</span>
      <span class="iphone-wx__ctc-chev" aria-hidden="true">${icons.chevronRight}</span>
    `;
    // 只有「群聊」是真入口：点开/收起群聊列表；其余三项是展示行
    if (entry.label === '群聊') {
      row.addEventListener('click', () => {
        const open = groupsPanel.hidden;
        groupsPanel.hidden = !open;
        row.classList.toggle('is-open', open);
      });
    }
    funcBlock.appendChild(row);
  }
  funcBlock.appendChild(groupsPanel);

  // 联系人索引列表（按首字母分组）
  const listBlock = document.createElement('div');
  listBlock.className = 'iphone-wx__ctc-block iphone-wx__ctc-list';

  function render() {
    const { friends, groups } = getData();
    groupsPanel.innerHTML = '';
    for (const group of groups) groupsPanel.appendChild(groupRow(group));
    if (!groups.length) {
      const empty = document.createElement('p');
      empty.className = 'iphone-wx__ctc-empty';
      empty.textContent = '暂无群聊，去消息页右上角「+」发起群聊';
      groupsPanel.appendChild(empty);
    }

    listBlock.querySelectorAll('.iphone-wx__ctc-sec').forEach((el) => el.remove());
    if (!friends.length) {
      const empty = document.createElement('p');
      empty.className = 'iphone-wx__ctc-empty';
      empty.textContent = '暂无联系人，去消息页右上角「+」添加朋友';
      empty.classList.add('iphone-wx__ctc-sec');
      listBlock.appendChild(empty);
      return;
    }
    const buckets = new Map();
    for (const friend of friends) {
      const letter = letterOf(friend.name);
      if (!buckets.has(letter)) buckets.set(letter, []);
      buckets.get(letter).push(friend);
    }
    const letters = [...buckets.keys()].sort((a, b) => {
      if (a === '#') return 1;
      if (b === '#') return -1;
      return a.localeCompare(b);
    });
    for (const letter of letters) {
      const sec = document.createElement('section');
      sec.className = 'iphone-wx__ctc-sec';
      const head = document.createElement('p');
      head.className = 'iphone-wx__ctc-sechead';
      head.textContent = letter;
      sec.appendChild(head);
      for (const friend of buckets.get(letter)) sec.appendChild(friendRow(friend));
      listBlock.appendChild(sec);
    }
  }
  page._render = render;
  render();

  // 页面本身不滚动：功能块 + 索引列表装进内层滚动区。
  const scroller = document.createElement('div');
  scroller.className = 'iphone-wx__ctc-scroll';
  scroller.appendChild(funcBlock);
  scroller.appendChild(listBlock);
  page.appendChild(scroller);
  return page;
}

// 中文姓氏 → 拼音首字母的近似映射（通讯录 / 收款方列表的分组用；未收录的字归入 #）。
// 这不是完整拼音表（那要带一份拼音字典），只覆盖常见姓氏与名字、昵称里的常用字——
// 群成员多半用昵称（「悠々之翼」「雾蒙天际晓」），所以除了姓氏也收了一批常用字。
const IPHONE_WECHAT_PINYIN_HINTS = Object.freeze({
  阿: 'A', 安: 'A', 岸: 'A', 白: 'B', 百: 'B', 柏: 'B', 包: 'B', 宝: 'B', 保: 'B', 鲍: 'B',
  北: 'B', 贝: 'B', 冰: 'B', 毕: 'B', 卞: 'B', 卜: 'B', 步: 'B', 蔡: 'C', 曹: 'C', 岑: 'C',
  常: 'C', 长: 'C', 陈: 'C', 成: 'C', 城: 'C', 程: 'C', 池: 'C', 楚: 'C', 川: 'C', 春: 'C',
  崔: 'C', 翠: 'C', 村: 'C', 戴: 'D', 党: 'D', 邓: 'D', 狄: 'D', 丁: 'D', 东: 'D', 董: 'D',
  窦: 'D', 杜: 'D', 段: 'D', 多: 'D', 樊: 'F', 范: 'F', 方: 'F', 房: 'F', 飞: 'F', 费: 'F',
  风: 'F', 丰: 'F', 封: 'F', 冯: 'F', 凤: 'F', 伏: 'F', 傅: 'F', 付: 'F', 甘: 'G', 高: 'G',
  葛: 'G', 耿: 'G', 龚: 'G', 勾: 'G', 古: 'G', 顾: 'G', 关: 'G', 光: 'G', 管: 'G', 郭: 'G',
  国: 'G', 海: 'H', 韩: 'H', 寒: 'H', 郝: 'H', 何: 'H', 和: 'H', 贺: 'H', 黑: 'H', 洪: 'H',
  侯: 'H', 胡: 'H', 花: 'H', 华: 'H', 黄: 'H', 霍: 'H', 火: 'H', 姬: 'J', 纪: 'J', 季: 'J',
  贾: 'J', 简: 'J', 江: 'J', 姜: 'J', 蒋: 'J', 金: 'J', 靳: 'J', 经: 'J', 井: 'J', 久: 'J',
  九: 'J', 骏: 'J', 康: 'K', 柯: 'K', 孔: 'K', 寇: 'K', 匡: 'K', 邝: 'K', 蓝: 'L', 兰: 'L',
  郎: 'L', 劳: 'L', 老: 'L', 雷: 'L', 冷: 'L', 黎: 'L', 李: 'L', 厉: 'L', 连: 'L', 梁: 'L',
  廖: 'L', 林: 'L', 凌: 'L', 刘: 'L', 柳: 'L', 龙: 'L', 娄: 'L', 楼: 'L', 卢: 'L', 陆: 'L',
  路: 'L', 罗: 'L', 骆: 'L', 吕: 'L', 马: 'M', 麦: 'M', 满: 'M', 毛: 'M', 茅: 'M', 梅: 'M',
  蒙: 'M', 孟: 'M', 梦: 'M', 苗: 'M', 妙: 'M', 明: 'M', 缪: 'M', 莫: 'M', 牟: 'M', 木: 'M',
  沐: 'M', 倪: 'N', 聂: 'N', 宁: 'N', 牛: 'N', 潘: 'P', 庞: 'P', 裴: 'P', 彭: 'P', 蒲: 'P',
  齐: 'Q', 祁: 'Q', 千: 'Q', 钱: 'Q', 乔: 'Q', 秦: 'Q', 青: 'Q', 清: 'Q', 邱: 'Q', 秋: 'Q',
  裘: 'Q', 屈: 'Q', 瞿: 'Q', 权: 'Q', 任: 'R', 荣: 'R', 阮: 'R', 芮: 'R', 若: 'R', 萨: 'S',
  沙: 'S', 山: 'S', 商: 'S', 邵: 'S', 佘: 'S', 申: 'S', 沈: 'S', 盛: 'S', 施: 'S', 石: 'S',
  时: 'S', 史: 'S', 舒: 'S', 双: 'S', 水: 'S', 司: 'S', 宋: 'S', 苏: 'S', 宿: 'S', 孙: 'S',
  索: 'S', 谭: 'T', 汤: 'T', 唐: 'T', 陶: 'T', 滕: 'T', 天: 'T', 田: 'T', 佟: 'T', 童: 'T',
  涂: 'T', 万: 'W', 汪: 'W', 王: 'W', 危: 'W', 韦: 'W', 卫: 'W', 魏: 'W', 温: 'W', 文: 'W',
  闻: 'W', 翁: 'W', 邬: 'W', 巫: 'W', 吴: 'W', 伍: 'W', 武: 'W', 雾: 'W', 西: 'X', 奚: 'X',
  夏: 'X', 项: 'X', 萧: 'X', 小: 'X', 晓: 'X', 谢: 'X', 心: 'X', 星: 'X', 邢: 'X', 熊: 'X',
  徐: 'X', 许: 'X', 宣: 'X', 薛: 'X', 雪: 'X', 荀: 'X', 严: 'Y', 言: 'Y', 阎: 'Y', 颜: 'Y',
  晏: 'Y', 燕: 'Y', 杨: 'Y', 姚: 'Y', 叶: 'Y', 一: 'Y', 易: 'Y', 殷: 'Y', 尹: 'Y', 应: 'Y',
  悠: 'Y', 尤: 'Y', 游: 'Y', 于: 'Y', 余: 'Y', 俞: 'Y', 虞: 'Y', 禹: 'Y', 郁: 'Y', 喻: 'Y',
  元: 'Y', 袁: 'Y', 月: 'Y', 岳: 'Y', 云: 'Y', 芸: 'Y', 恽: 'Y', 臧: 'Z', 曾: 'Z', 詹: 'Z',
  张: 'Z', 章: 'Z', 赵: 'Z', 甄: 'Z', 郑: 'Z', 之: 'Z', 知: 'Z', 钟: 'Z', 周: 'Z', 朱: 'Z',
  诸: 'Z', 祝: 'Z', 庄: 'Z', 卓: 'Z', 子: 'Z', 紫: 'Z', 宗: 'Z', 邹: 'Z', 左: 'Z',
});

// ---------- 微信发现页（入口列表：朋友圈可点，其余纯展示） ----------
function iphoneWechatBuildDiscoverPage(icons, onOpenMoments) {
  const page = document.createElement('div');
  page.className = 'iphone-wx__tabpage is-hidden';

  const entries = [
    { label: '朋友圈', icon: 'moments', color: '#3a7afe', action: onOpenMoments, thumb: 'p1' },
    { label: '视频号', icon: 'channels', color: '#fa5151' },
    { label: '扫一扫', icon: 'scan', color: '#3a7afe' },
    { label: '看一看', icon: 'look', color: '#fa9d3b' },
    { label: '搜一搜', icon: 'search', color: '#3a7afe' },
    { label: '直播', icon: 'live', color: '#fa5151' },
    { label: '购物', icon: 'shopping', color: '#fa5151' },
    { label: '游戏', icon: 'games', color: '#3a7afe' },
  ];

  entries.forEach((entry, index) => {
    const block = document.createElement('div');
    block.className = 'iphone-wx__dsc-block';
    const row = document.createElement('button');
    row.type = 'button';
    row.className = `iphone-wx__dsc-row${entry.action ? ' is-click' : ''}`;
    const thumbCls = entry.thumb ? ` iphone-wx__dsc-thumb--${entry.thumb}` : '';
    row.innerHTML = `
      <span class="iphone-wx__dsc-ico" style="color:${entry.color}" aria-hidden="true">${icons[entry.icon]}</span>
      <span class="iphone-wx__dsc-label">${entry.label}</span>
      ${entry.thumb ? `<span class="iphone-wx__dsc-thumb${thumbCls}" aria-hidden="true"><i class="iphone-wx__dsc-dot"></i></span>` : ''}
      <span class="iphone-wx__dsc-chev" aria-hidden="true">${icons.chevronRight}</span>
    `;
    if (entry.action) row.addEventListener('click', entry.action);
    block.appendChild(row);
    page.appendChild(block);
    if (index < entries.length - 1) {
      const gap = document.createElement('div');
      gap.className = 'iphone-wx__dsc-gap';
      page.appendChild(gap);
    }
  });
  return page;
}

// ---------- 微信「我」页（资料卡 + 功能行） ----------
// 资料卡：大头像 + 昵称 + 微信号 + 二维码角标 + 右箭头，点按进编辑资料；
// 下面服务 / 收藏 / 朋友圈 / 卡包 / 表情 / 设置 各行（「服务」可点进服务页，
// 微信 v0.22.0 起；设置末行带红点，仅展示）。
function iphoneWechatBuildMePage(icons, onOpenProfile, onOpenService) {
  const page = document.createElement('div');
  page.className = 'iphone-wx__tabpage is-hidden iphone-wx__me-page';

  const card = document.createElement('button');
  card.type = 'button';
  card.className = 'iphone-wx__me-card';
  card.innerHTML = `
    <span class="iphone-wx__me-avatar iphone-wx__me-avatar--me" data-me-avatar aria-hidden="true"></span>
    <span class="iphone-wx__me-main">
      <span class="iphone-wx__me-name" data-me-name></span>
      <span class="iphone-wx__me-wxid">微信号：<b data-me-wxid></b></span>
    </span>
    <span class="iphone-wx__me-qr" aria-hidden="true">${icons.qr}</span>
    <span class="iphone-wx__dsc-chev" aria-hidden="true">${icons.chevronRight}</span>
  `;
  card.addEventListener('click', onOpenProfile);
  page.appendChild(card);

  const rows = [
    { icon: 'service', label: '服务', color: '#3a7afe', act: 'service', action: onOpenService },
    { icon: 'fav', label: '收藏', color: '#fa9d3b' },
    { icon: 'moments', label: '朋友圈', color: '#07c160' },
    { icon: 'card', label: '卡包', color: '#3a7afe' },
    { icon: 'emoji', label: '表情', color: '#fa9d3b' },
    { icon: 'settings', label: '设置', color: '#3a7afe', dot: true },
  ];
  const block = document.createElement('div');
  block.className = 'iphone-wx__me-block';
  for (const entry of rows) {
    const row = document.createElement('button');
    row.type = 'button';
    row.className = `iphone-wx__me-row${entry.action ? ' is-click' : ''}`;
    if (entry.act) row.dataset.act = entry.act;
    row.innerHTML = `
      <span class="iphone-wx__dsc-ico" style="color:${entry.color}" aria-hidden="true">${icons[entry.icon]}</span>
      <span class="iphone-wx__dsc-label">${entry.label}</span>
      ${entry.dot ? '<i class="iphone-wx__me-dot" aria-hidden="true"></i>' : ''}
      <span class="iphone-wx__dsc-chev" aria-hidden="true">${icons.chevronRight}</span>
    `;
    if (entry.action) row.addEventListener('click', entry.action);
    block.appendChild(row);
  }
  page.appendChild(block);
  return page;
}

// ---------- 微信「服务」页（v0.22.1，前端占位） ----------
// 按微信 8.x 服务页复刻：顶部整块绿色大卡（左「收付款」、右「钱包」+ 余额小字），
// 下面 金融理财 / 生活服务 / 交通出行 三张圆角白卡，卡内四列彩色线稿图标入口；
// 导航栏右侧有「···」。除钱包外均为纯展示占位，未接真实业务。
function iphoneWechatBuildServicePage(icons, svcIcons, onBack, onOpenWallet) {
  const view = document.createElement('div');
  view.className = 'iphone-wx__svc';

  const nav = document.createElement('header');
  nav.className = 'iphone-wx__svc-nav';
  nav.innerHTML = `
    <button type="button" class="iphone-wx__svc-back" aria-label="返回">${icons.back}</button>
    <p class="iphone-wx__svc-navtitle">服务</p>
    <button type="button" class="iphone-wx__svc-more" aria-label="更多">${icons.more}</button>
  `;
  nav.querySelector('.iphone-wx__svc-back').addEventListener('click', onBack);

  const body = document.createElement('div');
  body.className = 'iphone-wx__svc-body';

  // 顶部绿卡：左右两个大入口，钱包格下方带余额
  const wallet = iphoneGetWechatWallet();
  const hero = document.createElement('div');
  hero.className = 'iphone-wx__svc-hero';
  hero.innerHTML = `
    <button type="button" class="iphone-wx__svc-herocell" data-act="scanpay">
      <span class="iphone-wx__svc-heroico" aria-hidden="true">${svcIcons.scanPay}</span>
      <span class="iphone-wx__svc-herolabel">收付款</span>
    </button>
    <button type="button" class="iphone-wx__svc-herocell" data-act="wallet">
      <span class="iphone-wx__svc-heroico" aria-hidden="true">${svcIcons.wallet}</span>
      <span class="iphone-wx__svc-herolabel">钱包</span>
      <span class="iphone-wx__svc-herobalance" data-wallet-balance>¥${iphoneWechatMoney(wallet.balance)}</span>
    </button>
  `;
  hero.querySelector('[data-act="wallet"]').addEventListener('click', onOpenWallet);
  body.appendChild(hero);

  const sections = [
    {
      title: '金融理财',
      entries: [
        { label: '信用卡还款', icon: 'creditCard', color: '#07c160' },
        { label: '理财通', icon: 'wealth', color: '#2f7dfa' },
        { label: '保险服务', icon: 'insurance', color: '#fa9d3b' },
      ],
    },
    {
      title: '生活服务',
      entries: [
        { label: '手机充值', icon: 'mobileTop', color: '#2f7dfa' },
        { label: '生活缴费', icon: 'utilities', color: '#07c160' },
        { label: 'Q币充值', icon: 'qcoin', color: '#2f7dfa' },
        { label: '城市服务', icon: 'city', color: '#07c160' },
        { label: '腾讯公益', icon: 'charity', color: '#fa5151' },
        { label: '医疗健康', icon: 'medical', color: '#fa9d3b' },
      ],
    },
    {
      title: '交通出行',
      entries: [
        { label: '出行服务', icon: 'travel', color: '#2f7dfa' },
        { label: '火车票机票', icon: 'train', color: '#07c160' },
        { label: '滴滴出行', icon: 'didi', color: '#fa9d3b' },
        { label: '酒店民宿', icon: 'hotel', color: '#07c160' },
      ],
    },
  ];
  for (const section of sections) {
    const block = document.createElement('section');
    block.className = 'iphone-wx__svc-sec';
    const title = document.createElement('p');
    title.className = 'iphone-wx__svc-title';
    title.textContent = section.title;
    block.appendChild(title);
    const grid = document.createElement('div');
    grid.className = 'iphone-wx__svc-grid';
    for (const entry of section.entries) {
      const cell = document.createElement('button');
      cell.type = 'button';
      cell.className = 'iphone-wx__svc-cell';
      cell.innerHTML = `
        <span class="iphone-wx__svc-ico" style="color:${entry.color}" aria-hidden="true">${svcIcons[entry.icon]}</span>
        <span class="iphone-wx__svc-clabel">${entry.label}</span>
      `;
      grid.appendChild(cell);
    }
    block.appendChild(grid);
    body.appendChild(block);
  }

  view.appendChild(nav);
  view.appendChild(body);
  return view;
}

// ---------- 微信「钱包」页（v0.22.1，前端占位；v0.27.0 零钱行可点） ----------
// 按微信 8.x 钱包页复刻：无顶部卡片，直接是分行白底列表（每行左侧彩色线稿
// 图标 + 名称 + 右侧说明），行间 0.5px 细线；导航右侧「账单」。分组灰缝把
// 零钱类 / 分付 / 支付分类隔开，底部居中「身份信息 | 支付设置」小字。
// onOpenChange（v0.27.0）：点「零钱」行进零钱明细页（评估入口在那里）。
function iphoneWechatBuildWalletView(icons, svcIcons, onBack, onOpenChange) {
  const view = document.createElement('div');
  view.className = 'iphone-wx__svc';

  const nav = document.createElement('header');
  nav.className = 'iphone-wx__svc-nav';
  nav.innerHTML = `
    <button type="button" class="iphone-wx__svc-back" aria-label="返回">${icons.back}</button>
    <p class="iphone-wx__svc-navtitle">钱包</p>
    <button type="button" class="iphone-wx__svc-navaction">账单</button>
  `;
  nav.querySelector('.iphone-wx__svc-back').addEventListener('click', onBack);

  const body = document.createElement('div');
  body.className = 'iphone-wx__svc-body iphone-wx__svc-body--wallet';

  const wallet = iphoneGetWechatWallet();
  // 分组：[{ rows }]，组间 8px 灰缝；每行 { icon, color, label, note, value, action, balance }
  // （balance: true 的行的金额挂 data-wallet-balance，评估后外层就地刷新用）
  const groups = [
    {
      rows: [
        {
          icon: 'coinYen',
          color: '#fa9d3b',
          label: '零钱',
          value: `¥${iphoneWechatMoney(wallet.balance)}`,
          action: onOpenChange,
          balance: true,
        },
        // 收益率与真实微信一致固定两位小数（1.1 → 1.10%）
        { icon: 'diamond', color: '#fa9d3b', label: '零钱通', note: `收益率${Number(wallet.lctRate).toFixed(2)}%` },
        { icon: 'bankCard', color: '#2f7dfa', label: '银行卡' },
        { icon: 'family', color: '#fa9d3b', label: '亲属卡' },
      ],
    },
    {
      rows: [
        { icon: 'fenfu', color: '#07c160', label: '分付', note: '消费转账可用，首笔免息45天' },
      ],
    },
    {
      rows: [
        { icon: 'payScore', color: '#07c160', label: '支付分' },
        { icon: 'service', color: '#07c160', label: '客服中心' },
      ],
    },
  ];

  const list = document.createElement('div');
  list.className = 'iphone-wx__wal-list';
  groups.forEach((group, groupIndex) => {
    if (groupIndex > 0) {
      const gap = document.createElement('div');
      gap.className = 'iphone-wx__wal-gap';
      list.appendChild(gap);
    }
    const block = document.createElement('div');
    block.className = 'iphone-wx__wal-block';
    for (const row of group.rows) {
      const el = document.createElement('button');
      el.type = 'button';
      el.className = 'iphone-wx__wal-row';
      el.innerHTML = `
        <span class="iphone-wx__wal-ico" style="color:${row.color}" aria-hidden="true">${svcIcons[row.icon]}</span>
        <span class="iphone-wx__wal-label">${row.label}</span>
        ${row.note ? `<span class="iphone-wx__wal-note">${row.note}</span>` : ''}
        ${row.value ? `<span class="iphone-wx__wal-value"${row.balance ? ' data-wallet-balance' : ''}>${row.value}</span>` : ''}
        <span class="iphone-wx__dsc-chev" aria-hidden="true">${icons.chevronRight}</span>
      `;
      if (typeof row.action === 'function') el.addEventListener('click', row.action);
      block.appendChild(el);
    }
    list.appendChild(block);
  });
  body.appendChild(list);

  const foot = document.createElement('p');
  foot.className = 'iphone-wx__wal-foot';
  foot.innerHTML = '<span>身份信息</span><i aria-hidden="true"></i><span>支付设置</span>';
  body.appendChild(foot);

  view.appendChild(nav);
  view.appendChild(body);
  return view;
}

// ---------- 微信「零钱」页（v0.27.0） ----------
// 按真实微信「我 → 服务 → 钱包 → 零钱」复刻：导航栏右侧「零钱明细」、居中黄色
// 圆形「¥」图标、灰色小字「我的零钱」与大号金额，下接一块圆角白卡的零钱通入口
//（钻石图标 + 「转入零钱通，能赚又能花」+ 收益率小字），页面下方两枚大按钮。
// 与真实微信的唯一差别（插件设定）：按钮不是「充值 / 提现」，而是**「评估」**——
// 点它调一次对话 API，按玩家在剧情里的资产状况评估出一个合适的零钱余额（见
// iphoneAssessWechatWallet）。评估中按钮转「评估中…」并禁用；失败在金额下方
// 红字提示；成功后金额就地翻新并显示评估理由与时间。
function iphoneWechatBuildChangeView(icons, svcIcons, onBack, onChanged) {
  const view = document.createElement('div');
  view.className = 'iphone-wx__svc';

  const nav = document.createElement('header');
  nav.className = 'iphone-wx__svc-nav';
  nav.innerHTML = `
    <button type="button" class="iphone-wx__svc-back" aria-label="返回">${icons.back}</button>
    <p class="iphone-wx__svc-navtitle">零钱</p>
    <button type="button" class="iphone-wx__svc-navaction">零钱明细</button>
  `;
  nav.querySelector('.iphone-wx__svc-back').addEventListener('click', onBack);

  const body = document.createElement('div');
  body.className = 'iphone-wx__svc-body iphone-wx__chg';

  // 金额区（黄圆 + 「我的零钱」+ 大号金额 + 评估理由/错误行）。黄圆里是白色「¥」
  // 字形——真实零钱页就是这么一枚符号，不用图标集里的硬币线稿（那是钱包列表的）。
  const head = document.createElement('div');
  head.className = 'iphone-wx__chg-head';
  head.innerHTML = `
    <span class="iphone-wx__chg-ico" aria-hidden="true">¥</span>
    <p class="iphone-wx__chg-label">我的零钱</p>
    <p class="iphone-wx__chg-amount" data-chg-amount></p>
    <p class="iphone-wx__chg-note" data-chg-note hidden></p>
  `;
  const amountEl = head.querySelector('[data-chg-amount]');
  const noteEl = head.querySelector('[data-chg-note]');
  body.appendChild(head);

  // 零钱通入口（纯展示，与钱包页同一条数据）
  const wallet = iphoneGetWechatWallet();
  const lct = document.createElement('button');
  lct.type = 'button';
  lct.className = 'iphone-wx__chg-lct';
  lct.innerHTML = `
    <span class="iphone-wx__chg-lctico" aria-hidden="true">${svcIcons.diamond}</span>
    <span class="iphone-wx__chg-lctmain">
      <span class="iphone-wx__chg-lcttitle">转入零钱通，能赚又能花</span>
      <span class="iphone-wx__chg-lctsub">零钱通 七日年化${Number(wallet.lctRate).toFixed(2)}%</span>
    </span>
    <span class="iphone-wx__dsc-chev" aria-hidden="true">${icons.chevronRight}</span>
  `;
  body.appendChild(lct);

  // 按钮区：评估（绿，主操作）。真实微信这里是「充值 / 提现」，本插件只保留
  // 「评估」这一个入口——余额是评估出来的，没有充值 / 提现这回事。
  const actions = document.createElement('div');
  actions.className = 'iphone-wx__chg-actions';
  const assessBtn = document.createElement('button');
  assessBtn.type = 'button';
  assessBtn.className = 'iphone-wx__chg-btn iphone-wx__chg-btn--primary';
  assessBtn.textContent = '评估';
  actions.appendChild(assessBtn);
  body.appendChild(actions);

  const foot = document.createElement('p');
  foot.className = 'iphone-wx__chg-foot';
  foot.textContent = '本服务由财付通提供';
  body.appendChild(foot);

  // 金额与理由的就地刷新（评估成功后调用；返回按钮等外部触发也走它）
  const renderWallet = () => {
    const current = iphoneGetWechatWallet();
    amountEl.textContent = `¥ ${iphoneWechatMoney(current.balance)}`;
    if (current.assessedAt && current.assessNote) {
      noteEl.hidden = false;
      noteEl.dataset.state = 'note';
      noteEl.textContent = `${new Date(current.assessedAt).toLocaleString('zh-CN', { hour12: false })} 评估：${current.assessNote}`;
    } else if (current.assessedAt) {
      noteEl.hidden = false;
      noteEl.dataset.state = 'note';
      noteEl.textContent = `已于 ${new Date(current.assessedAt).toLocaleString('zh-CN', { hour12: false })} 评估`;
    } else {
      noteEl.hidden = false;
      noteEl.dataset.state = 'note';
      noteEl.textContent = '还没有评估过，点下面的「评估」按剧情给你的零钱定个数额。';
    }
  };
  renderWallet();

  let assessing = false;
  const runAssess = async () => {
    if (assessing) return;
    assessing = true;
    assessBtn.disabled = true;
    assessBtn.textContent = '评估中…';
    noteEl.hidden = false;
    noteEl.dataset.state = 'busy';
    noteEl.textContent = '正在结合剧情与人物设定评估你的资产状况…';
    try {
      const result = await iphoneAssessWechatWallet();
      renderWallet();
      iphoneLog('info', `零钱评估：¥${iphoneWechatMoney(result.previous)} → ¥${iphoneWechatMoney(result.balance)}`);
      onChanged?.(result);
    } catch (error) {
      iphoneLog('warn', '零钱评估失败', error);
      noteEl.hidden = false;
      noteEl.dataset.state = 'error';
      noteEl.textContent = String(error?.message || error) || '评估失败，请重试。';
    } finally {
      assessing = false;
      assessBtn.disabled = false;
      assessBtn.textContent = '评估';
    }
  };
  assessBtn.addEventListener('click', () => { void runAssess(); });

  view.appendChild(nav);
  view.appendChild(body);
  // 评估后金额变了：让外层（服务页绿卡 / 钱包页零钱行）也跟着刷新
  view._refreshChangeView = renderWallet;
  return view;
}

// ---------- 微信朋友圈（动态流 + 下拉刷新 + 点赞评论 + 玩家留言） ----------
// 与 QQ空间同范式：顶部封面（含我的昵称与头像）+ 动态卡片（发布者头像/名字、
// 正文、时间、点赞名单、评论区、每卡的「说点什么吧…」回复条）＋下拉刷新（AI 生成
// 动态）。点击评论图标或回复条都能留言；玩家留言后调一次 API 由 AI 生成回应。
// visitor：从联系人资料页的「TA的朋友圈」进来时传 { id, name, avatar }，封面换成
// TA 的昵称与头像，动态流只渲染 TA 发的动态，下拉刷新也只让 TA 发新动态；
// 不传即全局朋友圈（所有人的动态）。
function iphoneWechatBuildMomentsView(icons, onBack, onOpenProfile, wxScreen, visitor) {
  const view = document.createElement('div');
  view.className = 'iphone-wxm';
  const visitorId = visitor ? String(visitor.id || '') : '';

  // 悬浮导航：未滚动时是封面上的透明返回钮 + 相机钮；滚过封面后切白底标题栏
  const nav = document.createElement('header');
  nav.className = 'iphone-wxm__nav';
  nav.innerHTML = `
    <div class="iphone-wxm__nav-cover">
      <button type="button" class="iphone-wxm__cover-back" aria-label="返回">${icons.back}</button>
      <button type="button" class="iphone-wxm__cover-cam" aria-label="发表动态">${icons.camera}</button>
    </div>
    <div class="iphone-wxm__nav-solid">
      <button type="button" class="iphone-wxm__back" aria-label="返回">${icons.back}</button>
      <p class="iphone-wxm__title">朋友圈</p>
      <button type="button" class="iphone-wxm__cam" aria-label="发表动态">${icons.camera}</button>
    </div>
  `;
  nav.querySelectorAll('.iphone-wxm__cover-back, .iphone-wxm__back').forEach((btn) => {
    btn.addEventListener('click', onBack);
  });

  const scroll = document.createElement('div');
  scroll.className = 'iphone-wxm__scroll';

  // 下拉刷新指示器（与 QQ空间同款手势逻辑）
  const indicator = document.createElement('div');
  indicator.className = 'iphone-wxm__refresh';
  indicator.innerHTML = '<span class="iphone-wxm__refresh-spin" aria-hidden="true"></span><span class="iphone-wxm__refresh-text">下拉刷新</span>';
  const refreshText = indicator.querySelector('.iphone-wxm__refresh-text');
  scroll.appendChild(indicator);

  // 顶部封面：背景图（assets/wechat-moment-cover.jpg）+ 右下「我」的昵称与头像；
  // 访客模式右下换成 TA 的昵称与头像（点它不进「我的资料」，避免误导）
  const cover = document.createElement('div');
  cover.className = 'iphone-wxm__cover';
  cover.innerHTML = `
    <div class="iphone-wxm__cover-id">
      <p class="iphone-wxm__cover-name"${visitor ? '' : ' data-me-name'}></p>
      ${visitor
        ? '<span class="iphone-wx__avatar iphone-wx__avatar--cover" data-wx-guest-avatar aria-hidden="true"></span>'
        : '<span class="iphone-wx__me-avatar iphone-wx__me-avatar--cover" data-me-avatar data-wx-open-profile role="button" aria-label="编辑我的资料" tabindex="0"></span>'}
    </div>
  `;
  if (visitor) {
    const guestName = cover.querySelector('.iphone-wxm__cover-name');
    if (guestName) guestName.textContent = visitor.name || '';
    // 实体头像组件自己带 iphone-wx__avatar，尺寸类（--cover）要单独补上，
    // 否则退回默认 50px 小头像
    const guestAvatar = iphoneWechatBuildEntityAvatar({ name: visitor.name, avatar: visitor.avatar }, 'friend');
    guestAvatar.classList.add('iphone-wx__avatar--cover');
    cover.querySelector('[data-wx-guest-avatar]')?.replaceWith(guestAvatar);
  } else {
    cover.querySelector('[data-wx-open-profile]')?.addEventListener('click', () => onOpenProfile?.());
  }
  scroll.appendChild(cover);

  const feed = document.createElement('div');
  feed.className = 'iphone-wxm__feed';
  scroll.appendChild(feed);

  // 单条动态卡片
  function buildMomentCard(moment, publisher) {
    const card = document.createElement('article');
    card.className = 'iphone-wxm__post';
    card.dataset.momentId = moment.id;

    const head = document.createElement('header');
    head.className = 'iphone-wxm__head';
    const avatar = iphoneWechatBuildEntityAvatar(publisher || { name: '微信用户', avatar: null }, 'friend');
    avatar.classList.add('iphone-wx__avatar--xs');
    head.appendChild(avatar);
    const nameEl = document.createElement('p');
    nameEl.className = 'iphone-wxm__name';
    nameEl.textContent = publisher ? publisher.name : '微信用户';
    head.appendChild(nameEl);
    card.appendChild(head);

    if (moment.text) {
      const para = document.createElement('p');
      para.className = 'iphone-wxm__text';
      para.textContent = moment.text;
      card.appendChild(para);
    }

    // 红心只表示「我点过赞」（微信同款：别人点赞由下方名单体现，不染红心）；
    // 判定复用评论区那套玩家署名识别（自定义昵称 / {{user}} 宏 / 人设名都算我）
    const likedByMe = moment.likes.some((n) => iphoneIsWechatPlayerAuthor(n));
    const meta = document.createElement('div');
    meta.className = 'iphone-wxm__meta';
    meta.innerHTML = `
      <span class="iphone-wxm__time">${iphoneWechatMomentsTimeLabel(moment)}</span>
      <button type="button" class="iphone-wxm__likebtn${likedByMe ? ' is-liked' : ''}" aria-label="点赞">${likedByMe ? icons.heartFill : icons.heart}</button>
    `;
    const likeBtn = meta.querySelector('.iphone-wxm__likebtn');
    likeBtn.addEventListener('click', () => toggleLike(moment));
    card.appendChild(meta);

    // 点赞 + 评论合一的浅灰互动区（微信：❤ 名单 + 分隔线 + 评论区）
    const hasLikes = moment.likes.length > 0;
    const hasComments = moment.comments.length > 0;
    if (hasLikes || hasComments) {
      const interact = document.createElement('div');
      interact.className = 'iphone-wxm__interact';
      if (hasLikes) {
        const likes = document.createElement('p');
        likes.className = 'iphone-wxm__likes';
        likes.innerHTML = `<span class="iphone-wxm__likes-ico" aria-hidden="true">${icons.heartFill}</span>`;
        // 署名与评论区同一套解析：我的点赞在数据里是 {{user}} 宏 / 自定义昵称，
        // 显示时换成当前人设名
        likes.appendChild(document.createTextNode(
          moment.likes.map((n) => iphoneResolveWechatPlayerAuthor(n)).join('，'),
        ));
        interact.appendChild(likes);
      }
      if (hasLikes && hasComments) {
        const sep = document.createElement('div');
        sep.className = 'iphone-wxm__sep';
        interact.appendChild(sep);
      }
      if (hasComments) {
        const comments = document.createElement('div');
        comments.className = 'iphone-wxm__comments';
        for (const c of moment.comments) {
          const row = document.createElement('p');
          row.className = 'iphone-wxm__c-row';
          if (iphoneIsWechatPlayerAuthor(c.name)) row.classList.add('is-me');
          const who = document.createElement('span');
          who.className = 'iphone-wxm__c-name';
          const author = iphoneResolveWechatPlayerAuthor(c.name);
          who.textContent = c.replyName
            ? `${author} 回复 ${iphoneResolveWechatPlayerAuthor(c.replyName)}`
            : author;
          row.appendChild(who);
          row.appendChild(document.createTextNode('：'));
          row.appendChild(document.createTextNode(c.text));
          comments.appendChild(row);
        }
        interact.appendChild(comments);
      }
      card.appendChild(interact);
    }

    card.appendChild(createMomentsReplyBar(moment, publisher));
    return card;
  }

  // 点赞：玩家点 ❤ 加入/取消自己的点赞，落盘后同步楼层。署名用
  // iphoneGetWechatPlayerAuthor()（与评论同一套：填过昵称用昵称，否则 {{user}} 宏），
  // 换人设时名单里的自己会跟着解析成新人设名。
  function toggleLike(moment) {
    const data = iphoneGetWechatData();
    const target = data.moments.find((m) => m.id === moment.id);
    if (!target) return;
    const me = iphoneGetWechatPlayerAuthor();
    const has = target.likes.some((n) => iphoneIsWechatPlayerAuthor(n));
    target.likes = has
      ? target.likes.filter((n) => !iphoneIsWechatPlayerAuthor(n))
      : [...target.likes, me].slice(0, 8);
    iphoneSetWechatData(wxScreen, data);
    renderFeed();
    void iphoneSyncWechatMomentsFloor();
  }

  // 每条动态下方的留言条：收起态是「说点什么吧…」胶囊（带我的小头像），
  // 点开变输入行；回车或点「发送」把评论挂上去（先落盘重渲染），再调 API 生成回复
  function createMomentsReplyBar(moment, publisher) {
    const el = document.createElement('div');
    el.className = 'iphone-wxm__replybar';

    const pill = document.createElement('button');
    pill.type = 'button';
    pill.className = 'iphone-wxm__pill';
    pill.innerHTML = `
      <span class="iphone-wx__me-avatar iphone-wx__me-avatar--mini" data-me-avatar aria-hidden="true"></span>
      <span class="iphone-wxm__pill-hint">说点什么吧...</span>
    `;

    const row = document.createElement('div');
    row.className = 'iphone-wxm__replyrow';
    row.innerHTML = `
      <input type="text" class="iphone-wxm__replyinput" aria-label="回复这条动态"
        maxlength="300" autocomplete="off" spellcheck="false">
      <button type="button" class="iphone-wxm__replysend">发送</button>
    `;
    const input = row.querySelector('.iphone-wxm__replyinput');
    const sendBtn = row.querySelector('.iphone-wxm__replysend');
    input.placeholder = `评论 ${publisher ? publisher.name : 'TA'}...`;

    const errRow = document.createElement('p');
    errRow.className = 'iphone-wxm__replyerr';
    errRow.hidden = true;

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
      const playerAuthor = iphoneGetWechatPlayerAuthor();
      const withPlayer = iphoneGetWechatData();
      const target = withPlayer.moments.find((m) => m.id === moment.id);
      if (!target) {
        sending = false;
        errRow.hidden = false;
        errRow.textContent = '这条动态已经不在了。';
        return;
      }
      target.comments = [...target.comments, { name: playerAuthor, text }];
      iphoneSetWechatData(wxScreen, withPlayer);
      renderFeed();
      void iphoneSyncWechatMomentsFloor();
      try {
        const created = await iphoneGenerateWechatMomentReply(target);
        const data = iphoneGetWechatData();
        const t2 = data.moments.find((m) => m.id === moment.id);
        if (!t2) return;
        t2.comments = [...t2.comments, ...created];
        iphoneSetWechatData(wxScreen, data);
        renderFeed();
        void iphoneSyncWechatMomentsFloor();
      } catch (error) {
        iphoneLog('warn', '朋友圈回复失败', error);
        const freshBar = feed.querySelector(`[data-moment-id="${moment.id}"] .iphone-wxm__replybar`);
        if (freshBar) {
          freshBar.classList.add('is-open');
          const freshErr = freshBar.querySelector('.iphone-wxm__replyerr');
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
    return el;
  }

  function renderFeed() {
    const data = iphoneGetWechatData();
    feed.innerHTML = '';
    // TA的朋友圈：只留 TA 发的动态；全局朋友圈照旧显示所有人
    const list = visitorId
      ? data.moments.filter((m) => m.friendId === visitorId)
      : data.moments;
    if (!list.length) {
      const empty = document.createElement('div');
      empty.className = 'iphone-wxm__empty';
      empty.textContent = visitorId
        ? (data.friends.length ? 'TA 还没有发过朋友圈，下拉刷新试试' : '还没有联系人，先去添加朋友吧')
        : (data.friends.length ? '还没有朋友圈动态，下拉刷新试试' : '还没有联系人，先去添加朋友吧');
      feed.appendChild(empty);
      return;
    }
    for (const moment of [...list].reverse()) {
      const publisher = data.friends.find((f) => f.id === moment.friendId) || null;
      feed.appendChild(buildMomentCard(moment, publisher));
    }
    iphoneRefreshWechatMeIdentity(feed);
  }

  // 下拉刷新：与 QQ空间同一套手势（阈值 64px），松手调一次 API 生成 1~3 条动态
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
      // 72px：与 QQ空间同款——内容贴条带底边，小圈落在状态栏图标下方
      indicator.style.height = '72px';
      indicator.classList.add('is-refreshing');
      refreshText.textContent = visitorId ? '正在生成 TA 的新动态…' : '正在生成新的动态…';
      (async () => {
        let failText = '';
        try {
          // TA的朋友圈只让 TA 发一条；全局朋友圈照旧挑 1~3 位联系人
          const created = await iphoneGenerateWechatMoments(visitorId);
          const data = iphoneGetWechatData();
          iphoneSetWechatData(wxScreen, { ...data, moments: [...data.moments, ...created] });
          renderFeed();
          void iphoneSyncWechatMomentsFloor();
        } catch (error) {
          iphoneLog('warn', '朋友圈刷新动态失败', error);
          failText = String(error?.message || '').includes('还没有联系人') ? '还没有联系人' : '刷新失败';
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
  scroll.addEventListener('touchmove', (e) => {
    if (pulling && pullDy > 0) e.preventDefault();
  }, { passive: false });

  view.appendChild(nav);
  view.appendChild(scroll);
  iphoneRefreshWechatMeIdentity(view);

  scroll.addEventListener('scroll', () => {
    view.classList.toggle('is-scrolled', scroll.scrollTop > 170);
  });

  // 每次打开都调用：按最新数据重渲染（缓存视图也要跟上联系人与动态变化）
  view._refreshMomentsFeed = renderFeed;
  return view;
}

// ---------- 微信编辑资料（我的头像 / 昵称 / 微信号） ----------
// 结构与 QQ 的编辑资料页同范式：头像卡（点按推开选择头像浮层）+ 昵称/微信号
// 输入卡 + 脚注；资料存 chatMetadata.IPhone.wechatProfile，改动即时同步各视图。
function iphoneWechatBuildProfileView(icons, onClose, wxScreen) {
  const view = document.createElement('div');
  view.className = 'iphone-wx__prof';

  const nav = document.createElement('header');
  nav.className = 'iphone-wx__prof-nav';
  nav.innerHTML = `
    <button type="button" class="iphone-wx__prof-back" aria-label="返回">${icons.back}</button>
    <p class="iphone-wx__prof-title">个人信息</p>
    <span class="iphone-wx__prof-navspace" aria-hidden="true"></span>
  `;
  nav.querySelector('.iphone-wx__prof-back').addEventListener('click', onClose);

  const body = document.createElement('div');
  body.className = 'iphone-wx__prof-body';

  // 头像卡：点按推开「选择头像」浮层
  const avCard = document.createElement('button');
  avCard.type = 'button';
  avCard.className = 'iphone-wx__prof-avcard';
  avCard.innerHTML = `
    <span class="iphone-wx__me-avatar iphone-wx__me-avatar--prof" data-me-avatar aria-hidden="true"></span>
    <span class="iphone-wx__prof-avhint">点击更换头像</span>
  `;

  // 资料卡：昵称 / 微信号，右侧无边框输入，即点即改
  const card = document.createElement('div');
  card.className = 'iphone-wx__prof-card';
  const nameInput = document.createElement('input');
  nameInput.className = 'iphone-wx__prof-input';
  nameInput.type = 'text';
  nameInput.maxLength = 24;
  nameInput.placeholder = '留空 = 酒馆 {{user}}';
  nameInput.autocomplete = 'off';
  nameInput.spellcheck = false;
  const wxIdInput = document.createElement('input');
  wxIdInput.className = 'iphone-wx__prof-input';
  wxIdInput.type = 'text';
  wxIdInput.maxLength = 32;
  wxIdInput.placeholder = '留空 = 占位演示微信号';
  wxIdInput.autocomplete = 'off';
  wxIdInput.spellcheck = false;
  const makeRow = (labelText, input) => {
    const row = document.createElement('div');
    row.className = 'iphone-wx__prof-row';
    const label = document.createElement('label');
    label.className = 'iphone-wx__prof-label';
    label.textContent = labelText;
    row.appendChild(label);
    row.appendChild(input);
    return row;
  };
  card.appendChild(makeRow('昵称', nameInput));
  card.appendChild(makeRow('微信号', wxIdInput));

  const foot = document.createElement('p');
  foot.className = 'iphone-wx__prof-foot';
  foot.textContent = '头像与资料保存在本机插件的设置中，改动即时同步到消息、聊天与朋友圈各页；'
    + '昵称留空时使用酒馆的 {{user}}（当前人设名），微信号留空则使用占位演示资料。';

  nameInput.addEventListener('input', () => iphoneUpdateWechatProfile(wxScreen, { name: nameInput.value }));
  wxIdInput.addEventListener('input', () => iphoneUpdateWechatProfile(wxScreen, { wxId: wxIdInput.value }));

  // 选择头像浮层（微信款式：presets / 类前缀换成微信自己的）
  const picker = iphoneWechatBuildAvatarPicker(icons, {
    getCurrent: () => iphoneGetWechatProfile().avatar,
    onPick: (avatar) => iphoneUpdateWechatProfile(wxScreen, { avatar }),
    commit: (avatar) => iphoneUpdateWechatProfile(wxScreen, { avatar }),
  });
  avCard.addEventListener('click', picker.open);

  body.appendChild(avCard);
  body.appendChild(card);
  body.appendChild(foot);
  view.appendChild(nav);
  view.appendChild(body);
  view.appendChild(picker.el);

  // 重新打开时同步输入框：昵称框只显示「自定义昵称」本体，留空即跟随酒馆 {{user}}
  view._syncProfileInputs = () => {
    const profile = iphoneGetWechatProfile();
    nameInput.value = iphoneGetWechatCustomNick();
    nameInput.placeholder = profile.name ? `留空 = ${profile.name}` : '留空 = 酒馆 {{user}}';
    wxIdInput.value = profile.wxId === IPHONE_WECHAT_ME.wxId ? '' : profile.wxId;
    wxIdInput.placeholder = profile.wxId ? `留空 = ${profile.wxId}` : '留空 = 占位演示微信号';
  };
  return view;
}

// ---------- 微信添加朋友 / 发起群聊（共用表单页） ----------
// 与 QQ 的社交表单同范式：头像卡 + 昵称/微信号行式输入；群聊多一个成员勾选卡
//（至少 2 人）。onSubmit(fields) 返回错误文案则留在本页，null = 成功。
function iphoneWechatBuildSocialForm(icons, kind, onClose, onSubmit) {
  const isGroup = kind === 'group';
  const view = document.createElement('div');
  view.className = 'iphone-wx__prof';

  const nav = document.createElement('header');
  nav.className = 'iphone-wx__prof-nav';
  nav.innerHTML = `
    <button type="button" class="iphone-wx__prof-back" aria-label="返回">${icons.back}</button>
    <p class="iphone-wx__prof-title">${isGroup ? '发起群聊' : '添加朋友'}</p>
    <button type="button" class="iphone-wx__prof-action">${isGroup ? '创建' : '添加'}</button>
  `;
  nav.querySelector('.iphone-wx__prof-back').addEventListener('click', onClose);

  const body = document.createElement('div');
  body.className = 'iphone-wx__prof-body';

  const draft = { avatar: null, memberIds: new Set() };

  // 头像卡：点按推开「选择头像」浮层
  const avCard = document.createElement('button');
  avCard.type = 'button';
  avCard.className = 'iphone-wx__prof-avcard';
  const avPreviewWrap = document.createElement('span');
  avPreviewWrap.className = 'iphone-wx__prof-avcard-avatar';
  const avHint = document.createElement('span');
  avHint.className = 'iphone-wx__prof-avhint';
  avHint.textContent = '点击设置头像';
  avCard.append(avPreviewWrap, avHint);
  const renderPreview = () => {
    avPreviewWrap.innerHTML = '';
    avPreviewWrap.appendChild(iphoneWechatBuildEntityAvatar(
      { name: nameInput.value, avatar: draft.avatar },
      isGroup ? 'group' : 'friend',
    ));
  };

  // 输入卡：昵称（群名称）/ 微信号（群聊第二行换成群公告）
  const card = document.createElement('div');
  card.className = 'iphone-wx__prof-card';
  const nameInput = document.createElement('input');
  nameInput.className = 'iphone-wx__prof-input';
  nameInput.type = 'text';
  nameInput.maxLength = 24;
  nameInput.placeholder = isGroup ? '填写群名称' : '填写昵称';
  nameInput.autocomplete = 'off';
  nameInput.spellcheck = false;
  const wxInput = document.createElement('input');
  wxInput.className = 'iphone-wx__prof-input';
  wxInput.type = 'text';
  wxInput.maxLength = 32;
  wxInput.placeholder = isGroup ? '填写群公告' : '填写微信号';
  wxInput.autocomplete = 'off';
  wxInput.spellcheck = false;
  const makeRow = (labelText, input) => {
    const row = document.createElement('div');
    row.className = 'iphone-wx__prof-row';
    const label = document.createElement('label');
    label.className = 'iphone-wx__prof-label';
    label.textContent = labelText;
    row.appendChild(label);
    row.appendChild(input);
    return row;
  };
  card.appendChild(makeRow(isGroup ? '群名称' : '昵称', nameInput));
  card.appendChild(makeRow(isGroup ? '群公告' : '微信号', wxInput));

  // 群成员卡：勾选加入群聊的联系人（至少 2 人，含自己共 3 人起群）
  let memList = null;
  if (isGroup) {
    const memCard = document.createElement('div');
    memCard.className = 'iphone-wx__prof-card iphone-wx__memcard';
    const memHint = document.createElement('p');
    memHint.className = 'iphone-wx__mem-hint';
    memHint.textContent = '勾选加入群聊的联系人（至少 2 人）';
    memList = document.createElement('div');
    memList.className = 'iphone-wx__memlist';
    memCard.append(memHint, memList);
    body.appendChild(memCard);
  }
  const renderMembers = () => {
    if (!memList) return;
    const { friends } = iphoneGetWechatData();
    memList.innerHTML = '';
    if (!friends.length) {
      const empty = document.createElement('p');
      empty.className = 'iphone-wx__ctc-empty';
      empty.textContent = '还没有联系人，先「添加朋友」吧';
      memList.appendChild(empty);
      return;
    }
    for (const friend of friends) {
      const row = document.createElement('button');
      row.type = 'button';
      row.className = `iphone-wx__memrow${draft.memberIds.has(friend.id) ? ' is-on' : ''}`;
      row.appendChild(iphoneWechatBuildEntityAvatar(friend, 'friend'));
      const main = document.createElement('span');
      main.className = 'iphone-wx__memmain';
      main.textContent = friend.name;
      const sub = document.createElement('span');
      sub.className = 'iphone-wx__memsub';
      sub.textContent = friend.wxId || ' ';
      const check = document.createElement('i');
      check.className = 'iphone-wx__memcheck';
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
  statusEl.className = 'iphone-wx__avpick-status';
  const setStatus = (message, state = 'idle') => {
    statusEl.textContent = message;
    statusEl.dataset.state = state;
  };

  const foot = document.createElement('p');
  foot.className = 'iphone-wx__prof-foot';
  foot.textContent = isGroup
    ? '群聊保存在本机插件的设置中，创建后出现在微信会话与通讯录 · 群聊里。'
    : '联系人保存在本机插件的设置中，添加后出现在微信会话与通讯录列表里。';

  const picker = iphoneWechatBuildAvatarPicker(icons, {
    getCurrent: () => draft.avatar,
    onPick: (avatar) => {
      draft.avatar = avatar;
      renderPreview();
    },
  });
  avCard.addEventListener('click', picker.open);

  // 右上角动作：校验 → 提交（onSubmit 返回错误文案则留在本页，null 即成功关表单）
  nav.querySelector('.iphone-wx__prof-action').addEventListener('click', () => {
    const name = nameInput.value.trim();
    if (!name) {
      setStatus(isGroup ? '先填群名称。' : '先填昵称。', 'error');
      return;
    }
    if (isGroup && draft.memberIds.size < 2) {
      setStatus('至少选择 2 位联系人加入群聊。', 'error');
      return;
    }
    const error = onSubmit({
      name,
      wxId: wxInput.value.trim(),
      avatar: draft.avatar,
      memberIds: [...draft.memberIds],
    });
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

// ---------- 微信联系人资料页（聊天页右上角菜单进入） ----------
// 与 QQ 的「好友资料」同范式：头像卡 + 昵称/微信号输入 + 「她的朋友圈」入口行 +
// 「清空聊天记录」「删除联系人」两条红色警示行（带确认小卡）。
function iphoneWechatBuildFriendProfile(icons, friend, onClose, onSubmit, onOpenMoments, onClearMessages, onDeleteContact) {
  const view = document.createElement('div');
  view.className = 'iphone-wx__prof';

  const nav = document.createElement('header');
  nav.className = 'iphone-wx__prof-nav';
  nav.innerHTML = `
    <button type="button" class="iphone-wx__prof-back" aria-label="返回">${icons.back}</button>
    <p class="iphone-wx__prof-title">联系人资料</p>
    <button type="button" class="iphone-wx__prof-action">保存</button>
  `;
  nav.querySelector('.iphone-wx__prof-back').addEventListener('click', onClose);

  const body = document.createElement('div');
  body.className = 'iphone-wx__prof-body';

  // 草稿：以联系人当前资料为初值
  const draft = { avatar: friend.avatar || null };

  const avCard = document.createElement('button');
  avCard.type = 'button';
  avCard.className = 'iphone-wx__prof-avcard';
  const avPreviewWrap = document.createElement('span');
  avPreviewWrap.className = 'iphone-wx__prof-avcard-avatar';
  const avHint = document.createElement('span');
  avHint.className = 'iphone-wx__prof-avhint';
  avHint.textContent = '点击更换头像';
  avCard.append(avPreviewWrap, avHint);
  const renderPreview = () => {
    avPreviewWrap.innerHTML = '';
    avPreviewWrap.appendChild(iphoneWechatBuildEntityAvatar(
      { name: nameInput.value, avatar: draft.avatar },
      'friend',
    ));
  };

  const card = document.createElement('div');
  card.className = 'iphone-wx__prof-card';
  const nameInput = document.createElement('input');
  nameInput.className = 'iphone-wx__prof-input';
  nameInput.type = 'text';
  nameInput.maxLength = 24;
  nameInput.value = friend.name || '';
  nameInput.placeholder = '填写昵称';
  nameInput.autocomplete = 'off';
  nameInput.spellcheck = false;
  const wxInput = document.createElement('input');
  wxInput.className = 'iphone-wx__prof-input';
  wxInput.type = 'text';
  wxInput.maxLength = 32;
  wxInput.value = friend.wxId || '';
  wxInput.placeholder = '填写微信号';
  wxInput.autocomplete = 'off';
  wxInput.spellcheck = false;
  const makeRow = (labelText, input) => {
    const row = document.createElement('div');
    row.className = 'iphone-wx__prof-row';
    const label = document.createElement('label');
    label.className = 'iphone-wx__prof-label';
    label.textContent = labelText;
    row.appendChild(label);
    row.appendChild(input);
    return row;
  };
  card.appendChild(makeRow('昵称', nameInput));
  card.appendChild(makeRow('微信号', wxInput));

  // 朋友圈入口行：相册图标 + 「她的朋友圈」 + 右箭头（点开只显示 TA 的动态）
  const momentsRow = document.createElement('button');
  momentsRow.type = 'button';
  momentsRow.className = 'iphone-wx__prof-link';
  momentsRow.innerHTML = `
    <span class="iphone-wx__prof-link-ico" aria-hidden="true">${icons.moments}</span>她的朋友圈
    <span class="iphone-wx__prof-chev" aria-hidden="true">${icons.chevronRight}</span>
  `;
  momentsRow.addEventListener('click', () => onOpenMoments?.());

  // 确认小卡（清空 / 删除共用）
  const confirmBox = document.createElement('div');
  confirmBox.className = 'iphone-wx__prof-confirm';
  confirmBox.hidden = true;
  const confirmCard = document.createElement('div');
  confirmCard.className = 'iphone-wx__prof-confirm-card';
  const confirmTitle = document.createElement('p');
  confirmTitle.className = 'iphone-wx__prof-confirm-title';
  const confirmText = document.createElement('p');
  confirmText.className = 'iphone-wx__prof-confirm-text';
  const confirmActions = document.createElement('div');
  confirmActions.className = 'iphone-wx__prof-confirm-actions';
  const confirmCancel = document.createElement('button');
  confirmCancel.type = 'button';
  confirmCancel.className = 'iphone-wx__prof-confirm-cancel';
  confirmCancel.textContent = '取消';
  const confirmOk = document.createElement('button');
  confirmOk.type = 'button';
  confirmOk.className = 'iphone-wx__prof-confirm-ok';
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

  const clearRow = document.createElement('button');
  clearRow.type = 'button';
  clearRow.className = 'iphone-wx__prof-clear';
  clearRow.textContent = '清空聊天记录';
  clearRow.hidden = typeof onClearMessages !== 'function';
  clearRow.addEventListener('click', () => showConfirm({
    title: '清空聊天记录？',
    text: `将删除与「${friend.name || 'TA'}」的全部聊天记录，不可恢复。`,
    okText: '清空',
    onOk: () => {
      onClearMessages?.();
      onClose();
    },
  }));

  const deleteRow = document.createElement('button');
  deleteRow.type = 'button';
  deleteRow.className = 'iphone-wx__prof-clear';
  deleteRow.textContent = '删除联系人';
  deleteRow.hidden = typeof onDeleteContact !== 'function';
  deleteRow.addEventListener('click', () => showConfirm({
    title: '删除联系人？',
    text: `将删除「${friend.name || 'TA'}」及全部聊天记录，并把 TA 移出所在群聊，不可恢复。`,
    okText: '删除',
    onOk: () => onDeleteContact?.(),
  }));

  const statusEl = document.createElement('p');
  statusEl.className = 'iphone-wx__avpick-status';
  const setStatus = (message, state = 'idle') => {
    statusEl.textContent = message;
    statusEl.dataset.state = state;
  };

  nav.querySelector('.iphone-wx__prof-action').addEventListener('click', () => {
    const name = nameInput.value.trim();
    if (!name) {
      setStatus('先填昵称。', 'error');
      return;
    }
    const error = onSubmit({ name, wxId: wxInput.value.trim(), avatar: draft.avatar });
    if (error) setStatus(error, 'error');
    else onClose();
  });

  nameInput.addEventListener('input', renderPreview);

  const picker = iphoneWechatBuildAvatarPicker(icons, {
    getCurrent: () => draft.avatar,
    onPick: (avatar) => {
      draft.avatar = avatar;
      renderPreview();
    },
  });
  avCard.addEventListener('click', picker.open);

  const foot = document.createElement('p');
  foot.className = 'iphone-wx__prof-foot';
  foot.textContent = '头像与资料保存在本机插件的设置中，保存后即时同步到会话、通讯录与 TA 的朋友圈。';

  body.appendChild(avCard);
  body.appendChild(card);
  body.appendChild(momentsRow);
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

// ---------- 微信群聊资料页（聊天页右上角菜单进入） ----------
// 与 QQ 的群聊资料页同范式：头像卡 + 群名/群公告输入 + 成员列表（含「添加成员」
// 入口）+ 「清空聊天记录」「删除群聊」两条红色警示行。微信群没有「群号」，
// 第二行输入换成「群公告」。
function iphoneWechatBuildGroupProfile(icons, group, onClose, onSubmit, onClearMessages, onDeleteGroup, onOpenMembers) {
  const view = document.createElement('div');
  view.className = 'iphone-wx__prof';

  const nav = document.createElement('header');
  nav.className = 'iphone-wx__prof-nav';
  nav.innerHTML = `
    <button type="button" class="iphone-wx__prof-back" aria-label="返回">${icons.back}</button>
    <p class="iphone-wx__prof-title">群聊资料</p>
    <button type="button" class="iphone-wx__prof-action">保存</button>
  `;
  nav.querySelector('.iphone-wx__prof-back').addEventListener('click', onClose);

  const body = document.createElement('div');
  body.className = 'iphone-wx__prof-body';

  // 草稿：以群聊当前资料为初值
  const draft = { avatar: group.avatar || null };

  const avCard = document.createElement('button');
  avCard.type = 'button';
  avCard.className = 'iphone-wx__prof-avcard';
  const avPreviewWrap = document.createElement('span');
  avPreviewWrap.className = 'iphone-wx__prof-avcard-avatar';
  const avHint = document.createElement('span');
  avHint.className = 'iphone-wx__prof-avhint';
  avHint.textContent = '点击更换头像';
  avCard.append(avPreviewWrap, avHint);
  const renderPreview = () => {
    avPreviewWrap.innerHTML = '';
    avPreviewWrap.appendChild(iphoneWechatBuildEntityAvatar(
      { name: nameInput.value, avatar: draft.avatar },
      'group',
    ));
  };

  const card = document.createElement('div');
  card.className = 'iphone-wx__prof-card';
  const nameInput = document.createElement('input');
  nameInput.className = 'iphone-wx__prof-input';
  nameInput.type = 'text';
  nameInput.maxLength = 24;
  nameInput.value = group.name || '';
  nameInput.placeholder = '填写群名称';
  nameInput.autocomplete = 'off';
  nameInput.spellcheck = false;
  const wxInput = document.createElement('input');
  wxInput.className = 'iphone-wx__prof-input';
  wxInput.type = 'text';
  wxInput.maxLength = 32;
  wxInput.value = group.wxId || '';
  wxInput.placeholder = '填写群公告';
  wxInput.autocomplete = 'off';
  wxInput.spellcheck = false;
  const makeRow = (labelText, input) => {
    const row = document.createElement('div');
    row.className = 'iphone-wx__prof-row';
    const label = document.createElement('label');
    label.className = 'iphone-wx__prof-label';
    label.textContent = labelText;
    row.appendChild(label);
    row.appendChild(input);
    return row;
  };
  card.appendChild(makeRow('群名称', nameInput));
  card.appendChild(makeRow('群公告', wxInput));

  // 群成员卡：列出当前成员（不含你），末行「添加成员」推入选择页；暴露
  // _renderGroupMembers 供「添加成员」页保存后重渲染（资料页此时还开着）。
  const memCard = document.createElement('div');
  memCard.className = 'iphone-wx__prof-card iphone-wx__memcard';
  const memHint = document.createElement('p');
  memHint.className = 'iphone-wx__mem-hint';
  const memList = document.createElement('div');
  memList.className = 'iphone-wx__memlist';
  memCard.append(memHint, memList);
  const renderMembers = () => {
    const data = iphoneGetWechatData();
    const target = data.groups.find((g) => g.id === group.id) || group;
    const memberIds = Array.isArray(target.memberIds) ? target.memberIds : [];
    memHint.textContent = `群聊成员（${memberIds.length} 位，不含你自己）`;
    memList.innerHTML = '';
    for (const id of memberIds) {
      const member = data.friends.find((f) => f.id === id);
      if (!member) continue;
      const row = document.createElement('div');
      row.className = 'iphone-wx__memrow';
      row.appendChild(iphoneWechatBuildEntityAvatar(member, 'friend'));
      const main = document.createElement('span');
      main.className = 'iphone-wx__memmain';
      main.textContent = member.name;
      const sub = document.createElement('span');
      sub.className = 'iphone-wx__memsub';
      sub.textContent = member.wxId || ' ';
      row.append(main, sub);
      memList.appendChild(row);
    }
    if (!memList.children.length) {
      const empty = document.createElement('p');
      empty.className = 'iphone-wx__ctc-empty';
      empty.textContent = '暂无其他成员';
      memList.appendChild(empty);
    }
    const addRow = document.createElement('button');
    addRow.type = 'button';
    addRow.className = 'iphone-wx__memrow';
    const plus = document.createElement('i');
    plus.className = 'iphone-wx__memplus';
    plus.textContent = '＋';
    plus.setAttribute('aria-hidden', 'true');
    const addMain = document.createElement('span');
    addMain.className = 'iphone-wx__memmain';
    addMain.textContent = '添加成员';
    addRow.append(plus, addMain);
    addRow.hidden = typeof onOpenMembers !== 'function';
    addRow.addEventListener('click', () => onOpenMembers?.());
    memList.appendChild(addRow);
  };
  renderMembers();
  view._renderGroupMembers = renderMembers;

  // 确认小卡（清空 / 删除共用）
  const confirmBox = document.createElement('div');
  confirmBox.className = 'iphone-wx__prof-confirm';
  confirmBox.hidden = true;
  const confirmCard = document.createElement('div');
  confirmCard.className = 'iphone-wx__prof-confirm-card';
  const confirmTitle = document.createElement('p');
  confirmTitle.className = 'iphone-wx__prof-confirm-title';
  const confirmText = document.createElement('p');
  confirmText.className = 'iphone-wx__prof-confirm-text';
  const confirmActions = document.createElement('div');
  confirmActions.className = 'iphone-wx__prof-confirm-actions';
  const confirmCancel = document.createElement('button');
  confirmCancel.type = 'button';
  confirmCancel.className = 'iphone-wx__prof-confirm-cancel';
  confirmCancel.textContent = '取消';
  const confirmOk = document.createElement('button');
  confirmOk.type = 'button';
  confirmOk.className = 'iphone-wx__prof-confirm-ok';
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

  const clearRow = document.createElement('button');
  clearRow.type = 'button';
  clearRow.className = 'iphone-wx__prof-clear';
  clearRow.textContent = '清空聊天记录';
  clearRow.hidden = typeof onClearMessages !== 'function';
  clearRow.addEventListener('click', () => showConfirm({
    title: '清空聊天记录？',
    text: `将删除群「${group.name || '本群'}」的全部聊天记录，不可恢复。`,
    okText: '清空',
    onOk: () => {
      onClearMessages?.();
      onClose();
    },
  }));

  const deleteRow = document.createElement('button');
  deleteRow.type = 'button';
  deleteRow.className = 'iphone-wx__prof-clear';
  deleteRow.textContent = '删除群聊';
  deleteRow.hidden = typeof onDeleteGroup !== 'function';
  deleteRow.addEventListener('click', () => showConfirm({
    title: '删除群聊？',
    text: `将删除群「${group.name || '本群'}」及全部聊天记录，不可恢复。`,
    okText: '删除',
    onOk: () => onDeleteGroup?.(),
  }));

  const statusEl = document.createElement('p');
  statusEl.className = 'iphone-wx__avpick-status';
  const setStatus = (message, state = 'idle') => {
    statusEl.textContent = message;
    statusEl.dataset.state = state;
  };

  nav.querySelector('.iphone-wx__prof-action').addEventListener('click', () => {
    const name = nameInput.value.trim();
    if (!name) {
      setStatus('先填群名称。', 'error');
      return;
    }
    const error = onSubmit({ name, wxId: wxInput.value.trim(), avatar: draft.avatar });
    if (error) setStatus(error, 'error');
    else onClose();
  });

  nameInput.addEventListener('input', renderPreview);

  const picker = iphoneWechatBuildAvatarPicker(icons, {
    getCurrent: () => draft.avatar,
    onPick: (avatar) => {
      draft.avatar = avatar;
      renderPreview();
    },
  });
  avCard.addEventListener('click', picker.open);

  const foot = document.createElement('p');
  foot.className = 'iphone-wx__prof-foot';
  foot.textContent = '头像与资料保存在本机插件的设置中，保存后即时同步到会话与通讯录列表。';

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

// ---------- 微信群「添加成员」页 ----------
// 列出还没进群的联系人，勾选后右上角「添加」批量拉入。
function iphoneWechatBuildGroupMemberPicker(icons, group, onClose, onSubmit) {
  const view = document.createElement('div');
  view.className = 'iphone-wx__prof';

  const nav = document.createElement('header');
  nav.className = 'iphone-wx__prof-nav';
  nav.innerHTML = `
    <button type="button" class="iphone-wx__prof-back" aria-label="返回">${icons.back}</button>
    <p class="iphone-wx__prof-title">添加成员</p>
    <button type="button" class="iphone-wx__prof-action">添加</button>
  `;
  nav.querySelector('.iphone-wx__prof-back').addEventListener('click', onClose);

  const body = document.createElement('div');
  body.className = 'iphone-wx__prof-body';

  // 草稿：勾选待拉入的联系人 id 集合；右上角动作实时显示已选人数
  const draft = new Set();
  const action = nav.querySelector('.iphone-wx__prof-action');
  const refreshAction = () => {
    action.textContent = draft.size ? `添加(${draft.size})` : '添加';
  };

  // 只列还没进群的联系人；没有候选人时给一句说明
  const { friends } = iphoneGetWechatData();
  const memberIds = new Set((Array.isArray(group.memberIds) ? group.memberIds : []).map(String));
  const candidates = friends.filter((f) => !memberIds.has(String(f.id)));

  const memCard = document.createElement('div');
  memCard.className = 'iphone-wx__prof-card iphone-wx__memcard';
  const memHint = document.createElement('p');
  memHint.className = 'iphone-wx__mem-hint';
  memHint.textContent = '勾选要拉进群的联系人';
  const memList = document.createElement('div');
  memList.className = 'iphone-wx__memlist';
  memCard.append(memHint, memList);
  for (const friend of candidates) {
    const row = document.createElement('button');
    row.type = 'button';
    row.className = 'iphone-wx__memrow';
    row.appendChild(iphoneWechatBuildEntityAvatar(friend, 'friend'));
    const main = document.createElement('span');
    main.className = 'iphone-wx__memmain';
    main.textContent = friend.name;
    const sub = document.createElement('span');
    sub.className = 'iphone-wx__memsub';
    sub.textContent = friend.wxId || ' ';
    const check = document.createElement('i');
    check.className = 'iphone-wx__memcheck';
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
    empty.className = 'iphone-wx__ctc-empty';
    empty.textContent = friends.length ? '所有联系人都已在群里' : '还没有联系人，先「添加朋友」吧';
    memList.appendChild(empty);
  }

  const statusEl = document.createElement('p');
  statusEl.className = 'iphone-wx__avpick-status';
  const setStatus = (message, state = 'idle') => {
    statusEl.textContent = message;
    statusEl.dataset.state = state;
  };

  const foot = document.createElement('p');
  foot.className = 'iphone-wx__prof-foot';
  foot.textContent = '新成员立即出现在群成员列表与聊天页的成员数里。';

  action.addEventListener('click', () => {
    if (!draft.size) {
      setStatus('先勾选要拉进群的联系人。', 'error');
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

// ---------- 微信主屏幕（四 Tab：微信 / 通讯录 / 发现 / 我） ----------
// 结构与 buildQqAppScreen 同范式：共享头部 + 四个 Tab 页 + 底部标签栏，
// 外加覆盖层：聊天页 / 联系人资料 / 群聊资料 / 添加成员 / 朋友圈 / 编辑资料 / 表单。
// 微信头部与 QQ 不同：消息页头部是左标题「微信」+ 右上角「+」，其余三页只有居中标题。
function buildWechatAppScreen() {
  const icons = iphoneWechatIcons();

  const screen = document.createElement('div');
  screen.className = 'iphone-app iphone-wx';

  const listView = document.createElement('div');
  listView.className = 'iphone-wx__listview';

  // 头部：两种形态（消息页带「+」；其余页只有居中标题）
  const header = document.createElement('header');
  header.className = 'iphone-wx__header';
  function setWxHeader(mode) {
    if (header._mode === mode) return;
    header._mode = mode;
    header.innerHTML = mode === 'chats'
      ? `
        <p class="iphone-wx__heading">微信</p>
        <button type="button" class="iphone-wx__add" aria-label="添加">${icons.plus}</button>
      `
      : `<p class="iphone-wx__heading">${mode === 'contacts' ? '通讯录' : mode === 'discover' ? '发现' : '我'}</p>`;
  }
  setWxHeader('chats');

  // 右上角「+」弹出菜单：发起群聊 / 添加朋友
  const addMenu = document.createElement('div');
  addMenu.className = 'iphone-wx__addmenu';
  addMenu.innerHTML = `
    <button type="button" class="iphone-wx__addmenu-item" data-act="group">${icons.groupChat}<span>发起群聊</span></button>
    <button type="button" class="iphone-wx__addmenu-item" data-act="friend">${icons.friendNew}<span>添加朋友</span></button>
  `;
  function closeAddMenu() {
    addMenu.classList.remove('is-open');
  }
  addMenu.addEventListener('click', (event) => {
    const item = event.target.closest('.iphone-wx__addmenu-item');
    if (!item) return;
    closeAddMenu();
    openWxEntityForm(item.dataset.act);
  });
  // 点菜单与加号以外的任意位置收起
  listView.addEventListener('click', (event) => {
    if (!addMenu.classList.contains('is-open')) return;
    if (!event.target.closest('.iphone-wx__addmenu') && !event.target.closest('.iphone-wx__add')) closeAddMenu();
  });

  header.addEventListener('click', (event) => {
    if (event.target.closest('.iphone-wx__add')) {
      addMenu.classList.toggle('is-open');
    }
  });

  const sheet = document.createElement('section');
  sheet.className = 'iphone-wx__sheet';

  // Tab 1：微信（会话列表由 wechatData 渲染：联系人在前、群聊在后）
  const pageChats = document.createElement('div');
  pageChats.className = 'iphone-wx__tabpage';
  const chats = document.createElement('ul');
  chats.className = 'iphone-wx__chats';
  function renderChats() {
    const { friends, groups } = iphoneGetWechatData();
    chats.innerHTML = '';
    if (!friends.length && !groups.length) {
      const empty = document.createElement('li');
      empty.className = 'iphone-wx__chats-empty';
      empty.textContent = '暂无会话，点右上角「+」添加朋友或发起群聊';
      chats.appendChild(empty);
      return;
    }
    for (const friend of friends) chats.appendChild(iphoneWechatBuildChatItem({ kind: 'friend', ...friend }, openWxConversation));
    for (const group of groups) chats.appendChild(iphoneWechatBuildChatItem({ kind: 'group', ...group }, openWxConversation));
  }
  pageChats.appendChild(chats);

  // Tab 2/3/4：通讯录 / 发现 / 我
  const pageContacts = iphoneWechatBuildContactsPage(icons, openWxConversation, iphoneGetWechatData);
  const pageDiscover = iphoneWechatBuildDiscoverPage(icons, () => openMomentsView());
  const pageMe = iphoneWechatBuildMePage(icons, openWxProfileView, () => openWxServiceView());

  sheet.appendChild(pageChats);
  sheet.appendChild(pageContacts);
  sheet.appendChild(pageDiscover);
  sheet.appendChild(pageMe);

  // 底部标签栏：微信 / 通讯录 / 发现 / 我
  const tabs = [
    { label: '微信', icon: icons.chat, page: pageChats },
    { label: '通讯录', icon: icons.contacts, page: pageContacts },
    { label: '发现', icon: icons.discover, page: pageDiscover },
    { label: '我', icon: icons.me, page: pageMe },
  ];
  const tabbar = document.createElement('nav');
  tabbar.className = 'iphone-wx__tabbar';
  const tabButtons = [];
  tabs.forEach((tab, i) => {
    const el = document.createElement('button');
    el.type = 'button';
    el.className = `iphone-wx__tab${i === 0 ? ' is-active' : ''}`;
    el.innerHTML = `${tab.icon}<i>${tab.label}</i>`;
    el.addEventListener('click', () => {
      tabButtons.forEach((b) => b.classList.remove('is-active'));
      el.classList.add('is-active');
      tabs.forEach((t) => t.page.classList.toggle('is-hidden', t.page !== tab.page));
      setWxHeader(tab.page === pageContacts ? 'contacts' : tab.page === pageDiscover ? 'discover' : tab.page === pageMe ? 'me' : 'chats');
    });
    tabButtons.push(el);
    tabbar.appendChild(el);
  });

  function switchWechatTab(index) {
    if (tabButtons[index]) tabButtons[index].click();
  }

  listView.appendChild(header);
  listView.appendChild(sheet);
  listView.appendChild(tabbar);
  listView.appendChild(addMenu);

  // —— 覆盖层一：聊天页（联系人 / 群聊实体） ——
  const chatView = document.createElement('div');
  chatView.className = 'iphone-wx__chatview';
  function openWxConversation(entity) {
    if (!entity) return;
    chatView.innerHTML = '';
    chatView.appendChild(iphoneWechatBuildChatView(entity, icons, () => {
      chatView.classList.remove('is-open');
    }, (api) => {
      // 右上角菜单：联系人进联系人资料页、群聊进群聊资料页（按 id 取最新数据），
      // 并把聊天页操作集（清空聊天记录）与「删除联系人/删除群聊」回调转交资料页
      if (entity.kind === 'friend') {
        const fresh = iphoneGetWechatData().friends.find((f) => f.id === entity.id);
        if (!fresh) return;
        openWxFriendProfile(fresh, api, () => {
          const data = iphoneGetWechatData();
          data.friends = data.friends.filter((f) => f.id !== entity.id);
          iphoneSetWechatData(screen, data);
          chatView.classList.remove('is-open');
          friendProfView.classList.remove('is-open');
        });
        return;
      }
      const freshGroup = iphoneGetWechatData().groups.find((g) => g.id === entity.id);
      if (!freshGroup) return;
      openWxGroupProfile(freshGroup, api, () => {
        const data = iphoneGetWechatData();
        data.groups = data.groups.filter((g) => g.id !== entity.id);
        iphoneSetWechatData(screen, data);
        chatView.classList.remove('is-open');
        groupProfView.classList.remove('is-open');
      });
    }, screen));
    chatView.classList.add('is-open');
    const stream = chatView.querySelector('.iphone-wxc__stream');
    if (stream) stream.scrollTop = stream.scrollHeight;
  }

  // —— 覆盖层二：联系人资料（改头像/昵称/微信号 + 她的朋友圈入口；每次打开重建） ——
  const friendProfView = document.createElement('div');
  friendProfView.className = 'iphone-wx__profview';
  function openWxFriendProfile(friend, api, onDeleteContact) {
    if (!friend) return;
    friendProfView.innerHTML = '';
    friendProfView.appendChild(iphoneWechatBuildFriendProfile(icons, friend, () => {
      friendProfView.classList.remove('is-open');
    }, (fields) => {
      const data = iphoneGetWechatData();
      const target = data.friends.find((f) => f.id === friend.id);
      if (!target) return '该联系人已被删除。';
      target.name = fields.name;
      target.wxId = fields.wxId;
      target.avatar = fields.avatar;
      iphoneSetWechatData(screen, data);
      // 聊天页还开着，标题同步新昵称
      const title = chatView.querySelector('.iphone-wxc__title');
      if (title) title.textContent = fields.name;
      return null;
    }, () => openMomentsView(friend), api?.clearMessages, () => onDeleteContact?.()));
    friendProfView.classList.add('is-open');
  }

  // —— 覆盖层三：群聊资料（改头像/群名/群公告 + 清空/删除；每次打开重建） ——
  const groupProfView = document.createElement('div');
  groupProfView.className = 'iphone-wx__profview';
  function openWxGroupProfile(group, api, onDeleteGroup) {
    if (!group) return;
    groupProfView.innerHTML = '';
    groupProfView.appendChild(iphoneWechatBuildGroupProfile(icons, group, () => {
      groupProfView.classList.remove('is-open');
    }, (fields) => {
      const data = iphoneGetWechatData();
      const target = data.groups.find((g) => g.id === group.id);
      if (!target) return '该群聊已被删除。';
      target.name = fields.name;
      target.wxId = fields.wxId;
      target.avatar = fields.avatar;
      iphoneSetWechatData(screen, data);
      // 聊天页还开着，标题同步新群名与成员数
      const title = chatView.querySelector('.iphone-wxc__title');
      const memberCount = (Array.isArray(target.memberIds) ? target.memberIds.length : 0) + 1;
      if (title) title.textContent = `${fields.name}(${memberCount})`;
      return null;
    }, api?.clearMessages, () => onDeleteGroup?.(), () => openWxGroupMembers(group)));
    groupProfView.classList.add('is-open');
  }

  // —— 覆盖层四：添加成员（从群聊资料进入，勾选联系人批量拉入群聊；每次打开重建） ——
  const groupMemView = document.createElement('div');
  groupMemView.className = 'iphone-wx__profview';
  function openWxGroupMembers(group) {
    if (!group) return;
    groupMemView.innerHTML = '';
    groupMemView.appendChild(iphoneWechatBuildGroupMemberPicker(icons, group, () => {
      groupMemView.classList.remove('is-open');
    }, (ids) => {
      const data = iphoneGetWechatData();
      const target = data.groups.find((g) => g.id === group.id);
      if (!target) return '该群聊已被删除。';
      const memberIds = Array.isArray(target.memberIds) ? target.memberIds : [];
      target.memberIds = [...new Set([...memberIds, ...ids.map(String)])];
      iphoneSetWechatData(screen, data);
      // 聊天页还开着，标题同步新成员数
      const memberCount = target.memberIds.length + 1;
      const title = chatView.querySelector('.iphone-wxc__title');
      if (title) title.textContent = `${target.name}(${memberCount})`;
      // 底下的群聊资料页还开着，成员列表同步重渲染
      groupProfView.firstChild?._renderGroupMembers?.();
      return null;
    }));
    groupMemView.classList.add('is-open');
  }

  // —— 覆盖层五：朋友圈（全局页构建一次缓存；每次打开按最新数据重渲染；
  //    「TA的朋友圈」按联系人重建，身份变了就重建） ——
  const momentsView = document.createElement('div');
  momentsView.className = 'iphone-wx__momentsview';
  let momentsVisitorId = null; // '' = 全局朋友圈；联系人 id = 该联系人的朋友圈
  function openMomentsView(friend) {
    const visitor = friend ? { id: friend.id, name: friend.name, avatar: friend.avatar } : null;
    const key = visitor ? String(visitor.id) : '';
    // 全局页构建一次缓存；访客页每次重建（头像/昵称始终取最新，与 QQ空间一致）
    if (friend || !momentsView.firstChild || momentsVisitorId !== key) {
      momentsView.innerHTML = '';
      momentsVisitorId = key;
      momentsView.appendChild(iphoneWechatBuildMomentsView(icons, () => {
        momentsView.classList.remove('is-open');
      }, openWxProfileView, screen, visitor));
    }
    // 动态流按最新数据渲染（缓存页也要跟上联系人与动态的变化）
    momentsView.firstChild?._refreshMomentsFeed?.();
    momentsView.classList.add('is-open');
    const scroll = momentsView.querySelector('.iphone-wxm__scroll');
    if (scroll) scroll.scrollTop = 0;
  }

  // —— 覆盖层六：编辑资料（我的头像 / 昵称 / 微信号，改动即时同步各视图） ——
  const profView = document.createElement('div');
  profView.className = 'iphone-wx__profview';
  function openWxProfileView() {
    if (!profView.firstChild) {
      profView.appendChild(iphoneWechatBuildProfileView(icons, () => {
        profView.classList.remove('is-open');
      }, screen));
    }
    profView.firstChild._syncProfileInputs?.();
    profView.classList.add('is-open');
  }

  // —— 覆盖层七：添加朋友 / 发起群聊（共用容器，每次打开重建以重置草稿） ——
  const formView = document.createElement('div');
  formView.className = 'iphone-wx__profview';
  function openWxEntityForm(kind) {
    const isGroup = kind === 'group';
    formView.innerHTML = '';
    formView.appendChild(iphoneWechatBuildSocialForm(icons, kind, () => {
      formView.classList.remove('is-open');
    }, (fields) => {
      const data = iphoneGetWechatData();
      if (isGroup) {
        data.groups.push({ id: iphoneWechatGenEntityId('wg'), ...fields });
      } else {
        data.friends.push({ id: iphoneWechatGenEntityId('wf'), ...fields });
      }
      iphoneSetWechatData(screen, data);
      return null;
    }));
    formView.classList.add('is-open');
  }

  // —— 覆盖层八：服务 / 钱包 / 零钱（v0.22.1；零钱页 v0.27.0 起可评估） ——
  // 三层叠加：零钱盖在钱包上、钱包盖在服务上，返回只关自己（与微信一致）。
  // 每层每次打开都重建，余额等数据取最新；评估改了余额后，上层的绿卡与零钱行
  // 靠各自的 _refresh 钩子在返回时翻新（见下）。
  const svcIcons = iphoneWechatServiceIcons();
  const serviceView = document.createElement('div');
  serviceView.className = 'iphone-wx__profview iphone-wx__svcview';
  function openWxServiceView() {
    serviceView.innerHTML = '';
    serviceView.appendChild(iphoneWechatBuildServicePage(icons, svcIcons, () => {
      serviceView.classList.remove('is-open');
    }, () => openWxWalletView()));
    serviceView.classList.add('is-open');
  }

  const walletView = document.createElement('div');
  walletView.className = 'iphone-wx__profview iphone-wx__svcview iphone-wx__svcview--wallet';
  function openWxWalletView() {
    walletView.innerHTML = '';
    walletView.appendChild(iphoneWechatBuildWalletView(icons, svcIcons, () => {
      walletView.classList.remove('is-open');
      // 零钱页里评估过余额：回服务页前把绿卡余额刷新到最新
      refreshWxServiceBalance();
    }, () => openWxChangeView()));
    walletView.classList.add('is-open');
  }

  const changeView = document.createElement('div');
  changeView.className = 'iphone-wx__profview iphone-wx__svcview iphone-wx__svcview--change';
  function openWxChangeView() {
    changeView.innerHTML = '';
    changeView.appendChild(iphoneWechatBuildChangeView(icons, svcIcons, () => {
      changeView.classList.remove('is-open');
      // 返回钱包页：零钱行显示的是打开那一刻的余额，评估过就要翻新
      refreshWxWalletBalance();
    }));
    changeView.classList.add('is-open');
  }

  // 服务页绿卡 / 钱包页零钱行的余额就地刷新（评估后返回时调用；两层都还在 DOM 里，
  // 只是被盖住，所以直接改节点文本即可，不必重建 —— 重建会把下面已打开的层也重置）。
  const refreshWxServiceBalance = () => {
    serviceView.querySelectorAll('[data-wallet-balance]').forEach((el) => {
      el.textContent = `¥${iphoneWechatMoney(iphoneGetWechatWallet().balance)}`;
    });
  };
  const refreshWxWalletBalance = () => {
    walletView.querySelectorAll('[data-wallet-balance]').forEach((el) => {
      el.textContent = `¥${iphoneWechatMoney(iphoneGetWechatWallet().balance)}`;
    });
    refreshWxServiceBalance();
  };

  // 联系人/群聊数据变化后的统一刷新：会话列表 + 通讯录
  screen._renderWechatSocial = () => {
    renderChats();
    pageContacts._render?.();
  };

  screen.appendChild(listView);
  screen.appendChild(chatView);
  screen.appendChild(friendProfView);
  screen.appendChild(groupProfView);
  screen.appendChild(groupMemView);
  screen.appendChild(momentsView);
  screen.appendChild(profView);
  screen.appendChild(formView);
  screen.appendChild(serviceView);
  screen.appendChild(walletView);
  screen.appendChild(changeView);
  screen._switchWechatTab = switchWechatTab;
  renderChats();
  iphoneRefreshWechatMeIdentity(screen);
  return screen;
}

