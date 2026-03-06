
import { supabaseClient } from "./supabase.js"

async function loadAnime() {

  const { data, error } = await supabaseClient
    .from("anime")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error(error)
    return
  }

  const container = document.getElementById("anime-list")

  data.forEach(anime => {
    const div = document.createElement("div")
    div.innerHTML = `<h3>${anime.title}</h3>`
    container.appendChild(div)
  })

}

loadAnime()
