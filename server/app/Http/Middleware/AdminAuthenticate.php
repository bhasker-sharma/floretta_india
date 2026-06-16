<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;
use Tymon\JWTAuth\Exceptions\JWTException;

class AdminAuthenticate
{
    public function handle(Request $request, Closure $next)
    {
        try {
            $admin = auth('admin')->userOrFail();
            if (!$admin) {
                return response()->json(['message' => 'Admin not found.'], 401);
            }
        } catch (TokenExpiredException $e) {
            return response()->json(['message' => 'Token expired.'], 401);
        } catch (TokenInvalidException $e) {
            return response()->json(['message' => 'Token invalid.'], 401);
        } catch (JWTException $e) {
            return response()->json(['message' => 'Token absent.'], 401);
        }

        return $next($request);
    }
}
