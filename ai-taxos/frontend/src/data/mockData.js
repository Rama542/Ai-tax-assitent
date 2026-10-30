// Mock data for demo mode — rich realistic accounting data
export const MOCK_USER = {
  uid: 'demo-uid-001',
  displayName: 'Rama Sasank',
  email: 'rama@techsolutions.in',
  emailVerified: true,
};
export const MOCK_PROFILE = {
  uid: 'demo-uid-001',
  name: 'Rama Sasank',
  email: 'rama@techsolutions.in',
  role: 'business',
  phone: '+91 98765 43210',
  pan: 'ABCRS1234F',
  gstin: '27AABCT1332L1ZV',
  city: 'Hyderabad',
  state: 'Telangana',
  businessName: 'TechSolutions Pvt Ltd',
  industry: 'Technology',
  onboardingComplete: true,
};

// ─── Revenue ───────────────────────────────────────────
export const MOCK_REVENUES = [
  { id:'REV-001', invoiceNo:'INV-10023', customer:'Tech Solutions Pvt Ltd', date:'2026-08-09', category:'Software Services', paymentMethod:'Bank Transfer', gstIncluded:true, gstPct:18, amount:125000, notes:'Q3 consulting', createdAt:new Date() },
  { id:'REV-002', invoiceNo:'INV-10022', customer:'Design Studio', date:'2026-08-08', category:'Design Services', paymentMethod:'UPI', gstIncluded:true, gstPct:18, amount:85000, notes:'Brand package', createdAt:new Date() },
  { id:'REV-003', invoiceNo:'INV-10021', customer:'Marketing Agency', date:'2026-08-07', category:'Marketing', paymentMethod:'Cheque', gstIncluded:true, gstPct:18, amount:95000, notes:'Campaign work', createdAt:new Date() },
  { id:'REV-004', invoiceNo:'INV-10020', customer:'Fintech Corp', date:'2026-08-05', category:'Software Services', paymentMethod:'Bank Transfer', gstIncluded:true, gstPct:18, amount:240000, notes:'Platform license', createdAt:new Date() },
  { id:'REV-005', invoiceNo:'INV-10019', customer:'Retail Chain', date:'2026-08-03', category:'IT Support', paymentMethod:'UPI', gstIncluded:false, gstPct:0, amount:45000, notes:'Monthly support', createdAt:new Date() },
  { id:'REV-006', invoiceNo:'INV-10018', customer:'Healthcare Plus', date:'2026-07-28', category:'Software Services', paymentMethod:'Bank Transfer', gstIncluded:true, gstPct:18, amount:180000, notes:'ERP development', createdAt:new Date() },
  { id:'REV-007', invoiceNo:'INV-10017', customer:'Edu Techno', date:'2026-07-22', category:'Training', paymentMethod:'UPI', gstIncluded:true, gstPct:18, amount:60000, notes:'Workshop', createdAt:new Date() },
  { id:'REV-008', invoiceNo:'INV-10016', customer:'Startup Hub', date:'2026-07-15', category:'Consulting', paymentMethod:'Bank Transfer', gstIncluded:true, gstPct:18, amount:75000, notes:'Strategy', createdAt:new Date() },
];

// ─── Expenses ──────────────────────────────────────────
export const MOCK_EXPENSES = [
  { id:'EXP-001', name:'Office Rent', vendor:'Prime Properties', date:'2026-08-01', category:'Rent', amount:240000, gstPaid:43200, paymentMethod:'Bank Transfer', notes:'Monthly rent', createdAt:new Date() },
  { id:'EXP-002', name:'Employee Salaries', vendor:'Internal', date:'2026-08-01', category:'Salaries', amount:420000, gstPaid:0, paymentMethod:'Bank Transfer', notes:'Aug salaries', createdAt:new Date() },
  { id:'EXP-003', name:'Electricity Bill', vendor:'TSSPDCL', date:'2026-08-05', category:'Utilities', amount:12000, gstPaid:2160, paymentMethod:'UPI', notes:'Aug bill', createdAt:new Date() },
  { id:'EXP-004', name:'Internet & Phone', vendor:'Airtel Business', date:'2026-08-06', category:'Utilities', amount:8000, gstPaid:1440, paymentMethod:'Auto-debit', notes:'Monthly plan', createdAt:new Date() },
  { id:'EXP-005', name:'Google Ads', vendor:'Google LLC', date:'2026-08-07', category:'Marketing', amount:55000, gstPaid:9900, paymentMethod:'Credit Card', notes:'Paid campaigns', createdAt:new Date() },
  { id:'EXP-006', name:'Office Supplies', vendor:'Office Supplies Co.', date:'2026-08-08', category:'Operations', amount:15600, gstPaid:2808, paymentMethod:'UPI', notes:'Stationery', createdAt:new Date() },
  { id:'EXP-007', name:'AWS Cloud', vendor:'Amazon', date:'2026-08-01', category:'Technology', amount:38000, gstPaid:6840, paymentMethod:'Credit Card', notes:'Servers', createdAt:new Date() },
  { id:'EXP-008', name:'CA/Legal Fees', vendor:'Sharma & Associates', date:'2026-08-03', category:'Professional', amount:25000, gstPaid:4500, paymentMethod:'Cheque', notes:'Compliance', createdAt:new Date() },
];

