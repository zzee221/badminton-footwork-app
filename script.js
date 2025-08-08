document.addEventListener('DOMContentLoaded', function() {
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

    // 当前选择的步伐类型 (默认为平行启动)
    let currentStepType = 'parallel';
    
    // 初始化点位可见性和步伐列表
    updatePointVisibility();
    renderStepList();

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

    // 监听步伐类型选择变化
    stepTypeRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            currentStepType = this.value;
            updatePointVisibility();
        });
    });

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
    function handlePointClick(pointNumber) {
        // 添加到点击序列
        clickSequence.push(pointNumber);

        // 高亮当前点击的点位
        highlightPoint(pointNumber);

        // 如果序列中有两个点位，查找并显示GIF
        if (clickSequence.length === 2) {
            const sequence = clickSequence.join('-');
            showGifModal(sequence);
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
    function checkStepAccess(stepType, sequence) {
        const stepInfo = stepConfig.getStepInfo(stepType, sequence);
        
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

    // 渲染步伐列表
    function renderStepList() {
        const stepTypes = stepConfig.getStepTypes();
        let html = '';

        stepTypes.forEach(type => {
            const config = stepConfig.getStepConfig(type);
            const steps = stepConfig.getSteps(type);
            
            html += `
                <div class="step-type-section">
                    <h3 class="text-md font-semibold text-gray-700 mb-3">${config.name}</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            `;

            Object.entries(steps).forEach(([sequence, step]) => {
                const isFree = stepConfig.isStepFree(type, sequence);
                const indicatorColor = isFree ? 'bg-green-500' : 'bg-purple-500';
                const lockIcon = isFree ? '' : '<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"></path></svg>';
                
                // 计算总视频数
                const totalVideos = step.patterns.reduce((sum, pattern) => sum + pattern.videos.length, 0);
                // 计算免费视频数
                const freeVideos = step.patterns.reduce((sum, pattern) => sum + (pattern.isFree ? pattern.videos.length : 0), 0);
                
                html += `
                    <div class="step-item border rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition duration-200 ${!isFree ? 'border-purple-200' : 'border-gray-200'}" 
                         data-step-type="${type}" data-step-sequence="${sequence}">
                        <div class="flex items-center justify-between mb-2">
                            <div class="flex items-center space-x-2">
                                <div class="w-3 h-3 ${indicatorColor} rounded-full"></div>
                                <span class="font-medium text-gray-800">${sequence}</span>
                                ${lockIcon}
                            </div>
                            <div class="flex items-center space-x-2">
                                <span class="text-xs text-gray-500">${totalVideos} 视频</span>
                                ${freeVideos > 0 && freeVideos < totalVideos ? `<span class="text-xs text-green-600">${freeVideos} 免费</span>` : ''}
                            </div>
                        </div>
                        <p class="text-sm text-gray-600">${step.name}</p>
                        ${step.patterns.length > 1 ? `<div class="mt-1 text-xs text-gray-500">${step.patterns.length} 种模式</div>` : ''}
                    </div>
                `;
            });

            html += `
                    </div>
                </div>
            `;
        });

        stepList.innerHTML = html;

        // 绑定步伐项点击事件
        document.querySelectorAll('.step-item').forEach(item => {
            item.addEventListener('click', function() {
                const stepType = this.getAttribute('data-step-type');
                const stepSequence = this.getAttribute('data-step-sequence');
                
                // 检查访问权限
                const hasAccess = checkStepAccess(stepType, stepSequence);
                
                if (!hasAccess) {
                    // 没有访问权限，显示升级提示
                    const config = stepConfig.getStepConfig(stepType);
                    showUpgradeModal(stepSequence, config.name);
                    return;
                }

                // 模拟点击对应的点位
                const points = stepSequence.split('-');
                clickSequence = [];
                
                // 依次点击点位
                points.forEach((point, index) => {
                    setTimeout(() => {
                        handlePointClick(point);
                    }, index * 200);
                });
            });
        });
    }

    // 高亮点位
    function highlightPoint(pointNumber) {
        resetPointHighlights();
        const point = document.querySelector(`.point[data-point="${pointNumber}"]`);
        point.classList.add('active');
    }

    // 重置点位高亮
    function resetPointHighlights() {
        points.forEach(point => {
            point.classList.remove('active');
        });
    }

    // 显示GIF模态框
    function showGifModal(sequence) {
        // 重置视频索引
        currentVideoIndex = 0;
        
        // 获取步伐类型的中文名称
        const stepType = currentStepType === 'parallel' ? '平行启动' : '前后启动';
        
        // 从配置系统获取视频列表
        const stepInfo = stepConfig.getStepInfo(currentStepType, sequence);
        
        if (stepInfo && stepInfo.patterns.length > 0) {
            // 分离免费和付费模式
            const freePatterns = stepInfo.patterns.filter(pattern => pattern.isFree);
            const paidPatterns = stepInfo.patterns.filter(pattern => !pattern.isFree);
            
            // 获取用户可访问的付费模式
            const accessiblePaidPatterns = paidPatterns.filter(pattern => {
                return authManager.currentUser && authManager.hasPermission('premium');
            });
            
            // 存储所有视频（用于显示翻页按钮）
            currentVideoList = [];
            stepInfo.patterns.forEach(pattern => {
                currentVideoList.push(...pattern.videos);
            });
            
            // 存储免费视频索引
            freeVideoIndices = [];
            let currentIndex = 0;
            freePatterns.forEach(pattern => {
                for (let i = 0; i < pattern.videos.length; i++) {
                    freeVideoIndices.push(currentIndex + i);
                }
                currentIndex += pattern.videos.length;
            });
            
            // 存储可访问的付费视频索引
            accessiblePaidVideoIndices = [];
            accessiblePaidPatterns.forEach(pattern => {
                for (let i = 0; i < pattern.videos.length; i++) {
                    accessiblePaidVideoIndices.push(currentIndex + i);
                }
                currentIndex += pattern.videos.length;
            });
            
        } else {
            currentVideoList = [];
            freeVideoIndices = [];
            accessiblePaidVideoIndices = [];
        }

        // 检查访问权限
        const hasAccess = checkStepAccess(currentStepType, sequence);

        if (!hasAccess) {
            // 没有访问权限，显示升级提示
            showUpgradeModal(sequence, stepType);
            return;
        }

        if (currentVideoList.length === 0) {
            // 没有找到对应的视频
            showNoVideoModal(sequence);
            return;
        }

        // 显示视频
        showVideoModal(sequence, stepType);
    }

    // 显示无视频模态框
    function showNoVideoModal(sequence) {
        stepVideo.src = '';
        stepVideo.classList.add('hidden');
        videoNotice.classList.remove('hidden');
        modalTitle.textContent = `从点位${sequence[0]}到点位${sequence[2]}的步伐`;
        
        // 显示默认说明
        descriptionText.textContent = '选择两个点位后，将显示对应的步伐说明。步伐是羽毛球运动的基础，正确的步伐能够帮助球员快速到达击球位置，提高击球质量。';
        
        // 隐藏切换按钮和计数器
        prevGifBtn.classList.add('hidden');
        nextGifBtn.classList.add('hidden');
        videoCounter.classList.add('hidden');
        
        modal.classList.remove('hidden');
    }

    // 显示升级提示模态框
    function showUpgradeModal(sequence, stepType) {
        stepVideo.src = '';
        stepVideo.classList.add('hidden');
        videoNotice.classList.add('hidden');
        
        modalTitle.textContent = `${stepType}从点位${sequence[0]}到点位${sequence[2]}`;
        descriptionText.innerHTML = `
            <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div class="flex items-center mb-2">
                    <svg class="w-5 h-5 text-yellow-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                    </svg>
                    <span class="font-semibold text-yellow-800">需要会员</span>
                </div>
                <p class="text-yellow-700 text-sm mb-3">此步伐内容需要会员才能查看</p>
                <button id="upgrade-btn" class="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md text-sm transition duration-300">
                    立即升级
                </button>
            </div>
        `;
        
        // 隐藏切换按钮和计数器
        prevGifBtn.classList.add('hidden');
        nextGifBtn.classList.add('hidden');
        videoCounter.classList.add('hidden');
        
        modal.classList.remove('hidden');
        
        // 绑定升级按钮事件
        document.getElementById('upgrade-btn').addEventListener('click', () => {
            modal.classList.add('hidden');
            authManager.showUpgradeModal();
        });
    }

    // 显示视频模态框
    function showVideoModal(sequence, stepType) {
        // 显示第一个视频
        const firstVideo = currentVideoList[0];
        stepVideo.src = `步伐MP4图/${firstVideo}`;
        stepVideo.classList.remove('hidden');
        videoNotice.classList.add('hidden');
        
        // 重新加载视频以确保正确播放
        stepVideo.load();
        
        // 获取步伐信息
        const stepInfo = stepConfig.getStepInfo(currentStepType, sequence);
        
        // 设置标题
        modalTitle.textContent = `${stepType}：${stepInfo.name} (${sequence})`;

        // 显示对应的步伐说明
        if (stepInfo) {
            descriptionText.textContent = stepInfo.description;
            
            // 如果有多种模式，添加模式信息
            if (stepInfo.patterns.length > 1) {
                const accessiblePatterns = stepInfo.patterns.filter(pattern => {
                    return pattern.isFree || authManager.hasPermission('premium');
                });
                
                if (accessiblePatterns.length > 0) {
                    const patternNames = accessiblePatterns.map(p => p.name).join('、');
                    descriptionText.innerHTML += `<br><br><strong>可用模式：</strong>${patternNames}`;
                }
            }
        } else {
            descriptionText.textContent = '选择两个点位后，将显示对应的步伐说明。步伐是羽毛球运动的基础，正确的步伐能够帮助球员快速到达击球位置，提高击球质量。';
        }

        // 更新计数器
        videoCounter.textContent = `${currentVideoIndex + 1}/${currentVideoList.length}`;
        
        // 显示或隐藏切换按钮（只要总视频数大于1就显示）
        if (currentVideoList.length > 1) {
            prevGifBtn.classList.remove('hidden');
            nextGifBtn.classList.remove('hidden');
            videoCounter.classList.remove('hidden');
        } else {
            prevGifBtn.classList.add('hidden');
            nextGifBtn.classList.add('hidden');
            videoCounter.classList.add('hidden');
        }

  
        modal.classList.remove('hidden');
    }

    // 切换到上一个视频
    function showPrevVideo() {
        if (currentVideoList.length === 0) return;
        
        const nextIndex = (currentVideoIndex - 1 + currentVideoList.length) % currentVideoList.length;
        
        // 检查是否有权限访问目标视频
        if (!canAccessVideo(nextIndex)) {
            showUpgradeModalForVideo();
            return;
        }
        
        currentVideoIndex = nextIndex;
        const prevVideo = currentVideoList[currentVideoIndex];
        stepVideo.src = `步伐MP4图/${prevVideo}`;
        
        // 重新加载视频以确保正确播放
        stepVideo.load();
        
        // 更新计数器
        videoCounter.textContent = `${currentVideoIndex + 1}/${currentVideoList.length}`;
    }

    // 切换到下一个视频
    function showNextVideo() {
        if (currentVideoList.length === 0) return;
        
        const nextIndex = (currentVideoIndex + 1) % currentVideoList.length;
        
        // 检查是否有权限访问目标视频
        if (!canAccessVideo(nextIndex)) {
            showUpgradeModalForVideo();
            return;
        }
        
        currentVideoIndex = nextIndex;
        const nextVideo = currentVideoList[currentVideoIndex];
        stepVideo.src = `步伐MP4图/${nextVideo}`;
        
        // 重新加载视频以确保正确播放
        stepVideo.load();
        
        // 更新计数器
        videoCounter.textContent = `${currentVideoIndex + 1}/${currentVideoList.length}`;
    }

    // 检查是否有权限访问指定索引的视频
    function canAccessVideo(index) {
        return freeVideoIndices.includes(index) || accessiblePaidVideoIndices.includes(index);
    }

    // 显示视频升级提示
    function showUpgradeModalForVideo() {
        stepVideo.src = '';
        stepVideo.classList.add('hidden');
        videoNotice.classList.add('hidden');
        
        modalTitle.textContent = '需要会员';
        descriptionText.innerHTML = `
            <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div class="flex items-center mb-2">
                    <svg class="w-5 h-5 text-yellow-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                    </svg>
                    <span class="font-semibold text-yellow-800">需要会员</span>
                </div>
                <p class="text-yellow-700 text-sm mb-3">此视频内容需要会员才能查看</p>
                <button id="upgrade-btn-video" class="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md text-sm transition duration-300">
                    立即升级
                </button>
            </div>
        `;
        
        // 隐藏切换按钮和计数器
        prevGifBtn.classList.add('hidden');
        nextGifBtn.classList.add('hidden');
        videoCounter.classList.add('hidden');
        
        // 绑定升级按钮事件
        document.getElementById('upgrade-btn-video').addEventListener('click', () => {
            modal.classList.add('hidden');
            authManager.showUpgradeModal();
        });
    }

    // 绑定切换按钮事件
    prevGifBtn.addEventListener('click', showPrevVideo);
    nextGifBtn.addEventListener('click', showNextVideo);

    // 关闭模态框
    function closeModalFunc() {
        modal.classList.add('hidden');
        clickSequence = [];
        resetPointHighlights();
    }

    // 关闭按钮事件
    closeModal.addEventListener('click', closeModalFunc);
    closeBtn.addEventListener('click', closeModalFunc);

    // 点击模态框外部关闭
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModalFunc();
        }
    });

    // 按下ESC键关闭
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeModalFunc();
        }
    });
});