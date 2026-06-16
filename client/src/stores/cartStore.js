import { create } from 'zustand';
import api from '../lib/api';

const fmt = (item) => ({
  id:        item.id,
  variantId: item.variant_id,
  productId: item.product_id,
  name:      item.product?.name ?? '',
  slug:      item.product?.slug ?? '',
  variant:   item.variant?.label ?? '',
  price:     item.price_at_add,
  qty:       item.qty,
  image:     item.product?.images?.[0]?.url ?? null,
});

export const useCartStore = create((set, get) => ({
  items:   [],
  loading: false,
  synced:  false,

  fetch: async () => {
    set({ loading: true });
    try {
      const { data } = await api.get('/cart');
      set({ items: data.map(fmt), loading: false, synced: true });
    } catch (_) {
      set({ loading: false });
    }
  },

  add: async (variantId, qty = 1) => {
    set({ loading: true });
    try {
      await api.post('/cart', { variant_id: variantId, qty });
      await get().fetch();
    } catch (e) {
      set({ loading: false });
      return { ok: false, message: e.response?.data?.message || 'Could not add to bag.' };
    }
    return { ok: true };
  },

  updateQty: async (id, qty) => {
    if (qty < 1) return get().remove(id);
    set({ loading: true });
    try {
      await api.put(`/cart/${id}`, { qty });
      await get().fetch();
    } catch (_) {
      set({ loading: false });
    }
  },

  remove: async (id) => {
    set({ loading: true });
    try {
      await api.delete(`/cart/${id}`);
      await get().fetch();
    } catch (_) {
      set({ loading: false });
    }
  },

  clear: async () => {
    try {
      await api.delete('/cart');
      set({ items: [], synced: true });
    } catch (_) {}
  },

  merge: async () => {
    try {
      await api.post('/cart/merge');
      await get().fetch();
    } catch (_) {}
  },

  // Derived
  count:    () => get().items.reduce((s, i) => s + i.qty, 0),
  subtotal: () => get().items.reduce((s, i) => s + i.price * i.qty, 0),
}));
