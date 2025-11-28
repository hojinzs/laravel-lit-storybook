<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;

uses(RefreshDatabase::class);

it('creates a user with a provided password', function () {
    $password = 'Secret123!';

    $this->artisan('user:create provided@example.com --name="Provided User" --password="'.$password.'"')
        ->assertSuccessful();

    $user = User::query()->where('email', 'provided@example.com')->first();

    expect($user)->not->toBeNull();
    expect($user->name)->toBe('Provided User');
    expect(Hash::check($password, $user->password))->toBeTrue();
});

it('generates a password when none is supplied', function () {
    $this->artisan('user:create generated@example.com --name="Generated User"')
        ->assertSuccessful()
        ->expectsOutputToContain('User created successfully.');

    $user = User::query()->where('email', 'generated@example.com')->first();

    expect($user)->not->toBeNull();
    expect($user->password)->not->toBeEmpty();
    expect(strlen($user->password))->toBeGreaterThan(20); // hashed string
});

it('fails when the email already exists', function () {
    User::factory()->create(['email' => 'dupe@example.com']);

    $this->artisan('user:create dupe@example.com --name="Duplicate" --password="Password1!"')
        ->assertFailed()
        ->expectsOutputToContain('A user with that email already exists.');
});
