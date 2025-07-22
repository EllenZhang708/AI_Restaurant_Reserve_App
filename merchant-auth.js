// Merchant Authentication System - MapleTable

class MerchantAuthSystem {
    constructor() {
        this.currentLanguage = 'en';
        this.currentView = 'selection'; // selection, login, register
        
        this.translations = {
            en: {
                'Join Canada\'s Premier Restaurant Network': 'Join Canada\'s Premier Restaurant Network',
                'Connect with thousands of hungry Canadians': 'Connect with thousands of hungry Canadians looking for authentic dining experiences',
                'Monthly Diners': 'Monthly Diners',
                'Partner Restaurants': 'Partner Restaurants', 
                'Customer Satisfaction': 'Customer Satisfaction',
                'Sign In': 'Sign In',
                'Join MapleTable': 'Join MapleTable',
                'Welcome Back': 'Welcome Back',
                'Welcome to MapleTable!': 'Welcome to MapleTable!',
                'Registration Successful': 'Your restaurant has been successfully registered',
                'Login Successful': 'Welcome back! Redirecting to your dashboard...',
                'Invalid Credentials': 'Invalid email or password. Please try again.',
                'Registration Error': 'Registration failed. Please check your information and try again.',
                'Password too weak': 'Password must be at least 8 characters with numbers and letters'
            },
            fr: {
                'Join Canada\'s Premier Restaurant Network': 'Rejoignez le Premier Réseau de Restaurants du Canada',
                'Connect with thousands of hungry Canadians': 'Connectez-vous avec des milliers de Canadiens affamés à la recherche d\'expériences culinaires authentiques',
                'Monthly Diners': 'Convives Mensuels',
                'Partner Restaurants': 'Restaurants Partenaires',
                'Customer Satisfaction': 'Satisfaction Client',
                'Sign In': 'Se Connecter',
                'Join MapleTable': 'Rejoindre MapleTable',
                'Welcome Back': 'Bon Retour',
                'Welcome to MapleTable!': 'Bienvenue chez MapleTable!',
                'Registration Successful': 'Votre restaurant a été enregistré avec succès',
                'Login Successful': 'Bon retour! Redirection vers votre tableau de bord...',
                'Invalid Credentials': 'Email ou mot de passe invalide. Veuillez réessayer.',
                'Registration Error': 'Échec de l\'enregistrement. Veuillez vérifier vos informations et réessayer.',
                'Password too weak': 'Le mot de passe doit contenir au moins 8 caractères avec des chiffres et des lettres'
            }
        };
        
        this.initialize();
    }
    
    initialize() {
        this.loadLanguageFromStorage();
        this.setupEventListeners();
        this.showModeSelection();
    }
    
    setupEventListeners() {
        // 密码强度检查
        const passwordInputs = document.querySelectorAll('input[type="password"]');
        passwordInputs.forEach(input => {
            input.addEventListener('input', (e) => {
                if (e.target.id === 'registerPassword') {
                    this.checkPasswordStrength(e.target.value);
                }
            });
        });
        
        // 电话号码格式化
        const phoneInput = document.getElementById('phoneNumber');
        if (phoneInput) {
            phoneInput.addEventListener('input', this.formatPhoneNumber);
        }
        
        // 实时验证
        document.querySelectorAll('input[required]').forEach(input => {
            input.addEventListener('blur', this.validateField);
        });
    }
    
    // 显示模式选择
    showModeSelection() {
        document.getElementById('modeSelection').style.display = 'block';
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('registerForm').style.display = 'none';
        this.currentView = 'selection';
    }
    
    // 显示登录表单
    showLoginForm() {
        document.getElementById('modeSelection').style.display = 'none';
        document.getElementById('loginForm').style.display = 'block';
        document.getElementById('registerForm').style.display = 'none';
        this.currentView = 'login';
        
        // 聚焦到邮箱输入
        setTimeout(() => {
            document.getElementById('loginEmail').focus();
        }, 100);
    }
    
    // 显示注册表单
    showRegisterForm() {
        document.getElementById('modeSelection').style.display = 'none';
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('registerForm').style.display = 'block';
        this.currentView = 'register';
        
        // 聚焦到餐厅名称输入
        setTimeout(() => {
            document.getElementById('restaurantName').focus();
        }, 100);
    }
    
