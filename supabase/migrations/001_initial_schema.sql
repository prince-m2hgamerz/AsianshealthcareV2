-- gen_random_uuid() is built into PostgreSQL 13+

-- Hospitals table (must be before doctors due to FK reference)
CREATE TABLE hospitals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  beds_count INTEGER DEFAULT 0,
  accreditations TEXT[] DEFAULT '{}',
  about TEXT,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Doctors table
CREATE TABLE doctors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  photo_url TEXT,
  experience_years INTEGER DEFAULT 0,
  hospital_id UUID REFERENCES hospitals(id) ON DELETE SET NULL,
  specialties TEXT[] DEFAULT '{}',
  qualifications TEXT DEFAULT '',
  about TEXT,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Treatments table
CREATE TABLE treatments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  cost_usd_min NUMERIC(10,2) DEFAULT 0,
  cost_usd_max NUMERIC(10,2) DEFAULT 0,
  description TEXT,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Doctor-Hospital many-to-many
CREATE TABLE doctor_hospital (
  doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE,
  hospital_id UUID REFERENCES hospitals(id) ON DELETE CASCADE,
  PRIMARY KEY (doctor_id, hospital_id)
);

-- Specialties table
CREATE TABLE specialties (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  icon_url TEXT,
  description TEXT
);

-- Doctor-Specialty many-to-many
CREATE TABLE doctor_specialties (
  doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE,
  specialty_id UUID REFERENCES specialties(id) ON DELETE CASCADE,
  PRIMARY KEY (doctor_id, specialty_id)
);

-- Blogs table
CREATE TABLE blogs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  thumbnail_url TEXT,
  author TEXT DEFAULT 'asians Healthcare',
  published_at TIMESTAMPTZ DEFAULT NOW(),
  is_published BOOLEAN DEFAULT false
);

-- Insurance Companies table
CREATE TABLE insurance_companies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  description TEXT
);

-- Hotels table
CREATE TABLE hotels (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  hospital_id UUID REFERENCES hospitals(id) ON DELETE SET NULL,
  stars INTEGER DEFAULT 3,
  price_range TEXT DEFAULT '$$',
  booking_url TEXT,
  photo_url TEXT
);

-- Testimonials table
CREATE TABLE testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_name TEXT NOT NULL,
  country TEXT NOT NULL,
  treatment TEXT NOT NULL,
  video_url TEXT,
  text_content TEXT NOT NULL,
  rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  is_approved BOOLEAN DEFAULT false
);

-- Leads table
CREATE TABLE leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  form_type TEXT NOT NULL,
  name TEXT NOT NULL,
  age INTEGER,
  gender TEXT,
  country TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  medical_condition TEXT,
  doctor_preference TEXT,
  insurance_company TEXT,
  message TEXT,
  file_url TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'converted', 'closed')),
  notes TEXT,
  assigned_to TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Admin Users table
CREATE TABLE admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'editor' CHECK (role IN ('super_admin', 'editor', 'viewer')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Site Settings table
CREATE TABLE site_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE hospitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE treatments ENABLE ROW LEVEL SECURITY;
ALTER TABLE specialties ENABLE ROW LEVEL SECURITY;
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE insurance_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE hotels ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Public can read doctors" ON doctors FOR SELECT USING (true);
CREATE POLICY "Public can read hospitals" ON hospitals FOR SELECT USING (true);
CREATE POLICY "Public can read treatments" ON treatments FOR SELECT USING (true);
CREATE POLICY "Public can read specialties" ON specialties FOR SELECT USING (true);
CREATE POLICY "Public can read published blogs" ON blogs FOR SELECT USING (is_published = true);
CREATE POLICY "Public can read insurance" ON insurance_companies FOR SELECT USING (true);
CREATE POLICY "Public can read hotels" ON hotels FOR SELECT USING (true);
CREATE POLICY "Public can read approved testimonials" ON testimonials FOR SELECT USING (is_approved = true);

-- Admin policies (authenticated admin users)
CREATE POLICY "Admin full access doctors" ON doctors FOR ALL USING (
  auth.uid() IN (SELECT id FROM admin_users)
);
CREATE POLICY "Admin full access hospitals" ON hospitals FOR ALL USING (
  auth.uid() IN (SELECT id FROM admin_users)
);
CREATE POLICY "Admin full access treatments" ON treatments FOR ALL USING (
  auth.uid() IN (SELECT id FROM admin_users)
);
CREATE POLICY "Admin full access specialties" ON specialties FOR ALL USING (
  auth.uid() IN (SELECT id FROM admin_users)
);
CREATE POLICY "Admin full access blogs" ON blogs FOR ALL USING (
  auth.uid() IN (SELECT id FROM admin_users)
);
CREATE POLICY "Admin full access insurance" ON insurance_companies FOR ALL USING (
  auth.uid() IN (SELECT id FROM admin_users)
);
CREATE POLICY "Admin full access hotels" ON hotels FOR ALL USING (
  auth.uid() IN (SELECT id FROM admin_users)
);
CREATE POLICY "Admin full access testimonials" ON testimonials FOR ALL USING (
  auth.uid() IN (SELECT id FROM admin_users)
);
CREATE POLICY "Admin full access leads" ON leads FOR ALL USING (
  auth.uid() IN (SELECT id FROM admin_users)
);
CREATE POLICY "Admin full access site_settings" ON site_settings FOR ALL USING (
  auth.uid() IN (SELECT id FROM admin_users)
);

-- Insert trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER site_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
