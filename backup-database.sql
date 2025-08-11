-- 数据库备份脚本 - 在执行回滚前运行
-- 这个脚本用于备份重要数据，以便在需要时恢复

-- 1. 备份用户数据
-- 备份profiles表
SELECT * INTO profiles_backup_20250811 FROM profiles;

-- 2. 备份订阅数据
-- 备份subscriptions表
SELECT * INTO subscriptions_backup_20250811 FROM subscriptions;

-- 3. 备份激活码数据
-- 备份activation_codes表
SELECT * INTO activation_codes_backup_20250811 FROM activation_codes;

-- 4. 备份激活历史
-- 备份activation_history表
SELECT * INTO activation_history_backup_20250811 FROM activation_history;

-- 5. 检查备份是否成功
-- 验证备份表中的记录数
SELECT 
    'profiles_backup_20250811' as table_name,
    COUNT(*) as record_count
FROM profiles_backup_20250811
UNION ALL
SELECT 
    'subscriptions_backup_20250811' as table_name,
    COUNT(*) as record_count
FROM subscriptions_backup_20250811
UNION ALL
SELECT 
    'activation_codes_backup_20250811' as table_name,
    COUNT(*) as record_count
FROM activation_codes_backup_20250811
UNION ALL
SELECT 
    'activation_history_backup_20250811' as table_name,
    COUNT(*) as record_count
FROM activation_history_backup_20250811;

-- 备份完成提示
-- 请确认所有表的记录数与预期一致后再继续