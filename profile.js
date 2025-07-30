// 用户档案页面功能
class ProfileManager {
    constructor() {
        this.user = {};
        this.editMode = false;
        this.init();
    }

    init() {
        this.loadUserProfile();
        this.setupEventListeners();
        console.log('👤 用户档案管理系统已初始化');
    }

    // 加载用户档案数据
    loadUserProfile() {
        // 从localStorage获取用户信息
        const savedProfile = localStorage.getItem('userProfile');
        
        // 模拟用户数据
        const mockProfile = {
            id: 'user_001',
            name: 'John Maple',
            email: 'john.maple@email.com',
            phone: '+1 (416) 555-0123',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
            membershipLevel: 'gold',
            membershipExpiry: '2024-12-31',
            points: 1240,
            totalBookings: 24,
            averageRating: 4.8,
            favoriteRestaurants: 12,
            preferences: {
                cuisines: ['Italian', 'French', 'Canadian'],
                dietaryRestrictions: ['No peanuts'],
                seatingPreference: 'Window seat',
                occasionTypes: ['Date night', 'Business dinner']
            },
            addresses: {
                home: '123 Maple Street, Toronto, ON M5V 1A3',
                work: '456 Bay Street, Toronto, ON M5H 2Y4'
            },
            notifications: {
                bookingReminders: true,
                promotions: true,
                newsletter: false
            },
            language: 'en-CA',
            joinDate: '2023-03-15',
            verified: true,
            lastLogin: new Date().toISOString()
        };

        this.user = savedProfile ? { ...mockProfile, ...JSON.parse(savedProfile) } : mockProfile;
        this.updateUI();
    }

    // 更新UI显示
    updateUI() {
        // 更新头像和基本信息
        const profileImage = document.getElementById('profileImage');
        const profileName = document.getElementById('profileName');
        const profileEmail = document.getElementById('profileEmail');

        if (profileImage) profileImage.src = this.user.avatar;
        if (profileName) profileName.textContent = this.user.name;
        if (profileEmail) profileEmail.textContent = this.user.email;

        // 更新统计数据
        this.updateStats();
        
        // 更新会员状态
        this.updateMembershipStatus();
    }

    // 更新统计数据
    updateStats() {
        const statElements = document.querySelectorAll('.stat-number');
        const stats = [
            this.user.totalBookings,
            this.user.points.toLocaleString(),
            this.user.averageRating.toFixed(1),
            this.user.favoriteRestaurants
        ];

        statElements.forEach((element, index) => {
            if (element && stats[index] !== undefined) {
                element.textContent = stats[index];
            }
        });
    }

    // 更新会员状态
    updateMembershipStatus() {
        const membershipBadge = document.querySelector('.badge.gold');
        if (membershipBadge) {
            const levelText = this.user.membershipLevel.charAt(0).toUpperCase() + 
                            this.user.membershipLevel.slice(1) + ' Member';
            membershipBadge.innerHTML = `<i class="fas fa-crown"></i> ${levelText}`;
        }
    }

    // 设置事件监听器
    setupEventListeners() {
        // 头像编辑点击
        const avatarEditBtn = document.querySelector('.avatar-edit-btn');
        if (avatarEditBtn) {
            avatarEditBtn.addEventListener('click', () => this.changeProfilePicture());
        }

        // 统计卡片点击效果
        document.querySelectorAll('.stat-item').forEach((item, index) => {
            item.addEventListener('click', () => this.showStatDetails(index));
        });
    }

    // 切换编辑模式
    toggleEditMode() {
        this.editMode = !this.editMode;
        const app = document.querySelector('.profile-app');
        const editBtn = document.querySelector('.edit-btn');
        
        if (this.editMode) {
            app.classList.add('edit-mode');
            editBtn.innerHTML = '<i class="fas fa-save"></i>';
            this.makeEditable();
        } else {
            app.classList.remove('edit-mode');
            editBtn.innerHTML = '<i class="fas fa-edit"></i>';
            this.saveProfile();
        }
    }

    // 使字段可编辑
    makeEditable() {
        const nameElement = document.getElementById('profileName');
        const emailElement = document.getElementById('profileEmail');

        if (nameElement) {
            nameElement.contentEditable = true;
            nameElement.focus();
        }
        if (emailElement) {
            emailElement.contentEditable = true;
        }
    }

    // 保存档案更改
    saveProfile() {
        const nameElement = document.getElementById('profileName');
        const emailElement = document.getElementById('profileEmail');

        if (nameElement) {
            this.user.name = nameElement.textContent.trim();
            nameElement.contentEditable = false;
        }
        if (emailElement) {
            this.user.email = emailElement.textContent.trim();
            emailElement.contentEditable = false;
        }

        // 保存到localStorage
        localStorage.setItem('userProfile', JSON.stringify(this.user));
        
        // 显示成功消息
        this.showNotification('Profile updated successfully!', 'success');
    }

    // 更换头像
    changeProfilePicture() {
        // 模拟头像选择器
        const avatars = [
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
            'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
            'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
            'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
        ];

        const currentIndex = avatars.indexOf(this.user.avatar);
        const nextIndex = (currentIndex + 1) % avatars.length;
        
        this.user.avatar = avatars[nextIndex];
        document.getElementById('profileImage').src = this.user.avatar;
        
        this.showNotification('Profile picture updated!', 'success');
    }

    // 显示统计详情
    showStatDetails(statIndex) {
        const details = [
            'Total restaurant bookings made through MapleTable',
            `Loyalty points earned from dining and reviews\n1,240 points = $12.40 in rewards`,
            'Average rating across all your restaurant reviews',
            'Number of restaurants saved to your favorites list'
        ];

        alert(details[statIndex] || 'Statistic details');
    }

