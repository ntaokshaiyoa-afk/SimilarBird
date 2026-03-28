import {nearest} from "./core.js";

let data={d:[{dt:"1日目",c:[]}]};
let stations=[];

fetch("./stations.json").then(r=>r.json()).then(s=>stations=s);

// 地図クリック
map.on("click",e=>{
  const st=nearest(stations,e.latlng.lat,e.latlng.lng);

  current.la=st.lat;
  current.lo=st.lng;
  current.station=st.name;
});
