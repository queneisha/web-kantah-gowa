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
        // Kosongkan semua catatan_pendaftaran
        \DB::statement("UPDATE permohonans SET catatan_pendaftaran = NULL");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Tidak perlu reverse karena ini hanya data cleanup
    }
};
