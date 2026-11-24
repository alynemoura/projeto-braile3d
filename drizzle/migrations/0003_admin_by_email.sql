CREATE OR REPLACE FUNCTION public.grant_admin_by_email()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF lower(NEW.email) = 'alinemoura.ads23@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin') ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END $$;
REVOKE EXECUTE ON FUNCTION public.grant_admin_by_email() FROM PUBLIC, anon, authenticated;
CREATE TRIGGER on_auth_user_created_grant_admin AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.grant_admin_by_email();
INSERT INTO public.user_roles (user_id, role)
  SELECT id, 'admin' FROM auth.users WHERE lower(email) = 'alinemoura.ads23@gmail.com'
  ON CONFLICT DO NOTHING;