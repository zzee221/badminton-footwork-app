-- 添加体验会员类型的数据库更新脚本
-- 新增体验会员，有效期10天

-- 1. 修改subscriptions表的plan_type约束
ALTER TABLE subscriptions 
DROP CONSTRAINT subscriptions_plan_type_check;

ALTER TABLE subscriptions 
ADD CONSTRAINT subscriptions_plan_type_check 
CHECK (plan_type IN ('free', 'premium_10d', 'premium_30d', 'premium_lifetime'));

-- 2. 修改activation_codes表的plan_type约束
ALTER TABLE activation_codes 
DROP CONSTRAINT activation_codes_plan_type_check;

ALTER TABLE activation_codes 
ADD CONSTRAINT activation_codes_plan_type_check 
CHECK (plan_type IN ('premium_10d', 'premium_30d', 'premium_lifetime'));

-- 3. 修改activation_history表的plan_type约束
ALTER TABLE activation_history 
DROP CONSTRAINT activation_history_plan_type_check;

ALTER TABLE activation_history 
ADD CONSTRAINT activation_history_plan_type_check 
CHECK (plan_type IN ('premium_10d', 'premium_30d', 'premium_lifetime'));

-- 4. 插入体验会员激活码示例
INSERT INTO activation_codes (code, plan_type, duration_days, created_by) VALUES
('TRIAL10', 'premium_10d', 10, NULL),
('DEMO10', 'premium_10d', 10, NULL),
('EXPERIENCE', 'premium_10d', 10, NULL),
('TEST10DAY', 'premium_10d', 10, NULL);

-- 5. 验证更新结果
SELECT 
    code,
    plan_type,
    duration_days,
    is_used,
    created_at
FROM activation_codes 
ORDER BY created_at DESC;

-- 6. 显示plan_type分布
SELECT 
    plan_type,
    COUNT(*) as count,
    SUM(CASE WHEN is_used = false THEN 1 ELSE 0 END) as available_count
FROM activation_codes 
GROUP BY plan_type
ORDER BY plan_type;