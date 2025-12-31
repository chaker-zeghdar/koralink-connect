import { useState, useEffect } from "react";
import { MapPin, Plus, Edit, Trash2, DollarSign, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

interface Stadium {
  id: string;
  name: string;
  location: string;
  price_per_hour: number;
  description: string | null;
  images: string[];
}

const StadiumManagement = () => {
  const { user } = useAuth();
  const [stadiums, setStadiums] = useState<Stadium[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingStadium, setEditingStadium] = useState<Stadium | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [pricePerHour, setPricePerHour] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (user) fetchStadiums();
  }, [user]);

  const fetchStadiums = async () => {
    try {
      const { data, error } = await supabase
        .from("stadiums")
        .select("*")
        .eq("owner_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setStadiums(data || []);
    } catch (error) {
      console.error("Error fetching stadiums:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      if (editingStadium) {
        const { error } = await supabase
          .from("stadiums")
          .update({
            name,
            location,
            price_per_hour: parseFloat(pricePerHour),
            description,
          })
          .eq("id", editingStadium.id);

        if (error) throw error;
        toast({ title: "Stadium Updated!", description: "Your stadium has been updated successfully." });
      } else {
        const { error } = await supabase
          .from("stadiums")
          .insert({
            owner_id: user.id,
            name,
            location,
            price_per_hour: parseFloat(pricePerHour),
            description,
          });

        if (error) throw error;
        toast({ title: "Stadium Added!", description: "Your stadium has been registered successfully." });
      }

      resetForm();
      fetchStadiums();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("stadiums").delete().eq("id", id);
      if (error) throw error;
      toast({ title: "Stadium Deleted", description: "Stadium has been removed." });
      fetchStadiums();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleEdit = (stadium: Stadium) => {
    setEditingStadium(stadium);
    setName(stadium.name);
    setLocation(stadium.location);
    setPricePerHour(stadium.price_per_hour.toString());
    setDescription(stadium.description || "");
    setShowForm(true);
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingStadium(null);
    setName("");
    setLocation("");
    setPricePerHour("");
    setDescription("");
  };

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
        <h2 className="text-2xl font-display">My Stadiums</h2>
        {!showForm && (
          <Button onClick={() => setShowForm(true)} className="bg-primary hover:bg-primary/90">
            <Plus size={20} className="mr-2" />
            Add Stadium
          </Button>
        )}
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-card/50 rounded-xl p-6 border border-white/10">
          <h3 className="font-semibold mb-6">{editingStadium ? "Edit Stadium" : "Register New Stadium"}</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Stadium Name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter stadium name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Location</Label>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter location/address"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Price per Hour (DZD)</Label>
              <Input
                type="number"
                value={pricePerHour}
                onChange={(e) => setPricePerHour(e.target.value)}
                placeholder="e.g., 3000"
                required
                min={0}
              />
            </div>
            <div className="space-y-2">
              <Label>Images</Label>
              <div className="h-10 border border-dashed border-white/20 rounded-lg flex items-center justify-center text-sm text-muted-foreground">
                <Image size={16} className="mr-2" />
                Image upload coming soon
              </div>
            </div>
            <div className="col-span-2 space-y-2">
              <Label>Description</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your stadium..."
                rows={3}
              />
            </div>
            <div className="col-span-2 flex gap-4">
              <Button type="submit" className="bg-primary hover:bg-primary/90">
                {editingStadium ? "Update Stadium" : "Register Stadium"}
              </Button>
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Stadiums Grid */}
      {stadiums.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stadiums.map((stadium) => (
            <div
              key={stadium.id}
              className="bg-card/50 rounded-xl overflow-hidden border border-white/10"
            >
              {/* Image */}
              <div className="h-40 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                {stadium.images && stadium.images.length > 0 ? (
                  <img
                    src={stadium.images[0]}
                    alt={stadium.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <MapPin size={40} className="text-primary/50" />
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-1">{stadium.name}</h3>
                <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                  <MapPin size={14} />
                  {stadium.location}
                </div>
                <div className="flex items-center gap-1 text-primary font-semibold mb-4">
                  <DollarSign size={16} />
                  {stadium.price_per_hour} DZD/hr
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(stadium)}
                    className="flex-1"
                  >
                    <Edit size={14} className="mr-2" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(stadium.id)}
                    className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : !showForm ? (
        <div className="text-center py-16">
          <MapPin size={64} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Stadiums Yet</h3>
          <p className="text-muted-foreground mb-6">
            Register your first stadium to start receiving bookings
          </p>
          <Button onClick={() => setShowForm(true)} className="bg-primary hover:bg-primary/90">
            <Plus size={20} className="mr-2" />
            Add Stadium
          </Button>
        </div>
      ) : null}
    </div>
  );
};

export default StadiumManagement;