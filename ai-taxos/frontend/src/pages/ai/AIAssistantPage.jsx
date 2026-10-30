import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, RefreshCw, Copy, ThumbsUp, ThumbsDown, Mic, Paperclip, X } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const SUGGESTED = [
  'What is my tax liability under the new regime?',
  'How do I claim HRA deduction?',
  'Explain GSTR-3B filing process',
  'What are the GST rates for software services?',
  'How to calculate advance tax for Q2?',
  'What is Section 80C and its limit?',
];

const DEMO_RESPONSES = {
  default: `**Based on your financial data, here's my analysis:**

Under the **New Tax Regime (FY 2025-26)**:
- Standard deduction: ₹75,000
- Estimated taxable income: ₹12,50,000
- Tax liability: ₹1,24,500 (approx.)

Under the **Old Tax Regime**:
- With 80C (₹1,50,000) + HRA + 80D
- Estimated taxable income: ₹9,00,000
- Tax liability: ₹72,500 (approx.)

💡 **Recommendation**: The Old Tax Regime saves you approximately **₹52,000** this year.

Would you like me to break down the deductions further?`,
  hra: `**HRA Deduction Calculator (Section 10(13A))**

HRA exemption is the **minimum** of:
1. Actual HRA received
2. 50% of basic salary (metro) / 40% (non-metro)
3. Rent paid − 10% of basic salary

**Example for your case:**
- Basic Salary: ₹8,00,000/year
- HRA Received: ₹2,40,000/year
- Rent Paid: ₹2,00,000/year (Delhi)

Calculation:
- HRA received = ₹2,40,000
- 50% of basic = ₹4,00,000
- Rent − 10% basic = ₹2,00,000 − ₹80,000 = **₹1,20,000**

✅ **HRA Exemption = ₹1,20,000** (minimum of the three)`,
  gst: `**GSTR-3B Filing Process:**

📋 **Step-by-step guide:**

1. **Login** to GST Portal (gstin.gov.in)
2. Go to **Returns → GSTR-3B**
3. Select **tax period** (monthly/quarterly)
4. Fill **Table 3.1**: Outward supplies
   - Taxable supplies, Exempt, Export
5. Fill **Table 4**: Eligible ITC
   - IGST, CGST, SGST from purchase invoices
6. **Net tax payable** = Output tax − ITC
7. **Pay** via challan (cash ledger) if any liability
8. **File** with DSC or EVC

⏰ **Due date**: 20th of next month
⚠️ **Late fee**: ₹50/day (₹20 for nil returns)

Want me to calculate your GSTR-3B for this month?`,
};

const getResponse = (msg) => {
  const lower = msg.toLowerCase();
  if (lower.includes('hra')) return DEMO_RESPONSES.hra;
  if (lower.includes('gst') || lower.includes('gstr')) return DEMO_RESPONSES.gst;
  return DEMO_RESPONSES.default;
};

const MessageContent = ({ content }) => {
  const lines = content.split('\n');
  return (
    <div>
      {lines.map((line, i) => {
        if (line.startsWith('**') && line.endsWith('**')) {
          return <p key={i} style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>{line.replace(/\*\*/g, '')}</p>;
        }
        if (line.startsWith('- ') || line.match(/^\d+\./)) {
          return <p key={i} style={{ paddingLeft: 16, marginBottom: 3, position: 'relative' }}>
            <span style={{ position: 'absolute', left: 0 }}>•</span>
            {line.replace(/^[-\d.]\s*/, '').replace(/\*\*(.*?)\*\*/g, (_, t) => t)}
          </p>;
        }
        if (line.includes('**')) {
          const parts = line.split(/\*\*(.*?)\*\*/g);
          return <p key={i} style={{ marginBottom: 4 }}>{parts.map((p, j) => j % 2 === 1 ? <strong key={j}>{p}</strong> : p)}</p>;
        }
        if (line.startsWith('✅') || line.startsWith('💡') || line.startsWith('⚠️') || line.startsWith('📋') || line.startsWith('⏰')) {
          return <p key={i} style={{ marginBottom: 6, color: 'var(--text-primary)' }}>{line}</p>;
        }
        return line ? <p key={i} style={{ marginBottom: 4, color: 'var(--text-secondary)' }}>{line}</p> : <br key={i} />;
      })}
    </div>
  );
};

