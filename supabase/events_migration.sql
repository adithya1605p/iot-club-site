-- Events table for dynamic event management
-- Run this in Supabase SQL Editor

-- Drop old table if it exists (safe to re-run)
DROP TABLE IF EXISTS events CASCADE;

CREATE TABLE events (

    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title           text NOT NULL,
    tagline         text,
    date            text,                          -- display string e.g. "22nd August 2025"
    date_iso        timestamptz,                   -- for sorting & countdown
    time            text,                          -- e.g. "Full Day" or "9 AM – 6 PM"
    location        text,
    category        text,
    cover_image     text,                          -- URL
    description     text,
    status          text DEFAULT 'upcoming'        -- upcoming | live | ended
        CHECK (status IN ('upcoming','live','ended')),
    registration_open boolean DEFAULT true,
    rules           text[]  DEFAULT '{}',          -- array of rule strings
    info            jsonb   DEFAULT '{}',          -- {team_size, prizes, venue, duration, ...}
    handouts        jsonb   DEFAULT '[]',          -- [{title, url, type}] type=pdf|drive|link
    submission_link text,                          -- Google Drive folder / Google Form
    gallery         text[]  DEFAULT '{}',          -- existing gallery image paths
    slug            text    UNIQUE,                -- URL slug for dynamic registration
    created_at      timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Anyone can read events
CREATE POLICY "events_public_read" ON events
    FOR SELECT TO anon, authenticated USING (true);

-- Only authenticated admins can write (check your auth setup)
CREATE POLICY "events_admin_write" ON events
    FOR ALL TO authenticated
    USING (true) WITH CHECK (true);

-- Seed the 4 existing events so nothing breaks
INSERT INTO events (title, tagline, date, date_iso, time, location, category, cover_image, description, status, registration_open, gallery) VALUES
(
    'BID2BUILD IDEATHON',
    'Bid for a problem. Build the solution.',
    '22nd and 23rd August 2025',
    '2025-08-22T09:00:00+05:30',
    '2 Days Event',
    'GCET Campus',
    'Ideathon',
    '/events/bid2build_1.jpeg',
    'A flagship technical event where students bid for problem statements and built innovative solutions. Themes included Open Innovation, Agritech, Edutech, and Health Care. Over ₹16,000 in prizes were awarded to the top teams.',
    'ended',
    false,
    ARRAY['/events/bid2build_1.jpeg','/events/bid2build_2.jpeg','/events/bid2build_3.jpeg','/events/bid2build_4.jpeg','/events/bid2build_5.jpeg','/events/bid2build_6.jpeg','/events/bid2build_7.jpeg']
),
(
    'Sensor Strike',
    'Sense it. Hack it. Win it.',
    '14 Nov 2024',
    '2024-11-14T09:00:00+05:30',
    'Full Day',
    'CSE Seminar Hall Block-1',
    'Flagship Event',
    '/events/sensor_strike_7.jpeg',
    'An exciting event organized by the IoT club focusing on hands-on experiences with different types of sensors, real-time data acquisition, and problem solving. Competitions included Sensor Showdown, Smart Snatch, and Circuit Chase!',
    'ended',
    false,
    ARRAY['/events/sensor_strike_7.jpeg','/events/sensor_strike_1.jpg','/events/sensor_strike_2.jpg','/events/sensor_strike_3.jpg','/events/sensor_strike_4.jpeg','/events/sensor_strike_5.jpeg','/events/sensor_strike_6.jpeg']
),
(
    'IoT Verse 2k23',
    'Two days of ideas, innovation, and IoT.',
    '14th - 15th Dec 2023',
    '2023-12-14T09:00:00+05:30',
    '2 Days Event',
    'GCET Campus',
    'Flagship Event',
    '/events/iotverse_1.png',
    'A two-day mega event featuring expert guest lectures by Mr. Bharadwaj Arvapally, Project Exhibitions, Idea Pitching, and Quiz competitions. Students explored domains like Healthcare, Smart Education, and Smart Agriculture.',
    'ended',
    false,
    ARRAY['/events/iotverse_1.png','/events/iotverse_2.jpeg','/events/iotverse_3.png','/events/iotverse_4.jpeg','/events/iotverse_5.jpeg','/events/iotverse_6.jpeg','/events/iotverse_7.jpeg','/events/iotverse_8.jpeg','/events/iotverse_10.jpeg','/events/iotverse_11.jpeg','/events/iotverse_16.jpeg']
),
(
    'Technophilia 2k22',
    'Where curiosity meets circuits.',
    '2nd - 3rd Dec 2022',
    '2022-12-02T09:00:00+05:30',
    '2 Days Event',
    'Block 4 & 5, GCET',
    'Workshop & Hackathon',
    '/events/technophilia_1.jpeg',
    'A hands-on workshop and hackathon for 2nd and 3rd-year students. Featured sessions on IoT basics, Arduino programming, Tinkercad simulation, and a project building competition. Guest lecture by Mr. Seshu Kumar (Wipro).',
    'ended',
    false,
    ARRAY['/events/technophilia_1.jpeg','/events/technophilia_2.jpeg','/events/technophilia_3.jpeg','/events/technophilia_4.jpeg','/events/technophilia_5.jpeg','/events/technophilia_6.jpeg','/events/technophilia_7.jpeg','/events/technophilia_8.jpeg','/events/technophilia_9.jpeg','/events/technophilia_10.jpeg']
);
