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

3. Copy the example environment file and configure your environment variables:

   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your database credentials and other settings.

5. Generate the application key:

   ```bash
   php artisan key:generate
   ```

6. Run database migrations and seeders:

   ```bash
   php artisan migrate --seed
   ```

7. Start the Laravel development server:

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
