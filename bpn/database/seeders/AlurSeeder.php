<?php 

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AlurSeeder extends Seeder
{
 public function run() : void 
 {
    DB::table('alurs')-> insert([
 
        [
            'judul' => '1. Registrasi Akun',
            'deskripsi' => 'Notaris/PPAT mendaftar degan data lengkaap dan menunggu persetujuan dari Admin Kantah.',
            'urutan' => 1,
            'created_at' => now(),
        ],
        [
            'judul' => '2. Ajukan Akun',
            'deskripsi' => 'Setelah akun disetujui, ajukan permohonan layanan dengan mengisi form yang tersedia.',
            'urutan' => 2,
            'created_at' => now(),
        ],
        [
            'judul' => '3. Pantau Status',
            'deskripsi' => 'Pantau perkembangan permohonan dan terima notifikasi melalui sistem dan email.',
            'urutan' => 3,
            'created_at' => now(),
        ]
        
    ]);

 }
}