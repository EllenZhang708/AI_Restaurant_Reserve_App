// Reservations Management - MapleTable Canadian Restaurant App

class ReservationsManager {
    constructor() {
        this.currentLanguage = 'en';
        this.currentFilter = 'all';
        this.reservations = [];
        this.selectedReservation = null;
        
        this.translations = {
            en: {
                'My Reservations': 'My Reservations',
                'All': 'All',
                'Upcoming': 'Upcoming', 
                'Past': 'Past',
                'Cancelled': 'Cancelled',
                'No Reservations Found': 'No Reservations Found',
                'You haven\'t made any reservations yet.': 'You haven\'t made any reservations yet.',
                'Find Restaurants': 'Find Restaurants',
                'New Reservation': 'New Reservation',
                'Reservation Details': 'Reservation Details',
                'Cancel Reservation': 'Cancel Reservation',
                'Modify Reservation': 'Modify Reservation',
                'View Details': 'View Details',
                'Modify': 'Modify',
                'Cancel': 'Cancel',
                'Call Restaurant': 'Call Restaurant',
                'Confirmed': 'Confirmed',
                'Upcoming': 'Upcoming',
                'Completed': 'Completed',
                'Cancelled': 'Cancelled',
                'guests': 'guests',
                'Winter dining ready': 'Winter dining ready'
            },
            fr: {
                'My Reservations': 'Mes Réservations',
                'All': 'Toutes',
                'Upcoming': 'À Venir',
                'Past': 'Passées', 
                'Cancelled': 'Annulées',
                'No Reservations Found': 'Aucune Réservation Trouvée',
                'You haven\'t made any reservations yet.': 'Vous n\'avez encore fait aucune réservation.',
                'Find Restaurants': 'Trouver des Restaurants',
                'New Reservation': 'Nouvelle Réservation',
                'Reservation Details': 'Détails de la Réservation',
                'Cancel Reservation': 'Annuler la Réservation',
                'Modify Reservation': 'Modifier la Réservation',
                'View Details': 'Voir les Détails',
                'Modify': 'Modifier',
                'Cancel': 'Annuler',
                'Call Restaurant': 'Appeler le Restaurant',
                'Confirmed': 'Confirmée',
                'Upcoming': 'À Venir',
                'Completed': 'Terminée',
                'Cancelled': 'Annulée',
                'guests': 'invités',
                'Winter dining ready': 'Prêt pour le repas d\'hiver'
            }
        };
        
        this.initialize();
    }
    
    initialize() {
        this.loadReservations();
        this.setupEventListeners();
        this.renderReservations();
        this.updateCounts();
        this.loadLanguageFromStorage();
    }
    
    loadReservations() {
        // 加载本地存储的预订
        const storedReservations = localStorage.getItem('mapleTableBookings');
        if (storedReservations) {
            this.reservations = JSON.parse(storedReservations);
        } else {
            // 创建示例预订数据用于演示
            this.reservations = this.createSampleReservations();
            localStorage.setItem('mapleTableBookings', JSON.stringify(this.reservations));
        }
    }
    
