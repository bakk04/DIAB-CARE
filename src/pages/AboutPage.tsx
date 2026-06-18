import { motion } from "motion/react";
import {
  Heart, Star, Cpu, Shield, Database, ScanLine,
  Network, Brain, Target, Award, Users, Globe,
  CheckCircle, ArrowRight, Dna, Microscope,
} from "lucide-react";
import {
  GlassCard, Badge, SectionLabel, PrimaryBtn, fadeUp, stagger, PageWrapper,
} from "../components/ui";
import type { Page } from "../components/ui";

const timeline = [
  { icon: Database, step: "01", label: "Data Collection", desc: "Aggregating clinical records from 50+ medical institutions across 18 countries, encompassing 100,000+ annotated patient cases.", color: "from-blue-500 to-blue-700" },
  { icon: ScanLine, step: "02", label: "Preprocessing", desc: "Rigorous data cleaning, normalization, and feature engineering to eliminate bias and ensure statistical robustness.", color: "from-cyan-500 to-cyan-700" },
  { icon: Network, step: "03", label: "Neural Network Training", desc: "Multi-layer transformer architecture with clinical attention heads trained via k-fold cross-validation.", color: "from-violet-500 to-violet-700" },
  { icon: Brain, step: "04", label: "AI Prediction", desc: "Real-time inference pipeline delivering probability scores with Bayesian confidence intervals in under 2 seconds.", color: "from-emerald-500 to-emerald-700" },
  { icon: Target, step: "05", label: "Result Analysis", desc: "Personalized risk stratification with clinical interpretation, factor attribution, and actionable recommendations.", color: "from-rose-500 to-rose-700" },
];

const pillars = [
  {
    icon: Heart,
    title: "Our Mission",
    desc: "To democratize early diabetes detection by making clinical-grade AI universally accessible — empowering patients and physicians to identify risk signals years before complications develop.",
    color: "from-rose-500 to-rose-700",
    bg: "bg-rose-50",
  },
  {
    icon: Star,
    title: "Our Vision",
    desc: "A world where preventable diabetes complications are eliminated through proactive, AI-driven healthcare. We envision DIAB-CARE as the global benchmark for metabolic risk assessment.",
    color: "from-amber-500 to-amber-700",
    bg: "bg-amber-50",
  },
  {
    icon: Cpu,
    title: "Our Technology",
    desc: "Proprietary ensemble architecture combining gradient-boosted decision trees, deep neural networks, and Bayesian inference — validated on 100,000+ clinical cases with 95.3% accuracy.",
    color: "from-violet-500 to-violet-700",
    bg: "bg-violet-50",
  },
  {
    icon: Shield,
    title: "Our Security",
    desc: "HIPAA-compliant infrastructure with AES-256 encryption at rest and in transit. ISO 27001 certified. Zero third-party data sharing. Full GDPR compliance. Your data, always yours.",
    color: "from-emerald-500 to-emerald-700",
    bg: "bg-emerald-50",
  },
];

const stats = [
  { icon: Users, value: "12,000+", label: "Active Users", color: "from-blue-500 to-blue-700" },
  { icon: Database, value: "100K+", label: "Training Cases", color: "from-cyan-500 to-cyan-700" },
  { icon: Globe, value: "18", label: "Countries", color: "from-violet-500 to-violet-700" },
  { icon: Award, value: "95.3%", label: "Model Accuracy", color: "from-emerald-500 to-emerald-700" },
];

const team = [
  { name: "Dr. Elena Moreira", role: "Chief Medical Officer", spec: "Endocrinology · Johns Hopkins PhD", avatar: "EM", color: "from-blue-500 to-cyan-500" },
  { name: "Prof. James Nakamura", role: "Head of AI Research", spec: "ML Engineering · MIT PhD", avatar: "JN", color: "from-violet-500 to-purple-600" },
  { name: "Dr. Aisha Patel", role: "Clinical Director", spec: "Diabetology · Stanford MD", avatar: "AP", color: "from-emerald-500 to-teal-600" },
  { name: "Marco Reyes", role: "CTO & Co-Founder", spec: "Systems Engineering · EPFL", avatar: "MR", color: "from-rose-500 to-rose-700" },
];

