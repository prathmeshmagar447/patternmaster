-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  total_points INTEGER NOT NULL DEFAULT 0,
  rank INTEGER,
  streak_count INTEGER NOT NULL DEFAULT 0,
  patterns_completed INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create patterns table
CREATE TABLE public.patterns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  category TEXT NOT NULL,
  pattern_code TEXT NOT NULL,
  expected_output TEXT NOT NULL,
  points INTEGER NOT NULL DEFAULT 10,
  test_cases JSONB,
  hints TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_progress table
CREATE TABLE public.user_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pattern_id UUID NOT NULL REFERENCES public.patterns(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
  user_solution TEXT,
  completed_at TIMESTAMP WITH TIME ZONE,
  points_earned INTEGER DEFAULT 0,
  attempts INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, pattern_id)
);

-- Create badges table
CREATE TABLE public.badges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  condition_type TEXT NOT NULL,
  condition_value INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_badges table
CREATE TABLE public.user_badges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, badge_id)
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policies for patterns
CREATE POLICY "Anyone can view patterns" ON public.patterns FOR SELECT USING (true);

-- Create policies for user_progress
CREATE POLICY "Users can view their own progress" ON public.user_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own progress" ON public.user_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own progress" ON public.user_progress FOR UPDATE USING (auth.uid() = user_id);

-- Create policies for badges
CREATE POLICY "Anyone can view badges" ON public.badges FOR SELECT USING (true);

-- Create policies for user_badges
CREATE POLICY "Users can view all user badges" ON public.user_badges FOR SELECT USING (true);
CREATE POLICY "Users can insert their own badges" ON public.user_badges FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_patterns_updated_at BEFORE UPDATE ON public.patterns FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_user_progress_updated_at BEFORE UPDATE ON public.user_progress FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, username, display_name)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'username',
    NEW.raw_user_meta_data ->> 'display_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert some sample patterns
INSERT INTO public.patterns (title, description, difficulty, category, pattern_code, expected_output, points) VALUES
('Simple Star Pattern', 'Print a triangle of stars', 'beginner', 'star', '#include <stdio.h>\nint main() {\n    int n = 5;\n    for(int i = 1; i <= n; i++) {\n        for(int j = 1; j <= i; j++) {\n            printf("* ");\n        }\n        printf("\\n");\n    }\n    return 0;\n}', '* \n* * \n* * * \n* * * * \n* * * * * \n', 10),
('Number Triangle', 'Print a triangle of numbers', 'beginner', 'number', '#include <stdio.h>\nint main() {\n    int n = 5;\n    for(int i = 1; i <= n; i++) {\n        for(int j = 1; j <= i; j++) {\n            printf("%d ", j);\n        }\n        printf("\\n");\n    }\n    return 0;\n}', '1 \n1 2 \n1 2 3 \n1 2 3 4 \n1 2 3 4 5 \n', 15),
('Pyramid Pattern', 'Print a centered star pyramid', 'intermediate', 'star', '#include <stdio.h>\nint main() {\n    int n = 5;\n    for(int i = 1; i <= n; i++) {\n        for(int j = 1; j <= n-i; j++) {\n            printf(" ");\n        }\n        for(int k = 1; k <= 2*i-1; k++) {\n            printf("*");\n        }\n        printf("\\n");\n    }\n    return 0;\n}', '    *\n   ***\n  *****\n *******\n*********\n', 20);

-- Insert some sample badges
INSERT INTO public.badges (name, description, icon, condition_type, condition_value) VALUES
('First Steps', 'Complete your first pattern', 'trophy', 'patterns_completed', 1),
('Pattern Explorer', 'Complete 10 patterns', 'star', 'patterns_completed', 10),
('Pattern Master', 'Complete 50 patterns', 'crown', 'patterns_completed', 50),
('Point Collector', 'Earn 100 points', 'gem', 'total_points', 100),
('Streak Master', 'Maintain a 7-day streak', 'fire', 'streak_count', 7);