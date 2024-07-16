-- ----------------------------------------------------------------------------
-- MySQL Workbench Migration
-- Migrated Schemata: backend
-- Source Schemata: backend
-- Created: Mon Jul  8 15:53:13 2024
-- Workbench Version: 8.0.36
-- ----------------------------------------------------------------------------

SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------------------------------------------------------
-- Schema backend
-- ----------------------------------------------------------------------------
DROP SCHEMA IF EXISTS `backend` ;
CREATE SCHEMA IF NOT EXISTS `backend` ;

-- ----------------------------------------------------------------------------
-- Table backend.deals
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `backend`.`deals` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT 'This is a unique identifier',
  `active_step` INT NOT NULL DEFAULT '1',
  `status` VARCHAR(255) NOT NULL,
  `broker_name` VARCHAR(255) NOT NULL,
  `property_name` VARCHAR(255) NOT NULL,
  `deal_start_date` TIMESTAMP NULL DEFAULT NULL,
  `proposal_date` TIMESTAMP NULL DEFAULT NULL,
  `loi_execute_date` TIMESTAMP NULL DEFAULT NULL,
  `lease_signed_date` TIMESTAMP NULL DEFAULT NULL,
  `notice_to_proceed_date` TIMESTAMP NULL DEFAULT NULL,
  `commercial_operation_date` TIMESTAMP NULL DEFAULT NULL,
  `potential_commission_date` TIMESTAMP NULL DEFAULT NULL,
  `potential_commission` INT NULL DEFAULT NULL,
  `created_at` DATETIME(6) NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` DATETIME(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `created_by` INT NULL DEFAULT NULL COMMENT 'This is a unique identifier',
  `updated_by` INT NULL DEFAULT NULL COMMENT 'This is a unique identifier',
  PRIMARY KEY (`id`),
  INDEX `FK_a96c558d0ebee23c264dbe726fb` (`created_by` ASC) VISIBLE,
  INDEX `FK_7f8ff099b7a1372e16754c430b3` (`updated_by` ASC) VISIBLE,
  CONSTRAINT `FK_7f8ff099b7a1372e16754c430b3`
    FOREIGN KEY (`updated_by`)
    REFERENCES `backend`.`users` (`id`)
    ON DELETE SET NULL,
  CONSTRAINT `FK_a96c558d0ebee23c264dbe726fb`
    FOREIGN KEY (`created_by`)
    REFERENCES `backend`.`users` (`id`)
    ON DELETE SET NULL)
ENGINE = InnoDB
AUTO_INCREMENT = 18
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

-- ----------------------------------------------------------------------------
-- Table backend.invite
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `backend`.`invite` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(255) NOT NULL,
  `role_id` INT NOT NULL,
  `invite_token` VARCHAR(255) NOT NULL,
  `invite_token_expires` TIMESTAMP NOT NULL,
  `invited_by` INT NOT NULL DEFAULT '1',
  `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  UNIQUE INDEX `IDX_658d8246180c0345d32a100544` (`email` ASC) VISIBLE)
ENGINE = InnoDB
AUTO_INCREMENT = 20
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

-- ----------------------------------------------------------------------------
-- Table backend.landlords
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `backend`.`landlords` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT 'This is a unique identifier',
  `name` VARCHAR(255) NOT NULL,
  `phone_number` VARCHAR(15) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `address1` VARCHAR(500) NOT NULL,
  `address2` VARCHAR(500) NULL DEFAULT NULL,
  `city` VARCHAR(255) NOT NULL,
  `state` VARCHAR(255) NOT NULL,
  `country` VARCHAR(255) NOT NULL,
  `zipcode` VARCHAR(10) NOT NULL,
  `created_by` INT NULL DEFAULT NULL,
  `updated_by` INT NULL DEFAULT NULL,
  `created_at` DATETIME(6) NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` DATETIME(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 7
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

-- ----------------------------------------------------------------------------
-- Table backend.role
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `backend`.`role` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `role_name` VARCHAR(255) NOT NULL,
  `description` VARCHAR(255) NULL DEFAULT NULL,
  `created_by` INT NOT NULL,
  `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_by` INT NULL DEFAULT NULL,
  `updated_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  UNIQUE INDEX `IDX_4810bc474fe6394c6f58cb7c9e` (`role_name` ASC) VISIBLE)
