const list=document.getElementById("list");

let data={d:[{dt:"1日目",c:[]}]};

// ===== 追加 =====
function addCard(){
  data.d[0].c.push({
    s:"09:00",
    e:"10:00",
    tt:"新規カード",
    m:"walk"
  });
  render();
}

// ===== URL生成 =====
function generate(){
  const d=LZString.compressToEncodedURIComponent(JSON.stringify(data));
  const url=location.origin+"/SimilarBird/?d="+d;
  alert(url);
}

// ===== 描画 =====
function render(){
  list.innerHTML="";

  data.d[0].c.forEach((c,i)=>{
    const el=document.createElement("div");
    el.className="card";

    el.innerHTML=`
      <div class="header">${c.s} ${c.tt}</div>
    `;

    list.appendChild(el);
  });
}

// ===== イベント登録（重要）=====
document.addEventListener("DOMContentLoaded",()=>{
  document.getElementById("addBtn").onclick=addCard;
  document.getElementById("genBtn").onclick=generate;
});

// 初期描画
render();
