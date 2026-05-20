# Wishlist Manager

## Mục tiêu dự án

Wishlist Manager là ứng dụng local/web dùng để tạo, quản lý và theo dõi các danh sách wishlist trong tương lai. Người dùng có thể:

- Tạo nhiều bảng wishlist khác nhau (ví dụ: "Đồ công nghệ", "Sức khỏe", "Học hành").
- Xem danh sách các bảng wishlist ở trang chính.
- Vào trang chi tiết từng wishlist để quản lý các item.
- Thêm, sửa, xóa item trong wishlist.
- Lọc item theo ưu tiên, khoảng giá, phân loại và trạng thái.
- Kéo thả thay đổi thứ tự item trong wishlist.

## Công nghệ đề xuất

- Next.js
- React
- TypeScript
- shadcn/ui
- Tailwind CSS
- Lucide Icons (hoặc Heroicons)
- Zustand / React Context / Redux Toolkit (tùy chọn) cho state local
- LocalStorage hoặc SQLite cho lưu trữ local

## Thiết kế giao diện

Dự án lấy cảm hứng từ Notion UI/Notion design với:

- layout tối giản, nhiều khoảng trắng
- typography đơn giản, rõ ràng
- bảng và thẻ icon có viền bo tròn nhẹ
- màu sắc trung tính, nhấn bằng các màu pastel cho phân loại và status
- popup modal tạo item với form rõ ràng và hành vi thân thiện

## Luồng chính người dùng

1. Mở app, vào trang chính `Wishlist Boards`.
2. Xem các bảng wishlist hiện có.
3. Nhấn `Tạo bảng wishlist` để tạo mới bằng `Tên` và `Icon`.
4. Click vào 1 bảng để vào trang chi tiết.
5. Ở trang chi tiết:
   - Xem tiêu đề wishlist.
   - Thêm item mới bằng nút `Add` ở góc trái.
   - Sửa, xóa item.
   - Duyệt bảng item với cột: Tên, Mô tả, Ưu tiên, Giá thành, Phân loại, Status, Option.
   - Lọc item theo `Ưu tiên`, `Khoảng giá`, `Phân loại`, `Status`.
   - Kéo thả item để thay đổi thứ tự.

## Nội dung trang chính

- Header: tên app, mô tả ngắn.
- Danh sách bảng wishlist hiện có theo layout cards.
- Mỗi card chứa:
  - Icon
  - Tên bảng
  - Số item
  - Ngày tạo / cập nhật cuối.
- Nút `Tạo bảng wishlist` ở trên cùng.
- Modal / side panel để thêm bảng mới.

## Nội dung trang chi tiết wishlist

- Header chung với:
  - Tiêu đề wishlist
  - Nút `Add Item`
  - Nút `Filter`
- Bảng item gồm các cột:
  - Tên
  - Mô tả
  - Mức độ ưu tiên (Cao / Normal / Thấp) với icon tương ứng.
  - Giá thành (estimated price).
  - Phân loại (category) với chấm màu trước tên.
  - Status (Đã / Đang / Chưa).
  - Option: `Sửa`, `Xóa`.
  - Option đóng góp chức năng drag-drop 6 nút sắp xếp.
- Filter panel hiển thị khi click `Filter`, gồm:
  - Ưu tiên (checkbox/radio)
  - Khoảng giá (min/max)
  - Phân loại (multi-select)
  - Status (multi-select)

## Data model

```ts
interface WishlistBoard {
  id: string;
  name: string;
  icon: string;
  createdAt: string;
  updatedAt: string;
  items: WishlistItem[];
}

interface WishlistItem {
  id: string;
  boardId: string;
  name: string;
  description: string;
  priority: "high" | "normal" | "low";
  price: number;
  category: string;
  categoryColor: string;
  status: "done" | "in-progress" | "todo";
  order: number;
  createdAt: string;
  updatedAt: string;
}
```

### Các phân loại đề xuất

- Quần áo
- Đồ công nghệ
- Sức khỏe
- Đồ nội thất
- Học hành
- Gia đình
- Du lịch
- Giải trí

