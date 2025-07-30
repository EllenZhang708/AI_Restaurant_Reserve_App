// 系统功能全面检查工具

class SystemChecker {
    constructor() {
        this.issues = [];
        this.checkResults = [];
    }

    async runAllChecks() {
        console.log('🔍 开始系统功能全面检查...');
        
        const checks = [
            { name: '登录系统', func: () => this.checkLoginSystem() },
            { name: '预约系统', func: () => this.checkBookingSystem() },
            { name: '商家后台', func: () => this.checkMerchantDashboard() },
            { name: '数据存储', func: () => this.checkDataStorage() },
            { name: '页面导航', func: () => this.checkNavigation() },
            { name: '响应式设计', func: () => this.checkResponsiveDesign() },
            { name: '多语言支持', func: () => this.checkLanguageSupport() },
            { name: 'AI桌位分配', func: () => this.checkAIAllocation() }
        ];

        for (const check of checks) {
            try {
                console.log(`🧪 检查: ${check.name}`);
                const result = await check.func();
                this.checkResults.push({
                    name: check.name,
                    status: result.status,
                    details: result.details,
                    issues: result.issues || []
                });
            } catch (error) {
                console.error(`❌ ${check.name} 检查失败:`, error);
                this.checkResults.push({
                    name: check.name,
                    status: 'error',
                    details: error.message,
                    issues: [error.message]
                });
            }
        }

        this.generateReport();
        return this.checkResults;
    }

    checkLoginSystem() {
        const issues = [];
        const checks = [];

        // 检查登录页面文件
        const loginPages = ['customer-login.html', 'merchant-login.html'];
        loginPages.forEach(page => {
            try {
                fetch(page, { method: 'HEAD' })
                    .then(response => {
                        if (!response.ok) {
                            issues.push(`登录页面 ${page} 无法访问`);
                        } else {
                            checks.push(`${page} 可访问`);
                        }
                    })
                    .catch(() => issues.push(`登录页面 ${page} 请求失败`));
            } catch (error) {
                issues.push(`登录页面 ${page} 检查异常: ${error.message}`);
            }
        });

        // 检查登录相关函数
        const loginFunctions = ['goToCustomerLogin', 'goToMerchantLogin', 'loginWithGoogle', 'loginWithFacebook'];
        loginFunctions.forEach(func => {
            if (typeof window[func] === 'function') {
                checks.push(`函数 ${func} 存在`);
            } else {
                issues.push(`函数 ${func} 不存在或未定义`);
            }
        });

        // 检查登录状态
        const loginData = {
            isLoggedIn: localStorage.getItem('isLoggedIn'),
            userType: localStorage.getItem('userType'),
            currentUser: localStorage.getItem('currentUser'),
            currentMerchant: localStorage.getItem('currentMerchant')
        };

        checks.push(`登录状态数据: ${JSON.stringify(loginData)}`);

        return {
            status: issues.length === 0 ? 'pass' : 'warning',
            details: `检查了 ${checks.length} 项，发现 ${issues.length} 个问题`,
            issues: issues,
            checks: checks
        };
    }

    checkBookingSystem() {
        const issues = [];
        const checks = [];

        // 检查预约相关页面
        const bookingPages = ['booking.html', 'reservations.html'];
        bookingPages.forEach(page => {
            const link = document.querySelector(`a[href="${page}"]`);
            if (link) {
                checks.push(`${page} 链接存在`);
            } else {
                issues.push(`${page} 链接缺失`);
            }
        });

        // 检查预约数据
        const bookingData = JSON.parse(localStorage.getItem('mapleTableBookings') || '[]');
        const merchantBookingData = JSON.parse(localStorage.getItem('mapleTableMerchantBookings') || '[]');

        checks.push(`顾客预约数据: ${bookingData.length} 条`);
        checks.push(`商家预约数据: ${merchantBookingData.length} 条`);

        if (bookingData.length !== merchantBookingData.length) {
            issues.push('预约数据不同步：顾客和商家预约数量不一致');
        }

        // 检查AI分配系统
        if (typeof window.aiTableSystem !== 'undefined') {
            checks.push('AI桌位分配系统已加载');
        } else {
            issues.push('AI桌位分配系统未加载');
        }

        // 检查预约功能函数
        const bookingFunctions = ['quickBook', 'addToCalendar', 'goToReservations'];
        bookingFunctions.forEach(func => {
            if (typeof window[func] === 'function') {
                checks.push(`函数 ${func} 存在`);
            } else {
                issues.push(`函数 ${func} 不存在`);
            }
        });

        return {
            status: issues.length === 0 ? 'pass' : (issues.length > 2 ? 'fail' : 'warning'),
            details: `检查了预约系统各项功能`,
            issues: issues,
            checks: checks
        };
    }

