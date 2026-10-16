# LỐI CHƠI — game thẻ bài & tín ngưỡng

Game chạy thẳng trên trình duyệt (HTML/CSS/JavaScript thuần), không cần cài gì.

## Đưa lên GitHub và chơi online (không cần biết code)
1. Vào github.com → **New repository** → đặt tên (vd. `loi-choi`) → chọn **Public** → **Create repository**.
2. Bấm **uploading an existing file**, kéo thả **toàn bộ file/thư mục đã giải nén** (index.html, css, js, assets, README.md) → **Commit changes**.
3. Vào **Settings → Pages** → mục *Branch* chọn `main` và `/ (root)` → **Save**.
4. Đợi 1–2 phút, GitHub hiện link dạng `https://tên-bạn.github.io/loi-choi/` — gửi link đó cho bạn bè là chơi được.

## Cấu trúc
- `index.html` — khung trang
- `css/style.css` — giao diện, hiệu ứng
- `js/data.js` — **chỉ số boss, thẻ bài, tín ngưỡng** (muốn cân bằng game thì sửa ở đây)
- `js/engine.js` — luật chiến đấu (sát thương, crit, né, năng lượng, kỹ năng thẻ)
- `js/ui.js` — màn hình, popup, lưu tiến trình (localStorage)
- `assets/` — thả ảnh nhân vật vào đây, rồi ghi `assets/ten.png` vào trường `emoji` trong `data.js`

## Luật đã cài
Đánh mỗi 2s · Def chặn 1 sát thương/2 điểm · Crit x3 · sát thương chuẩn bỏ qua giáp · mỗi thẻ sở hữu +5 máu/+1 Atk/+1 Def · Normal mang 1 thẻ, Elite mang 2 thẻ · thắng boss nhận Jade và mở khoá thẻ.