    createSampleReservations() {
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const nextWeek = new Date(now);
        nextWeek.setDate(nextWeek.getDate() + 7);
        const lastWeek = new Date(now);
        lastWeek.setDate(lastWeek.getDate() - 7);
        
        return [
            {
                confirmationNumber: 'MT250125001',
                restaurant: {
                    id: 1,
                    name: 'The CN Tower Restaurant',
                    nameF: 'Restaurant de la Tour CN',
                    cuisine: 'Canadian Fine Dining',
                    cuisineF: 'Grande Cuisine Canadienne',
                    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=200&fit=crop',
                    phone: '(416) 362-5411',
                    address: '290 Bremner Blvd, Toronto, ON M5V 3L9'
                },
                date: tomorrow.toISOString().split('T')[0],
                time: '19:00',
                partySize: 4,
                preferences: ['heated-patio', 'window-seat'],
                customer: {
                    firstName: 'John',
                    lastName: 'Smith',
                    phone: '(416) 555-0123',
                    email: 'john.smith@email.com'
                },
                specialRequests: 'Anniversary celebration - please prepare a special dessert',
                language: 'en',
                status: 'confirmed',
                timestamp: new Date().toISOString()
            },
            {
                confirmationNumber: 'MT250132002',
                restaurant: {
                    id: 2,
                    name: 'Schwartz\'s Hebrew Delicatessen',
                    nameF: 'Charcuterie Hébraïque Schwartz\'s',
                    cuisine: 'Montreal Deli',
                    cuisineF: 'Charcuterie de Montréal',
                    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=200&fit=crop',
                    phone: '(514) 842-4813',
                    address: '3895 Saint-Laurent Blvd, Montreal, QC H2W 1X9'
                },
                date: nextWeek.toISOString().split('T')[0],
                time: '12:30',
                partySize: 2,
                preferences: ['quiet-area'],
                customer: {
                    firstName: 'Marie',
                    lastName: 'Dubois',
                    phone: '(514) 555-0456',
                    email: 'marie.dubois@email.com'
                },
                specialRequests: 'Vegetarian options needed',
                language: 'fr',
                status: 'confirmed',
                timestamp: new Date().toISOString()
            },
            {
                confirmationNumber: 'MT250118003',
                restaurant: {
                    id: 3,
                    name: 'Granville Island Public Market',
                    nameF: 'Marché Public de Granville Island',
                    cuisine: 'West Coast Fresh Market',
                    cuisineF: 'Marché Frais de la Côte Ouest',
                    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=200&fit=crop',
                    phone: '(604) 666-5784',
                    address: '1669 Johnston St, Vancouver, BC V6H 3R9'
                },
                date: lastWeek.toISOString().split('T')[0],
                time: '13:00',
                partySize: 6,
                preferences: ['wheelchair-accessible'],
                customer: {
                    firstName: 'David',
                    lastName: 'Wong',
                    phone: '(604) 555-0789',
                    email: 'david.wong@email.com'
                },
                specialRequests: 'Family gathering - high chair needed',
                language: 'en',
                status: 'completed',
                timestamp: new Date(lastWeek.getTime() - 86400000).toISOString()
            }
        ];
    }
    
    setupEventListeners() {
        // 页面加载时检查URL参数
        const urlParams = new URLSearchParams(window.location.search);
        const filter = urlParams.get('filter');
        if (filter && ['all', 'upcoming', 'past', 'cancelled'].includes(filter)) {
            this.currentFilter = filter;
        }
    }
    
    renderReservations() {
        const container = document.getElementById('reservationsList');
        const emptyState = document.getElementById('emptyState');
        
        const filtered = this.getFilteredReservations();
        
        if (filtered.length === 0) {
            container.style.display = 'none';
            emptyState.style.display = 'block';
            return;
        }
        
        container.style.display = 'flex';
        emptyState.style.display = 'none';
        container.innerHTML = '';
        
        filtered.forEach((reservation, index) => {
            const card = this.createReservationCard(reservation, index);
            container.appendChild(card);
        });
    }
    
    getFilteredReservations() {
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        
        return this.reservations.filter(reservation => {
            const reservationDate = new Date(reservation.date);
            reservationDate.setHours(0, 0, 0, 0);
            
            switch (this.currentFilter) {
                case 'upcoming':
                    return reservationDate >= now && reservation.status === 'confirmed';
                case 'past':
                    return reservationDate < now || reservation.status === 'completed';
                case 'cancelled':
                    return reservation.status === 'cancelled';
                default:
                    return true;
            }
        });
    }
    
