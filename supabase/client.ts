// @ts-nocheck
// This assumes the Supabase JS library is loaded from a CDN in index.html
// and exposes a global `supabase` object.

// These variables are the public credentials for your Supabase project.
const supabaseUrl = 'https://zircvcmbsggcijrfbkxx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppcmN2Y21ic2dnY2lqcmZia3h4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4ODk2MzcsImV4cCI6MjA3NjQ2NTYzN30.iZHr5ISqRKj-PM75CpNQUbyLK-Ubm7fj8s5uaGvZUyI';

// The createClient function is available on the global `supabase` object from the CDN script.
export const supabaseClient = supabase.createClient(supabaseUrl, supabaseAnonKey);
