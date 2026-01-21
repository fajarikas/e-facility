<?php

namespace App\Http\Responses;

use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;

class LoginResponse implements LoginResponseContract
{
    public function toResponse($request)
    {
        $user = $request->user();

        $home = $user && in_array($user->role, ['admin', 'superadmin'], true)
            ? '/dashboard'
            : '/facilities';

        return redirect()->intended($home);
    }
}

