import { useState, useEffect } from "react";
import { MapPin, Search, Filter, Star, Clock, DollarSign } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import StadiumCard from "./StadiumCard";

interface Stadium {
  id: string;
  name: string;
  location: string;
  price_per_hour: number;
  rating: number;
  images: string[];
}

const MapView = () => {
  const [stadiums, setStadiums] = useState<Stadium[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStadium, setSelectedStadium] = useState<Stadium | null>(null);

  useEffect(() => {
    fetchStadiums();
  }, []);

  const fetchStadiums = async () => {
    try {
      const { data, error } = await supabase
        .from("stadiums")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setStadiums(data || []);
    } catch (error) {
      console.error("Error fetching stadiums:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredStadiums = stadiums.filter((stadium) =>
    stadium.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    stadium.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex gap-6">
      {/* Map Area */}
      <div className="flex-1 relative rounded-2xl overflow-hidden border border-white/10">
        {/* Placeholder Map */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/20 flex items-center justify-center">
          <div className="text-center">
            <MapPin size={64} className="text-primary mx-auto mb-4 animate-bounce-subtle" />
            <h3 className="text-xl font-semibold mb-2">Interactive Map</h3>
            <p className="text-muted-foreground max-w-md">
              Add your Mapbox token to enable the interactive stadium map
            </p>
          </div>
        </div>

        {/* Search Overlay */}
        <div className="absolute top-4 left-4 right-4 z-10">
          <div className="relative max-w-md">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search stadiums by name or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-card/90 backdrop-blur-xl border-white/10"
            />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="absolute bottom-4 left-4 right-4 z-10 flex gap-2 flex-wrap">
          <Button variant="secondary" size="sm" className="bg-card/90 backdrop-blur-xl">
            <Filter size={14} className="mr-2" />
            All Filters
          </Button>
          <Button variant="outline" size="sm" className="bg-card/90 backdrop-blur-xl border-white/10">
            <Clock size={14} className="mr-2" />
            Available Now
          </Button>
          <Button variant="outline" size="sm" className="bg-card/90 backdrop-blur-xl border-white/10">
            <DollarSign size={14} className="mr-2" />
            Under 3000 DZD
          </Button>
          <Button variant="outline" size="sm" className="bg-card/90 backdrop-blur-xl border-white/10">
            <Star size={14} className="mr-2" />
            Top Rated
          </Button>
        </div>
      </div>

      {/* Stadiums List */}
      <div className="w-96 space-y-4 overflow-y-auto">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">Nearby Stadiums</h3>
          <span className="text-sm text-muted-foreground">{filteredStadiums.length} found</span>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 rounded-xl bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : filteredStadiums.length > 0 ? (
          <div className="space-y-4">
            {filteredStadiums.map((stadium) => (
              <StadiumCard
                key={stadium.id}
                stadium={stadium}
                onClick={() => setSelectedStadium(stadium)}
                isSelected={selectedStadium?.id === stadium.id}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <MapPin size={48} className="text-muted-foreground mx-auto mb-4" />
            <h4 className="font-medium mb-2">No Stadiums Found</h4>
            <p className="text-sm text-muted-foreground">
              {searchQuery ? "Try a different search term" : "No stadiums registered yet"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapView;