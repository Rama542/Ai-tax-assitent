import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line } from 'recharts';
import { Plus, Edit2, Trash2, Search, Download, ChevronUp, ChevronDown, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { MOCK_REVENUES, REVENUE_MONTHLY, formatINR, formatINRShort } from '../../data/mockData';
import { exportToCSV, exportToPDF } from '../../utils/exports';

const CATEGORIES = ['Software Services','Design Services','Marketing','IT Support','Consulting','Training','Other'];
const PAYMENT_METHODS = ['Bank Transfer','UPI','Credit Card','Cheque','Cash','Auto-debit'];

const EMPTY = { invoiceNo:'', customer:'', date:'', category:'Software Services', paymentMethod:'Bank Transfer', gstIncluded:true, gstPct:18, amount:'', notes:'' };

export default function RevenuePage() {
  const [records, setRecords] = useState(MOCK_REVENUES);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('all');
  const [sort, setSort] = useState({ key:'date', dir:'desc' });
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const PER = 6;

  const filtered = useMemo(() => {
    let r = [...records];
    if (search) r = r.filter(x => x.customer.toLowerCase().includes(search.toLowerCase()) || x.invoiceNo.toLowerCase().includes(search.toLowerCase()));
    if (catFilter !== 'all') r = r.filter(x => x.category === catFilter);
    r.sort((a,b) => {
      let av = a[sort.key], bv = b[sort.key];
      if (typeof av === 'string') av = av.toLowerCase(), bv = bv.toLowerCase();
      return sort.dir === 'asc' ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1);
    });
    return r;
  }, [records, search, catFilter, sort]);

  const pages = Math.max(1, Math.ceil(filtered.length / PER));
  const paged = filtered.slice((page-1)*PER, page*PER);

  const totalRevenue = records.reduce((s,r) => s + Number(r.amount), 0);
  const monthRevenue = records.filter(r => r.date >= new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0,10)).reduce((s,r)=>s+Number(r.amount),0);

  const openAdd = () => { setEditing(null); setForm(EMPTY); setModal(true); };
  const openEdit = (r) => { setEditing(r.id); setForm({ ...r, amount: String(r.amount) }); setModal(true); };

  const save = () => {
    if (!form.customer || !form.amount || !form.date) { toast.error('Fill required fields'); return; }
    if (editing) {
      setRecords(rs => rs.map(r => r.id === editing ? { ...r, ...form, amount: Number(form.amount) } : r));
      toast.success('Revenue updated!');
    } else {
      const newRec = { ...form, id:'REV-' + Date.now(), amount: Number(form.amount), createdAt: new Date() };
      setRecords(rs => [newRec, ...rs]);
      toast.success('Revenue added!');
    }
    setModal(false);
  };

  const del = (id) => { if (window.confirm('Delete this revenue entry?')) { setRecords(rs => rs.filter(r => r.id !== id)); toast.success('Deleted.'); } };
  const sortBy = (key) => setSort(s => ({ key, dir: s.key === key && s.dir === 'asc' ? 'desc' : 'asc' }));
  const SortIcon = ({ k }) => sort.key===k ? (sort.dir==='asc' ? <ChevronUp size={13}/> : <ChevronDown size={13}/>) : null;

  return (
    <div>
      <div className="page-header flex justify-between items-center">
        <div>
          <h1 className="page-title">Revenue</h1>
          <p className="page-subtitle">Track and manage all your revenue entries</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}><Plus size={16} /> Add Revenue</button>
      </div>

      {/* Stats */}
      <div className="grid-4" style={{ gap:14, marginBottom:20 }}>
        {[
          { label:'Total Revenue', value: formatINR(totalRevenue), icon:'₹', bg:'#E6FAF5' },
          { label:'This Month', value: formatINRShort(monthRevenue), icon:'📅', bg:'#EEF4FF' },
          { label:'Total Entries', value: records.length, icon:'📋', bg:'#F2EFFF' },
          { label:'Avg per Entry', value: formatINRShort(totalRevenue/Math.max(records.length,1)), icon:'📊', bg:'#FFF4E0' },
        ].map(s => (
          <div key={s.label} className="card" style={{ padding:18 }}>
            <div style={{ width:38, height:38, borderRadius:10, background:s.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, marginBottom:10 }}>{s.icon}</div>
            <div style={{ fontSize:12, color:'var(--text-secondary)', marginBottom:4 }}>{s.label}</div>
            <div style={{ fontSize:20, fontWeight:800, color:'var(--text-primary)' }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="card" style={{ padding:20, marginBottom:20 }}>
        <div className="card-title" style={{ marginBottom:14 }}>Revenue by Month</div>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={REVENUE_MONTHLY} margin={{ top:0, right:4, bottom:0, left:-20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize:11, fill:'var(--text-secondary)' }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={formatINRShort} tick={{ fontSize:10, fill:'var(--text-secondary)' }} axisLine={false} tickLine={false} />
            <Tooltip formatter={(v)=>[formatINR(v),'Revenue']} contentStyle={{ borderRadius:12, fontSize:12 }} />
            <Bar dataKey="revenue" fill="#4318FF" radius={[4,4,0,0]} maxBarSize={28} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Table */}
      <div className="card" style={{ padding:0, overflow:'hidden' }}>
        {/* Filter bar */}
        <div style={{ padding:'16px 20px', borderBottom:'1px solid var(--border)', display:'flex', gap:10, alignItems:'center', flexWrap:'wrap' }}>
          <div className="filter-search">
            <Search size={14} color="var(--text-muted)" />
            <input value={search} onChange={e=>{setSearch(e.target.value);setPage(1)}} placeholder="Search by customer or invoice..." />
          </div>
          <select value={catFilter} onChange={e=>{setCatFilter(e.target.value);setPage(1)}} className="form-input" style={{ width:'auto', padding:'8px 12px', fontSize:13 }}>
            <option value="all">All Categories</option>
            {CATEGORIES.map(c=><option key={c}>{c}</option>)}
          </select>
          <div style={{ marginLeft:'auto', display:'flex', gap:8 }}>
            <button onClick={() => exportToCSV(filtered, 'Revenue')} className="btn btn-secondary btn-sm"><Download size={14} /> CSV</button>
            <button onClick={() => exportToPDF(filtered, 'Revenue Report', ['invoiceNo','customer','date','category','amount'])} className="btn btn-secondary btn-sm"><Download size={14} /> PDF</button>
          </div>
        </div>

        <div className="table-wrap">
          <table>
            <thead><tr>
              <th onClick={()=>sortBy('invoiceNo')}>Invoice # <SortIcon k="invoiceNo"/></th>
              <th onClick={()=>sortBy('customer')}>Customer <SortIcon k="customer"/></th>
              <th onClick={()=>sortBy('date')}>Date <SortIcon k="date"/></th>
              <th>Category</th>
              <th>Payment</th>
              <th>GST</th>
              <th onClick={()=>sortBy('amount')}>Amount <SortIcon k="amount"/></th>
              <th>Actions</th>
            </tr></thead>
            <tbody>
              {paged.length === 0 && <tr><td colSpan={8} className="table-empty">No revenue entries found.</td></tr>}
              {paged.map(r => (
                <tr key={r.id}>
                  <td style={{ fontWeight:600, color:'var(--brand)' }}>{r.invoiceNo}</td>
                  <td style={{ fontWeight:500 }}>{r.customer}</td>
                  <td style={{ color:'var(--text-secondary)', fontSize:13 }}>{r.date}</td>
                  <td><span className="badge badge-blue">{r.category}</span></td>
                  <td style={{ fontSize:13, color:'var(--text-secondary)' }}>{r.paymentMethod}</td>
                  <td>{r.gstIncluded ? <span className="badge badge-green">{r.gstPct}%</span> : <span className="badge badge-gray">None</span>}</td>
                  <td style={{ fontWeight:700 }}>{formatINR(r.amount)}</td>
                  <td>
                    <div style={{ display:'flex', gap:6 }}>
                      <button onClick={()=>openEdit(r)} className="btn btn-ghost btn-sm" style={{ padding:'5px 9px' }}><Edit2 size={13}/></button>
                      <button onClick={()=>del(r.id)} className="btn btn-danger btn-sm" style={{ padding:'5px 9px' }}><Trash2 size={13}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div style={{ padding:'12px 20px', borderTop:'1px solid var(--border)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <span style={{ fontSize:12.5, color:'var(--text-secondary)' }}>Showing {Math.min((page-1)*PER+1,filtered.length)}–{Math.min(page*PER,filtered.length)} of {filtered.length}</span>
          <div style={{ display:'flex', gap:4 }}>
            {Array.from({length:pages},(_,i)=>i+1).map(p=>(
              <button key={p} className={`pagination-btn${p===page?' active':''}`} onClick={()=>setPage(p)}>{p}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modal && (
          <motion.div className="modal-overlay" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={e=>{if(e.target===e.currentTarget)setModal(false)}}>
            <motion.div className="modal" initial={{scale:0.92,opacity:0}} animate={{scale:1,opacity:1}} exit={{scale:0.92,opacity:0}}>
              <div className="modal-header">
                <div className="modal-title">{editing?'Edit Revenue Entry':'Add Revenue Entry'}</div>
                <button className="modal-close" onClick={()=>setModal(false)}><X size={18}/></button>
              </div>
              <div className="modal-body">
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Invoice Number</label>
                    <input className="form-input" placeholder="INV-10001" value={form.invoiceNo} onChange={e=>setForm(f=>({...f,invoiceNo:e.target.value}))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Customer Name *</label>
                    <input className="form-input" placeholder="Company / Person" value={form.customer} onChange={e=>setForm(f=>({...f,customer:e.target.value}))} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Invoice Date *</label>
                    <input type="date" className="form-input" value={form.date} onChange={e=>setForm(f=>({...f,date:e.target.value}))} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select className="form-input" value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))}>
                      {CATEGORIES.map(c=><option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Payment Method</label>
                    <select className="form-input" value={form.paymentMethod} onChange={e=>setForm(f=>({...f,paymentMethod:e.target.value}))}>
                      {PAYMENT_METHODS.map(m=><option key={m}>{m}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Amount (₹) *</label>
                    <input type="number" className="form-input" placeholder="0" value={form.amount} onChange={e=>setForm(f=>({...f,amount:e.target.value}))} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">GST Included?</label>
                    <select className="form-input" value={form.gstIncluded?'yes':'no'} onChange={e=>setForm(f=>({...f,gstIncluded:e.target.value==='yes'}))}>
                      <option value="yes">Yes</option><option value="no">No</option>
                    </select>
                  </div>
                  {form.gstIncluded && (
                    <div className="form-group">
                      <label className="form-label">GST Percentage</label>
                      <select className="form-input" value={form.gstPct} onChange={e=>setForm(f=>({...f,gstPct:Number(e.target.value)}))}>
                        {[5,12,18,28].map(p=><option key={p}>{p}</option>)}
                      </select>
                    </div>
                  )}
                </div>
                <div className="form-group">
                  <label className="form-label">Notes</label>
                  <textarea className="form-input" placeholder="Optional notes..." value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))} style={{ minHeight:64 }} />
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={()=>setModal(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={save}>{editing?'Update Revenue':'Add Revenue'}</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
