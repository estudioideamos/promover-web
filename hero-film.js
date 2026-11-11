const film=document.querySelector('.hero-film'),toggle=document.querySelector('.hero-film-toggle');
if(film&&toggle){
 const motion=matchMedia('(prefers-reduced-motion: reduce)');let visible=false,userPaused=false,loaded=false;
 const allow=()=>!motion.matches&&!navigator.connection?.saveData;
 const sync=()=>{if(visible&&!document.hidden&&!userPaused&&allow()){if(!loaded){film.src=film.dataset.src;loaded=true;film.load()}film.play().catch(()=>{toggle.hidden=false;toggle.setAttribute('aria-pressed','true');toggle.setAttribute('aria-label','Reproducir video de productos')})}else film.pause()};
 film.muted=true;film.addEventListener('playing',()=>{film.classList.add('ready');toggle.hidden=false;toggle.setAttribute('aria-pressed','false');toggle.setAttribute('aria-label','Pausar video de productos')});film.addEventListener('pause',()=>{toggle.setAttribute('aria-pressed','true');toggle.setAttribute('aria-label','Reproducir video de productos')});film.addEventListener('error',()=>{film.classList.remove('ready');toggle.hidden=true});
 toggle.addEventListener('click',()=>{userPaused=!film.paused;if(!userPaused){visible=true;if(motion.matches){if(!loaded){film.src=film.dataset.src;loaded=true}film.play().catch(()=>{})}else sync()}else film.pause()});
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync()},{threshold:.15}).observe(film);document.addEventListener('visibilitychange',sync);motion.addEventListener('change',()=>{if(motion.matches){film.classList.remove('ready');toggle.hidden=true}sync()});
}
