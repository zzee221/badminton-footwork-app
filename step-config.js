// 步伐配置文件 - 用于自动化管理步伐数据
class StepConfig {
    constructor() {
        // 所有可用的步伐配置
        this.stepConfig = {
            parallel: {
                name: '平行启动',
                description: '平行启动是一种防守站位的启动方式，双脚平行站立，适合应对高球，能够快速向各个方向移动。',
                steps: {
                    '1-2': {
                        name: '中心到反手网前',
                        description: '从中心位置(1)到反手网前(2)的平行启动步伐：双脚平行站立，快速向左侧移动，用反手握拍接球。',
                        isFree: true,
                        videos: ['平行启动1-2.mp4']
                    },
                    '1-3': {
                        name: '中心到正手网前',
                        description: '从中心位置(1)到正手网前(3)的平行启动步伐：双脚平行站立，快速向右侧移动，用正手握拍接球。',
                        isFree: true,
                        videos: ['平行启动1-3.mp4']
                    },
                    '1-4': {
                        name: '中心到头顶后场',
                        description: '从中心位置(1)到头顶后场(4)的平行启动步伐：双脚平行站立，快速向左后方移动，用头顶击球技术接球。',
                        isFree: true,
                        videos: ['平行启动1-4.mp4']
                    },
                    '1-5': {
                        name: '中心到正手后场',
                        description: '从中心位置(1)到正手后场(5)的平行启动步伐：双脚平行站立，快速向右后方移动，用正手高球或杀球技术接球。',
                        isFree: true,
                        videos: ['平行启动1-5.mp4']
                    },
                    '1-6': {
                        name: '中心到反手中场',
                        description: '从中心位置(1)到反手中场(6)的平行启动步伐：双脚平行站立，快速向左侧移动，用反手击球技术接球。',
                        isFree: false,
                        videos: ['平行启动1-6.mp4', '平行启动1-6（跨步勾对角）.mp4', '平行启动1-6（跨步）.mp4']
                    },
                    '1-7': {
                        name: '中心到正手中场',
                        description: '从中心位置(1)到正手中场(7)的平行启动步伐：双脚平行站立，快速向右侧移动，用正手击球技术接球。',
                        isFree: false,
                        videos: ['平行启动1-7.mp4', '平行启动1-7（小跳）.mp4']
                    }
                }
            },
            'forward-backward': {
                name: '前后启动',
                description: '前后启动是一种进攻站位的启动方式，前后脚站立，适合应对下压球，启动速度快，爆发力强。',
                steps: {
                    '1-2': {
                        name: '中心到反手网前',
                        description: '从中心位置(1)到反手网前(2)的前后启动步伐：前后脚站立，快速向左侧前方移动，用反手握拍接球。',
                        isFree: true,
                        videos: ['前后启动1-2.mp4']
                    },
                    '1-3': {
                        name: '中心到正手网前',
                        description: '从中心位置(1)到正手网前(3)的前后启动步伐：前后脚站立，快速向右侧前方移动，用正手握拍接球。',
                        isFree: true,
                        videos: ['前后启动1-3.mp4']
                    },
                    '1-4': {
                        name: '中心到头顶后场',
                        description: '从中心位置(1)到头顶后场(4)的前后启动步伐：前后脚站立，快速向左后方移动，用头顶击球技术接球。',
                        isFree: true,
                        videos: ['前后启动1-4.mp4']
                    },
                    '1-5': {
                        name: '中心到正手后场',
                        description: '从中心位置(1)到正手后场(5)的前后启动步伐：前后脚站立，快速向右后方移动，用正手高球或杀球技术接球。',
                        isFree: true,
                        videos: ['前后启动1-5.mp4']
                    },
                    '2-4': {
                        name: '反手网前到头顶后场',
                        description: '从反手网前(2)到头顶后场(4)的前后启动步伐：先回撤，再向左后方移动，适合应对对方的挑高球。',
                        isFree: false,
                        videos: ['前后启动2-4.mp4']
                    },
                    '2-5': {
                        name: '反手网前到正手后场',
                        description: '从反手网前(2)到正手后场(5)的前后启动步伐：快速转身，向右后方移动，需要良好的身体协调性。',
                        isFree: false,
                        videos: ['前后启动2-5.mp4']
                    },
                    '3-4': {
                        name: '正手网前到头顶后场',
                        description: '从正手网前(3)到头顶后场(4)的前后启动步伐：快速转身，向左后方移动，适合应对对方的对角线挑高球。',
                        isFree: false,
                        videos: ['前后启动3-4.mp4', '前后启动3-4（交叉）.mp4']
                    },
                    '3-5': {
                        name: '正手网前到正手后场',
                        description: '从正手网前(3)到正手后场(5)的前后启动步伐：直接向后移动，保持正手击球姿势。',
                        isFree: false,
                        videos: ['前后启动3-5.mp4', '前后启动3-5（主动）.mp4']
                    },
                    '4-2': {
                        name: '头顶后场到反手网前',
                        description: '从头顶后场(4)到反手网前(2)的前后启动步伐：快速向前移动，转为反手握拍接球。',
                        isFree: false,
                        videos: ['前后启动4-2.mp4']
                    },
                    '4-3': {
                        name: '头顶后场到正手网前',
                        description: '从头顶后场(4)到正手网前(3)的前后启动步伐：快速向前移动，转为正手握拍接球。',
                        isFree: false,
                        videos: ['前后启动4-3.mp4']
                    },
                    '5-2': {
                        name: '正手后场到反手网前',
                        description: '从正手后场(5)到反手网前(2)的前后启动步伐：快速向前并向左移动，需要良好的脚步灵活性。',
                        isFree: false,
                        videos: ['前后启动5-2.mp4']
                    },
                    '5-3': {
                        name: '正手后场到正手网前',
                        description: '从正手后场(5)到正手网前(3)的前后启动步伐：快速向前移动，保持正手击球姿势。',
                        isFree: false,
                        videos: ['前后启动5-3.mp4']
                    }
                }
            }
        };
    }

