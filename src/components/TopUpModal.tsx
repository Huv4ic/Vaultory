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
  CheckCircle
} from 'lucide-react';

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
}

const paymentMethods: PaymentMethod[] = [
  {
    id: 'monobank',
    name: 'Monobank',
    type: 'bank',
    icon: <CreditCard className="w-6 h-6" />,
    color: 'from-purple-500 to-purple-600',
    description: 'Банковская карта',
    details: '5375 4141 0000 0000'
  },
  {
    id: 'pumb',
    name: 'PUMB',
    type: 'bank',
    icon: <Banknote className="w-6 h-6" />,
    color: 'from-blue-500 to-blue-600',
    description: 'Банковская карта',
    details: '4149 4393 0000 0000'
  },
  {
    id: 'privatbank',
    name: 'Privatbank',
    type: 'bank',
    icon: <CreditCard className="w-6 h-6" />,
    color: 'from-green-500 to-green-600',
    description: 'Банковская карта',
    details: '5168 7554 0000 0000'
  },
  {
    id: 'pumb-us',
    name: 'PUMB US',
    type: 'bank',
    icon: <Banknote className="w-6 h-6" />,
    color: 'from-indigo-500 to-indigo-600',
    description: 'Долларовая карта',
    details: '4149 4393 0000 0000'
  },
  {
    id: 'usdt-trc20',
    name: 'USDT TRC20',
    type: 'crypto',
    icon: <Coins className="w-6 h-6" />,
    color: 'from-orange-500 to-orange-600',
    description: 'Криптовалюта',
    details: 'TRC20: TQn9Y2khDDcoGYGqVMxRQqBqRjFf9T72op'
  },
  {
    id: 'usdt-erc20',
    name: 'USDT ERC20',
    type: 'crypto',
    icon: <Coins className="w-6 h-6" />,
    color: 'from-blue-500 to-blue-600',
    description: 'Криптовалюта',
    details: 'ERC20: 0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6'
  },
  {
    id: 'usdc-erc20',
    name: 'USDC ERC20',
    type: 'crypto',
    icon: <Coins className="w-6 h-6" />,
    color: 'from-green-500 to-green-600',
    description: 'Криптовалюта',
    details: 'ERC20: 0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6'
  },
  {
    id: 'ltc',
    name: 'LTC',
    type: 'crypto',
    icon: <Coins className="w-6 h-6" />,
    color: 'from-gray-500 to-gray-600',
    description: 'Криптовалюта',
    details: 'LTC: LQn9Y2khDDcoGYGqVMxRQqBqRjFf9T72op'
  },
  {
    id: 'ton',
    name: 'TON',
    type: 'crypto',
    icon: <Coins className="w-6 h-6" />,
    color: 'from-cyan-500 to-cyan-600',
    description: 'Криптовалюта',
    details: 'TON: UQn9Y2khDDcoGYGqVMxRQqBqRjFf9T72op'
  }
];

export default function TopUpModal({ isOpen, onClose }: TopUpModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

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
  };

  const handleClose = () => {
    setSelectedMethod(null);
    setCopied(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-black/90 backdrop-blur-xl border-amber-500/30 max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white text-2xl flex items-center">
            <CreditCard className="w-6 h-6 mr-3 text-amber-400" />
            Пополнение баланса
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Выбор способа оплаты */}
          {!selectedMethod && (
            <>
              <div className="text-center mb-6">
                <p className="text-gray-300 text-lg">
                  Выберите удобный для вас способ оплаты
                </p>
              </div>

              {/* Банковские карты */}
              <div>
                <h3 className="text-white text-lg font-semibold mb-4 flex items-center">
                  <CreditCard className="w-5 h-5 mr-2 text-blue-400" />
                  Банковские карты
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {paymentMethods
                    .filter(method => method.type === 'bank')
                    .map((method) => (
                      <Card
                        key={method.id}
                        className="bg-black/40 backdrop-blur-sm border-amber-500/20 hover:border-amber-400/40 cursor-pointer transition-all duration-300 hover:scale-105"
                        onClick={() => handleMethodSelect(method)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3">
                            <div className={`w-12 h-12 bg-gradient-to-r ${method.color} rounded-full flex items-center justify-center text-white`}>
                              {method.icon}
                            </div>
                            <div className="flex-1">
                              <h4 className="text-white font-semibold">{method.name}</h4>
                              <p className="text-gray-400 text-sm">{method.description}</p>
                            </div>
                            <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
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
                <h3 className="text-white text-lg font-semibold mb-4 flex items-center">
                  <Coins className="w-5 h-5 mr-2 text-green-400" />
                  Криптовалюты
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {paymentMethods
                    .filter(method => method.type === 'crypto')
                    .map((method) => (
                      <Card
                        key={method.id}
                        className="bg-black/40 backdrop-blur-sm border-amber-500/20 hover:border-amber-400/40 cursor-pointer transition-all duration-300 hover:scale-105"
                        onClick={() => handleMethodSelect(method)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3">
                            <div className={`w-12 h-12 bg-gradient-to-r ${method.color} rounded-full flex items-center justify-center text-white`}>
                              {method.icon}
                            </div>
                            <div className="flex-1">
                              <h4 className="text-white font-semibold">{method.name}</h4>
                              <p className="text-gray-400 text-sm">{method.description}</p>
                            </div>
                            <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
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
                <div className={`w-20 h-20 bg-gradient-to-r ${selectedMethod.color} rounded-full flex items-center justify-center text-white mx-auto mb-4`}>
                  {selectedMethod.icon}
                </div>
                <h3 className="text-white text-2xl font-bold mb-2">{selectedMethod.name}</h3>
                <p className="text-gray-400">{selectedMethod.description}</p>
              </div>

              <Card className="bg-black/40 backdrop-blur-sm border-amber-500/30">
                <CardContent className="p-6">
                  <h4 className="text-white font-semibold mb-4 text-center">
                    Реквизиты для оплаты
                  </h4>
                  
                  <div className="bg-black/60 backdrop-blur-sm rounded-lg p-4 border border-amber-500/20">
                    <div className="flex items-center justify-between">
                      <code className="text-amber-400 text-lg break-all">
                        {selectedMethod.details}
                      </code>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCopy(selectedMethod.details, selectedMethod.id)}
                        className="ml-4 border-amber-500/40 text-amber-400 hover:bg-amber-500/20"
                      >
                        {copied === selectedMethod.id ? (
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="mt-6 text-center space-y-4">
                    <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
                      <p className="text-amber-400 text-sm">
                        💡 <strong>Важно:</strong> После оплаты отправьте скриншот чека в поддержку
                      </p>
                    </div>
                    
                    <div className="text-gray-300 text-sm space-y-2">
                      <p>• Минимальная сумма: 100₴</p>
                      <p>• Время зачисления: до 24 часов</p>
                      <p>• Поддержка: vaultorypoderjka@gmail.com</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex space-x-4">
                <Button
                  onClick={() => setSelectedMethod(null)}
                  variant="outline"
                  className="flex-1 border-amber-500/40 text-amber-400 hover:bg-amber-500/20"
                >
                  ← Назад к выбору
                </Button>
                <Button
                  onClick={handleClose}
                  className="flex-1 bg-amber-500 hover:bg-amber-600 text-white"
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
                className="border-amber-500/40 text-amber-400 hover:bg-amber-500/20"
              >
                <X className="w-4 h-4 mr-2" />
                Закрыть
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
