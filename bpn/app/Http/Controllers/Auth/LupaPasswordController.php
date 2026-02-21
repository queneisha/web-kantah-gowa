<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class LupaPasswordController extends Controller
{
    public function sendResetLink (Request $request){
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email',
        ], [
            'email.exists' => 'Email tidak terdaftar di sistem kami.'
        ]);

        if ($validator->fails()){
            return response()->json(['message' => $validator->errors()->first()], 422);

        }
        $status = password::sendResetLink($request->only('email'));

        return $status === Password::RESET_LINK_SENT
        ? response()->json(['message' => 'Link reset password telah dikirim ke email Anda.'])
        : response()->json(['message' => 'Gagal mengirim email. Silakan coba lagi.'], 500);
    }

    public function resetPassword(Request $request){
        $validator = Validator::make($request->all(), [
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|min:8|confirmed',
        ]);
        if ($validator->fails()){
            return response()->json(['message' => $validator->errors()->first()], 422);
        }
        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password){
                $user->forceFill([
                    'password' => Hash::make($password)
                ])->setRememberToken(Str::random(60));
                $user->save();
            }
        );
        return $status === Password::PASSWORD_RESET
        ? response()->json(['message' => 'Password berhasil direset. Silakan login dengan password baru Anda.'])
        : response()->json(['message' => 'Gagal mereset password. Token mungkin sudah tidak valid atau email tidak cocok.'], 400);
    }
}
