const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://qmturbsrhoifplupnbzx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFtdHVyYnNyaG9pZnBsdXBuYnp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0MzczNTUsImV4cCI6MjA5MjAxMzM1NX0.oBJahwYP41TBuEFAYdFNCiU49KNCDiA5Sst9dk5T4ys';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createBucket() {
  const { data, error } = await supabase.storage.createBucket('images', {
    public: true,
    allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp'],
    fileSizeLimit: 5242880
  });

  if (error) {
    console.error('Error creating bucket:', error);
  } else {
    console.log('Bucket created successfully:', data);
  }
}

createBucket();
