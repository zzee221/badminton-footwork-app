-- 羽毛球步伐数据迁移脚本
-- 从现有的 step-config.js 迁移数据到新的数据库结构
-- 创建时间：2025-08-10

-- 清空现有数据（如果存在）
-- ===================
TRUNCATE TABLE step_videos CASCADE;
TRUNCATE TABLE step_patterns CASCADE;
TRUNCATE TABLE step_combinations CASCADE;
TRUNCATE TABLE step_types CASCADE;

-- 插入步伐类型数据
-- ===================
INSERT INTO step_types (type_key, name, description, display_order) VALUES
('parallel', '平行启动', '平行启动是一种防守站位的启动方式，双脚平行站立，适合应对高球，能够快速向各个方向移动。', 1),
('forward-backward', '前后启动', '前后启动是一种进攻站位的启动方式，前后脚站立，适合应对下压球，启动速度快，爆发力强。', 2);

-- 插入步伐组合数据 - 平行启动
-- ===================
INSERT INTO step_combinations (step_type_id, sequence, name, description, is_free, display_order) VALUES
((SELECT id FROM step_types WHERE type_key = 'parallel'), '1-2', '中心到反手网前', '从中心位置(1)到反手网前(2)的平行启动步伐：双脚平行站立，快速向左侧移动，用反手握拍接球。', true, 1),
((SELECT id FROM step_types WHERE type_key = 'parallel'), '1-3', '中心到正手网前', '从中心位置(1)到正手网前(3)的平行启动步伐：双脚平行站立，快速向右侧移动，用正手握拍接球。', true, 2),
((SELECT id FROM step_types WHERE type_key = 'parallel'), '1-4', '中心到头顶后场', '从中心位置(1)到头顶后场(4)的平行启动步伐：双脚平行站立，快速向左后方移动，用头顶击球技术接球。', true, 3),
((SELECT id FROM step_types WHERE type_key = 'parallel'), '1-5', '中心到正手后场', '从中心位置(1)到正手后场(5)的平行启动步伐：双脚平行站立，快速向右后方移动，用正手高球或杀球技术接球。', true, 4),
((SELECT id FROM step_types WHERE type_key = 'parallel'), '1-6', '中心到反手中场', '从中心位置(1)到反手中场(6)的平行启动步伐：双脚平行站立，快速向左侧移动，用反手击球技术接球。', false, 5),
((SELECT id FROM step_types WHERE type_key = 'parallel'), '1-7', '中心到正手中场', '从中心位置(1)到正手中场(7)的平行启动步伐：双脚平行站立，快速向右侧移动，用正手击球技术接球。', false, 6);

