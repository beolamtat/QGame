# COFFEE WORLD – TU TIÊN CÀ PHÊ
## TÀI LIỆU THIẾT KẾ GAME TỔNG THỂ (GDD) v2.0 — TIẾNG VIỆT
**Trạng thái:** Đề xuất để duyệt, **chưa triển khai đầy đủ trong code**. Ngày 01/11/2026.
**Nhánh:** `feat/coffee-world-redesign`. Không gộp vào `main` khi chưa được đồng ý.
**Bản tiếng Anh:** [COFFEE_WORLD_MASTER_GDD_V2.md](./COFFEE_WORLD_MASTER_GDD_V2.md).
**Quy ước:** Các thuật ngữ kỹ thuật, ID màn hình và mã trạng thái được giữ nhất quán với bản tiếng Anh để lập trình không nhầm.

## 0. Định hướng sản phẩm
- Game H5 ưu tiên điện thoại, Phaser 4 + TypeScript + Vite; hỗ trợ cả màn ngang và dọc.
- Đồ họa theo concept: isometric 2.5D, chibi, vẽ tay rực rỡ, tu tiên Á Đông, HUD giấy da/viền vàng. Ảnh concept **không phải** spritesheet có thể tương tác.
- 70% trồng/chế biến/pha chế/kinh doanh cà phê, 30% trùng sinh/tu luyện/khám phá.
- Chạm hoặc click mặt đất để di chuyển; chạm vật thể để nhân vật tới gần và tương tác. Không bắt buộc joystick.
- Mỗi thao tác pha chế là một **minigame với dụng cụ thật trong game**: cử chỉ người chơi → chuyển động vật thể → số liệu thay đổi → phản hồi → có thể sai/sửa.
- Công thức thực tế phải phân biệt với đồ uống tu tiên hư cấu. Không tuyên bố một tỷ lệ duy nhất đúng cho mọi loại hạt.
- Không dùng nút “Tiếp tục” để giả lập thao tác vật lý; không dùng `alert()` trình duyệt; không hiển thị tiền/kim cương/thể lực giả như dữ liệu thật.
- Modal pha chế 5 bước hiện có chỉ là **prototype phải thay**, nhưng cần bảo toàn dữ liệu lưu hiện tại.

## 1. Năm trụ cột trải nghiệm
1. **Học bằng thực hành:** chọn đúng dụng cụ, cân đo, pha và hiểu nguyên nhân.
2. **Làm chủ kỹ năng:** luyện thao tác, điều chỉnh tỷ lệ, học từ lỗi sai.
3. **Từ nông trại đến ly cà phê:** trồng → thu hoạch → sơ chế → rang → pha → phục vụ → thu tiền → tái đầu tư.
4. **Thế giới sống:** nông trại, quán, thị trấn, NPC, nhiệm vụ, tu luyện, quốc gia, chi nhánh.
5. **Mobile dễ chơi:** nút bấm tối thiểu khoảng 44 CSS px, HUD thích ứng, không che vật thể quan trọng, hỗ trợ người khó thực hiện cử chỉ chính xác.

