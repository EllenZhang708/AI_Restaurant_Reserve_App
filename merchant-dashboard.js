// Merchant Management Dashboard - MapleTable Restaurant Management Dashboard
class MerchantDashboard {
    constructor() {
        this.merchantData = null;
        this.restaurantData = null;
        this.realTimeReservations = [];
        this.tableLayout = [];
        this.aiAssignments = [];
        this.isLive = true;
        this.refreshInterval = null;
        
        this.initialize();
    }
    
    async initialize() {
        console.log('🏪 Initializing merchant management dashboard...');
        
        // Wait for page load completion
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }
    
    async setup() {
        // 验证商家登录状态
        await this.validateMerchantAccess();
        
        // Load restaurant data - get specific restaurant from URL parameters
        await this.loadRestaurantData();
        
        // Update page display
        this.updateRestaurantDisplay();
        
        // Load reservation data
        await this.loadReservationsData();
        
        // Initialize table layout
        this.initializeTableLayout();
        
        // Load AI allocation data
        this.loadAIAssignments();
        
        // Render all content
        this.renderDashboardContent();
        
        // Start real-time updates
        this.startRealTimeUpdates();
        
        // Setup AI sync listeners
        this.setupAISyncListeners();
        
        console.log('✅ 商家管理后台初始化完成');
    }
    
    async validateMerchantAccess() {
        const merchantLoginData = localStorage.getItem('merchantLoginData');
        if (!merchantLoginData) {
            console.warn('⚠️ 未找到商家登录信息，重定向到登录页面');
            window.location.href = 'index.html';
            return;
        }
        
        try {
            this.merchantData = JSON.parse(merchantLoginData);
            console.log('👔 商家已登录:', this.merchantData.restaurant?.name);
        } catch (error) {
            console.error('商家登录数据解析失败:', error);
            localStorage.removeItem('merchantLoginData');
            window.location.href = 'index.html';
        }
    }
    
    async loadRestaurantData() {
        // 从URL参数获取特定餐厅ID
        const urlParams = new URLSearchParams(window.location.search);
        const restaurantId = urlParams.get('restaurant');
        const merchantName = urlParams.get('merchant');
        
        console.log('🔍 加载餐厅数据:', { restaurantId, merchantName });
        
        // 特殊处理rest_001 (Maple餐厅)
        if (restaurantId === 'rest_001') {
            this.restaurantData = {
                id: 'rest_001',
                name: 'The Maple Leaf Restaurant',
                nameF: 'Restaurant Feuille d\'Érable',
                merchantId: 'merchant_001',
                address: '123 Maple Street, Toronto, ON M5V 3A8',
                phone: '(416) 555-MAPLE',
                cuisine: 'Canadian Fine Dining',
                status: 'online',
                openTime: '11:00',
                closeTime: '22:00'
            };
            console.log('🍁 已加载Maple餐厅数据');
        } else if (restaurantId && this.merchantData) {
            // 使用URL参数中的餐厅信息
            this.restaurantData = {
                id: restaurantId,
                name: decodeURIComponent(merchantName || '我的餐厅'),
                merchantId: this.merchantData.id || 'merchant_001',
                address: this.merchantData.restaurant?.address || '多伦多市中心',
                phone: this.merchantData.restaurant?.phone || '(416) 123-4567',
                status: 'online',
                openTime: '11:00',
                closeTime: '22:00'
            };
        } else {
            // 降级到Maple餐厅默认数据
            this.restaurantData = {
                id: 'rest_001',
                name: 'The Maple Leaf Restaurant',
                merchantId: 'merchant_001',
                address: '123 Maple Street, Toronto, ON M5V 3A8',
                phone: '(416) 555-MAPLE',
                status: 'online',
                openTime: '11:00',
                closeTime: '22:00'
            };
        }
        
        console.log('🏪 已加载餐厅数据:', this.restaurantData);
    }
    
