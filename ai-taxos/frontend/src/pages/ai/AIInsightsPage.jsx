import React from 'react';
import { motion } from 'framer-motion';
import { Brain, TrendingUp, TrendingDown, AlertTriangle, Lightbulb, Info, Star } from 'lucide-react';
import { AI_INSIGHTS, UPCOMING_TASKS } from '../../data/mockData';

const typeConfig = {
  positive:{border:'#05CD99',bg:'#E6FAF5',icon:'📈',iconBg:'#C7F6EA',label:'Positive'},
  warning:{border:'#FF9D00',bg:'#FFF4E0',icon:'⚡',iconBg:'#FFE5B4',label:'Warning'},
  negative:{border:'#EE5D50',bg:'#FDECEA',icon:'📉',iconBg:'#FAD4D0',label:'Alert'},
  info:{border:'#3965FF',bg:'#EEF4FF',icon:'💡',iconBg:'#C7D8FF',label:'Info'},
  tip:{border:'#7B5EA7',bg:'#F2EFFF',icon:'🤖',iconBg:'#D9CFFF',label:'Tip'},
};

export default function AIInsightsPage() {
  return (
    <div>
      <div className="page-header flex justify-between items-center">
        <div>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:6 }}>
            <div style={{ width:40, height:40, borderRadius:12, background:'linear-gradient(135deg,#7B5EA7,#4318FF)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Brain size={20} color="#fff" />
            </div>
            <h1 className="page-title" style={{ marginBottom:0 }}>AI Insights</h1>
          </div>
          <p className="page-subtitle">Smart analysis & tax-saving recommendations powered by AI</p>
        </div>
        <span className="badge badge-premium" style={{ padding:'6px 16px', fontSize:12 }}>✦ AI Powered</span>
      </div>

      {/* Summary banner */}
      <div style={{ background:'linear-gradient(135deg,#0B1437,#1a2c6e)', borderRadius:20, padding:24, marginBottom:24, color:'#fff' }}>
        <div style={{ fontSize:13, color:'rgba(255,255,255,0.6)', marginBottom:4 }}>AI Financial Health Score — August 2026</div>
        <div style={{ display:'flex', alignItems:'center', gap:16 }}>
          <div style={{ fontSize:48, fontWeight:900 }}>92<span style={{ fontSize:20, opacity:0.6 }}>/100</span></div>
          <div>
            <div style={{ fontSize:16, fontWeight:700, color:'#05CD99', marginBottom:4 }}>Excellent Financial Health</div>
            <div style={{ fontSize:13, color:'rgba(255,255,255,0.55)' }}>Revenue up 18.5% · Expenses under control · GST compliance pending</div>
          </div>
        </div>
      </div>

      {/* Insights grid */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:24 }}>
        {AI_INSIGHTS.map(ins => {
          const cfg = typeConfig[ins.type] || typeConfig.info;
          return (
            <motion.div key={ins.id} className="card" initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:ins.id*0.06 }}
              style={{ padding:20, borderLeft:`4px solid ${cfg.border}`, background:cfg.bg, border:`1.5px solid ${cfg.border}20` }}>
              <div style={{ display:'flex', alignItems:'flex-start', gap:14 }}>
                <div style={{ width:40, height:40, borderRadius:10, background:cfg.iconBg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>
                  {ins.icon}
                </div>
                <div>
                  <div style={{ fontSize:11, fontWeight:700, color:cfg.border, textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:4 }}>{cfg.label}</div>
                  <div style={{ fontSize:13.5, color:'var(--text-primary)', lineHeight:1.55 }}>{ins.text}</div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Tax saving tips */}
      <div className="card" style={{ padding:24, marginBottom:20 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:20 }}>
          <Star size={18} color="gold" fill="gold" />
          <div className="card-title">AI Tax Saving Recommendations</div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:14 }}>
          {[
            { tip:'Section 80C', desc:'You have only utilized ₹1,20,000 of ₹1,50,000 limit. Invest ₹30,000 more to save up to ₹9,000 in taxes.', savings:'₹9,000', icon:'🏦' },
            { tip:'Section 80D', desc:'Upgrade your health insurance to ₹25,000/year coverage. Full deduction applicable under 80D.', savings:'₹7,500', icon:'💊' },
            { tip:'Home Office Deduction', desc:'You may claim home office expenses under business expenses. Potential deduction of up to ₹60,000.', savings:'₹18,000', icon:'🏠' },
            { tip:'Depreciation Claim', desc:'Accelerate depreciation on your server equipment by switching to Written Down Value method.', savings:'₹35,000', icon:'💻' },
            { tip:'GST ITC Optimization', desc:'Ensure all input invoices are matched in GSTR-2B. You have ₹15,000 in unmatched credits.', savings:'₹15,000', icon:'🧾' },
            { tip:'New Tax Regime Switch', desc:'Based on your deductions, switching to the New Tax Regime saves you ₹12,000 annually.', savings:'₹12,000', icon:'📋' },
          ].map(t => (
            <div key={t.tip} style={{ background:'var(--bg)', borderRadius:14, padding:16, border:'1.5px solid var(--border)' }}>
              <div style={{ fontSize:22, marginBottom:8 }}>{t.icon}</div>
              <div style={{ fontSize:13, fontWeight:700, color:'var(--text-primary)', marginBottom:6 }}>{t.tip}</div>
              <div style={{ fontSize:12, color:'var(--text-secondary)', lineHeight:1.55, marginBottom:10 }}>{t.desc}</div>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <span style={{ fontSize:11, color:'var(--text-muted)' }}>Estimated savings</span>
                <span style={{ fontSize:13, fontWeight:800, color:'var(--green)' }}>{t.savings}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Compliance calendar */}
      <div className="card" style={{ padding:24 }}>
        <div className="card-title" style={{ marginBottom:16 }}>Compliance Calendar</div>
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {UPCOMING_TASKS.map(t => {
            const urgent = t.status === 'urgent', soon = t.status === 'soon';
            return (
              <div key={t.id} style={{ display:'flex', alignItems:'center', gap:14, padding:'12px 16px', borderRadius:12, background:urgent?'#FDECEA':soon?'#FFF4E0':'var(--bg)', border:`1.5px solid ${urgent?'rgba(238,93,80,0.2)':soon?'rgba(255,157,0,0.2)':'var(--border)'}` }}>
                <div style={{ fontSize:22 }}>{urgent?'🔴':soon?'🟡':'🟢'}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13.5, fontWeight:600, color:'var(--text-primary)' }}>{t.task}</div>
                  <div style={{ fontSize:12, color:'var(--text-secondary)', marginTop:2 }}>Due: {t.dueDate}</div>
                </div>
                <span style={{ fontSize:12, fontWeight:700, color:urgent?'var(--red)':soon?'var(--orange)':'var(--text-secondary)' }}>
                  {t.daysLeft}d left
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
