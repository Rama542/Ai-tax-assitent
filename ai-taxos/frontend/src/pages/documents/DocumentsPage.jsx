import React, { useState } from 'react';
import { Upload, FileText, Image, File, Download, Trash2, Search, FolderOpen } from 'lucide-react';
import toast from 'react-hot-toast';

const MOCK_DOCS = [
  { id:'DOC-001', name:'GST Invoice July 2026.pdf', type:'pdf', size:'1.2 MB', date:'2026-08-08', category:'GST' },
  { id:'DOC-002', name:'Bank Statement Aug 2026.pdf', type:'pdf', size:'2.4 MB', date:'2026-08-07', category:'Bank' },
  { id:'DOC-003', name:'Purchase Invoice HW.pdf', type:'pdf', size:'0.8 MB', date:'2026-08-05', category:'Purchase' },
  { id:'DOC-004', name:'Salary Slips July.xlsx', type:'excel', size:'0.5 MB', date:'2026-08-01', category:'Payroll' },
  { id:'DOC-005', name:'GSTR-3B Filing Proof.pdf', type:'pdf', size:'0.3 MB', date:'2026-07-20', category:'GST' },
  { id:'DOC-006', name:'ITR Acknowledgement.pdf', type:'pdf', size:'0.2 MB', date:'2026-07-15', category:'Income Tax' },
];

const FILE_ICONS = { pdf:'📄', excel:'📊', image:'🖼️', word:'📝', default:'📁' };
const CATS = ['All','GST','Bank','Purchase','Payroll','Income Tax','Other'];

export default function DocumentsPage() {
  const [docs, setDocs] = useState(MOCK_DOCS);
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('All');
  const [dragging, setDragging] = useState(false);

  const filtered = docs.filter(d => {
    const matchSearch = !search || d.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = cat === 'All' || d.category === cat;
    return matchSearch && matchCat;
  });

  const handleDrop = (e) => {
    e.preventDefault(); setDragging(false);
    const files = [...e.dataTransfer.files];
    const newDocs = files.map(f => ({ id:'DOC-'+Date.now()+Math.random(), name:f.name, type:f.name.split('.').pop().toLowerCase(), size:(f.size/1024/1024).toFixed(1)+' MB', date:new Date().toISOString().slice(0,10), category:'Other' }));
    setDocs(d => [...newDocs, ...d]);
    toast.success(`${files.length} file(s) uploaded!`);
  };

  const handleInput = (e) => {
    const files = [...e.target.files];
    const newDocs = files.map(f => ({ id:'DOC-'+Date.now()+Math.random(), name:f.name, type:f.name.split('.').pop().toLowerCase(), size:(f.size/1024/1024).toFixed(1)+' MB', date:new Date().toISOString().slice(0,10), category:'Other' }));
    setDocs(d => [...newDocs, ...d]);
    toast.success(`${files.length} file(s) uploaded!`);
  };

  const del = (id) => { setDocs(d => d.filter(x => x.id!==id)); toast.success('File deleted.'); };

  return (
    <div>
      <div className="page-header flex justify-between items-center">
        <div><h1 className="page-title">Documents</h1><p className="page-subtitle">Upload and manage financial documents, invoices, and receipts</p></div>
        <label className="btn btn-primary" style={{ cursor:'pointer' }}>
          <Upload size={16}/> Upload Files
          <input type="file" multiple onChange={handleInput} style={{ display:'none' }}/>
        </label>
      </div>

      {/* Drag & Drop zone */}
      <div onDragOver={e=>{e.preventDefault();setDragging(true)}} onDragLeave={()=>setDragging(false)} onDrop={handleDrop}
        style={{ border:`2px dashed ${dragging?'var(--brand)':'var(--border)'}`, borderRadius:16, padding:'40px 20px', textAlign:'center', background:dragging?'var(--brand-light)':'var(--bg)', transition:'all 0.2s', marginBottom:20, cursor:'pointer' }}>
        <div style={{ fontSize:36, marginBottom:10 }}>📁</div>
        <div style={{ fontSize:14, fontWeight:600, color:'var(--text-primary)', marginBottom:4 }}>Drag & drop files here</div>
        <div style={{ fontSize:13, color:'var(--text-secondary)' }}>PDF, Excel, Word, Images accepted — up to 10MB each</div>
        <label className="btn btn-secondary btn-sm" style={{ marginTop:14, cursor:'pointer', display:'inline-flex' }}>
          <Upload size={14}/> Browse Files
          <input type="file" multiple onChange={handleInput} style={{ display:'none' }}/>
        </label>
      </div>

      {/* Stats */}
      <div className="grid-4" style={{ gap:14, marginBottom:20 }}>
        {[
          {label:'Total Files',value:docs.length,icon:'📁',bg:'#EEF4FF'},
          {label:'PDF Files',value:docs.filter(d=>d.type==='pdf').length,icon:'📄',bg:'#FDECEA'},
          {label:'Excel Files',value:docs.filter(d=>['xlsx','xls','excel'].includes(d.type)).length,icon:'📊',bg:'#E6FAF5'},
          {label:'Storage Used',value:'12.4 MB',icon:'💾',bg:'#F2EFFF'},
        ].map(s => (
          <div key={s.label} className="card" style={{ padding:18 }}>
            <div style={{ width:36, height:36, borderRadius:8, background:s.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, marginBottom:10 }}>{s.icon}</div>
            <div style={{ fontSize:12, color:'var(--text-secondary)', marginBottom:4 }}>{s.label}</div>
            <div style={{ fontSize:20, fontWeight:800 }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Filter + table */}
      <div className="card" style={{ padding:0, overflow:'hidden' }}>
        <div style={{ padding:'16px 20px', borderBottom:'1px solid var(--border)', display:'flex', gap:10, flexWrap:'wrap', alignItems:'center' }}>
          <div className="filter-search"><Search size={14} color="var(--text-muted)"/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search documents..."/></div>
          <div style={{ display:'flex', gap:4 }}>
            {CATS.map(c => (
              <button key={c} onClick={()=>setCat(c)} style={{ padding:'6px 12px', borderRadius:8, border:`1.5px solid ${cat===c?'var(--brand)':'var(--border)'}`, background:cat===c?'var(--brand-light)':'var(--bg)', color:cat===c?'var(--brand)':'var(--text-secondary)', fontSize:12, fontWeight:600, cursor:'pointer' }}>
                {c}
              </button>
            ))}
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>File Name</th><th>Category</th><th>Size</th><th>Uploaded</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.length===0 && <tr><td colSpan={5} className="table-empty">No documents found.</td></tr>}
              {filtered.map(d => (
                <tr key={d.id}>
                  <td><div style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <span style={{ fontSize:22 }}>{FILE_ICONS[d.type]||FILE_ICONS.default}</span>
                    <span style={{ fontWeight:600, fontSize:13.5 }}>{d.name}</span>
                  </div></td>
                  <td><span className="badge badge-blue">{d.category}</span></td>
                  <td style={{ color:'var(--text-secondary)', fontSize:13 }}>{d.size}</td>
                  <td style={{ color:'var(--text-muted)', fontSize:13 }}>{d.date}</td>
                  <td><div style={{ display:'flex', gap:6 }}>
                    <button className="btn btn-ghost btn-sm" style={{ padding:'5px 9px' }}><Download size={13}/></button>
                    <button onClick={()=>del(d.id)} className="btn btn-danger btn-sm" style={{ padding:'5px 9px' }}><Trash2 size={13}/></button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