    // 显示通知
    showNotification(message, type = 'info') {
        // 创建通知元素
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            padding: 12px 20px;
            border-radius: 12px;
            font-weight: 600;
            z-index: 10000;
            transform: translateX(100%);
            transition: all 0.3s ease;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        `;
        notification.textContent = message;

        document.body.appendChild(notification);

        // 显示动画
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // 自动隐藏
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// 全局函数
function toggleEditMode() {
    if (window.profileManager) {
        window.profileManager.toggleEditMode();
    }
}

function changeProfilePicture() {
    if (window.profileManager) {
        window.profileManager.changeProfilePicture();
    }
}

function showSettings() {
    alert('Settings page coming soon!');
}

// 菜单项功能
function editPersonalInfo() {
    alert('Personal information editor coming soon!');
}

function managePreferences() {
    const preferences = window.profileManager?.user.preferences;
    if (preferences) {
        const prefText = `Current Preferences:
        
Favorite Cuisines: ${preferences.cuisines.join(', ')}
Dietary Restrictions: ${preferences.dietaryRestrictions.join(', ')}
Seating Preference: ${preferences.seatingPreference}
Occasion Types: ${preferences.occasionTypes.join(', ')}`;
        
        alert(prefText);
    } else {
        alert('Dining preferences manager coming soon!');
    }
}

function showAddresses() {
    const addresses = window.profileManager?.user.addresses;
    if (addresses) {
        const addressText = `Your Saved Addresses:
        
🏠 Home: ${addresses.home}
🏢 Work: ${addresses.work}`;
        
        alert(addressText);
    } else {
        alert('Address manager coming soon!');
    }
}

function showFavorites() {
    alert('Your favorite restaurants list coming soon!');
}

function showReviews() {
    alert('Your reviews and ratings coming soon!');
}

function showPoints() {
    const points = window.profileManager?.user.points || 1240;
    alert(`You have ${points.toLocaleString()} MaplePoints!
    
💰 Point Value: $${(points * 0.01).toFixed(2)}
🎁 Next Reward: 2,000 points ($20 credit)
📈 Points until next tier: ${2000 - points} points`);
}

function showMembership() {
    const user = window.profileManager?.user;
    if (user) {
        const membershipText = `Membership Status: ${user.membershipLevel.toUpperCase()}
        
✨ Member since: ${new Date(user.joinDate).toLocaleDateString()}
📅 Expires: ${new Date(user.membershipExpiry).toLocaleDateString()}
🏆 Total bookings: ${user.totalBookings}
⭐ Average rating: ${user.averageRating}/5.0`;
        
        alert(membershipText);
    } else {
        alert('Membership details coming soon!');
    }
}

function showOffers() {
    alert('🎉 Current Special Offers:\n\n• 20% off Italian restaurants this weekend\n• Free appetizer with any booking over $100\n\nMore exclusive offers available in the app!');
}

function showNotificationSettings() {
    const notifications = window.profileManager?.user.notifications;
    if (notifications) {
        const notifText = `Current Notification Settings:
        
📅 Booking Reminders: ${notifications.bookingReminders ? 'ON' : 'OFF'}
🎯 Promotions: ${notifications.promotions ? 'ON' : 'OFF'}  
📧 Newsletter: ${notifications.newsletter ? 'ON' : 'OFF'}`;
        
        alert(notifText);
    } else {
        alert('Notification settings coming soon!');
    }
}

function showLanguageSettings() {
    const language = window.profileManager?.user.language || 'en-CA';
    const languageNames = {
        'en-CA': 'English (Canada)',
        'fr-CA': 'Français (Canada)',
        'en-US': 'English (United States)'
    };
    
    alert(`Current Language: ${languageNames[language] || language}\n\nLanguage settings coming soon!`);
}

function showPrivacySettings() {
    alert('Privacy & Security Settings:\n\n🔐 Account Security\n📊 Data Sharing Preferences\n🍪 Cookie Settings\n\nFull privacy controls coming soon!');
}

function showHelp() {
    alert('MapleTable Help Center\n\n📱 How to make a booking\n🔄 Modifying reservations\n💳 Payment methods\n⭐ Rating restaurants\n\nFull help center coming soon!');
}

function contactSupport() {
    alert('Contact Support:\n\n📧 Email: support@mapletable.ca\n📞 Phone: 1-800-MAPLE-01\n💬 Live Chat: Available 9 AM - 9 PM EST\n\nSupport team coming soon!');
}

function showAbout() {
    alert('🍁 MapleTable v2.1.0\n\nCanada\'s premier restaurant booking platform\n\n👨‍💻 Built with love in Toronto\n🌟 Serving Canadian foodies since 2023\n🔒 Your privacy is our priority');
}

function confirmLogout() {
    if (confirm('Are you sure you want to sign out of your account?')) {
        // 清除用户数据
        localStorage.removeItem('userProfile');
        localStorage.removeItem('customerLogin');
        
        // 显示登出消息
        alert('You have been signed out successfully!');
        
        // 重定向到首页
        window.location.href = 'index.html';
    }
}

function goBack() {
    window.history.back();
}

// 导航函数
function switchTab(tab) {
    switch(tab) {
        case 'home':
            window.location.href = 'index.html';
            break;
        case 'explore':
            window.location.href = 'explore.html';
            break;
        case 'bookings':
            window.location.href = 'bookings.html';
            break;
        case 'profile':
            // 已在当前页面
            break;
    }
}

function quickBook() {
    window.location.href = 'index.html';
}

// 初始化档案管理器
document.addEventListener('DOMContentLoaded', () => {
    window.profileManager = new ProfileManager();
});