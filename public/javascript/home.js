const options = {
    threshold: 0.20
}
const observer1 = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if(entry.isIntersecting){
            entry.target.classList.add("fade-in");
        }
    })
},options);
observer1.observe(document.querySelector(".slide-1"));


const observer2 = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if(entry.isIntersecting){
            entry.target.classList.add("fade-in");
        }
    })
},options);
observer2.observe(document.querySelector(".slide-2"));


const observer3 = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        const ball=document.querySelector(".slide-3-roller");
        if(entry.isIntersecting){
            ball.classList.add("roll");
        }
    })
},{
    threshold: 0.15
});
observer3.observe(document.querySelector(".slide-3"));

const observer4 = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if(entry.isIntersecting){
            entry.target.classList.add("fade-in");
        }
    })
},options);
observer4.observe(document.querySelector(".slide-4"));
