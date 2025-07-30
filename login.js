// 登录页面功能

// 返回上一页
function goBack() {
    if (document.referrer && document.referrer !== window.location.href) {
        window.history.back();
    } else {
        window.location.href = 'index.html';
    }
}

// 切换密码显示/隐藏
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const button = input.nextElementSibling;
    const icon = button.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.className = 'fas fa-eye-slash';
    } else {
        input.type = 'password';
        icon.className = 'fas fa-eye';
    }
}

// 忘记密码
function forgotPassword(type) {
    const email = prompt('请输入您的邮箱地址，我们将发送密码重置链接：');
    if (email) {
        alert(`密码重置链接已发送到 ${email}，请查看您的邮箱。`);
    }
}

// 显示演示
function showDemo() {
    alert('商家演示功能：\n\n• 查看管理界面\n• 预订管理系统\n• 数据分析报告\n• 客户管理\n\n点击确定开始演示...');
    // 这里可以跳转到演示页面
}

// 联系支持
function contactSupport() {
    alert('联系支持：\n\n电话: 1-800-MAPLE-TABLE\n邮箱: support@mapletable.ca\n\n工作时间:\n周一至周五 9:00-18:00\n周末 10:00-16:00');
}

// 继续作为访客
function continueAsGuest() {
    localStorage.setItem('userType', 'guest');
    window.location.href = 'index.html';
}

// Google登录
function loginWithGoogle() {
    alert('正在连接Google账户...');
    // 模拟登录延迟
    setTimeout(() => {
        const userData = {
            name: 'John Smith',
            email: 'john.smith@gmail.com',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face',
            provider: 'google'
        };
        completeLogin(userData);
    }, 1500);
}

// Facebook登录
function loginWithFacebook() {
    alert('正在连接Facebook账户...');
    // 模拟登录延迟
    setTimeout(() => {
        const userData = {
            name: 'Sarah Johnson',
            email: 'sarah.johnson@facebook.com',
            avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612e04c?w=64&h=64&fit=crop&crop=face',
            provider: 'facebook'
        };
        completeLogin(userData);
    }, 1500);
}

// 完成登录
function completeLogin(userData) {
    // 保存用户数据到localStorage
    localStorage.setItem('currentUser', JSON.stringify(userData));
    localStorage.setItem('userType', 'customer');
    localStorage.setItem('isLoggedIn', 'true');
    
    alert(`欢迎 ${userData.name}！登录成功。`);
    
    // 跳转回主页面
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 500);
}

// 商家登录完成
function completeMerchantLogin(merchantData) {
    // 保存商家数据到localStorage - 使用正确的键名
    localStorage.setItem('merchantLogin', JSON.stringify(merchantData));
    localStorage.setItem('merchantLoginData', JSON.stringify(merchantData));
    localStorage.setItem('currentMerchant', JSON.stringify(merchantData));
    localStorage.setItem('userType', 'merchant');
    localStorage.setItem('isLoggedIn', 'true');
    
    console.log('🏪 商家登录成功，数据已保存:', merchantData);
    
    alert(`欢迎 ${merchantData.restaurantName}！登录成功，正在跳转到管理后台...`);
    
    // 跳转到商家控制台 - 使用与app.js一致的URL格式
    setTimeout(() => {
        const restaurantId = merchantData.restaurant?.id || merchantData.id || 'rest_001';
        const restaurantName = encodeURIComponent(merchantData.restaurantName || merchantData.restaurant?.name || '我的餐厅');
        const dashboardUrl = `merchant-dashboard.html?restaurant=${restaurantId}&merchant=${restaurantName}`;
        
        console.log('🔄 跳转到:', dashboardUrl);
        window.location.href = dashboardUrl;
    }, 1000);
}

// 语言切换
function toggleLanguage() {
    const currentLang = document.getElementById('currentLang');
    const isEnglish = currentLang.textContent === 'EN';
    
    currentLang.textContent = isEnglish ? 'FR' : 'EN';
    
    // 切换所有具有data-en和data-fr属性的元素
    document.querySelectorAll('[data-en]').forEach(element => {
        const enText = element.getAttribute('data-en');
        const frText = element.getAttribute('data-fr');
        
        if (enText && frText) {
            element.textContent = isEnglish ? frText : enText;
        }
    });
    
    // 切换placeholder
    document.querySelectorAll('input[placeholder]').forEach(input => {
        const placeholder = input.getAttribute('placeholder');
        if (placeholder.includes('/')) {
            const [en, fr] = placeholder.split(' / ');
            input.setAttribute('placeholder', isEnglish ? fr : en);
        }
    });
}

// 表单提交处理
document.addEventListener('DOMContentLoaded', function() {
    // 顾客登录表单
    const customerForm = document.getElementById('customerLoginForm');
    if (customerForm) {
        customerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('customerEmail').value;
            const password = document.getElementById('customerPassword').value;
            
            if (!email || !password) {
                alert('请填写所有必填字段');
                return;
            }
            
            // 模拟登录验证
            if (password.length < 6) {
                alert('密码错误，请重试');
                return;
            }
            
            // 创建用户数据
            const userData = {
                name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
                email: email,
                avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face',
                provider: 'email'
            };
            
            completeLogin(userData);
        });
    }
    
    // 商家登录表单
    const merchantForm = document.getElementById('merchantLoginForm');
    if (merchantForm) {
        merchantForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('merchantEmail').value;
            const password = document.getElementById('merchantPassword').value;
            
            if (!email || !password) {
                alert('请填写所有必填字段');
                return;
            }
            
            // 模拟商家登录验证
            if (password.length < 6) {
                alert('密码错误，请重试');
                return;
            }
            
            // 创建商家数据 - 格式与merchant-dashboard.js期望一致
            const merchantData = {
                id: 'merchant_001',
                restaurantName: 'The Maple Leaf Restaurant',
                ownerName: 'Restaurant Owner',
                email: email,
                phone: '(416) 555-0123',
                address: '123 Queen St W, Toronto, ON',
                avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face',
                restaurant: {
                    id: 'rest_001',
                    name: 'The Maple Leaf Restaurant',
                    cuisine: 'Canadian Fine Dining',
                    address: '123 Queen St W, Toronto, ON',
                    phone: '(416) 555-0123'
                },
                loginTime: new Date().toISOString()
            };
            
            completeMerchantLogin(merchantData);
        });
    }
    
    // 添加输入框焦点效果
    document.querySelectorAll('input').forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });
    });
});

// 检查登录状态
function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userType = localStorage.getItem('userType');
    
    if (isLoggedIn === 'true') {
        if (userType === 'merchant') {
            window.location.href = 'merchant-dashboard.html';
        } else {
            window.location.href = 'index.html';
        }
    }
}

// 页面加载时检查登录状态
document.addEventListener('DOMContentLoaded', function() {
    // 如果用户已经登录，重定向到相应页面
    // checkLoginStatus(); // 可以取消注释来启用自动重定向
});