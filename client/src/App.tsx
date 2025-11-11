import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import Analytics from "@/pages/Analytics";
import Employees from "@/pages/Employees";
import UploadData from "@/pages/UploadData";
import Optimization from "@/pages/Optimization";
import Reports from "@/pages/Reports";
import Softskills from "@/pages/Softskills";
import Fatigue from "@/pages/Fatigue";
import Settings from "@/pages/Settings";
import Documentation from "@/pages/Documentation";
import Login from "@/pages/Login";

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/" component={Dashboard} />
      <Route path="/analytics" component={Analytics} />
      <Route path="/employees" component={Employees} />
      <Route path="/upload" component={UploadData} />
      <Route path="/optimization" component={Optimization} />
      <Route path="/reports" component={Reports} />
      <Route path="/softskills" component={Softskills} />
      <Route path="/fatigue" component={Fatigue} />
      <Route path="/settings" component={Settings} />
      <Route path="/documentation" component={Documentation} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const style = {
    "--sidebar-width": "16rem",
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SidebarProvider style={style as React.CSSProperties}>
          <div className="flex h-screen w-full">
            <AppSidebar />
            <div className="flex flex-col flex-1 overflow-hidden">
              <header className="flex items-center justify-between p-4 border-b bg-background">
                <SidebarTrigger data-testid="button-sidebar-toggle" />
                <ThemeToggle />
              </header>
              <main className="flex-1 overflow-auto p-8">
                <Router />
              </main>
            </div>
          </div>
        </SidebarProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
