import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Search, Download, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { MOCK_PURCHASES, formatINR, formatINRShort } from '../../data/mockData';
import { exportToCSV, exportToPDF } from '../../utils/exports';

const EMPTY = { supplier:'', invoiceNo:'', product:'', qty:'1', purchaseAmount:'', gstAmount:'', date:'' };

export default function PurchasesPage() {
  const [records, setRecords] = useState(MOCK_PURCHASES);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const PER = 7;

  const filtered = useMemo(() => {
    if (!search) return records;
    return records.filter(x => x.supplier.toLowerCase().includes(search.toLowerCase()) || x.product.toLowerCase().includes(search.toLowerCase()) || x.invoiceNo.toLowerCase().includes(search.toLowerCase()));
  }, [records, search]);

  const paged = filtered.slice((page-1)*PER, page*PER);
  const pages = Math.max(1, Math.ceil(filtered.length / PER));
  const total = records.reduce((s,r) => s+Number(r.purchaseAmount), 0);

  const openAdd = () => { setEditing(null); setForm(EMPTY); setModal(true); };
  const openEdit = (r) => { setEditing(r.id); setForm({...r,purchaseAmount:String(r.purchaseAmount),gstAmount:String(r.gstAmount),qty:String(r.qty)}); setModal(true); };
  const save = () => {
    if (!form.supplier || !form.purchaseAmount || !form.date) { toast.error('Fill required fields'); return; }
    if (editing) {
      setRecords(rs => rs.map(r => r.id===editing ? {...r,...form,qty:Number(form.qty),purchaseAmount:Number(form.purchaseAmount),gstAmount:Number(form.gstAmount||0)} : r));
      toast.success('Purchase updated!');
    } else {
      setRecords(rs => [{...form,id:'PUR-'+Date.now(),qty:Number(form.qty),purchaseAmount:Number(form.purchaseAmount),gstAmount:Number(form.gstAmount||0),createdAt:new Date()},...rs]);
      toast.success('Purchase added!');
    }
    setModal(false);
  };
  const del = (id) => { if(window.confirm('Delete?')){setRecords(rs=>rs.filter(r=>r.id!==id));toast.success('Deleted.');} };

  return (
    <div>
      <div className="page-header flex justify-between items-center">
        <div><h1 className="page-title">Purchases</h1><p className="page-subtitle">Track all supplier purchases and inventory</p></div>
        <button className="btn btn-primary" onClick={openAdd}><Plus size={16}/> Add Purchase</button>
      </div>

      <div className="grid-4" style={{gap:14,marginBottom:20}}>
        {[
          {label:'Total Purchases',value:formatINR(total),icon:'🛒',bg:'#EEF4FF'},
          {label:'Total GST Paid',value:formatINRShort(records.reduce((s,r)=>s+Number(r.gstAmount),0)),icon:'🧾',bg:'#FFF4E0'},
          {label:'Total Entries',value:records.length,icon:'📋',bg:'#F2EFFF'},
          {label:'Avg Purchase',value:formatINRShort(total/Math.max(records.length,1)),icon:'📊',bg:'#E6FAF5'},
        ].map(s=>(
          <div key={s.label} className="card" style={{padding:18}}>
            <div style={{width:38,height:38,borderRadius:10,background:s.bg,display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,marginBottom:10}}>{s.icon}</div>
            <div style={{fontSize:12,color:'var(--text-secondary)',marginBottom:4}}>{s.label}</div>
            <div style={{fontSize:20,fontWeight:800,color:'var(--text-primary)'}}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="card" style={{padding:0,overflow:'hidden'}}>
        <div style={{padding:'16px 20px',borderBottom:'1px solid var(--border)',display:'flex',gap:10,alignItems:'center',flexWrap:'wrap'}}>
          <div className="filter-search"><Search size={14} color="var(--text-muted)"/><input value={search} onChange={e=>{setSearch(e.target.value);setPage(1)}} placeholder="Search purchases..."/></div>
          <div style={{marginLeft:'auto',display:'flex',gap:8}}>
            <button onClick={()=>exportToCSV(filtered,'Purchases')} className="btn btn-secondary btn-sm"><Download size={14}/> CSV</button>
            <button onClick={()=>exportToPDF(filtered,'Purchase Report',['invoiceNo','supplier','product','qty','purchaseAmount'])} className="btn btn-secondary btn-sm"><Download size={14}/> PDF</button>
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Invoice #</th><th>Supplier</th><th>Product</th><th>Qty</th><th>GST Amount</th><th>Date</th><th>Total</th><th>Actions</th></tr></thead>
            <tbody>
              {paged.length===0 && <tr><td colSpan={8} className="table-empty">No purchases found.</td></tr>}
              {paged.map(r=>(
                <tr key={r.id}>
                  <td style={{fontWeight:600,color:'var(--brand)'}}>{r.invoiceNo}</td>
                  <td style={{fontWeight:500}}>{r.supplier}</td>
                  <td style={{color:'var(--text-secondary)',fontSize:13}}>{r.product}</td>
                  <td style={{textAlign:'center'}}>{r.qty}</td>
                  <td style={{fontSize:13}}>{formatINR(r.gstAmount)}</td>
                  <td style={{color:'var(--text-muted)',fontSize:13}}>{r.date}</td>
                  <td style={{fontWeight:700}}>{formatINR(r.purchaseAmount)}</td>
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
              <div className="modal-header"><div className="modal-title">{editing?'Edit Purchase':'Add Purchase'}</div><button className="modal-close" onClick={()=>setModal(false)}><X size={18}/></button></div>
              <div className="modal-body">
                <div className="grid-2">
                  <div className="form-group"><label className="form-label">Supplier Name *</label><input className="form-input" placeholder="Supplier" value={form.supplier} onChange={e=>setForm(f=>({...f,supplier:e.target.value}))}/></div>
                  <div className="form-group"><label className="form-label">Invoice Number</label><input className="form-input" placeholder="INV-001" value={form.invoiceNo} onChange={e=>setForm(f=>({...f,invoiceNo:e.target.value}))}/></div>
                  <div className="form-group"><label className="form-label">Product Name</label><input className="form-input" placeholder="Product" value={form.product} onChange={e=>setForm(f=>({...f,product:e.target.value}))}/></div>
                  <div className="form-group"><label className="form-label">Quantity</label><input type="number" className="form-input" placeholder="1" value={form.qty} onChange={e=>setForm(f=>({...f,qty:e.target.value}))}/></div>
                  <div className="form-group"><label className="form-label">Purchase Amount (₹) *</label><input type="number" className="form-input" placeholder="0" value={form.purchaseAmount} onChange={e=>setForm(f=>({...f,purchaseAmount:e.target.value}))}/></div>
                  <div className="form-group"><label className="form-label">GST Amount (₹)</label><input type="number" className="form-input" placeholder="0" value={form.gstAmount} onChange={e=>setForm(f=>({...f,gstAmount:e.target.value}))}/></div>
                  <div className="form-group"><label className="form-label">Date *</label><input type="date" className="form-input" value={form.date} onChange={e=>setForm(f=>({...f,date:e.target.value}))}/></div>
                </div>
              </div>
              <div className="modal-footer"><button className="btn btn-secondary" onClick={()=>setModal(false)}>Cancel</button><button className="btn btn-primary" onClick={save}>{editing?'Update':'Add Purchase'}</button></div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
