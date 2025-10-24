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
    <div className="fixed inset-0 z-[9999] bg-[#0e0e0e]/95 backdrop-blur-sm flex items-center justify-center p-4">
      {/* Основное окно */}
      <div className="relative z-10 w-full max-w-lg mx-auto">
        <div className="bg-[#181818] border-2 border-[#1c1c1c] rounded-2xl p-6 text-center">
          
          {/* Иконка блокировки */}
          <div className="mx-auto w-20 h-20 bg-[#1c1c1c] rounded-full flex items-center justify-center mb-4 border-2 border-[#a31212]">
            <Shield className="w-10 h-10 text-[#a31212]" />
          </div>
          
          {/* Заголовок */}
          <h1 className="text-3xl font-bold text-[#a31212] mb-3">
            🚫 АККАУНТ ЗАБЛОКИРОВАН
          </h1>
          
          {/* Описание */}
          <p className="text-lg text-[#a0a0a0] mb-4 leading-relaxed">
            Ваш аккаунт был заблокирован администрацией сайта.
            {reason && (
              <span className="block mt-2 text-[#a31212] font-medium">
                Причина: {reason}
              </span>
            )}
          </p>
          
          {/* Дополнительная информация */}
          <div className="bg-[#1c1c1c] rounded-xl p-4 mb-6 border border-[#1c1c1c]">
            <div className="flex items-center justify-center space-x-2 mb-3">
              <AlertTriangle className="w-5 h-5 text-[#a31212]" />
              <span className="text-[#a31212] font-semibold text-sm">Что это означает?</span>
            </div>
            <ul className="text-[#a0a0a0] text-left space-y-1 text-sm max-w-sm mx-auto">
              <li className="flex items-start space-x-2">
                <span className="text-[#a31212]">•</span>
                <span>Вы не можете использовать функции сайта</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-[#a31212]">•</span>
                <span>Доступ к покупкам и кейсам ограничен</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-[#a31212]">•</span>
                <span>Ваш баланс заморожен</span>
              </li>
            </ul>
          </div>
          
          {/* Кнопка связи с поддержкой */}
          <div className="space-y-3">
            <p className="text-base text-gray-300">
              Для разблокировки аккаунта свяжитесь с поддержкой:
            </p>
            <Button
              onClick={handleTelegramClick}
              className="w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold text-base rounded-xl transition-all duration-300 hover:scale-105 shadow-xl shadow-blue-500/30 border border-blue-400/50"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Написать в Telegram
            </Button>
          </div>
          
          {/* Предупреждение */}
          <div className="mt-6 p-3 bg-red-900/30 rounded-lg border border-red-500/30">
            <p className="text-red-300 text-xs">
              ⚠️ Это окно нельзя закрыть до разблокировки аккаунта администрацией
            </p>
          </div>
        </div>
      </div>
      
      {/* Дополнительные анимированные элементы */}
      <div className="absolute top-10 left-10 w-12 h-12 bg-red-500/20 rounded-full animate-bounce"></div>
      <div className="absolute bottom-20 right-16 w-8 h-8 bg-red-400/20 rounded-full animate-pulse"></div>
      <div className="absolute top-1/2 left-20 w-6 h-6 bg-red-500/30 rounded-full animate-spin"></div>
    </div>
  );
};

export default BlockedUserModal;
