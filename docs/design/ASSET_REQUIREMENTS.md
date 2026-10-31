# Coffee World — ASSET REQUIREMENTS

**Phạm vi:** dự án game mới dùng Phaser 4 + TypeScript + Vite. Repository QGame này chỉ chứa **tài liệu tham khảo**, không phải source prototype để sao chép. Định hướng camera thế giới: **top-down 3/4 stylized 2.5D**, không ép strict isometric. Bàn pha dùng góc nhìn cận cảnh riêng.

## Quy tắc quan trọng

1. Ảnh concept 01–24 là ảnh tổng hợp để duyệt mỹ thuật, **không dùng trực tiếp làm scene tương tác**.
2. Mọi asset production phải tách object và có điểm neo (pivot), vùng tương tác, thứ tự lớp, trạng thái, kích thước và quyền sử dụng.
3. Tạm thời được dùng placeholder tách lớp để thử gameplay, nhưng phải đánh dấu `placeholder`.
4. Không tự tạo lại ảnh đã duyệt chỉ vì chưa tìm thấy file. Cần đối chiếu ảnh gốc trước.
5. Ưu tiên gameplay Espresso và Phin trước, rồi phục vụ khách, nông trại, sơ chế, rang, progression.

## Asset cần tách

| Nhóm | Thành phần cần tách | Dùng cho | Kỹ thuật |
|---|---|---|---|
| World background | mặt đất, đường, tường, mái, cây, vật trang trí, foreground | S01–S07 | sprite/atlas; camera top-down 3/4, Y-sort, collision |
| Nhân vật | thân, đầu/tóc, trang phục, chân tay, idle/walk/interact, NPC, biểu cảm | thế giới, S21 | atlas/animation, pivot chân |
| Nông trại | ô đất, hạt, cây theo giai đoạn, nước, quả, giỏ, công cụ | S04 | các state sprite riêng |
| Quán | quầy, máy, bàn, ghế, ly, khay, đơn hàng, khách, tiền, rác | S05, S17–S19 | hotspot + animation/state |
| Espresso | cân, hạt, máy xay/núm, tay pha, giỏ lọc, WDT, tamper, grouphead, ly, dòng espresso | S11–S13 | **mỗi bộ phận thao tác tách riêng**, drag/rotate/hold |
| Phin Việt Nam | thân phin, đĩa lọc, tấm nén, nắp, ấm, ly, sữa đặc, đá, giọt cà phê | S11–S13 | lắp ráp từng bộ phận, water/drip VFX |
| V60 | phễu, giấy lọc, ấm cổ ngỗng, bình, dòng rót | S12 | asset riêng, **không phải Phin** |
| Sơ chế/rang | quả, hạt nhân, khay, sân phơi, máy rang, hạt rang, nhiệt/gió | S15–S16 | states + particle/VFX |
| UI | panel 9-slice, icon, tab, button, badge, progress, HUD, tooltip | S00–S23, O01–O15 | bình thường/nhấn/khóa/disabled/loading |
| FX/audio | nước, hơi, bọt, crema, sáng, click, bước chân, máy xay, rót | nhiều màn | atlas/particles + âm thanh |

## Checklist bàn pha — gameplay-first

- [ ] 12 thao tác Espresso có input thực, animation, số đo, lỗi và phục hồi.
- [ ] Phin có lắp phin, định lượng, bloom, rót, nhỏ giọt, sữa/đá; nén thời gian **chỉ ở phần chờ**.
- [ ] Gram, thời gian, dòng chảy và chất lượng phụ thuộc state mô phỏng, không phải nút Next.
- [ ] Bàn pha có layout portrait/landscape, hỗ trợ touch/mouse, vùng chạm đủ lớn.
- [ ] Asset tương tác được xuất riêng, không cắt từ một ảnh tổng hợp một cách tùy tiện.
- [ ] Có kiểm thử hiệu năng trên thiết bị thực trước khi công bố FPS.

## Đầu ra mong đợi cho từng asset

`assetId`, tên, file nguồn, định dạng, kích thước, pivot/anchor, layer/depth, collision/hitbox, animation states, interaction type, license, nguồn concept, trạng thái `placeholder | draft | approved | production`.

## Các file cần có sau này

- `docs/design/concepts/screen-01.png` … `screen-24.png`: đã có các ảnh trên GitHub; xem [SCREEN_INDEX.md](SCREEN_INDEX.md) để mở từng concept. Việc kiểm kê tự động đủ 24 file và kiểm tra trực quan vẫn cần hoàn tất.
- Storyboard Espresso và Phin: cần Claude soạn để duyệt trước khi triển khai.
- Sprite atlas / source art: lưu ở project game mới khi sản xuất; không cần đưa source prototype cũ vào.

## Ma trận 24 concept → asset production

Bảng này là **định hướng tách asset từ chủ đề concept**, chưa phải kết quả kiểm tra từng pixel hay xác nhận sprite có sẵn. Xem [SCREEN_INDEX.md](SCREEN_INDEX.md) để biết tên concept. Đánh số ảnh khác với ID S00–S23 trong GDD.

