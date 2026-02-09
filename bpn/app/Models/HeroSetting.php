<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class HeroSetting extends Model
{
    use Hasfactory;

    protected $table = 'hero_settings';
    /**
     * Atribut yang dapat diisi secara massal
     */
    protected $fillable = [
        'type',
        'heroTitle1',
        'heroTitle2',
        'heroTitle3',
        'image_path',
        'navbarIcon',
        'navText1',
        'navText2',
        'navText3',
        'footerText1',
        'footerText2',
    ];
}
