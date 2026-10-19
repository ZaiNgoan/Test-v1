/* GIAO DIỆN v0.2 — màn hình, đội hình, hiệu ứng */
const $=s=>document.querySelector(s);
const DEF={jade:0,owned:[],belief:'saint',form:[],gift:false};
let S;try{S={...DEF,...JSON.parse(localStorage.getItem('loichoi')||'{}')}}catch(e){S={...DEF}}
if(S.ver!==CFG.saveVer)S={...DEF,owned:[],form:[],ver:CFG.saveVer}; /* bản lưu cũ -> bắt đầu lại từ đầu */
if(!Array.isArray(S.form))S.form=[];
S.form=[0,1,2,3,4,5].map(i=>{const v=S.form[i];return v==='hero'||S.owned.includes(v)?v:null});
if(!S.form.includes('hero')){let e=S.form.indexOf(null);if(e<0)e=5;S.form[e]='hero'} /* nhân vật chính luôn nằm trong đội hình */
const save=()=>{try{localStorage.setItem('loichoi',JSON.stringify(S))}catch(e){}};
if(S.gift!==CFG.startJade){S.jade+=CFG.startJade-(S.gift===true?1000:0);S.gift=CFG.startJade;save()} /* quà khởi đầu */
const JI='<img class="ji" src="assets/ui/jade.png" alt="Jade">';
/* ảnh động: assets/<dir>/idle/idle_01.png ... và tan_cong/tan_cong_01.png ... */
const frame=(c,m,i)=>`${c.anim.dir}/${m==='atk'?'attack':'idle'}_${String(i+1).padStart(2,'0')}.png`;
BOSS.filter(c=>c.anim).forEach(c=>{for(let i=0;i<c.anim.idle;i++)new Image().src=frame(c,'idle',i);for(let i=0;i<c.anim.atk;i++)new Image().src=frame(c,'atk',i)});
const av=(s,id)=>{const c=id&&BOSS.find(x=>x.id===id);if(c&&c.anim)return `<img class="av sp" style="--w:${(c.anim.w||100)*(c.anim.k||1)}" data-id="${id}" data-mode="idle" data-f="0" src="${frame(c,'idle',0)}" alt="" draggable="false">`;return av0(s)};
const HERO={id:'hero',name:'Bạn',emoji:'🧙',card:'Nhân vật chính — mang tín ngưỡng đang chọn, không thể gỡ khỏi đội hình (chỉ đổi chỗ được).'};
const CH=id=>id==='hero'?HERO:BOSS.find(x=>x.id===id);
/* ảnh nghệ thuật (thẻ bài/boss); không có art thì dùng ảnh động/emoji */
const art=b=>b.art?`<img class="av art" src="${b.art}" alt="" draggable="false">`:av(b.emoji,b.id);
const av0=s=>s.startsWith('assets/')?`<img class="av" src="${s}" alt="" draggable="false">`:`<div class="av">${s}</div>`;
const FLY=900; /* thời gian bay của icon (ms) — tăng số này để icon bay chậm/xa hơn */
let tab='fight',timer=null,holding=null;
const V={
 fight(){const p=pStats([]),b=BEL[S.belief],n=S.form.filter(Boolean).length;
  return `<section class="box"><b>Nhân vật chính</b><p class="mut">❤️ ${p.hp} · ⚔️ ${p.atk} · 🛡️ ${p.def} · Tín ngưỡng: ${b.icon} ${b.name}</p><p class="mut">Đội hình ra sân: ${n}/6 · Đồng đội đã mở khoá: ${S.owned.length}/${BOSS.length}</p></section><div class="grid">`+
  BOSS.filter(b=>!b.price).map(b=>`<div class="box boss ${b.tier}"><span class="tag">${b.tier==='elite'?'ELITE':'NORMAL'}</span>${art(b)}<h3>${b.name}${b.units>1?' (x2)':''}</h3><p class="mut">❤️${b.hp} ⚔️${b.atk} 🛡️${b.def} ⚡${b.en}</p><p class="mut">Thưởng ${JI} ${CFG.equip[b.tier].jade}</p><button class="btn" data-fight="${b.id}">Khiêu chiến</button></div>`).join('')+'</div>'},
 cards(){return '<p class="mut">📖 Thư viện thẻ bài: chỉ để đọc mô tả kỹ năng, thẻ không gắn lên nhân vật chính. Kỹ năng được dùng khi nhân vật đó ra sân trong Đội hình. "Nghỉ" = thời gian chưa được dùng chiêu; Energy vẫn tích bình thường (tối đa 100).</p><div class="grid">'+BOSS.map(b=>{const o=S.owned.includes(b.id),q=aSt(b);return `<div class="box boss">${art(b)}<h3>${b.name}</h3><p class="mut">Khi vào đội: ❤️${q.hp} ⚔️${q.atk} 🛡️${q.def} ⚡${b.en}</p><p class="mut">${b.card}</p><p class="mut">${o?'✅ Đã có trong đội':(b.price?'🔒 Mua ở Cửa hàng':'🔒 Thắng boss để mở khoá')}</p></div>`}).join('')+'</div>'},
 team(){
  const slot=i=>{const id=S.form[i],c=id&&CH(id);
   return `<div class="slot ${c?'full':''}" data-slot="${i}" ${c?`draggable="true" data-drag="${id}"`:''}>${c?av(c.emoji,id)+`<b>${c.name}</b>`:'<span class="mut">Trống</span>'}</div>`};
  const hd=holding?CH(holding):null;
  return `<p class="mut">${hd?`Đang chọn <b>${hd.name}</b> — chạm vào một ô để đặt.`:'Kéo nhân vật xuống ô trống (hoặc chạm nhân vật rồi chạm ô). Chạm ô đã có người để gỡ ra. Hàng trước chịu đòn trước.'}</p>
  <div class="fm"><div><h4>Hàng trước</h4><div class="slots">${[0,1,2].map(slot).join('')}</div></div><div><h4>Hàng sau</h4><div class="slots">${[3,4,5].map(slot).join('')}</div></div></div>
  <h3>Nhân vật của bạn</h3>`+('<div class="grid">'+['hero',...S.owned].map(id=>{const c=CH(id),q=id==='hero'?pStats([]):aSt(c),on=S.form.includes(id);
   return `<div class="box boss rost ${holding===id?'on':''}" draggable="true" data-drag="${id}" data-pick="${id}">${on?'<span class="tag">ĐÃ RA SÂN</span>':''}${art(c)}<h3>${c.name}</h3><p class="mut">❤️${q.hp} ⚔️${q.atk} 🛡️${q.def}</p><p class="mut">${c.card}</p></div>`}).join('')+'</div>')},
 shop(){const l=BOSS.filter(b=>b.price);
  return `<p class="mut">Dùng ${JI} Jade để mua nhân vật. Mua xong, nhân vật và thẻ bài đi kèm sẽ có trong tab Đội hình để kéo ra sân.</p><div class="grid">`+l.map(b=>{const o=S.owned.includes(b.id),q=aSt(b),ok=S.jade>=b.price;
   return `<div class="box boss">${art(b)}<h3>${b.name}</h3><p class="mut">❤️${q.hp} ⚔️${q.atk} 🛡️${q.def} ⚡${b.en}</p><p class="mut">${b.card}</p><button class="btn" data-buy="${b.id}" ${o||!ok?'disabled':''}>${o?'Đã sở hữu':`Mua · ${JI} ${b.price}`}</button>${!o&&!ok?`<p class="mut">Cần thêm ${b.price-S.jade} Jade</p>`:''}</div>`}).join('')+'</div>'},
 belief(){return '<p class="mut">Chỉ trang bị được 1 tín ngưỡng. Biểu tượng này sẽ được ném vào mặt kẻ địch thay cho cục tròn.</p><div class="row">'+Object.entries(BEL).map(([k,b])=>`<button class="box pick ${S.belief===k?'on':''}" data-bel="${k}"><div style="font-size:3rem">${b.icon}</div><b>${b.name}</b><p class="mut">${b.desc}</p></button>`).join('')+'</div>'}};
