import React from "react";
import { createBrowserRouter, Outlet } from "react-router";
import { Home } from "./pages/Home";
import { BoardDetails } from "./pages/BoardDetails";
import { WishlistProvider } from "./store/WishlistContext";

const Root = () => {
  return (
    <WishlistProvider>
      <Outlet />
    </WishlistProvider>
  );
};

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "boards/:id", Component: BoardDetails },
    ],
  },
]);
