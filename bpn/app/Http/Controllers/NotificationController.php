<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Notification; // Pastikan model di-import

class NotificationController extends Controller
{
    public function getUnreadCount($id)
    {
        // Hitung notifikasi yang user_id sesuai dan belum dibaca (is_read = 0)
        $count = Notification::where('user_id', $id)
                             ->where('is_read', 0)
                             ->count();

        return response()->json([
            'status' => 'success',
            'count' => $count
        ], 200);
    }
}
