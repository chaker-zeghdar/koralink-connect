import { useState, useEffect } from "react";
import { Users, Search, MapPin, Star, UserPlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface Team {
  id: string;
  name: string;
  level: number | null;
  looking_for_players: boolean;
  captain_id: string;
}

const FindTeams = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const { data, error } = await supabase
        .from("teams")
        .select("*")
        .eq("looking_for_players", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTeams(data || []);
    } catch (error) {
      console.error("Error fetching teams:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRequest = async (teamId: string) => {
    toast({
      title: "Request Sent!",
      description: "Your request to join this team has been sent to the captain.",
    });
  };

  const filteredTeams = teams.filter((team) =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-display">Find Teams</h2>
        <div className="relative w-80">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search teams..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {filteredTeams.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTeams.map((team) => (
            <div
              key={team.id}
              className="bg-card/50 rounded-xl p-6 border border-white/10 hover:border-primary/50 transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Users size={28} className="text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{team.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Star size={14} className="text-yellow-400" />
                      Level {team.level || "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded-full">
                  Looking for players
                </span>
                <Button
                  size="sm"
                  onClick={() => handleJoinRequest(team.id)}
                  className="bg-primary hover:bg-primary/90"
                >
                  <UserPlus size={16} className="mr-2" />
                  Request to Join
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Users size={64} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Teams Found</h3>
          <p className="text-muted-foreground">
            {searchQuery
              ? "Try a different search term"
              : "No teams are currently looking for players"}
          </p>
        </div>
      )}
    </div>
  );
};

export default FindTeams;