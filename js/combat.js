export function createBattle(boss, equippedCards, playerBase) {
  return {
    status: "running", elapsed: 0,
    player: { hp: playerBase.maxHp, maxHp: playerBase.maxHp, atk: playerBase.atk, def: playerBase.def, energy: 0, hits: 0, nextAttack: playerBase.interval, totalDamage: 0 },
    boss: { hp: boss.hp, maxHp: boss.hp, atk: boss.atk, def: boss.def, hits: 0, nextAttack: boss.interval, totalDamage: 0 },
    bossData: boss, equippedCards, burnUntil: 0, lastTick: performance.now()
  };
}
export function physicalDamage(atk, def) { return Math.max(1, atk - Math.floor(def / 2)); }
export function tickBattle(state, deltaMs, now) {
  if (!state || state.status !== "running") return [];
  const events = [];
  state.elapsed += deltaMs;
  state.player.nextAttack -= deltaMs;
  state.boss.nextAttack -= deltaMs;
  let safety = 0;
  while (state.status === "running" && state.player.nextAttack <= 0 && safety++ < 4) {
    state.player.nextAttack += 2000;
    state.player.hits++;
    const damage = physicalDamage(state.player.atk, state.boss.def);
    state.boss.hp = Math.max(0, state.boss.hp - damage); state.player.totalDamage += damage;
    events.push({ type: "player-hit", damage, text: `Bạn gây ${damage} sát thương vật lý.` });
    if (state.equippedCards.some(c => c.effect === "archer") && state.player.hits % 3 === 0 && state.boss.hp > 0) {
      const bonus = Math.max(1, Math.floor(state.boss.hp * 0.12));
      state.boss.hp = Math.max(0, state.boss.hp - bonus); state.player.totalDamage += bonus;
      events.push({ type: "card", damage: bonus, text: `Xạ Thủ Nhân Mã: thêm ${bonus} sát thương.` });
    }
    if (state.boss.hp <= 0) { state.status = "won"; events.push({ type: "victory", text: `Đã đánh bại ${state.bossData.name}!` }); break; }
    if (state.equippedCards.some(c => c.effect === "twin") && Math.random() < 0.25) {
      const extra = physicalDamage(state.player.atk, state.boss.def);
      state.boss.hp = Math.max(0, state.boss.hp - extra); state.player.totalDamage += extra;
      events.push({ type: "card", damage: extra, text: `Song Yêu: đòn phụ gây ${extra} sát thương.` });
      if (state.boss.hp <= 0) { state.status = "won"; events.push({ type: "victory", text: `Đã đánh bại ${state.bossData.name}!` }); break; }
    }
    // Every normal hit grants Energy. It stays at 100 unless an equipped card consumes it.
    state.player.energy = Math.min(100, state.player.energy + 25);
    events.push({ type: "energy", value: state.player.energy, text: `Energy ${state.player.energy}/100.` });
    if (state.player.energy >= 100) {
      const consumer = state.equippedCards.find(c => c.effect === "phoenix" || c.effect === "guardian");
      if (consumer) {
        state.player.energy = 0;
        if (consumer.effect === "phoenix") {
          const magic = state.player.atk * 2;
          state.boss.hp = Math.max(0, state.boss.hp - magic); state.player.totalDamage += magic;
          state.burnUntil = now + 3000;
          events.push({ type: "card", damage: magic, text: `Hỏa Phượng Hoàng: gây ${magic} sát thương phép!` });
        } else {
          const healed = Math.min(8, state.player.maxHp - state.player.hp);
          state.player.hp += healed;
          events.push({ type: "card", text: `Hộ Vệ Mộng Cảnh: hồi ${healed} HP.` });
        }
        if (state.boss.hp <= 0) { state.status = "won"; events.push({ type: "victory", text: `Đã đánh bại ${state.bossData.name}!` }); break; }
      } else if (!state.energyFullNotified) {
        state.energyFullNotified = true;
        events.push({ type: "energy-full", text: "Energy đầy 100/100 — giữ nguyên cho đến khi có thẻ tiêu thụ Energy." });
      }
    }
  }
  safety = 0;
  while (state.status === "running" && state.boss.nextAttack <= 0 && safety++ < 4) {
    state.boss.nextAttack += state.bossData.interval;
    state.boss.hits++;
    let damage = physicalDamage(state.boss.atk, state.player.def);
    if (state.burnUntil > now) damage = Math.max(1, damage - 1);
    state.player.hp = Math.max(0, state.player.hp - damage); state.boss.totalDamage += damage;
    events.push({ type: "boss-hit", damage, text: `${state.bossData.name} gây ${damage} sát thương lên bạn.` });
    if (state.player.hp <= 0) { state.status = "lost"; events.push({ type: "defeat", text: "Bạn đã gục ngã. Hãy đổi build rồi thử lại." }); }
  }
  return events;
}
