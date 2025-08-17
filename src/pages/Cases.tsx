import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Package, Sparkles } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useCases } from '@/hooks/useCases';

const Cases = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { cases, caseItems, loading, error } = useCases();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-500 mx-auto"></div>
          <p className="mt-4 text-xl">{t('Загрузка кейсов...')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 text-red-500">{t('Ошибка загрузки')}</h1>
          <p className="text-xl mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} className="bg-gradient-to-r from-red-500 to-purple-600">
            {t('Попробовать снова')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-red-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-fade-in text-center">
          {t('Игровые Кейсы')}
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {cases.map((caseData, idx) => (
            <div 
              key={caseData.id} 
              className="bg-gray-800/70 rounded-2xl shadow-xl p-6 flex flex-col items-center text-center animate-fade-in hover:scale-105 hover:shadow-2xl transition-all duration-300 border border-gray-700/50 hover:border-red-500/50" 
              style={{ animationDelay: `${idx * 0.07}s` }}
            >
              <div className="relative w-full h-40 mb-4">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl opacity-20"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-6xl drop-shadow-lg">🎁</span>
                </div>
              </div>
              <div className="text-xl font-bold mb-1 text-white drop-shadow-lg animate-fade-in">{caseData.name}</div>
              <div className="text-base text-gray-100 mb-4 animate-fade-in flex items-center gap-1">
                <Package className="w-4 h-4" />
                {caseData.game}
              </div>
              <div className="text-2xl font-bold text-green-400 mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                {caseData.price}₴
              </div>
              <Button
                className="w-full bg-gradient-to-r from-red-500 to-purple-600 hover:from-red-600 hover:to-purple-700 text-white font-bold text-lg py-3 rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl"
                onClick={() => navigate(`/case/${caseData.id}`)}
              >
                {t('Открыть')}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Cases;
