/* GIAO DIỆN — màn hình, popup, hiệu ứng */
const $=s=>document.querySelector(s);
const DEF={jade:0,owned:[],belief:'saint'};
let S;try{S={...DEF,...JSON.parse(localStorage.getItem('loichoi')||'{}')}}catch(e){S={...DEF}}
const save=()=>{try{localStorage.setItem('loichoi',JSON.stringify(S))}catch(e){}};
const av=s=>s.startsWith('assets/')?`<img class="av" src="${s}" alt="">`:`<div class="av">${s}</div>`;
let tab='fight',timer=null,sel=[];
const V={
 fight(){const p=pStats([]),b=BEL[S.belief];
  return `<section class="box"><b>Nhân vật chính</b><p class="mut">❤️ ${p.hp} · ⚔️ ${p.atk} · 🛡️ ${p.def} · Tín ngưỡng: ${b.icon} ${b.name} · Thẻ sở hữu: ${S.owned.length}/${BOSS.length}</p></section><div class="grid">`+
  BOSS.map(b=>`<div class="box boss ${b.tier}"><span class="tag">${b.tier==='elite'?'ELITE · 2 thẻ':'NORMAL · 1 thẻ'}</span>${av(b.emoji)}<h3>${b.name}${b.units>1?' (x2)':''}</h3><p class="mut">❤️${b.hp} ⚔️${b.atk} 🛡️${b.def} ⚡${b.en}</p><p class="mut">Thưởng 💎${CFG.equip[b.tier].jade}</p><button class="btn" data-fight="${b.id}">Khiêu chiến</button></div>`).join('')+'</div>'},
 cards(){return '<div class="grid">'+BOSS.map(b=>{const o=S.owned.includes(b.id);return `<div class="box boss" style="${o?'':'opacity:.5'}">${av(b.emoji)}<h3>${b.name}</h3><p class="mut">${o?b.card:'🔒 Đánh bại boss này để mở khoá thẻ.'}</p></div>`}).join('')+'</div>'},
 belief(){return '<p class="mut">Chỉ trang bị được 1 tín ngưỡng. Biểu tượng này sẽ được ném vào mặt kẻ địch thay cho cục tròn.</p><div class="row">'+Object.entries(BEL).map(([k,b])=>`<button class="box pick ${S.belief===k?'on':''}" data-bel="${k}"><div style="font-size:3rem">${b.icon}</div><b>${b.name}</b><p class="mut">${b.desc}</p></button>`).join('')+'</div>'}};
function show(){$('#jade').textContent='💎 '+S.jade;document.querySelectorAll('#tabs button').forEach(x=>x.classList.toggle('on',x.dataset.t===tab));$('#view').innerHTML=V[tab]()}
function prep(id){
 const b=BOSS.find(x=>x.id===id),lim=CFG.equip[b.tier].max,p=pStats(sel);
 $('#modal').hidden=false;$('#modal').dataset.id=id;
 $('#modal').innerHTML=`<div class="dlg"><h2>${b.emoji} ${b.name}</h2><p class="mut">Được mang tối đa ${lim} thẻ. Mỗi thẻ: +${CFG.equip[b.tier].hp} máu, +${CFG.equip[b.tier].atk} Atk.</p>
 <div class="row">`+(S.owned.length?S.owned.map(o=>{const c=BOSS.find(x=>x.id===o),on=sel.includes(o);return `<button class="box pick ${on?'on':''}" data-card="${o}">${c.emoji} <b>${c.name}</b><p class="mut">${c.card}</p></button>`}).join(''):'<p class="mut">Bạn chưa có thẻ nào. Thắng boss để mở khoá!</p>')+`</div>
 <p style="margin-top:14px">Bạn: ❤️${p.hp} ⚔️${p.atk} 🛡️${p.def} · ${BEL[S.belief].icon} ${BEL[S.belief].name}</p>
 <div class="row"><button class="btn" data-go="${id}">Bắt đầu</button><button class="btn alt" data-close>Quay lại</button></div></div>`}
