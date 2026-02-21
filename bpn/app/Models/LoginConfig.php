<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class LoginConfig extends Model
{
      use HasFactory;
      protected $table =  'login_configs';

      protected $fillable = [
        'judul_utama',
        'sub_judul',
        'maskot_path',
        'background_path',
      ];

      protected $attributes = [
        'judul_utama' => 'Selamat Datang Kembali',
        'sub_judul' => 'Silahkan login untuk mengakses sistem',
      ];


}
