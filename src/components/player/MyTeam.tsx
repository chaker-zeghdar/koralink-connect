import { useState, useEffect } from "react";
import { Users, Plus, Shield, Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import PlayerCard from "./PlayerCard";

const POSITIONS = ["GK", "CB", "LB", "RB", "CDM", "CM", "CAM", "RW", "LW", "ST"];

interface TeamMember {
  id: string;
  name: string;
  age: number | null;
  position: string | null;
  level: number | null;
  is_captain: boolean;
}

interface Team {
  id: string;
  name: string;
  level: number | null;
  looking_for_players: boolean;
}

const MyTeam = () => {
  const { user } = useAuth();
  const [team, setTeam] = useState<Team | null>(null);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);

  // Form states
  const [teamName, setTeamName] = useState("");
  const [memberName, setMemberName] = useState("");
  const [memberAge, setMemberAge] = useState("");
  const [memberPosition, setMemberPosition] = useState("");
  const [memberLevel, setMemberLevel] = useState("");

  useEffect(() => {
    fetchTeam();
  }, [user]);

  const fetchTeam = async () => {
    if (!user) return;

    try {
      // Check if user is a captain of a team
      const { data: teamData, error: teamError } = await supabase
        .from("teams")
        .select("*")
        .eq("captain_id", user.id)
        .maybeSingle();

      if (teamError) throw teamError;

      if (teamData) {
        setTeam(teamData);
        
        // Fetch team members
        const { data: membersData, error: membersError } = await supabase
          .from("team_members")
          .select("*")
          .eq("team_id", teamData.id);

        if (membersError) throw membersError;
        setMembers(membersData || []);
      }
    } catch (error) {
      console.error("Error fetching team:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("teams")
        .insert({
          name: teamName,
          captain_id: user.id,
          level: 5,
          looking_for_players: true,
        })
        .select()
        .single();

      if (error) throw error;

      setTeam(data);
      setShowCreateForm(false);
      setTeamName("");
      toast({ title: "Team Created!", description: "Your team has been created successfully." });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !team) return;

    try {
      const { data, error } = await supabase
        .from("team_members")
        .insert({
          team_id: team.id,
          user_id: user.id,
          name: memberName,
          age: memberAge ? parseInt(memberAge) : null,
          position: memberPosition || null,
          level: memberLevel ? parseInt(memberLevel) : null,
        })
        .select()
        .single();

      if (error) throw error;

      setMembers([...members, data]);
      setShowAddMember(false);
      setMemberName("");
      setMemberAge("");
      setMemberPosition("");
      setMemberLevel("");
      toast({ title: "Player Added!", description: "Player has been added to your team." });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    try {
      const { error } = await supabase
        .from("team_members")
        .delete()
        .eq("id", memberId);

      if (error) throw error;

      setMembers(members.filter((m) => m.id !== memberId));
      toast({ title: "Player Removed", description: "Player has been removed from your team." });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!team && !showCreateForm) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
            <Users size={40} className="text-primary" />
          </div>
          <h2 className="text-2xl font-display mb-4">No Team Yet</h2>
          <p className="text-muted-foreground mb-8">
            Create your own team or join an existing one to organize matches with other players.
          </p>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => setShowCreateForm(true)} className="bg-primary hover:bg-primary/90">
              <Plus size={20} className="mr-2" />
              Create Team
            </Button>
            <Button variant="outline">
              <Users size={20} className="mr-2" />
              Find Teams
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (showCreateForm) {
    return (
      <div className="max-w-md mx-auto">
        <h2 className="text-2xl font-display mb-6">Create Your Team</h2>
        <form onSubmit={handleCreateTeam} className="space-y-6">
          <div className="space-y-2">
            <Label>Team Name</Label>
            <Input
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="Enter team name"
              required
            />
          </div>
          <div className="flex gap-4">
            <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90">
              Create Team
            </Button>
            <Button type="button" variant="outline" onClick={() => setShowCreateForm(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Team Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-primary/20 flex items-center justify-center">
            <Shield size={32} className="text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-display">{team?.name}</h2>
            <p className="text-muted-foreground">Team Level: {team?.level || "N/A"}</p>
          </div>
        </div>
        <Button onClick={() => setShowAddMember(true)} className="bg-primary hover:bg-primary/90">
          <Plus size={20} className="mr-2" />
          Add Player
        </Button>
      </div>

      {/* Add Member Form */}
      {showAddMember && (
        <div className="bg-card/50 rounded-xl p-6 border border-white/10">
          <h3 className="font-semibold mb-4">Add New Player</h3>
          <form onSubmit={handleAddMember} className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Player Name</Label>
              <Input
                value={memberName}
                onChange={(e) => setMemberName(e.target.value)}
                placeholder="Enter name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Age</Label>
              <Input
                type="number"
                value={memberAge}
                onChange={(e) => setMemberAge(e.target.value)}
                placeholder="Age"
                min={10}
                max={60}
              />
            </div>
            <div className="space-y-2">
              <Label>Position</Label>
              <Select value={memberPosition} onValueChange={setMemberPosition}>
                <SelectTrigger>
                  <SelectValue placeholder="Select position" />
                </SelectTrigger>
                <SelectContent>
                  {POSITIONS.map((pos) => (
                    <SelectItem key={pos} value={pos}>{pos}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Level (1-10)</Label>
              <Input
                type="number"
                value={memberLevel}
                onChange={(e) => setMemberLevel(e.target.value)}
                placeholder="1-10"
                min={1}
                max={10}
              />
            </div>
            <div className="col-span-2 flex gap-4">
              <Button type="submit" className="bg-primary hover:bg-primary/90">
                Add Player
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowAddMember(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Team Formation View */}
      <div className="bg-gradient-to-b from-primary/10 to-primary/5 rounded-2xl p-8 border border-primary/20 min-h-[500px] relative overflow-hidden">
        {/* Pitch Lines */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/2 left-0 right-0 h-px bg-white" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-white rounded-full" />
        </div>

        {/* Player Cards Grid */}
        <div className="grid grid-cols-5 gap-4 relative z-10">
          {members.length > 0 ? (
            members.map((member, index) => (
              <PlayerCard
                key={member.id}
                player={member}
                onRemove={() => handleRemoveMember(member.id)}
              />
            ))
          ) : (
            <div className="col-span-5 text-center py-12">
              <Users size={48} className="text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No players added yet. Add players to see the lineup!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyTeam;