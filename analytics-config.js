// Google Analytics 4 配置文件
// 本文件用于管理Google Analytics 4的配置和自定义事件跟踪

// GA4 配置
const GA4_CONFIG = {
    // 请将此替换为你的实际GA4测量ID
    MEASUREMENT_ID: 'G-8H0631JCVD', // 格式: G-XXXXXXXXXX
    
    // 是否启用GA4跟踪
    ENABLED: true,
    
    // 是否启用调试模式（开发环境使用）
    DEBUG: false,
    
    // 自定义事件配置
    EVENTS: {
        // 用户行为事件
        STEP_VIEW: 'step_view',           // 查看步伐
        VIDEO_PLAY: 'video_play',        // 播放视频
        USER_LOGIN: 'user_login',        // 用户登录
        USER_REGISTER: 'user_register',   // 用户注册
        USER_UPGRADE: 'user_upgrade',    // 用户升级
        GENDER_SWITCH: 'gender_switch',  // 性别切换
        STEP_TYPE_SWITCH: 'step_type_switch' // 步伐类型切换
    },
    
    // 自定义参数配置
    PARAMETERS: {
        // 步伐相关参数
        STEP_SEQUENCE: 'step_sequence',    // 步伐序列 (如: "1-2")
        STEP_TYPE: 'step_type',           // 步伐类型 (如: "parallel", "forward-backward")
        GENDER: 'gender',                 // 性别 (如: "male", "female")
        VIDEO_INDEX: 'video_index',       // 视频索引
        TOTAL_VIDEOS: 'total_videos',     // 总视频数
        IS_FREE: 'is_free',               // 是否免费
        PATTERN_NAME: 'pattern_name',     // 步伐模式名称
        
        // 用户相关参数
        USER_TYPE: 'user_type',           // 用户类型 (如: "free", "premium")
        ACCESS_GRANTED: 'access_granted'  // 访问权限是否授予
    }
};

// GA4 初始化函数
function initGA4() {
    if (!GA4_CONFIG.ENABLED) {
        console.log('GA4 跟踪已禁用');
        return;
    }
    
    try {
        // 检查是否已经加载了gtag
        if (typeof gtag === 'undefined') {
            console.warn('Google Analytics gtag 未加载，请确保在HTML中正确添加GA4脚本');
            return;
        }
        
        // 初始化GA4
        gtag('js', new Date());
        gtag('config', GA4_CONFIG.MEASUREMENT_ID, {
            'debug_mode': GA4_CONFIG.DEBUG,
            'custom_map': {
                'dimension1': 'gender',
                'dimension2': 'step_type',
                'dimension3': 'user_type'
            }
        });
        
        // 设置用户属性
        setUserProperties();
        
        console.log('GA4 初始化成功');
    } catch (error) {
        console.error('GA4 初始化失败:', error);
    }
}

// 设置用户属性
function setUserProperties() {
    if (typeof gtag === 'undefined') return;
    
    // 从认证系统获取用户信息
    const userType = authManager?.currentUser ? 
        (authManager.hasPermission('premium') ? 'premium' : 'free') : 'guest';
    
    // 设置用户类型
    gtag('set', 'user_properties', {
        'user_type': userType
    });
}

// 发送自定义事件
function trackEvent(eventName, parameters = {}) {
    if (!GA4_CONFIG.ENABLED || typeof gtag === 'undefined') return;
    
    try {
        // 添加默认参数
        const eventParams = {
            ...parameters,
            'page_title': document.title,
            'page_location': window.location.href
        };
        
        // 发送事件
        gtag('event', eventName, eventParams);
        
        if (GA4_CONFIG.DEBUG) {
            console.log('GA4 事件跟踪:', eventName, eventParams);
        }
    } catch (error) {
        console.error('GA4 事件跟踪失败:', error);
    }
}

