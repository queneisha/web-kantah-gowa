<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Pindahkan data dari catatan_pendaftaran ke jenis_lainnya untuk jenis Lainnya
        \DB::statement("
            UPDATE permohonans 
            SET jenis_lainnya = catatan_pendaftaran 
            WHERE jenis_pendaftaran = 'Lainnya' AND catatan_pendaftaran IS NOT NULL AND jenis_lainnya IS NULL
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Reverse: Clear jenis_lainnya yang baru saja dipindahkan
        \DB::statement("
            UPDATE permohonans 
            SET jenis_lainnya = NULL 
            WHERE jenis_pendaftaran = 'Lainnya'
        ");
    }
};
