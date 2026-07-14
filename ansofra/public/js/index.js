function toggleNav(){
  document.getElementById('navMobile').classList.toggle('open');
}

document.addEventListener('click', function(e){
  const mob = document.getElementById('navMobile');
  if(mob.classList.contains('open') && !mob.contains(e.target) && !e.target.closest('.nav-hamburger')){
    mob.classList.remove('open');
  }
});

function formatStat(val){
  if(val>=1000000) return (val/1000000).toFixed(0)+'M+';
  if(val>=1000) return (val/1000).toFixed(0)+'K+';
  return val.toLocaleString()+'+';
}

function animateCounter(el){
  const target = parseInt(el.dataset.target,10);
  const duration = 1800;
  const start = performance.now();
  function step(now){
    const elapsed = now - start;
    const progress = Math.min(elapsed/duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = formatStat(Math.round(ease * target));
    if(progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

const counters = document.querySelectorAll('.stat-value[data-target]');
let observed = false;
const obs = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if(en.isIntersecting && !observed){
      observed = true;
      counters.forEach(animateCounter);
    }
  });
},{threshold:.3});
if(counters.length) obs.observe(counters[0]);