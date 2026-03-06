
async function uploadAnime(){

const title=document.getElementById("title").value
const poster=document.getElementById("poster").value
const desc=document.getElementById("desc").value
const episode=document.getElementById("episode").value
const embed=document.getElementById("embed").value

const { data } = await supabase
.from("anime")
.insert({
title:title,
poster:poster,
description:desc
})
.select()
.single()

await supabase.from("episodes").insert({
anime_id:data.id,
episode:episode,
stream_url:embed
})

alert("Uploaded")

}