// 步伐查看事件
function trackStepView(sequence, stepType, gender, isFree) {
    trackEvent(GA4_CONFIG.EVENTS.STEP_VIEW, {
        [GA4_CONFIG.PARAMETERS.STEP_SEQUENCE]: sequence,
        [GA4_CONFIG.PARAMETERS.STEP_TYPE]: stepType,
        [GA4_CONFIG.PARAMETERS.GENDER]: gender,
        [GA4_CONFIG.PARAMETERS.IS_FREE]: isFree
    });
}

// 视频播放事件
function trackVideoPlay(sequence, stepType, gender, videoIndex, totalVideos, patternName, isFree) {
    trackEvent(GA4_CONFIG.EVENTS.VIDEO_PLAY, {
        [GA4_CONFIG.PARAMETERS.STEP_SEQUENCE]: sequence,
        [GA4_CONFIG.PARAMETERS.STEP_TYPE]: stepType,
        [GA4_CONFIG.PARAMETERS.GENDER]: gender,
        [GA4_CONFIG.PARAMETERS.VIDEO_INDEX]: videoIndex,
        [GA4_CONFIG.PARAMETERS.TOTAL_VIDEOS]: totalVideos,
        [GA4_CONFIG.PARAMETERS.PATTERN_NAME]: patternName,
        [GA4_CONFIG.PARAMETERS.IS_FREE]: isFree
    });
}

// 用户登录事件
function trackUserLogin() {
    trackEvent(GA4_CONFIG.EVENTS.USER_LOGIN, {
        [GA4_CONFIG.PARAMETERS.USER_TYPE]: 'logged_in'
    });
    setUserProperties();
}

// 用户注册事件
function trackUserRegister() {
    trackEvent(GA4_CONFIG.EVENTS.USER_REGISTER, {
        [GA4_CONFIG.PARAMETERS.USER_TYPE]: 'new_user'
    });
    setUserProperties();
}

// 用户升级事件
function trackUserUpgrade() {
    trackEvent(GA4_CONFIG.EVENTS.USER_UPGRADE, {
        [GA4_CONFIG.PARAMETERS.USER_TYPE]: 'premium'
    });
    setUserProperties();
}

// 性别切换事件
function trackGenderSwitch(gender) {
    trackEvent(GA4_CONFIG.EVENTS.GENDER_SWITCH, {
        [GA4_CONFIG.PARAMETERS.GENDER]: gender
    });
}

// 步伐类型切换事件
function trackStepTypeSwitch(stepType) {
    trackEvent(GA4_CONFIG.EVENTS.STEP_TYPE_SWITCH, {
        [GA4_CONFIG.PARAMETERS.STEP_TYPE]: stepType
    });
}

// 页面访问事件
function trackPageView() {
    if (typeof gtag === 'undefined') return;
    
    gtag('event', 'page_view', {
        'page_title': document.title,
        'page_location': window.location.href,
        'page_path': window.location.pathname
    });
}

// 隐私模式检查
function isPrivacyMode() {
    // 检查是否设置了Do Not Track
    if (navigator.doNotTrack === '1' || window.doNotTrack === '1') {
        return true;
    }
    
    // 检查用户是否明确拒绝跟踪
    if (localStorage.getItem('ga_consent') === 'denied') {
        return true;
    }
    
    return false;
}

// 获取用户同意
function getUserConsent() {
    const consent = localStorage.getItem('ga_consent');
    if (consent === 'granted') return true;
    if (consent === 'denied') return false;
    
    // 如果用户没有明确选择，默认不跟踪
    return false;
}

// 设置用户同意
function setUserConsent(granted) {
    localStorage.setItem('ga_consent', granted ? 'granted' : 'denied');
    
    if (granted) {
        initGA4();
    } else {
        console.log('用户已拒绝GA4跟踪');
    }
}

