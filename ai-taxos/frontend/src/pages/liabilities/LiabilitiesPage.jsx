import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, X, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import { MOCK_LIABILITIES, formatINR } from '../../data/mockData';

const EMPTY = { name:'', lender:'', outstanding:'', emi:'', interestRate:'', dueDate:'', startDate:'' };

export default function LiabilitiesPage() {
  const [records, setRecords] = useState(MOCK_LIABILITIES);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);

  const totalOutstanding = records.reduce((s,r) => s+Number(r.outstanding), 0);
  const totalEMI = records.reduce((s,r) => s+Number(r.emi), 0);

  const openAdd = () => { setEditing(null); setForm(EMPTY); setModal(true); };
  const openEdit = (r) => { setEditing(r.id); setForm({...r,outstanding:String(r.outstanding),emi:String(r.emi),interestRate:String(r.interestRate)}); setModal(true); };
  const save = () => {
    if (!form.name || !form.outstanding) { toast.error('Fill required fields'); return; }
    if (editing) {
      setRecords(rs => rs.map(r => r.id===editing ? {...r,...form,outstanding:Number(form.outstanding),emi:Number(form.emi),interestRate:Number(form.interestRate)} : r));
      toast.success('Liability updated!');
    } else {
      setRecords(rs => [...rs, {...form,id:'LIA-'+Date.now(),outstanding:Number(form.outstanding),emi:Number(form.emi),interestRate:Number(form.interestRate)}]);
      toast.success('Liability added!');
    }
    setModal(false);
  };
  const del = (id) => { if(window.confirm('Delete?')){setRecords(rs=>rs.filter(r=>r.id!==id));toast.success('Deleted.');} };

  const getDaysLeft = (dueDate) => {
    const d = new Date(dueDate) - new Date();
    return Math.ceil(d / 86400000);
  };

  return (
    <div>
      <div className="page-header flex justify-between items-center">
        <div><h1 className="page-title">Liabilities</h1><p className="page-subtitle">Track loans, EMIs and outstanding dues</p></div>
        <button className="btn btn-primary" onClick={openAdd}><Plus size={16}/> Add Liability</button>
      </div>

      <div className="grid-3" style={{gap:14,marginBottom:20}}>
        <div className="card" style={{padding:20}}>
          <div style={{width:42,height:42,borderRadius:10,background:'#FDECEA',display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,marginBottom:12}}>💳</div>
          <div style={{fontSize:12,color:'var(--text-secondary)',marginBottom:4}}>Total Outstanding</div>
          <div style={{fontSize:22,fontWeight:800,color:'var(--red)'}}>{formatINR(totalOutstanding)}</div>
        </div>
        <div className="card" style={{padding:20}}>
          <div style={{width:42,height:42,borderRadius:10,background:'#FFF4E0',display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,marginBottom:12}}>📅</div>
          <div style={{fontSize:12,color:'var(--text-secondary)',marginBottom:4}}>Monthly EMI Total</div>
          <div style={{fontSize:22,fontWeight:800,color:'var(--orange)'}}>{formatINR(totalEMI)}</div>
        </div>
        <div className="card" style={{padding:20}}>
          <div style={{width:42,height:42,borderRadius:10,background:'#EEF4FF',display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,marginBottom:12}}>🏦</div>
          <div style={{fontSize:12,color:'var(--text-secondary)',marginBottom:4}}>Active Loans</div>
          <div style={{fontSize:22,fontWeight:800,color:'var(--text-primary)'}}>{records.length}</div>
        </div>
      </div>

      <div className="card" style={{padding:0,overflow:'hidden'}}>
        <div style={{padding:'16px 20px',borderBottom:'1px solid var(--border)'}}>
          <div className="card-title">Loan & Liability Register</div>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Loan Name</th><th>Lender</th><th>Outstanding</th><th>EMI</th><th>Interest Rate</th><th>Due Date</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {records.length===0 && <tr><td colSpan={8} className="table-empty">No liabilities added.</td></tr>}
              {records.map(r=>{
                const daysLeft = getDaysLeft(r.dueDate);
                return (
                  <tr key={r.id}>
                    <td style={{fontWeight:600}}>{r.name}</td>
                    <td style={{color:'var(--text-secondary)',fontSize:13}}>{r.lender}</td>
                    <td style={{fontWeight:700,color:'var(--red)'}}>{formatINR(r.outstanding)}</td>
                    <td style={{fontWeight:600}}>{formatINR(r.emi)}</td>
                    <td><span className="badge badge-orange">{r.interestRate}% p.a.</span></td>
                    <td style={{color:'var(--text-muted)',fontSize:13}}>{r.dueDate}</td>
                    <td>{daysLeft<=7 ? <span className="badge badge-red">Due in {daysLeft}d</span> : daysLeft<=15 ? <span className="badge badge-orange">Due in {daysLeft}d</span> : <span className="badge badge-green">Active</span>}</td>
                    <td><div style={{display:'flex',gap:6}}>
                      <button onClick={()=>openEdit(r)} className="btn btn-ghost btn-sm" style={{padding:'5px 9px'}}><Edit2 size={13}/></button>
                      <button onClick={()=>del(r.id)} className="btn btn-danger btn-sm" style={{padding:'5px 9px'}}><Trash2 size={13}/></button>
                    </div></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {modal && (
          <motion.div className="modal-overlay" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={e=>{if(e.target===e.currentTarget)setModal(false)}}>
            <motion.div className="modal" initial={{scale:0.92,opacity:0}} animate={{scale:1,opacity:1}} exit={{scale:0.92,opacity:0}}>
              <div className="modal-header"><div className="modal-title">{editing?'Edit Liability':'Add Liability'}</div><button className="modal-close" onClick={()=>setModal(false)}><X size={18}/></button></div>
              <div className="modal-body">
                <div className="grid-2">
                  <div className="form-group"><label className="form-label">Loan Name *</label><input className="form-input" placeholder="e.g. Business Loan" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}/></div>
                  <div className="form-group"><label className="form-label">Lender</label><input className="form-input" placeholder="Bank name" value={form.lender} onChange={e=>setForm(f=>({...f,lender:e.target.value}))}/></div>
                  <div className="form-group"><label className="form-label">Outstanding Amount (₹) *</label><input type="number" className="form-input" placeholder="0" value={form.outstanding} onChange={e=>setForm(f=>({...f,outstanding:e.target.value}))}/></div>
                  <div className="form-group"><label className="form-label">Monthly EMI (₹)</label><input type="number" className="form-input" placeholder="0" value={form.emi} onChange={e=>setForm(f=>({...f,emi:e.target.value}))}/></div>
                  <div className="form-group"><label className="form-label">Interest Rate (%)</label><input type="number" step="0.1" className="form-input" placeholder="10.5" value={form.interestRate} onChange={e=>setForm(f=>({...f,interestRate:e.target.value}))}/></div>
                  <div className="form-group"><label className="form-label">Next Due Date</label><input type="date" className="form-input" value={form.dueDate} onChange={e=>setForm(f=>({...f,dueDate:e.target.value}))}/></div>
                </div>
              </div>
              <div className="modal-footer"><button className="btn btn-secondary" onClick={()=>setModal(false)}>Cancel</button><button className="btn btn-primary" onClick={save}>{editing?'Update':'Add Liability'}</button></div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
