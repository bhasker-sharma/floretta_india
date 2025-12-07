-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Dec 07, 2025 at 09:59 AM
-- Server version: 11.8.3-MariaDB-log
-- PHP Version: 7.2.34
CREATE DATABASE IF NOT EXISTS floretta_india_local;
USE floretta_india_local;

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `u346088292_floretta_india`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin_auth`
--

CREATE TABLE `admin_auth` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL DEFAULT 'admin',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `admin_auth`
--

INSERT INTO `admin_auth` (`id`, `email`, `password`, `role`, `created_at`, `updated_at`) VALUES
(1, 'florettaindia@gmail.com', '$2y$12$RfBzLYmFTxkdTZ25xeRQcutaoeqiS9BTcbrQNsOfz7x/WacHFvU76', 'superadmin', '2025-08-02 15:19:14', '2025-11-23 16:31:31'),
(4, 'sukumaran@gmail.com', '$2y$12$AVsIHJ3RKuR.AEaCzDlvJeYrAM7bySNFH5N9Q8b.aFAHNM/xbOCEa', 'admin', '2025-11-24 15:44:25', '2025-11-24 15:44:25');

-- --------------------------------------------------------

--
-- Table structure for table `bar_packages`
--

CREATE TABLE `bar_packages` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `no_of_guests` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `category` enum('bronze','silver','gold') NOT NULL,
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
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `mobile` varchar(255) NOT NULL,
  `package` varchar(255) NOT NULL,
  `message` text DEFAULT NULL,
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
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `cache`
--

INSERT INTO `cache` (`key`, `value`, `expiration`) VALUES
('laravel_cache_0e6fbb84c7404c3d5583eaeba3ed6cec981525ca', 'i:1;', 1763977363),
('laravel_cache_0e6fbb84c7404c3d5583eaeba3ed6cec981525ca:timer', 'i:1763977363;', 1763977363),
('laravel_cache_11694f4e3640db15bc547623599c187f1301d594', 'i:1;', 1764006089),
('laravel_cache_11694f4e3640db15bc547623599c187f1301d594:timer', 'i:1764006089;', 1764006089),
('laravel_cache_17ada852cb1782bf83998879932488b6fcb43f82', 'i:1;', 1764154811),
('laravel_cache_17ada852cb1782bf83998879932488b6fcb43f82:timer', 'i:1764154811;', 1764154811),
('laravel_cache_19b418dd13ee7348207d62213c16d08e0512701e', 'i:2;', 1763919733),
('laravel_cache_19b418dd13ee7348207d62213c16d08e0512701e:timer', 'i:1763919733;', 1763919733),
('laravel_cache_1fe941f23007dcdf737deddb796f321d7b3c51db', 'i:1;', 1764144846),
('laravel_cache_1fe941f23007dcdf737deddb796f321d7b3c51db:timer', 'i:1764144846;', 1764144846),
('laravel_cache_234e863298393d61be1811091175a24b2a722acb', 'i:1;', 1764246796),
('laravel_cache_234e863298393d61be1811091175a24b2a722acb:timer', 'i:1764246796;', 1764246796),
('laravel_cache_26f6958a1b27363d2ed5845673a8909556c13a43', 'i:1;', 1764167760),
('laravel_cache_26f6958a1b27363d2ed5845673a8909556c13a43:timer', 'i:1764167760;', 1764167760),
('laravel_cache_272acfcc73ef160dade742faaf02544a28638994', 'i:1;', 1764247320),
('laravel_cache_272acfcc73ef160dade742faaf02544a28638994:timer', 'i:1764247320;', 1764247320),
('laravel_cache_311e356620a2c735bca994c0fa882096cb020a49', 'i:4;', 1764239311),
('laravel_cache_311e356620a2c735bca994c0fa882096cb020a49:timer', 'i:1764239311;', 1764239311),
('laravel_cache_3c96f45c7d09b03766c7c7455a1bbc3f033ff413', 'i:1;', 1763895938),
('laravel_cache_3c96f45c7d09b03766c7c7455a1bbc3f033ff413:timer', 'i:1763895938;', 1763895938),
('laravel_cache_4f4cc3889d9b759b476518a09b159e6d7159cd9f', 'i:1;', 1763924067),
('laravel_cache_4f4cc3889d9b759b476518a09b159e6d7159cd9f:timer', 'i:1763924067;', 1763924067),
('laravel_cache_52269cbe17f157a340665f1ce19f617728365980', 'i:1;', 1764167051),
('laravel_cache_52269cbe17f157a340665f1ce19f617728365980:timer', 'i:1764167051;', 1764167051),
('laravel_cache_6d6e6edf4468c50c0949c003d709b8c6f29c31fa', 'i:3;', 1764093549),
('laravel_cache_6d6e6edf4468c50c0949c003d709b8c6f29c31fa:timer', 'i:1764093549;', 1764093549),
('laravel_cache_869f4400eadf497c7c7fce3b8a276e5bfa6e7a44', 'i:1;', 1764932690),
('laravel_cache_869f4400eadf497c7c7fce3b8a276e5bfa6e7a44:timer', 'i:1764932690;', 1764932690),
('laravel_cache_ac5dc37aff304c40cc7f37d1f593ae1844202e43', 'i:1;', 1764389289),
('laravel_cache_ac5dc37aff304c40cc7f37d1f593ae1844202e43:timer', 'i:1764389289;', 1764389289),
('laravel_cache_acfde04894067b657879593749c2e4706ddd393e', 'i:1;', 1763993187),
('laravel_cache_acfde04894067b657879593749c2e4706ddd393e:timer', 'i:1763993187;', 1763993187),
('laravel_cache_b4cbde1eb75b5aee97b6f998dfe00ce8868b12f6', 'i:2;', 1764084240),
('laravel_cache_b4cbde1eb75b5aee97b6f998dfe00ce8868b12f6:timer', 'i:1764084240;', 1764084240),
('laravel_cache_b8ac41dc69106f6016bf81d5eb47a0def8122968', 'i:3;', 1764929505),
('laravel_cache_b8ac41dc69106f6016bf81d5eb47a0def8122968:timer', 'i:1764929505;', 1764929505),
('laravel_cache_bb47f267bf475252b4260c52e103dd27ec32186a', 'i:1;', 1764673620),
('laravel_cache_bb47f267bf475252b4260c52e103dd27ec32186a:timer', 'i:1764673620;', 1764673620),
('laravel_cache_bc4ed7677f3ed3b21f1a1800baa433a23327ec6f', 'i:1;', 1764170670),
('laravel_cache_bc4ed7677f3ed3b21f1a1800baa433a23327ec6f:timer', 'i:1764170670;', 1764170670),
('laravel_cache_c004fae7bd1f0c39123310789fa3d5f6a4d016bc', 'i:1;', 1764347905),
('laravel_cache_c004fae7bd1f0c39123310789fa3d5f6a4d016bc:timer', 'i:1764347905;', 1764347905),
('laravel_cache_c37394ddaf9a17e4c5bdf1439bc01b3d44eb0bf5', 'i:2;', 1763979979),
('laravel_cache_c37394ddaf9a17e4c5bdf1439bc01b3d44eb0bf5:timer', 'i:1763979979;', 1763979979),
('laravel_cache_d9436946347b05a90dc9bff95d81942c28192415', 'i:1;', 1764753920),
('laravel_cache_d9436946347b05a90dc9bff95d81942c28192415:timer', 'i:1764753920;', 1764753920),
('laravel_cache_db8f212a341407b0a282b50977251d232a416b4d', 'i:1;', 1764231011),
('laravel_cache_db8f212a341407b0a282b50977251d232a416b4d:timer', 'i:1764231011;', 1764231011),
('laravel_cache_dbf5a9c3a1f65bfa8f6384139cf9338f50e23292', 'i:3;', 1764092912),
('laravel_cache_dbf5a9c3a1f65bfa8f6384139cf9338f50e23292:timer', 'i:1764092912;', 1764092912),
('laravel_cache_ed3e4ec07c0032dd6674b6e61479061b4376afcc', 'i:1;', 1764929509),
('laravel_cache_ed3e4ec07c0032dd6674b6e61479061b4376afcc:timer', 'i:1764929509;', 1764929509),
('laravel_cache_eecbbff0de2f61274450415443d6707f9f2311f9', 'i:1;', 1764239030),
('laravel_cache_eecbbff0de2f61274450415443d6707f9f2311f9:timer', 'i:1764239030;', 1764239030),
('laravel_cache_efafcff1d68294415bd6753dbe3c75a155f4c946', 'i:1;', 1763919866),
('laravel_cache_efafcff1d68294415bd6753dbe3c75a155f4c946:timer', 'i:1763919866;', 1763919866),
('laravel_cache_f2b9550cdec3716f9dd0826479c23a06bfd3bdb5', 'i:3;', 1764093393),
('laravel_cache_f2b9550cdec3716f9dd0826479c23a06bfd3bdb5:timer', 'i:1764093393;', 1764093393),
('laravel_cache_f986053d82281d709bcc2aef241d2bc2f5cdbefb', 'i:1;', 1764262553),
('laravel_cache_f986053d82281d709bcc2aef241d2bc2f5cdbefb:timer', 'i:1764262553;', 1764262553),
('laravel_cache_fcfb02abf52d2923c0ed23252a031f9b8eaa8361', 'i:1;', 1763992397),
('laravel_cache_fcfb02abf52d2923c0ed23252a031f9b8eaa8361:timer', 'i:1763992397;', 1763992397),
('laravel_cache_Fzkq98YPmjkfHU35', 'a:1:{s:11:\"valid_until\";i:1764240489;}', 1765448649),
('laravel_cache_In1FW9q7cnJToQn8', 'a:1:{s:11:\"valid_until\";i:1764389345;}', 1765598945),
('laravel_cache_QCbBsQ0m0EG9BtKL', 'a:1:{s:11:\"valid_until\";i:1763895839;}', 1765105439),
('laravel_cache_QeJ9Igr6qOl9T8NU', 'a:1:{s:11:\"valid_until\";i:1763923973;}', 1765133153),
('laravel_cache_QLH7jDVkEcguN6wP', 'a:1:{s:11:\"valid_until\";i:1763917365;}', 1765126905),
('laravel_cache_x1qA0nZZQ4mHYbVC', 'a:1:{s:11:\"valid_until\";i:1764262377;}', 1765471977);

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
-- Table structure for table `carts`
--

CREATE TABLE `carts` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `product_id` bigint(20) UNSIGNED NOT NULL,
  `quantity` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `scent` varchar(255) DEFAULT NULL,
  `volume_ml` varchar(255) DEFAULT NULL,
  `price` decimal(8,2) DEFAULT NULL,
  `original_price` decimal(8,2) DEFAULT NULL,
  `discount_amount` decimal(8,2) DEFAULT NULL,
  `is_discount_active` tinyint(1) NOT NULL DEFAULT 0,
  `delivery_charge` decimal(8,2) DEFAULT NULL,
  `available_quantity` int(11) DEFAULT NULL,
  `rating` float DEFAULT NULL,
  `reviews_count` int(11) DEFAULT NULL,
  `image_path` varchar(255) DEFAULT NULL,
  `flag` varchar(255) DEFAULT NULL,
  `discription` text DEFAULT NULL,
  `about_product` text DEFAULT NULL,
  `extra_images` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `ingridiance` text DEFAULT NULL,
  `profit` decimal(8,2) DEFAULT NULL,
  `colour` varchar(255) DEFAULT NULL,
  `brand` varchar(255) DEFAULT NULL,
  `item_form` varchar(255) DEFAULT NULL,
  `power_source` varchar(255) DEFAULT NULL,
  `about` text DEFAULT NULL
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
-- Table structure for table `contacts`
--

CREATE TABLE `contacts` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `hotel_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `mobile` varchar(255) NOT NULL,
  `packaging_option` varchar(255) NOT NULL,
  `preferred_fragrance` varchar(255) NOT NULL,
  `estimated_quantity` varchar(255) NOT NULL,
  `additional_requirements` text DEFAULT NULL,
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
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `scent` varchar(255) DEFAULT NULL,
  `volume_ml` int(11) NOT NULL,
  `price` decimal(8,2) NOT NULL,
  `original_price` decimal(10,2) DEFAULT NULL,
  `discount_amount` decimal(10,2) DEFAULT NULL,
  `is_discount_active` tinyint(1) DEFAULT 0,
  `delivery_charge` decimal(10,2) DEFAULT 0.00,
  `available_quantity` int(11) DEFAULT 0,
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
-- Table structure for table `men`
--

