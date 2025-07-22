// MapleTable - Canadian Restaurant App
// 🍁 Built for Canada's diverse culinary landscape

class MapleTableApp {
    constructor() {
        this.currentLanguage = 'en';
        this.currentCity = 'toronto';
        this.restaurants = [];
        this.favorites = new Set();
        this.filters = {
            cuisine: 'all',
            priceRange: 'all',
            rating: 0,
            features: []
        };
        
        this.translations = {
            en: {
                'Discover Canada\'s Best Restaurants': 'Discover Canada\'s Best Restaurants',
                'Discover Canada\'s Culinary Diversity': 'Discover Canada\'s Culinary Diversity',
                'Featured This Week': 'Featured This Week',
                'Winter Menu': 'Winter Menu',
                'Canadian Cuisine': 'Canadian Cuisine',
                'Nearby Restaurants': 'Nearby Restaurants',
                'Search restaurants, cuisine, location...': 'Search restaurants, cuisine, location...',
                'All': 'All',
                'Canadian': 'Canadian',
                'Poutine': 'Poutine',
                'Maple': 'Maple',
                'Winter Warm': 'Winter Warm',
                'Halal': 'Halal',
                'Home': 'Home',
                'Search': 'Search',
                'Bookings': 'Bookings',
                'Favorites': 'Favorites',
                'Profile': 'Profile',
                'Load More': 'Load More',
                'Filters': 'Filters',
                'Canadian Classics': 'Canadian Classics',
                'Québécois': 'Québécois',
                'Maritime': 'Maritime',
                'Prairie BBQ': 'Prairie BBQ',
                'Indigenous': 'Indigenous',
                'Multicultural': 'Multicultural'
            },
            fr: {
                'Discover Canada\'s Best Restaurants': 'Découvrez les Meilleurs Restaurants du Canada',
                'Discover Canada\'s Culinary Diversity': 'Découvrez la Diversité Culinaire du Canada',
                'Featured This Week': 'À la Une Cette Semaine',
                'Winter Menu': 'Menu d\'Hiver',
                'Canadian Cuisine': 'Cuisine Canadienne',
                'Nearby Restaurants': 'Restaurants à Proximité',
                'Search restaurants, cuisine, location...': 'Rechercher restaurants, cuisine, lieu...',
                'All': 'Tous',
                'Canadian': 'Canadien',
                'Poutine': 'Poutine',
                'Maple': 'Érable',
                'Winter Warm': 'Chaud d\'Hiver',
                'Halal': 'Halal',
                'Home': 'Accueil',
                'Search': 'Recherche',
                'Bookings': 'Réservations',
                'Favorites': 'Favoris',
                'Profile': 'Profil',
                'Load More': 'Charger Plus',
                'Filters': 'Filtres',
                'Canadian Classics': 'Classiques Canadiens',
                'Québécois': 'Québécois',
                'Maritime': 'Maritime',
                'Prairie BBQ': 'BBQ des Prairies',
                'Indigenous': 'Autochtone',
                'Multicultural': 'Multiculturel'
            }
        };
        
        this.initializeApp();
    }
    
    initializeApp() {
        this.loadCanadianRestaurants();
        this.setupEventListeners();
        this.updateWeather();
        
        // 隐藏启动屏幕，显示主应用
        setTimeout(() => {
            document.getElementById('splashScreen').style.display = 'none';
            document.getElementById('mainApp').style.display = 'block';
            this.renderRestaurants();
        }, 2500);
    }
    
