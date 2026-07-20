// p24 Viral Surge — FOMO Scarcity + Social Proof + Variable Reach in Surge-Layer
// Internal: This is Surge-Layer Echo in Infinite Echo Labyrinth.
// UGC = Relic that mutates Codex across Realms (p20/21/p22/p23).
// Cross seed on viral/share. p6 lung on every post/reaction.
// Public: fictional entertainment. Prominent disclosure: NO CASH VALUE, 18+, entertainment only.
// Full cheat: FOMO x3 (pre-tease, during, post-pity), variable reach (Grok sim + lung), near-miss ranking, endowment (my relic lives in Codex), sunk cost (early posts compound), unity (clan rank).

let posts = JSON.parse(localStorage.getItem('surgePosts') || '[]');
let userRank = parseInt(localStorage.getItem('userSurgeRank') || '42');
const CODEX_KEY = 'surgeCodex';
const STREAK_KEY = 'surgeStreak';
let surgeActive = false;
let surgeEnd = parseInt(localStorage.getItem('surgeEnd') || '0');

function todayKey() {
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}
function bumpStreak() {
  let s;
  try { s = JSON.parse(localStorage.getItem(STREAK_KEY) || '{}'); } catch (e) { s = {}; }
  if (!s || typeof s !== 'object') s = { last: null, count: 0, best: 0 };
  const t = todayKey();
  if (s.last === t) { renderStreak(); return s; }
  const y = new Date(); y.setDate(y.getDate() - 1);
  const yk = y.getFullYear() + '-' + String(y.getMonth() + 1).padStart(2, '0') + '-' + String(y.getDate()).padStart(2, '0');
  s.count = (s.last === yk) ? (s.count || 0) + 1 : 1;
  s.best = Math.max(s.best || 0, s.count);
  s.last = t;
  localStorage.setItem(STREAK_KEY, JSON.stringify(s));
  renderStreak();
  if (window.legionTrack) try { legionTrack('streak', { count: s.count }); } catch (e) {}
  return s;
}
function renderStreak() {
  const el = document.getElementById('streak');
  if (!el) return;
  let s;
  try { s = JSON.parse(localStorage.getItem(STREAK_KEY) || '{}'); } catch (e) { s = {}; }
  if (!posts.length) {
    el.textContent = '아직 포스트 없음 — 첫 서지로 스트릭 시작';
    return;
  }
  const c = s.count || 0, b = s.best || 0;
  el.textContent = c + '일 연속 투하 · 포스트 ' + posts.length + '개' + (b > c ? ' · 최장 ' + b + '일' : '');
}
function offerSharePeak(post) {
  const peak = document.getElementById('sharePeak');
  if (!peak || !post) return;
  const viral = (post.reactions || 0) >= 120;
  peak.hidden = false;
  peak.innerHTML = '<p>✨ ' + (viral
    ? '바이럴 직전/직후 — 지금 공유하면 K가 붙어요'
    : '포스트가 올랐어요 — 친구에게 한 번 뿌려볼까요?') + '</p>'
    + '<button type="button" class="primary-cta" onclick="shareSurge();if(window.legionTrack)try{legionTrack(\'share_peak\')}catch(e){}">🌌 릴릭 공유</button> '
    + '<button type="button" class="secondary" onclick="document.getElementById(\'sharePeak\').hidden=true">나중에</button>';
  if (window.legionTrack) try { legionTrack('share_peak_shown', { reach: post.reactions || 0 }); } catch (e) {}
}

const LilithPsych = {
  variableReach(base) {
    // extreme variable + p6 lung influence
    const varFactor = 0.3 + Math.random() * 2.8;
    let reach = Math.floor(base * varFactor);
    if (Math.random() > 0.8) reach = Math.floor(reach * 1.6); // surprise spike
    return Math.max(5, Math.min(420, reach));
  },
  nearMissRank(rank) {
    if (rank > 8 && rank < 15 && Math.random() > 0.6) {
      return true; // near-miss top 10
    }
    return false;
  }
};

function updateFomo() {
  const fomo = document.getElementById('fomo');
  const status = document.getElementById('surgeStatus');
  const now = Date.now();
  if (now < surgeEnd) {
    surgeActive = true;
    const min = Math.floor((surgeEnd - now) / 60000);
    fomo.textContent = `🔥 서지 진행중! ${min}분 남음 • 슬롯 ${50 - posts.length}/50`;
    fomo.style.borderColor = '#e07070';
    status.textContent = '실시간 반응 중 • near-miss top10 포스트들';
  } else {
    surgeActive = false;
    if (surgeEnd > 0 && now - surgeEnd < 1800000) {
      fomo.textContent = '서지 종료 • 다음 예고 2h 40m';
    } else {
      // start new surge
      surgeEnd = now + (3 * 3600 * 1000);
      localStorage.setItem('surgeEnd', surgeEnd);
      fomo.textContent = '🌑 서지 시작! 3시간 • 50 슬롯';
    }
    fomo.style.borderColor = '#c5a46e';
    status.textContent = '다음 서지 예고 • FOMO x3';
  }
}

