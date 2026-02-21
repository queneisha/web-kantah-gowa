<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\LoginConfig;
use Illuminate\Support\Facades\Storage;


class LoginConfigController extends Controller
{
  public function index()
  {
    $config = LoginConfig::first();
    if (!$config) return response()->json([
      'headerTitle' => null,
      'subHeader' => null,
      'maskot_path' => null,
      'background_path' => null,
    ]);

    return response()->json([
      'headerTitle' => $config->judul_utama,
      'subHeader' => $config->sub_judul,
      'maskot_path'=> $config->maskot_path, 
      'background_path'=> $config->background_path,   
     ]); 
  }
    public function update(Request $request)
    {
            $config = LoginConfig::first() ?? new LoginConfig;

            
            $config->judul_utama = $request->judul_utama;
            $config->sub_judul = $request->sub_judul;

            if ($request->hasFile('maskot')) {
                $config->maskot_path = $request->file('maskot')->store('assets', 'public');
             } else if (!$config->exists){
              $config->maskot_path = '';
             }
             
            if ($request->hasFile('background')) {
              if ($config->background_path){
                Storage::delete($config->background_path);
              }
               
              $path = $request->file('background')->store('assets/login', 'public');
              $config->background_path = $path;
            }
            $config->save();
            return response()->json([
              'status' => 'success',
              'message' => 'konfigurasi login berhasil',
              'data' => $config
            ], 200);
    }
}
