// Comprehensive Indian Income Tax & GST Calculation Engine (FY 2025-26)

export const formatINR = (n) => {
  if (n === undefined || n === null) return '₹0';
  return '₹' + Number(n).toLocaleString('en-IN');
};

export const DEFAULT_FINANCIALS = {

  pan: 'ABCRS1234F',
  gstin: '27AABCT1332L1ZV',
  businessName: 'TechSolutions Pvt Ltd',
  entityType: 'Private Limited Company', // Individual, Proprietorship, Partnership, Private Limited
  annualRevenue: 2478500,
  annualExpenses: 1245300,
  netProfit: 1233200,
  
  // Deductions / Investments
  sec80C: 150000,          // Max ₹1.5L (EPF, PPF, ELSS, LIC, Tuition)
  sec80D: 25000,           // Medical insurance (Self & Family ₹25k, Parents ₹25k/50k)
  sec80D_parents: 25000,
  hraPaidMonthly: 20000,   // Rent paid per month
  basicSalaryAnnual: 800000,
  isMetroCity: true,
  homeLoanInterestSec24b: 150000, // Max ₹2L for self-occupied
  npsSec80CCD1B: 50000,    // Additional NPS (Max ₹50k)
  sec80G: 10000,           // Donations
  
  // Presumptive Tax option (Sec 44AD / 44ADA)
  usePresumptiveTaxation: false,
  presumptiveRatePct: 6,   // 6% for digital receipts under 44AD, 50% under 44ADA
};

/**
 * Calculate Old Tax Regime Tax (FY 2025-26)
 */
export function calculateOldRegimeTax(grossIncome, totalDeductions) {
  const taxableIncome = Math.max(0, grossIncome - totalDeductions);
  let tax = 0;

  if (taxableIncome <= 250000) {
    tax = 0;
  } else if (taxableIncome <= 500000) {
    tax = (taxableIncome - 250000) * 0.05;
  } else if (taxableIncome <= 1000000) {
    tax = 12500 + (taxableIncome - 500000) * 0.20;
  } else {
    tax = 112500 + (taxableIncome - 1000000) * 0.30;
  }

  // Section 87A rebate for income <= ₹5 Lakh in Old Regime
  if (taxableIncome <= 500000) {
    tax = 0;
  }

  const cess = tax * 0.04; // 4% Health & Education Cess
  const totalTax = Math.round(tax + cess);

  return { taxableIncome, baseTax: tax, cess, totalTax };
}

/**
 * Calculate New Tax Regime Tax (FY 2025-26 Budget Rules)
 * Slabs:
 * 0 - 3,00,000 : NIL
 * 3,00,001 - 7,00,000 : 5%
 * 7,00,001 - 10,00,000 : 10%
 * 10,00,001 - 12,00,000 : 15%
 * 12,00,001 - 15,00,000 : 20%
 * > 15,00,000 : 30%
 * Standard Deduction: ₹75,000
 * Section 87A Rebate for Taxable Income up to ₹7,00,000
 */
export function calculateNewRegimeTax(grossIncome) {
  const standardDeduction = 75000;
  const taxableIncome = Math.max(0, grossIncome - standardDeduction);
  let tax = 0;

  if (taxableIncome <= 300000) {
    tax = 0;
  } else if (taxableIncome <= 700000) {
    tax = (taxableIncome - 300000) * 0.05;
  } else if (taxableIncome <= 1000000) {
    tax = 20000 + (taxableIncome - 700000) * 0.10;
  } else if (taxableIncome <= 1200000) {
    tax = 50000 + (taxableIncome - 1000000) * 0.15;
  } else if (taxableIncome <= 1500000) {
    tax = 80000 + (taxableIncome - 1200000) * 0.20;
  } else {
    tax = 140000 + (taxableIncome - 1500000) * 0.30;
  }

  // Section 87A rebate for taxable income <= ₹7,00,000 in New Regime
  if (taxableIncome <= 700000) {
    tax = 0;
  }

  const cess = tax * 0.04;
  const totalTax = Math.round(tax + cess);

  return { taxableIncome, baseTax: tax, cess, totalTax, standardDeduction };
}

