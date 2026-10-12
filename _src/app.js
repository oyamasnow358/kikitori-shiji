  /* ============================================================
     ききとり しじ
     「あかい ボールを はこに いれて」を きいて、うごかす（ドラッグ／タッチ→タッチ）
     ============================================================ */
  const COLORS = { r: ['あか', 'あかい', '#FA5252', '#C92A2A'], b: ['あお', 'あおい', '#339AF0', '#1864AB'], y: ['きいろ', 'きいろい', '#FCC419', '#E67700'], g: ['みどり', 'みどりの', '#51CF66', '#2B8A3E'] };
  const KINDS = { ball: 'ボール', block: 'つみき', tri: 'さんかく', star: 'ほし', heart: 'ハート', car: 'くるま', cup: 'コップ', fish: 'さかな', flower: 'はな' };
  const CONTS = { box: ['📦', 'はこ', 'に いれて'], kago: ['🧺', 'かご', 'に いれて'], bag: ['🛍️', 'ふくろ', 'に いれて'], plate: ['🍽️', 'おさら', 'に のせて'] };
  function itemSVG(k, c, z) {
    const C = COLORS[c] || ['', '', '#fff', '#333'], f = C[2], s = C[3];
    const body = {
      ball: '<circle cx="50" cy="52" r="38" fill="' + f + '" stroke="' + s + '" stroke-width="4"/><ellipse cx="36" cy="38" rx="10" ry="7" fill="#fff" opacity=".6"/>',
      block: '<rect x="16" y="18" width="68" height="68" rx="8" fill="' + f + '" stroke="' + s + '" stroke-width="4"/><rect x="26" y="28" width="22" height="10" rx="4" fill="#fff" opacity=".45"/>',
      tri: '<polygon points="50,12 90,86 10,86" fill="' + f + '" stroke="' + s + '" stroke-width="4" stroke-linejoin="round"/>',
      star: '<polygon points="50,8 61,38 93,38 67,57 77,89 50,70 23,89 33,57 7,38 39,38" fill="' + f + '" stroke="' + s + '" stroke-width="4" stroke-linejoin="round"/>',
      heart: '<path d="M50 88 C12 62 6 40 18 26 C30 12 46 18 50 32 C54 18 70 12 82 26 C94 40 88 62 50 88Z" fill="' + f + '" stroke="' + s + '" stroke-width="4" stroke-linejoin="round"/>',
      car: '<rect x="8" y="44" width="84" height="28" rx="10" fill="' + f + '" stroke="' + s + '" stroke-width="4"/><path d="M26 46 L36 24 H66 L78 46Z" fill="' + f + '" stroke="' + s + '" stroke-width="4" stroke-linejoin="round"/><path d="M38 30 H50 V44 H32Z M56 30 H64 L72 44 H56Z" fill="#E7F5FF"/><circle cx="28" cy="74" r="10" fill="#343A40"/><circle cx="72" cy="74" r="10" fill="#343A40"/>'
      , cup: '<path d="M22 22 H78 L70 88 H30Z" fill="' + f + '" stroke="' + s + '" stroke-width="4" stroke-linejoin="round"/><path d="M78 36 C96 36 96 64 74 66" fill="none" stroke="' + s + '" stroke-width="5"/><rect x="28" y="30" width="10" height="40" rx="4" fill="#fff" opacity=".4"/>',
      fish: '<path d="M10 50 C24 26 58 22 74 50 C58 78 24 74 10 50Z" fill="' + f + '" stroke="' + s + '" stroke-width="4"/><path d="M72 50 L94 32 L94 68Z" fill="' + f + '" stroke="' + s + '" stroke-width="4" stroke-linejoin="round"/><circle cx="30" cy="46" r="5" fill="#212529"/>',
      flower: '<g fill="' + f + '" stroke="' + s + '" stroke-width="3">' + [0, 72, 144, 216, 288].map(r => '<ellipse cx="50" cy="28" rx="13" ry="20" transform="rotate(' + r + ' 50 50)"/>').join('') + '</g><circle cx="50" cy="50" r="12" fill="#FFE066" stroke="#E67700" stroke-width="3"/>'
    }[k];
    return '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">' + (z === 's' ? '<g transform="translate(50 50) scale(.58) translate(-50 -50)">' + body + '</g>' : body) + '</svg>';
  }
  const LEVELS = [
    { n: 'えらぶ（1つ）', s: 'ものの なまえを きいて タッチ', ex: '「ほしを タッチ して」', c: '#40C057' },
    { n: 'えらぶ（いろ＋もの）', s: 'いろと なまえを きいて タッチ', ex: '「あかい ボールを タッチ して」', c: '#82C91E' },
    { n: 'うごかす', s: 'ものを いれものに いれる', ex: '「くるまを かごに いれて」', c: '#FAB005' },
    { n: 'うごかす（いろ＋もの）', s: '3つの ことばを きく', ex: '「あおい つみきを はこに いれて」', c: '#FD7E14' },
    { n: '2つ つづけて', s: 'じゅんばんに 2つ する', ex: '「あかい ほしを はこに いれて、それから…」', c: '#E64980' },
    { n: 'かずも', s: 'いくつ うごかすか きく', ex: '「きいろい ボールを 2こ おさらに のせて」', c: '#7048E8' },
    { n: 'おおきさも', s: 'おおきい・ちいさいを ききわける', ex: '「ちいさい あかい さかなを かごに いれて」', c: '#1098AD' },
    { n: '3つ つづけて', s: 'じゅんばんに 3つ する', ex: '「…、それから …、それから …」', c: '#C2255C' }
  ];
  const APP = {
    id: 'kikitori-shiji', title: 'ききとり しじ', ls: 'kikitori.v1', db: false, sw: true, color: '#1C7ED6',
    defaults: { qn: 5, hint: 'miss', showText: 'miss', how: 'both' },
    newProfile: (name, icon) => ({ id: 'p' + Math.random().toString(36).slice(2, 9), name, icon, best: {}, log: [] }),
    normProfile(p) { p.best = p.best && typeof p.best === 'object' ? p.best : {}; p.log = Array.isArray(p.log) ? p.log : []; },
    childScreens: ['play'], topScreens: ['home'],
    renderHome: () => renderHome(),
    profileNote: p => 'れんしゅう ' + p.log.length + 'かい',
    helpNote: 'ことばだけの しじを きいて、からだを うごかす れんしゅうです。はじめは「もの」だけ → 「いろ＋もの」→「ばしょ」→「2つ つづけて」→「かず」の じゅんに ききとる ことばが ふえます。まちがえた ときに えの ヒントや もじを だすか どうかは せっていで えらべます。「🔊 もういちど」を おした かいすうも きろく します（なんどでも きいて いい ことを つたえて ください）。ドラッグが むずかしい 子は、もの → いれもの の じゅんに タッチ でも うごかせます。'
  };
