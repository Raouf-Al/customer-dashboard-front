import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "./AppSidebar";
import GlobalHeader from "./GlobalHeader";

const DashboardLayout = ({ children }: { children: ReactNode }) => (
  <SidebarProvider>
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex items-center">
          <SidebarTrigger className="ml-2 shrink-0" />
          <div className="flex-1">
            <GlobalHeader />
          </div>
        </div>
        <main className="flex-1 overflow-auto p-6 scrollbar-thin">
          {children}
        </main>
      </div>
    </div>
  </SidebarProvider>
);

export default DashboardLayout;
