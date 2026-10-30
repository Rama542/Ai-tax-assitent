import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Shield, BarChart3, Activity, Search, Ban, CheckCircle, Clock, Eye, Trash2 } from 'lucide-react';

const mockUsers = [
  { id: '1', name: 'Rajesh Kumar', email: 'rajesh@example.com', role: 'business', joined: '2025-06-15', status: 'active', docs: 12, lastLogin: '2025-08-06' },
  { id: '2', name: 'Priya Sharma', email: 'priya@example.com', role: 'individual', joined: '2025-07-01', status: 'active', docs: 4, lastLogin: '2025-08-05' },
  { id: '3', name: 'CA Rohan Mehta', email: 'rohan.ca@example.com', role: 'ca', joined: '2025-05-20', status: 'pending_verification', docs: 0, lastLogin: '2025-08-04' },
  { id: '4', name: 'Aakash Patel', email: 'aakash@example.com', role: 'business', joined: '2025-07-15', status: 'active', docs: 8, lastLogin: '2025-07-30' },
  { id: '5', name: 'CA Meera Iyer', email: 'meera.ca@example.com', role: 'ca', joined: '2025-06-01', status: 'verified', docs: 0, lastLogin: '2025-08-06' },
];

const auditLogs = [
  { id: 'l1', user: 'Rajesh Kumar', action: 'Document Uploaded', detail: 'GST_Invoice_July.pdf', timestamp: '2025-08-07 09:15:22', ip: '103.42.11.5' },
  { id: 'l2', user: 'Priya Sharma', action: 'AI Chat', detail: 'Query: HRA deduction', timestamp: '2025-08-07 08:55:10', ip: '49.206.22.91' },
  { id: 'l3', user: 'CA Rohan Mehta', action: 'Login', detail: 'Google OAuth', timestamp: '2025-08-07 08:30:05', ip: '117.55.33.210' },
  { id: 'l4', user: 'System', action: 'Report Generated', detail: 'P&L Report - Aakash Patel', timestamp: '2025-08-06 19:45:00', ip: 'internal' },
  { id: 'l5', user: 'Aakash Patel', action: 'GST Calculated', detail: 'GSTR-3B July 2025', timestamp: '2025-08-06 17:22:45', ip: '106.67.88.123' },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('users');
  const [search, setSearch] = useState('');

  const stats = [
    { label: 'Total Users', value: 1482, change: '+124 this month', color: '#3b82f6', icon: Users },
    { label: 'Active CAs', value: 87, change: '12 pending verification', color: '#8b5cf6', icon: Shield },
    { label: 'Docs Processed', value: '24,583', change: '+1,204 today', color: '#10b981', icon: Activity },
    { label: 'API Calls Today', value: '18,924', change: 'Gemini + Groq', color: '#f59e0b', icon: BarChart3 },
  ];

  const TabBtn = ({ id, label }) => (
    <button onClick={() => setActiveTab(id)} style={{
      padding: '9px 18px', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer',
      background: activeTab === id ? 'rgba(245,158,11,0.15)' : 'transparent',
      color: activeTab === id ? '#fbbf24' : 'var(--text-secondary)',
      border: activeTab === id ? '1px solid rgba(245,158,11,0.3)' : '1px solid transparent',
    }}>{label}</button>
  );

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>Admin Panel</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Platform management, user control, and system analytics</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
        {stats.map(s => (
          <div key={s.label} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '18px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: `${s.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <s.icon size={18} color={s.color} />
              </div>
            </div>
            <div style={{ fontSize: 26, fontWeight: 800, color: s.color, marginBottom: 2 }}>{s.value}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{s.label}</div>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 4 }}>{s.change}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        <TabBtn id="users" label="User Management" />
        <TabBtn id="ca" label="CA Verification" />
        <TabBtn id="logs" label="Audit Logs" />
      </div>

      {activeTab === 'users' && (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', gap: 10 }}>
            <div style={{ position: 'relative', flex: 1, maxWidth: 360 }}>
              <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users..." className="form-input" style={{ paddingLeft: 36, fontSize: 13, padding: '9px 12px 9px 36px' }} />
            </div>
          </div>
          <table className="data-table">
            <thead><tr><th>User</th><th>Role</th><th>Joined</th><th>Documents</th><th>Last Login</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {mockUsers.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())).map(user => (
                <tr key={user.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: `linear-gradient(135deg, ${user.role === 'ca' ? '#8b5cf6, #3b82f6' : user.role === 'business' ? '#10b981, #3b82f6' : '#f59e0b, #ef4444'})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>
                        {user.name[0]}
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{user.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td><span className={`badge ${user.role === 'ca' ? 'badge-purple' : user.role === 'business' ? 'badge-blue' : 'badge-green'}`}>{user.role}</span></td>
                  <td><span style={{ fontSize: 12 }}>{user.joined}</span></td>
                  <td><span style={{ fontSize: 13, fontWeight: 600 }}>{user.docs}</span></td>
                  <td><span style={{ fontSize: 12 }}>{user.lastLogin}</span></td>
                  <td>
                    <span className={`badge ${user.status === 'active' ? 'badge-green' : user.status === 'verified' ? 'badge-blue' : 'badge-orange'}`}>
                      {user.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button className="btn-ghost" style={{ padding: '4px 8px' }}><Eye size={13} /></button>
                      <button className="btn-ghost" style={{ padding: '4px 8px', color: '#f59e0b' }}><Ban size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'ca' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>CA Verification Queue</h3>
          {mockUsers.filter(u => u.role === 'ca').map(ca => (
            <div key={ca.id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 18 }}>
                {ca.name[0]}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 2 }}>{ca.name}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{ca.email} · Joined {ca.joined}</div>
                <div style={{ marginTop: 6, display: 'flex', gap: 6 }}>
                  <span className="badge badge-orange">📋 ICAI Certificate: Pending</span>
                  <span className="badge badge-gray">📄 PAN: Submitted</span>
                </div>
              </div>
              <span className={`badge ${ca.status === 'verified' ? 'badge-green' : 'badge-orange'}`}>{ca.status.replace('_', ' ')}</span>
              <div style={{ display: 'flex', gap: 8 }}>
                {ca.status !== 'verified' && (
                  <>
                    <button className="btn-primary" style={{ fontSize: 12, padding: '8px 16px' }}>
                      <CheckCircle size={14} /> Verify
                    </button>
                    <button className="btn-secondary" style={{ fontSize: 12, padding: '8px 16px', color: '#f87171', borderColor: 'rgba(239,68,68,0.3)' }}>
                      Reject
                    </button>
                  </>
                )}
                {ca.status === 'verified' && <span className="badge badge-green">✓ Verified</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'logs' && (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: 15, fontWeight: 700 }}>System Audit Logs</h3>
          </div>
          <table className="data-table">
            <thead><tr><th>Timestamp</th><th>User</th><th>Action</th><th>Detail</th><th>IP Address</th></tr></thead>
            <tbody>
              {auditLogs.map(log => (
                <tr key={log.id}>
                  <td><span style={{ fontFamily: 'monospace', fontSize: 11 }}>{log.timestamp}</span></td>
                  <td><span style={{ fontSize: 13, fontWeight: 500 }}>{log.user}</span></td>
                  <td>
                    <span className={`badge ${log.action === 'Login' ? 'badge-green' : log.action === 'Document Uploaded' ? 'badge-blue' : log.action === 'AI Chat' ? 'badge-purple' : 'badge-gray'}`}>
                      {log.action}
                    </span>
                  </td>
                  <td><span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{log.detail}</span></td>
                  <td><span style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--text-muted)' }}>{log.ip}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
