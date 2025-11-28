<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Str;

class CreateUser extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'user:create {email? : Email address for the new user}'
        .' {--name= : Name for the user}'
        .' {--password= : Initial password (optional)}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create a user with an optional initial password';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $email = (string) ($this->argument('email') ?? '');

        if ($email === '' && $this->input->isInteractive() && ! app()->runningUnitTests()) {
            $email = (string) $this->ask('Email');
        }

        if ($email === '') {
            $this->error('Email is required. Provide it as an argument or answer the prompt.');

            return self::FAILURE;
        }

        if (User::query()->where('email', $email)->exists()) {
            $this->error('A user with that email already exists.');

            return self::FAILURE;
        }

        $name = $this->option('name');

        if ($name === null) {
            $name = $this->input->isInteractive()
                ? $this->ask('Name', 'New User')
                : 'New User';
        }

        $password = $this->option('password');

        if ($password === null && $this->input->isInteractive() && ! app()->runningUnitTests()) {
            $password = $this->secret('Password (leave blank to generate a random one)');
        }

        $generatedPassword = false;

        if ($password === null || $password === '') {
            $password = Str::random(16);
            $generatedPassword = true;
        }

        $user = User::query()->create([
            'name' => $name,
            'email' => $email,
            'password' => $password,
        ]);

        $this->info('User created successfully.');
        $this->table(
            ['ID', 'Name', 'Email', 'Password'],
            [[$user->id, $user->name, $user->email, $generatedPassword ? $password : '(hidden)']]
        );

        if (! $generatedPassword) {
            $this->warn('The password you provided has been saved.');
        } else {
            $this->warn('The generated password is shown above. Share it securely and ask the user to change it.');
        }

        return self::SUCCESS;
    }
}
