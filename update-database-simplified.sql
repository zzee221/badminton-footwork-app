-- 更新数据库：简化会员层级为只有免费和会员两种

-- 1. 更新现有激活码，将所有激活码改为会员类型
UPDATE activation_codes 
SET plan_type = 'premium' 
WHERE plan_type IN ('vip', 'premium');

-- 2. 更新现有订阅，将所有VIP订阅改为会员
UPDATE subscriptions 
SET plan_type = 'premium' 
WHERE plan_type = 'vip';

-- 3. 插入新的会员激活码（示例）
INSERT INTO activation_codes (code, plan_type, duration_days, expires_at) VALUES
('MEMBER2024', 'premium', 30, '2024-12-31 23:59:59'),
('BADMINTON2024', 'premium', 90, '2024-12-31 23:59:59'),
('FOOTWORK2024', 'premium', 365, '2024-12-31 23:59:59'),
('TRAINING1', 'premium', 30, '2025-12-31 23:59:59'),
('ADVANCED2', 'premium', 90, '2025-12-31 23:59:59'),
('PRO3', 'premium', 365, '2025-12-31 23:59:59'),
('MEMBER4', 'premium', 30, '2025-06-30 23:59:59'),
('ELITE5', 'premium', 60, '2025-06-30 23:59:59');

-- 4. 验证更新结果
SELECT 
    plan_type,
    COUNT(*) as count
FROM activation_codes 
WHERE is_used = FALSE 
GROUP BY plan_type;

SELECT 
    s.plan_type,
    COUNT(*) as count,
    s.status
FROM subscriptions s
WHERE s.status = 'active'
GROUP BY s.plan_type, s.status;

-- 5. 显示所有可用的激活码
SELECT 
    code,
    plan_type,
    duration_days,
    expires_at,
    is_used
FROM activation_codes 
ORDER BY created_at DESC;