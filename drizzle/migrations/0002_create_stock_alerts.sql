CREATE TABLE public.stock_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  product_id integer NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, product_id)
);
GRANT SELECT, INSERT, DELETE ON public.stock_alerts TO authenticated;
GRANT ALL ON public.stock_alerts TO service_role;
ALTER TABLE public.stock_alerts ENABLE ROW LEVEL SECURITY;
CREATE POLICY stock_alerts_read_own ON public.stock_alerts FOR SELECT TO authenticated USING ((SELECT auth.uid()) = user_id);
CREATE POLICY stock_alerts_insert_own ON public.stock_alerts FOR INSERT TO authenticated WITH CHECK ((SELECT auth.uid()) = user_id);
CREATE POLICY stock_alerts_delete_own ON public.stock_alerts FOR DELETE TO authenticated USING ((SELECT auth.uid()) = user_id);