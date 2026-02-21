<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\HeroSetting;

class HeroController extends Controller
{
    public function getHero() {
        $hero = HeroSetting::where('type', 'background')->first();
     
        if (!$hero ) {
            return response()->json(['message' => 'Data tidak ditemukan'], 404);
        }


        return response()->json([
            'heroTitle1' => $hero?->heroTitle1 ?? 'Selamat Datang',
            'heroTitle2' => $hero?->heroTitle2 ?? 'Website Kantah Gowa',
            'heroTitle3' => $hero?->heroTitle3 ?? 'Layanan Informasi Pertanahan',
            'navText1' => $hero?->navText1 ?? 'KANTAH Gowa',
            'navText2' => $hero?->navText2 ?? 'Sistem Informasi & Layanan Internal',
            'navText3' => $hero?->navText3 ?? 'Administrator',
            'footerText1' => $hero?->footerText1 ?? '© 2026 Kantor Pertanahan Kabupaten Gowa. Semua hak dilindungi.',
            'footerText2' => $hero?->footerText2 ?? 'Sistem Informasi Internal untuk Notaris dan PPAT',
           
            'background' => $hero && $hero->image_path 
                ? asset('storage/' . $hero->image_path) 
                : null,
            'maskot' => $hero && $hero->maskot_path 
            ? asset('storage/' . $hero->maskot_path) 
            : '/maskot.png',
            'navbarIcon' => $hero && $hero->navbarIcon
                ? asset('storage/' . $hero->navbarIcon)
                : '/logo.png',
        ]);

     

    }

    public function updateHero(Request $request) {
        try {
            // Validasi input
            $request->validate([
                'heroTitle1' => 'nullable|string|max:255',
                'heroTitle2' => 'nullable|string|max:255',
                'heroTitle3' => 'nullable|string|max:1000',
                'navText1' => 'nullable|string|max:255',
                'navText2' => 'nullable|string|max:255',
                'navText3' => 'nullable|string|max:255',
                'footerText1' => 'nullable|string',
                'footerText2' => 'nullable|string',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120', 
                'navbarIcon' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120', 
                'maskot' => 'nullable|image|mimes:png|max:5120'
            ]);

            $hero = HeroSetting::where('type', 'background')->first()
                ?: new HeroSetting(['type' => 'background']);

            // Update teks hero
            if ($request->has('heroTitle1')) {
                $hero->heroTitle1 = $request->heroTitle1;
            }
            if ($request->has('heroTitle2')) {
                $hero->heroTitle2 = $request->heroTitle2;
            }
            if ($request->has('heroTitle3')) {
                $hero->heroTitle3 = $request->heroTitle3;
            }

            // Update teks navbar
            if ($request->has('navText1')) {
                $hero->navText1 = $request->navText1;
            }
            if ($request->has('navText2')) {
                $hero->navText2 = $request->navText2;
            }
            if ($request->has('navText3')) {
                $hero->navText3 = $request->navText3;
            }

            if ($request->has('footerText1')){
                $hero->footerText1 = $request->footerText1;
            }
            if ($request->has('footerText2')){
                $hero->footerText2 = $request->footerText2;
            }


            // Proses Foto Hero
            if ($request->hasFile('image')) {
                $file = $request->file('image');
                $path = $file->store('hero', 'public'); // Simpan di storage/app/public/hero
                $hero->image_path = $path;
            }
            
            if ($request->hasFile('maskot')) {
                $hero->maskot_path = $request->file('maskot')->store('hero', 'public');
            }

            // Proses Foto Navbar Icon
            if ($request->hasFile('navbarIcon')) {
                $file = $request->file('navbarIcon');
                $path = $file->store('navbar', 'public'); // Simpan di storage/app/public/navbar
                $hero->navbarIcon = $path;
            }
            
            $hero->save();

            return response()->json([

                'navbarIcon' => $hero && $hero->navbarIcon
                    ? asset('storage/' . $hero->navbarIcon)
                    : '/logo.png',
            ]);


            return response()->json([
                'message' => 'Berhasil diperbarui!', 
                'data' => $hero
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal menyimpan: ' . $e->getMessage()
            ], 500);
            
        }

    }
}