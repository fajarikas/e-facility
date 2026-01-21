<?php

namespace App\Http\Responses;

use Illuminate\Http\JsonResponse;
use Laravel\Fortify\Contracts\VerifyEmailResponse as VerifyEmailResponseContract;

class VerifyEmailResponse implements VerifyEmailResponseContract
{
    public function toResponse($request)
    {
        if ($request->wantsJson()) {
            return new JsonResponse('', 204);
        }

        $user = $request->user();

        $home = $user && in_array($user->role, ['admin', 'superadmin'], true)
            ? '/dashboard'
            : '/facilities';

        return redirect()->intended($home.'?verified=1');
    }
}

