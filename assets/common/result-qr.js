/* ============================================================
RACK UP — result-qr.js
対戦結果QRコード生成・表示 共通ライブラリ
ナベクリエイト / playrackup.github.io

使い方：
showResultQR({
mode:    "score",
players: [
{
n:  "FlowCue22",
s:  5,
w:  3,
r:  5,
wn: true,
h:  0,
bs: 120,
ba: 98,
op: [
{ i:"ShotNeo11", md:"score", w:2, l:1 }
]
}
],
games:        3,
satisfaction: ["fun","learn"]
});
============================================================ */

(function(global) {

const RESULT_BASE = "https://playrackup.github.io/result/";

function compress(data) {
  const compressed = {
    m:  data.mode,
    p:  (data.players || []).map(p => {
      const obj = {
        n:  p.n,
        s:  p.s,
        w:  p.w,
        r:  p.r,
        wn: p.wn ? 1 : 0
      };
      if (p.h)  obj.h  = p.h;
      if (p.bs) obj.bs = p.bs;
      if (p.ba) obj.ba = p.ba;
      if (p.op && p.op.length > 0) obj.op = p.op;
      return obj;
    }),
    gm: data.games        || null,
    sf: data.satisfaction || [],
    ts: Math.floor(Date.now() / 1000)
  };
  return LZString.compressToEncodedURIComponent(JSON.stringify(compressed));
}

function buildResultURL(data) {
  const d = compress(data);
  return `${RESULT_BASE}?d=${d}`;
}

function ensureModal() {
  if (document.getElementById("rqModal")) return;

  const style = document.createElement("style");
  style.textContent = `
    #rqOverlay {
      position: fixed; inset: 0; z-index: 30000;
      background: rgba(0,0,0,.88);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      display: none; align-items: center; justify-content: center;
      padding: 20px;
    }
    #rqOverlay.rq-show { display: flex; }

    #rqModal {
      width: 100%; max-width: 360px;
      background: #18191f;
      border-radius: 28px;
      padding: 26px 20px 20px;
      border: 1px solid rgba(255,255,255,.1);
      text-align: center;
      box-shadow: 0 24px 50px rgba(0,0,0,.5);
    }

    .rq-label {
      font-size: 11px; font-weight: 800;
      letter-spacing: .12em; text-transform: uppercase;
      color: #c8972a; margin-bottom: 6px;
    }

    .rq-title {
      font-size: 15px; font-weight: 900;
      color: #fff; margin-bottom: 16px;
    }

    .rq-qr-wrap {
      background: #fff; padding: 12px;
      border-radius: 20px; display: inline-block;
      margin-bottom: 14px;
    }

    #rqQrImg { width: 200px; height: 200px; display: block; }

    .rq-note {
      font-size: 12px; color: rgba(255,255,255,.35);
      margin-bottom: 18px; line-height: 1.6;
    }

    .rq-btn-close {
      width: 100%; padding: 14px; border: none;
      border-radius: 16px;
      background: rgba(255,255,255,.07);
      color: rgba(255,255,255,.55);
      font-size: 15px; font-weight: 800; cursor: pointer;
      font-family: inherit;
    }
  `;
  document.head.appendChild(style);

  const overlay = document.createElement("div");
  overlay.id = "rqOverlay";
  overlay.innerHTML = `
    <div id="rqModal">
      <div class="rq-label">MATCH RESULT</div>
      <div class="rq-title" id="rqTitle"></div>
      <div class="rq-qr-wrap">
        <img id="rqQrImg" src="" alt="QR">
      </div>
      <div class="rq-note">全員QRを読んで記録しよう<br>スキップしてもOK</div>
      <button class="rq-btn-close" onclick="ResultQR.hide()">とじる</button>
    </div>
  `;
  overlay.addEventListener("click", function(e) {
    if (e.target === overlay) ResultQR.hide();
  });
  document.body.appendChild(overlay);
}

const ResultQR = {
  show: function(data) {
    ensureModal();
    const url = buildResultURL(data);
    const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&ecc=M&data=${encodeURIComponent(url)}`;
    document.getElementById("rqQrImg").src = qrSrc;
    const winner = (data.players || []).find(p => p.wn);
    document.getElementById("rqTitle").textContent =
      winner ? `🏆 ${winner.n} WIN!` : "MATCH RESULT";
    document.getElementById("rqOverlay").classList.add("rq-show");
  },

  hide: function() {
    const overlay = document.getElementById("rqOverlay");
    if (overlay) overlay.classList.remove("rq-show");
  },

  buildURL: function(data) {
    return buildResultURL(data);
  }
};

global.ResultQR = ResultQR;

})(window);