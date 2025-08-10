// 数据库化步伐配置管理类
// 替代原有的 step-config.js 文件
// 创建时间：2025-08-10

class DatabaseStepConfig {
    constructor() {
        this.supabase = window.supabase;
        this.cache = {
            stepTypes: null,
            stepCombinations: null,
            stepPatterns: null,
            stepVideos: null,
            lastUpdate: null
        };
        this.cacheTimeout = 5 * 60 * 1000; // 5分钟缓存
    }

    // 检查缓存是否过期
    isCacheValid() {
        return this.cache.lastUpdate && 
               (Date.now() - this.cache.lastUpdate < this.cacheTimeout);
    }

    // 清空缓存
    clearCache() {
        this.cache = {
            stepTypes: null,
            stepCombinations: null,
            stepPatterns: null,
            stepVideos: null,
            lastUpdate: null
        };
    }

    // 获取所有步伐类型
    async getStepTypes() {
        if (this.cache.stepTypes && this.isCacheValid()) {
            return this.cache.stepTypes;
        }

        try {
            const { data, error } = await this.supabase
                .from('step_types')
                .select('*')
                .eq('is_active', true)
                .order('display_order');

            if (error) throw error;
            
            this.cache.stepTypes = data;
            this.cache.lastUpdate = Date.now();
            return data;
        } catch (error) {
            console.error('获取步伐类型失败:', error);
            return [];
        }
    }

    // 获取指定类型的步伐配置
    async getStepConfig(typeKey) {
        try {
            // 获取类型信息
            const { data: typeData, error: typeError } = await this.supabase
                .from('step_types')
                .select('*')
                .eq('type_key', typeKey)
                .eq('is_active', true)
                .single();

            if (typeError) throw typeError;

            // 获取该类型的所有步伐组合
            const { data: combinations, error: comboError } = await this.supabase
                .from('step_combinations')
                .select('*')
                .eq('step_type_id', typeData.id)
                .eq('is_active', true)
                .order('display_order');

            if (comboError) throw comboError;

            // 获取每个组合的模式和视频
            const steps = {};
            for (const combo of combinations) {
                const { data: patterns, error: patternError } = await this.supabase
                    .from('step_patterns')
                    .select('*')
                    .eq('combination_id', combo.id)
                    .eq('is_active', true)
                    .order('display_order');

                if (patternError) throw patternError;

                const patternsWithVideos = [];
                for (const pattern of patterns) {
                    const { data: videos, error: videoError } = await this.supabase
                        .from('step_videos')
                        .select('*')
                        .eq('pattern_id', pattern.id)
                        .eq('is_active', true)
                        .order('display_order');

                    if (videoError) throw videoError;

                    patternsWithVideos.push({
                        name: pattern.name,
                        description: pattern.description,
                        isFree: pattern.is_free,
                        videos: videos.map(v => v.video_name)
                    });
                }

                steps[combo.sequence] = {
                    name: combo.name,
                    description: combo.description,
                    patterns: patternsWithVideos
                };
            }

            return {
                name: typeData.name,
                description: typeData.description,
                steps: steps
            };
        } catch (error) {
            console.error('获取步伐配置失败:', error);
            return null;
        }
    }

    // 获取指定类型的所有步伐
    async getSteps(typeKey) {
        const config = await this.getStepConfig(typeKey);
        return config ? config.steps : {};
    }

    // 获取指定步伐的详细信息
    async getStepInfo(typeKey, sequence) {
        const steps = await this.getSteps(typeKey);
        return steps[sequence] || null;
    }

    // 检查步伐是否免费
    async isStepFree(typeKey, sequence) {
        try {
            // 先获取类型ID
            const { data: typeData, error: typeError } = await this.supabase
                .from('step_types')
                .select('id')
                .eq('type_key', typeKey)
                .single();

            if (typeError) {
                console.error('获取步伐类型失败:', typeError);
                return false;
            }

            // 再检查步伐组合是否免费
            const { data, error } = await this.supabase
                .from('step_combinations')
                .select('is_free')
                .eq('sequence', sequence)
                .eq('step_type_id', typeData.id)
                .single();

            if (error) {
                console.error('检查步伐免费状态失败:', error);
                return false;
            }
            
            return data?.is_free || false;
        } catch (error) {
            console.error('检查步伐免费状态失败:', error);
            return false;
        }
    }

    // 获取所有免费步伐
    async getFreeSteps() {
        const stepTypes = await this.getStepTypes();
        const freeSteps = {};

        for (const type of stepTypes) {
            const config = await this.getStepConfig(type.type_key);
            if (config) {
                freeSteps[type.type_key] = {
                    name: config.name,
                    steps: {}
                };

                for (const [sequence, step] of Object.entries(config.steps)) {
                    if (await this.isStepFree(type.type_key, sequence)) {
                        freeSteps[type.type_key].steps[sequence] = step;
                    }
                }
            }
        }

        return freeSteps;
    }

