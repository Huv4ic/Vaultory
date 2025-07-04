import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Gift, Sparkles } from 'lucide-react';

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
  { name: 'Гемы x100', price: 150, rarity: 'common', chance: 70 },
  { name: 'Гемы x500', price: 750, rarity: 'rare', chance: 20 },
  { name: 'Гемы x1000', price: 1500, rarity: 'epic', chance: 9 },
  { name: 'Легендарный Боец', price: 5000, rarity: 'legendary', chance: 1 },
];

const CASE_PRICE = 299;
const EPIC_MIN = 10;
const EPIC_MAX = 20;
const LEG_MIN = 100;
const LEG_MAX = 200;

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

  // Сохраняем счетчики в localStorage
  useEffect(() => { setToStorage('totalOpened', totalOpened); }, [totalOpened]);
  useEffect(() => { setToStorage('sinceLastEpic', sinceLastEpic); }, [sinceLastEpic]);
  useEffect(() => { setToStorage('sinceLastLegendary', sinceLastLegendary); }, [sinceLastLegendary]);
  useEffect(() => { setToStorage('nextEpicAt', nextEpicAt); }, [nextEpicAt]);
  useEffect(() => { setToStorage('nextLegendaryAt', nextLegendaryAt); }, [nextLegendaryAt]);
  useEffect(() => { setToStorage('balance', balance); }, [balance]);
  useEffect(() => { setToStorage('history', history); }, [history]);

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
    setAnimationStep(0);

    // Анимация рулетки (прокрутка)
    let steps = 20;
    let interval = 60;
    let anim = 0;
    const animInterval = setInterval(() => {
      setAnimationStep(anim);
      anim++;
      if (anim > steps) clearInterval(animInterval);
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
    }, steps * interval + 300);
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Кейсы</h1>
          <div className="text-lg text-green-400 font-semibold">Баланс: {balance}₽</div>
          <div className="mt-2 text-gray-400">Всего открыто кейсов: {totalOpened}</div>
        </div>
        <div className="max-w-xl mx-auto mb-8">
          <Card className="bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 border-none mb-8">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-2">Мега Бокс</h2>
              <div className="mb-4">Цена: {CASE_PRICE}₽</div>
              <Button onClick={openCase} disabled={isRolling || balance < CASE_PRICE} className="w-full text-lg py-4">
                {isRolling ? <><Sparkles className="w-5 h-5 mr-2 animate-spin" /> Открываем...</> : <><Gift className="w-5 h-5 mr-2" /> Открыть кейс</>}
              </Button>
              <div className="mt-4 text-sm text-gray-300">До гарантии эпика: <span className="text-purple-300 font-bold">{nextEpicAt - sinceLastEpic}</span> | До гарантии легендарки: <span className="text-yellow-300 font-bold">{nextLegendaryAt - sinceLastLegendary}</span></div>
            </CardContent>
          </Card>
          <div className="mb-6">
            <h3 className="text-xl font-bold mb-2">Возможные предметы</h3>
            <div className="space-y-2">
              {CASE_ITEMS.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between bg-gray-800/30 p-3 rounded-xl border border-gray-700/30">
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
          {/* Анимация рулетки */}
          {isRolling && (
            <div className="mb-6">
              <div className="flex space-x-2 justify-center animate-pulse">
                {Array.from({ length: 10 }).map((_, i) => {
                  const idx = (animationStep + i) % CASE_ITEMS.length;
                  const item = CASE_ITEMS[idx];
                  return (
                    <div key={i} className={`min-w-[80px] h-20 bg-gradient-to-br ${
                      item.rarity === 'common' ? 'from-gray-500 to-gray-700' :
                      item.rarity === 'rare' ? 'from-blue-500 to-blue-700' :
                      item.rarity === 'epic' ? 'from-purple-500 to-purple-700' :
                      'from-yellow-400 to-orange-600'
                    } rounded-lg flex items-center justify-center text-xs text-white font-bold text-center p-2 animate-slide-up`}>{item.name}</div>
                  );
                })}
              </div>
              <div className="mt-2 text-center text-gray-400">Рулетка крутится...</div>
            </div>
          )}
          {/* Результат */}
          {result && !isRolling && (
            <div className={`mt-6 p-6 rounded-xl text-center text-xl font-bold ${
              result.rarity === 'legendary' ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black animate-glow' :
              result.rarity === 'epic' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white animate-glow' :
              result.rarity === 'rare' ? 'bg-blue-700 text-white' :
              'bg-gray-700 text-white'
            }`}>
              {result.rarity === 'legendary' && '🌟'}
              {result.rarity === 'epic' && '💎'}
              {result.rarity === 'rare' && '🔵'}
              {result.rarity === 'common' && '⚪'}
              {result.name} ({result.rarity}) — {result.price}₽
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
                <li key={i} className="mb-1 flex items-center justify-between">
                  <span>{h.date}</span>
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${
                    h.item.rarity === 'common' ? 'bg-gray-600' :
                    h.item.rarity === 'rare' ? 'bg-blue-600' :
                    h.item.rarity === 'epic' ? 'bg-purple-600' :
                    'bg-yellow-600'}`}>{h.item.rarity}</span>
                  <span className="ml-2">{h.item.name}</span>
                  <span className="ml-2 text-green-400">{h.item.price}₽</span>
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
