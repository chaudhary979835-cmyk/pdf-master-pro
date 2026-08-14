const themeBtn=document.getElementById("theme-btn");

themeBtn.onclick=function(){

document.body.classList.toggle("dark");

if(document.body.classList.contains("dark")){

themeBtn.innerHTML='<i class="fa-solid fa-sun"></i>';

}else{

themeBtn.innerHTML='<i class="fa-solid fa-moon"></i>';

}

}