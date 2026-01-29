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
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // User yang menerima notifikasi
            $table->foreignId('permohonan_id')->constrained()->onDelete('cascade'); // Permohonan yang terkait
            $table->string('title'); // Judul notifikasi
            $table->text('message'); // Pesan notifikasi
            $table->string('status'); // Status: "Proses", "Disetujui", "Ditolak"
            $table->string('jenis'); // Jenis pendaftaran
            $table->string('no_sertifikat'); // No. Sertifikat
            $table->string('lokasi'); // Lokasi
            $table->boolean('is_read')->default(false); // Sudah dibaca atau belum
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
