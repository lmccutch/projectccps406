/* result set class to store search result data from all 3 endpoints until writing to page */
class ResultSet {
    constructor() {
        this.restaurantData = None;
        this.restaurantDataLength = 0;
        this.attractionData = None;
        this.attractionDataLength = 0;
        this.hotelData = None;
        this.hotelDataLength = 0;
    }
    storeRestaurantList(resultList, resultListLength) {
        this.restaurantData = resultList;
        this.restaurantDataLength = resultListLength;
    }
    storeAttractionList(resultList, resultListLength) {
        this.attractionData = resultList;
        this.restaurantDataLength = resultListLength;
    }
    storeHotelList(resultList, resultListLength) {
        this.hotelData = resultList;
        this.restaurantDataLength = resultListLength;
    }
    getRestaurantList() {
        return this.restaurantData
    }
    getAttractionList() {
        return this.attractionData
    }
    getHotelList() {
        return this.hotelData
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
    let input_latitude = document.getElementById('input_latitude').value;
    let input_longitude = document.getElementById('input_longitude').value;

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
    let input_latitude = document.getElementById('input_latitude').value;
    let input_longitude = document.getElementById('input_longitude').value;

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
    });
}

/* Store data functions */






/* Write Data to page */
function writeDataToPage() {
    /* placeholder for now, have it call data from allResultSet and maybe 3 separate functions that write each type of data to page */
}








/* Clear data from page / reset page */