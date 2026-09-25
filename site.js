// The one opt-in joy moment (a cast weirdo hops) and the signature mood swap. Nothing runs on its own.
(() => {
  const calm = matchMedia('(prefers-reduced-motion: reduce)');
  const dark = matchMedia('(prefers-color-scheme: dark)');

  // The app's award-sheet hops (DESIGN.md): spring(response .28, damping .55) up 280 ms, (.28, .7) down 320 ms, three times.
  const spring = (damping, t) => {
    const w0 = 2 * Math.PI / 0.28, wd = w0 * Math.sqrt(1 - damping * damping);
    return 1 - Math.exp(-damping * w0 * t) * (Math.cos(wd * t) + damping * w0 / wd * Math.sin(wd * t));
  };
  const hops = [];
  for (let i = 0; i < 3; i++) {
    for (let ms = 0; ms < 280; ms += 20) hops.push(-11 * spring(0.55, ms / 1000));
    const top = -11 * spring(0.55, 0.28);
    for (let ms = 0; ms < 320; ms += 20) hops.push(top * (1 - spring(0.7, ms / 1000)));
  }
  hops.push(0);
  const frames = hops.map((y) => ({ transform: `translateY(${y.toFixed(2)}%)` }));

  function cheer(button) {
    const img = button.querySelector('img');
    if (img.getAnimations().length) return;
    const d = button.dataset;
    if (!d.rest) { d.rest = img.getAttribute('src'); d.restAlt = img.alt; }
    // Without motion a second tap swaps back, so every tap still shows a change.
    const back = calm.matches && img.getAttribute('src') === d.mood;
    const [src, alt] = back ? [d.rest, d.restAlt] : [d.mood, d.moodAlt || img.alt];
    if (!calm.matches) img.animate(frames, { duration: 1800 });
    const next = new Image();
    next.src = src;
    next.decode().catch(() => {}).then(() => { img.src = src; img.alt = alt; });
  }

  // A 4 s Higgsfield clip of the weirdo acting out its quirk. It starts and ends on the resting art, so nothing jumps.
  function act(button) {
    let clip = button.querySelector('video');
    if (clip && !clip.paused) return;
    if (!clip) {
      clip = document.createElement('video');
      clip.muted = true;
      clip.playsInline = true;
      clip.setAttribute('aria-hidden', 'true');
      clip.src = button.dataset.clip;
      clip.addEventListener('playing', () => button.classList.add('is-playing'));
      clip.addEventListener('ended', () => button.classList.remove('is-playing'));
      button.append(clip);
    }
    clip.currentTime = 0;
    // AbortError means the browser paused it (hidden tab, power saving): only a clip that cannot play falls back to the hop.
    clip.play().catch((error) => { if (error.name !== 'AbortError') cheer(button); });
  }

  function swapFace(face) {
    face.setAttribute('aria-pressed', face.getAttribute('aria-pressed') !== 'true');
    for (const img of face.querySelectorAll('img[data-alt]')) [img.alt, img.dataset.alt] = [img.dataset.alt, img.alt];
  }

  document.addEventListener('click', (event) => {
    const portrait = event.target.closest('.cast-portrait');
    // The clip carries the light well behind the weirdo, so dark mode and Reduce Motion keep the hop and the mood swap.
    if (portrait) return portrait.dataset.clip && !calm.matches && !dark.matches ? act(portrait) : cheer(portrait);
    const face = event.target.closest('.signature-face');
    if (face) swapFace(face);
  });
  // iOS Safari applies :active on touch only when some touch listener exists.
  document.addEventListener('touchstart', () => {}, { passive: true });

  // The screens rail is a tab stop only while it scrolls (phones); on wide screens it is a static grid.
  const rails = document.querySelectorAll('.screens-rail[tabindex]');
  const railStops = () => rails.forEach((rail) => { rail.tabIndex = rail.scrollWidth > rail.clientWidth ? 0 : -1; });
  railStops();
  matchMedia('(min-width: 48rem)').addEventListener('change', railStops);
})();
