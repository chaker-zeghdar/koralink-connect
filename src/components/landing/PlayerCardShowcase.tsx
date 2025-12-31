import { Star } from "lucide-react";

const PlayerCardShowcase = () => {
  const positions = ["GK", "CB", "LB", "RB", "CDM", "CM", "CAM", "LW", "RW", "ST"];
  
  const samplePlayers = [
    { name: "AHMED", position: "ST", rating: 87, pace: 92, shooting: 89, passing: 78 },
    { name: "KARIM", position: "CM", rating: 85, pace: 76, shooting: 72, passing: 88 },
    { name: "YOUSSEF", position: "CB", rating: 84, pace: 68, shooting: 45, passing: 72 },
    { name: "OMAR", position: "GK", rating: 86, pace: 45, shooting: 20, passing: 65 },
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px]" />
      
      <div className="section-container relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl mb-6">
            FIFA-INSPIRED
            <br />
            <span className="text-gradient-gold">PLAYER CARDS</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Showcase your team with stunning player cards. Track stats, positions, and create your dream lineup.
          </p>
        </div>

        {/* Player Cards Grid */}
        <div className="flex flex-wrap justify-center gap-6 lg:gap-8">
          {samplePlayers.map((player, index) => (
            <div
              key={index}
              className="player-card-gold w-[200px] sm:w-[220px] animate-slide-up opacity-0"
              style={{ 
                animationDelay: `${index * 0.15}s`, 
                animationFillMode: "forwards" 
              }}
            >
              {/* Card Header */}
              <div className="relative p-4 pb-0">
                {/* Rating & Position */}
                <div className="absolute top-4 left-4 text-center">
                  <div className="font-display text-3xl text-accent">{player.rating}</div>
                  <div className="font-display text-sm text-accent/80">{player.position}</div>
                </div>
                
                {/* Player Silhouette */}
                <div className="w-full aspect-square bg-gradient-to-b from-white/5 to-transparent rounded-xl flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-b from-white/10 to-white/5 flex items-center justify-center">
                    <span className="font-display text-4xl text-white/30">{player.name[0]}</span>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 pt-2">
                {/* Name */}
                <div className="text-center mb-4">
                  <div className="font-display text-xl tracking-wider text-accent">{player.name}</div>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={12} className={i < 4 ? "fill-accent text-accent" : "text-accent/30"} />
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="font-display text-lg text-white">{player.pace}</div>
                    <div className="text-[10px] text-white/50 uppercase tracking-wider">PAC</div>
                  </div>
                  <div>
                    <div className="font-display text-lg text-white">{player.shooting}</div>
                    <div className="text-[10px] text-white/50 uppercase tracking-wider">SHO</div>
                  </div>
                  <div>
                    <div className="font-display text-lg text-white">{player.passing}</div>
                    <div className="text-[10px] text-white/50 uppercase tracking-wider">PAS</div>
                  </div>
                </div>
              </div>

              {/* Card Glow Effect */}
              <div className="absolute inset-0 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-500" style={{ boxShadow: "0 0 60px hsl(45 90% 55% / 0.3)" }} />
            </div>
          ))}
        </div>

        {/* Position Tags */}
        <div className="flex flex-wrap justify-center gap-3 mt-12">
          {positions.map((pos, index) => (
            <span
              key={index}
              className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-muted-foreground hover:border-primary/30 hover:text-primary transition-all duration-300 cursor-default"
            >
              {pos}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PlayerCardShowcase;
