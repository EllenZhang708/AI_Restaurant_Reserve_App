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
            },
            
            // MapleTable Restaurant - Main Test Restaurant
            {
                id: 'rest_001',
                name: 'The Maple Leaf Restaurant',
                nameF: 'Restaurant Feuille d\'Érable',
                cuisine: 'Canadian Fine Dining',
                cuisineF: 'Grande Cuisine Canadienne',
                city: 'toronto',
                rating: 4.9,
                reviewCount: 1847,
                priceRange: 'CAD $60-95',
                image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop',
                features: ['AI Table Allocation', 'Seasonal Menu', 'Wine Pairing', 'Private Events'],
                featuresF: ['Allocation de Table IA', 'Menu Saisonnier', 'Accord Mets-Vins', 'Événements Privés'],
                badges: ['AI-Powered', 'Locally Sourced', 'Award Winning'],
                badgesF: ['Alimenté par IA', 'Sources Locales', 'Primé'],
                cuisine_type: 'canadian-classics',
                description: 'Experience the future of dining with our AI-powered table allocation system. Enjoy premium Canadian cuisine featuring locally sourced ingredients and expertly crafted seasonal menus.',
                descriptionF: 'Découvrez l\'avenir de la restauration avec notre système d\'allocation de tables alimenté par IA. Savourez une cuisine canadienne haut de gamme mettant en vedette des ingrédients d\'origine locale et des menus saisonniers expertement conçus.',
                address: '123 Maple Street, Toronto, ON M5V 3A8',
                phone: '(416) 555-MAPLE',
                winterFeatures: ['Cozy Fireplace', 'Winter Tasting Menu', 'Hot Maple Toddy', 'AI Smart Seating'],
                winterFeaturesF: ['Foyer Chaleureux', 'Menu Dégustation d\'Hiver', 'Grog à l\'Érable Chaud', 'Places Intelligentes IA']
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
                    <a href="booking.html?restaurant=${restaurant.id}" class="btn btn-primary" onclick="event.stopPropagation(); localStorage.setItem('selectedRestaurant', JSON.stringify({id: '${restaurant.id}', name: '${restaurant.name}', nameF: '${restaurant.nameF || restaurant.name}', cuisine: '${restaurant.cuisine}', cuisineF: '${restaurant.cuisineF || restaurant.cuisine}', rating: ${restaurant.rating}, reviewCount: ${restaurant.reviewCount}, image: '${restaurant.image}', phone: '${restaurant.phone || ''}', address: '${restaurant.address || ''}', features: ${JSON.stringify(restaurant.features || [])}, winterFeatures: ${JSON.stringify(restaurant.winterFeatures || [])}}));console.log('🍁 Stored restaurant data for booking:', JSON.parse(localStorage.getItem('selectedRestaurant')));">
                        <i class="fas fa-calendar-plus"></i> ${this.currentLanguage === 'fr' ? 'Réserver' : 'Book'}
                    </a>
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
                    <a href="booking.html?restaurant=${restaurant.id}" class="btn btn-primary" onclick="localStorage.setItem('selectedRestaurant', JSON.stringify({id: '${restaurant.id}', name: '${restaurant.name}', nameF: '${restaurant.nameF || restaurant.name}', cuisine: '${restaurant.cuisine}', cuisineF: '${restaurant.cuisineF || restaurant.cuisine}', rating: ${restaurant.rating}, reviewCount: ${restaurant.reviewCount}, image: '${restaurant.image}', phone: '${restaurant.phone || ''}', address: '${restaurant.address || ''}', features: ${JSON.stringify(restaurant.features || [])}, winterFeatures: ${JSON.stringify(restaurant.winterFeatures || [])}}));console.log('🍁 Stored restaurant data for booking:', JSON.parse(localStorage.getItem('selectedRestaurant')));">
                        <i class="fas fa-calendar-plus"></i> ${this.currentLanguage === 'fr' ? 'Réserver' : 'Book Now'}
                    </a>
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
        console.log('🔄 bookRestaurant 被调用, ID:', restaurantId, '类型:', typeof restaurantId);
        console.log('📊 当前餐厅数据:', this.restaurants.map(r => ({ id: r.id, name: r.name })));
        
        const restaurant = this.restaurants.find(r => r.id == restaurantId); // 使用 == 而不是 ===
        if (!restaurant) {
            console.error('❗ Restaurant not found:', restaurantId);
            console.error('可用的餐厅 IDs:', this.restaurants.map(r => r.id));
            alert('餐厅不存在，ID: ' + restaurantId);
            return;
        }
        
        console.log('✅ 找到餐厅:', restaurant.name);
        console.log('📝 跳转到预订页面:', restaurant.name);
        
        // 存储选中的餐厅信息到localStorage
        localStorage.setItem('selectedRestaurant', JSON.stringify({
            id: restaurant.id,
            name: restaurant.name,
            nameF: restaurant.nameF,
            cuisine: restaurant.cuisine,
            cuisineF: restaurant.cuisineF,
            rating: restaurant.rating,
            reviewCount: restaurant.reviewCount,
            image: restaurant.image,
            phone: restaurant.phone,
            address: restaurant.address,
            winterFeatures: restaurant.winterFeatures,
            winterFeaturesF: restaurant.winterFeaturesF
        }));
        
        // 直接跳转到预订页面
        window.location.href = `booking.html?restaurant=${restaurantId}`;
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
    window.location.href = 'merchant-login.html';
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
    
    switch(tab) {
        case 'home':
            window.location.href = 'index.html';
            break;
        case 'explore':
            window.location.href = 'explore.html';
            break;
        case 'bookings':
        case 'reservations':
            window.location.href = 'bookings.html';
            break;
        case 'profile':
            window.location.href = 'profile.html';
            break;
        default:
            console.log(`Unknown tab: ${tab}`);
    }
}

