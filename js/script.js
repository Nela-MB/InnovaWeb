/* ============ CONFIGURACIÓN (editá solo esto) ============ */
// Número de WhatsApp con código de país y sin "+" ni espacios. Ej. Argentina: '5493837123456'
var WHATSAPP_NUMERO = '';
var WHATSAPP_MENSAJE = 'Hola InnovaWeb, me interesa consultar por sus servicios de desarrollo web.';
// URL del servicio que recibe el formulario (ej. Formspree: 'https://formspree.io/f/TU_ID'). Vacío = no envía.
var FORM_ENDPOINT = '';
/* ========================================================= */

document.documentElement.classList.add('js');
var quietoMov = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function $(id){ return document.getElementById(id); }
var toastT;
function toast(t){ var el=$('toast'); el.textContent=t; el.classList.add('on'); clearTimeout(toastT); toastT=setTimeout(function(){el.classList.remove('on');},4000); }

// Menú móvil
var burger=$('burger'), menu=$('menu');
burger.addEventListener('click',function(){
  var abierto=menu.classList.toggle('abierto');
  burger.setAttribute('aria-expanded',abierto);
});
menu.addEventListener('click',function(e){ if(e.target.tagName==='A'){menu.classList.remove('abierto');burger.setAttribute('aria-expanded','false');} });
document.addEventListener('keydown',function(e){ if(e.key==='Escape'&&menu.classList.contains('abierto')){menu.classList.remove('abierto');burger.setAttribute('aria-expanded','false');burger.focus();} });

// Enlace activo según la sección visible
var links=document.querySelectorAll('nav a'), secs=document.querySelectorAll('main section');
var obs=new IntersectionObserver(function(es){
  es.forEach(function(e){
    if(e.isIntersecting){
      var id=e.target.id==='presentacion'?'inicio':e.target.id;
      links.forEach(function(a){a.classList.toggle('activo',a.getAttribute('href')==='#'+id);});
    }
  });
},{rootMargin:'-45% 0px -50% 0px'});
secs.forEach(function(s){obs.observe(s);});

// Aparición suave al desplazarse
var revs=document.querySelectorAll('.rev');
if('IntersectionObserver' in window && !quietoMov){
  var ro=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){e.target.classList.add('vis');ro.unobserve(e.target);} }); },{threshold:.15});
  revs.forEach(function(r){ro.observe(r);});
}else{ revs.forEach(function(r){r.classList.add('vis');}); }

// Volver arriba
var arriba=$('arriba');
window.addEventListener('scroll',function(){ arriba.hidden = window.scrollY<600; },{passive:true});
arriba.addEventListener('click',function(){ window.scrollTo({top:0,behavior:quietoMov?'auto':'smooth'}); });

// WhatsApp flotante
var wa=$('wa');
if(WHATSAPP_NUMERO){
  wa.href='https://wa.me/'+WHATSAPP_NUMERO.replace(/\D/g,'')+'?text='+encodeURIComponent(WHATSAPP_MENSAJE);
  wa.target='_blank'; wa.rel='noopener';
}else{
  wa.addEventListener('click',function(e){ e.preventDefault(); toast('WhatsApp todavía no está configurado. Escribinos por el formulario.'); });
}
function urlWA(texto){ return WHATSAPP_NUMERO ? 'https://wa.me/'+WHATSAPP_NUMERO.replace(/\D/g,'')+'?text='+encodeURIComponent(texto) : ''; }

// Filtros de la galería
(function(){
  var btns=[].slice.call(document.querySelectorAll('.filtro')), cards=[].slice.call(document.querySelectorAll('#grilla .tarjeta'));
  btns.forEach(function(b){
    b.addEventListener('click',function(){
      var f=b.dataset.filtro, n=0;
      btns.forEach(function(x){var on=x===b;x.classList.toggle('on',on);x.setAttribute('aria-pressed',on);});
      cards.forEach(function(c){
        var ver=f==='todos'||c.dataset.cat===f; c.hidden=!ver;
        c.classList.remove('entra'); if(ver){n++; void c.offsetWidth; c.classList.add('entra');}
      });
      $('conteo').textContent='Mostrando '+n+(n===1?' proyecto':' proyectos');
    });
  });
})();

// "Consultar" rellena el servicio en el formulario
document.querySelectorAll('[data-servicio]').forEach(function(a){
  a.addEventListener('click',function(){ $('servicio').value=a.dataset.servicio; });
});

