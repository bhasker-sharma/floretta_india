<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\LivePerfumeController;
use App\Http\Controllers\HotelAmenitiesController;
use App\Http\Controllers\AdminAuthController;
use App\Http\Controllers\AdminEnquiryController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\Auth\GoogleController;
use App\Http\Controllers\PasswordResetController;
use App\Http\Controllers\SliderController;
use App\Http\Controllers\UproductController;
use App\Http\Controllers\HowItWorksController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\CareerController;

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

// 🌐 Sliders (Public - get sliders by page)
Route::get('/sliders/{page}', [SliderController::class, 'getSlidersByPage']);

// 🌐 Product Reviews (Public - get reviews for a product)
Route::get('/products/{productId}/reviews', [ReviewController::class, 'getProductReviews']);

// 🌐 Career Page (Public - get active jobs and submit applications)
Route::get('/careers', [CareerController::class, 'getActiveJobs']);
Route::middleware('throttle:3,1')->post('/careers/apply', [CareerController::class, 'submitApplication']);

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

    // ⭐ Product Reviews (Authenticated)
    Route::post('/reviews', [ReviewController::class, 'addReview']);
    Route::put('/reviews/{reviewId}', [ReviewController::class, 'updateReview']);
    Route::delete('/reviews/{reviewId}', [ReviewController::class, 'deleteReview']);
    Route::get('/products/{productId}/my-review', [ReviewController::class, 'getUserReview']);

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
    // New Orders: unverified orders list and verification action
    Route::get('/orders/new', [AdminAuthController::class, 'getNewOrders']);
    Route::post('/orders/{orderId}/verify', [AdminAuthController::class, 'verifyOrder']);
    // Order status update
    Route::post('/orders/{orderId}/status', [AdminAuthController::class, 'updateOrderStatus']);
    Route::post('/create-admin', [AdminAuthController::class, 'createAdmin']);
    Route::get('/all-admins', [AdminAuthController::class, 'getAllAdmins']);
    Route::delete('/delete-admin/{id}', [AdminAuthController::class, 'deleteAdmin']);
    Route::get('/all-users', [AdminAuthController::class, 'getAllUsers']);

    // Product management
    Route::get('/products', [ProductController::class, 'adminGetAllProducts']);
    Route::post('/products', [ProductController::class, 'adminCreateProduct']);
    Route::post('/products/{id}', [ProductController::class, 'adminUpdateProduct']); // POST with _method=PUT for FormData
    Route::put('/products/{id}', [ProductController::class, 'adminUpdateProduct']);
    Route::delete('/products/{id}', [ProductController::class, 'adminDeleteProduct']);
    Route::delete('/products/{productId}/images/{imageId}', [ProductController::class, 'adminDeleteProductImage']);

    // Bestseller management
    Route::post('/bestsellers/reorder', [ProductController::class, 'reorderBestsellers']);

    // Slider management
    Route::get('/sliders', [SliderController::class, 'adminGetAllSliders']);
    Route::post('/sliders', [SliderController::class, 'adminUploadSlider']);
    Route::delete('/sliders/{id}', [SliderController::class, 'adminDeleteSlider']);
    Route::post('/sliders/reorder', [SliderController::class, 'adminReorderSliders']);

    // Uproducts management (Our Products section on homepage)
    Route::get('/uproducts', [UproductController::class, 'index']);
    Route::post('/uproducts', [UproductController::class, 'store']);
    Route::post('/uproducts/{id}', [UproductController::class, 'update']);
    Route::delete('/uproducts/{id}', [UproductController::class, 'destroy']);

    // How It Works management (Live Perfume page)
    Route::get('/how-it-works', [HowItWorksController::class, 'index']);
    Route::post('/how-it-works', [HowItWorksController::class, 'store']);
    Route::post('/how-it-works/{id}', [HowItWorksController::class, 'update']);
    Route::delete('/how-it-works/{id}', [HowItWorksController::class, 'destroy']);

    // Review management
    Route::get('/reviews', [ReviewController::class, 'adminGetAllReviews']);
    Route::delete('/reviews/{reviewId}', [ReviewController::class, 'adminDeleteReview']);
    Route::get('/reviews/stats', [ReviewController::class, 'adminGetReviewStats']);
    Route::put('/reviews/{reviewId}/toggle-featured', [ReviewController::class, 'adminToggleFeatured']);
    Route::put('/reviews/{reviewId}/status', [ReviewController::class, 'adminUpdateStatus']);

    // User Enquiries management (with pagination)
    Route::get('/user-enquiry/contact', [AdminEnquiryController::class, 'listContactEnquiries']);
    Route::get('/user-enquiry/bookings', [AdminEnquiryController::class, 'listPerfumeBarBookings']);

    // Career management
    Route::get('/careers', [CareerController::class, 'adminGetAllJobs']);
    Route::post('/careers', [CareerController::class, 'adminCreateJob']);
    Route::put('/careers/{id}', [CareerController::class, 'adminUpdateJob']);
    Route::delete('/careers/{id}', [CareerController::class, 'adminDeleteJob']);
    Route::post('/careers/{id}/toggle-status', [CareerController::class, 'adminToggleJobStatus']);
    Route::get('/career-applications', [CareerController::class, 'adminGetApplications']);
    Route::get('/career-applications/{id}/resume', [CareerController::class, 'adminDownloadResume']);
    Route::get('/career-applications/{id}/cover-letter', [CareerController::class, 'adminDownloadCoverLetter']);
    Route::put('/career-applications/{id}/status', [CareerController::class, 'adminUpdateApplicationStatus']);
    Route::put('/career-applications/{id}/comments', [CareerController::class, 'adminUpdateApplicationComments']);
    Route::delete('/career-applications/{id}', [CareerController::class, 'adminDeleteApplication']);
});