-- 插入步伐组合数据 - 前后启动
-- ===================
INSERT INTO step_combinations (step_type_id, sequence, name, description, is_free, display_order) VALUES
((SELECT id FROM step_types WHERE type_key = 'forward-backward'), '1-2', '中心到反手网前', '从中心位置(1)到反手网前(2)的前后启动步伐：前后脚站立，快速向左侧前方移动，用反手握拍接球。', true, 1),
((SELECT id FROM step_types WHERE type_key = 'forward-backward'), '1-3', '中心到正手网前', '从中心位置(1)到正手网前(3)的前后启动步伐：前后脚站立，快速向右侧前方移动，用正手握拍接球。', true, 2),
((SELECT id FROM step_types WHERE type_key = 'forward-backward'), '1-4', '中心到头顶后场', '从中心位置(1)到头顶后场(4)的前后启动步伐：前后脚站立，快速向左后方移动，用头顶击球技术接球。', true, 3),
((SELECT id FROM step_types WHERE type_key = 'forward-backward'), '1-5', '中心到正手后场', '从中心位置(1)到正手后场(5)的前后启动步伐：前后脚站立，快速向右后方移动，用正手高球或杀球技术接球。', true, 4),
((SELECT id FROM step_types WHERE type_key = 'forward-backward'), '2-4', '反手网前到头顶后场', '从反手网前(2)到头顶后场(4)的前后启动步伐：先回撤，再向左后方移动，适合应对对方的挑高球。', false, 5),
((SELECT id FROM step_types WHERE type_key = 'forward-backward'), '2-5', '反手网前到正手后场', '从反手网前(2)到正手后场(5)的前后启动步伐：快速转身，向右后方移动，需要良好的身体协调性。', false, 6),
((SELECT id FROM step_types WHERE type_key = 'forward-backward'), '3-4', '正手网前到头顶后场', '从正手网前(3)到头顶后场(4)的前后启动步伐：快速转身，向左后方移动，适合应对对方的对角线挑高球。', false, 7),
((SELECT id FROM step_types WHERE type_key = 'forward-backward'), '3-5', '正手网前到正手后场', '从正手网前(3)到正手后场(5)的前后启动步伐：直接向后移动，保持正手击球姿势。', false, 8),
((SELECT id FROM step_types WHERE type_key = 'forward-backward'), '4-2', '头顶后场到反手网前', '从头顶后场(4)到反手网前(2)的前后启动步伐：快速向前移动，转为反手握拍接球。', false, 9),
((SELECT id FROM step_types WHERE type_key = 'forward-backward'), '4-3', '头顶后场到正手网前', '从头顶后场(4)到正手网前(3)的前后启动步伐：快速向前移动，转为正手握拍接球。', false, 10),
((SELECT id FROM step_types WHERE type_key = 'forward-backward'), '5-2', '正手后场到反手网前', '从正手后场(5)到反手网前(2)的前后启动步伐：快速向前并向左移动，需要良好的脚步灵活性。', false, 11),
((SELECT id FROM step_types WHERE type_key = 'forward-backward'), '5-3', '正手后场到正手网前', '从正手后场(5)到正手网前(3)的前后启动步伐：快速向前移动，保持正手击球姿势。', false, 12);

-- 插入步伐模式数据 - 平行启动
-- ===================
-- 1-2 中心到反手网前
INSERT INTO step_patterns (combination_id, name, description, is_free, display_order) VALUES
((SELECT id FROM step_combinations WHERE step_type_id = (SELECT id FROM step_types WHERE type_key = 'parallel') AND sequence = '1-2'), '基础步伐', '标准的平行启动步伐动作，适合初学者练习。', true, 1),
((SELECT id FROM step_combinations WHERE step_type_id = (SELECT id FROM step_types WHERE type_key = 'parallel') AND sequence = '1-2'), '进阶步伐', '快速变向的进阶步伐技巧，提高反应速度。', false, 2);

-- 1-3 中心到正手网前
INSERT INTO step_patterns (combination_id, name, description, is_free, display_order) VALUES
((SELECT id FROM step_combinations WHERE step_type_id = (SELECT id FROM step_types WHERE type_key = 'parallel') AND sequence = '1-3'), '基础步伐', '标准的平行启动步伐动作，适合初学者练习。', true, 1),
((SELECT id FROM step_combinations WHERE step_type_id = (SELECT id FROM step_types WHERE type_key = 'parallel') AND sequence = '1-3'), '进阶步伐', '快速变向的进阶步伐技巧，提高反应速度。', false, 2);

-- 1-4 中心到头顶后场
INSERT INTO step_patterns (combination_id, name, description, is_free, display_order) VALUES
((SELECT id FROM step_combinations WHERE step_type_id = (SELECT id FROM step_types WHERE type_key = 'parallel') AND sequence = '1-4'), '基础步伐', '标准的平行启动步伐动作，适合初学者练习。', true, 1);

-- 1-5 中心到正手后场
INSERT INTO step_patterns (combination_id, name, description, is_free, display_order) VALUES
((SELECT id FROM step_combinations WHERE step_type_id = (SELECT id FROM step_types WHERE type_key = 'parallel') AND sequence = '1-5'), '基础步伐', '标准的平行启动步伐动作，适合初学者练习。', true, 1),
((SELECT id FROM step_combinations WHERE step_type_id = (SELECT id FROM step_types WHERE type_key = 'parallel') AND sequence = '1-5'), '进阶步伐', '包含多种变化的进阶步伐技巧。', false, 2);

