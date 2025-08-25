import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Gift } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useTranslations } from '@/hooks/useTranslations';

interface CaseItem {
  name: string;
  price: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  chance: number;
}

interface GameCase {
  id: string;
  name: string;
  game: string;
  price: number;
  image: string;
  items: CaseItem[];
  gradient: string;
  icon: string;
}

interface CaseCardProps {
  caseData: GameCase;
  openingCount: number;
  balance: number;
  onOpeningCountChange: (count: number) => void;
  onOpenCase: (caseData: GameCase) => void;
  onOpen: () => void;
  isOpening: boolean;
}

const CaseCard = ({ 
  caseData, 
  openingCount, 
  balance, 
  onOpeningCountChange, 
  onOpenCase,
  onOpen,
  isOpening
}: CaseCardProps) => {
  const { t } = useLanguage();
  const { getCaseTranslation } = useTranslations();
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-600';
      case 'rare': return 'bg-blue-600';
      case 'epic': return 'bg-purple-600';
      case 'legendary': return 'bg-yellow-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 transform hover:scale-105 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/20 animate-fade-in">
      <CardHeader className="text-center relative overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${caseData.gradient} opacity-20`}></div>
        <div className="relative z-10">
          <div className="w-full h-40 mb-4 rounded-lg overflow-hidden">
            <img 
              src={caseData.image} 
              alt={caseData.name}
              className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-700"
            />
          </div>
          <CardTitle className="text-white text-xl mb-2">{getCaseTranslation(caseData.id, 'name', caseData.name)}</CardTitle>
          <p className="text-gray-300">{caseData.game}</p>
        </div>
      </CardHeader>
      <CardContent className="text-center relative z-10 space-y-4">
        <div className="text-3xl font-bold text-white">{caseData.price}₴</div>
        
        {/* Количество кейсов */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">{t('Количество')}</label>
          <div className="flex justify-center space-x-2">
            {[1, 2, 3, 4, 5].map((count) => (
              <Button
                key={count}
                variant={openingCount === count ? "default" : "outline"}
                size="sm"
                onClick={() => onOpeningCountChange(count)}
                className={openingCount === count ? "bg-purple-500 hover:bg-purple-600" : "border-gray-600 text-gray-300"}
              >
                {count}
              </Button>
            ))}
          </div>
        </div>

        <div className="text-lg font-semibold text-red-400">
          {t('Общая стоимость:')}: {caseData.price * openingCount}₴
        </div>

        <Button 
          onClick={() => onOpenCase(caseData)}
          disabled={balance < caseData.price * openingCount}
          className={`w-full bg-gradient-to-r from-red-500 to-purple-600 hover:from-red-600 hover:to-purple-700 text-white font-bold text-lg py-3 rounded-lg shadow-lg transition-all duration-200`}
        >
          {balance < caseData.price * openingCount ? t('Загрузка товара...') : t('Открыть кейс')}
        </Button>

        {/* Возможные предметы */}
        <div className="mt-4">
          <h4 className="text-sm font-semibold mb-2 text-gray-300">Возможные предметы:</h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {caseData.items.map((item, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-700/30 p-2 rounded text-xs">
                <div className="flex items-center space-x-2">
                  <Badge className={`${getRarityColor(item.rarity)} text-white text-xs`}>
                    {item.rarity}
                  </Badge>
                  <span className="text-white truncate">{item.name}</span>
                </div>
                <span className="text-green-400 font-semibold">{item.price}₴</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CaseCard;
