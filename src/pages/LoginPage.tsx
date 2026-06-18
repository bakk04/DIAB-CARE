import { useState } from "react";
import { motion } from "motion/react";
import {
  Activity, Mail, Lock, Eye, EyeOff, ArrowRight, Shield,
  CheckCircle, Brain, Heart, Stethoscope,
} from "lucide-react";
import { fadeUp, stagger } from "../components/ui";
import type { Page } from "../components/ui";

const features = [
  { icon: Brain, text: "AI-Powered Risk Assessment" },
  { icon: Shield, text: "HIPAA Compliant & Encrypted" },
  { icon: Heart, text: "Personalized Health Insights" },
  { icon: Stethoscope, text: "Trusted by 12,000+ Patients" },
];

export default function LoginPage({ navigate }: { navigate: (p: Page) => void }) {
  const [showPwd, setShowPwd] = useState(false);
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); navigate("profile"); }, 1200);
  };

  return (
    <div className="min-h-screen flex overflow-hidden">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-[48%] relative flex-col justify-between p-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-600" />
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 30% 50%, white 1px, transparent 1px)", backgroundSize: "32px 32px" }}
        />
        {/* Animated orbs */}
        {[
          { w: 300, h: 300, top: "-10%", left: "-10%", opacity: 0.15 },
          { w: 200, h: 200, bottom: "5%", right: "-5%", opacity: 0.1 },
          { w: 150, h: 150, top: "40%", right: "15%", opacity: 0.08 },
        ].map((orb, i) => (
          <motion.div
            key={i}
            animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
            transition={{ duration: 8 + i * 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute rounded-full bg-white"
            style={{ width: orb.w, height: orb.h, opacity: orb.opacity, ...orb }}
          />
        ))}

        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10"
        >
          <div className="flex items-center gap-3 mb-12">
            <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-xl text-white tracking-tight">DIAB<span className="text-cyan-300">-CARE</span></span>
              <div className="text-[9px] text-blue-200 font-bold uppercase tracking-[0.15em]">Medical AI Platform</div>
            </div>
          </div>

          <h1 className="text-4xl font-extrabold text-white leading-tight mb-4">
            Welcome Back
            <span className="block text-cyan-300">to DIAB-CARE</span>
          </h1>
          <p className="text-blue-100 leading-relaxed max-w-sm">
            Sign in to access your personalized health dashboard, review AI predictions, and track your diabetes risk over time.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="relative z-10 space-y-3"
        >
          {features.map((f, i) => (
            <motion.div
              key={f.text}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="flex items-center gap-3"
            >
              <div className="w-8 h-8 bg-white/15 rounded-xl flex items-center justify-center border border-white/20">
                <f.icon className="w-4 h-4 text-cyan-300" />
              </div>
              <span className="text-sm text-blue-100 font-medium">{f.text}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center bg-[#F8FAFC] px-4 sm:px-8 py-16">
        <motion.div
          initial="hidden"
          animate="show"
          variants={stagger(0.1)}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <motion.div variants={fadeUp} className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="font-extrabold text-xl text-slate-900">DIAB<span className="text-blue-600">-CARE</span></span>
          </motion.div>

          <motion.div variants={fadeUp} className="mb-8">
            <h2 className="text-3xl font-extrabold text-slate-900">Sign in</h2>
            <p className="text-slate-500 mt-1.5 text-sm">Access your health intelligence dashboard</p>
          </motion.div>

          {/* Google */}
          <motion.div variants={fadeUp}>
            <button className="w-full flex items-center justify-center gap-3 py-3.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm mb-5">
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </button>
          </motion.div>

          <motion.div variants={fadeUp} className="relative flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">or with email</span>
            <div className="flex-1 h-px bg-slate-200" />
          </motion.div>

          <motion.div variants={fadeUp} className="space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  placeholder="sarah.johnson@hospital.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-400 transition-all shadow-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Password</label>
                <button className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors">Forgot password?</button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPwd ? "text" : "password"}
                  placeholder="••••••••••"
                  value={pwd}
                  onChange={e => setPwd(e.target.value)}
                  className="w-full pl-10 pr-12 py-3.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-400 transition-all shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember */}
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded accent-blue-600" />
              <span className="text-sm text-slate-600">Remember me for 30 days</span>
            </label>

            {/* Submit */}
            <motion.button
              onClick={handleLogin}
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-2.5 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-xl shadow-[0_4px_20px_rgba(37,99,235,0.38)] transition-colors text-sm"
            >
              {loading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                  />
                  Signing in...
                </>
              ) : (
                <> Sign In <ArrowRight className="w-4 h-4" /> </>
              )}
            </motion.button>
          </motion.div>

          <motion.p variants={fadeUp} className="text-center text-slate-500 text-sm mt-6">
            {"Don't have an account? "}
            <button
              onClick={() => navigate("register")}
              className="text-blue-600 font-bold hover:text-blue-800 transition-colors"
            >
              Create account
            </button>
          </motion.p>

          <motion.div variants={fadeUp} className="mt-8 p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-3">
            <Shield className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
            <p className="text-xs text-slate-500 leading-relaxed">
              Your data is protected with AES-256 encryption and stored in HIPAA-compliant infrastructure. We never share your health information with third parties.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
