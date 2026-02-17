// gsap-text-reveal.js — Scroll-triggered word-by-word text reveal
(function() {
  'use strict';
  window.initTextReveal = function(selector, opts) {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);
    opts = opts || {};
    var stagger = opts.stagger || 0.06;
    var y = opts.y || 35;
    var duration = opts.duration || 0.7;

    document.querySelectorAll(selector).forEach(function(el) {
      // Preserve HTML structure (like <span> and <br>)
      var html = el.innerHTML;
      // Split on word boundaries but preserve HTML tags
      var result = '';
      var inTag = false;
      var currentWord = '';

      for (var i = 0; i < html.length; i++) {
        var ch = html[i];
        if (ch === '<') {
          // Flush current word
          if (currentWord.trim()) {
            result += '<span class="word-reveal" style="display:inline-block;overflow:hidden;vertical-align:top;">' +
              '<span class="word-reveal__inner" style="display:inline-block;">' + currentWord + '</span></span>';
          } else if (currentWord) {
            result += currentWord;
          }
          currentWord = '';
          inTag = true;
          currentWord = ch;
        } else if (ch === '>') {
          currentWord += ch;
          result += currentWord;
          currentWord = '';
          inTag = false;
        } else if (inTag) {
          currentWord += ch;
        } else if (ch === ' ' || ch === '\n') {
          if (currentWord.trim()) {
            result += '<span class="word-reveal" style="display:inline-block;overflow:hidden;vertical-align:top;">' +
              '<span class="word-reveal__inner" style="display:inline-block;">' + currentWord + '</span></span> ';
          } else {
            result += currentWord + ' ';
          }
          currentWord = '';
        } else {
          currentWord += ch;
        }
      }
      // Flush remaining
      if (currentWord.trim()) {
        result += '<span class="word-reveal" style="display:inline-block;overflow:hidden;vertical-align:top;">' +
          '<span class="word-reveal__inner" style="display:inline-block;">' + currentWord + '</span></span>';
      } else if (currentWord) {
        result += currentWord;
      }

      el.innerHTML = result;

      var inners = el.querySelectorAll('.word-reveal__inner');
      gsap.set(inners, { y: y, opacity: 0 });
      gsap.to(inners, {
        y: 0,
        opacity: 1,
        duration: duration,
        stagger: stagger,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: opts.start || 'top 85%',
          toggleActions: 'play none none none'
        }
      });
    });
  };
})();
