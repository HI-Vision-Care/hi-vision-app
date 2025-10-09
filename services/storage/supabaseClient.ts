import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL! ||
    "https://lbijtyumwpjnmqrrmtpe.supabase.co",
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY! ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxiaWp0eXVtd3Bqbm1xcnJtdHBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg5ODY1MDcsImV4cCI6MjA3NDU2MjUwN30.7QtqjpmWXEhMf5wzVrix1bS4IHsuUwQxQk1P6Wmz_Ow"
);
