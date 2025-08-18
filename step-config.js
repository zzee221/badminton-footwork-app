// 步伐配置文件 - 用于自动化管理步伐数据
class StepConfig {
    constructor() {
        // 所有可用的步伐配置（按性别分类）
        this.stepConfig = {
            male: {
            parallel: {
                name: '平行启动',
                description: '平行启动是一种防守站位的启动方式，双脚平行站立，适合应对高球，能够快速向各个方向移动。',
                steps: {
                    '1-2': {
                        name: '中心到反手网前',
                        description: '从中心位置(1)到反手网前(2)的平行启动步伐：起高球后，防守导向的平行启动，对手吊球反手前场区域。',
                        patterns: [
                            {
                                name: '反手蹬跨上网',
                                description: '平行分腿启动+跨步上网，关键点是右脚发力，一步带动整个身体，落地衔接弓步。',
                                isFree: true,
                                videos: ['平行启动1-2.mp4']
                            },
                            {
                                name: '反手蹬跨上网',
                                description: '平行分腿启动+跨步上网，关键点是右脚发力，一步带动整个身体，落地衔接弓步。',
                                isFree: true,
                                videos: ['平行启动1-2（1）.mp4']
                            }
                        ]
                    },
                    '1-3': {
                        name: '中心到正手网前',
                        description: '从中心位置(1)到正手网前(3)的平行启动步伐：起高球后，防守导向的平行启动，对手吊球正手前场区域。',
                        patterns: [
                            {
                                name: '正手并步上网',
                                description: '平行分腿启动+并步上网，关键点是左脚发力，推动身体重心移动，落地衔接弓步',
                                isFree: true,
                                videos: ['平行启动1-3.mp4']
                            },
                            {
                                name: '正手并步上网',
                                description: '平行分腿启动+并步上网，关键点是左脚发力，推动身体重心移动，落地衔接弓步',
                                isFree: true,
                                videos: ['平行启动1-3（1）.mp4']
                            }
                        ]
                    },
                    '1-4': {
                        name: '中心到头顶后场',
                        description: '从中心位置(1)到头顶后场(4)的平行启动步伐：起高球后，防守导向的平行启动，对手高远头顶后场。',
                        patterns: [
                            {
                                name: '头顶后退步伐（马来步）',
                                description: '马来步，右脚在侧身向后迈的同时，左脚加一个后退的小垫步以增加后退距离；适用于突击提速。',
                                isFree: true,
                                videos: ['平行启动1-4.mp4']
                            }
                        ]
                    },
                    '1-5': {
                        name: '中心到正手后场',
                        description: '从中心位置(1)到正手后场(5)的平行启动步伐：起高球后，防守导向的平行启动，对手高远正手后场。',
                        patterns: [
                            {
                                name: '正手后退步伐（并步）',
                                description: '左脚发力，推动身体中心向右后方并步移动并侧身，衔接并步回过渡球或者中国跳突击。适用于较为主动状态。',
                                isFree: true,
                                videos: ['平行启动1-5.mp4','平行启动1-5（1）.mp4']
                            },
                            {
                                name: '正手后退步伐（交叉）',
                                description: '右脚调整身体朝向，关键点是采取后交叉+蹬跨步。适用于被动低手位击球。',
                                isFree: true,
                                videos: [ '平行启动1-5（被动交叉）.mp4']
                            }
                        ]
                    },
                    '1-6': {
                        name: '中心到反手中场',
                        description: '从中心位置(1)到反手中场(6)的平行启动步伐：起高球后，防守导向的平行启动，对手杀球反手区。',
                        patterns: [
                            {
                                name: '反手位接杀步伐（转身）',
                                description: '待补充',
                                isFree: true,
                                videos: ['平行启动1-6.mp4']
                            },
                            {
                                name: '反手位接杀步伐（跨步）',
                                description: '待补充',
                                isFree: true,
                                videos: ['平行启动1-6（跨步）.mp4','平行启动1-6（跨步勾对角）.mp4']
                            },
                        ]
                    },
                    '1-7': {
                        name: '中心到正手中场',
                        description: '从中心位置(1)到正手中场(7)的平行启动步伐：双脚平行站立，快速向右侧移动，用正手击球技术接球。',
                        patterns: [
                            {
                                name: '基础步伐',
                                description: '',
                                isFree: true,
                                videos: ['平行启动1-7.mp4']
                            },
                            {
                                name: '小跳',
                                description: '',
                                isFree: true,
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
                                description: '',
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
                                description: '',
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
                                description: '',
                                isFree: true,
                                videos: ['前后启动1-4.mp4']
                            },
                            {
                                name: '进阶步伐',
                                description: '',
                                isFree: true,
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
                                description: '',
                                isFree: true,
                                videos: ['前后启动1-5.mp4']
                            },
                            {
                                name: '进阶步伐',
                                description: '',
                                isFree: true,
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
                                description: '',
                                isFree: true,
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
                                description: '',
                                isFree: true,
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
                                description: '',
                                isFree: true,
                                videos: ['前后启动3-4.mp4']
                            },
                            {
                                name: '交叉步伐',
                                description: '',
                                isFree: true,
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
                                description: '',
                                isFree: true,
                                videos: ['前后启动3-5.mp4']
                            },
                            {
                                name: '主动步伐',
                                description: '',
                                isFree: true,
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
                                description: '',
                                isFree: true,
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
                                description: '',
                                isFree: true,
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
                                description: '',
                                isFree: true,
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
                                description: '',
                                isFree: true,
                                videos: ['前后启动5-3.mp4']
                            }
                        ]
                    }
                }
            }
        },
            female: {
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
                                }
                            ]
                        },
                        '1-4': {
                            name: '中心到头顶后场',
                            description: '从中心位置(1)到头顶后场(4)的平行启动步伐：双脚平行站立，快速向左后方移动，用头顶击球技术接球。',
                            patterns: [
                                {
                                    name: '小碎步',
                                    description: '小碎步是平行启动头顶后场动作的基础版本，采用小步快频的移动方式，注重身体平衡和步法的稳定性，适合初学者掌握后场移动的基本节奏。',
                                    isFree: true,
                                    videos: ['平行启动1-4（小碎步）.mp4']
                                },
                                {
                                    name: '马来步',
                                    description: '马来步是头顶后场技术的高级版本，采用更具爆发力的启动方式和更流畅的转身动作，强调身体协调性和步法的连贯性，适合比赛中快速处理高远球。',
                                    isFree: true,
                                    videos: ['平行启动1-4（马来步）.mp4']
                                }
                            ]
                        },
                        '1-5': {
                            name: '中心到正手后场',
                            description: '从中心位置(1)到正手后场(5)的平行启动步伐：双脚平行站立，快速向右后方移动，用正手高球或杀球技术接球。',
                            patterns: [
                                {
                                    name: '并步',
                                    description: '并步是平行启动正手后场动作的标准版本，采用并步移动方式，强调步法的紧凑性和移动效率，适合在狭小空间内快速调整位置。',
                                    isFree: true,
                                    videos: ['平行启动1-5（并步）.mp4']
                                },
                                {
                                    name: '交叉',
                                    description: '交叉是平行启动正手后场动作的进阶版本，采用交叉步移动方式，强调步法的连贯性和移动效率，适合比赛中快速处理正手后场球。',
                                    isFree: true,
                                    videos: ['平行启动1-5（交叉）.mp4']
                                }
                            ]
                        },
                        '1-6': {
                            name: '中心到反手中场',
                            description: '从中心位置(1)到反手中场(6)的平行启动步伐：双脚平行站立，快速向左侧移动，用反手击球技术接球。',
                            patterns: [
                                {
                                    name: '基础步伐',
                                    isFree: true,
                                    videos: ['平行启动1-6.mp4']
                                }
                            ]
                        },
                        '1-7': {
                            name: '中心到正手中场',
                            description: '从中心位置(1)到正手中场(7)的平行启动步伐：双脚平行站立，快速向右侧移动，用正手击球技术接球。',
                            patterns: [
                                {
                                    name: '基础步伐',
                                    description: '基础步伐是平行启动正手中场动作的标准版本，注重右侧移动的流畅性和正手握拍的准确性，保持身体平衡，是正手中场技术的基础移动方式。',
                                    isFree: true,
                                    videos: ['平行启动1-7.mp4']
                                },
                                {
                                    name: '小跳',
                                    description: '小跳是平行启动正手中场动作的进阶版本，采用小跳步移动方式，强调启动速度和身体协调性，适合比赛中快速反应和主动进攻的需要。',
                                    isFree: true,
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
                                    description: '基础步伐是前后启动中心到反手网前动作的标准版本，注重左侧前方移动的流畅性和反手握拍的准确性，保持身体平衡，是反手网前技术的基础移动方式。',
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
                                    description: '基础步伐是前后启动中心到正手网前动作的标准版本，注重右侧前方移动的流畅性和正手握拍的准确性，保持身体平衡，是正手网前技术的基础移动方式。',
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
                                    name: '小碎步',
                                    description: '小碎步是前后启动头顶后场动作的基础版本，采用小步快频的移动方式，注重身体平衡和步法的稳定性，适合初学者掌握后场移动的基本节奏。',
                                    isFree: true,
                                    videos: ['前后启动1-4（小碎步）.mp4']
                                },
                                {
                                    name: '马来步',
                                    description: '马来步是前后启动头顶后场动作的进阶版本，采用更具爆发力的启动方式和更流畅的转身动作，强调身体协调性和步法的连贯性，适合比赛中快速处理高远球。',
                                    isFree: true,
                                    videos: ['前后启动1-4（马来步）.mp4']
                                }
                            ]
                        },
                        '1-5': {
                            name: '中心到正手后场',
                            description: '从中心位置(1)到正手后场(5)的前后启动步伐：前后脚站立，快速向右后方移动，用正手击球技术接球。',
                            patterns: [
                                {
                                    name: '基础步伐',
                                    description: '基础步伐是前后启动正手后场动作的标准版本，注重右后方移动的步法协调性，保持正手击球姿势，是正手后场技术的基础移动方式。强调身体重心的控制和移动的流畅性。',
                                    isFree: true,
                                    videos: ['前后启动1-5.mp4']
                                }
                            ]
                        },
                        '2-3': {
                            name: '反手网前到正手网前',
                            description: '从反手网前(2)到正手网前(3)的前后启动步伐：从左侧网前快速移动到右侧网前，需要快速的横向移动能力。',
                            patterns: [
                                {
                                    name: '基础步伐',
                                    description: '基础步伐是前后启动反手网前到正手网前动作的标准版本，注重横向移动的流畅性和脚步转换的协调性，是网前横向移动的基础技术。',
                                    isFree: true,
                                    videos: ['前后启动2-3.mp4']
                                }
                            ]
                        },
                        '3-2': {
                            name: '正手网前到反手网前',
                            description: '从正手网前(3)到反手网前(2)的前后启动步伐：从右侧网前快速移动到左侧网前，需要快速的横向移动能力和握拍转换。',
                            patterns: [
                                {
                                    name: '基础步伐',
                                    description: '基础步伐是前后启动正手网前到反手网前动作的标准版本，注重横向移动的流畅性和握拍转换的协调性，是网前横向移动的基础技术。',
                                    isFree: true,
                                    videos: ['前后启动3-2.mp4']
                                }
                            ]
                        },
                        '2-4': {
                            name: '反手网前到头顶后场',
                            description: '从反手网前(2)到头顶后场(4)的前后启动步伐：先回撤，再向左后方移动，适合应对对方的挑高球。',
                            patterns: [
                                {
                                    name: '基础步伐',
                                    description: '基础步伐是前后启动反手网前到头顶后场动作的标准版本，注重回撤和左后方移动的流畅性，保持身体平衡，是反手网前到头顶后场技术的基础移动方式。',
                                    isFree: true,
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
                                    description: '基础步伐是前后启动反手网前到正手后场动作的标准版本，注重转身和右后方移动的协调性，保持身体平衡，是反手网前到正手后场技术的基础移动方式。',
                                    isFree: true,
                                    videos: ['前后启动2-5.mp4']
                                }
                            ]
                        },
                        '3-4': {
                            name: '正手网前到头顶后场',
                            description: '从正手网前(3)到头顶后场(4)的前后启动步伐：快速转身，向左后方移动，适合应对对方的对角线挑高球。',
                            patterns: [
                                {
                                    name: '反手',
                                    description: '反手是前后启动正手网前到头顶后场动作的基础版本，采用反手击球技术处理头顶后场球，注重转身协调性和反手握拍的准确性，适合应对对角线挑高球。',
                                    isFree: true,
                                    videos: ['前后启动3-4（反手）.mp4']
                                },
                                {
                                    name: '马来步',
                                    description: '马来步是前后启动正手网前到头顶后场动作的进阶版本，采用更具爆发力的启动方式和更流畅的转身动作，强调身体协调性和步法的连贯性，适合比赛中快速处理高远球。',
                                    isFree: true,
                                    videos: ['前后启动3-4（马来步）.mp4']
                                }
                            ]
                        },
                        '3-5': {
                            name: '正手网前到正手后场',
                            description: '从正手网前(3)到正手后场(5)的前后启动步伐：直接向后移动，保持正手击球姿势。',
                            patterns: [
                                {
                                    name: '基础步伐',
                                    description: '基础步伐是前后启动正手网前到正手后场动作的标准版本，注重向后移动的流畅性和正手握拍的准确性，保持身体平衡，是正手网前到正手后场技术的基础移动方式。',
                                    isFree: true,
                                    videos: ['前后启动3-5.mp4']
                                }
                            ]
                        },
                        '4-2': {
                            name: '头顶后场到反手网前',
                            description: '从头顶后场(4)到反手网前(2)的前后启动步伐：快速向前移动，转为反手握拍接球。',
                            patterns: [
                                {
                                    name: '基础步伐',
                                    description: '基础步伐是前后启动头顶后场到反手网前动作的标准版本，注重向前移动的流畅性和反手握拍的准确性，保持身体平衡，是头顶后场到反手网前技术的基础移动方式。',
                                    isFree: true,
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
                                    description: '基础步伐是前后启动头顶后场到正手网前动作的标准版本，注重向前移动的流畅性和正手握拍的准确性，保持身体平衡，是头顶后场到正手网前技术的基础移动方式。',
                                    isFree: true,
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
                                    description: '基础步伐是前后启动正手后场到反手网前动作的标准版本，注重向前向左移动的流畅性和握拍转换的协调性，保持身体平衡，是正手后场到反手网前技术的基础移动方式。',
                                    isFree: true,
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
                                    description: '基础步伐是前后启动正手后场到正手网前动作的标准版本，注重向前移动的流畅性和正手握拍的准确性，保持身体平衡，是正手后场到正手网前技术的基础移动方式。',
                                    isFree: true,
                                    videos: ['前后启动5-3.mp4']
                                }
                            ]
                        }
                    }
                }
            }
        };
    }

    // 获取所有性别分类
    getGenderCategories() {
        return Object.keys(this.stepConfig);
    }

    // 获取指定性别的所有步伐类型
    getStepTypes(gender = 'male') {
        return Object.keys(this.stepConfig[gender] || {});
    }

    // 获取指定性别和类型的步伐配置
    getStepConfig(gender, type) {
        return this.stepConfig[gender]?.[type] || null;
    }

    // 获取指定性别和类型的所有步伐
    getSteps(gender, type) {
        return this.stepConfig[gender]?.[type]?.steps || {};
    }

    // 获取指定步伐的详细信息
    getStepInfo(gender, type, sequence) {
        return this.stepConfig[gender]?.[type]?.steps?.[sequence] || null;
    }

    // 检查步伐是否免费（检查是否有免费模式）
    isStepFree(gender, type, sequence) {
        const step = this.stepConfig[gender]?.[type]?.steps?.[sequence];
        if (!step) return false;
        
        // 检查是否有任何免费模式
        return step.patterns.some(pattern => pattern.isFree);
    }

    // 获取指定性别的所有免费步伐
    getFreeSteps(gender = 'male') {
        const freeSteps = {};
        const genderConfig = this.stepConfig[gender] || {};
        for (const [type, config] of Object.entries(genderConfig)) {
            freeSteps[type] = {
                name: config.name,
                steps: {}
            };
            for (const [sequence, step] of Object.entries(config.steps)) {
                if (this.isStepFree(gender, type, sequence)) {
                    freeSteps[type].steps[sequence] = step;
                }
            }
        }
        return freeSteps;
    }

    // 获取指定性别的所有付费步伐
    getPaidSteps(gender = 'male') {
        const paidSteps = {};
        const genderConfig = this.stepConfig[gender] || {};
        for (const [type, config] of Object.entries(genderConfig)) {
            paidSteps[type] = {
                name: config.name,
                steps: {}
            };
            for (const [sequence, step] of Object.entries(config.steps)) {
                if (!this.isStepFree(gender, type, sequence)) {
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
            byGender: {}
        };

        for (const [gender, genderConfig] of Object.entries(this.stepConfig)) {
            const genderStats = {
                total: 0,
                free: 0,
                paid: 0,
                byType: {}
            };

            for (const [type, config] of Object.entries(genderConfig)) {
                const typeStats = {
                    total: 0,
                    free: 0,
                    paid: 0
                };

                for (const [sequence, step] of Object.entries(config.steps)) {
                    typeStats.total++;
                    if (this.isStepFree(gender, type, sequence)) {
                        typeStats.free++;
                        genderStats.free++;
                        stats.free++;
                    } else {
                        typeStats.paid++;
                        genderStats.paid++;
                        stats.paid++;
                    }
                }

                genderStats.byType[type] = typeStats;
                genderStats.total += typeStats.total;
            }

            stats.byGender[gender] = genderStats;
            stats.total += genderStats.total;
        }

        return stats;
    }

    // 添加新的步伐
    addStep(gender, type, sequence, stepData) {
        if (!this.stepConfig[gender]) {
            this.stepConfig[gender] = {};
        }
        
        if (!this.stepConfig[gender][type]) {
            this.stepConfig[gender][type] = {
                name: stepData.typeName || type,
                description: stepData.typeDescription || '',
                steps: {}
            };
        }

        this.stepConfig[gender][type].steps[sequence] = {
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
    
    // 向后兼容的方法 - 默认使用男单数据
    getStepTypesLegacy() {
        return this.getStepTypes('male');
    }
    
    getStepConfigLegacy(type) {
        return this.getStepConfig('male', type);
    }
    
    getStepsLegacy(type) {
        return this.getSteps('male', type);
    }
    
    getStepInfoLegacy(type, sequence) {
        return this.getStepInfo('male', type, sequence);
    }
    
    isStepFreeLegacy(type, sequence) {
        return this.isStepFree('male', type, sequence);
    }
    
    getFreeStepsLegacy() {
        return this.getFreeSteps('male');
    }
    
    getPaidStepsLegacy() {
        return this.getPaidSteps('male');
    }
}

// 创建全局实例
const stepConfig = new StepConfig();

// 导出给其他模块使用
window.stepConfig = stepConfig;