    createReservationCard(reservation, index) {
        const card = document.createElement('div');
        card.className = `reservation-card ${this.getReservationClass(reservation)}`;
        card.style.animationDelay = `${index * 0.1}s`;
        card.onclick = () => this.showReservationDetails(reservation);
        
        const restaurantName = this.currentLanguage === 'fr' && reservation.restaurant.nameF ? 
                              reservation.restaurant.nameF : reservation.restaurant.name;
        const cuisine = this.currentLanguage === 'fr' && reservation.restaurant.cuisineF ? 
                       reservation.restaurant.cuisineF : reservation.restaurant.cuisine;
        
        const formattedDate = new Date(reservation.date).toLocaleDateString(
            this.currentLanguage === 'fr' ? 'fr-CA' : 'en-CA',
            { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }
        );
        
        const statusText = this.getStatusText(reservation.status);
        const statusClass = `status-${reservation.status}`;
        
        const guestsText = this.currentLanguage === 'fr' ? 'invités' : 'guests';
        
        card.innerHTML = `
            <div class="card-header">
                <img src="${reservation.restaurant.image}" alt="${restaurantName}" class="restaurant-image">
                <div class="reservation-info">
                    <h3 class="restaurant-name">${restaurantName}</h3>
                    <p class="restaurant-cuisine">${cuisine}</p>
                    <p class="confirmation-number">#${reservation.confirmationNumber}</p>
                </div>
                <div class="reservation-status ${statusClass}">${statusText}</div>
            </div>
            
            <div class="card-content">
                <div class="reservation-details">
                    <div class="detail-item">
                        <i class="fas fa-calendar"></i>
                        <span>${formattedDate}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-clock"></i>
                        <span>${reservation.time}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-users"></i>
                        <span>${reservation.partySize} ${guestsText}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-phone"></i>
                        <span>${reservation.restaurant.phone}</span>
                    </div>
                    ${this.hasWinterFeatures(reservation) ? `
                        <div class="detail-item winter-feature">
                            <i class="fas fa-snowflake"></i>
                            <span>${this.currentLanguage === 'fr' ? 'Prêt pour le repas d\'hiver' : 'Winter dining ready'}</span>
                        </div>
                    ` : ''}
                </div>
                
                ${reservation.specialRequests ? `
                    <div class="special-requests">
                        <h5>${this.currentLanguage === 'fr' ? 'Demandes Spéciales' : 'Special Requests'}</h5>
                        <p>${reservation.specialRequests}</p>
                    </div>
                ` : ''}
                
                <div class="card-actions">
                    <button class="action-btn btn-view" onclick="event.stopPropagation(); reservationsManager.showReservationDetails('${reservation.confirmationNumber}')">
                        <i class="fas fa-eye"></i>
                        ${this.currentLanguage === 'fr' ? 'Voir' : 'View'}
                    </button>
                    ${this.canModifyReservation(reservation) ? `
                        <button class="action-btn btn-modify" onclick="event.stopPropagation(); reservationsManager.showModifyModal('${reservation.confirmationNumber}')">
                            <i class="fas fa-edit"></i>
                            ${this.currentLanguage === 'fr' ? 'Modifier' : 'Modify'}
                        </button>
                        <button class="action-btn btn-cancel" onclick="event.stopPropagation(); reservationsManager.showCancelModal('${reservation.confirmationNumber}')">
                            <i class="fas fa-times"></i>
                            ${this.currentLanguage === 'fr' ? 'Annuler' : 'Cancel'}
                        </button>
                    ` : `
                        <button class="action-btn btn-call" onclick="event.stopPropagation(); reservationsManager.callRestaurant('${reservation.restaurant.phone}')">
                            <i class="fas fa-phone"></i>
                            ${this.currentLanguage === 'fr' ? 'Appeler' : 'Call'}
                        </button>
                    `}
                </div>
            </div>
        `;
        
        return card;
    }
    
    getReservationClass(reservation) {
        const now = new Date();
        const reservationDate = new Date(reservation.date);
        
        if (reservation.status === 'cancelled') return 'cancelled';
        if (reservation.status === 'completed' || reservationDate < now) return 'past';
        return 'upcoming';
    }
    
    getStatusText(status) {
        const statusTexts = {
            confirmed: this.currentLanguage === 'fr' ? 'Confirmée' : 'Confirmed',
            completed: this.currentLanguage === 'fr' ? 'Terminée' : 'Completed',
            cancelled: this.currentLanguage === 'fr' ? 'Annulée' : 'Cancelled'
        };
        return statusTexts[status] || status;
    }
    
    hasWinterFeatures(reservation) {
        return reservation.preferences && 
               reservation.preferences.some(pref => pref.includes('heated') || pref.includes('winter'));
    }
    
    canModifyReservation(reservation) {
        if (reservation.status !== 'confirmed') return false;
        
        const now = new Date();
        const reservationDateTime = new Date(`${reservation.date}T${reservation.time}:00`);
        const timeDiff = reservationDateTime.getTime() - now.getTime();
        const hoursDiff = timeDiff / (1000 * 60 * 60);
        
        return hoursDiff > 2; // 可以在预订时间2小时前修改
    }
    
