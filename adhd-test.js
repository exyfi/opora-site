// ASRS v1.1, 18 items: Part A screener as the WHO checklist shades it, plus DSM-5 group counts. GA gets the result group only.
(() => {
  const form = document.querySelector('.test-form');
  const result = document.querySelector('.test-result');
  const questions = [...form.querySelectorAll('.test-q')];
  const track = (name, params) => window.oporaTrack && oporaTrack(name, params);
  let started = false;
  let band, profile;

  form.addEventListener('change', (event) => {
    if (!started) { started = true; track('adhd_test_start'); }
    event.target.closest('fieldset').querySelector('.test-missing').hidden = true;
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    for (const note of form.querySelectorAll('.test-missing')) note.hidden = true;
    const empty = questions.find((q) => !q.querySelector('input:checked'));
    if (empty) {
      empty.querySelector('.test-missing').hidden = false;
      empty.querySelector('input').focus();
      return;
    }
    const counted = questions.map((q) => Number(q.querySelector('input:checked').value) >= Number(q.dataset.from));
    const screen = counted.slice(0, 6).filter(Boolean).length;
    const groups = { in: 0, hy: 0 };
    questions.forEach((q, i) => { if (counted[i]) groups[q.dataset.group]++; });

    band = screen >= 4 ? 'consistent' : 'below_threshold';
    const inHigh = groups.in >= 5, hyHigh = groups.hy >= 5; // DSM-5: five of nine for adults
    profile = inHigh && hyHigh ? 'combined' : inHigh ? 'inattentive' : hyHigh ? 'hyperactive' : 'none';

    for (const part of result.querySelectorAll('[data-band]')) part.hidden = part.dataset.band !== band;
    for (const part of result.querySelectorAll('[data-type]')) part.hidden = part.dataset.type !== profile;
    for (const slot of result.querySelectorAll('[data-count]')) slot.textContent = screen;
    for (const meter of result.querySelectorAll('.meter')) {
      const n = groups[meter.dataset.group];
      meter.querySelector('[data-n]').textContent = n;
      meter.querySelectorAll('.meter-cell').forEach((cell, i) => cell.classList.toggle('is-on', i < n));
    }
    form.hidden = true;
    result.hidden = false;
    result.focus();
    result.scrollIntoView({ block: 'start' });
    track('adhd_test_complete', { band, profile });
  });

  result.querySelector('[data-install]').addEventListener('click', () => track('adhd_test_install_click', { band, profile }));

  result.querySelector('.test-again').addEventListener('click', () => {
    form.reset();
    result.hidden = true;
    form.hidden = false;
    form.querySelector('input').focus();
  });
})();
