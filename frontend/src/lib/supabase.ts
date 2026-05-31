import { createClient } from "@supabase/supabase-js";
import { projectId, publicAnonKey } from "/utils/supabase/info";

// Create a singleton Supabase client to avoid multiple instances
export const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);

// Helper to get the current access token
export const getAccessToken = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error || !session?.access_token) {
    return null;
  }
  return session.access_token;
};
