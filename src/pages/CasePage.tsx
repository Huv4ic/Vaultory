import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useInventory } from '@/hooks/useInventory';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/useLanguage';
import { useCases } from '@/hooks/useCases';
import CaseOpeningModal from '@/components/CaseOpeningModal';

const rarityColors = {
  legendary: 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-yellow-900',
  epic: 'bg-gradient-to-r from-purple-400 to-purple-700 text-purple-100',
  rare: 'bg-gradient-to-r from-blue-400 to-blue-700 text-blue-100',
  common: 'bg-gradient-to-r from-gray-500 to-gray-700 text-gray-100',
};

const CasePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { telegramUser, refreshTelegramProfile, balance, setBalance } = useAuth();
  const { addItem } = useInventory();
  const { toast } = useToast();
  const { t } = useLanguage();
  const { cases, caseItems, loading, error } = useCases();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openingCase, setOpeningCase] = useState(false);
  const [openedItem, setOpenedItem] = useState<any>(null);
  const [openingCount, setOpeningCount] = useState(1);
  const [currentCase, setCurrentCase] = useState<any>(null);

  useEffect(() => {
    if (telegramUser) {
      refreshTelegramProfile();
    }
  }, [telegramUser, refreshTelegramProfile]);

  const caseData = cases.find(c => c.id === id);

  const openCase = () => {
    console.log('openCase called:', { caseData, telegramUser, balance, openingCount });
    
    if (!caseData) return;
    if (!telegramUser) {
      toast({
        title: t("Требуется авторизация"),
        description: t("Войдите через Telegram для открытия кейсов"),
      });
      return;
    }
    if (balance < caseData.price * openingCount) {
      toast({
        title: t("Недостаточно средств"),
        description: `${t("Для открытия")} ${openingCount} ${t("кейса(ов) нужно")} ${caseData.price * openingCount}₴, ${t("у вас")} ${balance}₴`,
      });
      return;
    }
    
    console.log('Opening case, setting modal to true');
    setBalance(balance - caseData.price * openingCount);
    setCurrentCase(caseData);
    setIsModalOpen(true);
  };

  const handleSellItem = (item, price) => {
    setBalance(balance + price);
    toast({
      title: t("Предмет продан!"),
      description: `${t("Вы получили")} ${price}₴ ${t("за продажу предмета")}`,
    });
  };

  const handleKeepItem = (item) => {
    addItem({
      ...item,
      caseId: caseData.id,
      status: 'new'
    });
    toast({
      title: t("Предмет добавлен в инвентарь!"),
      description: `${t("Предмет")} "${item.name}" ${t("добавлен в ваш инвентарь")}`,
    });
  };

  const handleAddToProfile = (item) => {
    addItem({
      ...item,
      caseId: caseData.id,
      status: 'withdrawn'
    });
    toast({
      title: t("Заявка на вывод отправлена!"),
      description: `${t("Предмет")} "${item.name}" ${t("будет обработан и выдан в ближайшее время")}`,
    });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentCase(null);
  };

  if (!caseData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white flex items-center justify-center">
        <div className="text-center bg-black/40 backdrop-blur-xl rounded-2xl p-8 border border-amber-500/30 shadow-2xl shadow-amber-500/20">
          <h1 className="text-3xl font-bold mb-4 text-white">{t('Кейс не найден')}</h1>
          <Button 
            onClick={() => navigate(-1)}
            className="px-8 py-3 bg-black/60 backdrop-blur-sm border border-amber-500/40 text-amber-300 hover:bg-amber-500/20 hover:border-amber-400 hover:text-amber-200 transition-all duration-300 shadow-lg shadow-amber-500/20 rounded-xl"
          >
            {t('Назад')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      <div className="container mx-auto px-4 py-12 flex flex-col items-center">
        <div className="bg-black/40 backdrop-blur-xl rounded-2xl shadow-2xl shadow-amber-500/20 p-8 max-w-md w-full text-center mb-8 border border-amber-500/30">
          {caseData.image_url ? (
            <img src={caseData.image_url} alt={caseData.name} className="rounded-xl w-32 h-32 object-cover mx-auto mb-4 border-4 border-amber-500/30" />
          ) : (
            <div className="w-32 h-32 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl mx-auto mb-4 border-4 border-amber-500/30 flex items-center justify-center">
              <span className="text-4xl">🎁</span>
            </div>
          )}
          <h2 className="text-3xl font-bold mb-2 text-white">{caseData.name}</h2>
          <div className="text-gray-300 mb-2">{caseData.game}</div>
          <div className="text-2xl font-bold text-amber-400 mb-4">{caseData.price * openingCount}₴</div>
          <div className="mb-4 flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((count) => (
              <Button
                key={count}
                variant={openingCount === count ? "default" : "outline"}
                size="sm"
                onClick={() => setOpeningCount(count)}
                className={
                  (openingCount === count
                    ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white border-amber-500 shadow-lg shadow-amber-500/30"
                    : "bg-black/60 backdrop-blur-sm text-amber-300 border-amber-500/40 hover:bg-amber-500/20 hover:border-amber-400 hover:text-amber-200") +
                  " rounded-xl px-4 py-2 text-base font-semibold transition-all duration-300"
                }
              >
                {count}
              </Button>
            ))}
          </div>
          <Button
            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-lg py-3 rounded-xl shadow-2xl shadow-amber-500/30 transition-all duration-300 hover:scale-105"
            onClick={openCase}
          >
            {t('Открыть')} {openingCount === 1 ? t('кейс') : `${openingCount} ${t('кейса')}`}
          </Button>
        </div>
        <div className="bg-black/40 backdrop-blur-xl rounded-2xl shadow-2xl shadow-amber-500/20 p-8 max-w-2xl w-full text-center border border-amber-500/30">
          <h3 className="text-2xl font-bold mb-6 text-white">{t('Содержимое кейса')}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {caseItems
              .filter(item => item.case_id === caseData.id)
              .map((item, idx) => (
                <div key={idx} className={`rounded-xl p-4 flex flex-col items-center ${rarityColors[item.rarity]} shadow-md`}>
                  <div className="font-bold text-lg mb-2">{item.name}</div>
                  <div className="text-sm text-gray-200 mb-1">{t('Редкость:')} <span className="capitalize">{t(item.rarity)}</span></div>
                  <div className="text-green-200 font-bold">{item.drop_chance}%</div>
                </div>
              ))}
          </div>
        </div>
      </div>
      <CaseOpeningModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        caseData={currentCase}
        openingCount={openingCount}
        onSellItem={handleSellItem}
        onKeepItem={handleKeepItem}
        onAddToProfile={handleAddToProfile}
      />
    </div>
  );
};

export default CasePage; 