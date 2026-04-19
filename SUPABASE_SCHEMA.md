-- Run these SQL commands in your Supabase SQL Editor (https://supabase.com/dashboard/your-project/sql)

-- Step 1: Add new columns to existing profiles table (use DO to avoid errors if column exists)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'phone') THEN
    ALTER TABLE public.profiles ADD COLUMN phone text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'coursework') THEN
    ALTER TABLE public.profiles ADD COLUMN coursework text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'achievements') THEN
    ALTER TABLE public.profiles ADD COLUMN achievements text;
  END IF;
END $$;

-- Step 2: Create education table
CREATE TABLE IF NOT EXISTS public.education (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution text NOT NULL,
  degree text NOT NULL,
  field_of_study text,
  start_date text NOT NULL,
  end_date text,
  grade text,
  description text,
  currently_studying boolean DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 3: Create experience table
CREATE TABLE IF NOT EXISTS public.experience (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company text NOT NULL,
  position text NOT NULL,
  location text,
  start_date text NOT NULL,
  end_date text,
  description text,
  currently_working boolean DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 4: Create skills table
CREATE TABLE IF NOT EXISTS public.skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  icon text,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 5: Create photos table
CREATE TABLE IF NOT EXISTS public.photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url text NOT NULL,
  caption text,
  category text DEFAULT 'work',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 6: Enable RLS (Row Level Security) on new tables
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;

-- Step 7: Create or replace policies for public read access
DROP POLICY IF EXISTS "Allow public read access to education" ON public.education;
DROP POLICY IF EXISTS "Allow public read access to experience" ON public.experience;
DROP POLICY IF EXISTS "Allow public read access to skills" ON public.skills;
DROP POLICY IF EXISTS "Allow public read access to photos" ON public.photos;

CREATE POLICY "Allow public read access to education" ON public.education FOR SELECT USING (true);
CREATE POLICY "Allow public read access to experience" ON public.experience FOR SELECT USING (true);
CREATE POLICY "Allow public read access to skills" ON public.skills FOR SELECT USING (true);
CREATE POLICY "Allow public read access to photos" ON public.photos FOR SELECT USING (true);

-- Step 8: Create or replace policies for authenticated users
DROP POLICY IF EXISTS "Allow authenticated users to manage education" ON public.education;
DROP POLICY IF EXISTS "Allow authenticated users to manage experience" ON public.experience;
DROP POLICY IF EXISTS "Allow authenticated users to manage skills" ON public.skills;
DROP POLICY IF EXISTS "Allow authenticated users to manage photos" ON public.photos;

CREATE POLICY "Allow authenticated users to manage education" ON public.education FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to manage experience" ON public.experience FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to manage skills" ON public.skills FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to manage photos" ON public.photos FOR ALL USING (auth.role() = 'authenticated');

-- Step 9: Update sample profile data with all fields
UPDATE public.profiles 
SET 
  contact_email = 'selimsalahuddin19@gmail.com',
  facebook_link = 'https://www.facebook.com/share/17i1B4AXpF/',
  instagram_link = 'https://www.instagram.com/selimsalahuddin/',
  discord_username = 'xgoktug',
  phone = '+880 1234 567890',
  coursework = 'Data Structures and Algorithms (DSA), Object-Oriented Programming (OOP), Database Management System (DBMS), Operating Systems, Computer Networks, Software Engineering, Web Development, Machine Learning',
  achievements = 'First Place in University Hackathon 2024, Runner-up in National Coding Contest, Participated in ICPC Regionals',
  name = 'Salah Uddin Selim',
  role = 'Computer Science & Engineering Student',
  bio = 'I am a passionate Computer Science student specializing in software development and cybersecurity. With strong foundations in Java, Python, and web technologies, I aim to build innovative solutions that address real-world challenges.',
  vision = 'To contribute to the field of cybersecurity and software engineering, building secure and efficient applications that make a positive impact.',
  location = 'Bangladesh',
  github_link = 'https://github.com/salahuddinselim',
  linkedin_link = 'http://linkedin.com/in/salah-uddin-selim-167464257',
  twitter_link = 'https://x.com/selimsalahuddin'
WHERE email IS NOT NULL;

-- Step 10: Insert sample education (if none exists)
INSERT INTO public.education (institution, degree, field_of_study, start_date, end_date, grade, description, currently_studying)
SELECT 'Bangladesh University of Engineering and Technology (BUET)', 'Bachelor of Science', 'Computer Science and Engineering', '2023', '2027', '3.85/4.00', 'Relevant coursework: Data Structures, Algorithms, Database Systems, Operating Systems, Computer Networks, Software Engineering', true
WHERE NOT EXISTS (SELECT 1 FROM public.education LIMIT 1);

-- Step 11: Insert sample skills (if none exists)
INSERT INTO public.skills (name, category) 
SELECT * FROM (SELECT 'Java' as name, 'Programming Languages' as category) AS new_skill
WHERE NOT EXISTS (SELECT 1 FROM public.skills WHERE name = 'Java' LIMIT 1);

INSERT INTO public.skills (name, category) 
SELECT * FROM (SELECT 'Python' as name, 'Programming Languages' as category) AS new_skill
WHERE NOT EXISTS (SELECT 1 FROM public.skills WHERE name = 'Python' LIMIT 1);

INSERT INTO public.skills (name, category) 
SELECT * FROM (SELECT 'JavaScript' as name, 'Programming Languages' as category) AS new_skill
WHERE NOT EXISTS (SELECT 1 FROM public.skills WHERE name = 'JavaScript' LIMIT 1);

INSERT INTO public.skills (name, category) 
SELECT * FROM (SELECT 'React' as name, 'Frontend' as category) AS new_skill
WHERE NOT EXISTS (SELECT 1 FROM public.skills WHERE name = 'React' LIMIT 1);

INSERT INTO public.skills (name, category) 
SELECT * FROM (SELECT 'Node.js' as name, 'Backend' as category) AS new_skill
WHERE NOT EXISTS (SELECT 1 FROM public.skills WHERE name = 'Node.js' LIMIT 1);

INSERT INTO public.skills (name, category) 
SELECT * FROM (SELECT 'SQL' as name, 'Database' as category) AS new_skill
WHERE NOT EXISTS (SELECT 1 FROM public.skills WHERE name = 'SQL' LIMIT 1);

INSERT INTO public.skills (name, category) 
SELECT * FROM (SELECT 'Git' as name, 'Tools' as category) AS new_skill
WHERE NOT EXISTS (SELECT 1 FROM public.skills WHERE name = 'Git' LIMIT 1);

INSERT INTO public.skills (name, category) 
SELECT * FROM (SELECT 'Data Structures & Algorithms' as name, 'Concepts' as category) AS new_skill
WHERE NOT EXISTS (SELECT 1 FROM public.skills WHERE name = 'Data Structures & Algorithms' LIMIT 1);

INSERT INTO public.skills (name, category) 
SELECT * FROM (SELECT 'OOP' as name, 'Concepts' as category) AS new_skill
WHERE NOT EXISTS (SELECT 1 FROM public.skills WHERE name = 'OOP' LIMIT 1);

INSERT INTO public.skills (name, category) 
SELECT * FROM (SELECT 'DBMS' as name, 'Concepts' as category) AS new_skill
WHERE NOT EXISTS (SELECT 1 FROM public.skills WHERE name = 'DBMS' LIMIT 1);

-- Step 12: Insert sample photos (if none exists)
INSERT INTO public.photos (url, caption, category)
SELECT 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800', 'Coding Setup', 'work'
WHERE NOT EXISTS (SELECT 1 FROM public.photos LIMIT 1);