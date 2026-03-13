document.querySelectorAll('[data-slider]').forEach((slider) => {
  const track = slider.querySelector('[data-slider-track]');
  const next = slider.querySelector('[data-next]');
  const prev = slider.querySelector('[data-prev]');
  if (!track) return;
  const step = () => track.clientWidth * 0.9;
  next?.addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));
  prev?.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
  if (slider.dataset.autoplay === 'true') {
    setInterval(() => track.scrollBy({ left: step(), behavior: 'smooth' }), 4000);
  }
});
