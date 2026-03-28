import {loadDataSafe,getCurrentIndex} from "./core.js";

const tabs=document.getElementById("tabs");
const list=document.getElementById("list");
const nextEl=document.getElementById("next");

const data=loadDataSafe();

let di=0;
let openIndex=null;
let firstRender=true;

// ===== アイコン =====
function icon(c){
  return c.m==="car"?"🚗":
         c.m==="train"?"🚃":
         c.m==="walk"?"🚶":"🎯";
}

// ===== 描画 =====
function render(){
  tabs.innerHTML="";
  list.innerHTML="";

  data.d.forEach((d,i)=>{
    const b=document.createElement("button");
    b.innerText=d.dt;
    b.onclick=()=>{
      di=i;
      openIndex=null;
      firstRender=true;
      render();
    };
    tabs.appendChild(b);
  });

  const cards=data.d[di].c;

  if(openIndex===null){
    openIndex=getCurrentIndex(cards);
  }

  cards.forEach((c,i)=>{
    const el=document.createElement("div");
    el.className="card"+(i===openIndex?" open":"");

    el.innerHTML=`
      <div class="header">
        ${icon(c)} ${c.s}-${c.e} ${c.tt||""}
      </div>
      <div class="detail">
        ${c.cm?marked.parse(c.cm):""}
        ${c.la?`<div id="m${i}" class="map"></div>`:""}
      </div>
    `;

    el.onclick=()=>{
      openIndex=(openIndex===i?null:i);
      render();
    };

    list.appendChild(el);

    if(i===openIndex && c.la){
      setTimeout(()=>initMap(i,c),0);
    }

    if(i===openIndex && firstRender){
      setTimeout(()=>el.scrollIntoView({block:"center"}),100);
    }
  });

  firstRender=false;
  updateNext();
}

// ===== 地図 =====
function initMap(i,c){
  const map=L.map(`m${i}`).setView([c.la,c.lo],13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
  L.marker([c.la,c.lo]).addTo(map);
}

// ===== 次予定 =====
function updateNext(){
  if(!data.d[di].c.length){
    nextEl.innerText="予定なし";
    return;
  }

  const now=new Date();
  const nowMin=now.getHours()*60+now.getMinutes();

  let next=null;

  data.d[di].c.forEach(c=>{
    const [h,m]=c.s.split(":");
    const t=h*60+ +m;
    if(t>=nowMin && !next) next=c;
  });

  nextEl.innerText=next
    ? `次: ${next.s} ${next.tt||next.m}`
    : "予定終了";
}

// ===== 初期化 =====
render();
