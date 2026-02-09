<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Alur extends Model
{
 use HasFactory;
 
 protected $table = 'alurs';
 protected $fillable = [
    'judul',
    'deskripsi',
    'icon',
    'urutan',
 ];
}
