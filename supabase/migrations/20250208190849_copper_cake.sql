/*
  # Create predictions table

  1. New Tables
    - `predictions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `prediction_date` (date)
      - `btc_price` (numeric)
      - `eth_price` (numeric)
      - `ltc_price` (numeric)
      - `created_at` (timestamptz)
  2. Security
    - Enable RLS on `predictions` table
    - Add policy for authenticated users to read their own predictions
    - Add policy for authenticated users to insert their own predictions
*/

CREATE TABLE IF NOT EXISTS predictions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  prediction_date date NOT NULL,
  btc_price numeric NOT NULL,
  eth_price numeric NOT NULL,
  ltc_price numeric NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own predictions"
  ON predictions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own predictions"
  ON predictions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);