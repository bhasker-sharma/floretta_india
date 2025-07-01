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


Route::get('/users', [UserController::class, 'index']);      // List all users
Route::get('/users/{id}', [UserController::class, 'show']);  // Get user by ID
Route::middleware('auth:sanctum')->get('/me', [UserController::class, 'profile']);



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
| Authenticated Routes (Protected by Sanctum)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {

    // 🛒 Cart routes
    Route::get('/cart', [CartController::class, 'index']);
    Route::post('/cart', [CartController::class, 'store']);
    Route::put('/cart/{id}', [CartController::class, 'update']);
    Route::delete('/cart/{id}', [CartController::class, 'destroy']);

    // Optional
    Route::get('/me', function (Request $request) {
        return response()->json($request->user());
    });

    Route::post('/logout', function (Request $request) {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return response()->json(['message' => 'User logged out']);
    });

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
    // Route::post('/login', [AdminAuthController::class, 'login']);
});