// 全局函数用于HTML onclick调用
function quickBook(restaurantId) {
    if (window.app) {
        app.bookRestaurant(restaurantId);
    } else {
        console.error('App not initialized yet');
    }
}

function goToMerchantAuth(action = 'login') {
    if (action === 'login') {
        window.location.href = 'merchant-login.html';
    } else if (action === 'register') {
        window.location.href = 'merchant-register.html';
    } else if (action === 'demo') {
        alert('商家演示功能开发中...');
    } else {
        window.location.href = 'merchant-login.html';
    }
}

function showMerchantOptions() {
    const dropdown = document.getElementById('merchantOptionsDropdown');
    const isVisible = dropdown.classList.contains('show');
    
    // 关闭所有下拉菜单
    closeAllDropdowns();
    
    if (!isVisible) {
        dropdown.classList.add('show');
    }
}

function showUserMenu() {
    console.log('Show user menu');
    // TODO: 实现用户菜单显示
}

function showNotifications() {
    console.log('Show notifications');
    // TODO: 实现通知面板显示
}

function showPricingInfo() {
    alert('商家定价信息：\n\n基础版: $49/月\n专业版: $99/月\n企业版: $199/月\n\n联系我们获取详细信息!');
}

function showMerchantSupport() {
    alert('商家支持：\n\n电话: 1-800-MAPLE-TABLE\n邮箱: merchants@mapletable.ca\n在线客服: 24/7 可用');
}

// 新的UI交互函数
function goToCustomerLogin() {
    console.log('🔄 正在跳转到顾客登录页面...');
    window.location.href = 'customer-login.html';
}

function goToMerchantLogin() {
    console.log('🔄 正在跳转到商家登录页面...');
    window.location.href = 'merchant-login.html';
}

function showCustomerLogin() {
    const dropdown = document.getElementById('customerLoginDropdown');
    const isVisible = dropdown.classList.contains('show');
    
    // 关闭所有下拉菜单
    closeAllDropdowns();
    
    if (!isVisible) {
        dropdown.classList.add('show');
    }
}

function showUserMenu() {
    const dropdown = document.getElementById('userMenuDropdown');
    const isVisible = dropdown.classList.contains('show');
    
    // 关闭所有下拉菜单
    closeAllDropdowns();
    
    if (!isVisible) {
        dropdown.classList.add('show');
    }
}

