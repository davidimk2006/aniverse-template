
fetch("https://api.jikan.moe/v4/top/anime")
.then(res=>res.json())
.then(res=>{

const container=document.getElementById("popular")

res.data.slice(0,10).forEach(a=>{

container.innerHTML+=`
<div class="card">
<img src="${a.images.jpg.image_url}">
<h3>${a.title}</h3>
</div>
`

})

})
