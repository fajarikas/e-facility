<?php

namespace App\Http\Responses;

use Laravel\Fortify\Contracts\RegisterResponse as RegisterResponseContract;

class RegisterResponse implements RegisterResponseContract
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

