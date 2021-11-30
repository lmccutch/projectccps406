import {RestaurantRequest, AttractionRequest, HotelRequest, GeoCodeRequest } from "./requester.mjs";


/* Load map */
function initMap() {
    var position = { lat: 43.658298, lng: -79.380783 };
    window.map = new google.maps.Map(document.getElementById("map"), {
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

    });
}
initMap();


/* Ripple Effect and Hover Animation on buttons */
function animate(buttons) {
    $(buttons).append('<span></span>')

    $(buttons).click(function(e) {
        var top = $(window).scrollTop() - $(this).offset().top + e.clientY;
        var left = $(window).scrollLeft() - $(this).offset().left + e.clientX;

        $(this).children('span').css({"left": left, "top": top});

        $(this).children('span').addClass('active');
        setTimeout(function() {
            $('#search-button span').removeClass('active');
        },500)
    });

    $(buttons).hover(function() {
        $(this).css("background-color", "rgb(187, 59, 187)");
    }, function() {
        $(this).css("background-color", "rgb(255,255,255)");
    });

};
$(animate("#search-button"));
$(animate("#filter-button"));


/* search button event listener */
window.onload = function() {

    const searchButton = document.querySelector("#search-button");
    
    searchButton.addEventListener('click', () => {
        console.log('Search button clicked...');
        makeRequest();   //We need to use the page object to stop requests if there is already inputs
    });

    const resetButton = document.querySelector("#reset-button");
    
    resetButton.addEventListener('click', () => {
        console.log('Reset button clicked...');
        initMap();   //Resets Map
        removeResultDivs();   //Removes all results on screen

        $(page.resultSection).animate({height: '100px'});
    });
}


