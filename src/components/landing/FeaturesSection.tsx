import { MapPin, Calendar, Users, MessageCircle, Bell, Shield, TrendingUp, Zap } from "lucide-react";

const FeaturesSection = () => {
  const playerFeatures = [
    {
      icon: MapPin,
      title: "Find Stadiums",
      description: "Discover nearby stadiums on an interactive map with real-time availability",
    },
    {
      icon: Calendar,
      title: "Easy Booking",
      description: "Book available time slots in seconds with our streamlined booking system",
    },
    {
      icon: Users,
      title: "Build Teams",
      description: "Create your dream team or join existing squads looking for players",
    },
    {
      icon: MessageCircle,
      title: "Team Chat",
      description: "Coordinate with teammates using our built-in messaging system",
    },
  ];

  const ownerFeatures = [
    {
      icon: Shield,
      title: "Digital Registration",
      description: "Register your stadium with photos, pricing, and location details",
    },
    {
      icon: Calendar,
      title: "Smart Scheduling",
      description: "Manage availability with an intuitive visual timeline interface",
    },
    {
      icon: Bell,
      title: "Booking Requests",
      description: "Receive and manage booking requests with one-tap accept/reject",
    },
    {
      icon: TrendingUp,
      title: "Analytics",
      description: "Track performance with insights on bookings, revenue, and peak hours",
    },
  ];

  return (
    <section id="features" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      
      <div className="section-container relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-6">
            <Zap size={16} className="text-primary" />
            <span className="text-sm font-medium text-primary">Platform Features</span>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl mb-6">
            EVERYTHING YOU
            <br />
            <span className="text-gradient-primary">NEED TO PLAY</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            From finding the perfect stadium to managing your entire football operation, 
            KoraLink has you covered.
          </p>
        </div>

        {/* For Players */}
        <div id="players" className="mb-24">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-primary/30" />
            <h3 className="font-display text-2xl text-primary">FOR PLAYERS</h3>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-primary/30" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {playerFeatures.map((feature, index) => (
              <div
                key={index}
                className="feature-card group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center mb-6 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                  <feature.icon size={24} className="text-primary" />
                </div>
                <h4 className="font-display text-xl mb-3">{feature.title}</h4>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* For Stadium Owners */}
        <div id="owners">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-accent/30" />
            <h3 className="font-display text-2xl text-accent">FOR STADIUM OWNERS</h3>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-accent/30" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {ownerFeatures.map((feature, index) => (
              <div
                key={index}
                className="feature-card group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-14 h-14 rounded-xl bg-accent/10 border border-accent/30 flex items-center justify-center mb-6 group-hover:bg-accent/20 group-hover:scale-110 transition-all duration-300">
                  <feature.icon size={24} className="text-accent" />
                </div>
                <h4 className="font-display text-xl mb-3">{feature.title}</h4>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
