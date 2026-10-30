import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, FileText, MessageSquare, CheckCircle, Clock, AlertCircle, Eye, Send, Search, Plus } from 'lucide-react';

const mockClients = [
  { id: '1', name: 'Rajesh Kumar', email: 'rajesh@techcorp.com', pan: 'ABCDE1234F', type: 'Business', gstin: '27AABCT1332L1ZV', status: 'active', pending: 3, filings: 8, lastActivity: '2025-08-05', compliance: 92 },
  { id: '2', name: 'Priya Sharma', email: 'priya.sharma@gmail.com', pan: 'MNOPQ5678G', type: 'Individual', gstin: null, status: 'active', pending: 1, filings: 2, lastActivity: '2025-08-03', compliance: 85 },
  { id: '3', name: 'Aakash Industries', email: 'accounts@aakash.co.in', pan: 'RSTUV9012H', type: 'Business', gstin: '27AABCT5678L1ZA', status: 'pending', pending: 5, filings: 14, lastActivity: '2025-07-28', compliance: 71 },
  { id: '4', name: 'Meera Nair', email: 'meera.nair@startup.io', pan: 'WXYZ3456I', type: 'Business', gstin: '32AABCT9012L1ZB', status: 'active', pending: 2, filings: 6, lastActivity: '2025-08-06', compliance: 96 },
];

const mockTasks = [
  { id: 't1', client: 'Rajesh Kumar', task: 'Review GSTR-3B for July 2025', priority: 'high', due: '2025-08-20', status: 'pending' },
  { id: 't2', client: 'Aakash Industries', task: 'Collect missing purchase invoices', priority: 'urgent', due: '2025-08-10', status: 'pending' },
  { id: 't3', client: 'Priya Sharma', task: 'Prepare ITR-1 for FY 2024-25', priority: 'medium', due: '2025-08-31', status: 'in-progress' },
  { id: 't4', client: 'Meera Nair', task: 'Form 16 verification', priority: 'low', due: '2025-08-25', status: 'completed' },
  { id: 't5', client: 'Rajesh Kumar', task: 'Advance tax Q2 calculation', priority: 'high', due: '2025-09-15', status: 'pending' },
];

