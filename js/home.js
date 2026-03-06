
import { supabaseClient } from "./supabase.js"

async function loadAnime(){

const { data, error } = await supabaseClient
.from("anime")
.select("*")
.order("created_at", { ascending:false })

if(error){
console.log(error)
return
}

const container = document.getElementById("anime-list")
container.innerHTML=""

data.forEach(anime=>{
container.innerHTML += `
<div class="anime-card">
<img src="${anime.thumbnail}">
<h3>${anime.title}</h3>
</div>
`
})

}

loadAnime()
