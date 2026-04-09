import {
  LayoutDashboard,
  Users,
  Wallet,
  UserCircle,
  Bell,
  Crown,
  ShieldAlert,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
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
  useSidebar,
} from "@/components/ui/sidebar";

const navItems = [
  { titleKey: "nav.segments", url: "/", icon: LayoutDashboard },
  { titleKey: "nav.demographics", url: "/demographics", icon: Users },
  { titleKey: "nav.accounts", url: "/accounts", icon: Wallet },
  { titleKey: "nav.customer360", url: "/customer-360", icon: UserCircle },
  { titleKey: "nav.alerts", url: "/alerts", icon: Bell },
  { titleKey: "nav.vip", url: "/vip", icon: Crown },
  { titleKey: "nav.behaviorRisk", url: "/behavior-risk", icon: ShieldAlert },
];

const AppSidebar = () => {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const { t } = useLanguage();

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground text-xs font-bold">
            BA
          </div>
          {!collapsed && (
            <div>
              <p className="text-sm font-semibold text-sidebar-accent-foreground">{t("app.brand")}</p>
              <p className="text-[10px] text-sidebar-muted">{t("app.subtitle")}</p>
            </div>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-muted text-[10px] uppercase tracking-widest">
            {!collapsed ? t("nav.label") : ""}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.titleKey}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className="gap-2.5 rounded-md px-3 py-2 text-sm text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span>{t(item.titleKey)}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
