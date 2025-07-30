// AI智能桌位分配系统 - MapleTable
// Advanced Table Assignment with Machine Learning-like Algorithm

class AITableAllocationSystem {
    constructor() {
        this.currentLanguage = 'en';
        this.restaurants = new Map();
        this.bookingHistory = [];
        this.realTimeOccupancy = new Map();
        this.weatherData = null;
        this.peakHours = {
            lunch: { start: 11, end: 14 },
            dinner: { start: 17, end: 21 }
        };
        
        this.initialize();
    }
    
    initialize() {
        this.loadRestaurantLayouts();
        this.loadHistoricalData();
        this.initializeRealTimeTracking();
        this.loadWeatherData();
    }
    
    // 加载餐厅布局数据
    loadRestaurantLayouts() {
        const sampleRestaurant = {
            id: 'rest_001',
            name: 'The CN Tower Restaurant',
            tables: [
                // 窗边桌位 - 最受欢迎，冬季温暖
                { id: 'W1', capacity: 2, type: 'window', zone: 'window', 
                  position: { x: 10, y: 15 }, winterFriendly: true, premium: true, 
                  avgTurnover: 90, preference_score: 4.8 },
                { id: 'W2', capacity: 4, type: 'window', zone: 'window', 
                  position: { x: 10, y: 25 }, winterFriendly: true, premium: true, 
                  avgTurnover: 105, preference_score: 4.7 },
                { id: 'W3', capacity: 2, type: 'window', zone: 'window', 
                  position: { x: 10, y: 35 }, winterFriendly: true, premium: true, 
                  avgTurnover: 95, preference_score: 4.9 },
                
                // 中央区域桌位 - 标准桌位
                { id: 'C1', capacity: 4, type: 'standard', zone: 'central', 
                  position: { x: 30, y: 20 }, winterFriendly: true, premium: false, 
                  avgTurnover: 85, preference_score: 4.0 },
                { id: 'C2', capacity: 4, type: 'standard', zone: 'central', 
                  position: { x: 30, y: 30 }, winterFriendly: true, premium: false, 
                  avgTurnover: 88, preference_score: 4.1 },
                { id: 'C3', capacity: 6, type: 'standard', zone: 'central', 
                  position: { x: 40, y: 25 }, winterFriendly: true, premium: false, 
                  avgTurnover: 110, preference_score: 3.9 },
                { id: 'C4', capacity: 8, type: 'large', zone: 'central', 
                  position: { x: 45, y: 15 }, winterFriendly: true, premium: false, 
                  avgTurnover: 130, preference_score: 3.8 },
                
                // 私人包间区域 - 适合商务聚餐
                { id: 'P1', capacity: 6, type: 'private', zone: 'private', 
                  position: { x: 60, y: 20 }, winterFriendly: true, premium: true, 
                  avgTurnover: 120, preference_score: 4.5 },
                { id: 'P2', capacity: 8, type: 'private', zone: 'private', 
                  position: { x: 60, y: 35 }, winterFriendly: true, premium: true, 
                  avgTurnover: 140, preference_score: 4.6 },
                
                // 露台区域 - 冬季不推荐，但有暖气设备
                { id: 'T1', capacity: 4, type: 'patio', zone: 'patio', 
                  position: { x: 20, y: 5 }, winterFriendly: false, premium: false, 
                  avgTurnover: 75, preference_score: 3.2, hasHeater: true },
                { id: 'T2', capacity: 6, type: 'patio', zone: 'patio', 
                  position: { x: 35, y: 5 }, winterFriendly: false, premium: false, 
                  avgTurnover: 80, preference_score: 3.1, hasHeater: true },
                
                // 吧台区域 - 适合单人或情侣
                { id: 'B1', capacity: 2, type: 'bar', zone: 'bar', 
                  position: { x: 70, y: 10 }, winterFriendly: true, premium: false, 
                  avgTurnover: 60, preference_score: 3.8 },
                { id: 'B2', capacity: 2, type: 'bar', zone: 'bar', 
                  position: { x: 70, y: 15 }, winterFriendly: true, premium: false, 
                  avgTurnover: 65, preference_score: 3.7 },
                
                // 靠近厨房的桌位 - 服务快但噪音大
                { id: 'K1', capacity: 4, type: 'kitchen-near', zone: 'service', 
                  position: { x: 50, y: 40 }, winterFriendly: true, premium: false, 
                  avgTurnover: 70, preference_score: 3.3 },
                { id: 'K2', capacity: 4, type: 'kitchen-near', zone: 'service', 
                  position: { x: 55, y: 40 }, winterFriendly: true, premium: false, 
                  avgTurnover: 72, preference_score: 3.4 }
            ],
            metadata: {
                maxCapacity: 82,
                avgBookingDuration: 90, // 分钟
                peakHours: [11, 12, 13, 18, 19, 20],
                seasonalPreferences: {
                    winter: ['window', 'private', 'central'],
                    summer: ['patio', 'window', 'central']
                }
            }
        };
        
        this.restaurants.set(sampleRestaurant.id, sampleRestaurant);
    }
    
