-- Migration: Create Projects Table for The Armory
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'Planned',
    image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id UUID REFERENCES auth.users(id) -- To track who added it
);

-- Enable RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read projects
CREATE POLICY "Allow public read access to projects" ON public.projects
    FOR SELECT USING (true);

-- Allow authenticated users to insert their own projects
CREATE POLICY "Allow authenticated users to insert projects" ON public.projects
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Insert the current hardcoded data (user_id will be null for these initial ones)
INSERT INTO public.projects (title, description, tags, status, image) VALUES
('Smart Campus Navigation', 'AR-based indoor navigation system for college campus to help students find classrooms and labs easily.', ARRAY['AR', 'Mobile', 'IoT'], 'Planned', 'https://images.unsplash.com/photo-1555664424-778a69022365?auto=format&fit=crop&q=80&w=800'),
('Autonomous Drone Swarm', 'Coordinated drone swarm for search and rescue operations, capable of mapping areas autonomously.', ARRAY['Robotics', 'AI', 'Embedded'], 'Planned', 'https://images.unsplash.com/photo-1506947411487-a56738267384?auto=format&fit=crop&q=80&w=800'),
('EcoSense Network', 'Distributed air quality monitoring network using LoRaWAN sensors deployed across the city.', ARRAY['IoT', 'LoRaWAN', 'Cloud'], 'Planned', 'https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?auto=format&fit=crop&q=80&w=800'),
('Gesture Controlled Arm', 'Robotic arm controlled by hand gestures using computer vision and EMG sensors.', ARRAY['Robotics', 'CV', 'Hardware'], 'Planned', 'https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?auto=format&fit=crop&q=80&w=800'),
('Smart Mirror', 'Interactive smart mirror displaying weather, news, and calendar events with voice control.', ARRAY['IoT', 'UI/UX', 'Raspberry Pi'], 'Planned', 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800'),
('AI Security Cam', 'Security camera system with edge AI for real-time threat detection and notifications.', ARRAY['AI', 'Security', 'Edge Computing'], 'Planned', 'https://images.unsplash.com/photo-1557324232-b8917d3c3dcb?auto=format&fit=crop&q=80&w=800');
