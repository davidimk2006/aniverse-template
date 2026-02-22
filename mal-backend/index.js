require('dotenv').config();
const express = require('express');
const axios = require('axios');
const NodeCache = require('node-cache');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const cache = new NodeCache();
const MAL_TOKEN_KEY = 'mal_token';
const MAL_API_BASE = 'https://api.myanimelist.net/v2';

const fs = require('fs');
const path = require('path');
const DATA_DIR = path.join(__dirname, 'data');
const VIDEOS_FILE = path.join(DATA_DIR, 'videos.json');

if(!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if(!fs.existsSync(VIDEOS_FILE)) fs.writeFileSync(VIDEOS_FILE, JSON.stringify([] , null, 2));

// Supabase client (optional). If SUPABASE_URL and SUPABASE_KEY are provided,
// video metadata will be stored in Supabase table `videos`. Otherwise fallback to local JSON file.
const { createClient } = require('@supabase/supabase-js');
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const useSupabase = Boolean(SUPABASE_URL && SUPABASE_KEY);
let supabase = null;
if(useSupabase){
  supabase = createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { persistSession: false } });
  console.log('Supabase storage enabled for videos');
} else {
  console.log('Using local JSON storage for videos (not recommended for Vercel)');
}

const CLIENT_ID = process.env.MAL_CLIENT_ID;
const CLIENT_SECRET = process.env.MAL_CLIENT_SECRET;
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'changeme';
if(!CLIENT_ID || !CLIENT_SECRET){
  console.warn('Warning: MAL_CLIENT_ID or MAL_CLIENT_SECRET not set in env. See .env.example');
}

async function fetchToken(){
  const cached = cache.get(MAL_TOKEN_KEY);
  if(cached) return cached;

  const tokenUrl = 'https://myanimelist.net/v1/oauth2/token';
  try{
    const params = new URLSearchParams();
    params.append('grant_type','client_credentials');
    params.append('client_id', CLIENT_ID);
    params.append('client_secret', CLIENT_SECRET);

    const resp = await axios.post(tokenUrl, params.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    const data = resp.data;
    // data: { access_token, expires_in, token_type }
    const ttl = (data.expires_in || 1800) - 30;
    cache.set(MAL_TOKEN_KEY, data, ttl);
    return data;
  }catch(err){
    console.error('Failed to fetch MAL token', err?.response?.data || err.message);
    throw err;
  }
}

async function malRequest(path, reqQuery){
  const token = await fetchToken();
  const url = `${MAL_API_BASE}/${path}`;
  const resp = await axios.get(url, { params: reqQuery, headers: { Authorization: `Bearer ${token.access_token}` } });
  return resp.data;
}

// Basic endpoints
app.get('/api/anime/search', async (req,res)=>{
  try{
    if(!req.query.q) return res.status(400).json({error:'missing q parameter'});
    const data = await malRequest('anime', { q: req.query.q, limit: req.query.limit || 20, fields: req.query.fields || 'id,title,main_picture,mean,genres,episodes,media_type,status,start_date,studios,synopsis' });
    res.json(data);
  }catch(err){ res.status(err.response?.status || 500).json({ error: err.response?.data || err.message }); }
});

app.get('/api/anime/:id', async (req,res)=>{
  try{
    const id = req.params.id;
    const fields = req.query.fields || 'id,title,main_picture,mean,genres,episodes,media_type,status,start_date,studios,synopsis,background';
    const data = await malRequest(`anime/${id}`, { fields });
    res.json(data);
  }catch(err){ res.status(err.response?.status || 500).json({ error: err.response?.data || err.message }); }
});

// Proxy any allowed MAL v2 path. Use carefully — restrict to safe prefixes.
const ALLOWED_PREFIXES = ['anime','users','producers','studios'];
app.get('/api/proxy', async (req,res)=>{
  try{
    const path = req.query.path;
    if(!path) return res.status(400).json({error:'missing path query param'});
    const prefix = path.split('/')[0];
    if(!ALLOWED_PREFIXES.includes(prefix)) return res.status(403).json({error:'path not allowed'});
    const query = { ...req.query };
    delete query.path;
    const data = await malRequest(path, query);
    res.json(data);
  }catch(err){ res.status(err.response?.status || 500).json({ error: err.response?.data || err.message }); }
});

// Health
app.get('/api/health', (req,res)=>res.json({ok:true}));

// --- Video metadata storage (admin) ---
async function readVideos(){
  if(useSupabase){
    const { data, error } = await supabase.from('videos').select('*');
    if(error){ console.error('Supabase read error', error); return []; }
    return data || [];
  }
  try{ return JSON.parse(fs.readFileSync(VIDEOS_FILE,'utf8')||'[]'); }catch(e){ return []; }
}

async function addVideo(item){
  if(useSupabase){
    const { data, error } = await supabase.from('videos').insert([item]).select();
    if(error){ throw error; }
    return data && data[0] ? data[0] : item;
  }
  const videos = JSON.parse(fs.readFileSync(VIDEOS_FILE,'utf8')||'[]');
  videos.push(item);
  fs.writeFileSync(VIDEOS_FILE, JSON.stringify(videos, null, 2));
  return item;
}

// Admin: upload video metadata
app.post('/api/admin/video', async (req,res)=>{
  try{
    const token = req.headers['x-admin-token'] || req.query.token;
    if(token !== ADMIN_TOKEN) return res.status(403).json({error:'unauthorized'});
    const body = req.body;
    if(!body || !body.title || !body.embed) return res.status(400).json({error:'missing fields (title, embed required)'});
    const id = body.animeId || (`local-${Date.now()}`);
    const ep = Number(body.episode) || 1;
    const item = { id: `${id}-${ep}-${Date.now()}`, animeId: id, episode: ep, title: body.title, embed: body.embed, download: body.download||'', quality: body.quality||'', uploadedAt: new Date().toISOString() };
    const saved = await addVideo(item);
    res.json({ok:true,item:saved});
  }catch(err){ console.error('admin upload error', err); res.status(500).json({error:err.message||err}); }
});

// List videos, support query by animeId
app.get('/api/videos', async (req,res)=>{
  try{
    const animeId = req.query.animeId;
    if(useSupabase){
      if(animeId){
        const { data, error } = await supabase.from('videos').select('*').eq('animeId', String(animeId)).order('episode', { ascending: true });
        if(error) return res.status(500).json({error});
        return res.json(data);
      }
      const { data, error } = await supabase.from('videos').select('*').order('uploadedAt', { ascending: false });
      if(error) return res.status(500).json({error});
      return res.json(data);
    }
    const videos = await readVideos();
    if(animeId) return res.json(videos.filter(v=>String(v.animeId)===String(animeId)));
    return res.json(videos);
  }catch(err){ res.status(500).json({error:err.message||err}); }
});

// Get episodes for an anime id (animeId param)
app.get('/api/videos/:animeId', async (req,res)=>{
  try{
    const animeId = req.params.animeId;
    if(useSupabase){
      const { data, error } = await supabase.from('videos').select('*').eq('animeId', String(animeId)).order('episode', { ascending: true });
      if(error) return res.status(500).json({error});
      return res.json(data);
    }
    const videos = (await readVideos()).filter(v=>String(v.animeId)===String(animeId));
    res.json(videos);
  }catch(err){ res.status(500).json({error:err.message||err}); }
});

const PORT = process.env.PORT || 5000;

if(require.main === module){
  app.listen(PORT, ()=>console.log(`MAL proxy listening on http://localhost:${PORT}`));
} else {
  // Export handler for serverless platforms (Vercel)
  module.exports = (req, res) => app(req, res);
}
