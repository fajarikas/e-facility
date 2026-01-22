<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;

class SocialAuthController extends Controller
{
    private const PROVIDERS = ['google', 'facebook'];

    public function redirect(string $provider): RedirectResponse
    {
        $this->ensureProviderSupported($provider);
        if (! $this->isProviderConfigured($provider)) {
            return redirect()
                ->route('login')
                ->withErrors(['social' => strtoupper($provider).' login belum dikonfigurasi.']);
        }

        try {
            return Socialite::driver($provider)
                ->redirectUrl($this->getRedirectUrl($provider))
                ->redirect();
        } catch (\Throwable $e) {
            return redirect()
                ->route('login')
                ->withErrors(['social' => 'Gagal memulai login '.$provider.'. Cek konfigurasi OAuth.']);
        }
    }

    public function callback(Request $request, string $provider): RedirectResponse
    {
        $this->ensureProviderSupported($provider);
        if (! $this->isProviderConfigured($provider)) {
            return redirect()
                ->route('login')
                ->withErrors(['social' => strtoupper($provider).' login belum dikonfigurasi.']);
        }

        try {
            $socialUser = Socialite::driver($provider)
                ->redirectUrl($this->getRedirectUrl($provider))
                ->user();
        } catch (\Throwable $e) {
            return redirect()
                ->route('login')
                ->withErrors(['social' => 'Login '.$provider.' gagal. Silakan coba lagi.']);
        }

        $email = $socialUser->getEmail();
        if (! $email) {
            return redirect()
                ->route('login')
                ->withErrors(['email' => 'Login gagal: email dari provider tidak tersedia.']);
        }

        $name = $socialUser->getName() ?: ($socialUser->getNickname() ?: 'User');

        $user = User::query()->where('email', $email)->first();

        if (! $user) {
            $user = User::create([
                'name' => $name,
                'email' => $email,
                'password' => Hash::make(Str::random(48)),
                'role' => 'user',
                'email_verified_at' => now(),
            ]);
        } else {
            $updates = [];
            if (! $user->name && $name) {
                $updates['name'] = $name;
            }
            if (! $user->email_verified_at) {
                $updates['email_verified_at'] = now();
            }
            if ($updates) {
                $user->update($updates);
            }
        }

        Auth::login($user, true);
        $request->session()->regenerate();

        $home = in_array($user->role, ['admin', 'superadmin'], true)
            ? '/dashboard'
            : '/facilities';

        return redirect()->intended($home);
    }

    private function ensureProviderSupported(string $provider): void
    {
        if (! in_array($provider, self::PROVIDERS, true)) {
            abort(404);
        }
    }

    private function isProviderConfigured(string $provider): bool
    {
        $clientId = config("services.{$provider}.client_id");
        $clientSecret = config("services.{$provider}.client_secret");

        return (bool) ($clientId && $clientSecret);
    }

    private function getRedirectUrl(string $provider): string
    {
        $redirect = (string) config("services.{$provider}.redirect");

        if ($redirect === '') {
            return url("/auth/{$provider}/callback");
        }

        if (str_starts_with($redirect, 'http://') || str_starts_with($redirect, 'https://')) {
            return $redirect;
        }

        if (! str_starts_with($redirect, '/')) {
            $redirect = '/'.$redirect;
        }

        return url($redirect);
    }
}