    showReservationDetails(confirmationNumber) {
        const reservation = typeof confirmationNumber === 'string' ? 
                          this.reservations.find(r => r.confirmationNumber === confirmationNumber) :
                          confirmationNumber;
        
        if (!reservation) return;
        
        this.selectedReservation = reservation;
        const modal = document.getElementById('reservationModal');
        const body = document.getElementById('reservationDetailsBody');
        
        const restaurantName = this.currentLanguage === 'fr' && reservation.restaurant.nameF ? 
                              reservation.restaurant.nameF : reservation.restaurant.name;
        const cuisine = this.currentLanguage === 'fr' && reservation.restaurant.cuisineF ? 
                       reservation.restaurant.cuisineF : reservation.restaurant.cuisine;
        
        const formattedDate = new Date(reservation.date).toLocaleDateString(
            this.currentLanguage === 'fr' ? 'fr-CA' : 'en-CA',
            { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }
        );
        
        const guestsText = this.currentLanguage === 'fr' ? 'invités' : 'guests';
        
        body.innerHTML = `
            <div class="reservation-detail-header">
                <img src="${reservation.restaurant.image}" alt="${restaurantName}" class="detail-restaurant-image">
                <div class="detail-restaurant-info">
                    <h3>${restaurantName}</h3>
                    <p>${cuisine}</p>
                    <div class="detail-confirmation">#${reservation.confirmationNumber}</div>
                </div>
            </div>
            
            <div class="detail-sections">
                <div class="detail-section">
                    <h4><i class="fas fa-calendar-check"></i> ${this.currentLanguage === 'fr' ? 'Détails de la Réservation' : 'Reservation Details'}</h4>
                    <div class="detail-grid">
                        <div class="detail-grid-item">
                            <span class="label">${this.currentLanguage === 'fr' ? 'Date' : 'Date'}:</span>
                            <span class="value">${formattedDate}</span>
                        </div>
                        <div class="detail-grid-item">
                            <span class="label">${this.currentLanguage === 'fr' ? 'Heure' : 'Time'}:</span>
                            <span class="value">${reservation.time}</span>
                        </div>
                        <div class="detail-grid-item">
                            <span class="label">${this.currentLanguage === 'fr' ? 'Invités' : 'Guests'}:</span>
                            <span class="value">${reservation.partySize} ${guestsText}</span>
                        </div>
                        <div class="detail-grid-item">
                            <span class="label">${this.currentLanguage === 'fr' ? 'Statut' : 'Status'}:</span>
                            <span class="value">${this.getStatusText(reservation.status)}</span>
                        </div>
                    </div>
                </div>
                
                <div class="detail-section">
                    <h4><i class="fas fa-user"></i> ${this.currentLanguage === 'fr' ? 'Informations de Contact' : 'Contact Information'}</h4>
                    <div class="detail-grid">
                        <div class="detail-grid-item">
                            <span class="label">${this.currentLanguage === 'fr' ? 'Nom' : 'Name'}:</span>
                            <span class="value">${reservation.customer.firstName} ${reservation.customer.lastName}</span>
                        </div>
                        <div class="detail-grid-item">
                            <span class="label">${this.currentLanguage === 'fr' ? 'Téléphone' : 'Phone'}:</span>
                            <span class="value">${reservation.customer.phone}</span>
                        </div>
                        <div class="detail-grid-item">
                            <span class="label">Email:</span>
                            <span class="value">${reservation.customer.email}</span>
                        </div>
                    </div>
                </div>
                
                <div class="detail-section">
                    <h4><i class="fas fa-map-marker-alt"></i> ${this.currentLanguage === 'fr' ? 'Restaurant' : 'Restaurant'}</h4>
                    <div class="detail-grid">
                        <div class="detail-grid-item">
                            <span class="label">${this.currentLanguage === 'fr' ? 'Téléphone' : 'Phone'}:</span>
                            <span class="value">${reservation.restaurant.phone}</span>
                        </div>
                        <div class="detail-grid-item">
                            <span class="label">${this.currentLanguage === 'fr' ? 'Adresse' : 'Address'}:</span>
                            <span class="value">${reservation.restaurant.address}</span>
                        </div>
                    </div>
                </div>
                
                ${reservation.preferences && reservation.preferences.length > 0 ? `
                    <div class="detail-section">
                        <h4><i class="fas fa-cog"></i> ${this.currentLanguage === 'fr' ? 'Préférences' : 'Preferences'}</h4>
                        <div class="preferences-list">
                            ${reservation.preferences.map(pref => `
                                <span class="preference-tag">${this.formatPreference(pref)}</span>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
                
                ${reservation.specialRequests ? `
                    <div class="detail-section">
                        <h4><i class="fas fa-comment"></i> ${this.currentLanguage === 'fr' ? 'Demandes Spéciales' : 'Special Requests'}</h4>
                        <div class="special-requests-detail">
                            <p>${reservation.specialRequests}</p>
                        </div>
                    </div>
                ` : ''}
            </div>
            
            ${this.hasWinterFeatures(reservation) ? `
                <div class="winter-reminder">
                    <i class="fas fa-snowflake"></i>
                    <div>
                        <strong>${this.currentLanguage === 'fr' ? 'Rappel d\'hiver' : 'Winter Reminder'}:</strong>
                        ${this.currentLanguage === 'fr' ? 
                          'Habillez-vous chaudement pour votre réservation. Le restaurant offre un chauffage.' :
                          'Dress warmly for your reservation. The restaurant provides heating.'
                        }
                    </div>
                </div>
            ` : ''}
            
            <div class="modal-actions">
                ${this.canModifyReservation(reservation) ? `
                    <button class="btn btn-secondary" onclick="reservationsManager.showModifyModal('${reservation.confirmationNumber}')">
                        <i class="fas fa-edit"></i>
                        ${this.currentLanguage === 'fr' ? 'Modifier' : 'Modify'}
                    </button>
                ` : ''}
                <button class="btn btn-primary" onclick="reservationsManager.callRestaurant('${reservation.restaurant.phone}')">
                    <i class="fas fa-phone"></i>
                    ${this.currentLanguage === 'fr' ? 'Appeler Restaurant' : 'Call Restaurant'}
                </button>
            </div>
        `;
        
        modal.classList.add('show');
    }
    
    formatPreference(preference) {
        const preferences = {
            'heated-patio': this.currentLanguage === 'fr' ? 'Terrasse chauffée' : 'Heated patio',
            'window-seat': this.currentLanguage === 'fr' ? 'Siège fenêtre' : 'Window seat',
            'quiet-area': this.currentLanguage === 'fr' ? 'Zone calme' : 'Quiet area',
            'wheelchair-accessible': this.currentLanguage === 'fr' ? 'Accessible fauteuil roulant' : 'Wheelchair accessible'
        };
        return preferences[preference] || preference;
    }
    
    showCancelModal(confirmationNumber) {
        this.selectedReservation = this.reservations.find(r => r.confirmationNumber === confirmationNumber);
        if (!this.selectedReservation) return;
        
        const modal = document.getElementById('cancelModal');
        modal.classList.add('show');
    }
    
    showModifyModal(confirmationNumber) {
        this.selectedReservation = this.reservations.find(r => r.confirmationNumber === confirmationNumber);
        if (!this.selectedReservation) return;
        
        const modal = document.getElementById('modifyModal');
        modal.classList.add('show');
    }
    
    confirmCancellation() {
        if (!this.selectedReservation) return;
        
        const reason = document.querySelector('input[name="cancelReason"]:checked')?.value || 'no-reason';
        
        // 更新预订状态
        const index = this.reservations.findIndex(r => r.confirmationNumber === this.selectedReservation.confirmationNumber);
        if (index !== -1) {
            this.reservations[index].status = 'cancelled';
            this.reservations[index].cancelReason = reason;
            this.reservations[index].cancelledAt = new Date().toISOString();
            
            // 保存到本地存储
            localStorage.setItem('mapleTableBookings', JSON.stringify(this.reservations));
            
            // 刷新显示
            this.renderReservations();
            this.updateCounts();
            
            // 关闭模态框
            this.closeModal();
            
            // 显示成功消息
            this.showNotification(
                this.currentLanguage === 'fr' ? 
                'Réservation annulée avec succès' : 
                'Reservation cancelled successfully',
                'success'
            );
        }
    }
    
    modifyReservation(type) {
        if (!this.selectedReservation) return;
        
        // 关闭当前模态框
        this.closeModal();
        
        // 根据修改类型跳转到相应页面
        const bookingUrl = `booking.html?restaurant=${this.selectedReservation.restaurant.id}&modify=${this.selectedReservation.confirmationNumber}&type=${type}`;
        window.location.href = bookingUrl;
    }
    
    callRestaurant(phone) {
        if (confirm(`${this.currentLanguage === 'fr' ? 'Appeler' : 'Call'} ${phone}?`)) {
            window.location.href = `tel:${phone}`;
        }
    }
    
    filterReservations(filter) {
        // 更新激活状态
        document.querySelectorAll('.filter-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-filter="${filter}"]`).classList.add('active');
        
        this.currentFilter = filter;
        this.renderReservations();
    }
    
    updateCounts() {
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        
        const counts = {
            all: this.reservations.length,
            upcoming: 0,
            past: 0,
            cancelled: 0
        };
        
        this.reservations.forEach(reservation => {
            const reservationDate = new Date(reservation.date);
            reservationDate.setHours(0, 0, 0, 0);
            
            if (reservation.status === 'cancelled') {
                counts.cancelled++;
            } else if (reservationDate >= now && reservation.status === 'confirmed') {
                counts.upcoming++;
            } else {
                counts.past++;
            }
        });
        
        // 更新计数显示
        Object.keys(counts).forEach(key => {
            const element = document.getElementById(`${key}Count`);
            if (element) {
                element.textContent = counts[key];
            }
        });
    }
    
    // 语言切换
    toggleLanguage() {
        this.currentLanguage = this.currentLanguage === 'en' ? 'fr' : 'en';
        document.getElementById('currentLang').textContent = this.currentLanguage.toUpperCase();
        localStorage.setItem('mapleTableLanguage', this.currentLanguage);
        this.updateTranslations();
        this.renderReservations();
        this.updateCounts();
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
                element.textContent = frText;
            } else if (enText) {
                element.textContent = enText;
            }
        });
        
        // 更新页面标题
        document.title = this.currentLanguage === 'fr' ? 
            'Mes Réservations - MapleTable' : 
            'My Reservations - MapleTable';
    }
    
