// gradient-blobs.js — Smooth animated color blobs for light backgrounds
(function() {
  'use strict';
  window.initGradientBlobs = function(containerId, opts) {
    opts = opts || {};
    var container = document.getElementById(containerId);
    if (!container) return;
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    canvas.style.display = 'block';
    container.appendChild(canvas);

    var blobs = opts.blobs || [
      { x: 0.25, y: 0.3, r: 350, color: '79,70,229', speed: 0.0006 },
      { x: 0.7, y: 0.5, r: 300, color: '59,130,246', speed: 0.0008 },
      { x: 0.5, y: 0.75, r: 280, color: '6,182,212', speed: 0.001 }
    ];
    var time = 0;
    var raf;
    var dpr = window.devicePixelRatio || 1;
    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var w, h;

    function resize() {
      w = container.offsetWidth;
      h = container.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      time += 1;

      for (var i = 0; i < blobs.length; i++) {
        var b = blobs[i];
        var bx = w * b.x + Math.sin(time * b.speed + i * 1.7) * w * 0.08;
        var by = h * b.y + Math.cos(time * b.speed * 1.3 + i * 2.3) * h * 0.08;
        var gradient = ctx.createRadialGradient(bx, by, 0, bx, by, b.r);
        gradient.addColorStop(0, 'rgba(' + b.color + ',0.18)');
        gradient.addColorStop(0.5, 'rgba(' + b.color + ',0.08)');
        gradient.addColorStop(1, 'rgba(' + b.color + ',0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, w, h);
      }

      if (!reducedMotion) {
        raf = requestAnimationFrame(draw);
      }
    }

    window.addEventListener('resize', resize);
    resize();
    draw();

    return {
      destroy: function() {
        cancelAnimationFrame(raf);
        window.removeEventListener('resize', resize);
        if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
      }
    };
  };
})();
