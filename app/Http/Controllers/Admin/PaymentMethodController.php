<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DataMaster;
use App\Models\PaymentMethod;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PaymentMethodController extends Controller
{
    public function index()
    {
        $dataMasters = DataMaster::query()->orderBy('name')->get();
        $paymentMethods = PaymentMethod::query()
            ->with('dataMaster')
            ->latest()
            ->get();

        return Inertia::render('admin/payment-methods/index', [
            'dataMasters' => $dataMasters,
            'data' => $paymentMethods,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'data_master_id' => ['required', 'integer', 'exists:data_masters,id'],
            'type' => ['required', 'in:va,bank_transfer'],
            'bank_name' => ['required', 'string', 'max:100'],
            'account_number' => ['required', 'string', 'max:255'],
            'account_holder' => ['nullable', 'string', 'max:255'],
            'is_active' => ['required', 'boolean'],
        ]);

        PaymentMethod::create($validated);

        return redirect()->route('admin.payment-methods')->with('success', 'Metode pembayaran berhasil dibuat.');
    }

    public function update(Request $request, PaymentMethod $paymentMethod)
    {
        $validated = $request->validate([
            'data_master_id' => ['required', 'integer', 'exists:data_masters,id'],
            'type' => ['required', 'in:va,bank_transfer'],
            'bank_name' => ['required', 'string', 'max:100'],
            'account_number' => ['required', 'string', 'max:255'],
            'account_holder' => ['nullable', 'string', 'max:255'],
            'is_active' => ['required', 'boolean'],
        ]);

        $paymentMethod->update($validated);

        return redirect()->route('admin.payment-methods')->with('success', 'Metode pembayaran berhasil diperbarui.');
    }

    public function destroy(PaymentMethod $paymentMethod)
    {
        $paymentMethod->delete();

        return redirect()->route('admin.payment-methods')->with('success', 'Metode pembayaran berhasil dihapus.');
    }
}

