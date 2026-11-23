CREATE TABLE public.braille_texts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  texto text NOT NULL CHECK (char_length(texto) BETWEEN 1 AND 144),
  data_criacao timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.braille_texts TO anon, authenticated;
GRANT ALL ON public.braille_texts TO service_role;
ALTER TABLE public.braille_texts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read" ON public.braille_texts FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public insert" ON public.braille_texts FOR INSERT TO anon, authenticated WITH CHECK (char_length(texto) BETWEEN 1 AND 144);