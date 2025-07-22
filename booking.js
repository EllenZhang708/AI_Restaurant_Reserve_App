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
        
        // 模拟餐厅数据（在实际应用中会从API获取）
        this.restaurantData = {
            id: restaurantId || 1,
            name: 'The CN Tower Restaurant',
            nameF: 'Restaurant de la Tour CN',
            cuisine: 'Canadian Fine Dining',
            cuisineF: 'Grande Cuisine Canadienne',
            rating: 4.8,
            reviewCount: 2847,
            image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=200&fit=crop',
            phone: '(416) 362-5411',
            winterFeatures: ['Heated Interior', 'Panoramic Views', 'Winter Menu'],
            winterFeaturesF: ['Intérieur Chauffé', 'Vues Panoramiques', 'Menu d\'Hiver']
        };
        
        this.updateRestaurantDisplay();
    }
    
    updateRestaurantDisplay() {
        const name = this.currentLanguage === 'fr' && this.restaurantData.nameF ? 
                    this.restaurantData.nameF : this.restaurantData.name;
        const cuisine = this.currentLanguage === 'fr' && this.restaurantData.cuisineF ? 
                       this.restaurantData.cuisineF : this.restaurantData.cuisine;
        
        document.getElementById('restaurantName').textContent = name;
        document.getElementById('restaurantCuisine').textContent = cuisine;
        document.getElementById('restaurantRating').textContent = this.restaurantData.rating;
        document.getElementById('reviewCount').textContent = this.restaurantData.reviewCount;
        document.getElementById('restaurantImage').src = this.restaurantData.image;
        document.getElementById('restaurantImage').alt = name;
    }
    
    setupEventListeners() {
        // 表单提交事件
        document.getElementById('bookingForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitBooking();
        });
        
        // 日期输入事件
        document.getElementById('bookingDate').addEventListener('change', (e) => {
            this.selectedDate = e.target.value;
            this.updateSummary();
            this.renderTimeSlots(); // 根据日期重新渲染时间段
        });
        
        // 座位偏好事件
        document.querySelectorAll('input[name="preferences"]').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                if (e.target.checked) {
                    this.selectedPreferences.push(e.target.value);
                } else {
                    this.selectedPreferences = this.selectedPreferences.filter(
                        pref => pref !== e.target.value
                    );
                }
                this.updateSummary();
            });
        });
        
        // 特殊要求快速标签事件
        document.querySelectorAll('.request-tag').forEach(tag => {
            tag.addEventListener('click', () => {
                tag.classList.toggle('selected');
            });
        });
    }
    
    initializeDates() {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        // 设置日期输入的最小值为今天
        const dateInput = document.getElementById('bookingDate');
        dateInput.min = today.toISOString().split('T')[0];
        dateInput.value = today.toISOString().split('T')[0];
        this.selectedDate = dateInput.value;
        
        // 设置最大值为30天后
        const maxDate = new Date(today);
        maxDate.setDate(maxDate.getDate() + 30);
        dateInput.max = maxDate.toISOString().split('T')[0];
        
        // 更新日期建议按钮
        document.getElementById('todayDate').textContent = this.formatDate(today);
        document.getElementById('tomorrowDate').textContent = this.formatDate(tomorrow);
    }
    
    formatDate(date) {
        const options = { 
            month: 'short', 
            day: 'numeric',
            locale: this.currentLanguage === 'fr' ? 'fr-CA' : 'en-CA'
        };
        return date.toLocaleDateString(this.currentLanguage === 'fr' ? 'fr-CA' : 'en-CA', options);
    }
    
    selectToday() {
        const today = new Date();
        document.getElementById('bookingDate').value = today.toISOString().split('T')[0];
        this.selectedDate = today.toISOString().split('T')[0];
        this.updateDateSelection('today');
        this.updateSummary();
        this.renderTimeSlots();
    }
    
    selectTomorrow() {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        document.getElementById('bookingDate').value = tomorrow.toISOString().split('T')[0];
        this.selectedDate = tomorrow.toISOString().split('T')[0];
        this.updateDateSelection('tomorrow');
        this.updateSummary();
        this.renderTimeSlots();
    }
    
    updateDateSelection(selected) {
        document.querySelectorAll('.date-option').forEach(option => {
            option.classList.remove('selected');
        });
        document.querySelector(`.date-option.${selected}`).classList.add('selected');
    }
    
    renderTimeSlots() {
        const container = document.getElementById('timeSlots');
        container.innerHTML = '';
        
        // 检查是否是今天，如果是，禁用已过时间
        const selectedDate = new Date(this.selectedDate);
        const today = new Date();
        const isToday = selectedDate.toDateString() === today.toDateString();
        const currentHour = today.getHours();
        const currentMinute = today.getMinutes();
        
        this.timeSlots.forEach(slot => {
            const timeSlot = document.createElement('div');
            timeSlot.className = 'time-slot';
            
            // 检查时间是否已过（如果是今天）
            const [slotHour, slotMinute] = slot.time.split(':').map(Number);
            const slotPassed = isToday && (slotHour < currentHour || 
                                         (slotHour === currentHour && slotMinute <= currentMinute));
            
            if (!slot.available || slotPassed) {
                timeSlot.classList.add('unavailable');
            } else {
                // 标记冬季推荐时间
                if (slot.winterFriendly) {
                    timeSlot.classList.add('winter-preferred');
                }
                
                timeSlot.addEventListener('click', () => {
                    if (!timeSlot.classList.contains('unavailable')) {
                        this.selectTimeSlot(slot.time, timeSlot);
                    }
                });
            }
            
            timeSlot.textContent = slot.time;
            container.appendChild(timeSlot);
        });
    }
    
    selectTimeSlot(time, element) {
        // 移除其他选中状态
        document.querySelectorAll('.time-slot').forEach(slot => {
            slot.classList.remove('selected');
        });
        
        // 选中当前时间段
        element.classList.add('selected');
        this.selectedTime = time;
        this.updateSummary();
    }
    
    changePartySize(delta) {
        this.partySize = Math.max(1, Math.min(20, this.partySize + delta));
        document.getElementById('partySize').textContent = this.partySize;
        this.updateSummary();
    }
    
    addQuickRequest(type) {
        const textarea = document.getElementById('specialRequests');
        const requestTexts = {
            birthday: {
                en: 'Birthday celebration - please prepare a special dessert',
                fr: 'Célébration d\'anniversaire - veuillez préparer un dessert spécial'
            },
            anniversary: {
                en: 'Anniversary dinner - romantic table setting preferred',
                fr: 'Dîner d\'anniversaire - table romantique préférée'
            },
            vegetarian: {
                en: 'Vegetarian options needed',
                fr: 'Options végétariennes nécessaires'
            },
            halal: {
                en: 'Halal dietary requirements',
                fr: 'Exigences alimentaires halal'
            }
        };
        
        const text = requestTexts[type][this.currentLanguage];
        const currentValue = textarea.value.trim();
        
        if (currentValue && !currentValue.includes(text)) {
            textarea.value = currentValue + '\\n' + text;
        } else if (!currentValue) {
            textarea.value = text;
        }
        
        // 标记按钮为选中状态
        event.target.classList.toggle('selected');
    }
    
    updateSummary() {
        // 更新日期
        if (this.selectedDate) {
            const date = new Date(this.selectedDate);
            const formattedDate = date.toLocaleDateString(
                this.currentLanguage === 'fr' ? 'fr-CA' : 'en-CA',
                { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
            );
            document.getElementById('summaryDate').textContent = formattedDate;
        }
        
        // 更新时间
        if (this.selectedTime) {
            document.getElementById('summaryTime').textContent = this.selectedTime;
        } else {
            document.getElementById('summaryTime').textContent = 
                this.currentLanguage === 'fr' ? 'Sélectionner l\'heure' : 'Select time';
        }
        
        // 更新人数
        const guestsText = this.currentLanguage === 'fr' ? 'invités' : 'guests';
        document.getElementById('summaryParty').textContent = `${this.partySize} ${guestsText}`;
    }
    
    async submitBooking() {
        if (!this.validateBooking()) {
            return;
        }
        
        // 显示加载状态
        const submitBtn = document.getElementById('bookBtn');
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
            <i class="fas fa-spinner fa-spin"></i>
            <span>${this.currentLanguage === 'fr' ? 'Traitement...' : 'Processing...'}</span>
        `;
        
        // 模拟预订处理
        try {
            await this.delay(2000);
            
            const bookingData = this.collectBookingData();
            const confirmationNumber = this.generateConfirmationNumber();
            
            // 保存预订到本地存储
            this.saveBooking(bookingData, confirmationNumber);
            
            // 显示确认
            this.showConfirmation(bookingData, confirmationNumber);
            
        } catch (error) {
            this.showNotification(
                this.currentLanguage === 'fr' ? 
                'Erreur de réservation. Veuillez réessayer.' : 
                'Booking error. Please try again.',
                'error'
            );
        } finally {
            // 恢复按钮状态
            submitBtn.disabled = false;
            submitBtn.innerHTML = `
                <i class="fas fa-check"></i>
                <span>${this.currentLanguage === 'fr' ? 'Confirmer la Réservation' : 'Confirm Reservation'}</span>
            `;
        }
    }
    
    validateBooking() {
        if (!this.selectedDate) {
            this.showNotification(
                this.currentLanguage === 'fr' ? 'Veuillez sélectionner une date' : 'Please select a date',
                'error'
            );
            return false;
        }
        
        if (!this.selectedTime) {
            this.showNotification(
                this.currentLanguage === 'fr' ? 'Veuillez sélectionner une heure' : 'Please select a time',
                'error'
            );
            return false;
        }
        
        const firstName = document.getElementById('firstName').value.trim();
        const lastName = document.getElementById('lastName').value.trim();
        const phone = document.getElementById('phoneNumber').value.trim();
        const email = document.getElementById('emailAddress').value.trim();
        
        if (!firstName || !lastName) {
            this.showNotification(
                this.currentLanguage === 'fr' ? 'Veuillez entrer votre nom complet' : 'Please enter your full name',
                'error'
            );
            return false;
        }
        
        if (!phone) {
            this.showNotification(
                this.currentLanguage === 'fr' ? 'Veuillez entrer votre numéro de téléphone' : 'Please enter your phone number',
                'error'
            );
            return false;
        }
        
        if (!email || !this.isValidEmail(email)) {
            this.showNotification(
                this.currentLanguage === 'fr' ? 'Veuillez entrer une adresse email valide' : 'Please enter a valid email address',
                'error'
            );
            return false;
        }
        
        return true;
    }
    
    isValidEmail(email) {
        const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
        return emailRegex.test(email);
    }
    
    collectBookingData() {
        return {
            restaurant: this.restaurantData,
            date: this.selectedDate,
            time: this.selectedTime,
            partySize: this.partySize,
            preferences: this.selectedPreferences,
            customer: {
                firstName: document.getElementById('firstName').value.trim(),
                lastName: document.getElementById('lastName').value.trim(),
                phone: document.getElementById('phoneNumber').value.trim(),
                email: document.getElementById('emailAddress').value.trim()
            },
            specialRequests: document.getElementById('specialRequests').value.trim(),
            language: this.currentLanguage,
            timestamp: new Date().toISOString()
        };
    }
    
    generateConfirmationNumber() {
        const prefix = 'MT';
        const date = new Date().toISOString().slice(2, 10).replace(/-/g, '');
        const random = Math.random().toString(36).substr(2, 3).toUpperCase();
        return `${prefix}${date}${random}`;
    }
    
    saveBooking(bookingData, confirmationNumber) {
        const booking = {
            confirmationNumber,
            ...bookingData,
            status: 'confirmed'
        };
        
        const bookings = JSON.parse(localStorage.getItem('mapleTableBookings') || '[]');
        bookings.push(booking);
        localStorage.setItem('mapleTableBookings', JSON.stringify(bookings));
    }
    
    showConfirmation(bookingData, confirmationNumber) {
        const modal = document.getElementById('confirmationModal');
        
        // 填充确认信息
        document.getElementById('confirmationNumber').textContent = confirmationNumber;
        
        const restaurantName = this.currentLanguage === 'fr' && bookingData.restaurant.nameF ? 
                              bookingData.restaurant.nameF : bookingData.restaurant.name;
        document.getElementById('confirmedRestaurant').textContent = restaurantName;
        
        const formattedDate = new Date(bookingData.date).toLocaleDateString(
            this.currentLanguage === 'fr' ? 'fr-CA' : 'en-CA',
            { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
        );
        document.getElementById('confirmedDate').textContent = formattedDate;
        document.getElementById('confirmedTime').textContent = bookingData.time;
        
        const guestsText = this.currentLanguage === 'fr' ? 'invités' : 'guests';
        document.getElementById('confirmedParty').textContent = `${bookingData.partySize} ${guestsText}`;
        document.getElementById('confirmedPhone').textContent = bookingData.customer.phone;
        
        modal.classList.add('show');
    }
    
    // 语言切换
    toggleLanguage() {
        this.currentLanguage = this.currentLanguage === 'en' ? 'fr' : 'en';
        document.getElementById('currentLang').textContent = this.currentLanguage.toUpperCase();
        localStorage.setItem('mapleTableLanguage', this.currentLanguage);
        this.updateTranslations();
        this.updateRestaurantDisplay();
        this.updateSummary();
    }
    
    loadLanguageFromStorage() {
        const savedLanguage = localStorage.getItem('mapleTableLanguage');
        if (savedLanguage && savedLanguage !== this.currentLanguage) {
            this.toggleLanguage();
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
            'Réservez Votre Table - MapleTable' : 
            'Book Your Table - MapleTable';
    }
    
    // 工具函数
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            left: 50%;
            transform: translateX(-50%);
            background: ${type === 'error' ? '#dc3545' : '#28a745'};
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
function goBack() {
    if (confirm('Are you sure you want to go back? Your booking information will be lost.')) {
        window.history.back() || (window.location.href = 'index.html');
    }
}

function toggleLanguage() {
    bookingSystem.toggleLanguage();
}

function selectToday() {
    bookingSystem.selectToday();
}

function selectTomorrow() {
    bookingSystem.selectTomorrow();
}

function changePartySize(delta) {
    bookingSystem.changePartySize(delta);
}

function addQuickRequest(type) {
    bookingSystem.addQuickRequest(type);
}

function addToCalendar() {
    const booking = bookingSystem.collectBookingData();
    const startDate = new Date(`${booking.date}T${booking.time}:00`);
    const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000); // 2小时后
    
    const event = {
        title: `Dinner at ${booking.restaurant.name}`,
        start: startDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z',
        end: endDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z',
        description: `Restaurant reservation for ${booking.partySize} people`,
        location: booking.restaurant.phone
    };
    
    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${event.start}/${event.end}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}`;
    
    window.open(calendarUrl, '_blank');
}

function goToReservations() {
    window.location.href = 'reservations.html';
}

function closeModal() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('show');
    });
}

// 初始化预订系统
let bookingSystem;
document.addEventListener('DOMContentLoaded', () => {
    bookingSystem = new CanadianBookingSystem();
});

// 添加CSS动画
const bookingStyles = document.createElement('style');
bookingStyles.textContent = `
    @keyframes slideInDown {
        from { transform: translate(-50%, -100%); opacity: 0; }
        to { transform: translate(-50%, 0); opacity: 1; }
    }
    
    @keyframes slideOutUp {
        to { transform: translate(-50%, -100%); opacity: 0; }
    }
`;
document.head.appendChild(bookingStyles);