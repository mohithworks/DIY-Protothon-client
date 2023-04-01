import { createClient } from '@supabase/supabase-js'

const supabaseUrl = window.env.SUPABASE_URL
const supabaseKey = window.env.SUPABASE_KEY

const supabaseClient = createClient(supabaseUrl, supabaseKey);

export default supabaseClient