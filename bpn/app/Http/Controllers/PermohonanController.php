<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Permohonan;
use App\Models\Notification;
use Illuminate\Support\Facades\Validator;

class PermohonanController extends Controller
{
    /**
     * 1. Fungsi untuk Admin: Mengambil semua data permohonan dari semua user.
     * Digunakan di halaman Admin Dashboard (Next.js)
     */
    public function index()
    {
        try {
            // Mengambil data permohonan beserta relasi user (eager loading)
            $permohonan = Permohonan::with('user')->orderBy('created_at', 'desc')->get();

            // Mapping agar format JSON sesuai dengan Interface di Next.js
            $formatted = $permohonan->map(function ($item) {
                return [
                    'id' => $item->id,
                    'nama' => $item->user->nama_lengkap ?? 'Tanpa Nama', 
                    'email' => $item->user->email ?? '-',
                    'jabatan' => $item->user->jabatan ?? '-',
                    'nama_notaris' => $item->user->nama_notaris ?? null,
                    'tgl' => $item->created_at->format('d-m-Y'),
                    'jenis' => $item->jenis_pendaftaran,
                    'jenis_lainnya' => $item->jenis_lainnya ?? null,
                    'hak' => $item->jenis_hak,
                    'noSertifikat' => $item->no_sertipikat,
                    'lokasi' => $item->desa,
                    'kecamatan' => $item->kecamatan,
                    'status' => $item->status,
                    'catatan' => $item->catatan_pendaftaran ?? null,
                ];
            });

            return response()->json($formatted, 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal mengambil data: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * 2. Fungsi untuk User: Menyimpan data dari Form Pengajuan.
     */
    public function store(Request $request)
    {
        $rules = [
            'user_id' => 'required',
            'jenisPendaftaran' => 'required',
            'jenisHak' => 'required',
            'noSertipikat' => 'required',
            'desa' => 'required',
            'kecamatan' => 'required',
        ];

        // Jika jenis pendaftaran adalah "Lainnya", catatan pendaftaran wajib diisi
        if ($request->jenisPendaftaran === 'Lainnya') {
            $rules['catatanPendaftaran'] = 'required|string|min:3';
        }

        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Data tidak valid', 
                'errors' => $validator->errors()
            ], 422);
        }

        $permohonan = Permohonan::create([
            'user_id' => $request->user_id,
            'jenis_pendaftaran' => $request->jenisPendaftaran,
            'jenis_lainnya' => $request->jenisPendaftaran === 'Lainnya' ? $request->catatanPendaftaran : null,
            'catatan_pendaftaran' => null,
            'jenis_hak' => $request->jenisHak,
            'no_sertipikat' => $request->noSertipikat,
            'desa' => $request->desa,
            'kecamatan' => $request->kecamatan,
            'status' => 'Menunggu', 
        ]);

        return response()->json([
            'message' => 'Permohonan berhasil dikirim!', 
            'data' => $permohonan
        ], 201);
    }

