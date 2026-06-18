import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Activity, Heart, Droplets, Brain, TrendingUp, FlaskConical,
  CalendarDays, Bell, Settings, Download, Plus,
  CheckCircle, AlertTriangle, Clock, ChevronRight, LogOut,
} from "lucide-react";
import {
  AreaChart, Area, ResponsiveContainer,
  CartesianGrid, XAxis, YAxis, Tooltip,
} from "recharts";
import {
  GlassCard, Badge, SectionLabel, PrimaryBtn, fadeUp, stagger, PageWrapper, StatCard,
} from "../components/ui";
import type { Page } from "../components/ui";
import { api, UserProfileResponse } from "../app/api";

function MiniChart({ data, color, gradient }: { data: any[]; color: string; gradient: string }) {
  return (
    <ResponsiveContainer width="100%" height={80}>
      <AreaChart data={data} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={gradient} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.2} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area type="monotone" dataKey="v" stroke={color} strokeWidth={2} fill={`url(#${gradient})`} dot={false} />
        <Tooltip
          contentStyle={{ fontSize: 10, borderRadius: 8, border: "1px solid #e2e8f0", padding: "4px 8px" }}
          labelFormatter={() => ""}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export default function ProfilePage({ navigate }: { navigate: (p: Page) => void }) {
  const [activeChart, setActiveChart] = useState<"glucose" | "risk" | "bmi">("glucose");
  const [profile, setProfile] = useState<UserProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      const id = api.getCurrentUserId();
      if (!id) {
        navigate("login");
        return;
      }
      try {
        const data = await api.getProfile(id);
        setProfile(data);
      } catch (err: any) {
        setError(err.message || "Failed to load profile details.");
        if (err.message?.includes("credentials") || err.message?.includes("authorized")) {
          api.logout();
          navigate("login");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    api.logout();
    navigate("home");
  };

  if (loading) {
    return (
      <PageWrapper className="min-h-screen bg-[#F8FAFC] pt-24 pb-16 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full"
          />
          <p className="text-slate-500 font-bold text-sm">Fetching your clinical profile...</p>
        </div>
      </PageWrapper>
    );
  }

  const rawPredictions = profile?.predictions || [];
  const latestPred = rawPredictions[0];

  const initials = profile
    ? `${profile.firstname.charAt(0)}${profile.lastname.charAt(0)}`.toUpperCase()
    : "SJ";
  const fullName = profile ? `${profile.firstname} ${profile.lastname}` : "Sarah Johnson";
  const patientId = profile ? `#${profile.id.toString().padStart(5, "0")}` : "#48291";

  // Risk display helper
  const isHighRisk = latestPred ? latestPred.prediction === "Positive" : false;
  const riskLabel = latestPred ? (isHighRisk ? "High Risk" : "Low Risk") : "No Test Yet";
  const riskBadgeColor = latestPred ? (isHighRisk ? "red" : "green") : "gray";

  // Dynamic values
  const bmiVal = latestPred ? latestPred.bmi.toFixed(1) : "—";
  const glucoseVal = latestPred ? `${latestPred.glucose} mg/dL` : "—";
  const bpVal = latestPred ? `${Math.round(latestPred.blood_pressure)} mmHg` : "—";
  const probVal = latestPred ? `${Math.round(latestPred.probability)}%` : "—";

  // Dynamic charts
  const sortedPredictions = [...rawPredictions].reverse();
  const hasHistory = sortedPredictions.length > 0;

  const glucoseData = hasHistory
    ? sortedPredictions.map(p => ({
        m: new Date(p.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        v: p.glucose
      }))
    : [
        { m: "Jan", v: 95 }, { m: "Feb", v: 102 }, { m: "Mar", v: 98 },
        { m: "Apr", v: 115 }, { m: "May", v: 108 }, { m: "Jun", v: 99 },
        { m: "Jul", v: 96 }, { m: "Aug", v: 103 },
      ];

  const riskData = hasHistory
    ? sortedPredictions.map(p => ({
        m: new Date(p.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        v: Math.round(p.probability)
      }))
    : [
        { m: "Jan", v: 12 }, { m: "Feb", v: 15 }, { m: "Mar", v: 13 },
        { m: "Apr", v: 22 }, { m: "May", v: 18 }, { m: "Jun", v: 14 },
        { m: "Jul", v: 11 }, { m: "Aug", v: 13 },
      ];

  const bmiData = hasHistory
    ? sortedPredictions.map(p => ({
        m: new Date(p.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        v: p.bmi
      }))
    : [
        { m: "Jan", v: 24.2 }, { m: "Feb", v: 24.0 }, { m: "Mar", v: 23.8 },
        { m: "Apr", v: 23.9 }, { m: "May", v: 23.5 }, { m: "Jun", v: 23.3 },
        { m: "Jul", v: 23.1 }, { m: "Aug", v: 22.9 },
      ];

  const chartMap = {
    glucose: { data: glucoseData, color: "#2563EB", label: "Blood Glucose (mg/dL)", gradient: "cgBlue" },
    risk: { data: riskData, color: "#EF4444", label: "Diabetes Risk Score (%)", gradient: "cgRed" },
    bmi: { data: bmiData, color: "#10B981", label: "BMI (kg/m²)", gradient: "cgGreen" },
  };

  // Dynamic insights
  const insights = [];
  if (latestPred) {
    if (isHighRisk) {
      insights.push({
        icon: AlertTriangle,
        text: `Attention: Last glucose check is ${latestPred.glucose} mg/dL, indicating high risk. Please see a physician.`,
        color: "text-red-600",
        bg: "bg-red-50 border-red-200"
      });
    } else {
      insights.push({
        icon: CheckCircle,
        text: `Optimal: Last assessment indicates Low Risk with healthy fasting glucose (${latestPred.glucose} mg/dL).`,
        color: "text-emerald-600",
        bg: "bg-emerald-50 border-emerald-200"
      });
    }

    if (latestPred.bmi >= 25.0) {
      insights.push({
        icon: AlertTriangle,
        text: `Elevated BMI of ${latestPred.bmi.toFixed(1)} kg/m². Adopting standard cardiovascular workouts is advised.`,
        color: "text-amber-600",
        bg: "bg-amber-50 border-amber-200"
      });
    } else {
      insights.push({
        icon: CheckCircle,
        text: `Normal weight: BMI of ${latestPred.bmi.toFixed(1)} kg/m² sits comfortably in the safe zone.`,
        color: "text-blue-600",
        bg: "bg-blue-50 border-blue-200"
      });
    }

    if (latestPred.blood_pressure >= 80) {
      insights.push({
        icon: AlertTriangle,
        text: `Diastolic Blood Pressure is ${latestPred.blood_pressure} mmHg. Avoid highly refined sugars and excess salt.`,
        color: "text-amber-600",
        bg: "bg-amber-50 border-amber-200"
      });
    } else {
      insights.push({
        icon: CheckCircle,
        text: `Healthy Blood Pressure: Diastolic reading of ${latestPred.blood_pressure} mmHg shows strong cardiovascular status.`,
        color: "text-emerald-600",
        bg: "bg-emerald-50 border-emerald-200"
      });
    }
  } else {
    insights.push(
      { icon: TrendingUp, text: "No test records found yet. Complete a test to run our AI diagnostic models.", color: "text-blue-600", bg: "bg-blue-50 border-blue-200" },
      { icon: CheckCircle, text: "Clinical accuracy is 95.3% when utilizing genuine recent laboratory biomarkers.", color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200" },
      { icon: Clock, text: "Recommended testing interval is every 3 months to map pre-diabetic trends.", color: "text-amber-600", bg: "bg-amber-50 border-amber-200" }
    );
  }

  // Mini Chart stats
  const avgGlucose = hasHistory
    ? Math.round(rawPredictions.reduce((acc, curr) => acc + curr.glucose, 0) / rawPredictions.length)
    : 102;
  const avgRisk = hasHistory
    ? Math.round(rawPredictions.reduce((acc, curr) => acc + curr.probability, 0) / rawPredictions.length)
    : 13;
  const avgBmi = hasHistory
    ? (rawPredictions.reduce((acc, curr) => acc + curr.bmi, 0) / rawPredictions.length).toFixed(1)
    : "22.9";

  return (
    <PageWrapper className="min-h-screen bg-[#F8FAFC] pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">

        {/* ── PROFILE HEADER ── */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={stagger(0.08)}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-5"
        >
          <motion.div variants={fadeUp} className="flex items-center gap-5">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white text-xl font-extrabold shadow-xl">
                {initials}
              </div>
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900">{fullName}</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-slate-500">Patient ID: {patientId}</span>
                <span className="text-slate-300">·</span>
                <Badge color={riskBadgeColor} size="sm">{riskLabel}</Badge>
              </div>
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className="flex items-center gap-2">
            <button className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-blue-50 hover:border-blue-200 transition-all text-slate-500 hover:text-blue-600">
              <Bell className="w-4 h-4" />
            </button>
            <button
              onClick={handleLogout}
              className="p-2.5 rounded-xl border border-red-200 bg-white hover:bg-red-50 hover:border-red-300 transition-all text-red-500"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
            <button className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-blue-50 hover:border-blue-200 transition-all text-slate-500 hover:text-blue-600">
              <Settings className="w-4 h-4" />
            </button>
            <PrimaryBtn onClick={() => navigate("test")} className="py-2.5 px-5 text-sm">
              <Plus className="w-4 h-4" /> New Test
            </PrimaryBtn>
          </motion.div>
        </motion.div>

        {/* ── HEALTH SCORE CARDS ── */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={stagger(0.07)}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4"
        >
          {[
            { icon: Activity, label: "Diabetes Risk", value: latestPred ? (isHighRisk ? "Positive" : "Negative") : "None", sub: latestPred ? "Model Assessed" : "No tests yet", gradient: isHighRisk ? "from-red-500 to-rose-600" : "from-emerald-500 to-teal-600" },
            { icon: TrendingUp, label: "BMI", value: bmiVal, sub: "Calculated BMI", gradient: "from-blue-500 to-blue-700" },
            { icon: Droplets, label: "Glucose", value: glucoseVal, sub: "Last Fasting Sugar", gradient: "from-cyan-500 to-cyan-700" },
            { icon: Heart, label: "Blood Pressure", value: bpVal, sub: "Diastolic Pressure", gradient: "from-rose-500 to-rose-700" },
            { icon: Brain, label: "AI Probability", value: probVal, sub: "Bayesian probability", gradient: "from-violet-500 to-violet-700" },
          ].map((c) => (
            <motion.div key={c.label} variants={fadeUp}>
              <StatCard icon={c.icon} label={c.label} value={c.value} sub={c.sub} gradient={c.gradient} />
            </motion.div>
          ))}
        </motion.div>

        {/* ── AI INSIGHTS ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-3"
        >
          <SectionLabel>AI Health Insights</SectionLabel>
          <div className="grid sm:grid-cols-3 gap-3">
            {insights.map((ins, i) => (
              <div key={i} className={`flex items-start gap-3 p-4 rounded-2xl border ${ins.bg}`}>
                <ins.icon className={`w-4 h-4 mt-0.5 shrink-0 ${ins.color}`} />
                <p className={`text-sm leading-relaxed ${ins.color.replace("600", "800")}`}>{ins.text}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── TREND CHART ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <GlassCard className="p-6 hover:shadow-none">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
              <div>
                <h3 className="font-extrabold text-slate-800">Health Trends</h3>
                <p className="text-xs text-slate-400 mt-0.5">{hasHistory ? `${rawPredictions.length} clinical evaluations registered` : "8-month longitudinal tracking (demo)"}</p>
              </div>
              <div className="flex gap-2">
                {(["glucose", "risk", "bmi"] as const).map((k) => (
                  <button
                    key={k}
                    onClick={() => setActiveChart(k)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeChart === k ? "bg-blue-600 text-white shadow-md" : "bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-700"}`}
                  >
                    {k === "glucose" ? "Glucose" : k === "risk" ? "Risk" : "BMI"}
                  </button>
                ))}
              </div>
            </div>
            <div className="text-xs font-semibold text-slate-500 mb-3">{chartMap[activeChart].label}</div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={chartMap[activeChart].data}>
                <defs>
                  <linearGradient id="mainGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={chartMap[activeChart].color} stopOpacity={0.2} />
                    <stop offset="95%" stopColor={chartMap[activeChart].color} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="m" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} width={32} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 10, border: "1px solid #e2e8f0", background: "white" }} />
                <Area
                  type="monotone"
                  dataKey="v"
                  stroke={chartMap[activeChart].color}
                  strokeWidth={2.5}
                  fill="url(#mainGrad)"
                  dot={{ fill: chartMap[activeChart].color, strokeWidth: 0, r: 3 }}
                  activeDot={{ r: 5, fill: chartMap[activeChart].color }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </GlassCard>
        </motion.div>

        {/* ── MINI CHARTS ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid sm:grid-cols-3 gap-4"
        >
          {[
            { title: "Blood Sugar History", subtitle: `Avg ${avgGlucose} mg/dL`, data: glucoseData, color: "#2563EB", gradient: "miniBlue", trend: hasHistory ? "Live" : "+2%", trendOk: true },
            { title: "Risk Evolution", subtitle: `Avg ${avgRisk}% probability`, data: riskData, color: "#EF4444", gradient: "miniRed", trend: hasHistory ? "Live" : "-38%", trendOk: true },
            { title: "BMI Evolution", subtitle: `Avg ${avgBmi} kg/m²`, data: bmiData, color: "#10B981", gradient: "miniGreen", trend: hasHistory ? "Live" : "-5.4%", trendOk: true },
          ].map((chart) => (
            <GlassCard key={chart.title} className="p-5">
              <div className="flex items-start justify-between mb-1">
                <div>
                  <div className="font-bold text-slate-800 text-sm">{chart.title}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{chart.subtitle}</div>
                </div>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-lg ${chart.trendOk ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                  {chart.trend}
                </span>
              </div>
              <MiniChart data={chart.data} color={chart.color} gradient={chart.gradient} />
            </GlassCard>
          ))}
        </motion.div>

        {/* ── HISTORY TABLE ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
        >
          <GlassCard className="hover:shadow-none overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-slate-800">Medical History</h3>
                <p className="text-xs text-slate-400 mt-0.5">All AI assessments · {rawPredictions.length} records</p>
              </div>
              <button className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors">
                View All <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50/80">
                    {["Date", "Prediction", "Risk Level", "Glucose", "Probability", "Status"].map((h) => (
                      <th key={h} className="text-left py-3 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rawPredictions.length > 0 ? (
                    rawPredictions.map((row, i) => (
                      <motion.tr
                        key={row.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 + i * 0.05 }}
                        className="border-b border-slate-50 hover:bg-blue-50/40 transition-colors group"
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <CalendarDays className="w-3.5 h-3.5 text-slate-300" />
                            <span className="text-slate-700 font-semibold text-sm">
                              {new Date(row.created_at).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <Badge color={row.prediction === "Negative" ? "green" : "red"}>{row.prediction}</Badge>
                        </td>
                        <td className="py-4 px-6">
                          <Badge color={row.risk_level === "Low Risk" ? "green" : row.risk_level === "Moderate Risk" ? "yellow" : "red"}>{row.risk_level}</Badge>
                        </td>
                        <td className="py-4 px-6 font-semibold text-slate-700 text-sm">{row.glucose} mg/dL</td>
                        <td className="py-4 px-6">
                          <span className={`font-extrabold text-sm ${row.prediction === "Positive" ? "text-red-600" : "text-emerald-600"}`}>{Math.round(row.probability)}%</span>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`text-xs font-bold ${row.prediction === "Negative" ? "text-emerald-600" : "text-red-600"}`}>
                            {row.prediction === "Negative" ? "Healthy" : "At Risk"}
                          </span>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400 font-semibold text-xs uppercase tracking-wide">
                        No medical assessments found. Take a free test below to begin!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </motion.div>

        {/* ── NEXT TEST REMINDER ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-5 text-white">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/15 rounded-xl flex items-center justify-center border border-white/20">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="font-extrabold text-lg">Next Assessment Due</div>
                <div className="text-blue-100 text-sm">Recommended every 3 months · Keep mapping your biomarkers.</div>
              </div>
            </div>
            <button
              onClick={() => navigate("test")}
              className="flex items-center gap-2.5 px-7 py-3.5 bg-white text-blue-700 font-extrabold rounded-xl hover:bg-blue-50 transition-all shadow-lg text-sm whitespace-nowrap"
            >
              <FlaskConical className="w-4 h-4" /> Start Now
            </button>
          </div>
        </motion.div>
      </div>
    </PageWrapper>
  );
}
