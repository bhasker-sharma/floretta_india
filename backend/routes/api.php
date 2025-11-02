<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\LivePerfumeController;
use App\Http\Controllers\HotelAmenitiesController;
use App\Http\Controllers\AdminAuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\Auth\GoogleController;
use App\Http\Controllers\PasswordResetController;
use Faker\Provider\ar_EG\Payment;

/*
|--------------------------------------------------------------------------
| Public Routes (No Authentication Required)
|--------------------------------------------------------------------------
*/

// 🌐 User Auth (with rate limiting to prevent brute force attacks)
Route::middleware('throttle:5,1')->group(function () {
    Route::post('/register', [UserController::class, 'register']);
    Route::post('/verify-email-otp', [UserController::class, 'verifyOtp']);
    Route::post('/resend-otp', [UserController::class, 'resendOtp']);
    Route::post('/login', [UserController::class, 'login']);
});

// 🌐 Google OAuth (with rate limiting to prevent abuse)
Route::middleware('throttle:10,1')->group(function () {
    Route::get('/auth/google/redirect', [GoogleController::class, 'redirect']);
    Route::get('/auth/google/callback', [GoogleController::class, 'callback']);
    Route::post('/auth/google/exchange-code', [GoogleController::class, 'exchangeCode']);
});

// 🔑 Password Reset Routes (with rate limiting to prevent abuse)
Route::middleware('throttle:5,1')->group(function () {
    Route::post('/forgot-password', [PasswordResetController::class, 'sendOTP']);
    Route::post('/verify-otp', [PasswordResetController::class, 'verifyOTP']);
    Route::post('/reset-password', [PasswordResetController::class, 'resetPassword']);
});

// 🧍‍♂️ Public User Access
Route::get('/users', [UserController::class, 'index']);
Route::get('/users/{id}', [UserController::class, 'show']);

// 🌐 Homepage
Route::get('/homepage', [HomeController::class, 'index']);

// 🌐 Product Listing & Detail
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show']);

// 🌐 Freshners & Mist
Route::get('/freshners-mist-all', [ProductController::class, 'allFreshnerAndMist']);
Route::get('/freshners-mist-all/{id}', [ProductController::class, 'showFreshner']);

// 🌐 Hotel Amenities
Route::get('/room-freshners', [HotelAmenitiesController::class, 'index']);

// 🌐 Contact Us (with rate limiting to prevent form spam)
Route::middleware('throttle:3,1')->post('/contact', [HotelAmenitiesController::class, 'submitContactForm']);

// 🌐 Live Perfumery
Route::get('/liveperfume', [LivePerfumeController::class, 'index']);
Route::get('/how-it-works', [LivePerfumeController::class, 'index']);

// 🌐 Bookings (with rate limiting to prevent form spam)
Route::middleware('throttle:3,1')->post('/bookings', [LivePerfumeController::class, 'submitBooking']);

/*
|--------------------------------------------------------------------------
| Authenticated Routes (JWT Protected via `auth:api`)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:api')->group(function () {

    // ✅ Profile Routes
    Route::get('/me', [UserController::class, 'profile']);
    Route::post('/update-profile', [UserController::class, 'update']);

    // ✅ Wishlist
    Route::post('/wishlist', [UserController::class, 'addToWishlist']);
    Route::delete('/wishlist/{product_id}', [UserController::class, 'removeFromWishlist']);
   Route::get('/wishlist', [UserController::class, 'wishlist']);
 // Add this if missing

    // ✅ Token Verification
    Route::get('/check-user', function (Request $request) {
        return response()->json(['user' => $request->user()]);
    });

    // 🛒 Cart Routes
    Route::get('/cart', [CartController::class, 'index']);
    Route::post('/cart', [CartController::class, 'store']);
    Route::put('/cart/{id}', [CartController::class, 'update']);
    Route::delete('/cart/clear', [CartController::class, 'clearCart']);
    Route::delete('/cart/{id}', [CartController::class, 'destroy']);

    //  ===payment ======
    Route::post('/razorpay/create-order', [PaymentController::class, 'createOrder']);
    Route::post('/razorpay/verify', [PaymentController::class, 'verifyPayment']);
    Route::get('/my-orders', [PaymentController::class, 'myOrders']);
    // routes/api.php
    Route::middleware('auth:api')->post('/create-order', [PaymentController::class, 'createOrder']);


    // 🔐 Logout (User)
    Route::post('/logout', [UserController::class, 'logout']);

    // 🔐 Admin Protected Routes
    Route::prefix('admin')->group(function () {
        Route::post('/logout', [AdminAuthController::class, 'logout']);
        Route::get('/me', [AdminAuthController::class, 'me']);
    });
});


/*
|--------------------------------------------------------------------------
| Admin Auth Routes (Public)
|--------------------------------------------------------------------------
*/
Route::prefix('admin')->middleware('throttle:5,1')->group(function () {
    Route::post('/login', [AdminAuthController::class, 'login']);
});

// 🔐 Admin Protected Routes (JWT auth:admin middleware)
Route::prefix('admin')->middleware('auth:admin')->group(function () {
    Route::post('/logout', [AdminAuthController::class, 'logout']);
    Route::get('/me', [AdminAuthController::class, 'me']);
    Route::get('/orders', [AdminAuthController::class, 'getAllOrders']);
    Route::post('/create-admin', [AdminAuthController::class, 'createAdmin']);
    Route::get('/all-admins', [AdminAuthController::class, 'getAllAdmins']);
    Route::delete('/delete-admin/{id}', [AdminAuthController::class, 'deleteAdmin']);
    Route::get('/all-users', [AdminAuthController::class, 'getAllUsers']);

    // Product management
    Route::get('/products', [ProductController::class, 'adminGetAllProducts']);
    Route::post('/products', [ProductController::class, 'adminCreateProduct']);
    Route::delete('/products/{id}', [ProductController::class, 'adminDeleteProduct']);
});

