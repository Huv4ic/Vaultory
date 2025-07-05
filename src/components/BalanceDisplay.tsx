import { DollarSign } from 'lucide-react';

interface BalanceDisplayProps {
  balance: number;
}

const BalanceDisplay = ({ balance }: BalanceDisplayProps) => {
  return (
    <div className="flex items-center bg-gradient-to-r from-red-500 to-purple-600 text-white font-bold text-xl px-6 py-3 rounded-lg shadow-lg animate-fade-in">
      <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 10c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8z"/></svg>
      Баланс: <span className="ml-2">{balance}₽</span>
    </div>
  );
};

export default BalanceDisplay;
