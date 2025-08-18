# Google Analytics 4 集成指南

## 📋 概述

本项目已集成 Google Analytics 4 用于访问数据统计和分析。

## 🔧 设置步骤

### 1. 创建 Google Analytics 4 账号

1. 访问 [Google Analytics](https://analytics.google.com/)
2. 点击"开始测量"
3. 创建账号：
   - 账号名称：`羽毛球步伐训练应用`
   - 数据共享设置：根据需要选择

### 2. 创建媒体资源

1. 创建媒体资源：
   - 媒体资源名称：`羽毛球步伐训练应用 - 网站`
   - 时区：`China Standard Time`
   - 货币：`CNY`

2. 获取测量 ID：
   - 格式：`G-XXXXXXXXXX`
   - 在"数据流"设置中找到

### 3. 配置代码

1. 将测量 ID 填入 `analytics-config.js`：
   ```javascript
   const GA4_CONFIG = {
       MEASUREMENT_ID: 'G-XXXXXXXXXX', // 替换为你的实际ID
       ENABLED: true,
       DEBUG: false
   };
   ```

2. 更新 `index.html` 中的 GA4 脚本：
   ```html
   <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
   ```

### 4. 验证设置

1. 打开你的网站
2. 接受隐私横幅中的分析跟踪
3. 访问 Google Analytics 实时报告
4. 确认能看到访问数据

## 📊 跟踪的事件

### 用户行为事件
- `page_view` - 页面访问
- `gender_switch` - 性别切换
- `step_type_switch` - 步伐类型切换
- `step_view` - 步伐查看
- `video_play` - 视频播放
- `user_login` - 用户登录
- `user_register` - 用户注册
- `user_upgrade` - 用户升级

### 自定义参数
- `step_sequence` - 步伐序列 (如: "1-2")
- `step_type` - 步伐类型 (parallel/forward-backward)
- `gender` - 性别 (male/female)
- `video_index` - 视频索引
- `total_videos` - 总视频数
- `is_free` - 是否免费内容
- `pattern_name` - 步伐模式名称
- `user_type` - 用户类型 (free/premium)

## 🔒 隐私保护

### 用户权利
- **知情权**：明确告知数据收集用途
- **选择权**：可以接受或拒绝分析跟踪
- **访问权**：可随时查看隐私政策
- **撤销权**：可随时更改隐私设置

### 隐私功能
- 隐私横幅：首次访问时显示选择
- 隐私设置：右下角设置按钮
- 隐私政策：详细的数据使用说明
- 本地存储：用户选择保存在 localStorage

### Do Not Track 支持
- 自动检测浏览器的 Do Not Track 设置
- 尊重用户的隐私偏好

## 📈 数据分析建议

### 关键指标
1. **用户参与度**
   - 页面访问量
   - 平均访问时长
   - 跳出率

2. **功能使用**
   - 男单 vs 女单使用比例
   - 平行启动 vs 前后启动使用比例
   - 各个步伐的热度分布

3. **内容效果**
   - 视频播放完成率
   - 免费内容 vs 付费内容使用
   - 用户行为路径

### 报告设置
1. **自定义报告**
   - 按性别分组的用户行为
   - 步伐类型使用统计
   - 视频播放热力图

2. **转化漏斗**
   - 页面访问 → 步伐查看 → 视频播放
   - 免费用户 → 会员升级

## 🛠️ 故障排除

### 常见问题
1. **数据不显示**
   - 检查测量 ID 是否正确
   - 确认用户已接受分析跟踪
   - 检查浏览器是否阻止了跟踪

2. **事件跟踪异常**
   - 检查 `analytics-config.js` 是否正确加载
   - 确认 GA4 配置已启用
   - 查看浏览器控制台错误

3. **隐私问题**
   - 确认隐私横幅正常显示
   - 检查 localStorage 权限
   - 验证 Do Not Track 设置

### 调试模式
在 `analytics-config.js` 中启用调试模式：
```javascript
const GA4_CONFIG = {
    DEBUG: true // 启用调试输出
};
```

## 📝 合规性

### GDPR 合规
- 明确的用户同意机制
- 详细的数据使用说明
- 用户数据访问和删除权

### CCPA 合规
- Do Not Track 支持
- 隐私政策透明度
- 用户选择权保障

## 📞 技术支持

如有问题，请检查：
1. 浏览器开发者工具控制台
2. Google Analytics 状态页面
3. 网络连接和防火墙设置

---

**版本：V2.7.2** | **更新日期：2025-08-18**