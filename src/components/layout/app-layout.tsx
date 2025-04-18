import { ReactNode } from "react";
import { AppSidebar } from "./app-sidebar";
import AppHeader from "./app-header";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="relative min-h-screen">
      <AppSidebar />
      <main className="transition-all duration-300 md:ml-[240px] px-6 py-2">
        <AppHeader />
        <div className="mt-2">
          {children}
        </div>
      </main>
    </div>
  );
}

export default AppLayout;
