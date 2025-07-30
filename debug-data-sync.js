// 数据同步调试工具 - Debug Data Synchronization
function debugDataSync() {
    console.log('🔍 开始调试数据同步...');
    
    // 检查所有相关的 localStorage 数据
    const keys = [
        'mapleTableBookings',
        'mapleTableMerchantBookings', 
        'merchantLogin',
        'merchantLoginData',
        'selectedRestaurant'
    ];
    
    keys.forEach(key => {
        const data = localStorage.getItem(key);
        console.log(`📦 ${key}:`, data ? JSON.parse(data) : 'null');
    });
    
    // 检查当前页面的URL参数
    const urlParams = new URLSearchParams(window.location.search);
    console.log('🔗 URL参数:', {
        restaurant: urlParams.get('restaurant'),
        merchant: urlParams.get('merchant')
    });
    
    // 如果在dashboard页面，显示当前加载的数据
    if (window.merchantDashboard) {
        console.log('🏪 Dashboard数据:', {
            restaurantData: window.merchantDashboard.restaurantData,
            reservationsCount: window.merchantDashboard.realTimeReservations.length,
            aiAssignmentsCount: window.merchantDashboard.aiAssignments.length
        });
    }
}

// 创建测试预订数据
function createTestBooking() {
    const testBooking = {
        id: 'TEST' + Date.now(),
        restaurantId: 'rest_001',
        restaurantName: 'CN Tower Restaurant',
        date: new Date().toISOString().split('T')[0],
        time: '19:00',
        partySize: 4,
        preferences: ['window-seat'],
        assignedTable: {
            id: 'T3',
            type: 'window',
            capacity: 4,
            aiScore: 92,
            aiReasoning: ['最佳窗边位置', '符合人数需求', 'AI推荐高分桌位'],
            combinationType: 'single'
        },
        customerInfo: {
            firstName: '测试',
            lastName: '用户',
            phone: '(416) 123-4567',
            email: 'test@example.com'
        },
        specialRequests: '测试预订 - 用于调试数据同步',
        status: 'confirmed',
        createdAt: new Date().toISOString()
    };
    
    // 同时保存到两个数据源
    const customerBookings = JSON.parse(localStorage.getItem('mapleTableBookings') || '[]');
    customerBookings.push(testBooking);
    localStorage.setItem('mapleTableBookings', JSON.stringify(customerBookings));
    
    const merchantBookings = JSON.parse(localStorage.getItem('mapleTableMerchantBookings') || '[]');
    merchantBookings.push({
        ...testBooking,
        merchantId: testBooking.restaurantId
    });
    localStorage.setItem('mapleTableMerchantBookings', JSON.stringify(merchantBookings));
    
    console.log('✅ 测试预订已创建:', testBooking);
    return testBooking;
}

// 清理测试数据
function clearTestData() {
    const keys = ['mapleTableBookings', 'mapleTableMerchantBookings'];
    keys.forEach(key => {
        const data = JSON.parse(localStorage.getItem(key) || '[]');
        const filtered = data.filter(item => !item.id.startsWith('TEST'));
        localStorage.setItem(key, JSON.stringify(filtered));
    });
    console.log('🧹 测试数据已清理');
}

// 模拟商家登录
function simulateMerchantLogin() {
    const merchantData = {
        id: 'merchant_001',
        email: 'test@restaurant.com',
        restaurant: {
            id: 'rest_001',
            name: 'CN Tower Restaurant',
            cuisine: 'Canadian Fine Dining',
            address: '290 Bremner Blvd, Toronto, ON',
            phone: '(416) 362-5411'
        },
        loginTime: new Date().toISOString()
    };
    
    localStorage.setItem('merchantLogin', JSON.stringify(merchantData));
    localStorage.setItem('merchantLoginData', JSON.stringify(merchantData));
    
    console.log('👔 商家登录模拟完成:', merchantData);
    return merchantData;
}

// 修复数据同步问题
function fixDataSync() {
    console.log('🔧 开始修复数据同步...');
    
    // 1. 从客户预订数据同步到商家数据
    const customerBookings = JSON.parse(localStorage.getItem('mapleTableBookings') || '[]');
    const merchantBookings = JSON.parse(localStorage.getItem('mapleTableMerchantBookings') || '[]');
    
    console.log(`📊 当前数据状态: 客户预订 ${customerBookings.length} 条, 商家预订 ${merchantBookings.length} 条`);
    
    // 将客户预订同步到商家数据
    const syncedBookings = [...merchantBookings];
    
    customerBookings.forEach(booking => {
        // 检查是否已经存在
        const exists = syncedBookings.find(mb => mb.id === booking.id);
        if (!exists) {
            syncedBookings.push({
                ...booking,
                merchantId: booking.restaurantId || 'rest_001',
                restaurantId: booking.restaurantId || 'rest_001'
            });
        }
    });
    
    localStorage.setItem('mapleTableMerchantBookings', JSON.stringify(syncedBookings));
    
    console.log(`✅ 数据同步完成: 商家预订数据现在有 ${syncedBookings.length} 条`);
    
    // 2. 如果在dashboard页面，刷新数据
    if (window.merchantDashboard) {
        window.merchantDashboard.refreshData();
        console.log('🔄 Dashboard数据已刷新');
    }
}

// 全局暴露调试函数
window.debugDataSync = debugDataSync;
window.createTestBooking = createTestBooking;
window.clearTestData = clearTestData;
window.simulateMerchantLogin = simulateMerchantLogin;
window.fixDataSync = fixDataSync;

console.log('🛠️ 数据同步调试工具已加载。可用函数:');
console.log('- debugDataSync(): 查看所有数据状态');
console.log('- createTestBooking(): 创建测试预订');
console.log('- clearTestData(): 清理测试数据');
console.log('- simulateMerchantLogin(): 模拟商家登录');
console.log('- fixDataSync(): 修复数据同步问题');