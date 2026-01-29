<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AdminUserSeeder extends Seeder
{
    public function run()
    {
        $email = env('ADMIN_EMAIL', 'admin@example.com');
        $password = env('ADMIN_PASSWORD', ''); // kosongkan default agar tidak menimpa kecuali di-SET di .env

        $admin = User::where('email', $email)->first();

        // Jika admin belum ada, buat baru (harus ada password di .env atau default kosong ditangani)
        if (!$admin) {
            User::create([
                'nama_lengkap' => 'Administrator',
                'jabatan' => 'Admin',
                'nomor_hp' => '081100000000',
                'email' => $email,
                'password' => Hash::make($password ?: 'ChangeMe123!'),
                'status' => 'aktif',
                'role' => 'admin',
            ]);
            return;
        }

        // Jika admin sudah ada, perbarui atribut penting
        $shouldSave = false;

        if ($admin->role !== 'admin') {
            $admin->role = 'admin';
            $shouldSave = true;
        }

        if ($admin->status !== 'aktif') {
            $admin->status = 'aktif';
            $shouldSave = true;
        }

        // Jika ADMIN_PASSWORD dikonfigurasi di .env (tidak kosong), perbarui password
        if (!empty($password)) {
            $admin->password = Hash::make($password);
            $shouldSave = true;
        }

        if ($shouldSave) {
            $admin->save();
        }
    }
}
