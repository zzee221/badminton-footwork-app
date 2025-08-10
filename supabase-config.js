// Supabase配置
const SUPABASE_URL = 'https://mkegxptdoteekylespbp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1rZWd4cHRkb3RlZWt5bGVzcGJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2MTU4NzUsImV4cCI6MjA3MDE5MTg3NX0.EPOail2fXILEEvXRr9I8v_wBZQ5vj61OnOuVG8y_-G4';

// 初始化Supabase客户端
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 导出配置
window.supabaseConfig = {
    client: supabase,
    url: SUPABASE_URL,
    anonKey: SUPABASE_ANON_KEY
};

// 也将客户端暴露到全局作用域，供其他文件使用
window.supabase = supabase;