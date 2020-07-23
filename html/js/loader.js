var randomNumber = function(low, high) {
    return Math.floor( Math.random() * (1 + high - low) ) + low;
  };
  
  var cube = document.getElementById('cube');
  
  
  var showFace = function() {
    if(!cube){
        cube = document.getElementById('cube');
    }
    var face = randomNumber( 1, 20 );
  
    //if not already at this number
    if (cube.className !== 'show-' + face ) {
  
      cube.className = 'show-' + face;
  
    } else {
      //repeat number, try again
      return showFace();
    }
  
  };

  setInterval(function(){
        showFace();
  }, 1250);