// ===== Cotizador =====
var cotizacion=''; // texto del resumen actual
(function(){
  var pasos=[
    {k:'tipo',t:'¿Qué tipo de página necesitás?',a:'Elegí una opción.',m:false,o:['Página informativa (presentación del negocio)','Landing page (una sola página)','Sitio institucional (varias secciones)','Portfolio o galería','Aún no lo sé, necesito asesoramiento']},
    {k:'func',t:'¿Qué funcionalidades te interesan?',a:'Podés elegir varias o ninguna.',m:true,o:['Formularios de contacto','Galería de imágenes','Catálogo de productos o servicios','Integración con WhatsApp','Mapa y ubicación','Reservas o consultas online']},
    {k:'tienda',t:'¿Necesitás una tienda online?',a:'Para vender productos desde tu página.',m:false,o:['Sí, quiero vender online','No por ahora','Quiero evaluarlo con ustedes']},
    {k:'extra',t:'¿Querés algo más?',a:'Mantenimiento y asesoramiento son opcionales.',m:true,o:['Mantenimiento después del lanzamiento','Asesoramiento adicional','Ninguno por ahora']},
  ];
  var resp={}, p=0, cuerpo=$('cotCuerpo'), atras=$('cotAtras'), sig=$('cotSig');
  function render(){
    $('cotBarra').style.width=((p+1)/(pasos.length+1)*100)+'%';
    $('cotPaso').textContent=p<pasos.length?'Paso '+(p+1)+' de '+pasos.length:'Resumen';
    atras.disabled=p===0; sig.style.display=p>=pasos.length?'none':'';
    sig.textContent=p===pasos.length-1?'Ver resumen':'Siguiente';
    if(p<pasos.length){
      var s=pasos[p], h='<h3>'+s.t+'</h3><p class="ayuda">'+s.a+'</p><fieldset class="opciones'+(s.m?' multi':'')+'"><legend class="sr">'+s.t+'</legend>';
      s.o.forEach(function(o,i){
        var sel=(resp[s.k]||[]).indexOf(o)>-1;
        h+='<label class="opcion"><input type="'+(s.m?'checkbox':'radio')+'" name="c-'+s.k+'" value="'+o+'"'+(sel?' checked':'')+'><span>'+o+'</span></label>';
      });
      cuerpo.innerHTML=h+'</fieldset>';
      sig.disabled=!s.m&&!(resp[s.k]||[]).length;
      [].forEach.call(cuerpo.querySelectorAll('input'),function(inp){
        inp.addEventListener('change',function(){
          resp[s.k]=[].map.call(cuerpo.querySelectorAll('input:checked'),function(x){return x.value;});
          sig.disabled=!s.m&&!resp[s.k].length;
        });
      });
    }else resumen();
  }
  function lineas(){
    var n={tipo:'Tipo de página',func:'Funcionalidades',tienda:'Tienda online',extra:'Adicionales'};
    return pasos.map(function(s){ var v=(resp[s.k]||[]); return {k:s.k,n:n[s.k],v:v.length?v.join(', '):'Sin selección'}; });
  }
  function resumen(){
    var l=lineas(), h='<h3>Tu resumen</h3><ul class="resumen">';
    l.forEach(function(x,i){ h+='<li><span><b>'+x.n+':</b> '+x.v+'</span><button type="button" class="btn-link" data-i="'+i+'">Modificar<span class="sr"> '+x.n+'</span></button></li>'; });
    h+='</ul><p class="aviso">No mostramos precios automáticos: el presupuesto se prepara de forma personalizada según tu proyecto.</p><div class="cot-acc"><button type="button" class="btn btn-vino" id="cotForm">Solicitar presupuesto</button><button type="button" class="btn btn-borde" id="cotWA">Enviar por WhatsApp</button></div>';
    cuerpo.innerHTML=h;
    cotizacion='Consulta desde el cotizador:\n'+l.map(function(x){return '- '+x.n+': '+x.v;}).join('\n');
    [].forEach.call(cuerpo.querySelectorAll('[data-i]'),function(b){ b.addEventListener('click',function(){p=+b.dataset.i;render();cuerpo.querySelector('input').focus();}); });
    $('cotForm').addEventListener('click',function(){
      $('adjuntoTxt').textContent=cotizacion; $('adjunto').hidden=false;
      $('servicio').value=/tienda|vender/i.test((resp.tienda||[])[0]||'')&&/Sí/.test((resp.tienda||[])[0]||'')?'E-commerce':'Desarrollo web';
      $('contacto').scrollIntoView({behavior:quietoMov?'auto':'smooth'}); setTimeout(function(){$('nombre').focus({preventScroll:true});},500);
    });
    $('cotWA').addEventListener('click',function(){
      var u=urlWA('Hola InnovaWeb, quiero pedir un presupuesto.\n\n'+cotizacion);
      if(u) window.open(u,'_blank','noopener'); else toast('WhatsApp todavía no está configurado. Usá "Solicitar presupuesto".');
    });
  }
  atras.addEventListener('click',function(){ if(p>0){p--;render();} });
  sig.addEventListener('click',function(){ if(p<pasos.length){p++;render();} });
  render();
})();
$('quitar').addEventListener('click',function(){ $('adjunto').hidden=true; });

