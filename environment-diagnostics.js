// 环境诊断工具
// 创建时间：2025-08-10
// 用于检查和诊断环境配置问题

class EnvironmentDiagnostics {
    constructor() {
        this.diagnostics = {
            environment: {},
            supabase: {},
            network: {},
            database: {}
        };
    }

    // 运行完整诊断
    async runFullDiagnostics() {
        console.log('🔍 开始环境诊断...');
        
        // 1. 检查环境信息
        this.checkEnvironment();
        
        // 2. 检查 Supabase 配置
        this.checkSupabaseConfig();
        
        // 3. 检查网络连接
        await this.checkNetworkConnectivity();
        
        // 4. 检查数据库连接
        await this.checkDatabaseConnection();
        
        // 5. 生成诊断报告
        this.generateReport();
        
        return this.diagnostics;
    }

    // 检查环境信息
    checkEnvironment() {
        console.log('🌍 检查环境信息...');
        
        this.diagnostics.environment = {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language,
            cookieEnabled: navigator.cookieEnabled,
            onLine: navigator.onLine,
            hostname: window.location.hostname,
            protocol: window.location.protocol,
            origin: window.location.origin,
            isLocalhost: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1',
            isNetlify: window.location.hostname.includes('netlify.app') || window.location.hostname.includes('netlify.com'),
            isPreview: window.location.hostname.includes('deploy-preview'),
            timestamp: new Date().toISOString()
        };
        
        console.log('环境信息:', this.diagnostics.environment);
    }

    // 检查 Supabase 配置
    checkSupabaseConfig() {
        console.log('⚙️ 检查 Supabase 配置...');
        
        const hasSupabase = typeof window.supabase !== 'undefined';
        const hasSupabaseConfig = typeof window.supabaseConfig !== 'undefined';
        const hasDatabaseConfig = typeof window.databaseStepConfig !== 'undefined';
        
        this.diagnostics.supabase = {
            clientExists: hasSupabase,
            configExists: hasSupabaseConfig,
            databaseConfigExists: hasDatabaseConfig,
            clientType: hasSupabase ? typeof window.supabase : 'undefined',
            configKeys: hasSupabaseConfig ? Object.keys(window.supabaseConfig) : [],
            databaseConfigType: hasDatabaseConfig ? typeof window.databaseStepConfig : 'undefined'
        };
        
        if (hasSupabase) {
            this.diagnostics.supabase.clientMethods = Object.getOwnPropertyNames(Object.getPrototypeOf(window.supabase));
        }
        
        console.log('Supabase 配置:', this.diagnostics.supabase);
    }

    // 检查网络连接
    async checkNetworkConnectivity() {
        console.log('🌐 检查网络连接...');
        
        try {
            // 检查基本的网络连接
            const networkTest = await fetch('https://www.google.com', { 
                method: 'HEAD', 
                mode: 'no-cors',
                timeout: 5000 
            });
            this.diagnostics.network.basicConnectivity = true;
        } catch (error) {
            this.diagnostics.network.basicConnectivity = false;
            this.diagnostics.network.basicConnectivityError = error.message;
        }
        
        // 检查 Supabase 连接
        if (window.supabase) {
            try {
                const supabaseUrl = window.supabase.supabaseUrl || 'https://mkegxptdoteekylespbp.supabase.co';
                const response = await fetch(`${supabaseUrl}/rest/v1/`, {
                    method: 'GET',
                    headers: {
                        'apikey': window.supabase.supabaseKey || 'test'
                    }
                });
                this.diagnostics.network.supabaseReachable = response.ok;
                this.diagnostics.network.supabaseStatus = response.status;
            } catch (error) {
                this.diagnostics.network.supabaseReachable = false;
                this.diagnostics.network.supabaseError = error.message;
            }
        }
        
        console.log('网络连接:', this.diagnostics.network);
    }

    // 检查数据库连接
    async checkDatabaseConnection() {
        console.log('🗄️ 检查数据库连接...');
        
        if (!window.supabase || !window.databaseStepConfig) {
            this.diagnostics.database.connected = false;
            this.diagnostics.database.error = 'Supabase 客户端或数据库配置未初始化';
            return;
        }
        
        try {
            // 测试基本连接
            const { data, error } = await window.supabase
                .from('step_types')
                .select('count')
                .single();
            
            if (error) {
                throw error;
            }
            
            this.diagnostics.database.connected = true;
            this.diagnostics.database.basicTest = 'passed';
            
            // 测试获取步伐类型
            try {
                const stepTypes = await window.databaseStepConfig.getStepTypes();
                this.diagnostics.database.stepTypesCount = stepTypes.length;
                this.diagnostics.database.stepTypesLoaded = true;
            } catch (error) {
                this.diagnostics.database.stepTypesLoaded = false;
                this.diagnostics.database.stepTypesError = error.message;
            }
            
            // 测试获取步伐组合
            try {
                const combinations = await window.databaseStepConfig.getAllStepCombinations();
                const totalCombinations = Object.values(combinations).reduce((sum, type) => sum + type.combinations.length, 0);
                this.diagnostics.database.combinationsCount = totalCombinations;
                this.diagnostics.database.combinationsLoaded = true;
            } catch (error) {
                this.diagnostics.database.combinationsLoaded = false;
                this.diagnostics.database.combinationsError = error.message;
            }
            
        } catch (error) {
            this.diagnostics.database.connected = false;
            this.diagnostics.database.error = error.message;
        }
        
        console.log('数据库连接:', this.diagnostics.database);
    }

