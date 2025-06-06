-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 30, 2025 at 07:00 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `floretta_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `coco`
--

CREATE TABLE `coco` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `brand` varchar(100) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `old_price` decimal(10,2) DEFAULT NULL,
  `size` varchar(50) DEFAULT NULL,
  `savings` int(11) DEFAULT NULL,
  `main_image` varchar(255) DEFAULT NULL,
  `image_2` varchar(255) DEFAULT NULL,
  `image_3` varchar(255) DEFAULT NULL,
  `image_4` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `coco`
--

INSERT INTO `coco` (`id`, `name`, `brand`, `price`, `old_price`, `size`, `savings`, `main_image`, `image_2`, `image_3`, `image_4`, `created_at`, `updated_at`) VALUES
(1, 'Coco Fudge Classic', 'Floretta', 499.00, 599.00, '500g', 100, 'coco-Fudge/img.png', 'coco-Fudge/img1.png', 'coco-Fudge/img2.png', 'coco-Fudge/img3.png', '2025-04-26 09:42:09', '2025-05-14 18:57:11');

-- --------------------------------------------------------

--
-- Table structure for table `freshner_mist`
--

CREATE TABLE `freshner_mist` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `scent` varchar(255) DEFAULT NULL,
  `volume_ml` int(11) NOT NULL,
  `price` decimal(8,2) NOT NULL,
  `rating` decimal(3,1) NOT NULL,
  `reviews_count` int(11) NOT NULL,
  `image_path` varchar(255) NOT NULL,
  `flag` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `discription` text DEFAULT NULL,
  `about_product` text DEFAULT NULL,
  `extra_images` longtext DEFAULT NULL,
  `ingridiance` text DEFAULT NULL,
  `profit` decimal(10,2) DEFAULT NULL,
  `colour` varchar(100) DEFAULT NULL,
  `brand` varchar(100) DEFAULT NULL,
  `item_form` varchar(100) DEFAULT NULL,
  `power_source` varchar(100) DEFAULT NULL,
  `about` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `freshner_mist`
--

INSERT INTO `freshner_mist` (`id`, `name`, `scent`, `volume_ml`, `price`, `rating`, `reviews_count`, `image_path`, `flag`, `created_at`, `updated_at`, `discription`, `about_product`, `extra_images`, `ingridiance`, `profit`, `colour`, `brand`, `item_form`, `power_source`, `about`) VALUES
(1, 'Jasmine Room Freshener 500ml', 'Jasmine', 500, 560.00, 4.6, 856, 'freshner/img1_a.png', 'freshner', '2025-05-22 01:23:14', '2025-05-22 01:23:14', 'A soothing floral mist with the calming scent of jasmine.', 'Perfect for daily home or office use. Leaves the space feeling fresh and vibrant.', '[\r\n\"freshner/img1_a.png\",\r\n  \"freshner/img1_b.png\",\r\n  \"freshner/img1_c.png\",\r\n  \"freshner/img1_d.png\",\r\n  \"freshner/img1_e.png\",\r\n  \"freshner/img1_f.png\"\r\n]', 'Jasmine extract, aqua, ethanol, fragrance, preservatives', 180.00, 'White', 'FLORETTA INDIA', 'Liquid', 'Manual Spray', 'Safe and refreshing jasmine-scented spray for all room types. Easy to apply, CFC-free, and long-lasting.'),
(2, 'Jasmine Room Freshener 5L', 'Jasmine', 5000, 560.00, 4.6, 856, 'freshner/img2_a.png', 'freshner', '2025-05-22 01:23:14', '2025-05-22 01:23:14', 'Economical jasmine-scented freshener for large spaces.', 'Best suited for hotels, banquet halls, and commercial use.', '[\r\n \"freshner/img2_a.png\",\r\n  \"freshner/img2_b.png\",\r\n  \"freshner/img2_c.png\",\r\n  \"freshner/img2_d.png\",\r\n  \"freshner/img2_e.png\",\r\n  \"freshner/img2_f.png\"\r\n]\r\n', 'Jasmine extract, aqua, ethanol, fragrance, preservatives', 320.00, 'White', 'FLORETTA INDIA', 'Liquid', 'Manual Spray', 'Bulk pack of jasmine freshener spray ideal for large spaces. Natural scent, safe, and easy application.'),
(3, 'Rose Room Freshener 500ml', 'Rose', 500, 560.00, 4.6, 856, 'freshner/img3_a.png', 'freshner', '2025-05-22 01:23:14', '2025-05-22 01:23:14', 'Experience the timeless aroma of fresh roses.', 'Adds a romantic and luxurious fragrance to any room.', '[\r\n  \"freshner/img3_a.png\",\r\n  \"freshner/img4_b.png\",\r\n  \"freshner/img4_c.png\",\r\n  \"freshner/img4_d.png\",\r\n  \"freshner/img4_e.png\",\r\n  \"freshner/img4_f.png\"\r\n]\r\n', 'Rose extract, aqua, ethanol, fragrance, preservatives', 200.00, 'White', 'FLORETTA INDIA', 'Liquid', 'Manual Spray', 'SAFE FORMULATION: Chemical-free room freshener spray without harmful gases or CFCs, making it suitable for use around pets and children. NATURAL FRAGRANCE: Delightful rose fragrance that creates a pleasant and welcoming atmosphere in any room. GENEROUS SIZE: 500ml bottle capacity provides long-lasting freshness for extended use. CONVENIENT APPLICATION: Easy-to-use spray bottle design allows precise and targeted application in any space. VERSATILE USE: Suitable for multiple rooms including bedrooms, living areas, bathrooms, and office spaces.'),
(4, 'Rose Room Freshener 5L', 'Rose', 5000, 560.00, 4.6, 856, 'freshner/img4_a.png', 'freshner', '2025-05-22 01:23:14', '2025-05-22 01:23:14', 'Bulk-size rose freshener for consistent, elegant scenting.', 'Recommended for large venues, events, and hospitality use.', '[\r\n  \"freshner/img4_a.png\",\r\n  \"freshner/img5_b.png\",\r\n  \"freshner/img5_c.png\",\r\n  \"freshner/img5_d.png\",\r\n  \"freshner/img5_e.png\",\r\n  \"freshner/img5_f.png\"\r\n]\r\n', 'Rose extract, aqua, ethanol, fragrance, preservatives', 350.00, 'White', 'FLORETTA INDIA', 'Liquid', 'Manual Spray', 'SAFE FORMULATION: Chemical-free room freshener spray without harmful gases or CFCs, making it suitable for use around pets and children. NATURAL FRAGRANCE: Delightful rose fragrance that creates a pleasant and welcoming atmosphere in any room. GENEROUS SIZE: 500ml bottle capacity provides long-lasting freshness for extended use. CONVENIENT APPLICATION: Easy-to-use spray bottle design allows precise and targeted application in any space. VERSATILE USE: Suitable for multiple rooms including bedrooms, living areas, bathrooms, and office spaces.'),
(5, 'Jasmine Face Mist', 'Jasmine', 100, 560.00, 4.6, 856, 'freshner/img5_a.png', 'face_mist', '2025-05-22 01:23:14', '2025-05-22 01:23:14', 'Hydrating face mist infused with jasmine essence.', 'Revitalizes and soothes your skin throughout the day.', '[\r\n  \"freshner/img5_a.png\",\r\n  \"freshner/img3_b.png\",\r\n  \"freshner/img3_c.png\",\r\n  \"freshner/img3_d.png\",\r\n  \"freshner/img3_e.png\",\r\n  \"freshner/img3_f.png\"\r\n]\r\n', 'Jasmine water, aloe vera, glycerin, natural oil extracts', 150.00, 'Transparent', 'FLORETTA INDIA', 'Mist', 'Pump Spray', 'Gentle jasmine mist to hydrate and refresh skin. Cools, tones, and revitalizes with every spray.'),
(6, 'Rose Face Mist', 'Rose', 100, 560.00, 4.6, 856, 'freshner/img6_a.png', 'face_mist', '2025-05-22 01:23:14', '2025-05-22 01:23:14', 'Gentle rose mist for soft, glowing skin.', 'Can be used as toner or daily skin refresher.', '[\r\n  \"freshner/img6_a.png\",\r\n  \"freshner/img6_b.png\",\r\n  \"freshner/img6_c.png\",\r\n  \"freshner/img6_d.png\",\r\n  \"freshner/img6_e.png\",\r\n  \"freshner/img6_f.png\"\r\n]\r\n', 'Rose water, witch hazel, glycerin, vitamin E', 160.00, 'Pink', 'FLORETTA INDIA', 'Mist', 'Pump Spray', 'Hydrating rose facial mist with soothing properties. Great for all skin types, use anytime for a glow.');

-- --------------------------------------------------------

--
-- Table structure for table `homeproducts`
--

CREATE TABLE `homeproducts` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `image` varchar(255) NOT NULL,
  `image_hover` varchar(255) NOT NULL,
  `price` decimal(8,2) NOT NULL,
  `old_price` decimal(8,2) NOT NULL,
  `rating` decimal(3,2) NOT NULL,
  `reviews` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `homeproducts`
--

INSERT INTO `homeproducts` (`id`, `name`, `image`, `image_hover`, `price`, `old_price`, `rating`, `reviews`, `created_at`, `updated_at`) VALUES
(1, 'Choco Bar', 'homeproduct/perfume1.png', 'homeproduct/perfume1_hover.png', 99.00, 130.00, 4.00, 0, '2025-05-15 02:20:20', '2025-05-15 02:20:20'),
(2, 'Vanilla Bliss', 'homeproduct/perfume2.png', 'homeproduct/perfume2_hover.png', 89.00, 220.00, 4.00, 0, '2025-05-15 02:20:20', '2025-05-15 02:20:20'),
(3, 'Strawberry Swirl', 'homeproduct/perfume3.png', 'homeproduct/perfume3_hover.png', 95.00, 130.00, 4.00, 0, '2025-05-15 02:20:20', '2025-05-15 02:20:20'),
(4, 'Butterscotch Crunch', 'homeproduct/perfume4.png', 'homeproduct/perfume4_hover.png', 99.00, 150.00, 4.00, 0, '2025-05-15 02:20:20', '2025-05-15 02:20:20');

-- --------------------------------------------------------

--
-- Table structure for table `how_it_works`
--

CREATE TABLE `how_it_works` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `subtitle` text NOT NULL,
  `image` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `how_it_works`
--

INSERT INTO `how_it_works` (`id`, `title`, `subtitle`, `image`, `created_at`, `updated_at`) VALUES
(1, 'SMELL & SELECT', 'Explore & choose your favorite fragrance', 'liveperfume/img1.png', '2025-05-17 02:45:01', '2025-05-17 02:45:01'),
(2, 'Mix', 'Combine your selected fragrance oils to make your customize perfume', 'liveperfume/img2.png', '2025-05-17 02:45:01', '2025-05-17 02:45:01'),
(3, 'Blend with Alcohol', 'Mix Alcohol with your perfume blend, shake it & your own perfume is ready to use.', 'liveperfume/img3.png', '2025-05-17 02:45:01', '2025-05-17 02:45:01');

-- --------------------------------------------------------

--
-- Table structure for table `images`
--

CREATE TABLE `images` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `image_path` varchar(255) NOT NULL,
  `hover_image_path` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `images`
--

INSERT INTO `images` (`id`, `image_path`, `hover_image_path`, `created_at`, `updated_at`) VALUES
(1, 'images/product1.jpg', 'images/product1-hover.jpg', '2025-05-14 02:39:48', '2025-05-14 02:39:48'),
(2, 'images/product2.jpg', 'images/product2-hover.jpg', '2025-05-14 02:39:48', '2025-05-14 02:39:48');

-- --------------------------------------------------------

--
-- Table structure for table `itms`
--

CREATE TABLE `itms` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `image_hover` varchar(255) DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `old_price` decimal(10,2) DEFAULT NULL,
  `rating` decimal(3,2) NOT NULL DEFAULT 4.00,
  `reviews` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `itms`
--

INSERT INTO `itms` (`id`, `name`, `image`, `image_hover`, `price`, `old_price`, `rating`, `reviews`, `created_at`, `updated_at`) VALUES
(1, 'Choco Bar', 'perfume1.png', 'perfume1_hover.png', 99.00, 130.00, 4.00, 0, '2025-05-14 03:42:19', '2025-05-14 03:42:19'),
(2, 'Vanilla Bliss', 'perfume2.png', 'perfume2_hover.png', 89.00, 220.00, 4.00, 0, '2025-05-14 03:42:19', '2025-05-14 03:42:19'),
(3, 'Strawberry Swirl', 'perfume3.png', 'perfume3_hover.png', 95.00, 130.00, 4.00, 0, '2025-05-14 03:42:19', '2025-05-14 03:42:19'),
(4, 'Butterscotch Crunch', 'perfume4.png', 'perfume4_hover.png', 99.00, 150.00, 4.00, 0, '2025-05-14 03:42:19', '2025-05-14 03:42:19');

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(4, '2025_05_08_095120_create_items_table', 1),
(9, '0001_01_01_000000_create_users_table', 2),
(10, '0001_01_01_000001_create_cache_table', 2),
(11, '0001_01_01_000002_create_jobs_table', 2),
(12, '2025_05_12_042754_create_mans_table', 3),
(13, '2025_05_14_065649_create_cache_table', 0),
(14, '2025_05_14_065649_create_cache_locks_table', 0),
(15, '2025_05_14_065649_create_coco_table', 0),
(16, '2025_05_14_065649_create_failed_jobs_table', 0),
(17, '2025_05_14_065649_create_items_table', 0),
(18, '2025_05_14_065649_create_job_batches_table', 0),
(19, '2025_05_14_065649_create_jobs_table', 0),
(20, '2025_05_14_065649_create_mans_table', 0),
(21, '2025_05_14_065649_create_password_reset_tokens_table', 0),
(22, '2025_05_14_065649_create_sessions_table', 0),
(23, '2025_05_14_065649_create_sliders_table', 0),
(24, '2025_05_14_065649_create_uproducts_table', 0),
(25, '2025_05_14_065649_create_users_table', 0),
(26, '2025_05_14_065900_create_cache_table', 0),
(27, '2025_05_14_065900_create_cache_locks_table', 0),
(28, '2025_05_14_065900_create_coco_table', 0),
(29, '2025_05_14_065900_create_failed_jobs_table', 0),
(30, '2025_05_14_065900_create_items_table', 0),
(31, '2025_05_14_065900_create_job_batches_table', 0),
(32, '2025_05_14_065900_create_jobs_table', 0),
(33, '2025_05_14_065900_create_mans_table', 0),
(34, '2025_05_14_065900_create_password_reset_tokens_table', 0),
(35, '2025_05_14_065900_create_sessions_table', 0),
(36, '2025_05_14_065900_create_sliders_table', 0),
(37, '2025_05_14_065900_create_uproducts_table', 0),
(38, '2025_05_14_065900_create_users_table', 0),
(39, '2025_05_14_080854_create_images_table', 4),
(40, '2025_05_14_090050_create_itms_tabel', 5),
(41, '2025_05_14_150643_create_ourproducts_table', 6),
(42, '2025_05_14_151427_create_ourproducts_table', 7),
(43, '2025_05_14_151645_create_ourproducts_table', 8),
(44, '2025_05_14_172009_create_customers_table', 9),
(45, '2025_05_14_172409_create_testimonials_table', 10),
(46, '2025_05_14_174209_create_testimonials_table', 11),
(47, '2025_05_15_074628_create_homeproducts_table', 12),
(48, '2025_05_16_150423_create_products_table', 13),
(49, '2025_05_17_081300_create_how_it_works_table', 14),
(50, '2025_05_18_161935_create_product_images_table', 15),
(51, '2025_05_19_065242_add_more_fields_to_products_table', 16),
(52, '2025_05_19_173753_create_room_fresheners_table', 17),
(53, '2025_05_20_084952_create_product_full_infos_table', 18),
(54, '2025_05_20_183550_create_product_details_table', 19),
(55, '2025_05_22_065213_create_freshner_mist_table', 20);

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `Discription` varchar(255) NOT NULL,
  `price` decimal(8,2) NOT NULL,
  `old_price` decimal(8,2) DEFAULT NULL,
  `image` varchar(255) NOT NULL,
  `about_product` varchar(255) NOT NULL,
  `rating` decimal(3,1) NOT NULL,
  `reviews` int(11) NOT NULL,
  `note` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `features` text DEFAULT NULL,
  `extra_images` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`extra_images`)),
  `ingredients` text DEFAULT NULL,
  `profit` text DEFAULT NULL,
  `launch_date` date DEFAULT NULL,
  `scent` varchar(255) DEFAULT NULL,
  `colour` varchar(255) DEFAULT NULL,
  `brand` varchar(255) DEFAULT NULL,
  `item_form` varchar(255) DEFAULT NULL,
  `power_source` varchar(255) DEFAULT NULL,
  `about` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `Discription`, `price`, `old_price`, `image`, `about_product`, `rating`, `reviews`, `note`, `created_at`, `updated_at`, `features`, `extra_images`, `ingredients`, `profit`, `launch_date`, `scent`, `colour`, `brand`, `item_form`, `power_source`, `about`) VALUES
(1, 'Flower Valley Perfume', 'A delicate blend of jasmine, rose, and vanilla that lingers softly on your skin, evoking timeless elegance and charm.', 650.00, 800.00, 'product/img1.png', 'A timeless fragrance blending crisp citrus with soft musk, capturing the essence of fresh morning dew and a hint of jasmine for a subtle yet lasting impression.', 4.8, 856, 'floral', NULL, '2025-05-21 06:31:48', '\"Long-lasting and luxurious.\"', '[\r\n  \"pdt_info/img1a.png\",\r\n  \"pdt_info/img1b.png\",\r\n  \"pdt_info/img1c.png\",\r\n  \"pdt_info/img1d.png\",\r\n  \"pdt_info/img1e.png\"\r\n]\r\n', 'Alcohol, Jasmine, Musk', '120', '2025-05-14', 'Jasmine Breeze', 'Blue', 'Floretta India', 'Spray', 'Manual Spray', 'Refreshing jasmine scent in a chemical-free spray. Ideal for bedrooms and living rooms. 500ml easy-spray bottle with long-lasting fragrance.'),
(2, 'Gilli Mitti Perfume', 'Warm amber notes combined with hints of sandalwood and patchouli create a sensual and mysterious aura perfect for evening wear.', 350.00, 500.00, 'product/img2.png', 'An enchanting bouquet of wild roses and sweet vanilla with warm amber undertones, designed to evoke romance and sophistication in every spritz', 4.6, 856, 'woody', NULL, '2025-05-21 06:31:48', '\"Earthy and grounded tones.\"', '[\r\n  \"pdt_info/img2a.png\",\r\n  \"pdt_info/img2b.png\",\r\n  \"pdt_info/img2c.png\",\r\n  \"pdt_info/img2d.png\",\r\n  \"pdt_info/img2e.png\"\r\n]', 'Clay, Citrus, Herbs', '140', '2025-05-07', 'Sandalwood Essence', 'Brown', 'Floretta India', 'Liquid', 'Manual Spray', 'Earthy sandalwood aroma that soothes the mind. Safe for use around pets. Premium 450ml spray bottle for consistent freshness.'),
(3, 'Coco Fudge Perfume', 'Fresh and invigorating, this perfume bursts with zesty lemon, bergamot, and grapefruit, delivering a refreshing daytime fragrance.', 560.00, 750.00, 'product/img3.png', 'A refreshing fusion of green apple, mint, and lavender, perfect for those seeking a vibrant and energizing scent that brightens the day.', 4.8, 856, 'sweet', NULL, '2025-05-21 06:31:48', '\"Choco-sweet and creamy.\"', '[\r\n  \"pdt_info/img3a.png\",\r\n  \"pdt_info/img3b.png\",\r\n  \"pdt_info/img3c.png\",\r\n  \"pdt_info/img3d.png\",\r\n  \"pdt_info/img3e.png\"\r\n]', 'Cocoa, Vanilla, Sandal', '180', '2025-04-30', 'Mint Citrus', 'Green', 'Floretta India', 'Spray', 'Manual Pump', 'Invigorating mint and citrus combo. Eco-friendly, alcohol-free formula. Suitable for office and bathroom spaces.'),
(4, 'Gulaab-e-Heer Perfume', 'An opulent fusion of rich oud, spicy saffron, and creamy vanilla that transports you to exotic Arabian nights.', 650.00, 800.00, 'product/img4.png', 'Deep notes of sandalwood, patchouli, and exotic spices harmonize in this luxurious scent, crafted for confident, bold personalities.', 4.6, 856, 'floral', NULL, '2025-05-21 06:31:48', '\"Romantic rose bouquet.\"', '[\r\n  \"pdt_info/img4a.png\",\r\n  \"pdt_info/img4b.png\",\r\n  \"pdt_info/img4c.png\",\r\n  \"pdt_info/img4d.png\",\r\n  \"pdt_info/img4e.png\"\r\n]', 'Rose, Patchouli, Amber', '160', '2025-04-23', 'Rose Garden', 'Pink', 'Floretta India', 'Liquid', 'Manual Spray', 'Elegant rose fragrance with a fresh garden feel. Perfect for daily home use. 500ml sprayer for wide coverage.'),
(5, 'Coffeenut Perfume', 'A harmonious mix of peony, lily of the valley, and gardenia, capturing the essence of a vibrant spring garden.', 560.00, 700.00, 'product/img5.png', 'Soft peony petals meet hints of creamy coconut and gentle musk to create a light, airy fragrance that lingers like a gentle summer breeze.', 4.6, 856, 'sweet', NULL, '2025-05-21 06:31:48', '\"Caffeine-rich and spicy.\"', '[\r\n  \"pdt_info/img5a.png\",\r\n  \"pdt_info/img5b.png\",\r\n  \"pdt_info/img5c.png\",\r\n  \"pdt_info/img5d.png\",\r\n  \"pdt_info/img5e.png\"\r\n]', 'Coffee oil, Cardamom, Cedar', '200', '2025-04-16', 'Vanilla Musk', 'Cream', 'Floretta India', 'Mist', 'Manual Spray', 'Warm vanilla scent with a hint of musk. Chemical-free, safe around kids. Great for bedrooms and wardrobes.'),
(6, 'Sandal Spirit Perfume', 'Crisp sea salt and marine accords blend with subtle jasmine and musk, evoking the calm and freshness of the ocean breeze.', 560.00, 650.00, 'product/img6.png', 'A seductive blend of blackcurrant, violet, and vanilla bean, creating a mysterious and captivating aura that draws attention effortlessly', 4.6, 856, 'woody', NULL, '2025-05-21 06:31:48', '\"Cool sandal touch.\"', '[\r\n  \"pdt_info/img6a.png\",\r\n  \"pdt_info/img6b.png\",\r\n  \"pdt_info/img6c.png\",\r\n  \"pdt_info/img6d.png\",\r\n  \"pdt_info/img6e.png\"\r\n]\r\n', 'Sandalwood, Vetiver, Lime', '170', '2025-04-09', 'Ocean Mist', 'Teal', 'Floretta India', 'Spray', 'Manual Pump', 'Clean oceanic scent in an eco-friendly mist. 400ml bottle perfect for bathrooms and guest areas.'),
(7, 'Zest of Summer Perfume', 'Sweet vanilla perfectly balanced with warm cinnamon and clove spices for a comforting and cozy scent.', 560.00, 850.00, 'product/img7.png', 'Inspired by oceanic freshness, this fragrance combines sea salt, driftwood, and crisp bergamot to transport you to a serene coastal escape.', 4.6, 856, 'citrus', NULL, '2025-05-21 06:31:48', '\"Citrusy summer vibe.\"', '[\r\n    \"pdt_info/img7a.png\",\r\n    \"pdt_info/img7b.png\",\r\n    \"pdt_info/img7c.png\",\r\n    \"pdt_info/img7d.png\",\r\n    \"pdt_info/img7e.png\"\r\n  ]', 'Lemon zest, Orange, Musk', '190', '2025-04-02', 'Lavender Fields', 'Purple', 'Floretta India', 'Liquid', 'Manual Spray', 'Lavender-infused freshness for relaxation and calm. Designed for bedroom and spa use. Alcohol-free, 450ml spray.'),
(8, 'Rose Garden Perfume', 'Dark rose petals intertwined with blackcurrant and musk offer a deep, seductive fragrance that captivates after dusk.', 570.00, 700.00, 'product/img8.png', 'Rich notes of caramel, tobacco, and leather combine with subtle floral hints, delivering a warm, inviting scent perfect for evening wear.', 4.7, 856, 'floral', NULL, '2025-05-21 06:31:48', '\"Floral with a garden breeze.\"', '[\r\n    \"pdt_info/img8a.png\",\r\n    \"pdt_info/img8b.png\",\r\n    \"pdt_info/img8c.png\",\r\n    \"pdt_info/img8d.png\",\r\n    \"pdt_info/img8e.png\"\r\n  ]', 'Rose petals, Mint, Dewdrop', '150', '2025-03-26', 'Citrus Burst', 'Yellow', 'Floretta India', 'Spray', 'Manual Spray', 'Uplifting citrus scent to energize any room. Best for kitchens and workspaces. Gentle, natural ingredients.');

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('0He3YInlQHqurx9CkqeiQ6UEC4Wp54GV6zdrdARw', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 Edg/135.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoicGdIeE5KOEN1N2xPbFE4YzdvbTBwMTJYbFRCRVhMNUNKRGxVYW5FTCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1747909263),
('7WBJ5qYI1etGEazNP8GL3qw3tCy2ZjIOUMKh25YT', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 Edg/135.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiR0l1blM1Z1hlMTRSWnhOQkJSU1d3cVFlSjlISmVmWHU4OGQyNk8yTiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1747741977),
('AGlLjUGimCxkk3hIrdKdkemwAsYZZTxtqTiVYeNm', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 Edg/135.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiV2NtWEVPclNKNDFOeEJ1WUx6VWxPYUdQZU9xekM4V0h0cDdWTDZ6UiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1747637871),
('b0O9IQy7HLDgWVCHqfL4eZtSWWucNAzQ40z9zBs5', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 Edg/135.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiMUJBUlU1Sno0ZlpBN3Q0WWhKd0Fyblk3UERPYnIyYkQ5SVFnYnBmUSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1748543544),
('bUZ1xC7YpyBjNvhIDdm6TFuv0mToRT70ZdktBJKF', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 Edg/135.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiTHlWWHRBOGJaYk96akdMT2dweFdzSGh6VW9wOUJPM2NmQW9JZnNQQiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1747585951),
('DcCk97tjBC1OvmJQUKu8RfzIYd5HrzdrgKVPnAVE', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 Edg/135.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoia3IwVXdYamw0NXBxYkVYeWo1RXR1c1lhWjE1MW1TZnJnRmVzODVaciI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1748148708),
('fjngYitKDqTNx6eiRL13p3mRcJHV05DTiQqeC8br', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 Edg/135.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiWE5xQzdZSHpUeUlKaXFyNk9MYXh4R2I3MzJWZGloWHNodDNrZ1JFeSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1747328621),
('fJvSUoNtf2SYJEEskzCo9J94Ayq3MQmq3S2lF355', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 Edg/135.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiWWljMzlPd3FXRGNFcWMzeHU5RDc5NVlXcmpGY0FsVDZLdnZFUk5iaCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1747654078),
('gvSxEnLkOELWFFkIRlYE7C4HzJE2mvhFaGuT7ebX', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 Edg/135.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiRnhzeklaeDYza2tFZGJFUENuNUd6RElTSExWTjMxNlljS3hTYzNUWiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1747766753),
('hW7aNV4oOsdgKAL1LjvSDZMexf0b2YA5wcleNIWa', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 Edg/135.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiaHYzUFFCWUJZS2ZoNEhzelBUTTk4MllQRXRrTzRqTWZ0aWlyMWtUYSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1747812030),
('IaNC3ctFSHlejicFc9EJl1Tslf5be10ZahEQWywg', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 Edg/135.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiMHR3dldYWWNDdlVMcWpmR1RqaGZhaUhWYmFiZThBM1hZaDR4M0xXaSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1747410670),
('jirMIeoywglosBkNEvXMZbPyoPtVO56EkSEtzsex', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 Edg/135.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiaDUwc29UMloyT1pFcDZnR0RaYVZoU1hpOVowRURhOXhQOGlJc0pacyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1747828935),
('M32jkxbnLlNaMDozCouDZzUQ5wxHZ7zosXyEx4Qv', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 Edg/135.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZG9KZlBCTEZFSTZrd21qcTJMVFBwVExCNk1uZmFjd1JzZGZiZklZdiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1748335598),
('nlwOGh4OtBFfRgzcCyvUGJGvK4v8NHqQndmAo3de', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 Edg/135.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiYURuVmVwOVpyWHdYWFFWQmdtQ0NqWmFDMWlnYkhnQVNMQ0NYQzhTbyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1747469970),
('nOqqYiMRU1aNYMNMl0s4oCOg7bI0a1Jwh1Ybnm80', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 Edg/135.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiRjZGR0hYUEozZ3ZBZWVWSkF6UlBTREtsTnRqOW11MW1UNkVjWUgzSCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1748432889),
('PufbDel14r6pUsXejuGF7RfDKhSIV2GGuLo9atq4', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 Edg/135.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiTlpVa3h4OFBpOGowYXZManZDNnkwRWlzT2xyRGJFMkhuTzViN3o1biI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1747932804),
('s2l33buaOBq984RS7SdxwUcVeLuVCWKq52BOOq53', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 Edg/135.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiSmVQdnZxNVo4Z0RMSjlhRG1WUHFQNUdCVTBEdERtWXIzczdCU1NsVCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1747236753),
('sEeyFp8tfuFVWLZGTkTx3ADkoqjXQjnYvAsKonhe', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 Edg/135.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiQVllc0FvZUZOQTREVnpHNzdyZHRid21xZnR3cDhXdlZzOTBIaEhuTyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1747670993),
('u3XdijSWaBSCXCPklnyi4J9nKjR19BvH5bs4Cujh', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 Edg/135.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiT3VPaU1HZ05YeGxDMmg5OFpNZTdNTm1nbzVYRFhjOUdaaGtrUExPNiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1747897641),
('wB2HTM6t5D6o1SADqAd91UF9eFraOcLlsaRU8O0g', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 Edg/135.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiTnVFbUd6WklwMlFSRlNIdFhKSmQyeXlBbWdVOWhTZVhhOFpjTjE3QyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1747991145),
('x92PgKwwWtzp3UmhUCqs2hXkKERfPf7fnZ51dWWV', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 Edg/135.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiUG1ZeXdYVDBtT0h3S0l5OGlOd25ITUNTNW9KMDNZUFZZenRoclJSUiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1747371811),
('y1Ixz7zfjgo0JVGym3EXuOtFRzdd9TXiERqUIuL1', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 Edg/135.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiNk1ab1N3QUtFQjJRSm5YSU5xbkRTeHlOc1h6WUVBMk0xS3ZSSXA5TiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1747214035),
('zXJKvsFyqdp48mQXSNcd1iPFEvMVp5x5j3VBuycE', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 Edg/135.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiQU1lSm5Dbk5iM1FYeFRLMk5yc09pMU93aXIzRUVPTFVDMXhxNXM4aSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1747296710);

-- --------------------------------------------------------

--
-- Table structure for table `sliders`
--

CREATE TABLE `sliders` (
  `id` int(11) NOT NULL,
  `image` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sliders`
