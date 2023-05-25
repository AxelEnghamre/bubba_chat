import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_SUPABASE_URL as string,
  process.env.NEXT_SUPABASE_ANON as string
);

export default supabase;
