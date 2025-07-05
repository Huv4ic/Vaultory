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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
      {cases.map((caseData, idx) => (
        <div key={caseData.id} className="animate-fade-in" style={{ animationDelay: `${idx * 0.07}s` }}>
          <CaseCard
            caseData={caseData}
            openingCount={openingCount}
            balance={balance}
            onOpeningCountChange={onOpeningCountChange}
            onOpenCase={onOpenCase}
            onOpen={() => onOpenCase(caseData)}
            isOpening={false}
          />
        </div>
      ))}
    </div>
  );
};

export default CaseGrid;
