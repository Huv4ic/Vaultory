import React, { useState } from 'react';
import { cases as initialCases, GameCase } from '../../data/cases';

const AdminCases = () => {
  const [cases, setCases] = useState<GameCase[]>(initialCases);

  // Заглушки для будущих функций
  const handleEdit = (gameCase: GameCase) => {
    alert(`Редактировать: ${gameCase.name}`);
  };
  const handleDelete = (id: string) => {
    if (window.confirm('Удалить этот кейс?')) {
      setCases(cases.filter(c => c.id !== id));
    }
  };
  const handleAdd = () => {
    alert('Добавить новый кейс (будет модалка)');
  };

  return (
    <div className="p-6 bg-gray-900 text-white rounded-xl shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Кейсы</h2>
        <button
          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-4 py-2 rounded-lg shadow"
          onClick={handleAdd}
        >
          + Добавить кейс
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm bg-gray-800 rounded-xl">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="py-3 px-4 text-left">ID</th>
              <th className="py-3 px-4 text-left">Название</th>
              <th className="py-3 px-4 text-left">Игра</th>
              <th className="py-3 px-4 text-left">Цена</th>
              <th className="py-3 px-4 text-left">Кол-во предметов</th>
              <th className="py-3 px-4 text-left">Действия</th>
            </tr>
          </thead>
          <tbody>
            {cases.map(gameCase => (
              <tr key={gameCase.id} className="border-b border-gray-700/50 hover:bg-gray-700/20">
                <td className="py-2 px-4">{gameCase.id}</td>
                <td className="py-2 px-4">{gameCase.name}</td>
                <td className="py-2 px-4">{gameCase.game}</td>
                <td className="py-2 px-4">{gameCase.price}₴</td>
                <td className="py-2 px-4">{gameCase.items.length}</td>
                <td className="py-2 px-4 flex gap-2">
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                    onClick={() => handleEdit(gameCase)}
                  >
                    Редактировать
                  </button>
                  <button
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                    onClick={() => handleDelete(gameCase.id)}
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCases; 