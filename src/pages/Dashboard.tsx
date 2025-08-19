import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Link } from 'react-router-dom';
import { 
  Trophy, 
  Target, 
  Flame, 
  Star,
  Code,
  TrendingUp,
  Award,
  Clock
} from 'lucide-react';

interface UserProfile {
  username: string;
  display_name: string;
  total_points: number;
  rank: number;
  streak_count: number;
  patterns_completed: number;
}

interface Pattern {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  category: string;
  points: number;
}

interface UserProgress {
  pattern_id: string;
  status: string;
  points_earned: number;
}

const Dashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [patterns, setPatterns] = useState<Pattern[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      // Fetch user profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      // Fetch patterns
      const { data: patternsData } = await supabase
        .from('patterns')
        .select('*')
        .order('created_at', { ascending: true });

      // Fetch user progress
      const { data: progressData } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user?.id);

      setProfile(profileData);
      setPatterns(patternsData || []);
      setUserProgress(progressData || []);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20';
      case 'intermediate':
        return 'bg-amber-500/10 text-amber-700 border-amber-500/20';
      case 'advanced':
        return 'bg-red-500/10 text-red-700 border-red-500/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getProgressForPattern = (patternId: string) => {
    return userProgress.find(p => p.pattern_id === patternId);
  };

  const completedPatterns = userProgress.filter(p => p.status === 'completed').length;
  const totalPatterns = patterns.length;
  const progressPercentage = totalPatterns > 0 ? (completedPatterns / totalPatterns) * 100 : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {profile?.display_name || profile?.username || 'Developer'}! 👋
          </h1>
          <p className="text-muted-foreground">
            Continue your journey mastering C programming patterns
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Points</CardTitle>
              <Trophy className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{profile?.total_points || 0}</div>
              <p className="text-xs text-muted-foreground">
                Earned from solved patterns
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Patterns Completed</CardTitle>
              <Target className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedPatterns}/{totalPatterns}</div>
              <Progress value={progressPercentage} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
              <Flame className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{profile?.streak_count || 0}</div>
              <p className="text-xs text-muted-foreground">
                Days in a row
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Global Rank</CardTitle>
              <Award className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">#{profile?.rank || '--'}</div>
              <p className="text-xs text-muted-foreground">
                Among all users
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Continue Learning Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Continue Learning</h2>
            <Link to="/leaderboard">
              <Button variant="outline" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                View Leaderboard
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {patterns.slice(0, 6).map((pattern) => {
              const progress = getProgressForPattern(pattern.id);
              const isCompleted = progress?.status === 'completed';
              const isInProgress = progress?.status === 'in_progress';

              return (
                <Card key={pattern.id} className="group hover:shadow-lg transition-all duration-200">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg group-hover:text-primary transition-colors">
                          {pattern.title}
                        </CardTitle>
                        <CardDescription className="mt-2">
                          {pattern.description}
                        </CardDescription>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge className={getDifficultyColor(pattern.difficulty)}>
                          {pattern.difficulty}
                        </Badge>
                        {isCompleted && <Star className="h-4 w-4 text-primary fill-primary" />}
                        {isInProgress && <Clock className="h-4 w-4 text-amber-500" />}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Code className="h-4 w-4" />
                        <span>{pattern.category}</span>
                        <span>•</span>
                        <span>{pattern.points} pts</span>
                      </div>
                      <Link to={`/pattern/${pattern.id}`}>
                        <Button size="sm" variant={isCompleted ? "secondary" : "default"}>
                          {isCompleted ? 'Review' : isInProgress ? 'Continue' : 'Start'}
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {patterns.length > 6 && (
            <div className="text-center mt-6">
              <Link to="/patterns">
                <Button variant="outline" size="lg">
                  View All Patterns ({patterns.length})
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;