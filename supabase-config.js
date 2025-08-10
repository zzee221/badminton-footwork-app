// Supabase配置 - 支持环境变量和硬编码回退
const getSupabaseConfig = () => {
    // 优先使用环境变量（Netlify部署）
    if (typeof process !== 'undefined' && process.env) {
        const envUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
        const envKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        
        if (envUrl && envKey) {
            console.log('使用环境变量中的 Supabase 配置');
            return { url: envUrl, key: envKey };
        }
    }
    
    // 回退到硬编码配置
    console.log('使用硬编码的 Supabase 配置');
    return {
        url: 'https://mkegxptdoteekylespbp.supabase.co',
        key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1rZWd4cHRkb3RlZWt5bGVzcGJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2MTU4NzUsImV4cCI6MjA3MDE5MTg3NX0.EPOail2fXILEEvXRr9I8v_wBZQ5vj61OnOuVG8y_-G4'
    };
};

const config = getSupabaseConfig();
console.log('Supabase 配置加载完成，URL:', config.url);

// 初始化Supabase客户端
const supabase = supabase.createClient(config.url, config.key);

// 导出配置
window.supabaseConfig = {
    client: supabase,
    url: SUPABASE_URL,
    anonKey: SUPABASE_ANON_KEY
};

// 也将客户端暴露到全局作用域，供其他文件使用
window.supabase = supabase;