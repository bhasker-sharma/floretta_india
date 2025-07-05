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

// 🌐 User Registration & Login
Route::post('/register', [UserController::class, 'register']);
Route::post('/login', [UserController::class, 'login']);

// 🌐 Home & General Product Routes
Route::get('/homepage', [HomeController::class, 'index']);
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show']);
Route::get('/freshners-mist-all', [ProductController::class, 'allFreshnerAndMist']);
Route::get('/freshners-mist-all/{id}', [ProductController::class, 'showFreshner']);
Route::get('/room-freshners', [HotelAmenitiesController::class, 'index']);
Route::post('/contact', [HotelAmenitiesController::class, 'submitContactForm']);
Route::get('/liveperfume', [LivePerfumeController::class, 'index']);
Route::get('/how-it-works', [LivePerfumeController::class, 'index']);
Route::post('/bookings', [LivePerfumeController::class, 'submitBooking']);

/*
|--------------------------------------------------------------------------
| Authenticated Routes (Protected by Sanctum)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {

    // 👤 Authenticated user profile
    Route::get('/me', [UserController::class, 'profile']);

    // ✅ Session Check
    Route::get('/check-user', function (Request $request) {
        return response()->json(['user' => $request->user()]);
    });

    // 🛒 Cart routes
    Route::get('/cart', [CartController::class, 'index']);
    Route::post('/cart', [CartController::class, 'store']);
    Route::put('/cart/{id}', [CartController::class, 'update']);
    Route::delete('/cart/{id}', [CartController::class, 'destroy']);

    // 🔐 Logout (User)
    Route::post('/logout', function (Request $request) {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return response()->json(['message' => 'User logged out']);
    });

    // 🔐 Admin Authenticated Sub-Routes
    Route::prefix('admin')->group(function () {
        Route::post('/logout', [AdminAuthController::class, 'logout']);
        Route::get('/me', [AdminAuthController::class, 'me']);
    });
});

/*
|--------------------------------------------------------------------------
| Admin Public Auth Routes (if needed)
|--------------------------------------------------------------------------
*/
// Route::prefix('admin')->post('/login', [AdminAuthController::class, 'login']);
