var CFG={
  date:"November 8, 2026", time:"4:00 PM", venue:"Marikina Convention Center, Plenary Hall", attire:"Semi-formal",
  email:"mickaela.jeorge@gmail.com",
  /* Paste your Google Apps Script web app URL here (see setup steps). */
  sheetUrl:"https://script.google.com/macros/s/AKfycbxOXfTBnoBLErkxnjG8fiHIXdSF9ghahw6a0febsk4SXi8rSGAZQwKI5EiEZES7KXJA/exec",
  video:"assets/videos/MARGATURNS18final-1.mp4",   
  photos:["assets/photos/roses-1.jpg", "assets/photos/candles-1.jpg", "assets/photos/treasures-1.jpg", "assets/photos/bills-1.jpg", "assets/photos/roses-2.jpg", "assets/photos/candles-2.jpg", "assets/photos/treasures-2.jpg", "assets/photos/bills-2.jpg"],  /* 8 photos: first 4 are the big ones (roses, candles, treasures, blue shots), last 4 the small overlapping ones */
  roses:["Lolo Amador Lantin", "Jayjay Rosales", "Gabe Lantin", "Josh Garcia", "Leo Vincent Aala", "Gabriel Aala", "Cj Aala", "Jerome Aala", "Genesis Aala", "Brent Marasigan", "Ismael Abuzman", "Carlos Caalam", "Kevin Lantin", "Andrei Caalam", "Yro Amrik Daz", "Arem Untiveros", "Johnal Khow", "Peter John Mendoza"], 
  candles:["Pauline Mendoza", "Mickaela Mendoza", "Jannah Rosales","Julliana Rosales","Chloie Moscoso","Angelica Porcel","Ashley Manuel","Shyrelle Baltazar","Hilaree Aquino","Anna Gomba" ,"Lux Quano","Micah Aguinaldo","Jhuryz Bitamug","Yesha Chua","Lalaine Aala","Zayahna Nicole","Angel Peralta","Elysha Castro"], 
  treasures:["Francheska Asingayan","Alliyah Mallari","Zoe Ortega","Delaila Caccam","Jen Duroy","Rada Miguel","Tin Nuevo","Maverick Esguerra","Ashley De Jesus","Vincent Valientes","Zeila Reyes","Faye Caalam","Ruth Aala","Jasmine Macapagal","Shanet Lantin","Arbielle Virtucio","Elyzza Garcia","Rejean Epis"], 
  shots:["Jhun Falcutila","Analiza Falcutila","Anthony Balasanos","Umbriel Dy","Jennica Ancajas" ,"Jillian Acle","Yousef Sorsogon","Jerslie Roca","Jireh Veloso","Jojo Caberto","Lance Ligon","Krixia Revadeo","Floriemae Pizon","Reigne Miguel","Franz Miguel","Almira Mariot","Kimberly Lantin","Sheila Padua"  ] /* up to 18 names each */
};
/* To hide a section, put // at the very start of its line below. To bring it back, delete the //. */
var GROUPS=[
 {k:"roses",p:0,t:"18 Roses",d:"Eighteen special people who each present a rose to the debutante."},
 {k:"candles",p:1,t:"18 Candles",d:"Eighteen people who light a candle and share a message of love."},
 {k:"treasures",p:2,t:"18 Treasures",d:"Eighteen people who give a keepsake gift the debutante will treasure."},
 {k:"shots",p:3,t:"18 Blue shots",d:"Eighteen people toasting for adulthood"}
];
var $=function(id){return document.getElementById(id)};

