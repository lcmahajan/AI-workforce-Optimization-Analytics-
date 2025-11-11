import { Switch, Route, Redirect, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AuthProvider, useAuth } from "@/lib/auth";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import Analytics from "@/pages/Analytics";
import Employees from "@/pages/Employees";
import FitmentAnalysis from "@/pages/FitmentAnalysis";
import UploadData from "@/pages/UploadData";
import Optimization from "@/pages/Optimization";
import Reports from "@/pages/Reports";
import Softskills from "@/pages/Softskills";
import Fatigue from "@/pages/Fatigue";
import Settings from "@/pages/Settings";
import Documentation from "@/pages/Documentation";
import Login from "@/pages/Login";

function ProtectedRoute({ component: Component }: { component: () => JSX.Element }) {
  const { user, isLoading } = useAuth();
  const [location] = useLocation();

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!user) {
    return <Redirect to="/login" />;
  }

  return <Component />;
}

function AdminRoute({ component: Component }: { component: () => JSX.Element }) {
  const { user, isLoading } = useAuth();
  const [location] = useLocation();

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!user) {
    return <Redirect to="/login" />;
  }

  if (user.role !== "admin") {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-2">Access Denied</h1>
          <p className="text-muted-foreground">You need administrator privileges to access this page.</p>
        </div>
      </div>
    );
  }

  return <Component />;
}

function Router() {
  const { user } = useAuth();

  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/">
        {() => <ProtectedRoute component={Dashboard} />}
      </Route>
      <Route path="/analytics">
        {() => <ProtectedRoute component={Analytics} />}
      </Route>
      <Route path="/employees">
        {() => <ProtectedRoute component={Employees} />}
      </Route>
      <Route path="/fitment">
        {() => <ProtectedRoute component={FitmentAnalysis} />}
      </Route>
      <Route path="/upload">
        {() => <AdminRoute component={UploadData} />}
      </Route>
      <Route path="/optimization">
        {() => <ProtectedRoute component={Optimization} />}
      </Route>
      <Route path="/reports">
        {() => <ProtectedRoute component={Reports} />}
      </Route>
      <Route path="/softskills">
        {() => <ProtectedRoute component={Softskills} />}
      </Route>
      <Route path="/fatigue">
        {() => <ProtectedRoute component={Fatigue} />}
      </Route>
      <Route path="/settings">
        {() => <ProtectedRoute component={Settings} />}
      </Route>
      <Route path="/documentation">
        {() => <ProtectedRoute component={Documentation} />}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const { user } = useAuth();
  const [location] = useLocation();
  const isLoginPage = location === "/login";

  const style = {
    "--sidebar-width": "16rem",
  };

  if (isLoginPage) {
    return <Router />;
  }

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="flex items-center justify-between p-4 border-b bg-background">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <div className="flex items-center gap-4">
              {user && (
                <div className="text-sm text-muted-foreground">
                  {user.username} ({user.role})
                </div>
              )}
              <ThemeToggle />
            </div>
          </header>
          <main className="flex-1 overflow-auto p-8">
            <Router />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <AppContent />
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
