
const params=new URLSearchParams(location.search)
const id=params.get("id")

async function loadAnime(){

const { data } = await supabase
.from("anime")
.select("*")
.eq("id",id)
.single()

document.getElementById("anime-detail").innerHTML=`
<img src="${data.poster}" class="poster">
<h1>${data.title}</h1>
<p>${data.description}</p>
`

const { data:eps } = await supabaseClient
.from("episodes")
.select("*")
.eq("anime_id",id)
.order("episode")

eps.forEach(e=>{
document.getElementById("episode-list").innerHTML+=`
<a href="watch.html?id=${id}&ep=${e.episode}">
Episode ${e.episode}
</a><br>
`
})

}

loadAnime()
