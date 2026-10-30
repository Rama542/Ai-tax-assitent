import React, { useState } from 'react';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Download, CheckCircle, AlertTriangle, Clock, Sparkles } from 'lucide-react';
import { formatINR } from '../../data/mockData';
import { exportToPDF } from '../../utils/exports';
import { useAuth } from '../../contexts/AuthContext';
import { analyzeUserTaxData } from '../../utils/taxCalculator';

const MONTHS = ['Apr','May','Jun','Jul','Aug'];

export default function GSTPage() {
  const [tab, setTab] = useState('overview');
  const { userFinancials, setShowOnboardingModal } = useAuth();
  const analysis = analyzeUserTaxData(userFinancials);

  const outputGST = analysis.outputGST;
  const inputGST = analysis.inputGST;
  const netPayable = analysis.netGSTPayable;

  const GST_DATA = {
    outputGST, inputGST, netPayable, paid: 0,
    b2bSales: Math.round(userFinancials.annualRevenue * 0.75),
    b2cSales: Math.round(userFinancials.annualRevenue * 0.25),
    monthly: MONTHS.map((m,i) => ({ month:m, output:Math.round(outputGST/5 * (0.8 + i*0.1)), input:Math.round(inputGST/5 * (0.8 + i*0.1)), payable:Math.round(netPayable/5 * (0.8 + i*0.1)) })),
    filings: [
      { return:'GSTR-1', period:'July 2026', dueDate:'2026-08-11', status:'pending', amount:null },
      { return:'GSTR-3B', period:'July 2026', dueDate:'2026-08-20', status:'pending', amount:netPayable },
      { return:'GSTR-1', period:'June 2026', dueDate:'2026-07-11', status:'filed', amount:null },
      { return:'GSTR-3B', period:'June 2026', dueDate:'2026-07-20', status:'filed', amount:Math.round(netPayable * 0.9) },
      { return:'GSTR-9', period:'FY 2025-26', dueDate:'2026-12-31', status:'upcoming', amount:null },
    ],
    itcLedger: [
      { head:'CGST Input', available:Math.round(inputGST * 0.4) },
      { head:'SGST Input', available:Math.round(inputGST * 0.4) },
      { head:'IGST Input', available:Math.round(inputGST * 0.2) },
    ],
  };

  const StatusBadge = ({status}) => {
    const map = { filed:{bg:'#E6FAF5',color:'#01B574',label:'Filed',icon:<CheckCircle size={12}/>}, pending:{bg:'#FDECEA',color:'#EE5D50',label:'Pending',icon:<AlertTriangle size={12}/>}, upcoming:{bg:'#EEF4FF',color:'#3965FF',label:'Upcoming',icon:<Clock size={12}/>} };
    const s = map[status] || map.upcoming;
    return <span style={{background:s.bg,color:s.color,fontSize:11,fontWeight:700,padding:'3px 10px',borderRadius:99,display:'inline-flex',alignItems:'center',gap:4}}>{s.icon}{s.label}</span>;
  };

  return (
    <div>
      <div className="page-header flex justify-between items-center">
        <div>
          <h1 className="page-title">GST Management Suite</h1>
          <p className="page-subtitle">GSTIN: {userFinancials?.gstin || '27AABCT1332L1ZV'} · Entity: {userFinancials?.businessName || 'Business'}</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => setShowOnboardingModal(true)} className="btn btn-secondary">
            <Sparkles size={16} /> Edit GST & Financials
          </button>
          <button onClick={()=>exportToPDF(GST_DATA.filings,'GST Report',['return','period','dueDate','status'])} className="btn btn-primary"><Download size={16}/> Export Report</button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid-4" style={{gap:14,marginBottom:20}}>
        {[
          {label:'Output GST (18% avg)',value:formatINR(GST_DATA.outputGST),icon:'📤',bg:'#E6FAF5',color:'var(--green)'},
          {label:'Input Tax Credit (ITC)',value:formatINR(GST_DATA.inputGST),icon:'📥',bg:'#EEF4FF',color:'var(--brand)'},
          {label:'Net GST Payable',value:formatINR(GST_DATA.netPayable),icon:'💳',bg:'#FDECEA',color:'var(--red)'},
          {label:'GST Paid',value:formatINR(GST_DATA.paid),icon:'✅',bg:'#E6FAF5',color:'var(--green)'},
        ].map(s=>(
          <div key={s.label} className="card" style={{padding:18}}>
            <div style={{width:40,height:40,borderRadius:10,background:s.bg,display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,marginBottom:10}}>{s.icon}</div>
            <div style={{fontSize:12,color:'var(--text-secondary)',marginBottom:4}}>{s.label}</div>
            <div style={{fontSize:22,fontWeight:800,color:s.color||'var(--text-primary)'}}>{s.value}</div>
          </div>
        ))}
      </div>


      {/* Tabs */}
      <div style={{display:'flex',gap:4,marginBottom:20,background:'var(--bg)',borderRadius:12,padding:4,width:'fit-content'}}>
        {['overview','filings','itc'].map(t=>(
          <button key={t} onClick={()=>setTab(t)} style={{padding:'8px 20px',borderRadius:8,border:'none',cursor:'pointer',fontWeight:600,fontSize:13,transition:'all 0.15s',background:tab===t?'var(--bg-card)':'transparent',color:tab===t?'var(--brand)':'var(--text-secondary)',boxShadow:tab===t?'var(--shadow-sm)':'none',textTransform:'capitalize'}}>
            {t==='itc'?'ITC Ledger':t.charAt(0).toUpperCase()+t.slice(1)}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div>
          <div className="grid-2" style={{gap:16}}>
            <div className="card" style={{padding:20}}>
              <div className="card-title" style={{marginBottom:14}}>Monthly GST Analysis</div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={GST_DATA.monthly} margin={{top:0,right:0,bottom:0,left:-20}}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false}/>
                  <XAxis dataKey="month" tick={{fontSize:11,fill:'var(--text-secondary)'}} axisLine={false} tickLine={false}/>
                  <YAxis tick={{fontSize:10,fill:'var(--text-secondary)'}} axisLine={false} tickLine={false} tickFormatter={v=>`₹${(v/1000).toFixed(0)}K`}/>
                  <Tooltip formatter={(v,n)=>[formatINR(v),n]} contentStyle={{borderRadius:10,fontSize:12}}/>
                  <Bar dataKey="output" name="Output GST" fill="#4318FF" radius={[4,4,0,0]} maxBarSize={22}/>
                  <Bar dataKey="input" name="Input GST" fill="#6AD2FF" radius={[4,4,0,0]} maxBarSize={22}/>
                  <Bar dataKey="payable" name="Net Payable" fill="#EE5D50" radius={[4,4,0,0]} maxBarSize={22}/>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="card" style={{padding:20}}>
              <div className="card-title" style={{marginBottom:16}}>Sales Breakdown</div>
              {[
                {label:'B2B Sales (Business to Business)',value:formatINR(GST_DATA.b2bSales),pct:76},
                {label:'B2C Sales (Business to Consumer)',value:formatINR(GST_DATA.b2cSales),pct:24},
              ].map(s=>(
                <div key={s.label} style={{marginBottom:16}}>
                  <div style={{display:'flex',justifyContent:'space-between',fontSize:13,marginBottom:6}}>
                    <span style={{color:'var(--text-secondary)'}}>{s.label}</span>
                    <span style={{fontWeight:700}}>{s.value}</span>
                  </div>
                  <div className="progress-bar"><div className="progress-fill" style={{width:`${s.pct}%`,background:'linear-gradient(90deg,#4318FF,#7B5EA7)'}}/></div>
                  <div style={{fontSize:11,color:'var(--text-muted)',marginTop:3,textAlign:'right'}}>{s.pct}% of total</div>
                </div>
              ))}
              <div className="divider" style={{margin:'16px 0'}}/>
              <div style={{background:'#FFF4E0',borderRadius:10,padding:'12px',border:'1px solid rgba(255,157,0,0.2)'}}>
                <div style={{fontSize:12,fontWeight:700,color:'var(--orange)',marginBottom:4}}>⚠ GSTR-1 Due in 5 Days</div>
                <div style={{fontSize:12,color:'var(--text-secondary)'}}>File your GSTR-1 for July 2026 before 11 Aug 2026.</div>
                <button className="btn btn-primary btn-sm" style={{marginTop:10,width:'100%',justifyContent:'center'}}>File GSTR-1 Now</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'filings' && (
        <div className="card" style={{padding:0,overflow:'hidden'}}>
          <div style={{padding:'16px 20px',borderBottom:'1px solid var(--border)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <div className="card-title">GST Filings Calendar</div>
          </div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Return Type</th><th>Period</th><th>Due Date</th><th>Tax Payable</th><th>Status</th></tr></thead>
              <tbody>
                {GST_DATA.filings.map((r,i)=>(
                  <tr key={i}>
                    <td style={{fontWeight:700,color:'var(--brand)'}}>{r.return}</td>
                    <td style={{color:'var(--text-secondary)',fontSize:13}}>{r.period}</td>
                    <td style={{fontSize:13}}>{r.dueDate}</td>
                    <td style={{fontWeight:600}}>{r.amount ? formatINR(r.amount) : '—'}</td>
                    <td><StatusBadge status={r.status}/></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'itc' && (
        <div className="card" style={{padding:24}}>
          <div className="card-title" style={{marginBottom:20}}>Input Tax Credit (ITC) Ledger</div>
          <div className="grid-3" style={{gap:16,marginBottom:24}}>
            {GST_DATA.itcLedger.map(l=>(
              <div key={l.head} style={{background:'#EEF4FF',borderRadius:12,padding:'16px',textAlign:'center'}}>
                <div style={{fontSize:12,color:'var(--text-secondary)',marginBottom:6}}>{l.head}</div>
                <div style={{fontSize:24,fontWeight:800,color:'var(--brand)'}}>{formatINR(l.available)}</div>
                <div style={{fontSize:11,color:'var(--text-muted)',marginTop:4}}>Available Credit</div>
              </div>
            ))}
          </div>
          <div style={{background:'var(--bg)',borderRadius:12,padding:'16px'}}>
            <div style={{fontSize:13,fontWeight:600,color:'var(--text-primary)',marginBottom:8}}>ITC Summary</div>
            {[
              {label:'Total ITC Available',value:formatINR(115000)},
              {label:'ITC Utilized',value:formatINR(115000)},
              {label:'ITC Balance',value:formatINR(0)},
            ].map(r=>(
              <div key={r.label} style={{display:'flex',justifyContent:'space-between',padding:'8px 0',borderBottom:'1px solid var(--border)'}}>
                <span style={{fontSize:13,color:'var(--text-secondary)'}}>{r.label}</span>
                <span style={{fontSize:13.5,fontWeight:700,color:'var(--text-primary)'}}>{r.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
