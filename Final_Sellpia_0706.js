(async function FinalSellpia0706(){
  const BASE_URL = 'https://raw.githubusercontent.com/kimhyein0214-dot/FULL_System/main/';
  const VERSION = '20260706-memo-safe-0706a';
  const isOrderSearch = /\/order_search\.html/i.test(location.pathname);
  const isSellpia = /(^|\.)sellpia\.com$/i.test(location.hostname) || /(^|\.)curiouswiz\.sellpia\.com$/i.test(location.hostname);

  if (!isSellpia) {
    alert('셀피아 페이지에서 실행해주세요.');
    return;
  }

  async function loadText(path) {
    const res = await fetch(BASE_URL + path + '?v=' + VERSION, { cache: 'no-store' });
    if (!res.ok) throw new Error(path + ' 로드 실패: ' + res.status);
    return await res.text();
  }

  function extractMemoUpdater(html) {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const source = doc.getElementById('bookmarklet-source');
    if (!source) throw new Error('메모 업데이터 소스를 찾지 못했습니다.');
    return source.textContent.trim();
  }

  function extractScraper(html) {
    const match = html.match(/const\s+SRC\s*=\s*("(?:(?:\\.)|[^"\\])*")\s*;/);
    if (!match) throw new Error('스크래퍼 소스를 찾지 못했습니다.');
    return Function('return ' + match[1])();
  }

  try {
    if (isOrderSearch) {
      const html = await loadText('sellpia_memo_updater_0706_order_search.html');
      (0, eval)(extractMemoUpdater(html));
      return;
    }
    const html = await loadText('sellpia_bookmarklet_0519_v1.html');
    (0, eval)(extractScraper(html));
  } catch (err) {
    console.error('[Final Sellpia 0706]', err);
    alert('Final Sellpia 0706 실행 오류: ' + (err && err.message ? err.message : err));
  }
})();
