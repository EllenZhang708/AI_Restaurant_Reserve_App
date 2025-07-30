// UI修复脚本 - 确保所有界面元素正常工作
console.log('🔧 开始UI修复...');

// 1. 确保merchant按钮可见且可点击
function fixMerchantButton() {
    const merchantBtn = document.querySelector('.merchant-btn');
    if (merchantBtn) {
        // 移除可能的隐藏样式
        merchantBtn.style.display = 'flex';
        merchantBtn.style.visibility = 'visible';
        merchantBtn.style.opacity = '1';
        
        // 确保点击事件正常工作
        merchantBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('🏪 商家按钮被点击');
            goToMerchantLogin();
        });
        
        console.log('✅ 商家按钮已修复');
    } else {
        console.warn('⚠️ 未找到商家按钮');
    }
}

// 2. 确保客户登录按钮可见且可点击
function fixCustomerLoginButton() {
    const customerBtn = document.querySelector('.customer-login-btn');
    if (customerBtn) {
        customerBtn.style.display = 'flex';
        customerBtn.style.visibility = 'visible';
        customerBtn.style.opacity = '1';
        
        customerBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('👤 客户登录按钮被点击');
            goToCustomerLogin();
        });
        
        console.log('✅ 客户登录按钮已修复');
    } else {
        console.warn('⚠️ 未找到客户登录按钮');
    }
}

// 3. 修复下拉菜单显示问题
function fixDropdownMenus() {
    const dropdowns = document.querySelectorAll('.dropdown-menu');
    dropdowns.forEach(dropdown => {
        dropdown.style.zIndex = '9999';
    });
    console.log(`✅ 已修复 ${dropdowns.length} 个下拉菜单`);
}

// 4. 添加调试信息显示
function addDebugInfo() {
    const debugPanel = document.createElement('div');
    debugPanel.id = 'debug-panel';
    debugPanel.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 10px;
        font-size: 12px;
        border-radius: 5px;
        z-index: 10000;
        max-width: 200px;
        font-family: monospace;
    `;
    
    const merchantLogin = localStorage.getItem('merchantLogin');
    const customerLogin = localStorage.getItem('customerLogin');
    
    debugPanel.innerHTML = `
        <div><strong>🛠️ UI Debug Info</strong></div>
        <div>商家登录: ${merchantLogin ? '✅' : '❌'}</div>
        <div>客户登录: ${customerLogin ? '✅' : '❌'}</div>
        <div>页面: ${window.location.pathname}</div>
        <button onclick="this.parentElement.remove()" style="
            background: #ff4444;
            border: none;
            color: white;
            padding: 2px 6px;
            border-radius: 3px;
            cursor: pointer;
            margin-top: 5px;
        ">关闭</button>
    `;
    
    document.body.appendChild(debugPanel);
    
    // 3秒后自动移除
    setTimeout(() => {
        if (debugPanel.parentElement) {
            debugPanel.remove();
        }
    }, 10000);
}

// 5. 强制刷新商家按钮状态
function refreshMerchantButtonState() {
    const merchantLogin = localStorage.getItem('merchantLogin');
    const merchantBtn = document.querySelector('.merchant-btn');
    
    if (merchantBtn) {
        if (merchantLogin) {
            // 已登录状态
            merchantBtn.innerHTML = `
                <i class="fas fa-tachometer-alt"></i>
                <span>管理后台</span>
            `;
            merchantBtn.onclick = () => goToMerchantDashboard();
        } else {
            // 未登录状态
            merchantBtn.innerHTML = `
                <i class="fas fa-store"></i>
                <span data-en="For Business" data-fr="Pour Entreprises">For Business</span>
            `;
            merchantBtn.onclick = () => goToMerchantLogin();
        }
    }
}

// 6. 添加强制样式来确保按钮可见
function addForceStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* 强制修复按钮样式 */
        .merchant-btn {
            display: flex !important;
            visibility: visible !important;
            opacity: 1 !important;
            background: linear-gradient(45deg, #0066cc, #2563eb) !important;
            color: white !important;
            border: none !important;
            border-radius: 20px !important;
            padding: 10px 16px !important;
            font-weight: 600 !important;
            cursor: pointer !important;
            transition: all 0.3s ease !important;
            align-items: center !important;
            gap: 8px !important;
            text-decoration: none !important;
            font-size: 0.9rem !important;
        }
        
        .merchant-btn:hover {
            background: linear-gradient(45deg, #2563eb, #1d4ed8) !important;
            transform: translateY(-2px) !important;
            color: white !important;
        }
        
        .customer-login-btn {
            display: flex !important;
            visibility: visible !important;
            opacity: 1 !important;
        }
        
        .dropdown-menu {
            z-index: 9999 !important;
        }
        
        /* 确保所有登录相关按钮都可见 */
        .action-btn, .login-btn-group {
            display: flex !important;
            visibility: visible !important;
            opacity: 1 !important;
        }
    `;
    document.head.appendChild(style);
    console.log('✅ 已添加强制样式');
}

// 主修复函数
function executeUIFixes() {
    console.log('🔧 执行UI修复...');
    
    addForceStyles();
    fixMerchantButton();
    fixCustomerLoginButton();
    fixDropdownMenus();
    refreshMerchantButtonState();
    addDebugInfo();
    
    console.log('✅ UI修复完成');
}

// 页面加载时执行修复
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', executeUIFixes);
} else {
    executeUIFixes();
}

// 也可以手动执行修复
window.executeUIFixes = executeUIFixes;
window.fixMerchantButton = fixMerchantButton;
window.addDebugInfo = addDebugInfo;

console.log('🛠️ UI修复脚本已加载。可用函数:');
console.log('- executeUIFixes(): 执行所有UI修复');
console.log('- fixMerchantButton(): 修复商家按钮');
console.log('- addDebugInfo(): 显示调试信息');