-- 羽毛球步伐数据库化管理 - 数据库架构
-- 创建时间：2025-08-10
-- 分支：feature/database-management

-- 步伐相关表结构
-- ===================

-- 1. 步伐类型表
CREATE TABLE step_types (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    type_key VARCHAR(50) UNIQUE NOT NULL,  -- 'parallel', 'forward-backward'
    name VARCHAR(100) NOT NULL,             -- '平行启动', '前后启动'
    description TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 步伐组合表
CREATE TABLE step_combinations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    step_type_id UUID REFERENCES step_types(id) ON DELETE CASCADE,
    sequence VARCHAR(10) NOT NULL,          -- '1-2', '1-3'
    name VARCHAR(100) NOT NULL,            -- '中心到反手网前'
    description TEXT NOT NULL,
    is_free BOOLEAN DEFAULT false,         -- 是否免费
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 步伐模式表
CREATE TABLE step_patterns (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    combination_id UUID REFERENCES step_combinations(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,            -- '基础步伐', '进阶步伐'
    description TEXT,
    is_free BOOLEAN DEFAULT false,         -- 模式级别权限控制
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. 视频文件表
CREATE TABLE step_videos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    pattern_id UUID REFERENCES step_patterns(id) ON DELETE CASCADE,
    video_name VARCHAR(255) NOT NULL,      -- '平行启动1-2.mp4'
    file_path VARCHAR(500) NOT NULL,       -- '步伐MP4图/平行启动1-2.mp4'
    duration INTEGER,                      -- 视频时长（秒）
    file_size BIGINT,                      -- 文件大小（字节）
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
-- ===================

-- 步伐类型索引
CREATE INDEX idx_step_types_type_key ON step_types(type_key);
CREATE INDEX idx_step_types_display_order ON step_types(display_order);

-- 步伐组合索引
CREATE INDEX idx_step_combinations_step_type_id ON step_combinations(step_type_id);
CREATE INDEX idx_step_combinations_sequence ON step_combinations(sequence);
CREATE INDEX idx_step_combinations_is_free ON step_combinations(is_free);
CREATE INDEX idx_step_combinations_display_order ON step_combinations(display_order);

-- 步伐模式索引
CREATE INDEX idx_step_patterns_combination_id ON step_patterns(combination_id);
CREATE INDEX idx_step_patterns_is_free ON step_patterns(is_free);
CREATE INDEX idx_step_patterns_display_order ON step_patterns(display_order);

-- 视频文件索引
CREATE INDEX idx_step_videos_pattern_id ON step_videos(pattern_id);
CREATE INDEX idx_step_videos_video_name ON step_videos(video_name);
CREATE INDEX idx_step_videos_display_order ON step_videos(display_order);

-- 启用 Row Level Security (RLS)
-- ===================

ALTER TABLE step_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE step_combinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE step_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE step_videos ENABLE ROW LEVEL SECURITY;

-- RLS 策略 - 公开读取（步伐数据是公开的）
CREATE POLICY "Public can view step types" ON step_types FOR SELECT USING (true);
CREATE POLICY "Public can view step combinations" ON step_combinations FOR SELECT USING (true);
CREATE POLICY "Public can view step patterns" ON step_patterns FOR SELECT USING (true);
CREATE POLICY "Public can view step videos" ON step_videos FOR SELECT USING (true);

-- 管理员策略 - 这里可以后续添加管理员权限控制
-- 暂时允许所有操作，后续可以通过 Supabase Auth 进行权限控制

-- 创建更新时间触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 为所有表添加更新时间触发器
CREATE TRIGGER update_step_types_updated_at BEFORE UPDATE ON step_types FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_step_combinations_updated_at BEFORE UPDATE ON step_combinations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_step_patterns_updated_at BEFORE UPDATE ON step_patterns FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_step_videos_updated_at BEFORE UPDATE ON step_videos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 创建便利视图
-- ===================

-- 步伐完整信息视图
CREATE VIEW step_details AS
SELECT 
    st.id as type_id,
    st.type_key,
    st.name as type_name,
    st.description as type_description,
    sc.id as combination_id,
    sc.sequence,
    sc.name as combination_name,
    sc.description as combination_description,
    sc.is_free as combination_is_free,
    sp.id as pattern_id,
    sp.name as pattern_name,
    sp.description as pattern_description,
    sp.is_free as pattern_is_free,
    sv.id as video_id,
    sv.video_name,
    sv.file_path,
    sv.duration,
    sv.file_size
FROM step_types st
LEFT JOIN step_combinations sc ON st.id = sc.step_type_id
LEFT JOIN step_patterns sp ON sc.id = sp.combination_id
LEFT JOIN step_videos sv ON sp.id = sv.pattern_id
WHERE st.is_active = true 
  AND sc.is_active = true 
  AND sp.is_active = true 
  AND sv.is_active = true
ORDER BY st.display_order, sc.display_order, sp.display_order, sv.display_order;

-- 步伐统计视图
CREATE VIEW step_statistics AS
SELECT 
    st.type_key,
    st.name as type_name,
    COUNT(DISTINCT sc.id) as total_combinations,
    COUNT(DISTINCT sc.id) FILTER (WHERE sc.is_free = true) as free_combinations,
    COUNT(DISTINCT sp.id) as total_patterns,
    COUNT(DISTINCT sp.id) FILTER (WHERE sp.is_free = true) as free_patterns,
    COUNT(DISTINCT sv.id) as total_videos
FROM step_types st
LEFT JOIN step_combinations sc ON st.id = sc.step_type_id AND sc.is_active = true
LEFT JOIN step_patterns sp ON sc.id = sp.combination_id AND sp.is_active = true
LEFT JOIN step_videos sv ON sp.id = sv.pattern_id AND sv.is_active = true
WHERE st.is_active = true
GROUP BY st.id, st.type_key, st.name
ORDER BY st.display_order;

-- 添加注释
COMMENT ON TABLE step_types IS '步伐类型表：平行启动、前后启动等';
COMMENT ON TABLE step_combinations IS '步伐组合表：如1-2、1-3等点位组合';
COMMENT ON TABLE step_patterns IS '步伐模式表：基础步伐、进阶步伐等';
COMMENT ON TABLE step_videos IS '视频文件表：存储所有步伐演示视频信息';

COMMENT ON COLUMN step_types.type_key IS '步伐类型的唯一标识符，用于程序识别';
COMMENT ON COLUMN step_combinations.sequence IS '点位组合序列，如1-2表示从点位1到点位2';
COMMENT ON COLUMN step_combinations.is_free IS '该步伐组合是否免费，为true时免费用户可访问';
COMMENT ON COLUMN step_patterns.is_free IS '该步伐模式是否免费，可以覆盖组合级别的权限设置';
COMMENT ON COLUMN step_videos.file_path IS '视频文件的相对路径，相对于网站根目录';