<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\LoginController;

Route::post('/login', [LoginController::class, 'login']);
Route::put('/users/{id}/approve', function($id) {
    $user = \App\Models\User::find($id);
    $user->update(['status' => 'Aktif']);
    return response()->json(['message' => 'User berhasil diaktifkan!']);
});

Route::post('/register', [RegisterController::class, 'register']);
use App\Http\Controllers\UserController;

// Route untuk mengambil data user
Route::get('/users', [UserController::class, 'index']);

// Route untuk menyetujui user (Tombol Centang)
Route::put('/users/{id}/approve', [UserController::class, 'approve']);

// Route untuk menghapus user (Tombol Silang)
Route::delete('/users/{id}', [UserController::class, 'destroy']);