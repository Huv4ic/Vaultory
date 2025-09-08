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
    <div className="group relative">
      <div className="absolute inset-0 bg-yellow-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
      <div className="relative flex items-center bg-black/90 backdrop-blur-xl text-white font-black text-lg px-6 py-3 rounded-2xl border border-yellow-500/30 hover:border-yellow-400/50 transition-all duration-500 hover:scale-105 shadow-2xl shadow-yellow-500/25">
        <div className="w-8 h-8 mr-3 bg-black/80 backdrop-blur-xl rounded-xl flex items-center justify-center border border-yellow-500/30 shadow-lg shadow-yellow-500/20 group-hover:rotate-12 transition-transform duration-500">
          <DollarSign className="w-5 h-5 text-yellow-400 group-hover:text-yellow-300 transition-colors duration-300" />
        </div>
        <span className="text-yellow-400 group-hover:text-yellow-300 transition-colors duration-300 font-black">
          {formatBalance(balance)}₴
        </span>
      </div>
    </div>
  );
};

export default BalanceDisplay;
