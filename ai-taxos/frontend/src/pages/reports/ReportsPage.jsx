import React, { useState } from 'react';
import { BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Download, TrendingUp, TrendingDown, FileText, Sparkles } from 'lucide-react';
import { REVENUE_MONTHLY, EXPENSE_BREAKDOWN, formatINR, formatINRShort } from '../../data/mockData';
import { exportToPDF, exportToCSV } from '../../utils/exports';
import { useAuth } from '../../contexts/AuthContext';
import { analyzeUserTaxData } from '../../utils/taxCalculator';

const TABS = ['P&L Statement','Balance Sheet','Cash Flow','Tax Summary'];

export default function ReportsPage() {
  const [tab, setTab] = useState(0);
  const { userFinancials, setShowOnboardingModal } = useAuth();
  const analysis = analyzeUserTaxData(userFinancials);

  const rev = userFinancials?.annualRevenue || 2478000;
  const exp = userFinancials?.annualExpenses || 1245300;
  const netProfit = userFinancials?.netProfit || (rev - exp);
  const cogs = Math.round(rev * 0.28);
  const grossProfit = rev - cogs;
  const opex = exp;

  const PL_DATA = [
    {head:'REVENUE',items:[{label:'Operating Revenue',amt:rev}],total:rev},
    {head:'COST OF GOODS / DIRECT COSTS',items:[{label:'Direct Materials & Services',amt:cogs}],total:cogs},
    {head:'GROSS PROFIT',items:[],total:grossProfit,highlight:true},
    {head:'OPERATING EXPENSES',items:[{label:'Operating Costs & Payroll',amt:opex}],total:opex},
    {head:'NET PROFIT',items:[],total:netProfit,highlight:true,positive:netProfit >= 0},
  ];

  const BALANCE_SHEET = {
    assets:[
      {label:'Cash & Bank Balances',amt:Math.round(netProfit * 0.65)},{label:'Trade Receivables',amt:Math.round(rev * 0.15)},{label:'Inventory & Spares',amt:Math.round(cogs * 0.2)},{label:'Fixed Assets & Property',amt:1310000},
    ],
    liabilities:[
      {label:'Trade Payables',amt:Math.round(opex * 0.15)},{label:'Outstanding Loans',amt:1200000},{label:'GST Payable',amt:analysis.netGSTPayable},
    ],
    equity:[
      {label:'Paid-up Capital',amt:1500000},{label:'Retained Earnings',amt:Math.max(0, netProfit)},
    ],
  };

  const totalAssets = BALANCE_SHEET.assets.reduce((s,r)=>s+r.amt,0);
  const totalLiab = BALANCE_SHEET.liabilities.reduce((s,r)=>s+r.amt,0);
  const totalEquity = BALANCE_SHEET.equity.reduce((s,r)=>s+r.amt,0);

  return (
    <div>
      <div className="page-header flex justify-between items-center">
        <div>
          <h1 className="page-title">Financial Reports & Audit Statement</h1>
          <p className="page-subtitle">Entity: {userFinancials?.businessName || 'Business Owner'} · PAN: {userFinancials?.pan || 'ABCRS1234F'}</p>
        </div>
        <div style={{display:'flex',gap:8}}>
          <button onClick={() => setShowOnboardingModal(true)} className="btn btn-secondary btn-sm">
            <Sparkles size={14} /> Edit Financial Data
          </button>
          <button onClick={()=>exportToCSV(REVENUE_MONTHLY,'Revenue_Monthly')} className="btn btn-secondary btn-sm"><Download size={14}/> CSV</button>
          <button onClick={()=>exportToPDF(REVENUE_MONTHLY,'Financial Report',['month','revenue','expenses'])} className="btn btn-primary btn-sm"><Download size={14}/> PDF</button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid-4" style={{gap:14,marginBottom:20}}>
        {[
          {label:'Total Revenue',value:`₹${rev.toLocaleString('en-IN')}`,change:'+18.5%',positive:true,icon:'📈',bg:'#E6FAF5'},
          {label:'Total Expenses',value:`₹${exp.toLocaleString('en-IN')}`,change:'+12.2%',positive:false,icon:'📤',bg:'#FDECEA'},
          {label:'Net Profit',value:`₹${netProfit.toLocaleString('en-IN')}`,change:'+26.1%',positive:netProfit >= 0,icon:'💰',bg:'#F2EFFF'},
          {label:'Net GST Liability',value:`₹${analysis.netGSTPayable.toLocaleString('en-IN')}`,change:'+4.3%',positive:false,icon:'📊',bg:'#EEF4FF'},
        ].map(s=>(
          <div key={s.label} className="card" style={{padding:18}}>
            <div style={{width:38,height:38,borderRadius:10,background:s.bg,display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,marginBottom:10}}>{s.icon}</div>
            <div style={{fontSize:12,color:'var(--text-secondary)',marginBottom:4}}>{s.label}</div>
            <div style={{fontSize:20,fontWeight:800,color:'var(--text-primary)'}}>{s.value}</div>
            <div style={{display:'flex',alignItems:'center',gap:4,fontSize:12,fontWeight:600,marginTop:4,color:s.positive?'var(--green)':'var(--red)'}}>
              {s.positive?<TrendingUp size={12}/>:<TrendingDown size={12}/>}{s.change} <span style={{fontWeight:400,color:'var(--text-secondary)'}}>vs last year</span>
            </div>
          </div>
        ))}
      </div>


      {/* Report tabs */}
      <div style={{display:'flex',gap:4,marginBottom:20,background:'var(--bg)',borderRadius:12,padding:4,width:'fit-content'}}>
        {TABS.map((t,i)=>(
          <button key={t} onClick={()=>setTab(i)} style={{padding:'8px 18px',borderRadius:8,border:'none',cursor:'pointer',fontWeight:600,fontSize:12.5,transition:'all 0.15s',background:tab===i?'var(--bg-card)':'transparent',color:tab===i?'var(--brand)':'var(--text-secondary)',boxShadow:tab===i?'var(--shadow-sm)':'none',whiteSpace:'nowrap'}}>
            {t}
          </button>
        ))}
      </div>

      {/* P&L Statement */}
      {tab===0 && (
        <div className="grid-2" style={{gap:20}}>
          <div className="card" style={{padding:20}}>
            <div className="card-title" style={{marginBottom:16}}>Profit & Loss Statement</div>
            {PL_DATA.map((section,i)=>(
              <div key={i} style={{marginBottom:section.highlight?16:8}}>
                <div style={{display:'flex',justifyContent:'space-between',padding:section.highlight?'10px 12px':'6px 0',background:section.highlight?(section.positive?'#E6FAF5':'#EEF4FF'):'transparent',borderRadius:section.highlight?8:0,marginBottom:section.highlight?4:0}}>
                  <span style={{fontSize:section.highlight?14:11,fontWeight:section.highlight?800:700,color:section.highlight?(section.positive?'var(--green)':'var(--brand)'):'var(--text-secondary)',textTransform:'uppercase',letterSpacing:'0.05em'}}>{section.head}</span>
                  <span style={{fontSize:section.highlight?15:13,fontWeight:800,color:section.highlight?(section.positive?'var(--green)':'var(--text-primary)'):'var(--text-primary)'}}>{formatINR(section.total)}</span>
                </div>
                {section.items.map(item=>(
                  <div key={item.label} style={{display:'flex',justifyContent:'space-between',padding:'5px 12px',fontSize:12.5}}>
                    <span style={{color:'var(--text-secondary)'}}>{item.label}</span>
                    <span style={{color:'var(--text-primary)',fontWeight:500}}>{formatINR(item.amt)}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className="card" style={{padding:20}}>
            <div className="card-title" style={{marginBottom:14}}>Revenue vs Expenses Trend</div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={REVENUE_MONTHLY} margin={{top:4,right:4,bottom:0,left:-20}}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false}/>
                <XAxis dataKey="month" tick={{fontSize:11,fill:'var(--text-secondary)'}} axisLine={false} tickLine={false}/>
                <YAxis tickFormatter={formatINRShort} tick={{fontSize:10,fill:'var(--text-secondary)'}} axisLine={false} tickLine={false}/>
                <Tooltip formatter={(v,n)=>[formatINR(v),n]} contentStyle={{borderRadius:10,fontSize:12}}/>
                <Legend wrapperStyle={{fontSize:11}}/>
                <Bar dataKey="revenue" name="Revenue" fill="#4318FF" radius={[4,4,0,0]} maxBarSize={22}/>
                <Bar dataKey="expenses" name="Expenses" fill="#6AD2FF" radius={[4,4,0,0]} maxBarSize={22}/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Balance Sheet */}
      {tab===1 && (
        <div className="grid-2" style={{gap:20}}>
          <div className="card" style={{padding:20}}>
            <div className="card-title" style={{marginBottom:16}}>Balance Sheet</div>
            <div style={{marginBottom:16}}>
              <div style={{fontSize:11,fontWeight:700,color:'var(--text-secondary)',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:8}}>ASSETS</div>
              {BALANCE_SHEET.assets.map(r=>(
                <div key={r.label} style={{display:'flex',justifyContent:'space-between',padding:'7px 0',borderBottom:'1px solid var(--border)',fontSize:13}}>
                  <span style={{color:'var(--text-secondary)'}}>{r.label}</span>
                  <span style={{fontWeight:600}}>{formatINR(r.amt)}</span>
                </div>
              ))}
              <div style={{display:'flex',justifyContent:'space-between',padding:'9px 0',fontSize:14,fontWeight:800,color:'var(--brand)'}}>
                <span>Total Assets</span><span>{formatINR(totalAssets)}</span>
              </div>
            </div>
            <div style={{marginBottom:16}}>
              <div style={{fontSize:11,fontWeight:700,color:'var(--text-secondary)',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:8}}>LIABILITIES</div>
              {BALANCE_SHEET.liabilities.map(r=>(
                <div key={r.label} style={{display:'flex',justifyContent:'space-between',padding:'7px 0',borderBottom:'1px solid var(--border)',fontSize:13}}>
                  <span style={{color:'var(--text-secondary)'}}>{r.label}</span>
                  <span style={{fontWeight:600,color:'var(--red)'}}>{formatINR(r.amt)}</span>
                </div>
              ))}
              <div style={{display:'flex',justifyContent:'space-between',padding:'9px 0',fontSize:14,fontWeight:800,color:'var(--red)'}}>
                <span>Total Liabilities</span><span>{formatINR(totalLiab)}</span>
              </div>
            </div>
            <div>
              <div style={{fontSize:11,fontWeight:700,color:'var(--text-secondary)',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:8}}>EQUITY</div>
              {BALANCE_SHEET.equity.map(r=>(
                <div key={r.label} style={{display:'flex',justifyContent:'space-between',padding:'7px 0',borderBottom:'1px solid var(--border)',fontSize:13}}>
                  <span style={{color:'var(--text-secondary)'}}>{r.label}</span>
                  <span style={{fontWeight:600,color:'var(--green)'}}>{formatINR(r.amt)}</span>
                </div>
              ))}
              <div style={{display:'flex',justifyContent:'space-between',padding:'9px 0',fontSize:14,fontWeight:800,color:'var(--green)'}}>
                <span>Total Equity</span><span>{formatINR(totalEquity)}</span>
              </div>
            </div>
          </div>
          <div className="card" style={{padding:20}}>
            <div className="card-title" style={{marginBottom:14}}>Asset Distribution</div>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={BALANCE_SHEET.assets} dataKey="amt" nameKey="label" cx="50%" cy="50%" outerRadius={90} paddingAngle={2}>
                  {BALANCE_SHEET.assets.map((_,i)=><Cell key={i} fill={['#4318FF','#7B5EA7','#6AD2FF','#05CD99'][i%4]}/>)}
                </Pie>
                <Tooltip formatter={(v)=>[formatINR(v)]} contentStyle={{borderRadius:10,fontSize:12}}/>
                <Legend wrapperStyle={{fontSize:11}}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Cash Flow */}
      {tab===2 && (
        <div className="card" style={{padding:20}}>
          <div className="card-title" style={{marginBottom:14}}>Cash Flow Statement</div>
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={REVENUE_MONTHLY} margin={{top:4,right:4,bottom:0,left:-20}}>
              <defs>
                <linearGradient id="revG" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#4318FF" stopOpacity={0.15}/><stop offset="95%" stopColor="#4318FF" stopOpacity={0}/></linearGradient>
                <linearGradient id="expG" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#EE5D50" stopOpacity={0.1}/><stop offset="95%" stopColor="#EE5D50" stopOpacity={0}/></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false}/>
              <XAxis dataKey="month" tick={{fontSize:11,fill:'var(--text-secondary)'}} axisLine={false} tickLine={false}/>
              <YAxis tickFormatter={formatINRShort} tick={{fontSize:10,fill:'var(--text-secondary)'}} axisLine={false} tickLine={false}/>
              <Tooltip formatter={(v,n)=>[formatINR(v),n]} contentStyle={{borderRadius:10,fontSize:12}}/>
              <Legend wrapperStyle={{fontSize:11}}/>
              <Area type="monotone" dataKey="revenue" name="Cash Inflow" stroke="#4318FF" strokeWidth={2.5} fill="url(#revG)"/>
              <Area type="monotone" dataKey="expenses" name="Cash Outflow" stroke="#EE5D50" strokeWidth={2.5} fill="url(#expG)"/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Tax Summary */}
      {tab===3 && (
        <div className="grid-2" style={{gap:20}}>
          {[
            {title:'GST Summary',rows:[{l:'Total GST Collected',v:'₹2,40,000'},{l:'ITC Available',v:'₹1,15,000'},{l:'Net GST Payable',v:'₹1,25,000'},{l:'GST Paid',v:'₹0'}]},
            {title:'Income Tax Summary',rows:[{l:'Total Income',v:'₹24,78,000'},{l:'Deductions',v:'₹1,25,000'},{l:'Taxable Income',v:'₹23,53,000'},{l:'Estimated Tax',v:'₹5,70,540'}]},
          ].map(section=>(
            <div key={section.title} className="card" style={{padding:24}}>
              <div className="card-title" style={{marginBottom:16}}>{section.title}</div>
              {section.rows.map(r=>(
                <div key={r.l} style={{display:'flex',justifyContent:'space-between',padding:'10px 0',borderBottom:'1px solid var(--border)',fontSize:13}}>
                  <span style={{color:'var(--text-secondary)'}}>{r.l}</span>
                  <span style={{fontWeight:700,color:'var(--text-primary)'}}>{r.v}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