function showLocationSelector() {
    // 创建位置选择器模态框
    const modal = document.createElement('div');
    modal.className = 'location-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        backdrop-filter: blur(10px);
    `;
    
    const content = document.createElement('div');
    content.style.cssText = `
        background: white;
        border-radius: 20px;
        padding: 24px;
        max-width: 400px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
    `;
    
    content.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h3 style="margin: 0; color: var(--dark-text);">选择位置 / Choose Location</h3>
            <button onclick="closeLocationModal()" style="background: #f1f5f9; border: none; border-radius: 50%; width: 32px; height: 32px; cursor: pointer;">
                <i class="fas fa-times"></i>
            </button>
        </div>
        
        <button onclick="getCurrentLocation()" style="
            width: 100%;
            background: linear-gradient(45deg, var(--canadian-red), #dc2626);
            color: white;
            border: none;
            border-radius: 12px;
            padding: 12px 16px;
            font-weight: 600;
            cursor: pointer;
            margin-bottom: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        ">
            <i class="fas fa-location-arrow"></i>
            使用当前位置 / Use Current Location
        </button>
        
        <div style="margin-bottom: 16px;">
            <h4 style="margin: 0 0 12px 0; color: var(--medium-text); font-size: 0.9rem;">热门城市 / Popular Cities</h4>
            <div class="cities-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                ${getCitiesHTML()}
            </div>
        </div>
    `;
    
    modal.appendChild(content);
    document.body.appendChild(modal);
    
    // 点击背景关闭
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeLocationModal();
        }
    });
}

function getCitiesHTML() {
    const cities = [
        { value: 'toronto', name: 'Toronto, ON', nameF: 'Toronto, ON' },
        { value: 'vancouver', name: 'Vancouver, BC', nameF: 'Vancouver, BC' },
        { value: 'montreal', name: 'Montréal, QC', nameF: 'Montréal, QC' },
        { value: 'calgary', name: 'Calgary, AB', nameF: 'Calgary, AB' },
        { value: 'ottawa', name: 'Ottawa, ON', nameF: 'Ottawa, ON' },
        { value: 'edmonton', name: 'Edmonton, AB', nameF: 'Edmonton, AB' },
        { value: 'winnipeg', name: 'Winnipeg, MB', nameF: 'Winnipeg, MB' },
        { value: 'quebec', name: 'Québec City, QC', nameF: 'Ville de Québec, QC' },
        { value: 'halifax', name: 'Halifax, NS', nameF: 'Halifax, NS' }
    ];
    
    return cities.map(city => `
        <button onclick="selectCity('${city.value}', '${city.name}')" style="
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 12px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
            text-align: left;
        " onmouseover="this.style.borderColor='var(--canadian-red)'; this.style.background='rgba(255,0,0,0.05)'" 
           onmouseout="this.style.borderColor='#e2e8f0'; this.style.background='white'">
            ${city.name}
        </button>
    `).join('');
}

// 地理定位功能
function getCurrentLocation() {
    if (!navigator.geolocation) {
        alert('您的浏览器不支持地理定位功能 / Geolocation is not supported by your browser');
        return;
    }
    
    // 显示加载状态
    const button = event.target;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 正在定位... / Locating...';
    button.disabled = true;
    
    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const { latitude, longitude } = position.coords;
            console.log('用户位置:', latitude, longitude);
            
            try {
                // 使用反向地理编码获取城市信息
                const cityName = await reverseGeocode(latitude, longitude);
                document.getElementById('currentLocation').textContent = cityName;
                
                if (app) {
                    app.currentCity = cityName.toLowerCase().split(',')[0];
                    app.loadRestaurants();
                }
                
                closeLocationModal();
                showNotification(`位置已更新为: ${cityName} / Location updated to: ${cityName}`);
                
            } catch (error) {
                console.error('反向地理编码失败:', error);
                alert('无法获取位置信息，请手动选择城市 / Unable to get location info, please select city manually');
            }
            
            button.innerHTML = '<i class="fas fa-location-arrow"></i> 使用当前位置 / Use Current Location';
            button.disabled = false;
        },
        (error) => {
            console.error('地理定位失败:', error);
            let message = '定位失败 / Location failed: ';
            
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    message += '用户拒绝了定位请求 / User denied location request';
                    break;
                case error.POSITION_UNAVAILABLE:
                    message += '位置信息不可用 / Location unavailable';
                    break;
                case error.TIMEOUT:
                    message += '定位请求超时 / Location request timeout';
                    break;
                default:
                    message += '未知错误 / Unknown error';
                    break;
            }
            
            alert(message);
            button.innerHTML = '<i class="fas fa-location-arrow"></i> 使用当前位置 / Use Current Location';
            button.disabled = false;
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000
        }
    );
}

