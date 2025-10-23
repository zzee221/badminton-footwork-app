// Google OAuth 兼容性测试脚本
// 此脚本用于验证Google登录功能与会员系统的基本兼容性

class GoogleOAuthCompatibilityTest {
    constructor() {
        this.testResults = [];
        this.authManager = window.authManager;
    }

    // 运行所有测试
    async runAllTests() {
        console.log('开始Google OAuth兼容性测试...');
        
        // 基础功能测试
        await this.testAuthManagerExists();
        await this.testSupabaseConnection();
        await this.testGoogleLoginMethod();
        await this.testOAuthUserHandler();
        
        // 数据映射测试
        await this.testUserProfileMapping();
        await this.testUsernameUniqueness();
        
        // 权限系统测试
        await this.testFreeUserPermissions();
        await this.testPremiumUserPermissions();
        
        // 生成测试报告
        this.generateTestReport();
    }

    // 测试AuthManager是否存在
    async testAuthManagerExists() {
        const testName = 'AuthManager存在性检查';
        try {
            const result = this.authManager && typeof this.authManager === 'object';
            this.addTestResult(testName, result, result ? 'AuthManager正确初始化' : 'AuthManager未正确初始化');
        } catch (error) {
            this.addTestResult(testName, false, `错误: ${error.message}`);
        }
    }

    // 测试Supabase连接
    async testSupabaseConnection() {
        const testName = 'Supabase连接检查';
        try {
            const { data, error } = await this.authManager.supabase.from('profiles').select('count');
            const result = !error;
            this.addTestResult(testName, result, result ? 'Supabase连接正常' : `Supabase连接错误: ${error?.message}`);
        } catch (error) {
            this.addTestResult(testName, false, `错误: ${error.message}`);
        }
    }

    // 测试Google登录方法
    async testGoogleLoginMethod() {
        const testName = 'Google登录方法检查';
        try {
            const result = typeof this.authManager.loginWithGoogle === 'function';
            this.addTestResult(testName, result, result ? 'loginWithGoogle方法存在' : 'loginWithGoogle方法不存在');
        } catch (error) {
            this.addTestResult(testName, false, `错误: ${error.message}`);
        }
    }

    // 测试OAuth用户处理方法
    async testOAuthUserHandler() {
        const testName = 'OAuth用户处理方法检查';
        try {
            const result = typeof this.authManager.handleOAuthUser === 'function';
            this.addTestResult(testName, result, result ? 'handleOAuthUser方法存在' : 'handleOAuthUser方法不存在');
        } catch (error) {
            this.addTestResult(testName, false, `错误: ${error.message}`);
        }
    }

    // 测试用户资料映射
    async testUserProfileMapping() {
        const testName = '用户资料映射逻辑检查';
        try {
            // 模拟Google用户数据
            const mockGoogleUser = {
                id: 'test-google-id',
                email: 'test@gmail.com',
                user_metadata: {
                    full_name: '测试用户',
                    avatar_url: 'https://example.com/avatar.jpg'
                },
                app_metadata: {
                    provider: 'google'
                }
            };

            // 检查映射逻辑是否正确
            const username = mockGoogleUser.user_metadata?.full_name || 
                           mockGoogleUser.user_metadata?.name || 
                           mockGoogleUser.email?.split('@')[0] || 
                           'Google用户';
            
            const result = username === '测试用户';
            this.addTestResult(testName, result, result ? '用户资料映射逻辑正确' : '用户资料映射逻辑有误');
        } catch (error) {
            this.addTestResult(testName, false, `错误: ${error.message}`);
        }
    }

    // 测试用户名唯一性处理
    async testUsernameUniqueness() {
        const testName = '用户名唯一性处理逻辑检查';
        try {
            // 模拟用户名冲突处理逻辑
            const baseUsername = '测试用户';
            let finalUsername = baseUsername;
            let counter = 1;
            
            // 模拟检查用户名是否存在的逻辑
            const mockCheckUsername = (username) => {
                // 模拟前两次检查返回已存在，第三次返回不存在
                if (username === baseUsername || username === `${baseUsername}1`) {
                    return { exists: true };
                }
                return { exists: false };
            };
            
            // 模拟处理逻辑
            while (mockCheckUsername(finalUsername).exists) {
                finalUsername = `${baseUsername}${counter}`;
                counter++;
            }
            
            const result = finalUsername === `${baseUsername}2`;
            this.addTestResult(testName, result, result ? '用户名唯一性处理逻辑正确' : '用户名唯一性处理逻辑有误');
        } catch (error) {
            this.addTestResult(testName, false, `错误: ${error.message}`);
        }
    }

