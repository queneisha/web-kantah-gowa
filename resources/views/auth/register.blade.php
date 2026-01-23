<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Register</title>
</head>
<body>
    <div class="main">
        <section class="signup">
        <div class="container">
            <div class="signup-content">
                <div class="signup-form">
                <form method="POST" action="{{ route('register') }}">
                @csrf
                    <div class="form-group">
                        <label for="email" class="col-sm-2 col-form-label "><i> Email</i></label>
                        <input type="email" name="email" id="email" placeholder="Email" required/>
                       </div>
                        <div class="form-group">
                        <label for="name"><i class="">Nama</i></label>
                        <input type="text" name="name" id="name" placeholder="Nama Lengkap" required/>
                        </div> 
                        <div class="form-group">
                        <label for="jabatan"><i class="">Jabatan</i></label>
                        <select name="jabatan" required>
                            <option value=""> Pilih jabatan</option>
                            <option value="staff">Staff Notaris/PPAT</option>
                            <option value="pegawai">Pegawai BPN</option>
                            <option value="notaris">Notaris/PPAT</option>
                        </select>
                        </div> 
                        <div class="form-group">
                        <label for="notel"><i class="">Nomor Telepon</i></label>
                        <input type="text" name="notel" id="notel" placeholder="No Telepon" required/>
                        </div> 
                       <div class="form-group">
                        <label for="password"><i class="">Password</i></label>
                        <input type="password" name="password" id="password" placeholder="Password" required/>
                       <i class="" id="togglePassword"></i>
                       <div class="form-group">
                        <label for="password_confirmation"><i class="">Konfirmasi Password</i></label>
                        <input type="password_confirmation" name="password_confirmation" id="password_confirmation" placeholder="Konfirmasi Password" required/>
                       </div>
                       <div class="form-grop form-button">
                        <input type="submit" name="signup" id="signup">
                       </div>
                       <div class="">
                        <p>Sudah punya akun?</p>
                        <a href></a>
                       </div>
                       
                    </form>
                </div>
            </div>
        </div>
        </section>
      

    </div>
</body>
</html>