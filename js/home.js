
import { supabaseClient } from "./supabase.js"

async function loadAnime() {
  const { data, error } = await supabaseClient
    .from("anime")
    .select("*")

  console.log(data)
}

loadAnime()
