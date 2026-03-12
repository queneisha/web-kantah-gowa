<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\RegisterConfig;
use Illuminate\Support\Facades\Storage;

class RegisterConfigController extends Controller
{
    public function index()
    {
        $config = RegisterConfig::first();
        if (!$config){
            return response()-> json ([
                'judul_utama'=>'Buat Akun Anda!',
                'sub_judul'=>'Silahkan daftar untuk membuat akun di sistem layanan pertanahan kantah Gowa.',
                'maskot_path'=>null,
                'background_path'=>null,
                'opsi_jabatan'=>['Notaris/PPAT/PPATS', 'Staf Notaris/PPAT/PPATS', 'Staf ATR BPN']

            ]);

        }
        return response()->json($config);
    }
    public function update(Request $request){
        $config = RegisterConfig::first() ??  new RegisterConfig;

        $config->judul_utama = $request->input('judul_utama');
        $config->sub_judul = $request->input('sub_judul');
        $jabatanRaw = $request->input('opsi_jabatan');
        $config->opsi_jabatan = is_string($jabatanRaw) ? json_decode($jabatanRaw, true) : $jabatanRaw;
        

        if ($request->hasFile('maskot')){
            if ($config->maskot_path){
                Storage::disk('public')->delete($config->maskot_path);
            }
            $config->maskot_path = $request->file('maskot')->store('register', 'public');
        }
        if ($request->hasFile('background')){
            if ($config->background_path){
                Storage::disk('public')->delete($config->background_path);
            }
            $config->background_path = $request->file('background')->store('register', 'public');
        }
        $config->save();

        return response()->json([
            'status'=>'success',
            'message'=>'Konten Register berhasil diperbarui!',
            'data'=>$config
        ]);


    }
}
