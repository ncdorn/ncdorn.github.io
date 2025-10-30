// assets/js/search.js
// Tiny client-side search (no external libs).
// Looks for an input#site-search and a <div id="search-results"> on the page.
(function(){
  const d=document;
  const input = d.getElementById('site-search');
  const results = d.getElementById('search-results');
  if(!input || !results) return;
  let index=[];
  fetch((window.__baseurl||'') + '/assets/search-index.json').then(r=>r.json()).then(j=>index=j);
  function score(q, item){
    q=q.toLowerCase();
    const hay = (item.title+' '+(item.text||'')+' '+(item.tags||[]).join(' ')).toLowerCase();
    let s = 0;
    q.split(/\s+/).forEach(w=>{ if(hay.includes(w)) s += w.length; });
    return s;
  }
  input.addEventListener('input', ()=>{
    const q = input.value.trim();
    if(!q){ results.innerHTML=''; return; }
    const found = index.map(it=>({it, s:score(q,it)})).filter(x=>x.s>0).sort((a,b)=>b.s-a.s).slice(0,10);
    results.innerHTML = found.map(({it})=>`<div class="result"><a href="${it.url}">${it.title}</a><p>${(it.text||'').slice(0,120)}...</p></div>`).join('');
  });
})();