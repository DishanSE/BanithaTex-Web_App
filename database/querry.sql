-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: localhost    Database: banitha_tex_db
-- ------------------------------------------------------
-- Server version	8.0.41

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `cart_items`
--

DROP TABLE IF EXISTS `cart_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cart_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int NOT NULL,
  `selected_count_id` int NOT NULL,
  `color` varchar(50) DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `cart_id` (`cart_id`),
  KEY `product_id` (`product_id`),
  KEY `selected_count_id` (`selected_count_id`),
  CONSTRAINT `cart_items_ibfk_1` FOREIGN KEY (`cart_id`) REFERENCES `carts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `cart_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `cart_items_ibfk_3` FOREIGN KEY (`selected_count_id`) REFERENCES `yarn_counts` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=73 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart_items`
--

LOCK TABLES `cart_items` WRITE;
/*!40000 ALTER TABLE `cart_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `cart_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `carts`
--

DROP TABLE IF EXISTS `carts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `carts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carts`
--

LOCK TABLES `carts` WRITE;
/*!40000 ALTER TABLE `carts` DISABLE KEYS */;
INSERT INTO `carts` VALUES (1,1,'2025-03-05 11:39:03','2025-03-05 11:39:03'),(3,3,'2025-03-27 13:28:36','2025-03-27 13:28:36'),(4,4,'2025-03-27 13:47:45','2025-03-27 13:47:45'),(5,6,'2025-03-29 05:07:11','2025-03-29 05:07:11'),(6,7,'2025-04-07 07:09:15','2025-04-07 07:09:15'),(7,8,'2025-04-07 07:20:19','2025-04-07 07:20:19');
/*!40000 ALTER TABLE `carts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int NOT NULL,
  `selected_count_id` int NOT NULL,
  `color` varchar(50) DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `product_id` (`product_id`),
  KEY `selected_count_id` (`selected_count_id`),
  CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `order_items_ibfk_3` FOREIGN KEY (`selected_count_id`) REFERENCES `yarn_counts` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=96 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` VALUES (2,2,7,150,5,'Red',18000.00,'2025-03-29 06:58:10'),(3,8,7,100,5,'Red',12000.00,'2025-03-29 07:32:44'),(5,13,17,100,6,'Red',12000.00,'2025-03-29 07:39:50'),(6,16,17,100,6,'Red',12000.00,'2025-03-29 08:11:55'),(8,17,4,100,5,'Grey',12000.00,'2025-03-29 08:13:12'),(10,23,13,100,4,'Blue',12000.00,'2025-03-29 08:46:23'),(11,27,13,100,4,'Blue',12000.00,'2025-03-29 11:28:23'),(12,31,6,100,2,'White',12000.00,'2025-03-29 11:43:56'),(14,34,6,100,2,'White',12000.00,'2025-03-29 12:00:29'),(15,35,4,100,5,'Grey',12000.00,'2025-03-29 12:00:56'),(16,36,11,100,3,'Red',10000.00,'2025-03-29 12:01:26'),(17,37,13,10,4,'Blue',1200.00,'2025-03-29 12:02:19'),(18,38,11,10,3,'Red',1000.00,'2025-03-29 12:03:03'),(19,38,17,10,6,'Red',1200.00,'2025-03-29 12:03:03'),(20,39,17,10,6,'Red',1200.00,'2025-03-29 12:08:29'),(21,40,17,10,6,'Red',1200.00,'2025-03-29 12:13:07'),(22,41,17,10,6,'Red',1200.00,'2025-03-29 12:14:46'),(23,41,5,10,3,'Blue',1100.00,'2025-03-29 12:14:46'),(24,41,6,10,2,'White',1200.00,'2025-03-29 12:14:46'),(25,42,17,10,6,'Red',1200.00,'2025-03-29 12:16:41'),(26,42,5,10,3,'Blue',1100.00,'2025-03-29 12:16:41'),(27,42,6,10,2,'White',1200.00,'2025-03-29 12:16:41'),(28,43,17,10,6,'Red',1200.00,'2025-03-29 12:24:30'),(29,43,5,10,3,'Blue',1100.00,'2025-03-29 12:24:30'),(30,43,6,10,2,'White',1200.00,'2025-03-29 12:24:30'),(31,44,17,10,6,'Red',1200.00,'2025-03-29 12:29:26'),(32,44,5,10,3,'Blue',1100.00,'2025-03-29 12:29:26'),(33,44,6,10,2,'White',1200.00,'2025-03-29 12:29:26'),(34,45,17,10,6,'Red',1200.00,'2025-03-29 12:30:09'),(35,45,5,10,3,'Blue',1100.00,'2025-03-29 12:30:09'),(36,45,6,10,2,'White',1200.00,'2025-03-29 12:30:09'),(37,46,17,10,6,'Red',1200.00,'2025-03-29 12:31:19'),(38,46,5,10,3,'Blue',1100.00,'2025-03-29 12:31:19'),(39,46,6,10,2,'White',1200.00,'2025-03-29 12:31:19'),(40,47,17,10,6,'Red',1200.00,'2025-03-29 12:35:38'),(41,47,5,10,3,'Blue',1100.00,'2025-03-29 12:35:38'),(42,47,6,10,2,'White',1200.00,'2025-03-29 12:35:38'),(43,48,17,10,6,'Red',1200.00,'2025-03-29 12:40:15'),(44,48,5,10,3,'Blue',1100.00,'2025-03-29 12:40:15'),(45,48,6,10,2,'White',1200.00,'2025-03-29 12:40:15'),(46,49,5,150,3,'Blue',16500.00,'2025-03-29 12:42:13'),(47,49,8,150,7,'Red',18000.00,'2025-03-29 12:42:13'),(48,49,17,100,6,'Red',12000.00,'2025-03-29 12:42:13'),(49,50,5,150,3,'Blue',16500.00,'2025-03-29 12:43:16'),(50,50,8,150,7,'Red',18000.00,'2025-03-29 12:43:16'),(51,50,17,100,6,'Red',12000.00,'2025-03-29 12:43:16'),(52,51,7,100,5,'Red',12000.00,'2025-03-29 12:46:51'),(53,52,17,10,6,'Red',120.00,'2025-03-31 04:32:36'),(54,53,11,10,3,'Red',1000.00,'2025-03-31 04:33:10'),(55,54,11,10,3,'Red',1000.00,'2025-03-31 04:48:46'),(56,55,11,10,3,'Red',1000.00,'2025-04-01 13:45:47'),(57,58,21,100,5,'Red',18000.00,'2025-04-03 13:34:48'),(58,59,4,108,5,'Grey',12960.00,'2025-04-05 06:31:08'),(59,60,5,105,3,'Blue',11550.00,'2025-04-05 07:26:00'),(60,62,32,100,6,'Red',18000.00,'2025-04-05 09:32:37'),(61,63,32,100,6,'Red',18000.00,'2025-04-05 09:38:20'),(62,64,32,100,6,'Red',18000.00,'2025-04-05 09:38:49'),(63,65,32,100,6,'Red',18000.00,'2025-04-05 10:11:29'),(64,66,17,133,6,'Red',15960.00,'2025-04-05 10:36:16'),(65,67,11,133,3,'Red',13300.00,'2025-04-05 10:38:46'),(66,68,5,15,3,'Blue',1650.00,'2025-04-05 10:40:11'),(67,69,4,18,5,'Grey',2160.00,'2025-04-05 10:40:27'),(68,70,4,135,5,'Grey',16200.00,'2025-04-05 17:34:45'),(69,71,4,135,5,'Grey',16200.00,'2025-04-05 17:39:40'),(70,72,33,100,7,'Red',15000.00,'2025-04-05 17:52:52'),(71,73,4,10,5,'Grey',1200.00,'2025-04-05 17:53:22'),(73,75,33,10,7,'Red',1500.00,'2025-04-05 17:59:07'),(74,76,11,10,3,'Red',1000.00,'2025-04-06 11:21:22'),(75,77,6,11,2,'White',1320.00,'2025-04-06 12:40:38'),(77,79,17,100,6,'Red',12000.00,'2025-04-07 07:10:36'),(78,80,11,100,3,'Red',10000.00,'2025-04-07 07:13:29'),(79,81,6,19,2,'White',2280.00,'2025-04-07 07:15:20'),(80,82,13,100,4,'Blue',12000.00,'2025-04-07 07:16:35'),(84,86,6,109,2,'White',13080.00,'2025-04-07 17:26:20'),(85,87,6,10,2,'White',1200.00,'2025-04-07 17:31:34'),(86,88,4,10,5,'Grey',1200.00,'2025-04-07 17:32:14'),(87,89,5,10,3,'Blue',1100.00,'2025-04-07 17:33:00'),(88,90,5,11,3,'Blue',1210.00,'2025-04-08 03:43:04'),(89,91,4,18,5,'Grey',2160.00,'2025-04-08 04:09:46'),(90,92,11,11,3,'Red',1100.00,'2025-04-08 04:27:56'),(91,93,17,17,6,'Red',2040.00,'2025-04-08 04:32:21'),(92,94,11,10,3,'Red',1000.00,'2025-04-08 04:34:37'),(93,95,17,10,6,'Red',1200.00,'2025-04-08 04:52:41'),(94,96,11,10,3,'Red',1000.00,'2025-04-08 04:53:40'),(95,97,17,10,6,'Red',1200.00,'2025-04-08 05:07:16');
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `status` enum('pending','shipped','delivered','cancelled') DEFAULT 'pending',
  `shipping_address` text NOT NULL,
  `payment_method` enum('cod','card') NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=98 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (2,6,2700000.00,'shipped','colombo 14','cod','2025-03-29 06:58:10','2025-04-02 08:11:40'),(8,6,1200000.00,'pending','colombo 14','cod','2025-03-29 07:32:44','2025-03-29 07:32:44'),(9,6,1200000.00,'pending','colombo 14','cod','2025-03-29 07:35:19','2025-03-29 07:35:19'),(13,6,1200000.00,'pending','colombo 2','cod','2025-03-29 07:39:50','2025-03-29 07:39:50'),(16,6,1200000.00,'pending','colombo 14','cod','2025-03-29 08:11:55','2025-03-29 08:11:55'),(17,6,2400000.00,'pending','Colombo 01','cod','2025-03-29 08:13:12','2025-03-29 08:13:12'),(23,6,1200000.00,'pending','colombo 14','cod','2025-03-29 08:46:23','2025-03-29 08:46:23'),(27,6,1200000.00,'pending','colombo 13','cod','2025-03-29 11:28:23','2025-03-29 11:28:23'),(31,6,1200000.00,'pending','colombo','cod','2025-03-29 11:43:56','2025-03-29 11:43:56'),(32,6,1250000.00,'pending','colombo','cod','2025-03-29 11:44:24','2025-03-29 11:44:24'),(34,6,1200000.00,'pending','','cod','2025-03-29 12:00:29','2025-03-29 12:00:29'),(35,6,1200000.00,'pending','colombo','cod','2025-03-29 12:00:56','2025-03-29 12:00:56'),(36,6,1000000.00,'pending','colombo','cod','2025-03-29 12:01:26','2025-03-29 12:01:26'),(37,6,12000.00,'pending','colombo 12','cod','2025-03-29 12:02:19','2025-03-29 12:02:19'),(38,6,22000.00,'pending','colombo ','cod','2025-03-29 12:03:03','2025-03-29 12:03:03'),(39,6,12050.00,'pending','colombo 1','cod','2025-03-29 12:08:29','2025-03-29 12:08:29'),(40,6,1250.00,'pending','dpkcnwo','cod','2025-03-29 12:13:07','2025-03-29 12:13:07'),(41,6,1200.01,'pending','flvnljfn','cod','2025-03-29 12:14:46','2025-03-29 12:14:46'),(42,6,35000.00,'pending','flvnljfn','cod','2025-03-29 12:16:40','2025-03-29 12:16:40'),(43,6,35000.00,'pending','flvnljfn','cod','2025-03-29 12:24:30','2025-03-29 12:24:30'),(44,6,35000.00,'pending','kjbjugvgvkh','cod','2025-03-29 12:29:26','2025-03-29 12:29:26'),(45,6,35000.00,'pending','hehehehee','cod','2025-03-29 12:30:09','2025-03-29 12:30:09'),(46,6,3650.00,'pending','hohohohho','cod','2025-03-29 12:31:19','2025-03-29 12:31:19'),(47,6,3650.00,'pending','jiuhyuguybkjh','cod','2025-03-29 12:35:38','2025-03-29 12:35:38'),(48,6,3550.00,'pending','aiaiai','cod','2025-03-29 12:40:15','2025-03-29 12:40:15'),(49,6,46550.00,'pending','De Mel Watta','cod','2025-03-29 12:42:13','2025-03-29 12:42:13'),(50,6,46550.00,'pending','lkncljnlad','cod','2025-03-29 12:43:16','2025-03-29 12:43:16'),(51,6,12050.00,'pending','jjofjf','cod','2025-03-29 12:46:51','2025-03-29 12:46:51'),(52,6,170.00,'pending','hehehe','cod','2025-03-31 04:32:36','2025-03-31 04:32:36'),(53,6,1050.00,'pending','dkjkew','cod','2025-03-31 04:33:10','2025-03-31 04:33:10'),(54,6,1050.00,'pending','ghvyfuglo','cod','2025-03-31 04:48:46','2025-03-31 04:48:46'),(55,6,1050.00,'delivered','ijhweihewi','cod','2025-04-01 13:45:47','2025-04-02 08:05:50'),(58,6,18050.00,'shipped','colo','cod','2025-04-03 13:34:48','2025-04-04 15:28:40'),(59,6,13010.00,'pending','helooo','cod','2025-04-05 06:31:08','2025-04-05 06:31:08'),(60,4,11600.00,'pending','heloo','card','2025-04-05 07:26:00','2025-04-05 07:26:00'),(62,6,1800050.00,'pending','hhbihujk','cod','2025-04-05 09:32:37','2025-04-05 09:32:37'),(63,6,1800050.00,'pending','duljfcnelf','cod','2025-04-05 09:38:20','2025-04-05 09:38:20'),(64,6,1800050.00,'pending','efjlwikfnw;ikcmd\'','cod','2025-04-05 09:38:49','2025-04-05 09:38:49'),(65,6,1800050.00,'pending','fnjnpmp;kcn\'','cod','2025-04-05 10:11:29','2025-04-05 10:11:29'),(66,6,2122730.00,'pending','hehehe','cod','2025-04-05 10:36:16','2025-04-05 10:36:16'),(67,6,1768950.00,'pending','hello its me','cod','2025-04-05 10:38:46','2025-04-05 10:38:46'),(68,6,24800.00,'pending','hehe','cod','2025-04-05 10:40:11','2025-04-05 10:40:11'),(69,6,38930.00,'pending','hehe','cod','2025-04-05 10:40:27','2025-04-05 10:40:27'),(70,6,2187050.00,'pending','test','cod','2025-04-05 17:34:45','2025-04-05 17:34:45'),(71,6,2187050.00,'pending','jrjjjeje','cod','2025-04-05 17:39:40','2025-04-05 17:39:40'),(72,6,15050.00,'pending','hehehehe','cod','2025-04-05 17:52:52','2025-04-05 17:52:52'),(73,6,1250.00,'shipped','heheeh','cod','2025-04-05 17:53:22','2025-04-06 10:38:15'),(75,6,1550.00,'shipped','hehehe','cod','2025-04-05 17:59:07','2025-04-06 10:33:39'),(76,6,1050.00,'pending','hehehe','card','2025-04-06 11:21:22','2025-04-06 11:21:22'),(77,6,1370.00,'pending','test','cod','2025-04-06 12:40:38','2025-04-06 12:40:38'),(78,6,1925.00,'pending','hehehe','card','2025-04-06 15:05:42','2025-04-06 15:05:42'),(79,7,12050.00,'pending','','card','2025-04-07 07:10:36','2025-04-07 07:10:36'),(80,7,10050.00,'pending','kfjp;kfoqekf[\'','card','2025-04-07 07:13:29','2025-04-07 07:13:29'),(81,6,2330.00,'shipped','iojoeifjp;','cod','2025-04-07 07:15:20','2025-04-07 07:30:56'),(82,7,12050.00,'shipped','kjfpifjpeqij','cod','2025-04-07 07:16:35','2025-04-07 07:30:36'),(83,6,12550.00,'pending','ouhiufhei','cod','2025-04-07 07:18:07','2025-04-07 07:18:07'),(84,8,1425.00,'pending','wjfhwoufhoif','cod','2025-04-07 07:20:37','2025-04-07 07:20:37'),(85,8,13550.00,'pending','colombo 13','card','2025-04-07 07:26:38','2025-04-07 07:26:38'),(86,7,13130.00,'pending','hello','cod','2025-04-07 17:26:20','2025-04-07 17:26:20'),(87,7,1250.00,'pending','obk','cod','2025-04-07 17:31:34','2025-04-07 17:31:34'),(88,7,1250.00,'pending','hhbiu','cod','2025-04-07 17:32:14','2025-04-07 17:32:14'),(89,7,1150.00,'pending','wemf;km','cod','2025-04-07 17:33:00','2025-04-07 17:33:00'),(90,6,1260.00,'pending','testing','card','2025-04-08 03:43:04','2025-04-08 03:43:04'),(91,6,2210.00,'pending','','cod','2025-04-08 04:09:46','2025-04-08 04:09:46'),(92,6,1150.00,'pending','testing','card','2025-04-08 04:27:56','2025-04-08 04:27:56'),(93,8,2090.00,'pending','colombo 12','card','2025-04-08 04:32:21','2025-04-08 04:32:21'),(94,8,1050.00,'shipped','ljbih','cod','2025-04-08 04:34:37','2025-04-08 04:47:03'),(95,4,1250.00,'pending','Sri Lanka','cod','2025-04-08 04:52:41','2025-04-08 04:52:41'),(96,4,1050.00,'pending','mbk','cod','2025-04-08 04:53:40','2025-04-08 04:53:40'),(97,4,1250.00,'pending','jnojfp','cod','2025-04-08 05:07:16','2025-04-08 05:07:16');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_yarn_counts`
--

DROP TABLE IF EXISTS `product_yarn_counts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_yarn_counts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `yarn_count_id` int NOT NULL,
  `color` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_product_count` (`product_id`,`color`,`yarn_count_id`),
  KEY `yarn_count_id` (`yarn_count_id`),
  CONSTRAINT `product_yarn_counts_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `product_yarn_counts_ibfk_2` FOREIGN KEY (`yarn_count_id`) REFERENCES `yarn_counts` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_yarn_counts`
--

LOCK TABLES `product_yarn_counts` WRITE;
/*!40000 ALTER TABLE `product_yarn_counts` DISABLE KEYS */;
INSERT INTO `product_yarn_counts` VALUES (1,4,5,'Grey'),(2,5,3,'Blue'),(3,6,2,'White'),(4,7,6,'Blue'),(5,8,7,'White'),(6,11,3,'Red'),(8,13,4,'Blue'),(9,17,6,'Red'),(10,18,6,'Purple'),(11,21,5,'Red'),(12,23,6,'Red'),(14,32,5,'Black'),(15,33,7,'White'),(17,35,1,'Red');
/*!40000 ALTER TABLE `product_yarn_counts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text,
  `price` decimal(10,2) NOT NULL,
  `color` varchar(50) NOT NULL DEFAULT 'unspecified',
  `stock_quantity` int NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `type_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `type_id` (`type_id`),
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`type_id`) REFERENCES `yarn_types` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (4,'Carded Cotton Yarn','High-quality carded cotton',120.00,'Grey',66,'/uploads/carded_cotton.webp',1,'2025-02-26 09:51:46','2025-04-08 04:09:46'),(5,'Combed Cotton Yarn','High-quality combed cotton',110.00,'Blue',979,'/uploads/combed_cotton.webp',1,'2025-02-27 12:26:26','2025-04-08 03:43:04'),(6,'Polyester Yarn','High-quality polyester cotton',120.00,'White',171,'/uploads/polyester.jpeg',2,'2025-02-27 12:28:42','2025-04-07 17:31:34'),(7,'Wool-Cotton Blend Yarn','High-quality blended yarns',120.00,'Blue',1000,'/uploads/wool_cotton.jpg',3,'2025-02-27 12:32:02','2025-04-03 13:45:21'),(8,'Wool-Cotton Blend Yarn','High-quality blended yarn',120.00,'White',200,'/uploads/wool_cotton.jpg',3,'2025-02-27 12:56:00','2025-03-29 12:43:16'),(11,'Silk Yarn','High-quality sillk yarn',100.00,'Red',86,'/uploads/silk.webp',4,'2025-02-27 13:11:44','2025-04-08 04:53:40'),(13,'Spandex Yarn','High-quality spandex yarn',120.00,'Blue',690,'/uploads/spandex.jpg',2,'2025-03-10 11:54:42','2025-04-07 07:16:35'),(17,'Linen Yarn','High-quality linen yarn',120.00,'Red',63,'/uploads/linen.jpeg',4,'2025-03-10 12:51:19','2025-04-08 05:07:16'),(18,'Poly-Cotton Blend Yarn','High quality  ploy cotton blend yarn.',180.00,'Purple',1000,'/uploads/poly_cotton.webp',3,'2025-04-03 08:59:25','2025-04-03 09:02:41'),(21,'Organic Cotton Yarn','H',180.00,'Red',380,'/uploads/1743687045891-product.jpg',1,'2025-04-03 13:30:45','2025-04-04 16:43:21'),(23,'Organic Cotton Yarn','High quality cotton yarn.',180.00,'Red',800,'/uploads/1743818264137-product.jpg',1,'2025-04-05 01:57:44','2025-04-05 01:57:44'),(32,'Organic Cotton Yarn','testingg...',180.00,'Black',600,'/uploads/1743837495103-product.jpg',1,'2025-04-05 07:18:15','2025-04-05 10:11:29'),(33,'Organic Cotton Yarn','testingg',150.00,'White',200,'/uploads/1743872929156-product.jpg',1,'2025-04-05 17:08:49','2025-04-06 09:54:10'),(35,'Organic Cotton Yarn','Cotton',120.00,'Red',1000,'/uploads/1744045251696-product.jpg',1,'2025-04-07 17:00:51','2025-04-07 17:00:51');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `gender` enum('Male','Female','Other') NOT NULL,
  `contact_no` varchar(15) DEFAULT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('customer','admin') DEFAULT 'customer',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `reset_password_token` varchar(255) DEFAULT NULL,
  `reset_password_expires` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Anandaraja ','Dishan','dishan123@gmail.com','Male','0764533223','$2a$10$7G21Cf6JAX22oJdlK7oPUODNzj9JjNcMob7by/0fc7EcPWliUojpe','customer','2025-02-26 06:45:36','2025-04-02 13:55:23',NULL,NULL),(3,'Admin','Admin','admin123@gmail.com','Female','1234567891','$2a$10$RauozxaRCsLSZ2CyDteQXeDqnA3ZqoiTwIU1I.2r1d3Nf88cpnrem','customer','2025-02-26 07:26:02','2025-04-02 13:55:59',NULL,NULL),(4,'Admin','User','admin12@gmail.com','Male','1234567890','$2a$10$ZjtAPBgTUiVZwaExGUqahe2HEocMrNq5UVvDqBym75BqHj6/uZOqu','admin','2025-02-26 07:29:44','2025-02-26 07:29:44',NULL,NULL),(6,'Dishan','Anandaraja','dishanraj13@gmail.com','Male','0719342448','$2a$10$DJU/zxYu1rTtIxvXkLmCwOc6viec8W/ke5DnLZjg1cMSAFbLZoOW.','customer','2025-03-29 05:06:56','2025-04-07 17:07:57',NULL,NULL),(7,'Rumaiz','Rizan','mohamedrumaiz19@gmail.com','Male','0764533223','$2a$10$Khtw8OJnSFl9ZxMTIYG0N.LNn6b5mgzT6aWOU9v8bHvNgkOLNdo/.','customer','2025-04-07 07:08:57','2025-04-07 07:08:57',NULL,NULL),(8,'Christiano ','Ronaldo ','ardishan34@gmail.com','Male','079135965658','$2a$10$tzh0c/7Bvxte7wVz1xF6D.ZpKTDGqZM4sWz6zupKYOzYZEAusMqyO','customer','2025-04-07 07:20:07','2025-04-08 04:31:26',NULL,NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `yarn_counts`
--

DROP TABLE IF EXISTS `yarn_counts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `yarn_counts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `count_value` varchar(10) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `count_value` (`count_value`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `yarn_counts`
--

LOCK TABLES `yarn_counts` WRITE;
/*!40000 ALTER TABLE `yarn_counts` DISABLE KEYS */;
INSERT INTO `yarn_counts` VALUES (1,'6/1','2025-02-26 08:06:08','2025-02-26 08:06:08'),(2,'8/1','2025-02-26 08:06:08','2025-02-26 08:06:08'),(3,'10/1','2025-02-26 08:06:08','2025-02-26 08:06:08'),(4,'12/1','2025-02-26 08:06:08','2025-02-26 08:06:08'),(5,'16/1','2025-02-26 08:06:08','2025-02-26 08:06:08'),(6,'24/1','2025-02-26 08:06:08','2025-02-26 08:06:08'),(7,'26/1','2025-02-26 08:06:08','2025-02-26 08:06:08'),(8,'30/1','2025-02-26 08:06:08','2025-02-26 08:06:08'),(9,'40/1','2025-02-26 08:06:08','2025-02-26 08:06:08'),(10,'50/1','2025-02-26 08:06:08','2025-02-26 08:06:08'),(11,'60/1','2025-02-26 08:06:08','2025-02-26 08:06:08');
/*!40000 ALTER TABLE `yarn_counts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `yarn_types`
--

DROP TABLE IF EXISTS `yarn_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `yarn_types` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `description` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `yarn_types`
--

LOCK TABLES `yarn_types` WRITE;
/*!40000 ALTER TABLE `yarn_types` DISABLE KEYS */;
INSERT INTO `yarn_types` VALUES (1,'Cotton','Natural fiber','2025-02-26 07:56:24','2025-02-26 07:56:24'),(2,'Synthetic','Man-made fiber','2025-02-26 07:56:24','2025-02-26 07:56:24'),(3,'Blended','Mixed fibers','2025-02-26 07:56:24','2025-02-26 07:56:24'),(4,'Specialty','Unique fibers','2025-02-26 07:56:24','2025-02-26 07:56:24');
/*!40000 ALTER TABLE `yarn_types` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-09  9:42:35
