import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
// import storage from 'redux-persist/lib/storage';

import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';

import sidebarReducer from './sidebarSlice';
import cartReducer from './cartSlice';
import storage from '@/lib/reduxPersistStorage';


const rootReducer = combineReducers({
  sidebar: sidebarReducer,
  cart: cartReducer,

});

const persistConfig = {
  key: 'JinStoreData',
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore redux-persist action types
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
