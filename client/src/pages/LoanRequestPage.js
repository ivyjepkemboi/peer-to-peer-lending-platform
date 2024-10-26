import React, { useState } from 'react';
import LoanRequestForm from '../components/LoanRequestForm';
import { useNavigate } from 'react-router-dom';

const LoanRequestPage = () => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleFormSubmit = async (formData) => {
    setError('');  // Clear previous errors
    setSuccess('');  // Clear previous success message

    try {
      // Get the token from localStorage (or however you store it)
      const token = localStorage.getItem('token');

      // Make the POST request to the backend
      const response = await fetch('http://localhost:5000/loans', {  // Adjust API endpoint as needed
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`  // Include the JWT token
        },
        body: JSON.stringify(formData)
      });

      // Parse the response
      const data = await response.json();

      if (response.ok) {
        // If the request is successful, show a success message
        setSuccess('Loan request created successfully! Redirecting...');
        setTimeout(() => navigate('/dashboard'), 2000);  // Redirect to dashboard after 2 seconds
      } else {
        // If there's an error, show the error message
        setError(data.message || 'Something went wrong, please try again.');
      }
    } catch (err) {
      setError('Network error, please try again later.');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Request a Loan</h1>

      {/* Show success or error messages */}
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">{success}</p>}

      {/* Render the Loan Request Form */}
      <LoanRequestForm onSubmit={handleFormSubmit} />
    </div>
  );
};

export default LoanRequestPage;