    // 加载真实的加拿大餐厅数据
    loadCanadianRestaurants() {
        this.restaurants = [
            // Toronto Restaurants
            {
                id: 1,
                name: 'The CN Tower Restaurant',
                nameF: 'Restaurant de la Tour CN',
                cuisine: 'Canadian Fine Dining',
                cuisineF: 'Grande Cuisine Canadienne',
                city: 'toronto',
                rating: 4.8,
                reviewCount: 2847,
                priceRange: 'CAD $80-120',
                image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop',
                features: ['Heated Patio', 'City Views', 'Wheelchair Accessible', 'Valet Parking'],
                featuresF: ['Terrasse Chauffée', 'Vue sur la Ville', 'Accessible Fauteuil Roulant', 'Voiturier'],
                badges: ['Fine Dining', 'Iconic'],
                badgesF: ['Grande Cuisine', 'Iconique'],
                cuisine_type: 'canadian-classics',
                description: 'Revolving restaurant atop Toronto\'s iconic CN Tower with panoramic city views and premium Canadian cuisine featuring local ingredients.',
                descriptionF: 'Restaurant tournant au sommet de la Tour CN iconique de Toronto avec vue panoramique sur la ville et cuisine canadienne haut de gamme mettant en vedette des ingrédients locaux.',
                address: '290 Bremner Blvd, Toronto, ON M5V 3L9',
                phone: '(416) 362-5411',
                winterFeatures: ['Heated Interior', 'Hot Maple Cider', 'Winter Tasting Menu'],
                winterFeaturesF: ['Intérieur Chauffé', 'Cidre d\'Érable Chaud', 'Menu Dégustation d\'Hiver']
            },
            {
                id: 2,
                name: 'Poutinerie Au Pied de Cochon',
                nameF: 'Poutinerie Au Pied de Cochon',
                cuisine: 'Québécois Comfort Food',
                cuisineF: 'Cuisine Réconfortante Québécoise',
                city: 'toronto',
                rating: 4.6,
                reviewCount: 1523,
                priceRange: 'CAD $15-30',
                image: 'https://images.unsplash.com/photo-1630409346828-a22b0ba8b5bb?w=400&h=300&fit=crop',
                features: ['Authentic Poutine', 'Maple Syrup Dishes', 'Cozy Interior', 'Late Night'],
                featuresF: ['Poutine Authentique', 'Plats au Sirop d\'Érable', 'Intérieur Chaleureux', 'Tard le Soir'],
                badges: ['Local Favorite', 'Authentic'],
                badgesF: ['Favori Local', 'Authentique'],
                cuisine_type: 'quebec-french',
                description: 'Authentic Québécois poutinerie serving traditional curds and gravy with creative toppings, plus maple syrup desserts.',
                descriptionF: 'Poutinerie québécoise authentique servant fromage en grains et sauce traditionnels avec garnitures créatives, plus desserts au sirop d\'érable.',
                address: '382 Queen Street West, Toronto, ON M5V 2A7',
                phone: '(416) 977-0998',
                winterFeatures: ['Hearty Portions', 'Hot Comfort Food', 'Warm Atmosphere'],
                winterFeaturesF: ['Portions Généreuses', 'Nourriture Réconfortante Chaude', 'Atmosphère Chaleureuse']
            },
            {
                id: 3,
                name: 'The Keg Mansion',
                nameF: 'Le Manoir Keg',
                cuisine: 'Canadian Steakhouse',
                cuisineF: 'Steakhouse Canadien',
                city: 'toronto',
                rating: 4.7,
                reviewCount: 3256,
                priceRange: 'CAD $50-85',
                image: 'https://images.unsplash.com/photo-1558618644-fcd25c85cd64?w=400&h=300&fit=crop',
                features: ['Alberta Beef', 'Historic Building', 'Full Bar', 'Private Dining'],
                featuresF: ['Bœuf d\'Alberta', 'Bâtiment Historique', 'Bar Complet', 'Salle Privée'],
                badges: ['Premium Steaks', 'Historic'],
                badgesF: ['Steaks Haut de Gamme', 'Historique'],
                cuisine_type: 'prairie',
                description: 'Upscale steakhouse in historic mansion featuring premium Alberta beef, fresh seafood, and extensive Canadian wine list.',
                descriptionF: 'Steakhouse haut de gamme dans un manoir historique proposant du bœuf d\'Alberta haut de gamme, des fruits de mer frais et une vaste carte de vins canadiens.',
                address: '515 Jarvis Street, Toronto, ON M4Y 2H9',
                phone: '(416) 964-6609',
                winterFeatures: ['Fireplace Dining', 'Rich Winter Menu', 'Warm Service'],
                winterFeaturesF: ['Dîner au Coin du Feu', 'Menu d\'Hiver Riche', 'Service Chaleureux']
            },
            
            // Vancouver Restaurants
            {
                id: 4,
                name: 'Granville Island Public Market',
                nameF: 'Marché Public de Granville Island',
                cuisine: 'West Coast Fresh Market',
                cuisineF: 'Marché Frais de la Côte Ouest',
                city: 'vancouver',
                rating: 4.5,
                reviewCount: 8945,
                priceRange: 'CAD $8-25',
                image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop',
                features: ['Fresh Seafood', 'Local Produce', 'Artisan Foods', 'Waterfront Views'],
                featuresF: ['Fruits de Mer Frais', 'Produits Locaux', 'Aliments Artisanaux', 'Vue sur l\'Eau'],
                badges: ['Fresh Market', 'Local'],
                badgesF: ['Marché Frais', 'Local'],
                cuisine_type: 'maritime',
                description: 'Iconic public market featuring fresh BC seafood, local produce, artisan breads, and specialty foods from over 50 vendors.',
                descriptionF: 'Marché public iconique proposant fruits de mer frais de la CB, produits locaux, pains artisanaux et aliments spécialisés de plus de 50 vendeurs.',
                address: '1669 Johnston St, Vancouver, BC V6H 3R9',
                phone: '(604) 666-5784',
                winterFeatures: ['Indoor Market', 'Hot Soups', 'Fresh Oysters'],
                winterFeaturesF: ['Marché Intérieur', 'Soupes Chaudes', 'Huîtres Fraîches']
            },
            {
                id: 5,
                name: 'Salmon n\' Bannock',
                nameF: 'Saumon et Bannique',
                cuisine: 'Indigenous Canadian',
                cuisineF: 'Autochtone Canadien',
                city: 'vancouver',
                rating: 4.9,
                reviewCount: 756,
                priceRange: 'CAD $35-65',
                image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
                features: ['Wild Game', 'Traditional Bannock', 'Indigenous Ingredients', 'Cultural Experience'],
                featuresF: ['Gibier', 'Bannique Traditionnelle', 'Ingrédients Autochtones', 'Expérience Culturelle'],
                badges: ['Indigenous', 'Cultural'],
                badgesF: ['Autochtone', 'Culturel'],
                cuisine_type: 'indigenous',
                description: 'First Nations restaurant showcasing traditional Indigenous cuisine with modern techniques, featuring wild game, seafood, and foraged ingredients.',
                descriptionF: 'Restaurant des Premières Nations présentant la cuisine autochtone traditionnelle avec des techniques modernes, mettant en vedette gibier, fruits de mer et ingrédients de cueillette.',
                address: '1128 W Broadway, Vancouver, BC V6H 1G5',
                phone: '(604) 568-8971',
                winterFeatures: ['Hearty Stews', 'Traditional Teas', 'Warm Atmosphere'],
                winterFeaturesF: ['Ragoûts Copieux', 'Thés Traditionnels', 'Atmosphère Chaleureuse']
            },
            
            // Montreal Restaurants
            {
                id: 6,
                name: 'Schwartz\'s Hebrew Delicatessen',
                nameF: 'Charcuterie Hébraïque Schwartz\'s',
                cuisine: 'Montreal Deli',
                cuisineF: 'Charcuterie de Montréal',
                city: 'montreal',
                rating: 4.4,
                reviewCount: 12847,
                priceRange: 'CAD $15-35',
                image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop',
                features: ['Smoked Meat', 'Historic Deli', 'Cash Only', 'No Reservations'],
                featuresF: ['Viande Fumée', 'Charcuterie Historique', 'Comptant Seulement', 'Pas de Réservations'],
                badges: ['Historic', 'Famous'],
                badgesF: ['Historique', 'Célèbre'],
                cuisine_type: 'quebec-french',
                description: 'Legendary Montreal institution since 1928, famous for hand-sliced smoked meat sandwiches and traditional Jewish deli fare.',
                descriptionF: 'Institution légendaire de Montréal depuis 1928, célèbre pour ses sandwichs de viande fumée tranchée à la main et sa cuisine de charcuterie juive traditionnelle.',
                address: '3895 Saint-Laurent Blvd, Montreal, QC H2W 1X9',
                phone: '(514) 842-4813',
                winterFeatures: ['Hot Smoked Meat', 'Warm Interior', 'Comfort Food'],
                winterFeaturesF: ['Viande Fumée Chaude', 'Intérieur Chaleureux', 'Nourriture Réconfortante']
            },
            {
                id: 7,
                name: 'Au Pied de Cochon',
                nameF: 'Au Pied de Cochon',
                cuisine: 'Quebecois Fine Dining',
                cuisineF: 'Grande Cuisine Québécoise',
                city: 'montreal',
                rating: 4.7,
                reviewCount: 2156,
                priceRange: 'CAD $65-95',
                image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&h=300&fit=crop',
                features: ['Foie Gras', 'Duck Poutine', 'Maple Syrup', 'Rich Cuisine'],
                featuresF: ['Foie Gras', 'Poutine au Canard', 'Sirop d\'Érable', 'Cuisine Riche'],
                badges: ['Celebrity Chef', 'Indulgent'],
                badgesF: ['Chef Célèbre', 'Gourmand'],
                cuisine_type: 'quebec-french',
                description: 'Martin Picard\'s famous restaurant featuring indulgent Quebecois cuisine with foie gras, duck fat, and creative poutine variations.',
                descriptionF: 'Restaurant célèbre de Martin Picard proposant une cuisine québécoise gourmande avec foie gras, gras de canard et variations créatives de poutine.',
                address: '536 Avenue Duluth E, Montreal, QC H2L 1A9',
                phone: '(514) 281-1114',
                winterFeatures: ['Rich Winter Menu', 'Comfort Food', 'Warm Ambiance'],
                winterFeaturesF: ['Menu d\'Hiver Riche', 'Nourriture Réconfortante', 'Ambiance Chaleureuse']
            },
            
            // Calgary Restaurants
            {
                id: 8,
                name: 'Caesar\'s Steakhouse',
                nameF: 'Steakhouse Caesar\'s',
                cuisine: 'Alberta Steakhouse',
                cuisineF: 'Steakhouse de l\'Alberta',
                city: 'calgary',
                rating: 4.6,
                reviewCount: 1845,
                priceRange: 'CAD $60-110',
                image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop',
                features: ['AAA Alberta Beef', 'Caesar Cocktails', 'Western Atmosphere', 'Live Music'],
                featuresF: ['Bœuf AAA de l\'Alberta', 'Cocktails César', 'Atmosphère Western', 'Musique Live'],
                badges: ['Premium Beef', 'Western'],
                badgesF: ['Bœuf Haut de Gamme', 'Western'],
                cuisine_type: 'prairie',
                description: 'Classic Alberta steakhouse specializing in AAA Alberta beef, famous Caesar cocktails, and authentic western Canadian hospitality.',
                descriptionF: 'Steakhouse classique de l\'Alberta spécialisé dans le bœuf AAA de l\'Alberta, les célèbres cocktails César et l\'hospitalité authentique de l\'ouest canadien.',
                address: '512 4th Ave SW, Calgary, AB T2P 0J9',
                phone: '(403) 264-1222',
                winterFeatures: ['Hearty Steaks', 'Warm Interior', 'Comfort Classics'],
                winterFeaturesF: ['Steaks Copieux', 'Intérieur Chaleureux', 'Classiques Réconfortants']
            },
            
            // Halifax Restaurants
            {
                id: 9,
                name: 'The Bicycle Thief',
                nameF: 'Le Voleur de Bicyclette',
                cuisine: 'Maritime Italian',
                cuisineF: 'Italien Maritime',
                city: 'halifax',
                rating: 4.8,
                reviewCount: 967,
                priceRange: 'CAD $40-75',
                image: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&h=300&fit=crop',
                features: ['Waterfront Dining', 'Fresh Seafood', 'Italian-Canadian Fusion', 'Patio Dining'],
                featuresF: ['Dîner au Bord de l\'Eau', 'Fruits de Mer Frais', 'Fusion Italo-Canadienne', 'Terrasse'],
                badges: ['Waterfront', 'Fusion'],
                badgesF: ['Bord de l\'Eau', 'Fusion'],
                cuisine_type: 'maritime',
                description: 'Waterfront restaurant combining Italian cuisine with fresh Maritime seafood, featuring lobster pasta and Atlantic scallops.',
                descriptionF: 'Restaurant au bord de l\'eau combinant cuisine italienne et fruits de mer frais des Maritimes, proposant pâtes au homard et pétoncles de l\'Atlantique.',
                address: '1475 Lower Water St, Halifax, NS B3J 3Z2',
                phone: '(902) 425-7993',
                winterFeatures: ['Indoor Dining', 'Hearty Pasta', 'Warm Service'],
                winterFeaturesF: ['Dîner Intérieur', 'Pâtes Copieuses', 'Service Chaleureux']
            },
            
            // Multicultural Restaurants
            {
                id: 10,
                name: 'Little India Restaurant',
                nameF: 'Restaurant Little India',
                cuisine: 'Indian-Canadian',
                cuisineF: 'Indo-Canadien',
                city: 'toronto',
                rating: 4.5,
                reviewCount: 2341,
                priceRange: 'CAD $20-40',
                image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop',
                features: ['Halal Options', 'Vegetarian Friendly', 'Spice Levels', 'Family Style'],
                featuresF: ['Options Halal', 'Végétarien Friendly', 'Niveaux d\'Épices', 'Style Familial'],
                badges: ['Halal', 'Authentic'],
                badgesF: ['Halal', 'Authentique'],
                cuisine_type: 'multicultural',
                description: 'Authentic Indian cuisine adapted for Canadian tastes, featuring traditional curries, tandoor specialties, and vegetarian options.',
                descriptionF: 'Cuisine indienne authentique adaptée aux goûts canadiens, proposant currys traditionnels, spécialités tandoor et options végétariennes.',
                address: '1334 Gerrard Street E, Toronto, ON M4L 1Y7',
                phone: '(416) 461-3472',
                winterFeatures: ['Spicy Warmth', 'Hot Curries', 'Comfort Spices'],
                winterFeaturesF: ['Chaleur Épicée', 'Currys Chauds', 'Épices Réconfortantes']
            }
        ];
    }
    
