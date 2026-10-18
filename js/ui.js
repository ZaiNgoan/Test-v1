/* GIAO DIỆN v0.2 — màn hình, đội hình, hiệu ứng */
const $=s=>document.querySelector(s);
const DEF={jade:0,owned:[],belief:'saint',form:[]};
let S;try{S={...DEF,...JSON.parse(localStorage.getItem('loichoi')||'{}')}}catch(e){S={...DEF}}
if(!Array.isArray(S.form))S.form=[];
S.form=[0,1,2,3,4,5].map(i=>S.owned.includes(S.form[i])?S.form[i]:null);
const save=()=>{try{localStorage.setItem('loichoi',JSON.stringify(S))}catch(e){}};
const av=s=>s.startsWith('assets/')?`<img class="av" src="${s}" alt="" draggable="false">`:`<div class="av">${s}</div>`;
const FLY=600; /* thời gian bay của icon (ms) — tăng số này để icon bay chậm/xa hơn */
let tab='fight',timer=null,holding=null;
const V={
 fight(){const p=pStats([]),b=BEL[S.belief],n=S.form.filter(Boolean).length;
  return `<section class="box"><b>Nhân vật chính</b><p class="mut">❤️ ${p.hp} · ⚔️ ${p.atk} · 🛡️ ${p.def} · Tín ngưỡng: ${b.icon} ${b.name}</p><p class="mut">Đội hình ra sân: ${n}/6 · Thẻ sở hữu: ${S.owned.length}/${BOSS.length}${n?'':' — vào tab Đội hình để xếp đồng đội!'}</p></section><div class="grid">`+
  BOSS.map(b=>`<div class="box boss ${b.tier}"><span class="tag">${b.tier==='elite'?'ELITE':'NORMAL'}</span>${av(b.emoji)}<h3>${b.name}${b.units>1?' (x2)':''}</h3><p class="mut">❤️${b.hp} ⚔️${b.atk} 🛡️${b.def} ⚡${b.en}</p><p class="mut">Thưởng 💎${CFG.equip[b.tier].jade}</p><button class="btn" data-fight="${b.id}">Khiêu chiến</button></div>`).join('')+'</div>'},
 cards(){return '<div class="grid">'+BOSS.map(b=>{const o=S.owned.includes(b.id);return `<div class="box boss" style="${o?'':'opacity:.5'}">${av(b.emoji)}<h3>${b.name}</h3><p class="mut">${o?b.card:'🔒 Đánh bại boss này để mở khoá thẻ.'}</p></div>`}).join('')+'</div>'},
 team(){
  const slot=i=>{const id=S.form[i],c=id&&BOSS.find(x=>x.id===id);
   return `<div class="slot ${c?'full':''}" data-slot="${i}" ${c?`draggable="true" data-drag="${id}"`:''}>${c?av(c.emoji)+`<b>${c.name}</b>`:'<span class="mut">Trống</span>'}</div>`};
  const hd=holding?BOSS.find(x=>x.id===holding):null;
  return `<p class="mut">${hd?`Đang chọn <b>${hd.name}</b> — chạm vào một ô để đặt.`:'Kéo nhân vật xuống ô trống (hoặc chạm nhân vật rồi chạm ô). Chạm ô đã có người để gỡ ra. Hàng trước chịu đòn trước.'}</p>
  <div class="fm"><div><h4>Hàng trước</h4><div class="slots">${[0,1,2].map(slot).join('')}</div></div><div><h4>Hàng sau</h4><div class="slots">${[3,4,5].map(slot).join('')}</div></div></div>
  <h3>Nhân vật của bạn</h3>`+(S.owned.length?'<div class="grid">'+S.owned.map(id=>{const c=BOSS.find(x=>x.id===id),q=aSt(c),on=S.form.includes(id);
   return `<div class="box boss rost ${holding===id?'on':''}" draggable="true" data-drag="${id}" data-pick="${id}">${on?'<span class="tag">ĐÃ RA SÂN</span>':''}${av(c.emoji)}<h3>${c.name}</h3><p class="mut">❤️${q.hp} ⚔️${q.atk} 🛡️${q.def}</p><p class="mut">${c.card}</p></div>`}).join('')+'</div>':'<p class="mut">Bạn chưa có nhân vật nào. Thắng boss ở tab Chiến đấu để mở khoá!</p>')},
 belief(){return '<p class="mut">Chỉ trang bị được 1 tín ngưỡng. Biểu tượng này sẽ được ném vào mặt kẻ địch thay cho cục tròn.</p><div class="row">'+Object.entries(BEL).map(([k,b])=>`<button class="box pick ${S.belief===k?'on':''}" data-bel="${k}"><div style="font-size:3rem">${b.icon}</div><b>${b.name}</b><p class="mut">${b.desc}</p></button>`).join('')+'</div>'}};
