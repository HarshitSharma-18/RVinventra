const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Using the keys previously found in the client app
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

module.exports = { supabase };
