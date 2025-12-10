import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import MainPage from "./pages/MainPage";
import TestPage from "./pages/TestPage";
import RootLayout from "./layouts/RootLayout";
import DeployPage from "./pages/DeployPage";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/deploy" element={<DeployPage />} />
        <Route path="/login/oauth2/callback" element={<LoginPage />} />
        <Route element={<RootLayout />}>
          <Route path="/main" element={<MainPage />} />
          <Route path="/test" element={<TestPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
