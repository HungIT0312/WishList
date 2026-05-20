import React, { useState } from "react";
import { useWishlist } from "../store/WishlistContext";
import { useNavigate } from "react-router";
import { Plus, LayoutGrid, Trash, Calendar, Moon, Sun } from "lucide-react";

import { Label } from "../components/ui/Label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../components/ui/Dialog";
import { format } from "date-fns";
import { useTheme } from "next-themes";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/Button";

const ICONS = ["📦", "💻", "❤️", "🏠", "🎓", "👨‍👩‍👧", "✈️", "🎮", "🛒", "🚗"];

export const Home = () => {
  const { boards, addBoard, deleteBoard } = useWishlist();
  const navigate = useNavigate();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newBoardName, setNewBoardName] = useState("");
  const [newBoardIcon, setNewBoardIcon] = useState(ICONS[0]);
  const { theme, setTheme } = useTheme();

  const handleCreateBoard = () => {
    if (!newBoardName.trim()) return;
    addBoard({ name: newBoardName, icon: newBoardIcon });
    setNewBoardName("");
    setNewBoardIcon(ICONS[0]);
    setIsAddOpen(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans transition-colors duration-200">
      <header className="px-6 py-8 md:px-12 md:py-12 max-w-5xl mx-auto flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-2">
            <span>✨</span> Wishlist Boards
          </h1>
          <p className="text-muted-foreground text-lg">
            Manage your future desires in one place.
          </p>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="rounded-full"
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </header>

      <main className="px-6 pb-12 md:px-12 max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center text-sm font-medium text-muted-foreground">
            <LayoutGrid className="w-4 h-4 mr-2" />
            All Boards
          </div>
          <Button
            onClick={() => setIsAddOpen(true)}
            className="h-9 shadow-sm rounded-md"
          >
            <Plus className="w-4 h-4 mr-1" />
            New Board
          </Button>
        </div>

        {boards.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 border border-dashed border-border rounded-lg bg-card text-card-foreground">
            <div className="text-4xl mb-4">📭</div>
            <h3 className="text-lg font-medium mb-1">No wishlists yet</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Create a board to start tracking your wishlist items.
            </p>
            <Button
              onClick={() => setIsAddOpen(true)}
              variant="outline"
              size="sm"
            >
              Create your first board
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {boards.map((board) => (
              <div
                key={board.id}
                className="group relative bg-card text-card-foreground border border-border rounded-lg p-5 cursor-pointer hover:shadow-md transition-all flex flex-col h-32"
                onClick={() => navigate(`/boards/${board.id}`)}
              >
                <div className="flex justify-between items-start mb-auto">
                  <div className="text-3xl bg-muted w-12 h-12 rounded flex items-center justify-center">
                    {board.icon}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (
                        window.confirm(
                          "Are you sure you want to delete this board?",
                        )
                      ) {
                        deleteBoard(board.id);
                      }
                    }}
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                </div>
                <div>
                  <h3 className="font-semibold text-base truncate">
                    {board.name}
                  </h3>
                  <div className="flex items-center text-xs text-muted-foreground mt-1 gap-3">
                    <span className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {format(new Date(board.createdAt), "MMM d, yyyy")}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create Wishlist Board</DialogTitle>
          </DialogHeader>
          <div className="grid gap-5 py-4">
            <div className="grid gap-2">
              <Label
                htmlFor="name"
                className="text-xs uppercase tracking-wider text-muted-foreground"
              >
                Board Name
              </Label>
              <Input
                id="name"
                value={newBoardName}
                onChange={(e) => setNewBoardName(e.target.value)}
                placeholder="e.g. Tech Gadgets"
                autoFocus
              />
            </div>
            <div className="grid gap-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                Choose Icon
              </Label>
              <div className="flex flex-wrap gap-2">
                {ICONS.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setNewBoardIcon(icon)}
                    className={`w-10 h-10 flex items-center justify-center text-xl rounded transition-colors ${
                      newBoardIcon === icon
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted hover:bg-accent"
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateBoard}>Create Board</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
