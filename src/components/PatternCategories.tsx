import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Triangle, Hash, Type, Zap, Brain, ArrowRight, CheckCircle, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const PatternCategories = () => {
  const { user } = useAuth();
  
  const categories = [
    {
      id: 1,
      title: "Star Patterns",
      description: "Master fundamental star patterns from basic triangles to complex designs",
      icon: Star,
      difficulty: "Beginner",
      totalPatterns: 45,
      completedPatterns: 12,
      color: "text-primary",
      bgColor: "bg-primary/10",
      examples: ["Right Triangle", "Pyramid", "Diamond", "Hollow Square"]
    },
    {
      id: 2,
      title: "Number Patterns",
      description: "Explore mathematical sequences and number arrangements",
      icon: Hash,
      difficulty: "Intermediate",
      totalPatterns: 38,
      completedPatterns: 8,
      color: "text-info",
      bgColor: "bg-info/10",
      examples: ["Fibonacci Triangle", "Pascal's Triangle", "Prime Numbers", "Magic Square"]
    },
    {
      id: 3,
      title: "Alphabet Patterns",
      description: "Create beautiful patterns using alphabetical characters",
      icon: Type,
      difficulty: "Intermediate",
      totalPatterns: 32,
      completedPatterns: 5,
      color: "text-warning",
      bgColor: "bg-warning/10",
      examples: ["A-Z Triangle", "Name Patterns", "Alphabet Diamond", "Letter Pyramid"]
    },
    {
      id: 4,
      title: "Geometric Shapes",
      description: "Build complex geometric patterns and shapes",
      icon: Triangle,
      difficulty: "Advanced",
      totalPatterns: 28,
      completedPatterns: 2,
      color: "text-success",
      bgColor: "bg-success/10",
      examples: ["Hexagon", "Octagon", "Spiral", "Fractal Patterns"]
    },
    {
      id: 5,
      title: "Dynamic Patterns",
      description: "Interactive and animated pattern challenges",
      icon: Zap,
      difficulty: "Expert",
      totalPatterns: 22,
      completedPatterns: 0,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
      examples: ["Wave Animation", "Matrix Rain", "Bouncing Ball", "Snake Game"]
    },
    {
      id: 6,
      title: "Algorithm Patterns",
      description: "Complex algorithmic challenges combining patterns with logic",
      icon: Brain,
      difficulty: "Expert",
      totalPatterns: 18,
      completedPatterns: 0,
      color: "text-purple-400",
      bgColor: "bg-purple-400/10",
      examples: ["Sorting Visualizer", "Maze Generator", "Conway's Game", "Mandelbrot Set"]
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-success/20 text-success";
      case "Intermediate": return "bg-warning/20 text-warning";
      case "Advanced": return "bg-info/20 text-info";
      case "Expert": return "bg-destructive/20 text-destructive";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <section id="patterns" className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Pattern Categories
          </h2>
          <p className="text-xl text-muted-foreground">
            Choose your learning path from beginner-friendly star patterns to expert-level algorithmic challenges
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => {
            const Icon = category.icon;
            const progressPercentage = (category.completedPatterns / category.totalPatterns) * 100;
            
            return (
              <Card key={category.id} className="group hover:shadow-glow transition-all duration-300 border-border hover:border-primary/50 bg-gradient-card">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl ${category.bgColor} flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 ${category.color}`} />
                    </div>
                    <Badge className={getDifficultyColor(category.difficulty)}>
                      {category.difficulty}
                    </Badge>
                  </div>
                  
                  <CardTitle className="text-xl text-foreground group-hover:text-primary transition-colors">
                    {category.title}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {category.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="text-foreground">
                        {category.completedPatterns}/{category.totalPatterns}
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="h-2 bg-gradient-primary rounded-full transition-all duration-500"
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Examples */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-foreground">Popular Patterns:</h4>
                    <div className="flex flex-wrap gap-2">
                      {category.examples.slice(0, 3).map((example, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {example}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      <span>{category.completedPatterns} completed</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>~{category.totalPatterns * 15}min</span>
                    </div>
                  </div>

                  <Link to={user ? "/patterns" : "/auth"} className="w-full">
                    <Button 
                      variant="primary" 
                      className="w-full group-hover:shadow-primary transition-all duration-300"
                    >
                      {user ? "Start Learning" : "Login to Start"}
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PatternCategories;