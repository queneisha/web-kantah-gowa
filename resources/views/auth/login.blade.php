<!DOCTYPE html>
 <html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
</head>
<body>
<div class="main">
        <section class="login">
        <div class="container">
            <div class="login-content">
                <div class="login-form">
                <form method="POST"  action="{{ route('login') }}">
                @csrf
                        <label for="email" class="col-sm-2 col-form-label "><i> Email</i></label>
                        <input type="email" name="email" id="email" placeholder="Email" required/>
                       </div>
                       <div class="form-group">
                        <label for="password"><i class="">Password</i></label>
                        <input type="password" name="password" id="password" placeholder="Password" required/>
                       <div class="form-group">
                       <div class="form-group form-button">
                        <input type="submit" name="login" id="login">
                       </div>
                       <div class="">
                        <p>Belum punya akun?</p>
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

@if(session('success'))
    <div class="alert alert-success">
        {{ session('success') }}
    </div>
@endif

@if(session('error'))
    <div class="alert alert-danger">
        {{ session('error') }}
    </div>
@endif