| Ảnh | Chủ đề | Asset cần sản xuất/tái sử dụng | Tương tác/logic cần có |
|---|---|---|---|
| [01](concepts/screen-01.png) | Tai nạn trong đêm mưa | đường phố mưa, xe, nhân vật, mưa/đèn, hiệu ứng sự cố | cutscene/event có trigger, không dùng ảnh nền tĩnh để giả gameplay |
| [02](concepts/screen-02.png) | Gặp năm vị tiên | thiên giới, cổng, 5 NPC, hiệu ứng phép, hội thoại | NPC và overlay hội thoại tách riêng |
| [03](concepts/screen-03.png) | Khởi hành tu tiên | đường đi, nhân vật, đạo cụ khởi đầu, HUD | tap-to-move, camera follow |
| [04](concepts/screen-04.png) | Nông trại | đất, cây nhiều giai đoạn, dụng cụ, giỏ, nước | trồng/tưới/thu hoạch có state |
| [05](concepts/screen-05.png) | Xưởng rang | máy rang, hạt xanh/rang, nhiệt kế, khói | độ rang, nhiệt và thời gian |
| [06](concepts/screen-06.png) | Quán ngày bận rộn | quầy, bàn, khách, order, ly, thanh toán | vòng lặp khách-order-phục vụ-thu tiền |
| [07](concepts/screen-07.png) | Espresso | máy, portafilter, cân, máy xay, tamper, WDT, ly | 12 thao tác tương tác và đo lường |
| [08](concepts/screen-08.png) | Bản đồ thế giới | bản đồ, marker, icon vùng, trạng thái khóa | zoom/pan và chọn địa điểm |
| [09](concepts/screen-09.png) | Nông trại biến thể | dùng chung bộ cây/đất 04; khác bố cục/props | so sánh 04/18 trước khi dựng thêm |
| [10](concepts/screen-10.png) | Trang trí quán | đồ nội thất, bảng chọn, grid vị trí | chọn/đặt/xoay/nâng cấp |
| [11](concepts/screen-11.png) | Nhân viên | NPC, đồng phục, biểu cảm, task icon | AI nhân viên, thuê/phân công |
| [12](concepts/screen-12.png) | Khám phá Việt Nam | bản đồ/địa danh, marker, icon du lịch | dùng chung hệ bản đồ 19 |
| [13](concepts/screen-13.png) | Học viện COG | sư phụ, học viên, lớp học, dụng cụ | NPC dialogue, bài học |
| [14](concepts/screen-14.png) | Drip V60 | phễu V60, giấy lọc, ấm cổ ngỗng, bình, nước | pour-over riêng, tuyệt đối không gọi Phin |
| [15](concepts/screen-15.png) | Tốt nghiệp | hội trường, NPC, chứng nhận, hiệu ứng | progression reward |
| [16](concepts/screen-16.png) | Mở rộng quán | module phòng, bàn, quầy, vật liệu | nâng diện tích và unlock |
| [17](concepts/screen-17.png) | Quản lý quán | HUD kinh doanh, hàng chờ, NPC, tiền, tồn kho | kinh tế thật, không fake counter |
| [18](concepts/screen-18.png) | Nông trại biến thể | tái sử dụng nhóm 04/09 | đánh giá layout trước khi sản xuất |
| [19](concepts/screen-19.png) | Khám phá Việt Nam biến thể | bản đồ/địa danh, marker | tái sử dụng hệ 12 |
| [20](concepts/screen-20.png) | Nhật ký | panel sách, mục nhiệm vụ, ảnh/icon, dấu hoàn thành | lưu tiến độ và tra cứu |
| [21](concepts/screen-21.png) | Tùy chỉnh nhân vật | tóc, mặt, quần áo, phụ kiện, avatar | các layer có thể thay độc lập |
| [22](concepts/screen-22.png) | Kỹ năng pha chế | node, icon, liên kết, panel chi tiết | unlock phụ thuộc progression |
| [23](concepts/screen-23.png) | Minigame pha chế | dụng cụ, nước, ly, hướng dẫn thao tác | xác minh V60/Phin qua ảnh và storyboard |
| [24](concepts/screen-24.png) | Nâng cấp quán | nội thất, nâng cấp, tiền, UI so sánh | tái sử dụng 10/16/17 |

## Ưu tiên sản xuất và tái sử dụng

- **P0 — nền tảng:** camera 3/4, nhân vật, input tap/click, occlusion/Y-sort, collision, responsive, HUD tách lớp.
- **P1 — Espresso (07):** 12 thao tác thực, định lượng, xay, nén, chiết xuất, đánh giá, animation và recovery.
- **P2 — Phin Việt Nam:** **chưa có concept phin được xác nhận**. Cần storyboard và bộ dụng cụ phin kim loại riêng, không tái dùng V60 (14/23).
- **P3 — Quán (06, 10, 11, 16, 17, 24):** order, hàng chờ, thanh toán, nhân sự, decor và mở rộng dùng chung prefab.
- **P4 — Farm/roast (04, 05, 09, 18):** dùng chung cây trồng, tile đất, vật phẩm, máy rang; concept biến thể không mặc nhiên là scene khác.
- **P5 — Narrative/progression/world (01, 02, 03, 08, 12, 13, 15, 19, 20, 21, 22):** story event, bản đồ, kỹ năng, nhân vật.

## Quy trình kiểm tra chất lượng asset

1. Xác nhận file PNG thực tế và chủ đề của từng concept, ghi lại sai khác nếu có.
2. Phân loại: background, foreground, interactive prop, NPC, UI, VFX, SFX; không dùng screenshot làm object tương tác.
3. Xác định tỉ lệ hiển thị mobile, kích thước xuất, điểm neo, hitbox, layer, states và atlas.
4. Tạo placeholder có thể chơi được, thay bằng asset đã duyệt khi sẵn sàng.
5. Kiểm tra bộ nhớ GPU, kích thước texture, draw calls, FPS trên điện thoại tầm trung.
