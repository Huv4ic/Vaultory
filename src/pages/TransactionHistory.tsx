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
        return <Gift className="w-5 h-5 text-[#a31212]" />;
      case 'purchase':
        return <ShoppingCart className="w-5 h-5 text-[#a31212]" />;
      case 'refund':
        return <Wallet className="w-5 h-5 text-[#a31212]" />;
      default:
        return <Clock className="w-5 h-5 text-[#a0a0a0]" />;
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
      <div className="min-h-screen bg-[#0e0e0e] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#a31212] mx-auto mb-4"></div>
          <p className="text-[#a0a0a0] text-xl">Загрузка истории транзакций...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0e0e0e]">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="relative z-10 container mx-auto px-4 py-12 sm:py-16 md:py-20 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-[#f0f0f0]">
            📊 История транзакций
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-[#a0a0a0] mb-8 sm:mb-12 max-w-4xl mx-auto leading-relaxed px-4">
            Отслеживайте все ваши финансовые операции на платформе Vaultory
          </p>
        </div>
      </div>

      {/* Основной контент */}
      <div className="relative z-20 container mx-auto px-4 pb-12 sm:pb-16 md:pb-20">
        {/* Фильтры */}
        <div className="mb-6 sm:mb-8">
          <div className="bg-[#181818] rounded-xl sm:rounded-2xl border border-[#1c1c1c] p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold text-[#f0f0f0] mb-3 sm:mb-4 flex items-center">
              <Filter className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-[#a31212]" />
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
                      ? 'bg-[#a31212] hover:bg-[#8a0f0f] text-white'
                      : 'bg-[#181818] border border-[#1c1c1c] text-[#f0f0f0] hover:bg-[#a31212] hover:border-[#a31212] hover:text-white'
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
              <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-2 border-[#a31212] mx-auto mb-4 sm:mb-6"></div>
              <p className="text-lg sm:text-xl text-[#a0a0a0]">Загрузка транзакций...</p>
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="text-center py-12 sm:py-16">
              <Wallet className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 text-[#a0a0a0]" />
              <h3 className="text-lg sm:text-xl font-semibold text-[#a0a0a0] mb-2">Транзакции не найдены</h3>
              <p className="text-[#a0a0a0] text-sm sm:text-base">
                {filter === 'all' 
                  ? 'У вас пока нет транзакций' 
                  : `Транзакции типа "${filter}" не найдены`}
              </p>
            </div>
          ) : (
            filteredTransactions.map((transaction) => (
              <Card key={transaction.id} className="bg-[#181818] border border-[#1c1c1c] hover:border-[#a31212] transition-all duration-300">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <div className="flex-shrink-0">
                        {getTransactionIcon(transaction.type)}
                      </div>
                      <div>
                        <div className="text-base sm:text-lg font-semibold text-[#f0f0f0]">
                          {getTransactionTypeText(transaction.type)}
                        </div>
                        <div className="text-[#a0a0a0] text-sm">
                          {transaction.description}
                        </div>
                        <div className="text-[#a0a0a0] text-xs">
                          {new Date(transaction.created_at).toLocaleString('ru-RU')}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg sm:text-xl font-bold ${transaction.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {transaction.amount > 0 ? '+' : ''}{transaction.amount}₴
                      </div>
                      {transaction.order_id && (
                        <div className="text-[#a0a0a0] text-xs sm:text-sm">
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
            className="px-6 sm:px-8 py-2 sm:py-3 bg-[#181818] border border-[#1c1c1c] text-[#f0f0f0] hover:bg-[#a31212] hover:border-[#a31212] hover:text-white transition-all duration-300 rounded-lg sm:rounded-xl text-sm sm:text-base"
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