-- 1-6 中心到反手中场
INSERT INTO step_patterns (combination_id, name, description, is_free, display_order) VALUES
((SELECT id FROM step_combinations WHERE step_type_id = (SELECT id FROM step_types WHERE type_key = 'parallel') AND sequence = '1-6'), '基础步伐', '标准的平行启动步伐动作，适合中场防守。', false, 1),
((SELECT id FROM step_combinations WHERE step_type_id = (SELECT id FROM step_types WHERE type_key = 'parallel') AND sequence = '1-6'), '跨步勾对角', '使用跨步技术勾对角球的特殊步伐。', false, 2),
((SELECT id FROM step_combinations WHERE step_type_id = (SELECT id FROM step_types WHERE type_key = 'parallel') AND sequence = '1-6'), '跨步', '使用跨步技术快速移动到中场位置。', false, 3);

-- 1-7 中心到正手中场
INSERT INTO step_patterns (combination_id, name, description, is_free, display_order) VALUES
((SELECT id FROM step_combinations WHERE step_type_id = (SELECT id FROM step_types WHERE type_key = 'parallel') AND sequence = '1-7'), '基础步伐', '标准的平行启动步伐动作，适合中场防守。', false, 1),
((SELECT id FROM step_combinations WHERE step_type_id = (SELECT id FROM step_types WHERE type_key = 'parallel') AND sequence = '1-7'), '小跳', '使用小跳技术快速调整位置。', false, 2);

-- 插入步伐模式数据 - 前后启动
-- ===================
-- 1-2 中心到反手网前
INSERT INTO step_patterns (combination_id, name, description, is_free, display_order) VALUES
((SELECT id FROM step_combinations WHERE step_type_id = (SELECT id FROM step_types WHERE type_key = 'forward-backward') AND sequence = '1-2'), '基础步伐', '标准的前后启动步伐动作，适合初学者练习。', true, 1);

-- 1-3 中心到正手网前
INSERT INTO step_patterns (combination_id, name, description, is_free, display_order) VALUES
((SELECT id FROM step_combinations WHERE step_type_id = (SELECT id FROM step_types WHERE type_key = 'forward-backward') AND sequence = '1-3'), '基础步伐', '标准的前后启动步伐动作，适合初学者练习。', true, 1);

-- 1-4 中心到头顶后场
INSERT INTO step_patterns (combination_id, name, description, is_free, display_order) VALUES
((SELECT id FROM step_combinations WHERE step_type_id = (SELECT id FROM step_types WHERE type_key = 'forward-backward') AND sequence = '1-4'), '基础步伐', '标准的前后启动步伐动作，适合初学者练习。', true, 1),
((SELECT id FROM step_combinations WHERE step_type_id = (SELECT id FROM step_types WHERE type_key = 'forward-backward') AND sequence = '1-4'), '进阶步伐', '快速转身移动的进阶技巧。', false, 2);

-- 1-5 中心到正手后场
INSERT INTO step_patterns (combination_id, name, description, is_free, display_order) VALUES
((SELECT id FROM step_combinations WHERE step_type_id = (SELECT id FROM step_types WHERE type_key = 'forward-backward') AND sequence = '1-5'), '基础步伐', '标准的前后启动步伐动作，适合初学者练习。', true, 1),
((SELECT id FROM step_combinations WHERE step_type_id = (SELECT id FROM step_types WHERE type_key = 'forward-backward') AND sequence = '1-5'), '进阶步伐', '包含单脚杀球和并步技术的进阶步伐。', false, 2);

-- 2-4 反手网前到头顶后场
INSERT INTO step_patterns (combination_id, name, description, is_free, display_order) VALUES
((SELECT id FROM step_combinations WHERE step_type_id = (SELECT id FROM step_types WHERE type_key = 'forward-backward') AND sequence = '2-4'), '基础步伐', '从网前到后场的基础步伐组合。', false, 1);

-- 2-5 反手网前到正手后场
INSERT INTO step_patterns (combination_id, name, description, is_free, display_order) VALUES
((SELECT id FROM step_combinations WHERE step_type_id = (SELECT id FROM step_types WHERE type_key = 'forward-backward') AND sequence = '2-5'), '基础步伐', '从网前到后场的基础步伐组合。', false, 1);

