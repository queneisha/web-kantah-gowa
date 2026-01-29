<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
// Import model User
use App\Models\User;

class Permohonan extends Model
{
    use HasFactory;

    protected $table = 'permohonans';

    protected $fillable = [
        'user_id',
        'jenis_pendaftaran',
        'jenis_lainnya',
        'catatan_pendaftaran',
        'jenis_hak',
        'no_sertipikat',
        'desa',
        'kecamatan',
        'status',
    ];

    /**
     * Relasi ke model User
     * Satu permohonan dimiliki oleh satu user
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}