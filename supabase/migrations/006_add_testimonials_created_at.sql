ALTER TABLE testimonials ADD COLUMN created_at TIMESTAMPTZ DEFAULT now();
