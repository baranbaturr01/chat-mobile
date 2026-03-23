import React, {useEffect, useState} from 'react';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {LanguageProvider, loadSavedLanguage} from '@/context/LanguageContext';
import AppNavigator from '@/navigation/AppNavigator';
import type {Language} from '@/types/user';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

const App: React.FC = () => {
  const [initialLanguage, setInitialLanguage] = useState<Language>('tr');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    loadSavedLanguage().then(lang => {
      setInitialLanguage(lang);
      setReady(true);
    });
  }, []);

  if (!ready) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider initialLanguage={initialLanguage}>
        <AppNavigator />
      </LanguageProvider>
    </QueryClientProvider>
  );
};

export default App;
