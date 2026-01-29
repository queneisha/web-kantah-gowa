<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'nama_lengkap' => 'Test User',
            'jabatan' => 'Pengguna',
            'nomor_hp' => '081234567890',
            'email' => 'test@example.com',
            'status' => 'aktif',
            'role' => 'user',
        ]);

        // Seed a single admin account (email/password can be configured in .env as ADMIN_EMAIL / ADMIN_PASSWORD)
        $this->call(\Database\Seeders\AdminUserSeeder::class);
    }
}
