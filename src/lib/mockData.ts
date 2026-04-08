// Mock data for the banking dashboard

export const segmentData = [
  { segment: "Retail Premium", customers: 12400, accounts: 18600, revenue: 4200000, growth: 12.3, region: "North" },
  { segment: "Retail Standard", customers: 45200, accounts: 52100, revenue: 8100000, growth: 5.1, region: "Central" },
  { segment: "Corporate SME", customers: 3200, accounts: 8400, revenue: 6700000, growth: 8.7, region: "East" },
  { segment: "Corporate Enterprise", customers: 890, accounts: 4200, revenue: 12300000, growth: 15.2, region: "West" },
  { segment: "Private Banking", customers: 1100, accounts: 3300, revenue: 9800000, growth: 7.4, region: "South" },
  { segment: "Digital Only", customers: 28900, accounts: 29800, revenue: 2100000, growth: 32.1, region: "North" },
];

export const regionalData = [
  { region: "North", customers: 28400, revenue: 8900000 },
  { region: "South", customers: 19200, revenue: 6200000 },
  { region: "East", customers: 22100, revenue: 7400000 },
  { region: "West", customers: 15800, revenue: 5100000 },
  { region: "Central", customers: 6200, revenue: 15600000 },
];

export const ageDistribution = [
  { range: "18-24", count: 8200 },
  { range: "25-34", count: 22400 },
  { range: "35-44", count: 18900 },
  { range: "45-54", count: 15600 },
  { range: "55-64", count: 12100 },
  { range: "65+", count: 14500 },
];

export const genderData = [
  { name: "Male", value: 52.3 },
  { name: "Female", value: 44.1 },
  { name: "Other", value: 3.6 },
];

export const nationalityData = [
  { name: "Domestic", value: 78.2 },
  { name: "Expatriate", value: 18.4 },
  { name: "Non-Resident", value: 3.4 },
];

export const tenureData = [
  { years: "<1", count: 12400 },
  { years: "1-3", count: 18700 },
  { years: "3-5", count: 15200 },
  { years: "5-10", count: 22100 },
  { years: "10+", count: 23300 },
];

export const kycData = [
  { name: "KYC Complete", value: 82.4 },
  { name: "Pending", value: 12.1 },
  { name: "Expired", value: 5.5 },
];

export const accountStatusData = {
  active: 78400,
  inactive: 12300,
  closed: 8900,
  frozen: 1200,
};

export const accountClassDistribution = [
  { name: "Savings", value: 38 },
  { name: "Current", value: 28 },
  { name: "Fixed Deposit", value: 15 },
  { name: "Recurring", value: 8 },
  { name: "NRE/NRO", value: 6 },
  { name: "Other", value: 5 },
];

export const salaryAccountData = [
  { name: "Receives Salary", value: 45.2 },
  { name: "No Salary", value: 54.8 },
];

export const adbRanges = [
  { range: "≤0", count: 4200, pct: 4.2 },
  { range: "1-1K", count: 18900, pct: 18.7 },
  { range: "1K-10K", count: 32100, pct: 31.8 },
  { range: "10K-50K", count: 24600, pct: 24.4 },
  { range: "50K-100K", count: 12400, pct: 12.3 },
  { range: "100K+", count: 8600, pct: 8.5 },
];

export const subscriptionData = [
  { name: "Mobile App", active: 62400, inactive: 18400, revenue: 890000 },
  { name: "SMS Alerts", active: 45200, inactive: 35600, revenue: 1200000 },
  { name: "WhatsApp Banking", active: 28900, inactive: 52000, revenue: 340000 },
  { name: "MobiCash", active: 15600, inactive: 65200, revenue: 780000 },
];

