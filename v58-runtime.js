(function(){
function upgradeAxone(){document.querySelectorAll('.v57-axone-orb').forEach(el=>{if(el.querySelector('img'))return;el.textContent='';const im=document.createElement('img');im.src='assets/axone-avatar.png';im.alt='Dr Axone';im.style.cssText='width:100%;height:100%;object-fit:cover;border-radius:inherit';el.appendChild(im)});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',upgradeAxone);else upgradeAxone();
})();
