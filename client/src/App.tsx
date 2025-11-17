import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/lib/theme-provider";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { NotificationCenter } from "@/components/notification-center";

import Welcome from "@/pages/welcome";
import Login from "@/pages/login";
import Register from "@/pages/register";
import Help from "@/pages/help";

import MemberDashboard from "@/pages/member/dashboard";
import MemberAccounts from "@/pages/member/accounts";
import StaffDashboard from "@/pages/staff/dashboard";
import AdminDashboard from "@/pages/admin/dashboard";

import NotFound from "@/pages/not-found";

function ProtectedRoute({ component: Component, allowedRoles }: { component: React.ComponentType; allowedRoles: string[] }) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  }

  if (!allowedRoles.includes(user!.role)) {
    return <Redirect to="/" />;
  }

  return <Component />;
}

function AuthenticatedLayout() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  }

  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="flex items-center justify-between gap-4 p-4 border-b bg-background sticky top-0 z-10">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <div className="flex items-center gap-2">
              <NotificationCenter />
              <ThemeToggle />
            </div>
          </header>
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-7xl mx-auto">
              <Switch>
                {/* Member Routes */}
                <Route path="/member/dashboard" component={() => <ProtectedRoute component={MemberDashboard} allowedRoles={['member']} />} />
                <Route path="/member/accounts" component={() => <ProtectedRoute component={MemberAccounts} allowedRoles={['member']} />} />
                <Route path="/member/transactions" component={() => <ProtectedRoute component={MemberDashboard} allowedRoles={['member']} />} />
                <Route path="/member/loans" component={() => <ProtectedRoute component={MemberDashboard} allowedRoles={['member']} />} />
                <Route path="/member/messages" component={() => <ProtectedRoute component={MemberDashboard} allowedRoles={['member']} />} />
                <Route path="/member/profile" component={() => <ProtectedRoute component={MemberDashboard} allowedRoles={['member']} />} />

                {/* Staff Routes */}
                <Route path="/staff/dashboard" component={() => <ProtectedRoute component={StaffDashboard} allowedRoles={['staff']} />} />
                <Route path="/staff/members" component={() => <ProtectedRoute component={StaffDashboard} allowedRoles={['staff']} />} />
                <Route path="/staff/transactions" component={() => <ProtectedRoute component={StaffDashboard} allowedRoles={['staff']} />} />
                <Route path="/staff/loans" component={() => <ProtectedRoute component={StaffDashboard} allowedRoles={['staff']} />} />
                <Route path="/staff/support" component={() => <ProtectedRoute component={StaffDashboard} allowedRoles={['staff']} />} />
                <Route path="/staff/reports" component={() => <ProtectedRoute component={StaffDashboard} allowedRoles={['staff']} />} />

                {/* Admin Routes */}
                <Route path="/admin/dashboard" component={() => <ProtectedRoute component={AdminDashboard} allowedRoles={['admin']} />} />
                <Route path="/admin/analytics" component={() => <ProtectedRoute component={AdminDashboard} allowedRoles={['admin']} />} />
                <Route path="/admin/members" component={() => <ProtectedRoute component={AdminDashboard} allowedRoles={['admin']} />} />
                <Route path="/admin/loans" component={() => <ProtectedRoute component={AdminDashboard} allowedRoles={['admin']} />} />
                <Route path="/admin/compliance" component={() => <ProtectedRoute component={AdminDashboard} allowedRoles={['admin']} />} />
                <Route path="/admin/marketing" component={() => <ProtectedRoute component={AdminDashboard} allowedRoles={['admin']} />} />
                <Route path="/admin/reports" component={() => <ProtectedRoute component={AdminDashboard} allowedRoles={['admin']} />} />
                <Route path="/admin/settings" component={() => <ProtectedRoute component={AdminDashboard} allowedRoles={['admin']} />} />

                <Route component={NotFound} />
              </Switch>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

function PublicRouter() {
  return (
    <Switch>
      <Route path="/" component={Welcome} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/help" component={Help} />
      <Route component={NotFound} />
    </Switch>
  );
}

function MainRouter() {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <AuthenticatedLayout /> : <PublicRouter />;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <TooltipProvider>
            <MainRouter />
            <Toaster />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
