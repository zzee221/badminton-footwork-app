-- 修复activation_history表检查脚本（适配现有数据库结构）

-- 检查activation_history表是否存在，如果不存在则创建
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'activation_history') THEN
        -- 创建activation_history表（使用现有结构）
        CREATE TABLE activation_history (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
            code_id UUID REFERENCES activation_codes(id) ON DELETE CASCADE,
            activated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            plan_type VARCHAR(20) NOT NULL,
            expires_at TIMESTAMP WITH TIME ZONE
        );
        
        -- 添加注释
        COMMENT ON TABLE activation_history IS '激活历史记录表';
        COMMENT ON COLUMN activation_history.user_id IS '用户ID';
        COMMENT ON COLUMN activation_history.code_id IS '激活码ID';
        COMMENT ON COLUMN activation_history.activated_at IS '激活时间';
        COMMENT ON COLUMN activation_history.plan_type IS '套餐类型';
        COMMENT ON COLUMN activation_history.expires_at IS '过期时间';
        
        -- 启用RLS
        ALTER TABLE activation_history ENABLE ROW LEVEL SECURITY;
        
        -- 创建RLS策略
        CREATE POLICY "Users can view own activation history" ON activation_history
            FOR SELECT USING (auth.uid() = user_id);
            
        CREATE POLICY "Users can insert own activation history" ON activation_history
            FOR INSERT WITH CHECK (auth.uid() = user_id);
            
        RAISE NOTICE 'activation_history表创建成功';
    ELSE
        RAISE NOTICE 'activation_history表已存在';
    END IF;
END $$;

-- 显示表结构信息
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'activation_history'
ORDER BY ordinal_position;

-- 显示最近的激活历史记录（使用activated_at而不是created_at）
SELECT 
    ah.id,
    ah.user_id,
    ah.code_id,
    ah.plan_type,
    ah.expires_at,
    ah.activated_at,
    ac.code as activation_code
FROM activation_history ah
LEFT JOIN activation_codes ac ON ah.code_id = ac.id
ORDER BY ah.activated_at DESC
LIMIT 10;