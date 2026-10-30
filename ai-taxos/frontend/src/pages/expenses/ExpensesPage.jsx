import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Plus, Edit2, Trash2, Search, Download, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { MOCK_EXPENSES, EXPENSE_BREAKDOWN, formatINR, formatINRShort } from '../../data/mockData';
import { exportToCSV, exportToPDF } from '../../utils/exports';

const CATEGORIES = ['Rent','Salaries','Utilities','Marketing','Technology','Operations','Professional','Travel','Other'];
const PAYMENT_METHODS = ['Bank Transfer','UPI','Credit Card','Cheque','Cash','Auto-debit'];
const EMPTY = { name:'', vendor:'', date:'', category:'Operations', paymentMethod:'Bank Transfer', amount:'', gstPaid:'', notes:'' };

export default function ExpensesPage() {
  const [records, setRecords] = useState(MOCK_EXPENSES);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const PER = 6;

  const filtered = useMemo(() => {
    let r = [...records];
    if (search) r = r.filter(x => x.name.toLowerCase().includes(search.toLowerCase()) || x.vendor.toLowerCase().includes(search.toLowerCase()));
    if (catFilter !== 'all') r = r.filter(x => x.category === catFilter);
    return r;
  }, [records, search, catFilter]);

  const paged = filtered.slice((page-1)*PER, page*PER);
  const pages = Math.max(1, Math.ceil(filtered.length / PER));
  const total = records.reduce((s,r) => s+Number(r.amount), 0);

  const openAdd = () => { setEditing(null); setForm(EMPTY); setModal(true); };
  const openEdit = (r) => { setEditing(r.id); setForm({...r,amount:String(r.amount),gstPaid:String(r.gstPaid)}); setModal(true); };
  const save = () => {
    if (!form.name || !form.amount || !form.date) { toast.error('Fill required fields'); return; }
    if (editing) {
      setRecords(rs => rs.map(r => r.id===editing ? {...r,...form,amount:Number(form.amount),gstPaid:Number(form.gstPaid||0)} : r));
      toast.success('Expense updated!');
    } else {
      setRecords(rs => [{...form,id:'EXP-'+Date.now(),amount:Number(form.amount),gstPaid:Number(form.gstPaid||0),createdAt:new Date()},...rs]);
      toast.success('Expense added!');
    }
    setModal(false);
  };
  const del = (id) => { if(window.confirm('Delete this expense?')){setRecords(rs=>rs.filter(r=>r.id!==id));toast.success('Deleted.');} };

  return (
    <div>
      <div className="page-header flex justify-between items-center">
        <div><h1 className="page-title">Expenses</h1><p className="page-subtitle">Track all your business expenses</p></div>
        <button className="btn btn-primary" onClick={openAdd}><Plus size={16} /> Add Expense</button>
      </div>

      <div className="grid-4" style={{gap:14,marginBottom:20}}>
        {[
          {label:'Total Expenses',value:formatINR(total),icon:'📤',bg:'#FDECEA'},
          {label:'This Month',value:formatINRShort(records.slice(0,8).reduce((s,r)=>s+Number(r.amount),0)),icon:'📅',bg:'#EEF4FF'},
          {label:'Total Entries',value:records.length,icon:'📋',bg:'#F2EFFF'},
          {label:'Avg Expense',value:formatINRShort(total/Math.max(records.length,1)),icon:'📊',bg:'#FFF4E0'},
        ].map(s=>(
          <div key={s.label} className="card" style={{padding:18}}>
            <div style={{width:38,height:38,borderRadius:10,background:s.bg,display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,marginBottom:10}}>{s.icon}</div>
            <div style={{fontSize:12,color:'var(--text-secondary)',marginBottom:4}}>{s.label}</div>
            <div style={{fontSize:20,fontWeight:800,color:'var(--text-primary)'}}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="grid-2" style={{gap:16,marginBottom:20}}>
        <div className="card" style={{padding:20}}>
          <div className="card-title" style={{marginBottom:14}}>Expense Breakdown</div>
          <div style={{display:'flex',alignItems:'center',gap:20}}>
            <ResponsiveContainer width={140} height={140}>
              <PieChart>
                <Pie data={EXPENSE_BREAKDOWN} dataKey="value" cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={2}>
                  {EXPENSE_BREAKDOWN.map((e,i)=><Cell key={i} fill={e.color}/>)}
                </Pie>
                <Tooltip formatter={(v)=>[formatINR(v)]} contentStyle={{borderRadius:10,fontSize:12}}/>
              </PieChart>
            </ResponsiveContainer>
            <div style={{flex:1,display:'flex',flexDirection:'column',gap:7}}>
              {EXPENSE_BREAKDOWN.map(e=>(
                <div key={e.name} style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                  <div style={{display:'flex',alignItems:'center',gap:6}}>
                    <div style={{width:9,height:9,borderRadius:2,background:e.color}}/>
                    <span style={{fontSize:12,color:'var(--text-secondary)'}}>{e.name}</span>
                  </div>
                  <span style={{fontSize:12,fontWeight:600}}>{e.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="card" style={{padding:20}}>
          <div className="card-title" style={{marginBottom:14}}>Category Trends</div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={EXPENSE_BREAKDOWN} margin={{top:0,right:0,bottom:0,left:-20}}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false}/>
              <XAxis dataKey="name" tick={{fontSize:10,fill:'var(--text-secondary)'}} axisLine={false} tickLine={false}/>
              <YAxis tickFormatter={formatINRShort} tick={{fontSize:10,fill:'var(--text-secondary)'}} axisLine={false} tickLine={false}/>
              <Tooltip formatter={(v)=>[formatINR(v),'Amount']} contentStyle={{borderRadius:10,fontSize:12}}/>
              <Bar dataKey="value" fill="#EE5D50" radius={[4,4,0,0]} maxBarSize={28}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card" style={{padding:0,overflow:'hidden'}}>
        <div style={{padding:'16px 20px',borderBottom:'1px solid var(--border)',display:'flex',gap:10,alignItems:'center',flexWrap:'wrap'}}>
          <div className="filter-search">
            <Search size={14} color="var(--text-muted)"/>
            <input value={search} onChange={e=>{setSearch(e.target.value);setPage(1)}} placeholder="Search expenses..."/>
          </div>
          <select value={catFilter} onChange={e=>{setCatFilter(e.target.value);setPage(1)}} className="form-input" style={{width:'auto',padding:'8px 12px',fontSize:13}}>
            <option value="all">All Categories</option>
            {CATEGORIES.map(c=><option key={c}>{c}</option>)}
          </select>
          <div style={{marginLeft:'auto',display:'flex',gap:8}}>
            <button onClick={()=>exportToCSV(filtered,'Expenses')} className="btn btn-secondary btn-sm"><Download size={14}/> CSV</button>
            <button onClick={()=>exportToPDF(filtered,'Expense Report',['name','vendor','date','category','amount'])} className="btn btn-secondary btn-sm"><Download size={14}/> PDF</button>
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Expense Name</th><th>Vendor</th><th>Date</th><th>Category</th><th>GST Paid</th><th>Amount</th><th>Actions</th></tr></thead>
            <tbody>
              {paged.length===0 && <tr><td colSpan={7} className="table-empty">No expense entries found.</td></tr>}
              {paged.map(r=>(
                <tr key={r.id}>
                  <td style={{fontWeight:600}}>{r.name}</td>
                  <td style={{color:'var(--text-secondary)',fontSize:13}}>{r.vendor}</td>
                  <td style={{color:'var(--text-muted)',fontSize:13}}>{r.date}</td>
                  <td><span className="badge badge-red">{r.category}</span></td>
                  <td style={{fontSize:13}}>{formatINR(r.gstPaid)}</td>
                  <td style={{fontWeight:700,color:'var(--red)'}}>{formatINR(r.amount)}</td>
                  <td><div style={{display:'flex',gap:6}}>
                    <button onClick={()=>openEdit(r)} className="btn btn-ghost btn-sm" style={{padding:'5px 9px'}}><Edit2 size={13}/></button>
                    <button onClick={()=>del(r.id)} className="btn btn-danger btn-sm" style={{padding:'5px 9px'}}><Trash2 size={13}/></button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{padding:'12px 20px',borderTop:'1px solid var(--border)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <span style={{fontSize:12.5,color:'var(--text-secondary)'}}>Showing {Math.min((page-1)*PER+1,filtered.length)}–{Math.min(page*PER,filtered.length)} of {filtered.length}</span>
          <div style={{display:'flex',gap:4}}>{Array.from({length:pages},(_,i)=>i+1).map(p=>(<button key={p} className={`pagination-btn${p===page?' active':''}`} onClick={()=>setPage(p)}>{p}</button>))}</div>
        </div>
      </div>

      <AnimatePresence>
        {modal && (
          <motion.div className="modal-overlay" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={e=>{if(e.target===e.currentTarget)setModal(false)}}>
            <motion.div className="modal" initial={{scale:0.92,opacity:0}} animate={{scale:1,opacity:1}} exit={{scale:0.92,opacity:0}}>
              <div className="modal-header">
                <div className="modal-title">{editing?'Edit Expense':'Add Expense'}</div>
                <button className="modal-close" onClick={()=>setModal(false)}><X size={18}/></button>
              </div>
              <div className="modal-body">
                <div className="grid-2">
                  <div className="form-group"><label className="form-label">Expense Name *</label><input className="form-input" placeholder="e.g. Office Rent" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}/></div>
                  <div className="form-group"><label className="form-label">Vendor</label><input className="form-input" placeholder="Vendor name" value={form.vendor} onChange={e=>setForm(f=>({...f,vendor:e.target.value}))}/></div>
                  <div className="form-group"><label className="form-label">Date *</label><input type="date" className="form-input" value={form.date} onChange={e=>setForm(f=>({...f,date:e.target.value}))}/></div>
                  <div className="form-group"><label className="form-label">Category</label><select className="form-input" value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))}>{CATEGORIES.map(c=><option key={c}>{c}</option>)}</select></div>
                  <div className="form-group"><label className="form-label">Payment Method</label><select className="form-input" value={form.paymentMethod} onChange={e=>setForm(f=>({...f,paymentMethod:e.target.value}))}>{PAYMENT_METHODS.map(m=><option key={m}>{m}</option>)}</select></div>
                  <div className="form-group"><label className="form-label">Amount (₹) *</label><input type="number" className="form-input" placeholder="0" value={form.amount} onChange={e=>setForm(f=>({...f,amount:e.target.value}))}/></div>
                  <div className="form-group"><label className="form-label">GST Paid (₹)</label><input type="number" className="form-input" placeholder="0" value={form.gstPaid} onChange={e=>setForm(f=>({...f,gstPaid:e.target.value}))}/></div>
                </div>
                <div className="form-group"><label className="form-label">Notes</label><textarea className="form-input" placeholder="Optional notes..." value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))} style={{minHeight:64}}/></div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={()=>setModal(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={save}>{editing?'Update':'Add Expense'}</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
