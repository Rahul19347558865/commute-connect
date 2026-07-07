-- Normalized Database Schema for Commute Connect Profile Management

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE (Linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('driver', 'passenger', 'both', 'admin')),
  profile_photo TEXT,
  college_company TEXT NOT NULL,
  bio TEXT,
  gender TEXT,
  contact_number TEXT,
  emergency_contact TEXT,
  preferred_pickup_area TEXT,
  preferred_drop_area TEXT,
  travel_preferences TEXT,
  driver_verification_status TEXT DEFAULT 'pending' CHECK (driver_verification_status IN ('pending', 'verified', 'rejected')),
  passenger_preferences JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. VEHICLE INFORMATION TABLE (One-to-One with profiles for drivers/both)
CREATE TABLE IF NOT EXISTS public.vehicle_information (
  id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  vehicle_type TEXT NOT NULL,
  company TEXT NOT NULL,
  model TEXT NOT NULL,
  color TEXT NOT NULL,
  registration_number TEXT NOT NULL,
  seat_capacity INTEGER NOT NULL CHECK (seat_capacity > 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_information ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Allow public read access to profiles"
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Allow users to insert their own profile"
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Allow users to update their own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Vehicle Information Policies
CREATE POLICY "Allow public read access to vehicle info"
  ON public.vehicle_information FOR SELECT USING (true);

CREATE POLICY "Allow users to insert their own vehicle info"
  ON public.vehicle_information FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Allow users to update their own vehicle info"
  ON public.vehicle_information FOR UPDATE USING (auth.uid() = id);

-- 3. RIDES TABLE
CREATE TABLE IF NOT EXISTS public.rides (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  driver_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  pickup_location TEXT NOT NULL,
  pickup_latitude NUMERIC NOT NULL,
  pickup_longitude NUMERIC NOT NULL,
  destination TEXT NOT NULL,
  destination_latitude NUMERIC NOT NULL,
  destination_longitude NUMERIC NOT NULL,
  departure_time TIMESTAMP WITH TIME ZONE NOT NULL,
  available_seats INTEGER NOT NULL CHECK (available_seats >= 0),
  contribution_type TEXT NOT NULL CHECK (contribution_type IN ('free', 'paid', 'co-travel')),
  contribution_amount NUMERIC DEFAULT 0 CHECK (contribution_amount >= 0),
  notes TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance tuning
CREATE INDEX IF NOT EXISTS rides_departure_time_idx ON public.rides(departure_time);
CREATE INDEX IF NOT EXISTS rides_driver_id_idx ON public.rides(driver_id);
CREATE INDEX IF NOT EXISTS rides_status_idx ON public.rides(status);

-- Enable RLS on rides table
ALTER TABLE public.rides ENABLE ROW LEVEL SECURITY;

-- Rides Policies
CREATE POLICY "Allow public read access to active rides"
  ON public.rides FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to create rides"
  ON public.rides FOR INSERT WITH CHECK (auth.uid() = driver_id);

CREATE POLICY "Allow drivers to update their own rides"
  ON public.rides FOR UPDATE USING (auth.uid() = driver_id);

CREATE POLICY "Allow drivers to delete their own rides"
  ON public.rides FOR DELETE USING (auth.uid() = driver_id);
