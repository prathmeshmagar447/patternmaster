import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import PatternCategories from "@/components/PatternCategories";
import Features from "@/components/Features";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Hero />
      <PatternCategories />
      <Features />
    </div>
  );
};

export default Index;
