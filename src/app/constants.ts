import { Priority, Status } from "./store/WishlistContext";

export const CATEGORIES = [
  { id: "clothing", label: "Quần áo", color: "#60A5FA" },      // blue-400
  { id: "tech", label: "Đồ công nghệ", color: "#A78BFA" },   // violet-400
  { id: "health", label: "Sức khỏe", color: "#34D399" },     // emerald-400
  { id: "furniture", label: "Đồ nội thất", color: "#FBBF24" }, // amber-400
  { id: "education", label: "Học hành", color: "#F472B6" },  // pink-400
  { id: "family", label: "Gia đình", color: "#F87171" },     // red-400
  { id: "travel", label: "Du lịch", color: "#38BDF8" },      // sky-400
  { id: "entertainment", label: "Giải trí", color: "#FB923C" } // orange-400
];

export const PRIORITIES: { id: Priority; label: string; color: string; icon: string }[] = [
  { id: "high", label: "Cao", color: "#EF4444", icon: "↑" },
  { id: "normal", label: "Bình thường", color: "#F59E0B", icon: "−" },
  { id: "low", label: "Thấp", color: "#3B82F6", icon: "↓" }
];

export const STATUSES: { id: Status; label: string; color: string }[] = [
  { id: "todo", label: "Chưa mua", color: "#9CA3AF" },
  { id: "in-progress", label: "Đang mua", color: "#3B82F6" },
  { id: "done", label: "Đã mua", color: "#10B981" }
];
