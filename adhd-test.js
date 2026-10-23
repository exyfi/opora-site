// ASRS v1.1 Part A, scored as the WHO checklist shades it. Answers never leave the page; GA gets the band only.
(() => {
  const form = document.querySelector('.test-form');
  const result = document.querySelector('.test-result');
  const threshold = [2, 2, 2, 3, 3, 3]; // Sometimes for questions 1-3, Often for 4-6
  const track = (name, params) => window.oporaTrack && oporaTrack(name, params);
  let started = false;
  let band;

  form.addEventListener('change', (event) => {
    if (!started) { started = true; track('adhd_test_start'); }
    event.target.closest('fieldset').querySelector('.test-missing').hidden = true;
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const values = threshold.map((_, i) => form.elements[`q${i + 1}`].value);
    const empty = values.findIndex((v) => v === '');
    for (const note of form.querySelectorAll('.test-missing')) note.hidden = true;
    if (empty >= 0) {
      const q = document.getElementById(`q${empty + 1}`);
      q.querySelector('.test-missing').hidden = false;
      q.querySelector('input').focus();
      return;
    }
    const count = values.filter((v, i) => Number(v) >= threshold[i]).length;
    band = count >= 4 ? 'consistent' : 'below_threshold';
    for (const part of result.querySelectorAll('[data-band]')) part.hidden = part.dataset.band !== band;
    for (const slot of result.querySelectorAll('[data-count]')) slot.textContent = count;
    form.hidden = true;
    result.hidden = false;
    result.focus();
    track('adhd_test_complete', { band });
  });

  result.querySelector('[data-install]').addEventListener('click', () => track('adhd_test_install_click', { band }));

  result.querySelector('.test-again').addEventListener('click', () => {
    form.reset();
    result.hidden = true;
    form.hidden = false;
    form.querySelector('input').focus();
  });
})();
