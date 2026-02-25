import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartState: { items: [], active: false }
  },
  reducers: {
    addToCart: (state, action) => {
      const { product_id, variant_id, quantity } = action.payload;

      const existingProduct = state.cartState.items.find(
        item => item.product_id === product_id
      );

      if (!existingProduct) {
        state.cartState.items.push({
          product_id,
          variants: [{ variant_id, quantity, active: false }],
          active: false
        });
        state.cartState.active = false;
        return;
      }

      const existingVariant = existingProduct.variants.find(
        v => v.variant_id === variant_id
      );

      if (!existingVariant) {
        existingProduct.variants.push({ variant_id, quantity, active: false });
        state.cartState.active = false;
        return;
      }

      const newQuantity = existingVariant.quantity + quantity;

      if (newQuantity <= 3) {
        existingVariant.quantity = newQuantity;
      }
    },
    updateCartVariantQuantity: (state, action) => {
      const { product_id, variant_id, quantity } = action.payload;

      const product = state.cartState.items.find(
        p => p.product_id === product_id
      );

      if (!product) return;

      const variant = product.variants.find(
        v => v.variant_id === variant_id
      );

      if (!variant) return;

      variant.quantity = quantity;
    },
    updateVariantCheckBox: (state, action) => {
      const { product_id, variant_id } = action.payload;
      const product = state.cartState.items.find(
        p => p.product_id === product_id
      );
      if (!product) return;
      const variant = product.variants.find(
        v => v.variant_id === variant_id
      );

      if (!variant) return;

      variant.active = !variant.active;

      // 🔥 NEW LOGIC — recalc product.active
      const allVariantsActive = product.variants.every(v => v.active === true);

      product.active = allVariantsActive;

      const allProductsActive = state.cartState.items.every(p => p.active === true);
      state.cartState.active = allProductsActive;


    },
    updateProductCheckBox: (state, action) => {
      const { product_id } = action.payload;
      const product = state.cartState.items.find(
        p => p.product_id === product_id
      );
      if (!product) return;

      product.active = !product.active;

      product.variants.map(v => v.active = product.active);

      const allProductsActive = state.cartState.items.every(p => p.active === true);
      state.cartState.active = allProductsActive;

    },
    updateAllItemCheckBox: (state, action) => {
      state.cartState.active = !state.cartState.active

      state.cartState.items.map(product => {
        product.active = state.cartState.active;
        product.variants.map(variant => {
          variant.active = state.cartState.active;
        })
      })
    },
    deleteVariant: (state, action) => {
      const { cartProductIndex, cartVariantIndex } = action.payload;

      const product = state.cartState.items[cartProductIndex];
      if (!product) return;

      // remove variant
      product.variants.splice(cartVariantIndex, 1);

      // if no variants left → remove product
      if (product.variants.length === 0) {
        state.cartState.items.splice(cartProductIndex, 1);
      } else {
        // recalc product active
        const allVariantsActive = product.variants.every(v => v.active === true);
        product.active = allVariantsActive;
      }

      // recalc cart active
      const allProductsActive =
        state.cartState.items.length > 0 &&
        state.cartState.items.every(p => p.active === true);

      state.cartState.active = allProductsActive;
    },

    deleteProduct: (state, action) => {
      const { cartProductIndex } = action.payload;

      state.cartState.items.splice(cartProductIndex, 1);

      // recalc cart active
      const allProductsActive =
        state.cartState.items.length > 0 &&
        state.cartState.items.every(p => p.active === true);

      state.cartState.active = allProductsActive;
    },
    deleteAllItems: (state, action) => {

      state.cartState = { items: [], active: false }
    }
  }
});

export const { addToCart, updateCartVariantQuantity, updateVariantCheckBox, updateProductCheckBox, updateAllItemCheckBox, deleteVariant, deleteProduct, deleteAllItems } = cartSlice.actions;
export default cartSlice.reducer;