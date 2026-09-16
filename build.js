// ===== iPhone（悬浮球手机）构建脚本：把 js/ 下的源码按依赖顺序拼接成单个 index.js =====
//
// 为什么需要它：TauriTavern 的 manifest 只接受单个 JS 文件（"js" 必须是字符串或
// 单元素数组）。源码拆在 js/ 下便于维护，发布时用本脚本拼回一个 index.js 供宿主
// 加载。与同目录 Kaleidoscope 的构建脚本同构（防呆设计一并沿用）：
// - watch 同时监听 build.js 自身，FILES 变更后自动重启进程；
// - js/ 下新增文件忘记加入 FILES 时大声警告；
// - 产物头部写入构建时间与 FNV-1a 指纹，--check 校验产物是否落后于源码。
//
// 用法：
//   node build.js          一次性构建
//   node build.js --watch  监听 js/ 与 build.js 的变更，自动重建（Ctrl+C 退出）
//   node build.js --check  校验磁盘上的 index.js 是否与当前源码一致（提交前跑）
// 依赖：仅 Node 内置模块，无第三方依赖。
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

// 拼接顺序 = 依赖顺序：常量 → 工具 → 宿主适配 → 应用内页 → 微信应用 → 小红书应用 →
// 手机界面 → 悬浮球 → 入口。
const FILES = [
  'js/constants.js',
  'js/utils.js',
  'js/host.js',
  'js/logs.js',
  'js/inject.js',
  'js/apps.js',
  'js/wechat.js',
  'js/xhs.js',
  'js/phone.js',
  'js/sphere.js',
  'js/main.js',
];

const root = __dirname;
const outPath = path.join(root, 'index.js');

function fingerprint(text) {
  let hash = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
}

function buildParts() {
  const parts = FILES.map((file) => {
    const full = path.join(root, file);
    if (!fs.existsSync(full)) {
      console.error(`[build] 缺少文件: ${file}`);
      process.exit(1);
    }
    const content = fs.readFileSync(full, 'utf8');
    return `// ===== ${file} =====\n${content}`;
  });
  const listed = new Set(FILES.map((file) => path.basename(file)));
  for (const name of fs.readdirSync(path.join(root, 'js'))) {
    if (name.endsWith('.js') && !listed.has(name)) {
      console.error(`[build] 警告: js/${name} 未加入 FILES，不会被打进 index.js！`);
    }
  }
  return parts;
}

function assemble(parts) {
  const body = parts.join('\n\n') + '\n';
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const stamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  const header = [
    '// ===== iPhone（悬浮球手机）index.js — 构建产物，勿手改 =====',
    `// 构建时间: ${stamp} · 文件数: ${FILES.length} · 指纹: ${fingerprint(body)}`,
  ].join('\n');
  return `${header}\n\n${body}`;
}

function buildOnce() {
  const output = assemble(buildParts());
  fs.writeFileSync(outPath, output, 'utf8');
  console.log(`[build] 已生成 index.js（${FILES.length} 个文件，${output.split('\n').length} 行）`);
  return output;
}

// 提交前校验：磁盘上的 index.js 必须与当前源码一致（容忍 CRLF 与头部时间戳差异）。
function checkOnce() {
  let onDisk;
  try {
    onDisk = fs.readFileSync(outPath, 'utf8');
  } catch {
    console.error('[build] --check 失败：index.js 不存在，请先运行 node build.js');
    process.exit(1);
  }
  const fresh = assemble(buildParts());
  const norm = (text) => text.replace(/\r/g, '');
  const sliceBody = (text) => {
    const sep = text.indexOf('\n\n');
    return sep === -1 ? text : text.slice(sep + 2);
  };
  if (sliceBody(norm(onDisk)) === sliceBody(norm(fresh))) {
    console.log('[build] --check 通过：index.js 与当前源码一致');
    return;
  }
  console.error('[build] --check 失败：index.js 与当前源码不一致！');
  console.error('[build] 请运行 node build.js 重建后重新提交。');
  process.exit(1);
}

const watchMode = process.argv.includes('--watch');
const checkMode = process.argv.includes('--check');

if (checkMode) {
  checkOnce();
} else if (watchMode) {
  buildOnce();
  const rebuild = () => {
    try {
      buildOnce();
    } catch (error) {
      console.error('[build] 重建失败', error);
    }
  };
  let timer = null;
  const debounce = (fn) => {
    clearTimeout(timer);
    timer = setTimeout(fn, 200);
  };
  fs.watch(path.join(root, 'js'), { persistent: true }, () => debounce(rebuild));
  let restarting = false;
  const restart = () => {
    if (restarting) return;
    restarting = true;
    console.log('[build] build.js 已变更，自动重启 watch…');
    const child = spawn(process.execPath, [__filename, '--watch'], { stdio: 'inherit' });
    child.on('spawn', () => {
      setTimeout(() => process.exit(0), 250);
    });
    child.on('error', (error) => {
      console.error('[build] 重启失败（旧进程继续运行）', error.message);
      restarting = false;
    });
  };
  fs.watch(root, { persistent: true }, (event, filename) => {
    if (filename === 'build.js') debounce(restart);
  });
  console.log('[build] watch 模式：监听 js/（重建）与 build.js（重启），Ctrl+C 退出');
} else {
  buildOnce();
}