export default function ClientsPage() {
  const [activeTab, setActiveTab] = useState('clients');
  const [search, setSearch] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);
  const [messageText, setMessageText] = useState('');

  const filteredClients = mockClients.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase()));

  const TabBtn = ({ id, label, count }) => (
    <button onClick={() => setActiveTab(id)} style={{
      padding: '9px 18px', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
      background: activeTab === id ? 'rgba(139,92,246,0.15)' : 'transparent',
      color: activeTab === id ? '#a78bfa' : 'var(--text-secondary)',
      border: activeTab === id ? '1px solid rgba(139,92,246,0.3)' : '1px solid transparent',
      display: 'flex', alignItems: 'center', gap: 6,
    }}>
      {label}
      {count !== undefined && <span style={{ background: activeTab === id ? 'rgba(139,92,246,0.25)' : 'rgba(255,255,255,0.08)', padding: '1px 7px', borderRadius: 10, fontSize: 11 }}>{count}</span>}
    </button>
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>CA Workspace</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Manage clients, tasks, and filings</p>
        </div>
        <button className="btn-primary" style={{ fontSize: 13 }}>
          <Plus size={16} /> Add Client
        </button>
      </div>

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
        {[
          { label: 'Total Clients', value: mockClients.length, color: '#3b82f6', icon: Users },
          { label: 'Pending Tasks', value: mockTasks.filter(t => t.status === 'pending').length, color: '#f59e0b', icon: Clock },
          { label: 'Urgent Items', value: mockTasks.filter(t => t.priority === 'urgent').length, color: '#ef4444', icon: AlertCircle },
          { label: 'Filings This Month', value: 23, color: '#10b981', icon: CheckCircle },
        ].map(s => (
          <div key={s.label} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: `${s.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <s.icon size={20} color={s.color} />
            </div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 800 }}>{s.value}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        <TabBtn id="clients" label="Clients" count={mockClients.length} />
        <TabBtn id="tasks" label="Tasks" count={mockTasks.filter(t => t.status !== 'completed').length} />
        <TabBtn id="messages" label="Messages" />
      </div>

      {/* Clients Tab */}
      {activeTab === 'clients' && (
        <div>
          <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
            <div style={{ position: 'relative', flex: 1, maxWidth: 400 }}>
              <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search clients..." className="form-input" style={{ paddingLeft: 36, fontSize: 13, padding: '9px 12px 9px 36px' }} />
            </div>
          </div>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden' }}>
            <table className="data-table">
              <thead>
                <tr><th>Client</th><th>Type</th><th>GSTIN</th><th>Compliance</th><th>Pending</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {filteredClients.map(client => (
                  <tr key={client.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
                          {client.name[0]}
                        </div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{client.name}</div>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{client.email}</div>
                        </div>
                      </div>
                    </td>
                    <td><span className={`badge ${client.type === 'Business' ? 'badge-blue' : 'badge-purple'}`}>{client.type}</span></td>
                    <td><span style={{ fontFamily: 'monospace', fontSize: 11 }}>{client.gstin || '—'}</span></td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div className="progress-bar" style={{ width: 60 }}>
                          <div className="progress-fill" style={{ width: `${client.compliance}%`, background: client.compliance > 85 ? '#10b981' : client.compliance > 70 ? '#f59e0b' : '#ef4444' }} />
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 600 }}>{client.compliance}%</span>
                      </div>
                    </td>
                    <td>
                      {client.pending > 0 && <span className="badge badge-orange">{client.pending} pending</span>}
                    </td>
                    <td>
                      <span className={`badge ${client.status === 'active' ? 'badge-green' : 'badge-orange'}`}>
                        {client.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button onClick={() => setSelectedClient(client)} className="btn-ghost" style={{ padding: '5px 10px', fontSize: 12 }}>
                          <Eye size={14} /> View
                        </button>
                        <button onClick={() => { setActiveTab('messages'); setSelectedClient(client); }} className="btn-ghost" style={{ padding: '5px 10px', fontSize: 12 }}>
                          <MessageSquare size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tasks Tab */}
      {activeTab === 'tasks' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {mockTasks.map(task => (
            <motion.div key={task.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{
                width: 10, height: 10, borderRadius: '50%', flexShrink: 0,
                background: task.priority === 'urgent' ? '#ef4444' : task.priority === 'high' ? '#f59e0b' : task.priority === 'medium' ? '#3b82f6' : '#94a3b8'
              }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: task.status === 'completed' ? 'var(--text-muted)' : 'var(--text-primary)', textDecoration: task.status === 'completed' ? 'line-through' : 'none' }}>
                  {task.task}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>{task.client} · Due {task.due}</div>
              </div>
              <span className={`badge badge-${task.priority === 'urgent' ? 'red' : task.priority === 'high' ? 'orange' : task.priority === 'medium' ? 'blue' : 'gray'}`}>
                {task.priority}
              </span>
              <span className={`badge ${task.status === 'completed' ? 'badge-green' : task.status === 'in-progress' ? 'badge-blue' : 'badge-gray'}`}>
                {task.status}
              </span>
            </motion.div>
          ))}
        </div>
      )}

      {/* Messages Tab */}
      {activeTab === 'messages' && (
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 16 }}>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden' }}>
            <div style={{ padding: '16px', borderBottom: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: 14, fontWeight: 700 }}>Clients</h3>
            </div>
            {mockClients.map(c => (
              <div key={c.id} onClick={() => setSelectedClient(c)} style={{
                padding: '14px 16px', cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.03)',
                background: selectedClient?.id === c.id ? 'rgba(139,92,246,0.08)' : 'transparent',
                transition: 'background 0.15s',
              }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{c.name}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Click to message</div>
              </div>
            ))}
          </div>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, display: 'flex', flexDirection: 'column' }}>
            {selectedClient ? (
              <>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>{selectedClient.name[0]}</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{selectedClient.name}</div>
                    <div style={{ fontSize: 11, color: '#34d399' }}>● Active</div>
                  </div>
                </div>
                <div style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: 14 }}>
                  <div style={{ alignSelf: 'flex-start' }}>
                    <div className="chat-bubble-ai" style={{ maxWidth: 400 }}>Hello! I've uploaded all my July invoices. Please review when you get a chance.</div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>2:30 PM</div>
                  </div>
                  <div style={{ alignSelf: 'flex-end' }}>
                    <div className="chat-bubble-user">I'll review them today and get back to you with any queries. Please also send your July bank statement.</div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4, textAlign: 'right' }}>3:15 PM</div>
                  </div>
                </div>
                <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border)', display: 'flex', gap: 10 }}>
                  <input value={messageText} onChange={e => setMessageText(e.target.value)} placeholder="Type a message..." className="form-input" style={{ flex: 1 }} onKeyDown={e => e.key === 'Enter' && (setMessageText(''), null)} />
                  <button className="btn-primary" onClick={() => setMessageText('')}><Send size={16} /></button>
                </div>
              </>
            ) : (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                <div style={{ textAlign: 'center' }}>
                  <MessageSquare size={40} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
                  <p style={{ fontSize: 14 }}>Select a client to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
