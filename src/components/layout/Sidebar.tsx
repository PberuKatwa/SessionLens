// ─── Sidebar.tsx ─────────────────────────────────────────────────────────────
"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartLine, faUsers, faUser, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";

const navItems = [
  { path: "/dashboard/analyzed", label: "Analyzed Sessions", icon: faChartLine },
  { path: "/dashboard/group", label: "Group Sessions", icon: faUsers },
  { path: "/dashboard/profile", label: "Profile", icon: faUser },
];

// Fake user placeholder
const USER = {
  name: "John Doe",
  role: "Admin",
  avatar: "JD",
};

export const Sidebar = () => {
  const pathname = usePathname();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  };

  return (
    <aside style={{
      width: 220, background: "#12245B", display: "flex", flexDirection: "column",
      padding: "24px 0", flexShrink: 0, position: "relative", overflow: "hidden"
    }}>
      {/* Decorative glow */}
      <div style={{ position: "absolute", bottom: -60, left: -60, width: 200, height: 200, background: "#B4F000", borderRadius: "50%", opacity: 0.06, filter: "blur(50px)", pointerEvents: "none" }} />

      {/* Logo */}
      <div style={{ padding: "0 20px 24px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <Image src="/images/shamiri.png" alt="Shamiri" width={100} height={32} style={{ objectFit: "contain", filter: "brightness(0) invert(1)", maxHeight: 28 }} />
      </div>

      {/* AI Badge */}
      <div style={{ padding: "16px 20px 8px" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 100, padding: "4px 10px" }}>
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#B4F000", boxShadow: "0 0 0 2px rgba(180,240,0,0.25)" }} />
          <span style={{ fontSize: 9, fontWeight: 600, color: "rgba(255,255,255,0.5)", fontFamily: "'DM Mono', monospace", letterSpacing: "0.08em", textTransform: "uppercase" }}>shamiriAI Active</span>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "8px 12px" }}>
        <div style={{ fontSize: 9, fontWeight: 600, color: "rgba(255,255,255,0.25)", fontFamily: "'DM Mono', monospace", letterSpacing: "0.1em", textTransform: "uppercase", padding: "8px 8px 10px" }}>Navigation</div>
        {navItems.map(item => {
          const isActive = pathname === item.path;
          return (
            <Link key={item.path} href={item.path} style={{
              width: "100%", display: "flex", alignItems: "center", gap: 10,
              padding: "10px 10px", borderRadius: 9, marginBottom: 2,
              background: isActive ? "rgba(180,240,0,0.12)" : "transparent",
              border: isActive ? "1px solid rgba(180,240,0,0.2)" : "1px solid transparent",
              color: isActive ? "#B4F000" : "rgba(255,255,255,0.5)",
              fontSize: 13, fontWeight: isActive ? 600 : 400, cursor: "pointer",
              transition: "all 0.15s", textAlign: "left",
              fontFamily: "'DM Sans', sans-serif"
            }}
            >
              <FontAwesomeIcon icon={item.icon} style={{ opacity: isActive ? 1 : 0.7 }} />
              {item.label}
              {/*{item.id === "analyzed" && (
                <span style={{ marginLeft: "auto", background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)", fontSize: 10, fontWeight: 600, padding: "1px 7px", borderRadius: 100, fontFamily: "'DM Mono', monospace" }}>6</span>
              )}*/}
            </Link>
          );
        })}
      </nav>

      {/* User area */}
      <div style={{ padding: "16px 12px 0", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        <button onClick={handleLogout} style={{
          width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 10px",
          borderRadius: 9, background: "transparent", border: "none", cursor: "pointer", transition: "background 0.15s",
          color: "#F87171"
        }}
          onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
        >
          <FontAwesomeIcon icon={faRightFromBracket} />
          Logout
        </button>
      </div>
    </aside>
  );
};
