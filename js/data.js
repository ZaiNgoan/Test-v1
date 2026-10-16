export const BOSSES = [
  {
    id: "archer", name: "XẠ THỦ NHÂN MÃ", subtitle: "FOREST WATCHER",
    location: "Rừng Khởi Nguyên", hp: 130, atk: 4, def: 1, interval: 2400,
    cardId: "archer-card", art: "archer", description: "Mỗi đòn đánh thứ ba gây thêm sát thương bằng 12% HP hiện tại của mục tiêu."
  },
  {
    id: "twin", name: "SONG YÊU", subtitle: "THE TWIN WRAITHS",
    location: "Thung Lũng Hai Bóng", hp: 220, atk: 7, def: 2, interval: 2200,
    cardId: "twin-card", art: "twin", description: "Mỗi đòn đánh có 25% xác suất tạo thêm một đòn đánh phụ. Đòn phụ không thể kích hoạt đòn phụ khác."
  },
  {
    id: "phoenix", name: "HỎA PHƯỢNG HOÀNG", subtitle: "EMBER REBORN",
    location: "Điện Tro Tàn", hp: 360, atk: 10, def: 3, interval: 2100,
    cardId: "phoenix-card", art: "phoenix", description: "Mỗi 100 Energy, gây sát thương phép bằng 200% ATK và thiêu đốt mục tiêu."
  }
];

export const CARDS = [
  { id: "archer-card", name: "Xạ Thủ Nhân Mã", type: "crit", glyph: "➶", rarity: "NORMAL", description: "Mỗi đòn đánh thứ 3 gây thêm sát thương bằng 12% HP hiện tại của mục tiêu.", effect: "archer" },
  { id: "twin-card", name: "Song Yêu", type: "energy", glyph: "☯", rarity: "NORMAL", description: "Mỗi đòn đánh có 25% cơ hội đánh thêm một lần. Đòn phụ không nối chuỗi.", effect: "twin" },
  { id: "phoenix-card", name: "Hỏa Phượng Hoàng", type: "energy", glyph: "✹", rarity: "ELITE", description: "Khi đủ 100 Energy, gây 200% ATK sát thương phép và thiêu đốt 3 giây.", effect: "phoenix" },
  { id: "guardian-card", name: "Hộ Vệ Mộng Cảnh", type: "defense", glyph: "⬟", rarity: "SPECIAL", description: "Mỗi lần Energy kích hoạt, hồi 8 HP. Không vượt quá HP tối đa.", effect: "guardian" }
];

export const PLAYER_BASE = { maxHp: 100, atk: 5, def: 0, interval: 2000, energyPerHit: 25 };