// ===== Formulario =====
var form=$('form'), msg=$('msg');
var reglas={
  nombre:function(v){return v?'':'Escribí tu nombre.';},
  email:function(v){return !v?'Escribí tu correo electrónico.':(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)?'':'El correo no parece válido. Ejemplo: nombre@correo.com');},
  mensaje:function(v){return v.length<10?'Contanos un poco más (mínimo 10 caracteres).':'';}
};
Object.keys(reglas).forEach(function(id){ $(id).addEventListener('input',function(){ if($(id).classList.contains('error')) chequear(id); }); });
function chequear(id){
  var c=$(id), e=reglas[id](c.value.trim());
  c.classList.toggle('error',!!e); c.setAttribute('aria-invalid',!!e); $('e-'+id).textContent=e; return !e;
}
form.addEventListener('submit',function(e){
  e.preventDefault();
  var primero=null;
  Object.keys(reglas).forEach(function(id){ if(!chequear(id)&&!primero) primero=$(id); });
  if(primero){ msg.className='msg mal'; msg.textContent='Revisá los campos marcados.'; primero.focus(); return; }
  var cuerpo=$('mensaje').value.trim()+($('adjunto').hidden?'':'\n\n'+cotizacion);
  var datos={nombre:$('nombre').value.trim(),email:$('email').value.trim(),servicio:$('servicio').value,tipo:$('tipo').value,mensaje:cuerpo};
  if(!FORM_ENDPOINT){
    // Sin servicio configurado NO se envía nada y no se simula un envío.
    var u=urlWA('Hola InnovaWeb, soy '+datos.nombre+' ('+datos.email+').\n'+(datos.servicio?'Servicio: '+datos.servicio+'\n':'')+(datos.tipo?'Proyecto: '+datos.tipo+'\n':'')+'\n'+cuerpo);
    msg.className='msg mal';
    msg.innerHTML='Tu mensaje todavía no se envió: el formulario aún no está conectado a un servicio de correo.'+(u?' <a href="'+u+'" target="_blank" rel="noopener">Enviarlo por WhatsApp</a>':' Escribinos a contacto@innovaweb.com.');
    msg.focus(); return;
  }
  var btn=form.querySelector('[type=submit]'); btn.disabled=true; msg.className='msg info'; msg.textContent='Enviando…';
  fetch(FORM_ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(datos)})
    .then(function(r){ if(!r.ok) throw new Error(r.status);
      msg.className='msg ok'; msg.textContent='¡Gracias, '+datos.nombre+'! Tu mensaje fue enviado correctamente.';
      form.reset(); $('adjunto').hidden=true; msg.focus(); })
    .catch(function(){ msg.className='msg mal'; msg.textContent='No pudimos enviar tu mensaje. Probá de nuevo en unos minutos o escribinos por WhatsApp.'; })
    .then(function(){ btn.disabled=false; });
});

// Carrusel automático (cada 4.5 segundos) — sin cambios de comportamiento
(function(){
  var T=4500, banner=$('banner'), prog=$('prog'),
      slides=[].slice.call(banner.querySelectorAll('.slide')), cont=$('puntos'),
      i=0, timer=null, quieto=quietoMov;
  var dots=slides.map(function(_,n){
    var b=document.createElement('button'); b.setAttribute('aria-label','Ir a la propaganda '+(n+1));
    b.addEventListener('click',function(){ir(n);}); cont.appendChild(b); return b;
  });
  function reiniciarBarra(){ prog.style.animation='none'; void prog.offsetWidth; prog.style.animation=''; }
  function ir(n){
    slides[i].classList.remove('activo'); slides[i].setAttribute('aria-hidden','true'); dots[i].classList.remove('on');
    i=(n+slides.length)%slides.length;
    slides[i].classList.add('activo'); slides[i].removeAttribute('aria-hidden'); dots[i].classList.add('on');
    iniciar();
  }
  function iniciar(){
    clearInterval(timer); reiniciarBarra();
    if(!quieto){ timer=setInterval(function(){ir(i+1);},T); } else { prog.style.display='none'; }
  }
  function pausar(){ clearInterval(timer); banner.classList.add('pausa'); }
  function seguir(){ banner.classList.remove('pausa'); iniciar(); }
  $('ant').addEventListener('click',function(){ir(i-1);});
  $('sig').addEventListener('click',function(){ir(i+1);});
  banner.addEventListener('mouseenter',pausar); banner.addEventListener('mouseleave',seguir);
  banner.addEventListener('focusin',pausar); banner.addEventListener('focusout',seguir);
  dots[0].classList.add('on'); iniciar();
})();

// Logo 3D sutil: se inclina apenas hacia el mouse (el flotado lo hace el CSS)
(function(){
  var l=document.getElementById('logo3d'); if(!l||quietoMov) return;
  var zona=l.closest('.hero');
  zona.addEventListener('pointermove',function(e){
    if(e.pointerType==='touch') return;
    var r=l.getBoundingClientRect();
    var dx=Math.max(-1,Math.min(1,(e.clientX-(r.left+r.width/2))/(window.innerWidth/2)));
    var dy=Math.max(-1,Math.min(1,(e.clientY-(r.top+r.height/2))/(window.innerHeight/2)));
    l.style.setProperty('--ry',(dx*20)+'deg'); l.style.setProperty('--rx',(-dy*13)+'deg'); l.style.setProperty('--s','1.04');
  });
  zona.addEventListener('pointerleave',function(){ ['--rx','--ry','--s'].forEach(function(p){l.style.removeProperty(p);}); });
})();

$('anio').textContent=new Date().getFullYear();