    // 加载历史数据用于机器学习式预测
    loadHistoricalData() {
        this.bookingHistory = [
            { date: '2024-01-15', time: '12:00', partySize: 2, tableUsed: 'W1', satisfaction: 4.8, weather: 'snowy' },
            { date: '2024-01-15', time: '18:30', partySize: 4, tableUsed: 'C1', satisfaction: 4.2, weather: 'snowy' },
            { date: '2024-01-16', time: '19:00', partySize: 6, tableUsed: 'P1', satisfaction: 4.9, weather: 'clear' },
            // 更多历史数据...
        ];
    }
    
    // 初始化实时占用情况跟踪
    initializeRealTimeTracking() {
        this.realTimeOccupancy.set('rest_001', {
            occupied: ['C1', 'W2', 'P1', 'B1'], // 当前已占用
            reserved: ['W1', 'C2'], // 已预订但未到达
            cleaning: ['K1'], // 清理中
            outOfService: ['T2'] // 故障维修
        });
    }
    
    // 加载天气数据
    loadWeatherData() {
        this.weatherData = {
            current: { temp: -12, condition: 'snowy', windSpeed: 15 },
            forecast: [
                { date: '2024-01-20', temp: -8, condition: 'cloudy' },
                { date: '2024-01-21', temp: -15, condition: 'snowy' }
            ]
        };
    }
    
    // 主要的AI桌位分配算法
    async assignOptimalTable(bookingRequest) {
        const {
            restaurantId,
            partySize,
            dateTime,
            preferences = [],
            specialRequests = '',
            customerTier = 'standard', // standard, premium, vip
            groupType = 'casual', // casual, business, romantic, family, celebration
            hasAccessibilityNeeds = false,
            budgetRange = 'mid' // low, mid, high
        } = bookingRequest;
        
        console.log('🤖 AI桌位分配开始...', bookingRequest);
        
        const restaurant = this.restaurants.get(restaurantId);
        if (!restaurant) {
            throw new Error('Restaurant not found');
        }
        
        // 第1步：获取可用桌位
        const availableTables = this.getAvailableTables(restaurantId, dateTime);
        console.log('📋 可用桌位：', availableTables.map(t => t.id));
        
        // 第2步：基础容量筛选
        const capacitySuitableTables = this.filterByCapacity(availableTables, partySize);
        
        if (capacitySuitableTables.length === 0) {
            return this.handleNoAvailableTables(bookingRequest);
        }
        
        // 第3步：AI评分算法
        const scoredTables = await this.scoreTablesWithAI(
            capacitySuitableTables, 
            bookingRequest, 
            restaurant
        );
        
        // 第4步：处理拼桌逻辑
        const combinationResult = await this.considerTableCombinations(
            scoredTables,
            bookingRequest,
            restaurant
        );
        
        // 第5步：最终决策
        const finalAssignment = this.makeFinalDecision(combinationResult, bookingRequest);
        
        console.log('🎯 最终分配结果：', finalAssignment);
        return finalAssignment;
    }
    
