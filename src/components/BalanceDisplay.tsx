
import { DollarSign } from 'lucide-react';

interface BalanceDisplayProps {
  balance: number;
}

const BalanceDisplay = ({ balance }: BalanceDisplayProps) => {
  return (
    <div className="text-lg text-green-400 font-semibold flex items-center">
      <DollarSign className="w-5 h-5 mr-1" />
      Ваш баланс: {balance}₽
    </div>
  );
};

export default BalanceDisplay;
