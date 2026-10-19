(()=>{
'use strict';
if(!('speechSynthesis' in window)) return;
let activeButton=null,activeTarget=null;

function stopSpeech(){
  window.speechSynthesis.cancel();
  if(activeButton) activeButton.classList.remove('tts-speaking');
  if(activeTarget) activeTarget.classList.remove('tts-reading');
  activeButton=null;activeTarget=null;
}
function frenchVoice(){
  const voices=window.speechSynthesis.getVoices();
  return voices.find(v=>/^fr(-|_)/i.test(v.lang)&&/France|French|français/i.test(v.name))
      || voices.find(v=>/^fr(-|_)/i.test(v.lang)) || null;
}
function visibleText(root){
  const clone=root.cloneNode(true);
  clone.querySelectorAll('.tts-speaker,[hidden],.hidden').forEach(n=>n.remove());
  clone.querySelectorAll('*').forEach(n=>{
    const original=findMatchingOriginal(root,n,clone);
    if(original){
      const cs=getComputedStyle(original);
      if(cs.display==='none'||cs.visibility==='hidden') n.remove();
    }
  });
  return (clone.textContent||'')
    .replace(/[🔊🎯📖✓🏆⌂↻]/g,' ')
    .replace(/\s+/g,' ').trim();
}
// Best-effort mapping used only to ignore hidden descendants such as unrevealed answers.
function findMatchingOriginal(root,cloneNode,cloneRoot){
  try{
    const path=[];let n=cloneNode;
    while(n&&n!==cloneRoot){
      const p=n.parentElement;if(!p)return null;
      path.unshift(Array.prototype.indexOf.call(p.children,n));n=p;
    }
    let o=root;for(const i of path){if(!o.children[i])return null;o=o.children[i]}
    return o;
  }catch{return null}
}
function textFor(target){
  const custom=target.getAttribute('data-tts-text');
  if(custom) return custom;
  if(target.classList.contains('clueSlot')){
    const clue=target.querySelector('.clue')?.textContent?.trim()||'';
    const name=target.querySelector('.revealName');
    const shown=name&&getComputedStyle(name).display!=='none' ? name.textContent.trim()+'. ' : '';
    return shown+clue;
  }
  if(target.classList.contains('gameCard')){
    const h=target.querySelector('h3')?.textContent?.trim()||'';
    const p=target.querySelector('p')?.textContent?.trim()||'';
    return (h+'. '+p).trim();
  }
  if(target.classList.contains('wordBtn')) return target.childNodes[0]?.textContent?.trim() || target.textContent.trim();
  if(target.classList.contains('period')) return target.childNodes[0]?.textContent?.trim() || target.textContent.trim();
  return visibleText(target);
}
function speak(target,btn){
  if(activeButton===btn&&window.speechSynthesis.speaking){stopSpeech();return}
  stopSpeech();
  const txt=textFor(target);
  if(!txt)return;
  const u=new SpeechSynthesisUtterance(txt);
  u.lang='fr-FR';u.rate=.88;u.pitch=1;
  const v=frenchVoice();if(v)u.voice=v;
  activeButton=btn;activeTarget=target;
  btn.classList.add('tts-speaking');target.classList.add('tts-reading');
  const done=()=>{
    btn.classList.remove('tts-speaking');target.classList.remove('tts-reading');
    if(activeButton===btn){activeButton=null;activeTarget=null}
  };
  u.onend=done;u.onerror=done;
  window.speechSynthesis.speak(u);
}
function addSpeaker(target,label='Écouter le texte'){
  if(!target||target.querySelector(':scope > .tts-speaker'))return;
  target.classList.add('tts-target');
  const s=document.createElement('span');
  s.className='tts-speaker';s.setAttribute('role','button');s.tabIndex=0;
  s.setAttribute('aria-label',label);s.title=label;s.textContent='🔊';
  target.appendChild(s);
}
function decorate(root=document){
  const specs=[
    ['.rule','Écouter la règle'],
    ['.intro','Écouter la présentation'],
    ['.gameCard','Écouter la présentation du jeu'],
    ['.instructions','Écouter la consigne'],
    ['details.reading','Écouter le texte documentaire'],
    ['.visitText','Écouter le texte de la visite'],
    ['.clueSlot','Écouter cet indice'],
    ['.traceCard','Écouter la trace écrite'],
    ['.wordBtn','Écouter ce mot'],
    ['.period','Écouter cette période'],
    ['.message','Écouter le message'],
    ['.finalCard','Écouter le message final']
  ];
  for(const [sel,label] of specs){
    if(root.matches?.(sel))addSpeaker(root,label);
    root.querySelectorAll?.(sel).forEach(el=>addSpeaker(el,label));
  }
}

document.addEventListener('click',e=>{
  const s=e.target.closest('.tts-speaker');
  if(s){
    e.preventDefault();e.stopPropagation();
    speak(s.parentElement,s);return;
  }
  if(e.target.closest('.homeBtn,[data-open],#finalHome')) stopSpeech();
},true);
document.addEventListener('keydown',e=>{
  const s=e.target.closest?.('.tts-speaker');
  if(s&&(e.key==='Enter'||e.key===' ')){
    e.preventDefault();e.stopPropagation();speak(s.parentElement,s);
  }
},true);
const observer=new MutationObserver(ms=>{
  for(const m of ms){
    if(m.type==='childList'){
      m.addedNodes.forEach(n=>{if(n.nodeType===1)decorate(n)});
      if(m.target.nodeType===1)decorate(m.target);
    }
  }
});
window.addEventListener('DOMContentLoaded',()=>{
  decorate(document);
  observer.observe(document.body,{subtree:true,childList:true});
  window.speechSynthesis.getVoices();
});
document.addEventListener('visibilitychange',()=>{if(document.hidden)stopSpeech()});
window.addEventListener('beforeunload',stopSpeech);
})();