function show(){$('#jade').textContent='💎 '+S.jade;document.querySelectorAll('#tabs button').forEach(x=>x.classList.toggle('on',x.dataset.t===tab));$('#view').innerHTML=V[tab]()}
function place(id,i){const f=S.form,from=f.indexOf(id),old=f[i];if(from>=0)f[from]=old;f[i]=id;holding=null;save();show()}
function unplace(id){const k=S.form.indexOf(id);if(k>=0)S.form[k]=null;holding=null;save();show()}
/* ---- Chiến đấu ---- */
const unit=c=>{const en=c.cards.some(k=>k.en);
 return `<div class="unit ${c.hero?'hero':c.side==='p'?'ally':''}" id="u${c.i}"><div class="ub">${av(c.emoji)}<div class="sc"></div></div><div class="nm">${c.name}</div><div class="bar hp"><i></i></div>${en?'<div class="bar en"><i style="width:0"></i></div>':''}<div class="st"></div></div>`};
function fight(id){
 const b=BOSS.find(x=>x.id===id);startBattle(b);
 const col=r=>`<div class="col">${B.A.filter(c=>c.row===r).map(unit).join('')}</div>`;
 const v=$('#battle');v.hidden=false;
 v.innerHTML=`<div id="stage"><div id="arena"><div class="side p">${col(1)}${col(0)}<div class="col">${unit(B.P)}</div></div><div class="side e">${B.E.map(unit).join('')}</div></div><div class="row" style="justify-content:center"><button class="btn alt" data-flee>Bỏ chạy</button></div></div>`;
 B.all.forEach(c=>c.el=$('#u'+c.i));clearInterval(timer);timer=setInterval(tick,CFG.tick)}
const shake=()=>{const a=$('#arena');a&&a.animate([{transform:'translate(0)'},{transform:'translate(-7px,3px)'},{transform:'translate(7px,-3px)'},{transform:'translate(-4px,2px)'},{transform:'translate(0)'}],{duration:280})};
Ev.tick=()=>B.all.forEach(c=>{const e=c.el,k=c.cards.find(x=>x.en),en=e.querySelector('.en i');
 e.querySelector('.hp i').style.width=100*c.hp/c.max+'%';
 if(k&&en)en.style.width=Math.min(100,k.meter)+'%';
 e.querySelector('.st').textContent=`❤️ ${Math.ceil(c.hp)}/${c.max}`;
 e.querySelector('.sc').innerHTML=`<span>⚔️ ${Math.round(A(c))}</span><span>🛡️ ${c.def}</span>`+(c.crit?`<span>🎯 ${Math.round(c.crit*100)}%</span>`:'')+(c.dodge?`<span>💨 ${Math.round(c.dodge*100)}%</span>`:'')+(c.burnT>0?'<span>🔥 Cháy</span>':'')});