    // 容量筛选器
    filterByCapacity(tables, partySize) {
        return tables.filter(table => {
            // 容量必须足够，但不能超出太多（避免浪费）
            const minCapacity = partySize;
            const maxWasteCapacity = partySize + Math.ceil(partySize * 0.5); // 允许50%的容量浪费
            
            return table.capacity >= minCapacity && table.capacity <= Math.max(maxWasteCapacity, partySize + 2);
        }).sort((a, b) => {
            // 优先选择容量最接近的桌子
            const diffA = Math.abs(a.capacity - partySize);
            const diffB = Math.abs(b.capacity - partySize);
            return diffA - diffB;
        });
    }
    
    // AI评分系统
    async scoreTablesWithAI(tables, bookingRequest, restaurant) {
        const scoredTables = [];
        
        for (const table of tables) {
            let score = 100; // 基础分数
            const factors = {
                capacity: 0,
                preference: 0,
                seasonal: 0,
                historical: 0,
                location: 0,
                service: 0,
                pricing: 0,
                accessibility: 0
            };
            
            // 1. 容量匹配度 (权重: 25%)
            const capacityDiff = table.capacity - bookingRequest.partySize;
            if (capacityDiff === 0) {
                factors.capacity = 25; // 完美匹配
            } else if (capacityDiff === 1) {
                factors.capacity = 20; // 很好
            } else if (capacityDiff === 2) {
                factors.capacity = 15; // 可以
            } else {
                factors.capacity = Math.max(5, 25 - capacityDiff * 3); // 递减
            }
            
            // 2. 偏好匹配 (权重: 20%)
            bookingRequest.preferences.forEach(pref => {
                switch (pref) {
                    case 'window-view':
                        if (table.type === 'window') factors.preference += 8;
                        break;
                    case 'quiet-area':
                        if (table.zone === 'private' || table.zone === 'window') factors.preference += 6;
                        if (table.type === 'kitchen-near') factors.preference -= 5;
                        break;
                    case 'heated-area':
                        if (table.winterFriendly) factors.preference += 7;
                        break;
                    case 'romantic-setting':
                        if (table.type === 'window' || table.zone === 'private') factors.preference += 8;
                        if (table.capacity === 2) factors.preference += 3;
                        break;
                    case 'business-appropriate':
                        if (table.zone === 'private' || table.zone === 'central') factors.preference += 6;
                        break;
                }
            });
            
            // 3. 季节性因素 (权重: 15%)
            const season = this.getCurrentSeason();
            const isWinter = season === 'winter';
            
            if (isWinter) {
                if (table.winterFriendly) {
                    factors.seasonal += 12;
                } else if (table.hasHeater) {
                    factors.seasonal += 6;
                } else {
                    factors.seasonal -= 8; // 冬天不推荐露台
                }
                
                // 考虑天气条件
                if (this.weatherData.current.temp < -10 && table.type === 'patio') {
                    factors.seasonal -= 15; // 极寒天气不推荐露台
                }
            }
            
            // 4. 历史数据分析 (权重: 15%)
            const historicalScore = this.analyzeHistoricalPerformance(table, bookingRequest);
            factors.historical = historicalScore;
            
            // 5. 位置评分 (权重: 10%)
            switch (table.zone) {
                case 'window':
                    factors.location = 9;
                    break;
                case 'private':
                    factors.location = 8;
                    break;
                case 'central':
                    factors.location = 6;
                    break;
                case 'bar':
                    factors.location = bookingRequest.partySize <= 2 ? 7 : 3;
                    break;
                case 'patio':
                    factors.location = isWinter ? 2 : 8;
                    break;
                case 'service':
                    factors.location = 4; // 靠近厨房，服务快但嘈杂
                    break;
            }
            
            // 6. 服务质量预测 (权重: 10%)
            const currentHour = new Date(bookingRequest.dateTime).getHours();
            const isPeakHour = restaurant.metadata.peakHours.includes(currentHour);
            
            if (isPeakHour) {
                // 高峰期优先分配服务效率高的桌位
                if (table.zone === 'central' || table.zone === 'service') {
                    factors.service += 8;
                }
                if (table.avgTurnover < 90) {
                    factors.service += 5; // 翻台快的桌子在高峰期更有优势
                }
            } else {
                // 非高峰期可以安排到更好的位置
                if (table.premium) {
                    factors.service += 6;
                }
            }
            
            // 7. 价格敏感性 (权重: 3%)
            if (bookingRequest.budgetRange === 'low' && table.premium) {
                factors.pricing -= 3;
            } else if (bookingRequest.budgetRange === 'high' && table.premium) {
                factors.pricing += 3;
            }
            
            // 8. 无障碍需求 (权重: 2%)
            if (bookingRequest.hasAccessibilityNeeds) {
                // 假设ground floor和central区域更容易到达
                if (table.zone === 'central' && table.position.x < 50) {
                    factors.accessibility += 2;
                }
            }
            
            // 计算总分
            const totalScore = Object.values(factors).reduce((sum, factor) => sum + factor, score);
            
            scoredTables.push({
                ...table,
                aiScore: Math.round(totalScore * 10) / 10,
                scoringFactors: factors,
                recommendation: this.generateRecommendationText(table, factors, bookingRequest)
            });
        }
        
        // 按分数排序
        return scoredTables.sort((a, b) => b.aiScore - a.aiScore);
    }
    
