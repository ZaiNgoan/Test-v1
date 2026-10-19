# Thư mục assets
```
assets/
├─ ui/                      ảnh giao diện (jade.png ...)
└─ characters/
   └─ <id nhân vật>/        id trùng với trường id trong js/data.js
      ├─ idle_01.png ...    khung hình đứng yên (lặp vòng)
      └─ attack_01.png ...  khung hình tấn công (chạy 1 lượt mỗi đòn)
```
Thêm nhân vật có ảnh động: tạo thư mục `assets/characters/<id>/`, thả khung `idle_XX.png` và `attack_XX.png` (đánh số 01, 02, ...), rồi trong `js/data.js` ghi `anim:{dir:'assets/characters/<id>',idle:<số khung idle>,atk:<số khung attack>}`. Ảnh nên quay mặt sang TRÁI (game tự lật sang phải cho phe người chơi).