    // 处理登录
    async handleLogin(event) {
        event.preventDefault();
        
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;
        const rememberMe = document.getElementById('rememberMe').checked;
        
        if (!this.validateLoginForm(email, password)) {
            return;
        }
        
        // 显示加载状态
        this.setLoadingState(true);
        
        try {
            // 模拟登录API调用
            await this.delay(1500);
            
            // 检查存储的商家数据
            const merchants = JSON.parse(localStorage.getItem('mapleTableMerchants') || '[]');
            const merchant = merchants.find(m => m.email === email && m.password === this.hashPassword(password));
            
            if (merchant) {
                // 登录成功
                this.saveMerchantSession(merchant, rememberMe);
                this.showNotification(this.translations[this.currentLanguage]['Login Successful'], 'success');
                
                // 延迟跳转到仪表板
                setTimeout(() => {
                    window.location.href = 'merchant-dashboard.html';
                }, 2000);
            } else {
                this.showNotification(this.translations[this.currentLanguage]['Invalid Credentials'], 'error');
            }
            
        } catch (error) {
            this.showNotification('Login failed. Please try again.', 'error');
        } finally {
            this.setLoadingState(false);
        }
    }
    
    // 处理注册
    async handleRegister(event) {
        event.preventDefault();
        
        const formData = this.collectRegistrationData();
        
        if (!this.validateRegistrationForm(formData)) {
            return;
        }
        
        // 显示加载状态
        this.setLoadingState(true);
        
        try {
            // 模拟注册API调用
            await this.delay(2000);
            
            // 生成商家ID和密码哈希
            const merchantId = this.generateMerchantId();
            const passwordHash = this.hashPassword(formData.password);
            
            // 创建商家记录
            const merchantData = {
                id: merchantId,
                email: formData.email,
                password: passwordHash,
                restaurant: {
                    name: formData.restaurantName,
                    cuisine: formData.cuisineType,
                    city: formData.cityLocation,
                    address: formData.address,
                    phone: formData.phone,
                    capacity: formData.capacity,
                    winterFeatures: formData.winterFeatures,
                    diningOptions: formData.diningOptions
                },
                owner: {
                    firstName: formData.ownerFirstName,
                    lastName: formData.ownerLastName
                },
                status: 'pending', // pending, approved, active, suspended
                registrationDate: new Date().toISOString(),
                settings: {
                    language: this.currentLanguage,
                    notifications: formData.agreeMarketing,
                    autoAcceptBookings: false,
                    bookingWindow: 30 // days
                }
            };
            
            // 保存到本地存储
            this.saveMerchantData(merchantData);
            
            // 显示成功消息
            this.showSuccessModal(merchantData);
            
        } catch (error) {
            this.showNotification(this.translations[this.currentLanguage]['Registration Error'], 'error');
        } finally {
            this.setLoadingState(false);
        }
    }
    
    // 收集注册数据
    collectRegistrationData() {
        const winterFeatures = Array.from(document.querySelectorAll('input[name=\"winterFeatures\"]:checked'))
            .map(cb => cb.value);
        const diningOptions = Array.from(document.querySelectorAll('input[name=\"diningOptions\"]:checked'))
            .map(cb => cb.value);
        
        return {
            restaurantName: document.getElementById('restaurantName').value.trim(),
            cuisineType: document.getElementById('cuisineType').value,
            cityLocation: document.getElementById('cityLocation').value,
            address: document.getElementById('restaurantAddress').value.trim(),
            phone: document.getElementById('phoneNumber').value.trim(),
            capacity: parseInt(document.getElementById('capacity').value),
            ownerFirstName: document.getElementById('ownerFirstName').value.trim(),
            ownerLastName: document.getElementById('ownerLastName').value.trim(),
            email: document.getElementById('businessEmail').value.trim(),
            password: document.getElementById('registerPassword').value,
            winterFeatures,
            diningOptions,
            agreeTerms: document.getElementById('agreeTerms').checked,
            agreeMarketing: document.getElementById('agreeMarketing').checked
        };
    }
    
    // 验证登录表单
    validateLoginForm(email, password) {
        if (!email || !this.isValidEmail(email)) {
            this.showNotification('Please enter a valid email address', 'error');
            return false;
        }
        
        if (!password) {
            this.showNotification('Please enter your password', 'error');
            return false;
        }
        
        return true;
    }
    