## 2. Danh sách 24 màn hình
| ID | Màn | Thành phần UI bắt buộc | Gameplay / đầu ra |
|---|---|---|---|
| S00 | Khởi động / tải game | Logo, tiến độ, mẹo, tắt tiếng, thử lại | Tải asset, khôi phục save, tiếp tục |
| S01 | Phàm giới | Hội thoại, bỏ qua, hướng dẫn di chuyển | Đi lại, sự cố, xe cứu thương |
| S02 | Ngũ Tiên Hội | 5 tiên nhân, thoại, thẻ tiên duyên, so sánh, xác nhận | Trò chuyện và chọn tiên duyên |
| S03 | Trùng sinh / bái sư | Chọn nhân vật, tên, sư phụ, nhiệm vụ | Nhận đất và bắt đầu hành trình |
| S04 | Nông trại | HUD, minimap, nhiệm vụ, công cụ, điểm tương tác | Gieo, tưới, thu hoạch, kho, xây dựng |
| S05 | Quán cà phê | HUD, hàng đợi, bong bóng gọi món, trạng thái bàn, quầy | Nhận đơn, pha, phục vụ, thu tiền, dọn bàn |
| S06 | Thị trấn | NPC, dấu nhiệm vụ, thương nhân, bản đồ | Hội thoại, giao dịch, tu luyện |
| S07 | Bản đồ thế giới | Kéo/zoom, quốc gia, thẻ mở khóa, chi nhánh | Mở vùng, đi lại, vận chuyển |
| S08 | Học viện cà phê | Khóa học, sao thành thạo, tiến độ, sư phụ | Chọn bài học / luyện tập |
| S09 | Sổ công thức | Tìm kiếm, lọc phương pháp, thẻ món, yêu thích | Tra cứu công thức |
| S10 | Chi tiết công thức | Nguyên liệu, dụng cụ, gram/ml, nhiệt độ, lỗi thường gặp | Bắt đầu học / luyện / phục vụ |
| S11 | Chuẩn bị dụng cụ | Bàn thao tác, dụng cụ kéo-thả, vị trí lắp, tình trạng máy | Chọn và chuẩn bị bộ dụng cụ |
| S12 | **Bàn pha tương tác** | Máy/dụng cụ cỡ lớn, cân, đồng hồ, hướng dẫn, cử chỉ | Pha thực sự từng thao tác |
| S13 | Đánh giá ly cà phê | Điểm, biểu đồ, lỗi, cách cải thiện, thử lại | Ghi kết quả, phục vụ hoặc thử lại |
| S14 | Phòng sáng tạo công thức | Tỷ lệ tùy chỉnh, so sánh A/B, lưu phiên bản | Tạo công thức riêng |
| S15 | Xưởng sơ chế | Phân loại quả, tách vỏ, rửa/phơi/sấy, lô hàng | Tạo hạt cà phê nhân |
| S16 | Xưởng rang | Máy rang, nhiệt/gió, đường cong rang, làm nguội | Tạo lô hạt rang |
| S17 | Xây dựng / trang trí | Danh mục, xem trước vị trí, xoay, chi phí, hoàn tác | Đặt/nâng cấp công trình |
| S18 | Nhân viên / vận hành | Danh sách, ca làm, lương, phân công, tự động hóa | Thuê, đào tạo, giao việc |
| S19 | Quản lý đế chế | Lãi/lỗ, kho, vận chuyển, KPI chi nhánh | Điều hành chuỗi quán |
| S20 | Tu luyện | Linh khí, cảnh giới, cây kỹ năng, đột phá | Nâng cấp hỗ trợ gameplay cà phê |
| S21 | Hồ sơ / trang phục | Avatar, trang phục, danh hiệu, EXP, thành tựu | Tùy chỉnh nhân vật |
| S22 | Nhật ký nhiệm vụ | Chính/phụ/hàng ngày, tiến độ, nhận thưởng | Theo dõi và nhận thưởng |
| S23 | Thử thách / giải đấu | Luật, công thức, thang điểm, xếp hạng, phần thưởng | Thử thách pha chế cuối game |

### 15 panel / cửa sổ dùng lại
- **O01 HUD chung:** avatar, cấp độ, EXP, tài nguyên, minimap, điều hướng.
- **O02 Tạm dừng / cài đặt:** âm thanh, đồ họa, ngôn ngữ, điều khiển.
- **O03 Túi đồ:** hạt, nguyên liệu, dụng cụ, vật phẩm.
- **O04 Hội thoại NPC:** tên, ảnh, câu thoại, lựa chọn.
- **O05 Tương tác vật thể:** tên, khoảng cách, thao tác có thể làm.
- **O06 Chi tiết cây:** giống, thời gian, tưới, thu hoạch.
- **O07 Đơn khách:** món, kích cỡ, yêu cầu, thời gian chờ.
- **O08 Thông tin dụng cụ:** chức năng, cách dùng, tình trạng.
- **O09 Thông tin nguyên liệu:** nguồn gốc, khối lượng, chất lượng.
- **O10 Sư phụ hướng dẫn:** chỉ dẫn, minh họa thao tác, lý do.
- **O11 Lỗi và khắc phục:** lỗi gì, tác động, cách sửa.
- **O12 Thưởng / hóa đơn:** doanh thu, tiền tip, XP, danh tiếng.
- **O13 Mở khóa / xác nhận:** chi phí, điều kiện, xác nhận/hủy.
- **O14 Hỗ trợ thao tác:** chế độ dễ, trợ giúp, phụ đề, giảm chuyển động.
- **O15 Lưu / đồng bộ / lỗi:** đang lưu, khôi phục, xử lý sự cố.

