/* LÕI CHIẾN ĐẤU v0.2 — tính toán, không đụng tới giao diện */
const Ev={pop(){},proj(){},banner(){},dead(){},tick(){},end(){}};
const rnd=Math.random;
const mk=o=>({blk:0,lo:0,lt:0,bonus:0,mul:1,spd:1,crit:0,dodge:0,hits:0,t:0,sec:0,burnT:0,bsec:0,tmpAtk:0,tmpT:0,enBuff:0,cut:0,fc:false,pool:0,revived:false,dead:false,st:0,bp:0,cards:[],...o});
const A=a=>(a.atk+a.bonus+(a.tmpT>0?a.tmpAtk:0))*a.mul;
const has=(a,id)=>a.cards.some(c=>c.id===id);
const alive=f=>f.find(x=>!x.dead);
/* Kẻ địch đánh hàng trước trước; hết hàng trước mới tới hàng sau */
/* Kẻ địch đánh hàng trước trước; hết hàng trước mới tới hàng sau (row 0 = trước, row 1 = sau) */
const pick1=f=>{const l=f.filter(x=>!x.dead);if(!l.length)return;const r=Math.min(...l.map(x=>x.row)),q=l.filter(x=>x.row===r);return q[Math.floor(rnd()*q.length)]};
const tgt=(a,f)=>a.side==='p'?alive(f):pick1(f);
/* Hồi máu: Sắc Quỷ giảm 80% hiệu quả hồi, Cá Lớn tăng 50% */
function heal(a,t,amt){if(t.dead)return;if(t.cut>0)amt*=.2;if(t.bel==='fish')amt*=1.5;
 const b=t.hp;t.hp=Math.min(t.max,t.hp+Math.round(amt));const g=Math.round(t.hp-b);if(g>0)Ev.pop(t,'+'+g,'heal')}
function dmg(a,t,raw,type,crit){
 if(t.dead)return;
 if(type!=='true'){if(rnd()<t.dodge){Ev.pop(t,'Né!','dodge');return}raw=Math.max(1,raw-Math.floor(t.def/2));if(t.blk>0)raw=Math.max(1,raw*.6)}
 raw=Math.round(raw);t.hp-=raw;Ev.pop(t,(crit?'💥':'')+raw,type+(crit?' crit':''));
 if(t.bel==='fish')t.pool+=raw*.15;
 if(t.hp<=0){
  if(t.bel==='fish'&&!t.revived&&t.pool>=1){t.revived=true;t.hp=Math.min(t.max,Math.round(t.pool*1.5*(t.cut>0?.2:1)));Ev.banner(BEL.fish.line,t)}
  else{t.hp=0;t.dead=true;Ev.dead(t)}}}
function strike(a,t){const c=a.fc||rnd()<a.crit;a.fc=false;dmg(a,t,A(a)*(c?3:1),'phys',c)}
const FX={
 paladin(a){a.blk=6000;Ev.banner('🛡️ Khiên Thánh! Chặn 40% sát thương',a)},
 angel(a,f,m){const l=m.filter(x=>!x.dead).sort((p,q)=>p.hp/p.max-q.hp/q.max).slice(0,2);
  l.forEach(t=>{Ev.proj(a,t,'💚');heal(a,t,t.hp*.3+t.max*.05)});Ev.banner('👼 Ánh sáng chữa lành!',a)},
 phoenix(a,f){f.forEach(t=>{dmg(a,t,A(a)*2,'magic');t.burnT=4000});Ev.banner('🔥 Cầu lửa!',a)},
 succubus(a,f){const t=tgt(a,f);if(t){dmg(a,t,A(a)*4,'magic');t.cut=4000;Ev.banner('😈 Roi quật!',a)}},
 cupid(a){a.tmpAtk=10;a.tmpT=6000;a.enBuff=6000;Ev.banner('💘 Tình yêu hộ thể!',a)},
 pumpkin(a){if(a.st<5){a.st++;a.spd+=.5;a.bonus+=10}Ev.banner('🎃 Tinh thần lễ hội x'+a.st,a)},
 bird(a,f){for(let i=0;i<3;i++){const l=f.filter(x=>!x.dead);if(!l.length)break;const t=l[Math.floor(rnd()*l.length)]; /* ngẫu nhiên, kể cả hàng sau */
  Ev.proj(a,t,'🪶');dmg(a,t,A(a)*1.2,'magic')}
  if(a.bp<20){a.bp+=2;a.bonus+=2}Ev.banner('🕊️ Mưa lông vũ!',a)}};
function attack(a,foes){
 const t=tgt(a,foes),mates=a.side==='p'?B.team:B.E;if(!t)return;
 a.hits++;Ev.proj(a,t);strike(a,t);
 if(has(a,'archer')&&a.hits%3===0)dmg(a,t,t.hp*.12,'true');
 if(has(a,'twin')&&rnd()<.25){const u=tgt(a,foes);if(u){Ev.proj(a,u);strike(a,u)}}
 if(a.bel==='saint'&&a.dodge<.3){a.dodge=Math.min(.3,a.dodge+.02);if(a.dodge>=.3){a.mul*=1.5;Ev.banner(BEL.saint.line,a)}}
 for(const c of a.cards){if(c.en)c.meter=Math.min(100,c.meter+c.en+(a.enBuff>0?5:0))} /* Energy luôn tích, tối đa 100 — kể cả khi đang "nghỉ" */
 cast(a,foes,mates)}
