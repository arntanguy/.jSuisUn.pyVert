var swapContext = function(gameClass, prevDiv, newGame, nextDiv) {
    gameClass.pause(); 
    document.getElementById(prevDiv).style.visibility = "hidden"; 
    document.getElementById(nextDiv).style.visibility =  "visible"; 
    newGame.start();
}
