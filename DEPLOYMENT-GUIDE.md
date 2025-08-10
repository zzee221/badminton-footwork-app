# 数据库化管理功能部署指南

## 📋 概述
本功能将原有的文件配置方式改为数据库管理方式，让你可以通过 Supabase Dashboard 直观地管理步伐数据。

## 🗂️ 新增文件

### 数据库相关
- `database-step-management.sql` - 步伐数据表结构
- `migration-step-data.sql` - 数据迁移脚本

### 程序文件
- `database-step-config.js` - 数据库步伐配置管理类
- `script-database.js` - 数据库版本主程序

### 修改的文件
- `index.html` - 更新脚本引用

## 🚀 部署步骤

### 1. 数据库初始化
在 Supabase SQL 编辑器中按顺序执行：

```sql
-- 1. 创建表结构
-- 复制 database-step-management.sql 的内容执行

-- 2. 迁移现有数据
-- 复制 migration-step-data.sql 的内容执行
```

### 2. 验证数据导入
执行迁移脚本后，检查以下内容：

```sql
-- 检查数据是否正确导入
SELECT * FROM step_statistics;

-- 检查步伐详情
SELECT * FROM step_details LIMIT 5;
```

### 3. 部署到 Netlify
由于我们在 `feature/database-management` 分支开发，有两种部署方式：

#### 方式A：测试部署（推荐）
```bash
# 推送分支到 GitHub
git push origin feature/database-management

# 在 Netlify 中：
# 1. 创建新的部署站点或分支部署
# 2. 选择 feature/database-management 分支
# 3. 测试功能正常后再合并到主分支
```

#### 方式B：直接部署到生产
```bash
# 合并到主分支
git checkout main
git merge feature/database-management
git push origin main
```

### 4. 功能验证
部署后验证以下功能：

1. **步伐类型选择** - 应该显示数据库中的类型
2. **步伐列表** - 正确显示步伐数据
3. **视频播放** - 点击点位能正常播放视频
4. **权限控制** - 免费/付费内容权限正确

## 🎯 管理界面使用

### Supabase Dashboard 管理
登录 Supabase Dashboard，进入 `Table Editor`：

#### 管理步伐类型
1. 选择 `step_types` 表
2. 可以添加、修改、删除步伐类型
3. 修改 `name` 和 `description` 字段

#### 管理步伐组合
1. 选择 `step_combinations` 表
2. 修改步伐名称和说明
3. 调整 `is_free` 字段控制付费策略
4. 修改 `display_order` 调整显示顺序

#### 管理步伐模式
1. 选择 `step_patterns` 表
2. 添加新的步伐模式
3. 设置模式级别的权限控制

#### 管理视频文件
1. 选择 `step_videos` 表
2. 添加新的视频文件
3. 修改视频路径和名称

### 常用管理操作

#### 添加新步伐
1. 在 `step_combinations` 表添加新记录
2. 在 `step_patterns` 表添加对应模式
3. 在 `step_videos` 表添加视频文件

#### 修改说明文字
```sql
-- 修改步伐组合说明
UPDATE step_combinations 
SET description = '新的说明文字'
WHERE sequence = '1-2';

-- 修改模式说明
UPDATE step_patterns 
SET description = '模式说明'
WHERE name = '基础步伐';
```

#### 调整付费策略
```sql
-- 设置为免费
UPDATE step_combinations 
SET is_free = true
WHERE sequence = '1-2';

-- 设置为付费
UPDATE step_combinations 
SET is_free = false
WHERE sequence = '1-6';
```

## 🔧 故障排除

### 常见问题

#### 1. 数据加载失败
- 检查 Supabase 连接配置
- 确认数据库表已创建
- 查看 RLS 策略设置

#### 2. 视频无法播放
- 检查视频文件路径是否正确
- 确认视频文件存在
- 检查文件权限

#### 3. 权限控制异常
- 检查 `is_free` 字段设置
- 确认用户登录状态
- 验证会员权限

### 调试方法

#### 浏览器控制台
```javascript
// 检查步伐数据
window.databaseStepConfig.getStepTypes().then(console.log);

// 检查特定步伐配置
window.databaseStepConfig.getStepConfig('parallel').then(console.log);
```

#### 数据库查询
```sql
-- 检查数据完整性
SELECT 
    st.name as type_name,
    sc.sequence,
    sc.name as combination_name,
    sp.name as pattern_name,
    sv.video_name
FROM step_types st
LEFT JOIN step_combinations sc ON st.id = sc.step_type_id
LEFT JOIN step_patterns sp ON sc.id = sp.combination_id
LEFT JOIN step_videos sv ON sp.id = sv.pattern_id
ORDER BY st.display_order, sc.display_order, sp.display_order;
```

## 🎉 后续优化

### 计划中的功能
1. **管理界面** - 专门的管理页面
2. **批量操作** - 批量导入/导出功能
3. **数据验证** - 防止错误配置
4. **版本控制** - 配置变更历史

### 注意事项
1. 首次部署建议在测试环境验证
2. 修改数据前建议备份
3. 注意视频文件的路径正确性
4. 定期检查数据完整性

## 📞 技术支持

如遇到问题，请检查：
1. 浏览器控制台错误信息
2. Supabase 日志
3. 网络连接状态
4. 数据库表结构完整性