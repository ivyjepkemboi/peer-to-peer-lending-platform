# JengaFunds - P2P Lending Platform

## Overview
JengaFunds is a comprehensive Peer-to-Peer lending platform that connects borrowers with lenders, streamlining the loan process while ensuring security and transparency. Built with React for the frontend and Flask for the backend, this platform offers a modern, user-friendly interface for managing loans, investments, and financial transactions.

## Features

### For Borrowers
- 📝 Loan Application Portal
  - Interactive loan calculator
  - Customizable loan terms
  - Document upload system
  - Application tracking

- 📊 Dashboard
  - Active loan monitoring
  - Payment schedules
  - Credit score tracking
  - Repayment history

- 💰 Payment Management
  - M-PESA integration
  - Automated payment reminders
  - Payment scheduling
  - Transaction history

### For Lenders
- 💼 Investment Portal
  - Risk assessment tools
  - Portfolio management
  - Investment opportunities
  - Return on investment tracking

- 📈 Analytics Dashboard
  - Investment performance metrics
  - Risk distribution analysis
  - Monthly returns tracking
  - Borrower creditworthiness assessment

### For Admins
- 👥 User Management
  - User verification
  - Account management
  - Role assignment
  - Activity monitoring

- 🔍 Loan Oversight
  - Loan approval system
  - Risk assessment
  - Default management
  - System statistics

## Technical Stack

### Frontend
- React.js
- Tailwind CSS
- Recharts for data visualization
- Lucide React for icons
- React Router for navigation

### Backend (Integration Ready)
- Flask
- JWT Authentication
- SQLAlchemy
- M-PESA API Integration

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/jengafunds.git
cd jengafunds
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

## Environment Setup
Create a `.env` file in the root directory:
```plaintext
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_MPESA_API_KEY=your_mpesa_api_key
```

## Project Structure
```
src/
├── components/
│   ├── dashboard/
│   │   ├── StatCard.js
│   │   ├── LoanCalculator.js
│   │   └── ActivityFeed.js
│   ├── loans/
│   │   ├── LoanCard.js
│   │   └── LoanForm.js
│   ├── profile/
│   │   └── ProfileCard.js
│   ├── messaging/
│   │   └── ChatInterface.js
│   └── shared/
│       └── LoadingSpinner.js
├── pages/
│   ├── Dashboard.js
│   ├── Loans.js
│   ├── Profile.js
│   └── Settings.js
├── layouts/
│   └── DashboardLayout.js
├── utils/
│   └── helpers.js
└── App.js
```

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App

## API Integration
The frontend is designed to integrate with a Flask backend. All API endpoints are prepared for seamless integration:

```javascript
// Example API endpoints
/api/auth/login
/api/auth/register
/api/loans/create
/api/loans/approve
/api/payments/process
```

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Security Features
- JWT Authentication
- Role-based access control
- Secure payment processing
- Data encryption
- Input validation
- XSS protection

## Testing
Run the test suite:
```bash
npm test
```

## Deployment
Build the production-ready application:
```bash
npm run build
```

The build folder is ready to be deployed to your hosting platform of choice.

## License
This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Acknowledgments
- [Create React App](https://github.com/facebook/create-react-app)
- [Tailwind CSS](https://tailwindcss.com/)
- [Recharts](https://recharts.org/)
- [Lucide React](https://lucide.dev/)

## Support
For support, email support@jengafunds.com or join our Slack channel.

## Roadmap
- [ ] Mobile application development
- [ ] Advanced analytics dashboard
- [ ] Automated risk assessment
- [ ] Blockchain integration
- [ ] AI-powered credit scoring

## Status
Project is: _in development_

---

For more information, please refer to the [Documentation](docs/README.md)