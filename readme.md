# Floretta Project

## Project Overview

This project is a full-stack web application for an e-commerce or product showcase site focused on perfumes and freshners. It consists of:

- **Backend:** A Laravel PHP API that manages data, serves product and homepage information, and handles database operations.
- **Frontend:** A React single-page application (SPA) that consumes the backend API to display products, homepage content, and interactive UI components.

## Project Structure

```
floretta_india/
├── backend/          # Laravel backend API and server
│   ├── app/          # Application code (controllers, models)
│   ├── config/       # Configuration files
│   ├── database/     # Migrations and seeders
│   ├── public/       # Public web root (entry point)
│   ├── resources/    # Views and frontend assets for backend
│   ├── routes/       # API and web routes
│   └── ...           # Other Laravel standard folders and files
├── frontend/         # React frontend application
│   ├── public/       # Static assets and index.html
│   ├── src/          # React components, pages, styles, and assets
│   ├── package.json  # Frontend dependencies and scripts
│   └── ...           # Other React app files
├── readme.md         # This file
└── ...
```

## Setting Up the Project Locally

### Prerequisites

- PHP >= 7.4 (or compatible version for Laravel)
- Composer (PHP dependency manager)
- MySQL or compatible database
- Node.js and npm (for frontend)

### Backend Setup

1. Navigate to the `backend` directory:

   ```bash
   cd backend
   ```

2. Install PHP dependencies using Composer:

   ```bash
   composer install
   ```

3. Install additional required packages:

   ```bash
   # Install Laravel Socialite (for Google OAuth authentication)
   composer require laravel/socialite

   # Install Laravel DomPDF (for PDF invoice generation)
   composer require barryvdh/laravel-dompdf --ignore-platform-reqs
   ```

   **Note:** The `--ignore-platform-reqs` flag is used for DomPDF to bypass platform version checks if needed.

4. Publish DomPDF configuration (optional):

   ```bash
   php artisan vendor:publish --provider="Barryvdh\DomPDF\ServiceProvider"
   ```

5. Copy the example environment file and configure your environment variables:

   ```bash
   cp .env.example .env
   ```

6. Update the `.env` file with your database credentials and other settings:

   Required environment variables:
   ```env
   # Database
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=floretta
   DB_USERNAME=root
   DB_PASSWORD=

   # Mail Configuration (Hostinger SMTP)
   MAIL_MAILER=smtp
   MAIL_HOST=smtp.hostinger.com
   MAIL_PORT=587
   MAIL_USERNAME=your-email@yourdomain.com
   MAIL_PASSWORD=your-password
   MAIL_ENCRYPTION=tls
   MAIL_FROM_ADDRESS=your-email@yourdomain.com
   MAIL_FROM_NAME="Floretta India"

   # Google OAuth (for social login)
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   GOOGLE_CLIENT_REDIRECT=http://localhost:8000/api/auth/google/callback

   # Razorpay Payment Gateway
   RAZORPAY_KEY=your-razorpay-key
   RAZORPAY_SECRET=your-razorpay-secret

   # JWT Secret (for authentication)
   JWT_SECRET=your-jwt-secret
   ```

7. Generate the application key:

   ```bash
   php artisan key:generate
   ```

8. Run database migrations and seeders:

   ```bash
   php artisan migrate --seed
   ```

9. Clear configuration and cache:

   ```bash
   php artisan config:clear
   php artisan cache:clear
   ```

10. Start the Laravel development server:

   ```bash
   php artisan serve
   ```

   The backend API will be available at `http://localhost:8000`.

### Frontend Setup

1. Navigate to the `frontend` directory:

   ```bash
   cd frontend
   ```

2. Install Node.js dependencies:

   ```bash
   npm install
   ```

3. Start the React development server:

   ```bash
   npm start
   ```

   The frontend app will be available at `http://localhost:3000`.

## Key Features

### User Features
- **Product Catalog:** Browse perfumes, fresheners, and hotel amenities
- **User Authentication:** Register, login, and Google OAuth integration
- **Profile Management:** Update profile with GST number support
- **Shopping Cart:** Add/remove items, update quantities
- **Wishlist:** Save favorite products
- **Checkout:** Secure payment via Razorpay
- **Order History:** View past orders and download invoices
- **Forget Password:** OTP-based password reset via email

### Business Features
- **GST Support:** Optional GST invoice generation for B2B customers
- **Automated Invoicing:** Email invoices with PDF attachments on order completion
- **Admin Dashboard:** Manage orders, view analytics, add admin users
- **Role-Based Access:** Superadmin and admin roles with different permissions

### Technical Features
- **RESTful API:** Laravel backend with JWT authentication
- **Email System:** SMTP integration with Hostinger
- **PDF Generation:** DomPDF for professional invoice PDFs
- **Social Login:** Google OAuth via Laravel Socialite
- **Payment Gateway:** Razorpay integration
- **Responsive Design:** Mobile-friendly frontend

## Package Dependencies

### Backend (Laravel)
- **laravel/socialite** - Google OAuth authentication
- **barryvdh/laravel-dompdf** - PDF invoice generation
- **tymon/jwt-auth** - JWT authentication
- **razorpay/razorpay** - Payment gateway integration

### Frontend (React)
- **react-router-dom** - Client-side routing
- **axios** - HTTP client for API calls
- **react** - UI framework

## Additional Notes

- Ensure the backend server is running before starting the frontend to allow API calls to succeed.
- The frontend fetches data from the backend API endpoints such as `/api/homepage`, `/api/products`, etc.
- For production deployment, build the frontend using `npm run build` and configure the backend to serve the built assets or deploy separately.

## Troubleshooting

- If you encounter permission issues with storage or cache folders in Laravel, run:

  ```bash
  php artisan cache:clear
  php artisan config:clear
  php artisan route:clear
  php artisan view:clear
  ```

- Make sure your database is running and accessible with the credentials in `.env`.

---

This README provides the basic steps to get the project up and running locally. For more detailed information, refer to the backend and frontend documentation folders if available.