export const sampleCustomer = {
  id: "CUST-2024-00142",
  name: "Aarav Mehta",
  segment: "Retail Premium",
  primaryBranch: "Mumbai Central",
  customerType: "Individual",
  status: "Active",
  accountCount: 4,
  age: 38,
  tenure: "7 years",
  kyc: "Complete",
  gender: "Male",
  nationality: "Domestic",
  accounts: [
    { id: "ACC-001", number: "****4521", class: "Savings", status: "Open", balance: 245000 },
    { id: "ACC-002", number: "****8832", class: "Current", status: "Open", balance: 890000 },
    { id: "ACC-003", number: "****1109", class: "Fixed Deposit", status: "Open", balance: 500000 },
    { id: "ACC-004", number: "****6677", class: "Savings", status: "Closed", balance: 0 },
  ],
  salary: {
    receivesSalary: true,
    avgMonthlySalary: 185000,
    consistency: [true, true, true, false, true, true],
  },
  financials: {
    totalRevenue: 42800,
    trnVolume: 342,
    avgDailyTrn: 12400,
    avgMonthlyTrn: 372000,
    minSubscriptionRevenue: 450,
    bestMonth: { month: "Mar 2024", revenue: 6800, volume: 52 },
    worstMonth: { month: "Aug 2024", revenue: 1200, volume: 12 },
  },
  monthlyRevenue: [
    { month: "Jan", revenue: 3200, volume: 28 },
    { month: "Feb", revenue: 4100, volume: 34 },
    { month: "Mar", revenue: 6800, volume: 52 },
    { month: "Apr", revenue: 3900, volume: 31 },
    { month: "May", revenue: 4500, volume: 38 },
    { month: "Jun", revenue: 3700, volume: 29 },
    { month: "Jul", revenue: 2800, volume: 22 },
    { month: "Aug", revenue: 1200, volume: 12 },
    { month: "Sep", revenue: 3100, volume: 26 },
    { month: "Oct", revenue: 4200, volume: 35 },
    { month: "Nov", revenue: 3800, volume: 32 },
    { month: "Dec", revenue: 1500, volume: 3 },
  ],
  topProducts: [
    { name: "Wire Transfer", usage: 89, revenue: 12400 },
    { name: "Bill Pay", usage: 67, revenue: 3400 },
    { name: "FX Exchange", usage: 23, revenue: 8900 },
    { name: "Demand Draft", usage: 12, revenue: 2100 },
    { name: "Trade Finance", usage: 8, revenue: 15200 },
  ],
  channels: {
    onepay: { volume: 124, value: 890000 },
    lypay: { volume: 89, value: 420000 },
    mobicash: { volume: 45, value: 180000 },
    sms: { volume: 210, value: 0 },
  },
  subscriptions: {
    mobileApp: { status: "Active", loginFreq: 18 },
    whatsapp: { optIn: true, interactions: 42 },
    smsAlerts: { tier: "Premium", price: 150 },
  },
  loans: {
    active: [
      { id: "LN-001", type: "Home Loan", outstanding: 4500000, rate: 8.5, maturity: "2035-06-15" },
      { id: "LN-002", type: "Personal Loan", outstanding: 320000, rate: 12.0, maturity: "2026-03-01" },
    ],
    closed: [
      { id: "LN-003", type: "Car Loan", amount: 800000, behavior: "On-time" },
      { id: "LN-004", type: "Education Loan", amount: 1200000, behavior: "Delayed (2x)" },
    ],
    creditScore: 742,
    credibility: "Good",
    dti: 34.2,
  },
  risk: {
    profitability: 72,
    spendingRatio: 0.68,
    behaviorChange: [
      { period: "Q1", score: 72 },
      { period: "Q2", score: 68 },
      { period: "Q3", score: 75 },
      { period: "Q4", score: 71 },
    ],
  },
  cards: [
    { type: "Visa Platinum", status: "Active", limit: 500000, utilization: 42, expiry: "2026-08" },
    { type: "Mastercard Gold", status: "Active", limit: 300000, utilization: 28, expiry: "2025-12" },
    { type: "Domestic Debit", status: "Active", limit: 0, utilization: 0, expiry: "2027-03" },
  ],
};

export const alerts = [
  { id: 1, type: "segment", severity: "high", title: "Segment Shift Detected", description: "142 customers moved from Retail Standard to Retail Premium in the last 30 days.", time: "2h ago", metric: "+142" },
  { id: 2, type: "branch", severity: "critical", title: "Branch Performance Drop", description: "Mumbai West branch revenue decreased by 28% compared to last quarter.", time: "4h ago", metric: "-28%" },
  { id: 3, type: "transaction", severity: "medium", title: "Transaction Anomaly", description: "30% of Corporate SME segment increased transaction count by >50%.", time: "6h ago", metric: "+30%" },
  { id: 4, type: "subscription", severity: "low", title: "SMS Alert Drop", description: "1,200 customers unsubscribed from SMS Alerts this week.", time: "1d ago", metric: "-1.2K" },
  { id: 5, type: "subscription", severity: "medium", title: "Mobile App Spike", description: "New mobile app registrations increased 45% after campaign launch.", time: "1d ago", metric: "+45%" },
  { id: 6, type: "inactive", severity: "high", title: "Inactive Customer Spike", description: "890 accounts became inactive in the last 7 days, 3x normal rate.", time: "2d ago", metric: "890" },
  { id: 7, type: "transaction", severity: "critical", title: "Large Value Transfer Flag", description: "12 flagged transactions exceeding $500K from 3 corporate accounts.", time: "3h ago", metric: "12" },
  { id: 8, type: "subscription", severity: "low", title: "WhatsApp Opt-in Growth", description: "WhatsApp Banking opt-ins grew 22% month-over-month.", time: "3d ago", metric: "+22%" },
];

