-- CodeForge Database Schema
-- Secure Online Code Execution & Coding Platform

CREATE DATABASE IF NOT EXISTS `codeforge_db`
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE `codeforge_db`;

SET FOREIGN_KEY_CHECKS = 0;

-- 1. Users Table
DROP TABLE IF EXISTS `execution_history`;
DROP TABLE IF EXISTS `submissions`;
DROP TABLE IF EXISTS `test_cases`;
DROP TABLE IF EXISTS `problems`;
DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `username` VARCHAR(100) NOT NULL UNIQUE,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_users_username` (`username`),
  INDEX `idx_users_email` (`email`),
  INDEX `idx_users_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Problems Table
CREATE TABLE `problems` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL UNIQUE,
  `description` MEDIUMTEXT NOT NULL,
  `difficulty` ENUM('Easy', 'Medium', 'Hard') NOT NULL,
  `category` VARCHAR(100) NOT NULL,
  `constraints` TEXT NULL,
  `input_format` TEXT NULL,
  `output_format` TEXT NULL,
  `examples` JSON NULL,
  `created_by` BIGINT UNSIGNED NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_problems_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  INDEX `idx_problems_slug` (`slug`),
  INDEX `idx_problems_difficulty` (`difficulty`),
  INDEX `idx_problems_category` (`category`),
  INDEX `idx_problems_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Test Cases Table
CREATE TABLE `test_cases` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `problem_id` INT UNSIGNED NOT NULL,
  `input` MEDIUMTEXT NOT NULL,
  `expected_output` MEDIUMTEXT NOT NULL,
  `is_sample` BOOLEAN NOT NULL DEFAULT FALSE,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_test_cases_problem` FOREIGN KEY (`problem_id`) REFERENCES `problems` (`id`) ON DELETE CASCADE,
  INDEX `idx_test_cases_problem_id` (`problem_id`),
  INDEX `idx_test_cases_is_sample` (`problem_id`, `is_sample`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Submissions Table
CREATE TABLE `submissions` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `problem_id` INT UNSIGNED NOT NULL,
  `language` ENUM('java', 'python', 'cpp') NOT NULL,
  `source_code` MEDIUMTEXT NOT NULL,
  `status` ENUM('ACCEPTED', 'WRONG_ANSWER', 'COMPILATION_ERROR', 'RUNTIME_ERROR', 'TIME_LIMIT_EXCEEDED', 'MEMORY_LIMIT_EXCEEDED', 'OUTPUT_LIMIT_EXCEEDED', 'SYSTEM_ERROR') NOT NULL,
  `execution_time` INT NULL,
  `memory_usage` INT NULL,
  `passed_tests` INT NOT NULL DEFAULT 0,
  `total_tests` INT NOT NULL DEFAULT 0,
  `error_message` TEXT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_submissions_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_submissions_problem` FOREIGN KEY (`problem_id`) REFERENCES `problems` (`id`) ON DELETE CASCADE,
  INDEX `idx_submissions_user_id` (`user_id`),
  INDEX `idx_submissions_problem_id` (`problem_id`),
  INDEX `idx_submissions_status` (`status`),
  INDEX `idx_submissions_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Execution History Table
CREATE TABLE `execution_history` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` BIGINT UNSIGNED NULL,
  `language` ENUM('java', 'python', 'cpp') NOT NULL,
  `source_code` MEDIUMTEXT NOT NULL,
  `stdin` MEDIUMTEXT NULL,
  `stdout` MEDIUMTEXT NULL,
  `stderr` MEDIUMTEXT NULL,
  `status` ENUM('SUCCESS', 'COMPILATION_ERROR', 'RUNTIME_ERROR', 'TIME_LIMIT_EXCEEDED', 'MEMORY_LIMIT_EXCEEDED', 'OUTPUT_LIMIT_EXCEEDED', 'SYSTEM_ERROR') NOT NULL,
  `execution_time` INT NULL,
  `memory_usage` INT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_execution_history_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  INDEX `idx_exec_history_user_id` (`user_id`),
  INDEX `idx_exec_history_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
