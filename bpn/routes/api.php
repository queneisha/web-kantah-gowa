<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\PermohonanController;
use App\Http\Controllers\Api\HeroController;
use App\Http\Controllers\Api\KontenControllers;
use App\Http\Controllers\Api\FiturController;
use App\Http\Controllers\LoginConfigController;
use App\Http\Controllers\RegisterConfigController;
use App\Http\Controllers\ExportController;
use App\Http\Controllers\Auth\LupaPasswordController;
use Illuminate\Auth\Notifications\ResetPassword;

Route::get('/users', [UserController::class, 'index']);

Route::get('/hero-display', [HeroController::class, 'getHero']);
Route::post('/hero-update', [HeroController::class, 'updateHero']);
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
// Ambil semua data permohonan untuk Admin Dashboard (butuh autentikasi admin)
Route::middleware(['auth:sanctum', \App\Http\Middleware\EnsureAdmin::class])->group(function () {
    Route::get('/all-permohonan', [PermohonanController::class, 'index']);

    // Update status & Hapus permohonan (Untuk aksi di tabel Admin)
    Route::patch('/permohonan/{id}/status', [PermohonanController::class, 'updateStatus']);
    Route::delete('/permohonan/{id}', [PermohonanController::class, 'destroy']);

    // Admin Management Routes
    Route::get('/dashboard-stats', [\App\Http\Controllers\Admin\AdminController::class, 'getStats']);
    Route::get('/latest-users', [\App\Http\Controllers\Admin\AdminController::class, 'getLatestUsers']);
    Route::get('/latest-permohonan', [\App\Http\Controllers\Admin\AdminController::class, 'getLatestPermohonan']);
    Route::get('/all-users', [\App\Http\Controllers\Admin\AdminController::class, 'getUsers']);
    Route::get('/users/{id}', [\App\Http\Controllers\Admin\AdminController::class, 'showUser']);

    // Persetujuan akun user baru
    Route::post('/approve-user/{id}', [\App\Http\Controllers\Admin\AdminController::class, 'approveUser']);

    // Admin prefixed routes
    Route::prefix('admin')->group(function () {
        Route::get('/users', [\App\Http\Controllers\Admin\AdminController::class, 'getUsers']);
        Route::post('/users/{id}/approve', [\App\Http\Controllers\Admin\AdminController::class, 'approveUser']);
        Route::delete('/users/{id}/reject', [\App\Http\Controllers\Admin\AdminController::class, 'destroy']);
    });
});

// Routes available for users (no auth required to submit permohonan in current setup)
Route::post('/permohonan', [PermohonanController::class, 'store']);

// Ambil riwayat permohonan spesifik user (bisa dikunci di masa depan)
Route::get('/riwayat/{userId}', [PermohonanController::class, 'getRiwayatUser']);

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

 Route::get('/hero-update', [HeroController::class, 'updateHero']);
 Route::post('/hero-display', [HeroController::class, 'getHero']);

 Route::get('/alurs', [KontenControllers::class, 'indexAlur']);
 Route::post('/alur-update', [KontenControllers::class, 'updateAlur']);

 Route::get('/fiturs', [FiturController::class, 'index']);
 Route::post('/fitur/update', [FiturController::class, 'update']);

 Route::post('/loginconfig', [LoginConfigController::class, 'update']);
 Route::get('/loginconfig', [LoginConfigController::class, 'index']);

 Route::get('/registerconfig', [RegisterConfigController::class, 'index']);
 Route::post('/registerconfig', [RegisterConfigController::class, 'update']);

 Route::get('/export-permohonan', [ExportController::class, 'export']);
 Route::post('/lupa-password', [LupaPasswordController::class, 'sendResetLink']);
 Route::post('/reset-password', [LupaPasswordController::class, 'resetPassword']);

 ResetPassword::createUrlUsing(function ($user, string $token){
    return 'http://localhost:3000/reset-password?token='.$token.'&email='.$user->email;
 });
