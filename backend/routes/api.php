<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\LivePerfumeController;
use App\Http\Controllers\HotelAmenitiesController;
use App\Http\Controllers\AdminAuthController;
use App\Http\Controllers\UserController;

/*
|--------------------------------------------------------------------------
| Public Routes (No Authentication Required)
|--------------------------------------------------------------------------
*/

// 🧍‍♂️ Users (public listing)
Route::get('/users', [UserController::class, 'index']);
Route::get('/users/{id}', [UserController::class, 'show']);

// 🌐 User Auth
Route::post('/register', [UserController::class, 'register']);
Route::post('/login', [UserController::class, 'login']);

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
| Authenticated Routes (Protected by JWT)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:api')->group(function () {

    // 🧍‍♂️ Authenticated user profile
    Route::get('/me', [UserController::class, 'profile']);

    // ✅ Token verification (used by frontend to verify session)
    Route::get('/check-user', function (Request $request) {
        return response()->json(['user' => $request->user()]);
    });

    // 🛒 Cart routes
    Route::get('/cart', [CartController::class, 'index']);
    Route::post('/cart', [CartController::class, 'store']);
    Route::put('/cart/{id}', [CartController::class, 'update']);
    Route::delete('/cart/{id}', [CartController::class, 'destroy']);

    // 🔐 Logout (user)
    Route::post('/logout', [UserController::class, 'logout']);

    // 🔐 Admin sub-routes
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
    // Add JWT-based admin login route here when ready
    // Route::post('/login', [AdminAuthController::class, 'login']);
});
