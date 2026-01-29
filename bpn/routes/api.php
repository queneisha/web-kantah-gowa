<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\PermohonanController;


Route::get('/users', [UserController::class, 'index']);


/*
|--------------------------------------------------------------------------
| Public & Auth Routes
|--------------------------------------------------------------------------
*/
Route::post('/login', [LoginController::class, 'login']);
Route::post('/register', [RegisterController::class, 'register']);

/*
|--------------------------------------------------------------------------
| Permohonan Routes (User & Admin Side)
|--------------------------------------------------------------------------
*/
// Ambil semua data permohonan untuk Admin Dashboard
Route::get('/all-permohonan', [PermohonanController::class, 'index']);

// Simpan permohonan baru dari User
Route::post('/permohonan', [PermohonanController::class, 'store']);

// Ambil riwayat permohonan spesifik user
Route::get('/riwayat/{userId}', [PermohonanController::class, 'getRiwayatUser']);

// Update status & Hapus permohonan (Untuk aksi di tabel Admin)
Route::patch('/permohonan/{id}/status', [PermohonanController::class, 'updateStatus']);
Route::delete('/permohonan/{id}', [PermohonanController::class, 'destroy']);

// Ambil notifikasi user
Route::get('/notifikasi/{userId}', [PermohonanController::class, 'getNotifikasiUser']);
Route::patch('/notifikasi/{id}/read', [PermohonanController::class, 'markNotificationAsRead']);

/*
|--------------------------------------------------------------------------
| Admin Management Routes
|--------------------------------------------------------------------------
*/
// Statistik & User List untuk Dashboard Utama
Route::get('/dashboard-stats', [AdminController::class, 'getStats']);
Route::get('/latest-users', [AdminController::class, 'getLatestUsers']);
Route::get('/latest-permohonan', [AdminController::class, 'getLatestPermohonan']);
Route::get('/all-users', [AdminController::class, 'getUsers']);
Route::get('/users/{id}', [AdminController::class, 'showUser']);

// Persetujuan akun user baru
Route::post('/approve-user/{id}', [AdminController::class, 'approveUser']);

/*
|--------------------------------------------------------------------------
| Admin Routes Prefix (Optional Grouping)
|--------------------------------------------------------------------------
*/
Route::prefix('admin')->group(function () {

    // Route lama (tetap dipertahankan agar tidak break fitur lain jika ada)
    Route::get('/users', [AdminController::class, 'getUsers']);
    Route::post('/users/{id}/approve', [AdminController::class, 'approveUser']);
    Route::delete('/users/{id}/reject', [AdminController::class, 'destroy']);
});
