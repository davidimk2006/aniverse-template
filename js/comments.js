
const params=new URLSearchParams(location.search)
const anime=params.get("id")

async function sendComment(){

const text=document.getElementById("comment").value

await supabase.from("comments").insert({
anime_id:anime,
text:text
})

loadComments()

}

async function loadComments(){

const { data } = await supabaseClient
.from("comments")
.select("*")
.eq("anime_id",anime)

const box=document.getElementById("comments")
box.innerHTML=""

data.forEach(c=>{
box.innerHTML+=`<p>${c.text}</p>`
})

}

loadComments()
