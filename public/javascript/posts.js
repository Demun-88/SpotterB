const buttons = document.getElementsByClassName("post-b");
for(let i=0;i<buttons.length;i++){
    buttons[i].addEventListener("click",function(){
        if(buttons[i].innerHTML==="Read more"){
            buttons[i].innerHTML="Read Less";
        }
        else {
            buttons[i].innerHTML="Read more";
        }
        buttons[i].parentElement.classList.toggle("post-expand");
        let x=buttons[i].previousElementSibling;
        x.classList.toggle("inners-expand");
        if(x.style.overflowY=="hidden"){
            x.style.overflowY="auto";
        }
        else if(x.style.overflowY==""){
            x.style.overflowY="auto";
        }
        else{
            x.style.overflowY="hidden";
        }
        x.previousElementSibling.classList.toggle("inners-expand");
    })
}