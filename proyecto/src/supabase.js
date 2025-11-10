import { createClient } from '@supabase/supabase-js';
const supabaseUrl = 'https://yhasypwvshcnsufskibh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InloYXN5cHd2c2hjbnN1ZnNraWJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3MjU5MTIsImV4cCI6MjA3ODMwMTkxMn0.avnpOeyyy8akH8Szw-joXTBblzeAYRDdE6Jkba6aXy4';
export const supabase = createClient(supabaseUrl, supabaseKey);