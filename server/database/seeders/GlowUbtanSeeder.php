<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\Admin;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\BlogCategory;

class GlowUbtanSeeder extends Seeder
{
    public function run(): void
    {
        // Super admin — credentials from .env, also run: php artisan admin:seed
        $adminEmail    = env('ADMIN_EMAIL', 'admin@floretta.in');
        $adminPassword = env('ADMIN_PASSWORD', 'Floretta@2025!');
        Admin::updateOrCreate(
            ['email' => $adminEmail],
            [
                'name'        => 'Floretta Admin',
                'password'    => Hash::make($adminPassword),
                'role'        => 'super',
                'permissions' => [],
            ]
        );

        // Blog category
        BlogCategory::updateOrCreate(
            ['slug' => 'skin-care'],
            ['name' => 'Skin Care', 'slug' => 'skin-care']
        );

        // Glow Ubtan product
        $product = Product::updateOrCreate(
            ['slug' => 'glow-ubtan'],
            [
                'name'              => 'Glow Ubtan',
                'slug'              => 'glow-ubtan',
                'tagline'           => 'Ancient Ritual. Modern Glow.',
                'description'       => "Experience the timeless beauty ritual of ubtan — a traditional Indian blend crafted with turmeric, sandalwood, and botanical actives. Glow Ubtan gently exfoliates, brightens, and nourishes your skin for a radiant, natural glow.\n\nSuitable for all skin types. Free from parabens, sulfates, and artificial fragrances.",
                'ingredients'       => "Chickpea Flour, Turmeric (Curcuma Longa), Sandalwood Powder (Santalum Album), Rose Petal Powder (Rosa Damascena), Licorice Extract (Glycyrrhiza Glabra), Almond Powder (Prunus Amygdalus), Neem Powder (Azadirachta Indica), Milk Powder, Kaolin Clay.",
                'how_to_use'        => "Mix 1–2 teaspoons of Glow Ubtan with milk, rose water, or plain water to form a smooth paste. Apply evenly on face and neck. Leave for 10–15 minutes until semi-dry. Gently scrub off in circular motions while rinsing with lukewarm water. Use 2–3 times a week for best results.",
                'is_active'         => true,
                'is_featured'       => true,
                'meta_title'        => 'Glow Ubtan — Natural Face Pack | Floretta India',
                'meta_description'  => 'Discover Floretta\'s Glow Ubtan — a traditional Indian face pack with turmeric, sandalwood, and botanicals for radiant, glowing skin.',
            ]
        );

        // Variants
        $variants = [
            ['label' => '50g',  'price' => 39900,  'compare_price' => 49900,  'stock_qty' => 100, 'is_default' => true,  'sort_order' => 1],
            ['label' => '100g', 'price' => 64900,  'compare_price' => 79900,  'stock_qty' => 80,  'is_default' => false, 'sort_order' => 2],
            ['label' => '200g', 'price' => 119900, 'compare_price' => 149900, 'stock_qty' => 60,  'is_default' => false, 'sort_order' => 3],
        ];

        foreach ($variants as $v) {
            ProductVariant::updateOrCreate(
                ['product_id' => $product->id, 'label' => $v['label']],
                array_merge($v, ['product_id' => $product->id])
            );
        }

        $this->command->info('Seeded: super admin, Glow Ubtan product with 3 variants, blog category.');
    }
}
