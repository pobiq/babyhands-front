import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import MainPage from "./pages/MainPage";
import RootLayout from "./layouts/RootLayout";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<RootLayout />}>
          <Route path="/main" element={<MainPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
