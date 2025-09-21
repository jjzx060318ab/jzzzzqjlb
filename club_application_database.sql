-- 荆州众志足球俱乐部申请表单数据库设计
-- 创建时间：2024年

-- 创建数据库（如果不存在）
CREATE DATABASE IF NOT EXISTS jzzzqjlb_application;

-- 使用该数据库
USE jzzzqjlb_application;

-- 创建申请表单数据表
CREATE TABLE IF NOT EXISTS `player_applications` (
  `application_id` VARCHAR(50) NOT NULL COMMENT '申请唯一ID',
  `name` VARCHAR(100) NOT NULL COMMENT '姓名',
  `age` INT NOT NULL COMMENT '年龄',
  `gender` VARCHAR(10) NOT NULL COMMENT '性别',
  `phone` VARCHAR(20) NOT NULL COMMENT '联系电话',
  `email` VARCHAR(100) NULL COMMENT '电子邮箱',
  `experience_years` VARCHAR(20) NULL COMMENT '足球经历年限',
  `experience_description` TEXT NOT NULL COMMENT '足球经验详细描述',
  `preferred_position` VARCHAR(20) NOT NULL COMMENT '擅长位置',
  `skill_level` VARCHAR(20) NOT NULL COMMENT '球技水平',
  `competition_experience` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否有比赛经验',
  `available_times` TEXT NOT NULL COMMENT '可参加训练的时间',
  `training_frequency` INT NOT NULL DEFAULT 0 COMMENT '每周训练频率（天数）',
  `self_introduction` TEXT NULL COMMENT '自我介绍/补充说明',
  `timestamp` DATETIME NOT NULL COMMENT '提交时间',
  `status` VARCHAR(20) NOT NULL DEFAULT 'pending' COMMENT '申请状态（pending/processing/approved/rejected）',
  `processed_by` VARCHAR(100) NULL COMMENT '处理人',
  `processing_notes` TEXT NULL COMMENT '处理备注',
  PRIMARY KEY (`application_id`),
  INDEX `idx_status` (`status`),
  INDEX `idx_timestamp` (`timestamp`),
  INDEX `idx_phone` (`phone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='球员申请表单数据';

-- 创建管理员用户表
CREATE TABLE IF NOT EXISTS `admin_users` (
  `admin_id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(50) NOT NULL COMMENT '管理员用户名',
  `password_hash` VARCHAR(255) NOT NULL COMMENT '密码哈希值',
  `email` VARCHAR(100) NOT NULL COMMENT '管理员邮箱',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `last_login` DATETIME NULL COMMENT '最后登录时间',
  `status` TINYINT(1) NOT NULL DEFAULT 1 COMMENT '状态（1-启用，0-禁用）',
  PRIMARY KEY (`admin_id`),
  UNIQUE INDEX `idx_username` (`username`),
  UNIQUE INDEX `idx_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='管理员用户表';

-- 创建申请操作日志表
CREATE TABLE IF NOT EXISTS `application_logs` (
  `log_id` INT NOT NULL AUTO_INCREMENT,
  `application_id` VARCHAR(50) NOT NULL COMMENT '申请ID',
  `action_type` VARCHAR(50) NOT NULL COMMENT '操作类型',
  `action_by` VARCHAR(100) NOT NULL COMMENT '操作人',
  `action_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '操作时间',
  `details` TEXT NULL COMMENT '操作详情',
  PRIMARY KEY (`log_id`),
  INDEX `idx_application_id` (`application_id`),
  INDEX `idx_action_time` (`action_time`),
  CONSTRAINT `fk_logs_application` FOREIGN KEY (`application_id`) REFERENCES `player_applications` (`application_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='申请操作日志';

-- 创建存储过程：获取申请统计信息
DELIMITER $$
CREATE PROCEDURE `get_application_statistics`()
BEGIN
    SELECT
        COUNT(*) AS total_applications,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS pending_applications,
        SUM(CASE WHEN status = 'processing' THEN 1 ELSE 0 END) AS processing_applications,
        SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) AS approved_applications,
        SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) AS rejected_applications,
        DATE_FORMAT(MIN(timestamp), '%Y-%m-%d') AS first_application_date,
        DATE_FORMAT(MAX(timestamp), '%Y-%m-%d') AS latest_application_date
    FROM player_applications;
END$$
DELIMITER ;

-- 创建存储过程：按位置统计申请人数
DELIMITER $$
CREATE PROCEDURE `get_applications_by_position`()
BEGIN
    SELECT
        preferred_position,
        COUNT(*) AS count
    FROM player_applications
    GROUP BY preferred_position
    ORDER BY count DESC;
END$$
DELIMITER ;

-- 创建触发器：在更新申请状态时记录日志
DELIMITER $$
CREATE TRIGGER `trg_after_application_status_update` AFTER UPDATE ON `player_applications`
FOR EACH ROW
BEGIN
    IF NEW.status <> OLD.status THEN
        INSERT INTO application_logs (application_id, action_type, action_by, details)
        VALUES (NEW.application_id, 'status_change', NEW.processed_by, 
                CONCAT('状态从 "', OLD.status, '" 变更为 "', NEW.status, '"'));
    END IF;
END$$
DELIMITER ;

-- 插入一个默认管理员账户 (用户名: admin, 密码: Admin123!) 
-- 注意：实际使用时请修改密码并使用更安全的哈希方式
INSERT INTO admin_users (username, password_hash, email)
SELECT 'admin', '$2y$10$QJ3q8h4x5z6w7v8u9t0y1', 'admin@jzzzzqjlb.fun'
WHERE NOT EXISTS (SELECT 1 FROM admin_users WHERE username = 'admin');

-- 插入示例申请数据
INSERT INTO player_applications (
    application_id, name, age, gender, phone, email, 
    experience_years, experience_description, 
    preferred_position, skill_level, competition_experience, 
    available_times, training_frequency, 
    self_introduction, timestamp, status
)
SELECT 
    'APP-1712345678901-123', '张三', 25, '男', '13812345678', 'zhangsan@example.com', 
    '5年', '有5年足球经验，曾在大学足球队担任前锋，参加过校级联赛。', 
    '前锋', '中级', 1, 
    '周一、周三、周五晚上，周六上午', 4, 
    '热爱足球，希望能加入俱乐部与更多球友交流提高。', NOW() - INTERVAL 2 DAY, 'processing'
WHERE NOT EXISTS (SELECT 1 FROM player_applications WHERE application_id = 'APP-1712345678901-123');

-- 安全建议：
-- 1. 不要在生产环境中使用明文密码
-- 2. 定期备份数据库
-- 3. 限制数据库访问权限
-- 4. 对敏感数据进行加密存储
-- 5. 实现合理的事务处理逻辑