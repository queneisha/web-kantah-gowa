<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Fitur extends Model
{
    use HasFactory;

    protected $table = 'fiturs_tabl'; 
    
 protected $fillable = ['judul', 'deskripsi', 'icon'];
 
 public function getIconUrlAttribute()
 {
 return $this->icon ? asset('storage/icons/' . $this->icon)
                    : asset('images/default-icon.png');

 }

}
