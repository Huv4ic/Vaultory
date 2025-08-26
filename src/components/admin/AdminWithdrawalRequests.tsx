import React, { useState, useEffect } from 'react';
import { useWithdrawalRequests, WithdrawalRequest } from '../../hooks/useWithdrawalRequests';
import { useNotification } from '../../hooks/useNotification';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  Package, 
  User, 
  Clock, 
  CheckCircle, 
  XCircle, 
  MessageSquare,
  ExternalLink,
  Filter
} from 'lucide-react';

const AdminWithdrawalRequests: React.FC = () => {
  const { 
    requests, 
    loading, 
    fetchAllRequests, 
    updateRequestStatus 
  } = useWithdrawalRequests();
  
  const { showSuccess, showError } = useNotification();
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<WithdrawalRequest | null>(null);
  const [adminNotes, setAdminNotes] = useState('');

  // Загружаем запросы при монтировании
  useEffect(() => {
    fetchAllRequests();
  }, []);

  // Фильтруем запросы по статусу
  const filteredRequests = requests.filter(request => 
    selectedStatus === 'all' || request.status === selectedStatus
  );

  // Получаем цвет статуса
  const getStatusColor = (status: WithdrawalRequest['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'processing': return 'bg-blue-500';
      case 'completed': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  // Получаем название статуса
  const getStatusName = (status: WithdrawalRequest['status']) => {
    switch (status) {
      case 'pending': return 'Ожидает';
      case 'processing': return 'В обработке';
      case 'completed': return 'Выполнен';
      case 'rejected': return 'Отклонен';
      default: return 'Неизвестно';
    }
  };

  // Обработка изменения статуса
  const handleStatusUpdate = async (
    requestId: string, 
    newStatus: WithdrawalRequest['status']
  ) => {
    const success = await updateRequestStatus(requestId, newStatus, adminNotes);
    if (success) {
      setShowModal(false);
      setSelectedRequest(null);
      setAdminNotes('');
      fetchAllRequests(); // Перезагружаем данные
    }
  };

  // Форматирование даты
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ru-RU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Подсчет статистики
  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    processing: requests.filter(r => r.status === 'processing').length,
    completed: requests.filter(r => r.status === 'completed').length,
    rejected: requests.filter(r => r.status === 'rejected').length
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Запросы на вывод</h1>
        <Button
          onClick={() => fetchAllRequests()}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {loading ? 'Загрузка...' : 'Обновить'}
        </Button>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-white">{stats.total}</div>
            <div className="text-sm text-gray-400">Всего</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400">{stats.pending}</div>
            <div className="text-sm text-gray-400">Ожидают</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">{stats.processing}</div>
            <div className="text-sm text-gray-400">В обработке</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-400">{stats.completed}</div>
            <div className="text-sm text-gray-400">Выполнено</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-400">{stats.rejected}</div>
            <div className="text-sm text-gray-400">Отклонено</div>
          </CardContent>
        </Card>
      </div>

      {/* Фильтры */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            Фильтры
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {[
              { value: 'all', label: 'Все' },
              { value: 'pending', label: 'Ожидают' },
              { value: 'processing', label: 'В обработке' },
              { value: 'completed', label: 'Выполнено' },
              { value: 'rejected', label: 'Отклонено' }
            ].map((filter) => (
              <Button
                key={filter.value}
                onClick={() => setSelectedStatus(filter.value)}
                variant={selectedStatus === filter.value ? 'default' : 'outline'}
                size="sm"
                className={selectedStatus === filter.value 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'border-gray-600 text-gray-300 hover:bg-gray-700'
                }
              >
                {filter.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Список запросов */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-gray-400 mt-4">Загрузка запросов...</p>
          </div>
        ) : filteredRequests.length === 0 ? (
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-8 text-center">
              <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">
                {selectedStatus === 'all' 
                  ? 'Нет запросов на вывод' 
                  : `Нет запросов со статусом "${getStatusName(selectedStatus as WithdrawalRequest['status'])}"`
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredRequests.map((request) => (
            <Card key={request.id} className="bg-gray-800 border-gray-700 hover:border-gray-600 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Package className="w-6 h-6 text-blue-400" />
                    <div>
                      <h3 className="text-lg font-semibold text-white">{request.item_name}</h3>
                      <p className="text-sm text-gray-400">ID: {request.id.slice(0, 8)}...</p>
                    </div>
                  </div>
                  <Badge className={`${getStatusColor(request.status)} text-white`}>
                    {getStatusName(request.status)}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center space-x-2 text-gray-300">
                    <User className="w-4 h-4" />
                    <span className="text-sm">
                      Пользователь: {request.telegram_username}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-gray-300">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">
                      Создан: {formatDate(request.created_at)}
                    </span>
                  </div>
                </div>

                {request.admin_notes && (
                  <div className="bg-gray-700/50 rounded-lg p-3 mb-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <MessageSquare className="w-4 h-4 text-blue-400" />
                      <span className="text-sm font-medium text-blue-400">Заметки админа:</span>
                    </div>
                    <p className="text-sm text-gray-300">{request.admin_notes}</p>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Button
                      onClick={() => window.open(`https://t.me/${request.telegram_username.replace('@', '')}`, '_blank')}
                      size="sm"
                      variant="outline"
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      <ExternalLink className="w-4 h-4 mr-1" />
                      Telegram
                    </Button>
                  </div>

                  <div className="flex items-center space-x-2">
                    {request.status === 'pending' && (
                      <>
                        <Button
                          onClick={() => {
                            setSelectedRequest(request);
                            setAdminNotes('');
                            setShowModal(true);
                          }}
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Взять в работу
                        </Button>
                        <Button
                          onClick={() => handleStatusUpdate(request.id, 'rejected')}
                          size="sm"
                          variant="outline"
                          className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Отклонить
                        </Button>
                      </>
                    )}
                    
                    {request.status === 'processing' && (
                      <Button
                        onClick={() => handleStatusUpdate(request.id, 'completed')}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Выполнено
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Модальное окно для добавления заметок */}
      {showModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-2xl p-6 max-w-md w-full border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-4">
              Взять в работу
            </h3>
            
            <div className="mb-4">
              <p className="text-gray-300 mb-2">Предмет: <strong>{selectedRequest.item_name}</strong></p>
              <p className="text-gray-300 mb-4">Пользователь: <strong>{selectedRequest.telegram_username}</strong></p>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Заметки (опционально)
              </label>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
                rows={3}
                placeholder="Добавьте заметки для этого запроса..."
              />
            </div>
            
            <div className="flex gap-3">
              <Button
                onClick={() => {
                  setShowModal(false);
                  setSelectedRequest(null);
                  setAdminNotes('');
                }}
                variant="outline"
                className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Отмена
              </Button>
              <Button
                onClick={() => handleStatusUpdate(selectedRequest.id, 'processing')}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                Взять в работу
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminWithdrawalRequests;
