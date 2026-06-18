import { useState } from "react";
import Navbar from "../components/Navbar";
import HomePage from "../pages/HomePage";
import AboutPage from "../pages/AboutPage";
import ContactPage from "../pages/ContactPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ProfilePage from "../pages/ProfilePage";
import TestPage from "../pages/TestPage";
import AdminPage from "../pages/AdminPage";
import type { Page } from "../components/ui";

const HIDE_NAVBAR: Page[] = ["login", "register", "admin"];

export default function App() {
  const [page, setPage] = useState<Page>("home");
  const showNav = !HIDE_NAVBAR.includes(page);

  return (
    <div className="min-h-screen bg-background font-[Inter,sans-serif]">
      <style>{`
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 99px; }
        ::-webkit-scrollbar-thumb:hover { background: #94A3B8; }
        html { scroll-behavior: smooth; }
      `}</style>

      {showNav && <Navbar current={page} navigate={setPage} />}

      {page === "home" && <HomePage navigate={setPage} />}
      {page === "about" && <AboutPage navigate={setPage} />}
      {page === "contact" && <ContactPage />}
      {page === "login" && <LoginPage navigate={setPage} />}
      {page === "register" && <RegisterPage navigate={setPage} />}
      {page === "profile" && <ProfilePage navigate={setPage} />}
      {page === "test" && <TestPage />}
      {page === "admin" && <AdminPage />}
    </div>
  );
}