/* details */
$("heroDate").textContent=CFG.date;
$("heroTime").textContent="at "+CFG.time+" · "+CFG.venue;
$("iDate").textContent=CFG.date;$("iTime").textContent=CFG.time;$("iVenue").textContent=CFG.venue;$("iAttire").textContent=CFG.attire;
var PAL=[["Charcoal Blue","#232A34"],["Midnight Charcoal","#1B2028"],["Dark Espresso Brown","#2F251C"],["Dark Aubergine","#281026"],["Deep Forest Green","#2B392C"],["Dark Chestnut Brown","#683821"]];
PAL.forEach(function(c){var f=document.createElement("figure"),i=document.createElement("i"),b=document.createElement("b"),e=document.createElement("em");i.style.background=c[1];b.textContent=c[0];e.textContent=c[1];f.appendChild(i);f.appendChild(b);f.appendChild(e);$("pal").appendChild(f)});
/* the 18s: alternating parallax chapters */
var vis=0;
GROUPS.forEach(function(g){
  var i=g.p,names=CFG[g.k],s=document.createElement("section");
  s.className="chapter "+(vis++%2?"left":"right");
  var t=document.createElement("div");t.className="txt";
  var h=document.createElement("h2");h.textContent=g.t;
  var p=document.createElement("p");p.className="desc";p.textContent=g.d;
  var ol=document.createElement("ol");
  for(var n=0;n<18;n++){var li=document.createElement("li"),a=document.createElement("i"),b=document.createElement("span");
    a.textContent=n+1;b.textContent=names[n]||"To be announced";if(!names[n])b.style.opacity=.6;li.appendChild(a);li.appendChild(b);ol.appendChild(li)}
  t.appendChild(h);t.appendChild(p);t.appendChild(ol);
  var w=document.createElement("div");w.className="pw";
  function pic(src,cls,label){var f=document.createElement("figure");f.className=cls;
    if(src){var im=document.createElement("img");im.src=src;im.alt=label;im.loading="lazy";f.className+=" has";f.appendChild(im)}
    else f.textContent="Photo: add from our file";return f}
  w.appendChild(pic(CFG.photos[i],"ph",g.t));w.appendChild(pic(CFG.photos[i+4],"ph2",g.t+", photo 2"));
  s.appendChild(t);s.appendChild(w);$("chapters").appendChild(s);
});

/* scroll effects, kept inside the frame budget:
   - sections transition in once when scrolled to (IntersectionObserver + CSS transitions, transform/opacity only)
   - progress rail, parallax and video veil run in one rAF loop; all layout reads happen before any writes */
(function(){
  var reduce=matchMedia("(prefers-reduced-motion:reduce)").matches,veil=document.querySelector(".veil");
  if(!reduce&&"IntersectionObserver" in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){var t=e.target;t.classList.add("in");io.unobserve(t);t.addEventListener("transitionend",function h(ev){if(ev.propertyName==="transform"&&ev.target===t){t.classList.remove("rv","in");t.style.removeProperty("--d");t.removeEventListener("transitionend",h)}})}})},{threshold:.15,rootMargin:"0px 0px -6% 0px"});
    [".hero>*","#details h2","#details .sub","#details .info>div",".chapter h2",".chapter .desc",".chapter li","#rsvp h2","#rsvp .sub","#rsvp form","#rsvp .mapbox"].forEach(function(sel){
      [].forEach.call(document.querySelectorAll(sel),function(el,i){
        var d=(sel===".hero>*"||sel==="#details .info>div")?i*110:sel===".chapter li"?((i%18)>>1)*45:sel===".chapter .desc"?100:0;
        el.classList.add("rv");el.style.setProperty("--d",d+"ms");io.observe(el)})})}
  var rail=document.createElement("div");rail.id="rail";rail.setAttribute("aria-hidden","true");rail.innerHTML="<i></i><b></b>";document.body.appendChild(rail);
  var bar=rail.firstChild,dot=rail.lastChild,railH=0,tick=false,
      chs=[].slice.call(document.querySelectorAll(".chapter")).map(function(c){return{c:c,pw:c.querySelector(".pw"),p2:c.querySelector(".ph2"),tx:c.querySelector(".txt")}});
  function run(){tick=false;
    var vh=innerHeight,y=scrollY,max=document.documentElement.scrollHeight-vh,p=max>0?Math.min(1,Math.max(0,y/max)):0,
        rs=reduce?[]:chs.map(function(o){return o.c.getBoundingClientRect()});
    veil.style.opacity=reduce?1:Math.min(1,y/(vh*.85)).toFixed(2);
    bar.style.transform="scaleY("+p.toFixed(4)+")";dot.style.transform="translateY("+(p*railH).toFixed(1)+"px)";
    rs.forEach(function(r,i){if(r.bottom<-200||r.top>vh+200)return;
      var d=r.top+r.height/2-vh/2,o=chs[i];
      o.pw.style.transform="translateY("+(-d*.14).toFixed(1)+"px)";
      o.p2.style.transform="translateY("+(d*.12).toFixed(1)+"px)";
      o.tx.style.transform="translateY("+(d*.05).toFixed(1)+"px)"})}
  function measure(){railH=rail.clientHeight;run()}
  addEventListener("scroll",function(){if(!tick){tick=true;requestAnimationFrame(run)}},{passive:true});
  addEventListener("resize",measure);measure();
})();

