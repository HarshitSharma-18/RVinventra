const { supabase } = require('../config/db');

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name }
      }
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Usually with email confirmation enabled, session is null.
    return res.status(201).json({ 
      success: true, 
      session: data.session, // Include the token
      user: { 
        id: data.user.id, 
        name: data.user.user_metadata?.name || name, 
        email: data.user.email 
      } 
    });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      return res.status(401).json({ error: error.message });
    }

    return res.status(200).json({ 
      success: true, 
      session: data.session, // Include the token
      user: { 
        id: data.user.id, 
        name: data.user.user_metadata?.name || email.split('@')[0], 
        email: data.user.email 
      } 
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
