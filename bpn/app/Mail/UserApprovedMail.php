<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Mail\Mailable;      // WAJIB ADA
use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;

class UserApprovedMail extends Mailable
{
    use Queueable, SerializesModels;

    public $user;

    public function __construct(User $user)
    {
        $this->user = $user;
    }

    public function build()
    {
        return $this->subject('Akun Anda Telah Disetujui')
                    ->view('emails.user_approved');
    }
}