CREATE TABLE `men` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
(76, '2025_07_26_134528_create_admins_table', 39),
(77, '2025_08_04_035941_add_details_to_orders_table', 40),
(78, '2025_08_10_090320_add_order_number_to_orders_table', 40),
(79, '2025_10_07_213418_create_men_table', 40),
(80, '2025_10_29_131858_add_gst_number_to_users_table', 40),
(81, '2025_10_29_132955_add_include_gst_to_orders_table', 40),
(82, '2025_10_29_134909_add_role_to_admin_auth_table', 40),
(83, '2025_10_29_145531_create_password_reset_otps_table', 40),
(84, '2025_11_02_233242_add_default_address_index_to_users_table', 40),
(85, '2025_11_03_034723_add_email_verification_to_users_table', 40),
(86, '2025_11_03_152900_add_verification_to_orders_table', 41),
(87, '2025_11_03_160000_add_order_status_fields_to_orders_table', 42),
(88, '2025_11_03_160100_create_order_status_updates_table', 43),
(89, '2025_11_08_000844_create_product_images_table', 43),
(90, '2025_11_18_001759_add_is_bestseller_to_products_table', 44),
(91, '2025_11_18_003659_add_bestseller_order_to_products_table', 44),
(92, '2025_11_18_151225_add_page_and_order_to_sliders_table', 44),
(93, '2025_11_18_153320_update_existing_sliders_with_page_assignment', 44);

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `order_number` varchar(20) DEFAULT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `razorpay_order_id` varchar(255) NOT NULL,
  `razorpay_payment_id` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL,
  `order_status` varchar(255) NOT NULL DEFAULT 'Order Placed',
  `order_status_changed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `customer_name` varchar(255) DEFAULT NULL,
  `customer_email` varchar(255) DEFAULT NULL,
  `customer_phone` varchar(255) DEFAULT NULL,
  `customer_address` text DEFAULT NULL,
  `order_value` decimal(10,2) DEFAULT NULL,
  `order_quantity` int(11) DEFAULT NULL,
  `order_items` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`order_items`)),
  `include_gst` tinyint(1) NOT NULL DEFAULT 0,
  `verified_at` timestamp NULL DEFAULT NULL,
  `verified_by_admin_id` bigint(20) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `order_number`, `user_id`, `razorpay_order_id`, `razorpay_payment_id`, `status`, `order_status`, `order_status_changed_at`, `created_at`, `updated_at`, `customer_name`, `customer_email`, `customer_phone`, `customer_address`, `order_value`, `order_quantity`, `order_items`, `include_gst`, `verified_at`, `verified_by_admin_id`) VALUES
(3, 'ORD2025112700001', 15, 'order_Rkq6l6Xy1Qj33q', 'pay_Rkq6wxKtvdgqif', 'Paid', 'Order Placed', NULL, '2025-11-27 22:31:52', '2025-12-03 14:54:36', 'Bhasker sharma', 'bhaskersharma13@gmail.com', '8427182071', 'TIPL toshniwal industries private limited , makhupura road , near parbatpura bypass ajmer., Ajmer, Rajasthan - 305002', 1.99, 1, '[{\"id\":30,\"name\":\"Try Me Perfume Set\",\"price\":\"1.99\",\"quantity\":1}]', 0, '2025-12-03 14:54:36', 1);

-- --------------------------------------------------------

--
-- Table structure for table `order_status_updates`
--

CREATE TABLE `order_status_updates` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `order_id` bigint(20) UNSIGNED NOT NULL,
  `from_status` varchar(255) DEFAULT NULL,
  `to_status` varchar(255) NOT NULL,
  `changed_by_admin_id` bigint(20) UNSIGNED DEFAULT NULL,
  `note` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_otps`
