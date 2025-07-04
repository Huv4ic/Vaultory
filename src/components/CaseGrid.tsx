
import CaseCard from './CaseCard';

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

interface CaseGridProps {
  cases: GameCase[];
  openingCount: number;
  balance: number;
  onOpeningCountChange: (count: number) => void;
  onOpenCase: (caseData: GameCase) => void;
}

const CaseGrid = ({ 
  cases, 
  openingCount, 
  balance, 
  onOpeningCountChange, 
  onOpenCase 
}: CaseGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {cases.map((caseData) => (
        <CaseCard
          key={caseData.id}
          caseData={caseData}
          openingCount={openingCount}
          balance={balance}
          onOpeningCountChange={onOpeningCountChange}
          onOpenCase={onOpenCase}
        />
      ))}
    </div>
  );
};

export default CaseGrid;
