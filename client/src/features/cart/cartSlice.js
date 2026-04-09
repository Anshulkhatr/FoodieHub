import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: JSON.parse(localStorage.getItem('cartItems')) || [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action) => {
      const item = action.payload;
      const existItem = state.items.find((x) => x.menuItem === item.menuItem);
      if (existItem) {
        existItem.quantity += item.quantity;
      } else {
        state.items.push(item);
      }
      localStorage.setItem('cartItems', JSON.stringify(state.items));
    },
    removeItem: (state, action) => {
      state.items = state.items.filter((x) => x.menuItem !== action.payload);
      localStorage.setItem('cartItems', JSON.stringify(state.items));
    },
    updateQty: (state, action) => {
      const { id, quantity } = action.payload;
      const existItem = state.items.find((x) => x.menuItem === id);
      if (existItem) {
        existItem.quantity = quantity;
      }
      localStorage.setItem('cartItems', JSON.stringify(state.items));
    },
    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem('cartItems');
    },
  },
});

export const { addItem, removeItem, updateQty, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