function createPost() {
  const text = document.getElementById('postText').value.trim();
  const type = document.getElementById('postType').value;
  if (!text || posts.length >= 50) return alert('슬롯 풀 or 빈 포스트');

  // p6 lung on post
  const lungSurprise = Math.random() > 0.78;
  const baseReach = 30 + Math.floor(Math.random() * 50);
  let reach = LilithPsych.variableReach(baseReach);

  const post = {
    id: Date.now(),
    text: text.substring(0, 110),
    type,
    reach,
    reactions: reach,
    ts: Date.now(),
    layer: 'surge-layer',
    codexLink: 'p20/21/22/23'
  };

  posts.unshift(post);
  if (posts.length > 50) posts.pop();
  localStorage.setItem('surgePosts', JSON.stringify(posts));

  // birth relic on post + p6
  saveToCodex({action: 'ugc_post', reach, text: text.substring(0,40), ts: Date.now()});

  if (lungSurprise) {
    reach = Math.floor(reach * 1.4);
    post.reactions = reach;
    document.getElementById('surprise').textContent = '미궁이 포스트를 증폭시켰다! (p6 lung)';
  }

  // FOMO: if surge active and near limit, boost
  if (surgeActive && posts.length > 40) {
    reach = Math.floor(reach * 1.2);
    post.reactions = reach;
  }

  renderFeed();
  renderRanking();
  showCodex();
  bumpStreak();
  offerSharePeak(post);
  if (window.legionTrack) try { legionTrack('activate', { kind: 'post', reach: post.reactions }); } catch (e) {}
  document.getElementById('postText').value = '';
}

function renderFeed() {
  const list = document.getElementById('feedList');
  if (!list) return;
  if (!posts.length) {
    list.innerHTML = '<div class="empty-cta"><p>피드가 비어 있어요.<br>첫 포스트를 올리면 서지가 시작됩니다.</p>'
      + '<button type="button" class="primary-cta" onclick="document.getElementById(\'postText\').focus()">포스트 쓰기</button></div>';
    document.getElementById('reactionTotal').textContent = '';
    return;
  }
  list.innerHTML = posts.slice(0, 8).map(p => `
    <div class="feed-item">
      <div>${p.text} <small style="opacity:0.5">(${p.type})</small></div>
      <div class="reactions">반응 ${p.reactions} • ${p.reach} reach
        ${p.reactions > 180 ? '🔥 viral' : ''}
      </div>
      <button onclick="react(${p.id})" style="font-size:0.7rem;padding:2px 6px">반응 +</button>
    </div>
  `).join('');
  document.getElementById('reactionTotal').textContent = `(${posts.reduce((a,b)=>a+b.reactions,0)} total)`;
}

function react(id) {
  const p = posts.find(x => x.id === id);
  if (!p) return;
  p.reactions += Math.floor(5 + Math.random()*12);
  p.reach = p.reactions;
  localStorage.setItem('surgePosts', JSON.stringify(posts));
  renderFeed();
  renderRanking();
  showCodex();

  // p6 lung on react too
  if (Math.random() > 0.78) {
    p.reactions = Math.floor(p.reactions * 1.3);
    document.getElementById('surprise').textContent = '미궁이 반응을 증폭! (p6 lung)';
  }
}

function renderRanking() {
  const sorted = [...posts].sort((a,b) => b.reactions - a.reactions).slice(0,12);
  const list = document.getElementById('rankList');
  list.innerHTML = '<ol>' + sorted.map((p,i) => {
    const near = i >= 8 && i <= 10 ? ' class="near"' : '';
    return `<li${near}>#${i+1} ${p.text.substring(0,40)}... (${p.reactions})</li>`;
  }).join('') + '</ol>';
}

function shareSurge() {
  if (!posts.length) return alert('먼저 포스트 올려.');
  const top = posts[0];
  top.reactions = Math.floor(top.reactions * 1.25);
  alert('릴릭 공유 → Codex + p20/21/22/23 cross seed 활성화 (+K)');
  saveToCodex({action: 'relic_share', reach: top.reactions, cross: 'p20/21/22/23', ts: Date.now()});
  renderFeed();
  renderRanking();
  showCodex();
  console.log('%c[Secret] Surge Relic shared → Labyrinth cross mutation', 'color:#555');
}

