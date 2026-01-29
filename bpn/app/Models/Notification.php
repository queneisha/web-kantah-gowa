<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    protected $fillable = [
        'user_id',
        'permohonan_id',
        'title',
        'message',
        'status',
        'jenis',
        'jenis_lainnya',
        'no_sertifikat',
        'lokasi',
        'catatan_pendaftaran',
        'is_read'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function permohonan()
    {
        return $this->belongsTo(Permohonan::class);
    }
}
