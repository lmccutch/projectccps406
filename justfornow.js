import {RestaurantRequest, AttractionRequest, HotelRequest, GeoCodeRequest } from "./requester.mjs";

let userLocation;

/* Load map */
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
        var cityInfo = document.querySelector('[data-city-info]').value;
        var provinceInfo = document.querySelector('[data-province-info]').value;

        var address = `${streetInfo}, ${cityInfo}, ${provinceInfo},`;
        console.log(address);

        findLatLng(address, moveMap);

        //moveMap(userLocation['lat'], userLocation['lng']);
    });
}
initMap();


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
        this.restaurantDataLength = 0;
        this.attractionData = null;
        this.attractionDataLength = 0;
        this.hotelData = null;
        this.hotelDataLength = 0;
    }
    storeRestaurantList(resultList, resultListLength) {
        var [resultList, resultListLength] = this.removeUndefined(resultList, resultListLength);
        this.restaurantData = resultList;
        this.restaurantDataLength = resultListLength;
    }
    storeAttractionList(resultList, resultListLength) {
        var [resultList, resultListLength] = this.removeUndefined(resultList, resultListLength);
        this.attractionData = resultList;
        this.attractionDataLength = resultListLength;
    }
    storeHotelList(resultList, resultListLength) {
        var [resultList, resultListLength] = this.removeUndefined(resultList, resultListLength);
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
    removeUndefined(results, resultLength) {
        let validResults = [];
        let resultsUndefined = 0;
        let loopResultLength = resultLength;
        for (let i = 0; i < loopResultLength; i++) {
            if (results[i]['name'] == undefined) {
                /* reduce resultLength by 1 */
                resultLength--;
                resultsUndefined++;
            }
            else {
                validResults.push(results[i]);
            }
        }
        console.log(`Undefined results removed: ${resultsUndefined}`);
        console.log(validResults);
        /* return list of 2 variables, this must be deconstructed */
        return [validResults, resultLength]; 
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


    console.log('User Location', userLocation);    // Now we can just refer to the global variable: User Location, to getLat Lng for API request


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
        writeDataToPageInitialCallWrapper();
        console.log('write data to page function should have been called...');
    });
}

/* Store data functions */


function writeDataToPageInitialCallWrapper() {
    /* simple wrapper function to make the first call with the initial allResultSet data */
    writeDataToPage(
        allResultSet.getRestaurantList(),
        allResultSet.getRestaurantLength(),
        allResultSet.getAttractionList(),
        allResultSet.getAttractionLength(),
        allResultSet.getHotelList(),
        allResultSet.getHotelLength()
    );
}


/* Write Data to page */
function writeDataToPage(restaurantResults, 
    restaurantResultLength,
    attractionResults,
    attractionResultLength,
    hotelResults,
    hotelResultLength) {

    /* RESIZING ANNIMATION*/
    const outputDiv = document.querySelector("#output-section");
    var oldHeight = $(outputDiv).height();

    /* RESTAURANTS */
    for (let i=0; i < restaurantResultLength && i < 10; i++) {
        createDiv(restaurantResults, i, '#resultContainerRestuarants');
    }

    /* ATTRACTIONS */
    for (let i=0; i < attractionResultLength && i < 10; i++) {
        createDiv(attractionResults, i, '#resultContainerAttractions');
    }

    /* HOTELS */
    for (let i=0; i < hotelResultLength && i < 10; i++) {
        createDiv(hotelResults, i, '#resultContainerHotels');
    }

    /* RESIZING ANNIMATION COMPLETED */
    var newHeight = $(outputDiv).height();
    $(outputDiv).height(oldHeight);
    $(outputDiv).animate({height: newHeight});

    console.log('Write data function reached end...');
}


/* Creates the 3 Information Divs */
function createDiv(results, counter, container) {
    
    const resultContainer = document.querySelector(container);

    let nameDiv = new BuildNameDiv(results[counter]['name'], counter, resultContainer);
    let addressDiv = new BuildAddressDiv(results[counter]['address'], counter, nameDiv.newDiv);
    let distanceDiv = new BuildDistanceDiv(results[counter]['distance'], counter, nameDiv.newDiv);
    
}


/* Creates the Individual Divs */
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


/* Clear data from page / reset page */


/* Finds Latitude and Longitude based on Address */
function findLatLng(address, action) {

    var req = new GeoCodeRequest(address, function(results) {
        console.log(results['lat']);
        console.log(results['lng']);
        storeLatLng(results, action);
    });

}


/* Stores Lat and Lng */
function storeLatLng(latlng, action) {
    userLocation = latlng;
    console.log("storeLatLng has been Called...")
    console.log(userLocation);

    action(userLocation['lat'], userLocation['lng']);
} 