const categories = {
 textil:{title:'Textil',image:'textil',description:'Prendas que llevan tu identidad. Pensamos la indumentaria como una extensión de tu marca: desde el concepto y la moldería hasta los detalles de terminación.',tags:['Indumentaria','Identidad de marca','Moldería propia']},
 marroquineria:{title:'Marroquinería',image:'cuero',description:'Objetos para acompañar todos los días. Desarrollamos propuestas de marroquinería para llevar la identidad de tu empresa a piezas funcionales y cuidadas.',tags:['Bolsos y accesorios','Desarrollo a medida','Funcionalidad']},
 especiales:{title:'Desarrollos especiales',image:'objetos',description:'Hay ideas que necesitan su propia forma. Integramos diseño, moldería y fabricación para desarrollar una propuesta particular para tu empresa, tu campaña o tu evento.',tags:['Diseño a medida','Fabricación propia','Proyectos especiales']},
 boligrafos:{title:'Bolígrafos',image:'objetos',description:'Un detalle cotidiano puede ser un punto de contacto con tu marca. Consultanos por propuestas de escritura para tus acciones de comunicación y regalos empresarios.',tags:['Escritura','Regalos empresarios','Comunicación']},
 promociones:{title:'Promociones',image:'hero',description:'Acompañamos el objetivo de cada acción con una propuesta de artículos promocionales pensada para tu público y el mensaje que querés transmitir.',tags:['Acciones de marca','Eventos','Campañas']},
 hogar:{title:'Hogar y tiempo libre',image:'objetos',description:'Tu marca también puede formar parte de los momentos de disfrute. Buscamos objetos útiles y cercanos para acompañar la vida cotidiana de quienes los reciben.',tags:['Vida cotidiana','Tiempo libre','Regalos']},
 sustentable:{title:'Sustentable',image:'hero',description:'Una categoría para explorar alternativas de materiales y objetos reutilizables según las necesidades de tu proyecto. Consultanos por las opciones disponibles y sus características.',tags:['Reutilizables','Selección de materiales','Propuestas a medida']}
};
for(const key of ['boligrafos','promociones','hogar','sustentable']) categories[key].image=key;
const menu=document.querySelector('.menu-toggle'); const nav=document.querySelector('#navigation');
function closeMenu(){menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Abrir menú');nav.classList.remove('open');}
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Cerrar menú':'Abrir menú');nav.classList.toggle('open',open)});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu()});
const dialog=document.querySelector('#category-dialog');let lastCategory;
document.querySelectorAll('[data-category]').forEach(button=>button.addEventListener('click',()=>{
 const c=categories[button.dataset.category];lastCategory=button;
 document.querySelector('#dialog-title').textContent=c.title;document.querySelector('#dialog-description').textContent=c.description;
 const img=document.querySelector('#dialog-image');img.src=`assets/${c.image}.webp`;img.alt=`Imagen ilustrativa de ${c.title}`;
 document.querySelector('#dialog-tags').replaceChildren(...c.tags.map(t=>{const s=document.createElement('span');s.textContent=t;return s}));
 document.querySelector('#dialog-cta').href='https://wa.me/5491167172341?text='+encodeURIComponent(`Hola Promover, quiero solicitar un presupuesto para ${c.title}.`);
 dialog.showModal();document.body.classList.add('locked');
}));
document.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});
dialog.addEventListener('close',()=>{document.body.classList.remove('locked');lastCategory?.focus({preventScroll:true})});
document.querySelector('#year').textContent=new Date().getFullYear();
const logos=document.querySelector('#client-logos');
const clientNames=['GEPSA','Conarco','YPF','Raffo','La Serenísima','Tyco','Heinz','Carbap','Klaukol','IPCVA','ITBA','BIC Graphic','Banco Provincia','Adecco','Giber','GSK','Unión','Taragüi','Mañanita','La Merced','Sanofi','Las Marías','Monasterio Tattersall'];
const group=document.createElement('div');group.className='logo-group';
clientNames.forEach((name,index)=>{const box=document.createElement('div');box.className='client-logo';const img=document.createElement('img');img.src=`assets/clients/${index+1}.webp`;img.alt=name;img.width=160;img.height=70;box.append(img);group.append(box)});
const clone=group.cloneNode(true);clone.setAttribute('aria-hidden','true');clone.querySelectorAll('img').forEach(img=>img.alt='');logos.append(group,clone);
const logoWindow=document.querySelector('.logo-window');const pauseButton=document.querySelector('.logo-pause');
pauseButton.addEventListener('click',()=>{const paused=logoWindow.classList.toggle('paused');pauseButton.setAttribute('aria-pressed',String(paused));pauseButton.querySelector('.pause-label').textContent=paused?'Reanudar movimiento':'Pausar movimiento';pauseButton.querySelector('.pause-symbol').textContent=paused?'▶':'Ⅱ'});
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
function syncMotionPreference(){pauseButton.disabled=reducedMotion.matches;if(reducedMotion.matches){pauseButton.querySelector('.pause-label').textContent='Movimiento reducido';logoWindow.tabIndex=0}else{pauseButton.querySelector('.pause-label').textContent=logoWindow.classList.contains('paused')?'Reanudar movimiento':'Pausar movimiento';logoWindow.removeAttribute('tabindex')}}
syncMotionPreference();reducedMotion.addEventListener('change',syncMotionPreference);
const homeMarquee=document.querySelector('.home-marquee');const marqueeToggle=document.querySelector('.marquee-toggle');
marqueeToggle.addEventListener('click',()=>{const paused=homeMarquee.classList.toggle('paused');marqueeToggle.setAttribute('aria-pressed',String(paused));marqueeToggle.setAttribute('aria-label',paused?'Reanudar franja animada':'Pausar franja animada');marqueeToggle.firstElementChild.textContent=paused?'▶':'Ⅱ'});
const floatingContact=document.querySelector('.floating-contact');
function updateFloatingContact(){const hero=document.querySelector('.hero').getBoundingClientRect();const contact=document.querySelector('#contacto').getBoundingClientRect();floatingContact.classList.toggle('shown',hero.bottom<80&&!(contact.top<innerHeight&&contact.bottom>0));}
addEventListener('scroll',updateFloatingContact,{passive:true});addEventListener('resize',updateFloatingContact);updateFloatingContact();
if('IntersectionObserver' in window&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
 const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}),{threshold:.08});
 document.querySelectorAll('.section-heading,.category,.manufacture-copy,.clients-heading,.process-steps article,.contact-main').forEach((el,index)=>{if(el.classList.contains('category'))el.style.setProperty('--delay',`${index%3*70}ms`);el.classList.add('reveal-ready');observer.observe(el)});
}
