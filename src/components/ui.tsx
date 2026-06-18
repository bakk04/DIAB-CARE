import { motion } from "motion/react";

export type Page =
  | "home"
  | "about"
  | "contact"
  | "login"
  | "register"
  | "profile"
  | "test"
  | "admin";

/* ─── Animation Variants ─── */
export const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};
export const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.5 } },
};
export const stagger = (delay = 0.08) => ({
  hidden: {},
  show: { transition: { staggerChildren: delay } },
});

/* ─── Glass Card ─── */
export const GlassCard = ({
  children,
  className = "",
  hover = true,
}: {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}) => (
  <motion.div
    whileHover={hover ? { y: -3, boxShadow: "0 20px 50px rgba(37,99,235,0.12)" } : undefined}
    transition={{ duration: 0.25 }}
    className={`bg-white/90 backdrop-blur-xl border border-white/70 shadow-[0_4px_24px_rgba(37,99,235,0.07)] rounded-2xl ${className}`}
  >
    {children}
  </motion.div>
);

/* ─── Badge ─── */
export const Badge = ({
  children,
  color = "blue",
  size = "sm",
}: {
  children: React.ReactNode;
  color?: string;
  size?: "sm" | "md";
}) => {
  const colors: Record<string, string> = {
    blue: "bg-blue-100 text-blue-700 border-blue-200",
    cyan: "bg-cyan-100 text-cyan-700 border-cyan-200",
    green: "bg-emerald-100 text-emerald-700 border-emerald-200",
    red: "bg-red-100 text-red-700 border-red-200",
    yellow: "bg-amber-100 text-amber-700 border-amber-200",
    purple: "bg-violet-100 text-violet-700 border-violet-200",
    gray: "bg-slate-100 text-slate-600 border-slate-200",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 border font-semibold rounded-full ${size === "sm" ? "px-3 py-1 text-xs" : "px-4 py-1.5 text-sm"} ${colors[color] || colors.blue}`}
    >
      {children}
    </span>
  );
};

/* ─── Section Label ─── */
export const SectionLabel = ({
  children,
  color = "blue",
}: {
  children: React.ReactNode;
  color?: string;
}) => {
  const dot: Record<string, string> = {
    blue: "bg-blue-500",
    cyan: "bg-cyan-500",
    green: "bg-emerald-500",
  };
  return (
    <div className="inline-flex items-center gap-2">
      <span className={`w-1.5 h-1.5 rounded-full ${dot[color] || dot.blue}`} />
      <span className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
        {children}
      </span>
    </div>
  );
};

/* ─── Primary Button ─── */
export const PrimaryBtn = ({
  children,
  onClick,
  className = "",
  type = "button",
  disabled = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
}) => (
  <motion.button
    type={type}
    onClick={onClick}
    disabled={disabled}
    whileHover={{ scale: disabled ? 1 : 1.025 }}
    whileTap={{ scale: disabled ? 1 : 0.97 }}
    className={`inline-flex items-center justify-center gap-2.5 px-7 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl shadow-[0_4px_20px_rgba(37,99,235,0.38)] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm ${className}`}
  >
    {children}
  </motion.button>
);

/* ─── Secondary Button ─── */
export const SecondaryBtn = ({
  children,
  onClick,
  className = "",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) => (
  <motion.button
    onClick={onClick}
    whileHover={{ scale: 1.025 }}
    whileTap={{ scale: 0.97 }}
    className={`inline-flex items-center justify-center gap-2.5 px-7 py-3.5 bg-white border-2 border-blue-200 hover:border-blue-400 text-blue-700 font-semibold rounded-xl hover:bg-blue-50 transition-all duration-200 text-sm ${className}`}
  >
    {children}
  </motion.button>
);

/* ─── Ghost Button ─── */
export const GhostBtn = ({
  children,
  onClick,
  className = "",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) => (
  <motion.button
    onClick={onClick}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className={`inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-700 transition-colors ${className}`}
  >
    {children}
  </motion.button>
);

/* ─── Input Field ─── */
export const InputField = ({
  label,
  type = "text",
  placeholder = "",
  icon: Icon,
  value,
  onChange,
  readOnly,
  className = "",
}: {
  label?: string;
  type?: string;
  placeholder?: string;
  icon?: React.ComponentType<{ className?: string }>;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  readOnly?: boolean;
  className?: string;
}) => (
  <div className={`space-y-1.5 ${className}`}>
    {label && (
      <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">
        {label}
      </label>
    )}
    <div className="relative">
      {Icon && (
        <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        className={`w-full ${Icon ? "pl-10" : "pl-4"} pr-4 py-3 bg-slate-50/80 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-400 transition-all duration-200 ${readOnly ? "cursor-not-allowed bg-blue-50 text-blue-700 font-bold border-blue-200" : ""}`}
      />
    </div>
  </div>
);

/* ─── Select Field ─── */
export const SelectField = ({
  label,
  options,
  value,
  onChange,
}: {
  label?: string;
  options: string[];
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}) => (
  <div className="space-y-1.5">
    {label && (
      <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">
        {label}
      </label>
    )}
    <select
      value={value}
      onChange={onChange}
      className="w-full px-4 py-3 bg-slate-50/80 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-400 transition-all duration-200 appearance-none cursor-pointer"
    >
      {options.map((o) => (
        <option key={o}>{o}</option>
      ))}
    </select>
  </div>
);

/* ─── Stat Card ─── */
export const StatCard = ({
  icon: Icon,
  label,
  value,
  sub,
  gradient,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  sub?: string;
  gradient: string;
}) => (
  <GlassCard className="p-5">
    <div
      className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-4 shadow-md`}
    >
      <Icon className="w-5 h-5 text-white" />
    </div>
    <div className="text-2xl font-extrabold text-slate-900 tracking-tight">{value}</div>
    <div className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-wide">{label}</div>
    {sub && <div className="text-xs text-slate-400 mt-0.5">{sub}</div>}
  </GlassCard>
);

/* ─── Page Wrapper with animation ─── */
export const PageWrapper = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

/* ─── Divider ─── */
export const Divider = ({ className = "" }: { className?: string }) => (
  <div className={`h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent ${className}`} />
);
