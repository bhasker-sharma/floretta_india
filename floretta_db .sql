-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 03, 2025 at 03:06 PM
-- Server version: 8.0.42
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
-- Table structure for table `admin_auth`
--

CREATE TABLE `admin_auth` (
  `id` int NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `admin_auth`
--

INSERT INTO `admin_auth` (`id`, `email`, `password`, `created_at`, `updated_at`) VALUES
(1, 'admin@gmail.com', '$2y$12$d9k2vhu9Br9YJBWvkCaMQOYBNK1b49VtzO9BguCcu5SOeOpfthbWm', '2025-08-02 15:19:14', '2025-08-02 15:19:14');

-- --------------------------------------------------------

--
-- Table structure for table `bar_packages`
--

CREATE TABLE `bar_packages` (
  `id` bigint UNSIGNED NOT NULL,
  `no_of_guests` int NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `category` enum('bronze','silver','gold') COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `bar_packages`
--

INSERT INTO `bar_packages` (`id`, `no_of_guests`, `price`, `category`, `created_at`, `updated_at`) VALUES
(1, 100, 25000.00, 'bronze', '2025-06-05 10:36:49', '2025-06-05 10:36:49'),
(2, 200, 30000.00, 'bronze', '2025-06-05 10:36:49', '2025-06-05 10:36:49'),
(3, 300, 35000.00, 'bronze', '2025-06-05 10:36:49', '2025-06-05 10:36:49'),
(4, 500, 40000.00, 'bronze', '2025-06-05 10:36:49', '2025-06-05 10:36:49'),
(5, 100, 30000.00, 'silver', '2025-06-05 10:36:49', '2025-06-05 10:36:49'),
(6, 200, 35000.00, 'silver', '2025-06-05 10:36:49', '2025-06-05 10:36:49'),
(7, 300, 40000.00, 'silver', '2025-06-05 10:36:49', '2025-06-05 10:36:49'),
(8, 500, 45000.00, 'silver', '2025-06-05 10:36:49', '2025-06-05 10:36:49'),
(9, 100, 35000.00, 'gold', '2025-06-05 10:36:49', '2025-06-05 10:36:49'),
(10, 200, 40000.00, 'gold', '2025-06-05 10:36:49', '2025-06-05 10:36:49'),
(11, 300, 45000.00, 'gold', '2025-06-05 10:36:49', '2025-06-05 10:36:49'),
(12, 500, 50000.00, 'gold', '2025-06-05 10:36:49', '2025-06-05 10:36:49');

-- --------------------------------------------------------

--
-- Table structure for table `bookings`
--

CREATE TABLE `bookings` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mobile` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `package` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `bookings`
--

INSERT INTO `bookings` (`id`, `name`, `email`, `mobile`, `package`, `message`, `created_at`, `updated_at`) VALUES
(1, 'akahs', 'ak@gmail', '899482', 'basic', 'hii', '2025-06-05 03:04:59', '2025-06-05 03:04:59'),
(2, 'akahs', 'ak@gmail', '899482', 'Bronze', 'jhv', '2025-06-09 05:17:43', '2025-06-09 05:17:43'),
(3, 'akahs', 'ak@gmail', '899482', 'Bronze', 'sdvx', '2025-06-16 22:10:59', '2025-06-16 22:10:59'),
(4, 'akahs', 'ak@gmail', '899482', 'Bronze', NULL, '2025-06-18 02:03:27', '2025-06-18 02:03:27');

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `carts`
--

CREATE TABLE `carts` (
  `id` bigint UNSIGNED NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `product_id` bigint UNSIGNED NOT NULL,
  `quantity` int NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `scent` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `volume_ml` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `price` decimal(8,2) DEFAULT NULL,
  `original_price` decimal(8,2) DEFAULT NULL,
  `discount_amount` decimal(8,2) DEFAULT NULL,
  `is_discount_active` tinyint(1) NOT NULL DEFAULT '0',
  `delivery_charge` decimal(8,2) DEFAULT NULL,
  `available_quantity` int DEFAULT NULL,
  `rating` float DEFAULT NULL,
  `reviews_count` int DEFAULT NULL,
  `image_path` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `flag` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `discription` text COLLATE utf8mb4_unicode_ci,
  `about_product` text COLLATE utf8mb4_unicode_ci,
  `extra_images` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `ingridiance` text COLLATE utf8mb4_unicode_ci,
  `profit` decimal(8,2) DEFAULT NULL,
  `colour` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `brand` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `item_form` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `power_source` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `about` text COLLATE utf8mb4_unicode_ci
) ;

--
-- Dumping data for table `carts`
--

INSERT INTO `carts` (`id`, `user_id`, `product_id`, `quantity`, `created_at`, `updated_at`, `name`, `scent`, `volume_ml`, `price`, `original_price`, `discount_amount`, `is_discount_active`, `delivery_charge`, `available_quantity`, `rating`, `reviews_count`, `image_path`, `flag`, `discription`, `about_product`, `extra_images`, `ingridiance`, `profit`, `colour`, `brand`, `item_form`, `power_source`, `about`) VALUES
(36, 0, 8, 1, '2025-06-17 22:50:38', '2025-06-17 22:50:38', 'Rose Garden Perfume', 'Citrus Burst', '100', 570.00, 700.00, 130.00, 1, 0.00, 36, 4.7, 0, 'product/img8.png', 'perfume', NULL, 'Rich notes of caramel, tobacco, and leather combine with subtle floral hints, delivering a warm, inviting scent perfect for evening wear.', '[\"pdt_info\\/img8a.png\",\"pdt_info\\/img8b.png\",\"pdt_info\\/img8c.png\",\"pdt_info\\/img8d.png\",\"pdt_info\\/img8e.png\"]', 'Rose petals, Mint, Dewdrop', 150.00, 'Yellow', 'Floretta India', 'Spray', 'Manual Spray', 'Uplifting citrus scent to energize any room. Best for kitchens and workspaces. Gentle, natural ingredients.'),
(43, 0, 5, 1, '2025-06-20 02:01:29', '2025-06-20 02:01:29', 'Coffeenut Perfume', 'Vanilla Musk', '100', 560.00, 700.00, 140.00, 1, 0.00, 50, 4.6, 0, 'product/img5.png', 'perfume', NULL, 'Soft peony petals meet hints of creamy coconut and gentle musk to create a light, airy fragrance that lingers like a gentle summer breeze.', '[\"pdt_info\\/img5a.png\",\"pdt_info\\/img5b.png\",\"pdt_info\\/img5c.png\",\"pdt_info\\/img5d.png\",\"pdt_info\\/img5e.png\"]', 'Coffee oil, Cardamom, Cedar', 200.00, 'Cream', 'Floretta India', 'Mist', 'Manual Spray', 'Warm vanilla scent with a hint of musk. Chemical-free, safe around kids. Great for bedrooms and wardrobes.'),
(45, 3, 8, 1, '2025-07-11 10:17:52', '2025-07-11 10:17:52', 'Rose Garden Perfume', 'Citrus Burst', '100', 570.00, 700.00, 130.00, 1, 0.00, 36, 4.7, 0, 'product/img8.png', 'perfume', NULL, 'Rich notes of caramel, tobacco, and leather combine with subtle floral hints, delivering a warm, inviting scent perfect for evening wear.', '[\"pdt_info\\/img8a.png\",\"pdt_info\\/img8b.png\",\"pdt_info\\/img8c.png\",\"pdt_info\\/img8d.png\",\"pdt_info\\/img8e.png\"]', 'Rose petals, Mint, Dewdrop', 150.00, 'Yellow', 'Floretta India', 'Spray', 'Manual Spray', 'Uplifting citrus scent to energize any room. Best for kitchens and workspaces. Gentle, natural ingredients.'),
(47, 3, 3, 1, '2025-07-11 11:01:44', '2025-07-11 11:01:44', 'Rose Room Freshener 500ml', 'Rose', '500', 500.00, 600.00, 100.00, 1, 0.00, 30, 4.6, 856, 'freshner/img3_a.png', 'freshner', 'Experience the timeless aroma of fresh roses.', 'Adds a romantic and luxurious fragrance to any room.', '[\r\n  \"freshner/img3_a.png\",\r\n  \"freshner/img4_b.png\",\r\n  \"freshner/img4_c.png\",\r\n  \"freshner/img4_d.png\",\r\n  \"freshner/img4_e.png\",\r\n  \"freshner/img4_f.png\"\r\n]\r\n', 'Rose extract, aqua, ethanol, fragrance, preservatives', 200.00, 'White', 'FLORETTA INDIA', 'Liquid', 'Manual Spray', 'SAFE FORMULATION: Chemical-free room freshener spray without harmful gases or CFCs, making it suitable for use around pets and children. NATURAL FRAGRANCE: Delightful rose fragrance that creates a pleasant and welcoming atmosphere in any room. GENEROUS SIZE: 500ml bottle capacity provides long-lasting freshness for extended use. CONVENIENT APPLICATION: Easy-to-use spray bottle design allows precise and targeted application in any space. VERSATILE USE: Suitable for multiple rooms including bedrooms, living areas, bathrooms, and office spaces.'),
(50, 3, 1, 1, '2025-07-22 10:20:12', '2025-07-22 10:20:12', 'Flower Valley Perfume', 'Jasmine Breeze', '100', 650.00, 800.00, 150.00, 1, 0.00, 40, 4.8, 0, 'product/img1.png', 'perfume', NULL, 'A timeless fragrance blending crisp citrus with soft musk, capturing the essence of fresh morning dew and a hint of jasmine for a subtle yet lasting impression.', '[\"pdt_info\\/img1a.png\",\"pdt_info\\/img1b.png\",\"pdt_info\\/img1c.png\",\"pdt_info\\/img1d.png\",\"pdt_info\\/img1e.png\"]', 'Alcohol, Jasmine, Musk', 120.00, 'Blue', 'Floretta India', 'Spray', 'Manual Spray', 'Refreshing jasmine scent in a chemical-free spray. Ideal for bedrooms and living rooms. 500ml easy-spray bottle with long-lasting fragrance.'),
(51, 3, 2, 1, '2025-07-24 11:08:37', '2025-07-24 11:08:37', 'Jasmine Room Freshener 5L', 'Jasmine', '5000', 560.00, 700.00, 140.00, 1, 0.00, 40, 4.6, 856, 'freshner/img2_a.png', 'freshner', 'Economical jasmine-scented freshener for large spaces.', 'Best suited for hotels, banquet halls, and commercial use.', '[\r\n \"freshner/img2_a.png\",\r\n  \"freshner/img2_b.png\",\r\n  \"freshner/img2_c.png\",\r\n  \"freshner/img2_d.png\",\r\n  \"freshner/img2_e.png\",\r\n  \"freshner/img2_f.png\"\r\n]\r\n', 'Jasmine extract, aqua, ethanol, fragrance, preservatives', 320.00, 'White', 'FLORETTA INDIA', 'Liquid', 'Manual Spray', 'Bulk pack of jasmine freshener spray ideal for large spaces. Natural scent, safe, and easy application.'),
(52, 4, 5, 1, '2025-07-29 13:12:13', '2025-07-30 03:31:42', 'Coffeenut Perfume', 'Vanilla Musk', '100', 560.00, 700.00, 140.00, 1, 0.00, 50, 4.6, 0, 'product/img5.png', 'perfume', NULL, 'Soft peony petals meet hints of creamy coconut and gentle musk to create a light, airy fragrance that lingers like a gentle summer breeze.', '[\"pdt_info\\/img5a.png\",\"pdt_info\\/img5b.png\",\"pdt_info\\/img5c.png\",\"pdt_info\\/img5d.png\",\"pdt_info\\/img5e.png\"]', 'Coffee oil, Cardamom, Cedar', 200.00, 'Cream', 'Floretta India', 'Mist', 'Manual Spray', 'Warm vanilla scent with a hint of musk. Chemical-free, safe around kids. Great for bedrooms and wardrobes.');

-- --------------------------------------------------------

--
-- Table structure for table `coco`
--

CREATE TABLE `coco` (
  `id` int NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `brand` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `old_price` decimal(10,2) DEFAULT NULL,
  `size` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `savings` int DEFAULT NULL,
  `main_image` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `image_2` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `image_3` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `image_4` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `coco`
--

INSERT INTO `coco` (`id`, `name`, `brand`, `price`, `old_price`, `size`, `savings`, `main_image`, `image_2`, `image_3`, `image_4`, `created_at`, `updated_at`) VALUES
(1, 'Coco Fudge Classic', 'Floretta', 499.00, 599.00, '500g', 100, 'coco-Fudge/img.png', 'coco-Fudge/img1.png', 'coco-Fudge/img2.png', 'coco-Fudge/img3.png', '2025-04-26 09:42:09', '2025-05-14 18:57:11');

-- --------------------------------------------------------

--
-- Table structure for table `contacts`
--

CREATE TABLE `contacts` (
  `id` bigint UNSIGNED NOT NULL,
  `hotel_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mobile` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `packaging_option` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `preferred_fragrance` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `estimated_quantity` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `additional_requirements` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `contacts`
--

INSERT INTO `contacts` (`id`, `hotel_name`, `email`, `mobile`, `packaging_option`, `preferred_fragrance`, `estimated_quantity`, `additional_requirements`, `created_at`, `updated_at`) VALUES
(1, 'abc', 'abc@gmail.com', '6677288828', 'Customized', 'Lavender', '0-100', 'szxcz', '2025-06-09 05:13:21', '2025-06-09 05:13:21'),
(2, 'abc', 'abcdef@gmail', '899482', 'Standard', 'Lavender', '100-500', 'avvvvv', '2025-06-10 10:07:43', '2025-06-10 10:07:43');

-- --------------------------------------------------------

--
-- Table structure for table `freshner_mist`
--

CREATE TABLE `freshner_mist` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `scent` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `volume_ml` int NOT NULL,
  `price` decimal(8,2) NOT NULL,
  `original_price` decimal(10,2) DEFAULT NULL,
  `discount_amount` decimal(10,2) DEFAULT NULL,
  `is_discount_active` tinyint(1) DEFAULT '0',
  `delivery_charge` decimal(10,2) DEFAULT '0.00',
  `available_quantity` int DEFAULT '0',
  `rating` decimal(3,1) NOT NULL,
  `reviews_count` int NOT NULL,
  `image_path` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `flag` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `discription` text COLLATE utf8mb4_unicode_ci,
  `about_product` text COLLATE utf8mb4_unicode_ci,
  `extra_images` longtext COLLATE utf8mb4_unicode_ci,
  `ingridiance` text COLLATE utf8mb4_unicode_ci,
  `profit` decimal(10,2) DEFAULT NULL,
  `colour` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `brand` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `item_form` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `power_source` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `about` text COLLATE utf8mb4_unicode_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `freshner_mist`
--

INSERT INTO `freshner_mist` (`id`, `name`, `scent`, `volume_ml`, `price`, `original_price`, `discount_amount`, `is_discount_active`, `delivery_charge`, `available_quantity`, `rating`, `reviews_count`, `image_path`, `flag`, `created_at`, `updated_at`, `discription`, `about_product`, `extra_images`, `ingridiance`, `profit`, `colour`, `brand`, `item_form`, `power_source`, `about`) VALUES
(1, 'Jasmine Room Freshener 500ml', 'Jasmine', 500, 650.00, 800.00, 150.00, 1, 0.00, 50, 4.6, 856, 'freshner/img1_a.png', 'freshner', '2025-05-22 01:23:14', '2025-05-22 01:23:14', 'A soothing floral mist with the calming scent of jasmine.', 'Perfect for daily home or office use. Leaves the space feeling fresh and vibrant.', '[\r\n\"freshner/img1_a.png\",\r\n  \"freshner/img1_b.png\",\r\n  \"freshner/img1_c.png\",\r\n  \"freshner/img1_d.png\",\r\n  \"freshner/img1_e.png\",\r\n  \"freshner/img1_f.png\"\r\n]', 'Jasmine extract, aqua, ethanol, fragrance, preservatives', 180.00, 'White', 'FLORETTA INDIA', 'Liquid', 'Manual Spray', 'Safe and refreshing jasmine-scented spray for all room types. Easy to apply, CFC-free, and long-lasting.'),
(2, 'Jasmine Room Freshener 5L', 'Jasmine', 5000, 560.00, 700.00, 140.00, 1, 0.00, 40, 4.6, 856, 'freshner/img2_a.png', 'freshner', '2025-05-22 01:23:14', '2025-05-22 01:23:14', 'Economical jasmine-scented freshener for large spaces.', 'Best suited for hotels, banquet halls, and commercial use.', '[\r\n \"freshner/img2_a.png\",\r\n  \"freshner/img2_b.png\",\r\n  \"freshner/img2_c.png\",\r\n  \"freshner/img2_d.png\",\r\n  \"freshner/img2_e.png\",\r\n  \"freshner/img2_f.png\"\r\n]\r\n', 'Jasmine extract, aqua, ethanol, fragrance, preservatives', 320.00, 'White', 'FLORETTA INDIA', 'Liquid', 'Manual Spray', 'Bulk pack of jasmine freshener spray ideal for large spaces. Natural scent, safe, and easy application.'),
(3, 'Rose Room Freshener 500ml', 'Rose', 500, 500.00, 600.00, 100.00, 1, 0.00, 30, 4.6, 856, 'freshner/img3_a.png', 'freshner', '2025-05-22 01:23:14', '2025-05-22 01:23:14', 'Experience the timeless aroma of fresh roses.', 'Adds a romantic and luxurious fragrance to any room.', '[\r\n  \"freshner/img3_a.png\",\r\n  \"freshner/img4_b.png\",\r\n  \"freshner/img4_c.png\",\r\n  \"freshner/img4_d.png\",\r\n  \"freshner/img4_e.png\",\r\n  \"freshner/img4_f.png\"\r\n]\r\n', 'Rose extract, aqua, ethanol, fragrance, preservatives', 200.00, 'White', 'FLORETTA INDIA', 'Liquid', 'Manual Spray', 'SAFE FORMULATION: Chemical-free room freshener spray without harmful gases or CFCs, making it suitable for use around pets and children. NATURAL FRAGRANCE: Delightful rose fragrance that creates a pleasant and welcoming atmosphere in any room. GENEROUS SIZE: 500ml bottle capacity provides long-lasting freshness for extended use. CONVENIENT APPLICATION: Easy-to-use spray bottle design allows precise and targeted application in any space. VERSATILE USE: Suitable for multiple rooms including bedrooms, living areas, bathrooms, and office spaces.'),
(4, 'Rose Room Freshener 5L', 'Rose', 5000, 850.00, 950.00, 100.00, 1, 0.00, 20, 4.6, 856, 'freshner/img4_a.png', 'freshner', '2025-05-22 01:23:14', '2025-05-22 01:23:14', 'Bulk-size rose freshener for consistent, elegant scenting.', 'Recommended for large venues, events, and hospitality use.', '[\r\n  \"freshner/img4_a.png\",\r\n  \"freshner/img5_b.png\",\r\n  \"freshner/img5_c.png\",\r\n  \"freshner/img5_d.png\",\r\n  \"freshner/img5_e.png\",\r\n  \"freshner/img5_f.png\"\r\n]\r\n', 'Rose extract, aqua, ethanol, fragrance, preservatives', 350.00, 'White', 'FLORETTA INDIA', 'Liquid', 'Manual Spray', 'SAFE FORMULATION: Chemical-free room freshener spray without harmful gases or CFCs, making it suitable for use around pets and children. NATURAL FRAGRANCE: Delightful rose fragrance that creates a pleasant and welcoming atmosphere in any room. GENEROUS SIZE: 500ml bottle capacity provides long-lasting freshness for extended use. CONVENIENT APPLICATION: Easy-to-use spray bottle design allows precise and targeted application in any space. VERSATILE USE: Suitable for multiple rooms including bedrooms, living areas, bathrooms, and office spaces.'),
(5, 'Jasmine Face Mist', 'Jasmine', 100, 350.00, 400.00, 50.00, 1, 0.00, 60, 4.6, 856, 'freshner/img5_a.png', 'face_mist', '2025-05-22 01:23:14', '2025-05-22 01:23:14', 'Hydrating face mist infused with jasmine essence.', 'Revitalizes and soothes your skin throughout the day.', '[\r\n  \"freshner/img5_a.png\",\r\n  \"freshner/img3_b.png\",\r\n  \"freshner/img3_c.png\",\r\n  \"freshner/img3_d.png\",\r\n  \"freshner/img3_e.png\",\r\n  \"freshner/img3_f.png\"\r\n]\r\n', 'Jasmine water, aloe vera, glycerin, natural oil extracts', 150.00, 'Transparent', 'FLORETTA INDIA', 'Mist', 'Pump Spray', 'Gentle jasmine mist to hydrate and refresh skin. Cools, tones, and revitalizes with every spray.'),
(6, 'Rose Face Mist', 'Rose', 100, 850.00, 1000.00, 150.00, 1, 0.00, 25, 4.6, 856, 'freshner/img6_a.png', 'face_mist', '2025-05-22 01:23:14', '2025-05-22 01:23:14', 'Gentle rose mist for soft, glowing skin.', 'Can be used as toner or daily skin refresher.', '[\r\n  \"freshner/img6_a.png\",\r\n  \"freshner/img6_b.png\",\r\n  \"freshner/img6_c.png\",\r\n  \"freshner/img6_d.png\",\r\n  \"freshner/img6_e.png\",\r\n  \"freshner/img6_f.png\"\r\n]\r\n', 'Rose water, witch hazel, glycerin, vitamin E', 160.00, 'Pink', 'FLORETTA INDIA', 'Mist', 'Pump Spray', 'Hydrating rose facial mist with soothing properties. Great for all skin types, use anytime for a glow.');

-- --------------------------------------------------------

--
-- Table structure for table `how_it_works`
--

CREATE TABLE `how_it_works` (
  `id` bigint UNSIGNED NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subtitle` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `image` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
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
  `id` bigint UNSIGNED NOT NULL,
  `image_path` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `hover_image_path` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
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
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `image_hover` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `old_price` decimal(10,2) DEFAULT NULL,
  `rating` decimal(3,2) NOT NULL DEFAULT '4.00',
  `reviews` int NOT NULL DEFAULT '0',
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
  `id` int UNSIGNED NOT NULL,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL
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
(55, '2025_05_22_065213_create_freshner_mist_table', 20),
(56, '2025_06_03_054103_create_bar_packages_table', 21),
(57, '2025_06_03_152730_create_bar_packages_table', 22),
(58, '2025_06_05_082133_create_bookings_table', 23),
(59, '2025_06_05_085455_create_bar_packages_table', 24),
(60, '2025_06_05_160151_create_bar_packages_table', 25),
(61, '2025_06_09_055628_create_room_freshner_table', 26),
(62, '2025_06_09_102603_create_contacts_table', 27),
(63, '2025_05_25_000000_create_admins_table', 28),
(64, '2025_06_13_161134_create_carts_table', 29),
(65, '2025_06_15_051019_add_product_fields_to_carts_table', 30),
(66, '2025_06_16_191539_create_personal_access_tokens_table', 31),
(67, '2025_06_16_191646_create_personal_access_tokens_table', 32),
(68, '2025_06_21_152041_create_admins_table', 33),
(70, '2025_07_10_154359_create_users_table', 34),
(71, '2025_07_11_151341_add_user_id_to_carts_table', 35),
(72, '2025_07_12_082758_create_wishlists_table', 36),
(73, '2025_07_15_152851_add_multiple_addresses_to_users_table', 37),
(74, '2025_07_22_165745_create_orders_table', 38),
(75, '2025_07_22_165947_create_orders_table', 39),
(76, '2025_07_26_134528_create_admins_table', 39);

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` bigint UNSIGNED NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `razorpay_order_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `razorpay_payment_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `volume_ml` int DEFAULT NULL,
  `Discription` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` decimal(8,2) NOT NULL,
  `original_price` decimal(10,2) DEFAULT NULL,
  `discount_amount` decimal(10,2) DEFAULT NULL,
  `is_discount_active` tinyint(1) DEFAULT '0',
  `delivery_charge` decimal(10,2) DEFAULT '0.00',
  `available_quantity` int DEFAULT '0',
  `old_price` decimal(8,2) DEFAULT NULL,
  `image` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `flag` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `about_product` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `rating` decimal(3,1) NOT NULL,
  `reviews_count` int DEFAULT '0',
  `reviews` int NOT NULL,
  `note` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `features` text COLLATE utf8mb4_unicode_ci,
  `extra_images` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `ingridiance` text COLLATE utf8mb4_unicode_ci,
  `ingredients` text COLLATE utf8mb4_unicode_ci,
  `profit` text COLLATE utf8mb4_unicode_ci,
  `launch_date` date DEFAULT NULL,
  `scent` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `colour` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `brand` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `item_form` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `power_source` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `about` text COLLATE utf8mb4_unicode_ci
) ;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `volume_ml`, `Discription`, `price`, `original_price`, `discount_amount`, `is_discount_active`, `delivery_charge`, `available_quantity`, `old_price`, `image`, `flag`, `about_product`, `rating`, `reviews_count`, `reviews`, `note`, `created_at`, `updated_at`, `features`, `extra_images`, `ingridiance`, `ingredients`, `profit`, `launch_date`, `scent`, `colour`, `brand`, `item_form`, `power_source`, `about`) VALUES
(1, 'Flower Valley Perfume', 100, 'A delicate blend of jasmine, rose, and vanilla that lingers softly on your skin, evoking timeless elegance and charm.', 650.00, 800.00, 150.00, 1, 0.00, 40, 800.00, 'product/img1.png', 'perfume', 'A timeless fragrance blending crisp citrus with soft musk, capturing the essence of fresh morning dew and a hint of jasmine for a subtle yet lasting impression.', 4.8, 0, 856, 'floral', '2025-05-09 18:30:00', '2025-05-21 06:31:48', '\"Long-lasting and luxurious.\"', '[\r\n  \"pdt_info/img1a.png\",\r\n  \"pdt_info/img1b.png\",\r\n  \"pdt_info/img1c.png\",\r\n  \"pdt_info/img1d.png\",\r\n  \"pdt_info/img1e.png\"\r\n]\r\n', 'Alcohol, Jasmine, Musk', 'Alcohol, Jasmine, Musk', '120', '2025-05-10', 'Jasmine Breeze', 'Blue', 'Floretta India', 'Spray', 'Manual Spray', 'Refreshing jasmine scent in a chemical-free spray. Ideal for bedrooms and living rooms. 500ml easy-spray bottle with long-lasting fragrance.'),
(2, 'Gilli Mitti Perfume', 100, 'Warm amber notes combined with hints of sandalwood and patchouli create a sensual and mysterious aura perfect for evening wear.', 350.00, 500.00, 150.00, 1, 0.00, 30, 500.00, 'product/img2.png', 'perfume', 'An enchanting bouquet of wild roses and sweet vanilla with warm amber undertones, designed to evoke romance and sophistication in every spritz', 4.6, 0, 856, 'woody', '2025-05-06 18:30:00', '2025-05-21 06:31:48', '\"Earthy and grounded tones.\"', '[\r\n  \"pdt_info/img2a.png\",\r\n  \"pdt_info/img2b.png\",\r\n  \"pdt_info/img2c.png\",\r\n  \"pdt_info/img2d.png\",\r\n  \"pdt_info/img2e.png\"\r\n]', 'Clay, Citrus, Herbs', 'Clay, Citrus, Herbs', '140', '2025-05-07', 'Sandalwood Essence', 'Brown', 'Floretta India', 'Liquid', 'Manual Spray', 'Earthy sandalwood aroma that soothes the mind. Safe for use around pets. Premium 450ml spray bottle for consistent freshness.'),
(3, 'Coco Fudge Perfume', 100, 'Fresh and invigorating, this perfume bursts with zesty lemon, bergamot, and grapefruit, delivering a refreshing daytime fragrance.', 560.00, 750.00, 190.00, 1, 0.00, 35, 750.00, 'product/img3.png', 'perfume', 'A refreshing fusion of green apple, mint, and lavender, perfect for those seeking a vibrant and energizing scent that brightens the day.', 4.8, 0, 856, 'sweet', '2025-04-29 18:30:00', '2025-05-21 06:31:48', '\"Choco-sweet and creamy.\"', '[\r\n  \"pdt_info/img3a.png\",\r\n  \"pdt_info/img3b.png\",\r\n  \"pdt_info/img3c.png\",\r\n  \"pdt_info/img3d.png\",\r\n  \"pdt_info/img3e.png\"\r\n]', 'Cocoa, Vanilla, Sandal', 'Cocoa, Vanilla, Sandal', '180', '2025-04-30', 'Mint Citrus', 'Green', 'Floretta India', 'Spray', 'Manual Pump', 'Invigorating mint and citrus combo. Eco-friendly, alcohol-free formula. Suitable for office and bathroom spaces.'),
(4, 'Gulaab-e-Heer Perfume', 100, 'An opulent fusion of rich oud, spicy saffron, and creamy vanilla that transports you to exotic Arabian nights.', 650.00, 800.00, 150.00, 1, 0.00, 45, 800.00, 'product/img4.png', 'perfume', 'Deep notes of sandalwood, patchouli, and exotic spices harmonize in this luxurious scent, crafted for confident, bold personalities.', 4.6, 0, 856, 'floral', '2025-04-22 18:30:00', '2025-05-21 06:31:48', '\"Romantic rose bouquet.\"', '[\r\n  \"pdt_info/img4a.png\",\r\n  \"pdt_info/img4b.png\",\r\n  \"pdt_info/img4c.png\",\r\n  \"pdt_info/img4d.png\",\r\n  \"pdt_info/img4e.png\"\r\n]', 'Rose, Patchouli, Amber', 'Rose, Patchouli, Amber', '160', '2025-04-23', 'Rose Garden', 'Pink', 'Floretta India', 'Liquid', 'Manual Spray', 'Elegant rose fragrance with a fresh garden feel. Perfect for daily home use. 500ml sprayer for wide coverage.'),
(5, 'Coffeenut Perfume', 100, 'A harmonious mix of peony, lily of the valley, and gardenia, capturing the essence of a vibrant spring garden.', 560.00, 700.00, 140.00, 1, 0.00, 50, 700.00, 'product/img5.png', 'perfume', 'Soft peony petals meet hints of creamy coconut and gentle musk to create a light, airy fragrance that lingers like a gentle summer breeze.', 4.6, 0, 856, 'sweet', '2025-04-15 18:30:00', '2025-05-21 06:31:48', '\"Caffeine-rich and spicy.\"', '[\r\n  \"pdt_info/img5a.png\",\r\n  \"pdt_info/img5b.png\",\r\n  \"pdt_info/img5c.png\",\r\n  \"pdt_info/img5d.png\",\r\n  \"pdt_info/img5e.png\"\r\n]', 'Coffee oil, Cardamom, Cedar', 'Coffee oil, Cardamom, Cedar', '200', '2025-04-16', 'Vanilla Musk', 'Cream', 'Floretta India', 'Mist', 'Manual Spray', 'Warm vanilla scent with a hint of musk. Chemical-free, safe around kids. Great for bedrooms and wardrobes.'),
(6, 'Sandal Spirit Perfume', 100, 'Crisp sea salt and marine accords blend with subtle jasmine and musk, evoking the calm and freshness of the ocean breeze.', 560.00, 650.00, 90.00, 1, 0.00, 38, 650.00, 'product/img6.png', 'perfume', 'A seductive blend of blackcurrant, violet, and vanilla bean, creating a mysterious and captivating aura that draws attention effortlessly', 4.6, 0, 856, 'woody', '2025-04-08 18:30:00', '2025-05-21 06:31:48', '\"Cool sandal touch.\"', '[\r\n  \"pdt_info/img6a.png\",\r\n  \"pdt_info/img6b.png\",\r\n  \"pdt_info/img6c.png\",\r\n  \"pdt_info/img6d.png\",\r\n  \"pdt_info/img6e.png\"\r\n]\r\n', 'Sandalwood, Vetiver, Lime', 'Sandalwood, Vetiver, Lime', '170', '2025-04-09', 'Ocean Mist', 'Teal', 'Floretta India', 'Spray', 'Manual Pump', 'Clean oceanic scent in an eco-friendly mist. 400ml bottle perfect for bathrooms and guest areas.'),
(7, 'Zest of Summer Perfume', 100, 'Sweet vanilla perfectly balanced with warm cinnamon and clove spices for a comforting and cozy scent.', 560.00, 850.00, 290.00, 1, 0.00, 33, 850.00, 'product/img7.png', 'perfume', 'Inspired by oceanic freshness, this fragrance combines sea salt, driftwood, and crisp bergamot to transport you to a serene coastal escape.', 4.6, 0, 856, 'citrus', '2025-04-01 18:30:00', '2025-05-21 06:31:48', '\"Citrusy summer vibe.\"', '[\r\n    \"pdt_info/img7a.png\",\r\n    \"pdt_info/img7b.png\",\r\n    \"pdt_info/img7c.png\",\r\n    \"pdt_info/img7d.png\",\r\n    \"pdt_info/img7e.png\"\r\n  ]', 'Lemon zest, Orange, Musk', 'Lemon zest, Orange, Musk', '190', '2025-04-02', 'Lavender Fields', 'Purple', 'Floretta India', 'Liquid', 'Manual Spray', 'Lavender-infused freshness for relaxation and calm. Designed for bedroom and spa use. Alcohol-free, 450ml spray.'),
(8, 'Rose Garden Perfume', 100, 'Dark rose petals intertwined with blackcurrant and musk offer a deep, seductive fragrance that captivates after dusk.', 570.00, 700.00, 130.00, 1, 0.00, 36, 700.00, 'product/img8.png', 'perfume', 'Rich notes of caramel, tobacco, and leather combine with subtle floral hints, delivering a warm, inviting scent perfect for evening wear.', 4.7, 0, 856, 'floral', '2025-03-25 18:30:00', '2025-05-21 06:31:48', '\"Floral with a garden breeze.\"', '[\r\n    \"pdt_info/img8a.png\",\r\n    \"pdt_info/img8b.png\",\r\n    \"pdt_info/img8c.png\",\r\n    \"pdt_info/img8d.png\",\r\n    \"pdt_info/img8e.png\"\r\n  ]', 'Rose petals, Mint, Dewdrop', 'Rose petals, Mint, Dewdrop', '150', '2025-03-26', 'Citrus Burst', 'Yellow', 'Floretta India', 'Spray', 'Manual Spray', 'Uplifting citrus scent to energize any room. Best for kitchens and workspaces. Gentle, natural ingredients.');

