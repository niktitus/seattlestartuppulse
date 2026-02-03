import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Events from "./pages/Events";
import DeadlinesPage from "./pages/DeadlinesPage";
import NewsPage from "./pages/NewsPage";
import ResourcesPage from "./pages/ResourcesPage";
import AllEvents from "./pages/AllEvents";
import JobsPage from "./pages/JobsPage";
import LearningPage from "./pages/LearningPage";
import FractionalPage from "./pages/FractionalPage";
import Admin from "./pages/Admin";
import EarlyAccess from "./pages/EarlyAccess";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Events />} />
          <Route path="/deadlines" element={<DeadlinesPage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/events" element={<AllEvents />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/learning" element={<LearningPage />} />
          <Route path="/fractional" element={<FractionalPage />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/early-access" element={<EarlyAccess />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
