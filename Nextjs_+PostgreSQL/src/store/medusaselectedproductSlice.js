import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  id: -99,
  collection_name: "",
  name: "",
  thumbLink: null,
  description: "",
  options: {},
  variants: [],
  info: {},
  route: "",
  collection_id: "",
  category: ""
};

const medusaselectedproductSlice = createSlice({
  name: 'medusaSelectedProduct',
  initialState,
  reducers: {
    setMedusaSelectedProduct: (state, action) => {
      return { ...state, ...action.payload };
    },
    clearMedusaSelectedProduct: () => initialState,
  },
});

export const {
  setMedusaSelectedProduct,
  clearMedusaSelectedProduct,
} = medusaselectedproductSlice.actions;
export default medusaselectedproductSlice.reducer;
