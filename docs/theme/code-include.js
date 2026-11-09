// Mã nguồn nhúng bằng [file.py](... ':include :type=code :fragment=...') trên các trang Code
// được thu gọn trong một khối <details> để trang không quá dài.
(function () {
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
  window.$docsify = window.$docsify || {};
  window.$docsify.plugins = [].concat(window.$docsify.plugins || [], function (hook) {
    hook.doneEach(collapseIncludes);
  });
})();
