/* ANIQRC — versione inglese del sito (12 novembre 2026).
   Sostituisce il pulsante giorno/notte con il selettore Italiano / English.
   Come funziona: le pagine restano scritte in italiano; quando si sceglie
   l'inglese, ogni frammento di testo viene cercato nel dizionario
   i18n-en.json e sostituito. Non tocca markup, link né script: cambia solo
   il testo (e gli attributi placeholder, title, aria-label, alt).
   La scelta è ricordata (localStorage «aniqrc-lang», condivisa con VIGIL);
   link diretto con ?lang=en. © ANIQRC */
(function(){
  if(window.__aniqrcI18n) return;
  var ROOT=document.documentElement, KEY='aniqrc-lang', DICT_URL='i18n-en.json?v=1';
  var INLINE={A:1,ABBR:1,B:1,BDI:1,BDO:1,BR:1,CITE:1,DFN:1,EM:1,I:1,KBD:1,MARK:1,Q:1,S:1,SAMP:1,SMALL:1,SPAN:1,STRONG:1,SUB:1,SUP:1,TIME:1,U:1,VAR:1,WBR:1,DEL:1,INS:1};
  var SKIP={SCRIPT:1,STYLE:1,NOSCRIPT:1,CODE:1,PRE:1,TEXTAREA:1,TEMPLATE:1,IFRAME:1,svg:1,SVG:1,CANVAS:1,VIDEO:1,AUDIO:1,SELECT:1,OPTION:0};
  var ATTRS=['placeholder','title','aria-label','alt'];
  var LETTER=/[A-Za-zÀ-ÿ]/;

  function norm(s){ return (s||'').replace(/\s+/g,' ').trim(); }
  function h(s){ var x=0x811c9dc5; for(var i=0;i<s.length;i++){ x^=s.charCodeAt(i); x=(x+((x<<1)+(x<<4)+(x<<7)+(x<<8)+(x<<24)))>>>0; } return ('0000000'+x.toString(16)).slice(-8); }
  function skipped(el){
    for(var e=el; e && e!==document.body; e=e.parentNode){
      if(e.nodeType!==1) continue;
      if(SKIP[e.nodeName]) return true;
      if(e.hasAttribute('data-noi18n') || e.hasAttribute('data-l') || e.getAttribute('translate')==='no' || e.classList.contains('langbtn')) return true;
    }
    return false;
  }
  function blockOf(node){ var e=node.parentNode; while(e && e!==document.body && INLINE[e.nodeName] && e.parentNode) e=e.parentNode; return e; }
  function frags(block){
    var out=[], w=document.createTreeWalker(block, NodeFilter.SHOW_TEXT, null);
    for(var n=w.nextNode(); n; n=w.nextNode()){
      if(!LETTER.test(n.nodeValue)) continue;
      if(blockOf(n)!==block) continue;
      if(skipped(n.parentNode)) continue;
      out.push(n);
    }
    return out;
  }
  function blockKey(block, list){
    var t=list.map(function(n){ return n.__it!==undefined ? n.__it : n.nodeValue; }).join('|');
    return h(norm(t).replace(/[0-9]/g,''));
  }
  /* raccoglie tutti i frammenti traducibili sotto root */
  function collect(root){
    var seen=new Set(), items=[];
    var w=document.createTreeWalker(root||document.body, NodeFilter.SHOW_TEXT, null);
    for(var n=w.nextNode(); n; n=w.nextNode()){
      if(!LETTER.test(n.nodeValue) || skipped(n.parentNode)) continue;
      var b=blockOf(n); if(!b || seen.has(b)) continue; seen.add(b);
      var list=frags(b); if(!list.length) continue;
      var bk=blockKey(b, list);
      list.forEach(function(t,i){ items.push({node:t, key:bk+'.'+i, text:norm(t.__it!==undefined?t.__it:t.nodeValue), block:b}); });
    }
    var els=(root||document.body).querySelectorAll('[placeholder],[title],[aria-label],[alt],input[type=submit],input[type=button]');
    [].forEach.call(els, function(el){
      if(skipped(el)) return;
      ATTRS.concat(el.matches('input[type=submit],input[type=button]')?['value']:[]).forEach(function(a){
        var v=el.__ita && el.__ita[a]!==undefined ? el.__ita[a] : el.getAttribute(a);
        if(v && LETTER.test(v)) items.push({el:el, attr:a, key:'a.'+h(norm(v)), text:norm(v)});
      });
    });
    return items;
  }

  var dict=null, lang='it', obs=null;
  function apply(items){
    items.forEach(function(it){
      var en=dict[it.key]; if(en===undefined) return;
      if(it.node){
        var n=it.node; if(n.__it===undefined) n.__it=n.nodeValue;
        var o=n.__it, lead=o.match(/^\s*/)[0], trail=o.match(/\s*$/)[0];
        n.nodeValue=lead+en+trail;
      } else {
        var el=it.el; el.__ita=el.__ita||{}; if(el.__ita[it.attr]===undefined) el.__ita[it.attr]=el.getAttribute(it.attr);
        el.setAttribute(it.attr, en);
      }
    });
  }
  function translateAll(){
    apply(collect(document.body));
    if(document.title){ if(ROOT.__itTitle===undefined) ROOT.__itTitle=document.title; var t=dict['a.'+h(norm(ROOT.__itTitle))]; if(t) document.title=t; }
  }
  function restore(){
    var w=document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
    for(var n=w.nextNode(); n; n=w.nextNode()){ if(n.__it!==undefined){ n.nodeValue=n.__it; delete n.__it; } }
    [].forEach.call(document.querySelectorAll('*'), function(el){ if(el.__ita){ for(var a in el.__ita) el.setAttribute(a, el.__ita[a]); delete el.__ita; } });
    if(ROOT.__itTitle!==undefined) document.title=ROOT.__itTitle;
  }
  function watch(on){
    if(obs){ obs.disconnect(); obs=null; }
    if(!on || !window.MutationObserver) return;
    var pending=false;
    obs=new MutationObserver(function(){ if(pending) return; pending=true;
      requestAnimationFrame(function(){ pending=false; obs.disconnect(); translateAll(); obs.observe(document.body,{childList:true,subtree:true,characterData:true}); }); });
    obs.observe(document.body,{childList:true,subtree:true,characterData:true});
  }
  function loadDict(cb){
    if(dict) return cb();
    fetch(DICT_URL).then(function(r){ return r.json(); }).then(function(d){ dict=d; cb(); })
      .catch(function(){ dict={}; cb(); });
  }
  function done(){ ROOT.classList.remove('i18n-wait'); }
  function setLang(l, save){
    lang=l; ROOT.lang=l; ROOT.setAttribute('data-lang', l);
    if(save){ try{ localStorage.setItem(KEY, l); }catch(e){} }
    if(l==='en'){ loadDict(function(){ translateAll(); watch(true); done(); }); }
    else { watch(false); restore(); done(); }
  }

  var FLAG_GB='<svg viewBox="0 0 60 30" aria-hidden="true"><clipPath id="i18gbc"><path d="M0,0v30h60V0z"/></clipPath><clipPath id="i18gbt"><path d="M30,15h30v15zv15H0zH0V0zV0h30z"/></clipPath><g clip-path="url(#i18gbc)"><path d="M0,0v30h60V0z" fill="#012169"/><path d="M0,0 60,30M60,0 0,30" stroke="#fff" stroke-width="6"/><path d="M0,0 60,30M60,0 0,30" clip-path="url(#i18gbt)" stroke="#C8102E" stroke-width="4"/><path d="M30,0v30M0,15h60" stroke="#fff" stroke-width="10"/><path d="M30,0v30M0,15h60" stroke="#C8102E" stroke-width="6"/></g></svg>';
  var FLAG_IT='<svg viewBox="0 0 3 2" aria-hidden="true"><rect width="1" height="2" fill="#009246"/><rect x="1" width="1" height="2" fill="#fff"/><rect x="2" width="1" height="2" fill="#CE2B37"/></svg>';
  function addButton(){
    if(document.getElementById('langBtn')) return;   // la pagina VIGIL ha già il suo
    var b=document.createElement('button');
    b.type='button'; b.className='langbtn'; b.id='langBtn'; b.setAttribute('data-noi18n','');
    b.setAttribute('aria-label','Italiano / English');
    b.innerHTML='<span class="lb-it">'+FLAG_GB+'<b lang="en">English</b></span><span class="lb-en">'+FLAG_IT+'<b lang="it">Italiano</b></span>';
    var inner=document.querySelector('nav .nav-inner');
    if(inner){
      var links=inner.querySelector('.nav-links'), back=inner.querySelector('.nav-back');
      if(links) inner.insertBefore(b, links.nextSibling);
      else if(back) inner.insertBefore(b, back);
      else inner.appendChild(b);
    } else { b.classList.add('float'); document.body.appendChild(b); }
    b.addEventListener('click', function(){ setLang(lang==='en'?'it':'en', true); });
  }

  window.__aniqrcI18n={ collect:collect, hash:h, setLang:setLang };
  function start(){
    if(document.querySelector('[data-l]') && document.getElementById('langBtn')){ done(); return; } // VIGIL: bilingue nativa
    addButton();
    var q=(location.search.match(/[?&]lang=(it|en)/)||[])[1], saved=null;
    try{ saved=localStorage.getItem(KEY)||localStorage.getItem('vigil-lang'); }catch(e){}
    setLang(q || saved || 'it', !!q);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
