import { Card, CardContent } from "@/components/ui/card";
import { 
  Code, 
  Zap, 
  Brain, 
  Trophy, 
  Play, 
  Users, 
  Target, 
  Sparkles,
  MonitorSpeaker,
  Gamepad2
} from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: Code,
      title: "Live Code Editor",
      description: "Write and execute C code directly in your browser with syntax highlighting and real-time compilation",
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      icon: Brain,
      title: "AI-Powered Hints",
      description: "Get intelligent suggestions and corrections when you're stuck, powered by advanced AI",
      color: "text-info",
      bgColor: "bg-info/10"
    },
    {
      icon: Zap,
      title: "Instant Feedback",
      description: "See your output immediately with multiple test cases and performance metrics",
      color: "text-warning",
      bgColor: "bg-warning/10"
    },
    {
      icon: Trophy,
      title: "Gamified Learning",
      description: "Earn XP points, unlock badges, and compete on global leaderboards",
      color: "text-success",
      bgColor: "bg-success/10"
    },
    {
      icon: Target,
      title: "Progressive Difficulty",
      description: "Start with basics and advance to expert-level algorithmic pattern challenges",
      color: "text-destructive",
      bgColor: "bg-destructive/10"
    },
    {
      icon: Users,
      title: "Community Learning",
      description: "Share solutions, discuss approaches, and learn from thousands of developers",
      color: "text-purple-400",
      bgColor: "bg-purple-400/10"
    },
    {
      icon: MonitorSpeaker,
      title: "Pattern Visualizer",
      description: "See your patterns come to life with interactive visual representations",
      color: "text-cyan-400",
      bgColor: "bg-cyan-400/10"
    },
    {
      icon: Sparkles,
      title: "AI Pattern Generator",
      description: "Generate unlimited new challenges dynamically based on your skill level",
      color: "text-pink-400",
      bgColor: "bg-pink-400/10"
    }
  ];

  return (
    <section className="py-20 bg-gradient-card">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Why Choose C Patterns Explorer?
          </h2>
          <p className="text-xl text-muted-foreground">
            Experience the most advanced platform for learning C programming patterns with cutting-edge features
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            
            return (
              <Card 
                key={index} 
                className="group hover:shadow-card transition-all duration-300 border-border hover:border-primary/30 bg-card/50 backdrop-blur-sm"
              >
                <CardContent className="p-6 text-center space-y-4">
                  <div className={`w-16 h-16 mx-auto rounded-2xl ${feature.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-8 h-8 ${feature.color}`} />
                  </div>
                  
                  <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-4 bg-gradient-primary p-8 rounded-2xl text-primary-foreground">
            <Gamepad2 className="w-8 h-8" />
            <div className="text-left">
              <h3 className="text-xl font-bold">Ready to Start Your Journey?</h3>
              <p className="text-primary-foreground/80">Join thousands of developers mastering C patterns</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;