function navbuttonclick(){
    const buttonup = document.querySelector('.navigation-button-up');
    const buttonmid = document.querySelector('.navigation-button-mid');
    const buttondown = document.querySelector('.navigation-button-down');
    const draw = document.querySelector('.drawer');
    const drawa = document.querySelectorAll('.drawer-a');
    buttonup.classList.toggle('button-upa');
    buttonmid.classList.toggle('button-mida');
    buttondown.classList.toggle('button-downa');
    draw.classList.toggle('drawer-transition');
    for(let i=0;i<drawa.length;i++){
        drawa[i].classList.toggle('drawer-a-transition');
    }
    
}

const foot = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if(entry.isIntersecting){
            entry.target.classList.add("roundcorner");
        }
    })
},{
    threshold:0.25
})
foot.observe(document.querySelector(".footer"));




