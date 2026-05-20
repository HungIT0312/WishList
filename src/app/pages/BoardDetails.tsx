import React, { useState, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router";
import {
  useWishlist,
  WishlistItem,
  Priority,
  Status,
} from "../store/WishlistContext";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
  Plus,
  ArrowLeft,
  Filter,
  SlidersHorizontal,
  Moon,
  Sun,
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { DraggableRow } from "../components/DraggableRow";
import { CATEGORIES, PRIORITIES, STATUSES } from "../constants";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../components/ui/Dialog";
import { Label } from "../components/ui/Label";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/Popover";
import { useTheme } from "next-themes";
import { Textarea } from "../components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@radix-ui/react-select";
import { Input } from "../components/ui/input";

export const BoardDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { boards, items, addItem, updateItem, deleteItem, reorderItems } =
    useWishlist();
  const { theme, setTheme } = useTheme();

  const board = boards.find((b) => b.id === id);
  const boardItems = useMemo(
    () =>
      items.filter((i) => i.boardId === id).sort((a, b) => a.order - b.order),
    [items, id],
  );

  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<WishlistItem | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    priority: "normal" as Priority,
    price: "",
    category: CATEGORIES[0].id,
    status: "todo" as Status,
  });

  const filteredItems = useMemo(() => {
    return boardItems.filter((item) => {
      if (filterPriority !== "all" && item.priority !== filterPriority)
        return false;
      if (filterCategory !== "all" && item.category !== filterCategory)
        return false;
      if (filterStatus !== "all" && item.status !== filterStatus) return false;
      return true;
    });
  }, [boardItems, filterPriority, filterCategory, filterStatus]);

  if (!board) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-8">
        <div className="text-center">
          <h2 className="text-xl mb-4 font-medium">Board not found</h2>
          <Button onClick={() => navigate("/")}>Go Home</Button>
        </div>
      </div>
    );
  }

  const handleMoveRow = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      if (
        filterPriority !== "all" ||
        filterCategory !== "all" ||
        filterStatus !== "all"
      ) {
        return;
      }
      reorderItems(board.id, dragIndex, hoverIndex);
    },
    [filterPriority, filterCategory, filterStatus, reorderItems, board.id],
  );

  const openForm = (item?: WishlistItem) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name,
        description: item.description,
        priority: item.priority,
        price: item.price.toString(),
        category: item.category,
        status: item.status,
      });
    } else {
      setEditingItem(null);
      setFormData({
        name: "",
        description: "",
        priority: "normal",
        price: "",
        category: CATEGORIES[0].id,
        status: "todo",
      });
    }
    setIsFormOpen(true);
  };

  const handleSave = () => {
    if (!formData.name) return;
    const price = parseFloat(formData.price) || 0;

    if (editingItem) {
      updateItem(editingItem.id, {
        ...formData,
        price,
        categoryColor:
          CATEGORIES.find((c) => c.id === formData.category)?.color || "#000",
      });
    } else {
      addItem({
        boardId: board.id,
        ...formData,
        price,
        categoryColor:
          CATEGORIES.find((c) => c.id === formData.category)?.color || "#000",
      });
    }
    setIsFormOpen(false);
  };

  const isFiltered =
    filterPriority !== "all" ||
    filterCategory !== "all" ||
    filterStatus !== "all";
  const filterCount =
    (filterPriority !== "all" ? 1 : 0) +
    (filterCategory !== "all" ? 1 : 0) +
    (filterStatus !== "all" ? 1 : 0);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-background text-foreground font-sans flex flex-col relative pb-24 transition-colors duration-200">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/")}
              className="h-8 w-8 text-muted-foreground"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center text-sm font-medium ml-1">
              <span className="mr-2 text-xl">{board.icon}</span>
              {board.name}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="h-8 w-8 rounded-full text-muted-foreground"
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto relative p-6 md:p-12 max-w-7xl mx-auto w-full">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
              <span className="text-5xl">{board.icon}</span>
              {board.name}
            </h1>
          </div>

          <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-border bg-muted/50 text-muted-foreground text-xs uppercase tracking-wider">
                  <th className="font-medium p-3 w-10"></th>
                  <th className="font-medium p-3">Name</th>
                  <th className="font-medium p-3">Description</th>
                  <th className="font-medium p-3">Priority</th>
                  <th className="font-medium p-3">Price</th>
                  <th className="font-medium p-3">Category</th>
                  <th className="font-medium p-3">Status</th>
                  <th className="font-medium p-3 w-14"></th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="p-12 text-center text-muted-foreground bg-card"
                    >
                      {boardItems.length === 0
                        ? "No items in this wishlist yet."
                        : "No items match your filters."}
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item, index) => (
                    <DraggableRow
                      key={item.id}
                      index={index}
                      item={item}
                      moveRow={handleMoveRow}
                      onEdit={openForm}
                      onDelete={deleteItem}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
          {isFiltered && (
            <p className="text-xs text-muted-foreground mt-4 flex items-center justify-center">
              Drag and drop is disabled while filters are active.
            </p>
          )}
        </main>

        {/* Floating Bottom Action Bar */}
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-background border border-border rounded-full shadow-lg p-1.5 flex items-center gap-1.5 transition-all">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={isFiltered ? "secondary" : "ghost"}
                className={`rounded-full h-10 px-4 transition-all ${isFiltered ? "bg-primary/10 text-primary hover:bg-primary/20" : ""}`}
              >
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Filter
                {filterCount > 0 && (
                  <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground font-medium">
                    {filterCount}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent side="top" align="center" className="w-80 mb-2 p-0">
              <div className="p-4 border-b border-border">
                <h3 className="font-semibold text-sm flex items-center">
                  <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
                  Filter Items
                </h3>
              </div>
              <div className="p-4 space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs uppercase text-muted-foreground font-semibold tracking-wider">
                    Priority
                  </Label>
                  <Select
                    value={filterPriority}
                    onValueChange={setFilterPriority}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Priorities" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priorities</SelectItem>
                      {PRIORITIES.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs uppercase text-muted-foreground font-semibold tracking-wider">
                    Category
                  </Label>
                  <Select
                    value={filterCategory}
                    onValueChange={setFilterCategory}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {CATEGORIES.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs uppercase text-muted-foreground font-semibold tracking-wider">
                    Status
                  </Label>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      {STATUSES.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {isFiltered && (
                <div className="p-3 border-t border-border bg-muted/30">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-muted-foreground hover:text-foreground"
                    onClick={() => {
                      setFilterPriority("all");
                      setFilterCategory("all");
                      setFilterStatus("all");
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </PopoverContent>
          </Popover>

          <div className="w-px h-6 bg-border mx-1" />

          <Button
            onClick={() => openForm()}
            className="rounded-full h-10 px-6 shadow-sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Item
          </Button>
        </div>

        {/* Item Form Modal */}
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? "Edit Item" : "New Item"}
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Item Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="MacBook Pro M3"
                  autoFocus
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="desc">Description</Label>
                <Textarea
                  id="desc"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Why do you want this?"
                  className="resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Priority</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(v) =>
                      setFormData({ ...formData, priority: v as Priority })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PRIORITIES.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="price">Estimated Price (VND)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    placeholder="30000000"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(v) =>
                      setFormData({ ...formData, category: v })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(v) =>
                      setFormData({ ...formData, status: v as Status })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUSES.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsFormOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={!formData.name}>
                {editingItem ? "Save Changes" : "Add Item"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DndProvider>
  );
};
