import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, TrendingDown, ArrowRight, Info, CheckCircle } from 'lucide-react';

const DEDUCTIONS = [
  { section: '80C', label: 'Investments (PPF, ELSS, LIC, PF)', max: 150000 },
  { section: '80D', label: 'Health Insurance Premium', max: 25000 },
  { section: 'HRA', label: 'House Rent Allowance', max: 200000 },
  { section: '80E', label: 'Education Loan Interest', max: Infinity },
  { section: '80G', label: 'Donations', max: 50000 },
  { section: '80TTA', label: 'Savings Account Interest', max: 10000 },
  { section: '24(b)', label: 'Home Loan Interest', max: 200000 },
  { section: 'NPS', label: 'NPS Contribution (80CCD)', max: 50000 },
];

const calculateTax = (income, regime, deductions) => {
  let taxableIncome = income;

  if (regime === 'old') {
    const standardDed = 50000;
    const totalDed = Object.values(deductions).reduce((a, b) => a + (Number(b) || 0), 0);
    taxableIncome = Math.max(0, income - standardDed - totalDed);
  } else {
    taxableIncome = Math.max(0, income - 75000); // New regime standard deduction FY25-26
  }

  let tax = 0;
  if (regime === 'old') {
    if (taxableIncome <= 250000) tax = 0;
    else if (taxableIncome <= 500000) tax = (taxableIncome - 250000) * 0.05;
    else if (taxableIncome <= 1000000) tax = 12500 + (taxableIncome - 500000) * 0.2;
    else tax = 112500 + (taxableIncome - 1000000) * 0.3;
  } else {
    if (taxableIncome <= 400000) tax = 0;
    else if (taxableIncome <= 800000) tax = (taxableIncome - 400000) * 0.05;
    else if (taxableIncome <= 1200000) tax = 20000 + (taxableIncome - 800000) * 0.1;
    else if (taxableIncome <= 1600000) tax = 60000 + (taxableIncome - 1200000) * 0.15;
    else if (taxableIncome <= 2000000) tax = 120000 + (taxableIncome - 1600000) * 0.2;
    else if (taxableIncome <= 2400000) tax = 200000 + (taxableIncome - 2000000) * 0.25;
    else tax = 300000 + (taxableIncome - 2400000) * 0.3;
  }

  // Rebate u/s 87A
  if (regime === 'old' && taxableIncome <= 500000) tax = 0;
  if (regime === 'new' && taxableIncome <= 700000) tax = 0;

  const surcharge = taxableIncome > 5000000 ? tax * 0.1 : 0;
  const cess = (tax + surcharge) * 0.04;
  const totalTax = Math.round(tax + surcharge + cess);

  return { taxableIncome, tax: Math.round(tax), surcharge: Math.round(surcharge), cess: Math.round(cess), totalTax };
};

