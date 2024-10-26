// src/components/loans/LoanCard.js
import React from 'react';
import { DollarSign, Calendar, User } from 'lucide-react';

export const LoanCard = ({ loan }) => (
  <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-300">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-indigo-50 rounded-full">
          <DollarSign className="w-6 h-6 text-indigo-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Loan #{loan.id}</h3>
          <p className="text-sm text-gray-500">{loan.purpose}</p>
        </div>
      </div>
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
        getLoanStatusColor(loan.status)
      }`}>
        {loan.status}
      </span>
    </div>
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">Amount</span>
        <span className="text-sm font-medium text-gray-900">${loan.amount.toLocaleString()}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">Interest Rate</span>
        <span className="text-sm font-medium text-gray-900">{loan.interest_rate}%</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">Duration</span>
        <span className="text-sm font-medium text-gray-900">{loan.duration_months} months</span>
      </div>
    </div>
  </div>
);

// src/components/loans/LoanApplicationForm.js
import React, { useState } from 'react';

export const LoanApplicationForm = ({ onSubmit, initialValues = {} }) => {
  const [formData, setFormData] = useState({
    amount: initialValues.amount || '',
    duration_months: initialValues.duration_months || '',
    interest_rate: initialValues.interest_rate || '',
    purpose: initialValues.purpose || '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Loan Amount</label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <DollarSign className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            className="pl-10 block w-full rounded-md border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="0.00"
          />
        </div>
      </div>
      {/* Add other form fields */}
    </form>
  );
};

// src/components/loans/LoanRepaymentSchedule.js
export const LoanRepaymentSchedule = ({ loan }) => {
  const calculateSchedule = () => {
    // Add calculation logic here
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        {/* Add table content */}
      </table>
    </div>
  );
};