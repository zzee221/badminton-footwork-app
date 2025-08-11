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
                        patterns: [
                            {
                                name: '基础步伐',
                                description: '基础步伐是平行启动反手网前动作的标准版本，注重基础动作的规范性：保持重心稳定，小步快速移动，反手握拍准备充分，适合初学者掌握基本移动节奏。',
                                isFree: true,
                                videos: ['平行启动1-2.mp4']
                            },
                            {
                                name: '进阶步伐',
                                description: '进阶步伐在基础步伐上增加了更快的启动速度和更小的步幅，强调反应速度和身体协调性，适合有一定基础的球员提升实战表现。',
                                isFree: false,
                                videos: ['平行启动1-2（1）.mp4']
                            }
                        ]
                    },
                    '1-3': {
                        name: '中心到正手网前',
                        description: '从中心位置(1)到正手网前(3)的平行启动步伐：双脚平行站立，快速向右侧移动，用正手握拍接球。',
                        patterns: [
                            {
                                name: '基础步伐',
                                description: '基础步伐是平行启动正手网前动作的标准版本，注重右侧移动的流畅性和正手握拍的准确性，保持身体平衡，步幅适中，是正手网前技术的基础。',
                                isFree: true,
                                videos: ['平行启动1-3.mp4']
                            },
                            {
                                name: '进阶步伐',
                                description: '进阶步伐采用更快的启动速度和更有力的蹬地动作，强调身体侧身转体的协调性，提高移动效率，适合比赛中快速反应和主动进攻的需要。',
                                isFree: false,
                                videos: ['平行启动1-3（1）.mp4']
                            }
                        ]
                    },
                    '1-4': {
                        name: '中心到头顶后场',
                        description: '从中心位置(1)到头顶后场(4)的平行启动步伐：双脚平行站立，快速向左后方移动，用头顶击球技术接球。',
                        patterns: [
                            {
                                name: '基础步伐',
                                description: '基础步伐是平行启动头顶后场动作的核心版本，重点在于向后移动时保持身体平衡，用头顶击球技术处理高远球，是后场防守的基础技术。注重转身协调性和步法的连贯性。',
                                isFree: true,
                                videos: ['平行启动1-4.mp4']
                            }
                        ]
                    },
                    '1-5': {
                        name: '中心到正手后场',
                        description: '从中心位置(1)到正手后场(5)的平行启动步伐：双脚平行站立，快速向右后方移动，用正手高球或杀球技术接球。',
                        patterns: [
                            {
                                name: '基础步伐',
                                description: '基础步伐是平行启动正手后场动作的标准版本，注重右后方移动的步法协调性，保持正手击球姿势，是正手后场技术的基础移动方式。强调身体重心的控制和移动的流畅性。',
                                isFree: true,
                                videos: ['平行启动1-5.mp4']
                            },
                            {
                                name: '进阶步伐',
                                description: '进阶步伐包含两种技术变体：第一种强调更快的启动速度和更强的爆发力，第二种采用被动交叉步法，适用于被动手位，两种变体大大增强了后场击球的灵活性和威力。',
                                isFree: false,
                                videos: ['平行启动1-5（1）.mp4', '平行启动1-5（被动交叉）.mp4']
                            }
                        ]
                    },
                    '1-6': {
                        name: '中心到反手中场',
                        description: '从中心位置(1)到反手中场(6)的平行启动步伐：双脚平行站立，快速向左侧移动，用反手击球技术接球。',
                        patterns: [
                            {
                                name: '基础步伐',
                                isFree: false,
                                videos: ['平行启动1-6.mp4']
                            },
                            {
                                name: '跨步勾对角',
                                isFree: false,
                                videos: ['平行启动1-6（跨步勾对角）.mp4']
                            },
                            {
                                name: '跨步',
                                isFree: false,
                                videos: ['平行启动1-6（跨步）.mp4']
                            }
                        ]
                    },
                    '1-7': {
                        name: '中心到正手中场',
                        description: '从中心位置(1)到正手中场(7)的平行启动步伐：双脚平行站立，快速向右侧移动，用正手击球技术接球。',
                        patterns: [
                            {
                                name: '基础步伐',
                                isFree: false,
                                videos: ['平行启动1-7.mp4']
                            },
                            {
                                name: '小跳',
                                isFree: false,
                                videos: ['平行启动1-7（小跳）.mp4']
                            }
                        ]
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
                        patterns: [
                            {
                                name: '基础步伐',
                                isFree: true,
                                videos: ['前后启动1-2.mp4']
                            }
                        ]
                    },
                    '1-3': {
                        name: '中心到正手网前',
                        description: '从中心位置(1)到正手网前(3)的前后启动步伐：前后脚站立，快速向右侧前方移动，用正手握拍接球。',
                        patterns: [
                            {
                                name: '基础步伐',
                                isFree: true,
                                videos: ['前后启动1-3.mp4']
                            }
                        ]
                    },
                    '1-4': {
                        name: '中心到头顶后场',
                        description: '从中心位置(1)到头顶后场(4)的前后启动步伐：前后脚站立，快速向左后方移动，用头顶击球技术接球。',
                        patterns: [
                            {
                                name: '基础步伐',
                                isFree: true,
                                videos: ['前后启动1-4.mp4']
                            },
                            {
                                name: '进阶步伐',
                                isFree: false,
                                videos: ['前后启动1-4（1）.mp4']
                            }
                        ]
                    },
                    '1-5': {
                        name: '中心到正手后场',
                        description: '从中心位置(1)到正手后场(5)的前后启动步伐：前后脚站立，快速向右后方移动，用正手高球或杀球技术接球。',
                        patterns: [
                            {
                                name: '基础步伐',
                                isFree: true,
                                videos: ['前后启动1-5.mp4']
                            },
                            {
                                name: '进阶步伐',
                                isFree: false,
                                videos: ['前后启动1-5（单脚杀）.mp4', '前后启动1-5（并步）.mp4']
                            }
                        ]
                    },
                    '2-4': {
                        name: '反手网前到头顶后场',
                        description: '从反手网前(2)到头顶后场(4)的前后启动步伐：先回撤，再向左后方移动，适合应对对方的挑高球。',
                        patterns: [
                            {
                                name: '基础步伐',
                                isFree: false,
                                videos: ['前后启动2-4.mp4']
                            }
                        ]
                    },
                    '2-5': {
                        name: '反手网前到正手后场',
                        description: '从反手网前(2)到正手后场(5)的前后启动步伐：快速转身，向右后方移动，需要良好的身体协调性。',
                        patterns: [
                            {
                                name: '基础步伐',
                                isFree: false,
                                videos: ['前后启动2-5.mp4']
                            }
                        ]
                    },
                    '3-4': {
                        name: '正手网前到头顶后场',
                        description: '从正手网前(3)到头顶后场(4)的前后启动步伐：快速转身，向左后方移动，适合应对对方的对角线挑高球。',
                        patterns: [
                            {
                                name: '基础步伐',
                                isFree: false,
                                videos: ['前后启动3-4.mp4']
                            },
                            {
                                name: '交叉步伐',
                                isFree: false,
                                videos: ['前后启动3-4（交叉）.mp4']
                            }
                        ]
                    },
                    '3-5': {
                        name: '正手网前到正手后场',
                        description: '从正手网前(3)到正手后场(5)的前后启动步伐：直接向后移动，保持正手击球姿势。',
                        patterns: [
                            {
                                name: '基础步伐',
                                isFree: false,
                                videos: ['前后启动3-5.mp4']
                            },
                            {
                                name: '主动步伐',
                                isFree: false,
                                videos: ['前后启动3-5（主动）.mp4']
                            }
                        ]
                    },
                    '4-2': {
                        name: '头顶后场到反手网前',
                        description: '从头顶后场(4)到反手网前(2)的前后启动步伐：快速向前移动，转为反手握拍接球。',
                        patterns: [
                            {
                                name: '基础步伐',
                                isFree: false,
                                videos: ['前后启动4-2.mp4']
                            }
                        ]
                    },
                    '4-3': {
                        name: '头顶后场到正手网前',
                        description: '从头顶后场(4)到正手网前(3)的前后启动步伐：快速向前移动，转为正手握拍接球。',
                        patterns: [
                            {
                                name: '基础步伐',
                                isFree: false,
                                videos: ['前后启动4-3.mp4']
                            }
                        ]
                    },
                    '5-2': {
                        name: '正手后场到反手网前',
                        description: '从正手后场(5)到反手网前(2)的前后启动步伐：快速向前并向左移动，需要良好的脚步灵活性。',
                        patterns: [
                            {
                                name: '基础步伐',
                                isFree: false,
                                videos: ['前后启动5-2.mp4']
                            }
                        ]
                    },
                    '5-3': {
                        name: '正手后场到正手网前',
                        description: '从正手后场(5)到正手网前(3)的前后启动步伐：快速向前移动，保持正手击球姿势。',
                        patterns: [
                            {
                                name: '基础步伐',
                                isFree: false,
                                videos: ['前后启动5-3.mp4']
                            }
                        ]
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

    // 检查步伐是否免费（检查是否有免费模式）
    isStepFree(type, sequence) {
        const step = this.stepConfig[type]?.steps?.[sequence];
        if (!step) return false;
        
        // 检查是否有任何免费模式
        return step.patterns.some(pattern => pattern.isFree);
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
                if (this.isStepFree(type, sequence)) {
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
                if (!this.isStepFree(type, sequence)) {
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

            for (const [sequence, step] of Object.entries(config.steps)) {
                typeStats.total++;
                if (this.isStepFree(type, sequence)) {
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
            patterns: stepData.patterns || []
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