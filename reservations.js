// Reservations Management - MapleTable Customer App

class ReservationsManager {
    constructor() {
        this.currentLanguage = 'en';
        this.currentFilter = 'all';
        this.reservations = [];
        
        // 检查URL参数，判断是商家管理模式还是顾客查看模式
        this.urlParams = new URLSearchParams(window.location.search);
        this.isMerchantMode = this.urlParams.has('restaurant');
        this.restaurantId = this.urlParams.get('restaurant');
        this.merchantName = decodeURIComponent(this.urlParams.get('merchant') || '商家管理后台');
        
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
                'Confirmed': 'Confirmed',
                'Cancelled': 'Cancelled',
                'Completed': 'Completed',
                'Table': 'Table',
                'Party Size': 'Party Size',
                'Special Requests': 'Special Requests',
                'guests': 'guests'
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
                'Confirmed': 'Confirmée',
                'Cancelled': 'Annulée',
                'Completed': 'Terminée',
                'Table': 'Table',
                'Party Size': 'Nombre de Personnes',
                'Special Requests': 'Demandes Spéciales',
                'guests': 'invités'
            }
        };
        
        this.initialize();
    }
    
    initialize() {
        // 根据模式初始化不同的界面
        if (this.isMerchantMode) {
            this.initializeMerchantMode();
        } else {
            this.initializeCustomerMode();
        }
        
        this.loadReservations();
        this.loadLanguageFromStorage();
        this.setupEventListeners();
        this.renderReservations();
        this.updateCounts();
    }
    
    // 初始化商家管理模式
    initializeMerchantMode() {
        // 更改页面标题
        const pageTitle = document.getElementById('pageTitle');
        const restaurantName = document.getElementById('restaurantName');
        
        if (pageTitle) {
            pageTitle.textContent = `${this.merchantName} - 预订管理`;
            pageTitle.setAttribute('data-en', `${this.merchantName} - Reservations Management`);
            pageTitle.setAttribute('data-fr', `${this.merchantName} - Gestion des Réservations`);
        }
        
        if (restaurantName) {
            restaurantName.textContent = `餐厅ID: ${this.restaurantId}`;
            restaurantName.style.display = 'block';
        }
        
        // 更改页面标题标签
        document.title = `${this.merchantName} - 预订管理 - MapleTable`;
        
        console.log(`🏪 商家管理模式已激活: ${this.merchantName} (${this.restaurantId})`);
    }
    
    // 初始化顾客查看模式
    initializeCustomerMode() {
        console.log('👤 顾客查看模式');
    }
    
    loadReservations() {
        let allReservations = JSON.parse(localStorage.getItem('mapleTableBookings') || '[]');
        
        if (this.isMerchantMode && this.restaurantId) {
            // 商家模式：只显示自己餐厅的预订
            this.reservations = allReservations.filter(reservation => 
                reservation.restaurantId === this.restaurantId || 
                reservation.restaurantName?.includes(this.merchantName)
            );
            console.log(`🏪 已加载 ${this.merchantName} 的预订:`, this.reservations.length);
        } else {
            // 顾客模式：显示所有预订
            this.reservations = allReservations;
            console.log('👤 已加载顾客预订:', this.reservations.length);
        }
    }
    
    setupEventListeners() {
        // Filter tabs
        document.querySelectorAll('.filter-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                const filter = tab.getAttribute('data-filter');
                this.filterReservations(filter);
            });
        });
        
        // Modal close handlers
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('close-btn') || e.target.classList.contains('modal')) {
                this.closeModal();
            }
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
    }
    
    filterReservations(filter) {
        this.currentFilter = filter;
        
        // Update active tab
        document.querySelectorAll('.filter-tab').forEach(tab => {
            tab.classList.remove('active');
            if (tab.getAttribute('data-filter') === filter) {
                tab.classList.add('active');
            }
        });
        
        this.renderReservations();
    }
    
    getFilteredReservations() {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        
        return this.reservations.filter(reservation => {
            const reservationDate = new Date(reservation.date);
            const reservationDateTime = new Date(`${reservation.date}T${reservation.time}:00`);
            
            switch (this.currentFilter) {
                case 'upcoming':
                    return reservationDateTime >= now && reservation.status !== 'cancelled';
                case 'past':
                    return reservationDateTime < now && reservation.status !== 'cancelled';
                case 'cancelled':
                    return reservation.status === 'cancelled';
                default:
                    return true;
            }
        }).sort((a, b) => {
            // Sort by date and time, most recent first
            const dateA = new Date(`${a.date}T${a.time}:00`);
            const dateB = new Date(`${b.date}T${b.time}:00`);
            return dateB - dateA;
        });
    }
    
    updateCounts() {
        const now = new Date();
        const counts = {
            all: this.reservations.length,
            upcoming: 0,
            past: 0,
            cancelled: 0
        };
        
        this.reservations.forEach(reservation => {
            const reservationDateTime = new Date(`${reservation.date}T${reservation.time}:00`);
            
            if (reservation.status === 'cancelled') {
                counts.cancelled++;
            } else if (reservationDateTime >= now) {
                counts.upcoming++;
            } else {
                counts.past++;
            }
        });
        
        // Update count badges
        document.getElementById('allCount').textContent = counts.all;
        document.getElementById('upcomingCount').textContent = counts.upcoming;
        document.getElementById('pastCount').textContent = counts.past;
        document.getElementById('cancelledCount').textContent = counts.cancelled;
    }
    
    renderReservations() {
        const container = document.getElementById('reservationsList');
        const emptyState = document.getElementById('emptyState');
        const filteredReservations = this.getFilteredReservations();
        
        container.innerHTML = '';
        
        if (filteredReservations.length === 0) {
            container.style.display = 'none';
            emptyState.style.display = 'flex';
            return;
        }
        
        container.style.display = 'block';
        emptyState.style.display = 'none';
        
        filteredReservations.forEach(reservation => {
            const card = this.createReservationCard(reservation);
            container.appendChild(card);
        });
    }
    
    createReservationCard(reservation) {
        const card = document.createElement('div');
        card.className = 'reservation-card';
        
        const reservationDate = new Date(reservation.date);
        const reservationDateTime = new Date(`${reservation.date}T${reservation.time}:00`);
        const now = new Date();
        const isUpcoming = reservationDateTime >= now;
        const isPast = reservationDateTime < now;
        
        // Determine status
        let statusClass = 'confirmed';
        let statusText = this.currentLanguage === 'fr' ? 'Confirmée' : 'Confirmed';
        
        if (reservation.status === 'cancelled') {
            statusClass = 'cancelled';
            statusText = this.currentLanguage === 'fr' ? 'Annulée' : 'Cancelled';
        } else if (isPast) {
            statusClass = 'completed';
            statusText = this.currentLanguage === 'fr' ? 'Terminée' : 'Completed';
        }
        
        const guestsText = this.currentLanguage === 'fr' ? 'invités' : 'guests';
        
        card.innerHTML = `
            <div class="reservation-header">
                <div class="restaurant-info">
                    <h3 class="restaurant-name">${reservation.restaurantName}</h3>
                    <p class="confirmation-number">${reservation.id}</p>
                </div>
                <div class="reservation-status ${statusClass}">
                    <span>${statusText}</span>
                </div>
            </div>
            
            <div class="reservation-details">
                <div class="detail-item">
                    <i class="fas fa-calendar"></i>
                    <span>${this.formatDate(reservationDate)}</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-clock"></i>
                    <span>${reservation.time}</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-users"></i>
                    <span>${reservation.partySize} ${guestsText}</span>
                </div>
                ${reservation.assignedTable ? `
                    <div class="detail-item">
                        <i class="fas fa-chair"></i>
                        <span>${this.currentLanguage === 'fr' ? 'Table' : 'Table'} ${reservation.assignedTable.id}</span>
                    </div>
                ` : ''}
            </div>
            
            ${reservation.specialRequests ? `
                <div class="special-requests">
                    <i class="fas fa-comment"></i>
                    <span>${reservation.specialRequests}</span>
                </div>
            ` : ''}
            
            <div class="reservation-actions">
                <button class="action-btn secondary" onclick="reservationsManager.viewDetails('${reservation.id}')">
                    <i class="fas fa-eye"></i>
                    ${this.currentLanguage === 'fr' ? 'Détails' : 'Details'}
                </button>
                
                ${isUpcoming && reservation.status !== 'cancelled' ? `
                    <button class="action-btn secondary" onclick="reservationsManager.modifyReservation('${reservation.id}')">
                        <i class="fas fa-edit"></i>
                        ${this.currentLanguage === 'fr' ? 'Modifier' : 'Modify'}
                    </button>
                    <button class="action-btn danger" onclick="reservationsManager.cancelReservation('${reservation.id}')">
                        <i class="fas fa-times"></i>
                        ${this.currentLanguage === 'fr' ? 'Annuler' : 'Cancel'}
                    </button>
                ` : ''}
                
                ${isPast && reservation.status !== 'cancelled' ? `
                    <button class="action-btn primary" onclick="reservationsManager.leaveReview('${reservation.id}')">
                        <i class="fas fa-star"></i>
                        ${this.currentLanguage === 'fr' ? 'Avis' : 'Review'}
                    </button>
                ` : ''}
            </div>
        `;
        
        return card;
    }
    
    viewDetails(reservationId) {
        const reservation = this.reservations.find(r => r.id === reservationId);
        if (!reservation) return;
        
        const modal = document.getElementById('reservationModal');
        const modalBody = document.getElementById('reservationDetailsBody');
        
        const reservationDate = new Date(reservation.date);
        const guestsText = this.currentLanguage === 'fr' ? 'invités' : 'guests';
        
        modalBody.innerHTML = `
            <div class="reservation-detail-header">
                <div class="restaurant-image">
                    <img src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=300&h=200&fit=crop" alt="${reservation.restaurantName}">
                </div>
                <div class="restaurant-info">
                    <h3>${reservation.restaurantName}</h3>
                    <p class="confirmation-id">${this.currentLanguage === 'fr' ? 'Confirmation' : 'Confirmation'}: ${reservation.id}</p>
                </div>
            </div>
            
            <div class="detail-sections">
                <div class="detail-section">
                    <h4><i class="fas fa-info-circle"></i> ${this.currentLanguage === 'fr' ? 'Détails de la Réservation' : 'Reservation Details'}</h4>
                    <div class="detail-grid">
                        <div class="detail-item">
                            <label>${this.currentLanguage === 'fr' ? 'Date' : 'Date'}:</label>
                            <span>${this.formatDate(reservationDate)}</span>
                        </div>
                        <div class="detail-item">
                            <label>${this.currentLanguage === 'fr' ? 'Heure' : 'Time'}:</label>
                            <span>${reservation.time}</span>
                        </div>
                        <div class="detail-item">
                            <label>${this.currentLanguage === 'fr' ? 'Nombre de Personnes' : 'Party Size'}:</label>
                            <span>${reservation.partySize} ${guestsText}</span>
                        </div>
                        ${reservation.assignedTable ? `
                            <div class="detail-item">
                                <label>${this.currentLanguage === 'fr' ? 'Table Assignée' : 'Assigned Table'}:</label>
                                <span>${reservation.assignedTable.id} (${reservation.assignedTable.type})</span>
                            </div>
                        ` : ''}
                    </div>
                </div>
                
                <div class="detail-section">
                    <h4><i class="fas fa-user"></i> ${this.currentLanguage === 'fr' ? 'Informations de Contact' : 'Contact Information'}</h4>
                    <div class="detail-grid">
                        <div class="detail-item">
                            <label>${this.currentLanguage === 'fr' ? 'Nom' : 'Name'}:</label>
                            <span>${reservation.customerInfo.firstName} ${reservation.customerInfo.lastName}</span>
                        </div>
                        <div class="detail-item">
                            <label>${this.currentLanguage === 'fr' ? 'Téléphone' : 'Phone'}:</label>
                            <span>${reservation.customerInfo.phone}</span>
                        </div>
                        <div class="detail-item">
                            <label>${this.currentLanguage === 'fr' ? 'Email' : 'Email'}:</label>
                            <span>${reservation.customerInfo.email}</span>
                        </div>
                    </div>
                </div>
                
                ${reservation.preferences && reservation.preferences.length > 0 ? `
                    <div class="detail-section">
                        <h4><i class="fas fa-heart"></i> ${this.currentLanguage === 'fr' ? 'Préférences' : 'Preferences'}</h4>
                        <div class="preferences-list">
                            ${reservation.preferences.map(pref => `<span class="preference-tag">${this.translatePreference(pref)}</span>`).join('')}
                        </div>
                    </div>
                ` : ''}
                
                ${reservation.specialRequests ? `
                    <div class="detail-section">
                        <h4><i class="fas fa-comment"></i> ${this.currentLanguage === 'fr' ? 'Demandes Spéciales' : 'Special Requests'}</h4>
                        <p class="special-requests-text">${reservation.specialRequests}</p>
                    </div>
                ` : ''}
            </div>
            
            <div class="detail-actions">
                ${this.canModifyReservation(reservation) ? `
                    <button class="btn btn-secondary" onclick="reservationsManager.modifyReservation('${reservation.id}')">
                        <i class="fas fa-edit"></i>
                        ${this.currentLanguage === 'fr' ? 'Modifier' : 'Modify'}
                    </button>
                    <button class="btn btn-danger" onclick="reservationsManager.cancelReservation('${reservation.id}')">
                        <i class="fas fa-times"></i>
                        ${this.currentLanguage === 'fr' ? 'Annuler' : 'Cancel'}
                    </button>
                ` : ''}
                <button class="btn btn-primary" onclick="reservationsManager.callRestaurant('${reservation.customerInfo.phone}')">
                    <i class="fas fa-phone"></i>
                    ${this.currentLanguage === 'fr' ? 'Appeler Restaurant' : 'Call Restaurant'}
                </button>
            </div>
        `;
        
        modal.classList.add('show');
    }
    
    canModifyReservation(reservation) {
        const reservationDateTime = new Date(`${reservation.date}T${reservation.time}:00`);
        const now = new Date();
        const hoursDiff = (reservationDateTime - now) / (1000 * 60 * 60);
        
        return hoursDiff > 2 && reservation.status !== 'cancelled';
    }
    
    translatePreference(preference) {
        const translations = {
            'heated-patio': this.currentLanguage === 'fr' ? 'Terrasse Chauffée' : 'Heated Patio',
            'window-seat': this.currentLanguage === 'fr' ? 'Vue sur Fenêtre' : 'Window View',
            'quiet-area': this.currentLanguage === 'fr' ? 'Zone Calme' : 'Quiet Area',
            'wheelchair-accessible': this.currentLanguage === 'fr' ? 'Accessible Fauteuil Roulant' : 'Wheelchair Accessible'
        };
        return translations[preference] || preference;
    }
    
    cancelReservation(reservationId) {
        const reservation = this.reservations.find(r => r.id === reservationId);
        if (!reservation) return;
        
        // Show cancel confirmation modal
        const cancelModal = document.getElementById('cancelModal');
        this.currentCancelId = reservationId;
        cancelModal.classList.add('show');
    }
    
    confirmCancellation() {
        if (!this.currentCancelId) return;
        
        const reservationIndex = this.reservations.findIndex(r => r.id === this.currentCancelId);
        if (reservationIndex !== -1) {
            this.reservations[reservationIndex].status = 'cancelled';
            this.reservations[reservationIndex].cancelledAt = new Date().toISOString();
            
            // Get cancellation reason
            const selectedReason = document.querySelector('input[name="cancelReason"]:checked');
            if (selectedReason) {
                this.reservations[reservationIndex].cancellationReason = selectedReason.value;
            }
            
            // Update localStorage
            localStorage.setItem('mapleTableBookings', JSON.stringify(this.reservations));
            
            // Show success message
            this.showNotification(
                this.currentLanguage === 'fr' ? 
                'Réservation annulée avec succès' : 
                'Reservation cancelled successfully',
                'success'
            );
            
            // Refresh display
            this.renderReservations();
            this.updateCounts();
        }
        
        this.closeModal();
        this.currentCancelId = null;
    }
    
    modifyReservation(reservationId) {
        const reservation = this.reservations.find(r => r.id === reservationId);
        if (!reservation) return;
        
        // For demo, redirect to booking page with pre-filled data
        const bookingUrl = `booking.html?restaurant=${reservation.restaurantId}&modify=${reservationId}`;
        window.location.href = bookingUrl;
    }
    
    leaveReview(reservationId) {
        const reservation = this.reservations.find(r => r.id === reservationId);
        if (!reservation) return;
        
        this.showNotification(
            this.currentLanguage === 'fr' ? 
            'Système d\'avis bientôt disponible!' : 
            'Review system coming soon!',
            'info'
        );
    }
    
    callRestaurant(phone) {
        if (confirm(`${this.currentLanguage === 'fr' ? 'Appeler' : 'Call'} ${phone}?`)) {
            window.location.href = `tel:${phone}`;
        }
    }
    
    formatDate(date) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return this.currentLanguage === 'fr' ? 
            date.toLocaleDateString('fr-CA', options) : 
            date.toLocaleDateString('en-CA', options);
    }
    
    closeModal() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('show');
        });
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
    
    toggleLanguage() {
        this.currentLanguage = this.currentLanguage === 'en' ? 'fr' : 'en';
        document.getElementById('currentLang').textContent = this.currentLanguage.toUpperCase();
        this.updateTranslations();
        this.renderReservations();
        localStorage.setItem('mapleTableLanguage', this.currentLanguage);
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

function goToHome() {
    window.location.href = 'index.html';
}

function goToSearch() {
    window.location.href = 'index.html#search';
}

function goToRestaurants() {
    window.location.href = 'index.html';
}

function goToFavorites() {
    window.location.href = 'index.html#favorites';
}

function goToProfile() {
    window.location.href = 'index.html#profile';
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
    reservationsManager.showNotification(
        reservationsManager.currentLanguage === 'fr' ? 
        'Fonctionnalité de modification bientôt disponible!' : 
        'Modification feature coming soon!',
        'info'
    );
    reservationsManager.closeModal();
}

// Initialize reservations manager
let reservationsManager;
document.addEventListener('DOMContentLoaded', () => {
    reservationsManager = new ReservationsManager();
});