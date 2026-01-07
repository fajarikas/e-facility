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
    public function index()
    {
        $users = User::orderBy('name')->paginate(10);

        return Inertia::render('admin/users/index', [
            'data' => $users,
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
