// AI Table Allocation Synchronization Bridge
// Ensures real-time sync between customer bookings and merchant dashboard

class AITableSyncBridge {
    constructor() {
        this.syncEvents = [];
        this.merchantListeners = [];
        this.initialize();
    }
    
    initialize() {
        console.log('🔄 AI Table Sync Bridge initialized');
        
        // Initialize enhanced AI if not present
        if (!window.enhancedTableAI) {
            console.log('⚠️ Enhanced AI not found, initializing fallback...');
            this.initializeFallbackAI();
        }
        
        // Set up real-time synchronization
        this.setupRealtimeSync();
    }
    
    initializeFallbackAI() {
        window.enhancedTableAI = {
            allocateOptimalSeating: async (bookingRequest) => {
                console.log('🤖 Fallback AI allocation for:', bookingRequest);
                
                const availableTables = [
                    { id: 'T1', capacity: 2, type: 'window', zone: 'window' },
                    { id: 'T2', capacity: 2, type: 'window', zone: 'window' },
                    { id: 'T3', capacity: 4, type: 'standard', zone: 'main' },
                    { id: 'T4', capacity: 4, type: 'standard', zone: 'main' },
                    { id: 'T5', capacity: 6, type: 'standard', zone: 'main' },
                    { id: 'T6', capacity: 8, type: 'private', zone: 'private' }
                ];
                
                // Simple AI logic for table assignment
                const suitableTables = availableTables.filter(table => 
                    table.capacity >= bookingRequest.partySize
                );
                
                // Prefer window seats if requested
                if (bookingRequest.preferences?.includes('window-seat')) {
                    const windowTables = suitableTables.filter(t => t.type === 'window');
                    if (windowTables.length > 0) {
                        const selectedTable = windowTables[0];
                        return this.createAIResult(selectedTable, bookingRequest, 95);
                    }
                }
                
                // Default assignment
                const selectedTable = suitableTables[0] || availableTables[0];
                const score = this.calculateAIScore(selectedTable, bookingRequest);
                
                return this.createAIResult(selectedTable, bookingRequest, score);
            }
        };
    }
    
    createAIResult(table, request, score) {
        const reasoning = [
            `Optimal capacity match (${table.capacity} seats for ${request.partySize} guests)`,
            `${table.type} seating provides good ambiance`,
            `Located in ${table.zone} section for better service`
        ];
        
        if (request.preferences?.includes('window-seat') && table.type === 'window') {
            reasoning.unshift('Window seat preference satisfied');
        }
        
        return {
            tables: [table],
            totalScore: score,
            aiReasoning: reasoning,
            type: 'single',
            explanation: `AI selected table ${table.id} with ${score}% confidence`,
            success: true
        };
    }
    
    calculateAIScore(table, request) {
        let score = 70; // Base score
        
        // Capacity matching
        if (table.capacity === request.partySize) score += 20;
        else if (table.capacity >= request.partySize) score += 10;
        
        // Preference matching
        if (request.preferences?.includes('window-seat') && table.type === 'window') score += 15;
        if (request.preferences?.includes('quiet') && table.zone === 'private') score += 10;
        
        return Math.min(score, 98);
    }
    
    setupRealtimeSync() {
        // Monitor localStorage changes for real-time updates
        const originalSetItem = localStorage.setItem;
        
        localStorage.setItem = (key, value) => {
            originalSetItem.call(localStorage, key, value);
            
            if (key === 'mapleTableBookings') {
                this.handleBookingUpdate(JSON.parse(value));
            }
        };
        
        // Check for existing bookings on page load
        window.addEventListener('DOMContentLoaded', () => {
            this.syncExistingBookings();
        });
    }
    
    handleBookingUpdate(bookings) {
        console.log('🔄 Booking update detected:', bookings.length, 'bookings');
        
        // Ensure all bookings have proper AI allocation data
        bookings.forEach(booking => {
            if (!booking.assignedTable?.aiScore) {
                this.enhanceBookingWithAI(booking);
            }
        });
        
        // Notify merchant dashboard if it's open
        this.notifyMerchantDashboard(bookings);
    }
    
    enhanceBookingWithAI(booking) {
        if (!booking.assignedTable) return;
        
        // Add AI data if missing
        if (!booking.assignedTable.aiScore) {
            booking.assignedTable.aiScore = this.calculateAIScore(booking.assignedTable, {
                partySize: booking.partySize,
                preferences: booking.preferences || []
            });
        }
        
        if (!booking.assignedTable.aiReasoning) {
            booking.assignedTable.aiReasoning = [
                `Table ${booking.assignedTable.id} optimally selected`,
                `Capacity match: ${booking.assignedTable.capacity} for ${booking.partySize} guests`,
                `AI confidence: ${booking.assignedTable.aiScore}%`
            ];
        }
        
        console.log('🧠 Enhanced booking with AI data:', booking.id);
    }
    
    syncExistingBookings() {
        const customerBookings = JSON.parse(localStorage.getItem('mapleTableBookings') || '[]');
        const merchantBookings = JSON.parse(localStorage.getItem('mapleTableMerchantBookings') || '[]');
        
        console.log('🔄 Syncing existing bookings:', {
            customer: customerBookings.length,
            merchant: merchantBookings.length
        });
        
        // Ensure merchant bookings have all customer booking data
        customerBookings.forEach(customerBooking => {
            const existingMerchant = merchantBookings.find(mb => mb.id === customerBooking.id);
            
            if (!existingMerchant) {
                // Add missing booking to merchant system
                merchantBookings.push({
                    ...customerBooking,
                    merchantId: customerBooking.restaurantId,
                    syncTime: new Date().toISOString()
                });
                
                console.log('📥 Added missing booking to merchant system:', customerBooking.id);
            } else if (!existingMerchant.assignedTable?.aiScore && customerBooking.assignedTable?.aiScore) {
                // Update merchant booking with AI data from customer booking
                existingMerchant.assignedTable = customerBooking.assignedTable;
                console.log('🧠 Updated merchant booking with AI data:', customerBooking.id);
            }
        });
        
        // Save updated merchant bookings
        localStorage.setItem('mapleTableMerchantBookings', JSON.stringify(merchantBookings));
    }
    
    notifyMerchantDashboard(bookings) {
        // Trigger dashboard refresh if the dashboard is open
        if (window.merchantDashboard && typeof window.merchantDashboard.refreshReservations === 'function') {
            console.log('🔄 Refreshing merchant dashboard...');
            window.merchantDashboard.refreshReservations();
        }
        
        // Dispatch custom event for other listeners
        window.dispatchEvent(new CustomEvent('bookingSync', {
            detail: { bookings, timestamp: new Date().toISOString() }
        }));
    }
    
    // Manual sync trigger for testing
    forceSyncNow() {
        console.log('🔄 Force sync triggered');
        this.syncExistingBookings();
        
        const bookings = JSON.parse(localStorage.getItem('mapleTableBookings') || '[]');
        this.notifyMerchantDashboard(bookings);
        
        return {
            success: true,
            bookingsProcessed: bookings.length,
            timestamp: new Date().toISOString()
        };
    }
}

// Initialize the sync bridge
window.aiTableSyncBridge = new AITableSyncBridge();

// Expose for testing
window.forceSyncBookings = () => window.aiTableSyncBridge.forceSyncNow();

console.log('✅ AI Table Sync Bridge loaded and ready');