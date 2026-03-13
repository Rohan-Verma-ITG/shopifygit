document.documentElement.classList.add('js');
document.querySelectorAll('[data-faq-toggle]').forEach((button) => {
  button.addEventListener('click', () => {
    const content = document.getElementById(button.getAttribute('aria-controls'));
    const expanded = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(!expanded));
    content.hidden = expanded;
  });
});
