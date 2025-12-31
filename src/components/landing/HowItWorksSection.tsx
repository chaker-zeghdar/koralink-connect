import { UserPlus, Search, Trophy } from "lucide-react";

const HowItWorksSection = () => {
  const steps = [
    {
      number: "01",
      icon: UserPlus,
      title: "Create Account",
      description: "Sign up as a player or stadium owner. Choose your role and set up your profile in minutes.",
      color: "primary",
    },
    {
      number: "02",
      icon: Search,
      title: "Find & Connect",
      description: "Players discover stadiums and teams. Owners showcase their venues and manage availability.",
      color: "primary",
    },
    {
      number: "03",
      icon: Trophy,
      title: "Play & Win",
      description: "Book your slot, organize matches, and enjoy the beautiful game with your team.",
      color: "primary",
    },
  ];

  return (
    <section id="how-it-works" className="py-24 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 pitch-pattern opacity-30" />
      
      <div className="section-container relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl mb-6">
            HOW IT
            <span className="text-gradient-primary"> WORKS</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Get started in three simple steps. From signup to kickoff in minutes.
          </p>
        </div>

        {/* Steps */}
        <div className="relative max-w-5xl mx-auto">
          {/* Connection Line */}
          <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent hidden lg:block" />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, index) => (
              <div key={index} className="relative group">
                {/* Step Card */}
                <div className="relative bg-card rounded-3xl p-8 border border-white/5 transition-all duration-500 hover:border-primary/30 hover:translate-y-[-8px]">
                  {/* Step Number */}
                  <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-primary flex items-center justify-center font-display text-lg text-primary-foreground shadow-glow">
                    {step.number}
                  </div>
                  
                  {/* Icon */}
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <step.icon size={28} className="text-primary" />
                  </div>
                  
                  {/* Content */}
                  <h3 className="font-display text-2xl mb-3">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Arrow for desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-6 transform -translate-y-1/2 z-10">
                    <div className="w-12 h-12 rounded-full bg-background border border-white/10 flex items-center justify-center">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-primary">
                        <path d="M4 10H16M16 10L11 5M16 10L11 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
