import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { NavBar } from './components/NavBar';
import { Dashboard } from './components/Dashboard';
import { CommitListPage } from './pages/CommitListPage';
import { CommitDetailPage } from './pages/CommitDetailPage';
import { POLL_INTERVAL_MS } from './constants';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: POLL_INTERVAL_MS,
      retry: 1,
    },
  },
});

function Layout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <Outlet />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/commits" element={<CommitListPage />} />
            <Route path="/commits/:sha" element={<CommitDetailPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