    checkMerchantDashboard() {
        const issues = [];
        const checks = [];

        // 检查商家后台页面
        const dashboardExists = document.querySelector('a[href="merchant-dashboard.html"]') || 
                               window.location.pathname.includes('merchant-dashboard.html');
        
        if (dashboardExists) {
            checks.push('商家后台页面链接存在');
        } else {
            issues.push('商家后台页面链接缺失');
        }

        // 检查商家数据
        const merchantSession = localStorage.getItem('mapleTableMerchantSession');
        const currentMerchant = localStorage.getItem('currentMerchant');

        if (merchantSession) {
            checks.push('商家会话数据存在');
        } else {
            issues.push('商家会话数据缺失');
        }

        if (currentMerchant) {
            checks.push('当前商家数据存在');
        } else {
            issues.push('当前商家数据缺失');
        }

        // 检查商家预约数据
        const merchantBookings = JSON.parse(localStorage.getItem('mapleTableMerchantBookings') || '[]');
        checks.push(`商家预约数据: ${merchantBookings.length} 条`);

        if (merchantBookings.length === 0) {
            issues.push('商家预约数据为空，可能影响后台显示');
        }

        return {
            status: issues.length === 0 ? 'pass' : 'warning',
            details: `商家后台系统检查完成`,
            issues: issues,
            checks: checks
        };
    }

    checkDataStorage() {
        const issues = [];
        const checks = [];

        // 检查所有localStorage数据
        const expectedKeys = [
            'mapleTableBookings',
            'mapleTableMerchantBookings',
            'isLoggedIn',
            'userType',
            'selectedRestaurant'
        ];

        expectedKeys.forEach(key => {
            const data = localStorage.getItem(key);
            if (data !== null) {
                checks.push(`${key}: ${typeof data === 'string' && data.startsWith('[') ? JSON.parse(data).length + ' 条记录' : '存在'}`);
            } else {
                issues.push(`${key} 数据缺失`);
            }
        });

        // 检查数据完整性
        try {
            const bookings = JSON.parse(localStorage.getItem('mapleTableBookings') || '[]');
            const merchantBookings = JSON.parse(localStorage.getItem('mapleTableMerchantBookings') || '[]');
            
            bookings.forEach((booking, index) => {
                if (!booking.id || !booking.restaurantId || !booking.customerInfo) {
                    issues.push(`预约记录 ${index} 数据不完整`);
                }
            });

            checks.push(`数据完整性检查完成`);
        } catch (error) {
            issues.push(`数据解析错误: ${error.message}`);
        }

        return {
            status: issues.length === 0 ? 'pass' : 'warning',
            details: `数据存储检查完成`,
            issues: issues,
            checks: checks
        };
    }

    checkNavigation() {
        const issues = [];
        const checks = [];

        // 检查主要导航链接
        const navLinks = [
            { selector: 'a[href="booking.html"]', name: '预订页面' },
            { selector: 'a[href="reservations.html"]', name: '预约管理' },
            { selector: 'a[href="merchant-dashboard.html"]', name: '商家后台' },
            { selector: 'a[href="customer-login.html"]', name: '顾客登录' },
            { selector: 'a[href="merchant-login.html"]', name: '商家登录' }
        ];

        navLinks.forEach(link => {
            const element = document.querySelector(link.selector);
            if (element) {
                checks.push(`${link.name} 导航链接存在`);
            } else {
                issues.push(`${link.name} 导航链接缺失`);
            }
        });

        // 检查底部导航
        const bottomNav = document.querySelector('.bottom-nav');
        if (bottomNav) {
            const navItems = bottomNav.querySelectorAll('.nav-item');
            checks.push(`底部导航存在，包含 ${navItems.length} 个项目`);
        } else {
            issues.push('底部导航缺失');
        }

        return {
            status: issues.length === 0 ? 'pass' : 'warning',
            details: `导航系统检查完成`,
            issues: issues,
            checks: checks
        };
    }

