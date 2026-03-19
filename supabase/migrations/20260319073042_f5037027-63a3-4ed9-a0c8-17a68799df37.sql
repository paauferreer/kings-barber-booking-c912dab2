
-- Services table
CREATE TABLE public.services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price text NOT NULL,
  duration text NOT NULL,
  category text NOT NULL DEFAULT 'other',
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Anyone can read active services
CREATE POLICY "Anyone can read services" ON public.services FOR SELECT TO anon, authenticated USING (true);
-- Only admins can manage services
CREATE POLICY "Admins can insert services" ON public.services FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update services" ON public.services FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete services" ON public.services FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'));

-- Barber schedules table
CREATE TABLE public.barber_schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  barber_name text NOT NULL,
  day_of_week integer NOT NULL,
  time_slots text[] NOT NULL DEFAULT '{}',
  is_active boolean NOT NULL DEFAULT true,
  UNIQUE(barber_name, day_of_week)
);

ALTER TABLE public.barber_schedules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read schedules" ON public.barber_schedules FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can manage schedules" ON public.barber_schedules FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'));
