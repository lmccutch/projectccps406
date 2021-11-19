/* Load map */
/*
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
*/

/* hovering and button animation on click */
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

/* search button event listener */
window.onload = function() {

    const searchButton = document.querySelector("#search-button");
    
    searchButton.addEventListener('click', () => {
        console.log('Search button clicked...');
        makeRequest();
    });
}

/* result set class to store search result data from all 3 endpoints until writing to page */
class ResultSet {
    constructor() {
        this.restaurantData = null;
        this.restaurantDataLength = 10;
        this.attractionData = null;
        this.attractionDataLength = 0;
        this.hotelData = null;
        this.hotelDataLength = 0;
    }
    storeRestaurantList(resultList, resultListLength) {
        console.log('allResultSet store restaurant data...');
        console.log(`allResultSet incoming resultListLength at storing data point ${resultListLength}`);
        this.restaurantData = resultList;
        this.restaurantDataLength = resultListLength;
    }
    storeAttractionList(resultList, resultListLength) {
        this.attractionData = resultList;
        this.attractionDataLength = resultListLength;
    }
    storeHotelList(resultList, resultListLength) {
        this.hotelData = resultList;
        this.hotelDataLength = resultListLength;
    }
    getRestaurantList() {
        return this.restaurantData;
    }
    getRestaurantLength () {
        return this.restaurantDataLength;
    }
    getAttractionList() {
        return this.attractionData;
    }
    getAttractionLength() {
        return this.attractionDataLength;
    }
    getHotelList() {
        return this.hotelData;
    }
    getHotelLength() {
        return this.hotelDataLength;
    }
}

/* Create the all result data structure */
const allResultSet = new ResultSet();

/* Take input from page */

function convertToUniform(inputString, outputType) {
    /* Turn an input string into the outputType where possible, otherwise return false. Meant for
       input strings that are uniform in type, i.e. won't work with an address with words and numbers. */
    
    /* if input string is a word */
    if (isNaN(inputString) == true) {
        /* if outputType is string */
        if (outputType == 'string') {
            return inputType;
        }
        /* if outputType is a number */
        else {
            return false;
        }
    }
    /* if input string is a number */
    else {
        /* if outputType is a string */
        if (outputType == 'string') {
            return false;
        }
        /* if outputType is not a string */
        else {
            return Number(inputString);
        }
    }
}

function getInput(elementId, alertFieldName, desiredInputType, alertTypeRequest) {
    /* Get the value from a page element by element id, and ensure it is appropriate input type before accepting. */
    
    var elementString = document.getElementById(elementId).value;
    var elementValue = convertToUniform(elementString, desiredInputType);
    while (elementValue == false) {
        alert(`Please only enter ${alertTypeRequest} into the ${alertFieldName} field.`);
        elementString = document.getElementById(elementId).value;
        elementValue = convertToUniform(elementString, desiredInputType);
    };
    return elementValue;
}


/* Make request */
function makeRequest () {
    /* placeholder */
    console.log('Search button clicked... makeRequest called...')
    restaurantSubmission();
}

/* Submission functions */
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
    var req = new RestaurantRequest(restaurant_request_args, function(results, resultLength) {
        allResultSet.storeRestaurantList(results, resultLength);
        /* call the next request */
        attractionSubmission();
    });
}

function attractionSubmission () {
    let input_latitude = '37.733';
    let input_longitude = '-122.447';

    console.log('User input latitude: ', input_latitude);
    console.log('User input longitude: ', input_longitude);
    
    /* args for request objects, defaults for certain arguments are set here. */
    let attraction_request_args = {
        "lat": input_latitude,
        "long": input_longitude,
        "cur": 'USD',
        "lunit": 'km', 
        "lang": 'en_US'
    }
    var req = new AttractionRequest(attraction_request_args, function(results, resultLength) {
        allResultSet.storeAttractionList(results, resultLength);
        /* call the next request */
        hotelSubmission();
    });
}

function hotelSubmission () {
    let input_latitude = '37.733';
    let input_longitude = '-122.447';

    console.log('User input latitude: ', input_latitude);
    console.log('User input longitude: ', input_longitude);
    
    /* args for request objects, defaults for certain arguments are set here. */
    /* in these strings meant for URL insertion, comma "," is represented as "%2C" */
    let hotel_request_args = {
        "lat": input_latitude,
        "long": input_longitude,
        "adults": "2",              /* should be switched to an input */
        "rooms": "1",               /* should be switched to an input */
        "chldAge": "7%2C10",          /* should be switched to an input */
        "amen": "beach%2Cbar_lounge%2Cairport_transportation",   /* should be switched to an input */
        "checkin": "2021-12-12",    /* should be switched to an input */
        "nights": "2",              /* should be switched to an input */
        "cur": 'USD',
        "lunit": 'km', 
        "lang": 'en_US',
        "hotclass": "1%2C2%2C3",
        "limit": "30",
        "dist": "30"
    }
    var req = new HotelRequest(hotel_request_args, function (results, resultLength) {
        allResultSet.storeHotelList(results, resultLength);
        /* final step of writing data... */
        writeDataToPage();
        console.log('write data to page function should have been called...');
    });
}

/* Store data functions */






/* Write Data to page */
function writeDataToPage() {
    /* placeholder for now, have it call data from allResultSet and maybe 3 separate functions that write each type of data to page */
    const resultContainer = document.querySelector('#resultContainer');
    
    const outputDiv = document.querySelector("#output-section");
    $(outputDiv).animate({height: "560"});


    /* RESTAURANTS */
    let restaurantResultLength = allResultSet.getRestaurantLength();
    console.log(`Restaurant Result Length from allResultSet: ${restaurantResultLength}`);
    let restaurantResults = allResultSet.getRestaurantList();
    console.log(restaurantResults);
    for (let i=0; i < restaurantResultLength; i++) {
        let tempDiv = document.createElement('div');
        tempDiv.classname = 'resultDiv';
        tempDiv.innerHTML = String(restaurantResults[i]['name']);
        resultContainer.appendChild(tempDiv);
    }


    /* 1 get data from restaurants */

    /* 2 turn data into divs */

    /* 3 add those divs to restaurant result container */
    

    /* ATTRACTIONS */
    let attractionResultLength = allResultSet.getAttractionLength();
    let attractionResults = allResultSet.getAttractionList();
    for (let i=0; i < attractionResultLength; i++) {
        let tempDiv = document.createElement('div');
        tempDiv.classname = 'resultDiv';
        tempDiv.innerHTML = String(attractionResults[i]['name']);
        resultContainer.appendChild(tempDiv);
    }


    /* HOTELS */
    let hotelResultLength = allResultSet.getHotelLength();
    let hotelResults = allResultSet.getHotelLength();
    for (let i=0; i < hotelResultLength; i++) {
        let tempDiv = document.createElement('div');
        tempDiv.classname = 'resultDiv';
        tempDiv.innerHTML = String(hotelResults[i]['name']);
        resultContainer.appendChild(tempDiv);
    }

    console.log('Write data function reached end...');
}








/* Clear data from page / reset page */



/* requester module pasted in */
/* Request prototype object to inherit specific endpoint-based request objects to */
class RapidApiRequest {
    constructor(args, action) {
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
        action(results, resultLength);
        noDataHandler();
    } else {
        /* Perform actions on the resulting data. */
        action(results, resultLength);
    }
}

function dataHandler (results, resultLength) {
    for (let i = 0; i < resultLength; i++) {
        let result = results[i];
        console.log(ljust(result['name'], 60) + ljust(result['address'], 60)  + ljust(result['distance'], 15));
        console.log(results);
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