<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Illuminate\Http\Request;

class Authenticate extends Middleware
{
    /**
     * Disable redirect for API responses.
     */
    protected function redirectTo(Request $request): ?string
    {
        return null; // No redirect, just let Laravel return 401
    }
}