// 导出GA4工具函数
window.ga4Tracker = {
    init: initGA4,
    trackEvent: trackEvent,
    trackStepView: trackStepView,
    trackVideoPlay: trackVideoPlay,
    trackUserLogin: trackUserLogin,
    trackUserRegister: trackUserRegister,
    trackUserUpgrade: trackUserUpgrade,
    trackGenderSwitch: trackGenderSwitch,
    trackStepTypeSwitch: trackStepTypeSwitch,
    trackPageView: trackPageView,
    isPrivacyMode: isPrivacyMode,
    getUserConsent: getUserConsent,
    setUserConsent: setUserConsent,
    config: GA4_CONFIG
};

// 隐私横幅管理
function initPrivacyBanner() {
    const consent = localStorage.getItem('ga_consent');
    const cookieBanner = document.getElementById('cookie-banner');
    const privacySettings = document.getElementById('privacy-settings');
    
    // 如果用户已经做出选择，显示设置按钮
    if (consent === 'granted' || consent === 'denied') {
        if (privacySettings) {
            privacySettings.classList.remove('hidden');
        }
        return;
    }
    
    // 显示隐私横幅
    if (cookieBanner) {
        cookieBanner.classList.remove('hidden');
    }
    
    // 绑定按钮事件
    const acceptBtn = document.getElementById('accept-analytics');
    const rejectBtn = document.getElementById('reject-analytics');
    const privacyLink = document.getElementById('privacy-link');
    
    if (acceptBtn) {
        acceptBtn.addEventListener('click', function() {
            setUserConsent(true);
            hideCookieBanner();
            showPrivacySettings();
        });
    }
    
    if (rejectBtn) {
        rejectBtn.addEventListener('click', function() {
            setUserConsent(false);
            hideCookieBanner();
            showPrivacySettings();
        });
    }
    
    if (privacyLink) {
        privacyLink.addEventListener('click', function(e) {
            e.preventDefault();
            showPrivacyModal();
        });
    }
}

// 隐藏Cookie横幅
function hideCookieBanner() {
    const cookieBanner = document.getElementById('cookie-banner');
    if (cookieBanner) {
        cookieBanner.classList.add('hidden');
    }
}

// 显示隐私设置按钮
function showPrivacySettings() {
    const privacySettings = document.getElementById('privacy-settings');
    if (privacySettings) {
        privacySettings.classList.remove('hidden');
    }
}

// 显示隐私政策模态框
function showPrivacyModal() {
    const privacyModal = document.getElementById('privacy-modal');
    if (privacyModal) {
        privacyModal.classList.remove('hidden');
    }
}

// 隐藏隐私政策模态框
function hidePrivacyModal() {
    const privacyModal = document.getElementById('privacy-modal');
    if (privacyModal) {
        privacyModal.classList.add('hidden');
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 初始化隐私横幅
    setTimeout(() => {
        initPrivacyBanner();
    }, 2000);
    
    // 延迟初始化GA4，等待其他脚本加载完成
    setTimeout(() => {
        if (getUserConsent() && !isPrivacyMode()) {
            initGA4();
            trackPageView();
        }
    }, 1000);
    
    // 绑定隐私模态框事件
    const closePrivacyModal = document.getElementById('close-privacy-modal');
    const closePrivacyBtn = document.getElementById('close-privacy-btn');
    const privacySettings = document.getElementById('privacy-settings');
    
    if (closePrivacyModal) {
        closePrivacyModal.addEventListener('click', hidePrivacyModal);
    }
    
    if (closePrivacyBtn) {
        closePrivacyBtn.addEventListener('click', hidePrivacyModal);
    }
    
    if (privacySettings) {
        privacySettings.addEventListener('click', function() {
            // 重置用户选择，重新显示横幅
            localStorage.removeItem('ga_consent');
            hidePrivacyModal();
            initPrivacyBanner();
        });
    }
    
    // 点击模态框外部关闭
    const privacyModal = document.getElementById('privacy-modal');
    if (privacyModal) {
        privacyModal.addEventListener('click', function(e) {
            if (e.target === privacyModal) {
                hidePrivacyModal();
            }
        });
    }
});