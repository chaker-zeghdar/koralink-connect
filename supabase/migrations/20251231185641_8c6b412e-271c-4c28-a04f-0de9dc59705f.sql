-- Create app roles enum
CREATE TYPE public.app_role AS ENUM ('player', 'stadium_owner');

-- Create user_roles table for secure role management
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own roles during signup"
ON public.user_roles
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS policies for profiles
CREATE POLICY "Users can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
ON public.profiles
FOR INSERT
WITH CHECK (auth.uid() = id);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (new.id, new.raw_user_meta_data ->> 'full_name');
  RETURN new;
END;
$$;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create teams table
CREATE TABLE public.teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  captain_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  level INTEGER CHECK (level >= 1 AND level <= 10),
  looking_for_players BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on teams
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;

-- RLS policies for teams
CREATE POLICY "Anyone can view teams"
ON public.teams
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Players can create teams"
ON public.teams
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'player'));

CREATE POLICY "Captains can update their teams"
ON public.teams
FOR UPDATE
USING (auth.uid() = captain_id);

CREATE POLICY "Captains can delete their teams"
ON public.teams
FOR DELETE
USING (auth.uid() = captain_id);

-- Create team_members table
CREATE TABLE public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  age INTEGER,
  position TEXT CHECK (position IN ('GK', 'CB', 'LB', 'RB', 'CDM', 'CM', 'CAM', 'RW', 'LW', 'ST')),
  level INTEGER CHECK (level >= 1 AND level <= 10),
  is_captain BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (team_id, user_id)
);

-- Enable RLS on team_members
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- RLS policies for team_members
CREATE POLICY "Anyone can view team members"
ON public.team_members
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Team captains can manage members"
ON public.team_members
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.teams
    WHERE id = team_members.team_id
    AND captain_id = auth.uid()
  )
);

CREATE POLICY "Users can add themselves to teams"
ON public.team_members
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create stadiums table
CREATE TABLE public.stadiums (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  price_per_hour DECIMAL(10,2) NOT NULL,
  description TEXT,
  images TEXT[],
  amenities TEXT[],
  rating DECIMAL(2,1) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on stadiums
ALTER TABLE public.stadiums ENABLE ROW LEVEL SECURITY;

-- RLS policies for stadiums
CREATE POLICY "Anyone can view stadiums"
ON public.stadiums
FOR SELECT
USING (true);

CREATE POLICY "Stadium owners can create stadiums"
ON public.stadiums
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'stadium_owner'));

CREATE POLICY "Owners can update their stadiums"
ON public.stadiums
FOR UPDATE
USING (auth.uid() = owner_id);

CREATE POLICY "Owners can delete their stadiums"
ON public.stadiums
FOR DELETE
USING (auth.uid() = owner_id);

-- Create time_slots table for stadium availability
CREATE TABLE public.time_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stadium_id UUID REFERENCES public.stadiums(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'booked', 'locked')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on time_slots
ALTER TABLE public.time_slots ENABLE ROW LEVEL SECURITY;

-- RLS policies for time_slots
CREATE POLICY "Anyone can view time slots"
ON public.time_slots
FOR SELECT
USING (true);

CREATE POLICY "Stadium owners can manage their time slots"
ON public.time_slots
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.stadiums
    WHERE id = time_slots.stadium_id
    AND owner_id = auth.uid()
  )
);

-- Create bookings table
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stadium_id UUID REFERENCES public.stadiums(id) ON DELETE CASCADE NOT NULL,
  team_id UUID REFERENCES public.teams(id) ON DELETE SET NULL,
  player_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  time_slot_id UUID REFERENCES public.time_slots(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'cancelled')),
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on bookings
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- RLS policies for bookings
CREATE POLICY "Players can view their bookings"
ON public.bookings
FOR SELECT
TO authenticated
USING (
  player_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM public.stadiums
    WHERE id = bookings.stadium_id
    AND owner_id = auth.uid()
  )
);

CREATE POLICY "Players can create bookings"
ON public.bookings
FOR INSERT
TO authenticated
WITH CHECK (player_id = auth.uid());

CREATE POLICY "Players can update their bookings"
ON public.bookings
FOR UPDATE
USING (player_id = auth.uid());

CREATE POLICY "Stadium owners can update booking status"
ON public.bookings
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.stadiums
    WHERE id = bookings.stadium_id
    AND owner_id = auth.uid()
  )
);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_teams_updated_at
  BEFORE UPDATE ON public.teams
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_stadiums_updated_at
  BEFORE UPDATE ON public.stadiums
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();