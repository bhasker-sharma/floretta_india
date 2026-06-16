<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\ProductController;
use App\Http\Controllers\API\CartController;
use App\Http\Controllers\API\OrderController;
use App\Http\Controllers\API\ReviewController;
use App\Http\Controllers\API\WishlistController;
use App\Http\Controllers\API\ContactController;
use App\Http\Controllers\API\BlogController;
use App\Http\Controllers\API\CareerController;
use App\Http\Controllers\API\PincodeController;
use App\Http\Controllers\Admin\AdminAuthController;
use App\Http\Controllers\Admin\AdminOrderController;
use App\Http\Controllers\Admin\AdminProductController;
use App\Http\Controllers\Admin\AdminReviewController;
use App\Http\Controllers\Admin\AdminUserController;
use App\Http\Controllers\Admin\AdminBlogController;
use App\Http\Controllers\Admin\AdminCareerController;
use App\Http\Controllers\Admin\AdminEnquiryController;
use App\Http\Controllers\Admin\AdminAnalyticsController;

// ─── Public ────────────────────────────────────────────────────────────────

Route::middleware('throttle:5,1')->group(function () {
    Route::post('/register',          [AuthController::class, 'register']);
    Route::post('/verify-email',      [AuthController::class, 'verifyEmail']);
    Route::post('/resend-otp',        [AuthController::class, 'resendOtp']);
    Route::post('/login',             [AuthController::class, 'login']);
    Route::post('/forgot-password',   [AuthController::class, 'forgotPassword']);
    Route::post('/verify-reset-otp',  [AuthController::class, 'verifyResetOtp']);
    Route::post('/reset-password',    [AuthController::class, 'resetPassword']);
});

Route::get('/products',         [ProductController::class, 'index']);
Route::get('/products/{slug}',  [ProductController::class, 'show']);

Route::get('/cart',             [CartController::class, 'index']);
Route::post('/cart',            [CartController::class, 'store']);
Route::put('/cart/{id}',        [CartController::class, 'update']);
Route::delete('/cart/{id}',     [CartController::class, 'destroy']);
Route::delete('/cart',          [CartController::class, 'clear']);

Route::get('/pincode/check',    [PincodeController::class, 'check']);

Route::get('/products/{slug}/reviews', [ReviewController::class, 'index']);

Route::get('/blogs',            [BlogController::class, 'index']);
Route::get('/blogs/{slug}',     [BlogController::class, 'show']);

Route::get('/careers',          [CareerController::class, 'index']);
Route::middleware('throttle:2,1')->post('/careers/{id}/apply', [CareerController::class, 'apply']);

Route::middleware('throttle:3,1')->post('/contact', [ContactController::class, 'store']);
Route::middleware('throttle:5,1')->post('/notify',  [ContactController::class, 'notify']);

Route::get('/homepage',         [ProductController::class, 'homepage']);

// ─── Authenticated (user) ──────────────────────────────────────────────────

Route::middleware('auth.jwt')->group(function () {
    Route::get('/me',                    [AuthController::class, 'me']);
    Route::post('/me/update',            [AuthController::class, 'update']);
    Route::post('/me/change-password',   [AuthController::class, 'changePassword']);
    Route::post('/logout',               [AuthController::class, 'logout']);

    Route::post('/me/addresses',         [AuthController::class, 'addAddress']);
    Route::put('/me/addresses/{id}',     [AuthController::class, 'updateAddress']);
    Route::delete('/me/addresses/{id}',  [AuthController::class, 'deleteAddress']);

    Route::post('/cart/merge',           [CartController::class, 'merge']);

    Route::post('/orders/initiate',      [OrderController::class, 'initiate']);
    Route::post('/orders/verify',        [OrderController::class, 'verifyPayment']);
    Route::post('/orders/cod',           [OrderController::class, 'cod']);
    Route::get('/orders',                [OrderController::class, 'index']);
    Route::get('/orders/{number}',       [OrderController::class, 'show']);

    Route::post('/products/{slug}/reviews',   [ReviewController::class, 'store']);
    Route::put('/reviews/{id}',               [ReviewController::class, 'update']);
    Route::delete('/reviews/{id}',            [ReviewController::class, 'destroy']);
    Route::get('/products/{slug}/my-review',  [ReviewController::class, 'myReview']);

    Route::get('/wishlist',              [WishlistController::class, 'index']);
    Route::post('/wishlist',             [WishlistController::class, 'store']);
    Route::delete('/wishlist/{id}',      [WishlistController::class, 'destroy']);
});

