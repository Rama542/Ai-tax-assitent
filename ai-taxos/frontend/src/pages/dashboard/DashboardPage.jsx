import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
  ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight,
  Plus, FileText, Upload, Brain, CheckCircle, Circle, ExternalLink, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  REVENUE_MONTHLY, PROFIT_TREND, CASH_FLOW_SPARKLINE, EXPENSE_BREAKDOWN,
  RECENT_TRANSACTIONS, UPCOMING_TASKS, AI_INSIGHTS, formatINR, formatINRShort
} from '../../data/mockData';

// ─── Custom Tooltip ─────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <div className="label">{label}</div>
      {payload.map((p,i) => (
        <div key={i} style={{ color: p.color, fontWeight:700 }}>
          {p.name}: {formatINRShort(p.value)}
        </div>
      ))}
    </div>
  );
};

// ─── Stat Card ──────────────────────────────────────────
function StatCard({ label, value, change, positive, icon, iconBg, iconColor }) {
  return (
    <motion.div className="stat-card" initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.35 }}>
      <div className="stat-icon-wrap" style={{ background: iconBg }}>
        <span style={{ fontSize:22, color: iconColor }}>{icon}</span>
      </div>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      <div className={`stat-change ${positive===false?'down':'up'}`}>
        {positive===false ? <ArrowDownRight size={14}/> : <ArrowUpRight size={14}/>}
        {change} <span className="stat-compare" style={{ fontWeight:400, color:'var(--text-secondary)' }}>vs last month</span>
      </div>
    </motion.div>
  );
}

// ─── Transaction badge ──────────────────────────────────
function TxnBadge({ type }) {
  const map = { revenue:{bg:'#E6FAF5',color:'#01B574',label:'Revenue'}, expense:{bg:'#FDECEA',color:'#EE5D50',label:'Expense'}, purchase:{bg:'#EEF4FF',color:'#3965FF',label:'Purchase'}, sales:{bg:'#F2EFFF',color:'#7B5EA7',label:'Sales'} };
  const t = map[type] || map.revenue;
  return <span style={{ background:t.bg, color:t.color, fontSize:11, fontWeight:700, padding:'2px 10px', borderRadius:99 }}>{t.label}</span>;
}

const TXN_ICON = { revenue:'🟢', expense:'🔴', purchase:'🔵', sales:'🟣' };