// ─── Purchases ─────────────────────────────────────────
export const MOCK_PURCHASES = [
  { id:'PUR-001', supplier:'Hardware Hub', invoiceNo:'PUR-30012', product:'Laptop Dell XPS', qty:3, purchaseAmount:45000, gstAmount:8100, date:'2026-08-08', createdAt:new Date() },
  { id:'PUR-002', supplier:'Tech Distributors', invoiceNo:'PUR-30011', product:'Monitor 27"', qty:5, purchaseAmount:22500, gstAmount:4050, date:'2026-08-05', createdAt:new Date() },
  { id:'PUR-003', supplier:'Office World', invoiceNo:'PUR-30010', product:'Office Chairs', qty:10, purchaseAmount:35000, gstAmount:6300, date:'2026-08-01', createdAt:new Date() },
  { id:'PUR-004', supplier:'Cloud Vendor', invoiceNo:'PUR-30009', product:'Software Licenses', qty:20, purchaseAmount:60000, gstAmount:10800, date:'2026-07-28', createdAt:new Date() },
];

// ─── Sales ─────────────────────────────────────────────
export const MOCK_SALES = [
  { id:'SAL-001', customer:'Marketing Agency', invoiceNo:'SAL-40008', product:'Web App License', qty:1, saleAmount:65000, gstAmount:11700, date:'2026-08-07', createdAt:new Date() },
  { id:'SAL-002', customer:'Startup Inc', invoiceNo:'SAL-40007', product:'SaaS Subscription', qty:12, saleAmount:48000, gstAmount:8640, date:'2026-08-05', createdAt:new Date() },
  { id:'SAL-003', customer:'Retail Corp', invoiceNo:'SAL-40006', product:'POS Software', qty:3, saleAmount:90000, gstAmount:16200, date:'2026-08-02', createdAt:new Date() },
  { id:'SAL-004', customer:'Healthcare Plus', invoiceNo:'SAL-40005', product:'ERP Module', qty:1, saleAmount:180000, gstAmount:32400, date:'2026-07-29', createdAt:new Date() },
];

// ─── Assets ────────────────────────────────────────────
export const MOCK_ASSETS = [
  { id:'AST-001', name:'MacBook Pro M3', category:'Electronics', purchaseDate:'2024-01-15', purchaseCost:185000, currentValue:148000, depreciation:37000, depRate:20 },
  { id:'AST-002', name:'Office Furniture Set', category:'Furniture', purchaseDate:'2023-06-10', purchaseCost:120000, currentValue:84000, depreciation:36000, depRate:10 },
  { id:'AST-003', name:'Server Equipment', category:'Technology', purchaseDate:'2024-03-20', purchaseCost:350000, currentValue:262500, depreciation:87500, depRate:25 },
  { id:'AST-004', name:'Company Vehicle', category:'Vehicle', purchaseDate:'2023-01-05', purchaseCost:850000, currentValue:680000, depreciation:170000, depRate:20 },
];

// ─── Liabilities ───────────────────────────────────────
export const MOCK_LIABILITIES = [
  { id:'LIA-001', name:'Business Loan - HDFC', outstanding:1200000, emi:55000, interestRate:11.5, dueDate:'2026-08-25', lender:'HDFC Bank', startDate:'2023-01-01' },
  { id:'LIA-002', name:'Working Capital Loan', outstanding:500000, emi:25000, interestRate:13.0, dueDate:'2026-08-15', lender:'ICICI Bank', startDate:'2024-06-01' },
  { id:'LIA-003', name:'Equipment Finance', outstanding:280000, emi:18000, interestRate:10.5, dueDate:'2026-08-30', lender:'Kotak Mahindra', startDate:'2024-01-15' },
];

// ─── Employees ─────────────────────────────────────────
export const MOCK_EMPLOYEES = [
  { id:'EMP-001', name:'Arjun Sharma', empId:'TEC-101', department:'Engineering', designation:'Sr. Developer', salary:85000, joiningDate:'2022-05-01', pf:10200, professionalTax:200, status:'active' },
  { id:'EMP-002', name:'Priya Reddy', empId:'TEC-102', department:'Design', designation:'UI/UX Designer', salary:65000, joiningDate:'2023-01-15', pf:7800, professionalTax:200, status:'active' },
  { id:'EMP-003', name:'Rohit Kumar', empId:'TEC-103', department:'Sales', designation:'Business Dev', salary:55000, joiningDate:'2023-06-01', pf:6600, professionalTax:200, status:'active' },
  { id:'EMP-004', name:'Anjali Patel', empId:'TEC-104', department:'HR', designation:'HR Manager', salary:60000, joiningDate:'2022-09-10', pf:7200, professionalTax:200, status:'active' },
  { id:'EMP-005', name:'Suresh Nair', empId:'TEC-105', department:'Engineering', designation:'Backend Dev', salary:72000, joiningDate:'2023-03-20', pf:8640, professionalTax:200, status:'active' },
];