    // 验证注册表单
    validateRegistrationForm(data) {
        // 必填字段检查
        const requiredFields = [
            'restaurantName', 'cuisineType', 'cityLocation', 'address', 
            'phone', 'capacity', 'ownerFirstName', 'ownerLastName', 'email', 'password'
        ];
        
        for (const field of requiredFields) {
            if (!data[field]) {
                this.showNotification(`Please fill in all required fields`, 'error');
                return false;
            }
        }
        
        // 邮箱验证
        if (!this.isValidEmail(data.email)) {
            this.showNotification('Please enter a valid email address', 'error');
            return false;
        }
        
        // 密码强度验证
        if (!this.isStrongPassword(data.password)) {
            this.showNotification(this.translations[this.currentLanguage]['Password too weak'], 'error');
            return false;
        }
        
        // 电话号码验证
        if (!this.isValidPhoneNumber(data.phone)) {
            this.showNotification('Please enter a valid Canadian phone number', 'error');
            return false;
        }
        
        // 容量验证
        if (data.capacity < 10 || data.capacity > 500) {
            this.showNotification('Restaurant capacity must be between 10 and 500', 'error');
            return false;
        }
        
        // 协议同意验证
        if (!data.agreeTerms) {
            this.showNotification('Please agree to the Terms of Service', 'error');
            return false;
        }
        
        return true;
    }
    
