
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import App from "@/App";

import ProductsPage from "@/pages/products";
import CheckoutPage from "@/pages/checkout";
import CartPage from "@/pages/cart";
import HistoryPage from "@/pages/history";
import HistoryDetailPage from "@/pages/historyDetail";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<App />}>
          <Route index element={<Navigate to="/products" replace />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="history" element={<HistoryPage />} />
          <Route path="history/:id" element={<HistoryDetailPage />} />
          <Route path="*" element={<Navigate to="/products" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}