-- 3-4 正手网前到头顶后场
INSERT INTO step_patterns (combination_id, name, description, is_free, display_order) VALUES
((SELECT id FROM step_combinations WHERE step_type_id = (SELECT id FROM step_types WHERE type_key = 'forward-backward') AND sequence = '3-4'), '基础步伐', '从网前到后场的基础步伐组合。', false, 1),
((SELECT id FROM step_combinations WHERE step_type_id = (SELECT id FROM step_types WHERE type_key = 'forward-backward') AND sequence = '3-4'), '交叉步伐', '使用交叉步技术的特殊步伐。', false, 2);

-- 3-5 正手网前到正手后场
INSERT INTO step_patterns (combination_id, name, description, is_free, display_order) VALUES
((SELECT id FROM step_combinations WHERE step_type_id = (SELECT id FROM step_types WHERE type_key = 'forward-backward') AND sequence = '3-5'), '基础步伐', '从网前到后场的基础步伐组合。', false, 1),
((SELECT id FROM step_combinations WHERE step_type_id = (SELECT id FROM step_types WHERE type_key = 'forward-backward') AND sequence = '3-5'), '主动步伐', '主动进攻的步伐技巧。', false, 2);

-- 4-2 头顶后场到反手网前
INSERT INTO step_patterns (combination_id, name, description, is_free, display_order) VALUES
((SELECT id FROM step_combinations WHERE step_type_id = (SELECT id FROM step_types WHERE type_key = 'forward-backward') AND sequence = '4-2'), '基础步伐', '从后场到网前的基础步伐组合。', false, 1);

-- 4-3 头顶后场到正手网前
INSERT INTO step_patterns (combination_id, name, description, is_free, display_order) VALUES
((SELECT id FROM step_combinations WHERE step_type_id = (SELECT id FROM step_types WHERE type_key = 'forward-backward') AND sequence = '4-3'), '基础步伐', '从后场到网前的基础步伐组合。', false, 1);

-- 5-2 正手后场到反手网前
INSERT INTO step_patterns (combination_id, name, description, is_free, display_order) VALUES
((SELECT id FROM step_combinations WHERE step_type_id = (SELECT id FROM step_types WHERE type_key = 'forward-backward') AND sequence = '5-2'), '基础步伐', '从后场到网前的基础步伐组合。', false, 1);

-- 5-3 正手后场到正手网前
INSERT INTO step_patterns (combination_id, name, description, is_free, display_order) VALUES
((SELECT id FROM step_combinations WHERE step_type_id = (SELECT id FROM step_types WHERE type_key = 'forward-backward') AND sequence = '5-3'), '基础步伐', '从后场到网前的基础步伐组合。', false, 1);

-- 插入视频文件数据
-- ===================
-- 平行启动 1-2
INSERT INTO step_videos (pattern_id, video_name, file_path, display_order) VALUES
((SELECT id FROM step_patterns WHERE combination_id = (SELECT id FROM step_combinations WHERE step_type_id = (SELECT id FROM step_types WHERE type_key = 'parallel') AND sequence = '1-2') AND name = '基础步伐'), '平行启动1-2.mp4', '步伐MP4图/平行启动1-2.mp4', 1),
((SELECT id FROM step_patterns WHERE combination_id = (SELECT id FROM step_combinations WHERE step_type_id = (SELECT id FROM step_types WHERE type_key = 'parallel') AND sequence = '1-2') AND name = '进阶步伐'), '平行启动1-2（1）.mp4', '步伐MP4图/平行启动1-2（1）.mp4', 1);

