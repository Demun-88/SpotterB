const tiles = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if(entry.isIntersecting){
            entry.target.classList.add("slide-tiles");
        }
    })
},{
    threshold:0.10
})
const tilelist = document.querySelectorAll(".tiles");
tilelist.forEach((tile) => {tiles.observe(tile)});