import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Dashboard } from './components/Dashboard';
import { POLL_INTERVAL_MS } from './constants';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: POLL_INTERVAL_MS,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Dashboard />
    </QueryClientProvider>
  );
}

export default App;
