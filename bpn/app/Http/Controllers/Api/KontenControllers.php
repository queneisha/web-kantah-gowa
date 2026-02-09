<?php

namespace App\Http\Controllers\Api;

use App\Models\Alur;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;


class KontenControllers extends Controller
{
    public function indexAlur(){
        $alurs=Alur::all();
        return response()->json($alurs);
    }

    public function updateAlur(Request $request)
    {
        // Ambil data alurs dari request
        $alursData = $request->input('alurs');
    
        try {
            foreach ($alursData as $index => $item) {
                $alur = Alur::find($item['id']);
                if ($alur) {
                    $alur->judul = $item['judul'];
                    $alur->deskripsi = $item['deskripsi'];
    
                    // Logika upload file icon
                    if ($request->hasFile("alurs.$index.icon")) {
                        $file = $request->file("alurs.$index.icon");
                        $filename = time() . '_alur_' . $file->getClientOriginalName();
                        
                        // Simpan ke storage/app/public/icons (pastikan folder ada)
                        $file->storeAs('icons', $filename, 'public');
                        
                        $alur->icon = $filename;
                    }
                    $alur->save();
                }
            }
            return response()->json(['success' => true, 'message' => 'Alur berhasil Diperbarui'], 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

}


