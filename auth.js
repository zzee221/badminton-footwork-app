// 用户认证模块
class AuthManager {
    constructor() {
        this.supabase = window.supabaseConfig.client;
        this.currentUser = null;
        this.currentSubscription = null;
        this.init();
    }

    async init() {
        await this.checkUserStatus();
        this.bindEvents();
    }

    // 检查用户登录状态
    async checkUserStatus() {
        const { data: { user } } = await this.supabase.auth.getUser();
        
        if (user) {
            this.currentUser = user;
            await this.getUserProfile();
            await this.getUserSubscription();
            this.showUserMenu();
        } else {
            this.showLoginButton();
        }
    }

    // 获取用户资料
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

    // 获取用户订阅信息
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
        
        console.log('当前订阅状态:', this.currentSubscription);
    }

  
    // 显示用户菜单
    showUserMenu() {
        const loginBtn = document.getElementById('login-btn');
        const userMenu = document.getElementById('user-menu');
        const userName = document.getElementById('user-name');
        const userPlan = document.getElementById('user-plan');
        const userAvatar = document.getElementById('user-avatar');

        loginBtn.classList.add('hidden');
        userMenu.classList.remove('hidden');

        if (this.currentUser.profile) {
            userName.textContent = this.currentUser.profile.username || this.currentUser.email;
            userAvatar.textContent = this.currentUser.profile.username ? 
                this.currentUser.profile.username.charAt(0).toUpperCase() : 
                this.currentUser.email.charAt(0).toUpperCase();
        }

        if (this.currentSubscription) {
            const planNames = {
                'free': '免费用户',
                'premium_30d': '30天会员',
                'premium_lifetime': '永久会员'
            };
            userPlan.textContent = planNames[this.currentSubscription.plan_type] || '会员';
        } else {
            userPlan.textContent = '免费用户';
        }
    }

    // 显示登录按钮
    showLoginButton() {
        const loginBtn = document.getElementById('login-btn');
        const userMenu = document.getElementById('user-menu');

        loginBtn.classList.remove('hidden');
        userMenu.classList.add('hidden');
    }

    // 绑定事件
    bindEvents() {
        // 登录按钮
        document.getElementById('login-btn').addEventListener('click', () => {
            this.showAuthModal();
        });

        // 登出按钮
        document.getElementById('logout-btn').addEventListener('click', () => {
            this.logout();
        });

        // 升级按钮
        const upgradeBtn = document.getElementById('upgrade-btn-menu');
        if (upgradeBtn) {
            upgradeBtn.addEventListener('click', () => {
                this.showUpgradeModal();
            });
        }

        // 用户头像按钮（打开个人页面）
        const avatarBtn = document.getElementById('user-avatar-btn');
        if (avatarBtn) {
            avatarBtn.addEventListener('click', () => {
                this.showProfileModal();
            });
        }

        // 认证模态框事件
        this.bindAuthModalEvents();

        // 升级模态框事件
        this.bindUpgradeModalEvents();

        // 个人页面模态框事件
        this.bindProfileModalEvents();
    }

    // 绑定认证模态框事件
    bindAuthModalEvents() {
        const authModal = document.getElementById('auth-modal');
        const closeAuthModal = document.getElementById('close-auth-modal');
        const loginTab = document.getElementById('login-tab');
        const registerTab = document.getElementById('register-tab');
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');
        const loginSubmit = document.getElementById('login-submit');
        const registerSubmit = document.getElementById('register-submit');

        // 关闭模态框
        closeAuthModal.addEventListener('click', () => {
            authModal.classList.add('hidden');
        });

        // 点击外部关闭
        authModal.addEventListener('click', (e) => {
            if (e.target === authModal) {
                authModal.classList.add('hidden');
            }
        });

        // 切换登录/注册
        loginTab.addEventListener('click', () => {
            loginTab.classList.add('text-blue-600', 'border-b-2', 'border-blue-600');
            loginTab.classList.remove('text-gray-500');
            registerTab.classList.remove('text-blue-600', 'border-b-2', 'border-blue-600');
            registerTab.classList.add('text-gray-500');
            loginForm.classList.remove('hidden');
            registerForm.classList.add('hidden');
        });

        registerTab.addEventListener('click', () => {
            registerTab.classList.add('text-blue-600', 'border-b-2', 'border-blue-600');
            registerTab.classList.remove('text-gray-500');
            loginTab.classList.remove('text-blue-600', 'border-b-2', 'border-blue-600');
            loginTab.classList.add('text-gray-500');
            registerForm.classList.remove('hidden');
            loginForm.classList.add('hidden');
        });

        // 登录提交
        loginSubmit.addEventListener('click', () => {
            this.login();
        });

        // 注册提交
        registerSubmit.addEventListener('click', () => {
            this.register();
        });

        // 回车提交
        document.getElementById('login-password').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.login();
        });

        document.getElementById('register-password').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.register();
        });
    }

    // 绑定升级模态框事件
    bindUpgradeModalEvents() {
        const upgradeModal = document.getElementById('upgrade-modal');
        const closeUpgradeModal = document.getElementById('close-upgrade-modal');
        const activateSubmit = document.getElementById('activate-submit');

        // 关闭模态框
        closeUpgradeModal.addEventListener('click', () => {
            upgradeModal.classList.add('hidden');
        });

        // 点击外部关闭
        upgradeModal.addEventListener('click', (e) => {
            if (e.target === upgradeModal) {
                upgradeModal.classList.add('hidden');
            }
        });

        // 激活会员
        activateSubmit.addEventListener('click', () => {
            this.activateMembership();
        });

        // 回车提交
        document.getElementById('activation-code').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.activateMembership();
        });
    }

    // 绑定个人页面模态框事件
    bindProfileModalEvents() {
        const profileModal = document.getElementById('profile-modal');
        const closeProfileModal = document.getElementById('close-profile-modal');
        const profileUpgradeBtn = document.getElementById('profile-upgrade-btn');

        // 关闭模态框
        closeProfileModal.addEventListener('click', () => {
            profileModal.classList.add('hidden');
        });

        // 点击外部关闭
        profileModal.addEventListener('click', (e) => {
            if (e.target === profileModal) {
                profileModal.classList.add('hidden');
            }
        });

        // 升级按钮
        if (profileUpgradeBtn) {
            profileUpgradeBtn.addEventListener('click', () => {
                profileModal.classList.add('hidden');
                this.showUpgradeModal();
            });
        }
    }

    // 显示认证模态框
    showAuthModal() {
        const authModal = document.getElementById('auth-modal');
        authModal.classList.remove('hidden');
        this.clearAuthMessage();
    }

    // 显示升级模态框
    showUpgradeModal() {
        const upgradeModal = document.getElementById('upgrade-modal');
        upgradeModal.classList.remove('hidden');
        this.clearUpgradeMessage();
    }

    // 显示个人页面模态框
    showProfileModal() {
        const profileModal = document.getElementById('profile-modal');
        profileModal.classList.remove('hidden');
        this.updateProfileModal();
    }

    // 更新个人页面信息
    async updateProfileModal() {
        const profileAvatar = document.getElementById('profile-avatar');
        const profileUsername = document.getElementById('profile-username');
        const profilePlan = document.getElementById('profile-plan');
        const membershipBadge = document.getElementById('membership-badge');
        const membershipExpiry = document.getElementById('membership-expiry');
        const expiryDate = document.getElementById('expiry-date');
        const profileUpgradeBtn = document.getElementById('profile-upgrade-btn');

        // 设置用户信息
        if (this.currentUser.profile) {
            profileUsername.textContent = this.currentUser.profile.username || '用户';
            profileAvatar.textContent = this.currentUser.profile.username ? 
                this.currentUser.profile.username.charAt(0).toUpperCase() : 
                'U';
        }

        // 设置会员信息
        if (this.currentSubscription) {
            const planNames = {
                'free': '免费用户',
                'premium_30d': '30天会员',
                'premium_lifetime': '永久会员'
            };
            
            profilePlan.textContent = planNames[this.currentSubscription.plan_type] || '会员';
            membershipBadge.textContent = planNames[this.currentSubscription.plan_type] || '会员';
            
            // 设置会员徽章样式
            if (this.currentSubscription.plan_type === 'premium_30d' || this.currentSubscription.plan_type === 'premium_lifetime') {
                membershipBadge.className = 'px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-600';
                profileUpgradeBtn.style.display = 'none'; // 会员用户隐藏升级按钮
            } else {
                membershipBadge.className = 'px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600';
                profileUpgradeBtn.style.display = 'block';
            }

            // 显示到期时间
            if (this.currentSubscription.expires_at) {
                const expiryDateObj = new Date(this.currentSubscription.expires_at);
                expiryDate.textContent = expiryDateObj.toLocaleDateString('zh-CN');
                membershipExpiry.classList.remove('hidden');
            }
        } else {
            profilePlan.textContent = '免费用户';
            membershipBadge.textContent = '免费用户';
            membershipBadge.className = 'px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600';
            membershipExpiry.classList.add('hidden');
            profileUpgradeBtn.style.display = 'block';
        }
    }

    // 显示消息
    showMessage(elementId, message, type = 'info') {
        const messageEl = document.getElementById(elementId);
        messageEl.textContent = message;
        messageEl.className = `mt-4 p-3 rounded-md ${this.getMessageClass(type)}`;
        messageEl.classList.remove('hidden');
    }

    // 获取消息样式类
    getMessageClass(type) {
        const classes = {
            'success': 'bg-green-100 text-green-700 border border-green-200',
            'error': 'bg-red-100 text-red-700 border border-red-200',
            'info': 'bg-blue-100 text-blue-700 border border-blue-200',
            'warning': 'bg-yellow-100 text-yellow-700 border border-yellow-200'
        };
        return classes[type] || classes['info'];
    }

    // 清除消息
    clearAuthMessage() {
        const messageEl = document.getElementById('auth-message');
        messageEl.classList.add('hidden');
    }

    clearUpgradeMessage() {
        const messageEl = document.getElementById('upgrade-message');
        messageEl.classList.add('hidden');
    }

    // 登录
    async login() {
        const username = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        if (!username || !password) {
            this.showMessage('auth-message', '请填写用户名和密码', 'error');
            return;
        }

        try {
            // 根据用户名生成邮箱格式
            const userEmail = `${username.toLowerCase()}@badminton-step.local`;
            console.log('使用生成的邮箱登录:', userEmail);
            
            // 直接使用生成的邮箱登录
            const { data, error } = await this.supabase.auth.signInWithPassword({
                email: userEmail,
                password
            });

            if (error) {
                this.showMessage('auth-message', error.message, 'error');
                return;
            }

            this.showMessage('auth-message', '登录成功！', 'success');
            setTimeout(() => {
                document.getElementById('auth-modal').classList.add('hidden');
                this.checkUserStatus();
            }, 1000);

        } catch (error) {
            this.showMessage('auth-message', '登录失败，请重试', 'error');
        }
    }

    // 注册
    async register() {
        const username = document.getElementById('register-username').value;
        const password = document.getElementById('register-password').value;

        if (!username || !password) {
            this.showMessage('auth-message', '请填写用户名和密码', 'error');
            return;
        }

        if (password.length < 6) {
            this.showMessage('auth-message', '密码至少需要6位', 'error');
            return;
        }

        try {
            // 检查用户名是否已存在
            const { data: existingUser, error: checkError } = await this.supabase
                .from('profiles')
                .select('username')
                .eq('username', username)
                .single();

            if (existingUser) {
                this.showMessage('auth-message', '用户名已存在', 'error');
                return;
            }

            // 生成虚拟邮箱（基于用户名，使用标准测试域名）
            const tempEmail = `${username.toLowerCase()}@badminton-step.local`;
            
            // 注册用户
            const { data, error } = await this.supabase.auth.signUp({
                email: tempEmail,
                password
            });

            if (error) {
                this.showMessage('auth-message', error.message, 'error');
                return;
            }

            // 用户资料由数据库触发器自动创建

            this.showMessage('auth-message', '注册成功！', 'success');
            setTimeout(() => {
                document.getElementById('auth-modal').classList.add('hidden');
                this.checkUserStatus();
            }, 1000);

        } catch (error) {
            this.showMessage('auth-message', '注册失败，请重试', 'error');
        }
    }

    // 登出
    async logout() {
        try {
            await this.supabase.auth.signOut();
            this.currentUser = null;
            this.currentSubscription = null;
            this.showLoginButton();
            this.showMessage('auth-message', '已成功登出', 'success');
        } catch (error) {
            console.error('登出失败:', error);
        }
    }

    // 激活会员
    async activateMembership() {
        const activationCode = document.getElementById('activation-code').value;

        if (!activationCode) {
            this.showMessage('upgrade-message', '请输入激活码', 'error');
            return;
        }

        if (!this.currentUser) {
            this.showMessage('upgrade-message', '请先登录', 'error');
            return;
        }

        try {
            // 验证激活码并立即锁定（防止并发使用）
            const { data: codeData, error: codeError } = await this.supabase
                .from('activation_codes')
                .select('*')
                .eq('code', activationCode)
                .eq('is_used', false)
                .single();

            if (codeError || !codeData) {
                this.showMessage('upgrade-message', '激活码无效或已使用', 'error');
                return;
            }

            // 检查激活码是否过期
            if (codeData.expires_at && new Date(codeData.expires_at) < new Date()) {
                this.showMessage('upgrade-message', '激活码已过期', 'error');
                return;
            }

            // 立即标记激活码为使用中，防止重复使用
            const { error: lockError } = await this.supabase
                .from('activation_codes')
                .update({
                    is_used: true,
                    used_by: this.currentUser.id,
                    used_at: new Date().toISOString()
                })
                .eq('id', codeData.id)
                .eq('is_used', false); // 确保还是未使用状态

            if (lockError) {
                this.showMessage('upgrade-message', '激活码已被其他用户使用', 'error');
                return;
            }

            // 计算过期时间（永久会员为null）
            let expiresAt = null;
            if (codeData.plan_type === 'premium_30d') {
                expiresAt = new Date();
                expiresAt.setDate(expiresAt.getDate() + codeData.duration_days);
            }

            // 创建订阅记录
            const { data: subscriptionData, error: subscriptionError } = await this.supabase
                .from('subscriptions')
                .insert([{
                    user_id: this.currentUser.id,
                    plan_type: codeData.plan_type,
                    status: 'active',
                    started_at: new Date().toISOString(),
                    expires_at: expiresAt ? expiresAt.toISOString() : null
                }]);

            if (subscriptionError) {
                this.showMessage('upgrade-message', '创建订阅失败', 'error');
                return;
            }

            // 手动插入激活历史记录（确保记录被保存）
            try {
                await this.supabase
                    .from('activation_history')
                    .insert([{
                        user_id: this.currentUser.id,
                        code_id: codeData.id,
                        activation_code: codeData.code,
                        plan_type: codeData.plan_type,
                        duration_days: codeData.duration_days,
                        activated_at: new Date().toISOString(),
                        expires_at: expiresAt ? expiresAt.toISOString() : null,
                        status: 'active'
                    }]);
            } catch (historyError) {
                console.error('插入激活历史失败:', historyError);
                // 不影响主流程，只记录日志
            }

            this.showMessage('upgrade-message', '会员激活成功！', 'success');
            setTimeout(() => {
                document.getElementById('upgrade-modal').classList.add('hidden');
                // 重新获取用户状态，包括新的订阅信息
                this.checkUserStatus();
            }, 2000);

        } catch (error) {
            this.showMessage('upgrade-message', '激活失败，请重试', 'error');
        }
    }

    // 检查用户权限
    hasPermission(requiredPlan = 'free') {
        if (!this.currentUser) return false;

        // 简化权限：只有免费和会员两种
        const userPlan = this.currentSubscription ? this.currentSubscription.plan_type : 'free';
        
        // 会员可以访问所有内容
        if (userPlan === 'premium_30d' || userPlan === 'premium_lifetime') {
            return true;
        }
        
        // 免费用户只能访问免费内容
        return requiredPlan === 'free';
    }

    // 获取用户信息
    getUserInfo() {
        return {
            user: this.currentUser,
            profile: this.currentUser?.profile,
            subscription: this.currentSubscription
        };
    }
}

// 初始化认证管理器
const authManager = new AuthManager();

// 导出给其他模块使用
window.authManager = authManager;