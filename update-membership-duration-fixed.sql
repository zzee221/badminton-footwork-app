-- 更新会员期限为30天和永久两种（适配现有数据库结构）

-- 1. 更新现有激活码为30天期限
UPDATE activation_codes 
SET duration_days = 30 
WHERE plan_type = 'premium' AND duration_days != 365;

-- 2. 删除现有的30天激活码，重新创建
DELETE FROM activation_codes 
WHERE plan_type = 'premium' AND duration_days = 30;

-- 3. 插入30天会员激活码
INSERT INTO activation_codes (code, plan_type, duration_days, expires_at) VALUES
('MONTH30_001', 'premium', 30, '2025-12-31 23:59:59'),
('MONTH30_002', 'premium', 30, '2025-12-31 23:59:59'),
('MONTH30_003', 'premium', 30, '2025-12-31 23:59:59'),
('MONTH30_004', 'premium', 30, '2025-12-31 23:59:59'),
('MONTH30_005', 'premium', 30, '2025-12-31 23:59:59'),
('MONTH30_006', 'premium', 30, '2025-12-31 23:59:59'),
('MONTH30_007', 'premium', 30, '2025-12-31 23:59:59'),
('MONTH30_008', 'premium', 30, '2025-12-31 23:59:59'),
('MONTH30_009', 'premium', 30, '2025-12-31 23:59:59'),
('MONTH30_010', 'premium', 30, '2025-12-31 23:59:59');

-- 4. 插入永久会员激活码（使用3650天表示永久，约10年）
INSERT INTO activation_codes (code, plan_type, duration_days, expires_at) VALUES
('LIFETIME_001', 'premium', 3650, '2035-01-01 23:59:59'),
('LIFETIME_002', 'premium', 3650, '2035-01-01 23:59:59'),
('LIFETIME_003', 'premium', 3650, '2035-01-01 23:59:59'),
('LIFETIME_004', 'premium', 3650, '2035-01-01 23:59:59'),
('LIFETIME_005', 'premium', 3650, '2035-01-01 23:59:59');

-- 5. 更新现有永久会员的期限（基于expires_at而不是duration_days）
UPDATE subscriptions 
SET expires_at = '2035-01-01 23:59:59'
WHERE plan_type = 'premium' AND expires_at > '2030-01-01 23:59:59';

-- 6. 验证更新结果
SELECT 
    plan_type,
    duration_days,
    COUNT(*) as count
FROM activation_codes 
WHERE is_used = FALSE 
GROUP BY plan_type, duration_days
ORDER BY duration_days;

-- 7. 显示所有可用的激活码
SELECT 
    code,
    plan_type,
    duration_days,
    CASE 
        WHEN duration_days >= 3650 THEN '永久'
        ELSE CONCAT(duration_days, '天')
    END as duration_text,
    expires_at,
    is_used
FROM activation_codes 
WHERE is_used = FALSE 
ORDER BY duration_days DESC, created_at DESC;