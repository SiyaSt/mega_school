import React, { useEffect, useState } from 'react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { getStoreItems, purchaseItem, type StoreItem } from '../services/storeService';
import { useUserProgress } from '../context/UserProgressContext';
import './Store.css';

export const Store: React.FC = () => {
  const { points, refetch, childId } = useUserProgress();
  const [items, setItems] = useState<StoreItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [purchasingId, setPurchasingId] = useState<string | null>(null);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    let ok = true;
    setLoading(true);
    setError('');
    getStoreItems()
      .then((list) => {
        if (ok) setItems(list);
      })
      .catch((e) => {
        if (ok) setError(e instanceof Error ? e.message : 'Ошибка загрузки');
      })
      .finally(() => {
        if (ok) setLoading(false);
      });
    return () => { ok = false; };
  }, []);

  const handlePurchase = async (item: StoreItem) => {
    if (points < item.priceInPoints || purchasingId) return;
    setError('');
    setPurchasingId(item.id);
    try {
      await purchaseItem(item.id, childId ?? undefined);
      await refetch();
      setSuccess(`«${item.name}» куплен! Баллы списаны.`);
      setError('');
      setTimeout(() => setSuccess(''), 4000);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ошибка покупки');
    } finally {
      setPurchasingId(null);
    }
  };

  if (loading) {
    return (
      <div className="store-page">
        <div className="store-main">
          <h1 className="store-title">Магазин</h1>
          <p>Загрузка…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="store-page">
      <div className="store-main">
        <h1 className="store-title">Магазин</h1>
        <p className="store-balance">Ваши баллы: <strong>{points}</strong></p>
        {error && <div className="store-error">{error}</div>}
        {success && <div className="store-success">{success}</div>}
        <div className="store-grid">
          {items.map((item) => (
            <Card key={item.id} className="store-item-card">
              <h3>{item.name}</h3>
              <p className="store-item-desc">{item.description}</p>
              <Button
                disabled={points < item.priceInPoints || purchasingId !== null}
                onClick={() => handlePurchase(item)}
              >
                {purchasingId === item.id ? 'Покупка…' : `Купить за ${item.priceInPoints} баллов`}
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
