// 预订管理页面功能
class BookingsManager {
    constructor() {
        this.currentFilter = 'all';
        this.bookings = [];
        this.currentMonth = new Date();
        this.init();
    }

    init() {
        this.loadBookings();
        this.renderBookings();
        this.setupEventListeners();
        console.log('📅 预订管理系统已初始化');
    }

    // 加载用户预订数据
    loadBookings() {
        // 从localStorage获取用户预订
        const savedBookings = localStorage.getItem('userBookings');
        
        // 模拟预订数据
        const mockBookings = [
            {
                id: 'BK001',
                restaurantName: 'CN Tower Restaurant',
                restaurantLocation: 'Downtown Toronto, ON',
                date: '2024-01-25',
                time: '19:00',
                partySize: 4,
                tableId: 'W2',
                status: 'confirmed',
                specialRequests: 'Window seat, celebrating anniversary',
                confirmationCode: 'MTR-789456',
                estimatedDuration: 120,
                created: '2024-01-20T10:30:00Z'
            },
            {
                id: 'BK002',
                restaurantName: 'Maple Leaf Bistro',
                restaurantLocation: 'King Street W, Toronto',
                date: '2024-01-28',
                time: '12:30',
                partySize: 2,
                tableId: 'P1',
                status: 'pending',
                specialRequests: 'Business lunch, quiet area',
                confirmationCode: 'MLB-123789',
                estimatedDuration: 90,
                created: '2024-01-22T14:15:00Z'
            },
            {
                id: 'BK003',
                restaurantName: 'Rocky Mountain Grill',
                restaurantLocation: 'Calgary, AB',
                date: '2024-02-02',
                time: '18:00',
                partySize: 6,
                tableId: 'C3',
                status: 'confirmed',
                specialRequests: 'Family dinner, high chair needed',
                confirmationCode: 'RMG-456123',
                estimatedDuration: 150,
                created: '2024-01-23T09:45:00Z'
            },
            {
                id: 'BK004',
                restaurantName: 'The Harbor View',
                restaurantLocation: 'Vancouver, BC',
                date: '2024-01-15',
                time: '20:00',
                partySize: 2,
                tableId: 'W1',
                status: 'completed',
                specialRequests: 'Romantic dinner',
                confirmationCode: 'THV-789012',
                estimatedDuration: 120,
                created: '2024-01-10T16:20:00Z',
                rating: 5,
                review: 'Amazing seafood and beautiful sunset view!'
            },
            {
                id: 'BK005',
                restaurantName: 'Prairie Steakhouse',
                restaurantLocation: 'Winnipeg, MB',
                date: '2024-01-18',
                time: '19:30',
                partySize: 8,
                tableId: 'P2',
                status: 'completed',
                specialRequests: 'Birthday celebration',
                confirmationCode: 'PSH-345678',
                estimatedDuration: 180,
                created: '2024-01-12T11:30:00Z',
                rating: 4,
                review: 'Great steaks, friendly service!'
            }
        ];

        this.bookings = savedBookings ? JSON.parse(savedBookings) : mockBookings;
        this.updateFilterCounts();
    }

    // 更新筛选器计数
    updateFilterCounts() {
        const counts = {
            all: this.bookings.length,
            upcoming: this.bookings.filter(b => this.isUpcoming(b)).length,
            confirmed: this.bookings.filter(b => b.status === 'confirmed').length,
            pending: this.bookings.filter(b => b.status === 'pending').length,
            completed: this.bookings.filter(b => b.status === 'completed').length
        };

        Object.keys(counts).forEach(status => {
            const chip = document.querySelector(`[data-status="${status}"]`);
            if (chip) {
                const countElement = chip.querySelector('.count');
                if (countElement) {
                    countElement.textContent = counts[status];
                }
            }
        });
    }

    // 检查预订是否即将到来
    isUpcoming(booking) {
        const bookingDate = new Date(`${booking.date}T${booking.time}`);
        const now = new Date();
        return bookingDate > now && (booking.status === 'confirmed' || booking.status === 'pending');
    }

