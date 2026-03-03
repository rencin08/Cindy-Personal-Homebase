
-- Journal entries (pins)
CREATE TABLE public.journal_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL DEFAULT 'note' CHECK (type IN ('note', 'photo', 'mood', 'moment')),
  content TEXT NOT NULL DEFAULT '',
  caption TEXT,
  tags TEXT[] NOT NULL DEFAULT '{}',
  checklist JSONB,
  mood TEXT,
  visibility TEXT NOT NULL DEFAULT 'private' CHECK (visibility IN ('public', 'private')),
  archived BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Chat/guestbook messages
CREATE TABLE public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL DEFAULT 'Anonymous',
  message TEXT NOT NULL,
  is_owner BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Journal: anyone can read public entries, anyone can insert/update/delete (admin enforced client-side for now)
CREATE POLICY "Anyone can read public journal entries" ON public.journal_entries FOR SELECT USING (visibility = 'public');
CREATE POLICY "Anyone can read private journal entries" ON public.journal_entries FOR SELECT USING (true);
CREATE POLICY "Anyone can insert journal entries" ON public.journal_entries FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update journal entries" ON public.journal_entries FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete journal entries" ON public.journal_entries FOR DELETE USING (true);

-- Chat: anyone can read and insert
CREATE POLICY "Anyone can read chat messages" ON public.chat_messages FOR SELECT USING (true);
CREATE POLICY "Anyone can insert chat messages" ON public.chat_messages FOR INSERT WITH CHECK (true);
