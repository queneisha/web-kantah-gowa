<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\HeroSetting;

class HeroController extends Controller
{
    public function getHero() {
        $hero = HeroSetting::where('type', 'background')->first();
        return response()->json([
            'heroTitle1' => $hero?->heroTitle1 ?? 'Selamat Datang',
            'heroTitle2' => $hero?->heroTitle2 ?? 'Website Kantah Gowa',
            'heroTitle3' => $hero?->heroTitle3 ?? 'Layanan Informasi Pertanahan',
            'background' => $hero && $hero->image_path 
            ? asset('storage/' . $hero->image_path) 
            : null,
        ]);
    }

    public function updateHero(Request $request) {
    $hero = HeroSetting::where('type', 'background')->first() 
    ?: new HeroSetting(['type' => 'background']);

    // Update teks
    $hero->heroTitle1 = $request->heroTitle1;
    $hero->heroTitle2 = $request->heroTitle2;
    $hero->heroTitle3 = $request->heroTitle3;

    // Proses Foto
    if ($request->hasFile('image')) {
        $file = $request->file('image');
        $path = $file->store('hero', 'public'); // Simpan di storage/app/public/hero
        $hero->image_path = $path;
    }

    $hero->save();
    return response()->json([
        'message' => 'Berhasil diperbarui!', 
        'data' => $hero]);
}
}