// 反向地理编码 - 将坐标转换为城市名称
async function reverseGeocode(latitude, longitude) {
    // 使用加拿大城市数据库进行匹配
    const canadianCities = [
        { name: 'Toronto, ON', lat: 43.6532, lon: -79.3832, radius: 50 },
        { name: 'Vancouver, BC', lat: 49.2827, lon: -123.1207, radius: 50 },
        { name: 'Montréal, QC', lat: 45.5017, lon: -73.5673, radius: 50 },
        { name: 'Calgary, AB', lat: 51.0447, lon: -114.0719, radius: 50 },
        { name: 'Ottawa, ON', lat: 45.4215, lon: -75.6972, radius: 50 },
        { name: 'Edmonton, AB', lat: 53.5461, lon: -113.4938, radius: 50 },
        { name: 'Winnipeg, MB', lat: 49.8951, lon: -97.1384, radius: 50 },
        { name: 'Québec City, QC', lat: 46.8139, lon: -71.2080, radius: 50 },
        { name: 'Halifax, NS', lat: 44.6488, lon: -63.5752, radius: 50 }
    ];
    
    // 计算距离并找到最近的城市
    let nearestCity = null;
    let minDistance = Infinity;
    
    canadianCities.forEach(city => {
        const distance = calculateDistance(latitude, longitude, city.lat, city.lon);
        if (distance < city.radius && distance < minDistance) {
            minDistance = distance;
            nearestCity = city;
        }
    });
    
    return nearestCity ? nearestCity.name : 'Toronto, ON'; // 默认Toronto
}

// 计算两点间距离（公里）
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // 地球半径（公里）
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

// 选择城市
function selectCity(cityValue, cityName) {
    document.getElementById('currentLocation').textContent = cityName;
    if (app) {
        app.changeCity(cityValue);
    }
    closeLocationModal();
    showNotification(`城市已切换到: ${cityName} / City switched to: ${cityName}`);
}

// 关闭位置选择模态框
function closeLocationModal() {
    const modal = document.querySelector('.location-modal');
    if (modal) {
        document.body.removeChild(modal);
    }
}

// 显示通知
function showNotification(message) {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--canadian-red);
        color: white;
        padding: 12px 20px;
        border-radius: 12px;
        font-weight: 600;
        z-index: 10001;
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
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

function showCustomerAuth(type) {
    closeAllDropdowns();
    
    if (type === 'login') {
        window.location.href = 'customer-login.html';
    } else if (type === 'register') {
        window.location.href = 'customer-register.html';
    }
}

function continueAsGuest() {
    closeAllDropdowns();
    alert('继续作为访客浏览 MapleTable');
}

function loginWithGoogle() {
    closeAllDropdowns();
    alert('Google 登录功能开发中...');
}

function loginWithFacebook() {
    closeAllDropdowns();
    alert('Facebook 登录功能开发中...');
}

function loginUser(userData) {
    // 更新UI以显示已登录状态
    document.getElementById('customerLoginBtn').style.display = 'none';
    document.getElementById('userProfileSection').style.display = 'block';
    document.getElementById('userName').textContent = userData.name.split(' ')[0] + ' ' + userData.name.split(' ')[1][0] + '.';
    document.getElementById('userDisplayName').textContent = userData.name;
    document.getElementById('userEmail').textContent = userData.email;
    
    // 更新头像
    const avatars = document.querySelectorAll('.user-avatar, .user-avatar-large');
    avatars.forEach(avatar => {
        avatar.src = userData.avatar;
    });
    
    console.log('用户已登录:', userData);
}

function logout() {
    closeAllDropdowns();
    
    // 恢复未登录状态
    document.getElementById('customerLoginBtn').style.display = 'flex';
    document.getElementById('userProfileSection').style.display = 'none';
    
    alert('您已成功登出');
}

function showFavorites() {
    closeAllDropdowns();
    window.location.href = '#favorites';
    console.log('显示收藏夹');
}

function showReviews() {
    closeAllDropdowns();
    alert('我的评价功能开发中...');
}

