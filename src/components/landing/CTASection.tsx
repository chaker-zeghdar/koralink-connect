import { ArrowRight, Users, Building2 } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/10 to-background" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[200px]" />
      </div>

      <div className="section-container relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Main CTA Card */}
          <div className="relative bg-card rounded-3xl p-8 md:p-12 border border-white/10 overflow-hidden">
            {/* Corner Decorations */}
            <div className="absolute top-0 left-0 w-32 h-32 border-t-2 border-l-2 border-primary/30 rounded-tl-3xl" />
            <div className="absolute bottom-0 right-0 w-32 h-32 border-b-2 border-r-2 border-primary/30 rounded-br-3xl" />
            
            {/* Content */}
            <div className="text-center mb-12">
              <h2 className="font-display text-4xl sm:text-5xl md:text-6xl mb-6">
                READY TO
                <br />
                <span className="text-gradient-primary">GET STARTED?</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Join thousands of players and stadium owners already using KoraLink 
                to revolutionize their football experience in Algeria.
              </p>
            </div>

            {/* CTA Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Player CTA */}
              <div className="group relative p-6 rounded-2xl bg-primary/10 border border-primary/30 hover:bg-primary/20 transition-all duration-300 cursor-pointer">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-primary flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <Users size={24} className="text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display text-xl mb-2">I'm a Player</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Find stadiums, build teams, and start playing today
                    </p>
                    <div className="flex items-center gap-2 text-primary font-medium">
                      <span>Join Now</span>
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Owner CTA */}
              <div className="group relative p-6 rounded-2xl bg-accent/10 border border-accent/30 hover:bg-accent/20 transition-all duration-300 cursor-pointer">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-accent flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <Building2 size={24} className="text-accent-foreground" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display text-xl mb-2">I'm a Stadium Owner</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Register your stadium and start receiving bookings
                    </p>
                    <div className="flex items-center gap-2 text-accent font-medium">
                      <span>Register Stadium</span>
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