    /**
     * 3. Fungsi untuk User: Mengambil riwayat permohonan milik user tertentu.
     */
    public function getRiwayatUser($userId)
    {
        try {
            $riwayat = Permohonan::where('user_id', $userId)
                                 ->orderBy('created_at', 'desc')
                                 ->get();

            return response()->json($riwayat);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal mengambil riwayat'
            ], 500);
        }
    }

    /**
     * 4. Fungsi untuk Admin: Update status permohonan.
     */
    public function updateStatus(Request $request, $id)
    {
        try {
            $permohonan = Permohonan::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'status' => 'required|in:Menunggu,Proses,Disetujui,Ditolak',
                'catatan' => 'nullable|string'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'message' => 'Status tidak valid',
                    'errors' => $validator->errors()
                ], 422);
            }

            $oldStatus = $permohonan->status;
            $newStatus = $request->status;

            // Update status permohonan dan catatan jika ada (hanya jika belum ada catatan sebelumnya)
            $updateData = ['status' => $newStatus];
            if ($request->filled('catatan')) {
                // Hanya allow update catatan jika belum ada catatan sebelumnya
                if (empty($permohonan->catatan_pendaftaran)) {
                    $updateData['catatan_pendaftaran'] = $request->catatan;
                } else {
                    return response()->json([
                        'message' => 'Alasan penolakan sudah ditulis dan tidak dapat diubah',
                    ], 422);
                }
            }
            $permohonan->update($updateData);

            // Buat notifikasi untuk user saat ada perubahan status
            $titleMap = [
                'Proses' => 'Permohonan Sedang Diproses',
                'Disetujui' => 'Permohonan Disetujui',
                'Ditolak' => 'Permohonan Ditolak'
            ];

            $messageMap = [
                'Proses' => 'Pengajuan Anda sedang dalam proses pemeriksaan. Mohon tunggu hingga ada pemberitahuan lebih lanjut.',
                'Disetujui' => 'Persetujuan admin telah diberikan. Data Anda kini sudah terverifikasi.',
                'Ditolak' => 'Mohon maaf, permohonan Anda ditolak karena dokumen tidak sesuai. Silakan hubungi admin untuk informasi lebih lanjut.'
            ];

            // Buat notifikasi jika:
            // 1. Status berubah dari Menunggu ke status lain (Proses, Disetujui, Ditolak)
            // 2. Status berubah ke Disetujui atau Ditolak dari Proses
            if (
                ($oldStatus === 'Menunggu' && $newStatus !== 'Menunggu') ||
                ($oldStatus === 'Proses' && ($newStatus === 'Disetujui' || $newStatus === 'Ditolak'))
            ) {
                // Jika status berubah dari Menunggu ke Proses, buat notifikasi baru
                if ($oldStatus === 'Menunggu' && $newStatus === 'Proses') {
                    Notification::create([
                        'user_id' => $permohonan->user_id,
                        'permohonan_id' => $permohonan->id,
                        'title' => $titleMap[$newStatus] ?? 'Status Permohonan Berubah',
                        'message' => $messageMap[$newStatus] ?? 'Status permohonan Anda telah diperbarui.',
                        'status' => $newStatus,
                        'jenis' => $permohonan->jenis_pendaftaran,
                        'jenis_lainnya' => $permohonan->jenis_lainnya,
                        'no_sertifikat' => $permohonan->no_sertipikat,
                        'lokasi' => $permohonan->desa,
                        'catatan_pendaftaran' => $permohonan->catatan_pendaftaran ?? null,
                        'is_read' => false
                    ]);
                } 
                // Jika status berubah dari Proses ke Disetujui atau Ditolak, UPDATE notifikasi yang sudah ada
                else if ($oldStatus === 'Proses' && ($newStatus === 'Disetujui' || $newStatus === 'Ditolak')) {
                    $existingNotification = Notification::where('permohonan_id', $permohonan->id)
                        ->where('status', 'Proses')
                        ->first();
                    
                    if ($existingNotification) {
                        // Update notifikasi yang sudah ada
                        $existingNotification->update([
                            'title' => $titleMap[$newStatus] ?? 'Status Permohonan Berubah',
                            'message' => $messageMap[$newStatus] ?? 'Status permohonan Anda telah diperbarui.',
                            'status' => $newStatus,
                            'catatan_pendaftaran' => $permohonan->catatan_pendaftaran ?? null,
                            'is_read' => false // Set is_read ke false agar user tahu ada update
                        ]);
                    } else {
                        // Jika tidak ada notifikasi Proses sebelumnya, buat notifikasi baru
                        Notification::create([
                            'user_id' => $permohonan->user_id,
                            'permohonan_id' => $permohonan->id,
                            'title' => $titleMap[$newStatus] ?? 'Status Permohonan Berubah',
                            'message' => $messageMap[$newStatus] ?? 'Status permohonan Anda telah diperbarui.',
                            'status' => $newStatus,
                            'jenis' => $permohonan->jenis_pendaftaran,
                            'jenis_lainnya' => $permohonan->jenis_lainnya,
                            'no_sertifikat' => $permohonan->no_sertipikat,
                            'lokasi' => $permohonan->desa,
                            'catatan_pendaftaran' => $permohonan->catatan_pendaftaran ?? null,
                            'is_read' => false
                        ]);
                    }
                }
                // Jika status dari Menunggu langsung ke Disetujui atau Ditolak, buat notifikasi baru
                else if ($oldStatus === 'Menunggu' && ($newStatus === 'Disetujui' || $newStatus === 'Ditolak')) {
                    Notification::create([
                        'user_id' => $permohonan->user_id,
                        'permohonan_id' => $permohonan->id,
                        'title' => $titleMap[$newStatus] ?? 'Status Permohonan Berubah',
                        'message' => $messageMap[$newStatus] ?? 'Status permohonan Anda telah diperbarui.',
                        'status' => $newStatus,
                        'jenis' => $permohonan->jenis_pendaftaran,
                        'jenis_lainnya' => $permohonan->jenis_lainnya,
                        'no_sertifikat' => $permohonan->no_sertipikat,
                        'lokasi' => $permohonan->desa,
                        'catatan_pendaftaran' => $permohonan->catatan_pendaftaran ?? null,
                        'is_read' => false
                    ]);
                }
            }

            return response()->json([
                'message' => 'Status berhasil diperbarui',
                'data' => $permohonan
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal mengupdate status: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * 5. Fungsi untuk Admin: Menghapus permohonan.
     */
    public function destroy($id)
    {
        try {
            $permohonan = Permohonan::findOrFail($id);
            $permohonan->delete();

            return response()->json([
                'message' => 'Permohonan berhasil dihapus'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal menghapus permohonan: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * 6. Fungsi untuk User: Mengambil notifikasi milik user tertentu.
     */
    public function getNotifikasiUser($userId)
    {
        try {
            $notifikasi = Notification::where('user_id', $userId)
                                      ->orderBy('created_at', 'desc')
                                      ->get()
                                      ->map(function ($item) {
                                          return [
                                              'id' => $item->id,
                                              'title' => $item->title,
                                              'message' => $item->message,
                                              'date' => $item->created_at->format('d M Y \p\u\k\u\l H:i'),
                                              'status' => strtolower($item->status),
                                              'jenis' => $item->jenis,
                                              'jenis_lainnya' => $item->jenis_lainnya,
                                              'no' => $item->no_sertifikat,
                                              'lokasi' => $item->lokasi,
                                              'is_read' => $item->is_read,
                                              'catatan' => $item->catatan_pendaftaran ?? null,
                                              'detail' => [
                                                  'jenis' => $item->jenis,
                                                  'jenis_lainnya' => $item->jenis_lainnya,
                                                  'no' => $item->no_sertifikat,
                                                  'lokasi' => $item->lokasi,
                                                  'catatan' => $item->catatan_pendaftaran ?? null
                                              ]
                                          ];
                                      });

            return response()->json($notifikasi, 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal mengambil notifikasi: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * 7. Fungsi untuk User: Tandai notifikasi sudah dibaca.
     */
    public function markNotificationAsRead($id)
    {
        try {
            $notifikasi = Notification::findOrFail($id);
            $notifikasi->update(['is_read' => true]);

            return response()->json([
                'message' => 'Notifikasi berhasil ditandai dibaca'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal memperbarui notifikasi: ' . $e->getMessage()
            ], 500);
        }
    }
}