    // 获取所有付费步伐
    async getPaidSteps() {
        const stepTypes = await this.getStepTypes();
        const paidSteps = {};

        for (const type of stepTypes) {
            const config = await this.getStepConfig(type.type_key);
            if (config) {
                paidSteps[type.type_key] = {
                    name: config.name,
                    steps: {}
                };

                for (const [sequence, step] of Object.entries(config.steps)) {
                    if (!(await this.isStepFree(type.type_key, sequence))) {
                        paidSteps[type.type_key].steps[sequence] = step;
                    }
                }
            }
        }

        return paidSteps;
    }

    // 获取步伐统计信息
    async getStepStats() {
        try {
            const { data, error } = await this.supabase
                .from('step_statistics')
                .select('*');

            if (error) throw error;

            const stats = {
                total: 0,
                free: 0,
                paid: 0,
                byType: {}
            };

            for (const typeStat of data) {
                stats.byType[typeStat.type_key] = {
                    total: typeStat.total_combinations,
                    free: typeStat.free_combinations,
                    paid: typeStat.total_combinations - typeStat.free_combinations
                };

                stats.total += typeStat.total_combinations;
                stats.free += typeStat.free_combinations;
            }

            stats.paid = stats.total - stats.free;
            return stats;
        } catch (error) {
            console.error('获取步伐统计失败:', error);
            return { total: 0, free: 0, paid: 0, byType: {} };
        }
    }

    // 获取步伐类型列表（用于UI显示）
    async getStepTypesList() {
        const types = await this.getStepTypes();
        return types.map(type => ({
            key: type.type_key,
            name: type.name,
            description: type.description
        }));
    }

    // 获取所有步伐组合（用于步伐列表）
    async getAllStepCombinations(typeKey = null) {
        try {
            let query = this.supabase
                .from('step_details')
                .select('*');

            if (typeKey) {
                query = query.eq('type_key', typeKey);
            }

            const { data, error } = await query;

            if (error) throw error;

            // 按类型分组
            const grouped = {};
            for (const item of data) {
                if (!grouped[item.type_key]) {
                    grouped[item.type_key] = {
                        typeName: item.type_name,
                        combinations: []
                    };
                }

                grouped[item.type_key].combinations.push({
                    sequence: item.sequence,
                    name: item.combination_name,
                    description: item.combination_description,
                    isFree: item.combination_is_free,
                    patternName: item.pattern_name,
                    patternIsFree: item.pattern_is_free,
                    videoName: item.video_name,
                    filePath: item.file_path
                });
            }

            return grouped;
        } catch (error) {
            console.error('获取步伐组合失败:', error);
            return {};
        }
    }

    // 获取指定组合的所有视频
    async getStepVideos(typeKey, sequence) {
        try {
            const { data, error } = await this.supabase
                .from('step_details')
                .select('*')
                .eq('type_key', typeKey)
                .eq('sequence', sequence)
                .order('pattern_display_order', { ascending: true })
                .order('video_display_order', { ascending: true });

            if (error) throw error;

            // 按模式分组视频
            const grouped = {};
            for (const item of data) {
                const patternKey = `${item.pattern_name}_${item.pattern_is_free}`;
                if (!grouped[patternKey]) {
                    grouped[patternKey] = {
                        name: item.pattern_name,
                        isFree: item.pattern_is_free,
                        videos: []
                    };
                }
                grouped[patternKey].videos.push({
                    name: item.video_name,
                    path: item.file_path
                });
            }

            return Object.values(grouped);
        } catch (error) {
            console.error('获取步伐视频失败:', error);
            return [];
        }
    }

    // 兼容性方法：保持与原 step-config.js 相同的接口
    getStepTypesSync() {
        // 这个方法用于同步调用，但数据可能不是最新的
        // 建议使用异步的 getStepTypes()
        return this.cache.stepTypes || [];
    }

    // 兼容性方法：同步获取步伐配置（可能使用缓存数据）
    async getStepConfigSync(typeKey) {
        return await this.getStepConfig(typeKey);
    }
}

// 创建全局实例
const databaseStepConfig = new DatabaseStepConfig();

// 导出给其他模块使用
window.databaseStepConfig = databaseStepConfig;

// 为了保持兼容性，也导出为 stepConfig
window.stepConfig = databaseStepConfig;

// 导出类定义（如果需要）
window.DatabaseStepConfig = DatabaseStepConfig;