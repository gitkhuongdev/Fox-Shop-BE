<?php

namespace App\Http\Middleware;

use Closure;

class CheckSession
{
    public function handle($request, Closure $next)
    {
        if (!session()->has('user_id')) {
            return redirect('/')->with('log', false);
        }

        return $next($request);
    }
}