/* Đủ 100 Energy VÀ hết "nghỉ" thì mới dùng chiêu. Nghỉ chỉ chặn việc dùng chiêu, không chặn tích Energy. */
function cast(a,foes,mates){for(const c of a.cards){if(c.en&&c.meter>=100&&c.cd<=0){c.meter=0;c.cd=BOSS.find(b=>b.id===c.id).cd;FX[c.id]&&FX[c.id](a,foes,mates)}}}
function pStats(ids){
 let hp=CFG.base.hp,atk=CFG.base.atk; /* thẻ bài chỉ là thư viện, không cộng chỉ số cho nhân vật chính */
 ids.forEach(i=>{const q=CFG.equip[BOSS.find(x=>x.id===i).tier];hp+=q.hp;atk+=q.atk});
 return{hp,atk,def:CFG.base.def}}
/* Chỉ số đồng đội khi ra sân = một phần chỉ số boss (chỉnh ở CFG.ally trong data.js) */
const aSt=c=>c.raw?{hp:c.hp,atk:c.atk,def:c.def}:({hp:Math.round(c.hp*CFG.ally.hp),atk:Math.max(3,Math.round(c.atk*CFG.ally.atk)),def:Math.floor(c.def/2)});
let B=null;
function startBattle(b){
 const ico=e=>e.startsWith('assets/')?'⚔️':e,s=pStats([]);
 const ids=S.form.map((id,k)=>id?{id,k}:null).filter(Boolean);
 if(!ids.length)ids.push({id:'hero',k:0}); /* đội hình trống: nhân vật chính tự ra sân */
 const Al=ids.map(({id,k})=>{const row=k<3?0:1;
  if(id==='hero')return mk({name:'Bạn',emoji:'🧙',side:'p',row,hero:true,cid:'hero',bel:S.belief,icon:BEL[S.belief].icon,hp:s.hp,max:s.hp,atk:s.atk,def:s.def});
  const c=BOSS.find(x=>x.id===id),q=aSt(c);
  return mk({name:c.name,emoji:c.emoji,side:'p',row,cid:c.id,icon:c.icon||ico(c.emoji),hp:q.hp,max:q.hp,atk:q.atk,def:q.def,cards:[{id:c.id,en:c.en,meter:0,cd:0}]})});
 const E=[...Array(b.units)].map((_,i)=>mk({name:b.name+(b.units>1?' '+(i+1):''),emoji:b.emoji,side:'e',cid:b.id,icon:ico(b.emoji),hp:b.hp,max:b.hp,atk:b.atk,def:b.def,cards:[{id:b.id,en:b.en,meter:0,cd:0}]}));
 B={A:Al,team:Al,E,all:[...Al,...E],boss:b,over:false};B.all.forEach((c,i)=>{c.i=i;c.m0=c.max});
 return B}
function tick(){
 if(!B||B.over)return;const dt=CFG.tick;
 for(const c of B.all){
  if(c.dead)continue;
  c.t+=dt*c.spd;if(c.t>=CFG.atkMs){c.t-=CFG.atkMs;attack(c,c.side==='p'?B.E:B.team)}
  c.tmpT-=dt;c.enBuff-=dt;c.cut-=dt;c.blk-=dt;c.cards.forEach(k=>k.cd-=dt);cast(c,c.side==='p'?B.E:B.team,c.side==='p'?B.team:B.E);
  if(c.burnT>0){c.burnT-=dt;c.bsec+=dt;if(c.bsec>=1000){c.bsec-=1000;dmg(null,c,c.max*.01,'true')}}
  /* Vex Lỏ: mỗi 4s +1 tầng (tối đa 5): +20% máu tối đa gốc, +4 Def; tầng 2 hiện chữ */
  if(c.bel==='vex'&&c.lo<5){c.lt+=dt;if(c.lt>=4000){c.lt-=4000;c.lo++;const ad=Math.round(c.m0*.2);c.max+=ad;c.hp+=ad;c.def+=4;if(c.lo===2)Ev.banner(BEL.vex.line,c)}}
  c.sec+=dt;
  if(c.sec>=1000){c.sec-=1000;if(c.bel==='ipad'){c.crit=Math.min(.5,c.crit+.025);if(c.crit>=.5){c.fc=true;c.crit=0;Ev.banner(BEL.ipad.line,c)}}}}
 Ev.tick();
 const lost=B.team.every(x=>x.dead);if(lost||B.E.every(e=>e.dead)){B.over=true;Ev.end(!lost)} /* thua khi TOÀN BỘ đội hình hết máu */}
