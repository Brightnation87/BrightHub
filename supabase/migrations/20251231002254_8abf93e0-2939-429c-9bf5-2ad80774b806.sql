-- Create user_settings table to persist settings
CREATE TABLE public.user_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  -- Appearance
  theme TEXT DEFAULT 'dark',
  editor_background TEXT DEFAULT '#1e1e1e',
  -- Editor
  font_size INTEGER DEFAULT 14,
  tab_size INTEGER DEFAULT 2,
  font_family TEXT DEFAULT 'JetBrains Mono',
  word_wrap BOOLEAN DEFAULT true,
  line_numbers BOOLEAN DEFAULT true,
  auto_complete BOOLEAN DEFAULT true,
  minimap BOOLEAN DEFAULT true,
  bracket_matching BOOLEAN DEFAULT true,
  -- Auto Save
  auto_save BOOLEAN DEFAULT true,
  auto_save_delay INTEGER DEFAULT 5,
  -- AI
  ai_hints BOOLEAN DEFAULT true,
  ai_auto_suggest BOOLEAN DEFAULT false,
  -- Notifications
  email_notifications BOOLEAN DEFAULT true,
  push_notifications BOOLEAN DEFAULT false,
  sound_effects BOOLEAN DEFAULT true,
  -- Privacy
  show_activity_status BOOLEAN DEFAULT true,
  share_progress BOOLEAN DEFAULT false,
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own settings" 
ON public.user_settings 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own settings" 
ON public.user_settings 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings" 
ON public.user_settings 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_user_settings_updated_at
BEFORE UPDATE ON public.user_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();