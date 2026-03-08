-- Migration: Create Vault Table
CREATE TABLE IF NOT EXISTS public.vault (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL,
    link TEXT NOT NULL,
    size TEXT NOT NULL,
    icon_type TEXT NOT NULL DEFAULT 'server', -- To map to Lucide icons dynamically
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.vault ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read
CREATE POLICY "Allow public read access to vault" ON public.vault
    FOR SELECT USING (true);

-- Only admins can modify
CREATE POLICY "Allow admin all access to vault" ON public.vault
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- Insert the current data
INSERT INTO public.vault (title, category, description, type, link, size, icon_type) VALUES
('ESP32 Pinout & Specs', 'Microcontrollers', 'High-res diagram of the 38-pin ESP32 DEVKIT V1. Essential for wiring sensors and avoiding power shorts.', 'pdf', '#', '2.4 MB', 'cpu'),
('Arduino Uno R3 Reference', 'Microcontrollers', 'Official schematic, analog/digital pin mappings, and power limits for the standard Uno.', 'pdf', '#', '1.1 MB', 'cpu'),
('DHT11 vs DHT22 Guide', 'Sensors', 'Comparison chart for temp/humidity sensors including pull-up resistor requirements and sample code.', 'pdf', '#', '0.8 MB', 'archive'),
('CP210x USB–UART Driver', 'Drivers', 'Windows/Mac driver to flash ESP32 and NodeMCU boards via USB. Fixes "COM Port not found" errors.', 'exe', 'https://www.silabs.com/developers/usb-to-uart-bridge-vcp-drivers', 'External', 'server'),
('CH340 Serial Driver', 'Drivers', 'Required for generic Arduino clones. Install this if your PC doesn''t recognize your newly plugged-in board.', 'zip', '#', '1.5 MB', 'server'),
('I2C Scanner Sketch (C++)', 'Code', 'Arduino sketch that scans the I2C bus and outputs hex addresses of all connected devices (LCDs, OLEDs).', 'code', '#', '2 KB', 'file-text'),
('Tinkercad Circuits Simulator', 'Software', 'Autodesk''s free online simulator. Perfect for testing your Arduino circuits and writing code before wiring the real physical hardware.', 'link', 'https://www.tinkercad.com/circuits', 'Web App', 'server'),
('Wokwi IoT Simulator', 'Software', 'Advanced web-based simulator for ESP32, STM32, and Raspberry Pi Pico. Supports WiFi simulation and advanced C++ libraries.', 'link', 'https://wokwi.com', 'Web App', 'server'),
('IoT Engineering Book 1 (Drive)', 'Microcontrollers', 'Google Drive PDF: The primary handbook for deep IoT engineering dives provided by the team.', 'pdf', 'https://drive.google.com/file/d/1vujIzw3ADpyRn2jkRZQ-J7-2U3UL4_gb/view?usp=drive_link', 'PDF', 'archive'),
('IoT Engineering Book 2 (Drive)', 'Microcontrollers', 'Google Drive PDF: Advanced topics and architectures for scaling hardware systems.', 'pdf', 'https://drive.google.com/file/d/1Wt2SVa4nidgApz-SsPPNyuVyGDUIst6I/view?usp=drive_link', 'PDF', 'archive'),
('Fritzing CAD Software', 'Software', 'The industry standard open-source tool for designing electronic schematics and custom PCB layouts.', 'link', 'https://fritzing.org/', 'Web App', 'server'),
('Proteus Design Suite', 'Software', 'Advanced electronic design automation software used for drawing schematics and simulating complex microcontroller code.', 'link', 'https://www.labcenter.com/', 'Software', 'server'),
('Paul McWhorter Arduino Masterclass', 'Software', 'The absolute best, legendary 60+ video YouTube playlist for mastering Arduino from zero to hero.', 'link', 'https://www.youtube.com/playlist?list=PLGs0VKk2DiYw-L-RibttcvK-U9v3gR9vM', 'Playlist', 'external-link'),
('Random Nerd Tutorials (Wiki)', 'Code', 'The internet''s definitive Wiki / tutorial library for ESP32, ESP8266, and Raspberry Pi projects.', 'link', 'https://randomnerdtutorials.com/', 'Wiki', 'book-open'),
('DroneBot Workshop (Playlists)', 'Microcontrollers', 'Extremely detailed video guides on motors, servos, robotics, and advanced coding concepts.', 'link', 'https://www.youtube.com/c/Dronebotworkshop', 'Playlist', 'external-link');
