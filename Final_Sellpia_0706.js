(async function FinalSellpia0706(){
  const BASE_URL = 'https://raw.githubusercontent.com/kimhyein0214-dot/FULL_System/main/';
  const VERSION = '20260707-scraper-workflow-cleanup1';
  const isOrderSearch = /\/order_search\.html/i.test(location.pathname);
  const isStockmatch = /\/order_stockmatch\.html/i.test(location.pathname);
  const isSellpia = /(^|\.)sellpia\.com$/i.test(location.hostname) || /(^|\.)curiouswiz\.sellpia\.com$/i.test(location.hostname);

  if (!isSellpia) {
    alert('Run this bookmarklet on a Sellpia page.');
    return;
  }

  async function loadText(path) {
    const res = await fetch(BASE_URL + path + '?v=' + VERSION, { cache: 'no-store' });
    if (!res.ok) throw new Error(path + ' load failed: ' + res.status);
    return await res.text();
  }

  function extractMemoUpdater(html) {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const source = doc.getElementById('bookmarklet-source');
    if (!source) throw new Error('Memo updater source not found.');
    return source.textContent.trim();
  }

  function extractSrcConst(html) {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const source = doc.getElementById('bookmarklet-source');
    if (source) return source.textContent.trim();
    const quoted = html.match(/const\s+SRC\s*=\s*("(?:(?:\\.)|[^"\\])*")\s*;/);
    if (quoted) return Function('return ' + quoted[1])();
    const templ = html.match(/const\s+SRC\s*=\s*`([\s\S]*?)`\s*;/);
    if (templ) return templ[1];
    throw new Error('SRC source not found.');
  }

  function removeLauncher() {
    const old = document.getElementById('final-sellpia-launcher');
    if (old) old.remove();
  }

  function showStockmatchLauncher() {
    removeLauncher();
    const overlay = document.createElement('div');
    overlay.id = 'final-sellpia-launcher';
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.72);z-index:999999;display:flex;align-items:center;justify-content:center;font-family:Arial,sans-serif;';
    overlay.innerHTML = [
      '<div style="width:420px;max-width:92vw;background:#111827;color:#fff;border:1px solid #334155;border-radius:14px;padding:24px;box-shadow:0 24px 80px rgba(0,0,0,.45)">',
      '<div style="font-size:18px;font-weight:800;margin-bottom:6px">Final Sellpia 0706</div>',
      '<div style="font-size:12px;color:#cbd5e1;margin-bottom:18px">Stockmatch page tools</div>',
      '<button id="final-scrape-btn" style="width:100%;padding:13px;margin-bottom:10px;border:0;border-radius:10px;background:#22c55e;color:#fff;font-weight:800;cursor:pointer">Stockmatch scrape</button>',
      '<button id="final-memo-btn" style="width:100%;padding:13px;margin-bottom:14px;border:0;border-radius:10px;background:#2563eb;color:#fff;font-weight:800;cursor:pointer">Memo updater</button>',
      '<button id="final-close-btn" style="width:100%;padding:10px;border:1px solid #475569;border-radius:10px;background:transparent;color:#cbd5e1;cursor:pointer">Close</button>',
      '</div>'
    ].join('');
    document.body.appendChild(overlay);
    document.getElementById('final-close-btn').onclick = removeLauncher;
    document.getElementById('final-scrape-btn').onclick = async function(){
      removeLauncher();
      const html = await loadText('sellpia_bookmarklet_0519_v1.html');
      (0, eval)(extractSrcConst(html));
    };
    document.getElementById('final-memo-btn').onclick = async function(){
      removeLauncher();
      const html = await loadText('sellpia_memo_updater_0707_stockmatch.html');
      (0, eval)(extractSrcConst(html));
    };
  }

  try {
    if (isOrderSearch) {
      const html = await loadText('sellpia_memo_updater_0706_order_search.html');
      (0, eval)(extractMemoUpdater(html));
      return;
    }
    if (isStockmatch) {
      showStockmatchLauncher();
      return;
    }
    const html = await loadText('sellpia_bookmarklet_0519_v1.html');
    (0, eval)(extractSrcConst(html));
  } catch (err) {
    console.error('[Final Sellpia 0706]', err);
    alert('Final Sellpia 0706 error: ' + (err && err.message ? err.message : err));
  }
})();