--

CREATE TABLE `password_reset_otps` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `email` varchar(255) NOT NULL,
  `otp` varchar(6) NOT NULL,
  `expires_at` timestamp NOT NULL,
  `is_used` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `password_reset_otps`
--

INSERT INTO `password_reset_otps` (`id`, `email`, `otp`, `expires_at`, `is_used`, `created_at`, `updated_at`) VALUES
(3, 'bhaskersharma13@gmail.com', '330812', '2025-12-05 16:43:50', 0, '2025-12-05 16:33:50', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `volume_ml` int(11) DEFAULT NULL,
  `Discription` varchar(1000) DEFAULT NULL,
  `price` decimal(8,2) NOT NULL,
  `original_price` decimal(10,2) DEFAULT NULL,
  `discount_amount` decimal(10,2) DEFAULT NULL,
  `is_discount_active` tinyint(1) DEFAULT 0,
  `is_bestseller` tinyint(1) NOT NULL DEFAULT 0,
  `bestseller_order` int(11) DEFAULT NULL,
  `delivery_charge` decimal(10,2) DEFAULT 0.00,
  `available_quantity` int(11) DEFAULT 0,
  `old_price` decimal(8,2) DEFAULT NULL,
  `image` varchar(255) NOT NULL,
  `flag` varchar(50) DEFAULT NULL,
  `about_product` varchar(2000) DEFAULT NULL,
  `rating` decimal(3,1) NOT NULL,
  `reviews_count` int(11) DEFAULT 0,
  `reviews` int(11) NOT NULL,
  `note` varchar(500) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `features` text DEFAULT NULL,
  `extra_images` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `ingridiance` text DEFAULT NULL,
  `ingredients` varchar(5000) DEFAULT NULL,
  `profit` text DEFAULT NULL,
  `launch_date` date DEFAULT NULL,
  `scent` varchar(100) DEFAULT NULL,
  `colour` varchar(255) DEFAULT NULL,
  `brand` varchar(255) DEFAULT NULL,
  `item_form` varchar(255) DEFAULT NULL,
  `power_source` varchar(255) DEFAULT NULL,
  `about` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `volume_ml`, `Discription`, `price`, `original_price`, `discount_amount`, `is_discount_active`, `is_bestseller`, `bestseller_order`, `delivery_charge`, `available_quantity`, `old_price`, `image`, `flag`, `about_product`, `rating`, `reviews_count`, `reviews`, `note`, `created_at`, `updated_at`, `features`, `extra_images`, `ingridiance`, `ingredients`, `profit`, `launch_date`, `scent`, `colour`, `brand`, `item_form`, `power_source`, `about`) VALUES
