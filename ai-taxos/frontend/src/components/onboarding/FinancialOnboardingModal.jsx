import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Check, ChevronRight, X, Building, ShieldCheck, DollarSign, Calculator, Percent, ArrowRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { analyzeUserTaxData, formatINR } from '../../utils/taxCalculator';
import toast from 'react-hot-toast';

export default function FinancialOnboardingModal({ isOpen, onClose }) {
  const { userFinancials, updateFinancials } = useAuth();
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    businessName: userFinancials?.businessName || 'TechSolutions Pvt Ltd',
    gstin: userFinancials?.gstin || '27AABCT1332L1ZV',
    pan: userFinancials?.pan || 'ABCRS1234F',
    entityType: userFinancials?.entityType || 'Proprietorship',
    annualRevenue: userFinancials?.annualRevenue || 2500000,
    annualExpenses: userFinancials?.annualExpenses || 1000000,
    sec80C: userFinancials?.sec80C || 150000,
    sec80D: userFinancials?.sec80D || 25000,
    hraPaidMonthly: userFinancials?.hraPaidMonthly || 20000,
    homeLoanInterestSec24b: userFinancials?.homeLoanInterestSec24b || 150000,
    npsSec80CCD1B: userFinancials?.npsSec80CCD1B || 50000,
    usePresumptiveTaxation: userFinancials?.usePresumptiveTaxation || false,
  });

  if (!isOpen) return null;

  const calculatedProfit = Math.max(0, formData.annualRevenue - formData.annualExpenses);
  const analysis = analyzeUserTaxData({ ...formData, netProfit: calculatedProfit });

  const handleChange = (field, val) => {
    setFormData(prev => ({ ...prev, [field]: val }));
  };

  const handleSave = () => {
    updateFinancials({
      ...formData,
      netProfit: calculatedProfit
    });
    toast.success('🎉 Financial profile updated! AI has recalculated your taxes & reports.');
    onClose();
  };

  return (
    <AnimatePresence>
      <div style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(11, 20, 55, 0.75)', backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25 }}
          style={{
            background: '#FFFFFF', borderRadius: 24, width: '100%', maxWidth: 740,
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)', overflow: 'hidden',
            display: 'flex', flexDirection: 'column', maxHeight: '90vh'
          }}
        >
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #0B1437 0%, #1B2559 100%)',
            padding: '24px 32px', color: '#FFFFFF', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg,#7B5EA7,#4318FF)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Sparkles size={16} color="#fff" />
                </div>
                <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0, letterSpacing: '-0.3px' }}>AI Financial Data Onboarding</h2>
              </div>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', margin: 0 }}>
                Enter your real financial details to generate custom tax reports, AI insights & section breakdowns.
              </p>
            </div>
            <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', width: 32, height: 32, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <X size={18} />
            </button>
          </div>

          {/* Stepper */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', background: '#F8FAFC', padding: '12px 32px' }}>
            {[
              { num: 1, label: 'Tax Identity' },
              { num: 2, label: 'Revenue & Profit' },
              { num: 3, label: 'Deductions & Investments' },
              { num: 4, label: 'AI Tax Breakdown' },
            ].map(s => (
              <div
                key={s.num}
                onClick={() => setStep(s.num)}
                style={{
                  flex: 1, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer',
                  opacity: step === s.num ? 1 : 0.6, transition: 'all 0.2s'
                }}
              >
                <div style={{
                  width: 26, height: 26, borderRadius: '50%',
                  background: step === s.num ? 'var(--brand)' : step > s.num ? '#05CD99' : '#CBD5E1',
                  color: '#fff', fontSize: 12, fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  {step > s.num ? <Check size={14} /> : s.num}
                </div>
                <span style={{ fontSize: 12.5, fontWeight: 600, color: step === s.num ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>

          {/* Body */}
          <div style={{ padding: '28px 32px', overflowY: 'auto', flex: 1 }}>
            {/* Step 1: Business Identity */}
            {step === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
                  🏢 Step 1: Entity & Tax Identification
                </h3>
                
                <div className="grid-2" style={{ gap: 16 }}>
                  <div className="form-group">
                    <label className="form-label">Business / Entity Name</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.businessName}
                      onChange={e => handleChange('businessName', e.target.value)}
                      placeholder="e.g. Acme Tech Solutions"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Entity Type</label>
                    <select
                      className="form-input"
                      value={formData.entityType}
                      onChange={e => handleChange('entityType', e.target.value)}
                    >
                      <option value="Proprietorship">Individual / Proprietorship</option>
                      <option value="Partnership">Partnership / LLP</option>
                      <option value="Private Limited Company">Private Limited Company</option>
                    </select>
                  </div>
                </div>

                <div className="grid-2" style={{ gap: 16 }}>
                  <div className="form-group">
                    <label className="form-label">GSTIN (GST Number)</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.gstin}
                      onChange={e => handleChange('gstin', e.target.value.toUpperCase())}
                      placeholder="27AABCT1332L1ZV"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">PAN Number</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.pan}
                      onChange={e => handleChange('pan', e.target.value.toUpperCase())}
                      placeholder="ABCRS1234F"
                    />
                  </div>
                </div>

                <div style={{ background: '#EEF4FF', borderRadius: 12, padding: 14, display: 'flex', gap: 10, alignItems: 'center' }}>
                  <ShieldCheck size={20} color="#4318FF" />
                  <span style={{ fontSize: 12.5, color: '#4318FF', fontWeight: 500 }}>
                    GSTIN & PAN details allow AI TaxOS to fetch standard tax slabs and verify ITC eligibility automatically.
                  </span>
                </div>
              </div>
            )}

            {/* Step 2: Revenue & Expenses */}
            {step === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
                  💰 Step 2: Financial Turnover & Net Income
                </h3>

                <div className="grid-2" style={{ gap: 16 }}>
                  <div className="form-group">
                    <label className="form-label">Annual Gross Revenue (₹)</label>
                    <input
                      type="number"
                      className="form-input"
                      value={formData.annualRevenue}
                      onChange={e => handleChange('annualRevenue', Number(e.target.value))}
                      placeholder="2500000"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Annual Expenses (₹)</label>
                    <input
                      type="number"
                      className="form-input"
                      value={formData.annualExpenses}
                      onChange={e => handleChange('annualExpenses', Number(e.target.value))}
                      placeholder="1000000"
                    />
                  </div>
                </div>

                <div style={{ background: '#F8FAFC', border: '1.5px solid var(--border)', borderRadius: 14, padding: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Calculated Net Taxable Profit</div>
                    <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--green)' }}>
                      ₹{calculatedProfit.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div style={{ textTransform: 'uppercase', fontSize: 11, fontWeight: 700, padding: '4px 10px', background: '#E6FAF5', color: '#05CD99', borderRadius: 8 }}>
                    Auto Computed
                  </div>
                </div>

                {/* Presumptive taxation checkbox */}
                <div style={{ background: '#F2EFFF', border: '1px solid #7B5EA7', borderRadius: 12, padding: 14 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={formData.usePresumptiveTaxation}
                      onChange={e => handleChange('usePresumptiveTaxation', e.target.checked)}
                      style={{ width: 18, height: 18, accentColor: 'var(--brand)' }}
                    />
                    <div>
                      <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text-primary)' }}>
                        Opt for Presumptive Taxation Scheme (Section 44AD / 44ADA)
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                        Declare net profit at 6% of revenue (digital) without detailed audit requirements.
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* Step 3: Deductions */}
            {step === 3 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
                  🛡️ Step 3: Investments & Tax Deductions
                </h3>

                <div className="grid-2" style={{ gap: 16 }}>
                  <div className="form-group">
                    <label className="form-label">Section 80C (PPF, ELSS, EPF, LIC) [Max ₹1.5L]</label>
                    <input
                      type="number"
                      className="form-input"
                      value={formData.sec80C}
                      onChange={e => handleChange('sec80C', Number(e.target.value))}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Section 80D (Health Insurance Premium)</label>
                    <input
                      type="number"
                      className="form-input"
                      value={formData.sec80D}
                      onChange={e => handleChange('sec80D', Number(e.target.value))}
                    />
                  </div>
                </div>

                <div className="grid-2" style={{ gap: 16 }}>
                  <div className="form-group">
                    <label className="form-label">Monthly House Rent Paid (₹)</label>
                    <input
                      type="number"
                      className="form-input"
                      value={formData.hraPaidMonthly}
                      onChange={e => handleChange('hraPaidMonthly', Number(e.target.value))}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Home Loan Interest Sec 24(b) [Max ₹2L]</label>
                    <input
                      type="number"
                      className="form-input"
                      value={formData.homeLoanInterestSec24b}
                      onChange={e => handleChange('homeLoanInterestSec24b', Number(e.target.value))}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Section 80CCD(1B) NPS Investment [Extra ₹50,000 deduction]</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.npsSec80CCD1B}
                    onChange={e => handleChange('npsSec80CCD1B', Number(e.target.value))}
                  />
                </div>
              </div>
            )}

            {/* Step 4: AI Tax Breakdown */}
            {step === 4 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                    ⚡ Step 4: Real-Time AI Tax Computation
                  </h3>
                  <span className="badge badge-green">Recalculated Live</span>
                </div>

                {/* Old vs New Regime Comparison Cards */}
                <div className="grid-2" style={{ gap: 14 }}>
                  <div style={{
                    padding: 16, borderRadius: 16,
                    border: analysis.recommendedRegime === 'Old Tax Regime' ? '2px solid #05CD99' : '1px solid var(--border)',
                    background: analysis.recommendedRegime === 'Old Tax Regime' ? '#E6FAF5' : '#F8FAFC'
                  }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Old Tax Regime</div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', marginTop: 4 }}>
                      ₹{analysis.oldRegime.totalTax.toLocaleString('en-IN')}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>
                      Deductions applied: ₹{analysis.totalOldDeductions.toLocaleString('en-IN')}
                    </div>
                  </div>

                  <div style={{
                    padding: 16, borderRadius: 16,
                    border: analysis.recommendedRegime === 'New Tax Regime' ? '2px solid #05CD99' : '1px solid var(--border)',
                    background: analysis.recommendedRegime === 'New Tax Regime' ? '#E6FAF5' : '#F8FAFC'
                  }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>New Tax Regime</div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', marginTop: 4 }}>
                      ₹{analysis.newRegime.totalTax.toLocaleString('en-IN')}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>
                      Standard Deduction: ₹75,000
                    </div>
                  </div>
                </div>

                {/* AI Recommendation Banner */}
                <div style={{ background: 'linear-gradient(135deg,#7B5EA7,#4318FF)', padding: '14px 18px', borderRadius: 14, color: '#fff', display: 'flex', gap: 12, alignItems: 'center' }}>
                  <Sparkles size={24} />
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 14 }}>
                      AI Recommendation: {analysis.recommendedRegime}
                    </div>
                    <div style={{ fontSize: 12, opacity: 0.9 }}>
                      Saves you approx ₹{analysis.taxSavings.toLocaleString('en-IN')} in tax liability!
                    </div>
                  </div>
                </div>

                {/* Applicable Tax Sections */}
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8, color: 'var(--text-primary)' }}>
                    Applied Tax Sections Summary:
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    {analysis.sectionsList.map(sec => (
                      <div key={sec.section} style={{ padding: '8px 12px', background: '#F8FAFC', borderRadius: 10, fontSize: 12, border: '1px solid var(--border)' }}>
                        <div style={{ fontWeight: 700, color: 'var(--brand)' }}>{sec.icon} {sec.section}</div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: 11 }}>Utilized: ₹{sec.utilized.toLocaleString('en-IN')} / Limit: ₹{sec.maxLimit.toLocaleString('en-IN')}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Navigation */}
          <div style={{
            padding: '16px 32px', background: '#F8FAFC', borderTop: '1px solid var(--border)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
          }}>
            {step > 1 ? (
              <button onClick={() => setStep(s => s - 1)} className="btn btn-secondary btn-sm">
                ← Back
              </button>
            ) : <div />}

            {step < 4 ? (
              <button onClick={() => setStep(s => s + 1)} className="btn btn-primary btn-sm">
                Continue to Step {step + 1} →
              </button>
            ) : (
              <button onClick={handleSave} className="btn btn-primary" style={{ padding: '10px 24px' }}>
                🎉 Apply & Analyze My Tax
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
