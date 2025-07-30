// MapleTable API服务层 - 真实API交互和数据管理
class APIService {
    constructor() {
        this.baseURL = 'https://api.mapletable.ca';
        this.devURL = 'http://localhost:3001';
        this.isProduction = window.location.hostname !== 'localhost';
        this.currentURL = this.isProduction ? this.baseURL : this.devURL;
        this.authToken = localStorage.getItem('mapletable_auth_token');
        this.requestQueue = [];
        this.isOnline = navigator.onLine;
        
        this.setupNetworkMonitoring();
    }
    
    // 网络状态监控
    setupNetworkMonitoring() {
        window.addEventListener('online', () => {
            this.isOnline = true;
            console.log('🌐 网络连接已恢复，处理离线队列...');
            this.processOfflineQueue();
        });
        
        window.addEventListener('offline', () => {
            this.isOnline = false;
            console.log('📵 网络连接断开，启用离线模式...');
        });
    }
    
    // 通用API请求方法
    async request(endpoint, options = {}) {
        const url = `${this.currentURL}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                ...options.headers
            },
            ...options
        };
        
        // 添加认证token
        if (this.authToken) {
            config.headers.Authorization = `Bearer ${this.authToken}`;
        }
        
        try {
            if (!this.isOnline) {
                return this.handleOfflineRequest(endpoint, config);
            }
            
            const response = await fetch(url, config);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            
            // 缓存成功的GET请求
            if (config.method === 'GET' || !config.method) {
                this.cacheResponse(endpoint, data);
            }
            
            return data;
        } catch (error) {
            console.error('API请求失败:', error);
            
            // 如果网络错误，尝试从缓存获取数据
            if (!this.isOnline || error.name === 'TypeError') {
                return this.getCachedResponse(endpoint) || this.getMockData(endpoint);
            }
            
            throw error;
        }
    }
    
    // 缓存响应数据
    cacheResponse(endpoint, data) {
        const cacheKey = `api_cache_${endpoint}`;
        const cacheData = {
            data,
            timestamp: Date.now(),
            endpoint
        };
        localStorage.setItem(cacheKey, JSON.stringify(cacheData));
    }
    
    // 获取缓存的响应
    getCachedResponse(endpoint) {
        const cacheKey = `api_cache_${endpoint}`;
        const cachedData = localStorage.getItem(cacheKey);
        
        if (cachedData) {
            try {
                const { data, timestamp } = JSON.parse(cachedData);
                // 缓存有效期1小时
                if (Date.now() - timestamp < 3600000) {
                    console.log('📦 使用缓存数据:', endpoint);
                    return data;
                }
            } catch (error) {
                console.warn('缓存数据解析失败:', error);
            }
        }
        return null;
    }
    
    // 处理离线请求
    handleOfflineRequest(endpoint, config) {
        // GET请求尝试从缓存获取
        if (!config.method || config.method === 'GET') {
            const cachedData = this.getCachedResponse(endpoint);
            if (cachedData) {
                return Promise.resolve(cachedData);
            }
            return Promise.resolve(this.getMockData(endpoint));
        }
        
        // 其他请求加入队列
        this.requestQueue.push({ endpoint, config, timestamp: Date.now() });
        return Promise.reject(new Error('离线模式：请求已加入队列，等待网络恢复'));
    }
    
    // 处理离线队列
    async processOfflineQueue() {
        while (this.requestQueue.length > 0) {
            const { endpoint, config } = this.requestQueue.shift();
            try {
                await this.request(endpoint, config);
                console.log('✅ 离线请求处理成功:', endpoint);
            } catch (error) {
                console.error('❌ 离线请求处理失败:', endpoint, error);
            }
        }
    }
    
    // 获取模拟数据（开发和离线模式）
    getMockData(endpoint) {
        const mockData = {
            '/api/restaurants': this.getMockRestaurants(),
            '/api/user/profile': this.getMockUserProfile(),
            '/api/bookings': this.getMockBookings(),
            '/api/favorites': this.getMockFavorites()
        };
        
        const baseEndpoint = endpoint.split('?')[0];
        return mockData[baseEndpoint] || { error: 'No mock data available' };
    }
    
    // 模拟餐厅数据
    getMockRestaurants() {
        return [
            {
                id: 'rest_001',
                name: 'The CN Tower Restaurant',
                nameF: 'Restaurant de la Tour CN',
                cuisine: 'Canadian Fine Dining',
                cuisineF: 'Grande Cuisine Canadienne',
                rating: 4.8,
                reviewCount: 2847,
                priceRange: '$$$',
                image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop',
                location: { lat: 43.6426, lon: -79.3871 },
                winterFriendly: true,
                features: ['heated_patio', 'panoramic_view', 'valet_parking'],
                avgBookingTime: 35,
                isPromoted: true,
                openingHours: {
                    monday: { open: '11:00', close: '22:00' },
                    tuesday: { open: '11:00', close: '22:00' },
                    wednesday: { open: '11:00', close: '22:00' },
                    thursday: { open: '11:00', close: '23:00' },
                    friday: { open: '11:00', close: '23:00' },
                    saturday: { open: '10:00', close: '23:00' },
                    sunday: { open: '10:00', close: '22:00' }
                }
            },
            {
                id: 'rest_002',
                name: 'Schwartz\\'s Deli',
                nameF: 'Charcuterie Schwartz',
                cuisine: 'Jewish Deli',
                cuisineF: 'Charcuterie Juive',
                rating: 4.6,
                reviewCount: 1923,
                priceRange: '$$',
                image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop',
                location: { lat: 45.5152, lon: -73.5751 },
                winterFriendly: true,
                features: ['takeout', 'historic', 'cash_only'],
                avgBookingTime: 20,
                isPromoted: false,
                specialties: ['smoked_meat', 'montreal_bagels', 'poutine']
            },
            {
                id: 'rest_003',
                name: 'Fogo de Chão',
                nameF: 'Fogo de Chão',
                cuisine: 'Brazilian Steakhouse',
                cuisineF: 'Steakhouse Brésilien',
                rating: 4.7,
                reviewCount: 3421,
                priceRange: '$$$$',
                image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop',
                location: { lat: 43.6511, lon: -79.3817 },
                winterFriendly: true,
                features: ['all_you_can_eat', 'premium_cuts', 'wine_list'],
                avgBookingTime: 45,
                isPromoted: true
            }
        ];
    }
    
    // 模拟用户数据
    getMockUserProfile() {
        return {
            id: 'user_123',
            firstName: 'John',
            lastName: 'Smith',
            email: 'john.smith@email.com',
            phone: '+1-416-555-0123',
            preferences: {
                cuisine: ['canadian', 'italian', 'asian'],
                dietary: ['vegetarian_options'],
                seating: ['window_view', 'quiet_area']
            },
            memberSince: '2023-01-15',
            totalBookings: 27,
            favoriteRestaurants: ['rest_001', 'rest_003'],
            tier: 'gold' // bronze, silver, gold, platinum
        };
    }
    
    // 模拟预订数据
    getMockBookings() {
        return [
            {
                id: 'booking_001',
                restaurantId: 'rest_001',
                restaurantName: 'The CN Tower Restaurant',
                date: '2024-01-25',
                time: '19:00',
                partySize: 4,
                status: 'confirmed',
                tableId: 'W1',
                createdAt: '2024-01-20T10:30:00Z'
            },
            {
                id: 'booking_002',
                restaurantId: 'rest_002',
                restaurantName: 'Schwartz\\'s Deli',
                date: '2024-01-22',
                time: '12:30',
                partySize: 2,
                status: 'completed',
                tableId: 'C3',
                createdAt: '2024-01-18T15:45:00Z'
            }
        ];
    }
    
    // 模拟收藏数据
    getMockFavorites() {
        return ['rest_001', 'rest_003'];
    }
    
    // 具体API方法
    
    // 获取餐厅列表
    async getRestaurants(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const endpoint = `/api/restaurants${queryString ? '?' + queryString : ''}`;
        return this.request(endpoint);
    }
    
    // 获取单个餐厅详情
    async getRestaurant(restaurantId) {
        return this.request(`/api/restaurants/${restaurantId}`);
    }
    
    // 搜索餐厅
    async searchRestaurants(query, filters = {}) {
        const params = { q: query, ...filters };
        return this.getRestaurants(params);
    }
    
    // 创建预订
    async createBooking(bookingData) {
        return this.request('/api/bookings', {
            method: 'POST',
            body: JSON.stringify(bookingData)
        });
    }
    
    // 获取用户预订
    async getUserBookings() {
        return this.request('/api/user/bookings');
    }
    
    // 取消预订
    async cancelBooking(bookingId, reason = '') {
        return this.request(`/api/bookings/${bookingId}/cancel`, {
            method: 'POST',
            body: JSON.stringify({ reason })
        });
    }
    
    // 修改预订
    async updateBooking(bookingId, updateData) {
        return this.request(`/api/bookings/${bookingId}`, {
            method: 'PUT',
            body: JSON.stringify(updateData)
        });
    }
    
    // 用户认证
    async login(email, password) {
        const response = await this.request('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
        
        if (response.token) {
            this.authToken = response.token;
            localStorage.setItem('mapletable_auth_token', response.token);
        }
        
        return response;
    }
    
    // 用户注册
    async register(userData) {
        return this.request('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    }
    
    // 获取用户资料
    async getUserProfile() {
        return this.request('/api/user/profile');
    }
    
    // 更新用户资料
    async updateUserProfile(profileData) {
        return this.request('/api/user/profile', {
            method: 'PUT',
            body: JSON.stringify(profileData)
        });
    }
    
    // 获取收藏列表
    async getFavorites() {
        return this.request('/api/user/favorites');
    }
    
    // 添加收藏
    async addFavorite(restaurantId) {
        return this.request('/api/user/favorites', {
            method: 'POST',
            body: JSON.stringify({ restaurantId })
        });
    }
    
    // 移除收藏
    async removeFavorite(restaurantId) {
        return this.request(`/api/user/favorites/${restaurantId}`, {
            method: 'DELETE'
        });
    }
    
    // 获取推荐餐厅
    async getRecommendations(location = null) {
        const params = location ? { lat: location.lat, lon: location.lon } : {};
        return this.getRestaurants({ ...params, recommended: true });
    }
    
    // 提交评价
    async submitReview(restaurantId, reviewData) {
        return this.request(`/api/restaurants/${restaurantId}/reviews`, {
            method: 'POST',
            body: JSON.stringify(reviewData)
        });
    }
    
    // 获取可用时间段
    async getAvailableSlots(restaurantId, date, partySize) {
        return this.request(`/api/restaurants/${restaurantId}/availability`, {
            method: 'POST',
            body: JSON.stringify({ date, partySize })
        });
    }
    
    // 检查桌位实时状态
    async getTableStatus(restaurantId) {
        return this.request(`/api/restaurants/${restaurantId}/tables/status`);
    }
    
    // 发送推送通知token
    async registerPushToken(token, platform) {
        return this.request('/api/notifications/register', {
            method: 'POST',
            body: JSON.stringify({ token, platform })
        });
    }
    
    // 获取地理位置相关数据
    async getCityRestaurants(city, province = null) {
        const params = { city };
        if (province) params.province = province;
        return this.getRestaurants(params);
    }
    
    // 商家API方法
    
    // 商家登录
    async merchantLogin(credentials) {
        const response = await this.request('/api/merchant/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials)
        });
        
        if (response.token) {
            this.authToken = response.token;
            localStorage.setItem('mapletable_merchant_token', response.token);
        }
        
        return response;
    }
    
    // 获取商家预订
    async getMerchantBookings(restaurantId, date = null) {
        const params = date ? { date } : {};
        const queryString = new URLSearchParams(params).toString();
        const endpoint = `/api/merchant/restaurants/${restaurantId}/bookings${queryString ? '?' + queryString : ''}`;
        return this.request(endpoint);
    }
    
    // 更新预订状态
    async updateBookingStatus(bookingId, status) {
        return this.request(`/api/merchant/bookings/${bookingId}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status })
        });
    }
    
    // 设置营业时间
    async updateBusinessHours(restaurantId, hours) {
        return this.request(`/api/merchant/restaurants/${restaurantId}/hours`, {
            method: 'PUT',
            body: JSON.stringify(hours)
        });
    }
    
    // 更新桌位布局
    async updateTableLayout(restaurantId, layout) {
        return this.request(`/api/merchant/restaurants/${restaurantId}/layout`, {
            method: 'PUT',
            body: JSON.stringify(layout)
        });
    }
}

// 创建全局API服务实例
const apiService = new APIService();

// 导出API服务
if (typeof module !== 'undefined' && module.exports) {
    module.exports = APIService;
} else if (typeof window !== 'undefined') {
    window.APIService = APIService;
    window.apiService = apiService;
}

console.log('🔗 MapleTable API Service initialized');