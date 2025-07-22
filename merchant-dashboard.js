// Merchant Dashboard System - MapleTable Business

class MerchantDashboard {
    constructor() {
        this.currentLanguage = 'en';
        this.currentSection = 'overview';
        this.sidebarCollapsed = false;
        this.selectedTable = null;
        this.tableLayout = [];
        this.bookings = [];
        this.zoomLevel = 100;
        this.gridVisible = true;
        
        this.translations = {
            en: {
                'Dashboard': 'Dashboard',
                'Overview': 'Overview',
                'Bookings': 'Bookings',
                'Table Layout': 'Table Layout',
                'Menu Management': 'Menu Management',
                'Analytics': 'Analytics',
                'Promotions': 'Promotions',
                'Reviews': 'Reviews',
                'Settings': 'Settings',
                'Restaurant Overview': 'Restaurant Overview',
                'Monthly Revenue': 'Monthly Revenue',
                'This Week\'s Bookings': 'This Week\'s Bookings',
                'Average Occupancy': 'Average Occupancy',
                'Customer Rating': 'Customer Rating',
                'Today\'s Bookings': 'Today\'s Bookings',
                'Table Status': 'Table Status',
                'Recent Activity': 'Recent Activity'
            },
            fr: {
                'Dashboard': 'Tableau de Bord',
                'Overview': 'Aperçu',
                'Bookings': 'Réservations',
                'Table Layout': 'Plan des Tables',
                'Menu Management': 'Gestion du Menu',
                'Analytics': 'Analyses',
                'Promotions': 'Promotions',
                'Reviews': 'Avis',
                'Settings': 'Paramètres',
                'Restaurant Overview': 'Aperçu du Restaurant',
                'Monthly Revenue': 'Revenus Mensuels',
                'This Week\'s Bookings': 'Réservations de cette Semaine',
                'Average Occupancy': 'Occupation Moyenne',
                'Customer Rating': 'Note Client',
                'Today\'s Bookings': 'Réservations d\'Aujourd\'hui',
                'Table Status': 'État des Tables',
                'Recent Activity': 'Activité Récente'
            }
        };
        
        this.initialize();
    }
    
    initialize() {
        this.loadMerchantData();
        this.setupEventListeners();
        this.loadDashboardData();
        this.initializeTableLayout();
        this.loadLanguageFromStorage();
        this.showSection('overview');
    }
    
    loadMerchantData() {
        // 从会话存储加载商家数据
        const sessionData = JSON.parse(localStorage.getItem('mapleTableMerchantSession') || '{}');
        if (sessionData.merchantId) {
            const merchants = JSON.parse(localStorage.getItem('mapleTableMerchants') || '[]');
            const merchant = merchants.find(m => m.id === sessionData.merchantId);
            
            if (merchant) {
                this.updateRestaurantInfo(merchant);
            }
        }
    }
    
    updateRestaurantInfo(merchant) {
        document.getElementById('restaurantName').textContent = merchant.restaurant.name;
        document.getElementById('restaurantType').textContent = merchant.restaurant.cuisine;
    }
    
