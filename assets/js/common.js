function createHeader() {
  const header = document.createElement("div");
  header.className = "app-header";

  header.innerHTML = `
    <div class="header-btn" onclick="goBack()">◀️</div>

    <div class="header-right">
      <div class="header-btn" onclick="toggleSound()">🔔</div>
      <div class="header-btn" onclick="goSettings()">⚙️</div>
    </div>
  `;

  document.body.prepend(header);
  document.body.classList.add("has-header");
}

/* ===== 動作 ===== */

function goBack() {
  history.back();
}

let soundOn = true;
function toggleSound() {
  soundOn = !soundOn;
  alert(soundOn ? "🔔 ON" : "🔕 OFF");
}

function goSettings() {
  location.href = "/settings/";
}

/* 初期化 */
document.addEventListener("DOMContentLoaded", createHeader);// RACK UP common scripts
