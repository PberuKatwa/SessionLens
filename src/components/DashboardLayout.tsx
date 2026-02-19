// src/components/layout/DashboardLayout.tsx
import { Outlet } from "react-router-dom";
import { Sidebar } from "./layout/Sidebar";

export const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 flex-shrink-0">
        <Sidebar />
      </div>

      {/* Main content */}
      <main className="flex-1 bg-gray-50 p-6">
        <Outlet />
      </main>
    </div>
  );
};
