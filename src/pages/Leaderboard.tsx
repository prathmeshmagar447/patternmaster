import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Trophy, 
  Medal, 
  Award,
  Crown,
  TrendingUp,
  Users,
  Target,
  Flame
} from 'lucide-react';

interface LeaderboardEntry {
  user_id: string;
  username: string;
  display_name: string;
  total_points: number;
  patterns_completed: number;
  streak_count: number;
  avatar_url?: string;
  rank?: number;
}

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPatterns: 0,
    avgCompletion: 0
  });

  useEffect(() => {
    fetchLeaderboardData();
  }, []);

  const fetchLeaderboardData = async () => {
    try {
      // Fetch top users
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('*')
        .order('total_points', { ascending: false })
        .limit(50);

      // Add ranks
      const rankedData = profilesData?.map((user, index) => ({
        ...user,
        rank: index + 1
      })) || [];

      setLeaderboard(rankedData);

      // Fetch stats
      const { data: allProfiles } = await supabase
        .from('profiles')
        .select('patterns_completed');

      const { data: patterns } = await supabase
        .from('patterns')
        .select('id');

      const totalUsers = allProfiles?.length || 0;
      const totalPatterns = patterns?.length || 0;
      const avgCompletion = totalUsers > 0 
        ? (allProfiles?.reduce((sum, p) => sum + p.patterns_completed, 0) || 0) / totalUsers 
        : 0;

      setStats({
        totalUsers,
        totalPatterns,
        avgCompletion: Math.round(avgCompletion * 10) / 10
      });
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />;
      default:
        return <span className="text-sm font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  const getRankBadge = (rank: number) => {
    if (rank <= 3) {
      return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
    } else if (rank <= 10) {
      return 'bg-gradient-to-r from-blue-400 to-blue-600 text-white';
    } else {
      return 'bg-muted text-muted-foreground';
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
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">🏆 Global Leaderboard</h1>
          <p className="text-xl text-muted-foreground">
            See how you stack up against other C pattern masters
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                Registered developers
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Patterns</CardTitle>
              <Target className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPatterns}</div>
              <p className="text-xs text-muted-foreground">
                Available challenges
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Completion</CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.avgCompletion}</div>
              <p className="text-xs text-muted-foreground">
                Patterns per user
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Top 3 Podium */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-center mb-6">🥇 Top 3 Champions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {leaderboard.slice(0, 3).map((user) => (
              <Card key={user.user_id} className={`relative overflow-hidden ${
                user.rank === 1 
                  ? 'ring-2 ring-yellow-500 bg-gradient-to-br from-yellow-50 to-orange-50' 
                  : user.rank === 2 
                    ? 'ring-2 ring-gray-400 bg-gradient-to-br from-gray-50 to-slate-50'
                    : 'ring-2 ring-amber-600 bg-gradient-to-br from-amber-50 to-yellow-50'
              }`}>
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4">
                    {getRankIcon(user.rank!)}
                  </div>
                  <Avatar className="w-16 h-16 mx-auto mb-4">
                    <AvatarImage src={user.avatar_url} />
                    <AvatarFallback>
                      {(user.display_name || user.username)?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <CardTitle className="text-lg">
                    {user.display_name || user.username}
                  </CardTitle>
                  <CardDescription>@{user.username}</CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-2">
                  <div className="text-2xl font-bold text-primary">{user.total_points}</div>
                  <div className="text-sm text-muted-foreground">points</div>
                  <div className="flex justify-center gap-4 text-xs">
                    <div className="flex items-center gap-1">
                      <Target className="h-3 w-3" />
                      {user.patterns_completed}
                    </div>
                    <div className="flex items-center gap-1">
                      <Flame className="h-3 w-3" />
                      {user.streak_count}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Full Leaderboard */}
        <Card>
          <CardHeader>
            <CardTitle>Full Rankings</CardTitle>
            <CardDescription>Complete leaderboard with all participants</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {leaderboard.map((user) => (
                <div
                  key={user.user_id}
                  className={`flex items-center justify-between p-4 rounded-lg transition-colors hover:bg-muted/50 ${
                    user.rank! <= 3 ? 'bg-muted/30' : ''
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-10 h-10">
                      {getRankIcon(user.rank!)}
                    </div>
                    
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={user.avatar_url} />
                      <AvatarFallback>
                        {(user.display_name || user.username)?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div>
                      <div className="font-semibold">
                        {user.display_name || user.username}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        @{user.username}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-sm">
                    <div className="text-center">
                      <div className="font-bold text-lg">{user.total_points}</div>
                      <div className="text-muted-foreground">points</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="font-semibold">{user.patterns_completed}</div>
                      <div className="text-muted-foreground">solved</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="font-semibold">{user.streak_count}</div>
                      <div className="text-muted-foreground">streak</div>
                    </div>

                    <Badge className={getRankBadge(user.rank!)}>
                      Rank #{user.rank}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Leaderboard;