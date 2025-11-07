<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SecurityHeaders
{
    /**
     * Handle an incoming request and add security headers to the response.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Don't override CORS headers - preserve any existing Access-Control headers
        // CORS middleware should have already set these
        
        // X-Content-Type-Options: Prevents MIME type sniffing
        // Stops browsers from trying to guess the MIME type of responses
        $response->headers->set('X-Content-Type-Options', 'nosniff', false);

        // X-Frame-Options: Prevents clickjacking attacks
        // Prevents the site from being embedded in iframes on other domains
        $response->headers->set('X-Frame-Options', 'DENY', false);

        // X-XSS-Protection: Legacy XSS filter (for older browsers)
        // Enables the browser's built-in XSS protection
        $response->headers->set('X-XSS-Protection', '1; mode=block', false);

        // Strict-Transport-Security: Enforces HTTPS connections
        // Forces browsers to only connect via HTTPS for 1 year
        // Note: Only apply in production with valid SSL certificate
        if (config('app.env') === 'production') {
            $response->headers->set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains', false);
        }

        // Content-Security-Policy: Comprehensive XSS protection
        // Defines approved sources of content that browsers should load
        $csp = implode('; ', [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.razorpay.com https://cdn.razorpay.com",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com",
            "img-src 'self' data: https: http:",
            "font-src 'self' data: https://fonts.gstatic.com https://cdnjs.cloudflare.com",
            "connect-src 'self' https://api.razorpay.com https://lumberjack.razorpay.com",
            "frame-src 'self' https://api.razorpay.com",
            "object-src 'none'",
            "base-uri 'self'",
            "form-action 'self'",
            "frame-ancestors 'none'",
            "upgrade-insecure-requests"
        ]);
        $response->headers->set('Content-Security-Policy', $csp, false);

        // Referrer-Policy: Controls referrer information
        // Prevents leaking sensitive URL information to external sites
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin', false);

        // Permissions-Policy: Controls browser features and APIs
        // Restricts access to sensitive browser features
        $permissions = implode(', ', [
            'geolocation=()',
            'microphone=()',
            'camera=()',
            'payment=(self)',
            'usb=()',
            'magnetometer=()',
            'gyroscope=()',
            'accelerometer=()'
        ]);
        $response->headers->set('Permissions-Policy', $permissions, false);

        return $response;
    }
}
