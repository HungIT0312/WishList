import React, { createContext, useContext, useEffect, useState } from "react";

export type Priority = "high" | "normal" | "low";
export type Status = "done" | "in-progress" | "todo";

export interface WishlistItem {
  id: string;
  boardId: string;
  name: string;
  description: string;
  priority: Priority;
  price: number;
  category: string;
  categoryColor: string;
  status: Status;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface WishlistBoard {
  id: string;
  name: string;
  icon: string;
  createdAt: string;
  updatedAt: string;
}

interface State {
  boards: WishlistBoard[];
  items: WishlistItem[];
}

interface WishlistContextType extends State {
  addBoard: (board: Omit<WishlistBoard, "id" | "createdAt" | "updatedAt">) => void;
  updateBoard: (id: string, board: Partial<WishlistBoard>) => void;
  deleteBoard: (id: string) => void;
  addItem: (item: Omit<WishlistItem, "id" | "createdAt" | "updatedAt" | "order">) => void;
  updateItem: (id: string, item: Partial<WishlistItem>) => void;
  deleteItem: (id: string) => void;
  reorderItems: (boardId: string, startIndex: number, endIndex: number) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = "wishlist_manager_data";

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [boards, setBoards] = useState<WishlistBoard[]>([]);
  const [items, setItems] = useState<WishlistItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setBoards(parsed.boards || []);
        setItems(parsed.items || []);
      } catch (e) {
        console.error("Failed to parse local storage data", e);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ boards, items }));
    }
  }, [boards, items, isLoaded]);

  const addBoard = (board: Omit<WishlistBoard, "id" | "createdAt" | "updatedAt">) => {
    const newBoard: WishlistBoard = {
      ...board,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setBoards((prev) => [...prev, newBoard]);
  };

  const updateBoard = (id: string, board: Partial<WishlistBoard>) => {
    setBoards((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...board, updatedAt: new Date().toISOString() } : b))
    );
  };

  const deleteBoard = (id: string) => {
    setBoards((prev) => prev.filter((b) => b.id !== id));
    setItems((prev) => prev.filter((i) => i.boardId !== id));
  };

  const addItem = (item: Omit<WishlistItem, "id" | "createdAt" | "updatedAt" | "order">) => {
    setItems((prev) => {
      const boardItems = prev.filter((i) => i.boardId === item.boardId);
      const maxOrder = boardItems.length > 0 ? Math.max(...boardItems.map((i) => i.order)) : -1;
      const newItem: WishlistItem = {
        ...item,
        id: crypto.randomUUID(),
        order: maxOrder + 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return [...prev, newItem];
    });
  };

  const updateItem = (id: string, item: Partial<WishlistItem>) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, ...item, updatedAt: new Date().toISOString() } : i))
    );
  };

  const deleteItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const reorderItems = (boardId: string, sourceIndex: number, destinationIndex: number) => {
    setItems((prev) => {
      const allOtherItems = prev.filter((i) => i.boardId !== boardId);
      const boardItems = prev.filter((i) => i.boardId === boardId).sort((a, b) => a.order - b.order);
      
      const [removed] = boardItems.splice(sourceIndex, 1);
      boardItems.splice(destinationIndex, 0, removed);
      
      const reorderedBoardItems = boardItems.map((item, index) => ({
        ...item,
        order: index,
        updatedAt: new Date().toISOString(),
      }));

      return [...allOtherItems, ...reorderedBoardItems];
    });
  };

  if (!isLoaded) {
    return null; // Or a loading spinner
  }

  return (
    <WishlistContext.Provider
      value={{ boards, items, addBoard, updateBoard, deleteBoard, addItem, updateItem, deleteItem, reorderItems }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};
