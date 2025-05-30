<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Man;

class ManSeeder extends Seeder
{
    public function run(): void
    {
        Man::create(['name' => 'John Doe', 'email' => 'john@example.com']);
        Man::create(['name' => 'Jane Smith', 'email' => 'jane@example.com']);
    }
}
