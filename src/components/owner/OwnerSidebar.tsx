import { MapPin, Calendar, Inbox, BarChart3, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

type OwnerView = "stadiums" | "timeline" | "requests" | "analytics";

interface OwnerSidebarProps {
  activeView: OwnerView;
  setActiveView: (view: OwnerView) => void;
}

const OwnerSidebar = ({ activeView, setActiveView }: OwnerSidebarProps) => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { id: "stadiums" as OwnerView, icon: MapPin, label: "My Stadiums" },
    { id: "timeline" as OwnerView, icon: Calendar, label: "Timeline" },
    { id: "requests" as OwnerView, icon: Inbox, label: "Booking Requests" },
    { id: "analytics" as OwnerView, icon: BarChart3, label: "Analytics" },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <aside className="w-64 bg-card/50 backdrop-blur-xl border-r border-white/10 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <h1 className="font-display text-2xl">
          KORA<span className="text-primary">LINK</span>
        </h1>
        <p className="text-xs text-muted-foreground mt-1">Stadium Owner Dashboard</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeView === item.id
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-white/5"
            }`}
          >
            <item.icon size={20} />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Sign Out */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
        >
          <LogOut size={20} />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default OwnerSidebar;