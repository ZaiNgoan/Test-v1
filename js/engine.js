/* LÕI CHIẾN ĐẤU — tính toán, không đụng tới giao diện */
const Ev={pop(){},proj(){},banner(){},dead(){},tick(){},end(){}};
const rnd=Math.random;
const mk=o=>({bonus:0,mul:1,spd:1,crit:0,dodge:0,hits:0,t:0,sec:0,burnT:0,bsec:0,tmpAtk:0,tmpT:0,enBuff:0,cut:0,fc:false,pool:0,revived:false,dead:false,st:0,bp:0,cards:[],...o});
const A=a=>(a.atk+a.bonus+(a.tmpT>0?a.tmpAtk:0))*a.mul;
const has=(a,id)=>a.cards.some(c=>c.id===id);
const alive=f=>f.find(x=>!x.dead);
function dmg(a,t,raw,type,crit){
 if(t.dead)return;
 if(type!=='true'){if(rnd()<t.dodge){Ev.pop(t,'Né!','dodge');return}raw=Math.max(1,raw-Math.floor(t.def/2))}
 raw=Math.round(raw);t.hp-=raw;Ev.pop(t,(crit?'💥':'')+raw,type+(crit?' crit':''));
 if(t.bel==='fish')t.pool+=raw*.15;
 if(t.hp<=0){
  if(t.bel==='fish'&&!t.revived&&t.pool>=1){t.revived=true;t.hp=Math.min(t.max,Math.round(t.pool*1.5*(t.cut>0?.2:1)));Ev.banner(BEL.fish.line,t)}
  else{t.hp=0;t.dead=true;Ev.dead(t)}}}
function strike(a,t){const c=a.fc||rnd()<a.crit;a.fc=false;dmg(a,t,A(a)*(c?3:1),'phys',c)}
const FX={
 phoenix(a,f){f.forEach(t=>{dmg(a,t,A(a)*2,'magic');t.burnT=4000});Ev.banner('🔥 Cầu lửa!',a)},
 succubus(a,f){const t=alive(f);if(t){dmg(a,t,A(a)*4,'magic');t.cut=4000;Ev.banner('😈 Roi quật!',a)}},
 cupid(a){a.tmpAtk=10;a.tmpT=6000;a.enBuff=6000;Ev.banner('💘 Tình yêu hộ thể!',a)},
 pumpkin(a){if(a.st<5){a.st++;a.spd+=.5;a.bonus+=10}Ev.banner('🎃 Tinh thần lễ hội x'+a.st,a)},
 bird(a,f){const t=alive(f);if(t)dmg(a,t,A(a),'magic');if(a.bp<20){a.bp+=2;a.bonus+=2}Ev.banner('🕊️ Lông vũ! +Atk',a)}};
function attack(a,foes){
 const t=alive(foes);if(!t)return;
 a.hits++;Ev.proj(a,t);strike(a,t);
 if(has(a,'archer')&&a.hits%3===0)dmg(a,t,t.hp*.12,'true');
 if(has(a,'twin')&&rnd()<.25){const u=alive(foes);if(u){Ev.proj(a,u);strike(a,u)}}
 if(a.bel==='saint'&&a.dodge<.3){a.dodge=Math.min(.3,a.dodge+.02);if(a.dodge>=.3){a.mul*=1.5;Ev.banner(BEL.saint.line,a)}}
 for(const c of a.cards){
  if(c.cd>0||!c.en)continue;
  c.meter+=c.en+(a.enBuff>0?5:0);
  if(c.meter>=100){c.meter=0;c.cd=BOSS.find(b=>b.id===c.id).cd;FX[c.id]&&FX[c.id](a,foes)}}}
function pStats(ids){
 const n=S.owned.length;let hp=CFG.base.hp+n*CFG.own.hp,atk=CFG.base.atk+n*CFG.own.atk;
 ids.forEach(i=>{const q=CFG.equip[BOSS.find(x=>x.id===i).tier];hp+=q.hp;atk+=q.atk});
 return{hp,atk,def:CFG.base.def+n*CFG.own.def}}
let B=null;
function startBattle(b,ids){
 const s=pStats(ids);
 const P=mk({name:'Bạn',emoji:'🧙',side:'p',bel:S.belief,icon:BEL[S.belief].icon,hp:s.hp,max:s.hp,atk:s.atk,def:s.def,spd:S.belief==='vex'?1.05:1,
  cards:ids.map(id=>({id,en:BOSS.find(x=>x.id===id).en,meter:0,cd:0}))});
 const E=[...Array(b.units)].map((_,i)=>mk({name:b.name+(b.units>1?' '+(i+1):''),emoji:b.emoji,side:'e',icon:'🟠',hp:b.hp,max:b.hp,atk:b.atk,def:b.def,cards:[{id:b.id,en:b.en,meter:0,cd:0}]}));
 B={P,E,all:[P,...E],boss:b,over:false};B.all.forEach((c,i)=>c.i=i);
 return B}
function tick(){
 if(!B||B.over)return;const dt=CFG.tick;
 for(const c of B.all){
  if(c.dead)continue;
  c.t+=dt*c.spd;if(c.t>=CFG.atkMs){c.t-=CFG.atkMs;attack(c,c.side==='p'?B.E:[B.P])}
  c.tmpT-=dt;c.enBuff-=dt;c.cut-=dt;c.cards.forEach(k=>k.cd-=dt);
  if(c.burnT>0){c.burnT-=dt;c.bsec+=dt;if(c.bsec>=1000){c.bsec-=1000;dmg(null,c,c.max*.01,'true')}}
  c.sec+=dt;
  if(c.sec>=1000){c.sec-=1000;if(c.bel==='ipad'){c.crit=Math.min(.5,c.crit+.025);if(c.crit>=.5){c.fc=true;c.crit=0;Ev.banner(BEL.ipad.line,c)}}}}
 Ev.tick();
 if(B.P.dead||B.E.every(e=>e.dead)){B.over=true;Ev.end(!B.P.dead)}}
