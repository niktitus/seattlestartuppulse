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
import DirectoryPage from "./pages/DirectoryPage";

import LearningPage from "./pages/LearningPage";
import FractionalPage from "./pages/FractionalPage";
import Admin from "./pages/Admin";
import EarlyAccess from "./pages/EarlyAccess";
import StartupShowcase from "./pages/StartupShowcase";
import FeedbackPage from "./pages/FeedbackPage";
import SponsorshipPage from "./pages/SponsorshipPage";
import PlanEventPage from "./pages/PlanEventPage";
import Groups from "./pages/Groups";
import NotFound from "./pages/NotFound";
import VoidPage from "./pages/VoidPage";
import VoidAdminPage from "./pages/VoidAdminPage";
import CoffeeMentorPage from "./pages/CoffeeMentorPage";
import FairSubmitPage from "./pages/FairSubmitPage";
import FairPage from "./pages/FairPage";
import FairOrgPage from "./pages/FairOrgPage";
import FairCardPrintPage from "./pages/FairCardPrintPage";
import CoffeePage from "./pages/CoffeePage";
import CoffeePaperPage from "./pages/CoffeePaperPage";
import PersonCardPage from "./pages/PersonCardPage";
import VouchPage from "./pages/VouchPage";
import CheckinPage from "./pages/CheckinPage";
import CoffeeAdminPage from "./pages/CoffeeAdminPage";

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
          
          <Route path="/learning" element={<LearningPage />} />
          <Route path="/directory" element={<DirectoryPage />} />
          <Route path="/fractional" element={<FractionalPage />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/void" element={<VoidPage />} />
          <Route path="/void/admin" element={<VoidAdminPage />} />
          <Route path="/early-access" element={<EarlyAccess />} />
          <Route path="/showcase" element={<StartupShowcase />} />
          <Route path="/feedback" element={<FeedbackPage />} />
          <Route path="/sponsorship" element={<SponsorshipPage />} />
          <Route path="/plan-event" element={<PlanEventPage />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/coffee" element={<CoffeePage />} />
          <Route path="/coffee/mentor" element={<CoffeeMentorPage />} />
          <Route path="/coffee/paper" element={<CoffeePaperPage />} />
          <Route path="/fair" element={<FairPage />} />
          <Route path="/fair/submit" element={<FairSubmitPage />} />
          <Route path="/fair/:slug" element={<FairOrgPage />} />
          <Route path="/fair/:slug/card" element={<FairCardPrintPage />} />
          <Route path="/p/:shortId" element={<PersonCardPage />} />
          <Route path="/vouch/:token" element={<VouchPage />} />
          <Route path="/checkin/:token" element={<CheckinPage />} />
          <Route path="/admin/coffee" element={<CoffeeAdminPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