function show(){$('#jade').innerHTML=JI+' '+S.jade;document.querySelectorAll('#tabs button').forEach(x=>x.classList.toggle('on',x.dataset.t===tab));$('#view').innerHTML=V[tab]()}
function place(id,i){const f=S.form,from=f.indexOf(id),old=f[i];
 if(old==='hero'&&from<0){const e=f.indexOf(null);if(e<0){Ev.banner('Đội hình đầy — gỡ bớt một nhân vật trước',null);return}f[e]='hero'}
 if(from>=0)f[from]=old;f[i]=id;holding=null;save();show()}
function unplace(id){if(id==='hero')return;const k=S.form.indexOf(id);if(k>=0)S.form[k]=null;holding=null;save();show()}
/* ---- Chiến đấu ---- */
const unit=c=>{const en=c.cards.some(k=>k.en);
 return `<div class="unit ${c.hero?'hero':c.side==='p'?'ally':''}" id="u${c.i}"><div class="ub">${av(c.emoji,c.cid)}<div class="sc"></div></div><div class="nm">${c.name}</div><div class="bar hp"><i></i></div>${en?'<div class="bar en"><i style="width:0"></i></div>':''}${c.bel==='fish'?'<div class="bar fish"><i style="width:0"></i></div>':''}<div class="st"></div></div>`};
