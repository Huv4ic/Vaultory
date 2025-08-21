import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import HeroSection from '@/components/HeroSection';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { CheckCircle, ChevronDown } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import { useProducts } from '@/hooks/useProducts';
import { useCart } from '@/hooks/useCart';

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [visibleProducts, setVisibleProducts] = useState(15);
  const navigate = useNavigate();
  const { telegramUser } = useAuth();
  const { t } = useLanguage();
  const { products, categories, loading, error } = useProducts();
  const { items, addItem } = useCart();

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
      alert(t('Войдите через Telegram, чтобы добавить в корзину!'));
      return;
    }
    addItem(product);
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
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
      <section className="relative py-24 px-4 bg-gradient-to-br from-amber-600 via-emerald-500 to-purple-700 text-white overflow-hidden animate-fade-in">
        {/* Анимированный фон */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-amber-500/20 rounded-full animate-spin" style={{animationDuration: '30s'}}></div>
        </div>
        
        <div className="container mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-white via-amber-100 to-emerald-100 bg-clip-text text-transparent animate-fade-in">
            {t('Vaultory — магазин игровых кейсов и товаров')}
          </h1>
          <p className="text-2xl mb-8 max-w-2xl mx-auto animate-slide-up text-amber-50">
            {t('Открывай уникальные кейсы, покупай топовые товары, пополняй баланс и выигрывай крутые призы!')}
          </p>
          <a
            href="/cases"
            className="inline-block bg-gradient-to-r from-amber-500 to-emerald-600 hover:from-amber-600 hover:to-emerald-700 text-white font-bold text-xl px-10 py-4 rounded-xl shadow-2xl shadow-amber-500/30 hover:shadow-amber-500/50 transition-all duration-500 mb-4 transform hover:scale-105 hover:-translate-y-1"
          >
            {t('Открыть кейсы')}
          </a>
          <div className="mt-6">
            <a
              href="https://t.me/Vaultory_manager"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-white/10 backdrop-blur-sm text-white font-bold px-6 py-2 rounded-xl border border-amber-400/30 shadow-lg hover:bg-white/20 hover:border-amber-400/50 transition-all duration-300 hover:scale-105"
            >
              {t('Telegram поддержка')}
            </a>
          </div>
        </div>
      </section>

      {/* Категории игр с новым фоном и анимацией */}
      <section className="py-16 px-4 relative overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900">
        {/* Анимированный фон */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-amber-500/10 rounded-full animate-spin" style={{animationDuration: '40s'}}></div>
        </div>
        
        <div className="container mx-auto relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-amber-400 via-emerald-400 to-purple-400 bg-clip-text text-transparent animate-fade-in">
            {t('Популярные игры')}
          </h2>
          
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-500 transform hover:scale-105 ${
                selectedCategory === 'all'
                  ? 'bg-gradient-to-r from-amber-500 to-emerald-600 text-white shadow-2xl shadow-amber-500/30'
                  : 'bg-gray-800/50 backdrop-blur-sm text-gray-300 hover:bg-amber-500/20 hover:text-amber-300 border border-gray-700/50 hover:border-amber-500/30'
              }`}
            >
              {t('Все игры')}
            </button>
            {gameCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-500 transform hover:scale-105 flex items-center space-x-2 ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-amber-500 to-emerald-600 text-white shadow-2xl shadow-amber-500/30'
                    : 'bg-gray-800/50 backdrop-blur-sm text-gray-300 hover:bg-amber-500/20 hover:text-amber-300 border border-gray-700/50 hover:border-amber-500/30'
                }`}
              >
                <span>{getCategoryIcon(category.icon)}</span>
                <span>{category.name}</span>
              </button>
            ))}
          </div>

          {/* Товары */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-12 items-stretch">
            {displayedProducts.map((product, index) => (
              <div 
                key={product.id} 
                className="animate-fade-in"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <ProductCard
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  originalPrice={product.original_price}
                  image={product.image_url}
                  category={categories.find(cat => cat.id === product.category_id)?.name || product.game}
                  rating={product.rating}
                  sales={product.sales}
                  isInCart={items.some((item) => item.id === product.id)}
                  onAddToCart={() => handleAddToCart(product)}
                  onDetails={() => handleProductDetails(product.id)}
                />
              </div>
            ))}
          </div>

          {visibleProducts < filteredProducts.length && (
            <div className="text-center">
              <Button
                onClick={loadMore}
                size="lg"
                className="bg-gradient-to-r from-amber-500 to-emerald-600 hover:from-amber-600 hover:to-emerald-700 border-none px-8 py-6 rounded-xl transform hover:scale-105 transition-all duration-500 shadow-2xl shadow-amber-500/30 hover:shadow-amber-500/50"
              >
                {t('Показать еще товары')}
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* FAQ с новым дизайном */}
      <section className="py-16 px-4 bg-gradient-to-r from-gray-800/30 to-gray-900/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-900/10 via-transparent to-emerald-900/10"></div>
        <div className="container mx-auto max-w-4xl relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-amber-400 via-emerald-400 to-purple-400 bg-clip-text text-transparent animate-fade-in">
            {t('Частые вопросы')}
          </h2>
          
          <Accordion type="single" collapsible className="space-y-4">
            {faqItems.map((item, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`} 
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-amber-500/20 px-6 animate-fade-in hover:border-amber-500/40 transition-all duration-300"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <AccordionTrigger className="text-lg font-semibold text-white hover:text-amber-400 transition-colors py-6 hover:no-underline">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-amber-500 mr-3" />
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
