CREATE TABLE public.profiles (
 id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
 full_name text NOT NULL DEFAULT '' CHECK (char_length(full_name) <= 100),
 phone text NOT NULL DEFAULT '' CHECK (char_length(phone) <= 30),
 address text NOT NULL DEFAULT '' CHECK (char_length(address) <= 300),
 city text NOT NULL DEFAULT '' CHECK (char_length(city) <= 100)
);
GRANT SELECT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY profiles_read_own ON public.profiles FOR SELECT TO authenticated USING ((select auth.uid()) = id);
CREATE POLICY profiles_update_own ON public.profiles FOR UPDATE TO authenticated USING ((select auth.uid()) = id) WITH CHECK ((select auth.uid()) = id);
CREATE FUNCTION public.create_customer_profile() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
 INSERT INTO public.profiles(id, full_name) VALUES (NEW.id, left(coalesce(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),100));
 RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.create_customer_profile() FROM PUBLIC;
CREATE TRIGGER create_customer_profile AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.create_customer_profile();
INSERT INTO public.profiles(id, full_name) SELECT id, left(coalesce(raw_user_meta_data->>'full_name',''),100) FROM auth.users ON CONFLICT DO NOTHING;