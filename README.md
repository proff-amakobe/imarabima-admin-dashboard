# ImaraBima Admin Dashboard

A modern, responsive admin dashboard for the ImaraBima Insurance Platform built with React, TypeScript, and Tailwind CSS.

## Features

- 🎨 **Modern UI/UX** - Clean, professional design with Tailwind CSS
- 📱 **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- 🔐 **Authentication** - Secure login with JWT tokens
- 📊 **Dashboard Analytics** - Real-time statistics and charts
- 👥 **User Management** - Manage users, roles, and permissions
- 📦 **Product Management** - Configure insurance products
- 📋 **Policy Management** - Track and manage insurance policies
- 🔄 **Real-time Updates** - Live data updates and notifications
- 🎯 **Role-based Access** - Different views for admin, agents, and customers

## Tech Stack

- **Frontend**: React 18, TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Charts**: Recharts
- **Notifications**: React Hot Toast
- **Build Tool**: Vite

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- ImaraBima API running (backend)

### Installation

1. **Navigate to the admin dashboard directory**:
   ```bash
   cd ui/admin-dashboard
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the admin dashboard directory:
   ```env
   VITE_API_URL=http://localhost:3000
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser**:
   Navigate to `http://localhost:3001`

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── layout/         # Layout components
│   └── ui/             # Basic UI components
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── services/           # API services
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── assets/             # Static assets
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Demo Credentials

Use these credentials to test the admin dashboard:

### Admin Account
- **Phone**: +254700123458
- **Password**: admin123
- **Role**: Admin (Full access)

### Agent Account
- **Phone**: +254700123459
- **Password**: agent123
- **Role**: Agent (Limited access)

### Customer Account
- **Phone**: +254700123456
- **Password**: password123
- **Role**: Customer (View only)

## Features Overview

### Dashboard
- Real-time statistics
- Revenue overview
- Policy status distribution
- Recent activity feed
- Growth metrics

### User Management
- View all users
- Create new users
- Edit user details
- Toggle user status
- Role management

### Product Management
- View all products
- Create new products
- Edit product details
- Toggle product status
- Product categories

### Policy Management
- View all policies
- Create new policies
- Edit policy details
- Update policy status
- Beneficiary management

## API Integration

The dashboard connects to the ImaraBima API endpoints:

- **Authentication**: `/auth/login`, `/auth/logout`, `/auth/verify`
- **Users**: `/users` (CRUD operations)
- **Products**: `/products` (CRUD operations)
- **Policies**: `/policies` (CRUD operations)
- **Dashboard**: `/dashboard/stats`, `/dashboard/revenue`, `/dashboard/policy-status`

## Customization

### Styling
The dashboard uses Tailwind CSS for styling. You can customize the theme by modifying:
- `tailwind.config.js` - Theme configuration
- `src/index.css` - Global styles
- Component-specific classes

### Components
All components are modular and reusable. You can:
- Modify existing components in `src/components/`
- Create new components following the same patterns
- Extend functionality by adding new pages

### API Configuration
Update the API configuration in:
- `src/services/api.ts` - API endpoints and configuration
- `.env` file - Environment variables

## Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Deploy: `vercel --prod`

### Deploy to Netlify
1. Build the project: `npm run build`
2. Upload the `dist` folder to Netlify

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Support

For support and questions:
- Check the main project README
- Review the API documentation
- Create an issue in the repository

## License

This project is part of the ImaraBima Insurance Platform and follows the same license terms.
