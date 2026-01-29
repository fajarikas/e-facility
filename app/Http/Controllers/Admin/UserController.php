<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = trim((string) $request->query('search', ''));

        $users = User::query()
            ->when($search !== '', function ($query) use ($search): void {
                $query->where(function ($query) use ($search): void {
                    $query->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('role', 'like', "%{$search}%");
                });
            })
            ->orderBy('name')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/users/index', [
            'data' => $users,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    /**
     * Update user role.
     */
    public function updateRole(Request $request, User $user)
    {
        $validatedData = $request->validate([
            'role' => 'required|in:superadmin,admin,user',
        ]);

        $user->update([
            'role' => $validatedData['role'],
        ]);

        return redirect()->route('admin.users')->with('success', 'Role berhasil diperbarui.');
    }
}
