-- 简化版本：添加体验会员类型
-- 新增体验会员，有效期10天

-- 1. 修改subscriptions表的plan_type约束
ALTER TABLE subscriptions 
DROP CONSTRAINT IF EXISTS subscriptions_plan_type_check;

ALTER TABLE subscriptions 
ADD CONSTRAINT subscriptions_plan_type_check 
CHECK (plan_type IN ('free', 'premium_10d', 'premium_30d', 'premium_lifetime'));

-- 2. 修改activation_codes表的plan_type约束
ALTER TABLE activation_codes 
DROP CONSTRAINT IF EXISTS activation_codes_plan_type_check;

ALTER TABLE activation_codes 
ADD CONSTRAINT activation_codes_plan_type_check 
CHECK (plan_type IN ('premium_10d', 'premium_30d', 'premium_lifetime'));

-- 3. 修改activation_history表的plan_type约束（跳过如果约束不存在）
DO $$
BEGIN
    ALTER TABLE activation_history DROP CONSTRAINT IF EXISTS activation_history_plan_type_check;
    ALTER TABLE activation_history ADD CONSTRAINT activation_history_plan_type_check 
    CHECK (plan_type IN ('premium_10d', 'premium_30d', 'premium_lifetime'));
EXCEPTION WHEN OTHERS THEN
    -- 如果约束不存在，直接添加
    ALTER TABLE activation_history ADD CONSTRAINT activation_history_plan_type_check 
    CHECK (plan_type IN ('premium_10d', 'premium_30d', 'premium_lifetime'));
END $$;

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