// ─── Admin auth ────────────────────────────────────────────────────────────

Route::middleware('throttle:5,1')->post('/admin/login',  [AdminAuthController::class, 'login']);

// ─── Admin protected ───────────────────────────────────────────────────────

Route::middleware('auth.admin')->prefix('admin')->group(function () {
    Route::post('/logout',   [AdminAuthController::class, 'logout']);
    Route::get('/me',        [AdminAuthController::class, 'me']);
    Route::post('/admins',   [AdminAuthController::class, 'createAdmin']);
    Route::put('/admins/{id}/permissions', [AdminAuthController::class, 'updatePermissions']);
    Route::delete('/admins/{id}',          [AdminAuthController::class, 'deleteAdmin']);

    Route::get('/orders',                        [AdminOrderController::class, 'index']);
    Route::get('/orders/new',                    [AdminOrderController::class, 'newOrders']);
    Route::get('/orders/{id}',                   [AdminOrderController::class, 'show']);
    Route::post('/orders/{id}/status',           [AdminOrderController::class, 'updateStatus']);
    Route::post('/orders/{id}/verify',           [AdminOrderController::class, 'verify']);

    Route::get('/products',                      [AdminProductController::class, 'index']);
    Route::post('/products',                     [AdminProductController::class, 'store']);
    Route::put('/products/{id}',                 [AdminProductController::class, 'update']);
    Route::post('/products/{id}/images',         [AdminProductController::class, 'uploadImages']);
    Route::delete('/products/{id}/images/{imgId}', [AdminProductController::class, 'deleteImage']);

    Route::get('/reviews',                       [AdminReviewController::class, 'index']);
    Route::put('/reviews/{id}/status',           [AdminReviewController::class, 'updateStatus']);
    Route::put('/reviews/{id}/featured',         [AdminReviewController::class, 'toggleFeatured']);
    Route::delete('/reviews/{id}',               [AdminReviewController::class, 'destroy']);

    Route::get('/enquiries',                     [AdminEnquiryController::class, 'index']);
    Route::put('/enquiries/{id}/status',         [AdminEnquiryController::class, 'updateStatus']);
    Route::get('/notify-list',                   [AdminEnquiryController::class, 'notifyList']);

    Route::get('/users',                         [AdminUserController::class, 'index']);

    Route::get('/blogs',                         [AdminBlogController::class, 'index']);
    Route::post('/blogs',                        [AdminBlogController::class, 'store']);
    Route::put('/blogs/{id}',                    [AdminBlogController::class, 'update']);
    Route::delete('/blogs/{id}',                 [AdminBlogController::class, 'destroy']);
    Route::post('/blogs/upload-image',           [AdminBlogController::class, 'uploadImage']);

    Route::get('/careers',                       [AdminCareerController::class, 'index']);
    Route::post('/careers',                      [AdminCareerController::class, 'store']);
    Route::put('/careers/{id}',                  [AdminCareerController::class, 'update']);
    Route::delete('/careers/{id}',               [AdminCareerController::class, 'destroy']);
    Route::get('/careers/applications',          [AdminCareerController::class, 'applications']);
    Route::put('/careers/applications/{id}/status', [AdminCareerController::class, 'updateApplicationStatus']);

    Route::get('/analytics/overview',           [AdminAnalyticsController::class, 'overview']);
    Route::get('/analytics/sales',              [AdminAnalyticsController::class, 'sales']);
    Route::get('/analytics/products',           [AdminAnalyticsController::class, 'products']);
});
