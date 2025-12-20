# 🎯 Schedulo - Appointment Management System

<div align="center">

![Schedulo](https://img.shields.io/badge/Schedulo-AMS-ff69b4?style=for-the-badge)
![Django](https://img.shields.io/badge/Django-5.2.1-092E20?style=for-the-badge&logo=django)
![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**A comprehensive salon and spa appointment management system with multi-outlet support, role-based access control, and real-time scheduling.**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [Usage](#-usage) • [API Docs](#-api-documentation) • [Contributing](#-contributing)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [User Roles](#-user-roles)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**Schedulo** is a full-stack appointment management system designed specifically for salons, spas, and beauty service businesses. It provides a complete solution for managing multiple outlets, services, packages, staff, and customer appointments with an intuitive interface and powerful backend.

### Key Highlights

- 🏢 **Multi-Outlet Management** - Manage multiple salon/spa locations from a single platform
- 👥 **Role-Based Access Control** - Admin, Manager, Employee, and Customer roles with specific permissions
- 📅 **Real-Time Scheduling** - Book, edit, and track appointments with conflict detection
- 💰 **Payment Tracking** - Complete payment management with multiple payment methods
- 📊 **Analytics Dashboard** - Visual insights into revenue, appointments, and performance metrics
- 🎨 **Modern UI/UX** - Beautiful gradient-based design with responsive layouts

---

## ✨ Features

### 🔐 Authentication & Authorization
- Secure user registration and login with JWT tokens
- OTP verification for enhanced security
- Role-based access control (Admin, Manager, Employee, Customer)
- Session management with automatic logout warnings

### 🏢 Outlet Management
- Create and manage multiple outlet locations
- Assign managers to specific outlets
- Track outlet-specific services and packages
- Manage outlet hours and contact information

### 💇 Service & Package Management
- Create, edit, and delete services with pricing and duration
- Bundle services into packages with discounted rates
- Category-based organization
- Outlet-specific service availability
- Image uploads for services and packages

### 📅 Appointment Scheduling
- Real-time appointment booking with availability checking
- Appointment status tracking (Pending, Confirmed, In Progress, Completed, Cancelled)
- Assign employees to appointments
- Support for both individual services and package bookings
- Edit and reschedule appointments
- Appointment history tracking

### 💳 Payment Processing
- Multiple payment methods (Cash, Credit Card, Debit Card, UPI, Online Transfer)
- Payment status tracking (Pending, Completed, Failed, Refunded)
- Transaction reference management
- Payment history and receipts

### 👨‍💼 Staff Management
- Employee registration and management
- Manager assignment to outlets
- Employee work schedule tracking
- Performance analytics

### 📊 Dashboard & Reports
- Revenue analytics with weekly/monthly trends
- Appointment statistics and visualizations
- Service popularity metrics
- Outlet performance comparison
- Customer insights and retention data

### 🔍 Search & Filter
- Advanced search functionality for appointments
- Filter by date, status, service, employee
- Quick access to customer information

---

## 🛠 Tech Stack

### Frontend
- **React 18.3.1** - UI library
- **Vite** - Build tool and dev server
- **React Router 7.1.1** - Client-side routing
- **Axios** - HTTP client for API requests
- **Recharts** - Data visualization and charts
- **Lucide React** - Modern icon library
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/ui** - Re-usable component library
- **Material-UI (MUI)** - Date pickers and additional components
- **JWT Decode** - Token authentication handling

### Backend
- **Django 5.2.1** - Web framework
- **Django REST Framework 3.16.0** - API development
- **PostgreSQL** - Database (via psycopg2)
- **Django CORS Headers** - Cross-origin resource sharing
- **Pillow** - Image processing
- **Python Dotenv** - Environment variable management

### Development Tools
- **ESLint** - Code linting
- **Vite** - Fast development server with HMR
- **Git** - Version control

---

## 🏗 Architecture

```
Django-ams/
├── ams/                          # Frontend React Application
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   │   ├── ui/              # Shadcn UI components
│   │   │   ├── AppoinmentForm.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── ...
│   │   ├── Pages/               # Page components
│   │   │   ├── Dashboard.jsx
│   │   │   ├── AppoinmentPage.jsx
│   │   │   ├── ServiceMaster.jsx
│   │   │   ├── PackageMaster.jsx
│   │   │   ├── OutletManagement.jsx
│   │   │   └── ...
│   │   ├── Data/                # Static data and constants
│   │   ├── lib/                 # Utility functions
│   │   ├── App.jsx              # Main app component
│   │   └── main.jsx             # Entry point
│   ├── public/                  # Static assets
│   ├── Dockerfile               # Frontend containerization
│   └── package.json             # Dependencies
│
├── django_backend/              # Backend Django Application
│   ├── schedulo/                # Main app
│   │   ├── models.py            # Database models
│   │   ├── serializers.py       # DRF serializers
│   │   ├── views.py             # API views
│   │   ├── urls.py              # URL routing
│   │   └── admin.py             # Admin configuration
│   ├── django_backend/          # Project settings
│   │   ├── settings.py          # Django settings
│   │   ├── urls.py              # Root URL configuration
│   │   └── wsgi.py              # WSGI configuration
│   ├── manage.py                # Django management script
│   └── requirements.txt         # Python dependencies
│
└── README.md                    # This file
```

---

## 🚀 Installation

### Prerequisites

- **Node.js** (v16 or higher)
- **Python** (v3.10 or higher)
- **PostgreSQL** (v12 or higher)
- **Git**

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Django-ams
   ```

2. **Navigate to backend directory**
   ```bash
   cd django_backend
   ```

3. **Create virtual environment**
   ```bash
   python -m venv venv
   
   # Windows
   venv\Scripts\activate
   
   # Linux/Mac
   source venv/bin/activate
   ```

4. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

5. **Create `.env` file**
   ```bash
   # Create .env file in django_backend directory
   SECRET_KEY=your-secret-key-here
   DEBUG=True
   DATABASE_NAME=schedulo_db
   DATABASE_USER=postgres
   DATABASE_PASSWORD=your-password
   DATABASE_HOST=localhost
   DATABASE_PORT=5432
   ```

6. **Run migrations**
   ```bash
   python manage.py migrate
   ```

7. **Create superuser**
   ```bash
   python manage.py createsuperuser
   ```

8. **Start development server**
   ```bash
   python manage.py runserver
   ```

   Backend will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd ams
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env` file**
   ```bash
   # Create .env file in ams directory
   VITE_URL=http://localhost:8000
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

   Frontend will be available at `http://localhost:3000`

---

## ⚙️ Configuration

### Environment Variables

#### Backend (.env in django_backend/)
```env
SECRET_KEY=your-django-secret-key
DEBUG=True
DATABASE_NAME=schedulo_db
DATABASE_USER=postgres
DATABASE_PASSWORD=your-db-password
DATABASE_HOST=localhost
DATABASE_PORT=5432
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

#### Frontend (.env in ams/)
```env
VITE_URL=http://localhost:8000
```

### Database Setup

1. **Create PostgreSQL database**
   ```sql
   CREATE DATABASE schedulo_db;
   CREATE USER schedulo_user WITH PASSWORD 'your-password';
   GRANT ALL PRIVILEGES ON DATABASE schedulo_db TO schedulo_user;
   ```

2. **Update django_backend/settings.py** if needed
   ```python
   DATABASES = {
       'default': {
           'ENGINE': 'django.db.backends.postgresql',
           'NAME': os.getenv('DATABASE_NAME'),
           'USER': os.getenv('DATABASE_USER'),
           'PASSWORD': os.getenv('DATABASE_PASSWORD'),
           'HOST': os.getenv('DATABASE_HOST'),
           'PORT': os.getenv('DATABASE_PORT'),
       }
   }
   ```

---

## 📖 Usage

### For Administrators

1. **Login** with admin credentials
2. **Create Outlets** - Add your salon/spa locations
3. **Assign Managers** - Link managers to specific outlets
4. **Add Services** - Define services with pricing and duration
5. **Create Packages** - Bundle services for discounted offerings
6. **Manage Staff** - Add employees and assign to outlets
7. **Monitor Dashboard** - Track revenue, appointments, and performance

### For Managers

1. **Login** with manager credentials
2. **Access Outlet Management** - View assigned outlet
3. **Manage Services & Packages** - Update offerings for your outlet
4. **Handle Appointments** - Approve, assign staff, and manage bookings
5. **Track Payments** - Monitor payment status and process transactions

### For Employees

1. **Login** with employee credentials
2. **View Assigned Appointments** - Check your schedule
3. **Update Appointment Status** - Mark appointments as completed
4. **Access Customer Information** - View customer details and history

### For Customers

1. **Register/Login** - Create account or sign in
2. **Browse Services** - View available services and packages
3. **Book Appointments** - Select service, date, time, and outlet
4. **Track Bookings** - View upcoming and past appointments
5. **Make Payments** - Complete payment for services

---

## 📡 API Documentation

### Authentication Endpoints

```
POST   /api/auth/register/           # User registration
POST   /api/auth/login/              # User login
POST   /api/auth/logout/             # User logout
POST   /api/auth/verify-otp/         # OTP verification
GET    /api/auth/user-get-all/       # Get all users (Admin only)
```

### Outlet Endpoints

```
GET    /app/outlets/                 # Get all outlets
GET    /app/outlet/                  # Get outlet by ID
POST   /app/outlets/                 # Create outlet (Admin only)
PUT    /app/outlets/<id>/            # Update outlet (Admin only)
DELETE /app/outlets/<id>/            # Delete outlet (Admin only)
```

### Service Endpoints

```
GET    /app/services/                # Get all services
GET    /app/services/<id>/           # Get service by ID
POST   /app/services/                # Create service
PUT    /app/services/<id>/           # Update service
DELETE /app/services/<id>/           # Delete service
```

### Package Endpoints

```
GET    /app/packages/                # Get all packages
GET    /app/packages/<id>/           # Get package by ID
POST   /app/packages/                # Create package
PUT    /app/packages/<id>/           # Update package
DELETE /app/packages/<id>/           # Delete package
```

### Appointment Endpoints

```
GET    /app/appointment/             # Get all appointments
GET    /app/appointment/<id>/        # Get appointment by ID
POST   /app/appointment/             # Create appointment
PUT    /app/appointment/<id>/        # Update appointment
DELETE /app/appointment/<id>/        # Cancel appointment
```

### Payment Endpoints

```
GET    /app/payments/                # Get all payments
GET    /app/payments/<id>/           # Get payment by ID
POST   /app/payments/                # Create payment record
PUT    /app/payments/<id>/           # Update payment status
```

**Note**: All API requests require authentication via Token in the header:
```
Authorization: Token <your-token-here>
```

---

## 👥 User Roles

### 🔴 Admin
- Full system access
- Create and manage outlets
- Assign managers to outlets
- View all appointments and payments across all outlets
- Access to complete analytics and reports
- Manage all users (Employees, Managers, Customers)

### 🟡 Manager
- Manage assigned outlet only
- Create and manage services and packages for their outlet
- Handle appointments for their outlet
- Assign employees to appointments
- View outlet-specific analytics
- Cannot create outlets or assign other managers

### 🟢 Employee
- View assigned appointments
- Update appointment status
- Access customer information
- Limited to outlet where they're assigned

### 🔵 Customer
- Book appointments
- View own appointment history
- Manage personal profile
- Make payments for services

---

## 🖼 Screenshots

### Dashboard
Beautiful analytics dashboard with revenue trends, appointment statistics, and performance metrics.

### Outlet Management
Admin panel for managing multiple outlets with services and packages assignment.

### Appointment Booking
Intuitive booking interface with calendar view and real-time availability.

### Service Master
Comprehensive service management with pricing, duration, and categorization.

### Package Master
Package creation and management with service bundling options.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Open a Pull Request**

### Development Guidelines

- Follow PEP 8 style guide for Python code
- Use ESLint rules for JavaScript/React code
- Write meaningful commit messages
- Add comments for complex logic
- Update documentation for new features
- Test thoroughly before submitting PR

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Authors

- **Pranav Titambe** - *Full Stack Developer* - [Pranavlovescode](https://github.com/Pranavlovescode)

---

## 🙏 Acknowledgments

- **Django** - High-level Python web framework
- **React** - JavaScript library for building user interfaces
- **Shadcn/ui** - Beautiful and accessible component library
- **Recharts** - Composable charting library built on React components
- **Tailwind CSS** - Utility-first CSS framework

---

## 📞 Support

For support, email support@schedulo.com or join our Slack channel.

---

## 🔮 Roadmap

- [ ] SMS notifications for appointment reminders
- [ ] Email integration for booking confirmations
- [ ] Mobile app (React Native)
- [ ] Inventory management for salon products
- [ ] Customer loyalty program
- [ ] Online payment gateway integration
- [ ] Multi-language support
- [ ] Dark mode theme
- [ ] Calendar export (iCal, Google Calendar)
- [ ] Staff availability management
- [ ] Customer reviews and ratings

---

<div align="center">

**Made with ❤️ by the Schedulo Team**

⭐ Star us on GitHub — it motivates us a lot!

[Report Bug](https://github.com/Pranavlovescode/schedulo/issues) • [Request Feature](https://github.com/Pranavlovescode/schedulo/issues)

</div>
