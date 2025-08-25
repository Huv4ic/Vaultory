import { DollarSign } from 'lucide-react';

interface BalanceDisplayProps {
  balance: number;
}

const BalanceDisplay = ({ balance }: BalanceDisplayProps) => {
  // Функция для форматирования числа с разделителями
  const formatBalance = (amount: number): string => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  return (
    <div className="flex items-center bg-gradient-to-r from-red-600 to-purple-700 text-white font-bold text-lg px-4 py-2 rounded-xl shadow-2xl shadow-red-500/30 hover:shadow-red-500/50 transition-all duration-500 hover:scale-105 border border-red-400/30 hover:border-red-400/50 group">
      <div className="w-6 h-6 mr-2 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-all duration-300">
        <DollarSign className="w-4 h-4 text-red-200 group-hover:text-red-100 transition-colors duration-300" />
      </div>
      <span className="text-red-100 group-hover:text-white transition-colors duration-300">
        {formatBalance(balance)}₴
      </span>
    </div>
  );
};

export default BalanceDisplay;
