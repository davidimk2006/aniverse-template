
const params=new URLSearchParams(location.search)
const id=params.get("id")
const ep=parseInt(params.get("ep"))

async function loadEpisode(){

const { data } = await supabase
.from("episodes")
.select("*")
.eq("anime_id",id)
.eq("episode",ep)
.single()

document.getElementById("player").innerHTML=`
<iframe src="${data.stream_url}" width="100%" height="500" allowfullscreen></iframe>
`

document.getElementById("next").href=`watch.html?id=${id}&ep=${ep+1}`
document.getElementById("prev").href=`watch.html?id=${id}&ep=${ep-1}`

}

loadEpisode()