function showLoyaltyProgram() {
    closeAllDropdowns();
    alert('会员奖励计划：\n\n当前积分: 1,250\n会员等级: 黄金\n\n可兑换奖励:\n- 免费甜点 (500积分)\n- 10%折扣 (1000积分)\n- 免费主菜 (2000积分)');
}

function showUserSettings() {
    closeAllDropdowns();
    alert('账户设置功能开发中...');
}

function showHelp() {
    closeAllDropdowns();
    alert('帮助与支持：\n\n客服电话: 1-800-MAPLE-TABLE\n邮箱: support@mapletable.ca\n在线客服: 24/7 可用\n\n常见问题解答请访问我们的网站');
}

function quickBook() {
    window.location.href = 'booking.html';
}

function closeAllDropdowns() {
    document.querySelectorAll('.dropdown-menu').forEach(dropdown => {
        dropdown.classList.remove('show');
    });
}

// 点击外部关闭下拉菜单
document.addEventListener('click', (event) => {
    if (!event.target.closest('.dropdown-menu') && 
        !event.target.closest('.action-btn') && 
        !event.target.closest('.user-profile-btn') &&
        !event.target.closest('.location-indicator')) {
        closeAllDropdowns();
    }
});

// 🚀 发散性思维创新功能集合
class InnovativeFeatures {
    constructor() {
        this.features = {
            aiWeatherDining: true,
            socialDining: true,
            voiceBooking: true,
            moodBasedRecommendation: true,
            realTimeGroupBooking: true,
            culturalFoodJourney: true,
            sustainableDining: true,
            vipConciergeAI: true
        };
        this.init();
    }

    init() {
        console.log('🎨 发散性思维创新功能已激活');
        this.initWeatherBasedDining();
        this.initSocialDiningFeatures();
        this.initVoiceBookingSystem();
        this.initMoodRecommendations();
        this.initGroupBookingSystem();
        this.initCulturalJourney();
        this.initSustainableDining();
        this.initVIPConcierge();
    }

    // 1. AI天气智能用餐推荐
    initWeatherBasedDining() {
        const weatherDiningBtn = document.createElement('button');
        weatherDiningBtn.className = 'innovative-feature-btn weather-dining';
        weatherDiningBtn.innerHTML = `
            <i class="fas fa-cloud-sun"></i>
            <span>天气推荐</span>
        `;
        weatherDiningBtn.onclick = () => this.showWeatherBasedRecommendations();
        
        // 添加到主界面
        this.addFeatureButton(weatherDiningBtn);
    }

    // 2. 社交用餐功能
    initSocialDiningFeatures() {
        const socialBtn = document.createElement('button');
        socialBtn.className = 'innovative-feature-btn social-dining';
        socialBtn.innerHTML = `
            <i class="fas fa-users"></i>
            <span>社交用餐</span>
        `;
        socialBtn.onclick = () => this.showSocialDiningOptions();
        
        this.addFeatureButton(socialBtn);
    }

    // 3. 语音预订系统
    initVoiceBookingSystem() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const voiceBtn = document.createElement('button');
            voiceBtn.className = 'innovative-feature-btn voice-booking';
            voiceBtn.innerHTML = `
                <i class="fas fa-microphone"></i>
                <span>语音预订</span>
            `;
            voiceBtn.onclick = () => this.startVoiceBooking();
            
