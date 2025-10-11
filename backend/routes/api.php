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
use Faker\Provider\ar_EG\Payment;

/*
|--------------------------------------------------------------------------
| Public Routes (No Authentication Required)
|--------------------------------------------------------------------------
*/

// 🌐 User Auth
Route::post('/register', [UserController::class, 'register']);
Route::post('/login', [UserController::class, 'login']);

// 🌐 Google OAuth
Route::get('/auth/google/redirect', [GoogleController::class, 'redirect']);
Route::get('/auth/google/callback', [GoogleController::class, 'callback']);

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

// 🌐 Contact Us
Route::post('/contact', [HotelAmenitiesController::class, 'submitContactForm']);

// 🌐 Live Perfumery
Route::get('/liveperfume', [LivePerfumeController::class, 'index']);
Route::get('/how-it-works', [LivePerfumeController::class, 'index']);
Route::post('/bookings', [LivePerfumeController::class, 'submitBooking']);

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
Route::prefix('admin')->group(function () {
    Route::post('/login', [AdminAuthController::class, 'login']);
});

Route::prefix('admin')->group(function () {
    Route::post('/logout', [AdminAuthController::class, 'logout']);
});

