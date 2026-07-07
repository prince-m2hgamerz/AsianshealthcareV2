-- FCM device tokens for Android push notifications
CREATE TABLE IF NOT EXISTS fcm_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token TEXT NOT NULL UNIQUE,
  device_model TEXT,
  os_version TEXT,
  app_version TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_fcm_tokens_token ON fcm_tokens(token);
CREATE INDEX IF NOT EXISTS idx_fcm_tokens_updated_at ON fcm_tokens(updated_at);

ALTER TABLE fcm_tokens ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'fcm_tokens' AND policyname = 'Service role can manage fcm_tokens') THEN
    CREATE POLICY "Service role can manage fcm_tokens" ON fcm_tokens
      FOR ALL
      TO service_role
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'fcm_tokens' AND policyname = 'Anyone can upsert fcm_tokens') THEN
    CREATE POLICY "Anyone can upsert fcm_tokens" ON fcm_tokens
      FOR INSERT
      TO anon, authenticated
      WITH CHECK (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'fcm_tokens' AND policyname = 'Anyone can delete fcm_tokens by token') THEN
    CREATE POLICY "Anyone can delete fcm_tokens by token" ON fcm_tokens
      FOR DELETE
      TO anon, authenticated
      USING (true);
  END IF;
END $$;
