import { MapPin, Users, Calendar, Search, MessageCircle, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

type PlayerView = "map" | "team" | "bookings" | "find-teams" | "chat";

interface PlayerSidebarProps {
  activeView: PlayerView;
  setActiveView: (view: PlayerView) => void;
}

const PlayerSidebar = ({ activeView, setActiveView }: PlayerSidebarProps) => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { id: "map" as PlayerView, icon: MapPin, label: "Find Stadiums" },
    { id: "team" as PlayerView, icon: Users, label: "My Team" },
    { id: "bookings" as PlayerView, icon: Calendar, label: "My Bookings" },
    { id: "find-teams" as PlayerView, icon: Search, label: "Find Teams" },
    { id: "chat" as PlayerView, icon: MessageCircle, label: "Chat" },
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
        <p className="text-xs text-muted-foreground mt-1">Player Dashboard</p>
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

export default PlayerSidebar;