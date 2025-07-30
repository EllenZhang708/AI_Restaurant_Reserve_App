// Booking Page JavaScript - MapleTable Canadian Restaurant App

class CanadianBookingSystem {
    constructor() {
        this.currentLanguage = 'en';
        this.selectedDate = null;
        this.selectedTime = null;
        this.partySize = 2;
        this.selectedPreferences = [];
        this.restaurantData = null;
        
        this.translations = {
            en: {
                'Select Date': 'Select Date',
                'Select Time': 'Select Time',
                'Party Size': 'Party Size',
                'guests': 'guests',
                'Today': 'Today',
                'Tomorrow': 'Tomorrow',
                'Seating Preferences': 'Seating Preferences',
                'Contact Information': 'Contact Information',
                'Special Requests': 'Special Requests',
                'Booking Summary': 'Booking Summary',
                'Confirm Reservation': 'Confirm Reservation',
                'Reservation Confirmed!': 'Reservation Confirmed!',
                'Winter dining ready': 'Winter dining ready',
                'reviews': 'reviews'
            },
            fr: {
                'Select Date': 'Sélectionner la Date',
                'Select Time': 'Sélectionner l\'Heure',
                'Party Size': 'Nombre de Personnes',
                'guests': 'invités',
                'Today': 'Aujourd\'hui',
                'Tomorrow': 'Demain',
                'Seating Preferences': 'Préférences de Siège',
                'Contact Information': 'Informations de Contact',
                'Special Requests': 'Demandes Spéciales',
                'Booking Summary': 'Résumé de la Réservation',
                'Confirm Reservation': 'Confirmer la Réservation',
                'Reservation Confirmed!': 'Réservation Confirmée!',
                'Winter dining ready': 'Prêt pour le repas d\'hiver',
                'reviews': 'avis'
            }
        };
        
        this.timeSlots = [
            { time: '11:00', available: true, winterFriendly: false },
            { time: '11:30', available: true, winterFriendly: false },
            { time: '12:00', available: true, winterFriendly: true },
            { time: '12:30', available: true, winterFriendly: true },
            { time: '13:00', available: true, winterFriendly: true },
            { time: '13:30', available: false, winterFriendly: true },
            { time: '14:00', available: true, winterFriendly: false },
            { time: '14:30', available: true, winterFriendly: false },
            { time: '17:00', available: true, winterFriendly: false },
            { time: '17:30', available: true, winterFriendly: true },
            { time: '18:00', available: true, winterFriendly: true },
            { time: '18:30', available: false, winterFriendly: true },
            { time: '19:00', available: true, winterFriendly: true },
            { time: '19:30', available: true, winterFriendly: true },
            { time: '20:00', available: true, winterFriendly: false },
            { time: '20:30', available: true, winterFriendly: false }
        ];
        
        this.initialize();
        
        // 确保AI系统已加载
        this.waitForAISystem();
    }
    
    async waitForAISystem() {
        let attempts = 0;
        const maxAttempts = 50;
        
        while (!window.aiTableSystem && attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }
        
        if (!window.aiTableSystem) {
            console.warn('AI Table System not loaded, using fallback');
        } else {
            console.log('🤖 AI Table System ready');
        }
    }
    
    initialize() {
        this.loadRestaurantData();
        this.setupEventListeners();
        this.initializeDates();
        this.renderTimeSlots();
        this.updateSummary();
        this.loadLanguageFromStorage();
    }
    
