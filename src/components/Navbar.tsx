import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Activity,
  Menu,
  X,
  UserCircle,
  LayoutDashboard,
  FlaskConical,
  ChevronDown,
  Bell,
  LogIn,
} from "lucide-react";
import type { Page } from "./ui";

interface Props {
  current: Page;
  navigate: (p: Page) => void;
}

const links: { label: string; page: Page }[] = [
  { label: "Home", page: "home" },
  { label: "About", page: "about" },
  { label: "Diabetes Test", page: "test" },
  { label: "Contact", page: "contact" },
];

export default function Navbar({ current, navigate }: Props) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-xl shadow-[0_2px_24px_rgba(37,99,235,0.10)] border-b border-blue-100/60"
            : "bg-white/70 backdrop-blur-md border-b border-white/40"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-[70px] flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => navigate("home")}
            className="flex items-center gap-3 group"
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-[0_4px_14px_rgba(37,99,235,0.4)] group-hover:shadow-[0_6px_20px_rgba(37,99,235,0.5)] transition-shadow">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-400 rounded-full border-2 border-white" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight text-slate-900 leading-none">
                DIAB<span className="text-blue-600">-CARE</span>
              </span>
              <div className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.15em] leading-none mt-0.5">
                Medical AI Platform
              </div>
            </div>
          </button>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-1">
            {links.map((l) => (
              <button
                key={l.page}
                onClick={() => navigate(l.page)}
                className={`relative px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  current === l.page
                    ? "text-blue-700"
                    : "text-slate-600 hover:text-blue-700 hover:bg-blue-50/70"
                }`}
              >
                {l.label}
                {current === l.page && (
                  <motion.span
                    layoutId="nav-indicator"
                    className="absolute bottom-0 left-3 right-3 h-0.5 bg-blue-600 rounded-full"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="hidden lg:flex items-center gap-2">
            <button
              onClick={() => navigate("profile")}
              className="p-2.5 rounded-xl text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 relative"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full" />
            </button>
            <button
              onClick={() => navigate("login")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:text-blue-700 hover:bg-blue-50 transition-all"
            >
              <LogIn className="w-4 h-4" /> Sign In
            </button>
            <button
              onClick={() => navigate("profile")}
              className="p-2 rounded-xl hover:bg-blue-50 transition-all"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white text-xs font-extrabold shadow-md">
                SJ
              </div>
            </button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("test")}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl text-sm shadow-[0_4px_14px_rgba(37,99,235,0.35)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.45)] transition-shadow"
            >
              <FlaskConical className="w-4 h-4" /> Start Free Test
            </motion.button>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden p-2.5 rounded-xl text-slate-600 hover:bg-blue-50 transition-all"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="lg:hidden bg-white border-t border-blue-100 overflow-hidden"
            >
              <div className="px-4 py-4 space-y-1">
                {links.map((l) => (
                  <button
                    key={l.page}
                    onClick={() => { navigate(l.page); setOpen(false); }}
                    className={`block w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                      current === l.page
                        ? "bg-blue-50 text-blue-700"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button
                    onClick={() => { navigate("login"); setOpen(false); }}
                    className="py-3 border-2 border-blue-200 rounded-xl text-sm text-blue-700 font-bold hover:bg-blue-50 transition-all"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => { navigate("test"); setOpen(false); }}
                    className="py-3 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl text-sm text-white font-bold shadow-md"
                  >
                    Free Test
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
}
