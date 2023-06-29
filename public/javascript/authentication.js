document.querySelector("#password").addEventListener("keydown",(event) => {
    let pass=event.target.value;
    const btn = document.querySelector("#submitbutton");
    if(pass.length>=7)
    {
        btn.disabled=false;
    }
    else {
        btn.disabled=true;
    }
})
