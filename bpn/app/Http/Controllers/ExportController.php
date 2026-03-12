<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Permohonan;
use Carbon\Carbon;

class ExportController extends Controller
{
    public function export(Request $request)
    {
        // 1. Tangkap parameter dari Frontend
        $tanggalDari = $request->query('tanggal_dari');
        $tanggalSampai = $request->query('tanggal_sampai');

        // 2. Query data dengan Filter
        $query = Permohonan::with('user');

        if ($tanggalDari && $tanggalSampai) {
            // Kita gunakan startOfDay dan endOfDay agar mencakup seluruh jam di tanggal tersebut
            $start = Carbon::parse($tanggalDari)->startOfDay();
            $end = Carbon::parse($tanggalSampai)->endOfDay();
            
            // Filter berdasarkan kolom created_at atau kolom tanggal pendaftaran Anda
            $query->whereBetween('created_at', [$start, $end]);
        }

        $data = $query->get();

        // 3. Setup Header Excel
        $fileName = 'Riwayat_Permohonan_' . now()->format('Ymd_his') . '.xls';
        $headers = [
            "Content-type" => 'application/vnd.ms-excel',
            "Content-Disposition" => "attachment; filename=$fileName",
            "Pragma" => "no-cache",
            "Cache-Control" => "must-revalidate, post-check=0 pre-check=0",
            'Expires' => "0"
        ];

        // 4. Proses Stream Data
        $callback = function() use ($data) {
            echo "<table border='1'>";
            echo "<tr style='background-color: #56b35a; color:white; font-weight: bold;'>
                <th>No</th>
                <th>Nama Notaris</th>
                <th>Tgl Daftar</th>
                <th>Jenis Pendaftaran</th>
                <th>Keterangan Lainnya</th>
                <th>Jenis Hak</th>
                <th>No. Sertipikat</th>
                
                <th>Kecamatan</th>
                <th>Desa/Kelurahan</th>
                
                <th>Catatan</th>
                <th>Status</th>
            </tr>";
            
            $no = 1;
            foreach ($data as $item) {
                echo "<tr>
                    <td align='center'>" . $no++ . "</td>
                    <td>" . ($item->user->nama_lengkap ?? 'N/A') . "</td> 
                    <td>" . $item->created_at->format('d-m-Y') . "</td>
                    <td>" . $item->jenis_pendaftaran . "</td>
                    <td>" . ($item->jenis_lainnya ?? '-') . "</td>
                    <td>" . $item->jenis_hak . "</td>
                    <td>" . $item->no_sertipikat . "</td>
                    
                    <td>" . ($item->kecamatan ?? '-') . "</td>
                    <td>" . ($item->desa ?? '-') . "</td>
                    
                    <td>" . ($item->catatan_pendaftaran ?? '-') . "</td>
                    <td>" . $item->status . "</td>
                </tr>";
            }
            echo "</table>";
        };

        return response()->stream($callback, 200, $headers);
    }
}