## 3. HUD dùng chung
**Màn ngang:** avatar + EXP trên trái; tiền/kim cương/thể lực phía trên; minimap/thư/cài đặt trên phải; nhiệm vụ có thể thu gọn bên trái; công cụ bên phải; thanh công cụ nhanh và chuyển khu ở dưới. Giữ vùng chơi trung tâm trống.
**Màn dọc:** gộp tài nguyên thành thanh ngắn; nhiệm vụ thành chip thu gọn; menu phụ thành nút mở rộng; thanh công cụ và điều hướng sát vùng an toàn dưới màn. Camera tự điều chỉnh để nhân vật và dụng cụ không bị HUD che.
**Khi pha chế:** ẩn HUD thế giới, chỉ giữ tên công thức, cân, đồng hồ, trạng thái dụng cụ, hướng dẫn, tạm dừng và quay lại.
Mỗi nút có trạng thái bình thường/nhấn/vô hiệu/khóa/đang tải/phản hồi. Tương tác bằng tay phải có vùng chạm đủ rộng; không dùng joystick cố định.

## 4. Bốn chế độ pha chế
1. **Học nghề (Learn):** sư phụ làm mẫu, giải thích từng dụng cụ và nguyên nhân; có thể thử lại, không trừ nguyên liệu hiếm trong bài hướng dẫn đầu.
2. **Luyện tập (Practice):** người chơi tự làm, nhận gợi ý khi cần, có điểm và lịch sử lỗi.
3. **Phục vụ (Service):** khách gọi món, nguyên liệu thật bị trừ, thời gian chờ và độ hài lòng có tác dụng.
4. **Sáng tạo (Experiment):** thay tỷ lệ, so sánh kết quả, lưu công thức độc quyền.
**Tiến trình:** học → tự làm đạt chuẩn → luyện thành thạo → phục vụ → dạy nhân viên/tự động hóa. Không cho tự động hóa thay thế bài học đầu tiên.

## 5. Ngôn ngữ tương tác: mỗi động tác là minigame
| Cử chỉ | Hành động | Phản hồi trong game |
|---|---|---|
| Kéo-thả | Hạt vào máy xay, tay pha vào máy, ly lên cân | Dụng cụ di chuyển, hít vào điểm lắp, âm thanh |
| Nhấn giữ | Xay, đánh sữa, rót, nén | Đồng hồ chạy, vật thể biến đổi |
| Xoay / vuốt | Chỉnh độ xay, khóa tay pha, khuấy | Núm xoay, chỉ số và âm thanh thay đổi |
| Vẽ đường | Rót V60, latte art, phân phối bột | Dòng chất lỏng và hình vẽ theo tay |
| Căn thời điểm | Dừng chiết xuất, ngắt đánh sữa | Khối lượng, nhiệt độ, thời gian biến đổi |
| Định lượng | Cân hạt, rót nước, sữa đặc, syrup | Cân điện tử cập nhật liên tục |
| Nhịp độ | Bloom, rót theo đợt, nén đều | Chất lượng thay đổi theo cách thao tác |

**Hợp đồng cho mọi minigame:** cử chỉ → animation → số đo cập nhật → lỗi có hậu quả → phản hồi nguyên nhân → cách sửa/thử lại. Không có nút Next giả lập hành động.
**Trợ năng:** có thể chọn dụng cụ rồi chọn điểm đến thay kéo-thả, nhấn giữ để tự căn, chỉnh độ nhạy, tập chậm, phụ đề, chỉ dẫn trực quan.

## 6. Bài Espresso: chuỗi 12 thao tác thực sự
Trạng thái:
`CHOOSE_BEANS → WEIGH → SET_GRIND → GRIND → DOSE → DISTRIBUTE → TAMP → PURGE → LOCK → PLACE_CUP → EXTRACT → EVALUATE → SERVE/CLEAN`.

