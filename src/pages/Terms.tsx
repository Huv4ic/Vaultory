import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText, Shield, UserCheck, AlertTriangle } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent } from '@/components/ui/card';

const Terms = () => {
  const { t } = useLanguage();
  const { telegramUser, refreshTelegramProfile } = useAuth();
  
  // Автоматически обновляем профиль при загрузке страницы
  useEffect(() => {
    if (telegramUser) {
      refreshTelegramProfile();
    }
  }, [telegramUser, refreshTelegramProfile]);
  
  const termsSections = [
    {
      title: t('Общие условия'),
      icon: FileText,
      content: [
        t('Настоящее Пользовательское соглашение определяет условия использования сервиса Vaultory. Регистрируясь и используя наш сервис, вы соглашаетесь с данными условиями.'),
        t('Vaultory - это платформа для приобретения цифровых товаров для различных игр и сервисов. Мы предоставляем удобный и безопасный способ покупки игровой валюты, предметов и других цифровых товаров.'),
      ],
    },
    {
      title: t('Права и обязанности пользователей'),
      icon: Shield,
      content: [
        {
          subTitle: t('Пользователь имеет право:'),
          list: [
            t('Использовать сервис в соответствии с его назначением'),
            t('Получать качественные товары и услуги'),
            t('Обращаться в службу поддержки'),
            t('Удалить свой аккаунт в любое время'),
          ],
        },
        {
          subTitle: t('Пользователь обязан:'),
          list: [
            t('Предоставлять достоверную информацию'),
            t('Не нарушать права других пользователей'),
            t('Не использовать сервис в мошеннических целях'),
            t('Соблюдать правила пользования сервисом'),
          ],
        },
      ],
    },
    {
      title: t('Условия покупки и оплаты'),
      icon: UserCheck,
      content: [
        {
          subTitle: t('Порядок покупки:'),
          list: [
            t('Выбор товара и добавление в корзину'),
            t('Оформление заказа с указанием необходимых данных'),
            t('Оплата через доступные способы'),
            t('Получение товара в течение указанного времени'),
          ],
        },
        {
          subTitle: t('Способы оплаты:'),
          list: [
            t('Банковские карты (Visa, MasterCard, МИР)'),
            t('Электронные кошельки'),
            t('Криптовалюты'),
            t('Банковские переводы'),
          ],
        },
      ],
    },
    {
      title: t('Возврат и возмещение'),
      icon: AlertTriangle,
      content: [
        t('Цифровые товары не подлежат возврату согласно действующему законодательству. Однако мы гарантируем качество предоставляемых услуг.'),
      ],
    },
    {
      title: t('Ответственность и ограничения'),
      icon: Shield,
      content: [
        t('Мы несем ответственность за предоставление качественных услуг в рамках действующего законодательства. Наша ответственность ограничивается стоимостью приобретенного товара.'),
        t('Пользователь несет полную ответственность за правильность предоставленных данных и за действия, совершенные с использованием его аккаунта.'),
      ],
    },
    {
      title: t('Контактная информация'),
      icon: Shield,
      content: [
        t('По всем вопросам, связанным с настоящим соглашением, обращайтесь:'),
        {
          list: [
            { text: t('Email:'), value: 'legal@vaultory.com' },
            { text: t('Telegram:'), value: '@VaultorySupport' },
            { text: t('Время работы:'), value: t('Пн-Вс 9:00-23:00 (МСК)') },
          ],
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-red-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              {t('Пользовательское соглашение')}
            </h1>
            <p className="text-gray-400">{t('Последнее обновление')}: 01 января 2025</p>
          </div>

          <div className="space-y-8">
            {termsSections.map((section, index) => (
              <Card key={index} className="bg-gray-800/50 backdrop-blur-sm border-gray-700/50">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <section.icon className="w-8 h-8 text-red-500 mr-3" />
                    <h2 className="text-2xl font-bold">{section.title}</h2>
                  </div>
                  <div className="space-y-4 text-gray-300">
                    {section.content.map((item, subIndex) => (
                      <div key={subIndex}>
                        {item.subTitle && (
                          <h3 className="text-lg font-semibold text-white mb-2">{item.subTitle}</h3>
                        )}
                        {item.list ? (
                          <ul className="list-disc list-inside space-y-2 ml-4">
                            {item.list.map((listItem, listIndex) => (
                              <li key={listIndex}>{listItem}</li>
                            ))}
                          </ul>
                        ) : (
                          <p className="leading-relaxed">{item.value}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
