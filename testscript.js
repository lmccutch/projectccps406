var latlng = {lat: 7, lng: 7};
var myObj = [
	{"name":"Lets", "age":30},
	{"name":"See", "age":30},
	{"name":"If", "age":30},
	{"name":"This", "age":30},
	{"name":"Works", "age":30},
	{"name":"Fifth", "age":30},
	{"name":"Try", "age":30},
    {"name":"EVEN MORE", "age":30}
];

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


//Not in use anymore
/*
function displayResults(data) {
	// Add array elements in "data" to HTML. Parameter "n" is length of "data". 
	const container = document.querySelector('#resultContainer');
	for (let i=0; i < data.length && i <= 10; i++) {
		let tempDiv = document.createElement('div');
		tempDiv.className = "result";
		tempDiv.innerHTML = String(data[i]["name"]);
		// tempDiv.setAttribute() 
		container.appendChild(tempDiv);
	}
}
*/



window.onload = function() {

    const searchButton = document.querySelector("#search-button");
    
    searchButton.addEventListener('click', () => {
        console.log('Search button clicked...');
        restaurantSubmission();
    });
}

function restaurantSubmission () {
    /*let input_latitude = document.getElementById('input_latitude').value;
    let input_longitude = document.getElementById('input_longitude').value;*/
    let input_latitude = '37.733';
    let input_longitude = '-122.447';

    console.log('User input latitude: ', input_latitude);
    console.log('User input longitude: ', input_longitude);
    
    /* args for request objects, defaults for certain arguments are set here. */
    let restaurant_request_args = {
        "lat": input_latitude,
        "long": input_longitude,
        "dist": '30',
        "lim": '30',
        "cur": 'USD',
        "opn": 'false', 
        "lunit": 'km', 
        "lang": 'en_US'
    }
    var req = new RestaurantRequest(resultFunction, restaurant_request_args);
}


// When we add the other outputs, we need to call a single function to print them all
// Right now, it is resizing the output div based on the resultLength of only the restaurants
// We need to change it so that it compares the length of all results, then chooses the largest one to resize, or we can just hardcode the output size to always be at max
function resultFunction (results, resultLength) {
    console.log(results);
    const outputDiv = document.querySelector("#output-section");

    if(resultLength >= 10) {
        $(outputDiv).animate({height: "560"});
    } 
    else {
        const height = (resultLength * 45 + 90 + 20).toString();
        $(outputDiv).animate({height: height});
    }

    for (let i=0; i < resultLength && i < 10; i++) {
        createDiv(results, i);
    }
}

function createDiv(results, counter) {
    
    const resultContainer = document.querySelector('#resultContainer');

    let nameDiv = new BuildNameDiv(results[counter]['name'], counter, resultContainer);
    let addressDiv = new BuildAddressDiv(results[counter]['address'], counter, nameDiv.newDiv);
    let distanceDiv = new BuildDistanceDiv(results[counter]['distance'], counter, nameDiv.newDiv);
    
}

class BuildDiv {
    constructor(info, number, parentDiv) {
        this.info = info;
        this.number = number;
        this.parentDiv = parentDiv;

        this.newDiv = document.createElement("div");
        this.newDiv.class = "resultDiv";
        this.newDiv.style.padding = "2.5px";

        this.setInfo(info, number);

        this.appendDiv(parentDiv);
    }

    setInfo(info, number) {}

    setFont() {
        this.newDiv.style.fontSize = "25px"
    }

    appendDiv(parentDiv) {
        parentDiv.appendChild(this.newDiv);
    }
}

class BuildNameDiv extends BuildDiv {

    setInfo(name, number) {
        this.newDiv.innerHTML = String((number+1) + ". " + name);

        if(number % 2 != 0) {
            this.newDiv.style.backgroundColor = "rgba(52, 151, 125, 0.932)";
        }
    }
}

class BuildAddressDiv extends BuildDiv {

    setInfo(address, number) {
        this.setFont();
        this.newDiv.innerHTML = String(address);
    }
}

class BuildDistanceDiv extends BuildDiv {
    
    setInfo(distance, number) {
        this.setFont();
        this.newDiv.innerHTML = String("Distance from You: " + parseFloat(distance).toFixed(2) + "km");
    }
}

/* Request prototype object to inherit specific endpoint-based request objects to */
class RapidApiRequest {
    constructor(action, args) {
        this.baseUrl = 'https://travel-advisor.p.rapidapi.com/'
        this.args = args
        this.action = action

        /* Partial settings object here, will need subclasses to build and add in the GET url... */
        this.requestSettings = {
            "async": true,
            "crossDomain": true,
            "method": "GET",
            "headers": {
                "x-rapidapi-host": "travel-advisor.p.rapidapi.com",
                "x-rapidapi-key": "1294628978msh4b6db514ef27f9dp1f545fjsn10a9af8ff144"
            },
            "success": function(data) {
                return data;                
            },
            "error": function(error) {
                return error;
            }
        };

        this.buildUrl(args);
        this.makePromise(this.requestSettings);
        this.actOnPromise(action);
    }

    buildUrl(args) {} /* Empty function to be overwritten in subclasses but exists here to call first in constructor. */

    makePromise (requestSettings) {
        this.promise = jqXhrPromise(requestSettings);        /* Request happens here. */
    }
    
    actOnPromise (action) {
        this.promise.then(function (data) {
            console.log("this.promise.then called");
            this.data = data;
            responseHandler(action, data)
        });
    }
}

class RestaurantRequest extends RapidApiRequest {

    buildUrl (args) {
        /* builds the restaurant-format url */
        this.url = `${this.baseUrl}restaurants/list-by-latlng?latitude=${args.lat}&longitude=${args.long}&limit=${args.lim}&currency=${args.cur}&distance=${args.dist}&open_now=${args.opn}&lunit=${args.lunit}&lang=${args.lang}`;
        this.requestSettings['url'] = this.url;
        console.log(`Built restaurant URL: ${this.url}`);
    }
}

class AttractionRequest extends RapidApiRequest {

    buildUrl (args) {
        /* builds the attraction-format url */
        this.url = `${this.baseUrl}attractions/list-by-latlng?longitude=${args.long}&latitude=${args.lat}&lunit=${args.lunit}&currency=${args.cur}&lang=${args.lang}`
        this.requestSettings['url'] = this.url;
        console.log(`Built attraction URL: ${this.url}`);
    }
}

class HotelRequest extends RapidApiRequest {

    buildUrl (args) {
        /* builds the hotel-format url */
        this.url = `${this.baseUrl}hotels/list-by-latlng?latitude=${args.lat}&longitude=${args.long}&lang=e${args.lang}&hotel_class=${args.hotclass}&limit=${args.limit}&adults=${args.adults}&amenities=${args.amen}&rooms=${args.rooms}&child_rm_ages=${args.chldAge}&currency=${args.cur}&checkin=${args.checkin}&nights=${args.nights}`
        this.requestSettings['url'] = this.url;
        console.log(`Built hotel URL: ${this.url}`);
    }
}

function jqXhrPromise(settings) {
    return $.ajax(settings);    /* according to documentation, this returns a jqXHR object which implements the Javascript Promise interface */
}

function responseHandler (action, response) {
    /* Called by the anonymous AJAX function and handles all action on the API reponse.
       Instead of printing to the console here*/
    let results = response['data'];
    let resultLength = results.length;
    console.log(`resultLength is: ${resultLength}`);
    /* If response length is 0, no results. */
    if (resultLength == 0) {
        /* call the function to handle this "error". */
        noDataHandler();
        console.log(response);
    } else {
        /* Perform actions on the resulting data. */
        action(results, resultLength);
        dataHandler(results, resultLength);     /* Prints some data attributes in table format in console... */
    }
}

function dataHandler (results, resultLength) {
    for (let i = 0; i < resultLength; i++) {
        let result = results[i];
        console.log(ljust(result['name'], 60) + ljust(result['address'], 60)  + ljust(result['distance'], 15));
    }
}

function noDataHandler () {
    /* Take action when the response is OK but there are no data results. */
    console.log('GOOD RESPONSE BUT NO DATA!!')
}

function errorHandler () {
    /* Called by the ajax request if the response returned an error (error handling). */
    console.log('Error handling occurs...')
}

function ljust(str, n) {
    if (str == undefined) {return ''};
    if (str.length >= n) {return str} else {
        return str + ' '.repeat(n - str.length);
    }
}