--

INSERT INTO `sliders` (`id`, `image`, `created_at`, `updated_at`) VALUES
(1, 'slider/slide1.png', '2025-04-26 06:59:10', '2025-05-14 18:53:35'),
(2, 'slider/slide2.png', '2025-04-26 06:59:10', '2025-05-14 18:53:51'),
(3, 'slider/slide3.png', '2025-04-26 08:12:21', '2025-05-14 18:54:04'),
(4, 'slider/slide4.png', '2025-04-26 08:12:21', '2025-05-14 18:54:15'),
(5, 'slider/slide5.png', '2025-04-26 08:12:21', '2025-05-14 18:54:25');

-- --------------------------------------------------------

--
-- Table structure for table `testimonials`
--

CREATE TABLE `testimonials` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `product` varchar(255) NOT NULL,
  `rating` tinyint(4) NOT NULL,
  `review` text NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `testimonials`
--

INSERT INTO `testimonials` (`id`, `name`, `product`, `rating`, `review`, `created_at`, `updated_at`) VALUES
(1, 'Myra', 'JASMINE FACE MIST', 5, 'A burst of citrusy freshness with hints of lemon, orange, and mint—summer in a bottle!', '2025-05-14 12:17:06', '2025-05-14 12:17:06'),
(2, 'Myra', 'JASMINE FACE MIST', 5, 'A burst of citrusy freshness with hints of lemon, orange, and mint—summer in a bottle!', '2025-05-14 12:17:13', '2025-05-14 12:17:13'),
(3, 'Myra', 'JASMINE FACE MIST', 5, 'A burst of citrusy freshness with hints of lemon, orange, and mint—summer in a bottle!', '2025-05-14 12:17:18', '2025-05-14 12:17:18');

