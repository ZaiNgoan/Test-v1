import { BOSSES, CARDS, PLAYER_BASE } from "./data.js";
import { createBattle, tickBattle } from "./combat.js";

const $ = id => document.getElementById(id);
const els = {
  runStatus: $("run-status"), encounterTitle: $("encounter-title"), stageBadge: $("stage-badge"),
  bossName: $("boss-name"), bossSubtitle: $("boss-subtitle"), bossArt: $("boss-art"),
  playerHp: $("player-hp"), playerHpBar: $("player-hp-bar"), playerDamage: $("player-damage"), bossDamage: $("boss-damage"), projectileLayer: $("projectile-layer"), playerAtk: $("player-atk"), playerDef: $("player-def"),
  energyValue: $("energy-value"), energyBar: $("energy-bar"), bossHp: $("boss-hp"), bossHpBar: $("boss-hp-bar"),
  bossAtk: $("boss-atk"), bossDef: $("boss-def"), battleMessage: $("battle-message"), start: $("start-btn"),
  pause: $("pause-btn"), retry: $("retry-btn"), log: $("combat-log"), equipped: $("equipped-cards"),
  collection: $("card-collection"), collectionCount: $("collection-count"), slotCount: $("slot-count"),
  bossList: $("boss-list"), heroSprite: $("hero-sprite"), bossSprite: $("boss-sprite"),
  modal: $("result-modal"), resultIcon: $("result-icon"), resultKicker: $("result-kicker"),
  resultTitle: $("result-title"), resultText: $("result-text"), resultReward: $("result-reward"), resultBtn: $("result-btn")
};

let currentBossIndex = 0;
let unlockedBosses = 1;
let wonBosses = new Set();
let ownedCards = new Set(["archer-card"]);
let equippedCardIds = ["archer-card"];
let battle = null;
let raf = null;
let paused = false;
let lastFrame = 0;
let pendingResult = null;
const MAX_SLOTS = 2;