    // 设置事件监听器
    setupEventListeners() {
        // 筛选芯片事件
        document.querySelectorAll('.filter-chip').forEach(chip => {
            chip.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
                e.target.classList.add('active');
                this.filters.cuisine = e.target.dataset.filter;
                this.renderRestaurants();
            });
        });
        
        // 搜索事件
        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
        });
        
        // 底部导航事件
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', () => {
                document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
                item.classList.add('active');
            });
        });
    }
    
    // 语言切换
    toggleLanguage() {
        this.currentLanguage = this.currentLanguage === 'en' ? 'fr' : 'en';
        document.getElementById('currentLang').textContent = this.currentLanguage.toUpperCase();
        this.updateTranslations();
        this.renderRestaurants();
    }
    
    // 更新翻译
    updateTranslations() {
        document.querySelectorAll('[data-en]').forEach(element => {
            const enText = element.getAttribute('data-en');
            const frText = element.getAttribute('data-fr');
            if (this.currentLanguage === 'fr' && frText) {
                if (element.tagName === 'INPUT') {
                    element.placeholder = frText;
                } else {
                    element.textContent = frText;
                }
            } else if (enText) {
                if (element.tagName === 'INPUT') {
                    element.placeholder = enText;
                } else {
                    element.textContent = enText;
                }
            }
        });
        
        // 更新页面标题
        const titleKey = 'Discover Canada\'s Best Restaurants';
        document.title = this.translations[this.currentLanguage][titleKey] || titleKey;
    }
    
    // 城市切换
    changeCity(city) {
        this.currentCity = city;
        this.renderRestaurants();
        this.updateWeather();
    }
    
    // 更新天气信息
    updateWeather() {
        const weatherTemps = {
            'toronto': '-8°C',
            'vancouver': '4°C',
            'montreal': '-12°C',
            'calgary': '-15°C',
            'ottawa': '-10°C',
            'edmonton': '-18°C',
            'winnipeg': '-20°C',
            'quebec': '-14°C',
            'halifax': '2°C'
        };
        
        document.getElementById('weatherTemp').textContent = weatherTemps[this.currentCity] || '-5°C';
    }
    
    // 渲染餐厅列表
    renderRestaurants() {
        const container = document.getElementById('restaurantsList');
        let filteredRestaurants = this.restaurants.filter(restaurant => {
            // 城市筛选
            if (restaurant.city !== this.currentCity) return false;
            
            // 菜系筛选
            if (this.filters.cuisine !== 'all') {
                if (this.filters.cuisine === 'canadian' && !restaurant.cuisine_type.includes('canadian')) return false;
                if (this.filters.cuisine === 'poutine' && !restaurant.features.some(f => f.toLowerCase().includes('poutine'))) return false;
                if (this.filters.cuisine === 'maple' && !restaurant.features.some(f => f.toLowerCase().includes('maple'))) return false;
                if (this.filters.cuisine === 'winter-warm' && !restaurant.winterFeatures) return false;
                if (this.filters.cuisine === 'halal' && !restaurant.features.some(f => f.toLowerCase().includes('halal'))) return false;
            }
            
            return true;
        });
        
        container.innerHTML = '';
        
        filteredRestaurants.forEach(restaurant => {
            const card = this.createRestaurantCard(restaurant);
            container.appendChild(card);
        });
        
        if (filteredRestaurants.length === 0) {
            container.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search" style="font-size: 3rem; color: var(--light-text); margin-bottom: 1rem;"></i>
                    <h3 style="color: var(--medium-text);">${this.currentLanguage === 'fr' ? 'Aucun restaurant trouvé' : 'No restaurants found'}</h3>
                    <p style="color: var(--light-text);">${this.currentLanguage === 'fr' ? 'Essayez de modifier vos filtres de recherche.' : 'Try adjusting your search filters.'}</p>
                </div>
            `;
        }
    }
    
    // 创建餐厅卡片
    createRestaurantCard(restaurant) {
        const card = document.createElement('div');
        card.className = 'restaurant-card';
        card.onclick = () => this.showRestaurantDetails(restaurant.id);
        
        const name = this.currentLanguage === 'fr' && restaurant.nameF ? restaurant.nameF : restaurant.name;
        const cuisine = this.currentLanguage === 'fr' && restaurant.cuisineF ? restaurant.cuisineF : restaurant.cuisine;
        const description = this.currentLanguage === 'fr' && restaurant.descriptionF ? restaurant.descriptionF : restaurant.description;
        const features = this.currentLanguage === 'fr' && restaurant.featuresF ? restaurant.featuresF : restaurant.features;
        const badges = this.currentLanguage === 'fr' && restaurant.badgesF ? restaurant.badgesF : restaurant.badges;
        const winterFeatures = this.currentLanguage === 'fr' && restaurant.winterFeaturesF ? restaurant.winterFeaturesF : restaurant.winterFeatures;
        
        const isFavorite = this.favorites.has(restaurant.id);
        
        card.innerHTML = `
            <div class="restaurant-header">
                <img src="${restaurant.image}" alt="${name}" class="restaurant-image">
                <div class="restaurant-badges">
                    ${badges.map(badge => `<div class="card-badge">${badge}</div>`).join('')}
                    ${winterFeatures ? '<div class="card-badge seasonal"><i class="fas fa-snowflake"></i> Winter Ready</div>' : ''}
                </div>
                <button class="restaurant-favorite ${isFavorite ? 'active' : ''}" onclick="event.stopPropagation(); app.toggleFavorite(${restaurant.id})">
                    <i class="fas fa-heart"></i>
                </button>
            </div>
            <div class="restaurant-content">
                <div class="restaurant-title">
                    <div>
                        <h3 class="restaurant-name">${name}</h3>
                        <p class="restaurant-cuisine">${cuisine}</p>
                    </div>
                    <div class="restaurant-rating">
                        <i class="fas fa-star"></i>
                        ${restaurant.rating}
                    </div>
                </div>
                <div class="restaurant-info">
                    <div class="info-item">
                        <i class="fas fa-dollar-sign"></i>
                        <span>${restaurant.priceRange}</span>
                    </div>
                    <div class="info-item">
                        <i class="fas fa-users"></i>
                        <span>${restaurant.reviewCount} reviews</span>
                    </div>
                    <div class="info-item">
                        <i class="fas fa-phone"></i>
                        <span>${restaurant.phone}</span>
                    </div>
                    <div class="info-item">
                        <i class="fas fa-snowflake"></i>
                        <span>${this.currentLanguage === 'fr' ? 'Prêt pour l\'hiver' : 'Winter Ready'}</span>
                    </div>
                </div>
                <p style="color: var(--medium-text); font-size: var(--font-sm); margin: var(--spacing-md) 0; line-height: 1.5;">
                    ${description.substring(0, 120)}...
                </p>
                <div class="restaurant-features">
                    ${features.slice(0, 3).map(feature => `<span class="feature-tag">${feature}</span>`).join('')}
                    ${winterFeatures ? `<span class="feature-tag winter-feature"><i class="fas fa-snowflake"></i> ${winterFeatures[0]}</span>` : ''}
                </div>
                <div class="restaurant-actions">
                    <button class="btn btn-secondary" onclick="event.stopPropagation(); app.callRestaurant('${restaurant.phone}')">
                        <i class="fas fa-phone"></i> ${this.currentLanguage === 'fr' ? 'Appeler' : 'Call'}
                    </button>
                    <button class="btn btn-primary" onclick="event.stopPropagation(); app.bookRestaurant(${restaurant.id})">
                        <i class="fas fa-calendar-plus"></i> ${this.currentLanguage === 'fr' ? 'Réserver' : 'Book'}
                    </button>
                </div>
            </div>
        `;
        
        return card;
    }
    
    // 显示餐厅详情
    showRestaurantDetails(restaurantId) {
        const restaurant = this.restaurants.find(r => r.id === restaurantId);
        if (!restaurant) return;
        
        const modal = document.getElementById('restaurantModal');
        const content = modal.querySelector('.modal-content');
        
        const name = this.currentLanguage === 'fr' && restaurant.nameF ? restaurant.nameF : restaurant.name;
        const cuisine = this.currentLanguage === 'fr' && restaurant.cuisineF ? restaurant.cuisineF : restaurant.cuisine;
        const description = this.currentLanguage === 'fr' && restaurant.descriptionF ? restaurant.descriptionF : restaurant.description;
        const features = this.currentLanguage === 'fr' && restaurant.featuresF ? restaurant.featuresF : restaurant.features;
        const winterFeatures = this.currentLanguage === 'fr' && restaurant.winterFeaturesF ? restaurant.winterFeaturesF : restaurant.winterFeatures;
        
        content.innerHTML = `
            <div class="modal-header">
                <button class="close-btn" onclick="app.closeModal()">&times;</button>
            </div>
            <div class="restaurant-detail-image">
                <img src="${restaurant.image}" alt="${name}">
            </div>
            <div class="restaurant-detail-content">
                <h2>${name}</h2>
                <p class="cuisine">${cuisine}</p>
                <div class="rating">
                    <i class="fas fa-star"></i>
                    ${restaurant.rating} (${restaurant.reviewCount} ${this.currentLanguage === 'fr' ? 'avis' : 'reviews'})
                </div>
                <p class="description">${description}</p>
                
                <div class="details-section">
                    <h3><i class="fas fa-info-circle"></i> ${this.currentLanguage === 'fr' ? 'Informations' : 'Information'}</h3>
                    <div class="details-grid">
                        <div><strong>${this.currentLanguage === 'fr' ? 'Prix' : 'Price'}:</strong> ${restaurant.priceRange}</div>
                        <div><strong>${this.currentLanguage === 'fr' ? 'Téléphone' : 'Phone'}:</strong> ${restaurant.phone}</div>
                        <div><strong>${this.currentLanguage === 'fr' ? 'Adresse' : 'Address'}:</strong> ${restaurant.address}</div>
                    </div>
                </div>
                
                <div class="details-section">
                    <h3><i class="fas fa-star"></i> ${this.currentLanguage === 'fr' ? 'Caractéristiques' : 'Features'}</h3>
                    <div class="features-list">
                        ${features.map(feature => `<span class="feature-tag">${feature}</span>`).join('')}
                    </div>
                </div>
                
                ${winterFeatures ? `
                    <div class="details-section winter-section">
                        <h3><i class="fas fa-snowflake"></i> ${this.currentLanguage === 'fr' ? 'Spécialités d\'Hiver' : 'Winter Specialties'}</h3>
                        <div class="features-list">
                            ${winterFeatures.map(feature => `<span class="feature-tag winter-feature">${feature}</span>`).join('')}
                        </div>
                    </div>
                ` : ''}
                
                <div class="modal-actions">
                    <button class="btn btn-secondary" onclick="app.callRestaurant('${restaurant.phone}')">
                        <i class="fas fa-phone"></i> ${this.currentLanguage === 'fr' ? 'Appeler' : 'Call'}
                    </button>
                    <button class="btn btn-primary" onclick="app.bookRestaurant(${restaurant.id})">
                        <i class="fas fa-calendar-plus"></i> ${this.currentLanguage === 'fr' ? 'Réserver' : 'Book Now'}
                    </button>
                </div>
            </div>
        `;
        
        modal.classList.add('show');
    }
    
    // 关闭模态框
    closeModal() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('show');
        });
    }
    
    // 切换收藏状态
    toggleFavorite(restaurantId) {
        if (this.favorites.has(restaurantId)) {
            this.favorites.delete(restaurantId);
        } else {
            this.favorites.add(restaurantId);
        }
        
        // 更新UI
        document.querySelectorAll(`.restaurant-favorite`).forEach(btn => {
            if (btn.onclick.toString().includes(`${restaurantId}`)) {
                btn.classList.toggle('active', this.favorites.has(restaurantId));
            }
        });
        
        // 保存到本地存储
        localStorage.setItem('mapleFavorites', JSON.stringify([...this.favorites]));
        
        this.showNotification(
            this.favorites.has(restaurantId) ? 
            (this.currentLanguage === 'fr' ? 'Ajouté aux favoris' : 'Added to favorites') :
            (this.currentLanguage === 'fr' ? 'Retiré des favoris' : 'Removed from favorites')
        );
    }
    
    // 预订餐厅
    bookRestaurant(restaurantId) {
        const restaurant = this.restaurants.find(r => r.id === restaurantId);
        if (!restaurant) return;
        
        const message = this.currentLanguage === 'fr' ? 
            `Réserver une table chez ${restaurant.nameF || restaurant.name}?` :
            `Book a table at ${restaurant.name}?`;
            
        if (confirm(message)) {
            this.showNotification(
                this.currentLanguage === 'fr' ? 
                'Redirection vers la réservation...' : 
                'Redirecting to booking...'
            );
            
            // 在真实应用中，这里会跳转到预订页面
            setTimeout(() => {
                this.showNotification(
                    this.currentLanguage === 'fr' ? 
                    'Fonction de réservation bientôt disponible!' : 
                    'Booking feature coming soon!'
                );
            }, 1500);
        }
    }
    
    // 拨打电话
    callRestaurant(phone) {
        if (confirm(`Call ${phone}?`)) {
            window.location.href = `tel:${phone}`;
        }
    }
    
    // 搜索处理
    handleSearch(query) {
        if (!query || query.length < 2) {
            this.renderRestaurants();
            return;
        }
        
        const filtered = this.restaurants.filter(restaurant => {
            const searchText = `
                ${restaurant.name} 
                ${restaurant.nameF || ''} 
                ${restaurant.cuisine} 
                ${restaurant.cuisineF || ''} 
                ${restaurant.description} 
                ${restaurant.descriptionF || ''}
                ${restaurant.features.join(' ')}
                ${restaurant.featuresF ? restaurant.featuresF.join(' ') : ''}
            `.toLowerCase();
            
            return searchText.includes(query.toLowerCase()) && restaurant.city === this.currentCity;
        });
        
        this.renderFilteredRestaurants(filtered);
    }
    
    // 渲染筛选后的餐厅
    renderFilteredRestaurants(restaurants) {
        const container = document.getElementById('restaurantsList');
        container.innerHTML = '';
        
        restaurants.forEach(restaurant => {
            const card = this.createRestaurantCard(restaurant);
            container.appendChild(card);
        });
        
        if (restaurants.length === 0) {
            container.innerHTML = `
                <div class="no-results" style="text-align: center; padding: 3rem 1rem;">
                    <i class="fas fa-search" style="font-size: 3rem; color: var(--light-text); margin-bottom: 1rem;"></i>
                    <h3 style="color: var(--medium-text);">${this.currentLanguage === 'fr' ? 'Aucun restaurant trouvé' : 'No restaurants found'}</h3>
                    <p style="color: var(--light-text);">${this.currentLanguage === 'fr' ? 'Essayez de modifier vos termes de recherche.' : 'Try adjusting your search terms.'}</p>
                </div>
            `;
        }
    }
    
    // 显示通知
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            left: 50%;
            transform: translateX(-50%);
            background: var(--canadian-red);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 25px;
            box-shadow: var(--shadow);
            z-index: 4000;
            font-weight: 600;
            animation: slideInDown 0.3s ease;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutUp 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    // 语音搜索
    startVoiceSearch() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
            recognition.lang = this.currentLanguage === 'fr' ? 'fr-CA' : 'en-CA';
            recognition.continuous = false;
            recognition.interimResults = false;
            
            recognition.onstart = () => {
                this.showNotification(
                    this.currentLanguage === 'fr' ? 'Écoute en cours...' : 'Listening...'
                );
            };
            
            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                document.getElementById('searchInput').value = transcript;
                this.handleSearch(transcript);
            };
            
            recognition.onerror = () => {
                this.showNotification(
                    this.currentLanguage === 'fr' ? 'Erreur de reconnaissance vocale' : 'Voice recognition error'
                );
            };
            
            recognition.start();
        } else {
            this.showNotification(
                this.currentLanguage === 'fr' ? 'Reconnaissance vocale non supportée' : 'Voice recognition not supported'
            );
        }
    }
    
    // 按分类筛选
    filterByCategory(category) {
        this.filters.cuisine_type = category;
        const filtered = this.restaurants.filter(restaurant => 
            restaurant.cuisine_type === category && restaurant.city === this.currentCity
        );
        this.renderFilteredRestaurants(filtered);
    }
    
    // 加载更多餐厅
    loadMoreRestaurants() {
        this.showNotification(
            this.currentLanguage === 'fr' ? 'Chargement de plus de restaurants...' : 'Loading more restaurants...'
        );
        
        // 模拟加载延迟
        setTimeout(() => {
            this.showNotification(
                this.currentLanguage === 'fr' ? 'Tous les restaurants chargés!' : 'All restaurants loaded!'
            );
        }, 1500);
    }
    
    // 显示天气信息
    showWeather() {
        const weatherInfo = {
            'toronto': { temp: '-8°C', condition: 'Snowy', icon: 'fas fa-snowflake' },
            'vancouver': { temp: '4°C', condition: 'Rainy', icon: 'fas fa-cloud-rain' },
            'montreal': { temp: '-12°C', condition: 'Very Cold', icon: 'fas fa-snowflake' },
            'calgary': { temp: '-15°C', condition: 'Snowy', icon: 'fas fa-snowflake' },
            'halifax': { temp: '2°C', condition: 'Cloudy', icon: 'fas fa-cloud' }
        };
        
        const weather = weatherInfo[this.currentCity];
        const message = this.currentLanguage === 'fr' ? 
            `${weather.temp} - ${weather.condition === 'Snowy' ? 'Neigeux' : weather.condition === 'Rainy' ? 'Pluvieux' : weather.condition === 'Very Cold' ? 'Très Froid' : 'Nuageux'}` :
            `${weather.temp} - ${weather.condition}`;
            
        this.showNotification(`Weather: ${message}`);
    }
}

// 全局函数
function toggleLanguage() {
    app.toggleLanguage();
}

// 商家认证和广告相关函数
function goToMerchantAuth() {
    window.location.href = 'merchant-auth.html';
}

function viewPromotedRestaurant(promotionId) {
    // 记录广告点击
    console.log('Promoted restaurant clicked:', promotionId);
    
    // 模拟跳转到推广餐厅详情
    const promotedRestaurants = {
        'premium-1': {
            id: 'the-keg-steakhouse',
            name: 'The Keg Steakhouse',
            cuisine: 'Premium Canadian Steaks',
            isPromoted: true,
            promotionType: 'premium'
        },
        'standard-1': {
            id: 'cn-tower-360',
            name: 'CN Tower 360 Restaurant',
            cuisine: 'Fine Dining Experience',
            isPromoted: true,
            promotionType: 'standard'
        },
        'standard-2': {
            id: 'schwartz-deli',
            name: 'Schwartz\'s Deli',
            cuisine: 'Authentic Montreal Smoked Meat',
            isPromoted: true,
            promotionType: 'standard'
        }
    };
    
    const restaurant = promotedRestaurants[promotionId];
    if (restaurant) {
        // 这里可以显示餐厅详情或跳转到预订页面
        app.showRestaurantDetails(restaurant);
    }
}

function showWinterGuide() {
    // 显示冬季餐厅指南
    console.log('Winter dining guide requested');
    app.showNotification(
        app.currentLanguage === 'fr' ? 
        'Guide d\'hiver bientôt disponible!' : 
        'Winter guide coming soon!',
        'info'
    );
}

function changeCity(city) {
    app.changeCity(city);
}

function handleSearch() {
    const query = document.getElementById('searchInput').value;
    app.handleSearch(query);
}

function startVoiceSearch() {
    app.startVoiceSearch();
}

function showWeather() {
    app.showWeather();
}

function filterByCategory(category) {
    app.filterByCategory(category);
}

function loadMoreRestaurants() {
    app.loadMoreRestaurants();
}

function showFilters() {
    document.getElementById('filtersPanel').classList.add('show');
}

function closeFilters() {
    document.getElementById('filtersPanel').classList.remove('show');
}

function switchTab(tab) {
    // 底部导航切换逻辑
    console.log(`Switching to ${tab} tab`);
}

// 初始化应用
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new MapleTableApp();
});

// PWA 支持
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}