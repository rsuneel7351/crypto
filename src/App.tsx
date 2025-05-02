import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Layout from "@/components/Layout";
import Index from "@/pages/Index";
import CryptoDetails from "@/pages/CryptoDetails";
import Favorites from "@/pages/Favorites";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="crypto-watch-theme">
        <TooltipProvider>
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/crypto/:id" element={<CryptoDetails />} />
                <Route path="/favorites" element={<Favorites />} />
              </Routes>
              <Toaster />
            </Layout>
          </Router>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
