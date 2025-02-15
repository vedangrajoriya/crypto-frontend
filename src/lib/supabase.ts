import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ujrsabcimjlxlxulablw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqcnNhYmNpbWpseGx4dWxhYmx3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkwNDE4OTksImV4cCI6MjA1NDYxNzg5OX0.YAjI2SrNmgkARyjvFW5cV6rQXcDcpzoSbsnzsq6ozys';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