| Bước | Người chơi thao tác | Kết quả / lỗi |
|---|---|---|
| 1. Chọn hạt | Chạm bao hạt, xem nguồn gốc/mức rang | Chọn hạt ảnh hưởng mô phỏng |
| 2. Cân | Kéo hạt lên cân, thêm/bớt | Mục tiêu bài tập 18g ±0,3g |
| 3. Chỉnh máy xay | Xoay núm độ mịn | Mịn/thô ảnh hưởng tốc độ dòng |
| 4. Xay | Nhấn giữ, theo dõi lượng bột | Xay thiếu/thừa ảnh hưởng liều |
| 5. Nạp bột | Đưa tay pha vào cửa ra bột | Lượng bột vào giỏ lọc |
| 6. Phân phối | Dùng WDT/vuốt theo đường | Giảm rủi ro phân bố không đều |
| 7. Nén | Nhấn xuống thẳng, theo dõi độ cân bằng | Nén lệch tăng nguy cơ channeling |
| 8. Xả đầu pha | Nhấn xả nước ngắn | Phản hồi hơi/nước |
| 9. Khóa tay pha | Kéo rồi xoay vào máy | Đúng vị trí mới được chiết xuất |
| 10. Đặt ly/cân | Kéo ly lên cân, bấm tare | Cân bắt đầu từ 0 |
| 11. Chiết xuất | Bật máy, quan sát dòng, tự dừng | Gram đầu ra và thời gian phụ thuộc thao tác |
| 12. Đánh giá/phục vụ | Xem kết quả, sửa, đưa ly cho khách | Điểm, tip, danh tiếng, vệ sinh |

**Thông số bài học khởi đầu:** 18g bột → 36g espresso, tỷ lệ 1:2, khoảng 25–30 giây, nước khoảng 90–96°C. Đây là mốc thử nghiệm, **không phải chân lý đúng với mọi hạt/máy**.
**Quy tắc mô phỏng:** tốc độ dòng = hàm của độ xay, liều, phân phối/nén, mức rang, máy. Khối lượng đầu ra tích lũy theo thời gian. **Thời gian là kết quả thao tác**, không phải slider chỉnh độc lập trong chế độ phục vụ.
**Lỗi:** quá thô → dòng nhanh, dễ chiết xuất thiếu; quá mịn → dòng chậm/nghẹt; nén/phân phối không đều → dòng không ổn định. Phản hồi có tính mô phỏng, không nhận là phép đo hương vị khoa học.

## 7. Bài phin Việt Nam: minigame riêng
Dụng cụ: phin (thân, đĩa lọc, nắp, tấm nén tùy loại), máy xay, ấm, cân, ly, sữa đặc, đá.
Chuỗi: chọn hạt → xay → cân → dàn đều → lắp phin → thêm sữa đặc nếu có → làm nở (bloom) → chờ → rót → nhỏ giọt → nhấc phin → khuấy → thêm đá → phục vụ.
- Kéo/lắp đúng bộ phận phin; nén nhẹ phù hợp loại phin.
- Điều khiển ấm bằng kéo/nhấn giữ; nước tính theo gram; hiển thị bloom và dòng nhỏ giọt.
- Tốc độ nhỏ giọt phụ thuộc độ xay, liều, độ nén và cách rót; không chạy bằng một timer giả.
- Sữa đặc cân theo gram; khuấy bằng vuốt vòng; thêm đá làm thay đổi độ pha loãng.
- Ví dụ bắt đầu: 20–25g cà phê, khoảng 80–120g nước, sữa đặc khoảng 20–35g cho cà phê sữa đá; điều chỉnh theo hạt và khẩu vị.
- Đánh giá độ đậm, tốc độ nhỏ giọt, ngọt, độ pha loãng và sở thích khách.

