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
  type: 'deposit' | 'withdrawal' | 'case_opening' | 'purchase' | 'refund';
  amount: number;
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  balance_after: number;
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
            type: tx.type || tx.transaction_type,
            amount: tx.amount,
            description: tx.description || tx.note,
            date: tx.created_at || tx.date,
            status: tx.status || 'completed',
            balance_after: tx.balance_after || tx.balance || 0
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
      case 'case_opening':
        return 'Открытие кейса';
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
    if (filter === 'cases') return transaction.type === 'case_opening';
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
        <div className="relative z-10 container mx-auto px-4 py-20 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent animate-pulse">
            📊 {t('История транзакций')}
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
            Отслеживайте все ваши финансовые операции: пополнения, покупки, открытие кейсов и многое другое.
          </p>
        </div>
        
        {/* Анимированные элементы фона */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-amber-400/10 rounded-full animate-bounce"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-amber-500/10 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-amber-400/10 rounded-full animate-spin"></div>
      </div>

      {/* Основной контент */}
      <div className="relative z-20 container mx-auto px-4 pb-20">
        {/* Фильтры */}
        <div className="mb-8">
          <Card className="bg-black/40 backdrop-blur-xl border-amber-500/30 shadow-2xl shadow-amber-500/20">
            <CardContent className="p-6">
              <div className="flex flex-wrap justify-center gap-4">
                <Button
                  onClick={() => setFilter('all')}
                  variant={filter === 'all' ? 'default' : 'outline'}
                  className={filter === 'all' 
                    ? 'bg-gradient-to-r from-amber-500 to-emerald-600 text-white shadow-2xl shadow-amber-500/30'
                    : 'bg-black/60 backdrop-blur-sm border border-amber-500/40 text-amber-300 hover:bg-amber-500/20 hover:border-amber-400 hover:text-amber-200'
                  }
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Все транзакции
                </Button>
                <Button
                  onClick={() => setFilter('deposits')}
                  variant={filter === 'deposits' ? 'default' : 'outline'}
                  className={filter === 'deposits' 
                    ? 'bg-gradient-to-r from-amber-500 to-emerald-600 text-white shadow-2xl shadow-amber-500/30'
                    : 'bg-black/60 backdrop-blur-sm border border-amber-500/40 text-amber-300 hover:bg-amber-500/20 hover:border-amber-400 hover:text-amber-200'
                  }
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Пополнения
                </Button>
                <Button
                  onClick={() => setFilter('withdrawals')}
                  variant={filter === 'withdrawals' ? 'default' : 'outline'}
                  className={filter === 'withdrawals' 
                    ? 'bg-gradient-to-r from-amber-500 to-emerald-600 text-white shadow-2xl shadow-amber-500/30'
                    : 'bg-black/60 backdrop-blur-sm border border-amber-500/40 text-amber-300 hover:bg-amber-500/20 hover:border-amber-400 hover:text-amber-200'
                  }
                >
                  <TrendingDown className="w-4 h-4 mr-2" />
                  Списания
                </Button>
                <Button
                  onClick={() => setFilter('cases')}
                  variant={filter === 'cases' ? 'default' : 'outline'}
                  className={filter === 'cases' 
                    ? 'bg-gradient-to-r from-amber-500 to-emerald-600 text-white shadow-2xl shadow-amber-500/30'
                    : 'bg-black/60 backdrop-blur-sm border border-amber-500/40 text-amber-300 hover:bg-amber-500/20 hover:border-amber-400 hover:text-amber-200'
                  }
                >
                  <Gift className="w-4 h-4 mr-2" />
                  Кейсы
                </Button>
                <Button
                  onClick={() => setFilter('purchases')}
                  variant={filter === 'purchases' ? 'default' : 'outline'}
                  className={filter === 'purchases' 
                    ? 'bg-gradient-to-r from-amber-500 to-emerald-600 text-white shadow-2xl shadow-amber-500/30'
                    : 'bg-black/60 backdrop-blur-sm border border-amber-500/40 text-amber-300 hover:bg-amber-500/20 hover:border-amber-400 hover:text-amber-200'
                  }
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Покупки
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Список транзакций */}
        <div className="space-y-4">
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-20">
              <div className="mx-auto w-24 h-24 bg-amber-500/20 rounded-full flex items-center justify-center mb-6 border border-amber-500/30">
                <Clock className="w-12 h-12 text-amber-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Транзакции не найдены</h3>
              <p className="text-gray-300 mb-6 max-w-md mx-auto">
                Попробуйте изменить фильтр или у вас пока нет транзакций
              </p>
            </div>
          ) : (
            filteredTransactions.map((transaction) => (
              <Card key={transaction.id} className="bg-black/40 backdrop-blur-xl border-amber-500/30 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        {getTransactionIcon(transaction.type)}
                      </div>
                      <div>
                        <div className="text-lg font-semibold text-white">
                          {getTransactionTypeText(transaction.type)}
                        </div>
                        <div className="text-gray-300 text-sm">
                          {transaction.description}
                        </div>
                        <div className="text-gray-400 text-xs">
                          {new Date(transaction.date).toLocaleString('ru-RU')}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-xl font-bold ${transaction.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {transaction.amount > 0 ? '+' : ''}{transaction.amount}₴
                      </div>
                      <div className="text-gray-400 text-sm">
                        Баланс: {transaction.balance_after}₴
                      </div>
                      <div className={`text-xs font-medium ${getStatusColor(transaction.status)}`}>
                        {getStatusText(transaction.status)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Кнопка назад */}
        <div className="text-center mt-16">
          <Button
            onClick={() => navigate('/profile')}
            variant="outline"
            className="px-8 py-3 bg-black/60 backdrop-blur-sm border border-amber-500/40 text-amber-300 hover:bg-amber-500/20 hover:border-amber-400 hover:text-amber-200 transition-all duration-300 shadow-lg shadow-amber-500/20 rounded-xl"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Вернуться в профиль
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TransactionHistory;