/* shooting-star cursor: glowing star head with a fading tail and sparkles */
(function(){
  if(!matchMedia("(hover:hover) and (pointer:fine)").matches||matchMedia("(prefers-reduced-motion:reduce)").matches)return;
  var c=document.createElement("canvas");c.id="cur";c.setAttribute("aria-hidden","true");document.body.appendChild(c);
  document.body.classList.add("star-cursor");
  var x=c.getContext("2d"),W,H,T=[],S=[],mx=-99,my=-99,on=false,big=1,hold=false,tt=0;
  function size(){W=c.width=innerWidth;H=c.height=innerHeight}size();addEventListener("resize",size);
  addEventListener("mousemove",function(e){mx=e.clientX;my=e.clientY;on=true;
    var el=e.target&&e.target.closest?e.target:null;
    big=el&&el.closest("a,button,label,select")?1.7:1;
    hold=!!(el&&el.closest("input,textarea"));
    if(Math.random()<.6)S.push({x:mx,y:my,vx:(Math.random()-.5)*1.4,vy:.3+Math.random()*1.2,l:1,r:.7+Math.random()*1.5})});
  document.documentElement.addEventListener("mouseleave",function(){on=false});
  var fr=document.querySelector(".mapbox iframe");if(fr){fr.addEventListener("mouseenter",function(){on=false});fr.addEventListener("mouseleave",function(){on=true})}
  document.documentElement.addEventListener("mouseenter",function(){on=true});
  function draw(){
    x.clearRect(0,0,W,H);tt+=.05;
    T.push({x:mx,y:my});if(T.length>26)T.shift();
    if(on&&T.length>1){x.lineCap="round";x.lineJoin="round";
      for(var i=1;i<T.length;i++){var a=i/T.length;
        x.globalAlpha=a*.28;x.strokeStyle="#f3dc9a";x.lineWidth=a*9;
        x.beginPath();x.moveTo(T[i-1].x,T[i-1].y);x.lineTo(T[i].x,T[i].y);x.stroke();
        x.globalAlpha=a*.95;x.strokeStyle="#fff";x.lineWidth=a*2.6;
        x.beginPath();x.moveTo(T[i-1].x,T[i-1].y);x.lineTo(T[i].x,T[i].y);x.stroke()}}
    for(var k=S.length-1;k>=0;k--){var p=S[k];p.l-=.035;p.x+=p.vx;p.y+=p.vy;
      if(p.l<=0){S.splice(k,1);continue}
      x.globalAlpha=p.l;x.fillStyle=k%2?"#f3dc9a":"#fff";x.beginPath();x.arc(p.x,p.y,p.r*p.l,0,7);x.fill()}
    if(on&&!hold){var r=9*big,g=x.createRadialGradient(mx,my,0,mx,my,r*2.6);
      g.addColorStop(0,"rgba(255,255,255,.95)");g.addColorStop(.35,"rgba(243,220,154,.55)");g.addColorStop(1,"rgba(243,220,154,0)");
      x.globalAlpha=1;x.fillStyle=g;x.beginPath();x.arc(mx,my,r*2.6,0,7);x.fill();
      x.save();x.translate(mx,my);x.rotate(tt);x.fillStyle="#fff";x.beginPath();
      for(var j=0;j<8;j++){var rr=j%2?r*.38:r;var an=j*Math.PI/4;x.lineTo(Math.cos(an)*rr,Math.sin(an)*rr)}
      x.closePath();x.fill();x.restore()}
    x.globalAlpha=1;requestAnimationFrame(draw)}
  draw();
})();