## 8. Minigame cho các phương pháp khác
- **V60:** chọn độ xay, tráng giấy, cân, bloom 30–45 giây, rót vòng xoắn theo đợt, theo dõi khối lượng và tốc độ chảy; tham khảo 15g:250g.
- **French Press:** xay thô, rót, ngâm, phá lớp bột nổi, ép từ từ, rót ra; chú ý cặn và thời gian.
- **AeroPress:** lắp giấy lọc, cho bột, rót, khuấy, lắp nắp, ép với thanh lực.
- **Moka Pot:** nước đúng vạch an toàn, bột trong giỏ, vặn kín, gia nhiệt, dừng trước khi sôi phụt; có cảnh báo an toàn.
- **Cold Brew:** xay thô, cân tỷ lệ, chọn thời gian ủ theo đồng hồ game, lọc và pha loãng; tham khảo ủ lạnh 12–18 giờ.
- **Đánh sữa:** rót sữa vào ca, đặt đầu vòi hơi, tạo khí và vòng xoáy, theo dõi nhiệt độ; tránh quá nóng.
- **Latte Art:** điều chỉnh độ cao/tốc độ rót và vẽ hình; ban đầu có đường mẫu, sau mở tự do.
- **Đồ xay lạnh:** thêm nguyên liệu, cân syrup/đá, điều chỉnh thời gian xay.
- **Linh cà phê tu tiên:** đồ uống hư cấu được gắn nhãn fantasy; không trộn lẫn hướng dẫn thực tế.

## 9. Thư viện 24 công thức đề xuất
**Espresso (6):** Espresso, Doppio, Ristretto, Lungo, Americano, Long Black.
**Cà phê sữa (6):** Latte, Cappuccino, Flat White, Cortado, Macchiato, Mocha.
**Việt Nam (5):** Đen phin, Sữa đá, Bạc xỉu, Cà phê trứng, Cà phê muối.
**Thủ công (3):** V60, French Press, AeroPress.
**Lạnh / tráng miệng (4):** Cold Brew, Iced Latte, Espresso Tonic, Affogato.
Tổng cộng **24 món**. Ưu tiên hoàn thiện sâu 12 bài học đầu rồi mở rộng.
Mỗi công thức phải có: ID, nhóm, nguồn gốc, dụng cụ, nguyên liệu (g/ml), độ xay, nhiệt độ, lượng đầu ra, cử chỉ từng bước, lỗi thường gặp, hương vị, biến thể, điều kiện mở khóa, mức thành thạo, sở thích khách, nhãn thực tế/hư cấu.
Cần đối chiếu tài liệu chuyên môn trước khi phát hành các thông số pha chế dưới dạng kiến thức thực tế.

## 10. Gameplay quán cà phê trọn vẹn
**Khách xuất hiện → vào hàng/chọn bàn → gọi món → nhân vật tới nhận đơn → kiểm tra kho → tới quầy → thao tác pha chế → đặt ly lên khay → đi tới khách → giao món → khách phản hồi → thanh toán/tip → dọn bàn/dụng cụ → đơn tiếp theo.**
Trạng thái khách: `ARRIVING, QUEUING, ORDERING, WAITING, SERVED, PAYING, LEAVING, UPSET`.
Đơn gồm món, cỡ, nóng/lạnh, độ ngọt, sữa, thời gian chờ và sở thích. Sở thích cá nhân không được chấm thành “sai công thức”.
**Điểm đề xuất 100:** nguyên liệu/công thức 25, thao tác 30, chiết xuất/cân bằng 30, trình bày/phục vụ 15. Đây là **thang điểm game**, không phải tiêu chuẩn ngành.
Doanh thu = giá món + tip theo chất lượng/danh tiếng; trừ nguyên liệu, chi phí và lương. Không tự cộng tiền khi chưa giao món.
Nhân viên: thuê → đào tạo → phân công → tự động làm công thức đã học; đơn đặc biệt vẫn cho người chơi tự làm.

## 11. Kết nối nông trại, sơ chế, rang và tu luyện
- Cây: đất trống → gieo → sinh trưởng → chín → thu hoạch. Có tưới/chăm sóc, thời gian hợp lý.
- Lô quả thu hoạch mang ID, nguồn gốc, số lượng, chất lượng, thời điểm.
- Sơ chế: phân loại, tách vỏ/rửa hoặc phơi tự nhiên, sấy, cất hạt nhân.
- Rang: làm nóng, cho hạt, chỉnh nhiệt/gió, quan sát đường rang và tiếng nổ đầu, làm nguội; độ rang ảnh hưởng hương vị và chiết xuất.
- Kho dùng chung giữa các scene; giao dịch tiêu hao nguyên liệu phải chính xác, không nhân đôi.
- Tu luyện tăng trưởng cây, sức bền, khám phá, hoặc lợi ích có giới hạn; **không thay thế kỹ năng pha chế**.

