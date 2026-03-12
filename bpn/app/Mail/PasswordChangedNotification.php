<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class PasswordChangedNotification extends Mailable
{
    use Queueable, SerializesModels;

    public $user;

    public function __construct($user)
    {
        $this->user = $user;
    }

    public function build()
    {
        return $this->subject('Keamanan Akun: Password Berhasil Diperbarui')
                    ->html("
                        <div style='font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 15px;'>
                            <div style='text-align: center; margin-bottom: 20px;'>
                                <h2 style='color: #7c4d2d;'>KANTAH Gowa</h2>
                                <hr style='border: 1px solid #56b35a;'>
                            </div>
                            <p>Halo, <strong>{$this->user->nama_lengkap}</strong></p>
                            <p>Kami ingin memberitahukan bahwa password Anda telah <strong>berhasil diperbarui</strong> pada " . now()->format('d-m-Y H:i') . ".</p>
                            <p>Sekarang Anda sudah bisa menggunakan password baru untuk login ke Sistem Informasi & Layanan Internal KANTAH Gowa.</p>
                            
                            <div style='background: #f9f9f9; padding: 15px; border-radius: 10px; margin-top: 20px;'>
                                <p style='font-size: 12px; color: #666; margin: 0;'>
                                    <strong>Keamanan:</strong> Jika Anda tidak merasa melakukan perubahan ini, segera hubungi Admin atau Tim IT Kantor Pertanahan Gowa untuk mengamankan akun Anda.
                                </p>
                            </div>
                            
                            <p style='margin-top: 30px; font-size: 12px; color: #aaa; text-align: center;'>
                                &copy; 2026 Kantor Pertanahan Kabupaten Gowa
                            </p>
                        </div>
                    ");
    }
}