    checkResponsiveDesign() {
        const issues = [];
        const checks = [];

        // 检查响应式CSS
        const responsiveElements = document.querySelectorAll('[class*="mobile"], [class*="tablet"], [class*="desktop"]');
        checks.push(`响应式元素: ${responsiveElements.length} 个`);

        // 检查meta viewport
        const viewport = document.querySelector('meta[name="viewport"]');
        if (viewport) {
            checks.push('Viewport meta标签存在');
        } else {
            issues.push('Viewport meta标签缺失');
        }

        // 检查媒体查询
        const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
        checks.push(`样式表文件: ${stylesheets.length} 个`);

        return {
            status: issues.length === 0 ? 'pass' : 'warning',
            details: `响应式设计检查完成`,
            issues: issues,
            checks: checks
        };
    }

    checkLanguageSupport() {
        const issues = [];
        const checks = [];

        // 检查多语言元素
        const langElements = document.querySelectorAll('[data-en], [data-fr]');
        checks.push(`多语言元素: ${langElements.length} 个`);

        // 检查语言切换函数
        if (typeof window.toggleLanguage === 'function') {
            checks.push('语言切换函数存在');
        } else {
            issues.push('语言切换函数缺失');
        }

        // 检查当前语言设置
        const currentLang = localStorage.getItem('mapleTableLanguage');
        if (currentLang) {
            checks.push(`当前语言: ${currentLang}`);
        } else {
            checks.push('使用默认语言设置');
        }

        return {
            status: issues.length === 0 ? 'pass' : 'warning',
            details: `多语言支持检查完成`,
            issues: issues,
            checks: checks
        };
    }

    checkAIAllocation() {
        const issues = [];
        const checks = [];

        // 检查AI分配系统
        if (typeof window.aiTableSystem !== 'undefined') {
            checks.push('AI桌位分配系统已加载');
            
            if (typeof window.aiTableSystem.assignOptimalTable === 'function') {
                checks.push('AI分配函数可用');
            } else {
                issues.push('AI分配函数不可用');
            }
        } else {
            issues.push('AI桌位分配系统未加载');
        }

        // 检查相关脚本文件
        const aiScript = document.querySelector('script[src*="ai-table-allocation"]');
        if (aiScript) {
            checks.push('AI分配脚本文件已加载');
        } else {
            issues.push('AI分配脚本文件未加载');
        }

        return {
            status: issues.length === 0 ? 'pass' : 'warning',
            details: `AI桌位分配系统检查完成`,
            issues: issues,
            checks: checks
        };
    }

    generateReport() {
        console.log('\n📊 系统检查报告');
        console.log('==========================================');
        
        let passCount = 0;
        let warningCount = 0;
        let failCount = 0;

        this.checkResults.forEach(result => {
            const status = result.status === 'pass' ? '✅' : 
                          result.status === 'warning' ? '⚠️' : '❌';
            
            console.log(`${status} ${result.name}: ${result.details}`);
            
            if (result.issues && result.issues.length > 0) {
                result.issues.forEach(issue => {
                    console.log(`   ❗ ${issue}`);
                });
            }

            if (result.status === 'pass') passCount++;
            else if (result.status === 'warning') warningCount++;
            else failCount++;
        });

        console.log('==========================================');
        console.log(`📈 检查结果统计:`);
        console.log(`   ✅ 通过: ${passCount} 项`);
        console.log(`   ⚠️ 警告: ${warningCount} 项`);
        console.log(`   ❌ 失败: ${failCount} 项`);
        
        const overallStatus = failCount > 0 ? '❌ 有严重问题' : 
                             warningCount > 0 ? '⚠️ 有需要注意的问题' : 
                             '✅ 系统运行正常';
        
        console.log(`🎯 总体状态: ${overallStatus}`);
        
        return {
            overall: overallStatus,
            pass: passCount,
            warning: warningCount,
            fail: failCount,
            details: this.checkResults
        };
    }
}

// 暴露到全局
window.SystemChecker = SystemChecker;

// 页面加载后自动创建实例
document.addEventListener('DOMContentLoaded', function() {
    window.systemChecker = new SystemChecker();
    console.log('🔧 系统检查工具已加载，使用 systemChecker.runAllChecks() 开始检查');
});