function fight(id){
 const b=BOSS.find(x=>x.id===id);startBattle(b);
 const col=r=>`<div class="col">${B.A.filter(c=>c.row===r).map(unit).join('')}</div>`;
 const v=$('#battle');v.hidden=false;
 v.innerHTML=`<div id="stage"><div id="arena"><div class="side p">${col(1)}${col(0)}</div><div class="side e">${B.E.map(unit).join('')}</div></div><div class="row" style="justify-content:center"><button class="btn alt" data-flee>Bỏ chạy</button></div></div>`;
 B.all.forEach(c=>{c.el=$('#u'+c.i);c.vhp=c.hp;c.vmax=c.max});clearInterval(timer);timer=setInterval(tick,CFG.tick)}
const shake=()=>{const a=$('#arena');a&&a.animate([{transform:'translate(0)'},{transform:'translate(-7px,3px)'},{transform:'translate(7px,-3px)'},{transform:'translate(-4px,2px)'},{transform:'translate(0)'}],{duration:280})};
/* Thanh máu hiển thị (vhp) cập nhật đúng lúc icon chạm đích — không ảnh hưởng nhịp đánh thật */
Ev.tick=()=>B.all.forEach(c=>{const e=c.el,k=c.cards.find(x=>x.en),en=e.querySelector('.en i'),fi=e.querySelector('.fish i'),pv=Math.round(c.pool*1.5);
 if(c.vmax!==c.max){c.vhp+=c.max-c.vmax;c.vmax=c.max}
 e.querySelector('.hp i').style.width=100*Math.max(0,c.vhp)/c.max+'%';
 if(k&&en)en.style.width=Math.min(100,k.meter)+'%';
 if(fi)fi.style.width=Math.min(100,100*pv/c.max)+'%';
 e.querySelector('.st').textContent=`❤️ ${Math.max(0,Math.ceil(c.vhp))}/${c.max}`+(fi?` · 🐟 Bể cá ${pv}${c.revived?' (đã dùng)':''}`:'');
 e.classList.toggle('shield',c.blk>0);
 e.querySelector('.sc').innerHTML=`<span>⚔️ ${Math.round(A(c))}</span><span>🛡️ ${c.def}</span>`+(c.crit?`<span>🎯 ${Math.round(c.crit*100)}%</span>`:'')+(c.dodge?`<span>💨 ${Math.round(c.dodge*100)}%</span>`:'')+(c.lo?`<span>🙂 Lỏ x${c.lo}</span>`:'')+(c.blk>0?'<span>🛡️ Chặn 40%</span>':'')+(c.burnT>0?'<span>🔥 Cháy</span>':'')});
