-- 数据库清理脚本 - 删除新增的步伐管理表
-- 在执行V2.4回滚后运行

-- 1. 删除新增的步伐管理相关表
-- 注意：这些表是在database-enhancement分支中添加的，V2.4不需要它们

DROP TABLE IF EXISTS step_patterns CASCADE;
DROP TABLE IF EXISTS step_videos CASCADE;
DROP TABLE IF EXISTS step_config CASCADE;
DROP TABLE IF EXISTS related_videos CASCADE;

-- 2. 删除可能的测试表
DROP TABLE IF EXISTS step_test CASCADE;
DROP TABLE IF EXISTS test_data CASCADE;

-- 3. 删除可能的触发器和函数
DROP TRIGGER IF EXISTS update_step_config_trigger ON step_config;
DROP TRIGGER IF EXISTS sync_step_patterns_trigger ON step_patterns;
DROP FUNCTION IF EXISTS update_step_timestamp();
DROP FUNCTION IF EXISTS sync_step_patterns();

-- 4. 检查清理结果
-- 查看剩余的表（应该只有V2.4的核心表）
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE'
AND table_name NOT IN (
    'profiles', 
    'subscriptions', 
    'activation_codes', 
    'activation_history',
    'profiles_backup_20250811',
    'subscriptions_backup_20250811', 
    'activation_codes_backup_20250811',
    'activation_history_backup_20250811'
)
ORDER BY table_name;

-- 清理完成提示
-- 如果上面的查询返回空结果，说明清理成功
-- 如果仍有表存在，请手动检查并删除