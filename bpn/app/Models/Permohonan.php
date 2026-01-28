<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Permohonan extends Model
{
    use HasFactory;

    // Nama tabel di database
    protected $table = 'permohonans';

    // Kolom yang boleh diisi
    protected $fillable = [
        'user_id',
        'jenis_pendaftaran',
        'catatan_pendaftaran',
        'jenis_hak',
        'no_sertipikat',
        'desa',
        'kecamatan',
        'status',
    ];
}