/* Số sát thương hiện ra đúng lúc icon chạm mục tiêu */
Ev.pop=(t,txt,cls)=>setTimeout(()=>{t.vhp=Math.max(0,t.hp);const s=document.createElement('span');s.className='pop '+cls;s.textContent=txt;s.style.marginLeft=(Math.random()*50-25)+'px';t.el.appendChild(s);setTimeout(()=>s.remove(),1100);if(cls.includes('crit'))shake()},FLY);
Ev.banner=(txt,a)=>{if(!txt)return;const s=document.createElement('div');s.className='banner '+(a&&a.side||'p');s.innerHTML=(a?`<small>${a.name}</small>`:'')+txt;$('#banners').appendChild(s);setTimeout(()=>s.remove(),2200)};
/* Dùng chiêu: nhân vật có ảnh thẻ thì thẻ bật lên trên đầu một lúc; không có thì hiện chữ như cũ */
Ev.cast=(txt,a)=>{const b=a&&BOSS.find(x=>x.id===a.cid);if(!b||!b.art||!a.el){Ev.banner(txt,a);return}
 const d=document.createElement('div');d.className='cardpop';d.innerHTML=`<img src="${b.art}" alt=""><small>${txt}</small>`;a.el.appendChild(d);setTimeout(()=>d.remove(),1600)};
Ev.dead=t=>setTimeout(()=>t.el.classList.add('dead'),FLY);
/* Đường đạn: vòng cung + vệt mờ + vòng ngắm ở mục tiêu. Chỉ là hiệu ứng hình ảnh, engine không chờ nó. */
Ev.proj=(a,t,ic)=>{const ar=$('#arena');if(!ar)return;
 const im=a.el.querySelector('img.sp');if(im&&!ic){im.dataset.mode='atk';im.dataset.f=0}
 const r=ar.getBoundingClientRect(),c=n=>{const q=n.el.querySelector('.av').getBoundingClientRect();return[q.left+q.width/2-r.left,q.top+q.height/2-r.top]},
 f=c(a),g=c(t),m=[(f[0]+g[0])/2,Math.min(f[1],g[1])-140-Math.random()*50],s=document.createElement('span'),ring=document.createElement('span');
 const bz=u=>[0,1].map(i=>(1-u)*(1-u)*f[i]+2*(1-u)*u*m[i]+u*u*g[i]);
 s.className='proj'+(ic?' fx':'');s.textContent=ic||a.icon;ar.appendChild(s);
 ring.className='aim';ring.style.left=g[0]+'px';ring.style.top=g[1]+'px';ar.appendChild(ring);
 const kf=[0,1/6,2/6,3/6,4/6,5/6,1].map(u=>{const p=bz(u);return{transform:`translate(${p[0]}px,${p[1]}px) scale(${1+Math.sin(Math.PI*u)*1.1}) rotate(${u*540}deg)`,offset:u}});
 const trail=setInterval(()=>{const q=s.getBoundingClientRect(),d=document.createElement('span');d.className='ghost';d.textContent=s.textContent;d.style.left=(q.left+q.width/2-r.left)+'px';d.style.top=(q.top+q.height/2-r.top)+'px';ar.appendChild(d);setTimeout(()=>d.remove(),450)},45);
 const done=()=>{clearInterval(trail);s.remove();ring.remove()};setTimeout(done,FLY+120);
 s.animate(kf,{duration:FLY,easing:'ease-in-out'}).onfinish=()=>{done();if(!ic){t.el.classList.add('hit');setTimeout(()=>t.el.classList.remove('hit'),200)}};
 if(!ic){a.el.classList.add('lunge');setTimeout(()=>a.el.classList.remove('lunge'),220)}};
