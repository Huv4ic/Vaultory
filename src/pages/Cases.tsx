import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useNavigate } from 'react-router-dom';

const cases = [
  {
    id: 'brawl-stars',
    name: 'Мега Бокс',
    game: 'Brawl Stars',
    price: 299,
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=300&fit=crop',
    gradient: 'from-purple-600 via-pink-600 to-red-600',
    icon: '🎮',
  },
  {
    id: 'csgo',
    name: 'Operation Case',
    game: 'CS:GO',
    price: 499,
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop',
    gradient: 'from-blue-600 via-cyan-600 to-teal-600',
    icon: '🔫',
  },
  {
    id: 'pubg',
    name: 'Военный Кейс',
    game: 'PUBG Mobile',
    price: 199,
    image: 'https://images.unsplash.com/photo-1614294148960-9aa740632a87?w=400&h=300&fit=crop',
    gradient: 'from-orange-600 via-red-600 to-pink-600',
    icon: '🪖',
  },
  {
    id: 'roblox',
    name: 'Robux Сундук',
    game: 'Roblox',
    price: 399,
    image: 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=400&h=300&fit=crop',
    gradient: 'from-green-600 via-emerald-600 to-teal-600',
    icon: '🎲',
  }
];

const Cases = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {cases.map((caseData) => (
            <div key={caseData.id} className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl shadow-xl p-6 flex flex-col items-center">
              <img src={caseData.image} alt={caseData.name} className="rounded-xl w-full object-cover mb-4" />
              <h2 className="text-2xl font-bold mb-2">{caseData.name}</h2>
              <p className="text-gray-400 mb-2">{caseData.game}</p>
              <div className="text-2xl font-bold text-white mb-4">{caseData.price}₽</div>
              <button
                className={`w-full bg-gradient-to-r ${caseData.gradient} hover:opacity-90 text-white border-none rounded-lg py-2 font-semibold text-lg transition-all duration-300 mb-2`}
                onClick={() => navigate(`/case/${caseData.id}`)}
              >
                Открыть кейс
              </button>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Cases;
