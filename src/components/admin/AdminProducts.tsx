import React, { useState } from 'react';
import { products as initialProducts, Product } from '../../data/products';

const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>(initialProducts);

  // Заглушки для будущих функций
  const handleEdit = (product: Product) => {
    alert(`Редактировать: ${product.name}`);
  };
  const handleDelete = (id: string) => {
    if (window.confirm('Удалить этот товар?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };
  const handleAdd = () => {
    alert('Добавить новый товар (будет модалка)');
  };

  return (
    <div className="p-6 bg-gray-900 text-white rounded-xl shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Товары</h2>
        <button
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg shadow"
          onClick={handleAdd}
        >
          + Добавить товар
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm bg-gray-800 rounded-xl">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="py-3 px-4 text-left">ID</th>
              <th className="py-3 px-4 text-left">Название</th>
              <th className="py-3 px-4 text-left">Цена</th>
              <th className="py-3 px-4 text-left">Категория</th>
              <th className="py-3 px-4 text-left">Игра</th>
              <th className="py-3 px-4 text-left">Рейтинг</th>
              <th className="py-3 px-4 text-left">Продано</th>
              <th className="py-3 px-4 text-left">Действия</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id} className="border-b border-gray-700/50 hover:bg-gray-700/20">
                <td className="py-2 px-4">{product.id}</td>
                <td className="py-2 px-4">{product.name}</td>
                <td className="py-2 px-4">{product.price}₴</td>
                <td className="py-2 px-4">{product.category}</td>
                <td className="py-2 px-4">{product.game}</td>
                <td className="py-2 px-4">{product.rating}</td>
                <td className="py-2 px-4">{product.sales}</td>
                <td className="py-2 px-4 flex gap-2">
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                    onClick={() => handleEdit(product)}
                  >
                    Редактировать
                  </button>
                  <button
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                    onClick={() => handleDelete(product.id)}
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

export default AdminProducts; 