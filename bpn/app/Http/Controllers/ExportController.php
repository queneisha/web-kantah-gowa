<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ExportController extends Controller
{
    public function export (Request $request){
        $data = \App\Models\Permohonan::with('user')->get();

        $fileName = 'Riwayat_Permohonan_' . now ()->format('Ymd_his') . '.xls';
        $headers = [
            "Content-type" => 'application/vnd.ms-excel',
            "Content-Disposition" => "attachment; filename=$fileName",
            "Pragma" => "no-cache",
            "Cache-Control" => "must-revalidate, post-check=0 pre-check=0",
            'Expires' => "0"
        ];

        $callback = function() use ($data){
            echo "<table border='1'>";
            echo "<tr style='background-color: #56b35a; color:white; font-weight: bold;'>
            <th>No</th>
            <th>Nama Notaris</th>
            <th>Tgl Daftar</th>
            <th>Jenis Pendaftaran</th>
            <th>Keterangan Lainnya</th>
            <th>Jenis Hak</th>
            <th>No. Sertipikat</th>
            <th>Lokasi</th>
            <th>Catatan</th>
            <th>Status</th>
            </tr>";
            $no = 1;
            foreach ($data as $item){
                echo "<tr>
                <td align='center'>" . $no++ . "</td>
                <td>" . ($item->user->nama_lengkap ?? 'N/A') . "</td> 
                 <td>" . $item->created_at->format('d-m-Y') . "</td>
                 <td>" . $item->jenis_pendaftaran . "</td>
                <td>" . ($item->jenis_lainnya ?? '-') . "</td>
                 <td>" . $item->jenis_hak . "</td>
                <td>" . $item->no_sertipikat . "</td>
                <td>" . $item->desa . "-" . $item->kecamatan . "</td>
                 <td>" . ($item->catatan_pendaftaran ?? '-') . "</td>
                <td>" . $item->status . "</td>
                </tr>";


            }
            echo "</table>";

        };
        return response()->stream($callback, 200, $headers);
    }
}
