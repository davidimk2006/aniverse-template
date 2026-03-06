
async function loadAnime(){

const { data } = await db
.from("anime")
.select("*")
.order("created_at",{ascending:false})

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

loadAnime()
