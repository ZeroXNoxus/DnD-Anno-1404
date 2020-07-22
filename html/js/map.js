$(document).ready(function(){
    var map = L.map('map', {
        crs: L.CRS.Simple
    });

    var bounds = [[0,0], [8192,6144]];
    var image = L.imageOverlay('img/World.jpg', bounds).addTo(map);

    map.fitBounds(bounds);
});