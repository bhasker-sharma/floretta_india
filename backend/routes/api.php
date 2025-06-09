<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\LivePerfumeController;
use App\Http\Controllers\HotelAmenitiesController; // ✅ Already imported

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
