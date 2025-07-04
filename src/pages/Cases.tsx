import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Gift, Sparkles, Zap } from 'lucide-react';

interface CaseItem {
  name: string;
  price: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  chance: number;
}

interface HistoryItem {
  item: CaseItem;
  date: string;
}

const CASE_ITEMS: CaseItem[] = [
  { name: 'Гемы x100', price: 150, rarity: 'common', chance: 77 },
  { name: 'Гемы x500', price: 750, rarity: 'rare', chance: 20 },
  { name: 'Гемы x1000', price: 1500, rarity: 'epic', chance: 2 },
  { name: 'Легендарный Боец', price: 5000, rarity: 'legendary', chance: 1 },
];

const CASE_PRICE = 299;
const EPIC_MIN = 30;
const EPIC_MAX = 50;
const LEG_MIN = 300;
const LEG_MAX = 500;

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getFromStorage<T>(key: string, fallback: T): T {
  try {
    const val = localStorage.getItem(key);
    if (val) return JSON.parse(val);
    return fallback;
  } catch {
    return fallback;
  }
}

function setToStorage<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export default function Cases() {
  // Глобальные счетчики (эмулируем сервер через localStorage)
  const [totalOpened, setTotalOpened] = useState(() => getFromStorage('totalOpened', 0));
  const [sinceLastEpic, setSinceLastEpic] = useState(() => getFromStorage('sinceLastEpic', 0));
  const [sinceLastLegendary, setSinceLastLegendary] = useState(() => getFromStorage('sinceLastLegendary', 0));
  const [nextEpicAt, setNextEpicAt] = useState(() => getFromStorage('nextEpicAt', getRandomInt(EPIC_MIN, EPIC_MAX)));
  const [nextLegendaryAt, setNextLegendaryAt] = useState(() => getFromStorage('nextLegendaryAt', getRandomInt(LEG_MIN, LEG_MAX)));

  // Пользовательский стейт
  const [balance, setBalance] = useState(() => getFromStorage('balance', 2000));
  const [history, setHistory] = useState<HistoryItem[]>(() => getFromStorage('history', []));
  const [isRolling, setIsRolling] = useState(false);
  const [result, setResult] = useState<CaseItem | null>(null);
  const [animationStep, setAnimationStep] = useState(0);
  const [showResult, setShowResult] = useState(false);

  // Сохраняем счетчики в localStorage
  useEffect(() => { setToStorage('totalOpened', totalOpened); }, [totalOpened]);
  useEffect(() => { setToStorage('sinceLastEpic', sinceLastEpic); }, [sinceLastEpic]);
  useEffect(() => { setToStorage('sinceLastLegendary', sinceLastLegendary); }, [sinceLastLegendary]);
  useEffect(() => { setToStorage('nextEpicAt', nextEpicAt); }, [nextEpicAt]);
  useEffect(() => { setToStorage('nextLegendaryAt', nextLegendaryAt); }, [nextLegendaryAt]);
  useEffect(() => { setToStorage('balance', balance); }, [balance]);
  useEffect(() => { setToStorage('history', history); }, [history]);

  // Очистка старых счетчиков гарантии при обновлении логики
  useEffect(() => {
    if (localStorage.getItem('pityVersion') !== 'v2') {
      localStorage.removeItem('sinceLastEpic');
      localStorage.removeItem('sinceLastLegendary');
      localStorage.removeItem('nextEpicAt');
      localStorage.removeItem('nextLegendaryAt');
      localStorage.setItem('pityVersion', 'v2');
    }
  }, []);

  function getRandomItem(): CaseItem {
    const rand = Math.random() * 100;
    let cumulative = 0;
    for (const item of CASE_ITEMS) {
      cumulative += item.chance;
      if (rand <= cumulative) return item;
    }
    return CASE_ITEMS[0];
  }

  function getGuaranteedEpic(): CaseItem {
    return CASE_ITEMS.find(i => i.rarity === 'epic')!;
  }
  function getGuaranteedLegendary(): CaseItem {
    return CASE_ITEMS.find(i => i.rarity === 'legendary')!;
  }

  function openCase() {
    if (isRolling) return;
    if (balance < CASE_PRICE) {
      alert('Недостаточно средств!');
      return;
    }
    
    setIsRolling(true);
    setResult(null);
    setShowResult(false);
    setAnimationStep(0);

    // Улучшенная анимация рулетки
    let steps = 30;
    let interval = 80;
    let anim = 0;
    
    const animInterval = setInterval(() => {
      setAnimationStep(anim);
      anim++;
      if (anim > steps) {
        clearInterval(animInterval);
      }
    }, interval);

    setTimeout(() => {
      // Глобальные счетчики
      let newTotal = totalOpened + 1;
      let newEpic = sinceLastEpic + 1;
      let newLegendary = sinceLastLegendary + 1;
      let newNextEpic = nextEpicAt;
      let newNextLegendary = nextLegendaryAt;
      let item: CaseItem;

      // Гарантия на легендарку
      if (newLegendary >= nextLegendaryAt) {
        item = getGuaranteedLegendary();
        newLegendary = 0;
        newNextLegendary = getRandomInt(LEG_MIN, LEG_MAX);
      } else if (newEpic >= nextEpicAt) {
        // Гарантия на эпик
        item = getGuaranteedEpic();
        newEpic = 0;
        newNextEpic = getRandomInt(EPIC_MIN, EPIC_MAX);
      } else {
        // Обычный дроп
        item = getRandomItem();
        if (item.rarity === 'epic') {
          newEpic = 0;
          newNextEpic = getRandomInt(EPIC_MIN, EPIC_MAX);
        }
        if (item.rarity === 'legendary') {
          newLegendary = 0;
          newNextLegendary = getRandomInt(LEG_MIN, LEG_MAX);
        }
      }

      setTotalOpened(newTotal);
      setSinceLastEpic(newEpic);
      setSinceLastLegendary(newLegendary);
      setNextEpicAt(newNextEpic);
      setNextLegendaryAt(newNextLegendary);
      setBalance(b => b - CASE_PRICE);
      setResult(item);
      setHistory(h => [{ item, date: new Date().toLocaleString() }, ...h.slice(0, 49)]);
      setIsRolling(false);
      
      // Показываем результат с задержкой для анимации
      setTimeout(() => {
        setShowResult(true);
      }, 500);
    }, steps * interval + 500);
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Кейсы</h1>
          <div className="text-lg text-green-400 font-semibold flex items-center justify-center gap-2">
            <Zap className="w-5 h-5" />
            Баланс: {balance}₽
          </div>
          <div className="mt-2 text-gray-400">Всего открыто кейсов: {totalOpened}</div>
        </div>
        
        <div className="max-w-xl mx-auto mb-8">
          <Card className="bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 border-none mb-8 shadow-2xl hover:shadow-purple-500/25 transition-all duration-300">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-2">🎮 Мега Бокс</h2>
              <div className="mb-4 text-lg">Цена: {CASE_PRICE}₽</div>
              <Button 
                onClick={openCase} 
                disabled={isRolling || balance < CASE_PRICE} 
                className="w-full text-lg py-4 bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 transition-all duration-300"
              >
                {isRolling ? (
                  <div className="flex items-center">
                    <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                    Открываем...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Gift className="w-5 h-5 mr-2" />
                    Открыть кейс
                  </div>
                )}
              </Button>
              <div className="mt-4 text-sm text-gray-200">
                До гарантии эпика: <span className="text-purple-300 font-bold">{nextEpicAt - sinceLastEpic}</span> | 
                До гарантии легендарки: <span className="text-yellow-300 font-bold">{nextLegendaryAt - sinceLastLegendary}</span>
              </div>
            </CardContent>
          </Card>
          
          <div className="mb-6">
            <h3 className="text-xl font-bold mb-2">Возможные предметы</h3>
            <div className="space-y-2">
              {CASE_ITEMS.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between bg-gray-800/30 p-3 rounded-xl border border-gray-700/30 hover:bg-gray-700/50 transition-all duration-200">
                  <div className="flex items-center space-x-3">
                    <Badge className={
                      item.rarity === 'common' ? 'bg-gray-600' :
                      item.rarity === 'rare' ? 'bg-blue-600' :
                      item.rarity === 'epic' ? 'bg-purple-600' :
                      'bg-yellow-600' }>
                      {item.rarity}
                    </Badge>
                    <span>{item.name}</span>
                  </div>
                  <span className="text-green-400 font-semibold">{item.price}₽</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Улучшенная анимация рулетки */}
          {isRolling && (
            <div className="mb-6 roulette-container">
              <div className="text-center mb-4 text-purple-300 font-semibold">🎰 Рулетка крутится...</div>
              <div className="flex space-x-3 justify-center overflow-hidden">
                {Array.from({ length: 12 }).map((_, i) => {
                  const idx = (animationStep + i) % CASE_ITEMS.length;
                  const item = CASE_ITEMS[idx];
                  return (
                    <div 
                      key={i} 
                      className={`roulette-item min-w-[90px] h-24 bg-gradient-to-br ${
                        item.rarity === 'common' ? 'from-gray-500 to-gray-700' :
                        item.rarity === 'rare' ? 'from-blue-500 to-blue-700' :
                        item.rarity === 'epic' ? 'from-purple-500 to-purple-700' :
                        'from-yellow-400 to-orange-600'
                      } rounded-lg flex items-center justify-center text-xs text-white font-bold text-center p-2 animate-roulette-item`}
                      style={{ animationDelay: `${i * 0.1}s` }}
                    >
                      {item.name}
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 text-center">
                <div className="inline-block w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          )}
          
          {/* Улучшенный результат */}
          {result && showResult && (
            <div className={`mt-6 p-6 rounded-xl text-center text-xl font-bold animate-bounce-in ${
              result.rarity === 'legendary' ? 'result-legendary text-black' :
              result.rarity === 'epic' ? 'result-epic text-white' :
              result.rarity === 'rare' ? 'result-rare text-white' :
              'result-common text-white'
            }`}>
              <div className="text-3xl mb-2">
                {result.rarity === 'legendary' && '🌟'}
                {result.rarity === 'epic' && '💎'}
                {result.rarity === 'rare' && '🔵'}
                {result.rarity === 'common' && '⚪'}
              </div>
              <div className="text-2xl font-bold mb-1">{result.name}</div>
              <div className="text-lg opacity-90">{result.rarity.toUpperCase()}</div>
              <div className="text-xl font-bold mt-2">{result.price}₽</div>
            </div>
          )}
        </div>
        
        {/* История */}
        <div className="max-w-xl mx-auto">
          <h3 className="text-xl font-bold mb-2">История открытий (последние 50)</h3>
          <div className="bg-gray-800/50 rounded-xl p-4 max-h-64 overflow-y-auto text-sm">
            {history.length === 0 && <div className="text-gray-400">Пока ничего не открыто</div>}
            <ul>
              {history.map((h, i) => (
                <li key={i} className="mb-1 flex items-center justify-between hover:bg-gray-700/30 p-1 rounded transition-colors">
                  <span className="text-gray-400">{h.date}</span>
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${
                    h.item.rarity === 'common' ? 'bg-gray-600' :
                    h.item.rarity === 'rare' ? 'bg-blue-600' :
                    h.item.rarity === 'epic' ? 'bg-purple-600' :
                    'bg-yellow-600'}`}>{h.item.rarity}</span>
                  <span className="ml-2">{h.item.name}</span>
                  <span className="ml-2 text-green-400 font-semibold">{h.item.price}₽</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
