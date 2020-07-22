$(document).ready(function(){
    var map = L.map('map', {
        crs: L.CRS.Simple
    });
//Coordinates scheme is Y/X instead of X/Y
    var bounds = [[0,0], [900,1200]];
    var image = L.imageOverlay('img/World.jpg', bounds).addTo(map);

    map.fitBounds(bounds);
});