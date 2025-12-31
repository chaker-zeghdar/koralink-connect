import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import OwnerSidebar from "@/components/owner/OwnerSidebar";
import OwnerHeader from "@/components/owner/OwnerHeader";
import StadiumManagement from "@/components/owner/StadiumManagement";
import TimelineManagement from "@/components/owner/TimelineManagement";
import BookingRequests from "@/components/owner/BookingRequests";
import OwnerAnalytics from "@/components/owner/OwnerAnalytics";

type OwnerView = "stadiums" | "timeline" | "requests" | "analytics";

const OwnerDashboard = () => {
  const { user } = useAuth();
  const [activeView, setActiveView] = useState<OwnerView>("stadiums");

  const renderView = () => {
    switch (activeView) {
      case "stadiums":
        return <StadiumManagement />;
      case "timeline":
        return <TimelineManagement />;
      case "requests":
        return <BookingRequests />;
      case "analytics":
        return <OwnerAnalytics />;
      default:
        return <StadiumManagement />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <OwnerSidebar activeView={activeView} setActiveView={setActiveView} />
      
      <div className="flex-1 flex flex-col">
        <OwnerHeader />
        
        <main className="flex-1 p-6 overflow-auto">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default OwnerDashboard;