/* Số sát thương hiện ra đúng lúc icon chạm mục tiêu */
Ev.pop=(t,txt,cls)=>setTimeout(()=>{const s=document.createElement('span');s.className='pop '+cls;s.textContent=txt;s.style.marginLeft=(Math.random()*50-25)+'px';t.el.appendChild(s);setTimeout(()=>s.remove(),1100);if(cls.includes('crit'))shake()},FLY);
Ev.banner=(txt,a)=>{if(!txt)return;const s=document.createElement('div');s.className='banner '+(a&&a.side||'p');s.innerHTML=(a?`<small>${a.name}</small>`:'')+txt;$('#banners').appendChild(s);setTimeout(()=>s.remove(),2200)};
Ev.dead=t=>t.el.classList.add('dead');
Ev.proj=(a,t)=>{const ar=$('#arena');if(!ar)return;
 const r=ar.getBoundingClientRect(),c=n=>{const q=n.el.querySelector('.av').getBoundingClientRect();return[q.left+q.width/2-r.left,q.top+q.height/2-r.top]},
 f=c(a),g=c(t),m=[(f[0]+g[0])/2,Math.min(f[1],g[1])-70],s=document.createElement('span');
 s.className='proj';s.textContent=a.icon;ar.appendChild(s);
 s.animate([{transform:`translate(${f[0]}px,${f[1]}px) scale(.8) rotate(0deg)`},{transform:`translate(${m[0]}px,${m[1]}px) scale(2) rotate(270deg)`,offset:.5},{transform:`translate(${g[0]}px,${g[1]}px) scale(1.4) rotate(540deg)`}],{duration:FLY,easing:'ease-in-out'}).onfinish=()=>{s.remove();t.el.classList.add('hit');setTimeout(()=>t.el.classList.remove('hit'),200)};
 a.el.classList.add('lunge');setTimeout(()=>a.el.classList.remove('lunge'),220)};
Ev.end=win=>{clearInterval(timer);const b=B.boss,j=CFG.equip[b.tier].jade;let msg;
 if(win){S.jade+=j;const nw=!S.owned.includes(b.id);if(nw)S.owned.push(b.id);save();msg=`<h2>🏆 Chiến thắng!</h2><p>+💎${j}</p>${nw?`<p>Mở khoá nhân vật <b>${b.name}</b> ${b.emoji} — xếp vào tab Đội hình nhé!</p>`:''}`}
 else msg='<h2>💀 Thất bại</h2><p class="mut">Thử đổi đội hình hoặc tín ngưỡng nhé.</p>';
 setTimeout(()=>{$('#battle').hidden=true;$('#modal').hidden=false;$('#modal').innerHTML=`<div class="dlg">${msg}<div class="row"><button class="btn" data-close>Tiếp tục</button></div></div>`;show()},1200)};
/* ---- Sự kiện ---- */
document.addEventListener('click',e=>{const d=e.target.closest('button,[data-slot],[data-pick]');if(!d)return;const x=d.dataset;
 if(x.slot!==undefined){const i=+x.slot;if(holding)place(holding,i);else if(S.form[i])unplace(S.form[i])}
 else if(x.pick){holding=holding===x.pick?null:x.pick;show()}
 else if(x.t){tab=x.t;holding=null;show()}
 else if(x.fight)fight(x.fight);
 else if(x.bel){S.belief=x.bel;save();show()}
 else if('close' in x){$('#modal').hidden=true}
 else if('flee' in x){clearInterval(timer);B.over=true;$('#battle').hidden=true}});
/* Kéo thả (máy tính). Trên điện thoại dùng cách chạm. */
document.addEventListener('dragstart',e=>{const d=e.target.closest('[data-drag]');if(d){e.dataTransfer.setData('text/plain',d.dataset.drag);e.dataTransfer.effectAllowed='move'}});
document.addEventListener('dragover',e=>{if(e.target.closest('#view'))e.preventDefault()});
document.addEventListener('drop',e=>{const id=e.dataTransfer.getData('text/plain');if(!BOSS.some(b=>b.id===id))return;
 const s=e.target.closest('[data-slot]');if(s){e.preventDefault();place(id,+s.dataset.slot)}else if(e.target.closest('#view')){e.preventDefault();unplace(id)}});
show();
