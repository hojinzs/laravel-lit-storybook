@extends('layouts.app')

@section('content')
    <div class="login-page">
        {{-- auth-login Web Component (server POST 모드) --}}
        <auth-login
            useFormSubmit
            action="{{ route('login.attempt') }}"
            .csrf=""
            redirectTo="/"
            style="width: 100%;"
        ></auth-login>
        @if ($errors->any())
            <div class="alert alert-error">
                <ul>
                    @foreach ($errors->all() as $error)
                        <li>{{ $error }}</li>
                    @endforeach
                </ul>
            </div>
        @endif
    </div>
@endsection
