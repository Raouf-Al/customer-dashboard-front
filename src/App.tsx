import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import SegmentsPage from "./pages/SegmentsPage";
import DemographicsPage from "./pages/DemographicsPage";
import AccountsPage from "./pages/AccountsPage";
import Customer360Page from "./pages/Customer360Page";
import AlertsPage from "./pages/AlertsPage";
import VIPPage from "./pages/VIPPage";
import BehaviorRiskPage from "./pages/BehaviorRiskPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <DashboardLayout>
          <Routes>
            <Route path="/" element={<SegmentsPage />} />
            <Route path="/demographics" element={<DemographicsPage />} />
            <Route path="/accounts" element={<AccountsPage />} />
            <Route path="/customer-360" element={<Customer360Page />} />
            <Route path="/alerts" element={<AlertsPage />} />
            <Route path="/vip" element={<VIPPage />} />
            <Route path="/behavior-risk" element={<BehaviorRiskPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </DashboardLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
