import { useState } from 'react';

const LoanRequestForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    amount: '',
    interest_rate: '',
    duration_months: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
            Loan Amount
          </label>
          <input
            id="amount"
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="interest_rate" className="block text-sm font-medium text-gray-700">
            Interest Rate (%)
          </label>
          <input
            id="interest_rate"
            type="number"
            name="interest_rate"
            value={formData.interest_rate}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="duration_months" className="block text-sm font-medium text-gray-700">
            Duration (Months)
          </label>
          <input
            id="duration_months"
            type="number"
            name="duration_months"
            value={formData.duration_months}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>

        <button 
          type="submit" 
          className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Submit Loan Request
        </button>
      </form>
    </div>
  );
};

export default LoanRequestForm;