    loadRestaurantData() {
        // 从URL参数或localStorage获取餐厅数据
        const urlParams = new URLSearchParams(window.location.search);
        const restaurantId = urlParams.get('restaurant');
        
        // 尝试从 localStorage 加载选中的餐厅
        const selectedRestaurant = localStorage.getItem('selectedRestaurant');
        
        if (selectedRestaurant) {
            try {
                this.restaurantData = JSON.parse(selectedRestaurant);
                console.log('🍽️ 从 localStorage 加载餐厅数据:', this.restaurantData.name);
                console.log('🔍 餐厅ID:', this.restaurantData.id);
                
                // 确保rest_001的数据完整性
                if (this.restaurantData.id === 'rest_001' || restaurantId === 'rest_001') {
                    // 补充可能缺失的字段
                    const completeData = this.getDefaultRestaurantData('rest_001');
                    this.restaurantData = {
                        ...completeData,
                        ...this.restaurantData,
                        id: 'rest_001' // 强制确保ID正确
                    };
                    console.log('🍁 已修正Maple餐厅数据完整性');
                }
            } catch (error) {
                console.warn('解析餐厅数据失败:', error);
                this.restaurantData = this.getDefaultRestaurantData(restaurantId);
            }
        } else {
            // 使用默认数据
            this.restaurantData = this.getDefaultRestaurantData(restaurantId);
        }
        
        // 额外验证：如果URL参数是rest_001但数据不匹配，强制使用正确数据
        if (restaurantId === 'rest_001' && this.restaurantData.id !== 'rest_001') {
            console.warn('🔧 检测到ID不匹配，强制使用rest_001数据');
            this.restaurantData = this.getDefaultRestaurantData('rest_001');
        }
        
        this.updateRestaurantDisplay();
    }
    
    getDefaultRestaurantData(restaurantId) {
        // Handle specific restaurant IDs
        if (restaurantId === 'rest_001') {
            return {
                id: 'rest_001',
                name: 'The Maple Leaf Restaurant',
                nameF: 'Restaurant Feuille d\'Érable',
                cuisine: 'Canadian Fine Dining',
                cuisineF: 'Grande Cuisine Canadienne',
                rating: 4.9,
                reviewCount: 1847,
                priceRange: 'CAD $60-95',
                image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop',
                address: '123 Maple Street, Toronto, ON M5V 3A8',
                phone: '(416) 555-MAPLE',
                features: ['AI Table Allocation', 'Seasonal Menu', 'Wine Pairing', 'Private Events']
            };
        }
        
        // Default fallback
        return {
            id: restaurantId || 'rest_001',
            name: 'The CN Tower Restaurant',
            nameF: 'Restaurant de la Tour CN',
            cuisine: 'Canadian Fine Dining',
            cuisineF: 'Grande Cuisine Canadienne',
            rating: 4.8,
            reviewCount: 2847,
            image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=200&fit=crop',
            phone: '(416) 362-5411',
            address: '290 Bremner Blvd, Toronto, ON M5V 3L9',
            winterFeatures: ['Heated Interior', 'Panoramic Views', 'Winter Menu'],
            winterFeaturesF: ['Intérieur Chauffé', 'Vues Panoramiques', 'Menu d\'Hiver']
        };
    }
    
    updateRestaurantDisplay() {
        const name = this.currentLanguage === 'fr' && this.restaurantData.nameF ? this.restaurantData.nameF : this.restaurantData.name;
        const cuisine = this.currentLanguage === 'fr' && this.restaurantData.cuisineF ? this.restaurantData.cuisineF : this.restaurantData.cuisine;
        
        document.getElementById('restaurantName').textContent = name;
        document.getElementById('restaurantCuisine').textContent = cuisine;
        document.getElementById('restaurantRating').textContent = this.restaurantData.rating;
        document.getElementById('reviewCount').textContent = this.restaurantData.reviewCount;
        document.getElementById('restaurantImage').src = this.restaurantData.image;
    }
    
    setupEventListeners() {
        // Form submission
        document.getElementById('bookingForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitBooking();
        });
        
        // Date change
        document.getElementById('bookingDate').addEventListener('change', (e) => {
            this.selectedDate = e.target.value;
            this.renderTimeSlots();
            this.updateSummary();
        });
        