/**
 * Calculate HRA Exemption Sec 10(13A)
 */
export function calculateHRAExemption(annualRentPaid, basicSalary, isMetro = true) {
  if (!annualRentPaid || annualRentPaid <= 0) return 0;
  const rentMinus10PctBasic = Math.max(0, annualRentPaid - (0.10 * basicSalary));
  const maxMetroCap = (isMetro ? 0.50 : 0.40) * basicSalary;
  // HRA exemption is minimum of the conditions
  return Math.min(annualRentPaid, rentMinus10PctBasic, maxMetroCap);
}

/**
 * Comprehensive Financial & Tax Analysis
 */
export function analyzeUserTaxData(fin = DEFAULT_FINANCIALS) {
  const grossIncome = fin.netProfit || (fin.annualRevenue - fin.annualExpenses) || 0;
  
  // HRA Calculation
  const hraExemption = calculateHRAExemption(
    (fin.hraPaidMonthly || 0) * 12,
    fin.basicSalaryAnnual || (grossIncome * 0.5),
    fin.isMetroCity
  );

  // Old Regime Deductions
  const sec80C = Math.min(150000, Number(fin.sec80C) || 0);
  const sec80D = Math.min(50000, (Number(fin.sec80D) || 0) + (Number(fin.sec80D_parents) || 0));
  const homeLoanSec24b = Math.min(200000, Number(fin.homeLoanInterestSec24b) || 0);
  const npsSec80CCD1B = Math.min(50000, Number(fin.npsSec80CCD1B) || 0);
  const sec80G = Number(fin.sec80G) || 0;
  const oldStandardDeduction = 50000;

  const totalOldDeductions = sec80C + sec80D + homeLoanSec24b + npsSec80CCD1B + sec80G + hraExemption + oldStandardDeduction;

  // Calculate taxes
  const oldRegime = calculateOldRegimeTax(grossIncome, totalOldDeductions);
  const newRegime = calculateNewRegimeTax(grossIncome);

  const recommendedRegime = oldRegime.totalTax < newRegime.totalTax ? 'Old Tax Regime' : 'New Tax Regime';
  const taxSavings = Math.abs(oldRegime.totalTax - newRegime.totalTax);

  // Presumptive Tax under Section 44AD / 44ADA
  const presumptiveTaxableIncome = (fin.annualRevenue * (fin.presumptiveRatePct || 6)) / 100;
  const presumptiveTaxCalc = calculateNewRegimeTax(presumptiveTaxableIncome);

  // GST Calculation (18% avg output GST on revenue, 18% avg ITC on expenses)
  const outputGST = Math.round(fin.annualRevenue * 0.18);
  const inputGST = Math.round((fin.annualExpenses * 0.6) * 0.18); // assuming 60% expenses have GST credit
  const netGSTPayable = Math.max(0, outputGST - inputGST);

  // Detailed Applicable Sections breakdown
  const sectionsList = [
    {
      section: 'Section 80C',
      title: 'Investments & Savings (PPF, ELSS, EPF, LIC)',
      maxLimit: 150000,
      utilized: sec80C,
      remaining: Math.max(0, 150000 - sec80C),
      status: sec80C >= 150000 ? 'Fully Utilized' : 'Opportunity to Save',
      appliesTo: 'Old Regime',
      icon: '🛡️'
    },
    {
      section: 'Section 80D',
      title: 'Health Insurance Premium',
      maxLimit: 50000,
      utilized: sec80D,
      remaining: Math.max(0, 50000 - sec80D),
      status: sec80D >= 50000 ? 'Fully Utilized' : 'Opportunity to Save',
      appliesTo: 'Old Regime',
      icon: '🏥'
    },
    {
      section: 'Section 10(13A)',
      title: 'House Rent Allowance (HRA) Exemption',
      maxLimit: Math.round(hraExemption * 1.2),
      utilized: Math.round(hraExemption),
      remaining: 0,
      status: hraExemption > 0 ? 'Claimed' : 'Not Claimed',
      appliesTo: 'Old Regime',
      icon: '🏠'
    },
    {
      section: 'Section 24(b)',
      title: 'Home Loan Interest Deduction',
      maxLimit: 200000,
      utilized: homeLoanSec24b,
      remaining: Math.max(0, 200000 - homeLoanSec24b),
      status: homeLoanSec24b > 0 ? 'Claimed' : 'Not Claimed',
      appliesTo: 'Old Regime',
      icon: '🏢'
    },
    {
      section: 'Section 80CCD(1B)',
      title: 'NPS (National Pension System) Additional',
      maxLimit: 50000,
      utilized: npsSec80CCD1B,
      remaining: Math.max(0, 50000 - npsSec80CCD1B),
      status: npsSec80CCD1B >= 50000 ? 'Fully Utilized' : 'Opportunity to Save',
      appliesTo: 'Old Regime',
      icon: '📈'
    },
    {
      section: 'Section 16(ia)',
      title: 'Standard Deduction (Salaried/Business)',
      maxLimit: 75000,
      utilized: 75000,
      remaining: 0,
      status: 'Auto-Applied',
      appliesTo: 'New Regime (75k) / Old (50k)',
      icon: '⚡'
    },
    {
      section: 'Section 44AD / 44ADA',
      title: 'Presumptive Taxation Scheme',
      maxLimit: fin.annualRevenue,
      utilized: fin.usePresumptiveTaxation ? presumptiveTaxableIncome : 0,
      remaining: 0,
      status: fin.usePresumptiveTaxation ? 'Active (6% Net Income)' : 'Available for Small Business/Pros',
      appliesTo: 'Both Regimes',
      icon: '💼'
    }
  ];

  // AI Tailored Insights
  const aiInsights = [
    {
      type: 'tip',
      icon: '💡',
      title: `Recommended Strategy: ${recommendedRegime}`,
      text: `Choosing the **${recommendedRegime}** saves you approx **₹${taxSavings.toLocaleString('en-IN')}** in taxes for FY 2025-26.`
    },
    {
      type: sec80C < 150000 ? 'warning' : 'positive',
      icon: sec80C < 150000 ? '⚡' : '✅',
      title: 'Section 80C Utilization',
      text: sec80C < 150000 
        ? `You have **₹${(150000 - sec80C).toLocaleString('en-IN')}** unutilized limit under 80C. Invest in ELSS/PPF before March 31 to lower tax.`
        : 'Section 80C is fully maximized at ₹1,50,000.'
    },
    {
      type: 'info',
      icon: '🧾',
      title: 'GST Output vs ITC Balance',
      text: `Estimated Output GST liability is **₹${outputGST.toLocaleString('en-IN')}**. Available ITC is **₹${inputGST.toLocaleString('en-IN')}**. Net GST payable: **₹${netGSTPayable.toLocaleString('en-IN')}**.`
    },
    {
      type: npsSec80CCD1B < 50000 ? 'tip' : 'positive',
      icon: '🎯',
      title: 'Additional NPS Savings (80CCD 1B)',
      text: npsSec80CCD1B < 50000
        ? `Invest up to **₹${(50000 - npsSec80CCD1B).toLocaleString('en-IN')}** in NPS to claim extra tax deduction beyond 80C.`
        : 'Additional ₹50,000 NPS deduction under 80CCD(1B) is claimed!'
    }
  ];

  return {
    grossIncome,
    totalOldDeductions,
    oldRegime,
    newRegime,
    recommendedRegime,
    taxSavings,
    presumptiveTaxCalc,
    outputGST,
    inputGST,
    netGSTPayable,
    sectionsList,
    aiInsights,
    hraExemption
  };
}
