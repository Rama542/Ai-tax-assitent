import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, X, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import { MOCK_EMPLOYEES, formatINR } from '../../data/mockData';
import { exportToCSV, exportToPDF } from '../../utils/exports';

const DEPTS = ['Engineering','Design','Sales','HR','Finance','Operations','Marketing'];
const EMPTY = { name:'', empId:'', department:'Engineering', designation:'', salary:'', joiningDate:'', pf:'', professionalTax:'200', status:'active' };

export default function EmployeesPage() {
  const [records, setRecords] = useState(MOCK_EMPLOYEES);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);

  const totalSalary = records.reduce((s,r) => s+Number(r.salary), 0);
  const totalPF = records.reduce((s,r) => s+Number(r.pf), 0);
  const totalPT = records.reduce((s,r) => s+Number(r.professionalTax), 0);

  const openAdd = () => { setEditing(null); setForm({...EMPTY,empId:'TEC-'+String(records.length+101)}); setModal(true); };
  const openEdit = (r) => { setEditing(r.id); setForm({...r,salary:String(r.salary),pf:String(r.pf),professionalTax:String(r.professionalTax)}); setModal(true); };
  const save = () => {
    if (!form.name || !form.salary) { toast.error('Fill required fields'); return; }
    const salary = Number(form.salary);
    const pf = form.pf ? Number(form.pf) : Math.round(salary * 0.12);
    if (editing) {
      setRecords(rs => rs.map(r => r.id===editing ? {...r,...form,salary,pf,professionalTax:Number(form.professionalTax||200)} : r));
      toast.success('Employee updated!');
    } else {
      setRecords(rs => [...rs, {...form,id:'EMP-'+Date.now(),salary,pf,professionalTax:Number(form.professionalTax||200)}]);
      toast.success('Employee added!');
    }
    setModal(false);
  };
  const del = (id) => { if(window.confirm('Delete?')){setRecords(rs=>rs.filter(r=>r.id!==id));toast.success('Deleted.');} };

  return (
    <div>
      <div className="page-header flex justify-between items-center">
        <div><h1 className="page-title">Employees</h1><p className="page-subtitle">Manage employee records, salaries and deductions</p></div>
        <div style={{display:'flex',gap:8}}>
          <button onClick={()=>exportToCSV(records,'Employees')} className="btn btn-secondary btn-sm"><Download size={14}/> CSV</button>
          <button className="btn btn-primary" onClick={openAdd}><Plus size={16}/> Add Employee</button>
        </div>
      </div>

      <div className="grid-4" style={{gap:14,marginBottom:20}}>
        {[
          {label:'Total Employees',value:records.length,icon:'👥',bg:'#EEF4FF'},
          {label:'Monthly Salary',value:formatINR(totalSalary),icon:'💰',bg:'#E6FAF5'},
          {label:'Total PF',value:formatINR(totalPF),icon:'🏦',bg:'#F2EFFF'},
          {label:'Prof. Tax',value:formatINR(totalPT),icon:'📋',bg:'#FFF4E0'},
        ].map(s=>(
          <div key={s.label} className="card" style={{padding:18}}>
            <div style={{width:38,height:38,borderRadius:10,background:s.bg,display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,marginBottom:10}}>{s.icon}</div>
            <div style={{fontSize:12,color:'var(--text-secondary)',marginBottom:4}}>{s.label}</div>
            <div style={{fontSize:20,fontWeight:800,color:'var(--text-primary)'}}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="card" style={{padding:0,overflow:'hidden'}}>
        <div style={{padding:'16px 20px',borderBottom:'1px solid var(--border)'}}>
          <div className="card-title">Employee Register</div>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Employee</th><th>ID</th><th>Department</th><th>Designation</th><th>Salary</th><th>PF</th><th>Prof. Tax</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {records.length===0 && <tr><td colSpan={9} className="table-empty">No employees added yet.</td></tr>}
              {records.map(r=>(
                <tr key={r.id}>
                  <td>
                    <div style={{display:'flex',alignItems:'center',gap:10}}>
                      <div style={{width:32,height:32,borderRadius:'50%',background:'linear-gradient(135deg,#7B5EA7,#4318FF)',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:12,fontWeight:700,flexShrink:0}}>
                        {r.name.charAt(0)}
                      </div>
                      <div>
                        <div style={{fontWeight:600,fontSize:13.5}}>{r.name}</div>
                        <div style={{fontSize:11.5,color:'var(--text-secondary)'}}>Joined {r.joiningDate}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{color:'var(--brand)',fontWeight:600,fontSize:13}}>{r.empId}</td>
                  <td><span className="badge badge-purple">{r.department}</span></td>
                  <td style={{color:'var(--text-secondary)',fontSize:13}}>{r.designation}</td>
                  <td style={{fontWeight:700}}>{formatINR(r.salary)}</td>
                  <td style={{fontSize:13}}>{formatINR(r.pf)}</td>
                  <td style={{fontSize:13}}>{formatINR(r.professionalTax)}</td>
                  <td><span className={`badge ${r.status==='active'?'badge-green':'badge-red'}`}>{r.status}</span></td>
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
              <div className="modal-header"><div className="modal-title">{editing?'Edit Employee':'Add Employee'}</div><button className="modal-close" onClick={()=>setModal(false)}><X size={18}/></button></div>
              <div className="modal-body">
                <div className="grid-2">
                  <div className="form-group"><label className="form-label">Full Name *</label><input className="form-input" placeholder="Employee name" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}/></div>
                  <div className="form-group"><label className="form-label">Employee ID</label><input className="form-input" placeholder="TEC-101" value={form.empId} onChange={e=>setForm(f=>({...f,empId:e.target.value}))}/></div>
                  <div className="form-group"><label className="form-label">Department</label><select className="form-input" value={form.department} onChange={e=>setForm(f=>({...f,department:e.target.value}))}>{DEPTS.map(d=><option key={d}>{d}</option>)}</select></div>
                  <div className="form-group"><label className="form-label">Designation</label><input className="form-input" placeholder="Job title" value={form.designation} onChange={e=>setForm(f=>({...f,designation:e.target.value}))}/></div>
                  <div className="form-group"><label className="form-label">Monthly Salary (₹) *</label><input type="number" className="form-input" placeholder="0" value={form.salary} onChange={e=>setForm(f=>({...f,salary:e.target.value}))}/></div>
                  <div className="form-group"><label className="form-label">PF (₹) — auto 12%</label><input type="number" className="form-input" placeholder="Auto-calculated" value={form.pf} onChange={e=>setForm(f=>({...f,pf:e.target.value}))}/></div>
                  <div className="form-group"><label className="form-label">Professional Tax (₹)</label><input type="number" className="form-input" value={form.professionalTax} onChange={e=>setForm(f=>({...f,professionalTax:e.target.value}))}/></div>
                  <div className="form-group"><label className="form-label">Joining Date</label><input type="date" className="form-input" value={form.joiningDate} onChange={e=>setForm(f=>({...f,joiningDate:e.target.value}))}/></div>
                </div>
              </div>
              <div className="modal-footer"><button className="btn btn-secondary" onClick={()=>setModal(false)}>Cancel</button><button className="btn btn-primary" onClick={save}>{editing?'Update':'Add Employee'}</button></div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