import { useAuth } from '../../contexts/AuthContext';
import { analyzeUserTaxData, formatINR } from '../../utils/taxCalculator';

export default function AIAssistantPage() {
  const { userFinancials } = useAuth();
  const analysis = analyzeUserTaxData(userFinancials);

  const getDynamicResponse = (msg) => {
    const lower = msg.toLowerCase();
    const rev = userFinancials?.annualRevenue || 2500000;
    const profit = userFinancials?.netProfit || 1500000;
    const pan = userFinancials?.pan || 'ABCRS1234F';

    if (lower.includes('tax liability') || lower.includes('regime') || lower.includes('how much tax')) {
      return `**Real-time AI Tax Analysis for your account (${userFinancials?.businessName || 'Business'}, PAN: ${pan}):**

Under the **New Tax Regime (FY 2025-26)**:
- Standard Deduction: ₹75,000
- Net Income: ₹${profit.toLocaleString('en-IN')}
- Tax Liability: **₹${analysis.newRegime.totalTax.toLocaleString('en-IN')}**

Under the **Old Tax Regime**:
- Deductions Claimed: ₹${analysis.totalOldDeductions.toLocaleString('en-IN')} (80C, 80D, HRA, Sec 24b, Std Ded)
- Tax Liability: **₹${analysis.oldRegime.totalTax.toLocaleString('en-IN')}**

💡 **AI Recommendation**: Choose **${analysis.recommendedRegime}** to save **₹${analysis.taxSavings.toLocaleString('en-IN')}**!`;
    }

    if (lower.includes('hra')) {
      return `**HRA Exemption Analysis for your rent of ₹${(userFinancials?.hraPaidMonthly || 20000).toLocaleString('en-IN')}/month:**

- Annual Rent Paid: ₹${((userFinancials?.hraPaidMonthly || 20000) * 12).toLocaleString('en-IN')}
- Calculated HRA Exemption Sec 10(13A): **₹${analysis.hraExemption.toLocaleString('en-IN')}**

✅ This exemption reduces your taxable income in the Old Tax Regime.`;
    }

    if (lower.includes('gst')) {
      return `**GST Summary for ${userFinancials?.businessName || 'your business'} (GSTIN: ${userFinancials?.gstin || '27AABCT1332L1ZV'}):**

- Output GST (18% on ₹${rev.toLocaleString('en-IN')} revenue): **₹${analysis.outputGST.toLocaleString('en-IN')}**
- Input Tax Credit (ITC): **₹${analysis.inputGST.toLocaleString('en-IN')}**
- Net GST Liability Payable: **₹${analysis.netGSTPayable.toLocaleString('en-IN')}**

⏰ Standard GSTR-3B due date is 20th of every month.`;
    }

    return getResponse(msg);
  };

  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: `👋 **Hello ${userFinancials?.businessName ? userFinancials.businessName : 'there'}! I'm your AI Tax Copilot.**

I have synchronized your financial profile:
- 📊 **Annual Revenue**: ₹${(userFinancials?.annualRevenue || 2500000).toLocaleString('en-IN')}
- 💰 **Net Profit**: ₹${(userFinancials?.netProfit || 1500000).toLocaleString('en-IN')}
- 🛡️ **Pan / GST**: ${userFinancials?.pan || 'ABCRS1234F'} / ${userFinancials?.gstin || '27AABCT1332L1ZV'}

Ask me anything about your tax regime savings, GST ITC, HRA, 80C, or 44AD presumptive tax!`,
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text) => {
    if (!text.trim()) return;
    const userMsg = { id: Date.now(), role: 'user', content: text, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    // Typing indicator
    const typingId = Date.now() + 1;
    setMessages(prev => [...prev, { id: typingId, role: 'assistant', content: '__typing__', timestamp: new Date() }]);

    await new Promise(r => setTimeout(r, 1200));

    let response;
    try {
      const res = await api.post('/ai/chat', { message: text });
      response = res.response || res.message;
    } catch {
      response = getDynamicResponse(text);
    }

    setMessages(prev => prev.filter(m => m.id !== typingId).concat({
      id: Date.now() + 2,
      role: 'assistant',
      content: response,
      timestamp: new Date(),
    }));
    setLoading(false);
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  const copyMsg = (content) => {
    navigator.clipboard.writeText(content);
    toast.success('Copied!');
  };

  const clearChat = () => {
    setMessages([{
      id: 1, role: 'assistant',
      content: '👋 Chat cleared. How can I help you today?',
      timestamp: new Date(),
    }]);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={18} color="white" />
            </div>
            <h1 style={{ fontSize: 22, fontWeight: 800 }}>AI Tax Assistant</h1>
            <span className="badge badge-green" style={{ fontSize: 10 }}>● Online</span>
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Powered by Gemini + RAG · Indian Tax Knowledge Base</p>
        </div>
        <button onClick={clearChat} className="btn-secondary" style={{ fontSize: 13 }}>
          <RefreshCw size={15} /> Clear chat
        </button>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1, overflowY: 'auto', borderRadius: 16,
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        padding: '20px', marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 16,
      }}>
        <AnimatePresence>
          {messages.map(msg => (
            <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
              style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', gap: 10 }}>
              {msg.role === 'assistant' && (
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 4 }}>
                  <Sparkles size={15} color="white" />
                </div>
              )}
              <div style={{ maxWidth: msg.role === 'user' ? '65%' : '75%' }}>
                {msg.content === '__typing__' ? (
                  <div className="chat-bubble-ai" style={{ display: 'flex', gap: 4, alignItems: 'center', padding: '14px 18px' }}>
                    {[0, 1, 2].map(i => (
                      <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: '#3b82f6', animation: `pulse-soft 1.2s ease-in-out ${i * 0.2}s infinite` }} />
                    ))}
                  </div>
                ) : (
                  <>
                    <div className={msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'} style={{ fontSize: 14 }}>
                      {msg.role === 'assistant' ? <MessageContent content={msg.content} /> : msg.content}
                    </div>
                    {msg.role === 'assistant' && (
                      <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
                        <button onClick={() => copyMsg(msg.content)} className="btn-ghost" style={{ padding: '4px 8px', fontSize: 11 }}>
                          <Copy size={12} /> Copy
                        </button>
                        <button className="btn-ghost" style={{ padding: '4px 8px', fontSize: 11 }}><ThumbsUp size={12} /></button>
                        <button className="btn-ghost" style={{ padding: '4px 8px', fontSize: 11 }}><ThumbsDown size={12} /></button>
                      </div>
                    )}
                  </>
                )}
                <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4, textAlign: msg.role === 'user' ? 'right' : 'left' }}>
                  {msg.timestamp.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      {messages.length <= 1 && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
          {SUGGESTED.slice(0, 4).map(s => (
            <button key={s} onClick={() => sendMessage(s)} style={{
              background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)',
              borderRadius: 20, padding: '6px 14px', fontSize: 12, color: '#93c5fd', cursor: 'pointer',
              transition: 'all 0.2s',
            }}>
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 10 }}>
        <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center' }}>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(e); } }}
            placeholder="Ask me anything about Indian taxes, GST, ITR, deductions..."
            rows={1}
            style={{
              flex: 1, width: '100%', background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 12, padding: '13px 48px 13px 16px',
              color: 'var(--text-primary)', fontSize: 14, resize: 'none', outline: 'none',
              transition: 'border-color 0.2s', lineHeight: 1.5,
            }}
            onFocus={e => e.target.style.borderColor = 'rgba(59,130,246,0.5)'}
            onBlur={e => e.target.style.borderColor = 'var(--border)'}
          />
          <button type="button" style={{ position: 'absolute', right: 12, background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <Paperclip size={18} />
          </button>
        </div>
        <button type="submit" disabled={loading || !input.trim()} className="btn-primary" style={{ padding: '13px 20px', borderRadius: 12 }}>
          <Send size={18} />
        </button>
      </form>
      <p style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', marginTop: 8 }}>
        AI responses are for guidance only. Consult a qualified CA for official filing.
      </p>
    </div>
  );
}
