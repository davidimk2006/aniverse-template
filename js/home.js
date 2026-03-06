
async function loadAnime() {

const { data, error } = await supabase
.from("anime")
.select("*")
.order("created_at", { ascending: false });

if(error){
console.log(error);
return;
}

const list = document.getElementById("anime-list");
list.innerHTML = "";

if(!data) return;

data.forEach(anime => {

list.innerHTML += `
<div class="anime-card">
<img src="${anime.image}">
<h3>${anime.title}</h3>
<p>${anime.episode}</p>
</div>
`;

});

}

loadAnime();
