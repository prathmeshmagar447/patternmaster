import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Code2, Trophy, User, Settings } from "lucide-react";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <Code2 className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">C Patterns Explorer</span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <a href="#dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
            Dashboard
          </a>
          <a href="#patterns" className="text-muted-foreground hover:text-foreground transition-colors">
            Patterns
          </a>
          <a href="#leaderboard" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
            <Trophy className="w-4 h-4" />
            Leaderboard
          </a>
          <a href="#practice" className="text-muted-foreground hover:text-foreground transition-colors">
            Practice
          </a>
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <Button variant="ghost" size="sm">
            <User className="w-4 h-4 mr-2" />
            Login
          </Button>
          <Button variant="primary" size="sm">
            Get Started
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-card border-t border-border">
          <div className="container mx-auto px-6 py-4 space-y-4">
            <a href="#dashboard" className="block text-muted-foreground hover:text-foreground transition-colors">
              Dashboard
            </a>
            <a href="#patterns" className="block text-muted-foreground hover:text-foreground transition-colors">
              Patterns
            </a>
            <a href="#leaderboard" className="block text-muted-foreground hover:text-foreground transition-colors">
              Leaderboard
            </a>
            <a href="#practice" className="block text-muted-foreground hover:text-foreground transition-colors">
              Practice
            </a>
            <div className="pt-4 border-t border-border space-y-2">
              <Button variant="ghost" className="w-full justify-start">
                <User className="w-4 h-4 mr-2" />
                Login
              </Button>
              <Button variant="primary" className="w-full">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;