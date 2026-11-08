// Điều hướng cho Sách Nấm EasyRL: thanh trên cùng, mục lục thu gọn được, lối tắt trong chương,
// mục lục của trang và nút bài trước/bài sau. Đăng ký như một plugin của docsify.
(function () {
  var ICON = {
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"/></svg>',
    moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>',
    sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
    github: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.3-3.4-1.3-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.9.8.1-.6.3-1.1.6-1.3-2.2-.3-4.6-1.1-4.6-4.9 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.6 0 0 .8-.3 2.8 1a9.600 9.600 0 0 1 5 0c1.900-1.300 2.800-1 2.800-1 .5 1.300.2 2.300.1 2.600.6.7 1 1.600 1 2.700 0 3.800-2.300 4.600-4.600 4.900.4.300.7.900.7 1.900V21c0 .3.2.6.7.5A10 10 0 0 0 12 2z"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    logo: '<svg class="brand-logo" viewBox="0 0 48 48" aria-hidden="true"><defs><linearGradient id="lg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#22b8f0"/><stop offset="1" stop-color="#6a3cf0"/></linearGradient></defs><rect width="48" height="48" rx="14" fill="url(#lg)"/><path d="M8.5 25c0-9 7-15.5 15.5-15.5S39.5 16 39.5 25c0 1.4-1 2.3-2.4 2.3H10.9c-1.4 0-2.4-.9-2.4-2.3z" fill="#fff"/><circle cx="17" cy="19" r="2.6" fill="#22b8f0"/><circle cx="27.5" cy="15.5" r="2" fill="#22b8f0"/><circle cx="31.5" cy="22" r="2.3" fill="#22b8f0"/><path d="M18.5 27.3h11l-1 9.2a2.4 2.4 0 0 1-2.4 2.1h-4.2a2.4 2.4 0 0 1-2.4-2.1z" fill="#e3e6ff"/><path d="M21.5 31.5q2.5 2 5 0" stroke="#6a3cf0" stroke-width="1.6" fill="none" stroke-linecap="round"/></svg>',
    chevron: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>'
  };
  var REPO = 'https://github.com/nmc2004nd/easy-rl-vi';
  var LAST_KEY = 'easyrl-last';
  // Mục lục gom từ hai nguồn: Sách Nấm EasyRL và sách của Shiyu Zhao.
  // Mỗi nhóm có màu và icon riêng; mỗi trang có icon theo nội dung.
  var NAV_GROUPS = {
    'Bắt đầu': ['start', 'flag'],
    'Nền tảng': ['base', 'blocks'],
    'Dựa trên chính sách': ['policy', 'target'],
    'Dựa trên giá trị': ['value', 'chart-column'],
    'Nâng cao': ['adv', 'rocket'],
    'Chuyên đề': ['topic', 'sparkles'],
    'Nền tảng toán học': ['math', 'sigma']
  };
  var NAV_PARTS = {
    base: ['Sách Nấm EasyRL', 'Wang, Yang, Jiang · Datawhale'],
    math: ['Sách của Shiyu Zhao', 'Mathematical Foundations of RL']
  };
  var PAGE_ICON = {
    '/': 'house', '/guide_vi': 'compass', '/explorer_vi': 'map', '/notation_vi': 'whole-word',
    '/chapter1/chapter1_vi': 'sprout', '/chapter2/chapter2_vi': 'network', '/chapter3/chapter3_vi': 'table-2',
    '/chapter4/chapter4_vi': 'trending-up', '/chapter5/chapter5_vi': 'shield-check',
    '/chapter6/chapter6_vi': 'brain', '/chapter7/chapter7_vi': 'brain-circuit', '/chapter8/chapter8_vi': 'sliders-horizontal',
    '/chapter9/chapter9_vi': 'drama', '/chapter10/chapter10_vi': 'gift', '/chapter11/chapter11_vi': 'footprints',
    '/chapter12/chapter12_vi': 'gauge', '/chapter13/chapter13_vi': 'gamepad-2', '/chapter14/ls-imagine_vi': 'pickaxe',
    '/chapter15/chapter15_vi': 'eye', '/chapter16/chapter16_vi': 'globe',
    '/mathrl/README_vi': 'book-open', '/mathrl/ch01_vi': 'layout-grid', '/mathrl/ch02_vi': 'square-function',
    '/mathrl/ch03_vi': 'crown', '/mathrl/ch04_vi': 'repeat', '/mathrl/ch05_vi': 'dices', '/mathrl/ch06_vi': 'chart-scatter',
    '/mathrl/ch07_vi': 'timer', '/mathrl/ch08_vi': 'chart-spline', '/mathrl/ch09_vi': 'mountain',
    '/mathrl/ch10_vi': 'drama', '/mathrl/appendix_vi': 'library'
  };
  var SUB_ICON = [
    [/_notes_vi$/, 'notebook-pen'], [/_questions&keywords_vi$/, 'circle-help'], [/_review_vi$/, 'layers'],
    [/_viz_vi$/, 'monitor-play'], [/_code_vi$/, 'terminal'], [/\/project\d+_vi$/, 'code-xml']
  ];
  function navIcon(name, cls) {
    var paths = (window.NAV_ICONS || {})[name];
    if (!paths) return '';
    return '<svg class="' + cls + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + paths + '</svg>';
  }
  function pageIcon(path) {
    if (PAGE_ICON[path]) return PAGE_ICON[path];
    for (var i = 0; i < SUB_ICON.length; i++) if (SUB_ICON[i][0].test(path)) return SUB_ICON[i][1];
    return null;
  }
  var DONE_KEY = 'easyrl-done';
  var REWARD_KEY = 'easyrl-reward';
  var manuallyOpen = {};
  var pagerObserver = null;
  var revealObserver = null;

  // ---------- hiệu ứng vui ----------
  function calm() { return matchMedia('(prefers-reduced-motion: reduce)').matches; }

  function readDone() {
    try { return JSON.parse(localStorage.getItem(DONE_KEY) || '[]'); } catch (e) { return []; }
  }

  function toast(msg) {
    var el = document.querySelector('.fun-toast');
    if (!el) {
      el = document.createElement('div');
      el.className = 'fun-toast';
      el.setAttribute('role', 'status');
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(el._t);
    el._t = setTimeout(function () { el.classList.remove('show'); }, 2600);
  }

  // Pháo giấy bắn ra từ điểm (x, y) trên màn hình.
  function confetti(x, y, n) {
    if (calm() || !document.body.animate) return;
    var colors = ['#3d6bf5', '#22b8f0', '#7c3aed', '#f5b43a', '#e8487f', '#0ea5a4'];
    for (var i = 0; i < (n || 30); i++) {
      var c = document.createElement('i');
      c.className = 'confetti';
      c.style.left = x + 'px';
      c.style.top = y + 'px';
      c.style.background = colors[i % colors.length];
      document.body.appendChild(c);
      var ang = -Math.PI / 2 + (Math.random() - .5) * Math.PI * 1.1;
      var v = 120 + Math.random() * 160;
      var dx = Math.cos(ang) * v;
      var dy = Math.sin(ang) * v;
      var rot = (Math.random() - .5) * 720;
      c.animate([
        { transform: 'translate(0,0) rotate(0)', opacity: 1 },
        { transform: 'translate(' + dx + 'px,' + dy + 'px) rotate(' + rot / 2 + 'deg)', opacity: 1, offset: .45 },
        { transform: 'translate(' + dx * 1.3 + 'px,' + (dy + 260) + 'px) rotate(' + rot + 'deg)', opacity: 0 }
      ], { duration: 1300 + Math.random() * 500, easing: 'cubic-bezier(.2,.7,.4,1)' }).onfinish = (function (el) {
        return function () { el.remove(); };
      })(c);
    }
  }

  // Số liệu trong phần đầu trang chủ đếm từ 0 lên.
  function countUp(section) {
    if (calm()) return;
    section.querySelectorAll('[data-count]:not([data-counted])').forEach(function (el, k) {
      el.setAttribute('data-counted', '');
      var to = parseInt(el.dataset.count, 10);
      var t0 = performance.now() + k * 120;
      (function tick(now) {
        var f = Math.max(0, Math.min(1, (now - t0) / 1100));
        el.textContent = Math.round(to * (1 - Math.pow(1 - f, 3)));
        if (f < 1 && el.isConnected) requestAnimationFrame(tick);
      })(t0);
    });
  }

  // Robot ở trang chủ: bấm để thưởng, mỗi 10 điểm có pháo giấy.
  function bindBot(section) {
    var bot = section.querySelector('#art-bot');
    if (!bot || bot.dataset.ready) return;
    bot.dataset.ready = '1';
    var fx = section.querySelector('#art-fx');
    function reward() {
      var r = 0;
      try { r = parseInt(localStorage.getItem(REWARD_KEY) || '0', 10) || 0; } catch (e) { /* bỏ qua */ }
      r += 1;
      try { localStorage.setItem(REWARD_KEY, String(r)); } catch (e) { /* bỏ qua */ }
      bot.classList.remove('jump');
      void bot.getBoundingClientRect();
      bot.classList.add('jump');
      var big = r % 10 === 0;
      var t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      t.setAttribute('class', 'art-fx-text' + (big ? ' big' : ''));
      t.setAttribute('x', String(232 + (Math.random() - .5) * 60));
      t.setAttribute('y', '30');
      t.setAttribute('text-anchor', 'middle');
      t.textContent = big ? 'G = ' + r + ' 🏆' : '+1';
      fx.appendChild(t);
      setTimeout(function () { t.remove(); }, 1200);
      bot.setAttribute('aria-label', 'Thưởng cho tác tử một điểm. Tổng phần thưởng: ' + r);
      if (big) {
        var box = bot.getBoundingClientRect();
        confetti(box.left + box.width / 2, box.top + box.height / 3, 40);
        toast('Tác tử đã nhận ' + r + ' điểm thưởng. Chính sách của nó đang tốt dần lên!');
      }
    }
    bot.addEventListener('click', reward);
    bot.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); reward(); }
    });
    bot.addEventListener('animationend', function () { bot.classList.remove('jump'); });
  }

  // Các khối trang chủ hiện dần khi cuộn tới.
  function reveal(section) {
    if (revealObserver) revealObserver.disconnect();
    if (!('IntersectionObserver' in window)) return;
    revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); revealObserver.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -40px 0px' });
    section.querySelectorAll('.home-h2, .home-h2-row, .home-tools > a, .home-row, .home-banner, .home-agent').forEach(function (el, i) {
      if (el.classList.contains('in')) return;
      if (!el.classList.contains('reveal')) {
        el.classList.add('reveal');
        el.style.transitionDelay = (el.parentElement.classList.contains('home-tools') ? (i % 4) * 80 : 0) + 'ms';
      }
      revealObserver.observe(el);
    });
  }

  // Cuộn tới cuối bài lần đầu: đánh dấu đã đọc và ăn mừng một chút.
  function watchFinish(pager) {
    if (pagerObserver) { pagerObserver.disconnect(); pagerObserver = null; }
    if (!pager || !('IntersectionObserver' in window)) return;
    var path = currentPath;
    pagerObserver = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting || window.scrollY < 300 || path !== currentPath) return;
      pagerObserver.disconnect();
      var done = readDone();
      if (done.indexOf(path) >= 0) return;
      done.push(path);
      try { localStorage.setItem(DONE_KEY, JSON.stringify(done)); } catch (e) { return; }
      enhanceSidebar();
      var box = pager.getBoundingClientRect();
      confetti(box.left + box.width / 2, box.top + 10, 34);
      toast('Xong bài! +1 phần thưởng 🎉 (' + done.length + ' bài đã đọc)');
    }, { threshold: .6 });
    pagerObserver.observe(pager);
  }
  var currentPath = '/';
  var tocObserver = null;

  function isDark() {
    var t = document.documentElement.dataset.theme;
    return t ? t === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
  }

  // Mô phỏng nhúng cùng origin và đọc data-theme, nên truyền luôn lựa chọn của người đọc xuống.
  function syncFrameTheme(frame) {
    try {
      var root = frame.contentDocument && frame.contentDocument.documentElement;
      if (!root) return;
      if (document.documentElement.dataset.theme) root.dataset.theme = document.documentElement.dataset.theme;
      else delete root.dataset.theme;
    } catch (e) { /* khung chưa sẵn sàng: sự kiện load sẽ gọi lại */ }
  }

  function buildBar() {
    if (document.querySelector('.site-bar')) return;
    var bar = document.createElement('div');
    bar.className = 'site-bar';
    bar.innerHTML =
      '<button class="bar-btn" id="bar-menu" type="button" aria-label="Ẩn hoặc hiện mục lục">' + ICON.menu + '</button>' +
      '<div class="bar-search" id="bar-search"><kbd class="bar-kbd">Ctrl K</kbd></div>' +
      '<div class="bar-spacer"></div>' +
      '<button class="bar-btn" id="bar-theme" type="button"></button>' +
      '<span class="bar-sep" aria-hidden="true"></span>' +
      '<a class="bar-btn" href="' + REPO + '" target="_blank" rel="noopener" aria-label="Mã nguồn bản dịch trên GitHub">' + ICON.github + '</a>' +
      '<a class="bar-cta" id="bar-cta" href="#/chapter1/chapter1_vi"></a>' +
      '<div class="progress" id="bar-progress"></div>';
    document.body.appendChild(bar);

    document.getElementById('bar-menu').addEventListener('click', function (e) {
      // Trên điện thoại docsify đóng cột trái khi có click lan tới body, nên phải chặn ở đây.
      e.stopPropagation();
      var toggle = document.querySelector('.sidebar-toggle');
      if (toggle) toggle.click();
    });

    var themeBtn = document.getElementById('bar-theme');
    function paintTheme() {
      var dark = isDark();
      themeBtn.innerHTML = dark ? ICON.sun : ICON.moon;
      themeBtn.setAttribute('aria-label', dark ? 'Chuyển sang nền sáng' : 'Chuyển sang nền tối');
    }
    function applyTheme() {
      var next = isDark() ? 'light' : 'dark';
      document.documentElement.dataset.theme = next;
      try { localStorage.setItem('easyrl-theme', next); } catch (e) { /* trình duyệt chặn lưu trữ */ }
      paintTheme();
      document.querySelectorAll('iframe.viz-frame').forEach(syncFrameTheme);
    }
    themeBtn.addEventListener('click', function () {
      if (!document.startViewTransition || calm()) { applyTheme(); return; }
      var r = themeBtn.getBoundingClientRect();
      var x = r.left + r.width / 2;
      var y = r.top + r.height / 2;
      var end = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
      document.startViewTransition(applyTheme).ready.then(function () {
        document.documentElement.animate(
          { clipPath: ['circle(0px at ' + x + 'px ' + y + 'px)', 'circle(' + end + 'px at ' + x + 'px ' + y + 'px)'] },
          { duration: 600, easing: 'cubic-bezier(.4, 0, .2, 1)', pseudoElement: '::view-transition-new(root)' }
        );
      }).catch(function () { /* trình duyệt bỏ qua hiệu ứng */ });
    });
    paintTheme();

    // Ctrl+K hoặc "/" để tìm kiếm, Esc để thoát.
    document.addEventListener('keydown', function (e) {
      var input = document.querySelector('#bar-search input');
      if (!input) return;
      var typing = /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName) || e.target.isContentEditable;
      if ((e.key === 'k' && (e.ctrlKey || e.metaKey)) || (e.key === '/' && !typing)) {
        e.preventDefault();
        input.focus();
        input.select();
      } else if (e.key === 'Escape' && e.target === input) {
        input.blur();
      }
    });

    var brand = document.querySelector('.sidebar .app-name-link');
    if (brand) {
      brand.innerHTML = ICON.logo + '<span class="brand-text"><b>EasyRL</b><small>Sách Nấm · bản tiếng Việt</small></span>';
      brand.setAttribute('aria-label', 'Sách Nấm EasyRL, về trang chủ');
    }
    var side = document.querySelector('.sidebar');
    if (side && !side.querySelector('.side-foot')) {
      var foot = document.createElement('div');
      foot.className = 'side-foot';
      foot.innerHTML = '<a href="' + REPO + '" target="_blank" rel="noopener">' + ICON.github +
        '<span>Mã nguồn bản dịch<small>Góp ý trên GitHub →</small></span></a>';
      side.appendChild(foot);
    }

    document.addEventListener('pointermove', function (e) {
      var el = e.target.closest && e.target.closest('.spot');
      if (!el) return;
      var b = el.getBoundingClientRect();
      el.style.setProperty('--mx', (e.clientX - b.left) + 'px');
      el.style.setProperty('--my', (e.clientY - b.top) + 'px');
    }, { passive: true });

    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var el = document.documentElement;
        var max = el.scrollHeight - el.clientHeight;
        document.getElementById('bar-progress').style.transform = 'scaleX(' + (max > 0 ? el.scrollTop / max : 0) + ')';
        ticking = false;
      });
    }, { passive: true });
  }

  // Plugin search của docsify đặt ô tìm kiếm trong cột trái; chuyển nó lên thanh trên (giữ nguyên sự kiện).
  function mountSearch() {
    var slot = document.getElementById('bar-search');
    var search = document.querySelector('.sidebar .search');
    if (!slot || !search) return;
    slot.insertBefore(search, slot.firstChild);
    var input = search.querySelector('input');
    input.setAttribute('aria-label', 'Tìm kiếm trong sách');
    input.addEventListener('input', function () { slot.classList.toggle('has-text', !!input.value); });
    var panel = search.querySelector('.results-panel');
    if (panel) new MutationObserver(function () { fixSearchResults(panel, input); }).observe(panel, { childList: true });
  }

  // Plugin search 4.13 bỏ dấu tiếng Việt khi hiển thị kết quả ("đieu khien sai phan thoi gian").
  // Lấy lại tiêu đề và đoạn trích gốc từ chỉ mục mà plugin lưu trong localStorage.
  var searchIndex = null;
  function loadSearchIndex() {
    if (searchIndex) return searchIndex;
    try {
      var raw = JSON.parse(localStorage.getItem('docsify.search.index') || 'null');
      if (!raw) return null;
      searchIndex = {};
      Object.keys(raw).forEach(function (path) {
        Object.keys(raw[path]).forEach(function (slug) { searchIndex[slug] = raw[path][slug]; });
      });
    } catch (e) { return null; }
    return searchIndex;
  }

  // Bỏ dấu giống plugin để so khớp, kèm bảng ánh xạ về vị trí trong chuỗi gốc.
  function fold(s) {
    var t = '';
    var map = [];
    for (var i = 0; i < s.length; i++) {
      var d = s[i].normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
      for (var k = 0; k < d.length; k++) { t += d[k]; map.push(i); }
    }
    map.push(s.length);
    return { t: t, map: map };
  }

  function decodeHtml(s) {
    var el = document.createElement('textarea');
    el.innerHTML = s;
    return el.value;
  }

  // Dựng đoạn văn có tô sáng từ khóa trên chuỗi gốc (giữ dấu).
  function highlight(text, terms, maxLen) {
    var f = fold(text);
    var hits = [];
    terms.forEach(function (term) {
      var from = 0;
      var at;
      while (term && (at = f.t.indexOf(term, from)) >= 0) {
        hits.push([f.map[at], f.map[at + term.length]]);
        from = at + term.length;
      }
    });
    hits.sort(function (a, b) { return a[0] - b[0]; });
    var start = 0;
    var end = text.length;
    if (maxLen && text.length > maxLen) {
      start = hits.length ? Math.max(0, hits[0][0] - 30) : 0;
      end = Math.min(text.length, start + maxLen);
    }
    var frag = document.createDocumentFragment();
    if (start > 0) frag.appendChild(document.createTextNode('…'));
    var pos = start;
    hits.forEach(function (h) {
      if (h[0] < pos || h[1] > end) return;
      frag.appendChild(document.createTextNode(text.slice(pos, h[0])));
      var em = document.createElement('em');
      em.className = 'search-keyword';
      em.textContent = text.slice(h[0], h[1]);
      frag.appendChild(em);
      pos = h[1];
    });
    frag.appendChild(document.createTextNode(text.slice(pos, end)));
    if (end < text.length) frag.appendChild(document.createTextNode('…'));
    return frag;
  }

  // Tiêu đề trong chỉ mục tìm kiếm là markdown thô, có thể chứa $...$.
  // Phần chữ vẫn tô sáng từ khóa, phần công thức thì vẽ bằng KaTeX.
  function titleWithMath(title, terms) {
    var parts = title.split(/\$([^$]+)\$/);
    if (parts.length === 1 || !window.katex) return highlight(title, terms, 0);
    var frag = document.createDocumentFragment();
    parts.forEach(function (part, i) {
      if (i % 2 === 0) { if (part) frag.appendChild(highlight(part, terms, 0)); return; }
      var span = document.createElement('span');
      // \tag chỉ dùng được trong công thức hiển thị riêng dòng; ở đây vẽ nội dòng nên bỏ đi.
      var tex = part.replace(/\\tag\*?\{[^}]*\}/g, '');
      try { span.innerHTML = katex.renderToString(tex, { throwOnError: false }); }
      catch (e) { span.textContent = part; }
      frag.appendChild(span);
    });
    return frag;
  }

  // Đoạn trích nội dung có công thức: cắt cửa sổ quanh từ khóa đầu tiên nhưng không cắt
  // ngang một công thức $...$, rồi vẽ bằng titleWithMath.
  function snippetWithMath(text, terms, maxLen) {
    text = text.replace(/\$\$/g, '$');
    if (text.indexOf('$') < 0 || !window.katex) return highlight(text, terms, maxLen);
    var f = fold(text);
    var first = -1;
    terms.forEach(function (term) {
      var at = term ? f.t.indexOf(term) : -1;
      if (at >= 0 && (first < 0 || f.map[at] < first)) first = f.map[at];
    });
    var start = first > 0 ? Math.max(0, first - 30) : 0;
    var end = Math.min(text.length, start + maxLen);
    var re = /\$[^$]+\$/g, m;
    while ((m = re.exec(text))) {
      var a = m.index, b = a + m[0].length;
      if (start > a && start < b) start = a;
      if (end > a && end < b) end = b - a <= maxLen ? b : a;
    }
    var frag = document.createDocumentFragment();
    if (start > 0) frag.appendChild(document.createTextNode('…'));
    frag.appendChild(titleWithMath(text.slice(start, end), terms));
    if (end < text.length) frag.appendChild(document.createTextNode('…'));
    return frag;
  }

  function fixSearchResults(panel, input) {
    var posts = panel.querySelectorAll('.matching-post:not([data-fixed])');
    if (!posts.length) return;
    var index = loadSearchIndex();
    var query = input.value.trim();
    var terms = [query].concat(query.split(/[\s\-，\\/]+/)).map(function (w) { return fold(w).t; })
      .filter(function (w, i, all) { return w && all.indexOf(w) === i; });
    posts.forEach(function (post) {
      post.setAttribute('data-fixed', '');
      var a = post.querySelector('a');
      var href = a ? a.getAttribute('href') : '';
      // Trang chủ chỉ là trang điều hướng, kết quả của nó toàn mã HTML.
      if (/^#\/(\?|$)/.test(href)) { post.remove(); return; }
      var page = document.querySelector('.sidebar-nav a[href="' + href.split('?')[0].replace(/"/g, '') + '"]');
      if (page && a && !a.querySelector('.search-where')) {
        var where = document.createElement('small');
        where.className = 'search-where';
        var ch = chapterItemOf(page);
        var head = ch && ch.querySelector(':scope > a');
        where.textContent = head && head !== page ? shortChapter(head.textContent) + ' · ' + page.textContent : page.textContent;
        a.insertBefore(where, a.firstChild);
      }
      var entry = index && index[href];
      if (!entry) return;
      var h2 = post.querySelector('h2');
      var p = post.querySelector('p');
      if (h2 && entry.title) { h2.textContent = ''; h2.appendChild(titleWithMath(decodeHtml(entry.title), terms)); }
      if (p && entry.body) { p.textContent = ''; p.appendChild(snippetWithMath(entry.body.replace(/\s+/g, ' ').trim(), terms, 150)); }
    });
    if (!panel.querySelector('.matching-post')) {
      panel.innerHTML = '<p class="empty">Không tìm thấy kết quả</p>';
    }
  }

  function resetSearch() {
    var input = document.querySelector('#bar-search input');
    if (!input || !input.value) return;
    input.value = '';
    input.dispatchEvent(new Event('input'));
    input.blur();
  }

  function hrefPath(a) {
    return decodeURIComponent(a.getAttribute('href').replace(/^#/, '').split('?')[0]);
  }

  // Gắn màu nhóm, nhãn nguồn và icon trước mỗi mục. Chạy lại được nhiều lần.
  function decorateNav(nav) {
    var top = nav.querySelector(':scope > ul');
    if (!top) return;
    Array.prototype.slice.call(top.children).forEach(function (li) {
      if (li.classList.contains('nav-part') || li.dataset.g) return;
      var label = li.querySelector(':scope > p') || li.firstChild;
      var text = label ? label.textContent.trim() : '';
      var g = NAV_GROUPS[text];
      if (!g) return;
      li.dataset.g = g[0];
      li.classList.add('nav-group');
      var head = document.createElement('div');
      head.className = 'nav-group-head';
      head.innerHTML = navIcon(g[1], 'nav-group-ico') + '<span></span>';
      head.lastChild.textContent = text;
      li.replaceChild(head, label);
      var part = NAV_PARTS[g[0]];
      if (part) {
        var p = document.createElement('li');
        p.className = 'nav-part';
        p.dataset.part = g[0];
        p.innerHTML = '<b></b><small></small>';
        p.firstChild.textContent = part[0];
        p.lastChild.textContent = part[1];
        top.insertBefore(p, li);
      }
    });
    nav.querySelectorAll('a[href^="#/"]').forEach(function (a) {
      if (a.querySelector('.nav-ico')) return;
      var name = pageIcon(hrefPath(a));
      if (name) a.insertAdjacentHTML('afterbegin', navIcon(name, 'nav-ico'));
    });
  }

  // Docsify dựng lại cột trái mỗi lần chuyển trang, nên trạng thái mở được áp lại ở đây.
  function enhanceSidebar() {
    var nav = document.querySelector('.sidebar-nav');
    if (!nav) return;
    nav.querySelectorAll('li').forEach(function (li) {
      var sub = li.querySelector(':scope > ul');
      var link = li.querySelector(':scope > a');
      if (!sub || !link) return;
      li.classList.add('has-sub');
      if (!li.querySelector(':scope > .sub-toggle')) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'sub-toggle';
        btn.innerHTML = ICON.chevron;
        btn.setAttribute('aria-label', 'Mở hoặc thu gọn: ' + link.textContent);
        link.after(btn);
      }
      var key = hrefPath(link);
      var containsCurrent = Array.prototype.some.call(li.querySelectorAll('a[href^="#/"]'), function (a) {
        return hrefPath(a) === currentPath;
      });
      var open = containsCurrent || manuallyOpen[key] === true;
      li.classList.toggle('is-open', open);
      li.querySelector(':scope > .sub-toggle').setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    decorateNav(nav);
    var done = readDone();
    nav.querySelectorAll('a[href^="#/"]').forEach(function (a) {
      a.classList.toggle('is-done', done.indexOf(hrefPath(a)) >= 0);
    });
    nav.querySelectorAll('a').forEach(function (a) {
      var here = a.getAttribute('href').indexOf('#/') === 0 && hrefPath(a) === currentPath;
      a.classList.toggle('is-current', here);
      if (here) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
  }

  function chapterItemOf(link) {
    var li = link.closest('li');
    if (li.classList.contains('has-sub')) return li;
    var parent = li.parentElement.closest('li.has-sub');
    return parent || null;
  }

  function shortChapter(text) {
    var m = text.match(/^(Chương \d+)/);
    return m ? m[1] : text;
  }

  // Lối tắt: Bài đọc · Ghi chú · Bài tập · Ôn tập · Mô phỏng của chương đang đọc.
  function renderChapterTools(section, link) {
    var chapter = link && chapterItemOf(link);
    if (!chapter) return;
    var head = chapter.querySelector(':scope > a');
    var items = [{ a: head, label: 'Bài đọc' }];
    chapter.querySelectorAll(':scope > ul > li > a').forEach(function (a) { items.push({ a: a, label: a.textContent.replace(/^(Dự án \d+).*/, '$1') }); });
    if (items.length < 2) return;
    var box = document.createElement('nav');
    box.className = 'ch-tools';
    box.setAttribute('aria-label', 'Tài liệu của chương');
    items.forEach(function (it) {
      var a = document.createElement('a');
      a.href = it.a.getAttribute('href');
      a.textContent = it.label;
      if (it.a === link) { a.className = 'is-here'; a.setAttribute('aria-current', 'page'); }
      box.appendChild(a);
    });
    section.insertBefore(box, section.firstChild);
  }

  // Nhãn mục lục cho một tiêu đề. Công thức KaTeX chứa thêm bản MathML ẩn (có cả mã LaTeX),
  // nên textContent sẽ ra "v∗v^{\ast}v∗". Giữ phần HTML hiển thị của KaTeX, bỏ phần MathML.
  function setHeadingLabel(link, h) {
    if (!h.querySelector('.katex')) { link.textContent = h.textContent; return; }
    var clone = (h.querySelector('a.anchor') || h).cloneNode(true);
    clone.querySelectorAll('.katex-mathml').forEach(function (m) { m.remove(); });
    link.innerHTML = clone.innerHTML;
    link.setAttribute('aria-label', clone.textContent.replace(/\s+/g, ' ').trim());
  }

  function renderPageToc(section) {
    if (tocObserver) { tocObserver.disconnect(); tocObserver = null; }
    var heads = Array.prototype.filter.call(section.querySelectorAll('h2, h3'), function (h) {
      return h.querySelector('a.anchor');
    });
    document.body.classList.toggle('has-toc', heads.length >= 3);
    if (heads.length < 3) return;

    var toc = document.createElement('details');
    toc.className = 'page-toc';
    var html = '<summary>Trong trang này</summary><ul>';
    heads.forEach(function (h) {
      html += '<li class="lv' + h.tagName[1] + '"><a></a></li>';
    });
    toc.innerHTML = html + '</ul>';
    var links = toc.querySelectorAll('a');
    heads.forEach(function (h, i) {
      links[i].href = h.querySelector('a.anchor').getAttribute('href');
      setHeadingLabel(links[i], h);
    });
    var wide = matchMedia('(min-width: 1320px)');
    toc.open = wide.matches;
    toc.querySelector('summary').addEventListener('click', function (e) { if (wide.matches) e.preventDefault(); });
    toc.addEventListener('click', function (e) { if (!wide.matches && e.target.tagName === 'A') toc.open = false; });

    var h1 = section.querySelector('h1');
    if (h1) h1.after(toc); else section.insertBefore(toc, section.firstChild);

    if (!('IntersectionObserver' in window)) return;
    var visible = {};
    tocObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { visible[heads.indexOf(en.target)] = en.isIntersecting; });
      var first = -1;
      for (var i = 0; i < heads.length; i++) { if (visible[i]) { first = i; break; } }
      if (first < 0) return;
      links.forEach(function (a, i) {
        a.classList.toggle('is-current', i === first);
        if (i === first && wide.matches) a.scrollIntoView({ block: 'nearest' });
      });
    }, { rootMargin: '-60px 0px -65% 0px' });
    heads.forEach(function (h) { tocObserver.observe(h); });
  }

  // Thứ tự đọc chỉ gồm các trang của sách; ôn tập và mô phỏng là trang riêng nên không nằm trong đó.
  function renderPager(section, link) {
    var all = Array.prototype.slice.call(document.querySelectorAll('.sidebar-nav a[href^="#/"]'))
      .filter(function (a) { return a.getAttribute('href') !== '#/'; });
    var i = link ? all.indexOf(link) : -1;
    if (i < 0) return;
    function label(a) {
      var ch = chapterItemOf(a);
      var head = ch && ch.querySelector(':scope > a');
      return head && head !== a ? shortChapter(head.textContent) + ' · ' + a.textContent : a.textContent;
    }
    function item(a, cls, word) {
      if (!a) return null;
      var el = document.createElement('a');
      el.className = cls;
      el.href = a.getAttribute('href');
      var s = document.createElement('small');
      s.textContent = word;
      el.appendChild(s);
      el.appendChild(document.createTextNode(label(a)));
      return el;
    }
    var pager = document.createElement('nav');
    pager.className = 'pager';
    pager.setAttribute('aria-label', 'Bài trước và bài sau');
    var prev = item(all[i - 1], 'prev', 'Bài trước');
    var next = item(all[i + 1], 'next', 'Bài sau');
    if (prev) pager.appendChild(prev);
    if (next) pager.appendChild(next);
    pager.querySelectorAll('a').forEach(function (a) { a.classList.add('spot'); });
    section.appendChild(pager);
    watchFinish(pager);
  }

  // Đưa mục đang đọc vào vùng nhìn thấy của cột trái.
  function revealInSidebar(link) {
    var side = document.querySelector('.sidebar');
    if (!link || !side) return;
    var box = side.getBoundingClientRect();
    var pos = link.getBoundingClientRect();
    if (pos.top < box.top + 80 || pos.bottom > box.bottom - 40) side.scrollTop += pos.top - box.top - box.height / 3;
  }

  // Trang chủ: lọc lộ trình theo nhóm chương, và nút trên thanh trên dẫn tới bài đang đọc dở.
  function renderHome(section) {
    var cta = document.getElementById('bar-cta');
    var last = null;
    try { last = localStorage.getItem(LAST_KEY); } catch (e) { /* trình duyệt chặn lưu trữ */ }
    var lastLink = last && document.querySelector('.sidebar-nav a[href="#' + last.replace(/"/g, '') + '"]');
    cta.href = lastLink ? '#' + last : '#/chapter1/chapter1_vi';
    cta.innerHTML = (lastLink ? 'Đọc tiếp' : 'Bắt đầu học') + ICON.arrow;
    if (lastLink) cta.title = lastLink.textContent;
    else cta.removeAttribute('title');

    var done = readDone();
    section.querySelectorAll('.home-row').forEach(function (row) {
      var a = row.querySelector('.home-row-title');
      row.classList.toggle('is-done', !!a && done.indexOf(a.getAttribute('href').slice(1)) >= 0);
    });
    bindBot(section);
    reveal(section);
    countUp(section);
    section.querySelectorAll('.home-tools > a, .home-banner, .home-agent').forEach(function (el) { el.classList.add('spot'); });
    if (window.EasyAgent) EasyAgent.mount(section.querySelector('.home-agent'));

    var filter = section.querySelector('.home-filter');
    if (!filter || filter.dataset.ready) return;
    filter.dataset.ready = '1';
    filter.addEventListener('click', function (e) {
      var btn = e.target.closest('button');
      if (!btn) return;
      var g = btn.dataset.g;
      filter.querySelectorAll('button').forEach(function (b) { b.setAttribute('aria-pressed', b === btn ? 'true' : 'false'); });
      section.querySelectorAll('.home-row').forEach(function (row) { row.hidden = g !== 'all' && row.dataset.g !== g; });
      // Ẩn tiêu đề nguồn (EasyRL / Zhao) khi không còn chương nào của nguồn đó hiện ra.
      section.querySelectorAll('.home-src').forEach(function (head) {
        var any = false;
        for (var el = head.nextElementSibling; el && !el.classList.contains('home-src'); el = el.nextElementSibling) if (!el.hidden) any = true;
        head.hidden = !any;
      });
    });
  }

  function renderPage() {
    var section = document.querySelector('.markdown-section');
    if (!section) return;
    var link = Array.prototype.find.call(document.querySelectorAll('.sidebar-nav a[href^="#/"]'), function (a) {
      return hrefPath(a) === currentPath;
    }) || null;
    // Chờ cột trái có dữ liệu ở lần tải đầu; observer sẽ gọi lại.
    if (section.querySelector('.ch-tools, .pager')) return;
    enhanceSidebar();
    document.body.classList.toggle('is-home', currentPath === '/');
    if (currentPath === '/') {
      document.body.classList.remove('has-toc', 'is-app');
      renderHome(section);
      return;
    }
    // Trang ứng dụng (bản đồ kiến thức): khung chiếm trọn vùng nội dung, không mục lục hay nút bài sau.
    var app = section.querySelector('iframe.app-frame');
    document.body.classList.toggle('is-app', !!app);
    if (app) {
      document.body.classList.remove('has-toc');
      revealInSidebar(link);
      if (!app.dataset.bound) {
        app.dataset.bound = '1';
        app.addEventListener('load', function () { syncFrameTheme(app); });
      }
      syncFrameTheme(app);
      return;
    }
    try { localStorage.setItem(LAST_KEY, currentPath); } catch (e) { /* trình duyệt chặn lưu trữ */ }
    renderPageToc(section);
    renderChapterTools(section, link);
    renderPager(section, link);
    revealInSidebar(link);
    section.querySelectorAll('iframe.viz-frame').forEach(function (f) {
      f.addEventListener('load', function () { syncFrameTheme(f); });
      syncFrameTheme(f);
    });
  }

  window.$docsify = window.$docsify || {};
  window.$docsify.plugins = (window.$docsify.plugins || []).concat(function (hook, vm) {
    hook.mounted(buildBar);
    hook.doneEach(function () {
      if (!document.querySelector('#bar-search .search')) mountSearch();
      resetSearch();
      var nextPath = decodeURIComponent(vm.route.path || '/');
      var sec = document.querySelector('.markdown-section');
      if (sec && nextPath !== currentPath) {
        sec.classList.remove('page-enter');
        void sec.offsetWidth;
        sec.classList.add('page-enter');
      }
      currentPath = nextPath;
      enhanceSidebar();
      renderPage();
      window.dispatchEvent(new Event('scroll'));
    });
    hook.ready(function () {
      var nav = document.querySelector('.sidebar-nav');
      if (nav) {
        nav.addEventListener('click', function (e) {
          var btn = e.target.closest('.sub-toggle');
          if (!btn) return;
          e.preventDefault();
          e.stopPropagation();
          var li = btn.parentElement;
          var open = !li.classList.contains('is-open');
          manuallyOpen[hrefPath(li.querySelector(':scope > a'))] = open;
          li.classList.toggle('is-open', open);
          btn.setAttribute('aria-expanded', open ? 'true' : 'false');
        });
        new MutationObserver(function () {
          enhanceSidebar();
          renderPage();
        }).observe(nav, { childList: true });
      }
    });
  });
})();
