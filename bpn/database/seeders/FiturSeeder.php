<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Fitur;

class FiturSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
       $data = [
        [
        'judul' => 'Manajemen Permohonan',
        'deskripsi' => 'Ajukan dan pantau status permohonan layanan',
        'icon' => '📦'
       ],
       [
        'judul' => 'Sistem Verifikasi',
        'deskripsi' => 'Proses verifikasi akun dan permohonan yang aman dan terstruktur',
        'icon' => '🛡️'
       ],
       [
        'judul' => 'Riwayat Lengkap',
        'deskripsi' => 'Akses riwayat semua permohonan dengan filter dan pencarian',
        'icon' => '📑'
       ],
       [
        'judul' => 'Notifikasi Otomatis',
        'deskripsi' => 'Terima pemberitahuan melalui sistem dan email untuk setiap update',
        'icon' => '🔔'
       ],
       ];

       foreach ($data as $item){
        Fitur::create($item);
       }


    }
}
