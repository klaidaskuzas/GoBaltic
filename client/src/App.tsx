import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LiveChat from "@/components/LiveChat";
import Home from "@/pages/home";
import Services from "@/pages/services";
import About from "@/pages/about";
import Contact from "@/pages/contact";
import Tracking from "@/pages/tracking";
import LoginPage from "@/pages/login";
import Dashboard from "@/pages/dashboard";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { lazy, Suspense } from "react";
import { AuthProvider } from "./hooks/use-auth";
import { ProtectedRoute } from "./lib/protected-route";
import { useScrollTop } from "./hooks/use-scroll-top";

// Lazy load dashboard pages for better performance
const DashboardShipments = lazy(() => import("@/pages/dashboard/shipments"));
const DashboardCustomers = lazy(() => import("@/pages/dashboard/customers"));
const DashboardNewCustomer = lazy(() => import("@/pages/dashboard/new-customer"));
const DashboardCustomerDetails = lazy(() => import("@/pages/dashboard/customer-details"));
const DashboardEditCustomer = lazy(() => import("@/pages/dashboard/edit-customer"));
const DashboardVehicles = lazy(() => import("@/pages/dashboard/vehicles"));
const DashboardFinance = lazy(() => import("@/pages/dashboard/finance"));
const DashboardExpenses = lazy(() => import("@/pages/dashboard/expenses"));
const DashboardRevenue = lazy(() => import("@/pages/dashboard/revenue"));
const DashboardReports = lazy(() => import("@/pages/dashboard/reports"));
const DashboardLogistics = lazy(() => import("@/pages/dashboard/logistics"));
const DashboardAnalytics = lazy(() => import("@/pages/dashboard/analytics"));
const DashboardAiAssistant = lazy(() => import("@/pages/dashboard/ai-assistant"));
const DashboardSettings = lazy(() => import("@/pages/dashboard/settings"));
const DashboardHelp = lazy(() => import("@/pages/dashboard/help"));
const DashboardLogisticsMap = lazy(() => import("@/pages/dashboard/logistics-map"));
const DashboardSearch = lazy(() => import("@/pages/dashboard/search"));

function DashboardFallback() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="flex flex-col items-center gap-2">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-blue-600 font-medium">Loading dashboard...</p>
      </div>
    </div>
  );
}

function DashboardComponent() {
  return (
    <Suspense fallback={<DashboardFallback />}>
      <Dashboard />
    </Suspense>
  );
}

function DashboardShipmentsComponent() {
  return (
    <Suspense fallback={<DashboardFallback />}>
      <DashboardShipments />
    </Suspense>
  );
}

function DashboardCustomersComponent() {
  return (
    <Suspense fallback={<DashboardFallback />}>
      <DashboardCustomers />
    </Suspense>
  );
}

function DashboardNewCustomerComponent() {
  return (
    <Suspense fallback={<DashboardFallback />}>
      <DashboardNewCustomer />
    </Suspense>
  );
}

function DashboardCustomerDetailsComponent() {
  return (
    <Suspense fallback={<DashboardFallback />}>
      <DashboardCustomerDetails />
    </Suspense>
  );
}

function DashboardEditCustomerComponent() {
  return (
    <Suspense fallback={<DashboardFallback />}>
      <DashboardEditCustomer />
    </Suspense>
  );
}

function DashboardVehiclesComponent() {
  return (
    <Suspense fallback={<DashboardFallback />}>
      <DashboardVehicles />
    </Suspense>
  );
}

function DashboardFinanceComponent() {
  return (
    <Suspense fallback={<DashboardFallback />}>
      <DashboardFinance />
    </Suspense>
  );
}

function DashboardExpensesComponent() {
  return (
    <Suspense fallback={<DashboardFallback />}>
      <DashboardExpenses />
    </Suspense>
  );
}

function DashboardRevenueComponent() {
  return (
    <Suspense fallback={<DashboardFallback />}>
      <DashboardRevenue />
    </Suspense>
  );
}

function DashboardReportsComponent() {
  return (
    <Suspense fallback={<DashboardFallback />}>
      <DashboardReports />
    </Suspense>
  );
}

