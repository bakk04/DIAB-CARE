import { useState } from "react";
import { motion } from "motion/react";
import {
  Mail, Phone, MapPin, Clock, CheckCircle, Send,
  MessageSquare, Stethoscope, Brain, Activity, User, FileText,
} from "lucide-react";
import { GlassCard, PrimaryBtn, InputField, fadeUp, stagger, SectionLabel, PageWrapper } from "../components/ui";

const contactCards = [
  { icon: Mail, label: "Email Support", value: "support@diabcare.ai", sub: "Response within 4 hours", color: "from-blue-500 to-blue-700", bg: "bg-blue-50" },
  { icon: Phone, label: "Medical Hotline", value: "+1 (800) DIAB-AI", sub: "Available 24/7", color: "from-emerald-500 to-emerald-700", bg: "bg-emerald-50" },
  { icon: MapPin, label: "Headquarters", value: "San Francisco, CA 94103", sub: "United States", color: "from-violet-500 to-violet-700", bg: "bg-violet-50" },
  { icon: Clock, label: "Operating Hours", value: "24/7 Available", sub: "AI system always online", color: "from-cyan-500 to-cyan-700", bg: "bg-cyan-50" },
];

const subjects = [
  "General Inquiry",
  "Technical Support",
  "Medical Question",
  "Partnership Opportunity",
  "Data Privacy",
  "Enterprise Sales",
];

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState("General Inquiry");

  const handleSend = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); setSent(true); }, 1500);
  };

  return (
    <PageWrapper className="min-h-screen bg-[#F8FAFC]">
      {/* ── HERO ── */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-blue-50/60" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <motion.div initial="hidden" animate="show" variants={stagger(0.1)} className="space-y-5">
            <motion.div variants={fadeUp}><SectionLabel>Contact Us</SectionLabel></motion.div>
            <motion.h1 variants={fadeUp} className="text-5xl font-extrabold text-slate-900 tracking-tight">
              We're Here to Help
            </motion.h1>
            <motion.p variants={fadeUp} className="text-slate-500 text-lg max-w-xl mx-auto leading-relaxed">
              Whether you're a patient, clinician, or enterprise partner — our team of medical AI experts is ready to assist you.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ── CONTACT CARDS ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-12">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={stagger(0.1)}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {contactCards.map((c) => (
            <motion.div key={c.label} variants={fadeUp}>
              <GlassCard className="p-6">
                <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${c.color} flex items-center justify-center mb-4 shadow-md`}>
                  <c.icon className="w-5 h-5 text-white" />
                </div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">{c.label}</div>
                <div className="font-bold text-slate-800 text-sm leading-snug">{c.value}</div>
                <div className="text-xs text-slate-400 mt-1">{c.sub}</div>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── MAIN SECTION ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-24 grid lg:grid-cols-[1fr_1.5fr] gap-12 items-start">
        {/* Left illustration panel */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-5"
        >
          {/* Visual */}
          <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600 rounded-3xl p-10 text-white shadow-2xl overflow-hidden relative min-h-[280px] flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-56 h-56 bg-white/5 rounded-full translate-x-16 -translate-y-16" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full -translate-x-10 translate-y-10" />
            <div className="relative z-10">
              <div className="flex items-end gap-4 mb-8">
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="w-16 h-20 bg-white/15 rounded-2xl flex items-end justify-center pb-3 border border-white/25"
                >
                  <Stethoscope className="w-7 h-7 text-white" />
                </motion.div>
                <motion.div
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 3, delay: 0.5, repeat: Infinity, ease: "easeInOut" }}
                  className="w-12 h-16 bg-cyan-400/25 rounded-2xl flex items-end justify-center pb-3 border border-white/20"
                >
                  <Brain className="w-5 h-5 text-white" />
                </motion.div>
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3, delay: 1, repeat: Infinity, ease: "easeInOut" }}
                  className="w-10 h-14 bg-white/10 rounded-2xl flex items-end justify-center pb-3 border border-white/15"
                >
                  <Activity className="w-4 h-4 text-white" />
                </motion.div>
              </div>
              <h3 className="text-xl font-extrabold mb-2">Medical AI Support</h3>
              <p className="text-blue-100 text-sm leading-relaxed">Our clinical specialists and AI engineers are available around the clock to support your health journey.</p>
            </div>
            {/* Stat strip */}
            <div className="relative z-10 flex gap-4 pt-4 border-t border-white/15 mt-4">
              {[{ v: "4h", l: "Avg Response" }, { v: "98%", l: "Satisfaction" }, { v: "24/7", l: "Support" }].map(s => (
                <div key={s.l} className="text-center">
                  <div className="text-lg font-extrabold text-white">{s.v}</div>
                  <div className="text-blue-200 text-[10px] font-semibold uppercase tracking-wide">{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ quick links */}
          <GlassCard className="p-5 hover:shadow-none">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="w-4 h-4 text-blue-500" />
              <span className="font-bold text-slate-800 text-sm">Quick Answers</span>
            </div>
            <div className="space-y-2">
              {[
                "How accurate is the AI prediction?",
                "Is my health data secure?",
                "How long does a test take?",
                "Can I share results with my doctor?",
              ].map((q) => (
                <button key={q} className="w-full text-left text-sm text-slate-600 hover:text-blue-700 py-2.5 border-b border-slate-100 last:border-0 flex items-center justify-between group transition-colors">
                  {q}
                  <span className="text-slate-300 group-hover:text-blue-400 transition-colors">→</span>
                </button>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Right: Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <GlassCard className="p-8 hover:shadow-none">
            {sent ? (
              <div className="text-center py-16 space-y-5">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto border-4 border-emerald-100"
                >
                  <CheckCircle className="w-10 h-10 text-emerald-500" />
                </motion.div>
                <div>
                  <h3 className="text-2xl font-extrabold text-slate-900 mb-2">Message Sent!</h3>
                  <p className="text-slate-500 text-sm max-w-xs mx-auto leading-relaxed">
                    Thank you for reaching out. Our team will respond to your inquiry within 4 business hours.
                  </p>
                </div>
                <PrimaryBtn onClick={() => setSent(false)} className="mx-auto">
                  Send Another Message
                </PrimaryBtn>
              </div>
            ) : (
              <motion.div initial="hidden" animate="show" variants={stagger(0.08)} className="space-y-5">
                <motion.div variants={fadeUp}>
                  <h2 className="text-2xl font-extrabold text-slate-900">Send a Message</h2>
                  <p className="text-slate-500 text-sm mt-1">Our medical AI team typically responds within 4 hours.</p>
                </motion.div>

                <motion.div variants={fadeUp} className="grid sm:grid-cols-2 gap-4">
                  <InputField label="Full Name" placeholder="Dr. Sarah Johnson" icon={User} />
                  <InputField label="Email Address" type="email" placeholder="sarah@hospital.com" icon={Mail} />
                </motion.div>

                <motion.div variants={fadeUp}>
                  <div className="text-xs font-bold text-slate-600 uppercase tracking-wide mb-2">Subject</div>
                  <div className="flex flex-wrap gap-2">
                    {subjects.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSelected(s)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${selected === s ? "bg-blue-600 text-white border-blue-600 shadow-md" : "bg-white border-slate-200 text-slate-600 hover:border-blue-300"}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </motion.div>

                <motion.div variants={fadeUp} className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Message</label>
                  <textarea
                    rows={5}
                    placeholder="Describe your question, issue, or feedback in detail. The more context you provide, the better we can assist you."
                    className="w-full px-4 py-3 bg-slate-50/80 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-400 transition-all resize-none leading-relaxed"
                  />
                </motion.div>

                <motion.div variants={fadeUp}>
                  <label className="flex items-center gap-3 cursor-pointer mb-5">
                    <input type="checkbox" className="w-4 h-4 rounded accent-blue-600" />
                    <span className="text-sm text-slate-600">
                      I agree to the <span className="text-blue-600 font-semibold">Privacy Policy</span> and consent to being contacted via email.
                    </span>
                  </label>

                  <motion.button
                    onClick={handleSend}
                    disabled={loading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center gap-2.5 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-xl shadow-[0_4px_20px_rgba(37,99,235,0.35)] transition-colors text-sm"
                  >
                    {loading ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                          className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                        />
                        Sending...
                      </>
                    ) : (
                      <> <Send className="w-4 h-4" /> Send Message </>
                    )}
                  </motion.button>
                </motion.div>
              </motion.div>
            )}
          </GlassCard>
        </motion.div>
      </section>
    </PageWrapper>
  );
}
