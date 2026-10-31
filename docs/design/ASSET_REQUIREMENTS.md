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

- `docs/design/concepts/screen-01.png` … `screen-24.png`: **chưa được upload**.
- Storyboard Espresso và Phin: cần Claude soạn để duyệt trước khi triển khai.
- Sprite atlas / source art: lưu ở project game mới khi sản xuất; không cần đưa source prototype cũ vào.