// ─── Dashboard Page ─────────────────────────────────────
import { useAuth } from '../../contexts/AuthContext';
import { analyzeUserTaxData } from '../../utils/taxCalculator';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { userFinancials } = useAuth();
  const analysis = analyzeUserTaxData(userFinancials);

  const [revenueRange, setRevenueRange] = useState('Monthly');
  const [cashFlowRange, setCashFlowRange] = useState('This Month');
  const [expenseRange, setExpenseRange] = useState('Monthly');
  const [gstRange, setGstRange] = useState('This Month');

  const cashFlowData = CASH_FLOW_SPARKLINE.map((v,i)=>({ i, v }));

  const rev = userFinancials?.annualRevenue || 2478500;
  const exp = userFinancials?.annualExpenses || 1245300;
  const profit = userFinancials?.netProfit || (rev - exp);

  return (
    <div style={{ display:'flex', gap:20, alignItems:'flex-start' }}>
      {/* ── Left/Main ──────────────────────────────────── */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', gap:20, minWidth:0 }}>

        {/* Stat cards */}
        <div className="grid-4" style={{ gap:16 }}>
          <StatCard label="Total Revenue" value={`₹${rev.toLocaleString('en-IN')}`} change="18.5%" positive={true} icon="₹" iconBg="#E6FAF5" iconColor="#01B574" />
          <StatCard label="Total Expenses" value={`₹${exp.toLocaleString('en-IN')}`} change="12.2%" positive={false} icon="📤" iconBg="#FDECEA" iconColor="#EE5D50" />
          <StatCard label="Net Profit" value={`₹${profit.toLocaleString('en-IN')}`} change="26.1%" positive={true} icon="📈" iconBg="#F2EFFF" iconColor="#7B5EA7" />
          <StatCard label="GST Due" value={`₹${analysis.netGSTPayable.toLocaleString('en-IN')}`} change="4.3%" positive={false} icon="🧾" iconBg="#FFF4E0" iconColor="#FF9D00" />
        </div>

        {/* Charts row */}
        <div className="grid-2" style={{ gap:16 }}>
          {/* Revenue Overview */}
          <div className="card" style={{ padding:20 }}>
            <div className="card-header">
              <div>
                <div className="card-title">Revenue Overview</div>
                <div style={{ display:'flex', gap:14, marginTop:6 }}>
                  <span style={{ display:'flex', alignItems:'center', gap:5, fontSize:12, color:'var(--text-secondary)' }}><span style={{ width:10, height:10, borderRadius:2, background:'#4318FF', display:'inline-block' }} />Revenue</span>
                  <span style={{ display:'flex', alignItems:'center', gap:5, fontSize:12, color:'var(--text-secondary)' }}><span style={{ width:10, height:10, borderRadius:2, background:'#6AD2FF', display:'inline-block' }} />Expenses</span>
                </div>
              </div>
              <select value={revenueRange} onChange={e=>setRevenueRange(e.target.value)} className="form-input" style={{ width:'auto', padding:'5px 12px', fontSize:12 }}>
                <option>Monthly</option><option>Quarterly</option><option>Yearly</option>
              </select>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={REVENUE_MONTHLY} margin={{ top:4, right:4, bottom:0, left:-20 }} barGap={3}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize:11, fill:'var(--text-secondary)' }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={v=>formatINRShort(v)} tick={{ fontSize:10, fill:'var(--text-secondary)' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="revenue" fill="#4318FF" name="Revenue" radius={[4,4,0,0]} maxBarSize={24} />
                <Bar dataKey="expenses" fill="#6AD2FF" name="Expenses" radius={[4,4,0,0]} maxBarSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Profit Trend */}
          <div className="card" style={{ padding:20 }}>
            <div className="card-header">
              <div className="card-title">Profit Trend</div>
              <select className="form-input" style={{ width:'auto', padding:'5px 12px', fontSize:12 }}>
                <option>This Year</option><option>Last Year</option>
              </select>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={PROFIT_TREND} margin={{ top:4, right:4, bottom:0, left:-20 }}>
                <defs>
                  <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4318FF" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#4318FF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize:11, fill:'var(--text-secondary)' }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={v=>formatINRShort(v)} tick={{ fontSize:10, fill:'var(--text-secondary)' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="profit" name="Profit" stroke="#4318FF" strokeWidth={2.5} fill="url(#profitGrad)" dot={{ fill:'#4318FF', r:4 }} activeDot={{ r:6 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cash Flow + Expense Breakdown + GST Summary */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1.1fr 1fr', gap:16 }}>
          {/* Cash Flow */}
          <div className="card" style={{ padding:20 }}>
            <div className="card-header">
              <div className="card-title">Cash Flow</div>
              <select className="form-input" style={{ width:'auto', padding:'4px 10px', fontSize:11 }}>
                <option>This Month</option><option>Last Month</option>
              </select>
            </div>
            <div style={{ fontSize:24, fontWeight:800, color:'var(--text-primary)', letterSpacing:'-0.5px' }}>₹{profit.toLocaleString('en-IN')}</div>
            <div style={{ display:'flex', alignItems:'center', gap:5, fontSize:12, color:'var(--green)', marginTop:4, fontWeight:600 }}>
              <ArrowUpRight size={13} /> 14.5%
            </div>
            <ResponsiveContainer width="100%" height={60} style={{ marginTop:10 }}>
              <AreaChart data={cashFlowData} margin={{ top:0, right:0, bottom:0, left:0 }}>
                <defs><linearGradient id="cfGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#4318FF" stopOpacity={0.18}/><stop offset="95%" stopColor="#4318FF" stopOpacity={0}/></linearGradient></defs>
                <Area type="monotone" dataKey="v" stroke="#4318FF" strokeWidth={2} fill="url(#cfGrad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginTop:12 }}>
              <div>
                <div style={{ fontSize:11, color:'var(--text-secondary)', marginBottom:2 }}>Cash Inflow</div>
                <div style={{ fontSize:13.5, fontWeight:700, color:'var(--green)' }}>₹{rev.toLocaleString('en-IN')}</div>
              </div>
              <div>
                <div style={{ fontSize:11, color:'var(--text-secondary)', marginBottom:2 }}>Cash Outflow</div>
                <div style={{ fontSize:13.5, fontWeight:700, color:'var(--red)' }}>₹{exp.toLocaleString('en-IN')}</div>
              </div>
            </div>
          </div>

          {/* Expense Breakdown */}
          <div className="card" style={{ padding:20 }}>
            <div className="card-header">
              <div className="card-title">Expense Breakdown</div>
              <select className="form-input" style={{ width:'auto', padding:'4px 10px', fontSize:11 }}>
                <option>Monthly</option>
              </select>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:16 }}>
              <div style={{ position:'relative' }}>
                <ResponsiveContainer width={110} height={110}>
                  <PieChart>
                    <Pie data={EXPENSE_BREAKDOWN} dataKey="value" cx="50%" cy="50%" innerRadius={34} outerRadius={52} paddingAngle={2} startAngle={90} endAngle={-270}>
                      {EXPENSE_BREAKDOWN.map((e,i) => <Cell key={i} fill={e.color} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', textAlign:'center', pointerEvents:'none' }}>
                  <div style={{ fontSize:11, fontWeight:700, color:'var(--text-primary)' }}>₹{formatINRShort(exp)}</div>
                  <div style={{ fontSize:9, color:'var(--text-secondary)' }}>Total</div>
                </div>
              </div>
              <div style={{ flex:1, display:'flex', flexDirection:'column', gap:5 }}>
                {EXPENSE_BREAKDOWN.map(e => (
                  <div key={e.name} style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:5 }}>
                      <div style={{ width:8, height:8, borderRadius:2, background:e.color, flexShrink:0 }} />
                      <span style={{ fontSize:11.5, color:'var(--text-secondary)' }}>{e.name}</span>
                    </div>
                    <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                      <span style={{ fontSize:11.5, fontWeight:600, color:'var(--text-primary)' }}>{formatINRShort(e.value)}</span>
                      <span style={{ fontSize:10, color:'var(--text-muted)' }}>{e.pct}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* GST Summary */}
          <div className="card" style={{ padding:20 }}>
            <div className="card-header">
              <div className="card-title">GST Summary</div>
              <select className="form-input" style={{ width:'auto', padding:'4px 10px', fontSize:11 }}>
                <option>This Month</option>
              </select>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {[
                { label:'Output GST', value:`₹${analysis.outputGST.toLocaleString('en-IN')}`, color:'var(--text-primary)' },
                { label:'Input GST (ITC)', value:`₹${analysis.inputGST.toLocaleString('en-IN')}`, color:'var(--text-primary)' },
                { label:'GST Payable', value:`₹${analysis.netGSTPayable.toLocaleString('en-IN')}`, color:'var(--red)', bold:true },
                { label:'GST Refund', value:'₹0', color:'var(--green)' },
              ].map(r => (
                <div key={r.label} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 0', borderBottom:'1px solid var(--border)' }}>
                  <span style={{ fontSize:13, color:'var(--text-secondary)' }}>{r.label}</span>
                  <span style={{ fontSize:13.5, fontWeight:r.bold?700:600, color:r.color }}>{r.value}</span>
                </div>
              ))}
            </div>
            <button onClick={() => navigate('/gst')} className="btn btn-secondary btn-sm" style={{ width:'100%', justifyContent:'center', marginTop:14 }}>View GST Report</button>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="card" style={{ padding:20 }}>
          <div className="card-header">
            <div className="card-title">Recent Transactions</div>
            <button onClick={() => navigate('/revenue')} className="btn btn-ghost btn-sm" style={{ color:'var(--brand)' }}>View All <ExternalLink size={12} /></button>
          </div>
          <div className="table-wrap">
            <table>
              <thead><tr>
                <th>Reference</th><th>Party</th><th>Amount</th><th>Date</th><th>Type</th>
              </tr></thead>
              <tbody>
                {RECENT_TRANSACTIONS.map(t => (
                  <tr key={t.id}>
                    <td style={{ fontWeight:600, color:'var(--brand)' }}>{t.refNo}</td>
                    <td style={{ color:'var(--text-secondary)', fontSize:13 }}>{t.party}</td>
                    <td style={{ fontWeight:700 }}>₹{t.amount.toLocaleString('en-IN')}</td>
                    <td style={{ color:'var(--text-muted)', fontSize:12.5 }}>{t.date}</td>
                    <td><TxnBadge type={t.type} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Right Panel ─────────────────────────────────── */}
      <div style={{ width:280, flexShrink:0, display:'flex', flexDirection:'column', gap:16 }}>
        {/* AI Insights */}
        <div className="card" style={{ padding:20 }}>
          <div className="card-header" style={{ marginBottom:12 }}>
            <div style={{ display:'flex', alignItems:'center', gap:7 }}>
              <div style={{ width:28, height:28, borderRadius:8, background:'linear-gradient(135deg,#7B5EA7,#4318FF)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <Sparkles size={13} color="#fff" />
              </div>
              <div>
                <div className="card-title" style={{ fontSize:14 }}>AI Insights</div>
              </div>
            </div>
            <span className="badge badge-premium" style={{ fontSize:9, padding:'2px 7px' }}>✦</span>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {analysis.aiInsights.map((ins, index) => {
              const bgMap = { positive:'#E6FAF5', warning:'#FFF4E0', negative:'#FDECEA', info:'#EEF4FF', tip:'#F2EFFF' };
              return (
                <div key={index} style={{ background:bgMap[ins.type]||'#F4F7FE', borderRadius:10, padding:'10px 12px', display:'flex', gap:8, alignItems:'flex-start' }}>
                  <span style={{ fontSize:15, flexShrink:0, marginTop:1 }}>{ins.icon}</span>
                  <div>
                    <div style={{ fontSize:12, fontWeight:700, color:'var(--text-primary)' }}>{ins.title}</div>
                    <div style={{ fontSize:11.5, color:'var(--text-secondary)', lineHeight:1.4, marginTop:2 }}>
                      {ins.text.replace(/\*\*(.*?)\*\*/g, '$1')}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <button onClick={() => navigate('/ai-insights')} className="btn btn-primary btn-sm" style={{ width:'100%', justifyContent:'center', marginTop:14 }}>View All Insights</button>
        </div>


        {/* Quick Actions */}
        <div className="card" style={{ padding:20 }}>
          <div className="card-title" style={{ marginBottom:14 }}>Quick Actions</div>
          {[
            { icon:'➕', bg:'#E6FAF5', label:'Add Revenue', sub:'Record a new revenue entry', to:'/revenue' },
            { icon:'📤', bg:'#FDECEA', label:'Add Expense', sub:'Record expense entry', to:'/expenses' },
            { icon:'📄', bg:'#EEF4FF', label:'Generate Invoice', sub:'Create and send invoice', to:'/sales' },
            { icon:'📁', bg:'#FFF4E0', label:'Upload Document', sub:'Upload receipts / bills', to:'/documents' },
            { icon:'🧠', bg:'#F2EFFF', label:'Run AI Analysis', sub:'Get smart insights', to:'/ai-insights' },
          ].map(qa => (
            <div key={qa.label} className="quick-action" onClick={() => navigate(qa.to)}>
              <div className="quick-action-icon" style={{ background:qa.bg, width:36, height:36 }}>
                <span style={{ fontSize:17 }}>{qa.icon}</span>
              </div>
              <div>
                <div className="quick-action-title">{qa.label}</div>
                <div className="quick-action-sub">{qa.sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Upcoming Tasks */}
        <div className="card" style={{ padding:20 }}>
          <div className="card-header" style={{ marginBottom:12 }}>
            <div className="card-title">Upcoming Tasks</div>
            <button className="btn btn-ghost btn-sm" style={{ color:'var(--brand)', fontSize:12 }}>View All</button>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {UPCOMING_TASKS.map(t => {
              const urgentColor = t.status==='urgent' ? '#EE5D50' : t.status==='soon' ? '#FF9D00' : '#A3AED0';
              return (
                <div key={t.id} style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <Circle size={14} color="var(--border)" />
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:12.5, fontWeight:500, color:'var(--text-primary)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{t.task}</div>
                  </div>
                  <div style={{ fontSize:11, fontWeight:600, color:urgentColor, flexShrink:0 }}>Due in {t.daysLeft}d</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Compliance Score */}
        <div className="card" style={{ padding:20, textAlign:'center' }}>
          <div className="card-title" style={{ textAlign:'left', marginBottom:16 }}>Compliance Score</div>
          {/* SVG gauge */}
          <svg width="120" height="70" viewBox="0 0 120 70" style={{ margin:'0 auto', display:'block' }}>
            <path d="M10 65 A50 50 0 0 1 110 65" fill="none" stroke="#E9EDF7" strokeWidth="10" strokeLinecap="round"/>
            <path d="M10 65 A50 50 0 0 1 110 65" fill="none" stroke="#4318FF" strokeWidth="10" strokeLinecap="round" strokeDasharray="157" strokeDashoffset="22"/>
          </svg>
          <div style={{ fontSize:32, fontWeight:900, color:'var(--text-primary)', marginTop:-8 }}>92<span style={{ fontSize:16, color:'var(--text-secondary)' }}>/100</span></div>
          <div style={{ fontSize:13, fontWeight:700, color:'var(--green)' }}>Excellent</div>
          <div style={{ fontSize:11.5, color:'var(--text-secondary)', marginTop:4 }}>You're compliant! Keep it up.</div>
          <div style={{ marginTop:14, display:'flex', flexDirection:'column', gap:8 }}>
            {[{label:'GST Compliance', pct:89}, {label:'Tax Compliance', pct:90}, {label:'Document Compliance', pct:88}].map(c => (
              <div key={c.label}>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, color:'var(--text-secondary)', marginBottom:4 }}>
                  <span>{c.label}</span><span style={{ fontWeight:600 }}>{c.pct}%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width:`${c.pct}%`, background:'linear-gradient(90deg,#4318FF,#7B5EA7)' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
