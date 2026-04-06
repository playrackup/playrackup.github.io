/* ============================================================
RACK UP — common.js
ナベクリエイト / playrackup.github.io

【役割】
全ページ共通のJavaScript処理を一元管理する。

- ヘッダーの生成（戻る・サウンド・設定ボタン）
- サウンドON/OFF状態の管理
- bfcacheによるレイアウト崩れの防止

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
localStorageに “ru_sound”: “on”/“off” で保存する。
デフォルトはON（“off”が保存されていない限りON扱い）。

【使い方（各ページのJS）】
if (isSoundOn()) { /* 音を鳴らす処理 */ }
============================================================ */
function isSoundOn() {
/* “off” が明示的に保存されている場合のみfalse */
return localStorage.getItem(‘ru_sound’) !== ‘off’;
}

function setSoundOn(val) {
localStorage.setItem(‘ru_sound’, val ? ‘on’ : ‘off’);
}

/* ============================================================
ヘッダー生成（createHeader）
【使い方】各ページのscriptの末尾で呼び出す。
body.prepend() より insertBefore を使う（iOS12互換）。

呼び出し例:
createHeader({
showBack:     true,
showSound:    true,
showSettings: true,
onSettings:   function() { openSettings(); }
});

生成されるDOM構造:
<header class="app-header">
<button class="header-btn">＜</button>  ← 戻るボタン
<div class="header-right">
<button id="ru-soundBtn">🔔</button>  ← サウンド
<button id="ru-settingsBtn">⚙️</button> ← 設定
</div>
</header>

オプション:
showBack     {boolean} 戻るボタン表示（default: true）
showSound    {boolean} サウンドボタン表示（default: true）
showSettings {boolean} 設定ボタン表示（default: true）
onSettings   {function} 設定ボタンタップ時の処理
============================================================ */
function createHeader(opts) {
var options      = opts || {};
var showBack     = options.showBack     !== false;
var showSound    = options.showSound    !== false;
var showSettings = options.showSettings !== false;
var onSettings   = options.onSettings   || null;

/* ── 重複挿入ガード ──
bfcacheからの復元時やリロード時に
ヘッダーが二重に挿入されるのを防ぐ。 */
if (document.querySelector(’.app-header’)) return;

var soundIcon = isSoundOn() ? ‘🔔’ : ‘🔕’;

/* 戻るボタン。showBackがfalseの場合は
右側ボタンとバランスを取るためのスペーサーを入れる。 */
var backBtn = showBack
? ‘<button class="header-btn" onclick="goBack()" aria-label="戻る">＜</button>’
: ‘<div class="header-btn" style="visibility:hidden"></div>’;

/* サウンドボタン。テキストコンテンツが絵文字なので
toggleSound()で切り替えたときにtextContentを更新する。 */
var soundBtn = showSound
? ‘<button class="header-btn" id="ru-soundBtn" onclick="toggleSound()" aria-label="サウンド">’ + soundIcon + ‘</button>’
: ‘’;

/* 設定ボタン。クリック処理はcreateHeader内でaddEventListenerで付ける。
各ページのopenSettings()などをonSettingsに渡す。              */
var settingsBtn = showSettings
? ‘<button class="header-btn" id="ru-settingsBtn" aria-label="設定">⚙️</button>’
: ‘’;

/* ヘッダーDOM生成 */
var header = document.createElement(‘header’);
header.className = ‘app-header’;
header.innerHTML =
backBtn +
‘<div class="header-right">’ +
soundBtn +
settingsBtn +
‘</div>’;

/* body先頭に挿入（insertBefore はiOS12でも確実に動く） */
document.body.insertBefore(header, document.body.firstChild);

/* .has-header を bodyに付与することで
common.cssの .has-header main のpaddingが効く。 */
document.body.classList.add(‘has-header’);

/* 設定ボタンのイベント登録。
onSettingsが渡されていない場合は何もしない（将来拡張用）。 */
if (showSettings && onSettings) {
var btn = document.getElementById(‘ru-settingsBtn’);
if (btn) {
btn.addEventListener(‘click’, function() {
onSettings();
});
}
}
}

/* ============================================================
戻るボタン処理（goBack）
history があれば1つ前のページへ。
なければルートへ遷移（ブックマークから直接開いた場合など）。
============================================================ */
function goBack() {
if (history.length > 1) {
history.back();
} else {
location.href = ‘/’;
}
}

/* ============================================================
サウンド切替（toggleSound）
ヘッダーのサウンドボタンをタップした時に呼ばれる。
状態をlocalStorageに保存し、ボタンの絵文字も更新する。
============================================================ */
function toggleSound() {
var next = !isSoundOn();
setSoundOn(next);
/* ボタンのアイコンをON/OFFで切り替え */
var btn = document.getElementById(‘ru-soundBtn’);
if (btn) btn.textContent = next ? ‘🔔’ : ‘🔕’;
}

/* ============================================================
bfcache対策（pageshow イベント）
【問題】
iOS Safariは「戻る」ボタンでページを復元する際、
bfcache（Back-Forward Cache）を使うことがある。
このとき onload / DOMContentLoaded は再実行されず、
向き変更後のレイアウトが崩れた状態のままになることがある。

【解決策】
pageshow イベントの event.persisted が true の場合が
bfcacheからの復元。この時だけリロードする。
※ onunload のフックはiOS Safariでは効かないため使わない。

参考: https://qiita.com/kyaido/items/5cf9482146b945a4bf67

【注意】
リロードはlocalStorageのデータを消さないため
スコアや設定は維持される。
============================================================ */
window.onpageshow = function(e) {
if (e && e.persisted) {
window.location.reload();
}
};