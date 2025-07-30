// Force Booking Synchronization System
// Ensures all customer bookings are properly synced to merchant dashboard

class ForceBookingSync {
    constructor() {
        this.syncCallbacks = [];
        this.initialize();
    }
    
    initialize() {
        console.log('🔄 Force Booking Sync system initialized');
        
        // Override localStorage.setItem to catch booking saves
        this.interceptBookingSaves();
        
        // Add periodic sync check
        this.startPeriodicSync();
        
        // Listen for page visibility changes
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                this.forceSyncAll();
            }
        });
        
        // Make available globally
        window.forceBookingSync = this;
    }
    
    interceptBookingSaves() {
        const originalSetItem = localStorage.setItem.bind(localStorage);
        
        localStorage.setItem = (key, value) => {
            originalSetItem(key, value);
            
            // If booking data was saved, force immediate sync
            if (key === 'mapleTableBookings') {
                console.log('🔄 Customer booking data changed, forcing sync...');
                setTimeout(() => this.forceSyncAll(), 100);
            }
        };
    }
    
    startPeriodicSync() {
        // Sync every 30 seconds
        setInterval(() => {
            this.forceSyncAll();
        }, 30000);
    }
    
    forceSyncAll() {
        console.log('🔄 Starting force sync of all bookings...');
        
        try {
            const customerBookings = JSON.parse(localStorage.getItem('mapleTableBookings') || '[]');
            const merchantBookings = JSON.parse(localStorage.getItem('mapleTableMerchantBookings') || '[]');
            
            console.log(`📊 Current state: ${customerBookings.length} customer, ${merchantBookings.length} merchant`);
            
            let syncCount = 0;
            
            // Ensure every customer booking exists in merchant system
            customerBookings.forEach(customerBooking => {
                const existsInMerchant = merchantBookings.find(mb => mb.id === customerBooking.id);
                
                if (!existsInMerchant) {
                    console.log(`📥 Syncing missing booking: ${customerBooking.id}`);
                    
                    const merchantBooking = {
                        ...customerBooking,
                        merchantId: customerBooking.restaurantId || 'rest_001',
                        syncTime: new Date().toISOString(),
                        syncType: 'force'
                    };
                    
                    merchantBookings.push(merchantBooking);
                    syncCount++;
                } else {
                    // Update existing merchant booking with latest customer data
                    const merchantIndex = merchantBookings.findIndex(mb => mb.id === customerBooking.id);
                    if (merchantIndex >= 0) {
                        // Preserve merchant-specific fields but update customer data
                        merchantBookings[merchantIndex] = {
                            ...customerBooking,
                            merchantId: merchantBookings[merchantIndex].merchantId || customerBooking.restaurantId,
                            syncTime: new Date().toISOString(),
                            syncType: 'update'
                        };
                    }
                }
            });
            
            // Save updated merchant bookings
            localStorage.setItem('mapleTableMerchantBookings', JSON.stringify(merchantBookings));
            
            if (syncCount > 0) {
                console.log(`✅ Force sync complete: ${syncCount} bookings synchronized`);
                
                // Notify any listeners
                this.notifyCallbacks();
                
                // Dispatch event for real-time updates
                window.dispatchEvent(new CustomEvent('forceSyncComplete', {
                    detail: {
                        syncedCount: syncCount,
                        totalMerchantBookings: merchantBookings.length,
                        timestamp: new Date().toISOString()
                    }
                }));
            }
            
            return {
                success: true,
                syncedCount: syncCount,
                totalBookings: merchantBookings.length
            };
            
        } catch (error) {
            console.error('❌ Force sync failed:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
    
    // Specific sync for Maple restaurant bookings
    syncMapleRestaurantBookings() {
        console.log('🍁 Syncing Maple restaurant bookings specifically...');
        
        const customerBookings = JSON.parse(localStorage.getItem('mapleTableBookings') || '[]');
        const merchantBookings = JSON.parse(localStorage.getItem('mapleTableMerchantBookings') || '[]');
        
        // Find all Maple restaurant bookings
        const mapleBookings = customerBookings.filter(booking => 
            booking.restaurantId === 'rest_001' || 
            booking.restaurantName?.includes('Maple') ||
            booking.restaurantName?.includes('maple')
        );
        
        console.log(`🍁 Found ${mapleBookings.length} Maple restaurant bookings`);
        
        let syncCount = 0;
        
        mapleBookings.forEach(booking => {
            const existsInMerchant = merchantBookings.find(mb => mb.id === booking.id);
            
            if (!existsInMerchant) {
                const merchantBooking = {
                    ...booking,
                    restaurantId: 'rest_001', // Ensure correct ID
                    merchantId: 'rest_001',
                    restaurantName: 'The Maple Leaf Restaurant', // Ensure correct name
                    syncTime: new Date().toISOString(),
                    syncType: 'maple-specific'
                };
                
                merchantBookings.push(merchantBooking);
                syncCount++;
                
                console.log(`🍁 Synced Maple booking: ${booking.id}`);
            }
        });
        
        localStorage.setItem('mapleTableMerchantBookings', JSON.stringify(merchantBookings));
        
        console.log(`✅ Maple sync complete: ${syncCount} bookings synchronized`);
        
        return {
            success: true,
            mapleBookings: mapleBookings.length,
            syncedCount: syncCount
        };
    }
    
    // Manual sync trigger for testing
    manualSync() {
        console.log('🔧 Manual sync triggered');
        const result = this.forceSyncAll();
        
        if (result.success) {
            alert(`Sync complete! ${result.syncedCount} bookings synchronized.`);
        } else {
            alert(`Sync failed: ${result.error}`);
        }
        
        return result;
    }
    
    // Add callback for sync completion
    addSyncCallback(callback) {
        this.syncCallbacks.push(callback);
    }
    
    notifyCallbacks() {
        this.syncCallbacks.forEach(callback => {
            try {
                callback();
            } catch (error) {
                console.error('Sync callback error:', error);
            }
        });
    }
    
    // Debug function to show sync status
    showSyncStatus() {
        const customerBookings = JSON.parse(localStorage.getItem('mapleTableBookings') || '[]');
        const merchantBookings = JSON.parse(localStorage.getItem('mapleTableMerchantBookings') || '[]');
        
        console.log('📊 SYNC STATUS REPORT');
        console.log('='.repeat(50));
        console.log(`Customer bookings: ${customerBookings.length}`);
        console.log(`Merchant bookings: ${merchantBookings.length}`);
        
        // Check for missing bookings
        const missingInMerchant = customerBookings.filter(cb => 
            !merchantBookings.find(mb => mb.id === cb.id)
        );
        
        console.log(`Missing in merchant: ${missingInMerchant.length}`);
        missingInMerchant.forEach(booking => {
            console.log(`  - ${booking.id} (${booking.restaurantName})`);
        });
        
        // Check Maple restaurant specifically
        const mapleCustomer = customerBookings.filter(b => 
            b.restaurantId === 'rest_001' || b.restaurantName?.includes('Maple')
        );
        const mapleMerchant = merchantBookings.filter(b => 
            b.restaurantId === 'rest_001' || b.merchantId === 'rest_001' || b.restaurantName?.includes('Maple')
        );
        
        console.log(`Maple customer bookings: ${mapleCustomer.length}`);
        console.log(`Maple merchant bookings: ${mapleMerchant.length}`);
        
        const syncHealthy = missingInMerchant.length === 0;
        console.log(`Sync status: ${syncHealthy ? '✅ HEALTHY' : '❌ NEEDS ATTENTION'}`);
        
        return {
            customerBookings: customerBookings.length,
            merchantBookings: merchantBookings.length,
            missingInMerchant: missingInMerchant.length,
            mapleCustomer: mapleCustomer.length,
            mapleMerchant: mapleMerchant.length,
            healthy: syncHealthy
        };
    }
}

// Initialize the force sync system
const forceBookingSync = new ForceBookingSync();

// Make debugging functions available globally
window.forceSyncBookings = () => forceBookingSync.manualSync();
window.syncMapleBookings = () => forceBookingSync.syncMapleRestaurantBookings();
window.showSyncStatus = () => forceBookingSync.showSyncStatus();

console.log('✅ Force Booking Sync system loaded');
console.log('Available commands:');
console.log('  - forceSyncBookings() - Manual sync all bookings');
console.log('  - syncMapleBookings() - Sync Maple restaurant bookings');
console.log('  - showSyncStatus() - Show detailed sync status');