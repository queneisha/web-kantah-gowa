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
        Schema::table('hero_settings', function (Blueprint $table) {
            $table->string('navText1')->nullable()->after('heroTitle3');
            $table->string('navText2')->nullable()->after('navText1');
            $table->string('navText3')->nullable()->after('navText2');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('hero_settings', function (Blueprint $table) {
            $table->dropColumn(['navText1', 'navText2', 'navText3']);
        });
    }
};
