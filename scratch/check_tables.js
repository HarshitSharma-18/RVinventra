const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://qmturbsrhoifplupnbzx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFtdHVyYnNyaG9pZnBsdXBuYnp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0MzczNTUsImV4cCI6MjA5MjAxMzM1NX0.oBJahwYP41TBuEFAYdFNCiU49KNCDiA5Sst9dk5T4ys';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkTables() {
  const { data, error } = await supabase.from('profiles').select('*').limit(1);
  if (error) {
    console.error('Error checking profiles table:', error);
  } else {
    console.log('Profiles table exists.');
  }
}

checkTables();
