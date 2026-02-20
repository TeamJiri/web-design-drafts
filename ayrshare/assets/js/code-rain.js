/**
 * Code Rain / Matrix Effect — Template 8
 * Developer Terminal archetype — Visual Designer asset
 */
window.initCodeRain = function(containerId, opts) {
  var container = document.getElementById(containerId);
  if (!container) return;

  var settings = Object.assign({
    color: '34,211,238',
    fontSize: 13,
    speed: 0.4,
    density: 0.35,
    opacity: 0.18
  }, opts || {});

  var canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;';
  container.style.position = container.style.position || 'relative';
  container.prepend(canvas);

  var ctx = canvas.getContext('2d');
  var cols, drops, frameCount;

  var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789$><|/\\{}[]();:.+-=*#@!?_~^%&';

  function resize() {
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
    cols = Math.floor(canvas.width / settings.fontSize);
    drops = [];
    for (var i = 0; i < cols; i++) {
      // Randomly activate columns based on density
      drops[i] = Math.random() < settings.density
        ? Math.floor(Math.random() * -(canvas.height / settings.fontSize))
        : null;
    }
    frameCount = 0;
  }

  function draw() {
    // Fade trail
    ctx.fillStyle = 'rgba(13,17,23,0.06)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = settings.fontSize + 'px "IBM Plex Mono", monospace';

    for (var i = 0; i < cols; i++) {
      if (drops[i] === null) {
        // Occasionally start new streams
        if (Math.random() < 0.0008) {
          drops[i] = 0;
        }
        continue;
      }

      var y = drops[i] * settings.fontSize;
      if (y < canvas.height) {
        var ch = chars[Math.floor(Math.random() * chars.length)];

        // Head character — bright
        ctx.fillStyle = 'rgba(' + settings.color + ',0.9)';
        ctx.fillText(ch, i * settings.fontSize, y);

        // Trail characters (already drawn by previous frames via the fade)
        // Occasional bright flash on trail
        if (Math.random() < 0.05) {
          ctx.fillStyle = 'rgba(255,255,255,0.6)';
          ctx.fillText(ch, i * settings.fontSize, y);
        }

        drops[i] += settings.speed;
      } else {
        // Stream reached bottom — reset or deactivate
        if (Math.random() < 0.02) {
          drops[i] = Math.random() < settings.density
            ? 0
            : null;
        } else {
          drops[i] += settings.speed;
        }
      }
    }
  }

  var raf;
  function loop() {
    draw();
    raf = requestAnimationFrame(loop);
  }

  resize();
  loop();

  // Handle resize
  var resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      cancelAnimationFrame(raf);
      resize();
      loop();
    }, 200);
  });

  // Pause when tab is hidden
  document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
      cancelAnimationFrame(raf);
    } else {
      loop();
    }
  });
};
