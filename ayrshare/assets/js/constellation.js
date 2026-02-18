// constellation.js — Connected node graph for dark developer backgrounds
(function() {
  'use strict';
  window.initConstellation = function(containerId, opts) {
    opts = opts || {};
    var container = document.getElementById(containerId);
    if (!container) return;
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    canvas.style.display = 'block';
    container.appendChild(canvas);

    var count = opts.count || 80;
    var color = opts.color || '124,58,237';
    var accentColor = opts.accentColor || '6,182,212';
    var lineDistance = opts.lineDistance || 150;
    var speed = opts.speed || 0.3;
    var dpr = window.devicePixelRatio || 1;
    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var particles = [];
    var mouse = { x: -9999, y: -9999 };
    var raf, w, h;

    function resize() {
      w = container.offsetWidth;
      h = container.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      createParticles();
    }

    function createParticles() {
      particles = [];
      for (var i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * speed,
          vy: (Math.random() - 0.5) * speed,
          r: Math.random() * 2 + 0.5,
          accent: Math.random() < 0.3
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);

      // Draw lines first
      for (var i = 0; i < particles.length; i++) {
        for (var j = i + 1; j < particles.length; j++) {
          var dx = particles[i].x - particles[j].x;
          var dy = particles[i].y - particles[j].y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < lineDistance) {
            var alpha = (1 - dist / lineDistance) * 0.25;
            var useAccent = particles[i].accent || particles[j].accent;
            ctx.strokeStyle = 'rgba(' + (useAccent ? accentColor : color) + ',' + alpha + ')';
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }

        // Mouse attraction
        var mdx = particles[i].x - mouse.x;
        var mdy = particles[i].y - mouse.y;
        var mDist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mDist < 200) {
          particles[i].x += mdx * 0.008;
          particles[i].y += mdy * 0.008;
        }
      }

      // Draw dots
      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.accent
          ? 'rgba(' + accentColor + ',0.8)'
          : 'rgba(' + color + ',0.6)';
        ctx.fill();
      }

      if (!reducedMotion) raf = requestAnimationFrame(draw);
    }

    container.addEventListener('mousemove', function(e) {
      var rect = container.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });
    container.addEventListener('mouseleave', function() {
      mouse.x = -9999; mouse.y = -9999;
    });

    window.addEventListener('resize', resize);
    resize();
    if (reducedMotion) { draw(); cancelAnimationFrame(raf); }
    else { draw(); }

    return {
      destroy: function() {
        cancelAnimationFrame(raf);
        if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
      }
    };
  };
})();
