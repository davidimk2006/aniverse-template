import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm"

const supabaseUrl = "https://awmczzjgnzdntlhobqkp.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF3bWN6empnbnpkbnRsaG9icWtwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE3MDgwMjMsImV4cCI6MjA4NzI4NDAyM30.r7NSaDIe12ycfA5hzsXL0T0wTNB-N0aHlVr-noeaPNI"

export const supabase = createClient(supabaseUrl, supabaseKey)