/* guest limit: max 3 per form, with a hint to submit another form */
$("pax").addEventListener("input",function(){var h=$("paxNote"),bad=+this.value>3;if(!h.dataset.d)h.dataset.d=h.textContent;h.classList.toggle("warn",bad);h.textContent=bad?"Only 3 guests are allowed per form. Please submit another RSVP form for the other guests.":h.dataset.d;this.setCustomValidity(bad?"Maximum of 3 guests per form":"")});

/* RSVP: save each response as a new row in a Google Sheet */
$("f").addEventListener("submit",function(e){
  e.preventDefault();
  var v=function(id){return $(id).value.trim()},m=$("msg"),
      d={name:v("name"),attending:v("att"),guests:v("pax"),message:v("note")||"-"};
  if(+d.guests>3||+d.guests<1){m.textContent="Sorry, only up to 3 guests per RSVP. Please submit another form for additional people.";$("pax").focus();return}
  function viaMail(){
    var body="RSVP for Margarette Mendoza's 18th Birthday\n\nName: "+d.name+"\nAttending: "+d.attending+"\nGuests: "+d.guests+"\nMessage: "+d.message;
    m.textContent="Opening your email app. Press send to finish your RSVP.";
    location.href="mailto:"+CFG.email+"?subject="+encodeURIComponent("RSVP: "+d.name)+"&body="+encodeURIComponent(body);
  }
  if(!CFG.sheetUrl){viaMail();return}
  m.textContent="Sending...";
  fetch(CFG.sheetUrl,{method:"POST",mode:"no-cors",body:new URLSearchParams(d)})
   .then(function(){m.textContent="Thank you, "+d.name+"! Your RSVP was saved.";$("f").reset()})
   .catch(viaMail);
});

/* background video: starts on its own, loops, has sound, and a play/pause button (lower right).
   On phone-size screens (760px wide or less) the video is never loaded or shown: the starry sky is used instead. */
