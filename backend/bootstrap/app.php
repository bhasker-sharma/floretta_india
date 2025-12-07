<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php', // ✅ Enable API routes
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // CRITICAL: Apply CORS to global middleware stack FIRST
        // This ensures CORS headers are added before any other middleware
        $middleware->prepend(\Illuminate\Http\Middleware\HandleCors::class);

        // Apply security headers to all API requests (after CORS)
        $middleware->api(append: [
            \App\Http\Middleware\SecurityHeaders::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();