function getCard(id) { return CARDS.find(c => c.id === id); }
function getBoss() { return BOSSES[currentBossIndex]; }
function log(text, type = "") {
  const p = document.createElement("p");
  p.textContent = `[${new Date().toLocaleTimeString("vi-VN", {hour:"2-digit", minute:"2-digit", second:"2-digit"})}] ${text}`;
  if (type) p.className = `log-${type}`;
  els.log.prepend(p);
  while (els.log.children.length > 8) els.log.removeChild(els.log.lastChild);
}
function setStatus(text) { els.runStatus.textContent = text; }
function stopLoop() { if (raf) cancelAnimationFrame(raf); raf = null; }
function openModal(kind, reward = "") {
  pendingResult = kind;
  els.modal.classList.remove("hidden");
  if (kind === "won") {
    els.resultIcon.textContent = "✦";
    els.resultKicker.textContent = "ENCOUNTER COMPLETE";
    els.resultTitle.textContent = "CHIẾN THẮNG!";
    els.resultText.textContent = `Bạn đã đánh bại ${getBoss().name}.`;
    els.resultReward.textContent = reward;
    els.resultBtn.textContent = currentBossIndex < BOSSES.length - 1 ? "ĐẾN BOSS TIẾP THEO" : "CHƠI LẠI TỪ ĐẦU";
  } else {
    els.resultIcon.textContent = "☾";
    els.resultKicker.textContent = "DREAM INTERRUPTED";
    els.resultTitle.textContent = "BẠN ĐÃ THẤT BẠI";
    els.resultText.textContent = "Không sao cả — thử đổi thẻ hoặc cách xây dựng sức mạnh rồi chiến đấu lại.";
    els.resultReward.textContent = "Bạn giữ nguyên thẻ và tiến trình. Hãy đổi build ở bảng bên phải.";
    els.resultBtn.textContent = "QUAY LẠI CHỈNH BUILD";
  }
}
function renderBossList() {
  els.bossList.innerHTML = "";
  BOSSES.forEach((boss, i) => {
    const row = document.createElement("div");
    row.className = "boss-row" + (i === currentBossIndex ? " active" : "") + (i >= unlockedBosses ? " locked" : "");
    const state = wonBosses.has(boss.id) ? "✓ ĐÃ HẠ" : i >= unlockedBosses ? "🔒 KHÓA" : i === currentBossIndex ? "ĐANG CHỌN" : "SẴN SÀNG";
    row.innerHTML = `<span class="boss-number">0${i+1}</span><div><b>${boss.name}</b><small>${boss.location}</small></div><span class="boss-state">${state}</span>`;
    if (i < unlockedBosses && (!battle || battle.status !== "running")) {
      row.style.cursor = "pointer";
      row.title = "Chọn boss";
      row.addEventListener("click", () => { currentBossIndex = i; resetBattle(false); renderAll(); log(`Đã chọn boss: ${boss.name}.`, "system"); });
    }
    els.bossList.appendChild(row);
  });
}
function renderCards() {
  els.equipped.innerHTML = "";
  const equipped = equippedCardIds.map(getCard).filter(Boolean);
  if (!equipped.length) {
    const empty = document.createElement("p"); empty.className = "muted small"; empty.textContent = "Chưa trang bị thẻ. Chọn thẻ trong kho bên dưới."; els.equipped.appendChild(empty);
  }
  equipped.forEach(card => {
    const el = makeCardElement(card, true);
    els.equipped.appendChild(el);
  });
  els.collection.innerHTML = "";
  CARDS.forEach(card => {
    const owned = ownedCards.has(card.id);
    const equippedNow = equippedCardIds.includes(card.id);
    const el = makeCardElement(card, false, owned, equippedNow);
    els.collection.appendChild(el);
  });
  els.collectionCount.textContent = String(ownedCards.size).padStart(2, "0");
  els.slotCount.textContent = `${equippedCardIds.length}/${currentBossIndex >= 1 ? 2 : 1} Ô`;
}
function makeCardElement(card, isEquipped, owned = true, equippedNow = false) {
  const button = document.createElement("button");
  button.className = "card-item" + (isEquipped || equippedNow ? " equipped" : "");
  button.dataset.type = card.type;
  const action = isEquipped ? "BỎ THẺ" : equippedNow ? "ĐANG DÙNG" : owned ? "TRANG BỊ" : "CHƯA MỞ";
  button.innerHTML = `<span class="card-glyph">${card.glyph}</span><span><span class="card-title">${card.name}</span><span class="card-desc">${card.description}</span></span><span class="card-action">${action}</span>`;
  if (!owned) button.disabled = true;
  if (isEquipped || equippedNow) button.addEventListener("click", () => {
    if (battle?.status === "running") { log("Không thể đổi thẻ giữa trận.", "bad"); return; }
    if (isEquipped) equippedCardIds = equippedCardIds.filter(id => id !== card.id);
    else equippedCardIds = equippedCardIds.filter(id => id !== card.id);
    renderCards();
  });
  else if (owned) button.addEventListener("click", () => {
    if (battle?.status === "running") { log("Không thể đổi thẻ giữa trận.", "bad"); return; }
    const slots = currentBossIndex >= 1 ? 2 : 1;
    if (equippedCardIds.length >= slots) {
      log(`Đã đầy ô thẻ (${slots}). Hãy bỏ một thẻ trước khi trang bị thẻ khác.`, "bad");
      return;
    }
    equippedCardIds.push(card.id);
    renderCards();
    log(`Đã trang bị thẻ ${card.name}.`, "good");
  });
  return button;
}
function renderAll() {
  const boss = getBoss();
  els.encounterTitle.textContent = boss.location;
  els.stageBadge.textContent = `BOSS 0${currentBossIndex + 1}`;
  els.bossName.textContent = boss.name;
  els.bossSubtitle.textContent = boss.subtitle;
  els.bossArt.className = `pixel-boss ${boss.art}`;
  els.bossAtk.textContent = boss.atk;
  els.bossDef.textContent = boss.def;
  els.playerAtk.textContent = PLAYER_BASE.atk;
  els.playerDef.textContent = PLAYER_BASE.def + (equippedCardIds.some(id => getCard(id)?.effect === "guardian") ? 2 : 0);
  renderCards();
  renderBossList();
  renderBattle();
}
function renderBattle() {
  const boss = getBoss();
  const p = battle?.player || {hp:PLAYER_BASE.maxHp,maxHp:PLAYER_BASE.maxHp,energy:0,atk:PLAYER_BASE.atk,def:PLAYER_BASE.def};
  const b = battle?.boss || {hp:boss.hp,maxHp:boss.hp,atk:boss.atk,def:boss.def};
  els.playerHp.textContent = `${Math.ceil(p.hp)} / ${p.maxHp}`;
  els.playerHpBar.style.width = `${Math.max(0,p.hp/p.maxHp*100)}%`;
  els.energyValue.textContent = `${p.energy} / 100`;
  els.energyBar.style.width = `${p.energy}%`;
  $("player-damage").textContent = battle?.player?.totalDamage ?? 0;
  $("boss-damage").textContent = battle?.boss?.totalDamage ?? 0;
  els.playerDamage.textContent = String(p.totalDamage || 0);
  els.bossDamage.textContent = String(b.totalDamage || 0);
  els.bossHp.textContent = `${Math.ceil(b.hp)} / ${b.maxHp}`;
  els.bossHpBar.style.width = `${Math.max(0,b.hp/b.maxHp*100)}%`;
  els.start.disabled = battle?.status === "running";
  els.pause.disabled = battle?.status !== "running";
  els.retry.disabled = false;
  if (battle?.status === "running") {
    els.battleMessage.textContent = paused ? "Đang tạm dừng." : "Hai bên đang tự động chiến đấu!";
  } else if (battle?.status === "won") els.battleMessage.textContent = "Chiến thắng! Boss đã bị đánh bại.";
  else if (battle?.status === "lost") els.battleMessage.textContent = "Thất bại. Hãy thử build khác.";
  else els.battleMessage.textContent = "Chọn BẮT ĐẦU để chiến đấu.";
}
function resetBattle(writeLog = true) {
  stopLoop(); paused = false; battle = null; lastFrame = 0; els.pause.textContent = "Ⅱ TẠM DỪNG";
  els.log.innerHTML = "";
  els.projectileLayer.innerHTML = "";
  els.modal.classList.add("hidden");
  setStatus("SẴN SÀNG");
  renderAll();
  if (writeLog) log(`Đã chuẩn bị ${getBoss().name}.`, "system");
}
function startBattle() {
  if (battle?.status === "running") return;
  els.log.innerHTML = "";
  els.log.innerHTML = "";
  els.projectileLayer.innerHTML = "";
  els.modal.classList.add("hidden");
  const boss = getBoss();
  const cards = equippedCardIds.map(getCard).filter(Boolean);
  battle = createBattle(boss, cards, PLAYER_BASE);
  if (cards.some(c => c.effect === "guardian")) battle.player.def += 2;
  paused = false;
  setStatus("ĐANG CHIẾN ĐẤU");
  log(`Bắt đầu trận đấu với ${boss.name}.`, "system");
  log(`Bộ thẻ: ${cards.length ? cards.map(c=>c.name).join(", ") : "không có thẻ"}.`, "system");
  renderBattle();
  stopLoop();
  raf = requestAnimationFrame(frame);
}
function animateHit(target, damage, kind) {
  const projectile = document.createElement("span");
  projectile.className = `projectile ${kind === "player" ? "projectile-out" : "projectile-in"}`;
  projectile.textContent = kind === "player" ? "●" : "◆";
  els.projectileLayer.appendChild(projectile);
  setTimeout(() => projectile.remove(), 560);
  const wrap = target === "boss" ? els.bossSprite : els.heroSprite;
  const pop = document.createElement("span");
  pop.className = `damage-number ${kind === "player" ? "damage-out" : "damage-in"}`;
  pop.textContent = `-${damage} DMG`;
  wrap.appendChild(pop);
  setTimeout(() => pop.remove(), 850);
}
function handleEvents(events) {
  for (const event of events) {
    if (event.type === "player-hit") { log(event.text, "good"); animateHit("boss", event.damage, "player"); els.bossSprite.classList.remove("shake"); void els.bossSprite.offsetWidth; els.bossSprite.classList.add("shake"); }
    else if (event.type === "boss-hit") { log(event.text, "bad"); animateHit("hero", event.damage, "boss"); els.heroSprite.classList.remove("shake"); void els.heroSprite.offsetWidth; els.heroSprite.classList.add("shake"); }
    else if (event.type === "energy") log(event.text, "system");
    else if (event.type === "card") { log(event.text, "gold"); if (event.damage) animateHit("boss", event.damage, "player"); }
    else if (event.type === "energy-spent" || event.type === "energy-full") log(event.text, "system");
    else if (event.type === "victory") {
      log(event.text, "gold"); stopLoop(); setStatus("CHIẾN THẮNG");
      const boss = getBoss();
      const newlyWon = !wonBosses.has(boss.id);
      wonBosses.add(boss.id);
      ownedCards.add(boss.cardId);
      if (currentBossIndex + 1 < BOSSES.length) unlockedBosses = Math.max(unlockedBosses, currentBossIndex + 2);
      renderAll();
      const reward = newlyWon ? `MỞ KHÓA THẺ: ${getCard(boss.cardId).name}` : "Bạn đã sở hữu thẻ thưởng của boss này.";
      openModal("won", reward);
    } else if (event.type === "defeat") {
      log(event.text, "bad"); stopLoop(); setStatus("THẤT BẠI"); openModal("lost");
    }
  }
}
function frame(now) {
  if (!battle || battle.status !== "running") return;
  raf = requestAnimationFrame(frame);
  if (paused) { lastFrame = now; return; }
  if (!lastFrame) lastFrame = now;
  const delta = Math.min(now - lastFrame, 100);
  lastFrame = now;
  const events = tickBattle(battle, delta, now);
  handleEvents(events);
  renderBattle();
  if (battle?.status !== "running") stopLoop();
}
els.start.addEventListener("click", startBattle);
els.pause.addEventListener("click", () => {
  if (!battle || battle.status !== "running") return;
  paused = !paused;
  els.pause.textContent = paused ? "▶ TIẾP TỤC" : "Ⅱ TẠM DỪNG";
  setStatus(paused ? "TẠM DỪNG" : "ĐANG CHIẾN ĐẤU");
  log(paused ? "Đã tạm dừng trận đấu." : "Tiếp tục trận đấu.", "system");
  renderBattle();
});
els.retry.addEventListener("click", () => { resetBattle(); startBattle(); });
$("clear-log").addEventListener("click", () => { els.log.innerHTML = ""; log("Đã xóa nhật ký chiến đấu.", "system"); });
els.resultBtn.addEventListener("click", () => {
  els.modal.classList.add("hidden");
  if (pendingResult === "won") {
    if (currentBossIndex < BOSSES.length - 1) currentBossIndex++;
    else { currentBossIndex = 0; wonBosses.clear(); unlockedBosses = 1; ownedCards = new Set(["archer-card"]); equippedCardIds = ["archer-card"]; }
    resetBattle(false);
    log(`Sẵn sàng cho ${getBoss().name}.`, "gold");
  } else {
    battle = null; paused = false; setStatus("SẴN SÀNG");
    els.pause.textContent = "Ⅱ TẠM DỪNG";
    renderAll();
  }
});
document.querySelectorAll(".side-tab").forEach(tab => tab.addEventListener("click", () => {
  document.querySelectorAll(".side-tab").forEach(item => item.classList.toggle("active", item === tab));
  document.querySelectorAll(".tab-panel").forEach(panel => panel.classList.toggle("hidden-tab", panel.dataset.panel !== tab.dataset.tab));
}));
renderAll();
log("GAME SOLARDREAM Prototype 0.2 sẵn sàng.", "system");