-- --------------------------------------------------------

--
-- Table structure for table `room_freshner`
--

CREATE TABLE `room_freshner` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `image` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `room_freshner`
--

INSERT INTO `room_freshner` (`id`, `name`, `image`, `created_at`, `updated_at`) VALUES
(1, '5L Jasmin Fragrance', 'hotelamenities/5L_rose.png', '2025-06-09 00:32:24', '2025-06-09 00:32:24'),
(2, '5L Rose Fragrance', 'hotelamenities/5L_jasmine.png', '2025-06-09 00:32:24', '2025-06-09 00:32:24');

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('0cMYRGvkrnzTxXzVqJUwaLitkt64kgi42OhU9r0X', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiN2xQYjJxYmwzNlhOWUhUQllGMzk4RGkwcUk4aXZxSEw0dmtPUHpzYSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzQ6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvaG9tZXBhZ2UiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1750102155),
('0NHkVUZkjXqVzvTk04AypXDhBupr45mPuT1QimxC', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiS3E1ZHZLWDgzMzRNYnpXb3NGQmJPdjRFNnhhSEthTVV0aWdKRVJuOSI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1750131066),
('0QcnXQvBJpk0WgX7qp4iUpj45pI4HkfzOqrxcTap', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoidW1VaE9lcjFrZWlkWjVwMk1iVFBjaFRkOVV4cUpoZEFGT2tGZTY0diI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzQ6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvaG9tZXBhZ2UiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1750102157),
('0yTcCjP5MtvNqbXoBDTfCONisVrodW7GJXcQbvdJ', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiM2pseWo2NjV0RjRyMXhUcklqZWJHNWR1azZxZmZVeTVzVmtWc1NmMCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvcm9vbS1mcmVzaG5lcnMiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1750102285),
('1aZOb2dy3zWyYb60N655dL388dbyeKPDdpvnUsjX', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoid0xONVdybGlyczYwYUxVN1F5eEVpVjluRmJRZ3FPTFpsajN5NUlsZyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDQ6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvZnJlc2huZXJzLW1pc3QtYWxsIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1750102545),
('2d4p7ItfUNUXIqSCO5M1estAM96QJlDHGcwXMzZa', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoib0htN0w2U2hWRVNMdUNnWmU1ejllWTJRRVQ2aUJVS1RNejVOQzVoeCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDM6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvcHJvZHVjdHM/bm90ZT1hbGwiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1750130947),
('2qYeEZ9e7mwTmMLDmCQiVqmPPMfRBsXKFuc798od', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoibUZ2TnZKdnlhR0xoMlpnRVJiV0VuUW9ZWW1pajMxcjZrNWR0YjlwZSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDQ6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvZnJlc2huZXJzLW1pc3QtYWxsIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1750102892),
('3boLLucaPLtENLHNZYa45mC1HCLaNPYSYcXbTE1l', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiYkg1Y0NnYnBoZ1lLTHpCenpmRW1nU1d4eXU4ejFxT1JSdUJVNHJuaiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvY2FydCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1750102905),
('3isVwjLhNsvcdsP1iVHdHlZefsi2xK8Bw70So8dv', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoibFZMTW1nbHEwQmhacWJHZm9iMGxIalF3ZlkwYzBobUhpNzdidzFURiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvcm9vbS1mcmVzaG5lcnMiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1750102286),
('3wDY8OueQYVhC6a6JxR5KsSeRMWZghom3DZ0txOb', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoic3JWaVNtdUpROWwyTzJBRTJTbE5HMnNWVldTYmJvRDNDc1Zwb1VERiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6Mzc6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbGl2ZXBlcmZ1bWUiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1750102501),
('4mWcaUQv8x3f1J7RkCEoF0rUt5uCEcclvRGZvY9O', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiUG9hbVpvczdoRnRZamcxQ3ZWNWxKNnFLZHVFbVFoQWk2RDhLZ09lNiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDQ6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvZnJlc2huZXJzLW1pc3QtYWxsIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1750102664),
('4z3kKgWgNd8BfGxe6jsq87ErYDyIB7KNRLZyJ64O', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiVXhITTltOG9GNGgzSko2QjJQZWdSazNyeWNhaGJPenc3d1RPTHA1TSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDM6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvcHJvZHVjdHM/bm90ZT1hbGwiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1750102939),
('56cVHCqXleUMnAnPp1812tWuYtsxZLkZeLTzWfHF', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiMk40d2hiQkdGcEM1TmdFME93Slk0R3ZKNzRRQkhVenk5VW5lVWtBRyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDQ6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvZnJlc2huZXJzLW1pc3QtYWxsIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1750103155),
('5BKHahYKGqJ06JrdaDYSNmhOKn9peHFoGfBKUZyQ', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiYVdCTld3c3AzMkpRTjd4RFdSa1FhSHNsenV2UWZhMGNrdzJBcHMzbCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDM6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvcHJvZHVjdHM/bm90ZT1hbGwiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1750102546),
('5eqrV9iYHTkzBdGOHcOVrqND0woMTSI6F6PZ18Yu', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiTEZXajZDd2M5N2RoWTczZ2QxS0RTMWJoc2Z0Q2F3YUxzdHJNTWRYTCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzQ6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvcHJvZHVjdHMiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1750102501),
('5mpCPdLtHcHJbVmUIXhAtnx0hqVpymr0H0J1qxi8', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoib0xWNzE2Y3BhVDNFTVFIRlM0ZThRVjFqbFB4dGdUZUlnUlZYdXdTTiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDQ6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvZnJlc2huZXJzLW1pc3QtYWxsIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1750102526),
('6En1WQKul0C2xBRHnABePN02ejO3x03MvHvh9R70', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiWXNZSUxZaXRodFdCZjVYQ252S3NJTmYyd0FiN3ptZ2tXUWNyUkFkVyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzQ6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvaG9tZXBhZ2UiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1750102155),
('6oC19E6FJVFKht1C3jq1RCodrfyafQPtJnI7YVyh', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiaVlVaW1UdkI1TW9VOFdZM0paZDZZZHpZNXVJNEpKZWNHa1lhWFdxQiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDM6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvcHJvZHVjdHM/bm90ZT1hbGwiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1750103155),
('6YUSUp2yZCMda39Ln6f0NwpdigIv2KWvTUCgSKG6', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZnFYTEdvS2YzUWgxcVZyMUVrb3haa2dtcllRWXB0ZmpGOW5kekNlTiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDM6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvcHJvZHVjdHM/bm90ZT1hbGwiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1750103155),
('76IbK9RsiI4dKlr00IJcZ5mLNCF0VPSC4J6ILWn0', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoieGJ6NWZGUHlUSFhHS29FYWR4c0hOcDQyUksxazFRU3JidWZrTHNnViI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDM6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvcHJvZHVjdHM/bm90ZT1hbGwiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1750103043),
('7AUhIufjqJOHvna2yqSda5JGwfRNsckgoBfGaRu4', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiUG41dTAxZVBGU0FQQnVMOHlEN2gyMWV4a1c2WGFKT2VzdFJVVWc4USI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDY6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvZnJlc2huZXJzLW1pc3QtYWxsLzIiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1750102896),
('94sAwwo1iaad4qr53IH0AyGZ2IcDGNJ6tX7nJlrA', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiVnFYTUVYOVhKdE5EcGRXNW9ZSXJKbFYxWkgzTHBBd0hNNzFTT2J3WSI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1750131267),
('9VacoUwSSn8S2YcFzflcVv91shyZcRlrs6iorzB3', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiUkVIUU1hbGgwdE1HSWk1ckdGbnViemVhaXBzZVF6UkhpMlNGQmR0eiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvcm9vbS1mcmVzaG5lcnMiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1750103485),
('AMEHaMiuSRRXUM68y0KVY083FRvWOFgNeSb3FsKR', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiQ1BxR01Sb0ZiU0hESW1CY1JxdGp5bkFIdktPaFNIYjI0cVlsZmhKSyI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1750103281),
('AWYPEkRZElA8IuyTAhTVwomQgA0DFGSc0EuECM8M', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiOVZqUTJoRzhqN2VGcFpZZTZOVkpNMmswQVJXRzdkejRJSmNiY2NwZCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDQ6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvZnJlc2huZXJzLW1pc3QtYWxsIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1750102938),
('b5so50ONxpD6hQzNr4YiL70eNj7LJPG2nYkoR6in', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiaFVqTnRTb0I4U05nN0JDdnpwTVYwNmRSMGdMTEprODkyVm01V1NxTyI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1750130951),
('bqOKSqKZzENEuZMEHPZjGYxRsstjclM3iIjbX3Ud', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoibUZLRFRnUzFlWHFFS25Hc2IwMTNYdGtnbzFNeThoMzNXdHhYNXIyRCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzQ6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvaG9tZXBhZ2UiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1750102159),
('CBV8VWF2AvstRZmkP6iQpgduQ7r7sq5V7D37MYFz', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiMzJpTlJHb0gxVTJKZGZlOER2QzBubmVTR05aSUNiWmxoQ1g5dW1ScCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvY2FydCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1750102936),
('cCuany38iHujeCUjm3d7N8z6FCfI1jow3Uh6ZkCx', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiYm9zaUpGRWM2YTFEcVFjT3VLakFvUElDakQySWNsY0IyM0pCVHJRbSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDQ6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvZnJlc2huZXJzLW1pc3QtYWxsIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1750102665),
('CL1jUnecO5fojdXeqj1TxhJJ8iv8hrhIjSHuvNac', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoicnRFUWtBdXlGMFVlYmxGckhqUlpZTU5LdW1uYTJWWGtMQ0FTdGVlSSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDM6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvcHJvZHVjdHM/bm90ZT1hbGwiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1750102173),
('Cyn3k5m73M6UAluvSj1WNXhOZ87xIv18D2pmuyno', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiN1NSTnhrOE5KRkllbEhjSmpqcm1PcFZtcWNGUDRaMGF5WFNUZG9kVSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDQ6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvZnJlc2huZXJzLW1pc3QtYWxsIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1750130947),
('cZMivC9tRHtFlX6wVvp1o27or7WSkuwDbd6Obcht', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiaDVoV3RNN2pRc285aXhnZW1vT0hWajlLZ2RNbVduS2xQQWFaa0ViTyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzQ6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvcHJvZHVjdHMiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1750102416),
('DkWwYi9PKl1O5r8x7rsbdOQMBbJqOswtcahyOn95', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiTXZHRlJVVnhQUXk4UXZhNGtmM0JBTGJ3MkMzY3RZdVh3ajdiS3hBYSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzQ6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvaG9tZXBhZ2UiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1750102158),
('DNcJ7NZZCzyrilV7ES0NAyONGmjG6ZTcVAitpXgX', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiS09IaVFSdnRHUXlUeXhZc3kwOUdzd3NiVGE0ZnpVNzdabzVMclFHViI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6Mzc6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbGl2ZXBlcmZ1bWUiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1750102314),
('DNUPAp27Sw5bwh8ARGedVYOrjorAlUy4uGGIU4hQ', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiMHgyTWE4NWhLNkc4cmM0WkF1cVNrdHNmQUJPR0M2OEhFZjZ3T1o5TiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDQ6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvZnJlc2huZXJzLW1pc3QtYWxsIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1750131062),
('dohByJyNE8vLk5KopyjUZu64Gwa718h7dPfHRFXT', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiOERaSVM0M1FSTExJbFpJNHJpQUZHZnpHZzVYT3lEUjA0VEFjaUJWZCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDM6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvcHJvZHVjdHM/bm90ZT1hbGwiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1750103276),
('dt5M39WVCsiIOGM9w7OjorNYRCTpIdONFjxMrQ1n', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiWDVKOHE0YUxCRWtnUWdrUnpPR2xlZWh5VGpWZXlYS1lPM0U0UWRRZCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDY6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvZnJlc2huZXJzLW1pc3QtYWxsLzYiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1750102171),
('dUjR8ml8OEScPct47CgZoaiIgXHQB9fiBSKbE5aI', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiT0FCa3RLbTFTVTdxcmM3Tmt5Qk1qdVhnb0JqUVMxNTI2WTJwZlZEdyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDM6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvcHJvZHVjdHM/bm90ZT1hbGwiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1750102191),
('dx8aTGGb8gM9zCptQXKYFkBP6afwAWlPRtsm1Wey', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiRk80bU1yWHFTRmdMVXJoWWRFeXhlWXJnTFNSR21Ud0ExOURVVzNUQyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDQ6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvZnJlc2huZXJzLW1pc3QtYWxsIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1750131264),
('dzqzKuz5Wt00eBR5VMb3enhZkQ4HDE36hMHwaykN', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiWDZkcGNSZXJjT1NQQzFWWnJ4QmFNUXNQRGt0UzdsVVI3SDFvNDl0WCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDM6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvcHJvZHVjdHM/bm90ZT1hbGwiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1750102900),
('EKvVUDwQd7A6TExi7hUYdlaTIhcfzomgq4QkkGTY', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiRjFnb0NJUEFZRXpvTHRnM1l4NThSWm10Sm13VnUzUWlDb0pwYnZTNCI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1750103050),
('EThzw9D3avwNTf0qon1gYLzumA1caIFcwt7AsO2y', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZzgwMlVyWTRpVzFWNTdPZTh4UEU5NTNGbUtZUnNnZ3BFMzdkdGg5NyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDM6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvcHJvZHVjdHM/bm90ZT1hbGwiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1750102892),
('eTUO9JCc7eoXtmCYNQl6dvWCPhrpQNof8npl1yoJ', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoibHludTlXVWd1M25Najh2T2NveGZ4bDVodGZ4VFp0N2JtVjQ0bHJRSyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDQ6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvZnJlc2huZXJzLW1pc3QtYWxsIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1750103044),
('Ewhn2b5dmwZmAUn23eqy6z8mmQeCepZUnrypoYrI', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiWWtINTJ1b0kwU1h0anp4RERMQVkyOHZJZklCZGZEazRCeXZzaDlWZCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDQ6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvZnJlc2huZXJzLW1pc3QtYWxsIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1750102893),
('F1Bo4MbROeCvSXT1TGkL5rLaTbL8nrzsLwU9dHmf', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoic3VFVWNKb3NBTHc2Zm5aT0dXVFdnbzBtekN5ZzVRZW9nekFkd3c2bSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6Mzc6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbGl2ZXBlcmZ1bWUiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1750102313),
('famnbf5HaGAUGbws9zCpEA9kgBIZDrVM2WKZDd1h', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiNUVGQmdIQVBnb3g5WkhQQlpXekxxbzUyTVRMRmh5UFByNU1wa2c5VyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDM6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvcHJvZHVjdHM/bm90ZT1hbGwiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1750102174),
('FboztE1pMdwE6cYv99ntF0WE8xe14U1hEAxmOYue', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoibGZ4Wm1qZEZ2dm85S2VpSEsyZFJFUk8yWnFhQjhoeG10YmFZM3hmcyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvcm9vbS1mcmVzaG5lcnMiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1750130944),
('fVoQ2c0mixZX6fhsj2r9PlUYIgLrLRbO4EUFUO9B', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiOEQya0N1a3J2VlZDZnZJY3FOMENxbEYyZ0R0dU5PMUtOblN6MGRvWSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzQ6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvcHJvZHVjdHMiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1750102415),
('guf7ae7cBB0QZ4FCAYvM88jgyX0pW4yvAIg9SFxg', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiT214ZXZrck9pZnhMU3pvVG1nR1M0bmp0UmlSWWFYSEdtUWJDSFExUiI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1750102761),
('gXrXAfnKssO2dfmVNF6gaRLEsenhHWEfTyVzgkjN', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiVTFIbmd2UzlZcFRnMmZaQzBvSk1rQ3lXQXhXWlNlbFdEUVdqTXA4TCI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1750103158),
('hQxDR1ZkIE5QjnMHQ9lNxg5DfOTxzShmUD9j8gU2', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiUzJJQVF2SThtSGpxOU5wTkkzN2RlVXExcDBndXRxbE0zb0FlSUxoVSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDQ6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvZnJlc2huZXJzLW1pc3QtYWxsIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1750103154),
('I7smpTtmGRgDVE6zwuR8FYqwiSyzo3X0Eo1IjtNJ', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiY0tBeGhaS0doc1BTZHZtTm9lUnROcTB0WlFWSjhTYXVtQncxNHRjTiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDQ6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvZnJlc2huZXJzLW1pc3QtYWxsIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1750102174),
('iqhfcUK8FjjAUopP5hRTAMoBlsEUL6GKSUE3JzJ5', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiTUNRM2x1UHh6MGVsWFE0QXhqUXpXRE1wVXU2QWhuSHVzY0VnTUROZiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDM6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvcHJvZHVjdHM/bm90ZT1hbGwiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1750102758),
('IYU7FMYdCTJDBeuIFxSZ9onwY32M5Ut1n1Qg0ffb', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoidUN3elFGZWVoMXF3bnMydUxQWDlMZXpnc2drMTF0RGZNN1hMbHRXSiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDQ6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvZnJlc2huZXJzLW1pc3QtYWxsIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1750103043),
('j5MZgBcOkn8moRmBCUs9mll5jQyN7amGlIrLQuLi', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiNzNReWQ1N3V2ODNOQTlhcTYwalU4TlpIa1FtRUtNdkg0cnp3YXVkSSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDQ6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvZnJlc2huZXJzLW1pc3QtYWxsIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1750102546),
('JciEBA6YlIOUHzuRSXbRZ71XEtjfccxTGcEDcS5g', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiNjZ5QW5pOEl5bnZERGw0TTZCTGZPeENwelVSR3BrNWthTTZzS3B2bSI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1750102766),
('JEwYFn2d7urNHiT3DhrlfKKcesduK9X1tF4OZiRc', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZlB3M1laSjVwUldZSjlmeUYzRGVvc0wwQWkwWE91QXBKOXRXRnVEdSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzQ6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvaG9tZXBhZ2UiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1750102156),
('jF2bgE5iJHQQJpgtFynpKhoFlNLYm26PP1hHR828', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiTWt3TUhkczZ6UXgzQmtOMldMa3I3TkpialhVV3hiSzJXbHJNYmJ2dCI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1750102528),
('jWFoxA6Rs7kb8caCVF4Mxh7ibEwg4VShcuLnyZMZ', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoidWhoMml1bks2RTVRUnhqNHdJOUZPcXBkbGhIQXpiMVlNYW55SUdvMCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDM6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvcHJvZHVjdHM/bm90ZT1hbGwiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1750102901),
('kex70Q8MZDpFxRuoETISnZZHWEOvxpSSXO92wBld', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoibngzZWxybDFKM2tHU01yTWNvamxJdDZvdWRrcHZJU01ERTdralp4ZyI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1750102449),
('kSlSwPmBYfoR15KR1QZadgvAURGHtzIlSjQft3R1', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiaE11SmlqUlFBWW40U1dHdEoyNXUyN3pVS3h3U3pzRHJ3MHBkQjdVRSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDM6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvcHJvZHVjdHM/bm90ZT1hbGwiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1750102665),
('lApO1NQZxAKaWVXYWMQvGyeaNbGAA8ae0HySsmRO', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoibWVqZnV0MERHUFBlUDQ4OExvbUY2a0xqVzZRZzBSanpINmRrUGI3bCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDQ6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvZnJlc2huZXJzLW1pc3QtYWxsIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1750102536),
('LJFmzzXcTkbXqKRnE4Yf6m6xr4xsHObXAtsf26Xq', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoidVR6TkdCTnBVYThOaUtUQVFkZjI3Y0NMU1BBQW9VbkhRcjZIalNzcCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvY2FydCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1750102905),
('llp5c1LxcgbzJUqwyFQkOfxKsP6PTBDRrSyW3GIF', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoib2RkZzlBS3NWQTNCT0VsMlBIaUd3b3E0c2FvNndiWTh2U3B0bWhRWiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDY6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvZnJlc2huZXJzLW1pc3QtYWxsLzYiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1750102170),
('lrMFIiANk2ZPWxJd3MPTPiT2rtDML0UaZODnhw44', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiSDBRVlNwcnRHU3hsMkdybUk4SFJ2MVlNRW5EaWRBWU1OdEkxZTJQSiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDQ6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvZnJlc2huZXJzLW1pc3QtYWxsIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1750102190),
('mfetaKEtJrSA3dHmMptJjkIsMLHvhfLEDhTYwgY1', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiMm9RaW1TYjBtR1c3STZKRGJEZ3ZDbzJHUEs3bG16QUYxMVVrTExMWCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDQ6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvZnJlc2huZXJzLW1pc3QtYWxsIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1750131062),
('mSr8MsB7T9RCM6whpnZuRfrYNYPH1nzuokPUE47p', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiWHA4Y3M1QllJY1kybmtsa1dBaGFuUThXOEM3U2ZadVhPbm1IbHVuciI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDM6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvcHJvZHVjdHM/bm90ZT1hbGwiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1750131264),
('MTiOPAaAtYHMnV8Lmywy2floDYMKpXZGv9eU2r24', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiempnbFFXTnBqZ3VienVtek5vQzZtYlV3a04xVHBLQlFZZkhQNWtyeiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDQ6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvZnJlc2huZXJzLW1pc3QtYWxsIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1750102938),
('NDkbFXtgmeD9AlaQwNbldVZacE6I9dW1kryduSGb', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiQ1dDYTdya1VldlN3aEZ3ajFBTkY4cURpU1RzbzFsWFdjN2txNml1ZiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDQ6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvZnJlc2huZXJzLW1pc3QtYWxsIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1750130946),
('nEmxSIQIEQTyo8TaDjNGOV4MOXr6Bis8XJyR17iW', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiY2xwa0JIMHI5Y1F5YXhEWFRReEZ5YXNrdWlZVXVwZmJ6OU9pM1RkayI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDQ6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvZnJlc2huZXJzLW1pc3QtYWxsIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1750102503),
('Np0JtO1sR8TCtXEfERfcdUMc4MSx5uYO359HQZQD', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiVUNSSkpPS2ZTaWVkWlVIcHZzVXB4NGN5V054RktIR1ZwSHlwd0pyMCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDY6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvZnJlc2huZXJzLW1pc3QtYWxsLzIiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1750102896),
('NsxMXshRU05d2KRaWkaFzOZEO0EWUWyJ9NF21HM1', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiQnExcjlxb1VBRkcyYmd5enMxMmZHYlFuNjZQV0hSNFpOdkRxTENMVyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDM6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvcHJvZHVjdHM/bm90ZT1hbGwiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1750102758),
('NtBa9IpUKTFN67WdUdFhPdndRI24kBlWSoAd8BPl', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiTm03OVJ5T2F4eWlNbGFiazNTc1lSaGg2dDQyOVphQkE0TnAxaEVMNiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6Mzc6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbGl2ZXBlcmZ1bWUiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1750102500),
('Ntt8L3GIy3bMnFdD4dSYHUTdUiGGlij1FtQWFOI9', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiTVZpV0xVUGp6UnlXVEtxUG43eE9XSDNodlpibWdOSVBxQmZHRGc0WCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDQ6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvZnJlc2huZXJzLW1pc3QtYWxsIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1750102526),
('oavS7z8VDU2fZTXP70F1HmCi3FO0U8naOi1ntytj', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiWk1WQXBRdmZXS201SDRHWjNwbzIzNnhlNDJBMHBXUFVMd0hacUNVeCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDQ6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvZnJlc2huZXJzLW1pc3QtYWxsIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1750102757),
('Ohbw2qlhkiQeVFwgsz5XgjPYCVXZ2YMotixAiBrp', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiaGtpSTVrcGY1aG8yMEFTZzFNMW1zQlduYU4yZ1pzTnVMZkxFUlg5UyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDM6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvcHJvZHVjdHM/bm90ZT1hbGwiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1750102504),
('OkTHICJtrAFlYzFSDupagoK7zJYm3sO9YjK2lEOA', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoia2tGRm5LOGQwT1o2TjFadkNFQ25MaXkxOENNN0FhazRFNGhHb1hIbCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDM6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvcHJvZHVjdHM/bm90ZT1hbGwiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1750102938),
('okWAv3QjG1ae51njA0KDkoLeNCU8DLqCvYc4Bfh0', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiMzI5b1RrUEhETWVSa1pYMzdaUDNMYmpMZEgxVlFDUnVzTmFZa0VMWSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6Mzc6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbGl2ZXBlcmZ1bWUiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1750102415),
('oSYf3Xz0G3OU44LGRYVsZTpuVW2ouPjvCRqPgxCn', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiUTd5aExpNGpVWkZFYm1nV0IxNWZ6VFhGWTVRNnlsbUtKMkZmUTFPRSI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1750102547),
('p99ASBto7g1KJZUSPPhFv6z8tpl3sLu60zHB7fqa', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiV1lDd003YmNSalB5UVVJbTVxYURnV25jeEdnZnY5ZFNyUWgzcGFVVSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDM6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvcHJvZHVjdHM/bm90ZT1hbGwiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1750102526),
('pdeKFVo6uO5FWM3ZkgWWFFmsXAVxaBUvSWih72EY', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoib0hLaTRzelo0ZzFzZ3dCYlltZEJzUEJkbVJWODJFWDZWY3F4Zm8xOSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDQ6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvZnJlc2huZXJzLW1pc3QtYWxsIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1750102191),
('PeNSYoiuivclvFscyWk0503rFNCELA8ducxBXbEy', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoibTQyWWZaRnlwNjFudEVsam5QZTR0N2pmVlNQRk9YQVlpZjNhbmVpRSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDM6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvcHJvZHVjdHM/bm90ZT1hbGwiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1750102165),
('PH6QLvpA1gcJE20WuHPTog8N7VLISMZMr0AwD2I9', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoicUYzNjlnUW1TVkZ6RFpnZ016M0FRNlpHTERxU0l0WElubkVSeFlpRyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzQ6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvaG9tZXBhZ2UiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1750102159),
('PHSXvppoq8YhAOf6S3XflGxDu4jBeypjdDXuZmXv', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoibWs4aXNFakNORVVDdG0zVXowcWVIcW95WVM4RExrOXJwb1BhdlppOSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDQ6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvZnJlc2huZXJzLW1pc3QtYWxsIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1750102758),
('Pi5GVb4LLjuMX7kgH1PkeNhWfoRz1xQUSgQepnYr', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiNVdpS3BvOVAzeDZDOFlRSnpubnNuOUtMcjB6NjZORTR1Q0Z0ZXdTeiI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1750102941),
('pkWjqxSCRudRJBMbE1C2Q6MiMz4LJ9QmXlot2IWa', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiM2xoRFhGTnRJTTRKRGNqVmxVbmxuS1FSQnhsaGg3Nnp0Y3dmSW5EUCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDM6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvcHJvZHVjdHM/bm90ZT1hbGwiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1750102527),
('Pm8ihzTneXq2vppKAQ368JrSLBhEMsDaesLXC4vF', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoib0VkZng5N3NzQmtSeWxlYjMxTnpVdmRQZ3pRYlpGd09rNHdxWmw0WCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvY2FydCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1750102936),
('PmOS58ZhNmpYaNL5sQZhmq9GvWngHPoho5eF3hfJ', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiWUUyMUhBV1RTbTNISEc4d1VUSkN3VHl3Tk0waFFHa3dlOWozQmJrZSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDQ6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvZnJlc2huZXJzLW1pc3QtYWxsIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1750102504),
('PW7jbPwTF1AaqZlVqQmVQ21hBwahdmTKaCXnwkz2', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiVWV5bUtwbUJLQkF1M3ZyVVhZZ3FGc0hPZkJJYm5Bc1JxTVA1RG5nMyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDQ6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvZnJlc2huZXJzLW1pc3QtYWxsIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1750102900),
('Q3QU2H3Mv5wYHkfo5Mpa9totlyBN1v18hbjsJtLw', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiTzFLc2p6YW4zbUswQnV2WTNXbGpIYnRlQjVrbW54S1VrSU14ZTZXZiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvcm9vbS1mcmVzaG5lcnMiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1750130943),
('QdjEiBlflOyH33oVmBcybqkm3dZ3yWLLAZj3ksiG', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiYVNFaUw4OXRtbFowckwxRm5TekFDdDFUSm9kNjJnYXRZeE5pT3RyOCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDM6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvcHJvZHVjdHM/bm90ZT1hbGwiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1750103276),
('QDkoAfhBkbdLbmihFmOEFFhAQ0vlMIcEMR2ATjTg', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoicTdjZ0pnMERaTE92Ujc3dFVReEZpZmQ2c2VOcWlsZWhUVmcxanhNeiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzQ6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvcHJvZHVjdHMiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1750102313),
('qJUbA7P6uFZh7DU18ysK50i7A6NWETs7l5DZMVnZ', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiTjRWRW1OQVhmWnBqWDZZbkV3eVo2YkIwMkhqV1lkRlM3NmcydFJpNCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDQ6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvZnJlc2huZXJzLW1pc3QtYWxsIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1750102901),
('qzs78dJDpF73NEWq8ATm97rU2rrAKwmSgVrjjs1p', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiVUs3T0EzZVltaGlENExsMlRIbWdNT3RwTlBLdXpwbGFhcVdRRTBDYyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDQ6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvZnJlc2huZXJzLW1pc3QtYWxsIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1750102173),
('R7VQNTNEnIU5fINQ4Sun6aKbvvWAnsobXOMBaGlY', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiTWhzOHlRYnRrM3ozUkd3aXF2ME9BNVJSRGtWU2p1WHhld0F3T2JHNSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDM6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvcHJvZHVjdHM/bm90ZT1hbGwiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1750102537),
('rjubFFv716MZlm656EJNwZPAyaPEOPIEfbyw1lib', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiNHk2RHFwZmFvMDYzb3JkN0NSU0ZKcWZRcTNOQ3JGZTNTMWlQcHJVbiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDQ6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvZnJlc2huZXJzLW1pc3QtYWxsIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1750103276),
('rMC8kHeHuCsn7cadVv3hVN0HJXKJ9nagZE4tv4aa', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiQ09tMktSV2xXekNscVF2THlPYjZpckR4VlIzZndmV0psR1Y3aUtUOSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzQ6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvcHJvZHVjdHMiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1750102500),
('RRtJJTld8M4qSfT0hltauq7V8YB3NFIY08b8NUmR', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZVFURnR6ZHlUWHA0UEE4TE5ISVlPZEI5cDc0bzVBU2ZGWElqeUVVUiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDM6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvcHJvZHVjdHM/bm90ZT1hbGwiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1750102191),
('s2tO43UCB2ra7mMkVxznmqLZYNVQXtxwimT0IxKE', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiejZOMDVqbGVNd2VtbDdJYldZUHJwUzZ6SkVzeVlMempoaGhnaHNhaCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDM6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvcHJvZHVjdHM/bm90ZT1hbGwiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1750130947),
('S2y5Qx1xSSu1r1XtaPWRDyq3EGQRyF8qQT5Y63qi', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiaXJ5V2NsczI4TmM4RTdwQ21oY2s2TmF2bjVvNkN3MHp3YUtHYVJ4bCI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1750102301),
('S9i8Pzui5cPTpcb1sCLhMW3wsEteepOl1A0UbhpG', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiZkhmc2xQVUNoRzdpNFNFYTZSSkY1YXNlcVNCOWNWaXMya2oxT3dWVCI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1750102322),
('sjaM3tMnnIc7uYP9xUZpAhH8FD7yjhr5KOAet6Hk', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiMDZ2ekNINHpmVGNxZlF0aVdZWDV5MW1qR1ZNNVVwYlppMEl4V1V4USI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDQ6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvZnJlc2huZXJzLW1pc3QtYWxsIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1750103276),
('slgqsvXb0Us1ttrCGVjSYf0MX6zGYxPrbg0L9DHp', NULL, '127.0.0.1', 'PostmanRuntime/7.44.1', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiNEJyWVFuQVA0b0JBOVlxa2o1MENjMUdtTzU2RllDTjdyTEo1S0NPYyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1754225426),
('suOH0CsbeN95cbDAwHo7CyUftlG1h7nHQxJzfqXX', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiWmtPMTFGMmVZbEt3WXN5aGF3WnI2czZIVGgwVnRwSFBMNjNnb0o4UyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDM6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvcHJvZHVjdHM/bm90ZT1hbGwiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1750131265),
('swZNEdZI1uAywPfeAJZ4sVOEqW21aBkHs3vDjHbv', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoidFUxbUNPcnQ4WFJWMjBuRHhXdHdmT0c3ZU9nT0RJZTZTY3JTeEdyRCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDM6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvcHJvZHVjdHM/bm90ZT1hbGwiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1750102503),
('T39J7l12xZNG8uQHyeoZVZu1wKG5guRw6aqzF3Jg', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiMlpSSGplUHZoZXYwUll0Nzl5dFpYSjJTWWk5bzJpUThBOENpUXNqMSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDM6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvcHJvZHVjdHM/bm90ZT1hbGwiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1750102166),
('TD0M7y8fJvbeDBocS2h6UdQr14fdcug1Xj7HryMQ', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiRllNVVlQQm5ZNE5rT24wdVJaZ2pKOWpuVFd4ZlpyZDBGT0xnamtEbyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvcm9vbS1mcmVzaG5lcnMiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1750103485),
('tjzoLKIRiVaUqxkGoFRcxlQH97fbGoUsAEBobsti', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiSmNiZDhpVnp3cGd4b2dDU09oUGdSSEtjTW1qMXhtM1BMbTQ3S1JuMCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDM6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvcHJvZHVjdHM/bm90ZT1hbGwiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1750103044);
INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('TuP4c5yyah84OLvupgUJv79j7litA2wtkgnTIyaP', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiNU9FTHRyaldnMFZ2azZDMVVLVVg1cEhWaG8zRW5IZE9VdFZySG5sTSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDQ6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvZnJlc2huZXJzLW1pc3QtYWxsIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1750102537),
('u1TwczhjniroJ1LNiGjZdrTEZQFTJmCmtk3ukZi4', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoidjZqU1VVaGxUTGsxSG9jVjRwSUx5a0hSdlFtMFpIYnM2MUtXYWxCWiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDQ6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvZnJlc2huZXJzLW1pc3QtYWxsIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1750131264),
('UIKb4P7rZEfrzLhHZE2n9ofDSw9FqsP5MBAAuhdl', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiSDVDOElVV083Mjh1cktMeThObFpFVDFLNzBmSXRVaFU4NXloRHkwaCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDM6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvcHJvZHVjdHM/bm90ZT1hbGwiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1750102893),
('USb24pjNRhPGa8uSofhC0YWQ2b9Hy895nsovMdIq', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiRjNzVUVIaWhkdzZZeDY2dEtEUndqZDdaaWhtcWFMZTlCS0xTSHR6SSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDM6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvcHJvZHVjdHM/bm90ZT1hbGwiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1750131063),
('W9GrDT57lzjhZwnRQ0beB2Lr5dzn8Kcok5cXfH4n', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiRG8xOFUxMGZ5SER4RUhTRWU0Y3BYc0FhTmQ5VFcxTU1FVzE2YVBPMyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDQ6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvZnJlc2huZXJzLW1pc3QtYWxsIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1750102165),
('XCBI3r2s2xN6PqVd3IUujfczt506oiRAzUfKjTku', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiUGkxOWM4Y2g3SHdSRm1tYk1ubzRQR3c5TEpQRWxzSmJmWjRpWFhwSCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6Mzc6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbGl2ZXBlcmZ1bWUiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1750102416),
('XGf9FFP5IFuajD0FOAEZBuCToWQY28hiIkn8fc48', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiVUZXa3I5QndrMmI5eTlsZU5qSFpROW90UU5Sc0k2enJmVGpWOHJSQyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDM6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvcHJvZHVjdHM/bm90ZT1hbGwiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1750102665),
('yHiAT4BKgarnyfdU6FfV4MCckmJ6CoTSAFwmGaNf', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiWkswdkE4Qm5xQlFRM0h1bWJDRUN3MzdwUjNiVFF5MVY0Z2QxUmdxZiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDM6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvcHJvZHVjdHM/bm90ZT1hbGwiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1750102545),
('YtCmhVjHBr3hrJPQbW41hcJMGRmOjE3UV9YlBSpE', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoieTZPMVREZU9wck12SlJoZlZVa0FvTVBzSERIZW83UExoT05tWjdkZiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDM6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvcHJvZHVjdHM/bm90ZT1hbGwiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1750131062),
('zenh7ws4dW9JiL7DwGNbvt9bskhxjcGQxFhWo2XF', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiRDlrRW5EYU1QU09sdkh1ejRybnNONDV3WTJiak5ZSnJnQldlUTR4eCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDQ6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvZnJlc2huZXJzLW1pc3QtYWxsIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1750102166),
('zFuKnFkdrTs96q4W1dXMtQog9Tq3WGNkQtwgYDwP', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiYlNnN3dUMVl6OE15dUROSnpadmZyMGlHdVhJOEk4VkFiV3dONHhEOCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzQ6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvcHJvZHVjdHMiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1750102314),
('zjm6kTSt83iWgH7lrfVupq4Q3mkzTlRoTXdN30Wm', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiSGF2bHg5aWk4b1NrYlF4bnVZbUppRFRxT1d4V29wNTF4cEdGOW1ZZCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDM6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvcHJvZHVjdHM/bm90ZT1hbGwiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1750102537),
('zP3JHLd86yxbMKbuEGKkFusHb2H5QqIPPj6DKLaC', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoia2ltZWVMM3cwV09qd3pjQlhKTmNxeXhlN0ZORDd1ZUt1aUdDZWM3MSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzQ6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvaG9tZXBhZ2UiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1750102157);

