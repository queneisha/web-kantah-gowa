<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RegisterConfig extends Model
{
    protected $fillable = [
        'judul_utama',
        'sub_judul',
        'maskot_path',
        'background_path',
        'opsi_jabatan',
    ];

    protected $casts = [
        'opsi_jabatan' => 'array',
    ];
}
