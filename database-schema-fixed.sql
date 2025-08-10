-- 羽毛球步伐项目 - 修复激活历史记录问题的数据库架构
-- 修复时间：2025-08-08

-- 删除现有表（如果存在）
DROP TABLE IF EXISTS activation_history;
DROP TABLE IF EXISTS activation_codes;
DROP TABLE IF EXISTS subscriptions;
DROP TABLE IF EXISTS profiles;

-- 1. 用户资料表（添加email字段）
CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email TEXT,
    full_name VARCHAR(100),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 订阅表（简化会员类型）
CREATE TABLE subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    plan_type VARCHAR(20) NOT NULL CHECK (plan_type IN ('free', 'premium_30d', 'premium_lifetime')),
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled')),
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 激活码表（简化类型）
CREATE TABLE activation_codes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code VARCHAR(20) UNIQUE NOT NULL,
    plan_type VARCHAR(20) NOT NULL CHECK (plan_type IN ('premium_30d', 'premium_lifetime')),
    duration_days INTEGER DEFAULT 30,
    is_used BOOLEAN DEFAULT FALSE,
    used_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    used_at TIMESTAMP WITH TIME ZONE,
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE
);

-- 4. 激活历史表（简化字段，避免约束问题）
CREATE TABLE activation_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    code_id UUID REFERENCES activation_codes(id) ON DELETE CASCADE,
    activation_code VARCHAR(20) NOT NULL,
    plan_type VARCHAR(20) NOT NULL,
    duration_days INTEGER,
    activated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) DEFAULT 'active'
);

-- 创建索引
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_activation_codes_code ON activation_codes(code);
CREATE INDEX idx_activation_codes_is_used ON activation_codes(is_used);
CREATE INDEX idx_activation_history_user_id ON activation_history(user_id);
CREATE INDEX idx_activation_history_code_id ON activation_history(code_id);

-- 启用RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE activation_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE activation_history ENABLE ROW LEVEL SECURITY;

-- Profiles表策略
CREATE POLICY "Public can view profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Subscriptions表策略
CREATE POLICY "Users can view own subscriptions" ON subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own subscriptions" ON subscriptions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Activation_codes表策略
CREATE POLICY "Anyone can view activation codes" ON activation_codes FOR SELECT USING (true);
CREATE POLICY "Users can use activation codes" ON activation_codes FOR UPDATE USING (NOT is_used AND (expires_at IS NULL OR expires_at > NOW()));

-- Activation_history表策略 - 放宽限制
CREATE POLICY "Public can view activation history" ON activation_history FOR SELECT USING (true);
CREATE POLICY "Anyone can insert activation history" ON activation_history FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update own history" ON activation_history FOR UPDATE USING (auth.uid() = user_id);

-- 删除已存在的触发器和函数
DROP TRIGGER IF EXISTS trigger_log_activation_history ON activation_codes;
DROP FUNCTION IF EXISTS log_activation_history();

-- 创建简化的激活历史记录函数
CREATE OR REPLACE FUNCTION log_activation_history()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.is_used = true AND OLD.is_used = false THEN
        -- 使用更简单的方法插入记录
        INSERT INTO activation_history (
            user_id, code_id, activation_code, plan_type, duration_days, activated_at, expires_at
        ) VALUES (
            COALESCE(NEW.used_by, '00000000-0000-0000-0000-000000000000'), 
            NEW.id, 
            NEW.code, 
            NEW.plan_type, 
            CASE WHEN NEW.plan_type = 'premium_lifetime' THEN NULL ELSE NEW.duration_days END,
            NOW(), 
            CASE WHEN NEW.plan_type = 'premium_lifetime' THEN NULL ELSE NOW() + (NEW.duration_days || ' days')::INTERVAL END
        ) ON CONFLICT (id) DO NOTHING;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_log_activation_history
    AFTER UPDATE ON activation_codes
    FOR EACH ROW
    WHEN (OLD.is_used = false AND NEW.is_used = true)
    EXECUTE FUNCTION log_activation_history();

-- 创建更新时间戳触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- 删除已存在的触发器和函数
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();

-- 自动创建用户资料的触发器
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, username, email)
    VALUES (new.id, new.email, new.email);
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE handle_new_user();

-- 插入示例激活码
INSERT INTO activation_codes (code, plan_type, duration_days, created_by) VALUES
('DEMO30', 'premium_30d', 30, NULL),
('DEMOLIFETIME', 'premium_lifetime', NULL, NULL),
('BAD30DAY', 'premium_30d', 30, NULL),
('BADLIFE', 'premium_lifetime', NULL, NULL),
('TEST2025', 'premium_30d', 30, NULL),
('NEWDEMO', 'premium_30d', 30, NULL),
('LIFETIME2025', 'premium_lifetime', NULL, NULL);