/* LEFABAM: popup tabellini condiviso. Fonte: risultati.html */
(()=>{
  const ALIAS={'LOBE':'LOBE UNITED','SPARTAK':'SPARTAK PISA','DINAMO':'DINAMO SIENA','CASTEL':'CASTEL DI IEMMA','MONACO DB':'MONACO DI BARRIERA','PROFONDA':'PROFONDA AURORA'};
  const normalize=s=>(s||'').replace(/\s+/g,' ').trim().toUpperCase();
  const team=s=>ALIAS[normalize(s)]||normalize(s);
  const css=document.createElement('style');css.textContent=`
  .lefa-popup[hidden]{display:none!important}.lefa-popup{position:fixed;inset:0;z-index:99999;background:rgba(2,23,45,.78);display:flex;align-items:center;justify-content:center;padding:12px}
  .lefa-popup-panel{width:min(1100px,98vw);height:min(820px,94vh);background:white;border-radius:16px;overflow:hidden;display:flex;flex-direction:column;box-shadow:0 20px 70px #0008}
  .lefa-popup-head{background:#084aa8;color:#fff;display:flex;align-items:center;justify-content:space-between;padding:12px 16px;font:700 15px Arial;gap:12px}
  .lefa-popup-close{background:#ffe500;color:#063b91;border:0;border-radius:7px;padding:9px 14px;cursor:pointer;font-weight:800}
  .lefa-popup-frame{border:0;width:100%;flex:1;min-height:0}
  .lefa-score-btn{cursor:pointer!important;text-decoration:underline!important;text-underline-offset:3px!important;outline-offset:3px}
  body.lefa-popup-open{overflow:hidden}`;document.head.append(css);
  const modal=document.createElement('div');modal.className='lefa-popup';modal.hidden=true;
  modal.innerHTML='<div class="lefa-popup-panel" role="dialog" aria-modal="true" aria-label="Tabellini partita"><div class="lefa-popup-head"><span class="lefa-popup-title">Tabellini</span><button type="button" class="lefa-popup-close">Chiudi ✕</button></div><iframe class="lefa-popup-frame" title="Tabellini delle due formazioni"></iframe></div>';
  document.body.append(modal);let trigger=null;
  const close=()=>{modal.hidden=true;document.body.classList.remove('lefa-popup-open');modal.querySelector('iframe').removeAttribute('src');trigger?.focus()};
  modal.querySelector('button').onclick=close;modal.addEventListener('click',e=>{if(e.target===modal)close()});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!modal.hidden)close()});
  function attach(node,home,away,day,score){
    if(!Number.isInteger(+day)||+day<1||!home||!away||!score||!/[0-9]/.test(score)||node.dataset.lefaBound)return;
    node.dataset.lefaBound='1';node.classList.add('lefa-score-btn');node.setAttribute('role','button');node.tabIndex=0;
    node.setAttribute('aria-label',`Apri tabellini ${home} ${score} ${away}`);
    const open=()=>{trigger=node;const params=new URLSearchParams({confronto:'1',giornata:String(day),casa:team(home),trasferta:team(away)});modal.querySelector('.lefa-popup-title').textContent=`${home} ${score} ${away}`;modal.querySelector('iframe').src='risultati.html?'+params;modal.hidden=false;document.body.classList.add('lefa-popup-open');modal.querySelector('button').focus()};
    node.addEventListener('click',open);node.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open()}});
  }
  function scan(){
    document.querySelectorAll('.fixture').forEach(row=>{
      const score=row.querySelector('.score');const day=row.dataset.maximaGiornata||document.querySelector('#day')?.selectedOptions[0]?.dataset.maximaGiornata;
      attach(score,row.querySelector('.home')?.textContent,row.querySelector('.away')?.textContent,day,score?.textContent);
    });
    document.querySelectorAll('.match').forEach(row=>{
      const day=row.dataset.maximaGiornata;
      const home=row.querySelector('.home')?.textContent||row.querySelectorAll('.team-name')[0]?.textContent||row.querySelectorAll('.team')[0]?.textContent;
      const away=row.querySelector('.away')?.textContent||row.querySelectorAll('.team-name')[1]?.textContent||row.querySelectorAll('.team')[1]?.textContent;
      const score=row.querySelector(':scope > .score');
      if(score)attach(score,home,away,day,score.textContent);
      else {const scores=row.querySelectorAll('.team .score');if(scores.length===2)attach(scores[0],home,away,day,scores[0].textContent+' - '+scores[1].textContent)}
    });
  }
  scan();const obs=new MutationObserver(()=>scan());obs.observe(document.body,{subtree:true,childList:true});
})();