(14, 'Jasmine Room Freshener Spray', 500, 'Immerse your space in the calming essence of fresh jasmine with our 500 ml Jasmine Room Freshener Spray. Crafted to instantly uplift any room, this soothing floral mist eliminates unpleasant odours and replaces them with a long-lasting, natural fragrance. Ideal for homes, offices, hotels, and retail spaces, it creates a peaceful and refreshing environment within seconds. Its gentle, non-overpowering aroma makes it perfect for daily use, leaving your surroundings smelling clean, elegant, and beautifully fragrant. Experience the purity of blooming jasmine with every spray and transform your atmosphere into a serene floral haven. hello', 350.00, 500.00, 150.00, 1, 1, 0, 40.00, 1000, NULL, 'images/uproducts/jasmine-room-freshener-spray/img1_1763977986_69242b0273c18.png', 'freshner', '* 100% chemical-free and naturally formulated\r\n* Safe for children, pets and everyday home use./\r\n* Eco-friendly ingredients that do not harm the environment./\r\n* Gentle on the senses with no eye irritation./\r\n* Non-toxic, alcohol-free and safe to inhale./\r\n* Long-lasting jasmine fragrance that refreshes instantly./\r\n* Suitable for homes, offices, hotels and closed spaces\r\n* Leaves no residue or stains on surfaces\r\n* Made for daily use with a soft, calming floral aroma', 0.0, 0, 0, 'floral', '2025-11-23 23:39:13', '2025-11-26 13:49:20', NULL, NULL, NULL, 'Pure Jasmine Essential Oil\r\n\r\nSugarcane Extracts (natural plant-based solvent)\r\n\r\nDistilled Water\r\n\r\nNatural Emulsifiers (plant-derived)', NULL, '2025-11-23', 'jasmine', 'transparent', 'Floretta India', 'spray', NULL, NULL),
(15, 'lemongrass Room Freshener Spray', 500, 'Refresh your surroundings with the crisp, energizing aroma of our Lemongrass Room Freshener Spray. Infused with pure lemongrass essential oil, this 100% chemical-free formulation instantly eliminates unwanted odours and fills the room with a bright, citrusy fragrance. Safe for children, pets and everyday use, it is crafted with eco-friendly ingredients that cause no irritation and are gentle on the environment. Perfect for homes, offices, hotels and wellness spaces, this natural spray uplifts the mood, purifies the air and leaves your space smelling clean, fresh and beautifully revitalized with every spritz.', 350.00, 500.00, 150.00, 1, 1, NULL, 40.00, 1000, NULL, 'images/uproducts/jasmine-room-freshener-spray/img1_1763977558_6924295616462.png', 'freshner', '* 100% chemical-free natural formulation\r\n* Safe for children, pets, and everyday home use\r\n* Eco-friendly and biodegradable ingredients\r\n* No eye or skin irritation\r\n* Non-toxic, alcohol-free and safe to inhale\r\n* Instantly removes bad odours and refreshes the air\r\n* Energizing **citrusy lemongrass fragrance**\r\n* Ideal for homes, offices, hotels, gyms and wellness spaces\r\n* Leaves no residue or stains\r\n* Suitable for daily use', 0.0, 0, 0, 'citrus', '2025-11-24 15:15:58', '2025-11-26 13:46:44', NULL, NULL, NULL, '* Pure Lemongrass Essential Oil\r\n* Sugarcane Extracts (natural plant-based base)\r\n* Distilled Water\r\n* Plant-derived Natural Emulsifiers', NULL, '2025-11-22', 'citrus', 'transparent', 'Floretta India', 'spray', NULL, NULL),
(16, 'Rose Room Freshener Spray', 500, 'Experience the timeless elegance of fresh roses with our Rose Room Freshener Spray. Crafted with pure rose essential oil, this natural, chemical-free formula gently uplifts any space with a soft, soothing floral aroma. It instantly removes unpleasant odours and replaces them with a clean, refreshing scent that feels calming and luxurious. Safe for children, pets, and daily use, this eco-friendly spray is perfect for homes, offices, hotels, cafés and personal spaces. With every spritz, enjoy the purity of blooming roses and transform your surroundings into a serene, fragrant haven.', 350.00, 500.00, 150.00, 1, 1, NULL, 40.00, 1000, NULL, 'images/uproducts/rose-room-freshener-spray/img1_1763978716_69242ddc15132.png', 'freshner', '100% chemical-free and naturally formulated\r\n\r\nSafe for children, pets and everyday home use\r\n\r\nEco-friendly and biodegradable ingredients\r\n\r\nNo eye or skin irritation\r\n\r\nNon-toxic, alcohol-free and safe to inhale\r\n\r\nInstantly neutralizes odours and refreshes the air\r\n\r\nSoft, soothing natural rose fragrance\r\n\r\nIdeal for homes, offices, hotels, cafés and washrooms\r\n\r\nLeaves no residue or stains\r\n\r\nPerfect for daily use', 0.0, 0, 0, 'floral', '2025-11-24 15:35:16', '2025-11-25 23:25:41', NULL, NULL, NULL, 'Pure Rose Essential Oil\r\n\r\nSugarcane Extracts (natural plant-based solvent)\r\n\r\nDistilled Water\r\n\r\nPlant-based Natural Emulsifiers', NULL, '2025-11-24', 'rose', 'Transparent', 'Floretta India', 'spray', NULL, NULL),
(20, 'Rose Room freshener Can', 5000, 'Experience the timeless elegance of fresh roses with our Rose Room Freshener. Crafted with pure rose essential oil, this natural, chemical-free formula gently uplifts any space with a soft, soothing floral aroma. It instantly removes unpleasant odours and replaces them with a clean, refreshing scent that feels calming and luxurious. Safe for children, pets, and daily use, this eco-friendly spray is perfect for homes, offices, hotels, cafés and personal spaces. With every spritz, enjoy the purity of blooming roses and transform your surroundings into a serene, fragrant haven.', 1200.00, 2500.00, 1300.00, 1, 1, NULL, 80.00, 1000, NULL, 'images/uproducts/rose-room-freshener-can/img1_1764145597_6926b9bd77513.png', 'freshner', '100% chemical-free and naturally formulated\r\n\r\nSafe for children, pets and everyday home use\r\n\r\nEco-friendly and biodegradable ingredients\r\n\r\nNo eye or skin irritation\r\n\r\nNon-toxic, alcohol-free and safe to inhale\r\n\r\nInstantly neutralizes odours and refreshes the air\r\n\r\nSoft, soothing natural rose fragrance\r\n\r\nIdeal for homes, offices, hotels, cafés and washrooms\r\n\r\nLeaves no residue or stains\r\n\r\nPerfect for daily use', 0.0, 0, 0, 'floral', '2025-11-26 13:45:50', '2025-11-26 20:04:53', NULL, NULL, NULL, 'Pure Rose Essential Oil\r\n\r\nSugarcane Extracts (natural plant-based solvent)\r\n\r\nDistilled Water\r\n\r\nPlant-based Natural Emulsifiers', NULL, '2025-11-24', 'Floral', 'Transparent', 'Floretta India', 'Spray', NULL, NULL),
(21, 'Lemongrass room freshener Can', 5000, 'Refresh your surroundings with the crisp, energizing aroma of our Lemongrass Room Freshener. Infused with pure lemongrass essential oil, this 100% chemical-free formulation instantly eliminates unwanted odours and fills the room with a bright, citrusy fragrance. Safe for children, pets and everyday use, it is crafted with eco-friendly ingredients that cause no irritation and are gentle on the environment. Perfect for homes, offices, hotels and wellness spaces, this natural spray uplifts the mood, purifies the air and leaves your space smelling clean, fresh and beautifully revitalized with every spritz.', 1300.00, 2800.00, 1500.00, 1, 1, NULL, 90.00, 1000, NULL, 'images/uproducts/lemongrass-room-freshener-can/img1_1764145541_6926b985a9e3d.png', 'freshner', '* 100% chemical-free natural formulation\r\n* Safe for children, pets, and everyday home use\r\n* Eco-friendly and biodegradable ingredients\r\n* No eye or skin irritation\r\n* Non-toxic, alcohol-free and safe to inhale\r\n* Instantly removes bad odours and refreshes the air\r\n* Energizing **citrusy lemongrass fragrance**\r\n* Ideal for homes, offices, hotels, gyms and wellness spaces\r\n* Leaves no residue or stains\r\n* Suitable for daily use', 0.0, 0, 0, 'citrus', '2025-11-26 13:48:35', '2025-11-26 16:55:53', NULL, NULL, NULL, '* Pure Lemongrass Essential Oil\r\n* Sugarcane Extracts (natural plant-based base)\r\n* Distilled Water\r\n* Plant-derived Natural Emulsifiers', NULL, '2025-11-25', 'Citrus', 'Transparent', 'Floretta India', 'Can', NULL, NULL),
(22, 'Jasmine Room Freshener Can', 5000, 'Immerse your space in the calming essence of fresh jasmine with our 5000 ml Jasmine Room Freshener. Crafted to instantly uplift any room, this soothing floral mist eliminates unpleasant odours and replaces them with a long-lasting, natural fragrance. Ideal for homes, offices, hotels, and retail spaces, it creates a peaceful and refreshing environment within seconds. Its gentle, non-overpowering aroma makes it perfect for daily use, leaving your surroundings smelling clean, elegant, and beautifully fragrant. Experience the purity of blooming jasmine with every spray and transform your atmosphere into a serene floral haven. hello', 1200.00, 2000.00, 800.00, 1, 1, NULL, 80.00, 1000, NULL, 'images/uproducts/jasmine-room-freshener-can/img1_1764145641_6926b9e9dc4e8.png', 'freshner', '* 100% chemical-free and naturally formulated\r\n* Safe for children, pets and everyday home use./\r\n* Eco-friendly ingredients that do not harm the environment./\r\n* Gentle on the senses with no eye irritation./\r\n* Non-toxic, alcohol-free and safe to inhale./\r\n* Long-lasting jasmine fragrance that refreshes instantly./\r\n* Suitable for homes, offices, hotels and closed spaces\r\n* Leaves no residue or stains on surfaces\r\n* Made for daily use with a soft, calming floral aroma', 0.0, 0, 0, 'floral', '2025-11-26 13:51:51', '2025-11-26 16:55:43', NULL, NULL, NULL, 'Pure Jasmine Essential Oil\r\n\r\nSugarcane Extracts (natural plant-based solvent)\r\n\r\nDistilled Water\r\n\r\nNatural Emulsifiers (plant-derived)', NULL, '2025-11-24', 'Floral', 'Transparent', 'Floretta India', 'Can', NULL, NULL),
(23, 'Jasmine Face Mist', 50, 'Floretta Jasmine Face Mist helps with antiseptic properties of jasmine extracts, which can help in preventing skin damage, minimizing open pores, and leaving a mild floral fragrance on your skin. It can hydrate skin before makeup or add a dewy look after makeup.', 250.00, 500.00, 250.00, 1, 1, NULL, 30.00, 1000, NULL, 'images/uproducts/jasmine-face-mist/img1_1764155505_6926e071e1b0d.png', 'face_mist', 'It is marketed as a face mist that “soothes and hydrates skin, suitable for all skin types.” \r\n\r\nIt can be used before or after makeup — meaning you can use it as part of your skincare routine (e.g. to freshen/hydrate skin) or as a makeup-setting spray. \r\n\r\nIt claims to provide an instant burst of hydration, leaving skin “refreshed and revitalized.” \r\n\r\nBecause it uses “natural jasmine extract or essential oil,” it claims added benefits: jasmine is often associated with soothing / calming properties. \r\n\r\n\r\nOther claimed benefits: reducing redness, balancing skin tone, giving a mild floral fragrance, leaving a dewy look — possibly helping with skin freshness post-makeup. \r\n\r\n\r\nIt’s described as “suitable for all skin types” — sensitive, dry, oily, or combination.', 0.0, 0, 0, 'floral', '2025-11-26 16:41:45', '2025-11-26 20:02:59', NULL, NULL, NULL, 'Aqua (Distilled Water)\r\n\r\nJasmine Essential Oil / Jasmine Extract\r\n\r\nGlycerin (Plant-Based Humectant)\r\n\r\nAloe Vera Extract (optional but enhances hydration)\r\n\r\nSodium Benzoate & Potassium Sorbate (Safe Cosmetic-Grade Preservatives)\r\n\r\nRose Water / Hydrosol \r\n\r\n*Polysorbate 20 (Natural Solubilizer for essential oils)\r\n\r\n*Natural Fragrance', NULL, '2025-11-26', 'floral', 'transparent', 'Floretta India', 'Mist Spray', NULL, NULL),
(24, 'Rose Face Mist', 50, 'Floretta Rose Face Mist instantly refreshes, hydrates, and soothes your skin with the purity of natural rose extracts. Its lightweight formula gives a soft glow, calms irritation, and keeps your face feeling cool and rejuvenated. Perfect for use before makeup, after makeup, or anytime your skin needs a quick pick-me-up. Suitable for all skin types and ideal for daily use.', 250.00, 500.00, 250.00, 1, 0, NULL, 30.00, 1000, NULL, 'images/uproducts/rose-face-mist/img1_1764156297_6926e389ecc01.png', 'face_mist', 'Infused with pure rose extracts for soothing and calming skin\r\n\r\nProvides an instant hydration boost and natural glow\r\n\r\nHelps reduce redness and refreshes dull, tired skin\r\n\r\nLightweight, non-sticky, and absorbs quickly\r\n\r\nCan be used before or after makeup\r\n\r\nGentle and suitable for all skin types\r\n\r\nRefreshing natural rose aroma\r\n\r\nPerfect for daily use and on-the-go freshness', 0.0, 0, 0, 'floral', '2025-11-26 16:54:57', '2025-11-26 16:54:57', NULL, NULL, NULL, 'Aqua (Distilled Water)\r\n\r\n\r\nJasmine Essential Oil / Jasmine Extract\r\n\r\nGlycerin (Plant-Based Humectant)\r\n\r\nAloe Vera Extract \r\n\r\nSodium Benzoate & Potassium Sorbate (Safe Cosmetic-Grade Preservatives)\r\n\r\nRose Water / Hydrosol \r\n*Polysorbate 20 (Natural Solubilizer for essential oils)\r\n\r\n*Natural Fragrance', NULL, NULL, 'floral', 'transparent', 'Floretta India', 'Mist spray', NULL, NULL),
(25, 'Gilli Mitti Perfume', 20, 'Gilli Mitti Perfume captures the soulful scent of fresh, rain-kissed earth. This warm, earthy fragrance brings the comforting aroma of monsoon soil, giving you a nostalgic and grounding experience with every spray. Subtle, soothing, and long-lasting perfect for those who love natural, earthy scents that feel calm, familiar, and refreshing.', 360.00, 699.00, NULL, 0, 1, NULL, 30.00, 1000, NULL, 'images/uproducts/gilli-mitti-perfume/img1_1764167566_69270f8e5646b.png', 'perfume', 'Earthy Gilli Mitti fragrance that captures the natural scent of rain-kissed soil.\r\n\r\nGives a nostalgic, calming and refreshing aroma inspired by monsoon earth.\r\n\r\nSubtle yet long-lasting fragrance suitable for daily use.\r\n\r\nA unique, nature-inspired scent for those who prefer grounded and earthy perfumes.\r\n\r\nComes in a compact 20 ml spray bottle that is easy to carry and travel-friendly.\r\n\r\nFine mist spray ensures smooth and even application.\r\n\r\nUnisex fragrance suitable for both men and women.', 0.0, 0, 0, 'woody', '2025-11-26 20:02:46', '2025-11-26 20:08:12', NULL, NULL, NULL, 'Ylang Ylang Essential Oil\r\n\r\nPatchouli Essential Oil\r\n\r\nEarthy Fragrance Oil (Gilli Mitti Note)\r\n\r\nEthanol (Perfumer’s Alcohol)\r\n\r\nPurified Water\r\n\r\nPhenoxyethanol (Cosmetic-Grade Preservative)', NULL, NULL, 'earthy', 'transparent', 'Floretta India', 'Soray', NULL, NULL),
(26, 'Flower valley perfume', 30, 'Floretta India Flower Valley is a soft, refreshing floral fragrance inspired by blooming gardens. With gentle notes of fresh petals and a naturally uplifting aroma, it adds a touch of elegance to your everyday style. Long-lasting, soothing, and perfect for daily wear.', 599.00, 999.00, 400.00, 1, 1, NULL, 50.00, 1000, NULL, 'images/uproducts/flower-valley-perfume/img1_1764232111_69280baf9d3d7.png', 'perfume', 'Fresh, soft floral fragrance inspired by blooming flowers\r\n\r\nLight, refreshing aroma suitable for daily use\r\n\r\nLong-lasting and skin-friendly formulation\r\n\r\nIdeal for both casual and work wear\r\n\r\nComes in a 30 ml spray bottle\r\n\r\nPerfect for those who love gentle, elegant floral scents', 0.0, 0, 0, 'floral', '2025-11-27 13:58:31', '2025-11-27 13:58:39', NULL, NULL, NULL, 'Fragrance Notes:\r\n\r\nTop Notes: Mandarin orange, pear, pepper\r\n\r\nHeart Notes: Peony, osmanthus, rose\r\n\r\nBase Notes: Cedar, patchouli, musk, leather\r\n\r\nIngredients:\r\nEthanol, purified water, fragrance blend, phenoxyethanol.', NULL, NULL, 'floral', 'transparent', 'Floretta India', 'spray', NULL, NULL),
(27, 'Gulaab-E-Heer Perfume', 30, 'Gulaab-E-Heer by Floretta India is a soft, luxurious rose-based perfume crafted for those who love timeless elegance. Its fresh blooming-rose aroma blends with warm floral notes to create a long-lasting, soothing fragrance perfect for everyday wear. A classic, graceful scent that feels both refreshing and comforting in every spritz.', 699.00, 999.00, 300.00, 1, 1, NULL, 50.00, 1000, NULL, 'images/uproducts/gulaab-e-heer-perfume/img1_1764232693_69280df574c1a.png', 'perfume', 'Comes in a 30 ml perfume bottle\r\n\r\nLong-lasting fragrance suitable for daily wear\r\n\r\nSoft, fresh rose fragrance inspired by blooming gulab\r\n\r\nElegant, soothing and perfect for all seasons\r\n\r\nCrafted with premium ingredients for a smooth, refreshing aroma\r\n\r\nIdeal for both casual and special occasions', 0.0, 0, 0, 'floral', '2025-11-27 14:08:13', '2025-11-27 14:17:57', NULL, NULL, NULL, 'Fragrance Notes\r\n\r\nTop Notes: Champagne Rose, Pink Pepper\r\n\r\nHeart Notes: Peach Blossom, Rose\r\n\r\nBase Notes: White Musk, Woody Notes\r\n\r\nIngredients\r\nEthanol, Phenoxyethanol, Fragrance Oils.', NULL, NULL, 'floral', 'transparent', 'Floretta India', 'spray', NULL, NULL),
(28, 'Coffeenut Perfume', 30, 'A warm, addictive blend inspired by rich coffee beans and creamy roasted nuts. This fragrance opens with a smooth coffee aroma, melts into subtle sweetness, and settles into a comforting, long-lasting base. Perfect for those who love cozy, gourmand scents that feel both bold and irresistible.', 599.00, NULL, NULL, 0, 1, NULL, 0.00, 1000, NULL, 'images/uproducts/coffeenut-perfume/img1_1764233269_69281035a829e.png', 'perfume', 'A warm blend of coffee and coconut, offering a cozy, gourmand fragrance.\r\n\r\nLong-lasting scent with smooth, sweet, and creamy notes.\r\n\r\nPerfect for daily wear and for those who love comforting, edible-inspired aromas.\r\n\r\nPackaged in a 30 ml premium spray bottle, easy to carry and travel-friendly.\r\n\r\nDesigned to give you a rich, warm, and irresistible fragrance experience.', 0.0, 0, 0, 'sweet', '2025-11-27 14:17:49', '2025-11-27 14:32:44', NULL, NULL, NULL, 'Notes & Ingredients \r\n\r\nTop Note:\r\n\r\nJasmine\r\n\r\nHeart Notes:\r\n\r\nCoffee\r\n\r\nCoconut\r\n\r\nBase Note:\r\n\r\nVanilla\r\n                                                                                                                                         \r\nIngredients: Ethanol, jasmine essential oil, coffee extract, coconut extract, vanilla extract, phenoxyethanol.', NULL, NULL, 'sweet', 'transparent', 'Floretta India', 'spray', NULL, NULL),
(29, 'Sandal Spirit Perfume', 30, 'Sandal Spirit is a warm, soulful fragrance crafted for those who love the richness of pure sandalwood. Its smooth, earthy aroma brings a sense of calm, luxury, and timeless elegance with every spray. Long-lasting, soothing, and perfect for both daily wear and special occasions, Sandal Spirit adds a graceful charm to your presence.', 599.00, 999.00, NULL, 0, 0, NULL, 50.00, 0, NULL, 'images/uproducts/sandal-spirit-perfume/img1_1764234154_692813aa26680.png', 'perfume', 'Crafted with a rich and earthy sandalwood aroma\r\n\r\nLong-lasting fragrance suitable for all-day wear\r\n\r\nSmooth, warm and calming scent profile\r\n\r\nIdeal for daily use and special occasions\r\n\r\nSkin-friendly formulation\r\n\r\nComes in a 30 ml spray bottle\r\n\r\nPerfect for those who love classic, soothing woody notes', 0.0, 0, 0, 'woody', '2025-11-27 14:32:34', '2025-11-27 14:32:34', NULL, NULL, NULL, 'Fragrance Notes\r\n\r\nTop Notes: Rose, Jasmine\r\n\r\nHeart Notes: Sandalwood, Patchouli\r\n\r\nBase Note: Ylang Ylang\r\n\r\nIngredients\r\n\r\nEthanol, Phenoxyethanol, Fragrance Oils (Rose, Jasmine, Sandalwood, Patchouli, Ylang Ylang)', NULL, NULL, 'Woody', 'transparent', 'Floretta India', 'spray', NULL, NULL),
(30, 'Try Me Perfume Set', 5, 'Discover your next signature scent with our Try Me Perfume Set, featuring 4 unique and bestselling fragrances — Flower Valley, Zest of Summer, Coco Fudge, and Gilli Mitti. Each perfume comes in a compact 5 ml mini pack, perfect for trying out new scents before going full size.\r\n\r\nLightweight, stylish, and 100% travel-friendly, these minis slip easily into your purse, pocket, or clutch, making them ideal for on-the-go freshness.', 284.98, 399.00, NULL, 0, 0, NULL, 20.00, 0, NULL, 'images/uproducts/try-me-perfume-set/img1_1764239138_692827221d220.png', 'perfume', 'Contains 4 unique fragrances: Flower Valley, Zest of Summer, Coco Fudge & Gilli Mitti\r\n\r\nComes in 5 ml mini bottles — perfect for sampling and gifting\r\n\r\nTravel-friendly and easy to carry anywhere\r\n\r\nLong-lasting fragrances crafted for everyday wear\r\n\r\nIdeal for office, travel, events, and daily freshness\r\n\r\nThoughtfully curated to suit different moods and personalities', 0.0, 0, 0, 'floral', '2025-11-27 15:55:38', '2025-11-29 09:37:47', NULL, NULL, NULL, ': Ethanol (perfume grade), Distilled water, Phenoxyethanol, Rose essential oil, Jasmine essential oil, Ylang-ylang essential oil, Lemon essential oil, Orange essential oil, Bergamot essential oil, Cocoa fragrance oil, Vanilla essential oil, Tonka bean extract, Mitti attar, Patchouli essential oil, Sandalwood essential oil.', NULL, NULL, 'Floral, woody, citrus', 'Transparent', 'Floretta India', 'Spray', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `product_images`
--

CREATE TABLE `product_images` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `product_id` bigint(20) UNSIGNED NOT NULL,
  `image_path` varchar(255) NOT NULL,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `is_primary` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `product_images`
--

INSERT INTO `product_images` (`id`, `product_id`, `image_path`, `sort_order`, `is_primary`, `created_at`, `updated_at`) VALUES
(31, 15, 'images/uproducts/jasmine-room-freshener-spray/img1_1763977558_6924295616462.png', 0, 1, '2025-11-24 15:15:58', '2025-11-24 15:15:58'),
(32, 15, 'images/uproducts/jasmine-room-freshener-spray/img2_1763977558_6924295616668.png', 1, 0, '2025-11-24 15:15:58', '2025-11-24 15:15:58'),
(33, 14, 'images/uproducts/jasmine-room-freshener-spray/img1_1763977986_69242b0273c18.png', 0, 1, '2025-11-24 15:23:06', '2025-11-24 15:23:06'),
(34, 14, 'images/uproducts/jasmine-room-freshener-spray/img2_1763977986_69242b0273dfd.png', 1, 0, '2025-11-24 15:23:06', '2025-11-24 15:23:06'),
(35, 16, 'images/uproducts/rose-room-freshener-spray/img1_1763978716_69242ddc15132.png', 0, 1, '2025-11-24 15:35:16', '2025-11-24 15:35:16'),
(36, 16, 'images/uproducts/rose-room-freshener-spray/img2_1763978716_69242ddc152c9.png', 1, 0, '2025-11-24 15:35:16', '2025-11-24 15:35:16'),
(37, 21, 'images/uproducts/lemongrass-room-freshener-can/img1_1764145541_6926b985a9e3d.png', 0, 1, '2025-11-26 13:55:41', '2025-11-26 13:55:41'),
(38, 21, 'images/uproducts/lemongrass-room-freshener-can/img2_1764145541_6926b985aa06b.png', 1, 0, '2025-11-26 13:55:41', '2025-11-26 13:55:41'),
(39, 21, 'images/uproducts/lemongrass-room-freshener-can/img3_1764145541_6926b985aa1cd.png', 2, 0, '2025-11-26 13:55:41', '2025-11-26 13:55:41'),
(40, 21, 'images/uproducts/lemongrass-room-freshener-can/img4_1764145541_6926b985aa2f4.png', 3, 0, '2025-11-26 13:55:41', '2025-11-26 13:55:41'),
(41, 20, 'images/uproducts/rose-room-freshener-can/img1_1764145597_6926b9bd77513.png', 0, 1, '2025-11-26 13:56:37', '2025-11-26 13:56:37'),
(42, 22, 'images/uproducts/jasmine-room-freshener-can/img1_1764145641_6926b9e9dc4e8.png', 0, 1, '2025-11-26 13:57:21', '2025-11-26 13:57:21'),
(43, 23, 'images/uproducts/jasmine-face-mist/img1_1764155505_6926e071e1b0d.png', 0, 1, '2025-11-26 16:41:45', '2025-11-26 16:41:45'),
(44, 23, 'images/uproducts/jasmine-face-mist/img2_1764155505_6926e071e1c5d.png', 1, 0, '2025-11-26 16:41:45', '2025-11-26 16:41:45'),
(45, 23, 'images/uproducts/jasmine-face-mist/img3_1764155505_6926e071e1d44.png', 2, 0, '2025-11-26 16:41:45', '2025-11-26 16:41:45'),
(46, 23, 'images/uproducts/jasmine-face-mist/img4_1764155505_6926e071e1e50.png', 3, 0, '2025-11-26 16:41:45', '2025-11-26 16:41:45'),
(47, 23, 'images/uproducts/jasmine-face-mist/img5_1764155505_6926e071e1fa6.png', 4, 0, '2025-11-26 16:41:45', '2025-11-26 16:41:45'),
(48, 24, 'images/uproducts/rose-face-mist/img1_1764156297_6926e389ecc01.png', 0, 1, '2025-11-26 16:54:57', '2025-11-26 16:54:57'),
(49, 24, 'images/uproducts/rose-face-mist/img2_1764156297_6926e389ecd55.png', 1, 0, '2025-11-26 16:54:57', '2025-11-26 16:54:57'),
(50, 24, 'images/uproducts/rose-face-mist/img3_1764156297_6926e389ece85.png', 2, 0, '2025-11-26 16:54:57', '2025-11-26 16:54:57'),
(51, 24, 'images/uproducts/rose-face-mist/img4_1764156297_6926e389ecf8b.png', 3, 0, '2025-11-26 16:54:57', '2025-11-26 16:54:57'),
(52, 24, 'images/uproducts/rose-face-mist/img5_1764156297_6926e389ed0aa.png', 4, 0, '2025-11-26 16:54:57', '2025-11-26 16:54:57'),
(53, 25, 'images/uproducts/gilli-mitti-perfume/img1_1764167566_69270f8e5646b.png', 0, 1, '2025-11-26 20:02:46', '2025-11-26 20:02:46'),
(54, 25, 'images/uproducts/gilli-mitti-perfume/img2_1764167566_69270f8e565b8.png', 1, 0, '2025-11-26 20:02:46', '2025-11-26 20:02:46'),
(55, 25, 'images/uproducts/gilli-mitti-perfume/img3_1764167566_69270f8e566b9.png', 2, 0, '2025-11-26 20:02:46', '2025-11-26 20:02:46'),
(56, 25, 'images/uproducts/gilli-mitti-perfume/img4_1764167566_69270f8e56784.png', 3, 0, '2025-11-26 20:02:46', '2025-11-26 20:02:46'),
(57, 26, 'images/uproducts/flower-valley-perfume/img1_1764232111_69280baf9d3d7.png', 0, 1, '2025-11-27 13:58:31', '2025-11-27 13:58:31'),
(58, 26, 'images/uproducts/flower-valley-perfume/img2_1764232111_69280baf9d596.png', 1, 0, '2025-11-27 13:58:31', '2025-11-27 13:58:31'),
(59, 26, 'images/uproducts/flower-valley-perfume/img3_1764232111_69280baf9d6e3.png', 2, 0, '2025-11-27 13:58:31', '2025-11-27 13:58:31'),
(60, 26, 'images/uproducts/flower-valley-perfume/img4_1764232111_69280baf9d823.png', 3, 0, '2025-11-27 13:58:31', '2025-11-27 13:58:31'),
(61, 27, 'images/uproducts/gulaab-e-heer-perfume/img1_1764232693_69280df574c1a.png', 0, 1, '2025-11-27 14:08:13', '2025-11-27 14:08:13'),
(62, 27, 'images/uproducts/gulaab-e-heer-perfume/img2_1764232693_69280df574d61.png', 1, 0, '2025-11-27 14:08:13', '2025-11-27 14:08:13'),
(63, 27, 'images/uproducts/gulaab-e-heer-perfume/img3_1764232693_69280df574e95.png', 2, 0, '2025-11-27 14:08:13', '2025-11-27 14:08:13'),
(64, 27, 'images/uproducts/gulaab-e-heer-perfume/img4_1764232693_69280df574fae.png', 3, 0, '2025-11-27 14:08:13', '2025-11-27 14:08:13'),
(65, 27, 'images/uproducts/gulaab-e-heer-perfume/img5_1764232693_69280df5750b9.png', 4, 0, '2025-11-27 14:08:13', '2025-11-27 14:08:13'),
(66, 28, 'images/uproducts/coffeenut-perfume/img1_1764233269_69281035a829e.png', 0, 1, '2025-11-27 14:17:49', '2025-11-27 14:17:49'),
(67, 28, 'images/uproducts/coffeenut-perfume/img2_1764233269_69281035a840e.png', 1, 0, '2025-11-27 14:17:49', '2025-11-27 14:17:49'),
(68, 28, 'images/uproducts/coffeenut-perfume/img3_1764233269_69281035a84ef.png', 2, 0, '2025-11-27 14:17:49', '2025-11-27 14:17:49'),
(69, 29, 'images/uproducts/sandal-spirit-perfume/img1_1764234154_692813aa26680.png', 0, 1, '2025-11-27 14:32:34', '2025-11-27 14:32:34'),
(70, 29, 'images/uproducts/sandal-spirit-perfume/img2_1764234154_692813aa267cc.png', 1, 0, '2025-11-27 14:32:34', '2025-11-27 14:32:34'),
(71, 29, 'images/uproducts/sandal-spirit-perfume/img3_1764234154_692813aa26926.png', 2, 0, '2025-11-27 14:32:34', '2025-11-27 14:32:34'),
(72, 29, 'images/uproducts/sandal-spirit-perfume/img4_1764234154_692813aa26a3b.png', 3, 0, '2025-11-27 14:32:34', '2025-11-27 14:32:34'),
(73, 30, 'images/uproducts/try-me-perfume-set/img1_1764239138_692827221d220.png', 0, 1, '2025-11-27 15:55:38', '2025-11-27 15:55:38'),
(74, 30, 'images/uproducts/try-me-perfume-set/img2_1764239138_692827221d3c0.png', 1, 0, '2025-11-27 15:55:38', '2025-11-27 15:55:38'),
(75, 30, 'images/uproducts/try-me-perfume-set/img3_1764239138_692827221d532.png', 2, 0, '2025-11-27 15:55:38', '2025-11-27 15:55:38'),
(76, 30, 'images/uproducts/try-me-perfume-set/img4_1764239138_692827221d677.png', 3, 0, '2025-11-27 15:55:38', '2025-11-27 15:55:38'),
(77, 30, 'images/uproducts/try-me-perfume-set/img5_1764239138_692827221d7ff.png', 4, 0, '2025-11-27 15:55:38', '2025-11-27 15:55:38');

-- --------------------------------------------------------

--
-- Table structure for table `room_freshner`
--

CREATE TABLE `room_freshner` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `image` varchar(255) NOT NULL,
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
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sliders`
--

CREATE TABLE `sliders` (
  `id` int(11) NOT NULL,
  `page` enum('home','products','liveperfume','hotelamenities') NOT NULL DEFAULT 'home',
  `image` varchar(255) NOT NULL,
  `order` int(11) NOT NULL DEFAULT 0,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `flag` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sliders`
--

INSERT INTO `sliders` (`id`, `page`, `image`, `order`, `created_at`, `updated_at`, `flag`) VALUES
(24, 'home', 'images/sliders/home/slider_1764753922_6930020294b68.png', 0, '2025-12-03 14:55:22', '2025-12-03 14:55:22', NULL),
(25, 'home', 'images/sliders/home/slider_1764753934_6930020e327df.png', 1, '2025-12-03 14:55:34', '2025-12-03 14:55:34', NULL),
(26, 'home', 'images/sliders/home/slider_1764753946_6930021a4e4a0.png', 2, '2025-12-03 14:55:46', '2025-12-03 14:55:46', NULL),
(27, 'products', 'images/sliders/products/slider_1764753974_693002368c913.png', 0, '2025-12-03 14:56:14', '2025-12-03 14:56:14', NULL),
(28, 'products', 'images/sliders/products/slider_1764753982_6930023edb740.png', 1, '2025-12-03 14:56:22', '2025-12-03 14:56:22', NULL),
(29, 'products', 'images/sliders/products/slider_1764753990_69300246d9975.png', 2, '2025-12-03 14:56:30', '2025-12-03 14:56:30', NULL),
(30, 'products', 'images/sliders/products/slider_1764754014_6930025e62d42.png', 3, '2025-12-03 14:56:54', '2025-12-03 14:56:54', NULL),
(31, 'products', 'images/sliders/products/slider_1764754024_6930026832cbb.png', 4, '2025-12-03 14:57:04', '2025-12-03 14:57:04', NULL),
(32, 'products', 'images/sliders/products/slider_1764754040_69300278c2f98.png', 5, '2025-12-03 14:57:20', '2025-12-03 14:57:20', NULL),
(33, 'liveperfume', 'images/sliders/liveperfume/slider_1764754062_6930028e0cf03.png', 0, '2025-12-03 14:57:42', '2025-12-03 14:57:42', NULL),
(34, 'liveperfume', 'images/sliders/liveperfume/slider_1764754075_6930029b24067.png', 1, '2025-12-03 14:57:55', '2025-12-03 14:57:55', NULL),
(35, 'hotelamenities', 'images/sliders/hotelamenities/slider_1764754094_693002ae10009.png', 0, '2025-12-03 14:58:14', '2025-12-03 14:58:14', NULL),
(36, 'hotelamenities', 'images/sliders/hotelamenities/slider_1764754101_693002b5809ae.png', 1, '2025-12-03 14:58:21', '2025-12-03 14:58:21', NULL);

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

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `google_id` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `mobile` varchar(255) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `gst_number` varchar(255) DEFAULT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `pin` varchar(10) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `address1` varchar(255) DEFAULT NULL,
  `address2` varchar(255) DEFAULT NULL,
  `address3` varchar(255) DEFAULT NULL,
  `address4` varchar(255) DEFAULT NULL,
  `address5` varchar(255) DEFAULT NULL,
  `default_address_index` int(11) DEFAULT 1,
  `email_verification_otp` varchar(6) DEFAULT NULL,
  `otp_expires_at` timestamp NULL DEFAULT NULL,
  `email_verified` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `google_id`, `image`, `password`, `mobile`, `address`, `gst_number`, `email_verified_at`, `remember_token`, `created_at`, `updated_at`, `pin`, `city`, `address1`, `address2`, `address3`, `address4`, `address5`, `default_address_index`, `email_verification_otp`, `otp_expires_at`, `email_verified`) VALUES