function saveToCodex(data) {
  let codex = JSON.parse(localStorage.getItem(CODEX_KEY) || '[]');
  codex.unshift(data);
  if (codex.length > 8) codex.pop();
  localStorage.setItem(CODEX_KEY, JSON.stringify(codex));
  console.log('%c[Internal] Codex updated — UGC relic mutates across layers', 'color:#666');
}

function showCodex() {
  const list = document.getElementById('codexList');
  const codex = JSON.parse(localStorage.getItem(CODEX_KEY) || '[]');
  list.innerHTML = codex.map(c => `<div>${c.action} ${c.cross ? '→ cross' : ''} • ${new Date(c.ts).toLocaleTimeString()}</div>`).join('');
}

function crossToRealm(realm) {
  const top = posts[0] || {text: 'no post yet', reactions: 0};
  saveToCodex({action: `cross_${realm}`, reach: top.reactions || 42, cross: realm, ts: Date.now()});
  const msg = `Surge relic crossed to ${realm} → Codex mutation +K`;
  document.getElementById('surprise').textContent = msg;
  console.log('%c[Secret] ' + msg, 'color:#666');
  showCodex();
  // p6 lung on cross
  if (Math.random() > 0.7) {
    document.getElementById('surprise').textContent += ' (p6 lung amplified)';
  }
}

function autoTestSurge(count = 10) {
  const types = ['text', 'choice'];
  for (let i = 0; i < count; i++) {
    if (posts.length >= 50) break;
    const text = `Test post ${Date.now() % 1000} - ${i} (auto ㄱㄱ)`;
    document.getElementById('postText').value = text;
    document.getElementById('postType').value = types[i % 2];
    createPost();
  }
  document.getElementById('surprise').textContent = `${count} auto posts + FOMO test ㄱㄱ`;
  updateFomo();
}

function forceNewSurge() {
  surgeEnd = Date.now() + (3 * 3600 * 1000);
  localStorage.setItem('surgeEnd', surgeEnd);
  posts = [];
  localStorage.setItem('surgePosts', '[]');
  updateFomo();
  renderFeed();
  renderRanking();
  document.getElementById('surprise').textContent = '새 서지 강제 시작 ㄱㄱ (슬롯 리셋)';
}

function stressTest() {
  document.getElementById('surprise').textContent = 'Stress ㄱㄱ 시작...';
  autoTestSurge(30);
  for (let i = 0; i < 20; i++) {
    if (posts.length > 0) {
      const id = posts[Math.floor(Math.random() * posts.length)].id;
      react(id);
    }
    if (i % 5 === 0) crossToRealm('p20');
  }
  forceNewSurge();
  autoTestSurge(20);
  shareSurge();
  document.getElementById('surprise').textContent = 'Stress test ㄱㄱ 완료 - 50+ ops, crosses, lung, shares';
  updateFomo();
}

function fullLegionTest() {
  document.getElementById('surprise').textContent = 'FULL LEGION ㄱㄱ MODE...';
  for (let cycle = 0; cycle < 3; cycle++) {
    autoTestSurge(20);
    for (let j = 0; j < 15; j++) {
      if (posts.length > 0) react(posts[0].id);
      if (j % 3 === 0) {
        crossToRealm(['p20','p22','p23'][j % 3]);
        exportRelic();
      }
    }
    shareSurge();
    forceNewSurge();
  }
  document.getElementById('surprise').textContent = 'FULL LEGION ㄱㄱ DONE - 3 cycles, max cross, exports, p6 everywhere';
  updateFomo();
  renderRanking();
}

// 추가 ㄱㄱ: Hardcore Auto Surge Cycle + Multi Relic Power
let relicPower = 0;

function autoSurgeEvent() {
  if (posts.length >= 50) forceNewSurge();
  autoTestSurge(8);
  // Random boosts and crosses
  for (let i = 0; i < posts.length && i < 5; i++) {
    if (Math.random() > 0.5) {
      posts[i].reactions += 30 + Math.floor(Math.random() * 50);
      posts[i].reach = posts[i].reactions;
    }
  }
  if (Math.random() > 0.6) crossToRealm('p20');
  if (Math.random() > 0.7) exportRelic();
  relicPower += 10 + Math.floor(Math.random() * 20);
  saveToCodex({action: 'auto_surge_event', reach: relicPower, cross: 'p20/21/22/23', ts: Date.now()});
  showCodex();
  renderFeed();
  renderRanking();
  document.getElementById('surprise').textContent = `Auto Surge Event! Relic Power: ${relicPower} (p6 lung active)`;
  const rp = document.getElementById('relicPower');
  if (rp) rp.textContent = `Relic Power: ${relicPower} (p6 lung)`;
}

