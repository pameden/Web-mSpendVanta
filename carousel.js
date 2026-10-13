// Screenshot carousel on the home page: back/forward buttons, dots, arrow keys and swipe.
document.querySelectorAll('.carousel').forEach(function (carousel) {
  var track = carousel.querySelector('.carousel-track');
  var slides = Array.prototype.slice.call(track.children);
  var prev = carousel.querySelector('.carousel-button.prev');
  var next = carousel.querySelector('.carousel-button.next');
  var dotsBox = carousel.querySelector('.carousel-dots');
  var current = 0;   // the slide showing now
  var target = 0;    // the slide being scrolled to, so quick clicks keep counting
  var settle;

  var dots = slides.map(function (slide, i) {
    var dot = document.createElement('button');
    dot.type = 'button';
    dot.setAttribute('aria-label', 'Show screenshot ' + (i + 1) + ' of ' + slides.length);
    dot.addEventListener('click', function () { show(i); });
    dotsBox.appendChild(dot);
    return dot;
  });

  function show(i) {
    i = Math.max(0, Math.min(slides.length - 1, i));
    target = i;
    track.scrollTo({ left: i * track.clientWidth });
  }

  function update() {
    current = Math.round(track.scrollLeft / track.clientWidth);
    dots.forEach(function (dot, i) { dot.setAttribute('aria-current', i === current ? 'true' : 'false'); });
    slides.forEach(function (slide, i) { slide.setAttribute('aria-hidden', i === current ? 'false' : 'true'); });
    prev.disabled = current === 0;
    next.disabled = current === slides.length - 1;
    // Once scrolling stops (including a swipe), carry on from where it landed.
    clearTimeout(settle);
    settle = setTimeout(function () { target = current; }, 150);
  }

  prev.addEventListener('click', function () { show(target - 1); });
  next.addEventListener('click', function () { show(target + 1); });
  track.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') { e.preventDefault(); show(target - 1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); show(target + 1); }
  });
  track.addEventListener('scroll', function () { window.requestAnimationFrame(update); }, { passive: true });
  window.addEventListener('resize', function () { show(current); });
  update();
});
