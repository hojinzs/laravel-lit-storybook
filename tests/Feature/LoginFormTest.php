<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;

uses(RefreshDatabase::class);

it('shows the login page', function () {
    $this->get('/login')->assertSuccessful();
});

it('redirects to home after valid credentials via form post', function () {
    $user = User::factory()->create([
        'email' => 'form@example.com',
        'password' => Hash::make('Password1!'),
    ]);

    $this->post('/login', [
        'email' => $user->email,
        'password' => 'Password1!',
    ])->assertRedirect('/');
});

it('returns to login with errors on invalid credentials', function () {
    User::factory()->create([
        'email' => 'bad@example.com',
        'password' => Hash::make('Correct123!'),
    ]);

    $this->from('/login')->post('/login', [
        'email' => 'bad@example.com',
        'password' => 'WrongPass',
    ])
        ->assertRedirect('/login')
        ->assertSessionHasErrors('email');
});
