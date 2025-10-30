// assets/js/site.js
(function(){
  const d = document, root = d.documentElement;

  // Sticky header opacity
  const header = d.querySelector('.site-header');
  const onScroll = () => header && header.classList.toggle('scrolled', window.scrollY > 8);
  window.addEventListener('scroll', onScroll, {passive:true}); onScroll();

  // Mobile nav
  const navToggle = d.querySelector('.nav-toggle');
  const navList = d.getElementById('nav-list');
  if (navToggle && navList){
    navToggle.addEventListener('click', () => {
      const exp = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!exp));
      navList.classList.toggle('open', !exp);
      navList.setAttribute('aria-expanded', String(!exp));
    });
  }

  // Toggles: theme, contrast, motion
  const set = (k,v)=>{ if(v==null){localStorage.removeItem(k);} else {localStorage.setItem(k,v);} };
  const get = k => localStorage.getItem(k);

  const btnTheme = d.getElementById('toggle-theme');
  const btnContrast = d.getElementById('toggle-contrast');
  const btnMotion = d.getElementById('toggle-motion');

  const applyPrefs = () => {
    const theme = get('theme'); root.setAttribute('data-theme', theme || 'auto');
    const hc = get('contrast'); if (hc === 'high') root.setAttribute('data-contrast','high'); else root.removeAttribute('data-contrast');
    const motion = get('motion'); if (motion === 'reduced') root.style.setProperty('scroll-behavior','auto'); // CSS handles animations
  };
  applyPrefs();

  btnTheme && btnTheme.addEventListener('click', ()=> {
    const cur = get('theme'); const next = cur==='dark' ? 'auto' : (cur==='auto'||!cur) ? 'dark' : 'auto';
    set('theme', next); btnTheme.setAttribute('aria-pressed', String(next==='dark')); applyPrefs();
  });
  btnContrast && btnContrast.addEventListener('click', ()=> {
    const cur = get('contrast'); const next = cur==='high' ? null : 'high'; set('contrast', next);
    btnContrast.setAttribute('aria-pressed', String(next==='high')); applyPrefs();
  });
  btnMotion && btnMotion.addEventListener('click', ()=> {
    const cur = get('motion'); const next = cur==='reduced' ? null : 'reduced'; set('motion', next);
    btnMotion.setAttribute('aria-pressed', String(next==='reduced')); applyPrefs();
  });

  // Email obfuscation
  const emailEls = d.querySelectorAll('#email, #email-page');
  emailEls.forEach(el=>{
    const u = el.dataset.user, dom = el.dataset.domain;
    if(!u || !dom) return;
    const addr = `${u}@${dom}`;
    el.innerHTML = `<a href="mailto:${addr}">${addr}</a>`;
  });

  // Generic filter controls (year/tags)
  function initFilters(){
    const groups = d.querySelectorAll('.filter-buttons');
    groups.forEach(group=>{
      group.addEventListener('click', e=>{
        const btn = e.target.closest('.filter-btn'); if(!btn) return;
        const multi = group.dataset.multi === 'true';
        if(btn.dataset.filterValue === 'all'){
          group.querySelectorAll('.filter-btn').forEach(b=>b.setAttribute('aria-pressed','false'));
          btn.setAttribute('aria-pressed','true');
        } else {
          if(multi){
            btn.setAttribute('aria-pressed', btn.getAttribute('aria-pressed') !== 'true');
            group.querySelector('.filter-btn[data-filter-value="all"]')?.setAttribute('aria-pressed','false');
          } else {
            group.querySelectorAll('.filter-btn').forEach(b=>b.setAttribute('aria-pressed','false'));
            btn.setAttribute('aria-pressed','true');
          }
        }
        applyFilter();
      });
    });

    function activeValues(type){
      const sel = `.filter-buttons[data-filter-type="${type}"] .filter-btn[aria-pressed="true"]`;
      const values = Array.from(d.querySelectorAll(sel)).map(b=>b.dataset.filterValue);
      return values.includes('all') || values.length===0 ? [] : values;
    }

    function match(el, years, tags){
      const y = el.getAttribute('data-year');
      const t = (el.getAttribute('data-tags')||'').split(/\s+/).filter(Boolean);
      const yearOK = years.length ? years.includes(y) : true;
      const tagOK = tags.length ? tags.some(v => t.includes(v)) : true;
      return yearOK && tagOK;
    }

    function applyFilter(){
      const years = activeValues('year');
      const tags = activeValues('tags');
      d.querySelectorAll('.publication, .project').forEach(el=>{
        el.hidden = !match(el, years, tags);
      });
    }
  }
  initFilters();
})();