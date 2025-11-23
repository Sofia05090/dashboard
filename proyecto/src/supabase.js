import { createClient } from '@supabase/supabase-js';
const supabaseUrl = 'https://merrcvbgecfeiecrqkbk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lcnJjdmJnZWNmZWllY3Jxa2JrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzkyNjAzNywiZXhwIjoyMDc5NTAyMDM3fQ.PRXLgnlB21q6PQ0ujvDwsuX_xWMJScF76tg1UUkfmzI';
export const supabase = createClient(supabaseUrl, supabaseKey);