    updateRestaurantDisplay() {
        const restaurantName = document.getElementById('restaurantName');
        const restaurantDetails = document.getElementById('restaurantDetails');
        
        if (restaurantName) {
            restaurantName.textContent = this.restaurantData.name;
        }
        
        if (restaurantDetails) {
            restaurantDetails.textContent = `${this.restaurantData.address} | ${this.restaurantData.phone}`;
        }
        
        // 更新页面标题
        document.title = `${this.restaurantData.name} - 管理后台 | MapleTable`;
    }
    
    async loadReservationsData() {
        console.log('📋 正在加载预订数据...');
        
        // 从多个数据源加载预订
        const customerBookings = JSON.parse(localStorage.getItem('mapleTableBookings') || '[]');
        const merchantBookings = JSON.parse(localStorage.getItem('mapleTableMerchantBookings') || '[]');
        
        console.log('📊 找到数据源:', {
            customerBookings: customerBookings.length,
            merchantBookings: merchantBookings.length
        });
        
        // 合并并去重所有预订数据
        const bookingMap = new Map();
        
        // 添加客户预订
        customerBookings.forEach(booking => {
            if (booking.id) {
                bookingMap.set(booking.id, booking);
            }
        });
        
        // 添加商家预订（可能会覆盖客户预订以获得最新数据）
        merchantBookings.forEach(booking => {
            if (booking.id) {
                bookingMap.set(booking.id, booking);
            }
        });
        
        const allBookings = Array.from(bookingMap.values());
        console.log('📋 去重后的预订数据:', allBookings.length);
        
        // 过滤属于当前餐厅的预订
        this.realTimeReservations = allBookings.filter(booking => {
            const matchesRestaurant = booking.restaurantId === this.restaurantData.id || 
                                    booking.merchantId === this.restaurantData.id ||
                                    booking.restaurantName === this.restaurantData.name;
            
            // 显示今天和未来7天的预订
            const bookingDate = new Date(booking.date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const futureLimit = new Date(today);
            futureLimit.setDate(today.getDate() + 7);
            const isValidDate = bookingDate >= today && bookingDate <= futureLimit;
            
            // Debug logging for filtering
            console.log(`📋 Filtering booking ${booking.id}:`, {
                bookingRestaurantId: booking.restaurantId,
                bookingMerchantId: booking.merchantId,
                bookingRestaurantName: booking.restaurantName,
                currentRestaurantId: this.restaurantData.id,
                currentRestaurantName: this.restaurantData.name,
                matchesRestaurant,
                isValidDate,
                bookingDate: booking.date,
                include: matchesRestaurant && isValidDate
            });
            
            return matchesRestaurant && isValidDate;
        });
        
        console.log(`🎯 ${this.restaurantData.name} 的预订数据:`, this.realTimeReservations);
        
        // 按时间排序
        this.realTimeReservations.sort((a, b) => {
            const dateTimeA = new Date(`${a.date}T${a.time}:00`);
            const dateTimeB = new Date(`${b.date}T${b.time}:00`);
            return dateTimeA - dateTimeB;
        });
    }
    
    initializeTableLayout() {
        // 生成餐厅桌位布局
        this.tableLayout = [
            { id: 'T1', type: 'window', capacity: 2, status: 'occupied', position: { x: 50, y: 100 }, zone: 'window' },
            { id: 'T2', type: 'window', capacity: 2, status: 'available', position: { x: 150, y: 100 }, zone: 'window' },
            { id: 'T3', type: 'standard', capacity: 4, status: 'reserved', position: { x: 50, y: 200 }, zone: 'main' },
            { id: 'T4', type: 'standard', capacity: 4, status: 'available', position: { x: 150, y: 200 }, zone: 'main' },
            { id: 'T5', type: 'standard', capacity: 6, status: 'occupied', position: { x: 250, y: 150 }, zone: 'main' },
            { id: 'T6', type: 'private', capacity: 8, status: 'available', position: { x: 350, y: 150 }, zone: 'private' },
            { id: 'T7', type: 'bar', capacity: 3, status: 'available', position: { x: 50, y: 300 }, zone: 'bar' },
            { id: 'T8', type: 'bar', capacity: 3, status: 'occupied', position: { x: 150, y: 300 }, zone: 'bar' }
        ];
        
        // 根据实际预订更新桌位状态
        this.updateTableStatusFromReservations();
    }
    
    updateTableStatusFromReservations() {
        // 重置所有桌位为可用状态
        this.tableLayout.forEach(table => {
            if (table.status !== 'maintenance') {
                table.status = 'available';
            }
        });
        
        // 根据预订更新桌位状态
        const now = new Date();
        const currentHour = now.getHours();
        const currentDate = now.toISOString().split('T')[0];
        
        this.realTimeReservations.forEach(reservation => {
            if (reservation.date === currentDate && reservation.assignedTable) {
                const tableId = reservation.assignedTable.id;
                const reservationHour = parseInt(reservation.time.split(':')[0]);
                
                // 如果预订时间在当前时间±2小时内，标记为占用或预订
                if (Math.abs(reservationHour - currentHour) <= 2) {
                    const table = this.tableLayout.find(t => t.id === tableId);
                    if (table) {
                        table.status = reservationHour <= currentHour ? 'occupied' : 'reserved';
                        table.currentReservation = reservation;
                    }
                }
            }
        });
    }
    
    loadAIAssignments() {
        // 生成AI分配历史和建议
        this.aiAssignments = this.realTimeReservations.map(reservation => {
            if (reservation.assignedTable && reservation.assignedTable.aiScore) {
                return {
                    reservationId: reservation.id,
                    tableId: reservation.assignedTable.id,
                    aiScore: reservation.assignedTable.aiScore,
                    reasoning: reservation.assignedTable.aiReasoning || [],
                    type: reservation.assignedTable.combinationType || 'single',
                    customerInfo: `${reservation.customerInfo.firstName} ${reservation.customerInfo.lastName}`,
                    partySize: reservation.partySize,
                    time: reservation.time,
                    preferences: reservation.preferences || []
                };
            }
            return null;
        }).filter(Boolean);
        
        console.log('🤖 AI分配数据:', this.aiAssignments);
    }
    
    renderDashboardContent() {
        this.renderStatistics();
        this.renderReservationsList();
        this.renderTableLayout();
        this.renderAIRecommendations();
        this.renderTablesGrid();
    }
    
    renderStatistics() {
        const today = new Date().toISOString().split('T')[0];
        const todayReservations = this.realTimeReservations.filter(r => r.date === today);
        const occupiedTables = this.tableLayout.filter(t => t.status === 'occupied').length;
        const totalTables = this.tableLayout.length;
        const occupancyRate = Math.round((occupiedTables / totalTables) * 100);
        
        // 更新统计数据
        const totalReservationsEl = document.getElementById('totalReservations');
        const occupiedTablesEl = document.getElementById('occupiedTables');
        const occupancyRateEl = document.getElementById('occupancyRate');
        const todayRevenueEl = document.getElementById('todayRevenue');
        
        if (totalReservationsEl) totalReservationsEl.textContent = todayReservations.length;
        if (occupiedTablesEl) occupiedTablesEl.textContent = `${occupiedTables}/${totalTables}`;
        if (occupancyRateEl) occupancyRateEl.textContent = `${occupancyRate}%`;
        
        // 模拟营收计算
        const avgRevenue = 85;
        const todayRevenue = todayReservations.reduce((sum, r) => sum + (r.partySize * avgRevenue), 0);
        if (todayRevenueEl) todayRevenueEl.textContent = `$${todayRevenue.toLocaleString()}`;
    }
    
    renderReservationsList() {
        const container = document.getElementById('reservationsList');
        if (!container) return;
        
        if (this.realTimeReservations.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-calendar-times"></i>
                    <h4>暂无预订</h4>
                    <p>今天还没有预订记录</p>
                    <button class="btn btn-primary" onclick="window.open('booking.html?restaurant=${this.restaurantData.id}', '_blank')">
                        <i class="fas fa-plus"></i>
                        手动添加预订
                    </button>
                </div>
            `;
            return;
        }
        
        const reservationsHTML = this.realTimeReservations.map(reservation => {
            const statusClass = this.getReservationStatusClass(reservation);
            const aiInfo = reservation.assignedTable ? 
                `<div class="ai-assignment">
                    <i class="fas fa-brain"></i>
                    AI分配: ${reservation.assignedTable.id} (分数: ${reservation.assignedTable.aiScore || 'N/A'})
                </div>` : '';
            
            return `
                <div class="reservation-item ${statusClass}">
                    <div class="reservation-header">
                        <div class="customer-info">
                            <h4>${reservation.customerInfo.firstName} ${reservation.customerInfo.lastName}</h4>
                            <p>${reservation.customerInfo.phone} | ${reservation.customerInfo.email}</p>
                        </div>
                        <div class="reservation-status">
                            <span class="status-badge ${statusClass}">${this.getStatusText(reservation)}</span>
                        </div>
                    </div>
                    <div class="reservation-details">
                        <div class="detail-item">
                            <i class="fas fa-calendar"></i>
                            <span>${this.formatDate(reservation.date)}</span>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-clock"></i>
                            <span>${reservation.time}</span>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-users"></i>
                            <span>${reservation.partySize} 人</span>
                        </div>
                        ${reservation.assignedTable ? `
                            <div class="detail-item">
                                <i class="fas fa-chair"></i>
                                <span>桌位: ${reservation.assignedTable.id}</span>
                            </div>
                        ` : ''}
                    </div>
                    ${aiInfo}
                    ${reservation.specialRequests ? `
                        <div class="special-requests">
                            <i class="fas fa-comment"></i>
                            <span>${reservation.specialRequests}</span>
                        </div>
                    ` : ''}
                    <div class="reservation-actions">
                        <button class="btn btn-sm btn-secondary" onclick="editReservation('${reservation.id}')">
                            <i class="fas fa-edit"></i>
                            编辑
                        </button>
                        <button class="btn btn-sm btn-success" onclick="confirmArrival('${reservation.id}')">
                            <i class="fas fa-check"></i>
                            确认到店
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="cancelReservation('${reservation.id}')">
                            <i class="fas fa-times"></i>
                            取消
                        </button>
                    </div>
                </div>
            `;
        }).join('');
        
        container.innerHTML = reservationsHTML;
    }
    
    renderTableLayout() {
        const container = document.getElementById('tableLayout');
        if (!container) return;
        
        const svgWidth = 500;
        const svgHeight = 400;
        
        let svgContent = `<svg width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}">`;
        
        // 绘制区域背景
        const zones = [
            { name: 'window', color: '#e3f2fd', x: 20, y: 50, width: 180, height: 100 },
            { name: 'main', color: '#f3e5f5', x: 20, y: 160, width: 280, height: 120 },
            { name: 'private', color: '#fff3e0', x: 320, y: 100, width: 160, height: 180 },
            { name: 'bar', color: '#e8f5e8', x: 20, y: 290, width: 180, height: 80 }
        ];
        
        zones.forEach(zone => {
            svgContent += `
                <rect x="${zone.x}" y="${zone.y}" width="${zone.width}" height="${zone.height}" 
                      fill="${zone.color}" stroke="#ddd" stroke-width="1" rx="5"/>
                <text x="${zone.x + 10}" y="${zone.y + 20}" font-size="12" fill="#666" font-weight="bold">
                    ${zone.name.toUpperCase()}
                </text>
            `;
        });
        
        // 绘制桌位
        this.tableLayout.forEach(table => {
            const statusColor = this.getTableColor(table.status);
            const size = this.getTableSize(table.capacity);
            
            svgContent += `
                <g class="table-item" onclick="selectTable('${table.id}')">
                    <rect x="${table.position.x}" y="${table.position.y}" 
                          width="${size}" height="${size}" 
                          fill="${statusColor}" stroke="#333" stroke-width="2" rx="5"
                          style="cursor: pointer; transition: all 0.3s ease;"/>
                    <text x="${table.position.x + size/2}" y="${table.position.y + size/2 - 5}" 
                          text-anchor="middle" font-size="10" font-weight="bold" fill="#333">
                        ${table.id}
                    </text>
                    <text x="${table.position.x + size/2}" y="${table.position.y + size/2 + 8}" 
                          text-anchor="middle" font-size="8" fill="#666">
                        ${table.capacity}人
                    </text>
                </g>
            `;
        });
        
        svgContent += '</svg>';
        
        container.innerHTML = svgContent;
    }
    
    renderAIRecommendations() {
        const container = document.getElementById('aiRecommendations');
        if (!container) return;
        
        // 生成AI分配效果演示数据
        const aiDemoData = this.generateAIAssignmentDemo();
        const allAssignments = [...this.aiAssignments, ...aiDemoData];
        
        if (allAssignments.length === 0) {
            container.innerHTML = `
                <div class="ai-empty-state">
                    <i class="fas fa-robot"></i>
                    <h4>AI智能分配系统</h4>
                    <p class="ai-description">🤖 AI系统正在实时监控桌位状态和客户需求</p>
                    <div class="ai-features">
                        <div class="ai-feature">
                            <i class="fas fa-chart-line"></i>
                            <span>智能优化分配</span>
                        </div>
                        <div class="ai-feature">
                            <i class="fas fa-users"></i>
                            <span>客户偏好匹配</span>
                        </div>
                        <div class="ai-feature">
                            <i class="fas fa-clock"></i>
                            <span>实时动态调整</span>
                        </div>
                    </div>
                </div>
            `;
            return;
        }
        
        // 显示AI分配统计
        const totalScore = allAssignments.reduce((sum, a) => sum + a.aiScore, 0);
        const avgScore = Math.round(totalScore / allAssignments.length);
        
        const aiHTML = `
            <div class="ai-overview">
                <div class="ai-stats">
                    <div class="ai-stat">
                        <span class="stat-value">${allAssignments.length}</span>
                        <span class="stat-label">AI分配</span>
                    </div>
                    <div class="ai-stat">
                        <span class="stat-value">${avgScore}</span>
                        <span class="stat-label">平均分数</span>
                    </div>
                    <div class="ai-stat">
                        <span class="stat-value">${this.calculateEfficiencyRate()}%</span>
                        <span class="stat-label">效率提升</span>
                    </div>
                </div>
                <div class="ai-status-indicator">
                    <div class="ai-pulse"></div>
                    <span>AI系统运行中</span>
                </div>
            </div>
            
            <div class="ai-assignments-list">
                ${allAssignments.slice(0, 8).map(assignment => `
                    <div class="ai-assignment-item ${assignment.isDemo ? 'demo' : 'real'}">
                        <div class="ai-header">
                            <div class="ai-score ${this.getScoreClass(assignment.aiScore)}">
                                <i class="fas fa-brain"></i>
                                <span class="score-value">${assignment.aiScore}</span>
                            </div>
                            <div class="assignment-info">
                                <h5>${assignment.customerInfo} ${assignment.isDemo ? '(演示)' : ''}</h5>
                                <p>${assignment.partySize}人 | ${assignment.time} | 桌位${assignment.tableId}</p>
                            </div>
                            <div class="assignment-actions">
                                <button class="ai-detail-btn" onclick="showAIDetails('${assignment.reservationId}')">
                                    <i class="fas fa-eye"></i>
                                </button>
                            </div>
                        </div>
                        <div class="ai-reasoning">
                            <h6>🤖 AI分析:</h6>
                            <ul>
                                ${assignment.reasoning.map(reason => `<li>${reason}</li>`).join('')}
                            </ul>
                        </div>
                        <div class="assignment-footer">
                            <span class="type-badge ${assignment.type}">${this.getAssignmentTypeText(assignment.type)}</span>
                            <span class="ai-confidence">置信度: ${assignment.confidence || '95%'}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <div class="ai-insights">
                <h6>💡 AI洞察:</h6>
                <div class="insights-grid">
                    <div class="insight-item">
                        <i class="fas fa-trending-up"></i>
                        <span>窗边桌位需求量高，建议优先分配VIP客户</span>
                    </div>
                    <div class="insight-item">
                        <i class="fas fa-clock"></i>
                        <span>19:00-20:00时段最繁忙，建议预留灵活桌位</span>
                    </div>
                    <div class="insight-item">
                        <i class="fas fa-users"></i>
                        <span>4人桌位使用率最高，可考虑增加此类桌位</span>
                    </div>
                </div>
            </div>
        `;
        
        container.innerHTML = aiHTML;
    }
    
    generateAIAssignmentDemo() {
        // 生成演示AI分配数据，让用户看到AI系统的效果
        const demoData = [
            {
                reservationId: 'DEMO001',
                tableId: 'T1',
                aiScore: 94,
                reasoning: [
                    '客户偏好窗边座位，T1为最佳窗边位置',
                    '2人桌位完美匹配party size',
                    '时间段内该桌位空闲，无冲突'
                ],
                type: 'single',
                customerInfo: '张女士',
                partySize: 2,
                time: '18:30',
                preferences: ['window-seat'],
                confidence: '96%',
                isDemo: true
            },
            {
                reservationId: 'DEMO002', 
                tableId: 'T5+T6',
                aiScore: 88,
                reasoning: [
                    '大型聚会需要，AI建议组合桌位',
                    'T5+T6组合可容纳8人，满足需求',
                    'VIP客户识别，自动升级到私人区域'
                ],
                type: 'combination',
                customerInfo: 'Smith先生',
                partySize: 8,
                time: '19:00',
                preferences: ['private-dining'],
                confidence: '92%',
                isDemo: true
            },
            {
                reservationId: 'DEMO003',
                tableId: 'T3',
                aiScore: 91,
                reasoning: [
                    '商务用餐检测，分配安静区域桌位',
                    '4人标准桌位，适合商务讨论',
                    'AI预测用餐时长2小时，时间规划优化'
                ],
                type: 'business',
                customerInfo: '李总',
                partySize: 4,
                time: '12:00',
                preferences: ['quiet-area'],
                confidence: '94%',
                isDemo: true
            }
        ];
        
        return demoData;
    }
    
    calculateEfficiencyRate() {
        // 计算AI系统带来的效率提升
        const baseEfficiency = 75; // 人工分配基准效率
        const aiBoost = Math.min(25, Math.floor(this.aiAssignments.length * 2)); // AI提升
        return Math.min(99, baseEfficiency + aiBoost);
    }
    
    getScoreClass(score) {
        if (score >= 90) return 'excellent';
        if (score >= 80) return 'good'; 
        if (score >= 70) return 'average';
        return 'poor';
    }
    
    renderTablesGrid() {
        const container = document.getElementById('tablesGrid');
        if (!container) return;
        
        const tablesHTML = this.tableLayout.map(table => {
            const statusClass = table.status;
            const statusIcon = this.getTableStatusIcon(table.status);
            const reservationInfo = table.currentReservation ? 
                `<div class="table-reservation">
                    <p>${table.currentReservation.customerInfo.firstName} ${table.currentReservation.customerInfo.lastName}</p>
                    <p>${table.currentReservation.time}</p>
                </div>` : '';
            
            return `
                <div class="table-card ${statusClass}" onclick="manageTable('${table.id}')">
                    <div class="table-header">
                        <h4>${table.id}</h4>
                        <div class="table-status">
                            <i class="${statusIcon}"></i>
                            <span>${this.getTableStatusText(table.status)}</span>
                        </div>
                    </div>
                    <div class="table-info">
                        <div class="capacity">
                            <i class="fas fa-users"></i>
                            <span>${table.capacity} 人桌</span>
                        </div>
                        <div class="table-type">
                            <i class="fas fa-tag"></i>
                            <span>${this.getTableTypeText(table.type)}</span>
                        </div>
                        <div class="table-zone">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${table.zone}</span>
                        </div>
                    </div>
                    ${reservationInfo}
                </div>
            `;
        }).join('');
        
        container.innerHTML = tablesHTML;
    }
    
    startRealTimeUpdates() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
        }
        
        // 每30秒刷新一次数据
        this.refreshInterval = setInterval(() => {
            if (this.isLive) {
                this.refreshData();
            }
        }, 30000);
        
        console.log('🔄 已启动实时数据更新');
    }
    
    setupAISyncListeners() {
        // Listen for booking synchronization events
        window.addEventListener('bookingSync', (event) => {
            console.log('🔄 Received booking sync event:', event.detail);
            this.handleBookingSyncUpdate(event.detail.bookings);
        });
        
        // Force initial sync if sync bridge is available
        if (window.aiTableSyncBridge) {
            setTimeout(() => {
                console.log('🔄 Forcing initial AI sync...');
                window.aiTableSyncBridge.forceSyncNow();
            }, 1000);
        }
        
        console.log('🧠 AI sync listeners configured');
    }
    
    handleBookingSyncUpdate(bookings) {
        console.log('📥 Processing booking sync update:', bookings.length, 'bookings');
        
        // Filter bookings for this restaurant
        const restaurantBookings = bookings.filter(booking => 
            booking.restaurantId === this.restaurantData.id
        );
        
        if (restaurantBookings.length > 0) {
            console.log('🏪 Found', restaurantBookings.length, 'bookings for this restaurant');
            
            // Update real-time reservations
            this.realTimeReservations = restaurantBookings;
            
            // Refresh dashboard display
            this.updateTableStatusFromReservations();
            this.loadAIAssignments();
            this.renderReservations();
            this.renderAIRecommendations();
            this.renderStatistics();
        }
    }
    
    async refreshData() {
        console.log('🔄 刷新数据...');
        await this.loadReservationsData();
        this.updateTableStatusFromReservations();
        this.loadAIAssignments();
        this.renderDashboardContent();
    }
    
    // 工具方法
    getReservationStatusClass(reservation) {
        const now = new Date();
        const reservationDateTime = new Date(`${reservation.date}T${reservation.time}:00`);
        const diffMinutes = (reservationDateTime - now) / (1000 * 60);
        
        if (diffMinutes < -30) return 'completed';
        if (diffMinutes < 0) return 'ongoing';
        if (diffMinutes < 60) return 'arriving';
        return 'upcoming';
    }
    
    getStatusText(reservation) {
        const statusClass = this.getReservationStatusClass(reservation);
        const statusTexts = {
            'completed': '已完成',
            'ongoing': '进行中',
            'arriving': '即将到达',
            'upcoming': '待到达'
        };
        return statusTexts[statusClass] || '未知';
    }
    
    getTableColor(status) {
        const colors = {
            'available': '#4caf50',
            'occupied': '#f44336',
            'reserved': '#ff9800',
            'maintenance': '#757575'
        };
        return colors[status] || '#ddd';
    }
    
    getTableSize(capacity) {
        if (capacity <= 2) return 40;
        if (capacity <= 4) return 50;
        if (capacity <= 6) return 60;
        return 70;
    }
    
    getTableStatusIcon(status) {
        const icons = {
            'available': 'fas fa-check-circle',
            'occupied': 'fas fa-user-friends',
            'reserved': 'fas fa-clock',
            'maintenance': 'fas fa-tools'
        };
        return icons[status] || 'fas fa-question';
    }
    
    getTableStatusText(status) {
        const texts = {
            'available': '空闲',
            'occupied': '使用中',
            'reserved': '已预订',
            'maintenance': '维护中'
        };
        return texts[status] || '未知';
    }
    
    getTableTypeText(type) {
        const types = {
            'window': '窗边桌',
            'standard': '标准桌',
            'private': '包间',
            'bar': '吧台'
        };
        return types[type] || type;
    }
    
    getAssignmentTypeText(type) {
        const types = {
            'single': '单桌分配',
            'combination': '组合桌位',
            'split': '拆分安排',
            'upgrade': 'VIP升级'
        };
        return types[type] || type;
    }
    
    formatDate(dateStr) {
        const date = new Date(dateStr);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        if (date.toDateString() === today.toDateString()) {
            return '今天';
        } else if (date.toDateString() === tomorrow.toDateString()) {
            return '明天';
        } else {
            return date.toLocaleDateString('zh-CN', { 
                month: 'short', 
                day: 'numeric',
                weekday: 'short'
            });
        }
    }
}

// 全局函数供HTML调用
function goBack() {
    window.history.back();
}

function showSettings() {
    alert('设置功能开发中...');
}

function refreshReservations() {
    if (window.merchantDashboard) {
        window.merchantDashboard.refreshData();
    }
}

function showReservationFilters() {
    alert('筛选功能开发中...');
}

function addNewTable() {
    alert('添加桌位功能开发中...');
}

function updateAnalytics(timeRange) {
    console.log('更新分析数据:', timeRange);
}

function editReservation(reservationId) {
    console.log('编辑预订:', reservationId);
    alert(`编辑预订 ${reservationId} 功能开发中...`);
}

function confirmArrival(reservationId) {
    console.log('确认到店:', reservationId);
    alert(`客户 ${reservationId} 已确认到店!`);
}

function cancelReservation(reservationId) {
    if (confirm('确定要取消这个预订吗？')) {
        console.log('取消预订:', reservationId);
        alert(`预订 ${reservationId} 已取消`);
    }
}

function selectTable(tableId) {
    console.log('选择桌位:', tableId);
    alert(`已选择桌位 ${tableId}`);
}

function manageTable(tableId) {
    console.log('管理桌位:', tableId);
    alert(`管理桌位 ${tableId} 功能开发中...`);
}

function showAIDetails(assignmentId) {
    console.log('显示AI分配详情:', assignmentId);
    
    if (assignmentId.startsWith('DEMO')) {
        // 显示AI演示详情
        const demoDetails = {
            'DEMO001': {
                title: 'AI窗边座位优化分配',
                description: '基于客户历史偏好和实时桌位状态，AI系统选择了最佳窗边位置',
                factors: [
                    '客户偏好权重: 40%',
                    '桌位可用性: 30%', 
                    '位置优势: 20%',
                    '时间匹配度: 10%'
                ]
            },
            'DEMO002': {
                title: 'AI智能桌位组合',
                description: 'AI检测到大型聚会需求，自动建议最优桌位组合方案',
                factors: [
                    '人数匹配度: 50%',
                    '空间布局: 25%',
                    'VIP服务: 15%',
                    '私密性: 10%'
                ]
            },
            'DEMO003': {
                title: 'AI商务场景识别',
                description: 'AI通过关键词分析识别商务用餐，智能分配安静区域',
                factors: [
                    '场景识别: 45%',
                    '环境安静度: 30%',
                    '服务便利性: 15%',
                    '用餐时长预测: 10%'
                ]
            }
        };
        
        const detail = demoDetails[assignmentId];
        if (detail) {
            const modal = `
                <div class="ai-detail-modal" onclick="closeAIDetailModal()">
                    <div class="ai-detail-content" onclick="event.stopPropagation()">
                        <div class="ai-modal-header">
                            <h3>🤖 ${detail.title}</h3>
                            <button class="close-btn" onclick="closeAIDetailModal()">&times;</button>
                        </div>
                        <div class="ai-modal-body">
                            <p class="ai-description">${detail.description}</p>
                            <div class="ai-factors">
                                <h4>分配权重因子:</h4>
                                <ul>
                                    ${detail.factors.map(factor => `<li>${factor}</li>`).join('')}
                                </ul>
                            </div>
                            <div class="ai-timeline">
                                <h4>AI处理流程:</h4>
                                <div class="timeline-steps">
                                    <div class="step completed">
                                        <span class="step-number">1</span>
                                        <span class="step-text">接收预订请求</span>
                                    </div>
                                    <div class="step completed">
                                        <span class="step-number">2</span>
                                        <span class="step-text">分析客户偏好</span>
                                    </div>
                                    <div class="step completed">
                                        <span class="step-number">3</span>
                                        <span class="step-text">评估桌位状态</span>
                                    </div>
                                    <div class="step completed">
                                        <span class="step-number">4</span>
                                        <span class="step-text">生成最优方案</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.insertAdjacentHTML('beforeend', modal);
        }
    } else {
        alert(`AI分配详情 ${assignmentId} 功能开发中...`);
    }
}

function closeAIDetailModal() {
    const modal = document.querySelector('.ai-detail-modal');
    if (modal) {
        modal.remove();
    }
}

// 初始化商家管理后台
window.addEventListener('DOMContentLoaded', () => {
    window.merchantDashboard = new MerchantDashboard();
});

// 页面卸载时清理
window.addEventListener('beforeunload', () => {
    if (window.merchantDashboard && window.merchantDashboard.refreshInterval) {
        clearInterval(window.merchantDashboard.refreshInterval);
    }
});