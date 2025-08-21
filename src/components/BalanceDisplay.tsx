import { DollarSign } from 'lucide-react';

interface BalanceDisplayProps {
  balance: number;
}

const BalanceDisplay = ({ balance }: BalanceDisplayProps) => {
  return (
    <div className="flex items-center bg-gradient-to-r from-emerald-500 to-cyan-600 text-white font-bold text-lg px-4 py-2 rounded-xl shadow-2xl shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all duration-500 hover:scale-105 border border-emerald-400/30 hover:border-emerald-400/50 group">
      <div className="w-6 h-6 mr-2 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-all duration-300">
        <DollarSign className="w-4 h-4 text-emerald-200 group-hover:text-emerald-100 transition-colors duration-300" />
      </div>
      <span className="text-emerald-100 group-hover:text-white transition-colors duration-300">
        {balance}₴
      </span>
    </div>
  );
};

export default BalanceDisplay;
