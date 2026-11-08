(() => {
  'use strict';
  const countdown = document.querySelector('[data-wedding-countdown]');
  const eventDate = document.getElementById('wedding-start');
  if (!countdown || !eventDate) return;

  // The explicit +07:00 offset keeps the wedding time fixed for guests abroad.
  const deadline = Date.parse(eventDate.dateTime);
  if (!Number.isFinite(deadline)) {
    countdown.hidden = true;
    return;
  }
  const fields = [...countdown.querySelectorAll('[data-countdown-value]')];
  const status = document.getElementById('countdown-status');
  const khmerNumber = number => String(number).padStart(2, '0')
    .replace(/\d/g, digit => '០១២៣៤៥៦៧៨៩'[Number(digit)]);
  let timer = 0;

  function updateCountdown() {
    const remaining = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
    const values = {
      days: Math.floor(remaining / 86400),
      hours: Math.floor(remaining % 86400 / 3600),
      minutes: Math.floor(remaining % 3600 / 60),
      seconds: remaining % 60,
    };
    fields.forEach(field => {
      const text = khmerNumber(values[field.dataset.countdownValue]);
      if (field.textContent !== text) field.textContent = text;
    });
    countdown.dataset.countdownState = remaining ? 'upcoming' : 'arrived';
    const message = remaining ? 'រហូតដល់ថ្ងៃដ៏ពិសេសរបស់យើង' : 'ថ្ងៃមង្គលរបស់យើងបានមកដល់ហើយ';
    if (status && status.textContent !== message) status.textContent = message;
    if (!remaining && timer) {
      clearInterval(timer);
      timer = 0;
    }
  }

  updateCountdown();
  if (deadline > Date.now()) timer = setInterval(updateCountdown, 1000);
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) updateCountdown();
  });
})();
