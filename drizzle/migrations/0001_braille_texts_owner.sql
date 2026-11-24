ALTER TABLE public.braille_texts ADD COLUMN user_id uuid, ADD COLUMN email text;
DROP POLICY "public read" ON public.braille_texts;
DROP POLICY "public insert" ON public.braille_texts;
REVOKE ALL ON public.braille_texts FROM anon;
GRANT SELECT, INSERT ON public.braille_texts TO authenticated;
CREATE POLICY "auth read" ON public.braille_texts FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth insert own" ON public.braille_texts FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid() AND char_length(texto) BETWEEN 1 AND 144);