## Hướng dẫn triển khai nhanh

1. `npx create-next-app@latest wishlist-manager --ts --tailwind`
2. Cài shadcn/ui và cấu hình `tailwind.config.ts`.
3. Tạo các component cơ bản:
   - `WishlistBoardCard`
   - `WishlistBoardList`
   - `WishlistItemTable`
   - `WishlistItemFormModal`
   - `FilterPanel`
   - `PriorityBadge`, `CategoryBadge`, `StatusBadge`
4. Xây trang:
   - `/` — trang danh sách bảng wishlist
   - `/boards/[id]` — trang chi tiết wishlist
5. Lưu dữ liệu local bằng LocalStorage hoặc dịch vụ nhỏ.

## Tài liệu sử dụng

1. Mở app tại `http://localhost:3000`.
2. Tạo bảng mới qua nút `Tạo bảng wishlist`.
3. Click vào bảng để quản lý item.
4. Nhấn `Add Item` để mở popup form.
5. Chọn filter để lọc item theo điều kiện.
6. Kéo thả để sắp xếp các item theo thứ tự mong muốn.

## Gợi ý mở rộng

- Thêm tính năng export/import JSON.
- Thêm xác thực form cho giá và tên.
- Thêm theme sáng/tối.
- Đồng bộ với API hoặc SQLite cho bản local desktop.
# System Design - Wishlist Manager

## 1. Mục tiêu hệ thống

Wishlist Manager là một ứng dụng local/web đơn giản, tối ưu cho người dùng muốn quản lý các danh sách mong muốn trong tương lai. Hệ thống cần:

- hoạt động offline/local
- có UI trực quan, giống Notion
- dễ mở và chạy trên máy cá nhân
- hỗ trợ tạo/xem/sửa/xóa wishlist và item
- hỗ trợ lọc và sắp xếp item tiện lợi

## 2. Kiến trúc tổng quan

Ứng dụng được xây dựng theo kiến trúc client-side React + Next.js với dữ liệu lưu local.

### Thành phần chính

- `Pages`:
  - `/` : Trang danh sách bảng wishlist
  - `/boards/[id]` : Trang chi tiết wishlist
- `Components`:
  - `BoardCard`, `BoardList`
  - `ItemTable`, `ItemRow`
  - `ModalForm`, `FilterDrawer`
  - `Badge` (Priority / Category / Status)
- `State`:
  - Local component state + global state quản lý danh sách.
  - Lưu trữ tạm thời trong `localStorage`.
- `Storage`:
  - LocalStorage hoặc backend nhỏ nếu nâng cấp.

### Data flow

1. Người dùng tương tác UI.
2. UI cập nhật state của board/item.
3. State lưu vào localStorage.
4. Khi load app, data được khởi tạo từ localStorage.

## 3. Thành phần UI & Luồng người dùng

### Trang chính - Boards

- Header: tên app và mô tả.
- Danh sách các wishlist board.
- Card board có icon + tên + thông tin phụ.
- Nút `Tạo bảng wishlist` mở modal tạo mới.
- Hành vi click vào card đi tới trang chi tiết.

### Trang chi tiết board

- Header chứa tiêu đề board và thao tác `Add Item`.
- Panel filter ở góc phải.
- Bảng items hiển thị các cột: name, description, priority, price, category, status, action.
- Mỗi item hiển thị:
  - priority: icon màu
  - category: label có chấm màu
  - status: badge
  - actions: `edit`, `delete`, `drag handle`
- Popup thêm item gồm form input và nút `Confirm`/`Cancel`.

## 4. Data model chi tiết

### WishlistBoard

- `id: string`
- `name: string`
- `icon: string`
- `createdAt: string`
- `updatedAt: string`
- `items: WishlistItem[]`

### WishlistItem

- `id: string`
- `boardId: string`
- `name: string`
- `description: string`
- `priority: 'high' | 'normal' | 'low'`
- `price: number`
- `category: string`
- `categoryColor: string`
- `status: 'done' | 'in-progress' | 'todo'`
- `order: number`
- `createdAt: string`
- `updatedAt: string`