-- 平行启动 1-3
INSERT INTO step_videos (pattern_id, video_name, file_path, display_order) VALUES
((SELECT id FROM step_patterns WHERE combination_id = (SELECT id FROM step_combinations WHERE step_type_id = (SELECT id FROM step_types WHERE type_key = 'parallel') AND sequence = '1-3') AND name = '基础步伐'), '平行启动1-3.mp4', '步伐MP4图/平行启动1-3.mp4', 1),
((SELECT id FROM step_patterns WHERE combination_id = (SELECT id FROM step_combinations WHERE step_type_id = (SELECT id FROM step_types WHERE type_key = 'parallel') AND sequence = '1-3') AND name = '进阶步伐'), '平行启动1-3（1）.mp4', '步伐MP4图/平行启动1-3（1）.mp4', 1);

-- 平行启动 1-4
INSERT INTO step_videos (pattern_id, video_name, file_path, display_order) VALUES
((SELECT id FROM step_patterns WHERE combination_id = (SELECT id FROM step_combinations WHERE step_type_id = (SELECT id FROM step_types WHERE type_key = 'parallel') AND sequence = '1-4') AND name = '基础步伐'), '平行启动1-4.mp4', '步伐MP4图/平行启动1-4.mp4', 1);

-- 平行启动 1-5
INSERT INTO step_videos (pattern_id, video_name, file_path, display_order) VALUES
((SELECT id FROM step_patterns WHERE combination_id = (SELECT id FROM step_combinations WHERE step_type_id = (SELECT id FROM step_types WHERE type_key = 'parallel') AND sequence = '1-5') AND name = '基础步伐'), '平行启动1-5.mp4', '步伐MP4图/平行启动1-5.mp4', 1),
((SELECT id FROM step_patterns WHERE combination_id = (SELECT id FROM step_combinations WHERE step_type_id = (SELECT id FROM step_types WHERE type_key = 'parallel') AND sequence = '1-5') AND name = '进阶步伐'), '平行启动1-5（1）.mp4', '步伐MP4图/平行启动1-5（1）.mp4', 2),
((SELECT id FROM step_patterns WHERE combination_id = (SELECT id FROM step_combinations WHERE step_type_id = (SELECT id FROM step_types WHERE type_key = 'parallel') AND sequence = '1-5') AND name = '进阶步伐'), '平行启动1-5（被动交叉）.mp4', '步伐MP4图/平行启动1-5（被动交叉）.mp4', 3);

-- 平行启动 1-6
INSERT INTO step_videos (pattern_id, video_name, file_path, display_order) VALUES
((SELECT id FROM step_patterns WHERE combination_id = (SELECT id FROM step_combinations WHERE step_type_id = (SELECT id FROM step_types WHERE type_key = 'parallel') AND sequence = '1-6') AND name = '基础步伐'), '平行启动1-6.mp4', '步伐MP4图/平行启动1-6.mp4', 1),
((SELECT id FROM step_patterns WHERE combination_id = (SELECT id FROM step_combinations WHERE step_type_id = (SELECT id FROM step_types WHERE type_key = 'parallel') AND sequence = '1-6') AND name = '跨步勾对角'), '平行启动1-6（跨步勾对角）.mp4', '步伐MP4图/平行启动1-6（跨步勾对角）.mp4', 1),
((SELECT id FROM step_patterns WHERE combination_id = (SELECT id FROM step_combinations WHERE step_type_id = (SELECT id FROM step_types WHERE type_key = 'parallel') AND sequence = '1-6') AND name = '跨步'), '平行启动1-6（跨步）.mp4', '步伐MP4图/平行启动1-6（跨步）.mp4', 1);

-- 平行启动 1-7
INSERT INTO step_videos (pattern_id, video_name, file_path, display_order) VALUES
((SELECT id FROM step_patterns WHERE combination_id = (SELECT id FROM step_combinations WHERE step_type_id = (SELECT id FROM step_types WHERE type_key = 'parallel') AND sequence = '1-7') AND name = '基础步伐'), '平行启动1-7.mp4', '步伐MP4图/平行启动1-7.mp4', 1),
((SELECT id FROM step_patterns WHERE combination_id = (SELECT id FROM step_combinations WHERE step_type_id = (SELECT id FROM step_types WHERE type_key = 'parallel') AND sequence = '1-7') AND name = '小跳'), '平行启动1-7（小跳）.mp4', '步伐MP4图/平行启动1-7（小跳）.mp4', 1);

