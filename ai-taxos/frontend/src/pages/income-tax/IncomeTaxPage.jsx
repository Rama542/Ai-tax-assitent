import React, { useState, useEffect } from 'react';
import { formatINR } from '../../data/mockData';
import { exportToPDF } from '../../utils/exports';
import { Download, Calculator, Sparkles, ShieldCheck, CheckCircle, HelpCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { analyzeUserTaxData } from '../../utils/taxCalculator';

export default function IncomeTaxPage() {
  const { userFinancials, updateFinancials, setShowOnboardingModal } = useAuth();
  const [regime, setRegime] = useState('new');

  const [form, setForm] = useState({
    grossIncome: userFinancials?.netProfit || (userFinancials?.annualRevenue - userFinancials?.annualExpenses) || 1500000,
    hraPaidMonthly: userFinancials?.hraPaidMonthly || 20000,
    sec80C: userFinancials?.sec80C || 150000,
    sec80D: userFinancials?.sec80D || 25000,
    sec80G: userFinancials?.sec80G || 10000,
    homeLoanInt: userFinancials?.homeLoanInterestSec24b || 150000,
    npsSec80CCD1B: userFinancials?.npsSec80CCD1B || 50000,
  });

  useEffect(() => {
    if (userFinancials) {
      setForm({
        grossIncome: userFinancials.netProfit || (userFinancials.annualRevenue - userFinancials.annualExpenses) || 1500000,
        hraPaidMonthly: userFinancials.hraPaidMonthly || 20000,
        sec80C: userFinancials.sec80C || 150000,
        sec80D: userFinancials.sec80D || 25000,
        sec80G: userFinancials.sec80G || 10000,
        homeLoanInt: userFinancials.homeLoanInterestSec24b || 150000,
        npsSec80CCD1B: userFinancials.npsSec80CCD1B || 50000,
      });
    }
  }, [userFinancials]);

  const currentFin = {
    ...userFinancials,
    netProfit: Number(form.grossIncome) || 0,
    sec80C: Number(form.sec80C) || 0,
    sec80D: Number(form.sec80D) || 0,
    sec80G: Number(form.sec80G) || 0,
    hraPaidMonthly: Number(form.hraPaidMonthly) || 0,
    homeLoanInterestSec24b: Number(form.homeLoanInt) || 0,
    npsSec80CCD1B: Number(form.npsSec80CCD1B) || 0,
  };

  const analysis = analyzeUserTaxData(currentFin);
  const selectedCalc = regime === 'old' ? analysis.oldRegime : analysis.newRegime;

  const F = (v) => formatINR(v);

  return (
    <div>
      <div className="page-header flex justify-between items-center">
        <div>
          <h1 className="page-title">Income Tax Engine (FY 2025-26)</h1>
          <p className="page-subtitle">PAN: {userFinancials?.pan || 'ABCRS1234F'} | Entity: {userFinancials?.businessName || 'Business Owner'}</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => setShowOnboardingModal(true)} className="btn btn-secondary">
            <Sparkles size={16} /> Edit Data Wizard
          </button>
          <button onClick={() => exportToPDF([{ regime, income: F(form.grossIncome), taxable: F(selectedCalc.taxableIncome), tax: F(selectedCalc.baseTax), cess: F(selectedCalc.cess), total: F(selectedCalc.totalTax) }], 'Income Tax Report', ['regime', 'income', 'taxable', 'tax', 'cess', 'total'])} className="btn btn-primary">
            <Download size={16} /> Export PDF
          </button>
        </div>
      </div>

      {/* AI Recommendation Banner */}
      <div style={{ background: 'linear-gradient(135deg, #7B5EA7 0%, #4318FF 100%)', borderRadius: 16, padding: '18px 24px', color: '#fff', marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
            💡
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800 }}>AI Tax Engine Recommendation: Choose {analysis.recommendedRegime}</div>
            <div style={{ fontSize: 13, opacity: 0.9, marginTop: 2 }}>
              {analysis.taxSavings > 0
                ? `You will save approx ${F(analysis.taxSavings)} in taxes by picking the ${analysis.recommendedRegime}.`
                : 'Both regimes result in similar tax liability for your current income level.'}
            </div>
          </div>
        </div>
        <button onClick={() => setRegime(analysis.recommendedRegime === 'Old Tax Regime' ? 'old' : 'new')} className="btn" style={{ background: '#fff', color: '#4318FF', fontWeight: 700, borderRadius: 10, fontSize: 13 }}>
          Switch to {analysis.recommendedRegime}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Input panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Regime selector */}
          <div className="card" style={{ padding: 20 }}>
            <div className="card-title" style={{ marginBottom: 14 }}>Select Tax Regime</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[{ val: 'new', label: 'New Tax Regime', sub: 'Standard Ded ₹75,000 + Lower Slabs' }, { val: 'old', label: 'Old Tax Regime', sub: 'Sec 80C, 80D, HRA & Sec 24b allowed' }].map(r => (
                <button key={r.val} onClick={() => setRegime(r.val)} style={{ padding: '14px', borderRadius: 12, border: `2px solid ${regime === r.val ? 'var(--brand)' : 'var(--border)'}`, background: regime === r.val ? 'var(--brand-light)' : 'var(--bg)', cursor: 'pointer', textAlign: 'left' }}>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text-primary)' }}>{r.label}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--text-secondary)', marginTop: 2 }}>{r.sub}</div>
                  {regime === r.val && <div style={{ fontSize: 11, color: 'var(--brand)', marginTop: 4, fontWeight: 600 }}>✓ Active Regime</div>}
                </button>
              ))}
            </div>
          </div>

          {/* Income & Deductions Form */}
          <div className="card" style={{ padding: 20 }}>
            <div className="card-title" style={{ marginBottom: 14 }}>Income & Deduction Parameters</div>
            <div className="form-group" style={{ marginBottom: 14 }}>
              <label className="form-label">Gross Net Income / Profit (₹)</label>
              <input type="number" className="form-input" value={form.grossIncome} onChange={e => setForm(f => ({ ...f, grossIncome: e.target.value }))} placeholder="e.g. 1500000" />
            </div>

            {regime === 'old' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--brand)', textTransform: 'uppercase' }}>Old Regime Deductions</div>
                <div className="form-group">
                  <label className="form-label">Monthly Rent Paid for HRA (₹)</label>
                  <input type="number" className="form-input" value={form.hraPaidMonthly} onChange={e => setForm(f => ({ ...f, hraPaidMonthly: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Section 80C (PPF, ELSS, EPF, LIC) [Max ₹1.5L]</label>
                  <input type="number" className="form-input" value={form.sec80C} onChange={e => setForm(f => ({ ...f, sec80C: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Section 80D (Health Insurance Premium)</label>
                  <input type="number" className="form-input" value={form.sec80D} onChange={e => setForm(f => ({ ...f, sec80D: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Home Loan Interest Sec 24(b) [Max ₹2L]</label>
                  <input type="number" className="form-input" value={form.homeLoanInt} onChange={e => setForm(f => ({ ...f, homeLoanInt: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">NPS Additional Deduction 80CCD(1B) [Max ₹50k]</label>
                  <input type="number" className="form-input" value={form.npsSec80CCD1B} onChange={e => setForm(f => ({ ...f, npsSec80CCD1B: e.target.value }))} />
                </div>
              </div>
            ) : (
              <div style={{ background: '#F8FAFC', padding: 14, borderRadius: 12, fontSize: 12.5, color: 'var(--text-secondary)' }}>
                ℹ️ Under the <strong>New Tax Regime</strong>, a Standard Deduction of <strong>₹75,000</strong> is automatically applied. Most Chapter VI-A deductions are bypassed in favor of lower slab tax rates.
              </div>
            )}
          </div>
        </div>

        {/* Results panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Summary Card */}
          <div className="card" style={{ padding: 24, background: 'linear-gradient(135deg, #0B1437 0%, #1B2559 100%)', color: '#fff' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Estimated Total Tax Liability</div>
            <div style={{ fontSize: 36, fontWeight: 900, color: '#05CD99', marginTop: 4 }}>
              {F(selectedCalc.totalTax)}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.1)', fontSize: 13 }}>
              <div>
                <div style={{ color: 'rgba(255,255,255,0.6)' }}>Net Taxable Income</div>
                <div style={{ fontSize: 16, fontWeight: 700, marginTop: 2 }}>{F(selectedCalc.taxableIncome)}</div>
              </div>
              <div>
                <div style={{ color: 'rgba(255,255,255,0.6)' }}>Basic Income Tax</div>
                <div style={{ fontSize: 16, fontWeight: 700, marginTop: 2 }}>{F(selectedCalc.baseTax)}</div>
              </div>
              <div>
                <div style={{ color: 'rgba(255,255,255,0.6)' }}>Health & Edu Cess (4%)</div>
                <div style={{ fontSize: 16, fontWeight: 700, marginTop: 2 }}>{F(selectedCalc.cess)}</div>
              </div>
            </div>
          </div>

          {/* Advance Tax Schedule */}
          <div className="card" style={{ padding: 20 }}>
            <div className="card-title" style={{ marginBottom: 14 }}>Advance Tax Schedule</div>
            {[
              { inst: '1st Installment', dueDate: '15 Jun 2026', pct: 15, amt: selectedCalc.totalTax * 0.15 },
              { inst: '2nd Installment', dueDate: '15 Sep 2026', pct: 45, amt: selectedCalc.totalTax * 0.45 },
              { inst: '3rd Installment', dueDate: '15 Dec 2026', pct: 75, amt: selectedCalc.totalTax * 0.75 },
              { inst: '4th Installment', dueDate: '15 Mar 2027', pct: 100, amt: selectedCalc.totalTax },
            ].map((r, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{r.inst}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{r.dueDate}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{F(Math.round(r.amt))}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{r.pct}% of tax</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

