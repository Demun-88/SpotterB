const tiles = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if(entry.isIntersecting){
            console.log(entry.target);
            entry.target.classList.add("slide-tiles");
        }
    })
},{
    threshold:0.20
})
const tilelist = document.querySelectorAll(".vid-tiles");
tilelist.forEach((tile) => {tiles.observe(tile)});