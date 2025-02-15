/*
  # Update predictions policies

  This migration ensures the insert policy exists for the predictions table,
  creating it only if it doesn't already exist.
*/

DO $$ 
BEGIN
  -- Check if the policy doesn't exist before creating it
  IF NOT EXISTS (
    SELECT 1 
    FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'predictions' 
    AND policyname = 'Users can insert own predictions'
  ) THEN
    CREATE POLICY "Users can insert own predictions"
      ON predictions
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;