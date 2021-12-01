/* result set class to store search result data from all 3 endpoints until writing to page */
export class ResultSet {
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

/* Subclass for data storing filtered data before returning to write to the page */
export class FilteredResults extends ResultSet {

    storeRestaurantList(resultList, resultListLength) {
        this.restaurantData = resultList;
        this.restaurantDataLength = resultListLength;
    }
    storeAttractionList(resultList, resultListLength) {
        this.restaurantData = resultList;
        this.restaurantDataLength = resultListLength;
    }
    storeHotelList(resultList, resultListLength) {
        this.restaurantData = resultList;
        this.restaurantDataLength = resultListLength;
    }
}

/* Object to handle page state for result writing, etc */
export class Page {
    constructor() {
        this.userLocation = null
        this.resultsOnPage = false;
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
    setUserLocation (lat, long) {
        this.userLocation = (lat, long);
    }
    getUserLocation () {
        return this.userLocation;
    }
}