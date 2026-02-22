/* Frontend JS: attempt to use MAL backend proxy, fallback to demo data */
const API_BASE = window.MAL_BACKEND || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5000');

const sampleLatest = [
  {id:1,title:'Sample Anime 1',img:'https://via.placeholder.com/300x420?text=Poster+1'},
  {id:2,title:'Sample Anime 2',img:'https://via.placeholder.com/300x420?text=Poster+2'},
  {id:3,title:'Sample Anime 3',img:'https://via.placeholder.com/300x420?text=Poster+3'}
];
const samplePopular = [
  {id:10,title:'Popular Anime A',img:'https://via.placeholder.com/300x420?text=Popular+A'},
  {id:11,title:'Popular Anime B',img:'https://via.placeholder.com/300x420?text=Popular+B'}
];

function renderCards(containerId, items){
  const el = document.getElementById(containerId);
  if(!el) return;
  el.innerHTML = items.map(i=>`<div class="card"><img src="${i.img}" alt="${i.title}"><h3>${i.title}</h3><div style="margin-top:8px"><button class="btn" onclick="goToDetail(${i.id})">Detail</button> <button class="btn" onclick="watch(${i.id})">Watch</button></div></div>`).join('');
}

function goToDetail(id){ location.href = `anime.html?id=${id}`; }
function watch(id){ location.href = `watch.html?id=${id}&ep=1`; }

document.getElementById('dark-toggle')?.addEventListener('click',()=>{ document.documentElement.classList.toggle('light'); });
document.getElementById('search')?.addEventListener('keydown',e=>{ if(e.key==='Enter'){ const q=e.target.value.trim(); if(q) location.href=`anime.html?q=${encodeURIComponent(q)}` } });

function getSeasonForDate(d=new Date()){ const m = d.getMonth()+1; const y = d.getFullYear(); if(m>=3 && m<=5) return {season:'spring',year:y}; if(m>=6 && m<=8) return {season:'summer',year:y}; if(m>=9 && m<=11) return {season:'fall',year:y}; return {season:'winter',year:y}; }

async function fetchLatest(){
  try{
    const s = getSeasonForDate();
    const path = `anime/season/${s.year}/${s.season}`;
    const fields = encodeURIComponent('id,title,main_picture,mean,genres,episodes,media_type,status,start_date,studios,synopsis');
    const url = `${API_BASE}/api/proxy?path=${encodeURIComponent(path)}&limit=12&fields=${fields}`;
    const r = await fetch(url);
    if(!r.ok) throw new Error('bad response');
    const data = await r.json();
    const items = (data.data || data.anime || []).map(x=>({ id: x.node?.id || x.id, title: x.node?.title || x.title, img: (x.node?.main_picture?.medium || x.main_picture?.medium || 'https://via.placeholder.com/300x420') }));
    renderCards('latest', items.length?items:sampleLatest);
  }catch(err){ console.warn('fetchLatest failed, using sample', err); renderCards('latest', sampleLatest); }
}

async function fetchPopular(){
  try{
    const fields = encodeURIComponent('id,title,main_picture,mean');
    const url = `${API_BASE}/api/proxy?path=${encodeURIComponent('anime/ranking')}&ranking_type=popularity&limit=12&fields=${fields}`;
    const r = await fetch(url);
    if(!r.ok) throw new Error('bad response');
    const data = await r.json();
    const items = (data.data || []).map(x=>({ id: x.node?.id || x.id, title: x.node?.title || x.title, img: (x.node?.main_picture?.medium || x.main_picture?.medium || 'https://via.placeholder.com/300x420') }));
    renderCards('popular', items.length?items:samplePopular);
  }catch(err){ console.warn('fetchPopular failed, using sample', err); renderCards('popular', samplePopular); }
}

// Search handler on anime.html will call /api/anime/search
async function doSearch(q){
  try{
    const url = `${API_BASE}/api/anime/search?q=${encodeURIComponent(q)}&limit=24`;
    const r = await fetch(url);
    if(!r.ok) throw new Error('search failed');
    return await r.json();
  }catch(err){ console.warn('search error', err); return null; }
}

// Initialize
fetchLatest();
fetchPopular();

// Expose helpers for other pages
window.MAL = { API_BASE, doSearch };