    // 渲染预订列表
    renderBookings() {
        const container = document.getElementById('bookingsList');
        const emptyState = document.getElementById('emptyState');
        
        let filteredBookings = this.bookings;
        
        // 应用筛选
        if (this.currentFilter !== 'all') {
            if (this.currentFilter === 'upcoming') {
                filteredBookings = this.bookings.filter(b => this.isUpcoming(b));
            } else {
                filteredBookings = this.bookings.filter(b => b.status === this.currentFilter);
            }
        }

        if (filteredBookings.length === 0) {
            container.style.display = 'none';
            emptyState.style.display = 'block';
            return;
        }

        container.style.display = 'block';
        emptyState.style.display = 'none';

        // 按日期排序（即将到来的在前）
        filteredBookings.sort((a, b) => {
            const dateA = new Date(`${a.date}T${a.time}`);
            const dateB = new Date(`${b.date}T${b.time}`);
            return dateB - dateA; // 最新的在前
        });

        container.innerHTML = filteredBookings.map(booking => this.createBookingCard(booking)).join('');
    }

    // 创建预订卡片
    createBookingCard(booking) {
        const bookingDate = new Date(`${booking.date}T${booking.time}`);
        const isUpcoming = this.isUpcoming(booking);
        
        return `
            <div class="booking-card" onclick="showBookingDetails('${booking.id}')">
                <div class="booking-header">
                    <div class="restaurant-info">
                        <h3>${booking.restaurantName}</h3>
                        <div class="location">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${booking.restaurantLocation}</span>
                        </div>
                    </div>
                    <div class="booking-status ${booking.status}">
                        ${this.getStatusText(booking.status)}
                    </div>
                </div>
                
                <div class="booking-details">
                    <div class="detail-item">
                        <i class="fas fa-calendar-alt"></i>
                        <span>${this.formatDate(booking.date)}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-clock"></i>
                        <span>${booking.time}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-users"></i>
                        <span>${booking.partySize} ${booking.partySize === 1 ? 'person' : 'people'}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-table"></i>
                        <span>Table ${booking.tableId}</span>
                    </div>
                </div>
                
                ${booking.specialRequests ? `
                    <div class="special-requests">
                        <i class="fas fa-sticky-note"></i>
                        <span>${booking.specialRequests}</span>
                    </div>
                ` : ''}
                
                <div class="booking-actions">
                    ${this.getActionButtons(booking)}
                </div>
            </div>
        `;
    }

    // 获取状态文本
    getStatusText(status) {
        const statusTexts = {
            confirmed: 'Confirmed',
            pending: 'Pending',
            completed: 'Completed',
            cancelled: 'Cancelled'
        };
        return statusTexts[status] || status;
    }

    // 格式化日期
    formatDate(dateString) {
        const date = new Date(dateString);
        const options = { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric'
        };
        return date.toLocaleDateString('en-CA', options);
    }

    // 获取操作按钮
    getActionButtons(booking) {
        const buttons = [];
        
        if (booking.status === 'confirmed' && this.isUpcoming(booking)) {
            buttons.push(`
                <button class="action-btn-small primary" onclick="event.stopPropagation(); modifyBooking('${booking.id}')">
                    <i class="fas fa-edit"></i>
                    Modify
                </button>
            `);
            buttons.push(`
                <button class="action-btn-small" onclick="event.stopPropagation(); cancelBooking('${booking.id}')">
                    <i class="fas fa-times"></i>
                    Cancel
                </button>
            `);
        } else if (booking.status === 'pending') {
            buttons.push(`
                <button class="action-btn-small" onclick="event.stopPropagation(); cancelBooking('${booking.id}')">
                    <i class="fas fa-times"></i>
                    Cancel
                </button>
            `);
        } else if (booking.status === 'completed' && !booking.rating) {
            buttons.push(`
                <button class="action-btn-small primary" onclick="event.stopPropagation(); rateBooking('${booking.id}')">
                    <i class="fas fa-star"></i>
                    Rate
                </button>
            `);
        }
        
        buttons.push(`
            <button class="action-btn-small" onclick="event.stopPropagation(); shareBooking('${booking.id}')">
                <i class="fas fa-share"></i>
                Share
            </button>
        `);

        if (booking.status === 'completed') {
            buttons.push(`
                <button class="action-btn-small" onclick="event.stopPropagation(); rebookRestaurant('${booking.id}')">
                    <i class="fas fa-redo"></i>
                    Book Again
                </button>
            `);
        }

        return buttons.join('');
    }