## 12. Đồ họa, điều khiển và hiệu năng mobile
- Bản đồ isometric 2.5D: địa hình chia vùng, sprite vật thể, thứ tự lớp theo chân nhân vật, che khuất đúng, tái sử dụng object.
- Khi pha: camera chuyển sang **bàn pha cận cảnh** với dụng cụ đủ lớn để chạm, không bắt người chơi thao tác trên vật thể bé trong map.
- Dọc/ngang: bố cục riêng, tự điều chỉnh camera, hỗ trợ vùng an toàn, tránh thao tác trùng cuộn trang.
- Hỗ trợ mất chạm, hủy thao tác, giảm hiệu ứng, phụ đề, chất lượng đồ họa thích ứng.
- Asset tách riêng: môi trường, cây theo giai đoạn, nhà, nhân vật/animation, từng bộ phận dụng cụ, HUD 9-slice, VFX, âm thanh.
- Ảnh concept AI chỉ dùng để định hướng mỹ thuật, **không** dùng nguyên ảnh có HUD làm bản đồ tương tác.
- Đo FPS, bộ nhớ, thời gian tải và độ trễ chạm trên thiết bị thật trước khi chốt chỉ tiêu hiệu năng.

## 13. Kiến trúc code và dữ liệu
Các nhóm module:
- `scenes/`: Opening, ImmortalCouncil, Farm, Cafe, Town, WorldMap, Academy, BrewingStation, Processing, Roastery.
- `systems/`: Movement, Interaction, Farm, Inventory, Processing, Roast, BrewPhysics, Recipe, Customer, Economy, Quest, Cultivation, Save.
- `ui/`: SharedHUD, BrewHUD, RecipeCodex, OrderPanel, ResultsPanel, MobileLayout.
- `data/`: recipes, equipment, beans, customers, lessons, quests, regions.
- `assets/`: world, characters, stations, ui, audio.

Phiên pha phải lưu: `BrewSession {mode,recipeId,beanBatchId,equipment,settings,step,measurements,actions,errors,quality,startedAt,finishedAt}`.
Ghi log thao tác `{at,tool,gesture,amount,valid}` để chấm điểm, phát lại và kiểm thử. Logic tính toán tách khỏi DOM.
Save có phiên bản và migration từ localStorage hiện tại; không xóa tiến trình người chơi khi nâng cấp. Giao dịch phục vụ/tiêu nguyên liệu cần chống cộng/trừ trùng.

## 14. Lộ trình và tiêu chí nghiệm thu
| Mốc | Nội dung | Điều kiện đạt |
|---|---|---|
| P0 | Duyệt GDD, HUD ngang/dọc, storyboard Espresso + Phin | Thống nhất UI/cử chỉ trước khi code |
| P1 | Engine, di chuyển, tương tác, camera, save, HUD | Chơi được trên mobile |
| P2 | Trồng, thu hoạch, kho, sơ chế, rang | Tạo được hạt rang từ nông trại |
| P3 | **Espresso đầy đủ** | Cân → xay → phân phối → nén → lắp → chiết xuất → giao món bằng thao tác thật |
| P4 | **Phin đầy đủ** | Lắp phin → bloom → rót → nhỏ giọt → sữa/đá → giao món |
| P5 | Học viện, sổ công thức, 12 bài sâu | Học, luyện, ghi nhớ, đánh giá |
| P6 | Khách hàng, order, phục vụ, thanh toán | Hoàn thành ca kinh doanh thực |
| P7 | 24 công thức, sữa, latte art, các phương pháp | Mỗi phương pháp có minigame riêng |
| P8 | Trùng sinh, 5 tiên nhân, NPC, thị trấn, tu luyện | Cốt truyện và nhiệm vụ liền mạch |
| P9 | Thế giới, chi nhánh, nhân viên, kinh tế, endgame | Mở rộng thành đế chế |
| P10 | Art, animation, âm thanh, hiệu năng, QA | Chơi ổn định trên điện thoại thật |

