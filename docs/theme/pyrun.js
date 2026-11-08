// Khối code chạy được: viết ```pyrun trong Markdown. Khối hiện như code Python bình thường,
// có thêm nút Chạy / Sửa / Khôi phục / Dừng và ô kết quả (chữ và hình matplotlib).
// Python chạy bằng Pyodide trong Web Worker (theme/pyrun-worker.js), chỉ tải khi bấm Chạy lần đầu.
// Các khối trên cùng một trang dùng chung biến, như các ô của notebook: chạy một khối
// sẽ tự chạy trước các khối phía trên chưa chạy.
(function () {
  if (window.Prism && Prism.languages.python) Prism.languages.pyrun = Prism.languages.python;

  var worker = null;
  var waiting = {};      // id -> {block, resolve}
  var seq = 0;
  var scope = '';
  var statusEl = null;   // ô trạng thái của khối đang chờ Python khởi động

  function getWorker() {
    if (worker) return worker;
    worker = new Worker('theme/pyrun-worker.js');
    worker.onmessage = onMessage;
    worker.postMessage({ type: 'init', base: new URL('code/py/', location.href).href, files: FILES });
    return worker;
  }

  var FILES = [];
  var filesLoaded = fetch('code/py/files.json').then(function (r) { return r.json(); })
    .then(function (list) { FILES = list; }).catch(function () { FILES = []; });

  function onMessage(e) {
    var m = e.data;
    var job = waiting[m.id];
    if (m.type === 'status' || m.type === 'ready' || m.type === 'fatal') {
      Object.keys(waiting).forEach(function (k) {
        var b = waiting[k].block;
        b.status.textContent = m.type === 'ready' ? 'Đang chạy…' : m.text;
        if (m.type === 'fatal') { finish(k, 'Không khởi động được Python: ' + m.text); }
      });
      return;
    }
    if (!job) return;
    var b = job.block;
    if (m.type === 'out') {
      var span = document.createElement('span');
      if (m.err) span.className = 'pyrun-err';
      span.textContent = m.text;
      b.text.appendChild(span);
      b.out.hidden = false;
    } else if (m.type === 'img') {
      var img = document.createElement('img');
      img.src = 'data:image/png;base64,' + m.data;
      img.alt = 'Hình do đoạn code vẽ';
      b.imgs.appendChild(img);
      b.out.hidden = false;
    } else if (m.type === 'done') {
      finish(m.id, m.error);
    }
  }

  function cleanError(msg) {
    // Bỏ các dòng traceback thuộc nội bộ Pyodide, chỉ giữ phần thuộc code của trang.
    var lines = msg.split('\n');
    var start = 0;
    for (var i = 0; i < lines.length; i++) if (/File "<exec>"/.test(lines[i])) { start = i; break; }
    var kept = lines.slice(start).filter(function (l) { return !/\/lib\/python3[^/]*\/_pyodide|pyodide\.asm/.test(l); });
    return (start ? 'Traceback (most recent call last):\n' : '') + kept.join('\n').trim();
  }

  function finish(id, error) {
    var job = waiting[id];
    if (!job) return;
    delete waiting[id];
    var b = job.block;
    b.running = false;
    b.el.classList.remove('is-running');
    b.stop.hidden = true;
    if (error) {
      var span = document.createElement('span');
      span.className = 'pyrun-err';
      span.textContent = cleanError(error) + '\n';
      b.text.appendChild(span);
      b.out.hidden = false;
      b.state = 'error';
      b.status.textContent = 'Có lỗi';
    } else {
      b.state = 'ran';
      b.status.textContent = 'Xong · ' + ((performance.now() - b.t0) / 1000).toFixed(1) + ' s';
    }
    job.resolve(!error);
  }

  function code(b) { return b.editing ? b.area.value : b.source; }

  function runOne(b) {
    return filesLoaded.then(function () {
      return new Promise(function (resolve) {
        var id = 'r' + (++seq);
        b.text.textContent = '';
        b.imgs.textContent = '';
        b.out.hidden = true;
        b.running = true;
        b.t0 = performance.now();
        b.el.classList.add('is-running');
        b.stop.hidden = false;
        b.status.textContent = worker ? 'Đang chạy…' : 'Đang khởi động Python…';
        waiting[id] = { block: b, resolve: resolve };
        getWorker().postMessage({ type: 'run', id: id, code: code(b), scope: scope });
      });
    });
  }

  function runUpTo(blocks, idx) {
    var chain = Promise.resolve(true);
    blocks.forEach(function (b, i) {
      if (i > idx) return;
      if (i < idx && b.state === 'ran') return;
      chain = chain.then(function (ok) {
        if (!ok) return false;
        if (i < idx) b.status.textContent = 'Chạy trước vì khối dưới cần';
        return runOne(b);
      });
    });
    return chain;
  }

  function stopAll(blocks) {
    if (worker) { worker.terminate(); worker = null; }
    Object.keys(waiting).forEach(function (k) { finish(k, 'Đã dừng. Biến của trang đã bị xóa, chạy lại sẽ bắt đầu từ đầu.'); });
    blocks.forEach(function (b) { if (b.state === 'ran') { b.state = 'idle'; b.status.textContent = ''; } });
  }

  function button(label, cls) {
    var el = document.createElement('button');
    el.type = 'button';
    el.className = 'pyrun-btn ' + (cls || '');
    el.textContent = label;
    return el;
  }

  function enhance(pre, blocks, idx) {
    var codeEl = pre.querySelector('code');
    var b = { el: null, pre: pre, source: codeEl.textContent.replace(/\n$/, ''), state: 'idle', editing: false };
    var wrap = document.createElement('div');
    wrap.className = 'pyrun';
    pre.parentNode.insertBefore(wrap, pre);
    wrap.appendChild(pre);
    b.el = wrap;

    var bar = document.createElement('div');
    bar.className = 'pyrun-bar';
    var run = button('▶ Chạy', 'is-primary');
    var edit = button('Sửa');
    var reset = button('Khôi phục');
    b.stop = button('■ Dừng', 'is-stop');
    b.stop.hidden = true;
    reset.hidden = true;
    b.status = document.createElement('span');
    b.status.className = 'pyrun-status';
    b.status.setAttribute('role', 'status');
    [run, edit, reset, b.stop, b.status].forEach(function (x) { bar.appendChild(x); });
    wrap.appendChild(bar);

    b.out = document.createElement('div');
    b.out.className = 'pyrun-out';
    b.out.hidden = true;
    b.text = document.createElement('pre');
    b.imgs = document.createElement('div');
    b.imgs.className = 'pyrun-imgs';
    b.out.appendChild(b.text);
    b.out.appendChild(b.imgs);
    wrap.appendChild(b.out);

    b.area = document.createElement('textarea');
    b.area.className = 'pyrun-area';
    b.area.spellcheck = false;
    b.area.setAttribute('aria-label', 'Sửa code Python');
    function fit() { b.area.style.height = 'auto'; b.area.style.height = (b.area.scrollHeight + 2) + 'px'; }
    b.area.addEventListener('input', fit);
    b.area.addEventListener('keydown', function (e) {
      if (e.key === 'Tab' && !e.shiftKey) {
        e.preventDefault();
        var s = b.area.selectionStart;
        b.area.setRangeText('    ', s, b.area.selectionEnd, 'end');
        fit();
      } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        run.click();
      }
    });

    run.addEventListener('click', function () {
      if (blocks.some(function (x) { return x.running; })) return;
      runUpTo(blocks, idx);
    });
    edit.addEventListener('click', function () {
      if (b.editing) return;
      b.editing = true;
      b.area.value = b.source;
      pre.hidden = true;
      wrap.insertBefore(b.area, bar);
      fit();
      b.area.focus();
      edit.hidden = true;
      reset.hidden = false;
    });
    reset.addEventListener('click', function () {
      b.editing = false;
      b.area.remove();
      pre.hidden = false;
      edit.hidden = false;
      reset.hidden = true;
    });
    b.stop.addEventListener('click', function () { stopAll(blocks); });
    return b;
  }

  // Mã nguồn nhúng bằng [file.py](... ':include :type=code') hiện dưới dạng khối thu gọn.
  function collapseIncludes() {
    var pres = document.querySelectorAll('.markdown-section pre[data-lang="py"]');
    Array.prototype.forEach.call(pres, function (pre) {
      pre.setAttribute('data-lang', 'python');
      var lines = pre.textContent.split('\n').length;
      var name = (pre.textContent.match(/^\s*(?:class|def)\s+(\w+)/m) || [])[1];
      var det = document.createElement('details');
      det.className = 'code-include';
      var sum = document.createElement('summary');
      sum.textContent = 'Mã nguồn' + (name ? ' của ' + name : '') + ' · ' + lines + ' dòng';
      pre.parentNode.insertBefore(det, pre);
      det.appendChild(sum);
      det.appendChild(pre);
    });
  }

  function plugin(hook, vm) {
    hook.doneEach(collapseIncludes);
    hook.doneEach(function () {
      var pres = document.querySelectorAll('.markdown-section pre[data-lang="pyrun"]');
      if (!pres.length) return;
      // Mỗi lần mở trang là một không gian biến mới.
      scope = vm.route.path + '#' + Date.now();
      var blocks = [];
      Array.prototype.forEach.call(pres, function (pre, i) {
        pre.setAttribute('data-lang', 'python');
        blocks.push(enhance(pre, blocks, i));
      });
    });
  }

  window.$docsify = window.$docsify || {};
  window.$docsify.plugins = [].concat(window.$docsify.plugins || [], plugin);
})();
