import { useState } from 'react';
import { Link } from 'react-router-dom';
import HeroSection from '@/components/HeroSection';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Star, Users, CheckCircle, ChevronDown } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import { useProducts } from '@/hooks/useProducts';

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [visibleProducts, setVisibleProducts] = useState(15);
  const [cart, setCart] = useState([]);
  const { telegramUser } = useAuth();
  const { t } = useLanguage();
  const { products, categories, loading, error } = useProducts();

  // Убираем автоматическое обновление профиля - баланс не должен обновляться просто при просмотре страницы
  // useEffect(() => {
  //   if (telegramUser) {
  //     refreshTelegramProfile();
  //   }
  // }, [telegramUser, refreshTelegramProfile]);

  // Функция для получения эмодзи иконки по названию
  const getCategoryIcon = (iconName: string) => {
    const iconMap: { [key: string]: string } = {
      'user': '👤',
      'dollar': '💰',
      'key': '🔑',
      'calendar': '📅',
      'star': '⭐',
      'default': '📦'
    };
    return iconMap[iconName] || iconMap['default'];
  };

  // Создаем gameCategories из данных БД
  const gameCategories = categories.map(cat => ({
    id: cat.id,
    name: cat.name,
    icon: cat.icon
  }));

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => {
        const productCategory = categories.find(cat => cat.id === product.category_id);
        return productCategory && productCategory.id === selectedCategory;
      });

  const displayedProducts = filteredProducts.slice(0, visibleProducts);

  const loadMore = () => {
    setVisibleProducts(prev => prev + 15);
  };

  const testimonials = [
    { name: t('Максим'), game: 'Brawl Stars', text: t('Купил мега боксы, получил легендарного бойца! Супер быстро и дешево!'), rating: 5 },
    { name: t('Анна'), game: 'Roblox', text: t('Robux пришли мгновенно, теперь мой аватар самый крутой в школе!'), rating: 5 },
    { name: t('Дмитрий'), game: 'Steam', text: t('Пополнил кошелек, купил CS2. Всё честно, рекомендую!'), rating: 5 },
    { name: t('София'), game: 'PUBG Mobile', text: t('UC зачислились сразу, купила королевский пропуск. Спасибо!'), rating: 5 }
  ];

  const faqItems = [
    { 
      question: t('Как быстро приходят товары?'), 
      answer: t('Большинство товаров доставляется мгновенно после оплаты. Максимальное время ожидания - 15 минут.') 
    },
    { 
      question: t('Безопасно ли покупать здесь?'), 
      answer: t('Да, мы гарантируем 100% безопасность покупок. Все товары официальные, есть возврат средств.') 
    },
    { 
      question: t('Какие способы оплаты?'), 
      answer: t('Принимаем карты, электронные кошельки, криптовалюты и переводы через банк.') 
    },
    { 
      question: t('Что делать если товар не пришел?'), 
      answer: t('Обратитесь в поддержку в Telegram. Мы решим проблему в течение часа или вернем деньги.') 
    }
  ];

  const handleAddToCart = (product) => {
    if (!telegramUser) {
      alert(t('Войдите через Telegram, чтобы добавить в корзину!'));
      return;
    }
    // Здесь будет логика добавления в корзину
  };

  const handleProductDetails = (productId) => {
    // Здесь будет навигация на страницу товара
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-500 mx-auto"></div>
          <p className="mt-4 text-xl">{t('Загрузка товаров...')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 text-red-500">{t('Ошибка загрузки')}</h1>
          <p className="text-xl mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} className="bg-gradient-to-r from-red-500 to-purple-600">
            {t('Попробовать снова')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <section className="relative py-24 px-4 bg-gradient-to-br from-yellow-400 via-pink-500 to-purple-600 text-white overflow-hidden animate-fade-in">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-white via-yellow-100 to-purple-100 bg-clip-text text-transparent animate-fade-in">
            {t('Vaultory — магазин игровых кейсов и товаров')}
          </h1>
          <p className="text-2xl mb-8 max-w-2xl mx-auto animate-slide-up">
            {t('Открывай уникальные кейсы, покупай топовые товары, пополняй баланс и выигрывай крутые призы!')}
          </p>
          <a
            href="/cases"
            className="inline-block bg-gradient-to-r from-red-500 to-purple-600 hover:from-red-600 hover:to-purple-700 text-white font-bold text-xl px-10 py-4 rounded-lg shadow-lg transition-all duration-200 mb-4"
          >
            {t('Открыть кейсы')}
          </a>
          <div className="mt-6">
            <a
              href="https://t.me/Vaultory_manager"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-white text-gray-900 font-bold px-6 py-2 rounded-lg border border-gray-300 shadow hover:bg-gray-100 transition-all duration-200"
            >
              {t('Telegram поддержка')}
            </a>
          </div>
        </div>
      </section>

      {/* Категории игр с новым фоном и анимацией */}
      <section className="py-16 px-4 relative overflow-hidden bg-gradient-to-br from-purple-900/30 via-gray-900 to-blue-900/30">
        {/* Анимированный фон */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-red-500/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-red-500/5 rounded-full animate-spin" style={{animationDuration: '30s'}}></div>
        </div>
        
        <div className="container mx-auto relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-white via-red-200 to-purple-200 bg-clip-text text-transparent animate-fade-in">
            {t('Популярные игры')}
          </h2>
          
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
                selectedCategory === 'all'
                  ? 'bg-gradient-to-r from-red-500 to-purple-600 text-white shadow-lg shadow-red-500/25'
                  : 'bg-gray-800/50 backdrop-blur-sm text-gray-300 hover:bg-gray-700/50 hover:text-white border border-gray-700/50'
              }`}
            >
              {t('Все игры')}
            </button>
            {gameCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-red-500 to-purple-600 text-white shadow-lg shadow-red-500/25'
                    : 'bg-gray-800/50 backdrop-blur-sm text-gray-300 hover:bg-gray-700/50 hover:text-white border border-gray-700/50'
                }`}
              >
                <span>{getCategoryIcon(category.icon)}</span>
                <span>{category.name}</span>
              </button>
            ))}
          </div>

          {/* Товары */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-12 items-stretch">
            {displayedProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                originalPrice={product.original_price}
                image={product.image_url}
                category={categories.find(cat => cat.id === product.category_id)?.name || product.game}
                rating={product.rating}
                sales={product.sales}
                isInCart={cart.some((item) => item.id === product.id)}
                onAddToCart={() => handleAddToCart(product)}
                onDetails={() => handleProductDetails(product.id)}
              />
            ))}
          </div>

          {visibleProducts < filteredProducts.length && (
            <div className="text-center">
              <Button
                onClick={loadMore}
                size="lg"
                className="bg-gradient-to-r from-red-500 to-purple-600 hover:from-red-600 hover:to-purple-700 border-none px-8 py-6 rounded-xl transform hover:scale-105 transition-all duration-300 shadow-lg shadow-red-500/25"
              >
                {t('Показать еще товары')}
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Статистика */}
      <section className="py-16 px-4 bg-gradient-to-r from-gray-800/50 to-gray-900/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-900/10 via-transparent to-purple-900/10"></div>
        <div className="container mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-8 transform hover:scale-105 transition-all duration-300">
              <div className="text-4xl font-bold text-red-500 mb-2 animate-fade-in">50,000+</div>
              <div className="text-gray-300">{t('Довольных клиентов')}</div>
            </div>
            <div className="p-8 transform hover:scale-105 transition-all duration-300">
              <div className="text-4xl font-bold text-red-500 mb-2 animate-fade-in">1,000,000+</div>
              <div className="text-gray-300">{t('Проданных товаров')}</div>
            </div>
            <div className="p-8 transform hover:scale-105 transition-all duration-300">
              <div className="text-4xl font-bold text-red-500 mb-2 animate-fade-in">99.8%</div>
              <div className="text-gray-300">{t('Положительных отзывов')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Отзывы */}
      <section className="py-16 px-4 bg-gradient-to-br from-purple-900/20 via-gray-900 to-blue-900/20">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-white via-red-200 to-purple-200 bg-clip-text text-transparent animate-fade-in">
            {t('Отзывы клиентов')}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50 transform hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-red-500/10 animate-fade-in" style={{animationDelay: `${index * 0.2}s`}}>
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {testimonial.name[0]}
                  </div>
                  <div className="ml-3">
                    <div className="font-semibold text-white">{testimonial.name}</div>
                    <div className="text-sm text-gray-400">{testimonial.game}</div>
                  </div>
                </div>
                <div className="flex mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 text-sm">{testimonial.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ с новым дизайном */}
      <section className="py-16 px-4 bg-gradient-to-r from-gray-800/50 to-gray-900/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/10 via-transparent to-red-900/10"></div>
        <div className="container mx-auto max-w-4xl relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-white via-red-200 to-purple-200 bg-clip-text text-transparent animate-fade-in">
            {t('Частые вопросы')}
          </h2>
          
          <Accordion type="single" collapsible className="space-y-4">
            {faqItems.map((item, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`} 
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 px-6 animate-fade-in"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <AccordionTrigger className="text-lg font-semibold text-white hover:text-red-400 transition-colors py-6 hover:no-underline">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-red-500 mr-3" />
                    {item.question}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-gray-300 pb-6 animate-fade-in">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </div>
  );
};

export default Index;
