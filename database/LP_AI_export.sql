-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: LP_AI
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `ai_suggestions`
--

DROP TABLE IF EXISTS `ai_suggestions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ai_suggestions` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `type` varchar(50) DEFAULT NULL,
  `prompt_snapshot` text DEFAULT NULL,
  `suggestion_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`suggestion_data`)),
  `fin_score` int(10) unsigned NOT NULL DEFAULT 0,
  `daily_limit` decimal(12,2) DEFAULT NULL,
  `meal_plan` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`meal_plan`)),
  `tips` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`tips`)),
  `anomalies` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`anomalies`)),
  `model_used` varchar(255) DEFAULT NULL,
  `tokens_used` int(10) unsigned DEFAULT NULL,
  `generated_at` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ai_suggestions_user_id_foreign` (`user_id`),
  CONSTRAINT `ai_suggestions_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ai_suggestions`
--

LOCK TABLES `ai_suggestions` WRITE;
/*!40000 ALTER TABLE `ai_suggestions` DISABLE KEYS */;
INSERT INTO `ai_suggestions` VALUES (1,1,'financial_advice','Analyze my spending and provide tips','{\"summary\":\"Spending on entertainment is 15% above average\",\"tips\":[\"Reduce dining out\",\"Use coupons\",\"Set auto-savings\"]}',78,5000.00,NULL,'[\"Save automatically\",\"Track daily expenses\",\"Review subscriptions\"]','[\"High shopping on Sunday\"]','gemini-1.5-flash',1200,'2026-04-21 09:04:03','2026-04-28 03:04:03','2026-04-28 03:04:03'),(2,1,'meal_plan','Generate a healthy meal plan','[\"Breakfast: Oats\",\"Lunch: Chicken rice\",\"Dinner: Fish\"]',82,5000.00,'[{\"time\":\"Breakfast\",\"name\":\"Oats with fruits\",\"cost\":150},{\"time\":\"Lunch\",\"name\":\"Chicken biryani\",\"cost\":300},{\"time\":\"Dinner\",\"name\":\"Fish curry with rice\",\"cost\":250}]','[\"Eat more vegetables\",\"Drink water before meals\"]','[]','gemini-1.5-pro',800,'2026-04-21 09:04:03','2026-04-28 03:04:03','2026-04-28 03:04:03'),(3,2,'financial_advice','Analyze my spending and provide tips','{\"summary\":\"Spending on entertainment is 15% above average\",\"tips\":[\"Reduce dining out\",\"Use coupons\",\"Set auto-savings\"]}',78,2833.33,NULL,'[\"Save automatically\",\"Track daily expenses\",\"Review subscriptions\"]','[\"High shopping on Sunday\"]','gemini-1.5-flash',1200,'2026-04-27 09:04:08','2026-04-28 03:04:08','2026-04-28 03:04:08'),(4,2,'meal_plan','Generate a healthy meal plan','[\"Breakfast: Oats\",\"Lunch: Chicken rice\",\"Dinner: Fish\"]',82,2833.33,'[{\"time\":\"Breakfast\",\"name\":\"Oats with fruits\",\"cost\":150},{\"time\":\"Lunch\",\"name\":\"Chicken biryani\",\"cost\":300},{\"time\":\"Dinner\",\"name\":\"Fish curry with rice\",\"cost\":250}]','[\"Eat more vegetables\",\"Drink water before meals\"]','[]','gemini-1.5-pro',800,'2026-04-27 09:04:08','2026-04-28 03:04:08','2026-04-28 03:04:08'),(5,3,'financial_advice','Analyze my spending and provide tips','{\"summary\":\"Spending on entertainment is 15% above average\",\"tips\":[\"Reduce dining out\",\"Use coupons\",\"Set auto-savings\"]}',78,2000.00,NULL,'[\"Save automatically\",\"Track daily expenses\",\"Review subscriptions\"]','[\"High shopping on Sunday\"]','gemini-1.5-flash',1200,'2026-04-24 09:04:12','2026-04-28 03:04:12','2026-04-28 03:04:12'),(6,3,'meal_plan','Generate a healthy meal plan','[\"Breakfast: Oats\",\"Lunch: Chicken rice\",\"Dinner: Fish\"]',82,2000.00,'[{\"time\":\"Breakfast\",\"name\":\"Oats with fruits\",\"cost\":150},{\"time\":\"Lunch\",\"name\":\"Chicken biryani\",\"cost\":300},{\"time\":\"Dinner\",\"name\":\"Fish curry with rice\",\"cost\":250}]','[\"Eat more vegetables\",\"Drink water before meals\"]','[]','gemini-1.5-pro',800,'2026-04-27 09:04:13','2026-04-28 03:04:13','2026-04-28 03:04:13');
/*!40000 ALTER TABLE `ai_suggestions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `budgets`
--

DROP TABLE IF EXISTS `budgets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `budgets` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `category` varchar(50) NOT NULL,
  `period` varchar(20) NOT NULL,
  `limit_amount` decimal(12,2) NOT NULL,
  `alert_at` tinyint(3) unsigned NOT NULL DEFAULT 80,
  `color` varchar(10) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `budgets_user_id_category_period_index` (`user_id`,`category`,`period`),
  CONSTRAINT `budgets_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `budgets`
--

LOCK TABLES `budgets` WRITE;
/*!40000 ALTER TABLE `budgets` DISABLE KEYS */;
INSERT INTO `budgets` VALUES (1,1,'food','monthly',10000.00,80,'#ef4444',1,'2026-04-28 03:04:03','2026-04-28 03:04:03'),(2,1,'transport','monthly',5000.00,75,'#3b82f6',1,'2026-04-28 03:04:03','2026-04-28 03:04:03'),(3,1,'entertainment','monthly',5000.00,90,'#f59e0b',1,'2026-04-28 03:04:03','2026-04-28 03:04:03'),(4,1,'shopping','monthly',8000.00,85,'#10b981',1,'2026-04-28 03:04:03','2026-04-28 03:04:03'),(5,1,'healthcare','monthly',5000.00,70,'#8b5cf6',1,'2026-04-28 03:04:03','2026-04-28 03:04:03'),(6,2,'food','monthly',10000.00,80,'#ef4444',1,'2026-04-28 03:04:08','2026-04-28 03:04:08'),(7,2,'transport','monthly',5000.00,75,'#3b82f6',1,'2026-04-28 03:04:08','2026-04-28 03:04:08'),(8,2,'entertainment','monthly',5000.00,90,'#f59e0b',1,'2026-04-28 03:04:08','2026-04-28 03:04:08'),(9,2,'shopping','monthly',8000.00,85,'#10b981',1,'2026-04-28 03:04:08','2026-04-28 03:04:08'),(10,2,'healthcare','monthly',5000.00,70,'#8b5cf6',1,'2026-04-28 03:04:08','2026-04-28 03:04:08'),(11,3,'food','monthly',10000.00,80,'#ef4444',1,'2026-04-28 03:04:11','2026-04-28 03:04:11'),(12,3,'transport','monthly',5000.00,75,'#3b82f6',1,'2026-04-28 03:04:11','2026-04-28 03:04:11'),(13,3,'entertainment','monthly',5000.00,90,'#f59e0b',1,'2026-04-28 03:04:12','2026-04-28 03:04:12'),(14,3,'shopping','monthly',8000.00,85,'#10b981',1,'2026-04-28 03:04:12','2026-04-28 03:04:12'),(15,3,'healthcare','monthly',5000.00,70,'#8b5cf6',1,'2026-04-28 03:04:12','2026-04-28 03:04:12');
/*!40000 ALTER TABLE `budgets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `expenses`
--

DROP TABLE IF EXISTS `expenses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `expenses` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `category` enum('Food','Transport','Shopping','Rent','Utilities','Bills','Entertainment','Health','Education','Other') NOT NULL,
  `description` varchar(500) DEFAULT NULL,
  `date` date NOT NULL,
  `payment_method` enum('Cash','Card','Bank Transfer','Mobile Payment') DEFAULT NULL,
  `is_recurring` tinyint(1) NOT NULL DEFAULT 0,
  `tags` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`tags`)),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `expenses_user_id_date_index` (`user_id`,`date`),
  KEY `expenses_user_id_category_index` (`user_id`,`category`),
  CONSTRAINT `expenses_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `expenses`
--

LOCK TABLES `expenses` WRITE;
/*!40000 ALTER TABLE `expenses` DISABLE KEYS */;
INSERT INTO `expenses` VALUES (1,1,450.00,'Food','Weekly grocery','2026-04-25','Card',0,'[\"food\"]','2026-04-28 03:04:04','2026-04-28 03:04:04'),(2,1,120.00,'Transport','Rickshaw','2026-04-23','Cash',0,'[\"transport\"]','2026-04-28 03:04:04','2026-04-28 03:04:04'),(3,1,2500.00,'Bills','Internet bill','2026-04-12','Bank Transfer',1,'[\"bills\"]','2026-04-28 03:04:04','2026-04-28 03:04:04'),(4,1,800.00,'Health','Pharmacy','2026-04-11','Card',0,'[\"health\"]','2026-04-28 03:04:04','2026-04-28 03:04:04'),(5,1,1500.00,'Education','Books','2026-04-11','Card',0,'[\"education\"]','2026-04-28 03:04:04','2026-04-28 03:04:04'),(6,1,3000.00,'Shopping','New shoes','2026-04-20','Card',0,'[\"shopping\"]','2026-04-28 03:04:04','2026-04-28 03:04:04'),(7,1,600.00,'Entertainment','Movie night','2026-04-24','Cash',0,'[\"entertainment\"]','2026-04-28 03:04:04','2026-04-28 03:04:04'),(8,1,200.00,'Food','Coffee','2026-04-11','Mobile Payment',0,'[\"food\"]','2026-04-28 03:04:04','2026-04-28 03:04:04'),(9,2,450.00,'Food','Weekly grocery','2026-04-18','Card',0,'[\"food\"]','2026-04-28 03:04:08','2026-04-28 03:04:08'),(10,2,120.00,'Transport','Rickshaw','2026-04-08','Cash',0,'[\"transport\"]','2026-04-28 03:04:08','2026-04-28 03:04:08'),(11,2,2500.00,'Bills','Internet bill','2026-04-13','Bank Transfer',1,'[\"bills\"]','2026-04-28 03:04:08','2026-04-28 03:04:08'),(12,2,800.00,'Health','Pharmacy','2026-04-18','Card',0,'[\"health\"]','2026-04-28 03:04:09','2026-04-28 03:04:09'),(13,2,1500.00,'Education','Books','2026-04-25','Card',0,'[\"education\"]','2026-04-28 03:04:10','2026-04-28 03:04:10'),(14,2,3000.00,'Shopping','New shoes','2026-04-27','Card',0,'[\"shopping\"]','2026-04-28 03:04:10','2026-04-28 03:04:10'),(15,2,600.00,'Entertainment','Movie night','2026-04-22','Cash',0,'[\"entertainment\"]','2026-04-28 03:04:10','2026-04-28 03:04:10'),(16,2,200.00,'Food','Coffee','2026-04-15','Mobile Payment',0,'[\"food\"]','2026-04-28 03:04:10','2026-04-28 03:04:10'),(17,3,450.00,'Food','Weekly grocery','2026-04-18','Card',0,'[\"food\"]','2026-04-28 03:04:13','2026-04-28 03:04:13'),(18,3,120.00,'Transport','Rickshaw','2026-04-25','Cash',0,'[\"transport\"]','2026-04-28 03:04:13','2026-04-28 03:04:13'),(19,3,2500.00,'Bills','Internet bill','2026-04-12','Bank Transfer',1,'[\"bills\"]','2026-04-28 03:04:13','2026-04-28 03:04:13'),(20,3,800.00,'Health','Pharmacy','2026-04-24','Card',0,'[\"health\"]','2026-04-28 03:04:13','2026-04-28 03:04:13'),(21,3,1500.00,'Education','Books','2026-04-18','Card',0,'[\"education\"]','2026-04-28 03:04:13','2026-04-28 03:04:13'),(22,3,3000.00,'Shopping','New shoes','2026-04-21','Card',0,'[\"shopping\"]','2026-04-28 03:04:13','2026-04-28 03:04:13'),(23,3,600.00,'Entertainment','Movie night','2026-04-12','Cash',0,'[\"entertainment\"]','2026-04-28 03:04:13','2026-04-28 03:04:13'),(24,3,200.00,'Food','Coffee','2026-04-25','Mobile Payment',0,'[\"food\"]','2026-04-28 03:04:13','2026-04-28 03:04:13');
/*!40000 ALTER TABLE `expenses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `financial_goals`
--

DROP TABLE IF EXISTS `financial_goals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `financial_goals` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `goal_name` varchar(200) NOT NULL,
  `target_amount` decimal(12,2) NOT NULL,
  `current_amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `deadline` date NOT NULL,
  `priority` tinyint(3) unsigned NOT NULL,
  `monthly_contribution` decimal(12,2) DEFAULT NULL,
  `category` enum('savings','investment','debt_payoff','purchase') NOT NULL,
  `status` enum('active','completed','abandoned') NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `financial_goals_user_id_status_index` (`user_id`,`status`),
  KEY `financial_goals_user_id_priority_index` (`user_id`,`priority`),
  CONSTRAINT `financial_goals_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `financial_goals`
--

LOCK TABLES `financial_goals` WRITE;
/*!40000 ALTER TABLE `financial_goals` DISABLE KEYS */;
INSERT INTO `financial_goals` VALUES (1,1,'Emergency Fund',300000.00,150000.00,'2027-04-28',1,15000.00,'savings','active','2026-04-28 03:04:06','2026-04-28 03:04:06'),(2,1,'Home Down Payment',1000000.00,300000.00,'2029-04-28',2,30000.00,'purchase','active','2026-04-28 03:04:06','2026-04-28 03:04:06'),(3,1,'Hajj Fund',800000.00,100000.00,'2031-04-28',3,15000.00,'savings','active','2026-04-28 03:04:06','2026-04-28 03:04:06'),(4,2,'Emergency Fund',300000.00,150000.00,'2027-04-28',1,15000.00,'savings','active','2026-04-28 03:04:10','2026-04-28 03:04:10'),(5,2,'Home Down Payment',1000000.00,300000.00,'2029-04-28',2,30000.00,'purchase','active','2026-04-28 03:04:10','2026-04-28 03:04:10'),(6,2,'Hajj Fund',800000.00,100000.00,'2031-04-28',3,15000.00,'savings','active','2026-04-28 03:04:11','2026-04-28 03:04:11'),(7,3,'Emergency Fund',300000.00,150000.00,'2027-04-28',1,15000.00,'savings','active','2026-04-28 03:04:14','2026-04-28 03:04:14'),(8,3,'Home Down Payment',1000000.00,300000.00,'2029-04-28',2,30000.00,'purchase','active','2026-04-28 03:04:15','2026-04-28 03:04:15'),(9,3,'Hajj Fund',800000.00,100000.00,'2031-04-28',3,15000.00,'savings','active','2026-04-28 03:04:15','2026-04-28 03:04:15');
/*!40000 ALTER TABLE `financial_goals` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `health_profiles`
--

DROP TABLE IF EXISTS `health_profiles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `health_profiles` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `diet_preference` varchar(255) DEFAULT NULL,
  `dietary_preferences` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`dietary_preferences`)),
  `allergies` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`allergies`)),
  `health_conditions` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`health_conditions`)),
  `medical_conditions` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`medical_conditions`)),
  `health_goals` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`health_goals`)),
  `activity_level` varchar(20) NOT NULL DEFAULT 'moderate',
  `bmi` decimal(5,2) DEFAULT NULL,
  `daily_food_budget` decimal(10,2) DEFAULT NULL,
  `target_calories` int(10) unsigned DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `health_profiles_user_id_foreign` (`user_id`),
  CONSTRAINT `health_profiles_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `health_profiles`
--

LOCK TABLES `health_profiles` WRITE;
/*!40000 ALTER TABLE `health_profiles` DISABLE KEYS */;
INSERT INTO `health_profiles` VALUES (1,1,NULL,'[\"vegetables\",\"protein\",\"low_sugar\"]',NULL,'[\"none\"]',NULL,'[\"maintain_weight\",\"improve_fitness\"]','very_active',22.60,400.00,2200,'Regular gym-goer. Prefers home-cooked meals.','2026-04-28 03:04:03','2026-04-28 03:04:03'),(2,2,NULL,'[\"vegetables\",\"protein\",\"low_sugar\"]',NULL,'[\"none\"]',NULL,'[\"maintain_weight\",\"improve_fitness\"]','sedentary',21.80,400.00,2200,'Regular gym-goer. Prefers home-cooked meals.','2026-04-28 03:04:08','2026-04-28 03:04:08'),(3,3,NULL,'[\"vegetables\",\"protein\",\"low_sugar\"]',NULL,'[\"none\"]',NULL,'[\"maintain_weight\",\"improve_fitness\"]','sedentary',26.60,400.00,2200,'Regular gym-goer. Prefers home-cooked meals.','2026-04-28 03:04:13','2026-04-28 03:04:13');
/*!40000 ALTER TABLE `health_profiles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `income_sources`
--

DROP TABLE IF EXISTS `income_sources`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `income_sources` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `source_type` enum('salary','freelance','business','investment','other') NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `frequency` enum('monthly','weekly','one-time','yearly') NOT NULL,
  `category` varchar(50) NOT NULL,
  `description` varchar(500) DEFAULT NULL,
  `date` date NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `income_sources_user_id_source_type_index` (`user_id`,`source_type`),
  KEY `income_sources_user_id_date_index` (`user_id`,`date`),
  CONSTRAINT `income_sources_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `income_sources`
--

LOCK TABLES `income_sources` WRITE;
/*!40000 ALTER TABLE `income_sources` DISABLE KEYS */;
INSERT INTO `income_sources` VALUES (1,1,'salary',150000.00,'monthly','Primary','Full-time job salary','2026-04-01','2026-04-28 03:04:06','2026-04-28 03:04:06'),(2,1,'freelance',15000.00,'monthly','Secondary','Web development projects','2026-04-13','2026-04-28 03:04:06','2026-04-28 03:04:06'),(3,2,'salary',85000.00,'monthly','Primary','Full-time job salary','2026-04-01','2026-04-28 03:04:10','2026-04-28 03:04:10'),(4,2,'freelance',15000.00,'monthly','Secondary','Web development projects','2026-04-13','2026-04-28 03:04:10','2026-04-28 03:04:10'),(5,3,'salary',60000.00,'monthly','Primary','Full-time job salary','2026-04-01','2026-04-28 03:04:14','2026-04-28 03:04:14'),(6,3,'freelance',15000.00,'monthly','Secondary','Web development projects','2026-04-13','2026-04-28 03:04:14','2026-04-28 03:04:14');
/*!40000 ALTER TABLE `income_sources` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `investments`
--

DROP TABLE IF EXISTS `investments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `investments` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `investment_type` enum('stocks','bonds','mutual_funds','fixed_deposits','gold','real_estate') NOT NULL,
  `asset_name` varchar(200) NOT NULL,
  `amount_invested` decimal(12,2) NOT NULL,
  `current_value` decimal(12,2) DEFAULT NULL,
  `purchase_date` date NOT NULL,
  `quantity` decimal(12,4) DEFAULT NULL,
  `platform` varchar(100) DEFAULT NULL,
  `returns` decimal(8,2) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `investments_user_id_investment_type_index` (`user_id`,`investment_type`),
  CONSTRAINT `investments_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `investments`
--

LOCK TABLES `investments` WRITE;
/*!40000 ALTER TABLE `investments` DISABLE KEYS */;
INSERT INTO `investments` VALUES (1,1,'stocks','Grameenphone Ltd.',50000.00,58000.00,'2025-10-28',100.0000,'DSE Broker',16.00,'Long-term telecom holding','2026-04-28 03:04:06','2026-04-28 03:04:06'),(2,1,'mutual_funds','ABBL First Mutual Fund',100000.00,112000.00,'2025-04-28',500.0000,'ABBL',12.00,'Balanced fund','2026-04-28 03:04:06','2026-04-28 03:04:06'),(3,1,'gold','Gold ETF',30000.00,34500.00,'2026-01-28',10.0000,'Bank',15.00,'Hedging investment','2026-04-28 03:04:06','2026-04-28 03:04:06'),(4,2,'stocks','Grameenphone Ltd.',50000.00,58000.00,'2025-10-28',100.0000,'DSE Broker',16.00,'Long-term telecom holding','2026-04-28 03:04:11','2026-04-28 03:04:11'),(5,2,'mutual_funds','ABBL First Mutual Fund',100000.00,112000.00,'2025-04-28',500.0000,'ABBL',12.00,'Balanced fund','2026-04-28 03:04:11','2026-04-28 03:04:11'),(6,2,'gold','Gold ETF',30000.00,34500.00,'2026-01-28',10.0000,'Bank',15.00,'Hedging investment','2026-04-28 03:04:11','2026-04-28 03:04:11'),(7,3,'stocks','Grameenphone Ltd.',50000.00,58000.00,'2025-10-28',100.0000,'DSE Broker',16.00,'Long-term telecom holding','2026-04-28 03:04:15','2026-04-28 03:04:15'),(8,3,'mutual_funds','ABBL First Mutual Fund',100000.00,112000.00,'2025-04-28',500.0000,'ABBL',12.00,'Balanced fund','2026-04-28 03:04:15','2026-04-28 03:04:15'),(9,3,'gold','Gold ETF',30000.00,34500.00,'2026-01-28',10.0000,'Bank',15.00,'Hedging investment','2026-04-28 03:04:15','2026-04-28 03:04:15');
/*!40000 ALTER TABLE `investments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `meetings`
--

DROP TABLE IF EXISTS `meetings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `meetings` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `title` varchar(200) NOT NULL,
  `description` text DEFAULT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `location` varchar(200) DEFAULT NULL,
  `attendees` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`attendees`)),
  `reminder` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `meetings_user_id_date_index` (`user_id`,`date`),
  CONSTRAINT `meetings_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `meetings`
--

LOCK TABLES `meetings` WRITE;
/*!40000 ALTER TABLE `meetings` DISABLE KEYS */;
INSERT INTO `meetings` VALUES (1,1,'Team Standup','Daily dev team sync','2026-04-29','09:30:00','Conference Room A','[\"Alice\",\"Bob\"]',1,'2026-04-28 03:04:04','2026-04-28 03:04:04'),(2,1,'Client Review','Q2 results presentation','2026-05-01','14:00:00','Zoom','[\"Client Team\",\"Manager\"]',1,'2026-04-28 03:04:04','2026-04-28 03:04:04'),(3,1,'Parent Meeting','School annual review','2026-05-05','16:00:00','School','[\"Teacher\"]',1,'2026-04-28 03:04:04','2026-04-28 03:04:04'),(4,2,'Team Standup','Daily dev team sync','2026-04-29','09:30:00','Conference Room A','[\"Alice\",\"Bob\"]',1,'2026-04-28 03:04:08','2026-04-28 03:04:08'),(5,2,'Client Review','Q2 results presentation','2026-05-01','14:00:00','Zoom','[\"Client Team\",\"Manager\"]',1,'2026-04-28 03:04:08','2026-04-28 03:04:08'),(6,2,'Parent Meeting','School annual review','2026-05-05','16:00:00','School','[\"Teacher\"]',1,'2026-04-28 03:04:08','2026-04-28 03:04:08'),(7,3,'Team Standup','Daily dev team sync','2026-04-29','09:30:00','Conference Room A','[\"Alice\",\"Bob\"]',1,'2026-04-28 03:04:13','2026-04-28 03:04:13'),(8,3,'Client Review','Q2 results presentation','2026-05-01','14:00:00','Zoom','[\"Client Team\",\"Manager\"]',1,'2026-04-28 03:04:13','2026-04-28 03:04:13'),(9,3,'Parent Meeting','School annual review','2026-05-05','16:00:00','School','[\"Teacher\"]',1,'2026-04-28 03:04:13','2026-04-28 03:04:13');
/*!40000 ALTER TABLE `meetings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `migrations` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES (1,'2026_04_27_000001_create_users_table',1),(2,'2026_04_27_000002_create_transactions_table',1),(3,'2026_04_27_000003_create_budgets_table',1),(4,'2026_04_27_000004_create_ai_suggestions_table',1),(5,'2026_04_27_000005_create_health_profiles_table',1),(6,'2026_04_27_000006_create_reports_table',1),(7,'2026_04_28_000001_add_created_by_ai_to_transactions',1),(8,'2026_04_28_000002_add_currency_to_transactions',1),(9,'2026_04_28_000003_update_health_profiles',1),(10,'2026_04_29_000001_create_routines_table',1),(11,'2026_04_29_000002_create_meetings_table',1),(12,'2026_04_29_000003_create_expenses_table',1),(13,'2026_04_29_000004_create_tasks_table',1),(14,'2026_04_29_000005_create_prayer_times_table',1),(15,'2026_04_29_000006_create_income_sources_table',1),(16,'2026_04_29_000007_create_financial_goals_table',1),(17,'2026_04_29_000008_create_investments_table',1),(18,'2026_04_29_000009_create_savings_table',1),(19,'2026_04_29_000010_create_user_finance_profiles_table',1);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `prayer_times`
--

DROP TABLE IF EXISTS `prayer_times`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `prayer_times` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `date` date NOT NULL,
  `fajr` time NOT NULL,
  `dhuhr` time NOT NULL,
  `asr` time NOT NULL,
  `maghrib` time NOT NULL,
  `isha` time NOT NULL,
  `city` varchar(100) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `latitude` decimal(10,7) DEFAULT NULL,
  `longitude` decimal(10,7) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `prayer_times_user_id_date_unique` (`user_id`,`date`),
  KEY `prayer_times_user_id_date_index` (`user_id`,`date`),
  CONSTRAINT `prayer_times_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prayer_times`
--

LOCK TABLES `prayer_times` WRITE;
/*!40000 ALTER TABLE `prayer_times` DISABLE KEYS */;
INSERT INTO `prayer_times` VALUES (1,1,'2026-04-28','05:15:00','12:30:00','15:45:00','18:22:00','19:45:00','Dhaka','Bangladesh',23.8103000,90.4125000,'2026-04-28 03:04:06','2026-04-28 03:04:06'),(2,1,'2026-04-27','05:15:00','12:30:00','15:45:00','18:22:00','19:45:00','Dhaka','Bangladesh',23.8103000,90.4125000,'2026-04-28 03:04:06','2026-04-28 03:04:06'),(3,1,'2026-04-26','05:15:00','12:30:00','15:45:00','18:22:00','19:45:00','Dhaka','Bangladesh',23.8103000,90.4125000,'2026-04-28 03:04:06','2026-04-28 03:04:06'),(4,1,'2026-04-25','05:15:00','12:30:00','15:45:00','18:22:00','19:45:00','Dhaka','Bangladesh',23.8103000,90.4125000,'2026-04-28 03:04:06','2026-04-28 03:04:06'),(5,1,'2026-04-24','05:15:00','12:30:00','15:45:00','18:22:00','19:45:00','Dhaka','Bangladesh',23.8103000,90.4125000,'2026-04-28 03:04:06','2026-04-28 03:04:06'),(6,2,'2026-04-28','05:15:00','12:30:00','15:45:00','18:22:00','19:45:00','Dhaka','Bangladesh',23.8103000,90.4125000,'2026-04-28 03:04:10','2026-04-28 03:04:10'),(7,2,'2026-04-27','05:15:00','12:30:00','15:45:00','18:22:00','19:45:00','Dhaka','Bangladesh',23.8103000,90.4125000,'2026-04-28 03:04:10','2026-04-28 03:04:10'),(8,2,'2026-04-26','05:15:00','12:30:00','15:45:00','18:22:00','19:45:00','Dhaka','Bangladesh',23.8103000,90.4125000,'2026-04-28 03:04:10','2026-04-28 03:04:10'),(9,2,'2026-04-25','05:15:00','12:30:00','15:45:00','18:22:00','19:45:00','Dhaka','Bangladesh',23.8103000,90.4125000,'2026-04-28 03:04:10','2026-04-28 03:04:10'),(10,2,'2026-04-24','05:15:00','12:30:00','15:45:00','18:22:00','19:45:00','Dhaka','Bangladesh',23.8103000,90.4125000,'2026-04-28 03:04:10','2026-04-28 03:04:10'),(11,3,'2026-04-28','05:15:00','12:30:00','15:45:00','18:22:00','19:45:00','Dhaka','Bangladesh',23.8103000,90.4125000,'2026-04-28 03:04:13','2026-04-28 03:04:13'),(12,3,'2026-04-27','05:15:00','12:30:00','15:45:00','18:22:00','19:45:00','Dhaka','Bangladesh',23.8103000,90.4125000,'2026-04-28 03:04:13','2026-04-28 03:04:13'),(13,3,'2026-04-26','05:15:00','12:30:00','15:45:00','18:22:00','19:45:00','Dhaka','Bangladesh',23.8103000,90.4125000,'2026-04-28 03:04:14','2026-04-28 03:04:14'),(14,3,'2026-04-25','05:15:00','12:30:00','15:45:00','18:22:00','19:45:00','Dhaka','Bangladesh',23.8103000,90.4125000,'2026-04-28 03:04:14','2026-04-28 03:04:14'),(15,3,'2026-04-24','05:15:00','12:30:00','15:45:00','18:22:00','19:45:00','Dhaka','Bangladesh',23.8103000,90.4125000,'2026-04-28 03:04:14','2026-04-28 03:04:14');
/*!40000 ALTER TABLE `prayer_times` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reports`
--

DROP TABLE IF EXISTS `reports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `reports` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `type` varchar(50) NOT NULL,
  `period_label` varchar(255) NOT NULL,
  `summary` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`summary`)),
  `generated_at` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `reports_user_id_foreign` (`user_id`),
  CONSTRAINT `reports_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reports`
--

LOCK TABLES `reports` WRITE;
/*!40000 ALTER TABLE `reports` DISABLE KEYS */;
INSERT INTO `reports` VALUES (1,1,'monthly','April 2026','{\"total_income\":165000,\"total_expenses\":61700,\"net_savings\":103300,\"top_category\":\"rent\",\"savings_rate\":42.5}','2026-04-28 09:04:03','2026-04-28 03:04:03','2026-04-28 03:04:03'),(2,1,'annual','2026','{\"total_income\":1980000,\"total_expenses\":740400,\"annual_savings\":1239600,\"investment_growth\":12.5}','2026-04-28 09:04:04','2026-04-28 03:04:04','2026-04-28 03:04:04'),(3,2,'monthly','April 2026','{\"total_income\":100000,\"total_expenses\":61700,\"net_savings\":38300,\"top_category\":\"rent\",\"savings_rate\":42.5}','2026-04-28 09:04:08','2026-04-28 03:04:08','2026-04-28 03:04:08'),(4,2,'annual','2026','{\"total_income\":1200000,\"total_expenses\":740400,\"annual_savings\":459600,\"investment_growth\":12.5}','2026-04-28 09:04:08','2026-04-28 03:04:08','2026-04-28 03:04:08'),(5,3,'monthly','April 2026','{\"total_income\":75000,\"total_expenses\":61700,\"net_savings\":13300,\"top_category\":\"rent\",\"savings_rate\":42.5}','2026-04-28 09:04:13','2026-04-28 03:04:13','2026-04-28 03:04:13'),(6,3,'annual','2026','{\"total_income\":900000,\"total_expenses\":740400,\"annual_savings\":159600,\"investment_growth\":12.5}','2026-04-28 09:04:13','2026-04-28 03:04:13','2026-04-28 03:04:13');
/*!40000 ALTER TABLE `reports` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `routines`
--

DROP TABLE IF EXISTS `routines`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `routines` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `type` enum('student','professional','family') NOT NULL,
  `title` varchar(200) NOT NULL,
  `schedule` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`schedule`)),
  `tips` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`tips`)),
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `routines_user_id_active_index` (`user_id`,`active`),
  CONSTRAINT `routines_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `routines`
--

LOCK TABLES `routines` WRITE;
/*!40000 ALTER TABLE `routines` DISABLE KEYS */;
INSERT INTO `routines` VALUES (1,1,'professional','Daily Productivity Routine','[{\"time\":\"06:00\",\"activity\":\"Wake up and Fajr prayer\"},{\"time\":\"06:30\",\"activity\":\"Morning exercise\"},{\"time\":\"07:30\",\"activity\":\"Breakfast and planning\"},{\"time\":\"09:00\",\"activity\":\"Deep work session\"},{\"time\":\"12:30\",\"activity\":\"Lunch and Dhuhr prayer\"},{\"time\":\"14:00\",\"activity\":\"Meetings and collaboration\"},{\"time\":\"18:00\",\"activity\":\"Asr prayer and review\"},{\"time\":\"19:00\",\"activity\":\"Family time\"},{\"time\":\"20:30\",\"activity\":\"Maghrib and Isha prayers\"},{\"time\":\"21:30\",\"activity\":\"Reading and relaxation\"},{\"time\":\"22:30\",\"activity\":\"Sleep\"}]','[\"Stay hydrated\",\"Take breaks every hour\",\"Review tasks before sleep\"]',1,'2026-04-28 03:04:04','2026-04-28 03:04:04'),(2,1,'family','Weekend Family Routine','[{\"time\":\"08:00\",\"activity\":\"Family breakfast\"},{\"time\":\"09:30\",\"activity\":\"Grocery shopping\"},{\"time\":\"11:00\",\"activity\":\"Park visit\"},{\"time\":\"13:00\",\"activity\":\"Lunch together\"},{\"time\":\"15:00\",\"activity\":\"Movie time\"},{\"time\":\"18:00\",\"activity\":\"Dinner preparation\"},{\"time\":\"20:00\",\"activity\":\"Family games\"}]','[\"No phones during meals\",\"Plan activities together\"]',0,'2026-04-28 03:04:04','2026-04-28 03:04:04'),(3,2,'professional','Daily Productivity Routine','[{\"time\":\"06:00\",\"activity\":\"Wake up and Fajr prayer\"},{\"time\":\"06:30\",\"activity\":\"Morning exercise\"},{\"time\":\"07:30\",\"activity\":\"Breakfast and planning\"},{\"time\":\"09:00\",\"activity\":\"Deep work session\"},{\"time\":\"12:30\",\"activity\":\"Lunch and Dhuhr prayer\"},{\"time\":\"14:00\",\"activity\":\"Meetings and collaboration\"},{\"time\":\"18:00\",\"activity\":\"Asr prayer and review\"},{\"time\":\"19:00\",\"activity\":\"Family time\"},{\"time\":\"20:30\",\"activity\":\"Maghrib and Isha prayers\"},{\"time\":\"21:30\",\"activity\":\"Reading and relaxation\"},{\"time\":\"22:30\",\"activity\":\"Sleep\"}]','[\"Stay hydrated\",\"Take breaks every hour\",\"Review tasks before sleep\"]',1,'2026-04-28 03:04:08','2026-04-28 03:04:08'),(4,2,'family','Weekend Family Routine','[{\"time\":\"08:00\",\"activity\":\"Family breakfast\"},{\"time\":\"09:30\",\"activity\":\"Grocery shopping\"},{\"time\":\"11:00\",\"activity\":\"Park visit\"},{\"time\":\"13:00\",\"activity\":\"Lunch together\"},{\"time\":\"15:00\",\"activity\":\"Movie time\"},{\"time\":\"18:00\",\"activity\":\"Dinner preparation\"},{\"time\":\"20:00\",\"activity\":\"Family games\"}]','[\"No phones during meals\",\"Plan activities together\"]',0,'2026-04-28 03:04:08','2026-04-28 03:04:08'),(5,3,'professional','Daily Productivity Routine','[{\"time\":\"06:00\",\"activity\":\"Wake up and Fajr prayer\"},{\"time\":\"06:30\",\"activity\":\"Morning exercise\"},{\"time\":\"07:30\",\"activity\":\"Breakfast and planning\"},{\"time\":\"09:00\",\"activity\":\"Deep work session\"},{\"time\":\"12:30\",\"activity\":\"Lunch and Dhuhr prayer\"},{\"time\":\"14:00\",\"activity\":\"Meetings and collaboration\"},{\"time\":\"18:00\",\"activity\":\"Asr prayer and review\"},{\"time\":\"19:00\",\"activity\":\"Family time\"},{\"time\":\"20:30\",\"activity\":\"Maghrib and Isha prayers\"},{\"time\":\"21:30\",\"activity\":\"Reading and relaxation\"},{\"time\":\"22:30\",\"activity\":\"Sleep\"}]','[\"Stay hydrated\",\"Take breaks every hour\",\"Review tasks before sleep\"]',1,'2026-04-28 03:04:13','2026-04-28 03:04:13'),(6,3,'family','Weekend Family Routine','[{\"time\":\"08:00\",\"activity\":\"Family breakfast\"},{\"time\":\"09:30\",\"activity\":\"Grocery shopping\"},{\"time\":\"11:00\",\"activity\":\"Park visit\"},{\"time\":\"13:00\",\"activity\":\"Lunch together\"},{\"time\":\"15:00\",\"activity\":\"Movie time\"},{\"time\":\"18:00\",\"activity\":\"Dinner preparation\"},{\"time\":\"20:00\",\"activity\":\"Family games\"}]','[\"No phones during meals\",\"Plan activities together\"]',0,'2026-04-28 03:04:13','2026-04-28 03:04:13');
/*!40000 ALTER TABLE `routines` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `savings`
--

DROP TABLE IF EXISTS `savings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `savings` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `account_type` enum('bank','stocks','mutual_funds','fixed_deposit','cash') NOT NULL,
  `account_name` varchar(200) NOT NULL,
  `balance` decimal(12,2) NOT NULL,
  `interest_rate` decimal(5,2) DEFAULT NULL,
  `maturity_date` date DEFAULT NULL,
  `liquidity` enum('high','medium','low') NOT NULL DEFAULT 'medium',
  `institution` varchar(200) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `savings_user_id_account_type_index` (`user_id`,`account_type`),
  CONSTRAINT `savings_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `savings`
--

LOCK TABLES `savings` WRITE;
/*!40000 ALTER TABLE `savings` DISABLE KEYS */;
INSERT INTO `savings` VALUES (1,1,'bank','Primary Savings Account',250000.00,4.50,NULL,'high','BRAC Bank','2026-04-28 03:04:07','2026-04-28 03:04:07'),(2,1,'fixed_deposit','1 Year FD',100000.00,7.50,'2027-04-28','low','DBBL','2026-04-28 03:04:07','2026-04-28 03:04:07'),(3,1,'mutual_funds','Equity Fund',75000.00,NULL,NULL,'medium','IDLC','2026-04-28 03:04:07','2026-04-28 03:04:07'),(4,2,'bank','Primary Savings Account',250000.00,4.50,NULL,'high','BRAC Bank','2026-04-28 03:04:11','2026-04-28 03:04:11'),(5,2,'fixed_deposit','1 Year FD',100000.00,7.50,'2027-04-28','low','DBBL','2026-04-28 03:04:11','2026-04-28 03:04:11'),(6,2,'mutual_funds','Equity Fund',75000.00,NULL,NULL,'medium','IDLC','2026-04-28 03:04:11','2026-04-28 03:04:11'),(7,3,'bank','Primary Savings Account',250000.00,4.50,NULL,'high','BRAC Bank','2026-04-28 03:04:15','2026-04-28 03:04:15'),(8,3,'fixed_deposit','1 Year FD',100000.00,7.50,'2027-04-28','low','DBBL','2026-04-28 03:04:15','2026-04-28 03:04:15'),(9,3,'mutual_funds','Equity Fund',75000.00,NULL,NULL,'medium','IDLC','2026-04-28 03:04:15','2026-04-28 03:04:15');
/*!40000 ALTER TABLE `savings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tasks`
--

DROP TABLE IF EXISTS `tasks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tasks` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `title` varchar(200) NOT NULL,
  `description` text DEFAULT NULL,
  `priority` enum('low','medium','high') NOT NULL,
  `status` enum('pending','in-progress','completed','cancelled') NOT NULL DEFAULT 'pending',
  `date` date NOT NULL,
  `time` time DEFAULT NULL,
  `completed` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `tasks_user_id_date_index` (`user_id`,`date`),
  KEY `tasks_user_id_status_index` (`user_id`,`status`),
  KEY `tasks_user_id_priority_index` (`user_id`,`priority`),
  CONSTRAINT `tasks_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tasks`
--

LOCK TABLES `tasks` WRITE;
/*!40000 ALTER TABLE `tasks` DISABLE KEYS */;
INSERT INTO `tasks` VALUES (1,1,'Complete project documentation','Task via admin panel','high','pending','2026-04-30','19:00:00',0,'2026-04-28 03:04:04','2026-04-28 03:04:04'),(2,1,'Submit tax forms','Task via admin panel','high','in-progress','2026-05-03','20:00:00',0,'2026-04-28 03:04:04','2026-04-28 03:04:04'),(3,1,'Buy birthday gift','Task via admin panel','medium','pending','2026-05-01','15:00:00',0,'2026-04-28 03:04:04','2026-04-28 03:04:04'),(4,1,'Dentist appointment','Task via admin panel','medium','pending','2026-05-05','11:00:00',0,'2026-04-28 03:04:05','2026-04-28 03:04:05'),(5,1,'Organize closet','Task via admin panel','low','pending','2026-05-08','15:00:00',0,'2026-04-28 03:04:05','2026-04-28 03:04:05'),(6,1,'Review investment portfolio','Task via admin panel','high','completed','2026-04-26','14:00:00',1,'2026-04-28 03:04:05','2026-04-28 03:04:05'),(7,1,'Pay utility bills','Task via admin panel','high','completed','2026-04-27','16:00:00',1,'2026-04-28 03:04:05','2026-04-28 03:04:05'),(8,1,'Call insurance company','Task via admin panel','medium','in-progress','2026-05-02','16:00:00',0,'2026-04-28 03:04:06','2026-04-28 03:04:06'),(9,2,'Complete project documentation','Task via admin panel','high','pending','2026-04-30','14:00:00',0,'2026-04-28 03:04:10','2026-04-28 03:04:10'),(10,2,'Submit tax forms','Task via admin panel','high','in-progress','2026-05-03','10:00:00',0,'2026-04-28 03:04:10','2026-04-28 03:04:10'),(11,2,'Buy birthday gift','Task via admin panel','medium','pending','2026-05-01','11:00:00',0,'2026-04-28 03:04:10','2026-04-28 03:04:10'),(12,2,'Dentist appointment','Task via admin panel','medium','pending','2026-05-05','09:00:00',0,'2026-04-28 03:04:10','2026-04-28 03:04:10'),(13,2,'Organize closet','Task via admin panel','low','pending','2026-05-08','18:00:00',0,'2026-04-28 03:04:10','2026-04-28 03:04:10'),(14,2,'Review investment portfolio','Task via admin panel','high','completed','2026-04-26','12:00:00',1,'2026-04-28 03:04:10','2026-04-28 03:04:10'),(15,2,'Pay utility bills','Task via admin panel','high','completed','2026-04-27','15:00:00',1,'2026-04-28 03:04:10','2026-04-28 03:04:10'),(16,2,'Call insurance company','Task via admin panel','medium','in-progress','2026-05-02','10:00:00',0,'2026-04-28 03:04:10','2026-04-28 03:04:10'),(17,3,'Complete project documentation','Task via admin panel','high','pending','2026-04-30','17:00:00',0,'2026-04-28 03:04:13','2026-04-28 03:04:13'),(18,3,'Submit tax forms','Task via admin panel','high','in-progress','2026-05-03','16:00:00',0,'2026-04-28 03:04:13','2026-04-28 03:04:13'),(19,3,'Buy birthday gift','Task via admin panel','medium','pending','2026-05-01','15:00:00',0,'2026-04-28 03:04:13','2026-04-28 03:04:13'),(20,3,'Dentist appointment','Task via admin panel','medium','pending','2026-05-05','12:00:00',0,'2026-04-28 03:04:13','2026-04-28 03:04:13'),(21,3,'Organize closet','Task via admin panel','low','pending','2026-05-08','11:00:00',0,'2026-04-28 03:04:13','2026-04-28 03:04:13'),(22,3,'Review investment portfolio','Task via admin panel','high','completed','2026-04-26','08:00:00',1,'2026-04-28 03:04:13','2026-04-28 03:04:13'),(23,3,'Pay utility bills','Task via admin panel','high','completed','2026-04-27','15:00:00',1,'2026-04-28 03:04:13','2026-04-28 03:04:13'),(24,3,'Call insurance company','Task via admin panel','medium','in-progress','2026-05-02','15:00:00',0,'2026-04-28 03:04:13','2026-04-28 03:04:13');
/*!40000 ALTER TABLE `tasks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transactions`
--

DROP TABLE IF EXISTS `transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `transactions` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `type` varchar(20) NOT NULL,
  `category` varchar(50) NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `currency` varchar(5) NOT NULL DEFAULT 'BDT',
  `description` varchar(200) NOT NULL,
  `date` datetime NOT NULL,
  `period` varchar(20) NOT NULL,
  `tags` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`tags`)),
  `is_recurring` tinyint(1) NOT NULL DEFAULT 0,
  `recurring_interval` varchar(20) DEFAULT NULL,
  `payment_method` varchar(20) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `receipt_url` varchar(255) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_by_ai` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `transactions_user_id_date_index` (`user_id`,`date`),
  KEY `transactions_user_id_type_index` (`user_id`,`type`),
  KEY `transactions_user_id_category_index` (`user_id`,`category`),
  CONSTRAINT `transactions_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transactions`
--

LOCK TABLES `transactions` WRITE;
/*!40000 ALTER TABLE `transactions` DISABLE KEYS */;
INSERT INTO `transactions` VALUES (1,1,'income','salary',150000.00,'BDT','Monthly salary payment','2026-04-01 00:00:00','monthly','[\"salary\",\"primary\"]',1,'monthly','bank','Dhaka',NULL,NULL,0,'2026-04-28 03:04:03','2026-04-28 03:04:03'),(2,1,'income','freelance',15000.00,'BDT','Web development freelance project','2026-04-13 09:04:03','monthly','[\"freelance\",\"side-income\"]',0,NULL,'bank',NULL,NULL,NULL,0,'2026-04-28 03:04:03','2026-04-28 03:04:03'),(3,1,'expense','rent',25000.00,'BDT','Apartment rent','2026-04-15 09:04:03','monthly','[\"rent\",\"essential\"]',1,'monthly','card',NULL,NULL,NULL,0,'2026-04-28 03:04:03','2026-04-28 03:04:03'),(4,1,'expense','utilities',4500.00,'BDT','Electricity and water','2026-04-25 09:04:03','monthly','[\"utilities\",\"essential\"]',1,'monthly','card',NULL,NULL,NULL,0,'2026-04-28 03:04:03','2026-04-28 03:04:03'),(5,1,'expense','food',8500.00,'BDT','Grocery shopping','2026-04-20 09:04:03','monthly','[\"food\",\"essential\"]',0,NULL,'cash',NULL,NULL,NULL,0,'2026-04-28 03:04:03','2026-04-28 03:04:03'),(6,1,'expense','transport',3200.00,'BDT','Monthly bus pass','2026-04-18 09:04:03','monthly','[\"transport\",\"essential\"]',0,NULL,'cash',NULL,NULL,NULL,0,'2026-04-28 03:04:03','2026-04-28 03:04:03'),(7,1,'expense','healthcare',2000.00,'BDT','Medicine and checkup','2026-04-21 09:04:03','monthly','[\"healthcare\",\"essential\"]',0,NULL,'bank',NULL,NULL,NULL,0,'2026-04-28 03:04:03','2026-04-28 03:04:03'),(8,1,'expense','entertainment',3500.00,'BDT','Movies and dining','2026-04-23 09:04:03','monthly','[\"entertainment\",\"essential\"]',0,NULL,'cash',NULL,NULL,NULL,0,'2026-04-28 03:04:03','2026-04-28 03:04:03'),(9,1,'expense','shopping',5000.00,'BDT','Clothing and accessories','2026-04-12 09:04:03','monthly','[\"shopping\",\"essential\"]',0,NULL,'bank',NULL,NULL,NULL,0,'2026-04-28 03:04:03','2026-04-28 03:04:03'),(10,1,'expense','education',3000.00,'BDT','Online courses','2026-03-31 09:04:03','monthly','[\"education\",\"essential\"]',0,NULL,'cash',NULL,NULL,NULL,0,'2026-04-28 03:04:03','2026-04-28 03:04:03'),(11,1,'expense','personal',2500.00,'BDT','Grooming and self-care','2026-04-11 09:04:03','monthly','[\"personal\",\"essential\"]',0,NULL,'mobile',NULL,NULL,NULL,0,'2026-04-28 03:04:03','2026-04-28 03:04:03'),(12,1,'expense','family',4000.00,'BDT','Family gifts and support','2026-04-03 09:04:03','monthly','[\"family\",\"essential\"]',0,NULL,'card',NULL,NULL,NULL,0,'2026-04-28 03:04:03','2026-04-28 03:04:03'),(13,1,'saving','emergency_fund',10000.00,'BDT','Monthly emergency fund deposit','2026-04-23 09:04:03','monthly','[\"savings\",\"emergency\"]',1,'monthly','bank',NULL,NULL,NULL,0,'2026-04-28 03:04:03','2026-04-28 03:04:03'),(14,2,'income','salary',85000.00,'BDT','Monthly salary payment','2026-04-01 00:00:00','monthly','[\"salary\",\"primary\"]',1,'monthly','bank','Dhaka',NULL,NULL,0,'2026-04-28 03:04:07','2026-04-28 03:04:07'),(15,2,'income','freelance',15000.00,'BDT','Web development freelance project','2026-04-13 09:04:07','monthly','[\"freelance\",\"side-income\"]',0,NULL,'bank',NULL,NULL,NULL,0,'2026-04-28 03:04:07','2026-04-28 03:04:07'),(16,2,'expense','rent',25000.00,'BDT','Apartment rent','2026-04-27 09:04:07','monthly','[\"rent\",\"essential\"]',1,'monthly','card',NULL,NULL,NULL,0,'2026-04-28 03:04:07','2026-04-28 03:04:07'),(17,2,'expense','utilities',4500.00,'BDT','Electricity and water','2026-04-18 09:04:07','monthly','[\"utilities\",\"essential\"]',1,'monthly','card',NULL,NULL,NULL,0,'2026-04-28 03:04:07','2026-04-28 03:04:07'),(18,2,'expense','food',8500.00,'BDT','Grocery shopping','2026-04-16 09:04:08','monthly','[\"food\",\"essential\"]',0,NULL,'cash',NULL,NULL,NULL,0,'2026-04-28 03:04:08','2026-04-28 03:04:08'),(19,2,'expense','transport',3200.00,'BDT','Monthly bus pass','2026-04-07 09:04:08','monthly','[\"transport\",\"essential\"]',0,NULL,'bank',NULL,NULL,NULL,0,'2026-04-28 03:04:08','2026-04-28 03:04:08'),(20,2,'expense','healthcare',2000.00,'BDT','Medicine and checkup','2026-04-12 09:04:08','monthly','[\"healthcare\",\"essential\"]',0,NULL,'bank',NULL,NULL,NULL,0,'2026-04-28 03:04:08','2026-04-28 03:04:08'),(21,2,'expense','entertainment',3500.00,'BDT','Movies and dining','2026-04-08 09:04:08','monthly','[\"entertainment\",\"essential\"]',0,NULL,'cash',NULL,NULL,NULL,0,'2026-04-28 03:04:08','2026-04-28 03:04:08'),(22,2,'expense','shopping',5000.00,'BDT','Clothing and accessories','2026-04-16 09:04:08','monthly','[\"shopping\",\"essential\"]',0,NULL,'bank',NULL,NULL,NULL,0,'2026-04-28 03:04:08','2026-04-28 03:04:08'),(23,2,'expense','education',3000.00,'BDT','Online courses','2026-04-21 09:04:08','monthly','[\"education\",\"essential\"]',0,NULL,'mobile',NULL,NULL,NULL,0,'2026-04-28 03:04:08','2026-04-28 03:04:08'),(24,2,'expense','personal',2500.00,'BDT','Grooming and self-care','2026-04-12 09:04:08','monthly','[\"personal\",\"essential\"]',0,NULL,'mobile',NULL,NULL,NULL,0,'2026-04-28 03:04:08','2026-04-28 03:04:08'),(25,2,'expense','family',4000.00,'BDT','Family gifts and support','2026-04-21 09:04:08','monthly','[\"family\",\"essential\"]',0,NULL,'cash',NULL,NULL,NULL,0,'2026-04-28 03:04:08','2026-04-28 03:04:08'),(26,2,'saving','emergency_fund',10000.00,'BDT','Monthly emergency fund deposit','2026-04-23 09:04:08','monthly','[\"savings\",\"emergency\"]',1,'monthly','bank',NULL,NULL,NULL,0,'2026-04-28 03:04:08','2026-04-28 03:04:08'),(27,3,'income','salary',60000.00,'BDT','Monthly salary payment','2026-04-01 00:00:00','monthly','[\"salary\",\"primary\"]',1,'monthly','bank','Dhaka',NULL,NULL,0,'2026-04-28 03:04:11','2026-04-28 03:04:11'),(28,3,'income','freelance',15000.00,'BDT','Web development freelance project','2026-04-13 09:04:11','monthly','[\"freelance\",\"side-income\"]',0,NULL,'bank',NULL,NULL,NULL,0,'2026-04-28 03:04:11','2026-04-28 03:04:11'),(29,3,'expense','rent',25000.00,'BDT','Apartment rent','2026-04-16 09:04:11','monthly','[\"rent\",\"essential\"]',1,'monthly','mobile',NULL,NULL,NULL,0,'2026-04-28 03:04:11','2026-04-28 03:04:11'),(30,3,'expense','utilities',4500.00,'BDT','Electricity and water','2026-04-27 09:04:11','monthly','[\"utilities\",\"essential\"]',1,'monthly','card',NULL,NULL,NULL,0,'2026-04-28 03:04:11','2026-04-28 03:04:11'),(31,3,'expense','food',8500.00,'BDT','Grocery shopping','2026-04-22 09:04:11','monthly','[\"food\",\"essential\"]',0,NULL,'card',NULL,NULL,NULL,0,'2026-04-28 03:04:11','2026-04-28 03:04:11'),(32,3,'expense','transport',3200.00,'BDT','Monthly bus pass','2026-04-15 09:04:11','monthly','[\"transport\",\"essential\"]',0,NULL,'cash',NULL,NULL,NULL,0,'2026-04-28 03:04:11','2026-04-28 03:04:11'),(33,3,'expense','healthcare',2000.00,'BDT','Medicine and checkup','2026-04-06 09:04:11','monthly','[\"healthcare\",\"essential\"]',0,NULL,'mobile',NULL,NULL,NULL,0,'2026-04-28 03:04:11','2026-04-28 03:04:11'),(34,3,'expense','entertainment',3500.00,'BDT','Movies and dining','2026-04-26 09:04:11','monthly','[\"entertainment\",\"essential\"]',0,NULL,'bank',NULL,NULL,NULL,0,'2026-04-28 03:04:11','2026-04-28 03:04:11'),(35,3,'expense','shopping',5000.00,'BDT','Clothing and accessories','2026-04-06 09:04:11','monthly','[\"shopping\",\"essential\"]',0,NULL,'mobile',NULL,NULL,NULL,0,'2026-04-28 03:04:11','2026-04-28 03:04:11'),(36,3,'expense','education',3000.00,'BDT','Online courses','2026-04-20 09:04:11','monthly','[\"education\",\"essential\"]',0,NULL,'cash',NULL,NULL,NULL,0,'2026-04-28 03:04:11','2026-04-28 03:04:11'),(37,3,'expense','personal',2500.00,'BDT','Grooming and self-care','2026-04-23 09:04:11','monthly','[\"personal\",\"essential\"]',0,NULL,'mobile',NULL,NULL,NULL,0,'2026-04-28 03:04:11','2026-04-28 03:04:11'),(38,3,'expense','family',4000.00,'BDT','Family gifts and support','2026-04-14 09:04:11','monthly','[\"family\",\"essential\"]',0,NULL,'bank',NULL,NULL,NULL,0,'2026-04-28 03:04:11','2026-04-28 03:04:11'),(39,3,'saving','emergency_fund',10000.00,'BDT','Monthly emergency fund deposit','2026-04-23 09:04:11','monthly','[\"savings\",\"emergency\"]',1,'monthly','bank',NULL,NULL,NULL,0,'2026-04-28 03:04:11','2026-04-28 03:04:11');
/*!40000 ALTER TABLE `transactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_finance_profiles`
--

DROP TABLE IF EXISTS `user_finance_profiles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_finance_profiles` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `total_income` decimal(12,2) NOT NULL DEFAULT 0.00,
  `total_expenses` decimal(12,2) NOT NULL DEFAULT 0.00,
  `net_savings` decimal(12,2) NOT NULL DEFAULT 0.00,
  `total_debt` decimal(12,2) NOT NULL DEFAULT 0.00,
  `emergency_fund` decimal(12,2) NOT NULL DEFAULT 0.00,
  `risk_profile` enum('conservative','moderate','aggressive') NOT NULL DEFAULT 'moderate',
  `investment_horizon` tinyint(3) unsigned NOT NULL DEFAULT 5,
  `income_stable` tinyint(1) NOT NULL DEFAULT 1,
  `dependents` tinyint(3) unsigned NOT NULL DEFAULT 0,
  `financial_health_score` tinyint(3) unsigned NOT NULL DEFAULT 0,
  `last_analysis_date` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_finance_profiles_user_id_unique` (`user_id`),
  CONSTRAINT `user_finance_profiles_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_finance_profiles`
--

LOCK TABLES `user_finance_profiles` WRITE;
/*!40000 ALTER TABLE `user_finance_profiles` DISABLE KEYS */;
INSERT INTO `user_finance_profiles` VALUES (1,1,165000.00,61700.00,103300.00,0.00,150000.00,'moderate',10,1,2,78,'2026-04-28 03:04:07','2026-04-28 03:04:07','2026-04-28 03:04:07'),(2,2,100000.00,61700.00,38300.00,0.00,150000.00,'moderate',10,1,2,78,'2026-04-28 03:04:11','2026-04-28 03:04:11','2026-04-28 03:04:11'),(3,3,75000.00,61700.00,13300.00,0.00,150000.00,'moderate',10,1,2,78,'2026-04-28 03:04:15','2026-04-28 03:04:15','2026-04-28 03:04:15');
/*!40000 ALTER TABLE `user_finance_profiles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `age` tinyint(3) unsigned NOT NULL DEFAULT 18,
  `gender` varchar(20) NOT NULL DEFAULT 'other',
  `monthly_income` decimal(12,2) NOT NULL DEFAULT 0.00,
  `currency` varchar(5) NOT NULL DEFAULT 'USD',
  `ai_provider` varchar(20) NOT NULL DEFAULT 'gemini',
  `timezone` varchar(255) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `profile_complete` tinyint(1) NOT NULL DEFAULT 0,
  `theme_preference` varchar(30) NOT NULL DEFAULT 'black-red',
  `language` varchar(20) NOT NULL DEFAULT 'bangla',
  `contrast_mode` varchar(20) NOT NULL DEFAULT 'default',
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Admin User','admin@lifepilot.ai',NULL,'$2y$12$Rx0HQiaeK6w0qr.lbGXSgeCuToZ.7E36fyUhL.lAoAYNXt4OxJd2S',30,'male',150000.00,'BDT','gemini','Asia/Dhaka',NULL,1,'black-red','bangla','default',NULL,'2026-04-28 03:04:02','2026-04-28 03:04:02'),(2,'John Doe','john.doe@example.com',NULL,'$2y$12$evEfglRy7TaoPzEMYJqOMO0io4fO4xYQ9iyEkAfQd49IVMu1bh9qW',28,'male',85000.00,'BDT','gemini',NULL,NULL,0,'green-white','english','default',NULL,'2026-04-28 03:04:02','2026-04-28 03:04:02'),(3,'Fatima Rahman','fatima.rahman@example.com',NULL,'$2y$12$SSfKGThjGa8gLHKCS6yUlO/jV2eshAeinW3r/ZFNCKCdaObFye5Si',24,'female',60000.00,'BDT','gemini',NULL,NULL,0,'pink-black','bangla','default',NULL,'2026-04-28 03:04:03','2026-04-28 03:04:03');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'LP_AI'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-28 15:05:18