-- --------------------------------------------------------

--
-- Table structure for table `uproducts`
--

CREATE TABLE `uproducts` (
  `id` int(10) UNSIGNED NOT NULL,
  `image_path` varchar(255) NOT NULL,
  `hover_image_path` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `uproducts`
--

INSERT INTO `uproducts` (`id`, `image_path`, `hover_image_path`, `created_at`, `updated_at`) VALUES
(1, 'uproducts/image1.png', 'uproducts/image1_hover.png', '2025-04-26 10:28:02', '2025-05-14 21:12:50'),
(2, 'uproducts/image2.png', 'uproducts/image2_hover.png', '2025-04-26 10:28:02', '2025-05-14 21:12:59'),
(3, 'uproducts/image3.png', 'uproducts/image3_hover.png', '2025-04-26 10:28:02', '2025-05-14 21:13:12');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `coco`
--
ALTER TABLE `coco`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `freshner_mist`
--
ALTER TABLE `freshner_mist`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `homeproducts`
--
ALTER TABLE `homeproducts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `how_it_works`
--
ALTER TABLE `how_it_works`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `images`
--
ALTER TABLE `images`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `itms`
--
ALTER TABLE `itms`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `sliders`
--
ALTER TABLE `sliders`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `testimonials`
--
ALTER TABLE `testimonials`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `uproducts`
--
ALTER TABLE `uproducts`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `coco`
--
ALTER TABLE `coco`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `freshner_mist`
--
ALTER TABLE `freshner_mist`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `homeproducts`
--
ALTER TABLE `homeproducts`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `how_it_works`
--
ALTER TABLE `how_it_works`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `images`
--
ALTER TABLE `images`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `itms`
--
ALTER TABLE `itms`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=56;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `sliders`
--
ALTER TABLE `sliders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `testimonials`
--
ALTER TABLE `testimonials`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `uproducts`
--
ALTER TABLE `uproducts`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