## 5. Thiết kế giao diện (UI)

### Lấy cảm hứng Notion

- Background trắng/kem nhẹ.
- Bảng có header đậm, row có hover.
- Khoảng cách thoáng, nhiều padding.
- Font hệ thống, tối giản.
- Dùng `shadcn/ui` cho các component:
  - Button
  - Input
  - Select
  - Badge
  - Dialog
  - Table

### Màu sắc đề xuất

- Primary: `slate-900` / `zinc-900`
- Secondary: `slate-600`
- Accent: `indigo-600`, `emerald-600`.
- Category dots: pastel `blue`, `green`, `amber`, `rose`, `violet`.
- Priority icons:
  - cao: `arrow-up` đỏ
  - normal: `minus` vàng
  - thấp: `arrow-down` xanh

### Layout

- Trang chính: lưới card 2-3 cột trên desktop, 1 cột trên mobile.
- Trang chi tiết: header + panel filter + bảng.
- Modal form xuất hiện chính giữa.

## 6. UX chi tiết

### Tạo bảng wishlist

- Mở modal
- Nhập tên và chọn icon
- Nút confirm tạo bảng
- Sau khi tạo, card mới xuất hiện và có thể click vào.

### Thêm item mới

- Click `Add Item`
- Modal form với:
  - Tên item
  - Mô tả
  - Ưu tiên
  - Giá ước lượng
  - Phân loại
  - Trạng thái
- Validate tối thiểu tên và giá.
- Xác nhận đóng modal và thêm item vào bảng.

### Filter

- Filter mở thanh bên hoặc popup nhỏ.
- Chọn ưu tiên, range giá, phân loại, trạng thái.
- Áp dụng ngay khi thay đổi.
- Có nút `Clear` để bỏ filter.

### Kéo thả sắp xếp

- Mỗi row item có handle drag.
- Dùng thư viện như `@dnd-kit/core` hoặc `react-beautiful-dnd`.
- Cập nhật `order` trong state.

## 7. Kiến trúc mở rộng

### Phiên bản local hiện tại

- Dữ liệu lưu trong LocalStorage.
- Không cần authentication.
- Tập trung vào UI/UX và thao tác offline.

### Mở rộng trong tương lai

- Thêm backend API + database (PostgreSQL/SQLite).
- Authentication nếu muốn nhiều người dùng.
- Đồng bộ cloud (Google Drive / OneDrive).
- Export/Import file JSON.
- Thêm multi-board sharing.

## 8. Lộ trình phát triển

1. Khởi tạo Next.js + Tailwind + shadcn.
2. Xây layout trang chính và danh sách board.
3. Tạo modal thêm board.
4. Xây trang chi tiết board và bảng items.
5. Thêm modal thêm item và edit item.
6. Thêm filter.
7. Thêm hành vi drag-drop.
8. Lưu dữ liệu vào localStorage.
9. Hoàn thiện kiểu dáng Notion-like.

## 9. Ghi chú kỹ thuật

- `BoardId` và `ItemId` dùng UUID.
- `order` dùng số nguyên để giúp sắp xếp.
- `categoryColor` có thể lấy từ map tĩnh.
- `status` nên mapping sang label hiển thị:
  - `todo` => Chưa
  - `in-progress` => Đang
  - `done` => Đã

## 10. Chuẩn bị code

File đề xuất trong dự án:

- `/app/page.tsx` hoặc `/pages/index.tsx`
- `/app/boards/[id]/page.tsx` hoặc `/pages/boards/[id].tsx`
- `/src/components/BoardCard.tsx`
- `/src/components/BoardList.tsx`
- `/src/components/WishlistItemTable.tsx`
- `/src/components/ItemFormModal.tsx`
- `/src/components/FilterPanel.tsx`
- `/src/lib/storage.ts`
- `/src/lib/data.ts`

---

Đây là hồ sơ thiết kế đầy đủ giúp bạn và team hiểu rõ luồng, kiến trúc và UI/UX trước khi code app wishlist local/web theo phong cách Next.js + shadcn + Notion.