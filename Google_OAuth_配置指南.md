# Supabase Google OAuth 配置指南

## 概述
本指南将帮助您在Supabase控制台中配置Google OAuth提供程序，以便用户可以使用他们的Google账号登录到羽毛球步伐应用。

## 步骤1：在Google Cloud Console创建OAuth凭据

1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 创建一个新项目或选择现有项目
3. 在左侧导航菜单中，选择 "API和服务" > "凭据"
4. 点击 "创建凭据" > "OAuth客户端ID"
5. 如果这是第一次创建，可能需要先配置 "OAuth同意屏幕"：
   - 选择 "外部" 用户类型
   - 填写应用名称（例如：羽毛球步伐训练）
   - 填写用户支持电子邮件地址
   - 填写开发者联系信息
   - 点击 "保存并继续"
   - 在 "范围" 页面，点击 "保存并继续"（暂时不需要添加特定范围）
   - 在 "测试用户" 页面，添加您的Google邮箱作为测试用户
   - 点击 "保存并继续"

6. 回到 "创建OAuth客户端ID" 页面：
   - 选择 "Web应用" 作为应用类型
   - 在 "名称" 字段中，输入描述性名称（例如：羽毛球步伐Web客户端）
   - 在 "已授权的重定向URI" 部分，添加以下URI：
     ```
     https://mkegxptdoteekylespbp.supabase.co/auth/v1/callback
     ```
     （注意：这是您Supabase项目的回调URL）
   - 点击 "创建"

7. 创建成功后，您将获得客户端ID和客户端密钥。请妥善保存这些凭据，稍后需要在Supabase中配置。

## 步骤2：在Supabase控制台配置Google OAuth

1. 登录到 [Supabase Dashboard](https://app.supabase.com/)
2. 选择您的项目（mkegxptdoteekylespbp）
3. 在左侧导航菜单中，选择 "Authentication" > "Providers"
4. 找到 "Google" 提供程序并点击它进行配置
5. 启用Google提供程序（切换开关）
6. 输入在步骤1中获取的客户端ID和客户端密钥
7. 点击 "保存"

## 步骤3：配置额外设置（可选）

1. 在Google OAuth配置页面，您可以配置以下选项：
   - **额外的范围**：默认已包含基本用户信息，如需访问其他Google服务，可以添加额外范围
   - **跳过电子邮件验证**：如果启用，Google登录的用户将不需要验证电子邮件

2. 在 "URL Configuration" 页面，确保以下URL设置正确：
   - **Site URL**：您应用的URL（例如：https://yourdomain.com）
   - **Redirect URLs**：应包含 `https://mkegxptdoteekylespbp.supabase.co/auth/v1/callback`

## 步骤4：测试配置

1. 确保您已按照前面的步骤修改了 `auth.js` 和 `index.html` 文件
2. 启动您的应用
3. 点击登录按钮，然后点击 "使用Google账号登录"
4. 您应该会被重定向到Google登录页面
5. 使用您的Google账号登录并授权应用
6. 成功后，您应该会被重定向回应用，并自动登录

## 常见问题

### 问题1：重定向URI不匹配
**错误**：`redirect_uri_mismatch`
**解决方案**：确保在Google Cloud Console中配置的重定向URI与Supabase回调URL完全匹配，包括协议（https）和路径。

### 问题2：未授权的客户端
**错误**：`unauthorized_client`
**解决方案**：确保您在Google Cloud Console中正确配置了OAuth客户端ID，并且在Supabase中使用了正确的客户端ID和密钥。

### 问题3：用户资料未创建
**问题**：Google登录成功但用户资料未在数据库中创建
**解决方案**：检查 `auth.js` 中的 `handleOAuthUser` 方法是否正确实现，并确保数据库表结构正确。

## 安全注意事项

1. 妥善保管您的客户端密钥，不要在客户端代码中暴露
2. 定期轮换您的OAuth凭据
3. 限制测试用户数量，仅在开发阶段使用
4. 监控异常登录活动

## 完成后的效果

配置完成后，用户将能够：
1. 使用Google账号一键登录
2. 自动创建用户资料，无需手动注册
3. 享受与普通注册用户相同的功能和权限

这将显著提升用户体验，减少注册阻力，特别是对于移动设备用户。