// 增强版AI桌位分配算法 - 支持智能分开/合并桌子
class EnhancedTableAllocationAI {
    constructor() {
        this.name = 'MapleTable Enhanced AI v2.0';
        this.algorithms = {
            singleTable: 'SingleTableOptimizer',
            tableCombination: 'SmartCombinationEngine', 
            tableSplitting: 'IntelligentSplittingSystem',
            dynamicReallocation: 'RealTimeOptimizer'
        };
        
        // 桌位物理布局数据 (模拟真实餐厅布局)
        this.restaurantLayout = {
            sections: {
                'main': { capacity: 60, tables: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6'] },
                'window': { capacity: 40, tables: ['W1', 'W2', 'W3', 'W4'] },
                'private': { capacity: 20, tables: ['P1', 'P2'] },
                'patio': { capacity: 30, tables: ['PT1', 'PT2', 'PT3'] }
            },
            adjacencyMap: {
                'T1': ['T2'], 'T2': ['T1', 'T3'], 'T3': ['T2', 'T4'],
                'T4': ['T3', 'T5'], 'T5': ['T4', 'T6'], 'T6': ['T5'],
                'W1': ['W2'], 'W2': ['W1', 'W3'], 'W3': ['W2', 'W4'], 'W4': ['W3'],
                'P1': ['P2'], 'P2': ['P1'],
                'PT1': ['PT2'], 'PT2': ['PT1', 'PT3'], 'PT3': ['PT2']
            }
        };
        
        console.log('🤖 Enhanced AI Table Allocation System initialized');
    }
    
    // 主要分配决策引擎
    async allocateOptimalSeating(bookingRequest) {
        const { partySize, dateTime, preferences, groupType, specialRequests } = bookingRequest;
        
        console.log(`🧠 AI分析开始: ${partySize}人, 类型: ${groupType}, 时间: ${dateTime}`);
        
        // 1. 获取可用桌位
        const availableTables = await this.getAvailableTables(bookingRequest);
        
        // 2. 智能决策：选择最佳策略
        const strategy = this.determineOptimalStrategy(partySize, groupType, preferences);
        console.log(`📊 选择策略: ${strategy.name}`);
        
        // 3. 根据策略执行分配
        let allocationResult;
        switch (strategy.type) {
            case 'single':
                allocationResult = await this.executeSingleTableStrategy(availableTables, bookingRequest);
                break;
            case 'combination':
                allocationResult = await this.executeCombinationStrategy(availableTables, bookingRequest);
                break;
            case 'splitting':
                allocationResult = await this.executeSplittingStrategy(availableTables, bookingRequest);
                break;
            case 'hybrid':
                allocationResult = await this.executeHybridStrategy(availableTables, bookingRequest);
                break;
        }
        
        // 4. 优化和验证结果
        const optimizedResult = await this.optimizeAllocation(allocationResult, bookingRequest);
        
        console.log(`✅ AI分配完成: ${optimizedResult.strategy} - ${optimizedResult.summary}`);
        return optimizedResult;
    }
    
    // 策略决策引擎
    determineOptimalStrategy(partySize, groupType, preferences) {
        const strategies = [];
        
        // 单桌策略 (1-6人)
        if (partySize <= 6) {
            strategies.push({
                type: 'single',
                name: '单桌集中式',
                score: 90 + (6 - partySize) * 2,
                reasoning: '小团体最佳选择，便于交流和服务'
            });
        }
        
        // 合并策略 (4-12人)
        if (partySize >= 4 && partySize <= 12) {
            strategies.push({
                type: 'combination',
                name: '智能桌位合并',
                score: 85 + (groupType === 'family' ? 10 : 0),
                reasoning: '相邻桌位合并，保持团体完整性'
            });
        }
        
        // 分割策略 (8+人)
        if (partySize >= 8) {
            strategies.push({
                type: 'splitting',
                name: '优化分桌安排',
                score: 80 + (groupType === 'friends' ? 15 : 0),
                reasoning: '分桌就餐，增加社交互动'
            });
        }
        
        // 混合策略 (10+人特殊场合)
        if (partySize >= 10 && (preferences.includes('celebration') || groupType === 'business')) {
            strategies.push({
                type: 'hybrid',
                name: '混合动态配置',
                score: 88,
                reasoning: '灵活配置，适应复杂需求'
            });
        }
        
        // 选择最高分策略
        strategies.sort((a, b) => b.score - a.score);
        return strategies[0] || { type: 'single', name: '默认单桌', score: 70 };
    }
    
    // 单桌策略执行
    async executeSingleTableStrategy(availableTables, bookingRequest) {
        const { partySize, preferences } = bookingRequest;
        
        // 按匹配度排序
        const scoredTables = availableTables
            .filter(table => table.capacity >= partySize)
            .map(table => ({
                ...table,
                matchScore: this.calculateSingleTableMatch(table, bookingRequest)
            }))
            .sort((a, b) => b.matchScore - a.matchScore);
        
        if (scoredTables.length === 0) {
            return { success: false, reason: '无可用单桌' };
        }
        
        const selectedTable = scoredTables[0];
        
        return {
            success: true,
            strategy: 'single',
            allocation: {
                type: 'single_table',
                tables: [selectedTable],
                totalCapacity: selectedTable.capacity,
                efficiency: partySize / selectedTable.capacity,
                layout: `桌位 ${selectedTable.id} (${selectedTable.capacity}座)`
            },
            summary: `分配单桌 ${selectedTable.id}，容纳 ${partySize} 人`,
            aiReasoning: '单桌用餐提供最佳私密性和服务体验',
            visualLayout: this.generateVisualLayout([selectedTable])
        };
    }
    
    // 合并策略执行
    async executeCombinationStrategy(availableTables, bookingRequest) {
        const { partySize } = bookingRequest;
        const combinations = [];
        
        // 寻找所有可能的两桌组合
        for (let i = 0; i < availableTables.length - 1; i++) {
            for (let j = i + 1; j < availableTables.length; j++) {
                const table1 = availableTables[i];
                const table2 = availableTables[j];
                
                if (this.canCombineTables(table1, table2)) {
                    const totalCapacity = table1.capacity + table2.capacity;
                    
                    if (totalCapacity >= partySize && totalCapacity <= partySize + 4) {
                        const combinationScore = this.calculateCombinationScore(
                            [table1, table2], bookingRequest
                        );
                        
                        combinations.push({
                            tables: [table1, table2],
                            totalCapacity,
                            score: combinationScore,
                            layout: `${table1.id} + ${table2.id} 合并 (${totalCapacity}座)`,
                            adjacency: this.areAdjacent(table1.id, table2.id)
                        });
                    }
                }
            }
        }
        
        // 考虑三桌组合 (大团体)
        if (partySize >= 10) {
            const tripleCombs = this.findTripleCombinations(availableTables, bookingRequest);
            combinations.push(...tripleCombs);
        }
        
        if (combinations.length === 0) {
            return { success: false, reason: '无可用合并配置' };
        }
        
        // 选择最佳组合
        combinations.sort((a, b) => b.score - a.score);
        const bestCombination = combinations[0];
        
        return {
            success: true,
            strategy: 'combination',
            allocation: {
                type: 'table_combination',
                tables: bestCombination.tables,
                totalCapacity: bestCombination.totalCapacity,
                efficiency: partySize / bestCombination.totalCapacity,
                layout: bestCombination.layout,
                isAdjacent: bestCombination.adjacency
            },
            summary: `合并桌位 ${bestCombination.tables.map(t => t.id).join(' + ')}`,
            aiReasoning: '桌位合并保持团体完整性，便于交流互动',
            visualLayout: this.generateVisualLayout(bestCombination.tables)
        };
    }
    
    // 分割策略执行
    async executeSplittingStrategy(availableTables, bookingRequest) {
        const { partySize, groupType } = bookingRequest;
        
        // 生成智能分割方案
        const splitPlans = this.generateSplitPlans(partySize, groupType);
        const viablePlans = [];
        
        for (const plan of splitPlans) {
            const tableAssignment = this.assignTablesForSplit(plan, availableTables);
            
            if (tableAssignment.success) {
                const splitScore = this.calculateSplitScore(tableAssignment, bookingRequest);
                
                viablePlans.push({
                    ...tableAssignment,
                    plan,
                    score: splitScore,
                    socialDynamics: this.analyzeSocialDynamics(plan, groupType)
                });
            }
        }
        
        if (viablePlans.length === 0) {
            return { success: false, reason: '无法实现分桌安排' };
        }
        
        viablePlans.sort((a, b) => b.score - a.score);
        const bestPlan = viablePlans[0];
        
        return {
            success: true,
            strategy: 'splitting',
            allocation: {
                type: 'table_splitting',
                tables: bestPlan.tables,
                splitPattern: bestPlan.plan.sizes,
                totalCapacity: bestPlan.totalCapacity,
                efficiency: partySize / bestPlan.totalCapacity,
                layout: bestPlan.plan.sizes.map((size, i) => 
                    `桌${bestPlan.tables[i].id}(${size}人)`
                ).join(' + '),
                socialOptimization: bestPlan.socialDynamics
            },
            summary: `分为 ${bestPlan.plan.sizes.length} 桌，配置：${bestPlan.plan.sizes.join('-')}人`,
            aiReasoning: '分桌安排增加社交互动机会，适合大团体聚会',
            visualLayout: this.generateVisualLayout(bestPlan.tables, 'split')
        };
    }
    
    // 混合策略执行 (最复杂的AI决策)
    async executeHybridStrategy(availableTables, bookingRequest) {
        const { partySize, preferences, groupType } = bookingRequest;
        
        // 混合策略：主桌 + 副桌配置
        const mainTableSize = Math.ceil(partySize * 0.6); // 60%主桌
        const secondarySize = partySize - mainTableSize;
        
        const mainTable = availableTables
            .filter(t => t.capacity >= mainTableSize && t.capacity <= mainTableSize + 2)
            .sort((a, b) => this.calculateTableScore(b, bookingRequest) - this.calculateTableScore(a, bookingRequest))[0];
        
        if (!mainTable) {
            return { success: false, reason: '无法找到合适的主桌' };
        }
        
        // 寻找副桌
        const remainingTables = availableTables.filter(t => t.id !== mainTable.id);
        const secondaryTable = remainingTables
            .filter(t => t.capacity >= secondarySize)
            .sort((a, b) => {
                const proximityScore = this.calculateProximityScore(a, mainTable);
                return proximityScore - this.calculateProximityScore(b, mainTable);
            })[0];
        
        if (!secondaryTable) {
            return { success: false, reason: '无法找到合适的副桌' };
        }
        
        return {
            success: true,
            strategy: 'hybrid',
            allocation: {
                type: 'hybrid_configuration',
                mainTable: mainTable,
                secondaryTables: [secondaryTable],
                totalCapacity: mainTable.capacity + secondaryTable.capacity,
                configuration: `主桌${mainTable.id}(${mainTableSize}人) + 副桌${secondaryTable.id}(${secondarySize}人)`,
                flexibility: 'high'
            },
            summary: `混合配置：主桌容纳${mainTableSize}人，副桌容纳${secondarySize}人`,
            aiReasoning: '混合配置提供灵活性，适应复杂社交需求',
            visualLayout: this.generateVisualLayout([mainTable, secondaryTable], 'hybrid')
        };
    }
    
    // 生成智能分割方案
    generateSplitPlans(partySize, groupType) {
        const plans = [];
        
        // 基于团体类型的智能分割
        if (groupType === 'family') {
            // 家庭聚会：保持家庭单位完整
            if (partySize === 8) plans.push({ sizes: [4, 4], type: 'family_units' });
            if (partySize === 9) plans.push({ sizes: [5, 4], type: 'family_units' });
            if (partySize === 10) plans.push({ sizes: [6, 4], type: 'family_units' });
            if (partySize >= 12) plans.push({ sizes: [6, 6], type: 'family_units' });
        }
        
        if (groupType === 'friends') {
            // 朋友聚会：促进交流的配置
            if (partySize === 8) plans.push({ sizes: [4, 4], type: 'social_circles' });
            if (partySize >= 9) plans.push({ sizes: [5, 4], type: 'social_circles' });
            if (partySize >= 12) plans.push({ sizes: [4, 4, 4], type: 'social_circles' });
        }
        
        if (groupType === 'business') {
            // 商务聚会：层级化座位安排
            if (partySize >= 8) plans.push({ sizes: [6, Math.max(2, partySize - 6)], type: 'hierarchical' });
        }
        
        // 通用最优分割
        const optimalSizes = this.calculateOptimalSplit(partySize);
        plans.push({ sizes: optimalSizes, type: 'optimal' });
        
        return plans;
    }
    
    // 计算最优分割
    calculateOptimalSplit(partySize) {
        if (partySize <= 6) return [partySize];
        if (partySize <= 8) return [4, partySize - 4];
        if (partySize <= 12) return [6, partySize - 6];
        
        // 大团体：尽量均匀分割
        const tableCount = Math.ceil(partySize / 6);
        const baseSize = Math.floor(partySize / tableCount);
        const remainder = partySize % tableCount;
        
        const sizes = Array(tableCount).fill(baseSize);
        for (let i = 0; i < remainder; i++) {
            sizes[i]++;
        }
        
        return sizes.sort((a, b) => b - a); // 降序排列
    }
    
    // 生成可视化布局
    generateVisualLayout(tables, type = 'standard') {
        const layout = {
            type,
            tables: tables.map(table => ({
                id: table.id,
                capacity: table.capacity,
                section: this.getTableSection(table.id),
                coordinates: this.getTableCoordinates(table.id)
            })),
            connections: type === 'combination' ? this.generateConnections(tables) : [],
            timestamp: new Date().toISOString()
        };
        
        return layout;
    }
    
    // 辅助函数
    canCombineTables(table1, table2) {
        return this.areAdjacent(table1.id, table2.id) && 
               this.getTableSection(table1.id) === this.getTableSection(table2.id);
    }
    
    areAdjacent(tableId1, tableId2) {
        const adjacents = this.restaurantLayout.adjacencyMap[tableId1] || [];
        return adjacents.includes(tableId2);
    }
    
    getTableSection(tableId) {
        for (const [section, data] of Object.entries(this.restaurantLayout.sections)) {
            if (data.tables.includes(tableId)) return section;
        }
        return 'unknown';
    }
    
    getTableCoordinates(tableId) {
        // 模拟坐标系统
        const sectionCoords = {
            'main': { x: 100, y: 100 },
            'window': { x: 200, y: 100 },
            'private': { x: 50, y: 200 },
            'patio': { x: 150, y: 200 }
        };
        
        const section = this.getTableSection(tableId);
        const base = sectionCoords[section] || { x: 0, y: 0 };
        const offset = parseInt(tableId.replace(/\D/g, '')) * 20;
        
        return { x: base.x + offset, y: base.y };
    }
    
    calculateSingleTableMatch(table, bookingRequest) {
        const { partySize, preferences } = bookingRequest;
        let score = 0;
        
        // 容量匹配 (最重要)
        const efficiency = partySize / table.capacity;
        if (efficiency >= 0.75) score += 50;
        else if (efficiency >= 0.5) score += 30;
        else score += 10;
        
        // 位置偏好
        if (preferences.includes('window') && table.id.startsWith('W')) score += 20;
        if (preferences.includes('private') && table.id.startsWith('P')) score += 25;
        if (preferences.includes('patio') && table.id.startsWith('PT')) score += 20;
        
        return score;
    }
    
    calculateCombinationScore(tables, bookingRequest) {
        let score = 0;
        const { partySize } = bookingRequest;
        
        // 基础桌位分数
        const avgScore = tables.reduce((sum, table) => 
            sum + this.calculateSingleTableMatch(table, bookingRequest), 0) / tables.length;
        score += avgScore;
        
        // 相邻性奖励
        if (tables.length === 2 && this.areAdjacent(tables[0].id, tables[1].id)) {
            score += 30;
        }
        
        // 容量效率
        const totalCapacity = tables.reduce((sum, t) => sum + t.capacity, 0);
        const efficiency = partySize / totalCapacity;
        score += efficiency * 20;
        
        return score;
    }
    
    async optimizeAllocation(result, bookingRequest) {
        if (!result.success) return result;
        
        // 添加实时优化建议
        result.optimizations = [];
        
        if (result.allocation.efficiency < 0.7) {
            result.optimizations.push({
                type: 'efficiency_warning',
                message: '桌位利用率较低，建议考虑其他配置',
                impact: 'medium'
            });
        }
        
        if (result.strategy === 'combination' && !result.allocation.isAdjacent) {
            result.optimizations.push({
                type: 'adjacency_warning', 
                message: '合并的桌位不相邻，可能影响用餐体验',
                impact: 'high'
            });
        }
        
        return result;
    }
}

// 创建全局实例
window.enhancedTableAI = new EnhancedTableAllocationAI();
console.log('🚀 Enhanced Table AI loaded successfully!');