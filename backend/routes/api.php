<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\HowItWorksController;
use App\Http\Controllers\AdminAuthController;

Route::get('/how-it-works', [HowItWorksController::class, 'index']);

Route::get('/homepage', [HomeController::class, 'index']);
Route::get('/products', [ProductController::class, 'index']);                 // List all products
Route::get('/products/{id}', [ProductController::class, 'show']);             // Get single product by id

Route::get('/freshners-mist-all', [ProductController::class, 'allFreshnerAndMist']); // List all freshners/mists
Route::get('/freshners-mist-all/{id}', [ProductController::class, 'showFreshner']);

// Admin Authentication Routes
Route::prefix('admin')->group(function () {
    Route::post('/login', [AdminAuthController::class, 'login']);
    Route::post('/logout', [AdminAuthController::class, 'logout']);
    Route::get('/me', [AdminAuthController::class, 'me']);
});