export default function AboutPage({ navigate }: { navigate: (p: Page) => void }) {
  return (
    <PageWrapper className="min-h-screen bg-[#F8FAFC]">
      {/* ── HERO ── */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600" />
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 50% 50%, white 1px, transparent 1px)", backgroundSize: "28px 28px" }}
        />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial="hidden"
            animate="show"
            variants={stagger(0.1)}
            className="space-y-6"
          >
            <motion.div variants={fadeUp}>
              <SectionLabel color="cyan">About Us</SectionLabel>
            </motion.div>
            <motion.h1 variants={fadeUp} className="text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight">
              Redefining Diabetes Care
              <span className="block text-cyan-300">Through Artificial Intelligence</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="text-blue-100 text-lg leading-relaxed max-w-2xl mx-auto">
              DIAB-CARE was founded by a team of endocrinologists, machine learning researchers, and healthcare engineers with a single conviction: early detection saves lives.
            </motion.p>
            {/* Stats strip */}
            <motion.div variants={fadeUp} className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 max-w-3xl mx-auto">
              {stats.map((s) => (
                <div key={s.label} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5 text-center">
                  <div className="text-2xl font-extrabold text-white">{s.value}</div>
                  <div className="text-blue-200 text-xs font-semibold mt-1 uppercase tracking-wide">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── PILLARS ── */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={stagger(0.1)}
          className="space-y-12"
        >
          <motion.div variants={fadeUp} className="text-center space-y-3">
            <SectionLabel>What We Stand For</SectionLabel>
            <h2 className="text-4xl font-extrabold text-slate-900">Our Core Commitments</h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-6">
            {pillars.map((p) => (
              <motion.div key={p.title} variants={fadeUp}>
                <GlassCard className="p-8 h-full">
                  <div className="flex items-start gap-5">
                    <div className={`w-13 h-13 shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br ${p.color} flex items-center justify-center shadow-lg`}>
                      <p.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-lg mb-2">{p.title}</h3>
                      <p className="text-slate-500 text-sm leading-relaxed">{p.desc}</p>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── AI ARCHITECTURE TIMELINE ── */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger(0.08)}
            className="space-y-12"
          >
            <motion.div variants={fadeUp} className="text-center space-y-3">
              <SectionLabel color="cyan">AI Architecture</SectionLabel>
              <h2 className="text-4xl font-extrabold text-slate-900">How Our AI Works</h2>
              <p className="text-slate-500 max-w-lg mx-auto">
                From raw biomarker data to a personalized risk assessment — five precision-engineered stages power every prediction.
              </p>
            </motion.div>

            <div className="relative space-y-4">
              {/* Connecting line */}
              <div className="absolute left-[28px] top-8 bottom-8 w-0.5 bg-gradient-to-b from-blue-600 via-cyan-500 to-rose-500 rounded-full" />

              {timeline.map((step, i) => (
                <motion.div key={step.step} variants={fadeUp} className="relative flex gap-6">
                  {/* Step number circle */}
                  <div className={`relative shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg z-10`}>
                    <step.icon className="w-6 h-6 text-white" />
                    <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-white border-2 border-blue-100 rounded-full flex items-center justify-center text-[9px] font-extrabold text-blue-700">
                      {i + 1}
                    </span>
                  </div>
                  <GlassCard className="flex-1 p-5">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-bold text-slate-800">{step.label}</h3>
                      <Badge color="gray" size="sm">{step.step}</Badge>
                    </div>
                    <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── LEADERSHIP ── */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={stagger(0.1)}
          className="space-y-12"
        >
          <motion.div variants={fadeUp} className="text-center space-y-3">
            <SectionLabel>Leadership</SectionLabel>
            <h2 className="text-4xl font-extrabold text-slate-900">Meet the Team</h2>
            <p className="text-slate-500 max-w-lg mx-auto">
              World-class experts in medicine, machine learning, and healthcare technology united by a shared mission.
            </p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((m) => (
              <motion.div key={m.name} variants={fadeUp}>
                <GlassCard className="p-6 text-center">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${m.color} flex items-center justify-center text-white text-lg font-extrabold mx-auto mb-4 shadow-lg`}>
                    {m.avatar}
                  </div>
                  <div className="font-bold text-slate-800">{m.name}</div>
                  <div className="text-xs font-semibold text-blue-600 mt-1">{m.role}</div>
                  <div className="text-xs text-slate-400 mt-1 leading-relaxed">{m.spec}</div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── CERTIFICATIONS ── */}
      <section className="py-16 bg-gradient-to-r from-slate-900 to-blue-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={stagger(0.1)}
            className="text-center space-y-8"
          >
            <motion.div variants={fadeUp}>
              <h3 className="text-2xl font-extrabold text-white mb-2">Certified & Compliant</h3>
              <p className="text-slate-400 text-sm">Meeting the highest international standards in healthcare data security.</p>
            </motion.div>
            <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-4">
              {["HIPAA Compliant", "ISO 27001:2022", "GDPR Compliant", "SOC 2 Type II", "FDA 21 CFR Part 11"].map((cert) => (
                <div key={cert} className="flex items-center gap-2.5 px-5 py-3 bg-white/8 border border-white/15 rounded-xl backdrop-blur-sm">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm font-semibold text-white">{cert}</span>
                </div>
              ))}
            </motion.div>
            <motion.div variants={fadeUp}>
              <PrimaryBtn onClick={() => navigate("test")} className="bg-white text-blue-700 hover:bg-blue-50 shadow-xl">
                Start Your Assessment <ArrowRight className="w-4 h-4" />
              </PrimaryBtn>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </PageWrapper>
  );
}
