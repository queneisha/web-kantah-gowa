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
use App\Http\Controllers\NotificationController;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/
Route::post('/login', [LoginController::class, 'login'])->name('login');
Route::post('/register', [RegisterController::class, 'register']);
Route::get('/hero-display', [HeroController::class, 'getHero']);
Route::get('/alurs', [KontenControllers::class, 'indexAlur']);
Route::get('/fiturs', [FiturController::class, 'index']);
Route::get('/loginconfig', [LoginConfigController::class, 'index']);
Route::get('/registerconfig', [RegisterConfigController::class, 'index']);

// Public Permohonan (User Side)
Route::post('/permohonan', [PermohonanController::class, 'store']);
Route::get('/riwayat/{userId}', [PermohonanController::class, 'getRiwayatUser']);
Route::get('/notifikasi/{userId}', [PermohonanController::class, 'getNotifikasiUser']);
Route::patch('/notifikasi/{id}/read', [PermohonanController::class, 'markNotificationAsRead']);
Route::get('/notifications/unread-count/{id}', [NotificationController::class, 'getUnreadCount']);

/*
|--------------------------------------------------------------------------
| Protected Admin Routes (Sanctum + EnsureAdmin)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth:sanctum', \App\Http\Middleware\EnsureAdmin::class])->group(function () {
    
    // Core Data
    Route::get('/all-permohonan', [PermohonanController::class, 'index']);
    Route::patch('/permohonan/{id}/status', [PermohonanController::class, 'updateStatus']);
    Route::delete('/permohonan/{id}', [PermohonanController::class, 'destroy']);
    
    // Stats & Management
    Route::get('/dashboard-stats', [AdminController::class, 'getStats']);
    Route::get('/latest-users', [AdminController::class, 'getLatestUsers']);
    Route::get('/latest-permohonan', [AdminController::class, 'getLatestPermohonan']);
    Route::get('/all-users', [AdminController::class, 'getUsers']);
    Route::get('/users/{id}', [AdminController::class, 'showUser']);
    Route::post('/approve-user/{id}', [AdminController::class, 'approveUser']);
    Route::get('/export-permohonan', [ExportController::class, 'export']);

    // UI Updates
    Route::post('/hero-update', [HeroController::class, 'updateHero']);
    Route::post('/alur-update', [KontenControllers::class, 'updateAlur']);
    Route::post('/fitur/update', [FiturController::class, 'update']);
    Route::post('/loginconfig', [LoginConfigController::class, 'update']);
    Route::post('/registerconfig', [RegisterConfigController::class, 'update']);

    // Prefix Admin (Agar tidak bentrok)
    Route::prefix('admin')->group(function () {
        Route::get('/users', [AdminController::class, 'getUsers']);
        Route::post('/users/{id}/approve', [AdminController::class, 'approveUser']);
        Route::delete('/users/{id}/reject', [AdminController::class, 'destroy']);
    });
});

/*
|--------------------------------------------------------------------------
| Password & Users
|--------------------------------------------------------------------------
*/
Route::get('/users', [UserController::class, 'index']);
Route::post('/lupa-password', [LupaPasswordController::class, 'sendResetLink']);
Route::post('/reset-password', [LupaPasswordController::class, 'resetPassword']);
Route::post('/user/change-password', [UserController::class, 'changePassword']);

ResetPassword::createUrlUsing(function ($user, string $token){
    return 'http://kadastrium.id/reset-password?token='.$token.'&email='.$user->email;
});