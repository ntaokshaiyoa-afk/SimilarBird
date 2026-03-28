// ===== データ読み込み =====
export function loadDataSafe(){
  try{
    const raw=new URLSearchParams(location.search).get("d");
    if(!raw) throw 0;

    const json=LZString.decompressFromEncodedURIComponent(raw);
    if(!json) throw 0;

    return JSON.parse(json);
  }catch{
    return {d:[{dt:"サンプル",c:[]}]};
  }
}

// ===== 最寄駅 =====
export function nearest(stations,lat,lng){
  let best=null,dist=999;
  stations.forEach(s=>{
    const d=(s.lat-lat)**2+(s.lng-lng)**2;
    if(d<dist){dist=d;best=s;}
  });
  return best;
}

// ===== 共通路線 =====
export function commonLine(a,b){
  return a?.lines?.find(l=>b?.lines?.includes(l));
}

// ===== 乗換 =====
export function findRoute(stations,a,b){
  if(commonLine(a,b)) return [a,b];

  for(const mid of stations){
    if(commonLine(a,mid)&&commonLine(mid,b)){
      return [a,mid,b];
    }
  }
  return null;
}

// ===== 現在カード =====
export function getCurrentIndex(cards){
  const now=new Date();
  const nowMin=now.getHours()*60+now.getMinutes();

  let idx=0;

  cards.forEach((c,i)=>{
    const [h,m]=c.s.split(":");
    const t=h*60+ +m;
    if(t<=nowMin) idx=i;
  });

  return idx;
}
