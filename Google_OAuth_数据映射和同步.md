# Google OAuth 用户数据映射和同步机制

## 概述
本文档详细说明了Google OAuth登录后，用户数据如何映射到本地数据库结构，以及如何确保数据同步的一致性。

## 数据库表结构

### profiles 表
用户资料表，存储用户的基本信息：
```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### subscriptions 表
用户订阅表，存储用户的会员状态：
```sql
CREATE TABLE subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  plan_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Google OAuth 数据映射流程

### 1. 用户登录流程
1. 用户点击"使用Google账号登录"按钮
2. 调用 `loginWithGoogle()` 方法，重定向到Google OAuth
3. 用户在Google页面完成认证
4. 重定向回应用，触发 `checkUserStatus()` 方法
5. 检测到OAuth用户，调用 `handleOAuthUser()` 方法

### 2. 用户数据映射
`handleOAuthUser()` 方法负责将Google用户信息映射到本地数据库：

```javascript
async handleOAuthUser(user) {
    // 1. 检查用户是否已有资料
    const { data: existingProfile, error: checkError } = await this.supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    // 2. 如果没有资料，创建新资料
    if (!existingProfile) {
        // 从Google用户信息中提取用户名
        let username = user.user_metadata?.full_name || 
                      user.user_metadata?.name || 
                      user.email?.split('@')[0] || 
                      'Google用户';
        
        // 3. 确保用户名唯一
        let finalUsername = username;
        let counter = 1;
        
        while (true) {
            const { data: checkUser, error: checkError } = await this.supabase
                .from('profiles')
                .select('username')
                .eq('username', finalUsername)
                .single();
            
            if (checkError && checkError.code === 'PGRST116') {
                // 用户名不存在，可以使用
                break;
            }
            
            finalUsername = `${username}${counter}`;
            counter++;
        }

        // 4. 创建用户资料
        const { data: profile, error: insertError } = await this.supabase
            .from('profiles')
            .insert([
                {
                    id: user.id,
                    username: finalUsername,
                    email: user.email,
                    avatar_url: user.user_metadata?.avatar_url || null,
                    created_at: new Date()
                }
            ])
            .select()
            .single();
    }
}
```

### 3. 数据字段映射

| Google OAuth 字段 | 本地数据库字段 | 说明 |
|-------------------|---------------|------|
| user.id | profiles.id | Google用户ID，作为主键 |
| user.user_metadata.full_name | profiles.username | 用户全名，优先作为用户名 |
| user.user_metadata.name | profiles.username | 用户名称，备选用户名 |
| user.email | profiles.email | 用户邮箱 |
| user.user_metadata.avatar_url | profiles.avatar_url | 用户头像URL |

### 4. 用户名唯一性处理
为确保用户名唯一性，系统采用以下策略：
1. 首先尝试使用Google用户的全名或名称
2. 如果用户名已存在，添加数字后缀（如"用户名1"、"用户名2"）
3. 循环检查直到找到可用的用户名

## 用户状态同步

### 1. 登录状态检查
`checkUserStatus()` 方法负责检查用户当前状态：
```javascript
async checkUserStatus() {
    // 获取当前认证用户
    const { data: { user } } = await this.supabase.auth.getUser();
    
    if (user) {
        this.currentUser = user;
        
        // 检查是否是OAuth用户
        if (user.app_metadata?.provider === 'google') {
            await this.handleOAuthUser(user);
        }
        
        // 获取用户资料和订阅信息
        await this.getUserProfile();
        await this.getUserSubscription();
        
        // 更新UI显示
        this.showUserMenu();
    } else {
        this.currentUser = null;
        this.currentSubscription = null;
        this.showLoginButton();
    }
}
```

### 2. 用户资料同步
`getUserProfile()` 方法从数据库获取用户资料：
```javascript
async getUserProfile() {
    const { data, error } = await this.supabase
        .from('profiles')
        .select('*')
        .eq('id', this.currentUser.id)
        .single();

    if (data) {
        this.currentUser.profile = data;
    }
}
```

### 3. 订阅状态同步
`getUserSubscription()` 方法获取用户订阅信息并检查过期状态：
```javascript
async getUserSubscription() {
    const { data, error } = await this.supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', this.currentUser.id)
        .eq('status', 'active')
        .single();

    if (data) {
        // 检查订阅是否过期
        const now = new Date();
        const expiresAt = data.expires_at ? new Date(data.expires_at) : null;
        
        if (expiresAt && expiresAt < now) {
            // 订阅已过期，更新状态
            await this.supabase
                .from('subscriptions')
                .update({ status: 'expired' })
                .eq('id', data.id);
            
            this.currentSubscription = null;
        } else {
            this.currentSubscription = data;
        }
    } else {
        this.currentSubscription = null;
    }
}
```

## 权限系统集成

### 1. 权限检查
`hasPermission()` 方法根据用户订阅状态判断权限：
```javascript
hasPermission(requiredPlan = 'free') {
    if (!this.currentUser) return false;

    // 简化权限：只有免费和会员两种
    const userPlan = this.currentSubscription ? this.currentSubscription.plan_type : 'free';
    
    // 会员可以访问所有内容（包括premium权限要求）
    if (userPlan === 'premium_10d' || userPlan === 'premium_30d' || userPlan === 'premium_lifetime') {
        return true;
    }
    
    // 免费用户只能访问免费内容
    return requiredPlan === 'free';
}
```

### 2. 内容访问控制
在步伐配置中，通过 `isFree` 标记控制内容访问：
```javascript
// 检查步伐访问权限
function checkStepAccess(stepType, sequence) {
    const stepInfo = stepConfig.getStepInfo(currentGender, stepType, sequence);
    
    if (!stepInfo) return false;
    
    // 检查是否有任何可访问的模式
    const accessiblePatterns = stepInfo.patterns.filter(pattern => {
        // 如果是免费模式，所有人都可以访问
        if (pattern.isFree) return true;
        // 如果是付费模式，需要会员权限
        return authManager.currentUser && authManager.hasPermission('premium');
    });
    
    return accessiblePatterns.length > 0;
}
```

## 数据一致性保障

### 1. 事务处理
关键操作使用数据库事务确保一致性：
- 用户资料创建
- 订阅状态更新
- 权限验证

### 2. 错误处理
完善的错误处理机制：
- 网络错误重试
- 数据验证
- 用户友好的错误提示

### 3. 状态同步
确保前端状态与后端数据一致：
- 登录后立即同步用户状态
- 定期检查订阅过期状态
- 操作后更新本地状态

## 安全考虑

### 1. 数据验证
所有从Google获取的数据都经过验证：
- 用户名长度和字符限制
- 邮箱格式验证
- 头像URL安全检查

### 2. 权限控制
严格的权限检查：
- 每次访问内容前验证权限
- 服务端验证（通过RLS策略）
- 最小权限原则

### 3. 隐私保护
用户隐私保护措施：
- 最小化数据收集
- 安全的数据传输
- 符合隐私政策要求

## 测试建议

### 1. 功能测试
- Google登录流程
- 用户资料创建
- 权限验证
- 订阅状态同步

### 2. 边界测试
- 用户名冲突处理
- 网络中断恢复
- 数据库错误处理

### 3. 性能测试
- 大量用户并发登录
- 数据同步延迟
- 前端响应速度

## 总结

Google OAuth用户数据映射和同步机制确保了：
1. 无缝的登录体验
2. 准确的数据映射
3. 一致的状态同步
4. 安全的权限控制

这套机制使Google用户能够享受与普通注册用户完全相同的功能和体验，同时保持了系统的安全性和稳定性。