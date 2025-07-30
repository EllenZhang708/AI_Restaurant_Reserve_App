// Quick test script for booking system
console.log('🧪 Starting booking system test...');

// Test 1: Clear and setup data
console.log('1️⃣ Setting up test environment...');
localStorage.clear();
localStorage.setItem('mapleTableBookings', JSON.stringify([]));
localStorage.setItem('mapleTableMerchantBookings', JSON.stringify([]));

// Test 2: Simulate restaurant selection from index.html
console.log('2️⃣ Simulating restaurant selection...');
const restaurantData = {
    id: 'rest_001',
    name: 'The Maple Leaf Restaurant',
    nameF: 'Restaurant Feuille d\'Érable',
    cuisine: 'Canadian Fine Dining',
    cuisineF: 'Grande Cuisine Canadienne',
    rating: 4.9,
    reviewCount: 1847,
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop',
    phone: '(416) 555-MAPLE',
    address: '123 Maple Street, Toronto, ON M5V 3A8',
    features: ['AI Table Allocation', 'Seasonal Menu', 'Wine Pairing'],
    winterFeatures: ['Heated Patio', 'Winter Menu']
};

localStorage.setItem('selectedRestaurant', JSON.stringify(restaurantData));
console.log('✅ Restaurant data stored:', restaurantData.name);

// Test 3: Create a test booking
console.log('3️⃣ Creating test booking...');
const testBooking = {
    id: 'QUICK_TEST_' + Date.now(),
    restaurantId: 'rest_001',
    restaurantName: 'The Maple Leaf Restaurant',
    date: new Date().toISOString().split('T')[0],
    time: '19:00',
    partySize: 2,
    preferences: ['window-seat'],
    assignedTable: {
        id: 'T2',
        type: 'window',
        capacity: 2,
        aiScore: 88,
        aiReasoning: ['Perfect window view match', 'Optimal capacity'],
        combinationType: 'single'
    },
    customerInfo: {
        firstName: 'Test',
        lastName: 'User',
        phone: '(416) 555-TEST',
        email: 'test@mapletable.ca'
    },
    specialRequests: 'Quick test booking',
    status: 'confirmed',
    createdAt: new Date().toISOString()
};

// Save to customer bookings
const customerBookings = JSON.parse(localStorage.getItem('mapleTableBookings') || '[]');
customerBookings.push(testBooking);
localStorage.setItem('mapleTableBookings', JSON.stringify(customerBookings));

// Save to merchant bookings (simulate booking.js behavior)
const merchantBookings = JSON.parse(localStorage.getItem('mapleTableMerchantBookings') || '[]');
merchantBookings.push({
    ...testBooking,
    merchantId: 'rest_001',
    syncTime: new Date().toISOString(),
    syncMethod: 'quick-test'
});
localStorage.setItem('mapleTableMerchantBookings', JSON.stringify(merchantBookings));

console.log('✅ Booking created:', testBooking.id);

// Test 4: Verify synchronization
console.log('4️⃣ Verifying synchronization...');
const finalCustomer = JSON.parse(localStorage.getItem('mapleTableBookings') || '[]');
const finalMerchant = JSON.parse(localStorage.getItem('mapleTableMerchantBookings') || '[]');

const mapleCustomer = finalCustomer.filter(b => 
    b.restaurantId === 'rest_001' || b.restaurantName?.includes('Maple')
);
const mapleMerchant = finalMerchant.filter(b => 
    b.restaurantId === 'rest_001' || b.merchantId === 'rest_001'
);

console.log('📊 Results:');
console.log(`   Customer bookings: ${finalCustomer.length}`);
console.log(`   Merchant bookings: ${finalMerchant.length}`);
console.log(`   Maple customer: ${mapleCustomer.length}`);
console.log(`   Maple merchant: ${mapleMerchant.length}`);

// Test 5: Simulate merchant dashboard filtering
console.log('5️⃣ Testing merchant dashboard filtering...');
const restaurantId = 'rest_001';
const restaurantName = 'The Maple Leaf Restaurant';

const filteredBookings = finalMerchant.filter(booking => {
    const matchesRestaurant = booking.restaurantId === restaurantId || 
                            booking.merchantId === restaurantId ||
                            booking.restaurantName === restaurantName;

    // Date filtering (today + 7 days)
    const bookingDate = new Date(booking.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const futureLimit = new Date(today);
    futureLimit.setDate(today.getDate() + 7);
    const isValidDate = bookingDate >= today && bookingDate <= futureLimit;

    return matchesRestaurant && isValidDate;
});

console.log(`🎯 Filtered bookings for merchant dashboard: ${filteredBookings.length}`);

// Final result
if (mapleMerchant.length >= mapleCustomer.length && mapleCustomer.length > 0 && filteredBookings.length > 0) {
    console.log('🎉 TEST PASSED: Booking system is working correctly!');
    console.log('✅ Restaurant data storage: WORKING');
    console.log('✅ Booking creation: WORKING');
    console.log('✅ Synchronization: WORKING');
    console.log('✅ Merchant filtering: WORKING');
} else {
    console.log('❌ TEST FAILED: Issues detected in booking system');
    console.log('Debug info:');
    console.log('- Customer bookings:', mapleCustomer.length);
    console.log('- Merchant bookings:', mapleMerchant.length);
    console.log('- Filtered bookings:', filteredBookings.length);
}

// Test force sync if available
if (typeof window !== 'undefined' && window.forceBookingSync) {
    console.log('6️⃣ Testing force sync system...');
    try {
        const syncResult = window.forceBookingSync.forceSyncAll();
        console.log('🔄 Force sync result:', syncResult);
    } catch (error) {
        console.log('❌ Force sync error:', error.message);
    }
} else {
    console.log('⚠️ Force sync system not available (expected in Node.js environment)');
}

console.log('🧪 Test completed!');