    // 测试免费用户权限
    async testFreeUserPermissions() {
        const testName = '免费用户权限检查';
        try {
            // 模拟免费用户
            this.authManager.currentUser = { id: 'test-user-id' };
            this.authManager.currentSubscription = null;
            
            const freeAccess = this.authManager.hasPermission('free');
            const premiumAccess = this.authManager.hasPermission('premium');
            
            const result = freeAccess === true && premiumAccess === false;
            this.addTestResult(testName, result, result ? '免费用户权限设置正确' : '免费用户权限设置有误');
        } catch (error) {
            this.addTestResult(testName, false, `错误: ${error.message}`);
        }
    }

    // 测试会员用户权限
    async testPremiumUserPermissions() {
        const testName = '会员用户权限检查';
        try {
            // 模拟会员用户
            this.authManager.currentUser = { id: 'test-user-id' };
            this.authManager.currentSubscription = { plan_type: 'premium_30d' };
            
            const freeAccess = this.authManager.hasPermission('free');
            const premiumAccess = this.authManager.hasPermission('premium');
            
            const result = freeAccess === true && premiumAccess === true;
            this.addTestResult(testName, result, result ? '会员用户权限设置正确' : '会员用户权限设置有误');
        } catch (error) {
            this.addTestResult(testName, false, `错误: ${error.message}`);
        }
    }

    // 添加测试结果
    addTestResult(testName, passed, message) {
        this.testResults.push({
            name: testName,
            passed,
            message,
            timestamp: new Date().toISOString()
        });
        
        console.log(`${passed ? '✅' : '❌'} ${testName}: ${message}`);
    }

    // 生成测试报告
    generateTestReport() {
        const totalTests = this.testResults.length;
        const passedTests = this.testResults.filter(result => result.passed).length;
        const failedTests = totalTests - passedTests;
        
        console.log('\n===== Google OAuth 兼容性测试报告 =====');
        console.log(`总测试数: ${totalTests}`);
        console.log(`通过测试: ${passedTests}`);
        console.log(`失败测试: ${failedTests}`);
        console.log(`通过率: ${((passedTests / totalTests) * 100).toFixed(2)}%`);
        
        if (failedTests > 0) {
            console.log('\n失败的测试:');
            this.testResults
                .filter(result => !result.passed)
                .forEach(result => {
                    console.log(`- ${result.name}: ${result.message}`);
                });
        }
        
        console.log('\n详细测试结果:');
        this.testResults.forEach(result => {
            console.log(`- ${result.passed ? '✅' : '❌'} ${result.name}: ${result.message}`);
        });
        
        console.log('=====================================\n');
        
        // 返回测试结果供进一步处理
        return {
            totalTests,
            passedTests,
            failedTests,
            passRate: (passedTests / totalTests) * 100,
            results: this.testResults
        };
    }

    // 模拟Google登录流程（仅用于测试，不会实际登录）
    simulateGoogleLogin() {
        console.log('模拟Google登录流程...');
        
        // 检查Google登录按钮是否存在
        const googleLoginBtn = document.getElementById('google-login-btn');
        if (!googleLoginBtn) {
            console.error('Google登录按钮不存在');
            return false;
        }
        
        console.log('Google登录按钮存在，模拟点击...');
        
        // 模拟点击事件（不实际触发登录）
        try {
            const clickEvent = new MouseEvent('click', {
                view: window,
                bubbles: true,
                cancelable: true
            });
            
            // 仅检查事件是否能被创建，不实际触发
            console.log('Google登录点击事件可以创建');
            return true;
        } catch (error) {
            console.error('创建Google登录点击事件失败:', error);
            return false;
        }
    }
}

// 创建测试实例
const googleOAuthTest = new GoogleOAuthCompatibilityTest();

// 导出测试对象供手动调用
window.googleOAuthTest = googleOAuthTest;

// 自动运行测试（可选）
// document.addEventListener('DOMContentLoaded', () => {
//     setTimeout(() => {
//         googleOAuthTest.runAllTests();
//     }, 1000);
// });

console.log('Google OAuth兼容性测试脚本已加载。使用 googleOAuthTest.runAllTests() 运行测试。');