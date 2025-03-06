import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Provider } from 'react-redux'; 
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/dist/query';
import authReducer from './state/authSlice';
import { apiSlice } from './state/apiSlice';
import { paymentsApiSlice } from './state/paymentsApiSlice';
import notificationReducer from './state/notificationSlice';
import { DarkModeContextProvider } from "./context/darkModeContext";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    notifications: notificationReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
    [paymentsApiSlice.reducerPath]: paymentsApiSlice.reducer,
  }, 
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware().concat(apiSlice.middleware, paymentsApiSlice.middleware),
  devTools: true,
});

setupListeners(store.dispatch);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <Provider store={store}>
        <DarkModeContextProvider>
          <App />
        </DarkModeContextProvider>
      </Provider>
  </React.StrictMode>
);
