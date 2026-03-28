import {loadDataSafe,nearest,commonLine,findRoute,getCurrentIndex} from "./core.js";

const data=loadDataSafe();
let di=0;
let openIndex=null;
let firstRender=true;
let stations=[];
let lineCache={};

fetch("./stations.json").then(r=>r.json()).then(s=>{
  stations=s;
  render();
});

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
        ${c.la?`<div id="m${di}_${i}" class="map"></div>`:""}
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
}

// ===== 地図 =====
async function initMap(i,c){
  const map=L.map(`m${di}_${i}`).setView([c.la,c.lo],13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
  L.marker([c.la,c.lo]).addTo(map);

  const prev=data.d[di].c[i-1];
  if(!prev) return;

  if(c.m==="train"){
    const a=nearest(stations,prev.la,prev.lo);
    const b=nearest(stations,c.la,c.lo);
    const route=findRoute(stations,a,b);

    if(route){
      for(let j=0;j<route.length-1;j++){
        const line=commonLine(route[j],route[j+1]);
        const geo=await loadLine(line);

        if(geo){
          L.geoJSON(geo,{style:{color:"blue"}}).addTo(map);
        }
      }
    }
  }
}

// ===== GeoJSON =====
async function loadLine(line){
  if(lineCache[line]) return lineCache[line];

  try{
    const res=await fetch(`./lines/${line}.geojson`);
    const json=await res.json();
    lineCache[line]=json;
    return json;
  }catch{
    return null;
  }
}
