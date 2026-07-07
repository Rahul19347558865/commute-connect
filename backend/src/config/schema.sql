-- Schema definition for Commute Connect
-- Copy and run this script inside the Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE (Linked to auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('driver', 'passenger', 'both', 'admin')),
  profile_photo TEXT,
  college_company TEXT NOT NULL,
  bio TEXT,
  vehicle_type TEXT,
  vehicle_number TEXT,
  rating NUMERIC(3, 2) DEFAULT 5.00,
  reviews_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security (RLS) on public.users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Allow public read access to profiles" 
  ON public.users FOR SELECT USING (true);

CREATE POLICY "Allow users to update their own profiles" 
  ON public.users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Allow authenticated service role to insert profiles" 
  ON public.users FOR INSERT WITH CHECK (true);
