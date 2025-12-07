const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Use Service Role Key for backend updates

if (!supabaseUrl || !supabaseKey) {
    console.error('⚠️ Supabase URL or Key is missing in .env file');
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = { supabase };
