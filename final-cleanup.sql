-- 精确清理脚本 - 删除剩余的步伐管理表
-- 根据实际查询结果，删除这些表

-- 1. 删除剩余的步伐管理表
DROP TABLE IF EXISTS step_combinations CASCADE;
DROP TABLE IF EXISTS step_patterns CASCADE;
DROP TABLE IF EXISTS step_types CASCADE;
DROP TABLE IF EXISTS step_videos CASCADE;

-- 2. 删除备份表（可选，如果确认数据已不需要）
-- DROP TABLE IF EXISTS profiles_backup_20250811 CASCADE;
-- DROP TABLE IF EXISTS subscriptions_backup_20250811 CASCADE;
-- DROP TABLE IF EXISTS activation_codes_backup_20250811 CASCADE;
-- DROP TABLE IF EXISTS activation_history_backup_20250811 CASCADE;

-- 3. 验证清理结果
-- 查看剩余的表（应该只有V2.4的核心表）
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE'
ORDER BY table_name;