    // 设置事件监听器
    setupEventListeners() {
        // 筛选器点击事件已通过onclick处理
        
        // 阻止模态框背景点击关闭
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('calendar-modal')) {
                this.toggleCalendarView();
            }
            if (e.target.classList.contains('booking-details-modal')) {
                this.closeBookingDetails();
            }
        });
    }

    // 筛选预订
    filterBookings(status) {
        this.currentFilter = status;
        
        // 更新筛选器样式
        document.querySelectorAll('.filter-chip').forEach(chip => {
            chip.classList.remove('active');
        });
        document.querySelector(`[data-status="${status}"]`).classList.add('active');
        
        this.renderBookings();
    }

    // 切换日历视图
    toggleCalendarView() {
        const modal = document.getElementById('calendarModal');
        const isVisible = modal.style.display !== 'none';
        
        if (isVisible) {
            modal.style.display = 'none';
        } else {
            modal.style.display = 'flex';
            this.renderCalendar();
        }
    }

    // 渲染日历
    renderCalendar() {
        const monthElement = document.getElementById('currentMonth');
        const gridElement = document.getElementById('calendarGrid');
        
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        
        monthElement.textContent = `${monthNames[this.currentMonth.getMonth()]} ${this.currentMonth.getFullYear()}`;
        
        // 清空网格
        gridElement.innerHTML = '';
        
        // 添加星期标题
        const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        weekdays.forEach(day => {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-weekday';
            dayElement.textContent = day;
            dayElement.style.fontWeight = '600';
            dayElement.style.color = 'var(--medium-text)';
            dayElement.style.textAlign = 'center';
            dayElement.style.padding = '8px 4px';
            gridElement.appendChild(dayElement);
        });
        
        // 获取月份信息
        const firstDay = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), 1);
        const lastDay = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());
        
        // 生成日历格子
        for (let i = 0; i < 42; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            dayElement.textContent = date.getDate();
            
            // 检查是否有预订
            const hasBooking = this.bookings.some(booking => {
                const bookingDate = new Date(booking.date);
                return bookingDate.toDateString() === date.toDateString();
            });
            
            if (hasBooking) {
                dayElement.classList.add('has-booking');
            }
            
            // 非当前月份的日期
            if (date.getMonth() !== this.currentMonth.getMonth()) {
                dayElement.style.opacity = '0.3';
            }
            
            gridElement.appendChild(dayElement);
        }
    }

    // 上一个月
    previousMonth() {
        this.currentMonth.setMonth(this.currentMonth.getMonth() - 1);
        this.renderCalendar();
    }

    // 下一个月
    nextMonth() {
        this.currentMonth.setMonth(this.currentMonth.getMonth() + 1);
        this.renderCalendar();
    }

    // 显示预订详情
    showBookingDetails(bookingId) {
        const booking = this.bookings.find(b => b.id === bookingId);
        if (!booking) return;

        const modal = document.getElementById('bookingDetailsModal');
        const content = document.getElementById('bookingDetailsContent');
        
        content.innerHTML = `
            <div class="booking-detail-header">
                <div class="restaurant-image" style="height: 120px; background: linear-gradient(45deg, var(--canadian-red), #dc2626); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-size: 2rem; margin-bottom: 20px;">
                    <i class="fas fa-utensils"></i>
                </div>
                <h2 style="margin: 0 0 8px 0; color: var(--dark-text);">${booking.restaurantName}</h2>
                <p style="color: var(--medium-text); margin: 0 0 16px 0;">
                    <i class="fas fa-map-marker-alt"></i> ${booking.restaurantLocation}
                </p>
                <div class="booking-status ${booking.status}" style="display: inline-block;">
                    ${this.getStatusText(booking.status)}
                </div>
            </div>
            
            <div class="booking-info-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin: 24px 0;">
                <div class="info-card" style="background: #f8fafc; padding: 16px; border-radius: 12px;">
                    <h4 style="margin: 0 0 8px 0; color: var(--dark-text); font-size: 0.9rem; font-weight: 600;">Date & Time</h4>
                    <p style="margin: 0; color: var(--dark-text); font-weight: 500;">
                        ${this.formatDate(booking.date)} at ${booking.time}
                    </p>
                </div>
                
                <div class="info-card" style="background: #f8fafc; padding: 16px; border-radius: 12px;">
                    <h4 style="margin: 0 0 8px 0; color: var(--dark-text); font-size: 0.9rem; font-weight: 600;">Party Size</h4>
                    <p style="margin: 0; color: var(--dark-text); font-weight: 500;">
                        ${booking.partySize} ${booking.partySize === 1 ? 'person' : 'people'}
                    </p>
                </div>
                
                <div class="info-card" style="background: #f8fafc; padding: 16px; border-radius: 12px;">
                    <h4 style="margin: 0 0 8px 0; color: var(--dark-text); font-size: 0.9rem; font-weight: 600;">Table</h4>
                    <p style="margin: 0; color: var(--dark-text); font-weight: 500;">
                        Table ${booking.tableId}
                    </p>
                </div>
                
                <div class="info-card" style="background: #f8fafc; padding: 16px; border-radius: 12px;">
                    <h4 style="margin: 0 0 8px 0; color: var(--dark-text); font-size: 0.9rem; font-weight: 600;">Confirmation</h4>
                    <p style="margin: 0; color: var(--dark-text); font-weight: 500; font-family: monospace;">
                        ${booking.confirmationCode}
                    </p>
                </div>
            </div>
            
            ${booking.specialRequests ? `
                <div class="special-requests-section" style="background: rgba(255, 0, 0, 0.05); padding: 16px; border-radius: 12px; margin: 16px 0;">
                    <h4 style="margin: 0 0 8px 0; color: var(--dark-text); font-size: 0.9rem; font-weight: 600;">
                        <i class="fas fa-sticky-note" style="margin-right: 8px; color: var(--canadian-red);"></i>
                        Special Requests
                    </h4>
                    <p style="margin: 0; color: var(--dark-text);">${booking.specialRequests}</p>
                </div>
            ` : ''}
            
            ${booking.rating ? `
                <div class="rating-section" style="background: rgba(34, 197, 94, 0.05); padding: 16px; border-radius: 12px; margin: 16px 0;">
                    <h4 style="margin: 0 0 8px 0; color: var(--dark-text); font-size: 0.9rem; font-weight: 600;">
                        <i class="fas fa-star" style="margin-right: 8px; color: #fbbf24;"></i>
                        Your Rating & Review
                    </h4>
                    <div style="margin-bottom: 8px;">
                        ${'★'.repeat(booking.rating)}${'☆'.repeat(5 - booking.rating)}
                    </div>
                    <p style="margin: 0; color: var(--dark-text); font-style: italic;">"${booking.review}"</p>
                </div>
            ` : ''}
            
            <div class="detail-actions" style="display: flex; gap: 12px; margin-top: 24px; flex-wrap: wrap;">
                ${this.getDetailActionButtons(booking)}
            </div>
        `;
        
        modal.style.display = 'flex';
    }

    // 获取详情页操作按钮
    getDetailActionButtons(booking) {
        const buttons = [];
        
        if (booking.status === 'confirmed' && this.isUpcoming(booking)) {
            buttons.push(`
                <button class="action-btn-small primary" onclick="modifyBooking('${booking.id}')">
                    <i class="fas fa-edit"></i>
                    Modify Booking
                </button>
            `);
        }
        
        buttons.push(`
            <button class="action-btn-small" onclick="shareBooking('${booking.id}')">
                <i class="fas fa-share"></i>
                Share Details
            </button>
        `);
        
        if (booking.status === 'completed') {
            buttons.push(`
                <button class="action-btn-small" onclick="rebookRestaurant('${booking.id}')">
                    <i class="fas fa-redo"></i>
                    Book Again
                </button>
            `);
        }
        
        if (booking.status !== 'cancelled' && booking.status !== 'completed') {
            buttons.push(`
                <button class="action-btn-small" onclick="cancelBooking('${booking.id}')" style="background: #fee2e2; color: #dc2626; border-color: #fecaca;">
                    <i class="fas fa-times"></i>
                    Cancel Booking
                </button>
            `);
        }
        
        return buttons.join('');
    }

    // 关闭预订详情
    closeBookingDetails() {
        document.getElementById('bookingDetailsModal').style.display = 'none';
    }
}

