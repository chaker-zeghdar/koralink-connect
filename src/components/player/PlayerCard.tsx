import { User, X } from "lucide-react";

interface Player {
  id: string;
  name: string;
  age: number | null;
  position: string | null;
  level: number | null;
  is_captain: boolean;
}

interface PlayerCardProps {
  player: Player;
  onRemove?: () => void;
  showRemove?: boolean;
}

const PlayerCard = ({ player, onRemove, showRemove = true }: PlayerCardProps) => {
  // Calculate card color based on level
  const getCardGradient = (level: number | null) => {
    if (!level) return "from-gray-700 to-gray-800";
    if (level >= 9) return "from-yellow-500 to-yellow-700"; // Gold
    if (level >= 7) return "from-slate-300 to-slate-500"; // Silver
    return "from-amber-700 to-amber-900"; // Bronze
  };

  return (
    <div className="relative group animate-scale-in">
      <div
        className={`player-card-gold w-full aspect-[3/4] rounded-xl bg-gradient-to-b ${getCardGradient(player.level)} p-3 flex flex-col items-center justify-between shadow-xl hover:scale-105 transition-transform`}
      >
        {/* Remove Button */}
        {showRemove && onRemove && (
          <button
            onClick={onRemove}
            className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-destructive text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
          >
            <X size={14} />
          </button>
        )}

        {/* Level Badge */}
        <div className="absolute top-2 left-2 text-2xl font-bold text-black/70">
          {player.level || "?"}
        </div>

        {/* Position Badge */}
        <div className="absolute top-2 right-2 text-xs font-bold bg-black/30 px-2 py-1 rounded text-white">
          {player.position || "N/A"}
        </div>

        {/* Avatar */}
        <div className="w-16 h-16 rounded-full bg-black/20 flex items-center justify-center mt-6">
          <User size={32} className="text-white/80" />
        </div>

        {/* Player Info */}
        <div className="text-center mt-2">
          <h4 className="font-bold text-sm text-black truncate max-w-full px-2">
            {player.name}
          </h4>
          {player.age && (
            <p className="text-xs text-black/70">{player.age} years</p>
          )}
        </div>

        {/* Stats Bar */}
        <div className="w-full mt-2">
          <div className="flex justify-between text-xs text-black/70 mb-1">
            <span>Level</span>
            <span>{player.level || 0}/10</span>
          </div>
          <div className="h-1.5 bg-black/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-black/50 rounded-full transition-all"
              style={{ width: `${((player.level || 0) / 10) * 100}%` }}
            />
          </div>
        </div>

        {/* Captain Badge */}
        {player.is_captain && (
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full font-bold">
            CAPTAIN
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerCard;