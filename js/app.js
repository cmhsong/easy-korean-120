/* 쉬운 국어 학습지 — 화면·활동·편집·접근성 기능 */
(function () {
  'use strict';

  var UNITS = [
    { n: '낱말과 친해지기', e: '🔤' },
    { n: '문장을 바르게', e: '✏️' },
    { n: '마음을 나타내는 말', e: '💗' },
    { n: '중심 생각 찾기', e: '🔎' },
    { n: '이야기를 읽어요', e: '📖' },
    { n: '시를 느껴요', e: '🌷' },
    { n: '바르게 듣고 말해요', e: '🗣️' },
    { n: '내 생각을 말해요', e: '💡' },
    { n: '우리말 바로 알기', e: '🧩' },
    { n: '정보를 찾아요', e: '📰' },
    { n: '글을 써요', e: '📝' },
    { n: '말과 책, 그리고 생활', e: '📚' }
  ];
  var PER = 10;
  var BASE = window.LESSONS || [];
  var PRAISE = ['딩동댕! 참 잘했어요.', '맞았어요! 멋져요.', '정답이에요! 최고예요.', '잘했어요! 훌륭해요.'];
  var NUMS = ['①', '②', '③', '④', '⑤'];

  /* ── 저장소 ── */
  var LS = {
    get: function (k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { } }
  };
  var S = { fs: 1, zoom: 1, dwell: 0, press: false, guard: true, cursor: false, btn: 1, dark: false, auto: false, snd: true, pfs: 18 };
  var saved = LS.get('jk_set', {});
  for (var k0 in saved) if (k0 in S) S[k0] = saved[k0];
  var P = LS.get('jk_prog', {});   // 학습 기록 {차시번호: {s:별, t:문제 수}}
  var E = LS.get('jk_edit', {});   // 편집한 차시 {차시번호: 차시 내용}

  var stage = document.getElementById('stage');
  var modal = document.getElementById('modal');
  var ring = document.getElementById('ring');
  var pad = document.getElementById('pad');
  var view = 'home', L = null, curSpeak = '';

  function lesson(i) { return E[i] || BASE[i]; }
  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function $(id) { return document.getElementById(id); }
  function clear(el) { while (el.firstChild) el.removeChild(el.firstChild); }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function shuffle(a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  /* 원래 순서와 달라질 때까지 섞기 */
  function mix(a) {
    if (a.length < 2) return a.slice();
    for (var n = 0; n < 20; n++) { var b = shuffle(a); if (b.some(function (x, i) { return x !== a[i]; })) return b; }
    return a.slice().reverse();
  }
  function h(tag, attrs) {
    var el = document.createElement(tag), k, v, i, c;
    if (attrs) for (k in attrs) {
      v = attrs[k];
      if (v == null || v === false) continue;
      if (k === 'class') el.className = v;
      else if (k === 'text') el.textContent = v;
      else if (k.slice(0, 2) === 'on') el.addEventListener(k.slice(2), v);
      else el.setAttribute(k, v === true ? '' : v);
    }
    for (i = 2; i < arguments.length; i++) add(arguments[i]);
    function add(c) {
      if (c == null || c === false) return;
      if (Array.isArray(c)) return c.forEach(add);
      el.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    }
    return el;
  }
  function btn(cls, label, fn, attrs) {
    var a = { class: 'btn ' + (cls || ''), type: 'button', onclick: fn };
    if (attrs) for (var k in attrs) a[k] = attrs[k];
    return h('button', a, label);
  }
  function go(hash) { if (location.hash === '#' + hash) render(); else location.hash = hash; }

  /* ── 소리 ── */
  function speak(t) {
    try {
      speechSynthesis.cancel();
      if (!t) return;
      var u = new SpeechSynthesisUtterance(t);
      u.lang = 'ko-KR'; u.rate = 0.85;
      speechSynthesis.speak(u);
    } catch (e) { }
  }
  function hush() { try { speechSynthesis.cancel(); } catch (e) { } }
  var ac;
  function beep(ok) {
    if (!S.snd) return;
    try {
      ac = ac || new (window.AudioContext || window.webkitAudioContext)();
      var o = ac.createOscillator(), g = ac.createGain();
      o.connect(g); g.connect(ac.destination);
      o.frequency.value = ok ? 880 : 240; g.gain.value = 0.07;
      o.frequency.setValueAtTime(ok ? 1175 : 200, ac.currentTime + 0.12);
      o.start(); o.stop(ac.currentTime + 0.28);
    } catch (e) { }
  }

  /* ── 설정 적용 ── */
  function apply() {
    stage.style.setProperty('--fs', S.fs);
    stage.style.zoom = S.zoom;
    document.documentElement.style.setProperty('--bs', S.btn);
    document.body.classList.toggle('dark', !!S.dark);
    document.body.classList.toggle('bigcur', !!S.cursor);
    $('fsLabel').textContent = '글자 ' + Math.round(S.fs * 100) + '%';
    $('zoomLabel').textContent = '화면 ' + Math.round(S.zoom * 100) + '%';
    LS.set('jk_set', S);
    setTimeout(updatePad, 50);
  }
  function step(key, d, min, max) {
    S[key] = Math.min(max, Math.max(min, Math.round((S[key] + d) * 100) / 100));
    apply();
  }
  function updatePad() {
    var de = document.documentElement;
    pad.hidden = de.scrollHeight <= window.innerHeight + 8;
    document.body.classList.toggle('haspad', !pad.hidden);
  }

  /* ── 화면 전환 ── */
  function render() {
    hush(); cancelDwell();
    var p = location.hash.replace('#', '').split('/'), n = parseInt(p[1], 10);
    clear(stage); L = null; curSpeak = '';
    if (p[0] === 'u' && UNITS[n]) viewUnit(n);
    else if (p[0] === 'l' && BASE[n - 1]) { newLesson(n - 1); viewLesson(); }
    else if (p[0] === 'e' && BASE[n - 1]) viewEdit(n - 1);
    else viewHome();
    window.scrollTo(0, 0);
    updatePad();
  }

  function doneCount(u) {
    var c = 0;
    for (var i = u * PER; i < u * PER + PER; i++) if (P[i]) c++;
    return c;
  }

  function viewHome() {
    view = 'home';
    var total = BASE.length, did = Object.keys(P).filter(function (k) { return BASE[k]; }).length, next = 0;
    while (next < total && P[next]) next++;
    stage.appendChild(h('h1', { text: '📗 쉬운 국어 학습지' }));
    stage.appendChild(h('p', { class: 'sub', text: '모두 ' + total + '차시 · 끝낸 차시 ' + did + '개' }));
    if (next < total) {
      stage.appendChild(btn('pri wide', '▶ ' + (did ? '이어서 하기' : '시작하기') + ' : ' + (next + 1) + '차시 ' + lesson(next).t,
        function () { go('l/' + (next + 1)); }));
    }
    var grid = h('div', { class: 'grid' });
    UNITS.forEach(function (u, i) {
      if (!BASE[i * PER]) return;
      grid.appendChild(btn('unit c' + (i % 6), [
        h('span', { class: 'emo', text: u.e }),
        h('span', { class: 'no', text: (i + 1) + '단원 · ' + (i * PER + 1) + '~' + (i * PER + PER) + '차시' }),
        h('span', { class: 'nm', text: u.n }),
        h('span', { class: 'pg', text: '끝낸 차시 ' + doneCount(i) + ' / ' + PER })
      ], function () { go('u/' + i); }));
    });
    stage.appendChild(grid);
    curSpeak = '쉬운 국어 학습지. 공부할 단원을 눌러요.';
  }

  function viewUnit(u) {
    view = 'unit';
    stage.appendChild(h('div', { class: 'crumb' }, btn('sm', '◀ 단원 목록', function () { go(''); }),
      h('span', { class: 'where' }), btn('sm', '🖨 단원 인쇄', function () { openPrint(u * PER, true); })));
    stage.appendChild(h('h1', { text: UNITS[u].e + ' ' + (u + 1) + '단원. ' + UNITS[u].n }));
    var list = h('div', { class: 'lessons' });
    for (var i = u * PER; i < u * PER + PER && BASE[i]; i++) (function (i) {
      var p = P[i];
      list.appendChild(btn('lbtn' + (p ? ' done' : ''), [
        h('span', { class: 'n', text: (i + 1) + '차시' }),
        h('span', { class: 't', text: lesson(i).t + (E[i] ? ' ✏️' : '') }),
        h('span', { class: 'st', text: p ? '✅ ⭐' + p.s + '/' + p.t : '' })
      ], function () { go('l/' + (i + 1)); }));
    })(i);
    stage.appendChild(list);
    curSpeak = (u + 1) + '단원. ' + UNITS[u].n + '. 공부할 차시를 눌러요.';
  }

  /* ── 차시 학습 ── */
  function newLesson(i) { L = { i: i, d: lesson(i), step: 0, stars: 0 }; }

  function qSpeech(q) {
    if (q[0] === 'c') return q[1] + '. ' + q[2].join(', ');
    if (q[0] === 'o') return q[1] + '. 맞으면 동그라미, 틀리면 가위표를 눌러요.';
    if (q[0] === 's') return q[2] || '낱말을 차례대로 눌러 문장을 만들어요.';
    return q[2] || '서로 어울리는 것끼리 눌러요.';
  }

  function viewLesson() {
    view = 'lesson';
    var d = L.d, n = L.i + 1, u = Math.floor(L.i / PER), total = d.q.length, i;
    hush(); cancelDwell(); clear(stage);
    stage.appendChild(h('div', { class: 'crumb' },
      btn('sm', '◀ 차시 목록', function () { go('u/' + u); }),
      h('span', { class: 'where', text: (u + 1) + '단원 · ' + n + '차시' }),
      btn('sm', '✏️ 편집', function () { go('e/' + n); })));
    stage.appendChild(h('h1', { text: d.t }));
    var dots = h('div', { class: 'dots', 'aria-hidden': 'true' });
    for (i = 0; i <= total; i++) dots.appendChild(h('span', { class: 'dot' + (i < L.step ? ' did' : i === L.step ? ' cur' : '') }));
    stage.appendChild(dots);

    if (L.step === 0) {
      if (d.g) stage.appendChild(h('p', { class: 'goal', text: '🎯 ' + d.g }));
      stage.appendChild(h('div', { class: 'passage', text: d.p }));
      curSpeak = d.t + '. ' + d.p;
      stage.appendChild(h('div', { class: 'row' },
        btn('', '🔊 글 듣기', function () { speak(d.p); }),
        btn('', '🖨 인쇄', function () { openPrint(L.i, false); }),
        btn('pri', total ? '문제 풀기 ▶' : '끝내기 ▶', function () { L.step = 1; viewLesson(); window.scrollTo(0, 0); })));
    } else if (L.step <= total) {
      viewQuestion(d, d.q[L.step - 1], total);
    } else {
      viewFinish(d, total, u);
    }
    if (S.auto) speak(curSpeak);
    updatePad();
  }

  function viewQuestion(d, q, total) {
    var first = true, solvedYet = false;
    var pass = h('div', { class: 'passage small', text: d.p, hidden: true });
    stage.appendChild(h('div', { class: 'row' }, btn('sm', '📖 글 다시 보기', function () { pass.hidden = !pass.hidden; updatePad(); })));
    stage.appendChild(pass);
    stage.appendChild(h('div', { class: 'qno', text: '문제 ' + L.step + ' / ' + total }));
    var fb = h('div', { class: 'fb', 'aria-live': 'polite' });
    var next = btn('pri', L.step === total ? '끝내기 ▶' : '다음 문제 ▶', function () { L.step++; viewLesson(); window.scrollTo(0, 0); }, { hidden: true });
    function solved() {
      if (solvedYet) return; solvedYet = true;
      if (first) L.stars++;
      fb.className = 'fb ok'; fb.textContent = '⭕ ' + pick(PRAISE);
      beep(true); next.hidden = false; updatePad();
      try { next.focus({ preventScroll: true }); next.scrollIntoView({ block: 'nearest' }); } catch (e) { }
    }
    function wrong(msg) {
      first = false;
      fb.className = 'fb bad'; fb.textContent = '🤔 ' + (msg || '다시 한번 생각해 봐요.');
      beep(false);
    }
    curSpeak = qSpeech(q);
    var body = ({ c: qChoice, o: qOX, s: qOrder, m: qMatch }[q[0]] || qChoice)(q, solved, wrong);
    stage.appendChild(body);
    stage.appendChild(fb);
    stage.appendChild(h('div', { class: 'row end' }, next));
  }

  function qChoice(q, solved, wrong) {
    var box = h('div', {}, h('p', { class: 'qtext', text: q[1] }));
    var opts = h('div', { class: 'opts' }), all = [];
    shuffle(q[2].map(function (t, k) { return { t: t, ok: k === 0 }; })).forEach(function (o, k) {
      var b = btn('opt', [h('span', { class: 'num', text: NUMS[k] || '' }), h('span', { text: o.t })], function () {
        if (o.ok) { b.classList.add('right'); all.forEach(function (x) { x.disabled = true; }); solved(); }
        else { b.classList.add('nope'); b.disabled = true; wrong(); }
      });
      all.push(b); opts.appendChild(b);
    });
    box.appendChild(opts);
    return box;
  }

  function qOX(q, solved, wrong) {
    var box = h('div', {}, h('p', { class: 'qtext', text: q[1] }));
    var row = h('div', { class: 'ox' }), all = [];
    [[true, '⭕', '맞아요'], [false, '❌', '아니에요']].forEach(function (o) {
      var b = btn('oxb', [h('span', { class: 'sym', text: o[1] }), h('span', { text: o[2] })], function () {
        if (o[0] === !!q[2]) { b.classList.add('right'); all.forEach(function (x) { x.disabled = true; }); solved(); }
        else { b.classList.add('nope'); b.disabled = true; wrong(); }
      });
      all.push(b); row.appendChild(b);
    });
    box.appendChild(row);
    return box;
  }

  function qOrder(q, solved, wrong) {
    var words = q[1], target = words.join(' ');
    var box = h('div', {}, h('p', { class: 'qtext', text: q[2] || '낱말을 차례대로 눌러 문장을 만들어요.' }));
    var ans = h('div', { class: 'ans' }), pool = h('div', { class: 'chips' }), locked = false;
    mix(words).forEach(function (w) {
      var b = btn('chip', w, function () {
        if (locked) return;
        if (b.parentNode === pool) ans.appendChild(b); else pool.appendChild(b);
        if (!pool.firstChild) check();
      });
      pool.appendChild(b);
    });
    function check() {
      var made = Array.prototype.map.call(ans.children, function (c) { return c.textContent; }).join(' ');
      locked = true;
      if (made === target) {
        ans.classList.add('right');
        Array.prototype.forEach.call(ans.children, function (c) { c.disabled = true; });
        solved();
      } else {
        wrong('차례를 다시 생각해 봐요. 처음에 올 말은 “' + words[0] + '”이에요.');
        setTimeout(function () { while (ans.firstChild) pool.appendChild(ans.firstChild); locked = false; }, 1400);
      }
    }
    box.appendChild(ans); box.appendChild(pool);
    return box;
  }

  function qMatch(q, solved, wrong) {
    var pairs = q[1], left = [], sel = -1, done = 0;
    var box = h('div', {}, h('p', { class: 'qtext', text: q[2] || '서로 어울리는 것끼리 눌러요.' }));
    box.appendChild(h('p', { class: 'note', text: '왼쪽을 먼저 누르고, 어울리는 오른쪽을 눌러요.' }));
    var grid = h('div', { class: 'match' });
    var rights = shuffle(pairs.map(function (p, k) { return k; }));
    if (pairs.length > 1 && rights.every(function (k, i) { return k === i; })) rights.reverse();
    var rbtn = {};
    pairs.forEach(function (p, k) {
      left[k] = btn('mb', p[0], function () {
        left.forEach(function (b) { b.classList.remove('pick'); });
        sel = k; left[k].classList.add('pick');
      });
    });
    rights.forEach(function (k) {
      rbtn[k] = btn('mb', pairs[k][1], function () {
        if (sel < 0) return wrong('왼쪽을 먼저 눌러요.');
        if (pairs[sel][1] === pairs[k][1]) {
          var c = ' p' + (done % 4), lb = left[sel], rb = rbtn[k];
          /* 같은 말이 오른쪽에 두 번 있을 때를 대비해 누른 버튼을 그대로 짝으로 삼는다 */
          lb.className = 'btn mb' + c; rb.className = 'btn mb' + c;
          lb.disabled = rb.disabled = true;
          done++; sel = -1;
          if (done === pairs.length) solved();
        } else {
          wrong('짝이 아니에요. 다시 골라 봐요.');
        }
      });
    });
    for (var r = 0; r < pairs.length; r++) { grid.appendChild(left[r]); grid.appendChild(rbtn[rights[r]]); }
    box.appendChild(grid);
    return box;
  }

  function viewFinish(d, total, u) {
    var prev = P[L.i];
    if (!prev || L.stars >= prev.s || prev.t !== total) P[L.i] = { s: L.stars, t: total };
    LS.set('jk_prog', P);
    var stars = '';
    for (var i = 0; i < total; i++) stars += i < L.stars ? '⭐' : '☆';
    var n = L.i + 1;
    var row = h('div', { class: 'row' });
    if (BASE[n]) row.appendChild(btn('pri', '다음 차시 ▶', function () { go('l/' + (n + 1)); }));
    row.appendChild(btn('', '🔁 다시 하기', function () { go('l/' + n); }));
    row.appendChild(btn('', '📋 차시 목록', function () { go('u/' + u); }));
    stage.appendChild(h('div', { class: 'finish' },
      h('div', { class: 'big', text: '🎉' }),
      h('h2', { text: n + '차시를 끝냈어요!' }),
      h('div', { class: 'stars', text: stars }),
      h('p', { text: '한 번에 맞힌 문제: ' + L.stars + ' / ' + total }),
      row));
    curSpeak = n + '차시를 끝냈어요. 참 잘했어요.';
    beep(true);
    party();
  }
  /* 축하 효과: 오픈 소스 canvas-confetti */
  function party() {
    try {
      if (!window.confetti || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      window.confetti({ particleCount: 90, spread: 80, origin: { y: 0.7 }, disableForReducedMotion: true });
    } catch (e) { }
  }

  /* ── 편집 ── */
  var TEMPLATE = {
    c: function () { return ['c', '질문을 쓰세요', ['정답', '오답 1', '오답 2']]; },
    o: function () { return ['o', '맞는지 틀리는지 물을 문장을 쓰세요', 1]; },
    s: function () { return ['s', ['낱말을', '차례대로', '쓰세요']]; },
    m: function () { return ['m', [['왼쪽 1', '오른쪽 1'], ['왼쪽 2', '오른쪽 2']]]; }
  };
  var TYPES = [['c', '고르기'], ['o', '○ ×'], ['s', '문장 만들기'], ['m', '짝 맞추기']];

  function field(label, val, on, multi) {
    var el = h(multi ? 'textarea' : 'input', { class: 'in' });
    if (!multi) el.type = 'text';
    el.value = val == null ? '' : val;
    el.addEventListener('input', function () { on(el.value); });
    return h('label', { class: 'fld' }, h('span', { text: label }), el);
  }

  function viewEdit(i) {
    view = 'edit';
    var w = clone(lesson(i)), n = i + 1;
    draw();

    function draw() {
      var y = window.scrollY;
      clear(stage);
      var box = h('div', { class: 'ed' });
      box.appendChild(h('div', { class: 'crumb' },
        btn('sm', '◀ 취소', function () { go('l/' + n); }),
        h('span', { class: 'where', text: n + '차시 편집' + (E[i] ? ' (편집된 차시)' : '') })));
      box.appendChild(h('h1', { text: '✏️ ' + n + '차시 편집' }));
      box.appendChild(h('p', { class: 'note', text: '고친 내용은 이 컴퓨터(브라우저)에 저장됩니다. 다른 컴퓨터로 옮기려면 ⚙️ 설정 → 편집 내용 내보내기를 쓰세요.' }));
      box.appendChild(field('차시 제목', w.t, function (v) { w.t = v; }));
      box.appendChild(field('학습 목표', w.g, function (v) { w.g = v; }));
      box.appendChild(field('읽기 글 (줄을 바꾸면 화면에서도 줄이 바뀝니다)', w.p, function (v) { w.p = v; }, true));
      w.q.forEach(function (q, k) { box.appendChild(qEditor(q, k)); });

      var addRow = h('div', { class: 'seg' });
      TYPES.forEach(function (t) {
        addRow.appendChild(btn('sm', '＋ ' + t[1], function () { w.q.push(TEMPLATE[t[0]]()); draw(); window.scrollTo(0, document.body.scrollHeight); }));
      });
      box.appendChild(h('div', { class: 'set' }, h('b', { text: '문제 추가' }), addRow));

      var row = h('div', { class: 'row' }, btn('pri', '💾 저장', save), btn('', '취소', function () { go('l/' + n); }));
      if (E[i]) row.appendChild(btn('', '↩ 처음 내용으로 되돌리기', function () {
        if (!confirm(n + '차시를 처음 내용으로 되돌릴까요?')) return;
        delete E[i]; LS.set('jk_edit', E); go('l/' + n);
      }));
      box.appendChild(row);
      stage.appendChild(box);
      window.scrollTo(0, y);
      updatePad();
    }

    function qEditor(q, k) {
      var box = h('div', { class: 'qed' });
      var head = h('div', { class: 'head' }, h('b', { text: '문제 ' + (k + 1) }));
      head.appendChild(btn('sm', '▲', function () { if (k > 0) { w.q.splice(k - 1, 0, w.q.splice(k, 1)[0]); draw(); } }, { title: '위로', disabled: k === 0 }));
      head.appendChild(btn('sm', '▼', function () { if (k < w.q.length - 1) { w.q.splice(k + 1, 0, w.q.splice(k, 1)[0]); draw(); } }, { title: '아래로', disabled: k === w.q.length - 1 }));
      head.appendChild(btn('sm', '🗑 삭제', function () { if (confirm('문제 ' + (k + 1) + '을(를) 지울까요?')) { w.q.splice(k, 1); draw(); } }));
      box.appendChild(head);

      var seg = h('div', { class: 'seg' });
      TYPES.forEach(function (t) {
        seg.appendChild(btn('sm' + (q[0] === t[0] ? ' on' : ''), t[1], function () {
          if (q[0] === t[0]) return;
          w.q[k] = TEMPLATE[t[0]](); draw();
        }));
      });
      box.appendChild(h('div', { class: 'set' }, seg));

      if (q[0] === 'c') {
        box.appendChild(field('질문', q[1], function (v) { q[1] = v; }, true));
        q[2].forEach(function (o, j) {
          var f = field(j === 0 ? '✅ 정답' : '오답 ' + j, o, function (v) { q[2][j] = v; });
          if (j > 0 && q[2].length > 2) f.appendChild(btn('sm', '이 보기 삭제', function () { q[2].splice(j, 1); draw(); }));
          box.appendChild(f);
        });
        if (q[2].length < 5) box.appendChild(btn('sm', '＋ 보기 추가', function () { q[2].push('오답 ' + q[2].length); draw(); }));
        box.appendChild(h('p', { class: 'note', text: '보기는 학생 화면에서 자동으로 섞여 나옵니다.' }));
      } else if (q[0] === 'o') {
        box.appendChild(field('문장', q[1], function (v) { q[1] = v; }, true));
        var ox = h('div', { class: 'seg' });
        ox.appendChild(btn('sm' + (q[2] ? ' on' : ''), '⭕ 맞아요가 정답', function () { q[2] = 1; draw(); }));
        ox.appendChild(btn('sm' + (!q[2] ? ' on' : ''), '❌ 아니에요가 정답', function () { q[2] = 0; draw(); }));
        box.appendChild(ox);
      } else if (q[0] === 's') {
        box.appendChild(field('지시문 (비워 두면 기본 문장이 나옵니다)', q[2] || '', function (v) { q[2] = v; }));
        box.appendChild(field('바른 차례대로 쓰고, 조각 사이에 / 를 넣으세요', q[1].join(' / '), function (v) {
          q[1] = v.split('/').map(function (x) { return x.trim(); }).filter(Boolean);
        }));
        box.appendChild(h('p', { class: 'note', text: '예: 나는 / 학교에 / 가요  → 학생 화면에서는 섞여서 나옵니다.' }));
      } else {
        box.appendChild(field('지시문 (비워 두면 기본 문장이 나옵니다)', q[2] || '', function (v) { q[2] = v; }));
        q[1].forEach(function (p, j) {
          var a = h('input', { class: 'in', type: 'text', 'aria-label': '왼쪽 ' + (j + 1) }), b = h('input', { class: 'in', type: 'text', 'aria-label': '오른쪽 ' + (j + 1) });
          a.value = p[0]; b.value = p[1];
          a.addEventListener('input', function () { p[0] = a.value; });
          b.addEventListener('input', function () { p[1] = b.value; });
          box.appendChild(h('div', { class: 'pair' }, a, b,
            btn('sm', '삭제', function () { q[1].splice(j, 1); draw(); }, { disabled: q[1].length <= 2 })));
        });
        if (q[1].length < 4) box.appendChild(btn('sm', '＋ 짝 추가', function () { q[1].push(['왼쪽', '오른쪽']); draw(); }));
      }
      return box;
    }

    function save() {
      var err = '';
      if (!String(w.t || '').trim()) err = '차시 제목을 쓰세요.';
      w.q.forEach(function (q, k) {
        var no = '문제 ' + (k + 1) + ': ';
        if (q[0] === 'c') {
          q[2] = q[2].map(function (x) { return String(x).trim(); });
          if (!String(q[1]).trim()) err = err || no + '질문을 쓰세요.';
          if (q[2].some(function (x) { return !x; })) err = err || no + '빈 보기가 있습니다.';
          if (q[2].indexOf(q[2][0], 1) > 0) err = err || no + '정답과 같은 오답이 있습니다.';
        } else if (q[0] === 'o') {
          if (!String(q[1]).trim()) err = err || no + '문장을 쓰세요.';
        } else if (q[0] === 's') {
          if (q[1].length < 2) err = err || no + '조각을 2개 이상 쓰세요.';
          if (!q[2]) q.length = 2;
        } else {
          if (q[1].some(function (p) { return !String(p[0]).trim() || !String(p[1]).trim(); })) err = err || no + '빈 짝이 있습니다.';
          if (!q[2]) q.length = 2;
        }
      });
      if (err) return alert(err);
      E[i] = w; LS.set('jk_edit', E);
      go('l/' + n);
    }
  }

  /* ── 설정 창 ── */
  function openSettings() {
    hush(); cancelDwell();
    var cur = L ? L.i : -1;
    clear(modal);
    var sheet = h('div', { class: 'sheet', role: 'dialog', 'aria-modal': 'true', 'aria-label': '설정' });
    sheet.appendChild(h('div', { class: 'top' }, h('h2', { text: '⚙️ 설정' }), btn('pri', '닫기 ✕', closeSettings)));

    function seg(title, desc, key, opts) {
      var row = h('div', { class: 'seg' });
      opts.forEach(function (o) {
        row.appendChild(btn(S[key] === o[0] ? 'on' : '', o[1], function () { S[key] = o[0]; apply(); openSettings(); }, { 'aria-pressed': String(S[key] === o[0]) }));
      });
      sheet.appendChild(h('div', { class: 'set' }, h('b', { text: title }), desc ? h('small', { text: desc }) : null, row));
    }
    var onoff = [[false, '끄기'], [true, '켜기']];
    seg('머물러 누르기', '버튼 위에 마우스를 올려 두고 기다리면 저절로 눌립니다. 누르는 동작이 어려울 때 씁니다.', 'dwell',
      [[0, '끄기'], [1, '1초'], [1.5, '1.5초'], [2, '2초'], [3, '3초']]);
    seg('누르자마자 선택', '마우스 단추를 누르는 순간 선택됩니다. 누른 채 손이 미끄러져도 선택됩니다.', 'press', onoff);
    seg('떨림 방지', '아주 짧은 사이에 여러 번 눌러도 한 번만 눌린 것으로 봅니다.', 'guard', onoff);
    seg('큰 마우스 포인터', '', 'cursor', onoff);
    seg('버튼 크기', '', 'btn', [[1, '보통'], [1.25, '크게'], [1.5, '아주 크게']]);
    seg('화면 색', '', 'dark', [[false, '밝게'], [true, '어둡게 (또렷한 색)']]);
    seg('자동으로 읽어 주기', '글과 문제가 나올 때 소리로 읽어 줍니다.', 'auto', onoff);
    seg('효과음', '', 'snd', onoff);

    sheet.appendChild(h('h3', { text: '👩‍🏫 선생님 메뉴' }));
    var t = h('div', { class: 'seg' });
    if (cur >= 0) {
      t.appendChild(btn('', '✏️ 지금 차시 편집', function () { closeSettings(); go('e/' + (cur + 1)); }));
      t.appendChild(btn('', '🖨 지금 차시 인쇄', function () { openPrint(cur, false); }));
    }
    t.appendChild(btn('', '📤 편집 내용 내보내기', exportEdits));
    t.appendChild(btn('', '📥 편집 내용 불러오기', importEdits));
    t.appendChild(btn('', '↩ 편집 모두 되돌리기', function () {
      if (!confirm('편집한 차시 ' + Object.keys(E).length + '개를 모두 처음 내용으로 되돌릴까요?')) return;
      E = {}; LS.set('jk_edit', E); closeSettings(); render();
    }));
    t.appendChild(btn('', '🧹 학습 기록 지우기', function () {
      if (!confirm('끝낸 차시 기록을 모두 지울까요?')) return;
      P = {}; LS.set('jk_prog', P); closeSettings(); render();
    }));
    sheet.appendChild(t);
    sheet.appendChild(h('p', { class: 'note', text: '편집한 차시: ' + Object.keys(E).length + '개 · 차시를 고치려면 그 차시에 들어가서 “✏️ 편집”을 누르세요.' }));
    modal.appendChild(sheet);
    modal.hidden = false;
  }
  function closeSettings() { modal.hidden = true; clear(modal); }

  function exportEdits() {
    var blob = new Blob([JSON.stringify({ app: 'easy-korean-120', edits: E }, null, 1)], { type: 'application/json' });
    var a = h('a', { href: URL.createObjectURL(blob), download: '국어학습지_편집내용.json' });
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 3000);
  }
  function validLesson(d) {
    return d && typeof d.t === 'string' && typeof d.p === 'string' && Array.isArray(d.q) && d.q.every(function (q) {
      if (!Array.isArray(q)) return false;
      if (q[0] === 'c') return typeof q[1] === 'string' && Array.isArray(q[2]) && q[2].length >= 2;
      if (q[0] === 'o') return typeof q[1] === 'string';
      if (q[0] === 's') return Array.isArray(q[1]) && q[1].length >= 2;
      if (q[0] === 'm') return Array.isArray(q[1]) && q[1].every(function (p) { return Array.isArray(p) && p.length === 2; });
      return false;
    });
  }
  function importEdits() {
    var f = h('input', { type: 'file', accept: '.json,application/json' });
    f.addEventListener('change', function () {
      var file = f.files[0]; if (!file) return;
      var r = new FileReader();
      r.onload = function () {
        try {
          var data = JSON.parse(r.result), ed = data.edits, c = 0;
          for (var k in ed) if (BASE[k] && validLesson(ed[k])) { E[k] = ed[k]; c++; }
          LS.set('jk_edit', E);
          alert('차시 ' + c + '개의 편집 내용을 불러왔습니다.');
          closeSettings(); render();
        } catch (e) { alert('이 파일은 불러올 수 없습니다.'); }
      };
      r.readAsText(file);
    });
    f.click();
  }

  /* ── 인쇄 ── */
  var PSIZES = [[14, '보통'], [18, '크게'], [24, '아주 크게'], [32, '가장 크게']];
  var pOpt = { unit: false, ans: false };

  function openPrint(i, unit) {
    hush(); cancelDwell();
    pOpt.unit = !!unit;
    drawPrint(i);
  }
  function drawPrint(i) {
    var u = Math.floor(i / PER);
    clear(modal);
    var sheet = h('div', { class: 'sheet', role: 'dialog', 'aria-modal': 'true', 'aria-label': '인쇄' });
    sheet.appendChild(h('div', { class: 'top' }, h('h2', { text: '🖨 학습지 인쇄' }), btn('pri', '닫기 ✕', closeSettings)));
    function seg(title, desc, cur, opts, set) {
      var row = h('div', { class: 'seg' });
      opts.forEach(function (o) {
        row.appendChild(btn(cur === o[0] ? 'on' : '', o[1], function () { set(o[0]); drawPrint(i); }, { 'aria-pressed': String(cur === o[0]) }));
      });
      sheet.appendChild(h('div', { class: 'set' }, h('b', { text: title }), desc ? h('small', { text: desc }) : null, row));
    }
    seg('인쇄할 범위', '', pOpt.unit,
      [[false, (i + 1) + '차시만'], [true, (u + 1) + '단원 전체 (' + (u * PER + 1) + '~' + (u * PER + PER) + '차시)']],
      function (v) { pOpt.unit = v; });
    seg('인쇄 글자 크기', '종이에 찍히는 글자 크기입니다. 크게 할수록 쪽수가 늘어납니다.', S.pfs,
      PSIZES.map(function (p) { return [p[0], p[1] + ' (' + p[0] + 'pt)']; }),
      function (v) { S.pfs = v; LS.set('jk_set', S); });
    seg('정답 표시', '선생님용 정답지를 뽑을 때 켭니다.', pOpt.ans, [[false, '끄기'], [true, '켜기']], function (v) { pOpt.ans = v; });
    sheet.appendChild(h('div', { class: 'set' }, h('b', { text: '글자 크기 미리 보기' }),
      h('div', { class: 'pprev', style: 'font-size:' + S.pfs + 'pt', text: '가나다 국어 학습지' })));
    sheet.appendChild(h('div', { class: 'row' }, btn('pri', '🖨 인쇄하기', function () {
      var list = [];
      if (pOpt.unit) { for (var k = u * PER; k < u * PER + PER && BASE[k]; k++) list.push(k); } else list.push(i);
      closeSettings();
      buildPrint(list, pOpt.ans);
      setTimeout(function () { window.print(); }, 100);
    })));
    sheet.appendChild(h('p', { class: 'note', text: '인쇄 창에서 “PDF로 저장”을 고르면 파일로도 남길 수 있습니다.' }));
    modal.appendChild(sheet);
    modal.hidden = false;
  }

  function buildPrint(list, ans) {
    var pr = $('print');
    clear(pr);
    pr.style.fontSize = S.pfs + 'pt';
    list.forEach(function (i) {
      var d = lesson(i), page = h('section', { class: 'ppage' });
      page.appendChild(h('p', { class: 'name', text: ans ? '선생님용 정답지' : '이름: ________________' }));
      page.appendChild(h('h1', { text: (i + 1) + '차시. ' + d.t }));
      if (d.g) page.appendChild(h('p', { class: 'pg', text: '🎯 ' + d.g }));
      page.appendChild(h('div', { class: 'pp', text: d.p }));
      d.q.forEach(function (q, k) {
        var box = h('div', { class: 'pq' }), key = '';
        if (q[0] === 'c') {
          box.appendChild(h('b', { text: (k + 1) + '. ' + q[1] }));
          shuffle(q[2]).forEach(function (o, j) {
            box.appendChild(h('div', { class: 'po', text: NUMS[j] + ' ' + o }));
            if (o === q[2][0]) key = NUMS[j] + ' ' + o;
          });
        } else if (q[0] === 'o') {
          box.appendChild(h('b', { text: (k + 1) + '. ' + q[1] + '   ( ○ , × )' }));
          key = q[2] ? '○' : '×';
        } else if (q[0] === 's') {
          box.appendChild(h('b', { text: (k + 1) + '. ' + (q[2] ? q[2].replace('눌러요', '써요') : '낱말을 차례대로 써서 문장을 만들어요.') }));
          box.appendChild(h('div', {}, mix(q[1]).map(function (x) { return h('span', { class: 'box', text: x }); })));
          box.appendChild(h('div', { class: 'line' }));
          key = q[1].join(' → ');
        } else {
          box.appendChild(h('b', { text: (k + 1) + '. ' + (q[2] ? q[2].replace('눌러요', '선으로 이어요') : '서로 어울리는 것끼리 선으로 이어요.') }));
          var cols = h('div', { class: 'cols' }), rs = mix(q[1].map(function (p) { return p[1]; }));
          q[1].forEach(function (p, j) { cols.appendChild(h('div', { text: p[0] + '  ●' })); cols.appendChild(h('div', { text: '●  ' + rs[j] })); });
          box.appendChild(cols);
          key = q[1].map(function (p) { return p[0] + ' ― ' + p[1]; }).join(' / ');
        }
        if (ans) box.appendChild(h('div', { class: 'key', text: '정답: ' + key }));
        page.appendChild(box);
      });
      pr.appendChild(page);
    });
  }

  /* ── 마우스·터치패드 도움 기능 ── */
  var dw = { el: null, t: null, fired: null }, lastClick = 0, swallow = 0, mx = 0, my = 0;
  function cancelDwell() { clearTimeout(dw.t); dw.t = null; dw.el = null; ring.classList.remove('on'); }
  function arm(b) {
    clearTimeout(dw.t);
    ring.classList.remove('on'); void ring.offsetWidth;
    ring.style.setProperty('--dw', S.dwell + 's');
    ring.classList.add('on');
    dw.t = setTimeout(function () {
      ring.classList.remove('on');
      if (!document.body.contains(b) || b.disabled) { dw.el = null; return; }
      dw.fired = b;
      b.click();
      /* 글자·화면·이동 버튼은 계속 올려 두면 되풀이된다 */
      if (b.hasAttribute('data-repeat') && dw.el === b && document.body.contains(b)) arm(b);
    }, S.dwell * 1000);
  }
  document.addEventListener('mousemove', function (e) {
    if (!S.dwell || view === 'edit') { if (dw.el) cancelDwell(); return; }
    if (Math.abs(e.clientX - mx) + Math.abs(e.clientY - my) < 1) return;
    mx = e.clientX; my = e.clientY;
    ring.style.left = mx + 'px'; ring.style.top = my + 'px';
    var b = e.target.closest ? e.target.closest('button') : null;
    if (b && b.disabled) b = null;
    if (b === dw.el) return;
    cancelDwell(); dw.el = b;
    if (!b) { dw.fired = null; return; }
    if (b !== dw.fired) arm(b);
  }, true);
  document.addEventListener('mouseleave', cancelDwell);

  document.addEventListener('pointerdown', function (e) {
    if (!S.press || e.pointerType !== 'mouse' || e.button !== 0 || view === 'edit') return;
    var b = e.target.closest ? e.target.closest('button') : null;
    if (!b || b.disabled) return;
    e.preventDefault();
    swallow = Date.now();
    cancelDwell();
    b.click();
  }, true);

  document.addEventListener('click', function (e) {
    function stop() { e.stopPropagation(); e.preventDefault(); }
    if (e.isTrusted && swallow && Date.now() - swallow < 1500) { swallow = 0; return stop(); }
    if (S.guard && view !== 'edit' && e.target.closest && e.target.closest('button')) {
      var now = Date.now();
      if (now - lastClick < 400) return stop();
      lastClick = now;
    }
    if (e.isTrusted) cancelDwell();
  }, true);

  /* ── 도구 모음 ── */
  $('bHome').onclick = function () { closeSettings(); go(''); };
  $('bFsUp').onclick = function () { step('fs', 0.25, 1, 2.5); };
  $('bFsDown').onclick = function () { step('fs', -0.25, 1, 2.5); };
  $('bZoomUp').onclick = function () { step('zoom', 0.25, 1, 3); };
  $('bZoomDown').onclick = function () { step('zoom', -0.25, 1, 3); };
  $('bSpeak').onclick = function () { speak(curSpeak); };
  $('bSet').onclick = function () { if (modal.hidden) openSettings(); else closeSettings(); };
  $('bUp').onclick = function () { window.scrollBy({ top: -window.innerHeight * 0.6, behavior: 'smooth' }); };
  $('bDown').onclick = function () { window.scrollBy({ top: window.innerHeight * 0.6, behavior: 'smooth' }); };
  modal.addEventListener('click', function (e) { if (e.target === modal) closeSettings(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !modal.hidden) closeSettings(); });
  window.addEventListener('hashchange', render);
  window.addEventListener('resize', updatePad);
  if (window.ResizeObserver) new ResizeObserver(updatePad).observe(stage);

  apply();
  if (!BASE.length) stage.appendChild(h('p', { text: '학습 내용을 불러오지 못했습니다. js 폴더의 data 파일을 확인하세요.' }));
  else render();
})();