const unit=c=>`<div class="unit" id="u${c.i}">${av(c.emoji)}<div class="nm">${c.name}</div><div class="bar hp"><i></i></div><div class="bar en"><i style="width:0"></i></div><div class="st"></div></div>`;
function fight(id){
 const b=BOSS.find(x=>x.id===id);B=startBattle(b,sel.slice(0,CFG.equip[b.tier].max));
 $('#modal').hidden=true;const v=$('#battle');v.hidden=false;
 v.innerHTML=`<div><div id="arena"><div class="side p">${unit(B.P)}</div><div class="side e">${B.E.map(unit).join('')}</div></div><div class="row" style="justify-content:center"><button class="btn alt" data-flee>Bỏ chạy</button></div></div>`;
 B.all.forEach(c=>c.el=$('#u'+c.i));clearInterval(timer);timer=setInterval(tick,CFG.tick)}
Ev.tick=()=>B.all.forEach(c=>{const e=c.el,k=c.cards.find(x=>x.en);
 e.querySelector('.hp i').style.width=100*c.hp/c.max+'%';
 if(k)e.querySelector('.en i').style.width=Math.min(100,k.meter)+'%';
 e.querySelector('.st').textContent=`❤️${Math.ceil(c.hp)} ⚔️${Math.round(A(c))} 🛡️${c.def}`+(c.crit?` 🎯${Math.round(c.crit*100)}%`:'')+(c.dodge?` 💨${Math.round(c.dodge*100)}%`:'')+(c.burnT>0?' 🔥':'')});
Ev.pop=(t,txt,cls)=>{const s=document.createElement('span');s.className='pop '+cls;s.textContent=txt;s.style.marginLeft=(Math.random()*40-20)+'px';t.el.appendChild(s);setTimeout(()=>s.remove(),900)};
Ev.banner=(txt)=>{if(!txt)return;const s=document.createElement('div');s.className='banner';s.textContent=txt;document.body.appendChild(s);setTimeout(()=>s.remove(),2200)};
Ev.dead=t=>t.el.classList.add('dead');
Ev.proj=(a,t)=>{const ar=$('#arena'),r=ar.getBoundingClientRect(),x=a.el.getBoundingClientRect(),y=t.el.getBoundingClientRect(),s=document.createElement('span');
 s.className='proj';s.textContent=a.icon;ar.appendChild(s);
 const f=[x.left+x.width/2-r.left,x.top+x.height/3-r.top],g=[y.left+y.width/2-r.left,y.top+y.height/3-r.top];
 s.animate([{transform:`translate(${f[0]}px,${f[1]}px)`},{transform:`translate(${g[0]}px,${g[1]}px) scale(1.5) rotate(360deg)`}],{duration:350,easing:'ease-in'}).onfinish=()=>{s.remove();t.el.classList.add('hit');setTimeout(()=>t.el.classList.remove('hit'),180)};
 a.el.classList.add('lunge');setTimeout(()=>a.el.classList.remove('lunge'),200)};
Ev.end=win=>{clearInterval(timer);const b=B.boss,j=CFG.equip[b.tier].jade;let msg;
 if(win){S.jade+=j;const nw=!S.owned.includes(b.id);if(nw)S.owned.push(b.id);save();msg=`<h2>🏆 Chiến thắng!</h2><p>+💎${j}</p>${nw?`<p>Mở khoá thẻ <b>${b.name}</b> ${b.emoji}</p>`:''}`}
 else msg='<h2>💀 Thất bại</h2><p class="mut">Thử đổi thẻ bài hoặc tín ngưỡng nhé.</p>';
 setTimeout(()=>{$('#battle').hidden=true;$('#modal').hidden=false;$('#modal').innerHTML=`<div class="dlg">${msg}<div class="row"><button class="btn" data-close>Tiếp tục</button></div></div>`;sel=[];show()},900)};
document.addEventListener('click',e=>{const d=e.target.closest('button');if(!d)return;const x=d.dataset;
 if(x.t){tab=x.t;show()}
 else if(x.fight){sel=[];prep(x.fight)}
 else if(x.card){const l=CFG.equip[BOSS.find(b=>b.id===$('#modal').dataset.id).tier].max;sel=sel.includes(x.card)?sel.filter(i=>i!==x.card):[...sel,x.card].slice(-l);prep($('#modal').dataset.id)}
 else if(x.bel){S.belief=x.bel;save();show()}
 else if(x.go)fight(x.go);
 else if('close' in x){$('#modal').hidden=true}
 else if('flee' in x){clearInterval(timer);B.over=true;$('#battle').hidden=true}});
show();
