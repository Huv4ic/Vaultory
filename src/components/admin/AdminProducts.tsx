import React, { useState } from 'react';
import { products as initialProducts, Product } from '../../data/products';

const emptyProduct: Product = {
  id: '',
  name: '',
  price: 0,
  originalPrice: undefined,
  image: '',
  category: '',
  game: '',
  rating: 0,
  sales: 0,
  description: '',
  features: [],
};

const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState<'edit' | 'add'>('add');
  const [current, setCurrent] = useState<Product>(emptyProduct);
  const [error, setError] = useState<string | null>(null);

  const openEdit = (product: Product) => {
    setEditMode('edit');
    setCurrent(product);
    setError(null);
    setModalOpen(true);
  };
  const openAdd = () => {
    setEditMode('add');
    setCurrent({ ...emptyProduct, id: (Date.now() + Math.random()).toString() });
    setError(null);
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
    setCurrent(emptyProduct);
    setError(null);
  };
  const handleDelete = (id: string) => {
    if (window.confirm('Удалить этот товар?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };
  const handleSave = () => {
    // Валидация
    if (!current.name.trim() || !current.price || !current.image.trim() || !current.category.trim() || !current.game.trim()) {
      setError('Заполните все обязательные поля!');
      return;
    }
    if (editMode === 'edit') {
      setProducts(products.map(p => p.id === current.id ? current : p));
    } else {
      setProducts([...products, current]);
    }
    closeModal();
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrent(prev => ({ ...prev, [name]: name === 'price' || name === 'originalPrice' || name === 'rating' || name === 'sales' ? Number(value) : value }));
  };
  const handleFeaturesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrent(prev => ({ ...prev, features: e.target.value.split('\n').map(f => f.trim()).filter(Boolean) }));
  };

  return (
    <div className="p-6 bg-gray-900 text-white rounded-xl shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Товары</h2>
        <button
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg shadow"
          onClick={openAdd}
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
                    onClick={() => openEdit(product)}
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

      {/* Модальное окно */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-gray-800 rounded-xl p-8 w-full max-w-lg shadow-2xl relative animate-fade-in">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-white text-2xl"
              onClick={closeModal}
            >
              ×
            </button>
            <h3 className="text-xl font-bold mb-4">{editMode === 'edit' ? 'Редактировать товар' : 'Добавить товар'}</h3>
            {error && <div className="mb-3 text-red-400">{error}</div>}
            <div className="space-y-3">
              <input
                className="w-full px-3 py-2 rounded bg-gray-900 border border-gray-700 text-white"
                name="name"
                placeholder="Название"
                value={current.name}
                onChange={handleChange}
              />
              <input
                className="w-full px-3 py-2 rounded bg-gray-900 border border-gray-700 text-white"
                name="price"
                type="number"
                placeholder="Цена"
                value={current.price}
                onChange={handleChange}
              />
              <input
                className="w-full px-3 py-2 rounded bg-gray-900 border border-gray-700 text-white"
                name="originalPrice"
                type="number"
                placeholder="Старая цена (необязательно)"
                value={current.originalPrice || ''}
                onChange={handleChange}
              />
              <input
                className="w-full px-3 py-2 rounded bg-gray-900 border border-gray-700 text-white"
                name="image"
                placeholder="Ссылка на изображение"
                value={current.image}
                onChange={handleChange}
              />
              <input
                className="w-full px-3 py-2 rounded bg-gray-900 border border-gray-700 text-white"
                name="category"
                placeholder="Категория"
                value={current.category}
                onChange={handleChange}
              />
              <input
                className="w-full px-3 py-2 rounded bg-gray-900 border border-gray-700 text-white"
                name="game"
                placeholder="Игра"
                value={current.game}
                onChange={handleChange}
              />
              <input
                className="w-full px-3 py-2 rounded bg-gray-900 border border-gray-700 text-white"
                name="rating"
                type="number"
                step="0.1"
                placeholder="Рейтинг"
                value={current.rating}
                onChange={handleChange}
              />
              <input
                className="w-full px-3 py-2 rounded bg-gray-900 border border-gray-700 text-white"
                name="sales"
                type="number"
                placeholder="Продано"
                value={current.sales}
                onChange={handleChange}
              />
              <textarea
                className="w-full px-3 py-2 rounded bg-gray-900 border border-gray-700 text-white"
                name="description"
                placeholder="Описание"
                value={current.description}
                onChange={handleChange}
                rows={2}
              />
              <textarea
                className="w-full px-3 py-2 rounded bg-gray-900 border border-gray-700 text-white"
                name="features"
                placeholder="Особенности (каждая с новой строки)"
                value={current.features.join('\n')}
                onChange={handleFeaturesChange}
                rows={2}
              />
            </div>
            <button
              className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-lg shadow"
              onClick={handleSave}
            >
              Сохранить
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts; 