    // 生成诊断报告
    generateReport() {
        console.log('📋 生成诊断报告...');
        
        const report = {
            summary: this.generateSummary(),
            details: this.diagnostics,
            recommendations: this.generateRecommendations(),
            timestamp: new Date().toISOString()
        };
        
        this.diagnostics.report = report;
        
        // 在控制台显示报告
        console.log('📊 诊断报告:', report);
        
        return report;
    }

    // 生成摘要
    generateSummary() {
        const { environment, supabase, network, database } = this.diagnostics;
        
        const issues = [];
        const warnings = [];
        
        // 检查问题
        if (!supabase.clientExists) issues.push('Supabase 客户端未初始化');
        if (!supabase.databaseConfigExists) issues.push('数据库配置未初始化');
        if (!database.connected) issues.push('数据库连接失败');
        if (!network.basicConnectivity) issues.push('基本网络连接失败');
        if (!network.supabaseReachable) warnings.push('Supabase 服务器可能不可达');
        
        // 检查环境特定问题
        if (environment.isNetlify && environment.isPreview) {
            warnings.push('当前为 Netlify 预览环境，可能存在环境变量访问限制');
        }
        
        return {
            status: issues.length === 0 ? 'healthy' : 'issues_found',
            issues,
            warnings,
            environment: environment.isNetlify ? 'netlify' : (environment.isLocalhost ? 'localhost' : 'other'),
            deploymentType: environment.isPreview ? 'preview' : 'production'
        };
    }

    // 生成建议
    generateRecommendations() {
        const recommendations = [];
        const { environment, supabase, network, database } = this.diagnostics;
        
        if (environment.isNetlify && environment.isPreview) {
            recommendations.push({
                type: 'environment',
                priority: 'high',
                title: 'Netlify 预览环境配置',
                description: '预览环境可能无法访问环境变量，建议检查 Netlify 配置',
                action: '在 Netlify Dashboard 中确保环境变量在预览环境中可用'
            });
        }
        
        if (!supabase.clientExists) {
            recommendations.push({
                type: 'configuration',
                priority: 'high',
                title: 'Supabase 客户端初始化失败',
                description: 'Supabase 客户端未正确初始化',
                action: '检查 supabase-config.js 文件和脚本加载顺序'
            });
        }
        
        if (!database.connected) {
            recommendations.push({
                type: 'database',
                priority: 'high',
                title: '数据库连接问题',
                description: '无法连接到 Supabase 数据库',
                action: '检查数据库连接字符串、网络连接和 Supabase 服务状态'
            });
        }
        
        if (!network.supabaseReachable) {
            recommendations.push({
                type: 'network',
                priority: 'medium',
                title: 'Supabase 服务不可达',
                description: '无法访问 Supabase 服务器',
                action: '检查网络连接和 Supabase 服务状态'
            });
        }
        
        return recommendations;
    }

    // 在页面上显示诊断结果
    displayResults() {
        const report = this.diagnostics.report;
        
        // 创建诊断结果显示元素
        const diagnosticDiv = document.createElement('div');
        diagnosticDiv.id = 'diagnostic-results';
        diagnosticDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            width: 400px;
            max-height: 80vh;
            overflow-y: auto;
            background: white;
            border: 1px solid #ccc;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            z-index: 10000;
            font-family: monospace;
            font-size: 12px;
        `;
        
        const statusColor = report.summary.status === 'healthy' ? 'green' : 'red';
        const statusText = report.summary.status === 'healthy' ? '✅ 健康' : '❌ 有问题';
        
        diagnosticDiv.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <h3 style="margin: 0; color: ${statusColor};">${statusText}</h3>
                <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; font-size: 18px; cursor: pointer;">×</button>
            </div>
            
            <div style="margin-bottom: 10px;">
                <strong>环境:</strong> ${report.summary.environment} (${report.summary.deploymentType})
            </div>
            
            ${report.summary.issues.length > 0 ? `
                <div style="margin-bottom: 10px;">
                    <strong>问题:</strong>
                    <ul style="margin: 5px 0; padding-left: 20px;">
                        ${report.summary.issues.map(issue => `<li style="color: red;">${issue}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}
            
            ${report.summary.warnings.length > 0 ? `
                <div style="margin-bottom: 10px;">
                    <strong>警告:</strong>
                    <ul style="margin: 5px 0; padding-left: 20px;">
                        ${report.summary.warnings.map(warning => `<li style="color: orange;">${warning}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}
            
            <div style="margin-top: 15px;">
                <strong>详细信息:</strong>
                <pre style="background: #f5f5f5; padding: 10px; border-radius: 4px; overflow-x: auto; font-size: 10px;">
${JSON.stringify(report.details, null, 2)}
                </pre>
            </div>
        `;
        
        document.body.appendChild(diagnosticDiv);
    }
}

// 创建全局实例
const environmentDiagnostics = new EnvironmentDiagnostics();

// 导出给其他模块使用
window.environmentDiagnostics = environmentDiagnostics;

// 提供便捷的诊断函数
window.runDiagnostics = async function() {
    console.log('🚀 开始运行环境诊断...');
    await environmentDiagnostics.runFullDiagnostics();
    environmentDiagnostics.displayResults();
    return environmentDiagnostics.diagnostics;
};

// 自动运行诊断（可选）
if (typeof window !== 'undefined') {
    // 延迟 3 秒后自动运行诊断
    setTimeout(async () => {
        console.log('⏰ 自动运行环境诊断...');
        await environmentDiagnostics.runFullDiagnostics();
        
        // 如果有问题，显示诊断结果
        if (environmentDiagnostics.diagnostics.report.summary.issues.length > 0) {
            environmentDiagnostics.displayResults();
        }
    }, 3000);
}