        // Preference changes
        document.querySelectorAll('input[name="preferences"]').forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.updateSelectedPreferences();
            });
        });
    }
    
    initializeDates() {
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];
        
        document.getElementById('bookingDate').value = todayStr;
        document.getElementById('bookingDate').min = todayStr;
        
        // Set max date to 3 months from now
        const maxDate = new Date();
        maxDate.setMonth(maxDate.getMonth() + 3);
        document.getElementById('bookingDate').max = maxDate.toISOString().split('T')[0];
        
        this.selectedDate = todayStr;
        
        // Update quick date buttons
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        document.getElementById('todayDate').textContent = this.formatDate(today, true);
        document.getElementById('tomorrowDate').textContent = this.formatDate(tomorrow, true);
    }
    
    renderTimeSlots() {
        const container = document.getElementById('timeSlots');
        container.innerHTML = '';
        
        const selectedDate = new Date(this.selectedDate);
        const today = new Date();
        const isToday = selectedDate.toDateString() === today.toDateString();
        const currentHour = today.getHours();
        
        this.timeSlots.forEach(slot => {
            const slotHour = parseInt(slot.time.split(':')[0]);
            const isPastTime = isToday && slotHour <= currentHour;
            const isAvailable = slot.available && !isPastTime;
            
            const timeBtn = document.createElement('button');
            timeBtn.type = 'button';
            timeBtn.className = `time-slot ${isAvailable ? 'available' : 'unavailable'} ${slot.winterFriendly ? 'winter-friendly' : ''}`;
            timeBtn.disabled = !isAvailable;
            
            timeBtn.innerHTML = `
                <div class="time-display">${slot.time}</div>
                ${slot.winterFriendly ? '<i class="fas fa-fire winter-icon" title="Heated seating available"></i>' : ''}
                ${!isAvailable ? '<span class="unavailable-text">' + (this.currentLanguage === 'fr' ? 'Indisponible' : 'Unavailable') + '</span>' : ''}
            `;
            
            if (isAvailable) {
                timeBtn.addEventListener('click', () => {
                    document.querySelectorAll('.time-slot').forEach(btn => btn.classList.remove('selected'));
                    timeBtn.classList.add('selected');
                    this.selectedTime = slot.time;
                    this.updateSummary();
                });
            }
            
            container.appendChild(timeBtn);
        });
    }
    
    changePartySize(change) {
        const newSize = this.partySize + change;
        if (newSize >= 1 && newSize <= 12) {
            this.partySize = newSize;
            document.getElementById('partySize').textContent = this.partySize;
            this.updateSummary();
        }
    }
    
    updateSelectedPreferences() {
        this.selectedPreferences = Array.from(document.querySelectorAll('input[name="preferences"]:checked'))
            .map(cb => cb.value);
    }
    
    updateSummary() {
        const summaryDate = document.getElementById('summaryDate');
        const summaryTime = document.getElementById('summaryTime');
        const summaryParty = document.getElementById('summaryParty');
        
        if (this.selectedDate) {
            const date = new Date(this.selectedDate);
            summaryDate.textContent = this.formatDate(date);
        }
        
        if (this.selectedTime) {
            summaryTime.textContent = this.selectedTime;
        }
        
        const guestsText = this.currentLanguage === 'fr' ? 'invités' : 'guests';
        summaryParty.textContent = `${this.partySize} ${guestsText}`;
    }
    
    formatDate(date, short = false) {
        const options = short ? 
            { month: 'short', day: 'numeric' } : 
            { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        
        return this.currentLanguage === 'fr' ? 
            date.toLocaleDateString('fr-CA', options) : 
            date.toLocaleDateString('en-CA', options);
    }
    
    async submitBooking() {
        // Validate form
        if (!this.validateForm()) {
            return;
        }
        
        // Show loading state
        const submitBtn = document.getElementById('bookBtn');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        submitBtn.disabled = true;
        
        try {
            // Simulate API call for table assignment
            const assignedTable = await this.assignTable();
            
            // Create booking object
            const booking = {
                id: 'MT' + Date.now(),
                restaurantId: this.restaurantData.id,
                restaurantName: this.restaurantData.name,
                date: this.selectedDate,
                time: this.selectedTime,
                partySize: this.partySize,
                preferences: this.selectedPreferences,
                assignedTable: assignedTable,
                customerInfo: {
                    firstName: document.getElementById('firstName').value,
                    lastName: document.getElementById('lastName').value,
                    phone: document.getElementById('phoneNumber').value,
                    email: document.getElementById('emailAddress').value
                },
                specialRequests: document.getElementById('specialRequests').value,
                status: 'confirmed',
                createdAt: new Date().toISOString()
            };
            
            // Save booking to localStorage
            this.saveBooking(booking);
            
            // Show confirmation
            this.showConfirmation(booking);
            
        } catch (error) {
            console.error('Booking error:', error);
            this.showError(error.message);
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }
    
    validateForm() {
        const required = [
            'firstName', 'lastName', 'phoneNumber', 'emailAddress'
        ];
        
        let isValid = true;
        
        // Check required fields
        required.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (!field.value.trim()) {
                field.classList.add('error');
                isValid = false;
            } else {
                field.classList.remove('error');
            }
        });
        
        // Check date and time selection
        if (!this.selectedDate || !this.selectedTime) {
            this.showNotification(
                this.currentLanguage === 'fr' ? 
                'Veuillez sélectionner une date et une heure.' : 
                'Please select a date and time.', 
                'error'
            );
            isValid = false;
        }
        
        return isValid;
    }
    
    async assignTable() {
        // 使用AI智能桌位分配系统
        const bookingRequest = {
            restaurantId: this.restaurantData.id || 'rest_001',
            partySize: this.partySize,
            dateTime: new Date(`${this.selectedDate}T${this.selectedTime}:00`).toISOString(),
            preferences: this.selectedPreferences,
            specialRequests: document.getElementById('specialRequests')?.value || '',
            customerTier: this.getCustomerTier(),
            groupType: this.detectGroupType(),
            hasAccessibilityNeeds: this.selectedPreferences.includes('wheelchair-accessible'),
            budgetRange: this.detectBudgetRange()
        };
        
        console.log('🤖 启动AI桌位分配...', bookingRequest);
        
        try {
            // 调用增强AI分配系统
            const assignmentResult = await window.enhancedTableAI.allocateOptimalSeating(bookingRequest);
            
            // 显示AI推荐理由
            this.showAIRecommendation(assignmentResult);
            
            // 返回主桌位信息
            const primaryTable = assignmentResult.tables[0];
            
            return {
                ...primaryTable,
                aiScore: assignmentResult.totalScore,
                aiReasoning: assignmentResult.aiReasoning,
                combinationType: assignmentResult.type,
                allTables: assignmentResult.tables,
                explanation: assignmentResult.explanation
            };
            
        } catch (error) {
            console.error('AI分配系统错误:', error);
            
            // 降级到简单分配
            return this.fallbackTableAssignment();
        }
    }
    
    // 降级桌位分配
    fallbackTableAssignment() {
        const fallbackTables = [
            { id: 'T1', capacity: 2, type: 'window', winterFriendly: true, zone: 'main' },
            { id: 'T6', capacity: 4, type: 'standard', winterFriendly: true, zone: 'main' },
            { id: 'T8', capacity: 6, type: 'private', winterFriendly: true, zone: 'private' }
        ];
        
        const suitable = fallbackTables.find(t => t.capacity >= this.partySize) || fallbackTables[0];
        return {
            ...suitable,
            aiScore: 75,
            explanation: this.currentLanguage === 'fr' ? 
                'Attribution standard (AI temporairement indisponible)' :
                'Standard assignment (AI temporarily unavailable)'
        };
    }
    
    // 检测客户等级
    getCustomerTier() {
        const email = document.getElementById('emailAddress')?.value || '';
        const phone = document.getElementById('phoneNumber')?.value || '';
        
        // 简单的VIP检测逻辑
        if (email.includes('vip') || phone.includes('888')) {
            return 'vip';
        }
        
        // 检查是否是回头客
        const existingBookings = JSON.parse(localStorage.getItem('mapleTableBookings') || '[]');
        const customerBookings = existingBookings.filter(booking => 
            booking.customerInfo.email === email || booking.customerInfo.phone === phone
        );
        
        if (customerBookings.length >= 3) {
            return 'premium';
        }
        
        return 'standard';
    }
    
    // 检测聚会类型
    detectGroupType() {
        const specialRequests = document.getElementById('specialRequests')?.value?.toLowerCase() || '';
        
        if (specialRequests.includes('business') || specialRequests.includes('meeting') || specialRequests.includes('conference')) {
            return 'business';
        }
        if (specialRequests.includes('birthday') || specialRequests.includes('anniversary') || specialRequests.includes('celebration')) {
            return 'celebration';
        }
        if (specialRequests.includes('romantic') || specialRequests.includes('date') || (this.partySize === 2 && this.selectedPreferences.includes('window-seat'))) {
            return 'romantic';
        }
        if (this.partySize >= 6) {
            return 'family';
        }
        
        return 'casual';
    }
    
    // 检测预算范围
    detectBudgetRange() {
        // 根据餐厅类型和时间段判断
        const hour = parseInt(this.selectedTime.split(':')[0]);
        const isLunchTime = hour >= 11 && hour < 15;
        
        if (this.selectedPreferences.includes('private-dining') || hour >= 19) {
            return 'high';
        }
        if (isLunchTime || this.partySize >= 6) {
            return 'mid';
        }
        
        return 'mid'; // 默认中等预算
    }
    
    // 显示AI推荐理由
    showAIRecommendation(assignmentResult) {
        const modal = document.getElementById('aiRecommendationModal');
        if (!modal) {
            this.createAIRecommendationModal();
        }
        
        const modalContent = document.getElementById('aiRecommendationContent');
        const table = assignmentResult.tables[0];
        
        modalContent.innerHTML = `
            <div class="ai-recommendation">
                <div class="ai-header">
                    <div class="ai-icon">🤖</div>
                    <div class="ai-title">
                        <h3>${this.currentLanguage === 'fr' ? 'Recommandation IA' : 'AI Recommendation'}</h3>
                        <div class="ai-score">Score: ${assignmentResult.totalScore}</div>
                    </div>
                </div>
                
                <div class="table-preview">
                    <div class="table-visual ${table.type}">
                        <div class="table-shape">Table ${table.id}</div>
                        <div class="table-capacity">${table.capacity} ${this.currentLanguage === 'fr' ? 'places' : 'seats'}</div>
                    </div>
                    <div class="table-info">
                        <h4>${this.currentLanguage === 'fr' ? 'Table Assignée' : 'Assigned Table'}</h4>
                        <p class="table-description">${table.recommendation || assignmentResult.explanation}</p>
                        ${assignmentResult.type === 'combination' ? `
                            <div class="combination-info">
                                <i class="fas fa-link"></i>
                                <span>${this.currentLanguage === 'fr' ? 'Combinaison de tables' : 'Table combination'}</span>
                            </div>
                        ` : ''}
                    </div>
                </div>
                
                <div class="ai-reasoning">
                    <h4>${this.currentLanguage === 'fr' ? 'Pourquoi cette table ?' : 'Why this table?'}</h4>
                    <ul class="reasoning-list">
                        ${assignmentResult.aiReasoning ? assignmentResult.aiReasoning.map(reason => 
                            `<li>${reason}</li>`
                        ).join('') : `<li>${assignmentResult.explanation}</li>`}
                    </ul>
                </div>
                
                ${assignmentResult.vipUpgrade ? `
                    <div class="vip-upgrade">
                        <i class="fas fa-crown"></i>
                        <span>${this.currentLanguage === 'fr' ? 'Mise à niveau VIP appliquée' : 'VIP upgrade applied'}</span>
                    </div>
                ` : ''}
                
                <div class="ai-actions">
                    <button class="btn btn-secondary" onclick="this.requestDifferentTable()">
                        ${this.currentLanguage === 'fr' ? 'Demander une autre table' : 'Request different table'}
                    </button>
                    <button class="btn btn-primary" onclick="this.acceptAIRecommendation()">
                        ${this.currentLanguage === 'fr' ? 'Accepter' : 'Accept'}
                    </button>
                </div>
            </div>
        `;
        
        document.getElementById('aiRecommendationModal').classList.add('show');
    }
    
    // 创建AI推荐模态框
    createAIRecommendationModal() {
        const modal = document.createElement('div');
        modal.id = 'aiRecommendationModal';
        modal.className = 'modal ai-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <button class="close-btn" onclick="this.closeAIModal()">&times;</button>
                </div>
                <div id="aiRecommendationContent" class="modal-body">
                    <!-- AI推荐内容将在这里生成 -->
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }
    
    // 接受AI推荐
    acceptAIRecommendation() {
        document.getElementById('aiRecommendationModal')?.classList.remove('show');
    }
    
    // 关闭AI模态框
    closeAIModal() {
        document.getElementById('aiRecommendationModal')?.classList.remove('show');
    }
    
    // 请求不同桌位
    requestDifferentTable() {
        this.showNotification(
            this.currentLanguage === 'fr' ? 
            'Recherche d\'alternatives...' : 
            'Searching for alternatives...',
            'info'
        );
        
        // 模拟重新分配
        setTimeout(() => {
            this.showNotification(
                this.currentLanguage === 'fr' ? 
                'Alternative trouvée! Vérifiez votre nouvelle attribution.' : 
                'Alternative found! Check your new assignment.',
                'success'
            );
            this.closeAIModal();
        }, 2000);
    }
    
    getCurrentSeason() {
        const month = new Date().getMonth() + 1; // 0-11 to 1-12
        if (month >= 12 || month <= 2) return 'winter';
        if (month >= 3 && month <= 5) return 'spring';
        if (month >= 6 && month <= 8) return 'summer';
        return 'fall';
    }
    
    saveBooking(booking) {
        console.log('💾 开始保存预订...', {
            bookingId: booking.id,
            restaurantId: booking.restaurantId,
            restaurantName: booking.restaurantName
        });
        
        // 保存到客户预订系统
        const existingBookings = JSON.parse(localStorage.getItem('mapleTableBookings') || '[]');
        existingBookings.push(booking);
        localStorage.setItem('mapleTableBookings', JSON.stringify(existingBookings));
        console.log('✅ 已保存到客户预订系统');
        
        // 保存到商家系统，确保ID一致性
        const merchantBookings = JSON.parse(localStorage.getItem('mapleTableMerchantBookings') || '[]');
        const merchantBooking = {
            ...booking,
            merchantId: this.restaurantData.id,
            restaurantId: this.restaurantData.id, // 确保餐厅ID正确
            syncTime: new Date().toISOString(),
            syncMethod: 'direct-save'
        };
        merchantBookings.push(merchantBooking);
        localStorage.setItem('mapleTableMerchantBookings', JSON.stringify(merchantBookings));
        
        console.log('✅ 已保存到商家预订系统:', {
            bookingId: booking.id,
            restaurantId: this.restaurantData.id,
            merchantId: this.restaurantData.id,
            restaurantName: this.restaurantData.name
        });
        
        // 触发强制同步（如果可用）
        if (window.forceBookingSync) {
            console.log('🔄 触发强制同步...');
            setTimeout(() => {
                const syncResult = window.forceBookingSync.forceSyncAll();
                console.log('🔄 强制同步结果:', syncResult);
            }, 100);
        }
        
        // 发送自定义事件通知同步完成
        window.dispatchEvent(new CustomEvent('bookingSaved', {
            detail: {
                booking: merchantBooking,
                restaurantId: this.restaurantData.id,
                timestamp: new Date().toISOString()
            }
        }));
        
        console.log('🎉 预订保存完成，同步已触发');
        
        // Trigger AI sync bridge if available
        if (window.aiTableSyncBridge) {
            console.log('🔄 Triggering AI sync bridge...');
            setTimeout(() => {
                window.aiTableSyncBridge.forceSyncNow();
            }, 500);
        } else {
            console.warn('⚠️ AI sync bridge not available');
        }
        
        // Dispatch booking event for real-time updates
        window.dispatchEvent(new CustomEvent('bookingCreated', {
            detail: {
                booking: booking,
                restaurantId: this.restaurantData.id,
                timestamp: new Date().toISOString()
            }
        }));
    }
    
    showConfirmation(booking) {
        const modal = document.getElementById('confirmationModal');
        
        // Update confirmation details
        document.getElementById('confirmationNumber').textContent = booking.id;
        document.getElementById('confirmedRestaurant').textContent = booking.restaurantName;
        document.getElementById('confirmedDate').textContent = this.formatDate(new Date(booking.date));
        document.getElementById('confirmedTime').textContent = booking.time;
        document.getElementById('confirmedParty').textContent = `${booking.partySize} ${this.currentLanguage === 'fr' ? 'invités' : 'guests'}`;
        document.getElementById('confirmedPhone').textContent = booking.customerInfo.phone;
        
        modal.classList.add('show');
        
        // Send confirmation notification (simulate)
        this.sendConfirmationNotification(booking);
    }
    
    sendConfirmationNotification(booking) {
        // Simulate sending confirmation via email/SMS
        console.log('Sending confirmation to:', booking.customerInfo.email);
        console.log('Table assigned:', booking.assignedTable);
        
        // For demo, show a notification
        setTimeout(() => {
            this.showNotification(
                this.currentLanguage === 'fr' ? 
                'Confirmation envoyée par email et SMS!' : 
                'Confirmation sent via email and SMS!',
                'success'
            );
        }, 2000);
    }
    
    showError(message) {
        this.showNotification(message, 'error');
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            left: 50%;
            transform: translateX(-50%);
            background: ${type === 'error' ? '#dc3545' : type === 'success' ? '#28a745' : '#007bff'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 25px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            z-index: 4000;
            font-weight: 600;
            animation: slideInDown 0.3s ease;
            max-width: 90vw;
            text-align: center;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutUp 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }
    
    // Language and utility functions
    toggleLanguage() {
        this.currentLanguage = this.currentLanguage === 'en' ? 'fr' : 'en';
        document.getElementById('currentLang').textContent = this.currentLanguage.toUpperCase();
        this.updateTranslations();
        this.updateRestaurantDisplay();
        this.renderTimeSlots();
        this.updateSummary();
        localStorage.setItem('mapleTableLanguage', this.currentLanguage);
    }
    
    updateTranslations() {
        document.querySelectorAll('[data-en]').forEach(element => {
            const enText = element.getAttribute('data-en');
            const frText = element.getAttribute('data-fr');
            if (this.currentLanguage === 'fr' && frText) {
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = frText;
                } else {
                    element.textContent = frText;
                }
            } else if (enText) {
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = enText;
                } else {
                    element.textContent = enText;
                }
            }
        });
    }
    
    loadLanguageFromStorage() {
        const savedLang = localStorage.getItem('mapleTableLanguage');
        if (savedLang && savedLang !== this.currentLanguage) {
            this.currentLanguage = savedLang;
            document.getElementById('currentLang').textContent = this.currentLanguage.toUpperCase();
            this.updateTranslations();
        }
    }
}

