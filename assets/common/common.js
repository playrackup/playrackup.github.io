/* ============================================================
RACK UP — common.js
ナベクリエイト / playrackup.github.io

【役割】
全ページ共通のJavaScript処理を一元管理する。

- ヘッダーの生成（戻る・サウンド・設定ボタン）
- サウンドON/OFF状態の管理
- 向き変更時のレイアウト崩れ防止

【対応環境】

- iPhone  最新Safari   <- フル最適化
- iPad Air1 iOS12/Safari12 <- 最低限動く・崩れない

【構文方針】
iOS12(Safari12)のES6部分対応リスクを避けるため
var / function宣言 / 従来のfor文 で統一する。
const・let・アロー関数は使わない。
============================================================ */

/* ============================================================
サウンド状態管理
============================================================ */
function isSoundOn() {
return localStorage.getItem('ru_sound') !== 'off';
}

function setSoundOn(val) {
localStorage.setItem('ru_sound', val ? 'on' : 'off');
}

/* ============================================================
safe-area変数をJSで同期する（syncSafeAreaVars）

【なぜ必要か】
CSS で env() を直書きすると、iOS Safari は回転時に
env() の再計算とヒットテスト座標の更新タイミングがズレる。
JS経由で –sat 等のCSS変数に再代入することで
safe-area適用タイミングを自分で制御できる。

【ハイブリッド方式】
回転開始時 → 固定値59px（ダイナミックアイランド基準）を先行適用
回転完了後 → 実際のenv()値をJS経由で再代入
============================================================ */
function syncSafeAreaVars() {
var root = document.documentElement;
var el = document.createElement('div');
el.style.position = 'fixed';
el.style.top = 'env(safe-area-inset-top, 0px)';
el.style.left = 'env(safe-area-inset-left, 0px)';
el.style.right = 'env(safe-area-inset-right, 0px)';
el.style.bottom = 'env(safe-area-inset-bottom, 0px)';
el.style.visibility = 'hidden';
el.style.pointerEvents = 'none';
document.body.appendChild(el);

var computed = getComputedStyle(el);
root.style.setProperty('–sat', computed.top    || '0px');
root.style.setProperty('–sar', computed.right  || '0px');
root.style.setProperty('–sab', computed.bottom || '0px');
root.style.setProperty('–sal', computed.left   || '0px');

document.body.removeChild(el);
}

/* ============================================================
ヘッダー生成（createHeader）
============================================================ */
function createHeader(opts) {
var options      = opts || {};
var showBack     = options.showBack     !== false;
var showSound    = options.showSound    !== false;
var showSettings = options.showSettings !== false;
var onSettings   = options.onSettings   || null;

if (document.querySelector('.app-header')) return;

var soundIcon = isSoundOn() ? '🔔' : '🔕';

var backBtn = showBack
? '<button class="header-btn" onclick="goBack()" aria-label="戻る">＜</button>'
: '<div class="header-btn" style="visibility:hidden"></div>';

var soundBtn = showSound
? '<button class="header-btn" id="ru-soundBtn" onclick="toggleSound()" aria-label="サウンド">' + soundIcon + '</button>'
: '';

var settingsBtn = showSettings
? '<button class="header-btn" id="ru-settingsBtn" aria-label="設定">⚙️</button>'
: '';

var header = document.createElement('header');
header.className = 'app-header';
header.innerHTML =
backBtn +
'<div class="header-right">' +
soundBtn +
settingsBtn +
'</div>';

document.body.insertBefore(header, document.body.firstChild);
document.body.classList.add('has-header');

if (showSettings && onSettings) {
var btn = document.getElementById('ru-settingsBtn');
if (btn) {
btn.addEventListener('click', function() {
onSettings();
});
}
}
}

/* ============================================================
戻るボタン処理（goBack）
============================================================ */
function goBack() {
location.replace('/');
}

/* ============================================================
サウンド切替（toggleSound）
============================================================ */
function toggleSound() {
var next = !isSoundOn();
setSoundOn(next);
var btn = document.getElementById('ru-soundBtn');
if (btn) btn.textContent = next ? '🔔' : '🔕';
}
window.addEventListener('orientationchange', function() {
  var root = document.documentElement;

  root.style.setProperty('--sat', '59px');
  root.style.setProperty('--sar', '59px');
  root.style.setProperty('--sab', '34px');
  root.style.setProperty('--sal', '59px');

  setTimeout(function() {
    root.style.removeProperty('--sat');
    root.style.removeProperty('--sar');
    root.style.removeProperty('--sab');
    root.style.removeProperty('--sal');
    window.dispatchEvent(new Event('resize'));
  }, 350);
});

/* ============================================================
向き変更時のレイアウト・タッチ座標ズレ対策

【ハイブリッド方式】

1. 回転開始直後: 固定値59px(ダイナミックアイランド基準)を先行適用
   → タッチ座標とレイアウトを同タイミングでシフトさせる
1. 350ms後: syncSafeAreaVars()で実際のenv()値に正確に戻す
   ============================================================ */
   window.addEventListener('orientationchange', function() {
   var root = document.documentElement;

/* Step1: 回転開始直後に固定値を先行適用 */
root.style.setProperty('–sat', '59px');
root.style.setProperty('–sar', '59px');
root.style.setProperty('–sab', '34px');
root.style.setProperty('–sal', '59px');

/* Step2: 回転完了後に実際の値で上書き */
setTimeout(function() {
syncSafeAreaVars();
window.dispatchEvent(new Event('resize'));
}, 350);
});

/* ============================================================
初期化時にsafe-area変数を同期
============================================================ */
window.addEventListener('DOMContentLoaded', function() {
syncSafeAreaVars();
});
