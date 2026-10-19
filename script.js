/* ===== EDIT THESE ===== */
var CFG={
  date:"November 8, 2026", time:"5:00 PM", venue:"Marikina Convention Center, Plenary Hall", attire:"Formal, blue and white",
  email:"mickaela.jeorge@gmail.com",
  /* Paste your Google Apps Script web app URL here (see setup steps). */
  sheetUrl:"https://script.google.com/macros/s/AKfycbxOXfTBnoBLErkxnjG8fiHIXdSF9ghahw6a0febsk4SXi8rSGAZQwKI5EiEZES7KXJA/exec",
  video:"",        /* optional background video (.mp4 link); empty = starry animation */
  detailVideo:"",  /* video shown beside the details */
  photos:["assets/photos/roses-1.jpg", "assets/photos/candles-1.jpg", "assets/photos/treasures-1.jpg", "assets/photos/bills-1.jpg", "assets/photos/roses-2.jpg", "assets/photos/candles-2.jpg", "assets/photos/treasures-2.jpg", "assets/photos/bills-2.jpg"],  /* 8 photos: first 4 are the big ones (roses, candles, treasures, blue bills), last 4 the small overlapping ones */
  roses:[], candles:[], treasures:[], bills:[] /* up to 18 names each */
};
var GROUPS=[
 {k:"roses",t:"18 Roses",d:"Eighteen special people who each present a rose to the debutante."},
 {k:"candles",t:"18 Candles",d:"Eighteen people who light a candle and share a message of love."},
 {k:"treasures",t:"18 Treasures",d:"Eighteen people who give a keepsake gift the debutante will treasure."},
 {k:"bills",t:"18 Blue Bills",d:"Eighteen people who give a blue bill to wish her a bright future."}
];
var $=function(id){return document.getElementById(id)};

/* details */
$("heroDate").textContent=CFG.date;
$("heroTime").textContent="at "+CFG.time+" · "+CFG.venue;
$("iDate").textContent=CFG.date;$("iTime").textContent=CFG.time;$("iVenue").textContent=CFG.venue;$("iAttire").textContent=CFG.attire;
(function(){var f=$("dvid");
  if(CFG.detailVideo){var v=document.createElement("video");v.src=CFG.detailVideo;v.controls=true;v.playsInline=true;v.preload="metadata";f.className+=" has";f.appendChild(v)}
  else f.textContent="Video: add from our file"})();

/* the 18s: alternating parallax chapters */
GROUPS.forEach(function(g,i){
  var names=CFG[g.k],s=document.createElement("section");
  s.className="chapter "+(i%2?"left":"right");
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

/* parallax: photo and text drift at different speeds while scrolling */
(function(){
  if(matchMedia("(prefers-reduced-motion:reduce)").matches)return;
  var chs=[].slice.call(document.querySelectorAll(".chapter")),tick=false;
  function run(){tick=false;var vh=innerHeight;
    chs.forEach(function(c){var r=c.getBoundingClientRect();if(r.bottom<-200||r.top>vh+200)return;
      var d=r.top+r.height/2-vh/2;
      c.querySelector(".pw").style.transform="translateY("+(-d*.14).toFixed(1)+"px)";
      c.querySelector(".ph2").style.transform="translateY("+(d*.12).toFixed(1)+"px)";
      c.querySelector(".txt").style.transform="translateY("+(d*.05).toFixed(1)+"px)"})}
  addEventListener("scroll",function(){if(!tick){tick=true;requestAnimationFrame(run)}},{passive:true});
  addEventListener("resize",run);run();
})();

/* scroll-linked animation: progress rail with a star that follows the scroll,
   hero fade, stars shifting with scroll, and items that appear as you scroll */
(function(){
  if(matchMedia("(prefers-reduced-motion:reduce)").matches)return;
  var rail=document.createElement("div");rail.id="rail";rail.setAttribute("aria-hidden","true");
  rail.innerHTML="<i></i><b></b>";document.body.appendChild(rail);
  var bar=rail.firstChild,dot=rail.lastChild,hero=document.querySelector(".hero"),tick=false,
      items=[].slice.call(document.querySelectorAll("li,#details .vfig,#details .info div,#rsvp h2,#rsvp form,#details h2"));
  function run(){tick=false;
    var vh=innerHeight,y=scrollY,max=document.documentElement.scrollHeight-vh,p=max>0?Math.min(1,Math.max(0,y/max)):0;
    bar.style.transform="scaleY("+p+")";dot.style.top=(p*100)+"%";
    hero.style.transform="translateY("+(y*.35).toFixed(1)+"px) scale("+(1-Math.min(y/vh,1)*.08).toFixed(3)+")";
    hero.style.opacity=Math.max(0,1-y/(vh*.75)).toFixed(2);
    items.forEach(function(el){var r=el.getBoundingClientRect();
      var t=Math.min(1,Math.max(0,(vh*.94-r.top)/(vh*.26)));
      el.style.opacity=t.toFixed(2);el.style.transform="translateY("+((1-t)*26).toFixed(1)+"px)"});
  }
  addEventListener("scroll",function(){if(!tick){tick=true;requestAnimationFrame(run)}},{passive:true});
  addEventListener("resize",run);run();
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
    var body="RSVP for Margarette Pollana's 18th Birthday\n\nName: "+d.name+"\nAttending: "+d.attending+"\nGuests: "+d.guests+"\nMessage: "+d.message;
    m.textContent="Opening your email app. Press send to finish your RSVP.";
    location.href="mailto:"+CFG.email+"?subject="+encodeURIComponent("RSVP: "+d.name)+"&body="+encodeURIComponent(body);
  }
  if(!CFG.sheetUrl){viaMail();return}
  m.textContent="Sending...";
  fetch(CFG.sheetUrl,{method:"POST",mode:"no-cors",body:new URLSearchParams(d)})
   .then(function(){m.textContent="Thank you, "+d.name+"! Your RSVP was saved.";$("f").reset()})
   .catch(viaMail);
});

if(CFG.video){var vd=$("vid");vd.src=CFG.video;vd.style.display="block";$("bg").style.display="none"}

/* looping midnight sky: twinkling stars and shooting stars */
(function(){
  var c=$("bg"),x=c.getContext("2d"),W,H,S=[],M=null;
  function size(){W=c.width=innerWidth;H=c.height=innerHeight;S=[];var n=Math.round(W*H/2800);
    for(var i=0;i<n;i++)S.push({x:Math.random()*W,y:Math.random()*H,r:.4+Math.random()*1.4,t:Math.random()*6.28,z:.04+Math.random()*.25,v:.01+Math.random()*.03,d:.02+Math.random()*.08})}
  size();addEventListener("resize",size);
  function draw(){
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
