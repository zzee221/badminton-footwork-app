-- 修复激活码问题的数据库更新脚本
-- 问题：RLS策略阻止激活码更新，导致激活码可以重复使用

-- 1. 修复activation_codes表的RLS策略
DROP POLICY IF EXISTS "Users can use activation codes" ON activation_codes;

-- 创建更宽松的更新策略，允许认证用户更新激活码
CREATE POLICY "Authenticated users can update activation codes" ON activation_codes 
FOR UPDATE USING (auth.role() = 'authenticated');

-- 2. 确保activation_history表的插入策略正常工作
DROP POLICY IF EXISTS "Anyone can insert activation history" ON activation_history;
CREATE POLICY "Authenticated users can insert activation history" ON activation_history 
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 3. 重置所有激活码状态（可选，用于测试）
-- UPDATE activation_codes SET is_used = false, used_by = null, used_at = null WHERE is_used = true;

-- 4. 验证当前激活码状态
SELECT 
    code,
    plan_type,
    is_used,
    used_by,
    used_at,
    created_at,
    expires_at
FROM activation_codes 
ORDER BY created_at DESC;

-- 5. 检查激活历史记录
SELECT 
    h.activation_code,
    h.plan_type,
    h.activated_at,
    p.username as user_name
FROM activation_history h
LEFT JOIN profiles p ON h.user_id = p.id
ORDER BY h.activated_at DESC;