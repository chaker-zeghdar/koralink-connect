import { Bell, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

const OwnerHeader = () => {
  const { user } = useAuth();

  return (
    <header className="h-16 bg-card/50 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-6">
      <div>
        <h2 className="font-semibold text-lg">Stadium Management</h2>
        <p className="text-sm text-muted-foreground">{user?.email}</p>
      </div>

      <div className="flex items-center gap-3">
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
        </Button>

        {/* Profile */}
        <Button variant="ghost" size="icon">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <User size={16} className="text-primary" />
          </div>
        </Button>
      </div>
    </header>
  );
};

export default OwnerHeader;