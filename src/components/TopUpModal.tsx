import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { 
  CreditCard, 
  Banknote, 
  Coins, 
  X,
  Copy,
  CheckCircle,
  RefreshCw,
  Bell
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNotification } from '@/hooks/useNotification';
import Notification from './ui/Notification';

interface TopUpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PaymentMethod {
  id: string;
  name: string;
  type: 'bank' | 'crypto';
  icon: React.ReactNode;
  color: string;
  description: string;
  details: string;
  minAmount: string;
}

const paymentMethods: PaymentMethod[] = [
  {
    id: 'monobank',
    name: 'Monobank',
    type: 'bank',
    icon: <CreditCard className="w-6 h-6" />,
    color: 'from-purple-500 to-purple-600',
    description: 'Банковская карта',
    details: '4441111062334770',
    minAmount: '42₴'
  },
  {
    id: 'pumb',
    name: 'PUMB',
    type: 'bank',
    icon: <Banknote className="w-6 h-6" />,
    color: 'from-blue-500 to-blue-600',
    description: 'Банковская карта',
    details: '4314140004183320',
    minAmount: '42₴'
  },
  {
    id: 'privatbank',
    name: 'Privatbank',
    type: 'bank',
    icon: <CreditCard className="w-6 h-6" />,
    color: 'from-green-500 to-green-600',
    description: 'Банковская карта',
    details: '5168745126341533',
    minAmount: '42₴'
  },
  {
    id: 'pumb-us',
    name: 'PUMB US',
    type: 'bank',
    icon: <Banknote className="w-6 h-6" />,
    color: 'from-indigo-500 to-indigo-600',
    description: 'Долларовая карта',
    details: '4314140004183916',
    minAmount: '2$'
  },
  {
    id: 'usdt-trc20',
    name: 'USDT TRC20',
    type: 'crypto',
    icon: <Coins className="w-6 h-6" />,
    color: 'from-orange-500 to-orange-600',
    description: 'Криптовалюта',
    details: 'TJr3gEZtMHQEbRPKz8mdx5rL178Rm4V2V3',
    minAmount: '5$'
  },
  {
    id: 'usdt-erc20',
    name: 'USDT ERC20',
    type: 'crypto',
    icon: <Coins className="w-6 h-6" />,
    color: 'from-blue-500 to-blue-600',
    description: 'Криптовалюта',
    details: 'EQBNY7a1Gsy1O7TX0OhGBnM8YhpHQ6mAWIjq2glCTuJ1SlxF',
    minAmount: '5$'
  },
  {
    id: 'usdc-erc20',
    name: 'USDC ERC20',
    type: 'crypto',
    icon: <Coins className="w-6 h-6" />,
    color: 'from-green-500 to-green-600',
    description: 'Криптовалюта',
    details: '0xf5eD6172C6C6C7aACBD03FEEF4B696f475AbC521',
    minAmount: '15$'
  },
  {
    id: 'ltc',
    name: 'LTC',
    type: 'crypto',
    icon: <Coins className="w-6 h-6" />,
    color: 'from-gray-500 to-gray-600',
    description: 'Криптовалюта',
    details: 'MPBVhMbcw1HzPM9zqDdp8okAThEyVf4i9u',
    minAmount: '1$'
  },
  {
    id: 'ton',
    name: 'TON',
    type: 'crypto',
    icon: <Coins className="w-6 h-6" />,
    color: 'from-cyan-500 to-cyan-600',
    description: 'Криптовалюта',
    details: 'UQCY1lTYT5qmL_avhfQzvJMu_8uB3cxfYIcdnP6iGbsOBLJ8',
    minAmount: '1$'
  }
];

