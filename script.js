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

    // 当前选择的步伐类型 (默认为平行启动)
    let currentStepType = 'parallel';
    
    // 初始化点位可见性
    updatePointVisibility();

    // 存储点击的点位顺序
    let clickSequence = [];
    // 存储所有可用的MP4文件名
    const availableVideos = [
        '前后启动1-2.mp4',
        '前后启动1-3.mp4',
        '前后启动1-4.mp4',
        '前后启动1-4（1）.mp4',
        '前后启动1-5.mp4',
        '前后启动1-5（单脚杀）.mp4',
        '前后启动1-5（并步）.mp4',
        '前后启动2-4.mp4',
        '前后启动2-5.mp4',
        '前后启动3-4.mp4',
        '前后启动3-4（交叉）.mp4',
        '前后启动3-5.mp4',
        '前后启动3-5（主动）.mp4',
        '前后启动4-2.mp4',
        '前后启动4-3.mp4',
        '前后启动5-2.mp4',
        '前后启动5-3.mp4',
        '平行启动1-2.mp4',
        '平行启动1-2（1）.mp4',
        '平行启动1-3.mp4',
        '平行启动1-3（1）.mp4',
        '平行启动1-4.mp4',
        '平行启动1-5.mp4',
        '平行启动1-5（1）.mp4',
        '平行启动1-5（被动交叉）.mp4',
        '平行启动1-6.mp4',
        '平行启动1-7（小跳）.mp4',
        '平行启动1-6（跨步勾对角）.mp4',
        '平行启动1-6（跨步）.mp4',
        '平行启动1-7.mp4'
    ];

    // 当前显示的视频索引
    let currentVideoIndex = 0;
    // 当前步伐的所有视频列表
    let currentVideoList = [];

    // 步伐说明映射表
    const stepDescriptions = {
        '平行启动': {
            '1-2': '从中心位置(1)到反手网前(2)的平行启动步伐：双脚平行站立，快速向左侧移动，用反手握拍接球。',
            '1-3': '从中心位置(1)到正手网前(3)的平行启动步伐：双脚平行站立，快速向右侧移动，用正手握拍接球。',
            '1-4': '从中心位置(1)到头顶后场(4)的平行启动步伐：双脚平行站立，快速向左后方移动，用头顶击球技术接球。',
            '1-5': '从中心位置(1)到正手后场(5)的平行启动步伐：双脚平行站立，快速向右后方移动，用正手高球或杀球技术接球。',
            '1-6': '从中心位置(1)到反手中场(6)的平行启动步伐：双脚平行站立，快速向左侧移动，用反手击球技术接球。',
            '1-7': '从中心位置(1)到正手中场(7)的平行启动步伐：双脚平行站立，快速向右侧移动，用正手击球技术接球。',
            'default': '平行启动是一种防守站位的启动方式，双脚平行站立，适合应对高球，能够快速向各个方向移动。'
        },
        '前后启动': {
            '1-2': '从中心位置(1)到反手网前(2)的前后启动步伐：前后脚站立，快速向左侧前方移动，用反手握拍接球。',
            '1-3': '从中心位置(1)到正手网前(3)的前后启动步伐：前后脚站立，快速向右侧前方移动，用正手握拍接球。',
            '1-4': '从中心位置(1)到头顶后场(4)的前后启动步伐：前后脚站立，快速向左后方移动，用头顶击球技术接球。',
            '1-5': '从中心位置(1)到正手后场(5)的前后启动步伐：前后脚站立，快速向右后方移动，用正手高球或杀球技术接球。',
            '1-6': '从中心位置(1)到反手中场(6)的前后启动步伐：前后脚站立，快速向左侧移动，用反手击球技术接球。',
            '1-7': '从中心位置(1)到正手中场(7)的前后启动步伐：前后脚站立，快速向右侧移动，用正手击球技术接球。',
            '2-4': '从反手网前(2)到头顶后场(4)的前后启动步伐：先回撤，再向左后方移动，适合应对对方的挑高球。',
            '2-5': '从反手网前(2)到正手后场(5)的前后启动步伐：快速转身，向右后方移动，需要良好的身体协调性。',
            '3-4': '从正手网前(3)到头顶后场(4)的前后启动步伐：快速转身，向左后方移动，适合应对对方的对角线挑高球。',
            '3-5': '从正手网前(3)到正手后场(5)的前后启动步伐：直接向后移动，保持正手击球姿势。',
            '4-2': '从头顶后场(4)到反手网前(2)的前后启动步伐：快速向前移动，转为反手握拍接球。',
            '4-3': '从头顶后场(4)到正手网前(3)的前后启动步伐：快速向前移动，转为正手握拍接球。',
            '5-2': '从正手后场(5)到反手网前(2)的前后启动步伐：快速向前并向左移动，需要良好的脚步灵活性。',
            '5-3': '从正手后场(5)到正手网前(3)的前后启动步伐：快速向前移动，保持正手击球姿势。',
            'default': '前后启动是一种进攻站位的启动方式，前后脚站立，适合应对下压球，启动速度快，爆发力强。'
        },
        'default': '选择两个点位后，将显示对应的步伐说明。步伐是羽毛球运动的基础，正确的步伐能够帮助球员快速到达击球位置，提高击球质量。'
    };

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
        // 定义需要会员权限的步伐
        const premiumSteps = [
            '平行启动1-6', '平行启动1-7',
            '前后启动1-5（单脚杀）', '前后启动1-5（并步）',
            '前后启动3-4（交叉）', '前后启动3-5（主动）'
        ];

        const vipSteps = [
            '平行启动1-5（被动交叉）', '平行启动1-6（跨步勾对角）',
            '平行启动1-6（跨步）', '平行启动1-7（小跳）'
        ];

        const stepKey = `${stepType}${sequence}`;
        
        if (vipSteps.includes(stepKey)) {
            return authManager.hasPermission('vip');
        } else if (premiumSteps.includes(stepKey)) {
            return authManager.hasPermission('premium');
        }
        
        return true; // 免费用户可以访问基础步伐
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
        
        // 根据选择的步伐类型查找所有相关的视频
        if (currentStepType === 'parallel') {
            currentVideoList = availableVideos.filter(video => video.startsWith(`平行启动${sequence}`));
        } else if (currentStepType === 'forward-backward') {
            currentVideoList = availableVideos.filter(video => video.startsWith(`前后启动${sequence}`));
        }

        // 检查访问权限
        const stepType = currentStepType === 'parallel' ? '平行启动' : '前后启动';
        const hasAccess = checkStepAccess(stepType, sequence);

        if (currentVideoList.length === 0) {
            // 没有找到对应的视频
            showNoVideoModal(sequence);
            return;
        }

        if (!hasAccess) {
            // 没有访问权限，显示升级提示
            showUpgradeModal(sequence, stepType);
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
        descriptionText.textContent = stepDescriptions.default;
        
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
        
        const stepKey = `${stepType}${sequence}`;
        let requiredPlan = 'premium';
        let planName = '高级会员';
        
        // 检查需要哪个级别的会员
        const vipSteps = [
            '平行启动1-5（被动交叉）', '平行启动1-6（跨步勾对角）',
            '平行启动1-6（跨步）', '平行启动1-7（小跳）'
        ];
        
        if (vipSteps.includes(stepKey)) {
            requiredPlan = 'vip';
            planName = 'VIP会员';
        }
        
        modalTitle.textContent = `${stepType}从点位${sequence[0]}到点位${sequence[2]}`;
        descriptionText.innerHTML = `
            <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div class="flex items-center mb-2">
                    <svg class="w-5 h-5 text-yellow-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                    </svg>
                    <span class="font-semibold text-yellow-800">需要${planName}</span>
                </div>
                <p class="text-yellow-700 text-sm mb-3">此步伐内容需要${planName}才能查看</p>
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
        
        // 设置标题，提取视频类型
        const videoType = firstVideo.split(sequence)[0].replace('启动', '启动：');
        modalTitle.textContent = `${videoType}从点位${sequence[0]}到点位${sequence[2]}`;

        // 显示对应的步伐说明
        if (stepDescriptions[stepType] && stepDescriptions[stepType][sequence]) {
            descriptionText.textContent = stepDescriptions[stepType][sequence];
        } else if (stepDescriptions[stepType]) {
            descriptionText.textContent = stepDescriptions[stepType].default;
        } else {
            descriptionText.textContent = stepDescriptions.default;
        }

        // 更新计数器
        videoCounter.textContent = `${currentVideoIndex + 1}/${currentVideoList.length}`;
        
        // 显示或隐藏切换按钮
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
        
        currentVideoIndex = (currentVideoIndex - 1 + currentVideoList.length) % currentVideoList.length;
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
        
        currentVideoIndex = (currentVideoIndex + 1) % currentVideoList.length;
        const nextVideo = currentVideoList[currentVideoIndex];
        stepVideo.src = `步伐MP4图/${nextVideo}`;
        
        // 重新加载视频以确保正确播放
        stepVideo.load();
        
        // 更新计数器
        videoCounter.textContent = `${currentVideoIndex + 1}/${currentVideoList.length}`;
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