-- 前后启动 1-2
INSERT INTO step_videos (pattern_id, video_name, file_path, display_order) VALUES
((SELECT id FROM step_patterns WHERE combination_id = (SELECT id FROM step_combinations WHERE step_type_id = (SELECT id FROM step_types WHERE type_key = 'forward-backward') AND sequence = '1-2') AND name = '基础步伐'), '前后启动1-2.mp4', '步伐MP4图/前后启动1-2.mp4', 1);

-- 前后启动 1-3
INSERT INTO step_videos (pattern_id, video_name, file_path, display_order) VALUES
((SELECT id FROM step_patterns WHERE combination_id = (SELECT id FROM step_combinations WHERE step_type_id = (SELECT id FROM step_types WHERE type_key = 'forward-backward') AND sequence = '1-3') AND name = '基础步伐'), '前后启动1-3.mp4', '步伐MP4图/前后启动1-3.mp4', 1);

-- 前后启动 1-4
INSERT INTO step_videos (pattern_id, video_name, file_path, display_order) VALUES
((SELECT id FROM step_patterns WHERE combination_id = (SELECT id FROM step_combinations WHERE step_type_id = (SELECT id FROM step_types WHERE type_key = 'forward-backward') AND sequence = '1-4') AND name = '基础步伐'), '前后启动1-4.mp4', '步伐MP4图/前后启动1-4.mp4', 1),
((SELECT id FROM step_patterns WHERE combination_id = (SELECT id FROM step_combinations WHERE step_type_id = (SELECT id FROM step_types WHERE type_key = 'forward-backward') AND sequence = '1-4') AND name = '进阶步伐'), '前后启动1-4（1）.mp4', '步伐MP4图/前后启动1-4（1）.mp4', 1);

-- 前后启动 1-5
INSERT INTO step_videos (pattern_id, video_name, file_path, display_order) VALUES
((SELECT id FROM step_patterns WHERE combination_id = (SELECT id FROM step_combinations WHERE step_type_id = (SELECT id FROM step_types WHERE type_key = 'forward-backward') AND sequence = '1-5') AND name = '基础步伐'), '前后启动1-5.mp4', '步伐MP4图/前后启动1-5.mp4', 1),
((SELECT id FROM step_patterns WHERE combination_id = (SELECT id FROM step_combinations WHERE step_type_id = (SELECT id FROM step_types WHERE type_key = 'forward-backward') AND sequence = '1-5') AND name = '进阶步伐'), '前后启动1-5（单脚杀）.mp4', '步伐MP4图/前后启动1-5（单脚杀）.mp4', 2),
((SELECT id FROM step_patterns WHERE combination_id = (SELECT id FROM step_combinations WHERE step_type_id = (SELECT id FROM step_types WHERE type_key = 'forward-backward') AND sequence = '1-5') AND name = '进阶步伐'), '前后启动1-5（并步）.mp4', '步伐MP4图/前后启动1-5（并步）.mp4', 3);

-- 前后启动 2-4
INSERT INTO step_videos (pattern_id, video_name, file_path, display_order) VALUES
((SELECT id FROM step_patterns WHERE combination_id = (SELECT id FROM step_combinations WHERE step_type_id = (SELECT id FROM step_types WHERE type_key = 'forward-backward') AND sequence = '2-4') AND name = '基础步伐'), '前后启动2-4.mp4', '步伐MP4图/前后启动2-4.mp4', 1);

-- 前后启动 2-5
INSERT INTO step_videos (pattern_id, video_name, file_path, display_order) VALUES
((SELECT id FROM step_patterns WHERE combination_id = (SELECT id FROM step_combinations WHERE step_type_id = (SELECT id FROM step_types WHERE type_key = 'forward-backward') AND sequence = '2-5') AND name = '基础步伐'), '前后启动2-5.mp4', '步伐MP4图/前后启动2-5.mp4', 1);

