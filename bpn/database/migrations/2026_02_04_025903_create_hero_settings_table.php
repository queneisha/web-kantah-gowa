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
        $table->string('type')->default('background');
        $table->string('heroTitle1')->nullable();
        $table->string('heroTitle2')->nullable();
        $table->text('heroTitle3')->nullable();
        $table->string('navText1')->nullable();
        $table->string('navText2')->nullable();
        $table->string('navText3')->nullable();
        $table->text('footerText1')->nullable(); // Kolom Footer
        $table->text('footerText2')->nullable(); // Kolom Footer
        $table->string('image_path')->nullable();
        $table->string('navbarIcon')->nullable();
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
