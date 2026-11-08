// Chạy Python trong trình duyệt bằng Pyodide, tách khỏi luồng giao diện.
// Giao thức: {type:'init', base, files} | {type:'run', id, code, scope} | {type:'reset', scope}
// Trả về:    {type:'ready'} | {type:'status', text} | {type:'out', id, text, err} | {type:'img', id, data} | {type:'done', id, error}
var PYODIDE = 'https://cdn.jsdelivr.net/pyodide/v0.27.7/full/';
importScripts(PYODIDE + 'pyodide.js');

var py = null;
var QUIET = { messageCallback: function () {}, errorCallback: function () {} };
var ready = null;
var current = null;

function post(msg) { self.postMessage(msg); }

async function init(base, files) {
  post({ type: 'status', text: 'Đang tải Python (khoảng 10 MB, chỉ lần đầu)…' });
  py = await loadPyodide({ indexURL: PYODIDE });
  py.setStdout({ batched: function (t) { if (current) post({ type: 'out', id: current, text: t + '\n' }); } });
  py.setStderr({ batched: function (t) { if (current) post({ type: 'out', id: current, text: t + '\n', err: true }); } });
  post({ type: 'status', text: 'Đang tải numpy và matplotlib…' });
  await py.loadPackage(['numpy', 'matplotlib'], QUIET);
  // Chép các mô-đun dùng chung (docs/code/py) vào thư mục làm việc để import được.
  for (var i = 0; i < files.length; i++) {
    var res = await fetch(base + files[i]);
    if (!res.ok) throw new Error('Không tải được ' + files[i]);
    var path = '/home/pyodide/' + files[i];
    var dir = path.slice(0, path.lastIndexOf('/'));
    py.FS.mkdirTree(dir);
    py.FS.writeFile(path, await res.text());
  }
  py.runPython([
    'import os, sys, io, base64',
    'os.environ["MPLBACKEND"] = "AGG"',
    'import matplotlib',
    'matplotlib.use("AGG")',
    'import matplotlib.pyplot as plt',
    'plt.show = lambda *a, **k: None',
    'plt.rcParams.update({"figure.dpi": 110, "font.size": 9})',
    '_scopes = {}',
    'def _scope(name):',
    '    if name not in _scopes:',
    '        _scopes[name] = {"__name__": "__main__"}',
    '    return _scopes[name]',
    'def _figures():',
    '    out = []',
    '    for n in plt.get_fignums():',
    '        buf = io.BytesIO()',
    '        plt.figure(n).savefig(buf, format="png", bbox_inches="tight")',
    '        out.append(base64.b64encode(buf.getvalue()).decode())',
    '    plt.close("all")',
    '    return out'
  ].join('\n'));
  post({ type: 'ready' });
}

async function run(msg) {
  try {
    await ready;
    current = msg.id;
    // Gói ngoài bộ cài sẵn của Pyodide (vd. gymnasium) cài qua micropip.
    if (/^\s*(import|from)\s+gymnasium/m.test(msg.code) && !self._gym) {
      post({ type: 'status', text: 'Đang cài gymnasium…' });
      await py.loadPackage('micropip', QUIET);
      current = null;                 // micropip in log "Loading …": bỏ qua
      await py.pyimport('micropip').install('gymnasium');
      current = msg.id;
      // Pyodide không có _multiprocessing; gymnasium chỉ cần nó cho môi trường vector chạy song song,
      // nên một mô-đun giả là đủ để import.
      py.runPython([
        'import sys, types',
        'm = types.ModuleType("_multiprocessing")',
        'm.SemLock = type("SemLock", (), {"SEM_VALUE_MAX": 2**31 - 1})',
        'm.sem_unlink = lambda name: None',
        'm.flags = {}',
        'sys.modules.setdefault("_multiprocessing", m)'
      ].join('\n'));
      self._gym = true;
    }
    await py.loadPackagesFromImports(msg.code, QUIET);
    var scope = py.globals.get('_scope')(msg.scope);
    await py.runPythonAsync(msg.code, { globals: scope });
    scope.destroy();
    var figs = py.globals.get('_figures')().toJs();
    figs.forEach(function (d) { post({ type: 'img', id: msg.id, data: d }); });
    post({ type: 'done', id: msg.id });
  } catch (e) {
    try { py && py.globals.get('plt').close('all'); } catch (_) {}
    post({ type: 'done', id: msg.id, error: String(e && e.message || e) });
  }
}

var queue = Promise.resolve();
self.onmessage = function (e) {
  var msg = e.data;
  if (msg.type === 'init') {
    ready = init(msg.base, msg.files).catch(function (err) {
      post({ type: 'fatal', text: String(err && err.message || err) });
      throw err;
    });
  } else if (msg.type === 'run') {
    queue = queue.then(function () { return run(msg); });
  } else if (msg.type === 'reset') {
    queue = queue.then(async function () {
      await ready;
      py.runPython('_scopes.pop(' + JSON.stringify(msg.scope) + ', None)');
    });
  }
};
