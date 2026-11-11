const menu=document.querySelector('.menu-toggle'),nav=document.querySelector('#navigation');
function closeMenu(){window.promoverCloseMenu?.()}
addEventListener('scroll',()=>document.querySelector('.header').classList.toggle('scrolled',scrollY>20),{passive:true});
const form=document.querySelector('form');
if(form){form.addEventListener('submit',()=>{const button=form.querySelector('button');button.disabled=true;document.querySelector('#form-status').textContent='Abriendo el envío seguro…';setTimeout(()=>{button.disabled=false},12000)});addEventListener('pageshow',()=>{form.querySelector('button').disabled=false;document.querySelector('#form-status').textContent=''})}
document.querySelector('#year').textContent=new Date().getFullYear();