            this.addFeatureButton(voiceBtn);
        }
    }

    // 4. 情绪化推荐系统
    initMoodRecommendations() {
        const moodBtn = document.createElement('button');
        moodBtn.className = 'innovative-feature-btn mood-recommend';
        moodBtn.innerHTML = `
            <i class="fas fa-heart"></i>
            <span>心情推荐</span>
        `;
        moodBtn.onclick = () => this.showMoodBasedRecommendations();
        
        this.addFeatureButton(moodBtn);
    }

    // 5. 实时群组预订
    initGroupBookingSystem() {
        const groupBtn = document.createElement('button');
        groupBtn.className = 'innovative-feature-btn group-booking';
        groupBtn.innerHTML = `
            <i class="fas fa-user-friends"></i>
            <span>群组预订</span>
        `;
        groupBtn.onclick = () => this.showGroupBookingSystem();
        
        this.addFeatureButton(groupBtn);
    }

    // 6. 文化美食之旅
    initCulturalJourney() {
        const cultureBtn = document.createElement('button');
        cultureBtn.className = 'innovative-feature-btn cultural-journey';
        cultureBtn.innerHTML = `
            <i class="fas fa-globe-americas"></i>
            <span>文化之旅</span>
        `;
        cultureBtn.onclick = () => this.showCulturalFoodJourney();
        
        this.addFeatureButton(cultureBtn);
    }

    // 7. 可持续用餐
    initSustainableDining() {
        const sustainableBtn = document.createElement('button');
        sustainableBtn.className = 'innovative-feature-btn sustainable-dining';
        sustainableBtn.innerHTML = `
            <i class="fas fa-leaf"></i>
            <span>绿色用餐</span>
        `;
        sustainableBtn.onclick = () => this.showSustainableDining();
        
        this.addFeatureButton(sustainableBtn);
    }

    // 8. VIP AI礼宾服务
    initVIPConcierge() {
        const vipBtn = document.createElement('button');
        vipBtn.className = 'innovative-feature-btn vip-concierge';
        vipBtn.innerHTML = `
            <i class="fas fa-crown"></i>
            <span>AI礼宾</span>
        `;
        vipBtn.onclick = () => this.showVIPConciergeService();
        
        this.addFeatureButton(vipBtn);
    }

    // 添加功能按钮到界面
    addFeatureButton(button) {
        let container = document.getElementById('innovativeFeatures');
        if (!container) {
            container = document.createElement('div');
            container.id = 'innovativeFeatures';
            container.className = 'innovative-features-container';
            container.style.cssText = `
                position: fixed;
                right: 20px;
                top: 50%;
                transform: translateY(-50%);
                display: flex;
                flex-direction: column;
                gap: 8px;
                z-index: 999;
            `;
            document.body.appendChild(container);
        }
        
        // 设置按钮样式
        button.style.cssText = `
            width: 60px;
            height: 60px;
            border-radius: 50%;
            border: none;
            background: linear-gradient(45deg, var(--canadian-red), #dc2626);
            color: white;
            cursor: pointer;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            font-size: 0.7rem;
            font-weight: 600;
            transition: all 0.3s ease;
            box-shadow: 0 4px 12px rgba(255, 0, 0, 0.3);
        `;
        
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'scale(1.1)';
            button.style.boxShadow = '0 6px 20px rgba(255, 0, 0, 0.4)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'scale(1)';
            button.style.boxShadow = '0 4px 12px rgba(255, 0, 0, 0.3)';
        });
        
        container.appendChild(button);
    }

    // 功能实现方法
    showWeatherBasedRecommendations() {
        const weatherRecommendations = {
            cold: ['热汤面', '火锅', '烤肉', '暖身汤品', '热饮咖啡厅'],
            warm: ['清爽沙拉', '海鲜', '日料', '意式轻食', '露台餐厅'],
            rainy: ['室内舒适餐厅', '咖啡厅', '书店餐厅', '温馨小馆', '下午茶'],
            snowy: ['枫糖小屋', '温暖壁炉餐厅', '加拿大传统菜', '热巧克力屋', '冬季特色菜']
        };

        const currentWeather = 'snowy'; // 模拟当前天气
        const recommendations = weatherRecommendations[currentWeather];
        
        alert(`🌨️ 根据当前雪天天气，AI为您推荐：\n\n${recommendations.map(r => '• ' + r).join('\n')}\n\n这些餐厅将为您提供温暖舒适的用餐体验！`);
    }

    showSocialDiningOptions() {
        alert(`👥 社交用餐功能：\n\n• 寻找用餐伙伴\n• 加入社区餐桌\n• 分享用餐体验\n• 餐厅社交活动\n• 美食爱好者聚会\n\n让用餐成为社交的桥梁！`);
    }

    startVoiceBooking() {
        alert(`🎤 语音预订系统：\n\n请说："我想预订今晚7点，4个人的桌子"\n\n系统将智能识别您的需求并为您推荐最合适的餐厅和时间！\n\n（此功能需要麦克风权限）`);
    }

    showMoodBasedRecommendations() {
        const moods = {
            '浪漫': ['烛光晚餐', '景观餐厅', '私密包间', '法式料理', '酒庄餐厅'],
            '庆祝': ['高档餐厅', '香槟酒吧', '特色甜品', '团体包间', '节日特色菜'],
            '放松': ['咖啡厅', '花园餐厅', '素食餐厅', '茶室', '静谧小馆'],
            '商务': ['安静环境', 'WiFi畅通', '商务套餐', '快速服务', '会议包间']
        };

        const selectedMood = prompt('请选择您的心情：\n\n1. 浪漫\n2. 庆祝\n3. 放松\n4. 商务\n\n请输入数字：');
        const moodNames = ['浪漫', '庆祝', '放松', '商务'];
        
        if (selectedMood && selectedMood >= 1 && selectedMood <= 4) {
            const mood = moodNames[selectedMood - 1];
            const recommendations = moods[mood];
            alert(`❤️ 基于您的"${mood}"心情，推荐：\n\n${recommendations.map(r => '• ' + r).join('\n')}\n\n愿您用餐愉快！`);
        }
    }

    showGroupBookingSystem() {
        alert(`👨‍👩‍👧‍👦 实时群组预订：\n\n• 创建群组预订\n• 邀请朋友加入\n• 实时投票选餐厅\n• AA制自动分账\n• 群组专属优惠\n• 统一时间协调\n\n让聚餐组织更简单！`);
    }

    showCulturalFoodJourney() {
        const culturalJourneys = [
            '🇨🇦 加拿大传统美食之旅',
            '🇫🇷 魁北克法式料理',
            '🦞 海洋三省海鲜盛宴',
            '🥞 枫糖浆美食体验',
            '🏔️ 洛基山脉野味料理',
            '🌾 草原省农场菜品',
            '🐟 原住民传统食物',
            '🍺 加拿大精酿啤酒配餐'
        ];

        alert(`🌍 加拿大文化美食之旅：\n\n${culturalJourneys.join('\n')}\n\n每个主题都有专门的餐厅推荐和文化背景介绍，带您深度体验加拿大多元饮食文化！`);
    }

    showSustainableDining() {
        alert(`🌱 绿色可持续用餐：\n\n• 本地食材餐厅\n• 有机认证餐厅\n• 零浪费餐厅\n• 素食友好餐厅\n• 环保包装餐厅\n• 可持续海鲜\n• 农场直供餐桌\n\n为地球和健康做出美味选择！`);
    }

    showVIPConciergeService() {
        alert(`👑 VIP AI礼宾服务：\n\n• 个人专属餐厅顾问\n• 24/7智能客服\n• 优先预订权限\n• 定制化用餐体验\n• 生日纪念日提醒\n• 专属优惠和折扣\n• 米其林餐厅绿色通道\n• 私人厨师推荐\n\n让每一次用餐都成为专属体验！`);
    }
}

