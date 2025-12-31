import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import PlayerSidebar from "@/components/player/PlayerSidebar";
import PlayerHeader from "@/components/player/PlayerHeader";
import MapView from "@/components/player/MapView";
import MyTeam from "@/components/player/MyTeam";
import MyBookings from "@/components/player/MyBookings";
import FindTeams from "@/components/player/FindTeams";
import PlayerChat from "@/components/player/PlayerChat";

type PlayerView = "map" | "team" | "bookings" | "find-teams" | "chat";

const PlayerDashboard = () => {
  const { user } = useAuth();
  const [activeView, setActiveView] = useState<PlayerView>("map");
  const [isChatOpen, setIsChatOpen] = useState(false);

  const renderView = () => {
    switch (activeView) {
      case "map":
        return <MapView />;
      case "team":
        return <MyTeam />;
      case "bookings":
        return <MyBookings />;
      case "find-teams":
        return <FindTeams />;
      case "chat":
        return <PlayerChat />;
      default:
        return <MapView />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <PlayerSidebar activeView={activeView} setActiveView={setActiveView} />
      
      <div className="flex-1 flex flex-col">
        <PlayerHeader 
          onChatToggle={() => setIsChatOpen(!isChatOpen)} 
          isChatOpen={isChatOpen}
        />
        
        <main className="flex-1 p-6 overflow-auto">
          {renderView()}
        </main>
      </div>

      {/* Chat Panel */}
      {isChatOpen && (
        <div className="w-80 border-l border-white/10 bg-card/50 backdrop-blur-xl">
          <PlayerChat embedded />
        </div>
      )}
    </div>
  );
};

export default PlayerDashboard;