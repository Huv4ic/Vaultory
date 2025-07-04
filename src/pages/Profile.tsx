import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/hooks/useAuth';
import { useInventory } from '@/hooks/useInventory';
import { Button } from '@/components/ui/button';

const Profile = () => {
  const { telegramUser, balance, setBalance } = useAuth();
  const { items, sellItem } = useInventory();

  if (!telegramUser) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Войдите через Telegram</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      <div className="container mx-auto px-4 py-12 flex flex-col items-center">
        <div className="bg-gray-800/80 rounded-2xl shadow-xl p-8 w-full max-w-lg text-center mb-8">
          <img
            src={telegramUser.photo_url}
            alt={telegramUser.username || telegramUser.first_name}
            className="w-32 h-32 rounded-full border-4 border-purple-500 shadow mx-auto mb-4"
          />
          <h2 className="text-3xl font-bold mb-2">{telegramUser.username || telegramUser.first_name}</h2>
          <div className="text-lg text-gray-400 mb-4">ID: {telegramUser.id}</div>
          <div className="bg-gray-900 px-6 py-3 rounded-lg text-green-400 font-bold text-xl inline-block mb-2">
            Баланс: {balance}₽
          </div>
        </div>
        <div className="w-full max-w-2xl bg-gray-800/70 rounded-2xl p-6 shadow-xl">
          <h3 className="text-2xl font-bold mb-4 text-left">Инвентарь</h3>
          {items.length === 0 ? (
            <div className="text-gray-400 text-center py-8">Инвентарь пуст</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {items.map((item, idx) => (
                <div key={idx} className="bg-gray-900 rounded-xl p-4 flex flex-col items-center shadow">
                  {item.image && (
                    <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded mb-2" />
                  )}
                  <div className="font-bold text-lg mb-1">{item.name}</div>
                  <div className="text-gray-400 mb-1">Редкость: {item.rarity}</div>
                  <div className="text-green-400 font-bold mb-2">{item.price}₽</div>
                  <Button
                    className="bg-red-600 hover:bg-red-700 w-full"
                    onClick={() => {
                      const sellPrice = sellItem(idx);
                      setBalance(balance + sellPrice);
                    }}
                  >
                    Продать ({Math.floor(item.price * 0.8)}₽)
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile; 