// 初始化应用
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new MapleTableApp();
    window.app = app; // 使 app 在全局可用
    console.log('🍁 MapleTable App loaded and ready!');
    
    // 初始化创新功能
    setTimeout(() => {
        const innovativeFeatures = new InnovativeFeatures();
        window.innovativeFeatures = innovativeFeatures;
    }, 2000); // 延迟2秒确保页面完全加载
    
    // 检查登录状态
    checkAndUpdateLoginStatus();
});

// 检查并更新登录状态
function checkAndUpdateLoginStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userType = localStorage.getItem('userType');
    const currentUser = localStorage.getItem('currentUser');
    const currentMerchant = localStorage.getItem('currentMerchant');
    
    if (isLoggedIn === 'true') {
        if (userType === 'customer' && currentUser) {
            const userData = JSON.parse(currentUser);
            loginUser(userData);
        } else if (userType === 'merchant' && currentMerchant) {
            const merchantData = JSON.parse(currentMerchant);
            loginMerchant(merchantData);
        }
    }
}

// 商家登录状态更新
function loginMerchant(merchantData) {
    // 隐藏顾客登录按钮
    const customerLoginBtn = document.getElementById('customerLoginBtn');
    if (customerLoginBtn) {
        customerLoginBtn.style.display = 'none';
    }
    
    // 更新商家按钮为已登录状态
    const merchantBtn = document.querySelector('.merchant-btn');
    if (merchantBtn) {
        merchantBtn.innerHTML = `
            <i class="fas fa-store"></i>
            <span data-en="My Restaurant" data-fr="Mon Restaurant">My Restaurant</span>
        `;
        merchantBtn.onclick = () => goToMerchantDashboard();
        merchantBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #047857 100%)';
        merchantBtn.title = 'Access your restaurant dashboard';
    }
    
    // 在顶部工具栏添加商家管理快捷入口
    addMerchantQuickAccess(merchantData);
    
    console.log('商家已登录:', merchantData);
}

