<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\PermohonanController;


Route::get('/users', [UserController::class, 'index']);


// Route untuk simpan permohonan
Route::post('/permohonan', [PermohonanController::class, 'store']);

// Route untuk ambil riwayat
Route::get('/riwayat/{userId}', [PermohonanController::class, 'getRiwayatUser']);
/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/
Route::post('/login', [LoginController::class, 'login']);
Route::post('/register', [RegisterController::class, 'register']);

// Route untuk Dashboard & Detail
Route::get('/dashboard-stats', [AdminController::class, 'getStats']);
Route::get('/latest-users', [AdminController::class, 'getLatestUsers']);
Route::get('/users/{id}', [AdminController::class, 'showUser']);

// Route baru untuk fetch data user lengkap & approve
Route::get('/all-users', [AdminController::class, 'getUsers']);
Route::post('/approve-user/{id}', [AdminController::class, 'approveUser']);

/*
|--------------------------------------------------------------------------
| Admin Routes (Prefix: /api/admin)
|--------------------------------------------------------------------------
*/
Route::prefix('admin')->group(function () {

    // Route lama (tetap dipertahankan agar tidak break fitur lain jika ada)
    Route::get('/users', [AdminController::class, 'getUsers']);

    // Route untuk Approve & Reject
    Route::post('/users/{id}/approve', [AdminController::class, 'approveUser']);
    Route::delete('/users/{id}/reject', [AdminController::class, 'destroy']); // Pastikan fungsi destroy ada di Controller
});
