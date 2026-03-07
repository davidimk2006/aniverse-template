
async function searchAnime(){

const q=document.getElementById("search").value

const { data } = await supabaseClient
.from("anime")
.select("*")
.ilike("title", `%${q}%`)

const container=document.getElementById("anime-list")
container.innerHTML=""

data.forEach(a=>{
container.innerHTML+=`
<a href="pages/anime.html?id=${a.id}">
<div class="card">
<img src="${a.poster}">
<h3>${a.title}</h3>
</div>
</a>
`
})

}
