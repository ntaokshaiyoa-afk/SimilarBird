const list=document.getElementById("list");

let data={d:[{dt:"1日目",c:[]}]};

// ===== 追加 =====
window.addCard=function(){
  data.d[0].c.push({
    s:"09:00",
    e:"10:00",
    tt:"新規",
    m:"walk"
  });
  render();
}

// ===== 描画 =====
function render(){
  list.innerHTML="";

  data.d[0].c.forEach(c=>{
    const el=document.createElement("div");
    el.className="card";
    el.innerText=`${c.s} ${c.tt}`;
    list.appendChild(el);
  });
}

// ===== URL =====
window.generate=function(){
  const d=LZString.compressToEncodedURIComponent(JSON.stringify(data));
  const url=location.origin+"/SimilarBird/?d="+d;
  alert(url);
}

render();
