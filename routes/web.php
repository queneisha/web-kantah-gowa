<?php
use Illuminate\Http\Request;
use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Cookie;

// Route::get('/', function () {
//     return view('welcome');
// });

Route::get('/dashboard', [AuthController::class, 'dashboard'])
    ->middleware('auth')
    ->name('dashboard');

Route::post('/login', [AuthController::class, 'proseslogin']);
Route::get('/login',[AuthController::class, 'showLogin'])->name('login');

Route::post('/admin/user/{id}/approve', [AdminController::class, 'approve']);


Route::get('/register', [AuthController::class, 'showRegister'])->name('register');
Route::post('/register', [AuthController::class, 'register']);

