/* ============================================================
RACK UP — common.js
ナベクリエイト / playrackup.github.io
============================================================ */

/* ============================================================
サウンド状態（localStorage で永続化）
============================================================ */
function isSoundOn() {
return localStorage.getItem("ru_sound") !== "off";
}

function setSoundOn(val) {
localStorage.setItem("ru_sound", val ? "on" : "off");
}

/* ============================================================
ヘッダー生成
オプション：
showBack     : 戻るボタン表示（default: true）
showSound    : サウンドボタン表示（default: true）
showSettings : ⚙️ボタン表示（default: true）
onSettings   : ⚙️タップ時に実行する関数（各ページで定義）
============================================================ */
function createHeader({
showBack     = true,
showSound    = true,
showSettings = true,
onSettings   = null
} = {}) {

const soundIcon = () => isSoundOn() ? "🔔" : "🔕";

const header = document.createElement("header");
header.className = "app-header";

header.innerHTML = `${showBack ?`<button class="header-btn" onclick="goBack()" aria-label=<"戻る">＜</button>`:`<div class="header-btn" style="visibility:hidden"></div>`
}


<div class="header-right">
  ${showSound
    ? `<button class="header-btn" id="ru-soundBtn" onclick="toggleSound()" aria-label="サウンド">${soundIcon()}</button>`
    : ""
  }
  ${showSettings
    ? `<button class="header-btn" id="ru-settingsBtn" aria-label="設定">⚙️</button>`
    : ""
  }
</div>

`;

document.body.prepend(header);
document.body.classList.add("has-header");

/* ⚙️ボタンに各ページのハンドラをセット */
if (showSettings) {
const settingsBtn = document.getElementById("ru-settingsBtn");
if (settingsBtn) {
settingsBtn.addEventListener("click", () => {
if (typeof onSettings === "function") {
onSettings();
}
/* onSettings未指定の場合は何もしない（将来の共通設定ページ用に予約） */
});
}
}
}

/* ============================================================
戻るボタン
============================================================ */
function goBack() {
if (history.length > 1) {
history.back();
} else {
location.href = "/";
}
}

/* ============================================================
サウンド切替
============================================================ */
function toggleSound() {
const next = !isSoundOn();
setSoundOn(next);

const btn = document.getElementById("ru-soundBtn");
if (btn) btn.textContent = next ? "🔔" : "🔕";
}

/* ============================================================
初期化
※ 各ページで createHeader() を上書き呼び出ししない場合のデフォルト
============================================================ */

// RACK UP common scripts

