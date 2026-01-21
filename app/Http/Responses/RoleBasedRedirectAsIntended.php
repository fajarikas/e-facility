<?php

namespace App\Http\Responses;

use Illuminate\Contracts\Support\Responsable;
use Laravel\Fortify\Fortify;

class RoleBasedRedirectAsIntended implements Responsable
{
    public function __construct(public string $name)
    {
    }

    public function toResponse($request)
    {
        $user = $request->user();

        $default = Fortify::redirects($this->name);

        if ($user && !in_array($user->role, ['admin', 'superadmin'], true) && $default === '/dashboard') {
            $default = '/facilities';
        }

        return redirect()->intended($default);
    }
}
