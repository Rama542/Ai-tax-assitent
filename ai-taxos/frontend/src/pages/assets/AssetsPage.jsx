import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { MOCK_ASSETS, formatINR } from '../../data/mockData';

const EMPTY = { name:'', category:'Electronics', purchaseDate:'', purchaseCost:'', currentValue:'', depreciation:'', depRate:20 };
const CATEGORIES = ['Electronics','Furniture','Vehicle','Technology','Machinery','Property','Other'];

export default function AssetsPage() {
  const [records, setRecords] = useState(MOCK_ASSETS);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);

  const totalCost = records.reduce((s,r) => s+Number(r.purchaseCost), 0);
  const totalValue = records.reduce((s,r) => s+Number(r.currentValue), 0);
  const totalDep = records.reduce((s,r) => s+Number(r.depreciation), 0);

  const openAdd = () => { setEditing(null); setForm(EMPTY); setModal(true); };
  const openEdit = (r) => { setEditing(r.id); setForm({...r,purchaseCost:String(r.purchaseCost),currentValue:String(r.currentValue),depreciation:String(r.depreciation)}); setModal(true); };
  const save = () => {
    if (!form.name || !form.purchaseCost) { toast.error('Fill required fields'); return; }
    const cost = Number(form.purchaseCost);
    const currVal = form.currentValue ? Number(form.currentValue) : cost * (1 - form.depRate/100);
    const dep = cost - currVal;
    if (editing) {
      setRecords(rs => rs.map(r => r.id===editing ? {...r,...form,purchaseCost:cost,currentValue:currVal,depreciation:dep} : r));
      toast.success('Asset updated!');
    } else {
      setRecords(rs => [...rs, {...form,id:'AST-'+Date.now(),purchaseCost:cost,currentValue:currVal,depreciation:dep}]);
      toast.success('Asset added!');
    }
    setModal(false);
  };
  const del = (id) => { if(window.confirm('Delete?')){setRecords(rs=>rs.filter(r=>r.id!==id));toast.success('Deleted.');} };

  return (
    <div>
      <div className="page-header flex justify-between items-center">
        <div><h1 className="page-title">Assets</h1><p className="page-subtitle">Manage your business assets and depreciation</p></div>
        <button className="btn btn-primary" onClick={openAdd}><Plus size={16}/> Add Asset</button>
      </div>

      <div className="grid-3" style={{gap:14,marginBottom:20}}>
        {[
          {label:'Total Asset Cost',value:formatINR(totalCost),icon:'🏢',bg:'#EEF4FF'},
          {label:'Current Value',value:formatINR(totalValue),icon:'💰',bg:'#E6FAF5'},
          {label:'Total Depreciation',value:formatINR(totalDep),icon:'📉',bg:'#FDECEA'},
        ].map(s=>(
          <div key={s.label} className="card" style={{padding:20}}>
            <div style={{width:42,height:42,borderRadius:10,background:s.bg,display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,marginBottom:12}}>{s.icon}</div>
            <div style={{fontSize:12,color:'var(--text-secondary)',marginBottom:4}}>{s.label}</div>
            <div style={{fontSize:22,fontWeight:800,color:'var(--text-primary)'}}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="card" style={{padding:0,overflow:'hidden'}}>
        <div style={{padding:'16px 20px',borderBottom:'1px solid var(--border)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div className="card-title">Asset Register</div>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Asset Name</th><th>Category</th><th>Purchase Date</th><th>Cost</th><th>Current Value</th><th>Depreciation</th><th>Dep Rate</th><th>Actions</th></tr></thead>
            <tbody>
              {records.length===0 && <tr><td colSpan={8} className="table-empty">No assets added yet.</td></tr>}
              {records.map(r=>(
                <tr key={r.id}>
                  <td style={{fontWeight:600}}>{r.name}</td>
                  <td><span className="badge badge-blue">{r.category}</span></td>
                  <td style={{color:'var(--text-muted)',fontSize:13}}>{r.purchaseDate}</td>
                  <td style={{fontWeight:600}}>{formatINR(r.purchaseCost)}</td>
                  <td style={{fontWeight:600,color:'var(--green)'}}>{formatINR(r.currentValue)}</td>
                  <td style={{color:'var(--red)'}}>{formatINR(r.depreciation)}</td>
                  <td><span className="badge badge-orange">{r.depRate}%</span></td>
                  <td><div style={{display:'flex',gap:6}}>
                    <button onClick={()=>openEdit(r)} className="btn btn-ghost btn-sm" style={{padding:'5px 9px'}}><Edit2 size={13}/></button>
                    <button onClick={()=>del(r.id)} className="btn btn-danger btn-sm" style={{padding:'5px 9px'}}><Trash2 size={13}/></button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {modal && (
          <motion.div className="modal-overlay" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={e=>{if(e.target===e.currentTarget)setModal(false)}}>
            <motion.div className="modal" initial={{scale:0.92,opacity:0}} animate={{scale:1,opacity:1}} exit={{scale:0.92,opacity:0}}>
              <div className="modal-header"><div className="modal-title">{editing?'Edit Asset':'Add Asset'}</div><button className="modal-close" onClick={()=>setModal(false)}><X size={18}/></button></div>
              <div className="modal-body">
                <div className="grid-2">
                  <div className="form-group"><label className="form-label">Asset Name *</label><input className="form-input" placeholder="e.g. MacBook Pro" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}/></div>
                  <div className="form-group"><label className="form-label">Category</label><select className="form-input" value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))}>{CATEGORIES.map(c=><option key={c}>{c}</option>)}</select></div>
                  <div className="form-group"><label className="form-label">Purchase Date</label><input type="date" className="form-input" value={form.purchaseDate} onChange={e=>setForm(f=>({...f,purchaseDate:e.target.value}))}/></div>
                  <div className="form-group"><label className="form-label">Purchase Cost (₹) *</label><input type="number" className="form-input" placeholder="0" value={form.purchaseCost} onChange={e=>setForm(f=>({...f,purchaseCost:e.target.value}))}/></div>
                  <div className="form-group"><label className="form-label">Current Value (₹)</label><input type="number" className="form-input" placeholder="Auto-calculated" value={form.currentValue} onChange={e=>setForm(f=>({...f,currentValue:e.target.value}))}/></div>
                  <div className="form-group"><label className="form-label">Depreciation Rate (%)</label><select className="form-input" value={form.depRate} onChange={e=>setForm(f=>({...f,depRate:Number(e.target.value)}))}>{[5,10,15,20,25,33].map(r=><option key={r}>{r}</option>)}</select></div>
                </div>
              </div>
              <div className="modal-footer"><button className="btn btn-secondary" onClick={()=>setModal(false)}>Cancel</button><button className="btn btn-primary" onClick={save}>{editing?'Update':'Add Asset'}</button></div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
