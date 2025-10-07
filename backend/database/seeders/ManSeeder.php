<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Man;

class ManSeeder extends Seeder
{
    public function run(): void
    {
        Man::firstOrCreate(
            ['email' => 'john@example.com'],
            ['name' => 'John Doe']
        );
        Man::firstOrCreate(
            ['email' => 'jane@example.com'],
            ['name' => 'Jane Smith']
        );
    }
}
