import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Filter,
  Code,
  Trophy,
  Star,
  Clock,
  CheckCircle
} from 'lucide-react';

interface Pattern {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  category: string;
  points: number;
  created_at: string;
}

interface UserProgress {
  pattern_id: string;
  status: string;
  points_earned: number;
}

const Patterns = () => {
  const { user } = useAuth();
  const [patterns, setPatterns] = useState<Pattern[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [filteredPatterns, setFilteredPatterns] = useState<Pattern[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchPatterns();
  }, [user]);

  useEffect(() => {
    filterPatterns();
  }, [patterns, userProgress, searchTerm, difficultyFilter, categoryFilter, statusFilter]);

  const fetchPatterns = async () => {
    try {
      // Fetch all patterns
      const { data: patternsData } = await supabase
        .from('patterns')
        .select('*')
        .order('created_at', { ascending: true });

      // Fetch user progress if logged in
      let progressData: UserProgress[] = [];
      if (user) {
        const { data } = await supabase
          .from('user_progress')
          .select('pattern_id, status, points_earned')
          .eq('user_id', user.id);
        progressData = data || [];
      }

      setPatterns(patternsData || []);
      setUserProgress(progressData);
    } catch (error) {
      console.error('Error fetching patterns:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterPatterns = () => {
    let filtered = [...patterns];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(pattern =>
        pattern.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pattern.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pattern.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Difficulty filter
    if (difficultyFilter !== 'all') {
      filtered = filtered.filter(pattern => pattern.difficulty === difficultyFilter);
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(pattern => pattern.category === categoryFilter);
    }

    // Status filter
    if (statusFilter !== 'all' && user) {
      filtered = filtered.filter(pattern => {
        const progress = userProgress.find(p => p.pattern_id === pattern.id);
        switch (statusFilter) {
          case 'completed':
            return progress?.status === 'completed';
          case 'in_progress':
            return progress?.status === 'in_progress';
          case 'not_started':
            return !progress || progress.status === 'not_started';
          default:
            return true;
        }
      });
    }

    setFilteredPatterns(filtered);
  };

  const getProgressForPattern = (patternId: string) => {
    return userProgress.find(p => p.pattern_id === patternId);
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

  const getUniqueCategories = () => {
    const categories = [...new Set(patterns.map(p => p.category))];
    return categories.sort();
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600';
      case 'in_progress':
        return 'text-amber-600';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'in_progress':
        return <Clock className="h-4 w-4" />;
      default:
        return <Star className="h-4 w-4" />;
    }
  };

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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">All Patterns</h1>
          <p className="text-muted-foreground">
            Explore and practice C programming patterns from beginner to advanced level
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
            <CardDescription>
              Filter patterns by search term, difficulty, category, or completion status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search patterns..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Difficulty Filter */}
              <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Difficulties" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Difficulties</SelectItem>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>

              {/* Category Filter */}
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {getUniqueCategories().map(category => (
                    <SelectItem key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Status Filter (only if logged in) */}
              {user && (
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="not_started">Not Started</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-muted-foreground">
            Showing {filteredPatterns.length} of {patterns.length} patterns
          </p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Trophy className="h-4 w-4" />
            Total Points: {patterns.reduce((sum, p) => sum + p.points, 0)}
          </div>
        </div>

        {/* Patterns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPatterns.map((pattern) => {
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
                      {user && (
                        <div className={`flex items-center gap-1 ${getStatusColor(progress?.status)}`}>
                          {getStatusIcon(progress?.status)}
                        </div>
                      )}
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
                    <Link to={user ? `/pattern/${pattern.id}` : '/auth'}>
                      <Button size="sm" variant={isCompleted ? "secondary" : "default"}>
                        {!user ? 'Login to Start' : isCompleted ? 'Review' : isInProgress ? 'Continue' : 'Start'}
                      </Button>
                    </Link>
                  </div>
                  
                  {progress && (
                    <div className="mt-3 pt-3 border-t">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Status:</span>
                        <span className={`font-medium ${getStatusColor(progress.status)}`}>
                          {progress.status.charAt(0).toUpperCase() + progress.status.slice(1)}
                        </span>
                      </div>
                      {progress.status === 'completed' && (
                        <div className="flex items-center justify-between text-xs mt-1">
                          <span className="text-muted-foreground">Points Earned:</span>
                          <span className="font-medium text-primary">{progress.points_earned}</span>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* No Results */}
        {filteredPatterns.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">No patterns found</h3>
            <p className="text-muted-foreground">
              Try adjusting your filters or search terms to find what you're looking for.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Patterns;