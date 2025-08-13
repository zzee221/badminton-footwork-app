-- 检查用户订阅状态和激活码使用情况
-- 用于调试体验会员问题

-- 1. 检查当前用户的订阅状态
SELECT 
    s.id,
    s.user_id,
    s.plan_type,
    s.status,
    s.started_at,
    s.expires_at,
    p.username as user_name,
    p.email
FROM subscriptions s
LEFT JOIN profiles p ON s.user_id = p.id
WHERE s.status = 'active'
ORDER BY s.started_at DESC;

-- 2. 检查激活码使用情况
SELECT 
    ac.code,
    ac.plan_type,
    ac.duration_days,
    ac.is_used,
    ac.used_by,
    ac.used_at,
    p.username as used_by_username
FROM activation_codes ac
LEFT JOIN profiles p ON ac.used_by = p.id
ORDER BY ac.used_at DESC NULLS LAST;

-- 3. 检查激活历史记录
SELECT 
    ah.activation_code,
    ah.plan_type,
    ah.duration_days,
    ah.activated_at,
    ah.expires_at,
    ah.status,
    p.username as user_name
FROM activation_history ah
LEFT JOIN profiles p ON ah.user_id = p.id
ORDER BY ah.activated_at DESC;

-- 4. 检查所有用户状态概览
SELECT 
    p.username,
    p.email,
    s.plan_type,
    s.status,
    s.started_at,
    s.expires_at,
    CASE 
        WHEN s.expires_at IS NULL THEN '永久会员'
        WHEN s.expires_at > NOW() THEN '会员（剩余' || EXTRACT(DAY FROM s.expires_at - NOW()) || '天）'
        ELSE '已过期'
    END as membership_status
FROM profiles p
LEFT JOIN subscriptions s ON p.id = s.user_id AND s.status = 'active'
ORDER BY p.created_at DESC;