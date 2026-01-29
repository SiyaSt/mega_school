import { api } from './apiClient';

export interface StoreItem {
  id: string;
  name: string;
  description: string;
  priceInPoints: number;
  imageUrl?: string;
}

export interface StoreItemsResponse {
  items: StoreItem[];
}

export interface PurchaseResponse {
  purchaseId: string;
  itemId: string;
  pricePaid: number;
  newBalance: number;
}

export async function getStoreItems(): Promise<StoreItem[]> {
  const res = await api.get<StoreItemsResponse>('/store/items');
  return res.items;
}

export async function purchaseItem(itemId: string, childId?: string): Promise<PurchaseResponse> {
  return api.post<PurchaseResponse>('/store/purchase', { itemId, childId });
}