(12, 'Mahek kaushik', 'kaushikmahek98@gmail.com', '108883098199611657702', NULL, '$2y$12$fqgjcDyZHEd1yGDZoRkZT.6ivJliU7DFHEh7Igx8DzpvDHY42JQ82', NULL, NULL, NULL, NULL, NULL, '2025-11-27 15:57:45', '2025-11-27 15:57:45', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, 0),
(13, 'LAKSHITA SHARMA', 'lakshitasharmaa1902@gmail.com', NULL, NULL, '$2y$12$uv2LpWkTvdJyRi/NUnvceOEurO3jCPe2WSHRbKqZjjzcRATfVXGkC', '6376866717', NULL, NULL, NULL, NULL, '2025-11-27 18:09:16', '2025-11-27 18:11:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, 1),
(14, 'Chitrak Ambasta', 'chitrakambasta@gmail.com', NULL, NULL, '$2y$12$A5jH5EmX7aIFw.p/IuKOtO2V6iIXD02vOtXdZIlBs3tr449WO0ekS', '8168301637', NULL, NULL, NULL, NULL, '2025-11-27 18:09:50', '2025-11-27 18:10:38', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, 1),
(15, 'Bhasker sharma', 'bhaskersharma13@gmail.com', NULL, NULL, '$2y$12$Urq4HgxjybUmR/Jf1UZgPeC//al38viglpLbXjsXMY5igJTL3ljWO', '8427182071', NULL, NULL, NULL, NULL, '2025-11-27 22:24:18', '2025-11-27 22:27:10', NULL, NULL, '{\"label\":\"Ajmer\",\"name\":\"Bhasker sharma\",\"address\":\"TIPL toshniwal industries private limited , makhupura road , near parbatpura bypass ajmer.\",\"city\":\"Ajmer, Rajasthan\",\"pin\":\"305002\",\"mobile\":\"8427182071\"}', '{\"label\":\"Home \",\"name\":\"Bhasker sharma\",\"address\":\"NEAR OLD MC OFFICE HOSHIARPUR ROAD, GARSHANKAR, ward no:-5, house no 1542.\",\"city\":\"Garhshankar,Punjab\",\"pin\":\"144527\",\"mobile\":\"8427182071\"}', NULL, NULL, NULL, 1, NULL, NULL, 1),
(16, 'Riya Jangid', 'riyajangid2607@gmail.com', '105555086883457266466', NULL, '$2y$12$g65mn6ZayVsRXqx0T8pMV.plWlIOgyEatRMIT.XQsuLCQCFT0vGga', NULL, NULL, NULL, NULL, NULL, '2025-12-05 15:41:03', '2025-12-05 15:41:03', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, 0);

-- --------------------------------------------------------

--
-- Table structure for table `wishlists`
--

CREATE TABLE `wishlists` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `product_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
-- Indexes for table `men`
--
ALTER TABLE `men`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `men_email_unique` (`email`);

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
  ADD UNIQUE KEY `orders_order_number_unique` (`order_number`),
  ADD KEY `orders_user_id_foreign` (`user_id`);

--
-- Indexes for table `order_status_updates`
--
ALTER TABLE `order_status_updates`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_status_updates_order_id_foreign` (`order_id`);

--
-- Indexes for table `password_reset_otps`
--
ALTER TABLE `password_reset_otps`
  ADD PRIMARY KEY (`id`),
  ADD KEY `password_reset_otps_email_index` (`email`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `product_images`
--
ALTER TABLE `product_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_images_product_id_index` (`product_id`),
  ADD KEY `product_images_product_id_sort_order_index` (`product_id`,`sort_order`);

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
  ADD UNIQUE KEY `users_email_unique` (`email`),
  ADD UNIQUE KEY `google_id` (`google_id`);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `bar_packages`
--
ALTER TABLE `bar_packages`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `bookings`
--
ALTER TABLE `bookings`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `carts`
--
ALTER TABLE `carts`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=66;

--
-- AUTO_INCREMENT for table `coco`
--
ALTER TABLE `coco`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `contacts`
--
ALTER TABLE `contacts`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `freshner_mist`
--
ALTER TABLE `freshner_mist`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

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
-- AUTO_INCREMENT for table `men`
--
ALTER TABLE `men`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=94;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `order_status_updates`
--
ALTER TABLE `order_status_updates`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `password_reset_otps`
--
ALTER TABLE `password_reset_otps`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `product_images`
--
ALTER TABLE `product_images`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=78;

--
-- AUTO_INCREMENT for table `room_freshner`
--
ALTER TABLE `room_freshner`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `sliders`
--
ALTER TABLE `sliders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

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

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `wishlists`
--
ALTER TABLE `wishlists`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `order_status_updates`
--
ALTER TABLE `order_status_updates`
  ADD CONSTRAINT `order_status_updates_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `product_images`
--
ALTER TABLE `product_images`
  ADD CONSTRAINT `product_images_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

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