ENGINE = InnoDB
AUTO_INCREMENT = 4
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

-- ----------------------------------------------------------------------------
-- Table backend.sessions
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `backend`.`sessions` (
  `session_id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `token` VARCHAR(255) NOT NULL,
  `expires_at` TIMESTAMP NOT NULL,
  `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`session_id`),
  UNIQUE INDEX `IDX_e9f62f5dcb8a54b84234c9e7a0` (`token` ASC) VISIBLE)
ENGINE = InnoDB
AUTO_INCREMENT = 6
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

-- ----------------------------------------------------------------------------
-- Table backend.sites
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `backend`.`sites` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `address_line1` VARCHAR(255) NOT NULL,
  `address_line2` VARCHAR(255) NOT NULL,
  `state` VARCHAR(100) NOT NULL,
  `city` VARCHAR(100) NOT NULL,
  `zipcode` VARCHAR(10) NOT NULL,
  `country` VARCHAR(100) NOT NULL,
  `created_by` INT NOT NULL,
  `updated_by` INT NULL DEFAULT NULL,
  `created_at` DATETIME(6) NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` DATETIME(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 4
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

-- ----------------------------------------------------------------------------
-- Table backend.support
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `backend`.`support` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT 'This is a unique identifier',
  `ticket_subject` VARCHAR(255) NOT NULL,
  `ticket_description` VARCHAR(255) NOT NULL,
  `ticket_status` VARCHAR(255) NOT NULL DEFAULT 'open',
  `ticket_priority` VARCHAR(255) NOT NULL DEFAULT 'normal',
  `created_at` DATETIME(6) NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` DATETIME(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `created_by` INT NULL DEFAULT NULL COMMENT 'This is a unique identifier',
  `updated_by` INT NULL DEFAULT NULL COMMENT 'This is a unique identifier',
  PRIMARY KEY (`id`),
  INDEX `FK_c4c44227b4815ab8189f129593a` (`created_by` ASC) VISIBLE,
  INDEX `FK_5482431411d199452e25011dddd` (`updated_by` ASC) VISIBLE,
  CONSTRAINT `FK_5482431411d199452e25011dddd`
    FOREIGN KEY (`updated_by`)
    REFERENCES `backend`.`users` (`id`),
  CONSTRAINT `FK_c4c44227b4815ab8189f129593a`
    FOREIGN KEY (`created_by`)
    REFERENCES `backend`.`users` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 8
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

-- ----------------------------------------------------------------------------
-- Table backend.user_role
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `backend`.`user_role` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `role_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `FK_d0e5815877f7395a198a4cb0a46` (`user_id` ASC) VISIBLE,
  INDEX `FK_32a6fc2fcb019d8e3a8ace0f55f` (`role_id` ASC) VISIBLE,
  CONSTRAINT `FK_32a6fc2fcb019d8e3a8ace0f55f`
    FOREIGN KEY (`role_id`)
    REFERENCES `backend`.`role` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `FK_d0e5815877f7395a198a4cb0a46`
    FOREIGN KEY (`user_id`)
    REFERENCES `backend`.`users` (`id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 6
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

-- ----------------------------------------------------------------------------
-- Table backend.users
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `backend`.`users` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT 'This is a unique identifier',
  `email_id` VARCHAR(255) NOT NULL DEFAULT '',
  `password` VARCHAR(255) NOT NULL,
  `first_name` VARCHAR(255) NOT NULL,
  `last_name` VARCHAR(255) NOT NULL,
  `mobile` VARCHAR(255) NOT NULL,
  `address` VARCHAR(255) NOT NULL DEFAULT '',
  `city` VARCHAR(255) NOT NULL DEFAULT '',
  `state` VARCHAR(255) NOT NULL DEFAULT '',
  `country` VARCHAR(255) NOT NULL DEFAULT '',
  `zipcode` VARCHAR(255) NOT NULL DEFAULT '',
  `is_active` TINYINT NOT NULL DEFAULT '0',
  `last_modified_by` INT NOT NULL DEFAULT '1',
  `reset_token` VARCHAR(255) NOT NULL DEFAULT '',
  `reset_token_expires` TIMESTAMP NULL DEFAULT NULL,
  `created_at` DATETIME(6) NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` DATETIME(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 6
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;
SET FOREIGN_KEY_CHECKS = 1;