    setupEventListeners() {
        // 侧边栏切换
        document.addEventListener('click', (e) => {
            if (e.target.closest('.user-btn')) {
                this.toggleUserMenu();
            }
        });
        
        // 点击外部关闭下拉菜单
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.user-menu')) {
                document.getElementById('userDropdown').classList.remove('show');
            }
        });
        
        // 键盘快捷键
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case '1':
                        e.preventDefault();
                        this.showSection('overview');
                        break;
                    case '2':
                        e.preventDefault();
                        this.showSection('bookings');
                        break;
                    case '3':
                        e.preventDefault();
                        this.showSection('tables');
                        break;
                }
            }
        });
    }
    
    showSection(sectionName) {
        // 隐藏所有页面
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        
        // 显示选中页面
        document.getElementById(sectionName + 'Section').classList.add('active');
        
        // 更新导航状态
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');
        
        // 更新面包屑
        const sectionTitles = {
            'overview': this.currentLanguage === 'fr' ? 'Aperçu' : 'Overview',
            'bookings': this.currentLanguage === 'fr' ? 'Réservations' : 'Bookings',
            'tables': this.currentLanguage === 'fr' ? 'Plan des Tables' : 'Table Layout',
            'menu': this.currentLanguage === 'fr' ? 'Gestion du Menu' : 'Menu Management',
            'analytics': this.currentLanguage === 'fr' ? 'Analyses' : 'Analytics',
            'promotion': this.currentLanguage === 'fr' ? 'Promotions' : 'Promotions',
            'reviews': this.currentLanguage === 'fr' ? 'Avis' : 'Reviews',
            'settings': this.currentLanguage === 'fr' ? 'Paramètres' : 'Settings'
        };
        document.getElementById('currentSection').textContent = sectionTitles[sectionName];
        
        this.currentSection = sectionName;
        
        // 根据页面加载相应数据
        switch (sectionName) {
            case 'overview':
                this.loadOverviewData();
                break;
            case 'bookings':
                this.loadBookingsData();
                break;
            case 'tables':
                this.renderTableLayout();
                break;
        }
    }
    
    loadDashboardData() {
        // 生成模拟数据
        this.generateMockBookings();
        this.updateDateDisplay();
    }
    
    generateMockBookings() {
        const today = new Date();
        const customers = [
            { name: 'John Smith', phone: '(416) 555-0123', avatar: 'JS' },
            { name: 'Marie Dubois', phone: '(514) 555-0456', avatar: 'MD' },
            { name: 'David Wong', phone: '(604) 555-0789', avatar: 'DW' },
            { name: 'Sarah Johnson', phone: '(403) 555-0321', avatar: 'SJ' },
            { name: 'Pierre Martin', phone: '(819) 555-0654', avatar: 'PM' }
        ];
        
        this.bookings = [];
        for (let i = 0; i < 24; i++) {
            const customer = customers[Math.floor(Math.random() * customers.length)];
            const bookingDate = new Date(today);
            bookingDate.setDate(today.getDate() + Math.floor(Math.random() * 14) - 7);
            
            const booking = {
                id: 'BK' + (1000 + i),
                customer: customer,
                date: bookingDate.toISOString().split('T')[0],
                time: ['11:30', '12:00', '12:30', '13:00', '17:30', '18:00', '18:30', '19:00', '19:30'][Math.floor(Math.random() * 9)],
                partySize: Math.floor(Math.random() * 6) + 2,
                tableNumber: Math.floor(Math.random() * 20) + 1,
                status: ['pending', 'confirmed', 'completed'][Math.floor(Math.random() * 3)],
                specialRequests: Math.random() > 0.7 ? 'Vegetarian options needed' : '',
                confirmationNumber: 'MT' + Date.now().toString().slice(-6) + i
            };
            
            this.bookings.push(booking);
        }
    }
    
    loadOverviewData() {
        this.renderTodayBookings();
        this.renderTablePreview();
        this.renderRecentActivity();
    }
    
    renderTodayBookings() {
        const today = new Date().toISOString().split('T')[0];
        const todayBookings = this.bookings.filter(b => b.date === today);
        
        const timeline = document.getElementById('todayTimeline');
        timeline.innerHTML = '';
        
        if (todayBookings.length === 0) {
            timeline.innerHTML = `
                <div class="empty-timeline">
                    <p>${this.currentLanguage === 'fr' ? 'Aucune réservation aujourd\'hui' : 'No bookings today'}</p>
                </div>
            `;
            return;
        }
        
        todayBookings.sort((a, b) => a.time.localeCompare(b.time));
        
        todayBookings.forEach(booking => {
            const item = document.createElement('div');
            item.className = 'timeline-item';
            item.innerHTML = `
                <div class="timeline-time">${booking.time}</div>
                <div class="timeline-content">
                    <h4>${booking.customer.name}</h4>
                    <p>${booking.partySize} ${this.currentLanguage === 'fr' ? 'invités' : 'guests'} • Table ${booking.tableNumber}</p>
                </div>
            `;
            timeline.appendChild(item);
        });
    }
    
    renderTablePreview() {
        const preview = document.getElementById('tablePreview');
        preview.innerHTML = '';
        
        // 生成示例桌位布局
        const tables = [
            { id: 1, x: 20, y: 30, size: 4, occupied: true },
            { id: 2, x: 80, y: 30, size: 2, occupied: false },
            { id: 3, x: 140, y: 30, size: 6, occupied: true },
            { id: 4, x: 20, y: 80, size: 4, occupied: false },
            { id: 5, x: 80, y: 80, size: 2, occupied: true },
            { id: 6, x: 140, y: 80, size: 8, occupied: false },
            { id: 7, x: 50, y: 130, size: 4, occupied: true },
            { id: 8, x: 110, y: 130, size: 6, occupied: false }
        ];
        
        tables.forEach(table => {
            const tableEl = document.createElement('div');
            tableEl.className = `preview-table ${table.occupied ? 'occupied' : 'available'}`;
            tableEl.style.cssText = `
                left: ${table.x}px;
                top: ${table.y}px;
                width: ${30 + table.size * 2}px;
                height: ${30 + table.size * 2}px;
            `;
            tableEl.textContent = table.id;
            preview.appendChild(tableEl);
        });
    }
    
    renderRecentActivity() {
        const activities = [
            {
                type: 'booking',
                icon: 'fas fa-calendar-plus',
                iconClass: 'booking',
                title: 'New booking received',
                titleF: 'Nouvelle réservation reçue',
                description: 'Sarah Johnson for 4 guests',
                descriptionF: 'Sarah Johnson pour 4 invités',
                time: '2 min ago',
                timeF: 'Il y a 2 min'
            },
            {
                type: 'payment',
                icon: 'fas fa-dollar-sign',
                iconClass: 'payment',
                title: 'Payment received',
                titleF: 'Paiement reçu',
                description: '$89.50 from table 7',
                descriptionF: '89,50$ de la table 7',
                time: '15 min ago',
                timeF: 'Il y a 15 min'
            },
            {
                type: 'review',
                icon: 'fas fa-star',
                iconClass: 'review',
                title: 'New review',
                titleF: 'Nouvel avis',
                description: '5 stars from David Wong',
                descriptionF: '5 étoiles de David Wong',
                time: '1 hour ago',
                timeF: 'Il y a 1 heure'
            }
        ];
        
        const activityList = document.getElementById('activityList');
        activityList.innerHTML = '';
        
        activities.forEach(activity => {
            const item = document.createElement('div');
            item.className = 'activity-item';
            
            const title = this.currentLanguage === 'fr' ? activity.titleF : activity.title;
            const description = this.currentLanguage === 'fr' ? activity.descriptionF : activity.description;
            const time = this.currentLanguage === 'fr' ? activity.timeF : activity.time;
            
            item.innerHTML = `
                <div class="activity-icon ${activity.iconClass}">
                    <i class="${activity.icon}"></i>
                </div>
                <div class="activity-content">
                    <h4>${title}</h4>
                    <p>${description}</p>
                </div>
                <div class="activity-time">${time}</div>
            `;
            activityList.appendChild(item);
        });
    }
    
    loadBookingsData() {
        this.renderBookingsTable();
        this.updateBookingCounts();
    }
    
    renderBookingsTable() {
        const tableBody = document.getElementById('bookingsTableBody');
        tableBody.innerHTML = '';
        
        this.bookings.forEach(booking => {
            const row = document.createElement('div');
            row.className = 'booking-row';
            
            const formattedDate = new Date(booking.date).toLocaleDateString(
                this.currentLanguage === 'fr' ? 'fr-CA' : 'en-CA',
                { month: 'short', day: 'numeric' }
            );
            
            row.innerHTML = `
                <div class="customer-info">
                    <div class="customer-avatar">${booking.customer.avatar}</div>
                    <div class="customer-details">
                        <h4>${booking.customer.name}</h4>
                        <p>${booking.customer.phone}</p>
                    </div>
                </div>
                <div class="booking-datetime">
                    <div>${formattedDate}</div>
                    <div>${booking.time}</div>
                </div>
                <div class="party-size">${booking.partySize}</div>
                <div class="table-number">Table ${booking.tableNumber}</div>
                <div class="booking-status ${booking.status}">${this.getStatusText(booking.status)}</div>
                <div class="booking-actions">
                    <button class="action-btn" onclick="viewBooking('${booking.id}')" title="View Details">
                        <i class="fas fa-eye"></i>
                    </button>
                    ${booking.status === 'pending' ? `
                        <button class="action-btn" onclick="confirmBooking('${booking.id}')" title="Confirm">
                            <i class="fas fa-check"></i>
                        </button>
                    ` : ''}
                    <button class="action-btn" onclick="editBooking('${booking.id}')" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn" onclick="cancelBooking('${booking.id}')" title="Cancel">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;
            
            tableBody.appendChild(row);
        });
    }
    
    getStatusText(status) {
        const statusTexts = {
            pending: this.currentLanguage === 'fr' ? 'En Attente' : 'Pending',
            confirmed: this.currentLanguage === 'fr' ? 'Confirmée' : 'Confirmed',
            completed: this.currentLanguage === 'fr' ? 'Terminée' : 'Completed'
        };
        return statusTexts[status] || status;
    }
    
    updateBookingCounts() {
        const counts = {
            all: this.bookings.length,
            pending: this.bookings.filter(b => b.status === 'pending').length,
            confirmed: this.bookings.filter(b => b.status === 'confirmed').length,
            completed: this.bookings.filter(b => b.status === 'completed').length
        };
        
        document.getElementById('pendingBookings').textContent = counts.pending;
        
        // 更新筛选标签计数
        document.querySelectorAll('.filter-tab').forEach(tab => {
            const filter = tab.getAttribute('data-filter');
            const countElement = tab.querySelector('.count');
            if (countElement && counts[filter] !== undefined) {
                countElement.textContent = counts[filter];
            }
        });
    }
    
    // 桌位布局管理
    initializeTableLayout() {
        this.createInitialLayout();
    }
    
    createInitialLayout() {
        this.tableLayout = [
            { id: 't1', type: 'round-4', x: 100, y: 100, capacity: 4, name: 'Table 1' },
            { id: 't2', type: 'round-2', x: 250, y: 100, capacity: 2, name: 'Table 2' },
            { id: 't3', type: 'square-4', x: 400, y: 100, capacity: 4, name: 'Table 3' },
            { id: 't4', type: 'rect-6', x: 100, y: 250, capacity: 6, name: 'Table 4' },
            { id: 't5', type: 'rect-8', x: 300, y: 250, capacity: 8, name: 'Table 5' }
        ];
    }
    
    renderTableLayout() {
        const canvas = document.getElementById('tableCanvas');
        canvas.innerHTML = '';
        
        this.tableLayout.forEach(table => {
            const tableEl = this.createTableElement(table);
            canvas.appendChild(tableEl);
        });
    }
    
    createTableElement(table) {
        const tableEl = document.createElement('div');
        tableEl.className = `canvas-table ${table.type.split('-')[0]}`;
        tableEl.setAttribute('data-table-id', table.id);
        
        const size = this.getTableSize(table.type);
        tableEl.style.cssText = `
            left: ${table.x}px;
            top: ${table.y}px;
            width: ${size.width}px;
            height: ${size.height}px;
        `;
        
        tableEl.textContent = table.capacity;
        
        // 添加事件监听器
        tableEl.addEventListener('click', () => this.selectTable(table.id));
        tableEl.addEventListener('mousedown', (e) => this.startDrag(e, table.id));
        
        return tableEl;
    }
    
    getTableSize(type) {
        const sizes = {
            'round-2': { width: 60, height: 60 },
            'round-4': { width: 80, height: 80 },
            'square-4': { width: 80, height: 80 },
            'rect-6': { width: 120, height: 80 },
            'rect-8': { width: 160, height: 80 }
        };
        return sizes[type] || { width: 80, height: 80 };
    }
    
    selectTable(tableId) {
        // 移除之前的选中状态
        document.querySelectorAll('.canvas-table').forEach(el => {
            el.classList.remove('selected');
        });
        
        // 选中当前桌子
        const tableEl = document.querySelector(`[data-table-id="${tableId}"]`);
        if (tableEl) {
            tableEl.classList.add('selected');
            this.selectedTable = tableId;
            this.updateTableInfo(tableId);
        }
    }
    
    updateTableInfo(tableId) {
        const table = this.tableLayout.find(t => t.id === tableId);
        if (!table) return;
        
        const infoPanel = document.getElementById('selectedTableInfo');
        infoPanel.innerHTML = `
            <div class="table-info-content">
                <h4>${table.name}</h4>
                <p>${this.currentLanguage === 'fr' ? 'Capacité' : 'Capacity'}: ${table.capacity} ${this.currentLanguage === 'fr' ? 'personnes' : 'people'}</p>
                <p>${this.currentLanguage === 'fr' ? 'Type' : 'Type'}: ${table.type}</p>
                <p>${this.currentLanguage === 'fr' ? 'Position' : 'Position'}: (${table.x}, ${table.y})</p>
                <div class="table-info-actions">
                    <button class="btn btn-sm btn-secondary" onclick="deleteTable('${tableId}')">
                        <i class="fas fa-trash"></i>
                        ${this.currentLanguage === 'fr' ? 'Supprimer' : 'Delete'}
                    </button>
                </div>
            </div>
        `;
    }
    
    addTable(type) {
        const newTable = {
            id: 't' + (this.tableLayout.length + 1),
            type: type,
            x: 150 + Math.random() * 200,
            y: 150 + Math.random() * 200,
            capacity: parseInt(type.split('-')[1]),
            name: `Table ${this.tableLayout.length + 1}`
        };
        
        this.tableLayout.push(newTable);
        this.renderTableLayout();
        this.selectTable(newTable.id);
    }
    
    deleteTable(tableId) {
        this.tableLayout = this.tableLayout.filter(t => t.id !== tableId);
        this.renderTableLayout();
        this.selectedTable = null;
        
        const infoPanel = document.getElementById('selectedTableInfo');
        infoPanel.innerHTML = `<p>${this.currentLanguage === 'fr' ? 'Sélectionnez une table pour modifier' : 'Select a table to edit'}</p>`;
    }
    
    saveLayout() {
        localStorage.setItem('merchantTableLayout', JSON.stringify(this.tableLayout));
        this.showNotification(
            this.currentLanguage === 'fr' ? 'Aménagement sauvegardé avec succès' : 'Layout saved successfully',
            'success'
        );
    }
    
    resetLayout() {
        if (confirm(this.currentLanguage === 'fr' ? 'Réinitialiser l\'aménagement?' : 'Reset layout?')) {
            this.createInitialLayout();
            this.renderTableLayout();
            this.showNotification(
                this.currentLanguage === 'fr' ? 'Aménagement réinitialisé' : 'Layout reset',
                'info'
            );
        }
    }
    
    // 拖拽功能
    startDrag(e, tableId) {
        e.preventDefault();
        const table = this.tableLayout.find(t => t.id === tableId);
        if (!table) return;
        
        const tableEl = document.querySelector(`[data-table-id="${tableId}"]`);
        const canvas = document.getElementById('tableCanvas');
        const canvasRect = canvas.getBoundingClientRect();
        
        const startX = e.clientX - canvasRect.left - table.x;
        const startY = e.clientY - canvasRect.top - table.y;
        
        const onMouseMove = (e) => {
            const newX = e.clientX - canvasRect.left - startX;
            const newY = e.clientY - canvasRect.top - startY;
            
            // 边界检查
            const maxX = canvas.offsetWidth - tableEl.offsetWidth;
            const maxY = canvas.offsetHeight - tableEl.offsetHeight;
            
            table.x = Math.max(0, Math.min(newX, maxX));
            table.y = Math.max(0, Math.min(newY, maxY));
            
            tableEl.style.left = table.x + 'px';
            tableEl.style.top = table.y + 'px';
            
            if (this.selectedTable === tableId) {
                this.updateTableInfo(tableId);
            }
        };
        
        const onMouseUp = () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };
        
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    }
    
    // 画布工具
    toggleGrid() {
        this.gridVisible = !this.gridVisible;
        const grid = document.getElementById('canvasGrid');
        grid.style.display = this.gridVisible ? 'block' : 'none';
    }
    
    zoomIn() {
        this.zoomLevel = Math.min(200, this.zoomLevel + 25);
        this.updateZoom();
    }
    
    zoomOut() {
        this.zoomLevel = Math.max(50, this.zoomLevel - 25);
        this.updateZoom();
    }
    
    updateZoom() {
        const canvas = document.getElementById('tableCanvas');
        canvas.style.transform = `scale(${this.zoomLevel / 100})`;
        canvas.style.transformOrigin = 'top left';
        
        document.querySelector('.zoom-level').textContent = this.zoomLevel + '%';
    }
    
    // 通用功能
    toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        const main = document.querySelector('.dashboard-main');
        
        if (window.innerWidth <= 768) {
            sidebar.classList.toggle('show');
        } else {
            sidebar.classList.toggle('collapsed');
            main.classList.toggle('expanded');
        }
    }
    
    toggleNotifications() {
        const panel = document.getElementById('notificationPanel');
        panel.classList.toggle('show');
        
        if (panel.classList.contains('show')) {
            this.loadNotifications();
        }
    }
    
    loadNotifications() {
        const notifications = [
            {
                title: 'New Booking Request',
                titleF: 'Nouvelle Demande de Réservation',
                message: 'Sarah Johnson wants to book for 4 people',
                messageF: 'Sarah Johnson veut réserver pour 4 personnes',
                time: '2 minutes ago',
                timeF: 'Il y a 2 minutes'
            },
            {
                title: 'Payment Received',
                titleF: 'Paiement Reçu',
                message: '$89.50 payment confirmed for table 7',
                messageF: 'Paiement de 89,50$ confirmé pour la table 7',
                time: '15 minutes ago',
                timeF: 'Il y a 15 minutes'
            },
            {
                title: 'New Review',
                titleF: 'Nouvel Avis',
                message: '5-star review from David Wong',
                messageF: 'Avis 5 étoiles de David Wong',
                time: '1 hour ago',
                timeF: 'Il y a 1 heure'
            }
        ];
        
        const notificationList = document.getElementById('notificationList');
        notificationList.innerHTML = '';
        
        notifications.forEach(notification => {
            const item = document.createElement('div');
            item.className = 'notification-item';
            
            const title = this.currentLanguage === 'fr' ? notification.titleF : notification.title;
            const message = this.currentLanguage === 'fr' ? notification.messageF : notification.message;
            const time = this.currentLanguage === 'fr' ? notification.timeF : notification.time;
            
            item.innerHTML = `
                <h4>${title}</h4>
                <p>${message}</p>
                <div class="notification-time">${time}</div>
            `;
            
            notificationList.appendChild(item);
        });
    }
    
    toggleUserMenu() {
        const dropdown = document.getElementById('userDropdown');
        dropdown.classList.toggle('show');
    }
    
    updateDateDisplay() {
        const today = new Date();
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            weekday: 'long'
        };
        
        const formattedDate = today.toLocaleDateString(
            this.currentLanguage === 'fr' ? 'fr-CA' : 'en-CA',
            options
        );
        
        document.getElementById('todayDate').textContent = formattedDate;
    }
    
    // 语言切换
    toggleLanguage() {
        this.currentLanguage = this.currentLanguage === 'en' ? 'fr' : 'en';
        document.getElementById('currentLang').textContent = this.currentLanguage.toUpperCase();
        localStorage.setItem('mapleTableLanguage', this.currentLanguage);
        this.updateTranslations();
        this.updateDateDisplay();
        
        // 重新渲染当前页面数据
        this.showSection(this.currentSection);
    }
    
    loadLanguageFromStorage() {
        const savedLanguage = localStorage.getItem('mapleTableLanguage');
        if (savedLanguage && savedLanguage !== this.currentLanguage) {
            this.currentLanguage = savedLanguage;
            document.getElementById('currentLang').textContent = this.currentLanguage.toUpperCase();
            this.updateTranslations();
        }
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
        
        // 更新页面标题
        document.title = this.currentLanguage === 'fr' ? 
            'Tableau de Bord Restaurant - MapleTable' : 
            'Restaurant Dashboard - MapleTable';
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            left: 50%;
            transform: translateX(-50%);
            background: ${type === 'error' ? '#dc3545' : type === 'success' ? '#28a745' : '#17a2b8'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 25px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
            z-index: 5000;
            font-weight: 600;
            animation: slideInDown 0.3s ease;
            max-width: 90%;
            text-align: center;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutUp 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }
}

// 全局函数
function showSection(section) {
    dashboard.showSection(section);
}

function toggleSidebar() {
    dashboard.toggleSidebar();
}

function toggleNotifications() {
    dashboard.toggleNotifications();
}

function toggleUserMenu() {
    dashboard.toggleUserMenu();
}

function toggleLanguage() {
    dashboard.toggleLanguage();
}

function addTable(type) {
    dashboard.addTable(type);
}

function deleteTable(tableId) {
    dashboard.deleteTable(tableId);
}

function saveLayout() {
    dashboard.saveLayout();
}

function resetLayout() {
    dashboard.resetLayout();
}

function toggleGrid() {
    dashboard.toggleGrid();
}

function zoomIn() {
    dashboard.zoomIn();
}

function zoomOut() {
    dashboard.zoomOut();
}

function filterBookings(filter) {
    // 筛选预订
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    if (filter) {
        document.querySelector(`[data-filter="${filter}"]`).classList.add('active');
    }
}

function searchBookings(query) {
    // 搜索预订
    console.log('Searching bookings:', query);
}

function viewBooking(bookingId) {
    console.log('View booking:', bookingId);
}

function confirmBooking(bookingId) {
    console.log('Confirm booking:', bookingId);
}

function editBooking(bookingId) {
    console.log('Edit booking:', bookingId);
}

function cancelBooking(bookingId) {
    console.log('Cancel booking:', bookingId);
}

function exportReport() {
    console.log('Export report');
}

function exportBookings() {
    console.log('Export bookings');
}

function showQuickBooking() {
    console.log('Show quick booking modal');
}

function showUpgradeModal() {
    document.getElementById('upgradeModal').classList.add('show');
}

function closeModal() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('show');
    });
}

function startTrial() {
    alert('Free trial started! Redirecting to upgrade page...');
    closeModal();
}

function logout() {
    if (confirm('Are you sure you want to sign out?')) {
        localStorage.removeItem('mapleTableMerchantSession');
        sessionStorage.removeItem('mapleTableMerchantSession');
        window.location.href = 'merchant-auth.html';
    }
}

// 初始化仪表板
let dashboard;
document.addEventListener('DOMContentLoaded', () => {
    dashboard = new MerchantDashboard();
});

// 添加CSS动画
const dashboardStyles = document.createElement('style');
dashboardStyles.textContent = `
    @keyframes slideInDown {
        from { transform: translate(-50%, -100%); opacity: 0; }
        to { transform: translate(-50%, 0); opacity: 1; }
    }
    
    @keyframes slideOutUp {
        to { transform: translate(-50%, -100%); opacity: 0; }
    }
    
    .btn {
        padding: var(--spacing-sm) var(--spacing-md);
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        display: inline-flex;
        align-items: center;
        gap: var(--spacing-xs);
        border: none;
        text-decoration: none;
    }
    
    .btn-primary {
        background: var(--canadian-red);
        color: white;
    }
    
    .btn-primary:hover {
        background: #CC0000;
        transform: translateY(-1px);
    }
    
    .btn-secondary {
        background: var(--background);
        color: var(--dark-text);
        border: 2px solid var(--border-color);
    }
    
    .btn-secondary:hover {
        border-color: var(--canadian-red);
        color: var(--canadian-red);
    }
    
    .btn-sm {
        padding: var(--spacing-xs) var(--spacing-sm);
        font-size: var(--font-sm);
    }
    
    .date-filter input[type="date"] {
        padding: var(--spacing-sm) var(--spacing-md);
        border: 2px solid var(--border-color);
        border-radius: 8px;
        background: var(--card-background);
        color: var(--dark-text);
        transition: all 0.3s ease;
    }
    
    .date-filter input[type="date"]:focus {
        outline: none;
        border-color: var(--canadian-red);
        box-shadow: 0 0 0 3px rgba(255, 0, 0, 0.1);
    }
`;
document.head.appendChild(dashboardStyles);