// 全局函数
function filterBookings(status) {
    if (window.bookingsManager) {
        window.bookingsManager.filterBookings(status);
    }
}

function toggleFilters() {
    const filters = document.getElementById('bookingFilters');
    filters.style.display = filters.style.display === 'none' ? 'block' : 'none';
}

function toggleCalendarView() {
    if (window.bookingsManager) {
        window.bookingsManager.toggleCalendarView();
    }
}

function previousMonth() {
    if (window.bookingsManager) {
        window.bookingsManager.previousMonth();
    }
}

function nextMonth() {
    if (window.bookingsManager) {
        window.bookingsManager.nextMonth();
    }
}

function showBookingDetails(bookingId) {
    if (window.bookingsManager) {
        window.bookingsManager.showBookingDetails(bookingId);
    }
}

function closeBookingDetails() {
    if (window.bookingsManager) {
        window.bookingsManager.closeBookingDetails();
    }
}

// 预订操作函数
function makeNewBooking() {
    window.location.href = 'index.html';
}

function findRestaurants() {
    window.location.href = 'explore.html';
}

function viewFavorites() {
    alert('Favorites feature coming soon!');
}

function modifyBooking(bookingId) {
    alert(`Modify booking ${bookingId} - Feature coming soon!`);
}

function cancelBooking(bookingId) {
    if (confirm('Are you sure you want to cancel this booking?')) {
        alert(`Booking ${bookingId} cancelled - Feature coming soon!`);
    }
}

function rateBooking(bookingId) {
    alert(`Rate booking ${bookingId} - Feature coming soon!`);
}

function shareBooking(bookingId) {
    if (navigator.share) {
        navigator.share({
            title: 'My Restaurant Booking',
            text: 'Check out my restaurant booking!',
            url: window.location.href
        });
    } else {
        alert('Sharing feature not supported in this browser');
    }
}

function rebookRestaurant(bookingId) {
    alert(`Rebook restaurant for booking ${bookingId} - Feature coming soon!`);
}

function goBack() {
    window.history.back();
}

// 导航函数
function switchTab(tab) {
    switch(tab) {
        case 'home':
            window.location.href = 'index.html';
            break;
        case 'explore':
            window.location.href = 'explore.html';
            break;
        case 'bookings':
            // 已在当前页面
            break;
        case 'profile':
            window.location.href = 'profile.html';
            break;
    }
}

function quickBook() {
    window.location.href = 'index.html';
}

// 初始化预订管理器
document.addEventListener('DOMContentLoaded', () => {
    window.bookingsManager = new BookingsManager();
});