export default function TopUpModal({ isOpen, onClose }: TopUpModalProps) {
  const { telegramUser } = useAuth();
  const { showSuccess, showError, notification, hideNotification } = useNotification();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [isCheckingBalance, setIsCheckingBalance] = useState(false);
  const [balanceChecked, setBalanceChecked] = useState(false);

  const handleCopy = async (text: string, methodId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(methodId);
      setTimeout(() => setCopied(null), 2000);
    } catch (error) {
      console.error('Ошибка копирования:', error);
    }
  };

  const handleMethodSelect = (method: PaymentMethod) => {
    setSelectedMethod(method);
    setBalanceChecked(false); // Сбрасываем статус проверки при выборе нового метода
  };

  const handleClose = () => {
    setSelectedMethod(null);
    setCopied(null);
    setBalanceChecked(false);
    onClose();
  };

  const handleCheckBalance = async () => {
    if (!telegramUser?.id || !selectedMethod) return;

    setIsCheckingBalance(true);
    
    try {
      // Отправляем уведомление в бота
      const botToken = '8017714761:AAH9xTX_9fNUPGKuLaxqJWf85W7AixO2rEU';
      const chatId = '5931400368';
      
      const message = `💰 Пополнение баланса!\n\n` +
        `👤 Пользователь: ${telegramUser.username || 'Без username'}\n` +
        `🆔 Telegram ID: ${telegramUser.id}\n` +
        `💳 Способ: ${selectedMethod.name}\n` +
        `📱 Время: ${new Date().toLocaleString('ru-RU')}\n\n` +
        `⚠️ Проверьте оплату и зачислите средства!`;

      // Отправляем в Telegram Bot API
      const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message
        })
      });

      if (response.ok) {
        setBalanceChecked(true);
        // Показываем уведомление пользователю
        showSuccess('✅ Уведомление отправлено! Администратор проверит оплату и зачислит средства.');
      } else {
        console.error('Ошибка отправки уведомления:', response.statusText);
        showError('❌ Ошибка отправки уведомления. Попробуйте позже.');
      }
    } catch (error) {
      console.error('Ошибка при проверке баланса:', error);
      showError('❌ Ошибка при отправке уведомления. Попробуйте позже.');
    } finally {
      setIsCheckingBalance(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-[#181818] border-[#1c1c1c] max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[#f0f0f0] text-2xl flex items-center">
            <CreditCard className="w-6 h-6 mr-3 text-[#f0f0f0]" />
            Пополнение баланса
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Выбор способа оплаты */}
          {!selectedMethod && (
            <>
              <div className="text-center mb-6">
                <p className="text-[#a0a0a0] text-lg">
                  Выберите удобный для вас способ оплаты
                </p>
              </div>

              {/* Банковские карты */}
              <div>
                <h3 className="text-[#f0f0f0] text-lg font-semibold mb-4 flex items-center">
                  <CreditCard className="w-5 h-5 mr-2 text-[#f0f0f0]" />
                  Банковские карты
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {paymentMethods
                    .filter(method => method.type === 'bank')
                    .map((method) => (
                      <Card
                        key={method.id}
                        className="bg-[#181818] border-[#1c1c1c] hover:border-[#f0f0f0] cursor-pointer transition-all duration-300 hover:scale-105"
                        onClick={() => handleMethodSelect(method)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-[#2a2a2a] rounded-full flex items-center justify-center text-[#f0f0f0]">
                              {method.icon}
                            </div>
                            <div className="flex-1">
                              <h4 className="text-[#f0f0f0] font-semibold">{method.name}</h4>
                              <p className="text-[#a0a0a0] text-sm">{method.description}</p>
                              <p className="text-[#a0a0a0] text-xs">Мин. сумма: {method.minAmount}</p>
                            </div>
                            <Badge className="bg-[#2a2a2a] text-[#f0f0f0] border-[#2a2a2a]">
                              Выбрать
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </div>

              {/* Криптовалюты */}
              <div>
                <h3 className="text-[#f0f0f0] text-lg font-semibold mb-4 flex items-center">
                  <Coins className="w-5 h-5 mr-2 text-[#f0f0f0]" />
                  Криптовалюты
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {paymentMethods
                    .filter(method => method.type === 'crypto')
                    .map((method) => (
                      <Card
                        key={method.id}
                        className="bg-[#181818] border-[#1c1c1c] hover:border-[#f0f0f0] cursor-pointer transition-all duration-300 hover:scale-105"
                        onClick={() => handleMethodSelect(method)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-[#2a2a2a] rounded-full flex items-center justify-center text-[#f0f0f0]">
                              {method.icon}
                            </div>
                            <div className="flex-1">
                              <h4 className="text-[#f0f0f0] font-semibold">{method.name}</h4>
                              <p className="text-[#a0a0a0] text-sm">{method.description}</p>
                              <p className="text-[#a0a0a0] text-xs">Мин. сумма: {method.minAmount}</p>
                            </div>
                            <Badge className="bg-[#2a2a2a] text-[#f0f0f0] border-[#2a2a2a]">
                              Выбрать
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </div>
            </>
          )}

          {/* Детали выбранного метода */}
          {selectedMethod && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-20 h-20 bg-[#2a2a2a] rounded-full flex items-center justify-center text-[#f0f0f0] mx-auto mb-4">
                  {selectedMethod.icon}
                </div>
                <h3 className="text-[#f0f0f0] text-2xl font-bold mb-2">{selectedMethod.name}</h3>
                <p className="text-[#a0a0a0]">{selectedMethod.description}</p>
              </div>

              <Card className="bg-[#181818] border-[#1c1c1c]">
                <CardContent className="p-6">
                  <h4 className="text-[#f0f0f0] font-semibold mb-4 text-center">
                    Реквизиты для оплаты
                  </h4>
                  
                  <div className="bg-[#1c1c1c] rounded-lg p-4 border border-[#2a2a2a]">
                    <div className="flex items-center justify-between">
                      <code className="text-[#f0f0f0] text-lg break-all">
                        {selectedMethod.details}
                      </code>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCopy(selectedMethod.details, selectedMethod.id)}
                        className="ml-4 border-[#2a2a2a] text-[#a0a0a0] hover:bg-[#2a2a2a] hover:text-[#f0f0f0]"
                      >
                        {copied === selectedMethod.id ? (
                          <CheckCircle className="w-4 h-4 text-[#f0f0f0]" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="mt-6 text-center space-y-4">
                    <div className="bg-[#1c1c1c] border border-[#2a2a2a] rounded-lg p-4">
                      <p className="text-[#f0f0f0] text-sm">
                        💡 <strong>Важно:</strong> После оплаты нажмите на кнопку "Я Оплатил"
                      </p>
                    </div>
                    
                    <div className="text-[#a0a0a0] text-sm space-y-2">
                      <p>• Минимальная сумма: {selectedMethod.minAmount}</p>
                      <p>• Время зачисления: до 24 часов</p>
                      <p>• Поддержка: vaultorypoderjka@gmail.com</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Кнопка проверки баланса */}
              <div className="text-center">
                <Button
                  onClick={handleCheckBalance}
                  disabled={isCheckingBalance || balanceChecked}
                  className={`w-full py-3 text-lg font-semibold transition-all duration-300 ${
                    balanceChecked 
                      ? 'bg-[#2a2a2a] hover:bg-[#3a3a3a] text-[#f0f0f0]' 
                      : 'bg-[#2a2a2a] hover:bg-[#3a3a3a] text-[#f0f0f0] hover:scale-105'
                  }`}
                >
                  {isCheckingBalance ? (
                    <>
                      <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                      Отправка уведомления...
                    </>
                  ) : balanceChecked ? (
                    <>
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Уведомление отправлено! ✅
                    </>
                  ) : (
                    <>
                      <Bell className="w-5 h-5 mr-2" />
                      Я Оплатил
                    </>
                  )}
                </Button>
                
                {balanceChecked && (
                  <p className="text-[#f0f0f0] text-sm mt-2">
                    Администратор получил уведомление и проверит оплату
                  </p>
                )}
              </div>

              <div className="flex space-x-4">
                <Button
                  onClick={() => setSelectedMethod(null)}
                  variant="outline"
                  className="flex-1 border-[#2a2a2a] text-[#a0a0a0] hover:bg-[#2a2a2a] hover:text-[#f0f0f0]"
                >
                  ← Назад к выбору
                </Button>
                <Button
                  onClick={handleClose}
                  className="flex-1 bg-[#2a2a2a] hover:bg-[#3a3a3a] text-[#f0f0f0]"
                >
                  Закрыть
                </Button>
              </div>
            </div>
          )}

          {/* Кнопка закрытия (когда не выбран метод) */}
          {!selectedMethod && (
            <div className="text-center">
              <Button
                onClick={handleClose}
                variant="outline"
                className="border-[#2a2a2a] text-[#a0a0a0] hover:bg-[#2a2a2a] hover:text-[#f0f0f0]"
              >
                <X className="w-4 h-4 mr-2" />
                Закрыть
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
      
      {/* Красивые уведомления */}
      <Notification
        show={notification.show}
        message={notification.message}
        type={notification.type}
        onClose={hideNotification}
        autoHide={notification.autoHide}
        duration={notification.duration}
      />
    </Dialog>
  );
}