/*BASE_HERE*/

  /* ============================================================
     もんだいを つくる
       q = { lv, items:[{id,k,c}], conts:[key], acts:[{k,c|null,n,to|null}], text }
     ============================================================ */
  const cKeys = Object.keys(COLORS), kKeys = Object.keys(KINDS), contKeys = Object.keys(CONTS);
  function makeQ(lv) {
    const L = lv + 1, useColor = L === 2 || L >= 4, move = L >= 3, nAct = L === 5 ? 2 : L === 8 ? 3 : 1, cnt = L === 6, size = L === 7;
    const conts = move ? shuffle(contKeys).slice(0, L >= 5 ? 3 : 2) : [];
    const kk = L <= 4 ? kKeys.slice(0, 6) : kKeys;
    const acts = [];
    for (let i = 0; i < nAct; i++) {
      let a;
      for (let t = 0; t < 30; t++) { a = { k: pick(kk), c: useColor ? pick(cKeys) : null, n: cnt ? ri(2, 3) : 1, to: move ? pick(conts) : null, z: size ? pick(['b', 's']) : null }; if (!acts.some(x => x.k === a.k && x.c === a.c)) break; }
      acts.push(a);
    }
    // トレイ：こたえ ＋ まぎらわしい もの（おなじ いろ・おなじ もの）
    const items = [];
    const add = (k, c, z) => items.push({ id: uid(), k, c, z: size ? (z || pick(['b', 's'])) : null });
    acts.forEach(a => { for (let i = 0; i < a.n; i++) add(a.k, a.c || pick(cKeys), a.z); });
    // おおきさの レベルは「おなじ いろ・おなじ もの・ちがう おおきさ」を かならず まぜる
    if (size) acts.forEach(a => add(a.k, a.c, a.z === 'b' ? 's' : 'b'));
    const total = L <= 2 ? 6 : L === 8 ? 10 : 8;
    let guard = 0;
    while (items.length < total && guard++ < 200) {
      const a = pick(acts);
      const r = Math.random();
      let k, c;
      if (useColor && r < .35) { k = a.k; c = pick(cKeys.filter(x => x !== a.c)); }
      else if (useColor && r < .7) { k = pick(kk.filter(x => x !== a.k)); c = a.c; }
      else { k = pick(kk.filter(x => !acts.some(y => y.k === x))); c = pick(cKeys); }
      if (!useColor && acts.some(y => y.k === k)) continue;
      if (useColor && !size && acts.some(y => y.k === k && y.c === c)) continue;
      if (size && acts.some(y => y.k === k && y.c === c)) { add(k, c, acts.find(y => y.k === k && y.c === c).z === 'b' ? 's' : 'b'); continue; }
      add(k, c);
    }
    const one = a => (a.z ? (a.z === 'b' ? 'おおきい ' : 'ちいさい ') : '') + (a.c ? COLORS[a.c][1] + ' ' : '') + KINDS[a.k] + 'を ' + (a.n > 1 ? a.n + 'こ ' : '') + (a.to ? CONTS[a.to][1] + CONTS[a.to][2] : 'タッチ して');
    const text = acts.map(one).join('、それから ') + '。';
    return { lv, items: shuffle(items), conts, acts, text, done: acts.map(() => 0) };
  }
  const match = (it, a) => it.k === a.k && (!a.c || it.c === a.c) && (!a.z || it.z === a.z);

  /* ============================================================
     ホーム
     ============================================================ */
  function renderHome() {
    screen = 'home';
    const p = cur();
    setView('home', [
      h('h1', { class: 'title' }, '👂 ききとり しじ', h('small', null, 'よく きいて、そのとおりに うごかそう')),
      h('div', { class: 'lvls' }, LEVELS.map((l, i) => h('button', { type: 'button', style: '--lc:' + l.c, onclick: () => { if (tapOk()) { sfx.tap(); startGame(i); } } },
        p.best[i] ? h('span', { class: 'st' }, '⭐'.repeat(p.best[i])) : null, h('b', null, (i + 1) + '. ' + l.n), h('small', null, l.s), h('span', { class: 'ex' }, l.ex))))
    ]);
  }

  /* ============================================================
     ゲーム
     ============================================================ */
  let G = null;
  function startGame(lv) { G = { lv, i: 0, ok: 0, listens: 0, t0: Date.now(), res: [] }; keepAwake(); nextQ(); }
  function nextQ() {
    if (G.i >= Number(S().qn)) { endGame(); return; }
    G.q = makeQ(G.lv); G.miss = 0; G.sel = null; G.step = 0; G.moved = {};
    renderPlay(); after(400, sayQ);
  }
  function sayQ() { const b = $('.ear'); if (b) { b.classList.add('pulse'); } speak(G.q.text, { end: () => { const e = $('.ear'); if (e) e.classList.remove('pulse'); } }); }
  const showHint = () => S().hint === 'always' || (S().hint === 'miss' && G.miss > 0);
  const showText = () => S().showText === 'always' || (S().showText === 'miss' && G.miss > 0);
  function renderIns() {
    const q = G.q, box = $('.ins'); if (!box) return;
    box.innerHTML = '';
    box.append(h('button', { type: 'button', class: 'ear', 'aria-label': 'もういちど きく', onclick: () => { if (!tapOk(500)) return; G.listens++; sayQ(); } }, '🔊'),
      h('div', { style: 'flex:1;display:flex;flex-direction:column;gap:4px' },
        showText() ? h('div', { class: 'tx' }, q.text) : h('div', { class: 'tx hide' }, '🔊 を おすと なんかいでも きけるよ'),
        showHint() ? h('div', { class: 'hint' }, q.acts.map((a, i) => h('span', { class: 'hi' + (q.done[i] >= a.n ? ' done' : '') }, h('span', { html: itemSVG(a.k, a.c || 'none', a.z) }), a.n > 1 ? h('b', null, '×' + a.n) : null, a.to ? [h('span', null, '➡'), E(CONTS[a.to][0])] : E('👆')))) : null),
      h('span', { class: 'prog' }, (G.i + 1) + ' / ' + S().qn));
  }
  function renderPlay() {
    screen = 'play';
    const q = G.q;
    const conts = q.conts.length ? h('div', { class: 'conts' }, q.conts.map(c => h('div', { class: 'cont', 'data-c': c, onclick: () => contTap(c) }, h('span', { class: 'ce' }, CONTS[c][0]), h('b', null, CONTS[c][1]), h('div', { class: 'in' })))) : null;
    const tray = h('div', { class: 'tray', style: '--cols:' + (q.items.length <= 6 ? 3 : q.items.length <= 8 ? 4 : 5) }, q.items.map(it => {
      const b = h('button', { type: 'button', class: 'it', 'data-id': it.id, 'aria-label': (it.z ? (it.z === 'b' ? 'おおきい ' : 'ちいさい ') : '') + (it.c ? COLORS[it.c][1] + ' ' : '') + KINDS[it.k], html: itemSVG(it.k, it.c, it.z) });
      bindDrag(b, it); return b;
    }));
    setView('play' + (conts ? '' : ' nocont'), [h('div', { class: 'ins' }), conts, tray, h('div', { class: 'fbk' })]);
    renderIns();
  }
  // ドラッグ（ゆびを はなした ところの いれものへ）／タッチ → タッチ
  function bindDrag(b, it) {
    let st = null, ghost = null;
    b.addEventListener('pointerdown', e => {
      if (G.busy) return;
      e.preventDefault(); st = { x: e.clientX, y: e.clientY, moved: false };
      try { b.setPointerCapture(e.pointerId); } catch (er) { /* 無視 */ }
    });
    b.addEventListener('pointermove', e => {
      if (!st || !G.q.conts.length || S().how === 'tap') return;
      if (!st.moved && Math.hypot(e.clientX - st.x, e.clientY - st.y) > 10) { st.moved = true; ghost = h('div', { class: 'drag', html: itemSVG(it.k, it.c, it.z) }); document.body.append(ghost); b.style.opacity = '.3'; }
      if (ghost) { ghost.style.left = e.clientX + 'px'; ghost.style.top = e.clientY + 'px'; const c = contAt(e.clientX, e.clientY); document.querySelectorAll('.cont').forEach(x => x.classList.toggle('over', x === c)); }
    });
    const end = e => {
      if (!st) return;
      const moved = st.moved; st = null; b.style.opacity = '';
      if (ghost) { ghost.remove(); ghost = null; }
      document.querySelectorAll('.cont').forEach(x => x.classList.remove('over'));
      if (moved) { const c = contAt(e.clientX, e.clientY); if (c) tryMove(it, c.getAttribute('data-c')); return; }
      itemTap(it, b);
    };
    b.addEventListener('pointerup', end);
    b.addEventListener('pointercancel', () => { st = null; b.style.opacity = ''; if (ghost) { ghost.remove(); ghost = null; } });
  }
  function contAt(x, y) { return [...document.querySelectorAll('.cont')].find(c => { const r = c.getBoundingClientRect(); return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom; }) || null; }
  function itemTap(it, b) {
    if (G.busy || G.moved[it.id]) return;
    if (!G.q.conts.length) { tryPick(it, b); return; }
    if (S().how === 'drag') { toast('ゆびで いれものまで うごかしてね'); return; }
    G.sel = G.sel === it.id ? null : it.id; sfx.tap();
    document.querySelectorAll('.it').forEach(x => x.classList.toggle('sel', x.getAttribute('data-id') === G.sel));
    document.querySelectorAll('.cont').forEach(x => x.classList.toggle('sel', !!G.sel));
  }
  function contTap(c) { if (!G.sel || G.busy) return; const it = G.q.items.find(x => x.id === G.sel); G.sel = null; document.querySelectorAll('.it').forEach(x => x.classList.remove('sel')); document.querySelectorAll('.cont').forEach(x => x.classList.remove('sel')); tryMove(it, c); }
  // いまの しじ（2つ つづけて の ときは じゅんばん）
  const curAct = () => G.q.acts.findIndex((a, i) => G.q.done[i] < a.n);
  function wrong(el, msg) {
    G.miss++; sfx.ng(); if (el) { el.classList.remove('ng'); void el.offsetWidth; el.classList.add('ng'); }
    $('.fbk').textContent = msg; renderIns();
    if (G.miss === 1 || G.miss % 2 === 0) after(700, sayQ);
  }
  function tryPick(it, b) {
    const ai = curAct(), a = G.q.acts[ai];
    if (match(it, a)) { b.classList.add('ok'); G.q.done[ai]++; FX.small(b, { variant: 1 }); good(); }
    else wrong(b, 'ちがうよ。もういちど よく きいてね');
  }
  function tryMove(it, to) {
    if (!it || G.moved[it.id]) return;
    const ai = curAct(), a = G.q.acts[ai], el = $('.it[data-id="' + it.id + '"]'), cel = $('.cont[data-c="' + to + '"]');
    if (match(it, a) && a.to === to) {
      G.moved[it.id] = to; G.q.done[ai]++; sfx.step();
      if (el) el.classList.add('gone');
      if (cel) cel.querySelector('.in').append(h('span', { html: itemSVG(it.k, it.c, it.z) }));
      renderIns();
      if (curAct() < 0) { FX.small(cel, { variant: 1 }); good(); }
      else if (G.q.done[ai] >= a.n && ai < G.q.acts.length - 1) { $('.fbk').textContent = 'いいね！ つぎは？'; }
      return;
    }
    // どこが ちがう？
    const other = G.q.acts.findIndex((x, i) => i !== ai && G.q.done[i] < x.n && match(it, x) && x.to === to);
    const msg = other >= 0 ? 'じゅんばんが ちがうよ。さきに いわれた ほうから' : !match(it, a) ? (a.z && it.k === a.k && it.c === a.c ? 'おおきさを よく きいてね' : a.c && it.k === a.k ? 'いろを よく きいてね' : 'ものを よく きいてね') : 'いれものを よく きいてね';
    wrong(cel || el, msg); if (el) { el.classList.add('ng'); }
  }
  function good() {
    G.busy = true; sfx.ok(); praise(); G.res[G.i] = G.miss === 0; if (G.miss === 0) G.ok++;
    $('.fbk').textContent = G.miss ? 'できたね！' : 'いっかいで できた！';
    after(1500, () => { G.busy = false; G.i++; nextQ(); });
  }
  function endGame() {
    const p = cur(), n = Number(S().qn), star = G.ok >= n ? 3 : G.ok >= n * .6 ? 2 : 1;
    p.best[G.lv] = Math.max(p.best[G.lv] || 0, star);
    p.log.push({ t: Date.now(), lv: G.lv, ok: G.ok, n, listens: G.listens, sec: Math.round((Date.now() - G.t0) / 1000) });
    if (p.log.length > 1000) p.log.splice(0, p.log.length - 1000);
    persist();
    screen = 'end';
    setView('center', [h('div', { class: 'center' },
      h('div', { class: 'stars' }, [0, 1, 2].map(i => h('span', { class: i < star ? '' : 'off', style: 'animation-delay:' + (i * .2) + 's' }, '⭐'))),
      h('h1', { class: 'title' }, n + 'もん できた！', h('small', null, 'いっかいで できた ' + G.ok + 'もん・もういちど きいた ' + G.listens + 'かい')),
      h('div', { class: 'actions' },
        h('button', { type: 'button', class: 'big-btn go', onclick: () => { if (tapOk()) startGame(G.lv); } }, '🔁 もういちど'),
        G.lv < LEVELS.length - 1 && star >= 2 ? h('button', { type: 'button', class: 'big-btn blue', onclick: () => { if (tapOk()) startGame(G.lv + 1); } }, '⬆ つぎの レベル') : null,
        h('button', { type: 'button', class: 'big-btn white', onclick: () => { if (tapOk()) renderHome(); } }, '🏠 えらぶ')))]);
    sfx.clear(); if (star === 3) FX.big(); else FX.small(document.querySelector('.title'));
    speak('よく きけたね');
  }

  /* ============================================================
     プリント：ききとり ぬりえ（せんせいが しじを よむ）
     ============================================================ */
  const PF = '<div class="pf">© MieeL　ききとり しじ　www.mieel-support-school.com</div>';
  const HD = (t, s) => '<div class="phd"><h1>' + t + '</h1><small>' + (s || '') + '</small><div class="nm">なまえ ＿＿＿＿＿＿＿＿</div></div>';
  function buildPages(type, o) {
    o = o || {};
    const n = 16, cells = [];
    for (let i = 0; i < n; i++) cells.push({ k: kKeys[i % kKeys.length], c: null });
    const order = shuffle(cells.map((_, i) => i));
    const two = o.lv === '2', want = two ? 4 : 6, ins = [];
    let k = 0;
    while (ins.length < want && k < order.length) {
      const pickOne = () => { const i = order[k++]; const col = pick(cKeys); cells[i].c = col; return { i, col }; };
      if (two) { const a = pickOne(), b = pickOne(); ins.push([a, b]); } else ins.push([pickOne()]);
    }
    const say = x => (x.i + 1) + 'ばんの ' + KINDS[cells[x.i].k] + 'を ' + COLORS[x.col][0] + 'で ぬる';
    const grid = '<div class="pgrid">' + cells.map((c, i) => '<div class="pc"><span class="no">' + (i + 1) + '</span>' + itemSVG(c.k, o.ans === 'on' && c.c ? c.c : 'none') + '</div>').join('') + '</div>';
    const list = '<div class="pins"><b>👂 せんせいが よむ ことば（1つずつ よんで、ぬりおわってから つぎへ）</b>' + ins.map((g, j) => '<div>' + (j + 1) + '. ' + g.map(say).join('、それから ') + '。</div>').join('') + '</div>';
    return ['<div class="ppage">' + HD('👂 ききとり ぬりえ', 'いわれた いろで ぬろう') + grid + list + PF + '</div>'];
  }
  window.MieelPrintAPI = {
    version: 1,
    app: { id: 'kikitori-shiji', title: 'ききとり しじ', icon: '👂' },
    list() { return [{ id: 'nurie', name: 'ききとり ぬりえ', icon: '🖍️', params: [{ key: 'lv', label: 'しじ', opts: [['1', '1つずつ'], ['2', '2つ つづけて']], def: '1' }, { key: 'ans', label: 'こたえ', opts: [['off', 'なし'], ['on', 'あり（いろ つき）']], def: 'off' }] }]; },
    build(id, params) { return Promise.resolve({ pages: buildPages(id, params), css: document.querySelector('style').textContent }); }
  };

  /* ============================================================
     先生用せってい
     ============================================================ */
  APP.renderSettings = function (add, st, vp, pidSel) {
    add(h('h3', null, '👂 きかせかた'),
      srow('1かいの もんだい', seg(st.qn, [[5, '5もん'], [8, '8もん'], [10, '10もん']], v => setS('qn', Number(v)))),
      srow('もじ', seg(st.showText, [['never', 'みせない'], ['miss', 'まちがえたら'], ['always', 'いつも']], v => setS('showText', v)), 'はじめから みせると「よむ」れんしゅうに なります'),
      srow('えの ヒント', seg(st.hint, [['never', 'なし'], ['miss', 'まちがえたら'], ['always', 'いつも']], v => setS('hint', v))),
      srow('うごかしかた', seg(st.how, [['both', 'どちらでも'], ['drag', 'ドラッグ'], ['tap', 'タッチ→タッチ']], v => setS('how', v))),
      h('p', { class: 'note' }, 'せんせいが じぶんの こえで しじを だす ときは、下の「よみあげ」を オフに して、もじを「いつも」に すると しじが よめます。'));
    add(h('h3', null, '📊 きろく'), pidSel());
    const log = vp.log.slice().reverse().slice(0, 40);
    add(log.length ? h('table', { class: 'rec-table' }, h('tr', null, ['日時', 'レベル', 'いっかいで', 'もういちど きいた'].map(x => h('th', null, x))),
      log.map(r => { const d = new Date(r.t); return h('tr', null, h('td', null, (d.getMonth() + 1) + '/' + d.getDate() + ' ' + d.getHours() + ':' + String(d.getMinutes()).padStart(2, '0')), h('td', null, (r.lv + 1) + '. ' + LEVELS[r.lv].n), h('td', null, r.ok + ' / ' + r.n), h('td', null, r.listens + 'かい')); })) : h('p', { class: 'note' }, 'まだ きろくが ありません。'));
  };
  if (TEST) window.__kk = { store: () => store, makeQ, startGame, G: () => G, tryMove, tryPick: id => { const it = G.q.items.find(x => x.id === id); tryPick(it, $('.it[data-id="' + id + '"]')); } };
  startApp();
