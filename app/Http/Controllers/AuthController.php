<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use App\Models\User;


class AuthController extends Controller
{
    public function proseslogin(Request $request)
    {
          $request->validate([
            'email' => 'required|email',
            'password' => 'required',
         ]);

        $user=User::where('email', $request->email)->first();
       if(!$user|| !Hash::check($request->password,$user->password)){
        return back()->with('error', 'email atau password salah');
       }
        if ($user->status !== 'approved'){
            return back()->with('error', 'akun anda menunggu persetujuan');
        }

       Auth::login($user);
    return redirect()->route('dashboard');
    }

    public function showLogin(){
        return view('auth.login');
    }
    

    public function showRegister(){
        return view('auth.register');
    }

    public function dashboard()
    {
    return view('dashboard');
    }

    public function register(Request $request){
        $validator = Validator::make($request->all(), [
         'email' => 'required|string|email|max:255|unique:users',
         'name' => 'required|string|max:255',
         'jabatan' => 'required|in:staff,pegawai,notaris',
         'notel'=> 'required|string|max:255',
         'password' => 'required|string|min:6|confirmed',
        ]); 


        if($validator->fails()){
            return redirect()->back()->withErrors($validator)->withInput();
        }

        $user = User::create([
        'email' => $request->email,
        'name' => $request->name,
        'jabatan' => $request->jabatan,
        'notel'=> $request->notel,
        'password'=> Hash::make($request->password),
        'status' => 'pending'
        ]);


        Auth::login($user);
        return redirect()->route('login')
        ->with('success', 'Akun berhasil diajukan');
    }
    
    public function approve($id)
{
    $user = User::findOrFail($id);
    $user->status = 'approved';
    $user->save();

    return back()->with('success', 'User berhasil disetujui');
}

   


}


