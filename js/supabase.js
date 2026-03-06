const SUPABASE_URL = "https://awmczzjgnzdntlhobqkp.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF3bWN6empnbnpkbnRsaG9icWtwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE3MDgwMjMsImV4cCI6MjA4NzI4NDAyM30.r7NSaDIe12ycfA5hzsXL0T0wTNB-N0aHlVr-noeaPNI"

window.db = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
)