    // 密码强度检查
    checkPasswordStrength(password) {
        const strengthBar = document.querySelector('.strength-bar');
        const strengthText = document.querySelector('.strength-text');
        
        if (!strengthBar || !strengthText) return;
        
        let strength = 0;
        let text = '';
        let color = '';
        
        if (password.length >= 8) strength += 25;
        if (/[A-Z]/.test(password)) strength += 25;
        if (/[a-z]/.test(password)) strength += 25;
        if (/[0-9]/.test(password)) strength += 25;
        if (/[^A-Za-z0-9]/.test(password)) strength += 10;
        
        if (strength < 25) {
            text = this.currentLanguage === 'fr' ? 'Très faible' : 'Very weak';
            color = '#dc3545';
        } else if (strength < 50) {
            text = this.currentLanguage === 'fr' ? 'Faible' : 'Weak';
            color = '#fd7e14';
        } else if (strength < 75) {
            text = this.currentLanguage === 'fr' ? 'Moyen' : 'Medium';
            color = '#ffc107';
        } else {
            text = this.currentLanguage === 'fr' ? 'Fort' : 'Strong';
            color = '#28a745';
        }
        
        strengthBar.style.setProperty('--strength-width', `${Math.min(strength, 100)}%`);
        strengthBar.style.setProperty('--strength-color', color);
        strengthText.textContent = text;
        
        // 动态更新CSS
        if (!document.getElementById('strengthStyles')) {
            const style = document.createElement('style');
            style.id = 'strengthStyles';
            style.textContent = `
                .strength-bar::after {
                    width: var(--strength-width, 0%);
                    background: var(--strength-color, #dc3545);
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // 密码可见性切换
    togglePasswordVisibility(inputId) {
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
    
    // 电话号码格式化
    formatPhoneNumber(event) {
        let value = event.target.value.replace(/\D/g, '');
        
        if (value.length >= 6) {
            value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
        } else if (value.length >= 3) {
            value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
        }
        
        event.target.value = value;
    }
    
    // 字段验证
    validateField(event) {
        const field = event.target;
        const value = field.value.trim();
        
        // 移除之前的错误状态
        field.classList.remove('error');
        
        if (field.hasAttribute('required') && !value) {
            field.classList.add('error');
            return false;
        }
        
        if (field.type === 'email' && value && !this.isValidEmail(value)) {
            field.classList.add('error');
            return false;
        }
        
        return true;
    }
    
    // 保存商家数据
    saveMerchantData(merchantData) {
        const merchants = JSON.parse(localStorage.getItem('mapleTableMerchants') || '[]');
        merchants.push(merchantData);
        localStorage.setItem('mapleTableMerchants', JSON.stringify(merchants));
    }
    
    // 保存商家会话
    saveMerchantSession(merchant, remember) {
        const sessionData = {
            merchantId: merchant.id,
            email: merchant.email,
            restaurantName: merchant.restaurant.name,
            loginTime: new Date().toISOString()
        };
        
        if (remember) {
            localStorage.setItem('mapleTableMerchantSession', JSON.stringify(sessionData));
        } else {
            sessionStorage.setItem('mapleTableMerchantSession', JSON.stringify(sessionData));
        }
    }
    
    // 显示成功模态框
    showSuccessModal(merchantData) {
        const modal = document.getElementById('successModal');
        modal.classList.add('show');
        
        // 可以在这里动态更新模态框内容
        setTimeout(() => {
            this.saveMerchantSession(merchantData, false);
        }, 1000);
    }
    
    // 跳转到仪表板
    goToDashboard() {
        window.location.href = 'merchant-dashboard.html';
    }
    
    // 设置加载状态
    setLoadingState(loading) {
        const forms = document.querySelectorAll('.merchant-form');
        const buttons = document.querySelectorAll('.submit-btn');
        
        forms.forEach(form => {
            if (loading) {
                form.classList.add('loading');
            } else {
                form.classList.remove('loading');
            }
        });
        
        buttons.forEach(button => {
            button.disabled = loading;
            if (loading) {
                const icon = button.querySelector('i');
                icon.className = 'fas fa-spinner fa-spin';
            }
        });
    }
    
    // 工具函数
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    isValidPhoneNumber(phone) {
        const phoneRegex = /^\(\d{3}\)\s\d{3}-\d{4}$/;
        return phoneRegex.test(phone);
    }
    
    isStrongPassword(password) {
        return password.length >= 8 && 
               /[A-Za-z]/.test(password) && 
               /[0-9]/.test(password);
    }
    
    hashPassword(password) {
        // 简单的哈希函数（实际应用中应使用更安全的方法）
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash.toString();
    }
    
    generateMerchantId() {
        return 'MER' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substr(2, 3).toUpperCase();
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    // 语言切换
    toggleLanguage() {
        this.currentLanguage = this.currentLanguage === 'en' ? 'fr' : 'en';
        document.getElementById('currentLang').textContent = this.currentLanguage.toUpperCase();
        localStorage.setItem('mapleTableLanguage', this.currentLanguage);
        this.updateTranslations();
    }
    
    loadLanguageFromStorage() {
        const savedLanguage = localStorage.getItem('mapleTableLanguage');
        if (savedLanguage && savedLanguage !== this.currentLanguage) {
            this.currentLanguage = savedLanguage;
            document.getElementById('currentLang').textContent = this.currentLanguage.toUpperCase();
            this.updateTranslations();
        }
    }
    
    updateTranslations() {
        document.querySelectorAll('[data-en]').forEach(element => {
            const enText = element.getAttribute('data-en');
            const frText = element.getAttribute('data-fr');
            if (this.currentLanguage === 'fr' && frText) {
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = frText;
                } else {
                    element.textContent = frText;
                }
            } else if (enText) {
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = enText;
                } else {
                    element.textContent = enText;
                }
            }
        });
        
        // 更新页面标题
        document.title = this.currentLanguage === 'fr' ? 
            'Portail Marchand - MapleTable' : 
            'Merchant Portal - MapleTable';
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            left: 50%;
            transform: translateX(-50%);
            background: ${type === 'error' ? '#dc3545' : type === 'success' ? '#28a745' : '#17a2b8'};
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
function showModeSelection() {
    merchantAuth.showModeSelection();
}

function showLoginForm() {
    merchantAuth.showLoginForm();
}

function showRegisterForm() {
    merchantAuth.showRegisterForm();
}

function handleLogin(event) {
    merchantAuth.handleLogin(event);
}

function handleRegister(event) {
    merchantAuth.handleRegister(event);
}

function togglePasswordVisibility(inputId) {
    merchantAuth.togglePasswordVisibility(inputId);
}

function toggleLanguage() {
    merchantAuth.toggleLanguage();
}

function goToDashboard() {
    merchantAuth.goToDashboard();
}

function goBack() {
    window.history.back() || (window.location.href = 'index.html');
}

function closeModal() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('show');
    });
}

// 初始化商家认证系统
let merchantAuth;
document.addEventListener('DOMContentLoaded', () => {
    merchantAuth = new MerchantAuthSystem();
});

// 添加CSS动画样式
const authStyles = document.createElement('style');
authStyles.textContent = `
    @keyframes slideInDown {
        from { transform: translate(-50%, -100%); opacity: 0; }
        to { transform: translate(-50%, 0); opacity: 1; }
    }
    
    @keyframes slideOutUp {
        to { transform: translate(-50%, -100%); opacity: 0; }
    }
    
    .error {
        border-color: #dc3545 !important;
        box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1) !important;
    }
`;
document.head.appendChild(authStyles);