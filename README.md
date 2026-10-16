# GAME SOLARDREAM — Prototype 0.2

Bản prototype web HTML/CSS/JavaScript thuần, có thể chạy trên GitHub Pages.

## Chạy thử
- Giải nén project.
- Mở bằng một web server cục bộ (ví dụ VS Code Live Server), hoặc tải lên GitHub và bật Settings → Pages → Deploy from branch → `main` / `/(root)`.
- Không mở `index.html` trực tiếp bằng `file://` vì project dùng JavaScript modules.

## Điều chỉnh trong 0.2
- Thêm hoạt ảnh đạn bay giữa nhân vật và boss, số sát thương nổi khi trúng đòn.
- Hiện tổng sát thương gây ra của hai bên.
- Tách Bộ thẻ / Kho thẻ / Hành trình thành các tab gọn hơn; khu vực chiến đấu luôn hiển thị.
- Log được xóa khi bắt đầu/đánh lại trận, giới hạn còn 8 dòng gần nhất.
- Song Yêu được cân bằng lại để người chơi có thể vượt qua bằng thẻ Nhân Mã; boss cuối cũng được hạ chỉ số thử nghiệm.
- Energy giữ nguyên ở 100/100 nếu build chưa có thẻ tiêu thụ Energy. Chỉ reset khi một hiệu ứng Energy được kích hoạt.

## Lưu ý
Đây là prototype gameplay để thử nghiệm, chưa có lưu tiến trình sau khi tải lại trang, âm thanh, sprite pixel art hoàn chỉnh hay hệ thống Tín Ngưỡng. Các chỉ số boss vẫn cần playtest và cân bằng thêm.
