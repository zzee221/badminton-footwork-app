-- 插入示例激活码（如果你还没有执行）
INSERT INTO activation_codes (code, plan_type, duration_days, expires_at) VALUES
('PREMIUM2024', 'premium', 30, '2024-12-31 23:59:59'),
('VIP2024', 'vip', 90, '2024-12-31 23:59:59'),
('BADMINTON1', 'premium', 30, '2025-06-30 23:59:59'),
('FOOTWORK2', 'vip', 60, '2025-06-30 23:59:59'),
('TRAINING3', 'premium', 30, '2025-08-31 23:59:59'),
('ADVANCED4', 'vip', 90, '2025-08-31 23:59:59'),
('MEMBER5', 'premium', 30, '2025-12-31 23:59:59'),
('ELITE6', 'vip', 365, '2025-12-31 23:59:59');

-- 验证插入的数据
SELECT * FROM activation_codes WHERE is_used = FALSE ORDER BY created_at;