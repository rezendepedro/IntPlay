var intervalo;

function scrollDireita(element){
  intervalo = setInterval(function(){ document.getElementById(element).scrollLeft += 1 }  , 5);
};
function scrollEsquerda(element){
  intervalo = setInterval(function(){ document.getElementById(element).scrollLeft -= 1 }  , 5);
};
function clearScroll(){
  clearInterval(intervalo);
};
