// 调试预订功能的简单脚本
console.log('🔧 Debug booking script loaded');

// 简单的全局预订函数
window.debugBookRestaurant = function(restaurantId) {
    console.log('🔘 debugBookRestaurant called with ID:', restaurantId);
    
    // 创建餐厅信息对象
    const restaurantInfo = {
        id: restaurantId,
        name: 'Selected Restaurant',
        cuisine: 'Canadian Cuisine',
        rating: 4.5,
        reviewCount: 1000,
        image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=200&fit=crop',
        phone: '(416) 123-4567',
        address: '123 Main St, Toronto, ON'
    };
    
    // 存储到localStorage
    localStorage.setItem('selectedRestaurant', JSON.stringify(restaurantInfo));
    
    // 跳转到预订页面
    console.log('📍 Redirecting to booking.html...');
    window.location.href = 'booking.html?restaurant=' + restaurantId;
};

// 等待DOM加载完成后替换按钮事件
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔧 DOM loaded, setting up debug booking buttons');
    
    setTimeout(function() {
        // 查找所有预订按钮并替换onclick事件
        const bookButtons = document.querySelectorAll('.btn-primary');
        console.log('🔍 Found', bookButtons.length, 'primary buttons');
        
        bookButtons.forEach((button, index) => {
            if (button.textContent.includes('Book') || button.textContent.includes('Réserver')) {
                console.log('🎯 Setting up button', index);
                button.onclick = function(event) {
                    event.preventDefault();
                    event.stopPropagation();
                    console.log('🔘 Debug button clicked!');
                    window.debugBookRestaurant(10); // 使用默认餐厅ID
                };
            }
        });
    }, 2000); // 等待2秒让页面完全加载
});

console.log('🔧 Debug booking script ready');