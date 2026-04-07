/* ============================================================
RACK UP — common.js
ナベクリエイト / playrackup.github.io

【役割】
全ページ共通のJavaScript処理を一元管理する。

- ヘッダーの生成（戻る・サウンド・設定ボタン）
- サウンドON/OFF状態の管理
- 向き変更時のレイアウト崩れ防止

【対応環境】

- iPhone  最新Safari   ← フル最適化
- iPad Air1 iOS12/Safari12 ← 最低限動く・崩れない

【構文方針】
iOS12(Safari12)のES6部分対応リスクを避けるため
var / function宣言 / 従来のfor文 で統一する。
const・let・アロー関数は使わない。
============================================================ */

/* ============================================================
サウンド状態管理
localStorageに "ru_sound": "on"/"off" で保存する。
デフォルトはON（"off"が保存されていない限りON扱い）。
============================================================ */
function isSoundOn() {
return localStorage.getItem('ru_sound') !== 'off';
}

function setSoundOn(val) {
localStorage.setItem('ru_sound', val ? 'on' : 'off');
}

/* ============================================================
ヘッダー生成（createHeader）
【使い方】各ページのscriptの末尾で呼び出す。

createHeader({
showBack:     true,
showSound:    true,
showSettings: true,
onSettings:   function() { openSettings(); }
});
============================================================ */
function createHeader(opts) {
var options      = opts || {};
var showBack     = options.showBack     !== false;
var showSound    = options.showSound    !== false;
var showSettings = options.showSettings !== false;
var onSettings   = options.onSettings   || null;

/* 重複挿入ガード */
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
if (history.length > 1) {
history.back();
} else {
location.href = '/';
}
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

/* ============================================================
向き変更時のレイアウト崩れ対策（orientationchange）
============================================================ */
window.addEventListener('orientationchange', function() {
document.body.style.display = 'none';
setTimeout(function() {
document.body.style.display = '';
}, 50);
});