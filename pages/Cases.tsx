import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap, Gift, Star, Sparkles, DollarSign, Package } from 'lucide-react';

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

const Cases = () => {
  const [selectedCase, setSelectedCase] = useState<GameCase | null>(null);
  const [openingCount, setOpeningCount] = useState(1);
  const [isOpening, setIsOpening] = useState(false);
  const [results, setResults] = useState<CaseItem[]>([]);
  const [totalSiteRevenue, setTotalSiteRevenue] = useState(50000);
  const [showResults, setShowResults] = useState(false);
  const [rouletteItems, setRouletteItems] = useState<CaseItem[]>([]);
  const [balance, setBalance] = useState(1250); // Симуляция баланса пользователя

  const cases: GameCase[] = [
    {
      id: 'brawl-stars',
      name: 'Мега Бокс',
      game: 'Brawl Stars',
      price: 299,
      image: '/lovable-uploads/310ea150-158a-4dd8-ab20-190510cef972.png',
      gradient: 'from-purple-600 via-pink-600 to-red-600',
      icon: '🎮',
      items: [
        { name: 'Гемы x100', price: 150, rarity: 'common', chance: 30 },
        { name: 'Гемы x500', price: 750, rarity: 'rare', chance: 20 },
        { name: 'Гемы x1000', price: 1500, rarity: 'epic', chance: 15 },
        { name: 'Легендарный Бойец', price: 5000, rarity: 'legendary', chance: 5 },
      ]
    },
    {
      id: 'csgo',
      name: 'Operation Case',
      game: 'CS:GO',
      price: 499,
      image: '/lovable-uploads/310ea150-158a-4dd8-ab20-190510cef972.png',
      gradient: 'from-blue-600 via-cyan-600 to-teal-600',
      icon: '🔫',
      items: [
        { name: 'AK-47 Redline', price: 400, rarity: 'common', chance: 35 },
        { name: 'AWP Dragon Lore', price: 2500, rarity: 'rare', chance: 25 },
        { name: 'Knife Karambit', price: 8000, rarity: 'epic', chance: 10 },
        { name: 'StatTrak™ AK-47', price: 15000, rarity: 'legendary', chance: 3 },
      ]
    },
    {
      id: 'pubg',
      name: 'Военный Кейс',
      game: 'PUBG Mobile',
      price: 199,
      image: '/lovable-uploads/310ea150-158a-4dd8-ab20-190510cef972.png',
      gradient: 'from-orange-600 via-red-600 to-pink-600',
      icon: '🪖',
      items: [
        { name: 'UC x100', price: 150, rarity: 'common', chance: 40 },
        { name: 'UC x500', price: 750, rarity: 'rare', chance: 25 },
        { name: 'UC x1000', price: 1500, rarity: 'epic', chance: 12 },
        { name: 'Эксклюзивный Скин', price: 4000, rarity: 'legendary', chance: 7 },
      ]
    },
    {
      id: 'roblox',
      name: 'Robux Сундук',
      game: 'Roblox',
      price: 399,
      image: '/lovable-uploads/310ea150-158a-4dd8-ab20-190510cef972.png',
      gradient: 'from-green-600 via-emerald-600 to-teal-600',
      icon: '🎲',
      items: [
        { name: 'Robux x100', price: 200, rarity: 'common', chance: 30 },
        { name: 'Robux x500', price: 1000, rarity: 'rare', chance: 20 },
        { name: 'Robux x1000', price: 2000, rarity: 'epic', chance: 15 },
        { name: 'Robux x5000', price: 10000, rarity: 'legendary', chance: 2 },
      ]
    }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-600';
      case 'rare': return 'bg-blue-600';
      case 'epic': return 'bg-purple-600';
      case 'legendary': return 'bg-yellow-600';
      default: return 'bg-gray-600';
    }
  };

  const getRarityGradient = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'from-gray-500 to-gray-700';
      case 'rare': return 'from-blue-500 to-blue-700';
      case 'epic': return 'from-purple-500 to-purple-700';
      case 'legendary': return 'from-yellow-400 to-orange-600';
      default: return 'from-gray-500 to-gray-700';
    }
  };

  const canDropExpensiveItem = (item: CaseItem) => {
    const requiredRevenue = Math.floor(item.price / 500) * 20000;
    return totalSiteRevenue >= requiredRevenue;
  };

  const generateRouletteItems = (caseData: GameCase) => {
    const items: CaseItem[] = [];
    // Генерируем 50 предметов для рулетки
    for (let i = 0; i < 50; i++) {
      const random = Math.random() * 100;
      let cumulativeChance = 0;
      let selectedItem = caseData.items[0];

      for (const item of caseData.items) {
        cumulativeChance += item.chance;
        if (random <= cumulativeChance) {
          selectedItem = item;
          break;
        }
      }
      items.push(selectedItem);
    }
    return items;
  };

  const openCase = (caseData: GameCase) => {
    setIsOpening(true);
    setResults([]);
    setShowResults(false);

    // Генерируем предметы для рулетки
    const roulette = generateRouletteItems(caseData);
    setRouletteItems(roulette);

    setTimeout(() => {
      const newResults: CaseItem[] = [];
      
      for (let i = 0; i < openingCount; i++) {
        const random = Math.random() * 100;
        let cumulativeChance = 0;
        let selectedItem = caseData.items[0];

        for (const item of caseData.items) {
          cumulativeChance += item.chance;
          if (random <= cumulativeChance) {
            if (item.rarity === 'legendary' && !canDropExpensiveItem(item)) {
              selectedItem = caseData.items.find(i => i.rarity === 'epic') || caseData.items[0];
            } else {
              selectedItem = item;
            }
            break;
          }
        }
        
        newResults.push(selectedItem);
      }
      
      setResults(newResults);
      setTotalSiteRevenue(prev => prev + (caseData.price * openingCount));
      setIsOpening(false);
      setShowResults(true);
    }, 3000);
  };

  const sellItem = (item: CaseItem, index: number) => {
    const sellPrice = Math.floor(item.price * 0.8); // 80% от стоимости
    setBalance(prev => prev + sellPrice);
    setResults(prev => prev.filter((_, i) => i !== index));
  };

  const keepItem = (item: CaseItem, index: number) => {
    // Логика добавления в профиль
    setResults(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-red-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-fade-in">
            Игровые Кейсы
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto animate-slide-up">
            Открывай кейсы и получай редкие предметы для своих любимых игр!
          </p>
          <div className="mt-4 text-lg text-green-400 font-semibold">
            Ваш баланс: {balance}₽
          </div>
        </div>

        {!selectedCase ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {cases.map((caseData) => (
              <Card 
                key={caseData.id} 
                className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 cursor-pointer transform hover:scale-105 transition-all duration-500 hover:shadow-2xl hover:shadow-red-500/20 animate-fade-in"
                onClick={() => setSelectedCase(caseData)}
              >
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
                    <CardTitle className="text-white text-xl mb-2">{caseData.name}</CardTitle>
                    <p className="text-gray-300">{caseData.game}</p>
                  </div>
                </CardHeader>
                <CardContent className="text-center relative z-10">
                  <div className="text-3xl font-bold text-white mb-4">{caseData.price}₽</div>
                  <Button 
                    className={`w-full bg-gradient-to-r ${caseData.gradient} hover:opacity-90 text-white border-none transform hover:scale-105 transition-all duration-300`}
                  >
                    <Gift className="w-4 h-4 mr-2" />
                    Открыть кейс
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="max-w-6xl mx-auto">
            <Button 
              onClick={() => {
                setSelectedCase(null);
                setResults([]);
                setShowResults(false);
              }}
              className="mb-6 bg-gray-700 hover:bg-gray-600"
            >
              ← Назад к кейсам
            </Button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Кейс и управление */}
              <div>
                <Card className={`bg-gradient-to-br ${selectedCase.gradient} border-none mb-8 transform hover:scale-105 transition-all duration-500`}>
                  <CardContent className="p-8 text-center">
                    <div className="w-full h-60 mb-6 rounded-xl overflow-hidden">
                      <img 
                        src={selectedCase.image} 
                        alt={selectedCase.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2">{selectedCase.name}</h2>
                    <p className="text-white/80 text-lg">{selectedCase.game}</p>
                    <div className="text-3xl font-bold text-white mt-4">{selectedCase.price}₽</div>
                  </CardContent>
                </Card>

                <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50">
                  <h3 className="text-xl font-bold mb-4">Открыть кейс</h3>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Количество кейсов (1-5)</label>
                    <div className="flex items-center space-x-2">
                      {[1, 2, 3, 4, 5].map((count) => (
                        <Button
                          key={count}
                          variant={openingCount === count ? "default" : "outline"}
                          size="sm"
                          onClick={() => setOpeningCount(count)}
                          className={openingCount === count ? "bg-red-500 hover:bg-red-600" : "border-gray-600 text-gray-300"}
                        >
                          {count}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="text-xl font-bold mb-4">
                    Общая стоимость: {selectedCase.price * openingCount}₽
                  </div>

                  <Button
                    onClick={() => openCase(selectedCase)}
                    disabled={isOpening}
                    className={`w-full bg-gradient-to-r ${selectedCase.gradient} hover:opacity-90 text-lg py-6 rounded-xl transform hover:scale-105 transition-all duration-300`}
                  >
                    {isOpening ? (
                      <div className="flex items-center">
                        <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                        Открываю...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <Gift className="w-5 h-5 mr-2" />
                        Открыть {openingCount} {openingCount === 1 ? 'кейс' : 'кейса'}
                      </div>
                    )}
                  </Button>
                </div>
              </div>

              {/* Рулетка и результаты */}
              <div>
                {isOpening && (
                  <div className="mb-6">
                    <h3 className="text-xl font-bold mb-4 text-center">🎰 Рулетка</h3>
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-4 overflow-hidden">
                      <div className="flex space-x-2 animate-pulse">
                        {rouletteItems.slice(0, 10).map((item, index) => (
                          <div 
                            key={index}
                            className={`min-w-[100px] h-24 bg-gradient-to-br ${getRarityGradient(item.rarity)} rounded-lg flex items-center justify-center text-xs text-white font-bold text-center p-2 animate-slide-up`}
                            style={{ animationDelay: `${index * 0.1}s` }}
                          >
                            {item.name}
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 text-center text-gray-400">
                        <div className="animate-spin inline-block">🎯</div>
                        <p className="mt-2">Определяем победителя...</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Возможные предметы */}
                <div className="mb-6">
                  <h3 className="text-xl font-bold mb-4">Возможные предметы</h3>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {selectedCase.items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-800/30 backdrop-blur-sm p-3 rounded-xl border border-gray-700/30">
                        <div className="flex items-center space-x-3">
                          <Badge className={`${getRarityColor(item.rarity)} text-white`}>
                            {item.rarity}
                          </Badge>
                          <span className="text-white">{item.name}</span>
                        </div>
                        <div className="text-green-400 font-semibold">{item.price}₽</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Результаты открытия */}
                {showResults && results.length > 0 && (
                  <div className="animate-scale-in">
                    <h4 className="text-xl font-bold mb-4">🎉 Поздравляем! Вы выиграли:</h4>
                    <div className="space-y-4">
                      {results.map((result, index) => (
                        <div key={index} className={`bg-gradient-to-br ${getRarityGradient(result.rarity)} p-4 rounded-xl animate-fade-in border-2 border-white/20`}>
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <Badge className={`${getRarityColor(result.rarity)} text-white`}>
                                {result.rarity}
                              </Badge>
                              <span className="text-white font-bold">{result.name}</span>
                            </div>
                            <div className="text-white font-bold text-lg">{result.price}₽</div>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              onClick={() => sellItem(result, index)}
                              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                            >
                              <DollarSign className="w-4 h-4 mr-2" />
                              Продать за {Math.floor(result.price * 0.8)}₽
                            </Button>
                            <Button
                              onClick={() => keepItem(result, index)}
                              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              <Package className="w-4 h-4 mr-2" />
                              В профиль
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default Cases;
