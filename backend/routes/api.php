<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProductController;

use App\Http\Controllers\LivePerfumeController;
use App\Http\Controllers\HotelAmenitiesController; 
use App\Http\Controllers\HowItWorksController;
use App\Http\Controllers\AdminAuthController;

Route::get('/how-it-works', [HowItWorksController::class, 'index']);


// Existing routes
Route::get('/liveperfume', [LivePerfumeController::class, 'index']);
Route::get('/homepage', [HomeController::class, 'index']);
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show']);

Route::get('/freshners-mist-all', [ProductController::class, 'allFreshnerAndMist']);
Route::get('/freshners-mist-all/{id}', [ProductController::class, 'showFreshner']);

Route::post('/bookings', [LivePerfumeController::class, 'submitBooking']);

// ✅ Hotel Amenities routes
Route::get('/room-freshners', [HotelAmenitiesController::class, 'index']); // GET all room fresheners

Route::post('/contact', [HotelAmenitiesController::class, 'submitContactForm']); // ✅ POST contact form data
// Admin Authentication Routes
Route::prefix('admin')->group(function () {
    Route::post('/login', [AdminAuthController::class, 'login']);
    Route::post('/logout', [AdminAuthController::class, 'logout']);
    Route::get('/me', [AdminAuthController::class, 'me']);
});
