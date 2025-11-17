import { Link, useLocation } from "wouter";
import {
  Home,
  Wallet,
  CreditCard,
  Receipt,
  Users,
  Settings,
  HelpCircle,
  BarChart3,
  FileText,
  MessageSquare,
  ShieldCheck,
  TrendingUp,
  Building2,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

const memberMenuItems = [
  { title: "Dashboard", url: "/member/dashboard", icon: Home },
  { title: "Accounts", url: "/member/accounts", icon: Wallet },
  { title: "Transactions", url: "/member/transactions", icon: Receipt },
  { title: "Loans", url: "/member/loans", icon: CreditCard },
  { title: "Messages", url: "/member/messages", icon: MessageSquare },
  { title: "Profile", url: "/member/profile", icon: Settings },
  { title: "Help", url: "/help", icon: HelpCircle },
];

const staffMenuItems = [
  { title: "Dashboard", url: "/staff/dashboard", icon: Home },
  { title: "Members", url: "/staff/members", icon: Users },
  { title: "Transactions", url: "/staff/transactions", icon: Receipt },
  { title: "Loans", url: "/staff/loans", icon: CreditCard },
  { title: "Support", url: "/staff/support", icon: MessageSquare },
  { title: "Reports", url: "/staff/reports", icon: FileText },
  { title: "Help", url: "/help", icon: HelpCircle },
];

const adminMenuItems = [
  { title: "Dashboard", url: "/admin/dashboard", icon: Home },
  { title: "Analytics", url: "/admin/analytics", icon: BarChart3 },
  { title: "Members", url: "/admin/members", icon: Users },
  { title: "Loans", url: "/admin/loans", icon: CreditCard },
  { title: "Compliance", url: "/admin/compliance", icon: ShieldCheck },
  { title: "Marketing", url: "/admin/marketing", icon: TrendingUp },
  { title: "Reports", url: "/admin/reports", icon: FileText },
  { title: "Settings", url: "/admin/settings", icon: Settings },
];

export function AppSidebar() {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  const menuItems =
    user?.role === "admin"
      ? adminMenuItems
      : user?.role === "staff"
        ? staffMenuItems
        : memberMenuItems;

  return (
    <Sidebar>
      <SidebarHeader className="p-4 border-b">
        <div className="flex items-center gap-2">
          <Building2 className="h-8 w-8 text-primary" />
          <div>
            <h2 className="font-bold text-lg leading-none">Apostolos</h2>
            <p className="text-xs text-muted-foreground">SACCO</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wider">
            {user?.role === "admin" ? "Administration" : user?.role === "staff" ? "Operations" : "My Account"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    data-active={location === item.url || location.startsWith(item.url + "/")}
                    data-testid={`link-${item.title.toLowerCase().replace(/\s/g, "-")}`}
                  >
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t">
        <div className="flex items-center gap-3 mb-2">
          <Avatar className="h-10 w-10">
            <AvatarImage src="" />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {user?.username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">{user?.username}</p>
            <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={logout}
          className="w-full justify-start hover-elevate active-elevate-2"
          data-testid="button-logout"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