    closeModal() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('show');
        });
        this.selectedReservation = null;
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            left: 50%;
            transform: translateX(-50%);
            background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
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
    window.history.back() || (window.location.href = 'index.html');
}

function toggleLanguage() {
    reservationsManager.toggleLanguage();
}

function filterReservations(filter) {
    reservationsManager.filterReservations(filter);
}

function closeModal() {
    reservationsManager.closeModal();
}

function confirmCancellation() {
    reservationsManager.confirmCancellation();
}

function modifyReservation(type) {
    reservationsManager.modifyReservation(type);
}

// 导航函数
function goToRestaurants() {
    window.location.href = 'index.html';
}

function goToHome() {
    window.location.href = 'index.html';
}

function goToSearch() {
    window.location.href = 'index.html#search';
}

function goToFavorites() {
    window.location.href = 'index.html#favorites';
}

function goToProfile() {
    window.location.href = 'index.html#profile';
}

// 初始化预订管理器
let reservationsManager;
document.addEventListener('DOMContentLoaded', () => {
    reservationsManager = new ReservationsManager();
});

// 添加CSS动画
const reservationStyles = document.createElement('style');
reservationStyles.textContent = `
    @keyframes slideInDown {
        from { transform: translate(-50%, -100%); opacity: 0; }
        to { transform: translate(-50%, 0); opacity: 1; }
    }
    
    @keyframes slideOutUp {
        to { transform: translate(-50%, -100%); opacity: 0; }
    }
    
    .preferences-list {
        display: flex;
        flex-wrap: wrap;
        gap: var(--spacing-sm);
    }
    
    .preference-tag {
        background: var(--background);
        color: var(--medium-text);
        padding: var(--spacing-xs) var(--spacing-sm);
        border-radius: 12px;
        font-size: var(--font-xs);
        font-weight: 500;
        border: 1px solid var(--border-color);
    }
    
    .special-requests-detail {
        background: var(--background);
        padding: var(--spacing-md);
        border-radius: 8px;
        border-left: 3px solid var(--canadian-red);
    }
    
    .special-requests-detail p {
        margin: 0;
        color: var(--medium-text);
        line-height: 1.5;
    }
`;
document.head.appendChild(reservationStyles);