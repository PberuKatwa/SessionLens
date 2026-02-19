import type { Metadata } from "next";
import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";

export const metadata: Metadata = {
  title: "Shamiri — Supervisor Dashboard",
  description: "Supervisor Intelligence Dashboard for Shamiri Institute",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          font-family: 'DM Sans', sans-serif;
          background: #F9FAFB;
          -webkit-font-smoothing: antialiased;
        }

        .pulse-dot {
          animation: pulse-anim 2s infinite;
        }
        @keyframes pulse-anim {
          0%, 100% { box-shadow: 0 0 0 3px rgba(180, 240, 0, 0.3); }
          50%       { box-shadow: 0 0 0 6px rgba(180, 240, 0, 0.1); }
        }

        /* Sidebar link hover (can't do pseudo-class inline) */
        a.nav-link:hover {
          background: rgba(255,255,255,0.06) !important;
        }

        /* Table row hover */
        tr.hoverable:hover td {
          background: #FAFAFA;
        }

        /* Card hover */
        .group-card:hover {
          box-shadow: 0 4px 18px rgba(18,36,91,0.09) !important;
          transform: translateY(-1px) !important;
        }

        /* Button hover states */
        .btn-primary:hover {
          background: #1a3278 !important;
        }
        .btn-ghost-danger:hover {
          background: rgba(239,68,68,0.04) !important;
          border-color: rgba(239,68,68,0.3) !important;
        }
        .btn-ghost-danger:hover span {
          color: #DC2626;
        }
        .filter-tab:hover {
          background: #F9FAFB !important;
        }
      `}</style>

      <div
        style={{
          display: "flex",
          minHeight: "100vh",
          background: "#F9FAFB",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        <Sidebar />

        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
          <Topbar />
          <main
            style={{
              flex: 1,
              padding: 28,
              overflowY: "auto",
            }}
          >
            {children}
          </main>
        </div>
      </div>
    </>
  );
}
