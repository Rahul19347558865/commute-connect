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

-- 4. RIDE REQUESTS TABLE
CREATE TABLE IF NOT EXISTS public.ride_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ride_id UUID NOT NULL REFERENCES public.rides(id) ON DELETE CASCADE,
  passenger_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Partial index to enforce: One active request per ride per passenger
CREATE UNIQUE INDEX IF NOT EXISTS unique_active_passenger_request_idx 
  ON public.ride_requests(ride_id, passenger_id) 
  WHERE (status IN ('pending', 'accepted'));

-- Enable RLS on ride_requests
ALTER TABLE public.ride_requests ENABLE ROW LEVEL SECURITY;

-- Ride Requests Policies
CREATE POLICY "Allow select for passenger or driver"
  ON public.ride_requests FOR SELECT USING (
    auth.uid() = passenger_id OR 
    EXISTS (SELECT 1 FROM public.rides WHERE id = ride_requests.ride_id AND driver_id = auth.uid())
  );

CREATE POLICY "Allow insert for passenger"
  ON public.ride_requests FOR INSERT WITH CHECK (
    auth.uid() = passenger_id
  );

CREATE POLICY "Allow update for passenger or driver"
  ON public.ride_requests FOR UPDATE USING (
    auth.uid() = passenger_id OR 
    EXISTS (SELECT 1 FROM public.rides WHERE id = ride_requests.ride_id AND driver_id = auth.uid())
  );

CREATE POLICY "Allow delete for passenger"
  ON public.ride_requests FOR DELETE USING (
    auth.uid() = passenger_id
  );

-- 5. CHAT MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ride_id UUID NOT NULL REFERENCES public.rides(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  message_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS on chat_messages
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Chat messages Policies
CREATE POLICY "Allow select chat messages for ride participants"
  ON public.chat_messages FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.rides r
      WHERE r.id = ride_id AND (
        r.driver_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM public.ride_requests req
          WHERE req.ride_id = r.id AND req.passenger_id = auth.uid() AND req.status = 'accepted'
        )
      )
    )
  );

CREATE POLICY "Allow insert chat messages for ride participants"
  ON public.chat_messages FOR INSERT WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM public.rides r
      WHERE r.id = ride_id AND (
        r.driver_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM public.ride_requests req
          WHERE req.ride_id = r.id AND req.passenger_id = auth.uid() AND req.status = 'accepted'
        )
      )
    )
  );

-- 6. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message_text TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('booking_request', 'booking_accepted', 'booking_rejected', 'booking_cancelled', 'chat_message', 'other')),
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS on notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Notifications Policies
CREATE POLICY "Allow select notifications for owner"
  ON public.notifications FOR SELECT USING (
    auth.uid() = user_id
  );

CREATE POLICY "Allow insert notifications for anyone"
  ON public.notifications FOR INSERT WITH CHECK (
    true
  );

CREATE POLICY "Allow update notifications for owner"
  ON public.notifications FOR UPDATE USING (
    auth.uid() = user_id
  );

-- 7. TRIP SESSIONS TABLE
CREATE TABLE IF NOT EXISTS public.trip_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ride_id UUID NOT NULL REFERENCES public.rides(id) ON DELETE CASCADE UNIQUE,
  status TEXT CHECK (status IN ('upcoming', 'active', 'completed', 'cancelled')) DEFAULT 'upcoming',
  started_at TIMESTAMP WITH TIME ZONE,
  ended_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS on trip_sessions
ALTER TABLE public.trip_sessions ENABLE ROW LEVEL SECURITY;

-- Trip Sessions Policies
CREATE POLICY "Allow select trip sessions for ride participants"
  ON public.trip_sessions FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.rides r
      WHERE r.id = ride_id AND (
        r.driver_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM public.ride_requests req
          WHERE req.ride_id = r.id AND req.passenger_id = auth.uid() AND req.status = 'accepted'
        )
      )
    )
  );

CREATE POLICY "Allow all operations for trip driver"
  ON public.trip_sessions FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.rides r
      WHERE r.id = ride_id AND r.driver_id = auth.uid()
    )
  );

-- 8. DRIVER LOCATIONS TABLE
CREATE TABLE IF NOT EXISTS public.driver_locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ride_id UUID NOT NULL REFERENCES public.rides(id) ON DELETE CASCADE UNIQUE,
  latitude NUMERIC NOT NULL,
  longitude NUMERIC NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS on driver_locations
ALTER TABLE public.driver_locations ENABLE ROW LEVEL SECURITY;

-- Driver Locations Policies
CREATE POLICY "Allow select location for ride participants"
  ON public.driver_locations FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.rides r
      WHERE r.id = ride_id AND (
        r.driver_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM public.ride_requests req
          WHERE req.ride_id = r.id AND req.passenger_id = auth.uid() AND req.status = 'accepted'
        )
      )
    )
  );

CREATE POLICY "Allow all operations on location for trip driver"
  ON public.driver_locations FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.rides r
      WHERE r.id = ride_id AND r.driver_id = auth.uid()
    )
  );

-- 9. RIDE REVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.ride_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ride_id UUID NOT NULL REFERENCES public.rides(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reviewee_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS on ride_reviews
ALTER TABLE public.ride_reviews ENABLE ROW LEVEL SECURITY;

-- Ride Reviews Policies
CREATE POLICY "Allow public select reviews"
  ON public.ride_reviews FOR SELECT USING (true);

CREATE POLICY "Allow insert reviews for reviewer"
  ON public.ride_reviews FOR INSERT WITH CHECK (auth.uid() = reviewer_id);

-- 10. SAVED PLACES TABLE
CREATE TABLE IF NOT EXISTS public.saved_places (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  address TEXT NOT NULL,
  latitude NUMERIC NOT NULL,
  longitude NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS on saved_places
ALTER TABLE public.saved_places ENABLE ROW LEVEL SECURITY;

-- Saved Places Policies
CREATE POLICY "Allow select saved places for owner"
  ON public.saved_places FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Allow insert saved places for owner"
  ON public.saved_places FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow delete saved places for owner"
  ON public.saved_places FOR DELETE USING (auth.uid() = user_id);

-- 11. REPORTS TABLE
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reporter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reported_user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  reported_ride_id UUID REFERENCES public.rides(id) ON DELETE CASCADE,
  reported_review_id UUID REFERENCES public.ride_reviews(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'resolved', 'dismissed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS on reports
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Reports Policies
CREATE POLICY "Allow select reports for owner or admin"
  ON public.reports FOR SELECT USING (
    auth.uid() = reporter_id OR 
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Allow insert reports for anyone authenticated"
  ON public.reports FOR INSERT WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Allow admin to update reports"
  ON public.reports FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );
