var latlng = {lat: 7, lng: 7};

function initMap() {
    var position = { lat: 43.658298, lng: -79.380783 };
    var map = new google.maps.Map(document.getElementById("map"), {
        zoom: 16,
        center: position
    });
    var marker = new google.maps.Marker({
        position: position,
        map: map
    });

    function moveMap(lat, long) {
        var newPosition =  {lat: lat, lng: long};
        map.panTo(newPosition);
        marker.setPosition(newPosition);
    }

    const goButton = document.querySelector('[data-go]');

    goButton.addEventListener('click', () => {
        var streetInfo = document.querySelector('[data-street-info]').value;
        const pos = streetInfo.split(",");
        moveMap(parseFloat(pos[0]),parseFloat(pos[1]));
    }); 
}

/*
function findLatLng() {
    var testLocation = '350 Victoria St, Toronto';

    axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: {
            address: testLocation,
            key: 'AIzaSyCiBk5KKCy9blhUxRGXjGbrLE1Ug7UTg_s',
        }
    })
    .then(function(response) {
        console.log(response.data.results[0].geometry.location);
        latlng = response.data.results[0].geometry.location;
    })
    .catch(function(error) {
        console.log(error);
    });
}

latlng = findLatLng();

console.log(latlng);
*/

$(function() {

    console.log($("#search-button").css("position"));
    
});

$(function() {
    $("#search-button").append('<span></span>')

    $("#search-button").click(function(e) {
        var top = $(window).scrollTop() - $(this).offset().top + e.clientY;
        var left = $(window).scrollLeft() - $(this).offset().left + e.clientX;

        $(this).children('span').css({"left": left, "top": top});

        $(this).children('span').addClass('active');
        setTimeout(function() {
            $('#search-button span').removeClass('active');
        },500)
    });

    $("#search-button").hover(function() {
        $(this).css("background-color", "rgb(187, 59, 187)");
    }, function() {
        $(this).css("background-color", "rgb(255,255,255)");
    });

});