const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL || 'https://qmturbsrhoifplupnbzx.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFtdHVyYnNyaG9pZnBsdXBuYnp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0MzczNTUsImV4cCI6MjA5MjAxMzM1NX0.oBJahwYP41TBuEFAYdFNCiU49KNCDiA5Sst9dk5T4ys';

const supabaseMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  // A valid JWT must have 3 parts (2 dots)
  if (authHeader && authHeader.split('.').length === 3) {
    req.supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });
  } else {
    // Fallback to anon client if token is missing or invalid
    req.supabase = createClient(supabaseUrl, supabaseAnonKey);
  }
  
  next();
};

module.exports = supabaseMiddleware;