**Checklist bắt buộc của một minigame:** có cử chỉ thực; dụng cụ chuyển động; số đo phản hồi tức thời; thao tác sai ảnh hưởng kết quả; giải thích lỗi; có thể sửa/thử lại; hỗ trợ chuột/chạm; ngang/dọc; cách điều khiển dễ hơn; lưu/khôi phục; giao dịch kho thật nếu có.
Không coi một tính năng là hoàn thành chỉ vì UI hiển thị hoặc ảnh giống concept.

## 15. Khoảng cách so với code hiện tại
- `Progression.ts` đang có 5 bước `grind/dose/tamp/extract/finish` dạng hướng dẫn; chưa có mô phỏng dụng cụ, cử chỉ, vật lý dòng chảy.
- `main.ts` còn gom nhiều logic và dùng asset minh họa tạm; chưa phải production artwork.
- Kim cương/thể lực và nhận thưởng nhiệm vụ có thể chưa kết nối kinh tế thực.
- Tài liệu phase cũ là ghi chú prototype; **GDD v2 là yêu cầu thiết kế mới, không phải báo cáo đã hoàn thành**.

## 16. Những quyết định cần duyệt
1. Chốt 24 màn S00–S23 và 15 overlay O01–O15.
2. Chốt 24 công thức, ưu tiên 12 bài đầu được thiết kế sâu.
3. Chốt bốn chế độ Học nghề / Luyện tập / Phục vụ / Sáng tạo.
4. Chốt Espresso + Phin là hai vertical slice tương tác bắt buộc.
5. Chấp nhận thang điểm chất lượng là mô hình gameplay gần đúng, không là kết quả kiểm định hương vị thật.
6. Duyệt wireframe ngang/dọc và storyboard dụng cụ trước khi viết code.

## 17. Bảng thuật ngữ Anh – Việt cho đội phát triển
| Thuật ngữ | Nghĩa tiếng Việt |
|---|---|
| Gameplay | Cách chơi và hệ thống tương tác |
| Game Design Document (GDD) | Tài liệu thiết kế game |
| HUD (Heads-Up Display) | Giao diện thông tin khi đang chơi |
| Scene | Cảnh / màn chơi |
| Overlay / Modal | Lớp giao diện / cửa sổ phủ |
| Isometric | Góc nhìn trục đo giả lập chiều sâu |
| Sprite / Sprite atlas | Ảnh đối tượng / bộ ảnh đối tượng |
| Mini-game | Trò chơi nhỏ theo một thao tác |
| Gesture | Cử chỉ chạm, kéo, vuốt, xoay |
| State machine | Máy trạng thái điều khiển luồng |
| Brewing | Pha chế / chiết xuất cà phê |
| Dose | Liều lượng bột cà phê |
| Yield | Khối lượng đồ uống thu được |
| Grind size | Độ mịn của bột xay |
| Tamp | Nén bột cà phê |
| WDT | Kỹ thuật dùng kim phân phối bột cà phê |
| Portafilter | Tay pha cà phê espresso |
| Grouphead | Đầu pha của máy espresso |
| Blooming | Làm nở bột cà phê bằng lượng nước đầu |
| Extraction | Chiết xuất |
| Channeling | Nước đi không đều qua bánh cà phê |
| Microfoam | Bọt sữa mịn |
| Latte art | Nghệ thuật rót tạo hình trên cà phê |
| Roast profile | Hồ sơ/đường cong rang |
| Inventory | Kho nguyên liệu / túi đồ |
| Customer patience | Mức kiên nhẫn của khách |
| Progression | Hệ thống tiến trình và mở khóa |
| Mastery | Mức độ thành thạo |
| Vertical slice | Bản chơi mẫu hoàn chỉnh của một lát cắt gameplay |
| Acceptance criteria | Tiêu chí nghiệm thu |
| Responsive / Adaptive | Giao diện thích ứng |
| Safe area | Vùng hiển thị an toàn trên thiết bị |
| Save migration | Chuyển đổi dữ liệu lưu giữa phiên bản |
| Idempotent | Thực hiện lặp không gây cộng/trừ trùng |
| Endgame | Nội dung giai đoạn cuối game |
