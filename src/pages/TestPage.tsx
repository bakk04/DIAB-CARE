import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Brain, FlaskConical, Activity, Heart, Droplets, User,
  AlertTriangle, CheckCircle, ArrowRight, ChevronRight,
  Stethoscope, CalendarDays, Dumbbell, Apple, RotateCcw,
  Info, TrendingUp, Shield,
} from "lucide-react";
import {
  PieChart, Pie, Cell, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, Tooltip,
} from "recharts";
import {
  GlassCard, PrimaryBtn, SecondaryBtn, Badge, SectionLabel, InputField, SelectField, fadeUp, stagger, PageWrapper,
} from "../components/ui";
import type { Page } from "../components/ui";
import { api, PredictionResponse } from "../app/api";

/* ─── Step indicator ─── */
function StepBar({ step }: { step: number }) {
  const steps = ["Personal", "Clinical", "Lifestyle", "Review"];
  return (
    <div className="flex items-center justify-center gap-0 mb-10">
      {steps.map((s, i) => (
        <div key={s} className="flex items-center">
          <div className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold transition-all duration-400 ${i === step ? "bg-blue-600 text-white shadow-md shadow-blue-200" : i < step ? "bg-emerald-50 text-white" : "bg-slate-100 text-slate-500"}`}>
            {i < step ? <CheckCircle className="w-3.5 h-3.5" /> : <span className="w-4 h-4 flex items-center justify-center">{i + 1}</span>}
            <span className="hidden sm:inline">{s}</span>
          </div>
          {i < steps.length - 1 && (
            <div className={`h-0.5 w-8 sm:w-12 transition-all duration-400 ${i < step ? "bg-emerald-400" : "bg-slate-200"}`} />
          )}
        </div>
      ))}
    </div>
  );
}

/* ─── Result View ─── */
interface ResultViewProps {
  predictionResult: PredictionResponse;
  form: any;
  onReset: () => void;
}

function ResultView({ predictionResult, form, onReset }: ResultViewProps) {
  const risk = Math.round(predictionResult.probability);
  const positive = predictionResult.prediction === "Positive";
  const level = predictionResult.risk_level.replace(" Risk", "");
  const levelColor = positive ? "red" : risk >= 40 ? "yellow" : "green";

  const gaugeData = [
    { value: risk, fill: positive ? "#EF4444" : risk >= 40 ? "#F59E0B" : "#10B981" },
    { value: 100 - risk, fill: "#F1F5F9" },
  ];

  // Map user inputs to radar visualizer
  const radarData = [
    { factor: "Glucose", value: Math.min(100, Math.round(((parseFloat(form.glucose) || 120) / 200) * 100)) },
    { factor: "BMI", value: Math.min(100, Math.round(((parseFloat(form.bmi) || 25) / 50) * 100)) },
    { factor: "Blood Press.", value: Math.min(100, Math.round(((parseFloat(form.bloodPressure) || 80) / 125) * 100)) },
    { factor: "Insulin", value: Math.min(100, Math.round(((parseFloat(form.insulin) || 80) / 300) * 100)) },
    { factor: "Pedigree", value: Math.min(100, Math.round(((parseFloat(form.pedigree) || 0.5) / 2.0) * 100)) },
    { factor: "Age", value: Math.min(100, Math.round(((parseFloat(form.age) || 30) / 90) * 100)) },
  ];

  // Map textual recommendations to visual grid items with icons
  const recs = predictionResult.recommendations.map((desc) => {
    let icon = Info;
    let title = "General Monitoring";
    let color = "from-violet-500 to-violet-700";

    const low = desc.toLowerCase();
    if (low.includes("diet") || low.includes("eat") || low.includes("food") || low.includes("nutrition")) {
      icon = Apple;
      title = "Dietary Adjustments";
      color = "from-emerald-500 to-emerald-700";
    } else if (low.includes("exercise") || low.includes("workout") || low.includes("sport") || low.includes("activity")) {
      icon = Dumbbell;
      title = "Physical Training";
      color = "from-blue-500 to-blue-700";
    } else if (low.includes("doctor") || low.includes("consult") || low.includes("clinic") || low.includes("specialist")) {
      icon = Stethoscope;
      title = "Clinical Review";
      color = "from-red-500 to-rose-600";
    }

    return { icon, title, desc, color };
  });

  // Calculate dynamic explanation highlights
  const factors = [];
  const gluVal = parseFloat(form.glucose) || 120;
  if (gluVal >= 100) {
    factors.push({
      label: "Elevated Fasting Glucose",
      value: gluVal,
      unit: "mg/dL",
      threshold: "< 100",
      severity: gluVal >= 126 ? "high" : "moderate",
      detail: `${Math.round(gluVal - 99)} mg/dL above standard limit`
    });
  }
  const bmiVal = parseFloat(form.bmi) || 25;
  if (bmiVal >= 25.0) {
    factors.push({
      label: `BMI — ${bmiVal >= 30 ? "Obese" : "Overweight"}`,
      value: bmiVal,
      unit: "kg/m²",
      threshold: "18.5–24.9",
      severity: bmiVal >= 30 ? "high" : "moderate",
      detail: "Elevated body mass factor"
    });
  }
  const pedVal = parseFloat(form.pedigree) || 0.45;
  if (pedVal >= 0.5) {
    factors.push({
      label: "Diabetes Pedigree Factor",
      value: pedVal,
      unit: "score",
      threshold: "< 0.5",
      severity: pedVal >= 0.8 ? "high" : "moderate",
      detail: "Hereditary risk profile"
    });
  }

  // Fallback if user is fully within normal limits
  if (factors.length === 0) {
    factors.push({
      label: "Healthy Fasting Glucose",
      value: gluVal,
      unit: "mg/dL",
      threshold: "< 100",
      severity: "low",
      detail: "Ideal sugar levels"
    });
    factors.push({
      label: "Optimal Body Weight",
      value: bmiVal,
      unit: "kg/m²",
      threshold: "18.5–24.9",
      severity: "low",
      detail: "Perfect BMI"
    });
  }

  // Normalization limits for contribution bars
  const getContributionPct = (val: number, max: number) => {
    return Math.min(100, Math.max(10, Math.round((val / max) * 100)));
  };

  const contributions = [
    { label: "Glucose Level", pct: getContributionPct(parseFloat(form.glucose) || 120, 200), color: "#EF4444" },
    { label: "Diabetes Pedigree", pct: getContributionPct(parseFloat(form.pedigree) || 0.5, 2.4), color: "#F59E0B" },
    { label: "BMI Index", pct: getContributionPct(parseFloat(form.bmi) || 25, 50), color: "#F97316" },
    { label: "Insulin Resistance", pct: getContributionPct(parseFloat(form.insulin) || 80, 800), color: "#8B5CF6" },
    { label: "Blood Pressure", pct: getContributionPct(parseFloat(form.bloodPressure) || 80, 120), color: "#2563EB" },
    { label: "Age Factor", pct: getContributionPct(parseFloat(form.age) || 30, 100), color: "#06B6D4" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header result card */}
      <GlassCard className="p-8 hover:shadow-none overflow-hidden relative">
        <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-10 ${positive ? "bg-red-500" : "bg-emerald-500"}`} />
        <div className="relative grid md:grid-cols-3 gap-8 items-center">
          {/* Gauge */}
          <div className="flex flex-col items-center">
            <div className="relative w-44 h-44">
              <ResponsiveContainer width="100%" height={100}>
                <PieChart>
                  <Pie
                    data={gaugeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={52}
                    outerRadius={70}
                    startAngle={90}
                    endAngle={-270}
                    dataKey="value"
                    stroke="none"
                  >
                    {gaugeData.map((e, i) => <Cell key={i} fill={e.fill} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.span
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, type: "spring" }}
                  className={`text-4xl font-extrabold ${positive ? "text-red-600" : risk >= 40 ? "text-amber-500" : "text-emerald-600"}`}
                >
                  {risk}%
                </motion.span>
                <span className="text-xs font-bold text-slate-400 mt-1">Risk Score</span>
              </div>
            </div>
            <div className="mt-2 text-center">
              <Badge color={levelColor as any} size="md">{level} Risk</Badge>
            </div>
          </div>

          {/* Prediction status */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className={`inline-flex items-center gap-3 px-6 py-3.5 rounded-2xl text-base font-extrabold ${positive ? "bg-red-100 text-red-700 border border-red-200" : "bg-emerald-100 text-emerald-700 border border-emerald-200"}`}
            >
              {positive
                ? <AlertTriangle className="w-5 h-5" />
                : <CheckCircle className="w-5 h-5" />}
              {positive ? "Diabetes Positive" : "Diabetes Negative"}
            </motion.div>

            <p className="text-sm text-slate-600 leading-relaxed">
              {positive
                ? "Based on your clinical biomarker profile, the Random Forest classifier has predicted high probability indicators consistent with Type 2 diabetes. We strongly suggest scheduling a clinical consultation."
                : "Your biomarker profile shows low diabetes probability indicators. Continue logging healthy clinical metrics and maintain routine checkups."}
            </p>

            <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
              <Info className="w-4 h-4 text-blue-500 shrink-0" />
              <span>AI Classifier metrics: RandomForest (estimators=200, depth=8, random_state=42)</span>
            </div>
          </div>

          {/* Radar */}
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 text-center">Risk Factor Profile</div>
            <ResponsiveContainer width="100%" height={170}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#E2E8F0" />
                <PolarAngleAxis dataKey="factor" tick={{ fontSize: 9, fill: "#94a3b8" }} />
                <Radar dataKey="value" stroke={positive ? "#EF4444" : "#10B981"} fill={positive ? "#EF4444" : "#10B981"} fillOpacity={0.15} strokeWidth={2} />
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #e2e8f0" }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </GlassCard>

      {/* AI Factor breakdown */}
      <GlassCard className="p-6 hover:shadow-none">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center">
            <Brain className="w-4 h-4 text-blue-600" />
          </div>
          <h3 className="font-bold text-slate-800">AI Clinical Explanation</h3>
          <Badge color="blue">{factors.length} key factor{factors.length > 1 ? "s" : ""}</Badge>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          {factors.map((f) => (
            <div key={f.label} className={`p-4 rounded-2xl border ${f.severity === "high" ? "bg-red-50 border-red-200" : f.severity === "moderate" ? "bg-amber-50 border-amber-200" : "bg-blue-50 border-blue-200"}`}>
              <div className={`text-xs font-extrabold uppercase tracking-wide mb-2 ${f.severity === "high" ? "text-red-600" : f.severity === "moderate" ? "text-amber-600" : "text-blue-600"}`}>
                {f.severity === "high" ? "⚠ High Risk" : f.severity === "moderate" ? "⚡ Moderate" : "✓ Normal"} Factor
              </div>
              <div className="font-bold text-slate-800 text-sm mb-1">{f.label}</div>
              <div className={`text-xl font-extrabold ${f.severity === "high" ? "text-red-600" : f.severity === "moderate" ? "text-amber-500" : "text-emerald-600"} mb-1`}>
                {f.value} <span className="text-sm font-medium">{f.unit}</span>
              </div>
              <div className="text-xs text-slate-500">Normal: {f.threshold}</div>
              <div className={`text-xs font-semibold mt-1.5 ${f.severity === "high" ? "text-red-600" : f.severity === "moderate" ? "text-amber-600" : "text-blue-600"}`}>{f.detail}</div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Risk meter bars */}
      <GlassCard className="p-6 hover:shadow-none">
        <h3 className="font-bold text-slate-800 mb-5 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-blue-600" />
          Biomarker Risk Contribution
        </h3>
        <div className="space-y-3.5">
          {contributions.map((r, i) => (
            <div key={r.label} className="flex items-center gap-4">
              <span className="text-xs font-semibold text-slate-500 w-32 shrink-0">{r.label}</span>
              <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: r.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${r.pct}%` }}
                  transition={{ delay: 0.2 + i * 0.1, duration: 0.7, ease: "easeOut" }}
                />
              </div>
              <span className="text-xs font-extrabold text-slate-700 w-8 text-right">{r.pct}%</span>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Recommendations */}
      <GlassCard className="p-6 hover:shadow-none">
        <h3 className="font-bold text-slate-800 mb-5">Personalized Clinical Recommendations</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {recs.map((r, i) => (
            <motion.div
              key={i}
              whileHover={{ x: 4 }}
              className="flex items-start gap-4 p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:border-blue-200 transition-all cursor-default"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${r.color} flex items-center justify-center shrink-0 shadow-sm`}>
                <r.icon className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="font-bold text-slate-800 text-sm mb-1">{r.title}</div>
                <div className="text-xs text-slate-500 leading-relaxed">{r.desc}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </GlassCard>

      <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
        <PrimaryBtn onClick={onReset} className="px-8">
          <RotateCcw className="w-4 h-4" /> Take New Test
        </PrimaryBtn>
        <SecondaryBtn className="px-8">
          <Stethoscope className="w-4 h-4" /> Share with Doctor
        </SecondaryBtn>
      </div>

      <p className="text-center text-xs text-slate-400 pb-4">
        This AI assessment is for informational purposes only and does not constitute medical diagnosis or treatment advice.
      </p>
    </motion.div>
  );
}

/* ─── Main Test Page ─── */
export default function TestPage({ navigate }: { navigate: (p: Page) => void }) {
  const [step, setStep] = useState(0);
  const [view, setView] = useState<"form" | "result">("form");
  const [form, setForm] = useState({
    age: "", gender: "Female", height: "", weight: "", bmi: "",
    pregnancies: "0", glucose: "", bloodPressure: "", skinThickness: "",
    insulin: "", pedigree: "0.5",
    smoking: "Never", activity: "Moderate", familyHistory: "No",
    diet: "Good", stress: 5,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [predictionResult, setPredictionResult] = useState<PredictionResponse | null>(null);

  useEffect(() => {
    if (!api.isAuthenticated()) {
      navigate("login");
    } else {
      // Pre-fill age and gender from logged-in user profile cache if available
      const cached = api.getCurrentUserCached();
      if (cached) {
        setForm(f => ({
          ...f,
          age: cached.age.toString(),
          gender: cached.gender
        }));
      }
    }
  }, [navigate]);

  const update = (k: string, v: string | number) => {
    setForm((f) => {
      const n = { ...f, [k]: v };
      if ((k === "height" || k === "weight") && n.height && n.weight) {
        const h = parseFloat(n.height) / 100;
        const w = parseFloat(n.weight);
        if (h > 0) n.bmi = (w / (h * h)).toFixed(1);
      }
      return n;
    });
  };

  const handleAnalyze = async () => {
    const pregnanciesVal = parseInt(form.pregnancies) || 0;
    const glucoseVal = parseFloat(form.glucose);
    const bpVal = parseFloat(form.bloodPressure);
    const skinVal = parseFloat(form.skinThickness);
    const insulinVal = parseFloat(form.insulin);
    const bmiVal = parseFloat(form.bmi);
    const pedigreeVal = parseFloat(form.pedigree);
    const ageVal = parseInt(form.age);

    if (isNaN(glucoseVal) || isNaN(bpVal) || isNaN(skinVal) || isNaN(insulinVal) || isNaN(bmiVal) || isNaN(pedigreeVal) || isNaN(ageVal)) {
      setError("Please fill in all clinical biomarkers before analyzing.");
      return;
    }

    setError("");
    setLoading(true);
    try {
      const result = await api.predict({
        pregnancies: pregnanciesVal,
        glucose: glucoseVal,
        bloodPressure: bpVal,
        skinThickness: skinVal,
        insulin: insulinVal,
        bmi: bmiVal,
        diabetesPedigreeFunction: pedigreeVal,
        age: ageVal
      });
      setPredictionResult(result);
      setView("result");
    } catch (err: any) {
      setError(err.message || "Failed to submit biomarker data to AI server.");
    } finally {
      setLoading(false);
    }
  };

  if (view === "result" && predictionResult) {
    return (
      <PageWrapper className="min-h-screen bg-[#F8FAFC] pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <SectionLabel>AI Analysis Complete</SectionLabel>
            <h1 className="text-4xl font-extrabold text-slate-900 mt-3">Your Risk Assessment</h1>
            <p className="text-slate-500 mt-2">Analyzed by DIAB-CARE Random Forest Model</p>
          </div>
          <ResultView predictionResult={predictionResult} form={form} onReset={() => { setView("form"); setStep(0); }} />
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <section className="relative pt-32 pb-10">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/60 to-transparent" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <SectionLabel>AI Medical Analysis</SectionLabel>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight"
          >
            Diabetes Risk Assessment
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="text-slate-500 text-lg"
          >
            Complete the form below — our AI analyzes 8 clinical biomarkers and returns your risk score in seconds.
          </motion.p>
        </div>
      </section>

      {/* Form */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-24">
        <StepBar step={step} />

        <AnimatePresence mode="wait">
          {/* Step 0: Personal */}
          {step === 0 && (
            <motion.div key="step0" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
              <GlassCard className="p-8 hover:shadow-none">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="font-extrabold text-slate-800 text-lg">Personal Information</h2>
                    <p className="text-xs text-slate-400">Basic data used to calibrate the AI model</p>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-5">
                  <InputField label="Age (years)" type="number" placeholder="35" value={form.age} onChange={(e: any) => update("age", e.target.value)} />
                  <SelectField label="Biological Sex" options={["Female", "Male"]} value={form.gender} onChange={(e: any) => update("gender", e.target.value)} />
                  <InputField label="Height (cm)" type="number" placeholder="165" value={form.height} onChange={(e: any) => update("height", e.target.value)} />
                  <InputField label="Weight (kg)" type="number" placeholder="68" value={form.weight} onChange={(e: any) => update("weight", e.target.value)} />
                  <div className="sm:col-span-2">
                    <InputField label="BMI (auto-calculated)" readOnly value={form.bmi ? `${form.bmi} kg/m²` : "Enter height and weight"} />
                    {form.bmi && (
                      <div className="mt-2 text-xs font-semibold text-blue-600">
                        {parseFloat(form.bmi) < 18.5 ? "⚠ Underweight" : parseFloat(form.bmi) < 25 ? "✓ Normal weight" : parseFloat(form.bmi) < 30 ? "⚡ Overweight" : "⚠ Obese"}
                      </div>
                    )}
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          )}

          {/* Step 1: Clinical */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
              <GlassCard className="p-8 hover:shadow-none">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-cyan-100 rounded-xl flex items-center justify-center">
                    <FlaskConical className="w-5 h-5 text-cyan-600" />
                  </div>
                  <div>
                    <h2 className="font-extrabold text-slate-800 text-lg">Clinical Biomarkers</h2>
                    <p className="text-xs text-slate-400">Laboratory values from your latest blood test</p>
                  </div>
                </div>
                <div className="p-3.5 bg-blue-50 border border-blue-100 rounded-xl mb-5 flex items-center gap-2 text-xs text-blue-700">
                  <Info className="w-4 h-4 shrink-0" />
                  <span>All fields below are required by the AI model. Fill in accurate values for precise results.</span>
                </div>
                <div className="grid sm:grid-cols-2 gap-5">
                  {[
                    { key: "pregnancies", label: "Pregnancies (0 if male)", ph: "0", tip: "Number of times pregnant" },
                    { key: "glucose", label: "Fasting Glucose (mg/dL)", ph: "120", tip: "Normal range: 70–99 mg/dL" },
                    { key: "bloodPressure", label: "Diastolic Blood Pressure (mmHg)", ph: "80", tip: "Normal range: < 80 mmHg" },
                    { key: "skinThickness", label: "Triceps Skin Thickness (mm)", ph: "20", tip: "Body fat measure (default ~20)" },
                    { key: "insulin", label: "2-Hour Serum Insulin (μU/mL)", ph: "85", tip: "Normal range: < 166 μU/mL" },
                    { key: "pedigree", label: "Diabetes Pedigree Function", ph: "0.45", tip: "Genetic score range: 0.08 – 2.42" },
                  ].map((f) => (
                    <div key={f.key} className="space-y-1">
                      <InputField
                        label={f.label}
                        type="number"
                        placeholder={f.ph}
                        value={(form as any)[f.key]}
                        onChange={(e: any) => update(f.key, e.target.value)}
                      />
                      <p className="text-[10px] text-slate-400 pl-1">{f.tip}</p>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          )}

          {/* Step 2: Lifestyle */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
              <GlassCard className="p-8 hover:shadow-none">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center">
                    <Heart className="w-5 h-5 text-rose-600" />
                  </div>
                  <div>
                    <h2 className="font-extrabold text-slate-800 text-lg">Lifestyle & History</h2>
                    <p className="text-xs text-slate-400">Behavioral factors that influence diabetes risk</p>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-5">
                  <SelectField label="Smoking Status" options={["Never", "Former (>1 year ago)", "Current"]} value={form.smoking} onChange={(e: any) => update("smoking", e.target.value)} />
                  <SelectField label="Physical Activity Level" options={["Sedentary (< 1 day/week)", "Light (1–2 days/week)", "Moderate (3–4 days/week)", "Active (5+ days/week)"]} value={form.activity} onChange={(e: any) => update("activity", e.target.value)} />
                  <SelectField label="Family History of Diabetes" options={["No family history", "One parent", "Both parents", "Sibling"]} value={form.familyHistory} onChange={(e: any) => update("familyHistory", e.target.value)} />
                  <SelectField label="Diet Quality" options={["Poor (processed foods)", "Fair", "Good (balanced)", "Excellent (whole foods)"]} value={form.diet} onChange={(e: any) => update("diet", e.target.value)} />
                  <div className="sm:col-span-2 space-y-2">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                      Perceived Stress Level — <span className="text-blue-600">{form.stress}/10</span>
                    </label>
                    <input
                      type="range" min={1} max={10} value={form.stress}
                      onChange={(e) => update("stress", parseInt(e.target.value))}
                      className="w-full accent-blue-600 h-2 cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>1 — Very Low</span>
                      <span className={form.stress >= 7 ? "text-red-500 font-semibold" : form.stress >= 5 ? "text-amber-500 font-semibold" : "text-emerald-600 font-semibold"}>
                        {form.stress >= 8 ? "High Stress" : form.stress >= 5 ? "Moderate" : "Low Stress"}
                      </span>
                      <span>10 — Extreme</span>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }} className="space-y-5">
              <GlassCard className="p-8 hover:shadow-none">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center">
                    <Brain className="w-5 h-5 text-violet-600" />
                  </div>
                  <div>
                    <h2 className="font-extrabold text-slate-800 text-lg">Review & Analyze</h2>
                    <p className="text-xs text-slate-400">Verify your data before AI analysis</p>
                  </div>
                </div>
                <div className="grid sm:grid-cols-3 gap-3 mb-6">
                  {[
                    { label: "Age", value: form.age || "—", icon: User },
                    { label: "Gender", value: form.gender, icon: User },
                    { label: "BMI", value: form.bmi ? `${form.bmi} kg/m²` : "—", icon: Activity },
                    { label: "Glucose", value: form.glucose ? `${form.glucose} mg/dL` : "—", icon: Droplets },
                    { label: "Blood Pressure", value: form.bloodPressure ? `${form.bloodPressure} mmHg` : "—", icon: Heart },
                    { label: "Insulin", value: form.insulin ? `${form.insulin} μU/mL` : "—", icon: FlaskConical },
                  ].map((item) => (
                    <div key={item.label} className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                      <item.icon className="w-4 h-4 text-slate-400 mb-2" />
                      <div className="text-xs text-slate-400 font-semibold uppercase tracking-wide">{item.label}</div>
                      <div className="font-extrabold text-slate-800 mt-0.5">{item.value}</div>
                    </div>
                  ))}
                </div>

                {error && (
                  <div className="p-3.5 bg-red-100 border border-red-200 text-red-700 text-xs font-semibold rounded-xl text-center mb-4">
                    {error}
                  </div>
                )}

                {/* CTA */}
                <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl p-6 text-white text-center space-y-4">
                  <div className="w-14 h-14 bg-white/15 rounded-2xl flex items-center justify-center mx-auto border border-white/25">
                    <Brain className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-xl mb-1">Ready to Analyze</h3>
                    <p className="text-blue-100 text-sm">Our Random Forest model will evaluate your biomarkers and return diagnostic probability scores.</p>
                  </div>
                  <motion.button
                    onClick={handleAnalyze}
                    disabled={loading}
                    whileHover={{ scale: loading ? 1 : 1.04 }}
                    whileTap={{ scale: loading ? 1 : 0.96 }}
                    className="inline-flex items-center gap-3 px-10 py-4 bg-white text-blue-700 font-extrabold rounded-xl shadow-xl hover:bg-blue-50 transition-colors text-base disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                          className="w-4 h-4 border-2 border-blue-700/30 border-t-blue-700 rounded-full"
                        />
                        Calculating...
                      </>
                    ) : (
                      <>
                        <Brain className="w-5 h-5" /> Analyze with AI <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </motion.button>
                  <p className="text-blue-200 text-xs">Not a substitute for professional medical advice</p>
                </div>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        {step < 3 && (
          <div className="flex gap-3 mt-5">
            {step > 0 && (
              <button
                onClick={() => setStep((s) => s - 1)}
                className="flex-none px-6 py-3.5 border-2 border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:border-blue-300 hover:text-blue-700 transition-all"
              >
                Back
              </button>
            )}
            <motion.button
              onClick={() => {
                if (step === 0 && (!form.age || !form.gender || !form.height || !form.weight)) {
                  setError("Please fill in age, gender, height, and weight.");
                  return;
                }
                setError("");
                setStep((s) => s + 1);
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 flex items-center justify-center gap-2.5 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-xl shadow-[0_4px_18px_rgba(37,99,235,0.35)] text-sm"
            >
              Continue <ChevronRight className="w-4 h-4" />
            </motion.button>
          </div>
        )}
      </section>
    </PageWrapper>
  );
}
