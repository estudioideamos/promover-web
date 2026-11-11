const menu=document.querySelector('.menu-toggle'),nav=document.querySelector('#navigation');
function closeMenu(){menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Abrir menú');nav.classList.remove('open');document.body.classList.remove('menu-open')}
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';closeMenu();if(open){menu.setAttribute('aria-expanded','true');menu.setAttribute('aria-label','Cerrar menú');nav.classList.add('open');document.body.classList.add('menu-open');nav.querySelector('a').focus()}});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(menu.getAttribute('aria-expanded')!=='true')return;if(e.key==='Escape'){closeMenu();menu.focus()}if(e.key==='Tab'){const items=[...nav.querySelectorAll('a'),menu];if(e.shiftKey&&document.activeElement===items[0]){e.preventDefault();menu.focus()}else if(!e.shiftKey&&document.activeElement===menu){e.preventDefault();items[0].focus()}}});
addEventListener('resize',()=>{if(innerWidth>900)closeMenu()});
addEventListener('scroll',()=>document.querySelector('.header').classList.toggle('scrolled',scrollY>20),{passive:true});
const form=document.querySelector('form');
if(form){form.addEventListener('submit',()=>{const button=form.querySelector('button');button.disabled=true;document.querySelector('#form-status').textContent='Abriendo el envío seguro…';setTimeout(()=>{button.disabled=false},12000)});addEventListener('pageshow',()=>{form.querySelector('button').disabled=false;document.querySelector('#form-status').textContent=''})}
document.querySelector('#year').textContent=new Date().getFullYear();
