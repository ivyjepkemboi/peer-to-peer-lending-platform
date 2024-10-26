import React from 'react';
import InvestmentForm from '../components/InvestmentForm';

const InvestmentPage = () => {
  const handleFormSubmit = (formData) => {
    // Handle investment form submission logic
    console.log('Investment form submitted:', formData);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Make an Investment</h1>
      <InvestmentForm onSubmit={handleFormSubmit} />
    </div>
  );
};

export default InvestmentPage;
