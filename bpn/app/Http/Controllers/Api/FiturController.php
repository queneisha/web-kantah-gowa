<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Fitur;
use Illuminate\Support\Facades\Storage;


class FiturController extends Controller
{
    public function index(){
        return response()->json(\App\Models\Fitur::all());
    }



    public function update(Request $request) {
        $features = $request->input('features');
          
        if (!$features){
            return response()->json(['message' => 'Tidak ada fitur untuk diperbarui.'], 400);
        }

        foreach ($features as $index => $item) {

            

            $fitur = Fitur::find($item['id']);
            if ($fitur) {
                $fitur->judul = $item['judul'];
                $fitur->deskripsi = $item['deskripsi'];
    
                // Cek apakah ada file yang dikirim dari React
                if ($request->hasFile("features.$index.icon")) {
                    $file = $request->file("features.$index.icon");
                    
                    // Buat nama file unik
                    $filename = time() . '_' . $file->getClientOriginalName();
                    
                    // Simpan file FISIK ke folder storage/app/public/icons
                    $file->storeAs('icons', $filename, 'public');
                    
                    // Simpan NAMA FILE ke database (menggantikan emotikon)
                    $fitur->icon = $filename;
                }
                $fitur->save();
            }
        }
        return response()->json(['message' => 'Berhasil diperbarui!']);
    }
   
}
