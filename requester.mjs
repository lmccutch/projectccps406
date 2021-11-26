
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
                "x-rapidapi-key": "3ecb09acd1msh8dfa15a23d19668p1b9e18jsn63624e3a5c66"  //"1294628978msh4b6db514ef27f9dp1f545fjsn10a9af8ff144" Previous Key
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

export class RestaurantRequest extends RapidApiRequest {

    buildUrl (args) {
        /* builds the restaurant-format url */
        this.url = `${this.baseUrl}restaurants/list-by-latlng?latitude=${args.lat}&longitude=${args.long}&limit=${args.lim}&currency=${args.cur}&distance=${args.dist}&open_now=${args.opn}&lunit=${args.lunit}&lang=${args.lang}`;
        this.requestSettings['url'] = this.url;
        console.log(`Built restaurant URL: ${this.url}`);
    }
}

export class AttractionRequest extends RapidApiRequest {

    buildUrl (args) {
        /* builds the attraction-format url */
        this.url = `${this.baseUrl}attractions/list-by-latlng?longitude=${args.long}&latitude=${args.lat}&lunit=${args.lunit}&currency=${args.cur}&lang=${args.lang}`
        this.requestSettings['url'] = this.url;
        console.log(`Built attraction URL: ${this.url}`);
    }
}

export class HotelRequest extends RapidApiRequest {

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
        console.log(`Type of results object: ${typeof results}`);
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


export class GeoCodeRequest {
    constructor(address, action) {
        /* Partial settings object here, will need subclasses to build and add in the GET url... */
        this.baseUrl = 'https://maps.googleapis.com/maps/api/geocode/json?address=';
        this.apiKey = '+CA&key=AIzaSyCiBk5KKCy9blhUxRGXjGbrLE1Ug7UTg_s';
        this.address = address;

        this.requestSettings = {
            //url goes here
            "type": "GET",
            "success": function(data) {
                return data;
            },
            "error": function(error) {
                return error;
            }
        };

        this.buildUrl(this.address);
        this.makePromise(this.requestSettings);
        this.actOnPromise(action);
    }

    buildUrl (address) {
        /* builds the Geocoding request url */
        this.url = `${this.baseUrl}${address}${this.apiKey}`
        this.requestSettings['url'] = this.url;
        console.log(`Built Geo URL: ${this.url}`);
    }

    makePromise (requestSettings) {
        this.promise = jqXhrPromise(requestSettings);        /* Request happens here. */
    }
    
    actOnPromise (action) {
        this.promise.then(function (response) {
            console.log("this.promise.then called");
            this.data = response;
            responseHandlerLatLng(action, response);
        });
    }
}

function responseHandlerLatLng (action, response) {

    console.log(response);
    let results = response['results']['0']['geometry']['location'];

    action(results);

}

function findLatLng(address, action) {

    var req = new GeoCodeRequest(address, function(results) {
        console.log(results['lat']);
        console.log(results['lng']);
        action(results['lat'], results['lng']);
    });

}