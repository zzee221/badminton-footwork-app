-- 修复版本：添加体验会员类型（不假设约束名称）
-- 新增体验会员，有效期10天

-- 1. 查看当前约束
-- 先运行这个查询查看实际的约束名称
SELECT 
    conname as constraint_name,
    contype as constraint_type,
    pg_get_constraintdef(oid) as constraint_def
FROM pg_constraint 
WHERE conrelid = 'activation_history'::regclass 
AND conname LIKE '%plan_type%';

-- 2. 修改subscriptions表的plan_type约束
ALTER TABLE subscriptions 
DROP CONSTRAINT IF EXISTS subscriptions_plan_type_check;

ALTER TABLE subscriptions 
ADD CONSTRAINT subscriptions_plan_type_check 
CHECK (plan_type IN ('free', 'premium_10d', 'premium_30d', 'premium_lifetime'));

-- 3. 修改activation_codes表的plan_type约束
ALTER TABLE activation_codes 
DROP CONSTRAINT IF EXISTS activation_codes_plan_type_check;

ALTER TABLE activation_codes 
ADD CONSTRAINT activation_codes_plan_type_check 
CHECK (plan_type IN ('premium_10d', 'premium_30d', 'premium_lifetime'));

-- 4. 尝试删除activation_history表的约束（使用通配符方式）
DO $$
BEGIN
    -- 尝试删除可能存在的约束
    EXECUTE 'ALTER TABLE activation_history DROP CONSTRAINT IF EXISTS activation_history_plan_type_check';
    EXECUTE 'ALTER TABLE activation_history DROP CONSTRAINT IF EXISTS activation_history_plan_type_check_1';
    -- 如果还有其他名称的约束，可以在这里添加
EXCEPTION WHEN OTHERS THEN
    -- 忽略约束不存在的错误
END $$;

-- 5. 添加新的约束到activation_history表
ALTER TABLE activation_history 
ADD CONSTRAINT activation_history_plan_type_check 
CHECK (plan_type IN ('premium_10d', 'premium_30d', 'premium_lifetime'));

-- 6. 插入体验会员激活码示例
INSERT INTO activation_codes (code, plan_type, duration_days, created_by) VALUES
('TRIAL10', 'premium_10d', 10, NULL),
('DEMO10', 'premium_10d', 10, NULL),
('EXPERIENCE', 'premium_10d', 10, NULL),
('TEST10DAY', 'premium_10d', 10, NULL);

-- 7. 验证更新结果
SELECT 
    code,
    plan_type,
    duration_days,
    is_used,
    created_at
FROM activation_codes 
ORDER BY created_at DESC;

-- 8. 显示plan_type分布
SELECT 
    plan_type,
    COUNT(*) as count,
    SUM(CASE WHEN is_used = false THEN 1 ELSE 0 END) as available_count
FROM activation_codes 
GROUP BY plan_type
ORDER BY plan_type;