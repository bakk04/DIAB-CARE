import { useState, useEffect } from "react";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import {
  ArrowRight, Brain, Shield, Zap, Target, Activity,
  Droplets, Heart, TrendingUp, Network, Database,
  ScanLine, Cpu, ChevronRight, CheckCircle, Star,
  Users, Award, Stethoscope, FlaskConical,
} from "lucide-react";
import {
  AreaChart, Area, ResponsiveContainer, Tooltip, CartesianGrid, XAxis, YAxis,
} from "recharts";
import {
  GlassCard, PrimaryBtn, SecondaryBtn, Badge, SectionLabel, fadeUp, stagger, PageWrapper,
} from "../components/ui";
import type { Page } from "../components/ui";

/* ─── Animated counter ─── */
function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = to / 60;
    const timer = setInterval(() => {
      start += step;
      if (start >= to) { setCount(to); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, to]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

/* ─── Floating medical particle ─── */
function Particle({ x, y, size, delay }: { x: string; y: string; size: number; delay: number }) {
  return (
    <motion.div
      className="absolute rounded-full bg-blue-400/10 border border-blue-300/20"
      style={{ left: x, top: y, width: size, height: size }}
      animate={{ y: [0, -18, 0], opacity: [0.4, 0.8, 0.4] }}
      transition={{ duration: 4 + delay, repeat: Infinity, ease: "easeInOut", delay }}
    />
  );
}

const bloodData = [
  { date: "Jan", glucose: 95, risk: 12 },
  { date: "Feb", glucose: 102, risk: 15 },
  { date: "Mar", glucose: 98, risk: 13 },
  { date: "Apr", glucose: 115, risk: 22 },
  { date: "May", glucose: 108, risk: 18 },
  { date: "Jun", glucose: 99, risk: 14 },
];

const features = [
  { icon: Brain, title: "AI-Powered Detection", desc: "Deep neural networks trained on 100,000+ clinical records deliver unparalleled diagnostic precision.", color: "from-blue-500 to-blue-700", shadow: "shadow-blue-200" },
  { icon: Target, title: "95%+ Accuracy", desc: "Rigorously validated against leading clinical benchmarks with continuous model retraining.", color: "from-cyan-500 to-cyan-600", shadow: "shadow-cyan-200" },
  { icon: Zap, title: "Instant Results", desc: "Advanced inference engine processes 8 biomarkers and delivers your risk score in under 2 minutes.", color: "from-violet-500 to-violet-700", shadow: "shadow-violet-200" },
  { icon: Shield, title: "HIPAA Compliant", desc: "End-to-end AES-256 encryption with zero third-party data sharing. Your health data stays private.", color: "from-emerald-500 to-emerald-700", shadow: "shadow-emerald-200" },
];

const aiModules = [
  { icon: Network, label: "Neural Network", desc: "12-layer transformer architecture with clinical attention heads" },
  { icon: Database, label: "Training Data", desc: "100K+ annotated cases from 50 global institutions" },
  { icon: ScanLine, label: "Biomarker Analysis", desc: "Real-time processing of 8 metabolic indicators" },
  { icon: Cpu, label: "Risk Prediction", desc: "Bayesian probability scoring with confidence intervals" },
];

const testimonials = [
  { name: "Dr. Elena Moreira", role: "Endocrinologist, Mayo Clinic", text: "DIAB-CARE has transformed how we screen at-risk patients. The AI accuracy is remarkable.", avatar: "EM" },
  { name: "Prof. James Nakamura", role: "Research Director, Johns Hopkins", text: "The neural architecture is state-of-the-art. Results are consistent with our clinical findings.", avatar: "JN" },
  { name: "Dr. Aisha Patel", role: "Family Medicine, Stanford Health", text: "I recommend DIAB-CARE to all my pre-diabetic patients. The personalized insights are invaluable.", avatar: "AP" },
];

export default function HomePage({ navigate }: { navigate: (p: Page) => void }) {
  return (
    <PageWrapper className="min-h-screen bg-[#F8FAFC]">
      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background mesh */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 right-0 w-[900px] h-[900px] bg-gradient-radial from-blue-100/60 via-cyan-50/30 to-transparent rounded-full translate-x-1/3 -translate-y-1/4" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-radial from-violet-100/30 to-transparent rounded-full -translate-x-1/4 translate-y-1/4" />
          {/* Grid lines */}
          <div className="absolute inset-0 opacity-[0.025]"
            style={{ backgroundImage: "linear-gradient(#2563EB 1px,transparent 1px),linear-gradient(90deg,#2563EB 1px,transparent 1px)", backgroundSize: "60px 60px" }}
          />
          {/* Floating particles */}
          {[
            { x: "8%", y: "20%", size: 48, delay: 0 }, { x: "85%", y: "15%", size: 32, delay: 1 },
            { x: "70%", y: "70%", size: 64, delay: 2 }, { x: "15%", y: "75%", size: 24, delay: 0.5 },
            { x: "50%", y: "5%", size: 40, delay: 1.5 }, { x: "92%", y: "50%", size: 20, delay: 0.8 },
          ].map((p, i) => <Particle key={i} {...p} />)}
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-32 pb-20 grid lg:grid-cols-[1fr_1.05fr] gap-16 items-center w-full">
          {/* Left copy */}
          <motion.div
            variants={stagger(0.1)}
            initial="hidden"
            animate="show"
            className="space-y-8"
          >
            <motion.div variants={fadeUp}>
              <SectionLabel>Next-Gen Medical AI</SectionLabel>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-[3.5rem] lg:text-[4.5rem] font-extrabold text-slate-900 leading-[1.05] tracking-tight"
            >
              Predict Diabetes
              <span className="block relative">
                <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 bg-clip-text text-transparent">
                  Early with AI
                </span>
                <motion.span
                  className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: "60%" }}
                  transition={{ delay: 0.9, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                />
              </span>
            </motion.h1>

            <motion.p variants={fadeUp} className="text-lg text-slate-600 leading-relaxed max-w-lg">
              DIAB-CARE harnesses advanced clinical AI to deliver personalized diabetes risk assessments with{" "}
              <span className="font-semibold text-slate-800">95%+ accuracy</span>. Act before symptoms appear — your health, analyzed by the same technology used by leading research hospitals.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
              <PrimaryBtn onClick={() => navigate("test")} className="px-8 py-4 text-base">
                Start Free Assessment <ArrowRight className="w-4 h-4" />
              </PrimaryBtn>
              <SecondaryBtn onClick={() => navigate("about")} className="px-8 py-4 text-base">
                Learn More <ChevronRight className="w-4 h-4" />
              </SecondaryBtn>
            </motion.div>

            {/* Stats row */}
            <motion.div variants={fadeUp} className="flex items-center gap-8 pt-2">
              {[
                { to: 95, suffix: "%", label: "Accuracy" },
                { to: 10000, suffix: "+", label: "Predictions" },
                { to: 99, suffix: "%", label: "Uptime" },
              ].map((s) => (
                <div key={s.label}>
                  <div className="text-3xl font-extrabold text-blue-700 tracking-tight">
                    <Counter to={s.to} suffix={s.suffix} />
                  </div>
                  <div className="text-xs font-semibold text-slate-500 mt-0.5 uppercase tracking-wide">{s.label}</div>
                </div>
              ))}
              <div className="hidden sm:flex -space-x-2">
                {["EM", "JN", "AP", "KL"].map((a) => (
                  <div key={a} className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 border-2 border-white flex items-center justify-center text-[9px] font-bold text-white">{a}</div>
                ))}
                <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[9px] font-bold text-slate-500">+8K</div>
              </div>
            </motion.div>

            {/* Trust badges */}
            <motion.div variants={fadeUp} className="flex flex-wrap gap-2">
              {["HIPAA Compliant", "FDA Cleared Data", "ISO 27001 Certified", "AES-256 Encrypted"].map((t) => (
                <span key={t} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 shadow-sm">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> {t}
                </span>
              ))}
            </motion.div>
          </motion.div>

          {/* Right — live dashboard visual */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            {/* Glow */}
            <div className="absolute -inset-4 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-3xl blur-3xl" />

            <GlassCard className="relative p-6 space-y-4" hover={false}>
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-800">Live AI Dashboard</div>
                  <div className="text-xs text-slate-400 mt-0.5">Patient: Sarah J. · ID #48291</div>
                </div>
                <div className="flex items-center gap-2">
                  <motion.span
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-2 h-2 bg-emerald-400 rounded-full"
                  />
                  <span className="text-xs font-semibold text-emerald-600">Processing</span>
                </div>
              </div>

              {/* Glucose chart */}
              <div className="bg-gradient-to-br from-slate-50 to-blue-50/50 rounded-2xl p-4 border border-blue-100/50">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">Blood Glucose (mg/dL)</span>
                  <Badge color="blue" size="sm">Last 6 months</Badge>
                </div>
                <ResponsiveContainer width="100%" height={110}>
                  <AreaChart data={bloodData}>
                    <defs>
                      <linearGradient id="gGlucose" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563EB" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#EFF6FF" />
                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} width={28} />
                    <Tooltip
                      contentStyle={{ fontSize: 11, borderRadius: 10, border: "1px solid #e2e8f0", background: "white" }}
                      cursor={{ stroke: "#2563EB", strokeWidth: 1, strokeDasharray: "4 2" }}
                    />
                    <Area type="monotone" dataKey="glucose" stroke="#2563EB" strokeWidth={2.5} fill="url(#gGlucose)" dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Biomarker cards */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: Heart, label: "Heart Rate", value: "72 bpm", color: "text-rose-500", bg: "bg-rose-50" },
                  { icon: Droplets, label: "Glucose", value: "99 mg/dL", color: "text-blue-600", bg: "bg-blue-50" },
                  { icon: Activity, label: "Risk Score", value: "14%", color: "text-emerald-600", bg: "bg-emerald-50" },
                ].map((c) => (
                  <div key={c.label} className={`${c.bg} rounded-xl p-3 text-center`}>
                    <c.icon className={`w-4 h-4 mx-auto mb-1.5 ${c.color}`} />
                    <div className={`text-sm font-extrabold ${c.color}`}>{c.value}</div>
                    <div className="text-[10px] text-slate-500 font-medium mt-0.5">{c.label}</div>
                  </div>
                ))}
              </div>

              {/* AI processing bar */}
              <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 bg-white/15 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white font-bold text-sm">Neural Network Analysis</div>
                    <div className="text-blue-100 text-xs">Analyzing 8 clinical biomarkers...</div>
                  </div>
                  <div className="text-white font-extrabold text-sm">87%</div>
                </div>
                <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-white rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: "87%" }}
                    transition={{ delay: 0.8, duration: 1.2, ease: "easeOut" }}
                  />
                </div>
              </div>

              {/* Risk meters */}
              <div className="space-y-2.5">
                {[
                  { label: "Glucose Impact", pct: 72, color: "#EF4444" },
                  { label: "BMI Factor", pct: 45, color: "#F59E0B" },
                  { label: "Genetic Risk", pct: 38, color: "#2563EB" },
                ].map((r) => (
                  <div key={r.label} className="flex items-center gap-3">
                    <span className="text-xs text-slate-500 w-28 shrink-0">{r.label}</span>
                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: r.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${r.pct}%` }}
                        transition={{ delay: 1.2 + (r.pct / 100), duration: 0.8, ease: "easeOut" }}
                      />
                    </div>
                    <span className="text-xs font-bold text-slate-700 w-8 text-right">{r.pct}%</span>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Floating badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, duration: 0.4 }}
              className="absolute -bottom-5 -left-5 bg-white rounded-2xl shadow-xl border border-slate-100 p-3.5 flex items-center gap-3"
            >
              <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <div className="font-bold text-slate-800 text-sm">Low Risk</div>
                <div className="text-xs text-slate-400">Result in 94 seconds</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#F8FAFC] via-white to-[#F8FAFC]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            variants={stagger(0.12)}
            className="text-center mb-16 space-y-4"
          >
            <motion.div variants={fadeUp}><SectionLabel>Why DIAB-CARE</SectionLabel></motion.div>
            <motion.h2 variants={fadeUp} className="text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
              Built for Clinical Excellence
            </motion.h2>
            <motion.p variants={fadeUp} className="text-slate-500 text-lg max-w-xl mx-auto">
              Every feature engineered with medical-grade precision and validated by leading healthcare professionals worldwide.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger(0.1)}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {features.map((f) => (
              <motion.div key={f.title} variants={fadeUp}>
                <GlassCard className="p-7 h-full">
                  <div className={`w-13 h-13 w-12 h-12 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-6 shadow-lg ${f.shadow}`}>
                    <f.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-slate-800 text-base mb-2.5">{f.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── AI SECTION ── */}
      <section className="relative py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-600" />
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 50% 50%, white 1px, transparent 1px)", backgroundSize: "30px 30px" }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              variants={stagger(0.1)}
              className="text-white space-y-8"
            >
              <motion.div variants={fadeUp}><SectionLabel color="cyan">Technology Stack</SectionLabel></motion.div>
              <motion.h2 variants={fadeUp} className="text-4xl lg:text-5xl font-extrabold leading-tight">
                Powered by Clinical-Grade Machine Learning
              </motion.h2>
              <motion.p variants={fadeUp} className="text-blue-100 text-lg leading-relaxed">
                Our proprietary AI architecture combines ensemble learning, gradient boosting, and deep neural networks — trained and validated on curated clinical datasets from 50+ leading research institutions.
              </motion.p>

              <motion.div variants={fadeUp} className="grid grid-cols-3 gap-4">
                {[
                  { v: "95%", l: "Accuracy" },
                  { v: "10K+", l: "Predictions" },
                  { v: "24/7", l: "Availability" },
                ].map((s) => (
                  <div key={s.l} className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 text-center border border-white/20 hover:bg-white/15 transition-all">
                    <div className="text-3xl font-extrabold text-white">{s.v}</div>
                    <div className="text-blue-200 text-xs font-semibold mt-1 uppercase tracking-wide">{s.l}</div>
                  </div>
                ))}
              </motion.div>

              <motion.div variants={fadeUp}>
                <PrimaryBtn onClick={() => navigate("test")} className="bg-white text-blue-700 hover:bg-blue-50 shadow-2xl">
                  Try AI Analysis <ArrowRight className="w-4 h-4" />
                </PrimaryBtn>
              </motion.div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              variants={stagger(0.1)}
              className="grid grid-cols-2 gap-4"
            >
              {aiModules.map((m) => (
                <motion.div
                  key={m.label}
                  variants={fadeUp}
                  whileHover={{ scale: 1.03, backgroundColor: "rgba(255,255,255,0.18)" }}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 cursor-default transition-colors"
                >
                  <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center mb-4">
                    <m.icon className="w-5 h-5 text-cyan-300" />
                  </div>
                  <div className="font-bold text-white mb-1.5">{m.label}</div>
                  <div className="text-blue-200 text-xs leading-relaxed">{m.desc}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            variants={stagger(0.1)}
            className="text-center mb-16 space-y-4"
          >
            <motion.div variants={fadeUp}><SectionLabel>Trusted By Experts</SectionLabel></motion.div>
            <motion.h2 variants={fadeUp} className="text-4xl font-extrabold text-slate-900">
              What Healthcare Leaders Say
            </motion.h2>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger(0.12)}
            className="grid md:grid-cols-3 gap-6"
          >
            {testimonials.map((t) => (
              <motion.div key={t.name} variants={fadeUp}>
                <GlassCard className="p-7 h-full flex flex-col">
                  <div className="flex gap-1 mb-5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed flex-1 italic">"{t.text}"</p>
                  <div className="flex items-center gap-3 mt-6 pt-5 border-t border-slate-100">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-xs font-extrabold shadow-md">
                      {t.avatar}
                    </div>
                    <div>
                      <div className="font-bold text-slate-800 text-sm">{t.name}</div>
                      <div className="text-xs text-slate-400">{t.role}</div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="py-20 bg-[#F8FAFC]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={stagger(0.1)}
          >
            <motion.div variants={fadeUp} className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-3xl mb-6 shadow-xl">
              <Stethoscope className="w-8 h-8 text-white" />
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-4xl font-extrabold text-slate-900 mb-4">
              Take Control of Your Health Today
            </motion.h2>
            <motion.p variants={fadeUp} className="text-slate-500 text-lg mb-8 max-w-lg mx-auto">
              Join 10,000+ patients and clinicians using DIAB-CARE to detect diabetes risk early and prevent complications.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-wrap gap-3 justify-center">
              <PrimaryBtn onClick={() => navigate("test")} className="px-10 py-4 text-base">
                <FlaskConical className="w-5 h-5" /> Start Free Assessment
              </PrimaryBtn>
              <SecondaryBtn onClick={() => navigate("register")} className="px-10 py-4 text-base">
                Create Account <ArrowRight className="w-4 h-4" />
              </SecondaryBtn>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-slate-900 text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <Activity className="w-4 h-4 text-white" />
                </div>
                <span className="font-extrabold text-white text-lg">DIAB<span className="text-blue-400">-CARE</span></span>
              </div>
              <p className="text-sm leading-relaxed max-w-xs">
                Enterprise-grade diabetes prediction platform powered by clinical AI. Trusted by leading healthcare institutions worldwide.
              </p>
              <div className="flex gap-2">
                {["HIPAA", "ISO 27001", "FDA"].map((b) => (
                  <span key={b} className="px-2.5 py-1 bg-slate-800 border border-slate-700 rounded-lg text-xs font-bold text-slate-400">{b}</span>
                ))}
              </div>
            </div>
            {[
              { title: "Platform", items: [{ l: "Home", p: "home" }, { l: "About", p: "about" }, { l: "Diabetes Test", p: "test" }, { l: "Contact", p: "contact" }] },
              { title: "Account", items: [{ l: "Profile", p: "profile" }, { l: "Login", p: "login" }, { l: "Register", p: "register" }, { l: "Admin", p: "admin" }] },
              { title: "Legal", items: [{ l: "Privacy Policy", p: "home" }, { l: "Terms of Service", p: "home" }, { l: "HIPAA Policy", p: "home" }] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wide">{col.title}</h4>
                <ul className="space-y-2.5">
                  {col.items.map((lk) => (
                    <li key={lk.l}>
                      <button onClick={() => navigate(lk.p as Page)} className="text-sm hover:text-blue-400 transition-colors">
                        {lk.l}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span>© 2024 DIAB-CARE Inc. All rights reserved.</span>
            <span className="text-slate-600">This platform does not replace professional medical diagnosis or treatment.</span>
          </div>
        </div>
      </footer>
    </PageWrapper>
  );
}
