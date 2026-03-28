export function loadDataSafe(){
  try{
    const raw=new URLSearchParams(location.search).get("d");
    if(!raw) throw 0;
    const json=LZString.decompressFromEncodedURIComponent(raw);
    return JSON.parse(json);
  }catch{
    return {d:[{dt:"サンプル",c:[]}]};
  }
}

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
