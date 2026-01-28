<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
   public function up()
{
    Schema::create('permohonans', function (Blueprint $table) {
        $table->id();
        $table->unsignedBigInteger('user_id'); // Menghubungkan ke tabel users
        $table->string('jenis_pendaftaran');
        $table->string('catatan_pendaftaran')->nullable();
        $table->string('jenis_hak');
        $table->string('no_sertipikat');
        $table->string('desa');
        $table->string('kecamatan');
        $table->string('status')->default('Menunggu'); // Menunggu, Diproses, Selesai, Ditolak
        $table->timestamps();

        // Opsional: Hubungkan foreign key jika tabel users sudah ada
        // $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('permohonans');
    }
};
