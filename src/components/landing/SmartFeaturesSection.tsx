import { Brain, Sparkles, Target, LineChart, Clock, Lightbulb } from "lucide-react";

const SmartFeaturesSection = () => {
  const aiFeatures = [
    {
      icon: Target,
      title: "Smart Matching",
      description: "AI recommends teams based on your skill level, position, and playing style",
      forPlayer: true,
    },
    {
      icon: Clock,
      title: "Best Time Suggestions",
      description: "Get personalized recommendations for optimal booking times",
      forPlayer: true,
    },
    {
      icon: Sparkles,
      title: "Stadium Recommendations",
      description: "Discover perfect stadiums based on your history and preferences",
      forPlayer: true,
    },
    {
      icon: LineChart,
      title: "Demand Prediction",
      description: "AI forecasts peak hours and helps optimize your pricing strategy",
      forPlayer: false,
    },
    {
      icon: Lightbulb,
      title: "Smart Pricing",
      description: "Dynamic pricing suggestions based on demand patterns",
      forPlayer: false,
    },
    {
      icon: Brain,
      title: "Balanced Teams",
      description: "AI ensures fair and balanced team compositions for better matches",
      forPlayer: true,
    },
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-primary/5" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[150px]" />
      
      <div className="section-container relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/30 mb-6">
            <Brain size={16} className="text-accent" />
            <span className="text-sm font-medium text-accent">AI-Powered Features</span>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl mb-6">
            SMART
            <span className="text-gradient-gold"> TECHNOLOGY</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Our AI works behind the scenes to make your football experience seamless and efficient.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {aiFeatures.map((feature, index) => (
            <div
              key={index}
              className="group relative p-6 rounded-2xl bg-card border border-white/5 hover:border-accent/30 transition-all duration-300"
            >
              {/* Tag */}
              <div className={`absolute top-4 right-4 px-2 py-1 rounded-full text-xs font-medium ${
                feature.forPlayer 
                  ? "bg-primary/20 text-primary" 
                  : "bg-accent/20 text-accent"
              }`}>
                {feature.forPlayer ? "Players" : "Owners"}
              </div>
              
              {/* Icon */}
              <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <feature.icon size={22} className="text-accent" />
              </div>
              
              {/* Content */}
              <h3 className="font-display text-xl mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SmartFeaturesSection;
