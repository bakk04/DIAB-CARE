import { useState } from "react";
import { motion } from "motion/react";
import {
  Activity, Heart, Droplets, Brain, TrendingUp, FlaskConical,
  CalendarDays, Bell, Settings, Download, Plus,
  CheckCircle, AlertTriangle, Clock, ChevronRight,
} from "lucide-react";
import {
  AreaChart, Area, LineChart, Line, ResponsiveContainer,
  CartesianGrid, XAxis, YAxis, Tooltip,
} from "recharts";
import {
  GlassCard, Badge, SectionLabel, PrimaryBtn, fadeUp, stagger, PageWrapper, StatCard,
} from "../components/ui";
import type { Page } from "../components/ui";

const glucoseData = [
  { m: "Jan", v: 95 }, { m: "Feb", v: 102 }, { m: "Mar", v: 98 },
  { m: "Apr", v: 115 }, { m: "May", v: 108 }, { m: "Jun", v: 99 },
  { m: "Jul", v: 96 }, { m: "Aug", v: 103 },
];
const riskData = [
  { m: "Jan", v: 12 }, { m: "Feb", v: 15 }, { m: "Mar", v: 13 },
  { m: "Apr", v: 22 }, { m: "May", v: 18 }, { m: "Jun", v: 14 },
  { m: "Jul", v: 11 }, { m: "Aug", v: 13 },
];
const bmiData = [
  { m: "Jan", v: 24.2 }, { m: "Feb", v: 24.0 }, { m: "Mar", v: 23.8 },
  { m: "Apr", v: 23.9 }, { m: "May", v: 23.5 }, { m: "Jun", v: 23.3 },
  { m: "Jul", v: 23.1 }, { m: "Aug", v: 22.9 },
];

const history = [
  { date: "Aug 15, 2024", pred: "Negative", risk: "Low", prob: "13%", glucose: "96 mg/dL", status: "Healthy" },
  { date: "Jun 14, 2024", pred: "Negative", risk: "Low", prob: "14%", glucose: "99 mg/dL", status: "Healthy" },
  { date: "Apr 02, 2024", pred: "Negative", risk: "Moderate", prob: "22%", glucose: "115 mg/dL", status: "Monitor" },
  { date: "Jan 18, 2024", pred: "Negative", risk: "Low", prob: "12%", glucose: "95 mg/dL", status: "Healthy" },
  { date: "Oct 05, 2023", pred: "Positive", risk: "High", prob: "71%", glucose: "148 mg/dL", status: "At Risk" },
];

const insights = [
  { icon: TrendingUp, text: "Your glucose levels have improved 8% over the last 3 months.", color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200" },
  { icon: AlertTriangle, text: "April spike: Glucose reached 115 mg/dL. Schedule a follow-up HbA1c test.", color: "text-amber-600", bg: "bg-amber-50 border-amber-200" },
  { icon: CheckCircle, text: "BMI consistently improving — down 1.3 points since January.", color: "text-blue-600", bg: "bg-blue-50 border-blue-200" },
];

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

  const chartMap = {
    glucose: { data: glucoseData, color: "#2563EB", label: "Blood Glucose (mg/dL)", gradient: "cgBlue" },
    risk: { data: riskData, color: "#EF4444", label: "Diabetes Risk Score (%)", gradient: "cgRed" },
    bmi: { data: bmiData, color: "#10B981", label: "BMI (kg/m²)", gradient: "cgGreen" },
  };

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
                SJ
              </div>
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900">Sarah Johnson</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-slate-500">Patient ID: #48291</span>
                <span className="text-slate-300">·</span>
                <Badge color="green" size="sm">Low Risk</Badge>
              </div>
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className="flex items-center gap-2">
            <button className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-blue-50 hover:border-blue-200 transition-all text-slate-500 hover:text-blue-600">
              <Bell className="w-4 h-4" />
            </button>
            <button className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-blue-50 hover:border-blue-200 transition-all text-slate-500 hover:text-blue-600">
              <Download className="w-4 h-4" />
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
            { icon: Activity, label: "Diabetes Risk", value: "Low", sub: "Last: Aug 2024", gradient: "from-emerald-500 to-teal-600" },
            { icon: TrendingUp, label: "BMI", value: "22.9", sub: "Normal range", gradient: "from-blue-500 to-blue-700" },
            { icon: Droplets, label: "Glucose", value: "96 mg/dL", sub: "Normal fasting", gradient: "from-cyan-500 to-cyan-700" },
            { icon: Heart, label: "Blood Pressure", value: "118/76", sub: "Optimal", gradient: "from-rose-500 to-rose-700" },
            { icon: Brain, label: "AI Risk Score", value: "13%", sub: "Low probability", gradient: "from-violet-500 to-violet-700" },
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
                <p className="text-xs text-slate-400 mt-0.5">8-month longitudinal tracking</p>
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
            { title: "Blood Sugar History", subtitle: "Avg 102 mg/dL · Stable", data: glucoseData, color: "#2563EB", gradient: "miniBlue", trend: "+2%", trendOk: true },
            { title: "Risk Evolution", subtitle: "Declining trend · Good", data: riskData, color: "#EF4444", gradient: "miniRed", trend: "-38%", trendOk: true },
            { title: "BMI Evolution", subtitle: "Improving · On target", data: bmiData, color: "#10B981", gradient: "miniGreen", trend: "-5.4%", trendOk: true },
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
                <p className="text-xs text-slate-400 mt-0.5">All AI assessments · {history.length} records</p>
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
                  {history.map((row, i) => (
                    <motion.tr
                      key={i}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 + i * 0.05 }}
                      className="border-b border-slate-50 hover:bg-blue-50/40 transition-colors group"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <CalendarDays className="w-3.5 h-3.5 text-slate-300" />
                          <span className="text-slate-700 font-semibold text-sm">{row.date}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <Badge color={row.pred === "Negative" ? "green" : "red"}>{row.pred}</Badge>
                      </td>
                      <td className="py-4 px-6">
                        <Badge color={row.risk === "Low" ? "green" : row.risk === "Moderate" ? "yellow" : "red"}>{row.risk}</Badge>
                      </td>
                      <td className="py-4 px-6 font-semibold text-slate-700 text-sm">{row.glucose}</td>
                      <td className="py-4 px-6">
                        <span className={`font-extrabold text-sm ${row.pred === "Positive" ? "text-red-600" : "text-emerald-600"}`}>{row.prob}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`text-xs font-bold ${row.status === "Healthy" ? "text-emerald-600" : row.status === "Monitor" ? "text-amber-600" : "text-red-600"}`}>
                          {row.status}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
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
                <div className="text-blue-100 text-sm">Recommended every 3 months · Due: November 15, 2024</div>
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
