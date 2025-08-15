-- 数据库清理和重置脚本
-- 清空测试数据并生成新的激活码

-- 1. 清空现有的激活码（保留表结构）
TRUNCATE TABLE activation_codes RESTART IDENTITY CASCADE;

-- 2. 清空激活历史记录
TRUNCATE TABLE activation_history RESTART IDENTITY CASCADE;

-- 3. 清空用户订阅记录（但保留用户资料）
TRUNCATE TABLE subscriptions RESTART IDENTITY CASCADE;

-- 4. 生成唯一的激活码函数
CREATE OR REPLACE FUNCTION generate_unique_activation_code(length INTEGER)
RETURNS TEXT AS $$
DECLARE
    new_code TEXT;
    attempts INTEGER := 0;
    max_attempts INTEGER := 1000;
BEGIN
    -- 尝试生成唯一的激活码
    WHILE attempts < max_attempts LOOP
        -- 生成随机字母数字组合
        new_code := upper(substring(encode(gen_random_bytes(length * 2), 'hex'), 1, length));
        
        -- 检查是否已存在
        IF NOT EXISTS (SELECT 1 FROM activation_codes WHERE code = new_code) THEN
            RETURN new_code;
        END IF;
        
        attempts := attempts + 1;
    END LOOP;
    
    -- 如果无法生成唯一码，返回带时间戳的码
    RETURN upper(substring(encode(gen_random_bytes(length * 2), 'hex'), 1, length - 3)) || 
           to_char(floor(extract(epoch from now()))::bigint, 'FM000');
END;
$$ LANGUAGE plpgsql;

-- 5. 生成并插入激活码
-- 体验会员 (premium_10d) - 50个
INSERT INTO activation_codes (code, plan_type, duration_days, created_by)
SELECT generate_unique_activation_code(6), 'premium_10d', 10, NULL
FROM generate_series(1, 50);

-- 30天会员 (premium_30d) - 50个  
INSERT INTO activation_codes (code, plan_type, duration_days, created_by)
SELECT generate_unique_activation_code(6), 'premium_30d', 30, NULL
FROM generate_series(1, 50);

-- 永久会员 (premium_lifetime) - 50个
INSERT INTO activation_codes (code, plan_type, duration_days, created_by)
SELECT generate_unique_activation_code(6), 'premium_lifetime', NULL, NULL
FROM generate_series(1, 50);

-- 6. 验证生成的激活码
SELECT 
    plan_type,
    COUNT(*) as total_count,
    SUM(CASE WHEN is_used = false THEN 1 ELSE 0 END) as available_count,
    STRING_AGG(
        CASE WHEN is_used = false THEN code ELSE NULL END, 
        ', '
    ) as sample_codes
FROM activation_codes 
GROUP BY plan_type
ORDER BY 
    CASE plan_type 
        WHEN 'premium_10d' THEN 1 
        WHEN 'premium_30d' THEN 2 
        WHEN 'premium_lifetime' THEN 3 
        ELSE 4 
    END;

-- 7. 显示所有激活码（用于记录）
SELECT 
    code,
    plan_type,
    duration_days,
    is_used,
    created_at
FROM activation_codes 
ORDER BY plan_type, code;

-- 8. 清理函数（可选）
-- DROP FUNCTION IF EXISTS generate_unique_activation_code(INTEGER);