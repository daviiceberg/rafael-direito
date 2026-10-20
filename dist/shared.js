document.documentElement.classList.add('js');
document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
  }), { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
} else document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));

const shows = {
  piano: { title: 'Piano & voz', display: 'Piano<br>& voz.', mood: 'MAIS PERTO. MAIS PRESENTE.', number: '01 / 03', description: 'A voz em primeiro plano. O piano dando o tom. Um encontro intimista, com espaço para ouvir, sentir e ficar um pouco mais.', context: 'RECEPÇÕES · ENCONTROS · CELEBRAÇÕES', image: 'assets/piano.webp', alt: 'Rafael ao piano em uma apresentação intimista, em preto e branco.' },
  hits: { title: 'Only Hits', display: 'Only<br>Hits.', mood: 'A ENERGIA MUDA DE TOM.', number: '02 / 03', description: 'Aquele refrão que atravessa gerações. Um repertório para cantar junto, levantar da cadeira e transformar o encontro em festa. Com banda ou em formato solo.', context: 'FESTAS · EVENTOS · GRANDES ENCONTROS', image: 'assets/hits-live.webp', alt: 'Rafael e a banda Only Hits em apresentação com luzes coloridas.' },
  elton: { title: 'Tributo a Elton John', display: 'Elton<br>John.', mood: 'UM ÍDOLO. TANTAS EMOÇÕES.', number: '03 / 03', description: 'Uma viagem pelos sucessos de Elton John, na voz e no piano de Rafael Direito. As canções que marcaram gerações em um show para cantar do início ao fim.', context: 'TRIBUTO · TEATROS · SHOWS ESPECIAIS', image: 'assets/elton-live.webp', alt: 'Rafael cantando ao teclado durante o tributo a Elton John.' }
};

const tabs = [...document.querySelectorAll('[data-show]')];
function selectShow(tab, focus = false) {
  const key = tab.dataset.show;
  const show = shows[key];
  tabs.forEach(item => { item.setAttribute('aria-selected', String(item === tab)); item.tabIndex = item === tab ? 0 : -1; });
  const panel = document.getElementById('show-panel');
  panel.setAttribute('aria-labelledby', tab.id);
  document.getElementById('show-name').innerHTML = show.display;
  document.getElementById('show-mood').textContent = show.mood;
  document.getElementById('show-number').textContent = show.number;
  document.getElementById('show-description').textContent = show.description;
  document.getElementById('show-context').textContent = show.context;
  const img = document.getElementById('show-image');
  img.src = show.image; img.alt = show.alt;
  const visual = panel.querySelector('.show-visual');
  visual.dataset.film = key; visual.setAttribute('aria-label', `Assistir à apresentação de ${show.title}`);
  document.getElementById('show-watch').dataset.film = key;
  if (!reducedMotion.matches) panel.animate([{ opacity: 0.35, transform: 'translateY(6px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 350, easing: 'ease-out' });
  if (focus) tab.focus();
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectShow(tab));
  tab.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    if (next !== undefined) { event.preventDefault(); selectShow(tabs[next], true); }
  });
});

const dialog = document.querySelector('.film-dialog');
const player = document.getElementById('film-player');
const filmStatus = document.querySelector('.film-status');
let trigger;
function closeFilm() { dialog.close(); }
document.addEventListener('click', event => {
  const button = event.target.closest('[data-film]');
  if (!button) return;
  trigger = button;
  const key = button.dataset.film;
  document.getElementById('film-title').textContent = shows[key].title;
  filmStatus.textContent = '';
  player.poster = key === 'piano' ? 'assets/piano-live.webp' : shows[key].image;
  player.src = `assets/${key}.mp4`;
  dialog.showModal();
  player.play().catch(() => { filmStatus.textContent = 'Toque no botão de reprodução para assistir.'; });
});
dialog.querySelector('.film-close').addEventListener('click', closeFilm);
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const rect = dialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) closeFilm();
});
dialog.addEventListener('close', () => { player.pause(); player.removeAttribute('src'); player.load(); trigger?.focus({ preventScroll: true }); });
player.addEventListener('error', () => { filmStatus.textContent = 'Não foi possível carregar o vídeo. Tente abrir novamente ou conheça as apresentações no Instagram.'; });
document.addEventListener('visibilitychange', () => { if (document.hidden) player.pause(); });
