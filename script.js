(function () {
  'use strict';

  function init() {
    var root = document.documentElement;
    var toggle = document.getElementById('theme-toggle');
    var printBtn = document.getElementById('print-btn');
    var meta = document.querySelector('meta[name="theme-color"]');

    function currentTheme() {
      return root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    }

    function syncMeta(theme) {
      if (meta) {
        meta.setAttribute('content', theme === 'dark' ? '#0e1014' : '#ffffff');
      }
    }

    function applyTheme(theme, persist) {
      root.setAttribute('data-theme', theme);
      syncMeta(theme);
      if (persist) {
        try { localStorage.setItem('theme', theme); } catch (e) { /* приватный режим */ }
      }
    }

    syncMeta(currentTheme());

    if (toggle) {
      toggle.addEventListener('click', function () {
        applyTheme(currentTheme() === 'dark' ? 'light' : 'dark', true);
      });
    } else {
      console.warn('[resume] #theme-toggle не найден — переключатель темы отключён');
    }

    if (printBtn) {
      printBtn.addEventListener('click', function () {
        window.print();
      });
    } else {
      console.warn('[resume] #print-btn не найден — кнопка PDF отключена');
    }

    if (window.matchMedia) {
      var mq = window.matchMedia('(prefers-color-scheme: dark)');
      var onChange = function (e) {
        var saved = null;
        try { saved = localStorage.getItem('theme'); } catch (err) {}
        if (!saved) applyTheme(e.matches ? 'dark' : 'light', false);
      };
      if (mq.addEventListener) {
        mq.addEventListener('change', onChange);
      } else if (mq.addListener) {
        mq.addListener(onChange); // Safari < 14
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();