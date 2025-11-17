import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { CheckCircle, ChevronDown, Crown, Sparkles, Zap, Star, Search, Target } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import { useProducts } from '@/hooks/useProducts';
import { useCart } from '@/hooks/useCart';
import { useNotification } from '../hooks/useNotification';
import Notification from '../components/ui/Notification';
import { useTranslations } from '@/hooks/useTranslations';
import TelegramStats from '@/components/TelegramStats';
import { supabase } from '@/integrations/supabase/client';

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedGameCategory, setSelectedGameCategory] = useState('all');
  const [gameCategories, setGameCategories] = useState<any[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const productsSectionRef = useRef<HTMLDivElement>(null);
  const categoriesSectionRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { telegramUser } = useAuth();
  const { t } = useLanguage();
  const { products, categories, loading, error } = useProducts();
  const { items, addItem } = useCart();
  const { showError, notification, hideNotification } = useNotification();
  const { getCategoryTranslation } = useTranslations();

  // Загружаем категории игр из базы данных
  useEffect(() => {
    const fetchGameCategories = async () => {
      try {
        setCategoriesLoading(true);
        console.log('Загружаем категории игр из базы данных...');
        
        const { data, error } = await supabase
          .from('game_categories')
          .select('*')
          .order('name', { ascending: true });

        if (error) {
          console.error('Error fetching game categories:', error);
          setGameCategories([]);
        } else {
          console.log('Загружено категорий игр:', data?.length || 0);
          console.log('Данные категорий:', data);
          setGameCategories(data || []);
        }
      } catch (err) {
        console.error('Error fetching game categories:', err);
        setGameCategories([]);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchGameCategories();
    
    // Слушаем изменения в localStorage от админки
    const handleStorageChange = () => {
      const updated = localStorage.getItem('categoriesUpdated');
      if (updated) {
        console.log('Получено уведомление об обновлении категорий от админки');
        fetchGameCategories();
      }
    };
    
    // Также проверяем каждые 5 секунд на случай если localStorage не сработает
    const interval = setInterval(() => {
      const updated = localStorage.getItem('categoriesUpdated');
      if (updated) {
        console.log('Периодическая проверка: обновление категорий');
        fetchGameCategories();
        localStorage.removeItem('categoriesUpdated'); // Убираем флаг после обновления
      }
    }, 5000);
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // Синхронизируем searchQuery и selectedGameCategory с URL параметрами
  useEffect(() => {
    const searchFromUrl = searchParams.get('search') || '';
    const categoryFromUrl = searchParams.get('category') || 'all';
    
    if (searchFromUrl !== searchQuery) {
      setSearchQuery(searchFromUrl);
    }
    
    if (categoryFromUrl !== selectedGameCategory) {
      setSelectedGameCategory(categoryFromUrl);
    }
  }, [searchParams, searchQuery, selectedGameCategory]);

  // Автоматический скролл при изменении URL параметров (только для категорий)
  useEffect(() => {
    const categoryFromUrl = searchParams.get('category') || 'all';
    
    // Скроллим только если выбрана конкретная категория
    if (categoryFromUrl !== 'all' && categoryFromUrl !== selectedGameCategory) {
      setTimeout(() => {
        scrollToProducts();
      }, 200); // Увеличиваем задержку для полного обновления состояния
    }
  }, [searchParams, selectedGameCategory]);

  // Убираем автоматическое обновление профиля - баланс не должен обновляться просто при просмотре страницы
  // useEffect(() => {
  //   if (telegramUser) {
  //     refreshTelegramProfile();
  //   }
  // }, [telegramUser, refreshTelegramProfile]);

  // Функция для получения эмодзи иконки по названию
  const getCategoryIcon = (categoryName: string) => {
    const iconMap: { [key: string]: string } = {
      'currency': '💰',
      'accounts': '👤',
      'keys': '🔑',
      'subscriptions': '📱',
      'skins': '🎨',
      'weapons': '🔫',
      'characters': '👤',
      'vehicles': '🚗',
      'default': '📦'
    };
    
    // Проверяем точное совпадение
    if (iconMap[categoryName.toLowerCase()]) {
      return iconMap[categoryName.toLowerCase()];
    }
    
    // Проверяем частичное совпадение
    const lowerName = categoryName.toLowerCase();
    if (lowerName.includes('аккаунт') || lowerName.includes('account')) return '👤';
    if (lowerName.includes('валюта') || lowerName.includes('currency')) return '💰';
    if (lowerName.includes('ключ') || lowerName.includes('key')) return '🔑';
    if (lowerName.includes('подписк') || lowerName.includes('subscription')) return '📱';
    if (lowerName.includes('скин') || lowerName.includes('skin')) return '🎨';
    
    return iconMap['default'];
  };

  // Создаем translatedCategories из данных БД с переводами
  const translatedCategories = categories.map(cat => ({
    id: cat.id,
    name: getCategoryTranslation(cat.id, cat.name),
    image: cat.image
  }));

  // Получаем уникальные игры из товаров
  const getAvailableGames = () => {
    if (!products || products.length === 0) return [];
    
    const gameNames = products
      .map(product => product.game)
      .filter(game => game && game.trim() !== '')
      .map(game => game.toLowerCase().trim());
    
    const uniqueGames = [...new Set(gameNames)];
    return uniqueGames;
  };

  // Создаем словарь категорий из базы данных
  const allGameCategories = gameCategories.reduce((acc, category) => {
    acc[category.id] = {
      name: category.name,
      color: category.color,
      icon: category.icon,
      image_url: category.image_url
    };
    return acc;
  }, {} as any);

  // Функция для сопоставления названия игры с категорией
  const matchGameToCategory = (gameName: string) => {
    const lowerGameName = gameName.toLowerCase();
    
    if (lowerGameName.includes('tiktok')) return 'tiktok';
    if (lowerGameName.includes('standoff')) return 'standoff2';
    if (lowerGameName.includes('mobile legends') || lowerGameName.includes('mobilelegends')) return 'mobile_legends';
    if (lowerGameName.includes('pubg')) return 'pubg';
    if (lowerGameName.includes('free fire') || lowerGameName.includes('freefire')) return 'free_fire';
    if (lowerGameName.includes('steam')) return 'steam';
    if (lowerGameName.includes('roblox')) return 'roblox';
    if (lowerGameName.includes('genshin')) return 'genshin';
    if (lowerGameName.includes('honkai')) return 'honkai';
    if (lowerGameName.includes('zenless')) return 'zenless';
    if (lowerGameName.includes('identity')) return 'identity_v';
    if (lowerGameName.includes('arena')) return 'arena_breakout';
    if (lowerGameName.includes('epic games') || lowerGameName.includes('epicgames')) return 'epic_games';
    if (lowerGameName.includes('brawl stars') || lowerGameName.includes('brawlstars')) return 'brawl_stars';
    if (lowerGameName.includes('gta') || lowerGameName.includes('grand theft auto')) return 'gta';
    if (lowerGameName.includes('rocket league') || lowerGameName.includes('rocketleague')) return 'rocket_league';
    if (lowerGameName.includes('spotify')) return 'spotify';
    if (lowerGameName.includes('world of tanks') || lowerGameName.includes('worldoftanks') || lowerGameName.includes('wot')) return 'world_of_tanks';
    if (lowerGameName.includes('telegram') || lowerGameName.includes('звезды') || (lowerGameName.includes('stars') && !lowerGameName.includes('brawl'))) return 'telegram_stars';
    
    return null;
  };

  // Создаем карточки для ВСЕХ категорий из базы данных
  const gameCategoriesCards = (() => {
    console.log('Создаем карточки категорий...', { 
      categoriesLoading, 
      gameCategoriesLength: gameCategories.length,
      gameCategories: gameCategories,
      allGameCategories: allGameCategories
    });
    
    if (categoriesLoading || !gameCategories.length) {
      console.log('Возвращаем пустой массив карточек');
      return [];
    }
    
    // Показываем ВСЕ категории из базы данных, а не только те, для которых есть товары
    const cards = [];
    
    gameCategories.forEach(category => {
      const card = {
        id: category.id,
        name: category.name,
        image: category.image_url || '/api/placeholder/300/200',
        color: category.color,
        icon: category.icon
      };
      console.log('Добавляем карточку из базы данных:', card);
      cards.push(card);
    });
    
    console.log('Итоговые карточки (все категории):', cards);
    return cards;
  })();

  // Отладка: проверяем что загружается
  console.log('=== ОТЛАДКА ТОВАРОВ ===');
  console.log('products.length:', products.length);
  console.log('loading:', loading);
  console.log('error:', error);
  
  // Показываем первые 5 товаров для отладки
  if (products.length > 0) {
    console.log('Первые 5 товаров:');
    products.slice(0, 5).forEach((product, index) => {
      console.log(`${index + 1}. "${product.name}" - game: "${product.game}", game_category_id: "${product.game_category_id}"`);
    });
  }

  // На главной странице товары не показываются - только категории
  const filteredProducts: any[] = [];
  const groupedProducts: Record<string, any[]> = {};

  const faqItems = [
    { 
      question: t('Как быстро приходят товары?'), 
      answer: 'Товары после оплаты выдаются вручную, поэтому время на выдачу товара может варьироваться от 5 минут до пары часов.' 
    },
    { 
      question: t('Какие способы оплаты доступны?'), 
      answer: 'Доступны оплаты через Monobank, PrivatBank, PUMB, а также криптовалютой (USDT TRC20/ERC20, Litecoin)' 
    },
    { 
      question: t('Безопасно ли покупать у вас?'), 
      answer: 'Да, мы работаем с 2025 года и имеем уже большое количество реальных отзывов. Все платежи проходят через защищенные каналы.' 
    },
    { 
      question: t('Что делать если товар не пришел?'), 
      answer: t('Обратитесь в нашу поддержку через Telegram или Email с номером заказа. Мы решим проблему в течение часа или вернем деньги.') 
    }
  ];

  const handleProductDetails = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleAddToCart = (product) => {
    if (!telegramUser) {
      showError(t('Войдите через Telegram, чтобы добавить в корзину!'));
      return;
    }
    addItem(product);
  };

  const handleBuyNow = (product) => {
    if (!telegramUser) {
      showError(t('Войдите через Telegram для покупки!'));
      return;
    }
    // Добавляем товар в корзину
    addItem(product);
    // Сразу переходим в корзину
    navigate('/cart');
  };

  // Функция для скролла к товарам
  const scrollToProducts = () => {
    if (productsSectionRef.current) {
      productsSectionRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#121212] text-[#f0f0f0] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#FFD700] mx-auto"></div>
          <p className="mt-4 text-xl">{t('Загрузка товаров...')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#121212] text-[#f0f0f0] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 text-[#FFD700]">{t('Ошибка загрузки')}</h1>
          <p className="text-xl mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} className="bg-[#FFD700] hover:bg-[#FFC107]">
            {t('Попробовать снова')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-[#f0f0f0] relative">
      {/* Telegram канал - современное окно с анимированным фоном */}


      {/* Категории игр */}
      <section id="products" className="py-16 md:py-20 px-4 relative z-10">
        
        <div className="container mx-auto relative z-10">
          {/* Hero секция */}
          <div className="text-center mb-12 sm:mb-16">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <Crown className="w-12 h-12 sm:w-16 sm:h-16 text-[#FFD700]" />
              </div>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-6 text-[#f0f0f0] px-2">
              {t('Популярные игры')}
            </h2>
            <div className="flex justify-center items-center space-x-4 mb-8">
              <div className="h-px bg-white/20 w-24"></div>
              <Sparkles className="w-5 h-5 text-[#a0a0a0]" />
              <div className="h-px bg-white/20 w-24"></div>
            </div>
          </div>
          
          {/* Поиск и фильтры */}
          <div className="max-w-4xl mx-auto mb-12 sm:mb-16">
            <div className="space-y-6">
            </div>
          </div>

          {/* Результаты поиска */}
          {searchQuery.trim() && (
            <div className="mb-8 text-center">
              <div className="inline-flex items-center gap-3 px-6 py-3 glass rounded-2xl border border-white/9 hover:border-white/15 hover-lift">
                <Target className="w-5 h-5 text-[#a0a0a0]" />
                <p className="text-[#f0f0f0] text-base">
                  Найдено товаров: <span className="text-[#f0f0f0] font-semibold text-lg">{filteredProducts.length}</span>
                </p>
              </div>
            </div>
          )}
          
          {/* Крупные карточки категорий игр */}
          <div ref={categoriesSectionRef} className="mb-16 sm:mb-20">
            <div className="mb-8">
              <h3 className="text-2xl sm:text-3xl font-semibold text-[#f0f0f0]">Категории игр</h3>
            </div>
            
            {categoriesLoading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white/20"></div>
                <p className="text-[#a0a0a0] mt-4 text-base">Загрузка категорий...</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 md:gap-8">
                {gameCategoriesCards.map((category, index) => (
                <div
                key={category.id}
                  onClick={() => {
                    // Переходим на отдельную страницу категории
                    navigate(`/category/${category.id}`);
                  }}
                  className={`group relative cursor-pointer transform transition-all duration-300 ${
                    selectedGameCategory === category.id ? '' : ''
                }`}
                style={{animationDelay: `${index * 0.1}s`}}
              >
                  {/* Карточка категории */}
                  <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${category.color} p-5 sm:p-6 h-32 sm:h-40 border transition-all duration-300 hover-lift ${
                    selectedGameCategory === category.id 
                      ? 'border-white/15 shadow-lg' 
                      : 'border-white/9 hover:border-white/15'
                  }`}>
                    {/* Молния в углу */}
                    <div className="absolute top-2 left-2 z-10">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 glass ${
                        selectedGameCategory === category.id 
                          ? 'bg-[#FFD700] text-[#121212] border border-[#FFD700]' 
                          : 'bg-white/10 text-white border border-white/20'
                      }`}>
                        <Zap className="w-4 h-4" />
                      </div>
                    </div>
                    
                    {/* Изображение или иконка */}
                    {category.image && category.image !== '/api/placeholder/300/200' ? (
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <img 
                          src={category.image} 
                          alt={category.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <div className="text-4xl sm:text-5xl opacity-80">
                          {category.icon}
                        </div>
                      </div>
                    )}
                    
                    {/* Градиентный оверлей для читаемости текста */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                    
                    {/* Название категории */}
                    <div className="absolute bottom-2 left-2 right-2">
                      <h3 className="text-white font-bold text-sm sm:text-base truncate drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                        {category.name}
                      </h3>
                    </div>
                    
                  </div>
                </div>
              ))}
              </div>
            )}
          </div>



          {/* Сообщение о выборе категории */}
          <div ref={productsSectionRef} className="space-y-16 sm:space-y-20">
            {(
              /* Сообщение о том, что товаров нет в наличии */
              <div className="text-center py-16 sm:py-20">
                <div className="max-w-2xl mx-auto">
                  <div className="relative mb-8">
                    {/* Анимированная иконка */}
                    <div className="w-24 h-24 mx-auto mb-6 bg-[#FFD700]/20 rounded-3xl flex items-center justify-center border border-[#FFD700]/30 animate-pulse">
                      <div className="relative">
                        <div className="w-12 h-12 bg-[#FFD700] rounded-2xl flex items-center justify-center">
                          <span className="text-2xl">📦</span>
                        </div>
                        {/* Светящийся эффект */}
                        <div className="absolute inset-0 bg-[#FFD700]/30 rounded-2xl blur-xl animate-ping"></div>
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#f0f0f0] mb-4">
                    {searchQuery.trim() ? 'Ничего не найдено' : 'Выберите категорию для просмотра товаров'}
                  </h3>
                  
                  <div className="space-y-4 mb-8">
                    <p className="text-lg sm:text-xl text-[#a0a0a0] leading-relaxed">
                      {searchQuery.trim() 
                        ? 'Попробуйте изменить поисковый запрос или выберите другую категорию'
                        : 'Нажмите на любую категорию выше, чтобы увидеть доступные товары в этой игре.'
                      }
                    </p>
                    {!searchQuery.trim() && (
                      <p className="text-base sm:text-lg text-[#a0a0a0]">
                        Или воспользуйтесь поиском для быстрого поиска нужного товара!
                      </p>
                    )}
                  </div>
                  
                  {/* Декоративные элементы */}
                  <div className="flex justify-center items-center space-x-4 mb-8">
                    <div className="h-px bg-[#FFD700]/20 w-16"></div>
                    <div className="w-2 h-2 bg-[#FFD700] rounded-full animate-pulse"></div>
                    <div className="h-px bg-[#FFD700]/20 w-16"></div>
                  </div>
                  
                  {/* Кнопка для возврата к поиску */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={() => {
                        if (searchQuery.trim()) {
                          setSearchQuery('');
                        } else {
                          setSelectedGameCategory('all');
                          setSearchQuery('');
                          navigate('/');
                          // Прокручиваем к разделу с категориями
                          setTimeout(() => {
                            categoriesSectionRef.current?.scrollIntoView({ 
                              behavior: 'smooth', 
                              block: 'start' 
                            });
                          }, 100);
                        }
                      }}
                      className="px-8 py-4 bg-[#FFD700] hover:bg-[#FFC107] text-[#121212] hover-lift font-bold text-lg rounded-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 shadow-xl shadow-[#FFD700]/20"
                    >
                      <span className="flex items-center justify-center">
                        {searchQuery.trim() ? '🔍 Очистить поиск' : '🎮 Выбрать категорию'}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FAQ с новым дизайном */}
      <section className="py-16 md:py-20 px-4 bg-transparent relative">
        <div className="container mx-auto max-w-4xl relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-6 text-[#f0f0f0]">
              {t('Частые вопросы')}
            </h2>
            <div className="flex justify-center items-center space-x-4">
              <div className="h-px bg-white/20 w-24"></div>
              <Star className="w-5 h-5 text-[#a0a0a0]" />
              <div className="h-px bg-white/20 w-24"></div>
            </div>
          </div>
          
          <Accordion type="single" collapsible className="space-y-4">
            {faqItems.map((item, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`} 
                className="group glass rounded-2xl border border-white/9 hover:border-white/15 hover-lift px-6 py-4 transition-all duration-300 data-[state=open]:subtle-glow"
              >
                <AccordionTrigger className="text-base sm:text-lg font-semibold text-[#f0f0f0] hover:text-[#f0f0f0] transition-colors py-4 hover:no-underline">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-[#a0a0a0] mr-3" />
                    {item.question}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-[#a0a0a0] pb-4 text-base leading-relaxed">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
      
      {/* Красивые уведомления */}
      <Notification
        show={notification.show}
        message={notification.message}
        type={notification.type}
        onClose={hideNotification}
        autoHide={notification.autoHide}
        duration={notification.duration}
      />
    </div>
  );
};

export default Index;