-- --------------------------------------------------------

--
-- Table structure for table `sliders`
--

CREATE TABLE `sliders` (
  `id` int NOT NULL,
  `image` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `flag` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sliders`
--

INSERT INTO `sliders` (`id`, `image`, `created_at`, `updated_at`, `flag`) VALUES
(1, 'slider/slide1.png', '2025-04-26 06:59:10', '2025-05-14 18:53:35', NULL),
(2, 'slider/slide2.png', '2025-04-26 06:59:10', '2025-05-14 18:53:51', NULL),
(3, 'slider/slide3.png', '2025-04-26 08:12:21', '2025-05-14 18:54:04', NULL),
(4, 'slider/slide4.png', '2025-04-26 08:12:21', '2025-05-14 18:54:15', NULL),
(5, 'slider/slide5.png', '2025-04-26 08:12:21', '2025-05-14 18:54:25', NULL),
(6, 'slider/slide6.png', '2025-06-17 23:10:34', '2025-06-17 23:10:34', 'home'),
(7, 'slider/slide7.png', '2025-06-17 23:10:34', '2025-06-17 23:10:34', 'home'),
(8, 'slider/slide8.png', '2025-06-17 23:10:34', '2025-06-17 23:10:34', 'home'),
(9, 'slider/slide9.png', '2025-06-17 23:10:34', '2025-06-17 23:10:34', 'home'),
(10, 'slider/slide10.png', '2025-06-17 23:10:34', '2025-06-17 23:10:34', 'home'),
(11, 'slider/slide11.png', '2025-06-17 23:10:34', '2025-06-17 23:10:34', 'hotel'),
(12, 'slider/slide12.png', '2025-06-17 23:10:34', '2025-06-17 23:10:34', 'hotel'),
(13, 'slider/slide13.png', '2025-06-17 23:10:34', '2025-06-17 23:10:34', 'hotel'),
(14, 'slider/slide14.png', '2025-06-17 23:10:34', '2025-06-17 23:10:34', 'hotel'),
(15, 'slider/slide15.png', '2025-06-17 23:10:34', '2025-06-17 23:10:34', 'hotel');

-- --------------------------------------------------------

--
-- Table structure for table `testimonials`
--

CREATE TABLE `testimonials` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `product` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `rating` tinyint NOT NULL,
  `review` text COLLATE utf8mb4_unicode_ci NOT NULL,
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
  `id` int UNSIGNED NOT NULL,
  `image_path` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `hover_image_path` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `uproducts`
--

INSERT INTO `uproducts` (`id`, `image_path`, `hover_image_path`, `created_at`, `updated_at`) VALUES
(1, 'uproducts/image1.png', 'uproducts/image1_hover.png', '2025-04-26 10:28:02', '2025-05-14 21:12:50'),
(2, 'uproducts/image2.png', 'uproducts/image2_hover.png', '2025-04-26 10:28:02', '2025-05-14 21:12:59'),
(3, 'uproducts/image3.png', 'uproducts/image3_hover.png', '2025-04-26 10:28:02', '2025-05-14 21:13:12');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mobile` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` text COLLATE utf8mb4_unicode_ci,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `pin` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `city` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address1` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address2` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address3` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address4` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address5` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `image`, `password`, `mobile`, `address`, `email_verified_at`, `remember_token`, `created_at`, `updated_at`, `pin`, `city`, `address1`, `address2`, `address3`, `address4`, `address5`) VALUES
(3, 'pitle', 'pitle@gmail.com', 'profile_images/DHacbvDULZgBaC2et3BI5PZkHYRyYzb4phDssWBG.jpg', '$2y$12$Hag2mRJhw/UWzrNYb/scae5CJ5yLLuem5AhNOWYik6voHFGRFEoRK', '9876879656', 'ch.sambhaji nagaar', NULL, NULL, '2025-07-15 09:45:02', '2025-07-17 08:49:10', '4135', 'Sheti', 'ch.sambhaji nagaar, Shelgaon - 413518', 'sfczczdcvz, zdvcz - 12345', 'hanjkgur27, rtgsds - 12323', NULL, NULL),
(4, 'Bhasker sharma', 'bhaskersharma13@gmail.com', NULL, '$2y$12$zbBM5gGRq0oMLoKFc87MkOPBXbgziOpN9yRryWNQBlTQAokAUy96K', '8427182071', NULL, NULL, NULL, '2025-07-29 13:11:02', '2025-07-29 13:11:02', NULL, NULL, NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `wishlists`
--

CREATE TABLE `wishlists` (
  `id` bigint UNSIGNED NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `product_id` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `wishlists`
--

INSERT INTO `wishlists` (`id`, `user_id`, `product_id`, `created_at`, `updated_at`) VALUES
(10, 3, 5, '2025-07-17 08:24:16', '2025-07-17 08:24:16'),
(11, 3, 1, '2025-07-17 08:24:18', '2025-07-17 08:24:18'),
(12, 3, 6, '2025-07-17 08:32:33', '2025-07-17 08:32:33'),
(14, 3, 8, '2025-07-18 11:27:11', '2025-07-18 11:27:11'),
(15, 3, 3, '2025-07-18 11:34:27', '2025-07-18 11:34:27'),
(16, 3, 2, '2025-07-19 10:08:46', '2025-07-19 10:08:46'),
(17, 3, 7, '2025-07-19 10:10:09', '2025-07-19 10:10:09'),
(18, 4, 5, '2025-07-29 13:11:41', '2025-07-29 13:11:41'),
(19, 4, 1, '2025-07-29 13:11:48', '2025-07-29 13:11:48');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin_auth`
--
ALTER TABLE `admin_auth`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `password` (`password`);

--
-- Indexes for table `bar_packages`
--
ALTER TABLE `bar_packages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `bookings`
--
ALTER TABLE `bookings`
  ADD PRIMARY KEY (`id`);

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
-- Indexes for table `carts`
--
ALTER TABLE `carts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `coco`
--
ALTER TABLE `coco`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `contacts`
--
ALTER TABLE `contacts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `freshner_mist`
--
ALTER TABLE `freshner_mist`
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
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `orders_user_id_foreign` (`user_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `room_freshner`
--
ALTER TABLE `room_freshner`
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
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- Indexes for table `wishlists`
--
ALTER TABLE `wishlists`
  ADD PRIMARY KEY (`id`),
  ADD KEY `wishlists_user_id_foreign` (`user_id`),
  ADD KEY `wishlists_product_id_foreign` (`product_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin_auth`
--
ALTER TABLE `admin_auth`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `bar_packages`
--
ALTER TABLE `bar_packages`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `bookings`
--
ALTER TABLE `bookings`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `carts`
--
ALTER TABLE `carts`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `coco`
--
ALTER TABLE `coco`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `contacts`
--
ALTER TABLE `contacts`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `freshner_mist`
--
ALTER TABLE `freshner_mist`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `how_it_works`
--
ALTER TABLE `how_it_works`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `images`
--
ALTER TABLE `images`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `itms`
--
ALTER TABLE `itms`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=77;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `room_freshner`
--
ALTER TABLE `room_freshner`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `sliders`
--
ALTER TABLE `sliders`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `testimonials`
--
ALTER TABLE `testimonials`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `uproducts`
--
ALTER TABLE `uproducts`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `wishlists`
--
ALTER TABLE `wishlists`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `wishlists`
--
ALTER TABLE `wishlists`
  ADD CONSTRAINT `wishlists_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `wishlists_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