    // 分析历史表现
    analyzeHistoricalPerformance(table, bookingRequest) {
        const relevantHistory = this.bookingHistory.filter(booking => 
            booking.tableUsed === table.id &&
            booking.partySize === bookingRequest.partySize
        );
        
        if (relevantHistory.length === 0) return 5; // 默认分数
        
        const avgSatisfaction = relevantHistory.reduce((sum, booking) => 
            sum + booking.satisfaction, 0) / relevantHistory.length;
        
        // 将满意度(1-5)转换为评分(0-15)
        return Math.round((avgSatisfaction - 3) * 5 + 7.5);
    }
    
    // 桌位组合逻辑（拼桌/合桌）
    async considerTableCombinations(scoredTables, bookingRequest, restaurant) {
        const { partySize, preferences } = bookingRequest;
        
        // 如果有合适的单桌，优先使用
        const perfectMatch = scoredTables.find(table => 
            table.capacity === partySize && table.aiScore > 120
        );
        
        if (perfectMatch) {
            return {
                type: 'single',
                tables: [perfectMatch],
                totalScore: perfectMatch.aiScore,
                explanation: this.currentLanguage === 'fr' ? 
                    'Table parfaitement adaptée trouvée' : 
                    'Perfect matching table found'
            };
        }
        
        // 大型聚会考虑拼桌
        if (partySize >= 8) {
            const combinationOptions = await this.findTableCombinations(
                scoredTables, partySize, restaurant
            );
            
            if (combinationOptions.length > 0) {
                return combinationOptions[0]; // 返回最佳组合
            }
        }
        
        // 默认返回最高分单桌
        return {
            type: 'single',
            tables: [scoredTables[0]],
            totalScore: scoredTables[0].aiScore,
            explanation: this.currentLanguage === 'fr' ? 
                'Meilleure table disponible' : 
                'Best available table'
        };
    }
    
    // 寻找桌位组合
    async findTableCombinations(tables, requiredCapacity, restaurant) {
        const combinations = [];
        
        // 两桌组合
        for (let i = 0; i < tables.length; i++) {
            for (let j = i + 1; j < tables.length; j++) {
                const table1 = tables[i];
                const table2 = tables[j];
                const totalCapacity = table1.capacity + table2.capacity;
                
                if (totalCapacity >= requiredCapacity && totalCapacity <= requiredCapacity + 4) {
                    const distance = this.calculateTableDistance(table1, table2);
                    
                    // 只有相邻或附近的桌子才能拼桌
                    if (distance <= 20) {
                        const combinedScore = (table1.aiScore + table2.aiScore) / 2 - (distance / 5);
                        
                        combinations.push({
                            type: 'combination',
                            tables: [table1, table2],
                            totalCapacity,
                            totalScore: combinedScore,
                            distance,
                            explanation: this.currentLanguage === 'fr' ? 
                                `Combinaison de 2 tables (${table1.id} + ${table2.id})` :
                                `2-table combination (${table1.id} + ${table2.id})`
                        });
                    }
                }
            }
        }
        
        return combinations.sort((a, b) => b.totalScore - a.totalScore);
    }
    
