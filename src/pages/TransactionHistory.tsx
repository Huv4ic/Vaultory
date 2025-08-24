import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Clock, TrendingUp, TrendingDown, Gift, ShoppingCart, Wallet, Filter } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface Transaction {
  id: string;
  user_id: number;
  type: 'deposit' | 'withdrawal' | 'purchase' | 'refund';
  amount: number;
  description: string;
  order_id?: string;
  created_at: string;
}

const TransactionHistory = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { telegramUser } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'deposits' | 'withdrawals' | 'cases' | 'purchases'>('all');

  // Загружаем реальные транзакции пользователя из базы данных
  const fetchUserTransactions = async () => {
      if (!telegramUser) return;
      
      try {
        setLoading(true);
        
        // Загружаем транзакции пользователя по telegram_id
        const { data, error } = await supabase
          .from('transactions')
          .select('*')
          .eq('user_id', telegramUser.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Ошибка загрузки транзакций:', error);
          // Если таблица не существует или ошибка, показываем пустой список
          setTransactions([]);
        } else {
          // Преобразуем данные в нужный формат
          const formattedTransactions: Transaction[] = (data || []).map((tx: any) => ({
            id: tx.id,
            user_id: tx.user_id,
            type: tx.type,
            amount: tx.amount,
            description: tx.description,
            order_id: tx.order_id,
            created_at: tx.created_at
          }));
          
          setTransactions(formattedTransactions);
          
          // Логируем для отладки
          console.log('Загружено транзакций:', formattedTransactions.length);
        }
      } catch (error) {
        console.error('Ошибка при загрузке транзакций:', error);
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };

  // Загружаем реальные транзакции пользователя из базы данных
  useEffect(() => {
    fetchUserTransactions();
  }, [telegramUser]);

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <TrendingUp className="w-5 h-5 text-green-400" />;
      case 'withdrawal':
        return <TrendingDown className="w-5 h-5 text-red-400" />;
      case 'case_opening':
        return <Gift className="w-5 h-5 text-amber-400" />;
      case 'purchase':
        return <ShoppingCart className="w-5 h-5 text-blue-400" />;
      case 'refund':
        return <Wallet className="w-5 h-5 text-purple-400" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getTransactionTypeText = (type: string) => {
    switch (type) {
      case 'deposit':
        return 'Пополнение';
      case 'withdrawal':
        return 'Списание';
      case 'purchase':
        return 'Покупка';
      case 'refund':
        return 'Возврат';
      case 'purchase':
        return 'Покупка';
      case 'refund':
        return 'Возврат';
      default:
        return 'Транзакция';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-400';
      case 'pending':
        return 'text-amber-400';
      case 'failed':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Завершено';
      case 'pending':
        return 'В обработке';
      case 'failed':
        return 'Ошибка';
      default:
        return 'Неизвестно';
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    if (filter === 'all') return true;
    if (filter === 'deposits') return transaction.type === 'deposit';
    if (filter === 'withdrawals') return transaction.type === 'withdrawal';
    if (filter === 'cases') return transaction.type === 'purchase';
    if (filter === 'purchases') return transaction.type === 'purchase';
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-amber-400/30 mx-auto mb-4"></div>
            <div className="absolute inset-0 animate-spin rounded-full h-16 w-16 border-4 border-transparent border-t-amber-400 mx-auto"></div>
          </div>
          <p className="text-gray-300 text-xl">Загрузка истории транзакций...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/20"></div>
        <div className="relative z-10 container mx-auto px-4 py-12 sm:py-16 md:py-20 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
            📊 История транзакций
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 mb-8 sm:mb-12 max-w-4xl mx-auto leading-relaxed px-4">
            Отслеживайте все ваши финансовые операции на платформе Vaultory
          </p>
        </div>
        
        {/* Анимированные элементы фона */}
        <div className="absolute top-20 left-10 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-amber-400/10 rounded-full animate-bounce hidden md:block"></div>
        <div className="absolute top-40 right-20 w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-amber-500/10 rounded-full animate-pulse hidden md:block"></div>
        <div className="absolute bottom-20 left-1/4 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-amber-400/10 rounded-full animate-spin hidden md:block"></div>
      </div>

      {/* Основной контент */}
      <div className="relative z-20 container mx-auto px-4 pb-12 sm:pb-16 md:pb-20">
        {/* Фильтры */}
        <div className="mb-6 sm:mb-8">
          <div className="bg-black/40 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-amber-500/30 shadow-2xl shadow-amber-500/20 p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4 flex items-center">
              <Filter className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-amber-400" />
              Фильтры
            </h2>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {[
                { value: 'all', label: 'Все', icon: <TrendingUp className="w-4 h-4" /> },
                { value: 'deposits', label: 'Пополнения', icon: <TrendingUp className="w-4 h-4" /> },
                { value: 'withdrawals', label: 'Выводы', icon: <TrendingDown className="w-4 h-4" /> },
                { value: 'cases', label: 'Кейсы', icon: <Gift className="w-4 h-4" /> },
                { value: 'purchases', label: 'Покупки', icon: <ShoppingCart className="w-4 h-4" /> }
              ].map((filterOption) => (
                <Button
                  key={filterOption.value}
                  onClick={() => setFilter(filterOption.value as any)}
                  variant={filter === filterOption.value ? "default" : "outline"}
                  className={`px-3 sm:px-4 py-2 text-xs sm:text-sm rounded-lg sm:rounded-xl transition-all duration-300 ${
                    filter === filterOption.value
                      ? 'bg-amber-500 hover:bg-amber-600 text-white'
                      : 'bg-black/60 backdrop-blur-sm border border-amber-500/40 text-amber-300 hover:bg-amber-500/20 hover:border-amber-400 hover:text-amber-200'
                  }`}
                >
                  <span className="mr-1 sm:mr-2">{filterOption.icon}</span>
                  {filterOption.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Список транзакций */}
        <div className="space-y-3 sm:space-y-4">
          {loading ? (
            <div className="text-center py-12 sm:py-16">
              <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-2 border-amber-400 mx-auto mb-4 sm:mb-6"></div>
              <p className="text-lg sm:text-xl text-gray-300">Загрузка транзакций...</p>
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="text-center py-12 sm:py-16">
              <Wallet className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 text-gray-600" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-400 mb-2">Транзакции не найдены</h3>
              <p className="text-gray-500 text-sm sm:text-base">
                {filter === 'all' 
                  ? 'У вас пока нет транзакций' 
                  : `Транзакции типа "${filter}" не найдены`}
              </p>
            </div>
          ) : (
            filteredTransactions.map((transaction) => (
              <Card key={transaction.id} className="bg-black/40 backdrop-blur-xl border-amber-500/30 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 transition-all duration-300">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <div className="flex-shrink-0">
                        {getTransactionIcon(transaction.type)}
                      </div>
                      <div>
                        <div className="text-base sm:text-lg font-semibold text-white">
                          {getTransactionTypeText(transaction.type)}
                        </div>
                        <div className="text-gray-300 text-sm">
                          {transaction.description}
                        </div>
                        <div className="text-gray-400 text-xs">
                          {new Date(transaction.created_at).toLocaleString('ru-RU')}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg sm:text-xl font-bold ${transaction.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {transaction.amount > 0 ? '+' : ''}{transaction.amount}₴
                      </div>
                      {transaction.order_id && (
                        <div className="text-gray-400 text-xs sm:text-sm">
                          Заказ: {transaction.order_id}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Кнопка назад */}
        <div className="text-center mt-8 sm:mt-12">
          <Button
            onClick={() => navigate('/')}
            variant="outline"
            className="px-6 sm:px-8 py-2 sm:py-3 bg-black/60 backdrop-blur-sm border border-amber-500/40 text-amber-300 hover:bg-amber-500/20 hover:border-amber-400 hover:text-amber-200 transition-all duration-300 shadow-lg shadow-amber-500/20 rounded-lg sm:rounded-xl text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Вернуться на главную
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TransactionHistory;
