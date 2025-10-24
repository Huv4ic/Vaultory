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
      <div className="relative flex items-center bg-[#181818] text-[#f0f0f0] font-bold text-sm px-3 py-2 rounded-xl border border-[#1c1c1c] hover:border-[#a31212] transition-all duration-300 hover:scale-105">
        <div className="w-5 h-5 mr-2 bg-[#1c1c1c] rounded-lg flex items-center justify-center border border-[#1c1c1c] group-hover:scale-105 transition-transform duration-300">
          <DollarSign className="w-3 h-3 text-[#a31212]" />
        </div>
        <span className="text-[#a31212] font-bold">
          {formatBalance(balance)}₴
        </span>
      </div>
    </div>
  );
};

export default BalanceDisplay;