function DashboardLogisticsComponent() {
  return (
    <Suspense fallback={<DashboardFallback />}>
      <DashboardLogistics />
    </Suspense>
  );
}

function DashboardAnalyticsComponent() {
  return (
    <Suspense fallback={<DashboardFallback />}>
      <DashboardAnalytics />
    </Suspense>
  );
}

function DashboardAiAssistantComponent() {
  return (
    <Suspense fallback={<DashboardFallback />}>
      <DashboardAiAssistant />
    </Suspense>
  );
}

function DashboardSettingsComponent() {
  return (
    <Suspense fallback={<DashboardFallback />}>
      <DashboardSettings />
    </Suspense>
  );
}

function DashboardHelpComponent() {
  return (
    <Suspense fallback={<DashboardFallback />}>
      <DashboardHelp />
    </Suspense>
  );
}

function DashboardLogisticsMapComponent() {
  return (
    <Suspense fallback={<DashboardFallback />}>
      <DashboardLogisticsMap />
    </Suspense>
  );
}

function DashboardSearchComponent() {
  return (
    <Suspense fallback={<DashboardFallback />}>
      <DashboardSearch />
    </Suspense>
  );
}

function Router() {
  return (
    <Switch>
      {/* Public routes */}
      <Route path="/" component={Home} />
      <Route path="/services" component={Services} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      <Route path="/tracking" component={Tracking} />
      <Route path="/tracking/:trackingNumber" component={Tracking} />
      <Route path="/login" component={LoginPage} />
      
      {/* Protected Dashboard routes */}
      <ProtectedRoute path="/dashboard" component={DashboardComponent} />
      <ProtectedRoute path="/dashboard/shipments" component={DashboardShipmentsComponent} />
      <ProtectedRoute path="/dashboard/customers" component={DashboardCustomersComponent} />
      <ProtectedRoute path="/dashboard/customers/new" component={DashboardNewCustomerComponent} />
      <ProtectedRoute path="/dashboard/customers/:id" component={DashboardCustomerDetailsComponent} />
      <ProtectedRoute path="/dashboard/edit-customer/:id" component={DashboardEditCustomerComponent} />
      <ProtectedRoute path="/dashboard/vehicles" component={DashboardVehiclesComponent} />
      <ProtectedRoute path="/dashboard/finance" component={DashboardFinanceComponent} />
      <ProtectedRoute path="/dashboard/expenses" component={DashboardExpensesComponent} />
      <ProtectedRoute path="/dashboard/revenue" component={DashboardRevenueComponent} />
      <ProtectedRoute path="/dashboard/reports" component={DashboardReportsComponent} />
      <ProtectedRoute path="/dashboard/logistics" component={DashboardLogisticsComponent} />
      <ProtectedRoute path="/dashboard/analytics" component={DashboardAnalyticsComponent} />
      <ProtectedRoute path="/dashboard/ai-assistant" component={DashboardAiAssistantComponent} />
      <ProtectedRoute path="/dashboard/settings" component={DashboardSettingsComponent} />
      <ProtectedRoute path="/dashboard/help" component={DashboardHelpComponent} />
      <ProtectedRoute path="/dashboard/logistics-map" component={DashboardLogisticsMapComponent} />
      <ProtectedRoute path="/dashboard/search" component={DashboardSearchComponent} />
      
      {/* Not found route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [location] = useLocation();
  const isDashboard = location.startsWith("/dashboard");
  const isLogin = location === "/login";
  
  // Use the scroll top hook to ensure page always loads at the top
  useScrollTop();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LanguageProvider>
          <div className="flex flex-col min-h-screen">
            {/* Only show navbar and footer on non-dashboard and non-login pages */}
            {!isDashboard && !isLogin && <Navbar />}
            <main className={`flex-grow ${!isDashboard && !isLogin ? "" : "p-0"}`}>
              <Router />
            </main>
            {!isDashboard && !isLogin && <Footer />}
            {!isDashboard && !isLogin && <LiveChat />}
          </div>
          <Toaster />
        </LanguageProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
