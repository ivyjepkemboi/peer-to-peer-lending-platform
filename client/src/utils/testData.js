// src/utils/testData.js - Save this as a separate file
export const TEST_DATA = {
    borrower: {
      stats: {
        totalLoans: 5,
        activeLoans: 2,
        totalBorrowed: 25000,
        totalRepaid: 15000,
        nextPayment: {
          amount: 1200,
          dueDate: '2024-03-01'
        },
        creditScore: 750,
        repaymentRate: 95.8,
      },
      loanHistory: [
        {
          id: 1,
          amount: 10000,
          interest_rate: 12.5,
          duration_months: 12,
          status: 'active',
          monthlyPayment: 892.45,
          nextPaymentDate: '2024-03-01',
          totalRepaid: 5354.70,
          remainingBalance: 5645.30
        },
        // Add more loan history
      ],
      recentActivity: [
        {
          id: 1,
          type: 'payment_made',
          title: 'Payment Made',
          description: 'Successfully paid $892.45 for Loan #1234',
          time: '2 hours ago',
          status: 'success'
        },
        // Add more activities
      ]
    },
    lender: {
      stats: {
        totalInvested: 150000,
        activeInvestments: 12,
        totalEarnings: 25000,
        averageReturn: 15.5,
        pendingRequests: 8,
        portfolioHealth: 98.5
      },
      investmentOpportunities: [
        {
          id: 1,
          borrower: {
            name: 'John Doe',
            creditScore: 780,
            loanHistory: 5,
            repaymentRate: 100
          },
          amount: 15000,
          interest_rate: 14.5,
          duration_months: 24,
          risk_level: 'low',
          status: 'pending',
          purpose: 'Business Expansion',
          monthlyPayment: 1250.50
        },
        // Add more opportunities
      ]
    },
    admin: {
      stats: {
        totalUsers: 1250,
        activeBorrowers: 450,
        activeLenders: 180,
        totalLoansValue: 2500000,
        platformRevenue: 125000,
        pendingApprovals: 15
      },
      systemHealth: {
        repaymentRate: 95.8,
        defaultRate: 2.1,
        averageProcessingTime: '2.5 days',
        systemUtilization: 78.5
      }
    }
  };