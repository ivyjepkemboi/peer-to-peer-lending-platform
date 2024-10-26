import { useState } from 'react';

const InvestmentForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    amount: '',
    interest_rate: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);  // Callback to submit the form data
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label>Investment Amount</label>
        <input
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
      </div>
      <div>
        <label>Desired Interest Rate (%)</label>
        <input
          type="number"
          name="interest_rate"
          value={formData.interest_rate}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
      </div>
      <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg">
        Submit Investment
      </button>
    </form>
  );
};

export default InvestmentForm;
