import { useState } from "react";
import { motion } from "motion/react";
import {
  Activity, Mail, Lock, User, ArrowRight, CheckCircle,
  Dna, Shield, Brain, Eye, EyeOff, ChevronRight,
} from "lucide-react";
import { GlassCard, PrimaryBtn, InputField, SelectField, fadeUp, stagger, PageWrapper } from "../components/ui";
import type { Page } from "../components/ui";
import { api } from "../app/api";

const steps = ["Personal", "Medical", "Security"];

const benefits = [
  "Free AI diabetes risk assessment",
  "Personalized health insights dashboard",
  "Historical trend tracking & analysis",
  "HIPAA-compliant secure data storage",
  "Direct clinician recommendations",
];

export default function RegisterPage({ navigate }: { navigate: (p: Page) => void }) {
  const [step, setStep] = useState(0);
  const [showPwd, setShowPwd] = useState(false);
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "",
    gender: "Female", age: "", weight: "", height: "",
    password: "", confirm: "", agree: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const update = (k: string, v: string | boolean) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    if (step < 2) {
      if (step === 0) {
        if (!form.firstName || !form.lastName || !form.email) {
          setError("First name, last name and email are required.");
          return;
        }
        setError("");
      }
      if (step === 1) {
        if (!form.age) {
          setError("Age is required.");
          return;
        }
        setError("");
      }
      setStep(s => s + 1);
      return;
    }

    if (!form.password || form.password !== form.confirm) {
      setError("Passwords must match and be filled.");
      return;
    }
    
    setError("");
    setLoading(true);
    try {
      await api.register({
        firstname: form.firstName,
        lastname: form.lastName,
        email: form.email,
        password: form.password,
        gender: form.gender,
        age: parseInt(form.age),
      });

      const loginRes = await api.login(form.email, form.password);
      await api.getProfile(loginRes.user_id);
      
      setLoading(false);
      navigate("profile");
    } catch (err: any) {
      setLoading(false);
      setError(err.message || "Registration failed. Email might already be in use.");
    }
  };

  return (
    <PageWrapper className="min-h-screen bg-[#F8FAFC] pt-20 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 grid lg:grid-cols-[1fr_1.2fr] gap-12 items-start pt-8">

        {/* Left panel */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden lg:block space-y-6 sticky top-28"
        >
          <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600 rounded-3xl p-8 text-white shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-x-8 -translate-y-8" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-x-4 translate-y-4" />
            <div className="relative z-10 space-y-6">
              <div className="w-14 h-14 bg-white/15 rounded-2xl flex items-center justify-center border border-white/20 shadow-lg">
                <Dna className="w-7 h-7 text-cyan-300" />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold leading-tight mb-2">Join DIAB-CARE</h2>
                <p className="text-blue-100 text-sm leading-relaxed">
                  Get your personalized diabetes risk assessment powered by clinical-grade AI in under 5 minutes.
                </p>
              </div>
              <div className="space-y-3">
                {benefits.map((b, i) => (
                  <motion.div
                    key={b}
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.08 }}
                    className="flex items-center gap-3 text-sm text-blue-100"
                  >
                    <CheckCircle className="w-4 h-4 text-cyan-300 shrink-0" />
                    {b}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Endorsement */}
          <GlassCard className="p-5 hover:shadow-none">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-xs font-extrabold shadow-md shrink-0">EM</div>
              <div>
                <p className="text-sm text-slate-600 italic leading-relaxed">
                  "DIAB-CARE identified my patient's pre-diabetic state 18 months before conventional screening would have."
                </p>
                <div className="text-xs font-bold text-slate-700 mt-2">Dr. Elena Moreira</div>
                <div className="text-xs text-slate-400">Endocrinologist, Mayo Clinic</div>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Right: form */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={stagger(0.1)}
        >
          {/* Step indicator */}
          <motion.div variants={fadeUp} className="flex items-center gap-2 mb-8">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 ${i === step ? "bg-blue-600 text-white shadow-md" : i < step ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                  {i < step ? <CheckCircle className="w-3.5 h-3.5" /> : <span>{i + 1}</span>}
                  {s}
                </div>
                {i < steps.length - 1 && (
                  <div className={`w-6 h-0.5 rounded-full transition-all duration-300 ${i < step ? "bg-emerald-400" : "bg-slate-200"}`} />
                )}
              </div>
            ))}
          </motion.div>

          <GlassCard className="p-8 hover:shadow-none">
            <motion.div variants={fadeUp} className="mb-6">
              <h1 className="text-2xl font-extrabold text-slate-900">
                {step === 0 ? "Personal Information" : step === 1 ? "Medical Profile" : "Account Security"}
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                {step === 0 ? "Tell us about yourself" : step === 1 ? "Medical details improve AI accuracy" : "Secure your DIAB-CARE account"}
              </p>
            </motion.div>

            {/* Step 0: Personal */}
            {step === 0 && (
              <motion.div variants={stagger(0.07)} initial="hidden" animate="show" className="space-y-4">
                <motion.div variants={fadeUp} className="grid grid-cols-2 gap-4">
                  <InputField label="First Name" placeholder="Sarah" value={form.firstName} onChange={(e: any) => update("firstName", e.target.value)} icon={User} />
                  <InputField label="Last Name" placeholder="Johnson" value={form.lastName} onChange={(e: any) => update("lastName", e.target.value)} icon={User} />
                </motion.div>
                <motion.div variants={fadeUp}>
                  <InputField label="Email Address" type="email" placeholder="sarah@hospital.com" value={form.email} onChange={(e: any) => update("email", e.target.value)} icon={Mail} />
                </motion.div>
                <motion.div variants={fadeUp}>
                  <SelectField label="Gender" options={["Female", "Male", "Non-binary", "Prefer not to say"]} value={form.gender} onChange={(e: any) => update("gender", e.target.value)} />
                </motion.div>
              </motion.div>
            )}

            {/* Step 1: Medical */}
            {step === 1 && (
              <motion.div variants={stagger(0.07)} initial="hidden" animate="show" className="space-y-4">
                <motion.div variants={fadeUp} className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-3">
                  <Brain className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                  <p className="text-xs text-blue-700 leading-relaxed">This information significantly improves the accuracy of your AI risk assessment. All data is encrypted and HIPAA-compliant.</p>
                </motion.div>
                <motion.div variants={fadeUp} className="grid grid-cols-3 gap-4">
                  <InputField label="Age" type="number" placeholder="35" value={form.age} onChange={(e: any) => update("age", e.target.value)} />
                  <InputField label="Weight (kg)" type="number" placeholder="68" value={form.weight} onChange={(e: any) => update("weight", e.target.value)} />
                  <InputField label="Height (cm)" type="number" placeholder="165" value={form.height} onChange={(e: any) => update("height", e.target.value)} />
                </motion.div>
                <motion.div variants={fadeUp}>
                  <SelectField label="Activity Level" options={["Sedentary", "Lightly Active", "Moderately Active", "Very Active"]} />
                </motion.div>
                <motion.div variants={fadeUp}>
                  <SelectField label="Family History of Diabetes" options={["No family history", "One parent diabetic", "Both parents diabetic", "Sibling with diabetes"]} />
                </motion.div>
              </motion.div>
            )}

            {/* Step 2: Security */}
            {step === 2 && (
              <motion.div variants={stagger(0.07)} initial="hidden" animate="show" className="space-y-4">
                <motion.div variants={fadeUp} className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type={showPwd ? "text" : "password"}
                      placeholder="Minimum 8 characters"
                      value={form.password}
                      onChange={e => update("password", e.target.value)}
                      className="w-full pl-10 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-400 transition-all"
                    />
                    <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                      {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {/* Password strength */}
                  <div className="flex gap-1 mt-2">
                    {[0, 1, 2, 3].map(i => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-all ${form.password.length > i * 3 ? (form.password.length > 10 ? "bg-emerald-500" : "bg-amber-400") : "bg-slate-200"}`} />
                    ))}
                  </div>
                </motion.div>
                <motion.div variants={fadeUp}>
                  <InputField label="Confirm Password" type="password" placeholder="Repeat password" value={form.confirm} onChange={(e: any) => update("confirm", e.target.value)} icon={Lock} />
                  {form.confirm && form.password !== form.confirm && (
                    <p className="text-xs text-red-500 mt-1.5 font-semibold">Passwords do not match</p>
                  )}
                </motion.div>
                <motion.div variants={fadeUp} className="space-y-3 pt-2">
                  {[
                    "I agree to the Terms of Service and Privacy Policy",
                    "I consent to AI analysis of my health data for risk prediction",
                    "I understand this is not a substitute for professional medical advice",
                  ].map((text, i) => (
                    <label key={i} className="flex items-start gap-3 cursor-pointer">
                      <input type="checkbox" className="mt-0.5 w-4 h-4 rounded accent-blue-600 shrink-0" />
                      <span className="text-sm text-slate-600 leading-relaxed">{text}</span>
                    </label>
                  ))}
                </motion.div>
              </motion.div>
            )}

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs font-semibold rounded-xl text-center mb-4">
                {error}
              </div>
            )}

            {/* Navigation */}
            <motion.div variants={fadeUp} className="flex gap-3 mt-7">
              {step > 0 && (
                <button
                  onClick={() => setStep(s => s - 1)}
                  disabled={loading}
                  className="flex-1 py-3.5 border-2 border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:border-blue-300 hover:text-blue-700 transition-all disabled:opacity-55"
                >
                  Back
                </button>
              )}
              <motion.button
                onClick={handleSubmit}
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                className="flex-1 flex items-center justify-center gap-2.5 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-xl shadow-[0_4px_20px_rgba(37,99,235,0.35)] text-sm disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                    />
                    Creating...
                  </>
                ) : (
                  <>
                    {step < 2 ? "Continue" : "Create Account"}
                    {step < 2 ? <ChevronRight className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                  </>
                )}
              </motion.button>
            </motion.div>
          </GlassCard>

          <motion.p variants={fadeUp} className="text-center text-slate-500 text-sm mt-5">
            Already have an account?{" "}
            <button onClick={() => navigate("login")} className="text-blue-600 font-bold hover:text-blue-800 transition-colors">
              Sign in
            </button>
          </motion.p>
        </motion.div>
      </div>
    </PageWrapper>
  );
}
