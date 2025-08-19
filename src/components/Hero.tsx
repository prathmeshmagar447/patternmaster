import { Button } from "@/components/ui/button";
import { Play, Code, Star, Trophy, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Hero = () => {
  const { user } = useAuth();

  return (
    <section className="min-h-screen bg-gradient-hero flex items-center justify-center pt-20">
      <div className="container mx-auto px-6 py-20">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* Hero Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-sm text-primary">
                <Star className="w-4 h-4 mr-2" />
                Interactive Learning Platform
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Master C Programming
                <span className="block text-transparent bg-gradient-primary bg-clip-text">
                  Patterns
                </span>
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                Explore unlimited C language patterns from beginner to advanced. Practice with real-time compilation, AI-powered hints, and climb the leaderboard.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to={user ? "/dashboard" : "/auth"}>
                <Button variant="primary" size="lg" className="group">
                  <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  {user ? "Go to Dashboard" : "Start Learning"}
                </Button>
              </Link>
              <Link to="/patterns">
                <Button variant="secondary" size="lg">
                  <Code className="w-5 h-5 mr-2" />
                  View Patterns
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-8 pt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">500+</div>
                <div className="text-sm text-muted-foreground">Patterns</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">10K+</div>
                <div className="text-sm text-muted-foreground">Students</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">95%</div>
                <div className="text-sm text-muted-foreground">Success Rate</div>
              </div>
            </div>
          </div>

          {/* Code Preview/Visual */}
          <div className="relative">
            <div className="bg-gradient-card rounded-2xl p-8 shadow-card border border-border">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-destructive rounded-full"></div>
                    <div className="w-3 h-3 bg-warning rounded-full"></div>
                    <div className="w-3 h-3 bg-success rounded-full"></div>
                  </div>
                  <span className="text-sm text-muted-foreground">pattern.c</span>
                </div>
                
                <div className="bg-muted/30 rounded-lg p-6 font-mono text-sm space-y-2">
                  <div className="text-muted-foreground">// Star Pattern Challenge</div>
                  <div className="text-primary">#include {"<stdio.h>"}</div>
                  <div className="text-foreground">int main() {"{"}</div>
                  <div className="text-foreground ml-4">for(int i=1; i{"<"}=5; i++) {"{"}</div>
                  <div className="text-foreground ml-8">for(int j=1; j{"<"}=i; j++) {"{"}</div>
                  <div className="text-foreground ml-12">printf("* ");</div>
                  <div className="text-foreground ml-8">{"}"}</div>
                  <div className="text-foreground ml-8">printf("\\n");</div>
                  <div className="text-foreground ml-4">{"}"}</div>
                  <div className="text-foreground">{"}"}</div>
                </div>
                
                <div className="flex items-center justify-between pt-4">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-warning" />
                    <span className="text-sm text-muted-foreground">Difficulty: Beginner</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" />
                    <span className="text-sm text-muted-foreground">1.2k solved</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-primary rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-primary/20 rounded-full opacity-30 animate-pulse delay-1000"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;