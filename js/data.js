/* DỮ LIỆU GAME — muốn chỉnh chỉ số/mô tả, sửa tại đây. Ảnh riêng: đặt vào assets/ rồi ghi "assets/ten.png" vào trường emoji. */
const CFG={tick:100,atkMs:2000,base:{hp:100,atk:5,def:0},own:{hp:5,atk:1,def:1},ally:{hp:.5,atk:.6},startJade:2000,
 equip:{normal:{hp:15,atk:5,max:1,jade:80},elite:{hp:25,atk:10,max:2,jade:120}}};
const BEL={
 saint:{name:'Đức Lương Saint',icon:'🙄',line:'Ồ m là nhất, ditme m là nhất rồi con chó ạ',desc:'Mỗi đòn đánh +2% né tránh (tối đa 30%). Khi đạt tối đa: +50% Atk đến hết trận.'},
 ipad:{name:'Phạm Đạt Ipad Kid',icon:'😏',line:'Tất nhiên rồi thì',desc:'+2.5% chí mạng mỗi giây (tối đa 50%). Khi đạt tối đa: đòn kế tiếp chắc chắn chí mạng (x3).'},
 fish:{name:'Nguyễn Hoa Cá Lớn',icon:'😡',line:'Ác quỷ vô chuồng heo dùm',desc:'Hồi máu +50%. Khi bị đánh tích 15% sát thương vào bể cá thuỷ tinh; khi bị kết liễu hồi sinh bằng giá trị bể cá (1 lần/trận).'},
 vex:{name:'Hữu Phái Vex Lỏ',icon:'🙂',line:'rầu d',desc:'Mỗi 4s tích 1 tầng "lỏ" (tối đa 5): mỗi tầng +20% máu tối đa và +4 Def. Đạt tầng 2: hiện chữ "rầu d".'}};
const BOSS=[
 {id:'archer',name:'Xạ Thủ Nhân Mã',emoji:'🏹',tier:'normal',hp:130,atk:10,def:4,en:0,units:1,cd:0,card:'Mỗi đòn đánh thứ 3 gây thêm 12% HP hiện tại của đối thủ (sát thương chuẩn).'},
 {id:'twin',name:'Song Yêu',emoji:'👯',tier:'normal',hp:140,atk:10,def:2,en:0,units:2,cd:0,card:'Mỗi đòn đánh có 25% đánh thêm một đòn nữa. (Boss đôi: 2 thanh máu độc lập)'},
 {id:'phoenix',name:'Hoả Phượng Hoàng',emoji:'🔥',tier:'normal',hp:160,atk:12,def:4,en:20,units:1,cd:3000,card:'Đủ 100 Energy: cầu lửa 200% Atk lên toàn bộ kẻ địch + thiêu đốt 4s (1% máu tối đa/giây). Nghỉ 3s.'},
 {id:'succubus',name:'Sắc Quỷ',emoji:'assets/characters/succubus/idle_01.png',anim:{dir:'assets/characters/succubus',idle:6,atk:6,w:125},icon:'😈',tier:'normal',hp:200,atk:15,def:4,en:10,units:1,cd:3000,card:'Đủ 100 Energy: quật roi 400% Atk, giảm hiệu quả hồi máu 80% trong 4s. Nghỉ 3s.'},
 {id:'cupid',name:'Thần Tình Yêu Cupid',emoji:'💘',tier:'normal',hp:250,atk:15,def:4,en:15,units:1,cd:11000,card:'Đủ 100 Energy: tình yêu hộ thể 6s (+10 Atk, +5 Energy mỗi đòn). Nghỉ 5s.'},
 {id:'pumpkin',name:'Vua Bí Ngô',emoji:'assets/characters/pumpkin/idle_01.png',anim:{dir:'assets/characters/pumpkin',idle:6,atk:7,w:119},icon:'🎃',tier:'elite',hp:700,atk:10,def:8,en:10,units:1,cd:5000,card:'Đủ 100 Energy: tinh thần lễ hội vĩnh viễn (+50% tốc độ, +10 Atk), cộng dồn tối đa 5 tầng. Nghỉ 5s.'},
 {id:'bird',name:'Tiên Điểu',emoji:'🕊️',tier:'elite',hp:500,atk:6,def:8,en:80,units:1,cd:0,card:'Đủ 100 Energy: tung 3 đòn NGẪU NHIÊN, mỗi đòn 120% Atk, lên toàn đội kẻ địch (kể cả hàng sau), đồng thời +2 Atk vĩnh viễn (tối đa +20).'},
 /* NHÂN VẬT BÁN Ở CỬA HÀNG: có "price". raw:true = dùng đúng chỉ số ghi ở đây (không nhân CFG.ally). anim = ảnh động (thư mục assets/angel/idle & tan_cong). icon = hình ném khi đánh. */
 {id:'angel',name:'Thiên Thần',emoji:'assets/characters/angel/idle_01.png',anim:{dir:'assets/characters/angel',idle:8,atk:10,w:113},icon:'✨',price:800,raw:true,tier:'normal',hp:30,atk:2,def:0,en:20,units:1,cd:4000,card:'Đủ 100 Energy: hồi cho 2 đồng đội thấp máu nhất một lượng bằng 30% máu hiện tại + 5% máu tối đa. Nghỉ 4s.'},
 {id:'paladin',name:'Chiến Binh Thành Paladin',emoji:'assets/characters/paladin/idle_01.png',anim:{dir:'assets/characters/paladin',idle:6,atk:5,w:102},icon:'🗡️',price:1000,raw:true,tier:'normal',hp:80,atk:4,def:4,en:25,units:1,cd:10000,card:'Đủ 100 Energy: chặn 40% sát thương phải chịu trong 6s (sát thương chuẩn xuyên qua được). Nghỉ 10s.'}];
