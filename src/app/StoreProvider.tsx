"use client";

import { store } from '@/redux/store';
import React, { ReactNode, memo } from 'react';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from 'react-query';

const StoreProvider = ({ children }: { children: ReactNode }) => {

  const queryClient = new QueryClient();

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </Provider>
  )
}

export default memo(StoreProvider);
