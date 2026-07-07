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