(function(){
  var vd=$("vid"),cv=$("bg"),note=$("vnote"),mq=matchMedia("(max-width:760px)"),
      hasSrc=!!CFG.video,failed=false,started=false,userPaused=false,userMuted=false,
  svg=function(p){return '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">'+p+'</svg>'},
  spk='<path fill="currentColor" d="M3 10v4h4l5 4V6L7 10H3z"/>',
  I={play:svg('<path fill="currentColor" d="M8 5v14l11-7z"/>'),
     pause:svg('<path fill="currentColor" d="M6 5h4v14H6zM14 5h4v14h-4z"/>'),
     on:svg(spk+'<path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11"/>'),
     off:svg(spk+'<path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M16 9l5 6M21 9l-5 6"/>')};
  var ui=document.createElement("div");ui.id="media";ui.innerHTML='<button id="snd" type="button"></button><button id="pp" type="button"></button>';
  var toast=document.createElement("div");toast.id="toast";toast.setAttribute("role","status");toast.textContent="Tap anywhere to turn on the sound";
  document.body.appendChild(ui);document.body.appendChild(toast);
  var pp=$("pp"),snd=$("snd"),evs=["pointerup","click","keydown","touchend"];
  function live(){return hasSrc&&!failed&&!mq.matches}
  function paused(){return live()?vd.paused:!!window.__skyPaused}
  function sync(){
    pp.innerHTML=paused()?I.play:I.pause;pp.setAttribute("aria-label",paused()?"Play":"Pause");
    snd.innerHTML=vd.muted?I.off:I.on;snd.setAttribute("aria-label",vd.muted?"Turn sound on":"Mute sound");
    snd.style.display=live()?"":"none"}
  function layout(){var v=live();vd.style.display=v?"block":"none";cv.style.display=v?"none":"block";note.hidden=mq.matches||(hasSrc&&!failed)}
  function unlock(e){
    if(!live()||(e&&e.target&&e.target.closest&&e.target.closest("#media")))return;
    if(vd.muted&&!userMuted){vd.muted=false;if(!userPaused)vd.play().catch(function(){});toast.classList.remove("show")}
    if(!vd.muted||userMuted)evs.forEach(function(n){removeEventListener(n,unlock)})}
  /* browsers block autoplay with sound until the visitor interacts: try with sound, fall back to muted, turn the sound on at the first tap or key press */
  function begin(){
    if(!vd.getAttribute("src")){vd.src=CFG.video;vd.loop=true;vd.playsInline=true;vd.preload="auto"}
    started=true;evs.forEach(function(n){addEventListener(n,unlock,{passive:true})});
    vd.muted=userMuted;
    var pr=vd.play();
    if(pr&&pr.catch)pr.catch(function(){vd.muted=true;vd.play().catch(function(){});toast.classList.add("show");setTimeout(function(){toast.classList.remove("show")},9000);sync()})}
  function onScreen(){layout();if(live()){if(!userPaused)begin()}else if(started)vd.pause();sync()}
  pp.onclick=function(){
    if(live()){if(vd.paused){userPaused=false;vd.play().catch(function(){})}else{userPaused=true;vd.pause()}}
    else{window.__skyPaused=!window.__skyPaused;sync()}};
  snd.onclick=function(){userMuted=!vd.muted;vd.muted=!vd.muted;toast.classList.remove("show");
    if(!vd.muted&&vd.paused&&!userPaused)vd.play().catch(function(){});sync()};
  vd.addEventListener("error",function(){if(!vd.getAttribute("src"))return;failed=true;layout();sync()});
  vd.addEventListener("ended",function(){vd.currentTime=0;vd.play().catch(function(){})});
  ["play","pause","volumechange"].forEach(function(n){vd.addEventListener(n,sync)});
  document.addEventListener("visibilitychange",function(){if(!document.hidden&&live()&&started&&!userPaused)vd.play().catch(function(){})});
  if(mq.addEventListener)mq.addEventListener("change",onScreen);else if(mq.addListener)mq.addListener(onScreen);
  onScreen();
})();

/* looping midnight sky: twinkling stars and shooting stars */
(function(){
  var c=$("bg"),x=c.getContext("2d"),W,H,S=[],M=null;
  function size(){W=c.width=innerWidth;H=c.height=innerHeight;S=[];var n=Math.round(W*H/2800);
    for(var i=0;i<n;i++)S.push({x:Math.random()*W,y:Math.random()*H,r:.4+Math.random()*1.4,t:Math.random()*6.28,z:.04+Math.random()*.25,v:.01+Math.random()*.03,d:.02+Math.random()*.08})}
  size();addEventListener("resize",size);
  function draw(){
    if(window.__skyPaused){requestAnimationFrame(draw);return}
    var g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,"#03061a");g.addColorStop(.6,"#0a1440");g.addColorStop(1,"#16276b");
    x.fillStyle=g;x.fillRect(0,0,W,H);
    S.forEach(function(p){p.t+=p.v;p.y-=p.d;if(p.y<-2)p.y=H+2;var yy=((p.y-(window.scrollY||0)*p.z)%H+H)%H;
      var a=.35+.65*Math.abs(Math.sin(p.t));
      x.globalAlpha=a;x.fillStyle="#fff";x.beginPath();x.arc(p.x,yy,p.r,0,7);x.fill();
      if(p.r>1.3){x.globalAlpha=a*.35;x.beginPath();x.arc(p.x,yy,p.r*2.6,0,7);x.fill()}});
    if(!M&&Math.random()<.004)M={x:Math.random()*W*.8+W*.2,y:Math.random()*H*.4,l:0};
    if(M){M.l++;var k=Math.max(0,M.l-14);
      x.globalAlpha=Math.max(0,1-M.l/50);x.strokeStyle="#fff";x.lineWidth=1.6;
      x.beginPath();x.moveTo(M.x-k*9,M.y+k*4.5);x.lineTo(M.x-M.l*9,M.y+M.l*4.5);x.stroke();
      if(M.l>50)M=null}
    x.globalAlpha=1;requestAnimationFrame(draw);
  }
  draw();
})();
