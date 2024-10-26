import { useState, useEffect, useMemo } from 'react';
import LoanRequestForm from '../components/LoanRequestForm';
import InvestmentForm from '../components/InvestmentForm';
import { useNavigate } from 'react-router-dom';

import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, RadialBarChart, RadialBar
} from 'recharts';
import { 
  TrendingUp, Users, DollarSign, AlertCircle,
  ArrowUp, ArrowDown, Clock, Award, Shield,
  Calendar, CreditCard, PieChart as PieChartIcon,
  Activity, Tag, Percent, AlertTriangle,
  CheckCircle, XCircle, ChevronRight, User,
  BarChart2, TrendingDown, Target, FileText,
  Briefcase, PlusCircle, Eye, UserCheck,
  Bell, Star, Bookmark, Link
} from 'lucide-react';

const COLORS = {
  primary: '#4f46e5',
  secondary: '#0ea5e9',
  success: '#22c55e',
  warning: '#eab308',
  danger: '#ef4444',
  info: '#3b82f6',
  chart: {
    blue: ['#e0e7ff', '#4f46e5'],
    green: ['#dcfce7', '#22c55e'],
    purple: ['#f3e8ff', '#9333ea'],
    orange: ['#fff7ed', '#ea580c']
  }
};


const TEST_DATA = {
  stats: {
    totalLoans: 1250,
    activeLoans: 450,
    totalLent: 2500000,
    totalBorrowed: 1800000,
    repaymentRate: 95.8,
    averageInterestRate: 12.5,
    defaultRate: 2.1,
    totalUsers: 3500
  },
  borrower: {
    activeLoans: [
      {
        id: 1,
        amount: 10000,
        interestRate: 12.5,
        monthlyPayment: 892.45,
        remainingAmount: 7500,
        duration: 12,
        progress: 65,
        nextPaymentDate: '2024-03-01',
        status: 'active',
        paymentHistory: [
          { month: 'Jan', paid: true, amount: 892.45 },
          { month: 'Feb', paid: true, amount: 892.45 },
          { month: 'Mar', paid: false, amount: 892.45 }
        ]
      },
      {
        id: 2,
        amount: 5000,
        interestRate: 10.5,
        monthlyPayment: 458.33,
        remainingAmount: 2500,
        duration: 6,
        progress: 80,
        nextPaymentDate: '2024-03-15',
        status: 'active',
        paymentHistory: [
          { month: 'Jan', paid: true, amount: 458.33 },
          { month: 'Feb', paid: true, amount: 458.33 }
        ]
      }
    ],
    creditScore: {
      current: 750,
      history: [
        { month: 'Nov', score: 720 },
        { month: 'Dec', score: 735 },
        { month: 'Jan', score: 745 },
        { month: 'Feb', score: 750 }
      ],
      factors: [
        { factor: 'Payment History', score: 95 },
        { factor: 'Credit Utilization', score: 85 },
        { factor: 'Credit Age', score: 75 },
        { factor: 'Recent Inquiries', score: 90 }
      ]
    },
    upcomingPayments: [
      {
        loanId: 1,
        dueDate: '2024-03-01',
        amount: 892.45,
        status: 'pending'
      },
      {
        loanId: 2,
        dueDate: '2024-03-15',
        amount: 458.33,
        status: 'pending'
      }
    ]
  },
  lender: {
    investments: [
      {
        id: 1,
        borrower: 'John D.',
        amount: 15000,
        interestRate: 14.5,
        monthlyReturn: 450,
        totalReturn: 2250,
        status: 'active',
        riskLevel: 'low',
        performance: 100
      },
      {
        id: 2,
        borrower: 'Sarah M.',
        amount: 10000,
        interestRate: 12.5,
        monthlyReturn: 300,
        totalReturn: 1500,
        status: 'active',
        riskLevel: 'medium',
        performance: 95
      }
    ],
    opportunities: [
      {
        id: 1,
        borrower: {
          name: 'Mark S.',
          creditScore: 780,
          history: 5,
          repaymentRate: 100
        },
        amount: 20000,
        interestRate: 13.5,
        duration: 24,
        riskLevel: 'low',
        purpose: 'Business Expansion',
        expectedReturn: 5400
      },
      {
        id: 2,
        borrower: {
          name: 'Emily R.',
          creditScore: 745,
          history: 3,
          repaymentRate: 98
        },
        amount: 15000,
        interestRate: 15.5,
        duration: 18,
        riskLevel: 'medium',
        purpose: 'Education',
        expectedReturn: 4200
      }
    ],
    portfolioMetrics: {
      riskDistribution: [
        { name: 'Low Risk', value: 45 },
        { name: 'Medium Risk', value: 35 },
        { name: 'High Risk', value: 20 }
      ],
      monthlyReturns: [
        { month: 'Jan', return: 2500 },
        { month: 'Feb', return: 2700 },
        { month: 'Mar', return: 2900 }
      ]
    }
  },
  recentActivity: [
    {
      id: 1,
      type: 'loan_request',
      title: 'New Loan Application',
      description: 'John D. requested a loan of $15,000',
      time: '2 hours ago',
      status: 'pending'
    },
    {
      id: 2,
      type: 'payment',
      title: 'Payment Received',
      description: 'Sarah M. made a payment of $450',
      time: '3 hours ago',
      status: 'completed'
    },
    {
      id: 3,
      type: 'loan_approved',
      title: 'Loan Approved',
      description: 'Your loan request for $10,000 was approved',
      time: '1 day ago',
      status: 'completed'
    }
  ],
  marketMetrics: [
    { month: 'Jan', totalVolume: 150000, avgRate: 12.5 },
    { month: 'Feb', totalVolume: 175000, avgRate: 12.8 },
    { month: 'Mar', totalVolume: 200000, avgRate: 13.0 }
  ]
};

