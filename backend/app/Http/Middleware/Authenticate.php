<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Illuminate\Http\Request;

class Authenticate extends Middleware
{
    /**
     * Get the path the user should be redirected to when not authenticated.
     */
// ✅ REPLACE with this:
protected function redirectTo($request)
{
    if (! $request->expectsJson()) {
        return null; // <- disables redirect
    }
}

}
