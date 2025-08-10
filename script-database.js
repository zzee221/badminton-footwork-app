// 数据库化版本的主程序文件
// 替代原有的 script.js
// 创建时间：2025-08-10

document.addEventListener('DOMContentLoaded', async function() {
    // 等待数据库连接初始化
    if (!window.supabase) {
        console.error('Supabase 未初始化');
        return;
    }

    // 获取DOM元素
    const points = document.querySelectorAll('.point');
    const modal = document.getElementById('modal');
    const closeModal = document.getElementById('close-modal');
    const closeBtn = document.getElementById('close-btn');
    const stepVideo = document.getElementById('step-video');
    const videoNotice = document.getElementById('video-notice');
    const modalTitle = document.getElementById('modal-title');
    const descriptionText = document.getElementById('description-text');
    const stepTypeRadios = document.querySelectorAll('input[name="step-type"]');
    const prevGifBtn = document.getElementById('prev-gif');
    const nextGifBtn = document.getElementById('next-gif');
    const videoCounter = document.getElementById('video-counter');
    const stepList = document.getElementById('step-list');
    const loadingIndicator = document.getElementById('loading-indicator') || createLoadingIndicator();

    // 当前选择的步伐类型 (默认为平行启动)
    let currentStepType = 'parallel';
    
    // 存储点击的点位顺序
    let clickSequence = [];

    // 当前显示的视频索引
    let currentVideoIndex = 0;
    // 当前步伐的所有视频列表
    let currentVideoList = [];
    // 免费视频索引列表
    let freeVideoIndices = [];
    // 可访问的付费视频索引列表
    let accessiblePaidVideoIndices = [];

    // 显示加载指示器
    function showLoading() {
        loadingIndicator.style.display = 'block';
    }

    // 隐藏加载指示器
    function hideLoading() {
        loadingIndicator.style.display = 'none';
    }

    // 创建加载指示器
    function createLoadingIndicator() {
        const indicator = document.createElement('div');
        indicator.id = 'loading-indicator';
        indicator.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 20px;
            border-radius: 10px;
            z-index: 9999;
            display: none;
        `;
        indicator.innerHTML = '<div>正在加载数据...</div>';
        document.body.appendChild(indicator);
        return indicator;
    }

    // 初始化应用
    async function initializeApp() {
        showLoading();
        try {
            console.log('开始初始化应用...');
            
            // 检查 Supabase 连接
            if (!window.supabase) {
                throw new Error('Supabase 未初始化');
            }
            
            // 检查数据库配置
            if (!window.databaseStepConfig) {
                throw new Error('数据库配置未初始化');
            }
            
            console.log('Supabase 连接正常');
            
            // 初始化步伐类型选项
            console.log('初始化步伐类型选项...');
            await initializeStepTypeOptions();
            console.log('步伐类型选项初始化完成');
            
            // 初始化点位可见性和步伐列表
            updatePointVisibility();
            console.log('渲染步伐列表...');
            await renderStepList();
            console.log('步伐列表渲染完成');
            
            console.log('应用初始化完成');
        } catch (error) {
            console.error('应用初始化失败:', error);
            showError(`初始化失败: ${error.message}`);
        } finally {
            hideLoading();
        }
    }

    // 初始化步伐类型选项
    async function initializeStepTypeOptions() {
        try {
            const stepTypes = await window.databaseStepConfig.getStepTypes();
            const container = document.querySelector('.flex.flex-wrap.gap-4');
            
            // 清空现有选项
            container.innerHTML = '';
            
            // 添加数据库中的步伐类型
            stepTypes.forEach((type, index) => {
                const label = document.createElement('label');
                label.className = 'inline-flex items-center cursor-pointer';
                label.innerHTML = `
                    <input type="radio" name="step-type" value="${type.type_key}" ${index === 0 ? 'checked' : ''} class="sr-only peer">
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                    <span class="ml-2 text-gray-700">${type.name}</span>
                `;
                container.appendChild(label);
            });

            // 重新绑定事件
            bindStepTypeEvents();
        } catch (error) {
            console.error('初始化步伐类型选项失败:', error);
            // 如果数据库加载失败，使用默认选项
            const container = document.querySelector('.flex.flex-wrap.gap-4');
            container.innerHTML = `
                <label class="inline-flex items-center cursor-pointer">
                    <input type="radio" name="step-type" value="parallel" checked class="sr-only peer">
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                    <span class="ml-2 text-gray-700">平行启动</span>
                </label>
                <label class="inline-flex items-center cursor-pointer">
                    <input type="radio" name="step-type" value="forward-backward" class="sr-only peer">
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                    <span class="ml-2 text-gray-700">前后启动</span>
                </label>
            `;
            bindStepTypeEvents();
        }
    }

    // 绑定步伐类型选择事件
    function bindStepTypeEvents() {
        const radios = document.querySelectorAll('input[name="step-type"]');
        radios.forEach(radio => {
            radio.addEventListener('change', function() {
                currentStepType = this.value;
                updatePointVisibility();
                renderStepList(); // 重新渲染步伐列表
            });
        });
    }

    // 更新点位可见性（6、7号点位仅在平行启动中显示）
    function updatePointVisibility() {
        const point6 = document.querySelector('.point[data-point="6"]');
        const point7 = document.querySelector('.point[data-point="7"]');
        
        if (currentStepType === 'parallel') {
            point6.style.display = 'flex';
            point7.style.display = 'flex';
        } else {
            point6.style.display = 'none';
            point7.style.display = 'none';
        }
    }

    // 点位点击事件
    points.forEach(point => {
        point.addEventListener('click', function() {
            const pointNumber = this.getAttribute('data-point');
            handlePointClick(pointNumber);
        });
    });

    // 处理点位点击
    async function handlePointClick(pointNumber) {
        // 添加到点击序列
        clickSequence.push(pointNumber);

        // 高亮当前点击的点位
        highlightPoint(pointNumber);

        // 如果序列中有两个点位，查找并显示视频
        if (clickSequence.length === 2) {
            const sequence = clickSequence.join('-');
            await showVideoModal(sequence);
            // 重置点击序列
            setTimeout(() => {
                clickSequence = [];
                resetPointHighlights();
            }, 3000);
        } else if (clickSequence.length > 2) {
            // 如果点击超过两个点位，重置序列
            clickSequence = [pointNumber];
            resetPointHighlights();
            highlightPoint(pointNumber);
        }
    }

    // 检查步伐访问权限
    async function checkStepAccess(stepType, sequence) {
        try {
            const stepInfo = await window.databaseStepConfig.getStepInfo(stepType, sequence);
            
            if (!stepInfo) return false;
            
            // 检查步伐组合是否免费
            const isStepFree = await window.databaseStepConfig.isStepFree(stepType, sequence);
            
            // 如果步伐免费，所有人都可以访问
            if (isStepFree) return true;
            
            // 如果步伐付费，检查用户权限
            if (window.auth && window.auth.isPremiumUser()) {
                return true;
            }
            
            return false;
        } catch (error) {
            console.error('检查步伐访问权限失败:', error);
            // 如果检查失败，默认允许访问免费内容
            return true;
        }
    }

    // 显示视频模态框
    async function showVideoModal(sequence) {
        try {
            const hasAccess = await checkStepAccess(currentStepType, sequence);
            
            if (!hasAccess) {
                showUpgradeModal();
                return;
            }

            const stepVideos = await window.databaseStepConfig.getStepVideos(currentStepType, sequence);
            if (!stepVideos || stepVideos.length === 0) {
                showError('未找到对应的步伐视频');
                return;
            }

            // 重置视频索引
            currentVideoIndex = 0;
            currentVideoList = stepVideos;
            freeVideoIndices = [];
            accessiblePaidVideoIndices = [];

            // 分类视频
            stepVideos.forEach((pattern, patternIndex) => {
                pattern.videos.forEach((video, videoIndex) => {
                    const globalIndex = patternIndex;
                    if (pattern.isFree) {
                        freeVideoIndices.push(globalIndex);
                    } else if (window.auth && window.auth.isPremiumUser()) {
                        accessiblePaidVideoIndices.push(globalIndex);
                    }
                });
            });

            // 显示第一个可访问的视频
            await showCurrentVideo();

            // 显示模态框
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';

        } catch (error) {
            console.error('显示视频模态框失败:', error);
            showError('加载视频失败，请重试');
        }
    }

    // 显示当前视频
    async function showCurrentVideo() {
        if (currentVideoList.length === 0) return;

        const currentPattern = currentVideoList[currentVideoIndex];
        const currentVideo = currentPattern.videos[0];

        if (!currentVideo) return;

        // 更新视频源
        stepVideo.src = currentVideo.path;
        stepVideo.load();

        // 更新标题和描述
        const stepInfo = await window.databaseStepConfig.getStepInfo(currentStepType, clickSequence.join('-'));
        modalTitle.textContent = `${stepInfo?.name || '步伐演示'} - ${currentPattern.name}`;
        descriptionText.textContent = stepInfo?.description || '';

        // 更新视频计数器
        updateVideoCounter();

        // 更新按钮状态
        updateVideoButtons();
    }

    // 更新视频计数器
    function updateVideoCounter() {
        const totalVideos = currentVideoList.length;
        videoCounter.textContent = `${currentVideoIndex + 1} / ${totalVideos}`;
    }

    // 更新视频按钮状态
    function updateVideoButtons() {
        prevGifBtn.disabled = currentVideoIndex === 0;
        nextGifBtn.disabled = currentVideoIndex === currentVideoList.length - 1;
    }

    // 渲染步伐列表
    async function renderStepList() {
        try {
            const combinations = await window.databaseStepConfig.getAllStepCombinations(currentStepType);
            const currentCombinations = combinations[currentStepType];
            
            if (!currentCombinations) {
                stepList.innerHTML = '<div class="text-gray-500">暂无步伐数据</div>';
                return;
            }

            let html = '';
            for (const combo of currentCombinations.combinations) {
                const hasAccess = await checkStepAccess(currentStepType, combo.sequence);
                const accessBadge = combo.isFree ? 
                    '<span class="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">免费</span>' :
                    '<span class="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">会员</span>';

                html += `
                    <div class="step-item border rounded-lg p-3 hover:shadow-md transition-shadow ${hasAccess ? 'cursor-pointer hover:bg-gray-50' : 'opacity-60'}" 
                         data-sequence="${combo.sequence}" ${hasAccess ? '' : 'data-locked="true"'}>
                        <div class="flex items-center justify-between mb-2">
                            <h3 class="font-semibold text-gray-800">${combo.name}</h3>
                            ${accessBadge}
                        </div>
                        <p class="text-sm text-gray-600 mb-2">${combo.description}</p>
                        <div class="flex items-center justify-between">
                            <span class="text-xs text-gray-500">${combo.patternName}</span>
                            ${!hasAccess ? '<span class="text-xs text-purple-600">升级会员解锁</span>' : '<span class="text-xs text-green-600">点击观看</span>'}
                        </div>
                    </div>
                `;
            }

            stepList.innerHTML = html || '<div class="text-gray-500">暂无步伐数据</div>';

            // 绑定点击事件
            bindStepListEvents();

        } catch (error) {
            console.error('渲染步伐列表失败:', error);
            stepList.innerHTML = '<div class="text-red-500">加载步伐列表失败</div>';
        }
    }

    // 绑定步伐列表点击事件
    function bindStepListEvents() {
        const stepItems = stepList.querySelectorAll('.step-item');
        stepItems.forEach(item => {
            item.addEventListener('click', function() {
                const sequence = this.getAttribute('data-sequence');
                const locked = this.getAttribute('data-locked') === 'true';
                
                if (locked) {
                    showUpgradeModal();
                    return;
                }

                // 模拟点击点位
                clickSequence = sequence.split('-');
                showVideoModal(sequence);
            });
        });
    }

    // 显示升级模态框
    function showUpgradeModal() {
        if (window.auth && window.auth.showUpgradeModal) {
            window.auth.showUpgradeModal();
        } else {
            alert('该内容需要会员权限，请升级会员后查看');
        }
    }

    // 显示错误信息
    function showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
        errorDiv.textContent = message;
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            errorDiv.remove();
        }, 3000);
    }

    // 高亮点位
    function highlightPoint(pointNumber) {
        resetPointHighlights();
        const point = document.querySelector(`[data-point="${pointNumber}"]`);
        if (point) {
            point.classList.add('bg-red-600', 'scale-110');
        }
    }

    // 重置点位高亮
    function resetPointHighlights() {
        points.forEach(point => {
            point.classList.remove('bg-red-600', 'scale-110');
        });
    }

    // 关闭模态框
    function closeModalFunc() {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
        stepVideo.pause();
        stepVideo.src = '';
        currentVideoList = [];
        clickSequence = [];
        resetPointHighlights();
    }

    // 事件监听器
    closeModal.addEventListener('click', closeModalFunc);
    closeBtn.addEventListener('click', closeModalFunc);

    // 点击模态框外部关闭
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModalFunc();
        }
    });

    // 键盘事件
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeModalFunc();
        }
    });

    // 视频控制按钮
    prevGifBtn.addEventListener('click', function() {
        if (currentVideoIndex > 0) {
            currentVideoIndex--;
            showCurrentVideo();
        }
    });

    nextGifBtn.addEventListener('click', function() {
        if (currentVideoIndex < currentVideoList.length - 1) {
            currentVideoIndex++;
            showCurrentVideo();
        }
    });

    // 初始化应用
    await initializeApp();
});