// 添加商家快捷管理入口 - 完全独立的区域
function addMerchantQuickAccess(merchantData) {
    // 检查是否已经有商家管理入口
    if (document.getElementById('merchantQuickAccess')) {
        return;
    }

    // 隐藏商家登录按钮，因为已经登录了
    const merchantBtn = document.querySelector('.merchant-btn');
    if (merchantBtn) {
        merchantBtn.style.display = 'none';
    }

    // 创建商家管理横幅 - 在顶部工具栏下方
    const merchantBanner = document.createElement('div');
    merchantBanner.id = 'merchantQuickAccess';
    merchantBanner.className = 'merchant-banner';
    merchantBanner.innerHTML = `
        <div class="merchant-banner-content">
            <div class="merchant-info">
                <div class="merchant-avatar">
                    <i class="fas fa-store"></i>
                </div>
                <div class="merchant-details">
                    <h3>${merchantData.restaurantName || merchantData.restaurant?.name || '我的餐厅'}</h3>
                    <p>餐厅ID: ${merchantData.restaurant?.id || 'rest_001'} • <span class="status-online">营业中</span></p>
                </div>
            </div>
            <div class="merchant-actions">
                <button class="merchant-dashboard-btn" onclick="goToMerchantDashboard()" title="商家管理后台">
                    <i class="fas fa-tachometer-alt"></i>
                    <span>管理后台</span>
                </button>
                <button class="merchant-logout-btn" onclick="logoutMerchant()" title="退出登录">
                    <i class="fas fa-sign-out-alt"></i>
                    <span>退出</span>
                </button>
            </div>
        </div>
    `;
    
    // 插入到主应用内容的最顶部
    const mainApp = document.getElementById('mainApp');
    const topToolbar = document.querySelector('.top-toolbar');
    if (mainApp && topToolbar) {
        mainApp.insertBefore(merchantBanner, topToolbar.nextSibling);
    }
}

// 商家退出登录
function logoutMerchant() {
    if (confirm('确认退出商家登录吗？')) {
        localStorage.removeItem('merchantLogin');
        
        // 显示商家登录按钮
        const merchantBtn = document.querySelector('.merchant-btn');
        if (merchantBtn) {
            merchantBtn.style.display = 'flex';
        }
        
        // 移除商家横幅
        const merchantBanner = document.getElementById('merchantQuickAccess');
        if (merchantBanner) {
            merchantBanner.remove();
        }
        
        alert('已退出商家登录');
    }
}

// 商家管理页面跳转 - 检查登录状态
function goToMerchantDashboard() {
    // 检查商家是否已登录
    const merchantLogin = localStorage.getItem('merchantLogin');
    
    if (!merchantLogin) {
        // 未登录，提醒登录
        alert('请先登录商家账户才能访问管理后台！\n\nPlease log in to your merchant account first!');
        // 跳转到商家登录页面
        window.location.href = 'merchant-login.html';
        return;
    }
    
    try {
        const merchantData = JSON.parse(merchantLogin);
        const restaurantId = merchantData.restaurant?.id || merchantData.restaurantId || 'default';
        
        // 跳转到专业的商家管理dashboard
        const dashboardUrl = `merchant-dashboard.html?restaurant=${restaurantId}&merchant=${encodeURIComponent(merchantData.restaurant?.name || '我的餐厅')}`;
        window.location.href = dashboardUrl;
        
    } catch (error) {
        console.error('解析商家登录数据失败:', error);
        alert('登录状态异常，请重新登录！');
        localStorage.removeItem('merchantLogin');
        window.location.href = 'merchant-login.html';
    }
}

// 为商家按钮添加登录检查
function goToMerchantLogin() {
    // 检查是否已经登录
    const merchantLogin = localStorage.getItem('merchantLogin');
    
    if (merchantLogin) {
        // 已登录，直接跳转到管理后台
        goToMerchantDashboard();
    } else {
        // 未登录，跳转到登录页面
        window.location.href = 'merchant-login.html';
    }
}


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