// ─── Revenue chart data ────────────────────────────────
export const REVENUE_MONTHLY = [
  { month:'Jan', revenue:1850000, expenses:1120000 },
  { month:'Feb', revenue:2100000, expenses:1280000 },
  { month:'Mar', revenue:1980000, expenses:1150000 },
  { month:'Apr', revenue:2350000, expenses:1420000 },
  { month:'May', revenue:2200000, expenses:1380000 },
  { month:'Jun', revenue:2680000, expenses:1600000 },
  { month:'Jul', revenue:2450000, expenses:1480000 },
  { month:'Aug', revenue:2478000, expenses:1245000 },
];

export const PROFIT_TREND = [
  { month:'Jan', profit:730000 },
  { month:'Mar', profit:830000 },
  { month:'May', profit:820000 },
  { month:'Jul', profit:970000 },
  { month:'Aug', profit:1233000 },
];

export const CASH_FLOW_SPARKLINE = [820,940,880,1020,960,1100,980,1080,1150,1050,1180,1245];

export const EXPENSE_BREAKDOWN = [
  { name:'Rent', value:240000, pct:19, color:'#4318FF' },
  { name:'Salaries', value:420000, pct:34, color:'#6AD2FF' },
  { name:'Utilities', value:120000, pct:10, color:'#7B5EA7' },
  { name:'Marketing', value:150000, pct:12, color:'#EFF4FB' },
  { name:'Others', value:315300, pct:25, color:'#B9C0D4' },
];

// ─── Recent Transactions ───────────────────────────────
export const RECENT_TRANSACTIONS = [
  { id:'TXN-1', refNo:'INV-10023', party:'Tech Solutions Pvt Ltd', amount:125000, date:'09 Aug 2026', type:'revenue' },
  { id:'TXN-2', refNo:'EXP-20045', party:'Office Supplies Co.', amount:15600, date:'09 Aug 2026', type:'expense' },
  { id:'TXN-3', refNo:'INV-10022', party:'Design Studio', amount:85000, date:'08 Aug 2026', type:'revenue' },
  { id:'TXN-4', refNo:'PUR-30012', party:'Hardware Hub', amount:45000, date:'08 Aug 2026', type:'purchase' },
  { id:'TXN-5', refNo:'SAL-40008', party:'Marketing Agency', amount:65000, date:'07 Aug 2026', type:'sales' },
];

// ─── Upcoming Tasks ─────────────────────────────────────
export const UPCOMING_TASKS = [
  { id:1, task:'File GSTR-1 for July 2026', dueDate:'2026-08-11', daysLeft:5, status:'urgent' },
  { id:2, task:'Pay Advance Tax – Q2', dueDate:'2026-08-17', daysLeft:12, status:'soon' },
  { id:3, task:'File Income Tax Return', dueDate:'2026-08-31', daysLeft:25, status:'upcoming' },
  { id:4, task:'Renew Business License', dueDate:'2026-09-06', daysLeft:30, status:'upcoming' },
  { id:5, task:'Audit Report Submission', dueDate:'2026-09-21', daysLeft:45, status:'upcoming' },
];

// ─── AI Insights ───────────────────────────────────────
export const AI_INSIGHTS = [
  { id:1, type:'positive', icon:'📈', text:'Revenue increased by 18% this month compared to last month.' },
  { id:2, type:'warning', icon:'⚡', text:'Electricity expenses are unusually high. Consider optimizing usage.' },
  { id:3, type:'negative', icon:'📉', text:'Profit margin dropped by 6% due to increased operating expenses.' },
  { id:4, type:'info', icon:'💰', text:'GST liability is expected to be ₹1,25,000 for this month.' },
  { id:5, type:'tip', icon:'💡', text:'You may save tax by claiming additional deductions under 80C & 80D.' },
];

// ─── Helper ────────────────────────────────────────────
export const formatINR = (n) => {
  if (n === undefined || n === null) return '₹0';
  return '₹' + Number(n).toLocaleString('en-IN');
};

export const formatINRShort = (n) => {
  if (!n) return '₹0';
  if (n >= 10000000) return `₹${(n/10000000).toFixed(1)}Cr`;
  if (n >= 100000) return `₹${(n/100000).toFixed(1)}L`;
  if (n >= 1000) return `₹${(n/1000).toFixed(0)}K`;
  return `₹${n}`;
};