Ev.end=win=>{clearInterval(timer);const b=B.boss,j=CFG.equip[b.tier].jade;let msg;
 if(win){S.jade+=j;const nw=!S.owned.includes(b.id);if(nw)S.owned.push(b.id);save();msg=`<h2>🏆 Chiến thắng!</h2><p>+${JI} ${j}</p>${nw?`<p>Mở khoá nhân vật <b>${b.name}</b> ${b.emoji.startsWith('assets/')?'':b.emoji} — xếp vào tab Đội hình nhé!</p>`:''}`}
 else msg='<h2>💀 Thất bại</h2><p class="mut">Thử đổi đội hình hoặc tín ngưỡng nhé.</p>';
 setTimeout(()=>{$('#battle').hidden=true;$('#modal').hidden=false;$('#modal').innerHTML=`<div class="dlg">${msg}<div class="row"><button class="btn" data-close>Tiếp tục</button></div></div>`;show()},1600)};
function buy(id){const b=BOSS.find(x=>x.id===id);if(!b||!b.price||S.owned.includes(id)||S.jade<b.price)return;
 S.jade-=b.price;S.owned.push(id);save();show();Ev.banner('✅ Đã mua '+b.name+'! Vào tab Đội hình để xếp ra sân',null)}
/* chạy ảnh động: idle lặp vòng, tấn công chạy 1 lượt rồi về idle */
setInterval(()=>document.querySelectorAll('img.sp').forEach(im=>{const c=BOSS.find(x=>x.id===im.dataset.id);if(!c)return;
 let m=im.dataset.mode,f=+im.dataset.f+1;
 if(m==='atk'){if(f>=c.anim.atk){m='idle';f=0}}else f%=c.anim.idle;
 im.dataset.mode=m;im.dataset.f=f;im.src=frame(c,m,f)}),90);
/* ---- Sự kiện ---- */
document.addEventListener('click',e=>{const d=e.target.closest('button,[data-slot],[data-pick]');if(!d)return;const x=d.dataset;
 if('reset' in x){if(confirm('Xoá toàn bộ tiến trình (Jade, nhân vật, đội hình) và chơi lại từ đầu?')){try{localStorage.removeItem('loichoi')}catch(e){}location.reload()}}
 else if(x.buy){buy(x.buy)}
 else if(x.slot!==undefined){const i=+x.slot;if(holding)place(holding,i);else if(S.form[i]==='hero'){holding='hero';show()}else if(S.form[i])unplace(S.form[i])}
 else if(x.pick){holding=holding===x.pick?null:x.pick;show()}
 else if(x.t){tab=x.t;holding=null;show()}
 else if(x.fight)fight(x.fight);
 else if(x.bel){S.belief=x.bel;save();show()}
 else if('close' in x){$('#modal').hidden=true}
 else if('flee' in x){clearInterval(timer);B.over=true;$('#battle').hidden=true}});
/* Kéo thả (máy tính). Trên điện thoại dùng cách chạm. */
document.addEventListener('dragstart',e=>{const d=e.target.closest('[data-drag]');if(d){e.dataTransfer.setData('text/plain',d.dataset.drag);e.dataTransfer.effectAllowed='move'}});
document.addEventListener('dragover',e=>{if(e.target.closest('#view'))e.preventDefault()});
document.addEventListener('drop',e=>{const id=e.dataTransfer.getData('text/plain');if(id!=='hero'&&!BOSS.some(b=>b.id===id))return;
 const s=e.target.closest('[data-slot]');if(s){e.preventDefault();place(id,+s.dataset.slot)}else if(e.target.closest('#view')){e.preventDefault();unplace(id)}});
show();
