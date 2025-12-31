import { MapPin, Star, Clock, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Stadium {
  id: string;
  name: string;
  location: string;
  price_per_hour: number;
  rating: number;
  images: string[];
}

interface StadiumCardProps {
  stadium: Stadium;
  onClick: () => void;
  isSelected: boolean;
}

const StadiumCard = ({ stadium, onClick, isSelected }: StadiumCardProps) => {
  return (
    <div
      onClick={onClick}
      className={`rounded-xl border overflow-hidden cursor-pointer transition-all hover:scale-[1.02] ${
        isSelected
          ? "border-primary bg-primary/5"
          : "border-white/10 bg-card/50 hover:border-white/20"
      }`}
    >
      {/* Image */}
      <div className="h-32 bg-gradient-to-br from-primary/20 to-primary/5 relative">
        {stadium.images && stadium.images.length > 0 ? (
          <img
            src={stadium.images[0]}
            alt={stadium.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <MapPin size={32} className="text-primary/50" />
          </div>
        )}
        
        {/* Rating Badge */}
        <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1">
          <Star size={12} className="text-yellow-400 fill-yellow-400" />
          <span className="text-xs font-medium">{stadium.rating?.toFixed(1) || "New"}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h4 className="font-semibold mb-1">{stadium.name}</h4>
        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
          <MapPin size={14} />
          <span>{stadium.location}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-primary font-semibold">
            <DollarSign size={16} />
            <span>{stadium.price_per_hour} DZD/hr</span>
          </div>
          <Button size="sm" className="bg-primary hover:bg-primary/90">
            Book Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StadiumCard;