// Continue with Part 2...

// Reusable Card Components
const StatCard = ({ title, value, icon, change, changeType, subtitle, trend, onClick }) => (
  <div 
    className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
    onClick={onClick}
  >
    <div className="flex items-center justify-between">
      <div>
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          {trend && (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              trend === 'up' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {trend === 'up' ? '+' : '-'}{Math.abs(change)}%
            </span>
          )}
        </div>
        <p className="text-2xl font-bold text-gray-900 mt-2">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </p>
        {subtitle && (
          <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
        )}
        {change && (
          <div className={`flex items-center mt-2 ${
            changeType === 'increase' ? 'text-green-600' : 'text-red-600'
          }`}>
            {changeType === 'increase' ? 
              <ArrowUp className="w-4 h-4 mr-1" /> : 
              <ArrowDown className="w-4 h-4 mr-1" />
            }
            <span className="text-sm font-medium">{change}%</span>
          </div>
        )}
      </div>
      <div className={`p-3 rounded-full ${
        changeType === 'increase' ? 'bg-green-50' : 'bg-indigo-50'
      }`}>
        {icon}
      </div>
    </div>
  </div>
);

// Loan Calculator Component
const LoanCalculator = () => {
  const [loanAmount, setLoanAmount] = useState(5000);
  const [interestRate, setInterestRate] = useState(12.5);
  const [duration, setDuration] = useState(12);
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);

  useEffect(() => {
    calculateLoan();
  }, [loanAmount, interestRate, duration]);

  const calculateLoan = () => {
    const monthlyRate = interestRate / 100 / 12;
    const payments = duration;
    const x = Math.pow(1 + monthlyRate, payments);
    const monthly = (loanAmount * x * monthlyRate) / (x - 1);

    setMonthlyPayment(monthly);
    setTotalPayment(monthly * payments);
    setTotalInterest((monthly * payments) - loanAmount);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Loan Calculator</h3>
        <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
          Save Calculation
        </button>
      </div>

      <div className="space-y-6">
        <div>
          <label className="flex items-center justify-between text-sm font-medium text-gray-700">
            <span>Loan Amount</span>
            <span className="text-indigo-600">${loanAmount.toLocaleString()}</span>
          </label>
          <input
            type="range"
            min="1000"
            max="50000"
            step="500"
            value={loanAmount}
            onChange={(e) => setLoanAmount(Number(e.target.value))}
            className="w-full h-2 bg-indigo-200 rounded-lg appearance-none cursor-pointer mt-2"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>$1,000</span>
            <span>$50,000</span>
          </div>
        </div>

        <div>
          <label className="flex items-center justify-between text-sm font-medium text-gray-700">
            <span>Interest Rate</span>
            <span className="text-indigo-600">{interestRate}%</span>
          </label>
          <input
            type="range"
            min="5"
            max="25"
            step="0.5"
            value={interestRate}
            onChange={(e) => setInterestRate(Number(e.target.value))}
            className="w-full h-2 bg-indigo-200 rounded-lg appearance-none cursor-pointer mt-2"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>5%</span>
            <span>25%</span>
          </div>
        </div>

        <div>
          <label className="flex items-center justify-between text-sm font-medium text-gray-700">
            <span>Loan Term</span>
            <span className="text-indigo-600">{duration} months</span>
          </label>
          <input
            type="range"
            min="6"
            max="60"
            step="6"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="w-full h-2 bg-indigo-200 rounded-lg appearance-none cursor-pointer mt-2"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>6 months</span>
            <span>60 months</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-6 bg-gray-50 p-4 rounded-lg">
          <div className="text-center">
            <p className="text-sm text-gray-500">Monthly Payment</p>
            <p className="text-lg font-bold text-indigo-600">
              ${monthlyPayment.toFixed(2)}
            </p>
          </div>
          <div className="text-center border-l border-r border-gray-200">
            <p className="text-sm text-gray-500">Total Payment</p>
            <p className="text-lg font-bold text-green-600">
              ${totalPayment.toFixed(2)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">Total Interest</p>
            <p className="text-lg font-bold text-purple-600">
              ${totalInterest.toFixed(2)}
            </p>
          </div>
        </div>

        <button className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Apply for This Loan
        </button>
      </div>
    </div>
  );
};

// Credit Score Component
const CreditScoreCard = ({ score, history }) => (
  <div className="bg-white rounded-xl shadow-sm p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">Credit Score</h3>
    <div className="relative">
      <div className="flex items-center justify-center">
        <div className="relative">
          <RadialBarChart
            width={200}
            height={200}
            cx={100}
            cy={100}
            innerRadius={60}
            outerRadius={80}
            barSize={10}
            data={[{
              name: 'score',
              value: (score / 850) * 100,
              fill: COLORS.primary
            }]}
            startAngle={180}
            endAngle={0}
          >
            <RadialBar
              background
              dataKey="value"
              cornerRadius={30}
            />
          </RadialBarChart>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
            <p className="text-3xl font-bold text-gray-900">{score}</p>
            <p className="text-sm text-gray-500">out of 850</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Continue with Part 3...

// Activity Feed Component
const ActivityFeed = ({ activities }) => {
  const getActivityIcon = (type) => {
    const icons = {
      loan_request: <FileText className="w-5 h-5" />,
      payment: <DollarSign className="w-5 h-5" />,
      loan_approved: <CheckCircle className="w-5 h-5" />,
      loan_declined: <XCircle className="w-5 h-5" />,
      credit_update: <TrendingUp className="w-5 h-5" />
    };
    return icons[type] || <Clock className="w-5 h-5" />;
  };

  const getActivityColor = (type) => {
    const colors = {
      loan_request: 'bg-blue-50 text-blue-600',
      payment: 'bg-green-50 text-green-600',
      loan_approved: 'bg-green-50 text-green-600',
      loan_declined: 'bg-red-50 text-red-600',
      credit_update: 'bg-indigo-50 text-indigo-600'
    };
    return colors[type] || 'bg-gray-50 text-gray-600';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          <button className="text-sm text-indigo-600 hover:text-indigo-800">View All</button>
        </div>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div 
              key={activity.id}
              className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className={`p-2 rounded-full ${getActivityColor(activity.type)}`}>
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                <p className="text-sm text-gray-500 mt-1">{activity.description}</p>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-sm text-gray-500">{activity.time}</span>
                {activity.status && (
                  <span className={`mt-1 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    activity.status === 'completed' ? 'bg-green-100 text-green-800' : 
                    activity.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {activity.status}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Loan Progress Card Component
const LoanProgressCard = ({ loan }) => (
  <div className="bg-white rounded-xl shadow-sm p-6">
    <div className="flex items-center justify-between mb-4">
      <h4 className="text-lg font-medium text-gray-900">Loan #{loan.id}</h4>
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
        loan.status === 'active' ? 'bg-green-100 text-green-800' : 
        'bg-gray-100 text-gray-800'
      }`}>
        {loan.status}
      </span>
    </div>
    
    <div className="space-y-4">
      <div className="flex justify-between text-sm">
        <span className="text-gray-500">Amount</span>
        <span className="font-medium text-gray-900">${loan.amount.toLocaleString()}</span>
      </div>
      
      <div className="flex justify-between text-sm">
        <span className="text-gray-500">Remaining</span>
        <span className="font-medium text-gray-900">${loan.remainingAmount.toLocaleString()}</span>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Progress</span>
          <span className="font-medium text-gray-900">{loan.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-indigo-600 h-2 rounded-full"
            style={{ width: `${loan.progress}%` }}
          />
        </div>
      </div>
      
      <div className="flex justify-between text-sm">
        <span className="text-gray-500">Next Payment</span>
        <span className="font-medium text-gray-900">${loan.monthlyPayment} on {loan.nextPaymentDate}</span>
      </div>

      <button className="w-full mt-4 px-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors">
        View Details
      </button>
    </div>
  </div>
);

// Main Dashboard Component
const Dashboard = () => {
  const [stats, setStats] = useState({
    totalLoans: 0,
    activeLoans: 0,
    totalLent: 0,
    totalBorrowed: 0,
    repaymentRate: 0,
  });
  
  const [userRole, setUserRole] = useState('borrower');
  const [recentActivity, setRecentActivity] = useState([]);
  const [loanData, setLoanData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
    // Get user role from localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setUserRole(user.role || 'borrower');
  }, []);

  const fetchDashboardData = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      
      setStats(TEST_DATA.stats);
      setRecentActivity(TEST_DATA.recentActivity);
      setLoanData(TEST_DATA.marketMetrics);
      setLoading(false);
    } catch (err) {
      setError('Error loading dashboard data');
      setLoading(false);
    }
  };

  // Continue with Part 4...

// Role-specific dashboard sections
const BorrowerDashboard = ({ data }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard 
        title="Active Loans" 
        value={data.borrower.activeLoans.length}
        icon={<CreditCard className="w-6 h-6 text-indigo-600" />}
        change={0}
        trend="stable"
      />
      <StatCard 
        title="Total Borrowed" 
        value={`$${data.borrower.creditScore.current.toLocaleString()}`}
        icon={<DollarSign className="w-6 h-6 text-green-600" />}
        change={15}
        trend="up"
      />
      <StatCard 
        title="Credit Score" 
        value={data.borrower.creditScore.current}
        icon={<Award className="w-6 h-6 text-purple-600" />}
        change={data.borrower.creditScore.current - data.borrower.creditScore.history[2].score}
        trend="up"
      />
      <StatCard 
        title="Next Payment" 
        value={`$${data.borrower.activeLoans[0]?.monthlyPayment.toLocaleString()}`}
        icon={<Calendar className="w-6 h-6 text-blue-600" />}
        subtitle={data.borrower.activeLoans[0]?.nextPaymentDate}
      />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <LoanCalculator />
      <div className="space-y-6">
        <CreditScoreCard 
          score={data.borrower.creditScore.current}
          history={data.borrower.creditScore.history}
        />
        {data.borrower.activeLoans.map(loan => (
          <LoanProgressCard key={loan.id} loan={loan} />
        ))}
      </div>
    </div>
  </div>
);

const LenderDashboard = ({ data }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard 
        title="Total Invested" 
        value={`$${data.lender.investments.reduce((acc, inv) => acc + inv.amount, 0).toLocaleString()}`}
        icon={<Briefcase className="w-6 h-6 text-indigo-600" />}
        change={8}
        trend="up"
      />
      <StatCard 
        title="Active Investments" 
        value={data.lender.investments.length}
        icon={<Activity className="w-6 h-6 text-green-600" />}
        change={2}
        trend="up"
      />
      <StatCard 
        title="Average Return" 
        value={`${(data.lender.investments.reduce((acc, inv) => acc + inv.interestRate, 0) / data.lender.investments.length).toFixed(1)}%`}
        icon={<TrendingUp className="w-6 h-6 text-blue-600" />}
        change={1.5}
        trend="up"
      />
      <StatCard 
        title="Available Opportunities" 
        value={data.lender.opportunities.length}
        icon={<Target className="w-6 h-6 text-purple-600" />}
        subtitle="New investment options"
      />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Investment Opportunities</h3>
        <div className="space-y-4">
          {data.lender.opportunities.map(opportunity => (
            <div key={opportunity.id} className="border rounded-lg p-4 hover:border-indigo-500 transition-colors">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-gray-900">{opportunity.borrower.name}</h4>
                  <p className="text-sm text-gray-500">{opportunity.purpose}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  opportunity.riskLevel === 'low' ? 'bg-green-100 text-green-800' :
                  opportunity.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {opportunity.riskLevel.toUpperCase()} RISK
                </span>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Amount</p>
                  <p className="font-medium text-gray-900">${opportunity.amount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-500">Interest Rate</p>
                  <p className="font-medium text-gray-900">{opportunity.interestRate}%</p>
                </div>
                <div>
                  <p className="text-gray-500">Term</p>
                  <p className="font-medium text-gray-900">{opportunity.duration} months</p>
                </div>
              </div>
              <button className="mt-4 w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                Invest Now
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Portfolio Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data.lender.portfolioMetrics.riskDistribution}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label
              >
                {data.lender.portfolioMetrics.riskDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS.chart[Object.keys(COLORS.chart)[index]]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Returns</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data.lender.portfolioMetrics.monthlyReturns}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="return" stroke={COLORS.chart.blue[1]} fill={COLORS.chart.blue[0]} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  </div>
);

const [showForm, setShowForm] = useState(false);
const navigate = useNavigate(); 

const handleFormSubmit = (formData) => {
  // Handle form submission here, send data to API or process it
  console.log('Form submitted:', formData);
  setShowForm(false);  // Hide the form after submission
};
// Main render
return (
  <div className="space-y-6">

    {/* Page Header */}
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-1">
          Welcome back! Here's what's happening with your {userRole === 'borrower' ? 'loans' : 'investments'}.
        </p>
      </div>

      <button
        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
        onClick={() => navigate(userRole === 'borrower' ? '/request-loan' : '/make-investment')}  // Navigate to form page
      >
        <PlusCircle className="w-5 h-5" />
        <span>{userRole === 'borrower' ? 'Request Loan' : 'Make Investment'}</span>
      </button>
    </div>

    {/* Role-specific dashboard */}
    {userRole === 'borrower' ? (
      <BorrowerDashboard data={TEST_DATA} />
    ) : (
      <LenderDashboard data={TEST_DATA} />
    )}

    {/* Conditionally render the form based on the user role */}
    {showForm && (
      <>
        {userRole === 'borrower' ? (
          <LoanRequestForm onSubmit={handleFormSubmit} />
        ) : (
          <InvestmentForm onSubmit={handleFormSubmit} />
        )}
      </>
    )}

    {/* Recent Activity Feed */}
    <ActivityFeed activities={recentActivity} />

  </div>
);
};

export default Dashboard;