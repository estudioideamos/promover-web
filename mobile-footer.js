const footerMobile=matchMedia('(max-width:760px)');
const footerToggles=[...document.querySelectorAll('.footer-toggle')];
function syncFooter(){for(const details of footerToggles){details.open=!footerMobile.matches;details.querySelector('summary').tabIndex=footerMobile.matches?0:-1}}
syncFooter();footerMobile.addEventListener('change',syncFooter);footerToggles.forEach(d=>d.addEventListener('toggle',()=>{if(!footerMobile.matches&&!d.open)d.open=true}));
