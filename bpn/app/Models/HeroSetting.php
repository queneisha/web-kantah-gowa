<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HeroSetting extends Model
{
    /**
     * Atribut yang dapat diisi secara massal
     */
    protected $fillable = [
        'type',
        'heroTitle1',
        'heroTitle2',
        'heroTitle3',
        'image_path',
        'navbar_icon_path',
        'navText1',
        'navText2',
        'navText3',
    ];
}