// Multiple customers for the customer list page
export const customersListData = [
  { id: "CUST-2024-00142", name: "Aarav Mehta", segment: "Retail Premium", branch: "Mumbai Central", accounts: 4, totalBalance: 1635000, totalRevenue: 42800, trnVolume: 342, creditScore: 742, status: "Active" },
  { id: "CUST-2024-00078", name: "Priya Sharma", segment: "Private Banking", branch: "Delhi South", accounts: 6, totalBalance: 4520000, totalRevenue: 89200, trnVolume: 512, creditScore: 798, status: "Active" },
  { id: "CUST-2024-00215", name: "Vikram Patel", segment: "Corporate SME", branch: "Ahmedabad Main", accounts: 3, totalBalance: 3890000, totalRevenue: 75400, trnVolume: 287, creditScore: 721, status: "Active" },
  { id: "CUST-2024-00331", name: "Anita Desai", segment: "Retail Standard", branch: "Pune Camp", accounts: 2, totalBalance: 321000, totalRevenue: 12100, trnVolume: 156, creditScore: 685, status: "Active" },
  { id: "CUST-2024-00402", name: "Rajesh Kumar", segment: "Corporate Enterprise", branch: "Chennai Central", accounts: 8, totalBalance: 28700000, totalRevenue: 543000, trnVolume: 1240, creditScore: 812, status: "Active" },
  { id: "CUST-2024-00089", name: "Sunita Reddy", segment: "Retail Premium", branch: "Hyderabad Main", accounts: 3, totalBalance: 2450000, totalRevenue: 47800, trnVolume: 398, creditScore: 756, status: "Active" },
  { id: "CUST-2024-00567", name: "Arjun Nair", segment: "Digital Only", branch: "Kochi Marine", accounts: 2, totalBalance: 890000, totalRevenue: 23200, trnVolume: 892, creditScore: 701, status: "Active" },
  { id: "CUST-2024-00634", name: "Meera Iyer", segment: "Private Banking", branch: "Bangalore MG Road", accounts: 5, totalBalance: 1980000, totalRevenue: 39800, trnVolume: 234, creditScore: 778, status: "Inactive" },
  { id: "CUST-2024-00711", name: "Amit Joshi", segment: "Retail Standard", branch: "Jaipur Central", accounts: 2, totalBalance: 182000, totalRevenue: 8900, trnVolume: 98, creditScore: 654, status: "Active" },
  { id: "CUST-2024-00823", name: "Kavita Singh", segment: "Corporate SME", branch: "Lucknow Hazratganj", accounts: 4, totalBalance: 1690000, totalRevenue: 33400, trnVolume: 445, creditScore: 734, status: "Active" },
  { id: "CUST-2024-00901", name: "Deepak Gupta", segment: "Retail Premium", branch: "Kolkata Park St", accounts: 3, totalBalance: 1540000, totalRevenue: 31200, trnVolume: 267, creditScore: 698, status: "Active" },
  { id: "CUST-2024-00955", name: "Neha Agarwal", segment: "Digital Only", branch: "Online", accounts: 1, totalBalance: 78000, totalRevenue: 4500, trnVolume: 1120, creditScore: 672, status: "Active" },
];

