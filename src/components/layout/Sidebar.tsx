"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine,
  faUsers,
  faUser,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";

const navItems = [
  { path: "/analyzed", label: "Analyzed", icon: faChartLine },
  { path: "/group", label: "Group", icon: faUsers },
  { path: "/profile", label: "Profile", icon: faUser },
];

export const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="h-screen bg-white border-r p-4 w-64">
      <h2 className="text-xl font-semibold mb-6">Session Lens</h2>

      <nav className="space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.path;

          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                isActive
                  ? "bg-blue-50 text-blue-600 font-medium"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <FontAwesomeIcon icon={item.icon} className="w-4 h-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="mt-8">
        <button
          className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-red-600 hover:bg-red-50 w-full"
          onClick={async () => {
            await fetch("/api/auth/logout", { method: "POST" });
            window.location.href = "/login";
          }}
        >
          <FontAwesomeIcon icon={faRightFromBracket} className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  );
};
