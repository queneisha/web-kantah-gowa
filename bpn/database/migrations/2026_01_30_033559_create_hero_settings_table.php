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
        Schema::create('hero_settings', function (Blueprint $table) {
            $table->id();
            $table->string('type')->default('background'); // Biar bisa buat settingan lain nanti
            $table->string('heroTitle1')->nullable();
            $table->string('heroTitle2')->nullable();
            $table->string('heroTitle3')->nullable();
            $table->string('image_path')->nullable(); // Ini tempat simpan nama file fotonya
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hero_settings');
    }
};
