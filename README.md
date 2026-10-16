# GAME SOLARDREAM — Prototype 0.1

Một prototype Idle Boss-Rush bằng HTML, CSS và JavaScript thuần. Game chạy trên trình duyệt, không cần cài engine.

## Cách chơi
1. Mở `index.html` qua một local web server hoặc xuất bản bằng GitHub Pages.
2. Nhấn **BẮT ĐẦU** để nhân vật tự động chiến đấu.
3. Mỗi đòn đánh tạo 25 Energy. Khi đủ 100, Energy được tiêu thụ và thẻ có kỹ năng Energy sẽ kích hoạt hiệu ứng.
4. Thắng boss để mở khóa thẻ boss và boss tiếp theo.
5. Có thể thay đổi build giữa các trận. Boss đầu cho phép 1 thẻ; từ boss thứ hai có 2 ô thẻ.
6. Nếu thua, chỉnh build rồi thử lại.

## Chạy cục bộ
Vì JavaScript sử dụng ES modules, mở terminal trong thư mục dự án rồi chạy một server tĩnh, ví dụ:

```bash
python3 -m http.server 8000
```

Sau đó mở `http://localhost:8000`.

Nếu không muốn dùng terminal, hãy tải repository lên GitHub rồi bật **Settings → Pages → Deploy from a branch → main → /(root)**.

## Cấu trúc
- `index.html` — giao diện game
- `css/style.css` — giao diện pixel-inspired và responsive
- `js/data.js` — dữ liệu boss, thẻ và chỉ số cơ bản
- `js/combat.js` — logic chiến đấu và Energy
- `js/main.js` — giao diện, vòng lặp game, phần thưởng và tiến trình

## Luật prototype 0.1
- Nhân vật: 100 HP, 5 ATK, 0 DEF, đánh mỗi 2 giây.
- Boss có chu kỳ đánh riêng.
- Sát thương vật lý: `max(1, ATK - floor(DEF / 2))`.
- Mỗi đòn đánh của nhân vật tạo 25 Energy; đạt 100 thì tiêu thụ Energy.
- Thẻ Xạ Thủ Nhân Mã: mỗi đòn thứ ba gây thêm 12% HP hiện tại của boss.
- Thẻ Song Yêu: 25% cơ hội đánh thêm một lần; đòn phụ không nối chuỗi.
- Thẻ Hỏa Phượng Hoàng: khi đạt 100 Energy, gây 200% ATK sát thương phép.
- Thẻ Hộ Vệ Mộng Cảnh: khi Energy kích hoạt, hồi 8 HP (thẻ dự trữ trong bản 0.1).
- Khi thất bại, người chơi giữ tiến trình và có thể đổi build rồi thử lại.

## Giới hạn đã biết
- Chưa có lưu tiến trình sau khi đóng trình duyệt.
- Tín Ngưỡng, hoạt ảnh sprite thật, âm thanh và tiến trình offline chưa triển khai.
- Đây là prototype để kiểm chứng gameplay, chưa phải bản phát hành hoàn chỉnh.
