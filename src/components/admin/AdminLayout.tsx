import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { LayoutDashboard, Image, CalendarDays, BookOpen, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { to: "/admin", icon: LayoutDashboard, label: "Dashboard", end: true },
  { to: "/admin/hero", icon: Image, label: "Hero Manager" },
  { to: "/admin/exhibitions", icon: CalendarDays, label: "Exhibitions" },
  { to: "/admin/journal", icon: BookOpen, label: "Journal" },
  { to: "/admin/global", icon: Settings, label: "Global Sections" },
];

const AdminLayout = () => {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/admin/login");
  };

  return (
    <div className="flex h-screen bg-background" style={{ cursor: 'default' }}>
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-sidebar-background flex flex-col">
        <div className="p-6 border-b border-border">
          <h1 className="text-sm font-semibold tracking-wide text-foreground">Art at Central</h1>
          <p className="text-xs text-muted-foreground mt-1">Content Manager</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`
              }
              style={{ cursor: 'default' }}
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-border space-y-3">
          <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          <Button variant="ghost" size="sm" className="w-full justify-start gap-2" onClick={handleSignOut}>
            <LogOut size={14} />
            Sign out
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