// Per-account financial data keyed by account id
export const accountFinancials: Record<string, typeof sampleCustomer.financials> = {
  "ACC-001": sampleCustomer.financials,
  "ACC-002": { totalRevenue: 68200, trnVolume: 521, avgDailyTrn: 18200, avgMonthlyTrn: 546000, minSubscriptionRevenue: 600, bestMonth: { month: "Feb 2024", revenue: 9400, volume: 68 }, worstMonth: { month: "Jul 2024", revenue: 2800, volume: 18 } },
  "ACC-003": { totalRevenue: 15000, trnVolume: 24, avgDailyTrn: 4200, avgMonthlyTrn: 126000, minSubscriptionRevenue: 0, bestMonth: { month: "Jan 2024", revenue: 2500, volume: 4 }, worstMonth: { month: "Dec 2024", revenue: 800, volume: 1 } },
  "ACC-004": { totalRevenue: 0, trnVolume: 0, avgDailyTrn: 0, avgMonthlyTrn: 0, minSubscriptionRevenue: 0, bestMonth: { month: "—", revenue: 0, volume: 0 }, worstMonth: { month: "—", revenue: 0, volume: 0 } },
};

export const accountMonthlyRevenue: Record<string, typeof sampleCustomer.monthlyRevenue> = {
  "ACC-001": sampleCustomer.monthlyRevenue,
  "ACC-002": [
    { month: "Jan", revenue: 5100, volume: 42 }, { month: "Feb", revenue: 9400, volume: 68 }, { month: "Mar", revenue: 7200, volume: 55 },
    { month: "Apr", revenue: 6100, volume: 48 }, { month: "May", revenue: 5800, volume: 44 }, { month: "Jun", revenue: 4900, volume: 38 },
    { month: "Jul", revenue: 2800, volume: 18 }, { month: "Aug", revenue: 4200, volume: 32 }, { month: "Sep", revenue: 5500, volume: 41 },
    { month: "Oct", revenue: 6800, volume: 52 }, { month: "Nov", revenue: 5200, volume: 40 }, { month: "Dec", revenue: 5300, volume: 43 },
  ],
  "ACC-003": [
    { month: "Jan", revenue: 2500, volume: 4 }, { month: "Feb", revenue: 1800, volume: 3 }, { month: "Mar", revenue: 1200, volume: 2 },
    { month: "Apr", revenue: 1500, volume: 2 }, { month: "May", revenue: 1300, volume: 2 }, { month: "Jun", revenue: 1100, volume: 1 },
    { month: "Jul", revenue: 900, volume: 1 }, { month: "Aug", revenue: 1000, volume: 1 }, { month: "Sep", revenue: 1200, volume: 2 },
    { month: "Oct", revenue: 800, volume: 1 }, { month: "Nov", revenue: 900, volume: 2 }, { month: "Dec", revenue: 800, volume: 1 },
  ],
  "ACC-004": Array(12).fill({ month: "", revenue: 0, volume: 0 }).map((_, i) => ({ month: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][i], revenue: 0, volume: 0 })),
};

export const vipCustomers = [
  { rank: 1, name: "Priya Sharma", aum: 45200000, revenue: 892000, loanSize: 12000000, cardSpend: 2800000, churnRisk: "Low" },
  { rank: 2, name: "Vikram Patel", aum: 38900000, revenue: 754000, loanSize: 8500000, cardSpend: 3200000, churnRisk: "Low" },
  { rank: 3, name: "Anita Desai", aum: 32100000, revenue: 621000, loanSize: 0, cardSpend: 1900000, churnRisk: "Medium" },
  { rank: 4, name: "Rajesh Kumar", aum: 28700000, revenue: 543000, loanSize: 15000000, cardSpend: 1200000, churnRisk: "Low" },
  { rank: 5, name: "Sunita Reddy", aum: 24500000, revenue: 478000, loanSize: 5000000, cardSpend: 2100000, churnRisk: "High" },
  { rank: 6, name: "Arjun Nair", aum: 22100000, revenue: 432000, loanSize: 9200000, cardSpend: 1800000, churnRisk: "Low" },
  { rank: 7, name: "Meera Iyer", aum: 19800000, revenue: 398000, loanSize: 0, cardSpend: 2500000, churnRisk: "Medium" },
  { rank: 8, name: "Amit Joshi", aum: 18200000, revenue: 367000, loanSize: 7800000, cardSpend: 980000, churnRisk: "Low" },
  { rank: 9, name: "Kavita Singh", aum: 16900000, revenue: 334000, loanSize: 3200000, cardSpend: 1600000, churnRisk: "Low" },
  { rank: 10, name: "Deepak Gupta", aum: 15400000, revenue: 312000, loanSize: 11000000, cardSpend: 890000, churnRisk: "High" },
];
