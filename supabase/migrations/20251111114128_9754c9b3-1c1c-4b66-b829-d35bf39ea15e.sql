-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  sample_rate INTEGER DEFAULT 48000,
  preferred_mode TEXT DEFAULT 'binaural',
  headphone_profile TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create presets table
CREATE TABLE public.presets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  intent TEXT NOT NULL,
  mode TEXT DEFAULT 'binaural',
  base_freq_hz FLOAT DEFAULT 220,
  beat_hz_start FLOAT DEFAULT 10,
  beat_hz_end FLOAT,
  duration_min INTEGER DEFAULT 30,
  tuning_ref INTEGER DEFAULT 440,
  noise_type TEXT DEFAULT 'none',
  noise_level FLOAT DEFAULT 0,
  isochronic_depth FLOAT DEFAULT 0.5,
  description TEXT,
  created_by UUID REFERENCES public.profiles(id),
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.presets ENABLE ROW LEVEL SECURITY;

-- Presets policies
CREATE POLICY "Public presets are viewable by everyone"
  ON public.presets FOR SELECT
  USING (is_public = true OR created_by = auth.uid());

CREATE POLICY "Users can create their own presets"
  ON public.presets FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own presets"
  ON public.presets FOR UPDATE
  USING (auth.uid() = created_by);

-- Create sessions table
CREATE TABLE public.sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  preset_id UUID REFERENCES public.presets(id),
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ended_at TIMESTAMP WITH TIME ZONE,
  duration_seconds INTEGER,
  avg_spl_db_est FLOAT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  tags TEXT[],
  notes TEXT
);

ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

-- Sessions policies
CREATE POLICY "Users can view their own sessions"
  ON public.sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own sessions"
  ON public.sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sessions"
  ON public.sessions FOR UPDATE
  USING (auth.uid() = user_id);

-- Create trigger function for profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert default presets
INSERT INTO public.presets (name, intent, mode, base_freq_hz, beat_hz_start, beat_hz_end, duration_min, tuning_ref, description) VALUES
('Focus 45', 'Focus', 'binaural', 220, 10, 12, 45, 440, 'Progressive Alpha waves (10→12 Hz) for sustained concentration and productivity.'),
('Deep Focus 30', 'Focus', 'binaural', 200, 12, 14, 30, 440, 'Beta waves (12→14 Hz) for intense focus and mental clarity.'),
('Study Session 60', 'Study', 'binaural', 196, 8, 10, 60, 432, 'Theta to Alpha transition for enhanced learning and retention.'),
('Memory Boost 20', 'Study', 'monaural', 220, 10, 10, 20, 440, 'Steady Alpha (10 Hz) for memory consolidation.'),
('Creative Flow 40', 'Creative', 'binaural', 196, 7, 10, 40, 432, 'Theta to Alpha for creative thinking and problem-solving.'),
('Deep Sleep 60', 'Sleep', 'binaural', 150, 8, 1, 60, 440, 'Gradual descent from Theta to Delta (8→1 Hz) for natural sleep induction.'),
('Power Nap 20', 'Sleep', 'isochronic', 180, 4, 4, 20, 440, 'Delta waves (4 Hz) for quick restorative rest.'),
('Calm Mind 20', 'Calm', 'binaural', 200, 8, 8, 20, 432, 'Steady Theta (8 Hz) for relaxation and stress relief.'),
('Anxiety Relief 15', 'Calm', 'isochronic', 180, 12, 8, 15, 440, 'Progressive relaxation from Beta to Theta (12→8 Hz).'),
('Meditation 30', 'Meditation', 'binaural', 528, 7, 7, 30, 528, 'Theta waves at 528 Hz (solfeggio frequency) for deep meditation.'),
('Morning Lift 15', 'Energy', 'monaural', 220, 14, 18, 15, 440, 'Beta to high-Beta (14→18 Hz) for alertness and energy.'),
('Pre-Sleep Calm 30', 'Sleep', 'binaural', 174, 10, 4, 30, 440, 'Gentle transition from Alpha to Delta for pre-sleep relaxation.');