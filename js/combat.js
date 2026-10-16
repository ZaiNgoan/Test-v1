export function createBattle(boss, equippedCards, playerBase) {
  return {
    status: "running",
    elapsed: 0,
    player: { hp: playerBase.maxHp, maxHp: playerBase.maxHp, atk: playerBase.atk, def: playerBase.def, energy: 0, hits: 0, nextAttack: playerBase.interval },
    boss: { hp: boss.hp, maxHp: boss.hp, atk: boss.atk, def: boss.def, hits: 0, nextAttack: boss.interval },
    bossData: boss,
    equippedCards,
    burnUntil: 0,
    lastTick: performance.now()
  };
}

export function physicalDamage(atk, def) {
  return Math.max(1, atk - Math.floor(def / 2));
}

export function tickBattle(state, deltaMs, now) {
  if (!state || state.status !== "running") return [];
  const events = [];
  state.elapsed += deltaMs;
  state.player.nextAttack -= deltaMs;
  state.boss.nextAttack -= deltaMs;

  // Limit catch-up steps so a delayed browser tab cannot create an infinite attack loop.
  let safety = 0;
  while (state.status === "running" && state.player.nextAttack <= 0 && safety++ < 4) {
    state.player.nextAttack += 2000;
    state.player.hits++;
    let damage = physicalDamage(state.player.atk, state.boss.def);
    state.boss.hp = Math.max(0, state.boss.hp - damage);
    events.push({ type: "player-hit", damage, text: `Bạn gây ${damage} sát thương vật lý.` });

    if (state.equippedCards.some(c => c.effect === "archer") && state.player.hits % 3 === 0 && state.boss.hp > 0) {
      const bonus = Math.max(1, Math.floor(state.boss.hp * 0.12));
      state.boss.hp = Math.max(0, state.boss.hp - bonus);
      events.push({ type: "card", damage: bonus, text: `Xạ Thủ Nhân Mã: gây thêm ${bonus} sát thương theo HP hiện tại.` });
    }
    if (state.boss.hp <= 0) {
      state.status = "won";
      events.push({ type: "victory", text: `Đã đánh bại ${state.bossData.name}!` });
      break;
    }

    if (state.equippedCards.some(c => c.effect === "twin") && Math.random() < 0.25) {
      const extra = physicalDamage(state.player.atk, state.boss.def);
      state.boss.hp = Math.max(0, state.boss.hp - extra);
      events.push({ type: "card", damage: extra, text: `Song Yêu: kích hoạt đòn đánh phụ, gây ${extra} sát thương.` });
      if (state.boss.hp <= 0) {
        state.status = "won";
        events.push({ type: "victory", text: `Đã đánh bại ${state.bossData.name}!` });
        break;
      }
    }

    state.player.energy = Math.min(100, state.player.energy + 25);
    events.push({ type: "energy", value: state.player.energy, text: `Energy +25 (${state.player.energy}/100).` });
    if (state.player.energy >= 100) {
      state.player.energy = 0;
      if (state.equippedCards.some(c => c.effect === "phoenix")) {
        const magic = state.player.atk * 2;
        state.boss.hp = Math.max(0, state.boss.hp - magic);
        state.burnUntil = now + 3000;
        events.push({ type: "card", damage: magic, text: `Hỏa Phượng Hoàng: cầu lửa gây ${magic} sát thương phép!` });
      } else if (state.equippedCards.some(c => c.effect === "guardian")) {
        const healed = Math.min(8, state.player.maxHp - state.player.hp);
        state.player.hp += healed;
        events.push({ type: "card", text: `Hộ Vệ Mộng Cảnh: hồi ${healed} HP.` });
      } else {
        events.push({ type: "energy-spent", text: "Energy đạt 100 và được tiêu thụ. Trang bị thẻ có kỹ năng Energy để kích hoạt hiệu ứng mạnh hơn." });
      }
      if (state.boss.hp <= 0) {
        state.status = "won";
        events.push({ type: "victory", text: `Đã đánh bại ${state.bossData.name}!` });
        break;
      }
    }
  }

  safety = 0;
  while (state.status === "running" && state.boss.nextAttack <= 0 && safety++ < 4) {
    state.boss.nextAttack += state.bossData.interval;
    state.boss.hits++;
    let damage = physicalDamage(state.boss.atk, state.player.def);
    if (state.burnUntil > now) damage = Math.max(1, damage - 1);
    state.player.hp = Math.max(0, state.player.hp - damage);
    events.push({ type: "boss-hit", damage, text: `${state.bossData.name} gây ${damage} sát thương lên bạn.` });
    if (state.player.hp <= 0) {
      state.status = "lost";
      events.push({ type: "defeat", text: "Bạn đã gục ngã. Hãy đổi build rồi thử lại." });
    }
  }
  return events;
}
