import React from 'react';
import { Button } from './ui/button';
import { MessageCircle, AlertTriangle, Shield } from 'lucide-react';

interface BlockedUserModalProps {
  isVisible: boolean;
  reason?: string;
}

const BlockedUserModal: React.FC<BlockedUserModalProps> = ({ isVisible, reason }) => {
  if (!isVisible) return null;

  const handleTelegramClick = () => {
    window.open('https://t.me/Vaultory_manager', '_blank');
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4">
      {/* Анимированный фон */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 via-black/50 to-red-900/20 animate-pulse"></div>
      
      {/* Основное окно */}
      <div className="relative z-10 w-full max-w-2xl mx-auto">
        <div className="bg-black/90 backdrop-blur-xl border-2 border-red-500/50 rounded-3xl shadow-2xl shadow-red-500/30 p-8 text-center">
          
          {/* Иконка блокировки */}
          <div className="mx-auto w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mb-6 border-2 border-red-500/50">
            <Shield className="w-12 h-12 text-red-400" />
          </div>
          
          {/* Заголовок */}
          <h1 className="text-4xl md:text-5xl font-bold text-red-400 mb-4 animate-pulse">
            🚫 АККАУНТ ЗАБЛОКИРОВАН
          </h1>
          
          {/* Описание */}
          <p className="text-xl text-gray-300 mb-6 leading-relaxed">
            Ваш аккаунт был заблокирован администрацией сайта.
            {reason && (
              <span className="block mt-2 text-red-300 font-medium">
                Причина: {reason}
              </span>
            )}
          </p>
          
          {/* Дополнительная информация */}
          <div className="bg-red-900/20 rounded-2xl p-6 mb-8 border border-red-500/30">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-400" />
              <span className="text-red-300 font-semibold">Что это означает?</span>
            </div>
            <ul className="text-gray-300 text-left space-y-2 max-w-md mx-auto">
              <li className="flex items-start space-x-2">
                <span className="text-red-400">•</span>
                <span>Вы не можете использовать функции сайта</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-red-400">•</span>
                <span>Доступ к покупкам и кейсам ограничен</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-red-400">•</span>
                <span>Ваш баланс заморожен</span>
              </li>
            </ul>
          </div>
          
          {/* Кнопка связи с поддержкой */}
          <div className="space-y-4">
            <p className="text-lg text-gray-300">
              Для разблокировки аккаунта свяжитесь с поддержкой:
            </p>
            <Button
              onClick={handleTelegramClick}
              className="w-full max-w-md mx-auto py-4 px-8 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold text-lg rounded-2xl transition-all duration-300 hover:scale-105 shadow-2xl shadow-blue-500/30 border-2 border-blue-400/50"
            >
              <MessageCircle className="w-6 h-6 mr-3" />
              Написать в Telegram
            </Button>
          </div>
          
          {/* Предупреждение */}
          <div className="mt-8 p-4 bg-red-900/30 rounded-xl border border-red-500/30">
            <p className="text-red-300 text-sm">
              ⚠️ Это окно нельзя закрыть до разблокировки аккаунта администрацией
            </p>
          </div>
        </div>
      </div>
      
      {/* Дополнительные анимированные элементы */}
      <div className="absolute top-10 left-10 w-16 h-16 bg-red-500/20 rounded-full animate-bounce"></div>
      <div className="absolute bottom-20 right-16 w-12 h-12 bg-red-400/20 rounded-full animate-pulse"></div>
      <div className="absolute top-1/2 left-20 w-8 h-8 bg-red-500/30 rounded-full animate-spin"></div>
    </div>
  );
};

export default BlockedUserModal;
