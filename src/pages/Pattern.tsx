import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { 
  Play, 
  Save, 
  RotateCcw, 
  Lightbulb, 
  CheckCircle,
  Code,
  Target,
  Trophy
} from 'lucide-react';

interface Pattern {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  category: string;
  pattern_code: string;
  expected_output: string;
  points: number;
  hints: string[];
}

interface UserProgress {
  id?: string;
  status: string;
  user_solution?: string;
  points_earned: number;
  attempts: number;
}

const Pattern = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [pattern, setPattern] = useState<Pattern | null>(null);
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [userCode, setUserCode] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showHints, setShowHints] = useState(false);

  useEffect(() => {
    if (id && user) {
      fetchPatternData();
    }
  }, [id, user]);

  const fetchPatternData = async () => {
    try {
      // Fetch pattern
      const { data: patternData } = await supabase
        .from('patterns')
        .select('*')
        .eq('id', id)
        .single();

      // Fetch user progress
      const { data: progressData } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user?.id)
        .eq('pattern_id', id)
        .maybeSingle();

      setPattern(patternData);
      setUserProgress(progressData);
      
      // Set initial code
      if (progressData?.user_solution) {
        setUserCode(progressData.user_solution);
      } else if (patternData?.pattern_code) {
        setUserCode(patternData.pattern_code);
      }
    } catch (error) {
      console.error('Error fetching pattern data:', error);
      toast.error('Failed to load pattern');
    } finally {
      setLoading(false);
    }
  };

  const handleRunCode = async () => {
    setRunning(true);
    setOutput('');
    
    try {
      // Simulate code execution (in a real app, you'd use an online compiler API)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user code matches expected output logic
      const isCorrect = checkSolution(userCode);
      
      if (isCorrect) {
        setOutput(pattern?.expected_output || '');
        await handleSolutionCorrect();
      } else {
        setOutput('Compilation error or incorrect output. Please check your code.');
      }
    } catch (error) {
      setOutput('Error running code. Please try again.');
    } finally {
      setRunning(false);
    }
  };

  const checkSolution = (code: string): boolean => {
    // Simple check - in a real app, you'd compile and run the code
    return code.includes('printf') && code.includes('for') && code.length > 100;
  };

  const handleSolutionCorrect = async () => {
    try {
      const newProgress = {
        user_id: user?.id,
        pattern_id: id,
        status: 'completed',
        user_solution: userCode,
        completed_at: new Date().toISOString(),
        points_earned: pattern?.points || 0,
        attempts: (userProgress?.attempts || 0) + 1
      };

      if (userProgress?.id) {
        // Update existing progress
        await supabase
          .from('user_progress')
          .update(newProgress)
          .eq('id', userProgress.id);
      } else {
        // Insert new progress
        await supabase
          .from('user_progress')
          .insert(newProgress);
      }

      // Update user profile points
      if (userProgress?.status !== 'completed') {
        const { data: profile } = await supabase
          .from('profiles')
          .select('total_points, patterns_completed')
          .eq('user_id', user?.id)
          .single();

        if (profile) {
          await supabase
            .from('profiles')
            .update({
              total_points: profile.total_points + (pattern?.points || 0),
              patterns_completed: profile.patterns_completed + 1
            })
            .eq('user_id', user?.id);
        }
      }

      toast.success(`Congratulations! You earned ${pattern?.points} points!`);
      await fetchPatternData(); // Refresh data
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  const handleSaveProgress = async () => {
    setSaving(true);
    
    try {
      const progressData = {
        user_id: user?.id,
        pattern_id: id,
        status: 'in_progress',
        user_solution: userCode,
        attempts: (userProgress?.attempts || 0) + 1
      };

      if (userProgress?.id) {
        await supabase
          .from('user_progress')
          .update(progressData)
          .eq('id', userProgress.id);
      } else {
        await supabase
          .from('user_progress')
          .insert(progressData);
      }

      toast.success('Progress saved!');
      await fetchPatternData();
    } catch (error) {
      console.error('Error saving progress:', error);
      toast.error('Failed to save progress');
    } finally {
      setSaving(false);
    }
  };

  const resetCode = () => {
    setUserCode(pattern?.pattern_code || '');
    setOutput('');
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

  if (!pattern) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Pattern not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{pattern.title}</h1>
              <p className="text-muted-foreground">{pattern.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={getDifficultyColor(pattern.difficulty)}>
                {pattern.difficulty}
              </Badge>
              {userProgress?.status === 'completed' && (
                <CheckCircle className="h-5 w-5 text-green-500" />
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Code className="h-4 w-4" />
              {pattern.category}
            </div>
            <div className="flex items-center gap-1">
              <Trophy className="h-4 w-4" />
              {pattern.points} points
            </div>
            <div className="flex items-center gap-1">
              <Target className="h-4 w-4" />
              Attempts: {userProgress?.attempts || 0}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Problem & Code */}
          <div className="space-y-6">
            {/* Expected Output */}
            <Card>
              <CardHeader>
                <CardTitle>Expected Output</CardTitle>
                <CardDescription>Your program should produce this output</CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-lg text-sm font-mono whitespace-pre-wrap">
                  {pattern.expected_output}
                </pre>
              </CardContent>
            </Card>

            {/* Code Editor */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Your Solution</CardTitle>
                    <CardDescription>Write your C code here</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={resetCode}
                      className="flex items-center gap-2"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Reset
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={handleSaveProgress}
                      disabled={saving}
                      className="flex items-center gap-2"
                    >
                      <Save className="h-4 w-4" />
                      {saving ? 'Saving...' : 'Save'}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={userCode}
                  onChange={(e) => setUserCode(e.target.value)}
                  placeholder="Enter your C code here..."
                  className="min-h-[400px] font-mono text-sm"
                />
                <div className="mt-4">
                  <Button 
                    onClick={handleRunCode} 
                    disabled={running || !userCode.trim()}
                    className="flex items-center gap-2"
                  >
                    <Play className="h-4 w-4" />
                    {running ? 'Running...' : 'Run Code'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Output & Hints */}
          <div className="space-y-6">
            {/* Output */}
            <Card>
              <CardHeader>
                <CardTitle>Output</CardTitle>
                <CardDescription>Results from running your code</CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-lg text-sm font-mono whitespace-pre-wrap min-h-[100px]">
                  {output || 'Click "Run Code" to see the output'}
                </pre>
              </CardContent>
            </Card>

            {/* Hints */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="h-5 w-5" />
                      Hints
                    </CardTitle>
                    <CardDescription>Need some help? Check these hints</CardDescription>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowHints(!showHints)}
                  >
                    {showHints ? 'Hide' : 'Show'} Hints
                  </Button>
                </div>
              </CardHeader>
              {showHints && (
                <CardContent>
                  {pattern.hints && pattern.hints.length > 0 ? (
                    <div className="space-y-2">
                      {pattern.hints.map((hint, index) => (
                        <div key={index} className="p-3 bg-muted rounded-lg">
                          <p className="text-sm">{hint}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No hints available for this pattern.</p>
                  )}
                </CardContent>
              )}
            </Card>

            {/* Status Card */}
            {userProgress && (
              <Card>
                <CardHeader>
                  <CardTitle>Your Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Status:</span>
                      <Badge variant={userProgress.status === 'completed' ? 'default' : 'secondary'}>
                        {userProgress.status.charAt(0).toUpperCase() + userProgress.status.slice(1)}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Points Earned:</span>
                      <span className="font-medium">{userProgress.points_earned}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Attempts:</span>
                      <span className="font-medium">{userProgress.attempts}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pattern;