// Global functions for HTML onclick handlers
function goBack() {
    window.history.back();
}

function toggleLanguage() {
    bookingSystem.toggleLanguage();
}

function selectToday() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('bookingDate').value = today;
    bookingSystem.selectedDate = today;
    bookingSystem.renderTimeSlots();
    bookingSystem.updateSummary();
}

function selectTomorrow() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    document.getElementById('bookingDate').value = tomorrowStr;
    bookingSystem.selectedDate = tomorrowStr;
    bookingSystem.renderTimeSlots();
    bookingSystem.updateSummary();
}

function changePartySize(change) {
    bookingSystem.changePartySize(change);
}

function addQuickRequest(type) {
    const textarea = document.getElementById('specialRequests');
    const currentText = textarea.value;
    
    const requests = {
        'birthday': bookingSystem.currentLanguage === 'fr' ? 'Célébration d\'anniversaire' : 'Birthday celebration',
        'anniversary': bookingSystem.currentLanguage === 'fr' ? 'Anniversaire de mariage' : 'Anniversary celebration',
        'vegetarian': bookingSystem.currentLanguage === 'fr' ? 'Options végétariennes requises' : 'Vegetarian options required',
        'halal': bookingSystem.currentLanguage === 'fr' ? 'Nourriture halal requise' : 'Halal food required'
    };
    
    const newRequest = requests[type];
    if (newRequest && !currentText.includes(newRequest)) {
        textarea.value = currentText ? `${currentText}; ${newRequest}` : newRequest;
    }
}

function addToCalendar() {
    // Create calendar event
    const bookings = JSON.parse(localStorage.getItem('mapleTableBookings') || '[]');
    const booking = bookings[bookings.length - 1];
    if (booking) {
        const startDate = new Date(`${booking.date}T${booking.time}:00`);
        const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000); // 2 hours later
        
        const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent('Dinner at ' + booking.restaurantName)}&dates=${startDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z/${endDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z&details=${encodeURIComponent('Reservation confirmation: ' + booking.id + '\\nTable: ' + booking.assignedTable.id)}`;
        
        window.open(googleCalendarUrl, '_blank');
    }
}

function goToReservations() {
    window.location.href = 'reservations.html';
}

// Initialize booking system
let bookingSystem;
document.addEventListener('DOMContentLoaded', () => {
    bookingSystem = new CanadianBookingSystem();
});