function removeResultDivs() {
    var elements = document.getElementsByClassName("resultDiv");
    while(elements.length > 0) {
        elements[0].parentNode.removeChild(elements[0]);
    }
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
    getAllResults() {
        let allResultsJSON = {
            "restaurantData":   this.getRestaurantList(),
            "restaurantLength": this.getRestaurantLength(),
            "attractionData":   this.getAttractionList(),
            "attractionLength": this.getAttractionLength(),
            "hotelData":        this.getHotelList(),
            "hotelLength":      this.getHotelLength()
        }
        return allResultsJSON;
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

/* Object to handle page state for result writing, etc */
class Page {
    constructor() {
        this.userLocation = null
        this.resultsOnPage = false;
        this.resultSection = document.querySelector("#output-section");
    }
    setResultsOnPage () {
        this.resultsOnPage = true;
    }
    resetResultsOnPage () {
        this.resultsOnPage = false;
    }
    isResultsOnPage() {
        if (this.resultsOnPage == true) {
            return true;
        }
        else {
            return false;
        }
    }
    setUserLocation (lati, long) {
        this.userLocation = {lat: lati, lng: long};
    }
    getUserLocation () {
        return this.userLocation;
    }
}

const page = new Page();

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
    if (elementValue == false) {
        alert(`Please only enter ${alertTypeRequest} into the ${alertFieldName} field.`);
    }
    else {
        return elementValue;
    }
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


    console.log('User Location = ', page.getUserLocation());    // Now we can just refer to the page Object via getUserLocation() to get LatLng for API request


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

    /* RESIZING ANNIMATION */
    var oldHeight = $(page.resultSection).height();

    /* RESTAURANTS */
    createHeaderDiv('Restaurants:', '#resultContainerRestuarants');
    for (let i=0; i < restaurantResultLength && i < 10; i++) {
        createDivSet(restaurantResults, i, '#resultContainerRestuarants', 'R');
    }

    /* ATTRACTIONS */
    createHeaderDiv('Attractions:', '#resultContainerAttractions');
    for (let i=0; i < attractionResultLength && i < 10; i++) {
        createDivSet(attractionResults, i, '#resultContainerAttractions', 'A');
    }

    /* HOTELS */
    createHeaderDiv('Hotels:', '#resultContainerHotels');
    for (let i=0; i < hotelResultLength && i < 10; i++) {
        createDivSet(hotelResults, i, '#resultContainerHotels', 'H');
    }

    /* RESIZING ANNIMATION COMPLETED */
    var newHeight = findLargestDiv() + 100;
    $(page.resultSection).height(oldHeight);
    $(page.resultSection).animate({height: newHeight});

    console.log('Write data function reached end...');
}

function findLargestDiv() {

    const restaurantContainer = document.querySelector('#resultContainerRestuarants');
    const attractionsContainer = document.querySelector('#resultContainerAttractions');
    const hotelContainer = document.querySelector('#resultContainerHotels');

    var heightRestaurant = $(restaurantContainer).height();
    var heightAttraction = $(attractionsContainer).height();
    var heightHotel = $(hotelContainer).height();

    if(heightRestaurant >= heightAttraction && heightRestaurant >= heightHotel) {
        return heightRestaurant;
    }
    else if(heightAttraction >= heightRestaurant && heightAttraction >= heightHotel) {
        return heightAttraction;
    }
    else {
        return heightHotel;
    }

}


/* Creates the 3 Information Divs */
function createDivSet(results, counter, container, type) {
    
    const resultContainer = document.querySelector(container);
    let lat = parseFloat(results[counter]['latitude']);
    let long = parseFloat(results[counter]['longitude'])

    let nameDiv = new BuildNameDiv(results[counter]['name'], counter, resultContainer, lat, long, type);
    let addressDiv = new BuildAddressDiv(results[counter]['address'], counter, nameDiv.newDiv, lat, long, type);
    let distanceDiv = new BuildDistanceDiv(results[counter]['distance'], counter, nameDiv.newDiv, lat, long, type);
    
}

function createHeaderDiv(headerName, container) {
    const resultContainer = document.querySelector(container);

    let headerDiv = document.createElement("div");
    headerDiv.classList.add("resultDiv");
    headerDiv.style.padding = "2.5px";
    headerDiv.innerHTML = String(headerName);
    resultContainer.appendChild(headerDiv);
}


/* Creates the Individual Divs */
class BuildDiv {
    constructor(info, number, parentDiv, latitude, longitude, type) {

        this.info = info;
        this.number = number;
        this.parentDiv = parentDiv;
        this.type = type;

        this.latitude = latitude;
        this.longitude = longitude;

        this.newDiv = document.createElement("div");
        this.newDiv.classList.add("resultDiv"); 
        this.newDiv.style.padding = "2.5px";
        this.newDiv.style.transition = ".075s ease";

        this.setInfo(info, number);

        this.appendDiv(parentDiv);
    }

    setInfo(info, number, results) {}

    smallFont() {
        this.newDiv.style.fontSize = "25px"
    }

    appendDiv(parentDiv) {
        parentDiv.appendChild(this.newDiv);
    }

    chooseIcon(type) {
        if(this.type == 'R') {
            return 'blue_MarkerR.png'
        }
        else if(this.type == 'A') {
            return 'darkgreen_MarkerA.png'
        }
        else {
            return 'purple_MarkerH.png'
        }
    }
}

class BuildNameDiv extends BuildDiv {

    setInfo(name, number) {
        this.newDiv.innerHTML = String((number+1) + ". " + name);

        if(number % 2 != 0) {
            this.newDiv.style.backgroundColor = "rgba(52, 151, 125, 0.7)";
        }

        $(this.newDiv).hover(function() {
            $(this).css("outline", "3px solid rgb(48, 129, 238)");
            $(this).css("cursor", "pointer");
        }, function() {
            $(this).css("outline", "0px");
        });

        this.newDiv.addEventListener('click', () => {
            console.log('CLICKED!!!!');
            console.log(this.latitude);
            console.log(this.longitude);
            new google.maps.Marker({
                position: {lat: this.latitude, lng: this.longitude},
                map: map,
                icon: this.chooseIcon()
            });
            map.panTo({lat: this.latitude, lng: this.longitude});
        });

    }
}

class BuildAddressDiv extends BuildDiv {

    setInfo(address, number) {
        this.smallFont();
        this.newDiv.innerHTML = String(address);
    }
}

class BuildDistanceDiv extends BuildDiv {
    
    setInfo(distance, number) {
        this.smallFont();
        this.newDiv.innerHTML = String("Distance from You: " + parseFloat(distance).toFixed(2) + "km");
    }
}

/* Filtering functionality */

/* Define filtering buttons/fields/checkboxes */
const filterButton = document.querySelector("#filter-button");
filterButton.addEventListener('click', () => {
    console.log('Filter button clicked...');
    filterResults();
});

const checkbox_weather   = document.querySelector(".weather");
const checkbox_distance  = document.querySelector(".distance");
const checkbox_rating    = document.querySelector(".cheapest"); /* change id name?? lol ok i get it ill name it properly >.> */
const checkbox_open      = document.querySelector(".open");

function pullFilterArgs () {
    /* pull all the current filtering values, and return them in json to be passed to filtering module */
    let getFilterArgs = {
        "inputField_keyword":     getInput("input-filter-for", "Filter For", String, "words"),
        "inputField_maxDistance": getInput("input-max-distance", "Maximum Distance Away", Number, "number"),
        "inputField_numRooms":    getInput("input-num-rooms", "Number of Rooms", Number, "number"),
        "inputField_numNights":   getInput("input-num-nights", "Number of Nights", Number, "number"),
        "checkbox_weather":       checkbox_weather.value,
        "checkbox_distance":      checkbox_distance.value,
        "checkbox_rating":        checkbox_rating.value,
        "checkbox_open":          checkbox_open.value
    }
}

function filterResults () {
    /* Pulls data from allResultSet object, if resultsOnPage flag=True then clears page, calls filtering algorithms,
       then calls writeToPage with the new data. */
    if (page.isResultsOnPage() == true) {
        clearResults();
    }
    /* Read in all of the filtering inputs from the page (max, min, checkbox bools) */
    let filterArgs = getFilterArgs();

    /* get results from allResultsSet */
    let allResultsJSON = allResultSet.getAllResults();
}

/* Clear data from page / reset page */
function clearResults() {
    /* clears all search results from page, and resets the "page" object that tracks if results are on the page to false once cleared. */
    let allResultDivs = document.querySelectorAll('#resultDiv');
    allResultDivs.forEach((oneResultDiv) => {
        oneResultDiv.remove();
    })
    page.resetResultsOnPage();
}

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
    page.setUserLocation(latlng['lat'], latlng['lng']);
    console.log("storeLatLng has been Called...");
    console.log(page.getUserLocation());

    action(latlng['lat'], latlng['lng']);
} 