export default function IncomeTaxPage() {
  const [income, setIncome] = useState(1200000);
  const [regime, setRegime] = useState('both');
  const [deductions, setDeductions] = useState({});
  const [itrType, setItrType] = useState('ITR-1');

  const oldResult = calculateTax(income, 'old', deductions);
  const newResult = calculateTax(income, 'new', {});
  const savings = oldResult.totalTax - newResult.totalTax;
  const recommended = savings > 0 ? 'new' : 'old';

  const updateDed = (key, val) => setDeductions(d => ({ ...d, [key]: val }));

  const TaxBreakdown = ({ result, label, color }) => (
    <div style={{ background: 'var(--bg-card)', border: `1px solid ${color}30`, borderRadius: 16, padding: 20, flex: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700 }}>{label}</h3>
        {recommended === label.toLowerCase().includes('new') ? 'new' : 'old' === recommended && (
          <span className="badge badge-green"><CheckCircle size={10} /> Recommended</span>
        )}
      </div>
      {[
        { label: 'Gross Income', value: income, color: '#94a3b8' },
        { label: 'Taxable Income', value: result.taxableIncome, color: 'var(--text-primary)' },
        { label: 'Base Tax', value: result.tax, color: '#f87171' },
        { label: 'Surcharge', value: result.surcharge, color: '#fbbf24' },
        { label: 'Health & Ed Cess (4%)', value: result.cess, color: '#fbbf24' },
      ].map(row => (
        <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
          <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{row.label}</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: row.color }}>₹{row.value.toLocaleString('en-IN')}</span>
        </div>
      ))}
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0 0', marginTop: 4 }}>
        <span style={{ fontSize: 15, fontWeight: 700 }}>Total Tax Payable</span>
        <span style={{ fontSize: 18, fontWeight: 800, color }}>{`₹${result.totalTax.toLocaleString('en-IN')}`}</span>
      </div>
      <div style={{ marginTop: 8 }}>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Effective Tax Rate</div>
        <div style={{ fontSize: 20, fontWeight: 700, color }}>{income > 0 ? ((result.totalTax / income) * 100).toFixed(2) : 0}%</div>
      </div>
    </div>
  );

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>Income Tax Calculator</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>FY 2025–26 (AY 2026–27) · Compare Old vs New Tax Regime</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: 20 }}>
        {/* Inputs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Income */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: 20 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Income Details</h3>
            <div style={{ marginBottom: 14 }}>
              <label className="form-label">Annual Gross Income (₹)</label>
              <input
                type="number"
                value={income}
                onChange={e => setIncome(Number(e.target.value))}
                className="form-input"
                style={{ fontSize: 18, fontWeight: 700 }}
              />
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>₹{(income / 100000).toFixed(1)}L per annum</p>
            </div>
            <div>
              <label className="form-label">ITR Type</label>
              <select value={itrType} onChange={e => setItrType(e.target.value)} className="form-input" style={{ cursor: 'pointer', fontSize: 13 }}>
                <option>ITR-1 (Salary up to ₹50L)</option>
                <option>ITR-2 (Capital Gains)</option>
                <option>ITR-3 (Business Income)</option>
                <option>ITR-4 (Presumptive)</option>
              </select>
            </div>
          </div>

          {/* Deductions */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: 20 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Deductions (Old Regime)</h3>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>Not applicable under new regime</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {DEDUCTIONS.map(d => (
                <div key={d.section}>
                  <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span><strong>{d.section}</strong> · {d.label}</span>
                    {d.max !== Infinity && <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>Max ₹{(d.max / 100000).toFixed(1)}L</span>}
                  </label>
                  <input
                    type="number"
                    value={deductions[d.section] || ''}
                    onChange={e => updateDed(d.section, Math.min(d.max, Number(e.target.value)))}
                    placeholder="0"
                    className="form-input"
                    style={{ fontSize: 13, padding: '8px 12px' }}
                  />
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0 0', borderTop: '1px solid var(--border)', marginTop: 14 }}>
              <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Total Deductions</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#10b981' }}>₹{Object.values(deductions).reduce((a, b) => a + (Number(b) || 0), 0).toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Results */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Recommendation banner */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            style={{
              background: recommended === 'new' ? 'rgba(16,185,129,0.06)' : 'rgba(59,130,246,0.06)',
              border: `1px solid ${recommended === 'new' ? 'rgba(16,185,129,0.3)' : 'rgba(59,130,246,0.3)'}`,
              borderRadius: 14, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14,
            }}>
            <div style={{ fontSize: 28 }}>🎯</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 2 }}>
                {recommended === 'new' ? 'New Tax Regime' : 'Old Tax Regime'} is better for you
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                You save <strong style={{ color: '#34d399' }}>₹{Math.abs(savings).toLocaleString('en-IN')}</strong> under the {recommended} regime
              </div>
            </div>
          </motion.div>

          {/* Tax breakdowns */}
          <div style={{ display: 'flex', gap: 16 }}>
            <TaxBreakdown result={newResult} label="New Regime (2025-26)" color="#10b981" />
            <TaxBreakdown result={oldResult} label="Old Regime" color="#3b82f6" />
          </div>

          {/* Monthly breakdown */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: 20 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>Monthly Breakdown</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              {[
                { label: 'Monthly Gross', value: Math.round(income / 12) },
                { label: 'Monthly Tax (New)', value: Math.round(newResult.totalTax / 12), color: '#10b981' },
                { label: 'Monthly Tax (Old)', value: Math.round(oldResult.totalTax / 12), color: '#3b82f6' },
                { label: 'Monthly In-Hand (New)', value: Math.round((income - newResult.totalTax) / 12), color: '#34d399' },
                { label: 'Monthly In-Hand (Old)', value: Math.round((income - oldResult.totalTax) / 12), color: '#60a5fa' },
                { label: 'Monthly Savings', value: Math.round(Math.abs(savings) / 12), color: '#fbbf24' },
              ].map(item => (
                <div key={item.label} style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 10, padding: '14px 16px' }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>{item.label}</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: item.color || 'var(--text-primary)' }}>₹{item.value.toLocaleString('en-IN')}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Advance Tax */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: 20 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>Advance Tax Schedule</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
              {[
                { installment: '1st', date: 'Jun 15', pct: 15 },
                { installment: '2nd', date: 'Sep 15', pct: 45 },
                { installment: '3rd', date: 'Dec 15', pct: 75 },
                { installment: '4th', date: 'Mar 15', pct: 100 },
              ].map(({ installment, date, pct }) => {
                const amt = Math.round(recommended === 'new' ? (newResult.totalTax * pct / 100) : (oldResult.totalTax * pct / 100));
                return (
                  <div key={installment} style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)', borderRadius: 10, padding: '12px 14px', textAlign: 'center' }}>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 4 }}>{installment} · {date}</div>
                    <div style={{ fontSize: 15, fontWeight: 700 }}>₹{amt.toLocaleString('en-IN')}</div>
                    <div style={{ fontSize: 10, color: '#60a5fa', marginTop: 2 }}>{pct}% of tax</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
