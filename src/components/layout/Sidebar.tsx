"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartLine, faUsers, faUser, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { authService } from "@/services/client/auth.service";

const navItems = [
  { path: "/dashboard/analyzed", label: "Analyzed Sessions", icon: faChartLine },
  { path: "/dashboard/profile", label: "Profile", icon: faUser },
];

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

      {/* Divider */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", margin: "12px 0" }} />

      {/* Logout Button */}
      <button
        onClick={async () => {
          try {
            await authService.logout();
          } catch (error) {
            console.error("Logout failed", error);
            alert("Failed to logout. Please try again.");
          }
        }}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "10px 10px",
          borderRadius: 9,
          background: "transparent",
          color: "rgba(255,255,255,0.7)",
          fontSize: 13,
          fontWeight: 500,
          cursor: "pointer",
          transition: "all 0.15s",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        <FontAwesomeIcon icon={faRightFromBracket} />
        Logout
      </button>

    </aside>
  );
};