    // 获取所有步伐类型
    getStepTypes() {
        return Object.keys(this.stepConfig);
    }

    // 获取指定类型的步伐配置
    getStepConfig(type) {
        return this.stepConfig[type] || null;
    }

    // 获取指定类型的所有步伐
    getSteps(type) {
        return this.stepConfig[type]?.steps || {};
    }

    // 获取指定步伐的详细信息
    getStepInfo(type, sequence) {
        return this.stepConfig[type]?.steps?.[sequence] || null;
    }

    // 检查步伐是否免费
    isStepFree(type, sequence) {
        return this.stepConfig[type]?.steps?.[sequence]?.isFree || false;
    }

    // 获取所有免费步伐
    getFreeSteps() {
        const freeSteps = {};
        for (const [type, config] of Object.entries(this.stepConfig)) {
            freeSteps[type] = {
                name: config.name,
                steps: {}
            };
            for (const [sequence, step] of Object.entries(config.steps)) {
                if (step.isFree) {
                    freeSteps[type].steps[sequence] = step;
                }
            }
        }
        return freeSteps;
    }

    // 获取所有付费步伐
    getPaidSteps() {
        const paidSteps = {};
        for (const [type, config] of Object.entries(this.stepConfig)) {
            paidSteps[type] = {
                name: config.name,
                steps: {}
            };
            for (const [sequence, step] of Object.entries(config.steps)) {
                if (!step.isFree) {
                    paidSteps[type].steps[sequence] = step;
                }
            }
        }
        return paidSteps;
    }

    // 获取步伐统计信息
    getStepStats() {
        const stats = {
            total: 0,
            free: 0,
            paid: 0,
            byType: {}
        };

        for (const [type, config] of Object.entries(this.stepConfig)) {
            const typeStats = {
                total: 0,
                free: 0,
                paid: 0
            };

            for (const step of Object.values(config.steps)) {
                typeStats.total++;
                if (step.isFree) {
                    typeStats.free++;
                    stats.free++;
                } else {
                    typeStats.paid++;
                    stats.paid++;
                }
            }

            stats.byType[type] = typeStats;
            stats.total += typeStats.total;
        }

        return stats;
    }

    // 添加新的步伐
    addStep(type, sequence, stepData) {
        if (!this.stepConfig[type]) {
            this.stepConfig[type] = {
                name: stepData.typeName || type,
                description: stepData.typeDescription || '',
                steps: {}
            };
        }

        this.stepConfig[type].steps[sequence] = {
            name: stepData.name,
            description: stepData.description,
            isFree: stepData.isFree || false,
            videos: stepData.videos || []
        };

        return true;
    }

    // 从文件路径自动扫描视频文件
    scanVideoFiles(videoPaths) {
        // 这里可以添加自动扫描视频文件的逻辑
        // 暂时返回现有的配置
        return this.stepConfig;
    }
}

// 创建全局实例
const stepConfig = new StepConfig();

// 导出给其他模块使用
window.stepConfig = stepConfig;