-- 前后启动 3-4
INSERT INTO step_videos (pattern_id, video_name, file_path, display_order) VALUES
((SELECT id FROM step_patterns WHERE combination_id = (SELECT id FROM step_combinations WHERE step_type_id = (SELECT id FROM step_types WHERE type_key = 'forward-backward') AND sequence = '3-4') AND name = '基础步伐'), '前后启动3-4.mp4', '步伐MP4图/前后启动3-4.mp4', 1),
((SELECT id FROM step_patterns WHERE combination_id = (SELECT id FROM step_combinations WHERE step_type_id = (SELECT id FROM step_types WHERE type_key = 'forward-backward') AND sequence = '3-4') AND name = '交叉步伐'), '前后启动3-4（交叉）.mp4', '步伐MP4图/前后启动3-4（交叉）.mp4', 1);

-- 前后启动 3-5
INSERT INTO step_videos (pattern_id, video_name, file_path, display_order) VALUES
((SELECT id FROM step_patterns WHERE combination_id = (SELECT id FROM step_combinations WHERE step_type_id = (SELECT id FROM step_types WHERE type_key = 'forward-backward') AND sequence = '3-5') AND name = '基础步伐'), '前后启动3-5.mp4', '步伐MP4图/前后启动3-5.mp4', 1),
((SELECT id FROM step_patterns WHERE combination_id = (SELECT id FROM step_combinations WHERE step_type_id = (SELECT id FROM step_types WHERE type_key = 'forward-backward') AND sequence = '3-5') AND name = '主动步伐'), '前后启动3-5（主动）.mp4', '步伐MP4图/前后启动3-5（主动）.mp4', 1);

-- 前后启动 4-2
INSERT INTO step_videos (pattern_id, video_name, file_path, display_order) VALUES
((SELECT id FROM step_patterns WHERE combination_id = (SELECT id FROM step_combinations WHERE step_type_id = (SELECT id FROM step_types WHERE type_key = 'forward-backward') AND sequence = '4-2') AND name = '基础步伐'), '前后启动4-2.mp4', '步伐MP4图/前后启动4-2.mp4', 1);

-- 前后启动 4-3
INSERT INTO step_videos (pattern_id, video_name, file_path, display_order) VALUES
((SELECT id FROM step_patterns WHERE combination_id = (SELECT id FROM step_combinations WHERE step_type_id = (SELECT id FROM step_types WHERE type_key = 'forward-backward') AND sequence = '4-3') AND name = '基础步伐'), '前后启动4-3.mp4', '步伐MP4图/前后启动4-3.mp4', 1);

-- 前后启动 5-2
INSERT INTO step_videos (pattern_id, video_name, file_path, display_order) VALUES
((SELECT id FROM step_patterns WHERE combination_id = (SELECT id FROM step_combinations WHERE step_type_id = (SELECT id FROM step_types WHERE type_key = 'forward-backward') AND sequence = '5-2') AND name = '基础步伐'), '前后启动5-2.mp4', '步伐MP4图/前后启动5-2.mp4', 1);

-- 前后启动 5-3
INSERT INTO step_videos (pattern_id, video_name, file_path, display_order) VALUES
((SELECT id FROM step_patterns WHERE combination_id = (SELECT id FROM step_combinations WHERE step_type_id = (SELECT id FROM step_types WHERE type_key = 'forward-backward') AND sequence = '5-3') AND name = '基础步伐'), '前后启动5-3.mp4', '步伐MP4图/前后启动5-3.mp4', 1);

-- 验证数据导入结果
-- ===================
SELECT 
    'step_types' as table_name,
    COUNT(*) as record_count
FROM step_types
UNION ALL
SELECT 
    'step_combinations' as table_name,
    COUNT(*) as record_count
FROM step_combinations
UNION ALL
SELECT 
    'step_patterns' as table_name,
    COUNT(*) as record_count
FROM step_patterns
UNION ALL
SELECT 
    'step_videos' as table_name,
    COUNT(*) as record_count
FROM step_videos
ORDER BY table_name;

-- 显示统计信息
SELECT * FROM step_statistics;

-- 显示前5条详细记录用于验证
SELECT 
    type_name,
    sequence,
    combination_name,
    pattern_name,
    video_name,
    file_path
FROM step_details
LIMIT 5;