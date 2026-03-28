import {nearest} from "./core.js";

const list=document.getElementById("list");

let data={d:[{dt:"1日目",c:[]}]};
let editIndex=null;
let map, marker;
let stations=[];

// ===== 駅 =====
fetch("./stations.json").then(r=>r.json()).then(s=>stations=s);

// ===== 追加 =====
document.getElementById("addBtn").onclick=()=>{
  data.d[0].c.push({
    s:"09:00",
    e:"10:00",
    tt:"新規",
    m:"walk"
  });
  render();
};

// ===== URL生成 =====
let currentURL="";
document.getElementById("genBtn").onclick=()=>{
  const d=LZString.compressToEncodedURIComponent(JSON.stringify(data));
  currentURL=location.origin+"/SimilarBird/?d="+d;
  document.getElementById("urlOut").value=currentURL;
};

// ===== コピー =====
document.getElementById("copyBtn").onclick=()=>{
  navigator.clipboard.writeText(currentURL);
  alert("コピーOK");
};

// ===== 描画 =====
function render(){
  list.innerHTML="";

  data.d[0].c.forEach((c,i)=>{
    const el=document.createElement("div");
    el.className="card";

    el.innerHTML=`
      <div class="header">
        ${c.s} ${c.tt}
      </div>
    `;

    el.onclick=()=>openEditor(i);

    list.appendChild(el);
  });
}

// ===== 編集 =====
function openEditor(i){
  editIndex=i;
  const c=data.d[0].c[i];

  modal.style.display="block";

  title.value=c.tt||"";
  start.value=c.s;
  end.value=c.e;
  mode.value=c.m||"walk";
  comment.value=c.cm||"";

  initMap(c);
}

// ===== 地図 =====
function initMap(c){
  if(map) map.remove();

  map=L.map("map").setView([c.la||35,c.lo||139],13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

  if(c.la){
    marker=L.marker([c.la,c.lo]).addTo(map);
  }

  map.on("click",e=>{
    const st=nearest(stations,e.latlng.lat,e.latlng.lng);

    if(marker) marker.remove();
    marker=L.marker([st.lat,st.lng]).addTo(map);

    const card=data.d[0].c[editIndex];
    card.la=st.lat;
    card.lo=st.lng;
    card.station=st.name;
  });
}

// ===== 保存 =====
document.getElementById("saveBtn").onclick=()=>{
  const c=data.d[0].c[editIndex];

  c.tt=title.value;
  c.s=start.value;
  c.e=end.value;
  c.m=mode.value;
  c.cm=comment.value;

  modal.style.display="none";
  render();
};

// ===== 削除 =====
document.getElementById("delBtn").onclick=()=>{
  data.d[0].c.splice(editIndex,1);
  modal.style.display="none";
  render();
};

// ===== 閉じる =====
window.closeModal=()=>{
  modal.style.display="none";
};

// 初期
render();
