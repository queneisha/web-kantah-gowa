<?php

use Illuminate\Support\Facades\Mail;
use App\Mail\UserApprovedMail;
use App\Models\User;

Route::get('/test-email', function () {
    $user = User::first();
    Mail::to($user->email)->send(new UserApprovedMail($user));
    return 'Email terkirim!';
});