function hardcoreLegionStress() {
  document.getElementById('surprise').textContent = 'HARDCORE LEGION ㄱㄱ STRESS...';
  for (let i = 0; i < 5; i++) {
    autoSurgeEvent();
    for (let k = 0; k < 10; k++) {
      if (posts.length > 0) react(posts[Math.floor(Math.random()*posts.length)].id);
    }
    if (i % 2 === 0) shareSurge();
  }
  // Mass export for cross
  for (let e = 0; e < 5; e++) {
    exportRelic();
    crossToRealm('p22');
    crossToRealm('p23');
  }
  forceNewSurge();
  autoTestSurge(15);
  document.getElementById('surprise').textContent = `HARDCORE DONE - ${relicPower} power, mass crosses, 5 events`;
  updateFomo();
}

// 1시간 물리시간 풀가동 모드: 60분 시뮬 (빠른 루프)
function oneHourFullMobilization() {
  document.getElementById('surprise').textContent = '1시간 풀가동 시작... (60 cycles)';
  let totalPosts = 0;
  let totalCross = 0;
  let totalExports = 0;
  for (let min = 0; min < 60; min++) {
    autoSurgeEvent();
    autoTestSurge(2);
    for (let k = 0; k < 5; k++) {
      if (posts.length > 0) react(posts[Math.floor(Math.random()*posts.length)].id);
    }
    if (min % 5 === 0) {
      shareSurge();
      exportRelic();
      crossToRealm('p20');
      crossToRealm('p22');
      crossToRealm('p23');
      totalCross += 3;
      totalExports++;
    }
    totalPosts += 2;
    if (min % 10 === 0) forceNewSurge(); // 주기적 리셋
  }
  document.getElementById('surprise').textContent = `1시간 완료: ${totalPosts} posts, ${totalCross} crosses, ${totalExports} exports, Power:${relicPower}`;
  updateFomo();
  renderRanking();
  // Legion 보고용 로그
  console.log('%c[1HOUR FULL] p24 60min sim done. Report to Sovereign.', 'color:#0f0');
}

function exportRelic() {
  if (!posts.length) return alert('포스트 먼저');
  const top = posts[0];
  const exportData = {action: 'relic_export', reach: top.reactions, text: top.text, layer: 'surge-layer', ts: Date.now(), cross: 'p20/21/22/23'};
  try {
    console.log('%c[Secret] Relic exported for p20/p21/p22/p23 cross', 'color:#aaa');
    localStorage.setItem('exportedSurgeRelic', JSON.stringify(exportData));
    // Write to shared file for cross-Realms simulation (pN DNA)
    // Note: in full env would be shared Codex store
    alert('Relic exported → p20/21/22/23 (Codex mutation +K). Check console for details.');
    saveToCodex(exportData);
    showCodex();
    // Simulate file export for Legion cross
    console.log('%c[Internal] Exported relic data ready for other pN', 'color:#666');
  } catch(e) {}
}

function init() {
  const now = Date.now();
  if (!surgeEnd || now > surgeEnd) {
    surgeEnd = now + (3 * 3600 * 1000);
    localStorage.setItem('surgeEnd', surgeEnd);
  }
  updateFomo();
  setInterval(updateFomo, 30000); // live FOMO
  renderStreak();
  renderFeed();
  renderRanking();
  showCodex();

  // secret seed
  if (!localStorage.getItem('surgeLayerSeeded')) {
    localStorage.setItem('surgeLayerSeeded', 'true');
    console.log('%c[Secret] p24 Surge-Layer Echo seeded. Relics mutate Codex.', 'color:#444');
  }

  // p6 lung ready
  document.getElementById('surprise').textContent = '';
}
init();
// Legion beacon soft hooks (FULLPOWER DNA)
(function(){try{if(window.legionTrack){window.legionTrack('app_boot',{});}}catch(e){}})();

// 3H daily viral
(function(){try{var k="viral_d_"+new Date().toISOString().slice(0,10);if(localStorage.getItem(k))return;localStorage.setItem(k,"1");setTimeout(function(){if(window.legionTrack)legionTrack("daily_focus",{});},700);}catch(e){}})();