    // 计算桌子间距离
    calculateTableDistance(table1, table2) {
        const dx = table1.position.x - table2.position.x;
        const dy = table1.position.y - table2.position.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
    
    // 最终决策制定
    makeFinalDecision(combinationResult, bookingRequest) {
        const { customerTier, groupType } = bookingRequest;
        
        let finalResult = { ...combinationResult };
        
        // VIP客户特殊处理
        if (customerTier === 'vip') {
            finalResult.vipUpgrade = true;
            finalResult.explanation += this.currentLanguage === 'fr' ? 
                ' (Mise à niveau VIP appliquée)' : 
                ' (VIP upgrade applied)';
        }
        
        // 商务客户特殊处理
        if (groupType === 'business') {
            finalResult.businessAmenities = [
                'WiFi password provided',
                'Quiet environment ensured',
                'Business receipt available'
            ];
        }
        
        // 庆祝活动特殊处理
        if (groupType === 'celebration') {
            finalResult.celebrationExtras = [
                'Complimentary table decoration',
                'Birthday/Anniversary acknowledgment',
                'Special dessert recommendation'
            ];
        }
        
        // 生成最终的AI推荐理由
        finalResult.aiReasoning = this.generateAIReasoning(finalResult, bookingRequest);
        
        return finalResult;
    }
    
    // 生成AI推荐理由
    generateAIReasoning(result, bookingRequest) {
        const reasons = [];
        const lang = this.currentLanguage;
        
        const table = result.tables[0];
        
        // 基于评分因素生成理由
        if (table.scoringFactors.capacity > 15) {
            reasons.push(lang === 'fr' ? 
                '✓ Taille parfaite pour votre groupe' : 
                '✓ Perfect size for your party'
            );
        }
        
        if (table.scoringFactors.seasonal > 8) {
            reasons.push(lang === 'fr' ? 
                '✓ Idéal pour la saison hivernale' : 
                '✓ Ideal for winter season'
            );
        }
        
        if (table.scoringFactors.preference > 10) {
            reasons.push(lang === 'fr' ? 
                '✓ Correspond à vos préférences' : 
                '✓ Matches your preferences'
            );
        }
        
        if (table.scoringFactors.location > 7) {
            reasons.push(lang === 'fr' ? 
                '✓ Emplacement premium' : 
                '✓ Premium location'
            );
        }
        
        return reasons;
    }
    
    // 生成推荐文本
    generateRecommendationText(table, factors, bookingRequest) {
        const lang = this.currentLanguage;
        let text = '';
        
        if (table.type === 'window') {
            text = lang === 'fr' ? 'Vue sur fenêtre, ambiance chaleureuse' : 'Window view, cozy atmosphere';
        } else if (table.type === 'private') {
            text = lang === 'fr' ? 'Espace privé, parfait pour les affaires' : 'Private space, perfect for business';
        } else if (table.zone === 'central') {
            text = lang === 'fr' ? 'Emplacement central, service rapide' : 'Central location, quick service';
        }
        
        if (table.winterFriendly && this.getCurrentSeason() === 'winter') {
            text += lang === 'fr' ? ', chauffé' : ', heated';
        }
        
        return text;
    }
    
    // 处理无可用桌位的情况
    async handleNoAvailableTables(bookingRequest) {
        const { restaurantId, dateTime, partySize } = bookingRequest;
        const restaurant = this.restaurants.get(restaurantId);
        
        // 寻找替代时间
        const alternativeTimes = await this.findAlternativeTimes(bookingRequest);
        
        // 寻找替代餐厅
        const alternativeRestaurants = await this.findAlternativeRestaurants(bookingRequest);
        
        // 考虑等位选项
        const waitlistOption = this.calculateWaitlistTime(restaurantId, dateTime, partySize);
        
        return {
            type: 'no_availability',
            alternatives: {
                times: alternativeTimes,
                restaurants: alternativeRestaurants,
                waitlist: waitlistOption
            },
            explanation: this.currentLanguage === 'fr' ? 
                'Aucune table disponible pour ce créneau' : 
                'No tables available for this time slot'
        };
    }
    
    // 寻找替代时间
    async findAlternativeTimes(bookingRequest) {
        const alternatives = [];
        const requestDate = new Date(bookingRequest.dateTime);
        
        // 检查前后2小时内的空闲时间
        for (let hourOffset = -2; hourOffset <= 2; hourOffset++) {
            if (hourOffset === 0) continue;
            
            const alternativeTime = new Date(requestDate);
            alternativeTime.setHours(alternativeTime.getHours() + hourOffset);
            
            const availableTables = this.getAvailableTables(
                bookingRequest.restaurantId, 
                alternativeTime.toISOString()
            );
            
            const suitableTables = this.filterByCapacity(availableTables, bookingRequest.partySize);
            
            if (suitableTables.length > 0) {
                alternatives.push({
                    time: alternativeTime.toISOString(),
                    availableCount: suitableTables.length,
                    bestTable: suitableTables[0]
                });
            }
        }
        
        return alternatives.slice(0, 3); // 最多返回3个替代时间
    }
    
    // 获取可用桌位
    getAvailableTables(restaurantId, dateTime) {
        const restaurant = this.restaurants.get(restaurantId);
        const occupancy = this.realTimeOccupancy.get(restaurantId);
        
        if (!restaurant || !occupancy) return [];
        
        const unavailable = new Set([
            ...occupancy.occupied,
            ...occupancy.reserved,
            ...occupancy.cleaning,
            ...occupancy.outOfService
        ]);
        
        return restaurant.tables.filter(table => !unavailable.has(table.id));
    }
    
    // 获取当前季节
    getCurrentSeason() {
        const month = new Date().getMonth() + 1;
        if (month >= 12 || month <= 2) return 'winter';
        if (month >= 3 && month <= 5) return 'spring';
        if (month >= 6 && month <= 8) return 'summer';
        return 'fall';
    }
    
    // 计算等位时间
    calculateWaitlistTime(restaurantId, dateTime, partySize) {
        const occupancy = this.realTimeOccupancy.get(restaurantId);
        const restaurant = this.restaurants.get(restaurantId);
        
        if (!occupancy || !restaurant) return null;
        
        const avgTurnoverTime = restaurant.metadata.avgBookingDuration;
        const currentlyOccupied = occupancy.occupied.length;
        const totalTables = restaurant.tables.length;
        
        // 简单的等位时间估算
        const estimatedWaitTime = Math.round(
            (currentlyOccupied / totalTables) * avgTurnoverTime * 0.7
        );
        
        return {
            estimatedMinutes: estimatedWaitTime,
            confidence: currentlyOccupied > totalTables * 0.8 ? 'low' : 'high',
            message: this.currentLanguage === 'fr' ? 
                `Temps d'attente estimé: ${estimatedWaitTime} minutes` :
                `Estimated wait time: ${estimatedWaitTime} minutes`
        };
    }
    
    // 更新实时占用状态
    updateRealTimeOccupancy(restaurantId, tableId, status) {
        const occupancy = this.realTimeOccupancy.get(restaurantId);
        if (!occupancy) return;
        
        // 从所有状态中移除
        Object.keys(occupancy).forEach(key => {
            const index = occupancy[key].indexOf(tableId);
            if (index > -1) {
                occupancy[key].splice(index, 1);
            }
        });
        
        // 添加到新状态
        if (occupancy[status] && !occupancy[status].includes(tableId)) {
            occupancy[status].push(tableId);
        }
        
        console.log(`🔄 桌位 ${tableId} 状态更新为: ${status}`);
    }
    
    // 设置语言
    setLanguage(language) {
        this.currentLanguage = language;
    }
}

// 导出AI桌位分配系统
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AITableAllocationSystem;
} else if (typeof window !== 'undefined') {
    window.AITableAllocationSystem = AITableAllocationSystem;
}

// 创建全局实例
const aiTableSystem = new AITableAllocationSystem();

console.log('🤖 AI智能桌位分配系统已加载完成');