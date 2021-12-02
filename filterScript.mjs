/* 
Module to run filtering algorithms on the data. Will have a function that takes in all data, and all
filtering args pulled in from the page's user input. Will run the algos over the data, and then call
writeToPage (passed in from front-end module?) to write all the results back to the page.
*/

import { FilteredResults } from "./AppClasses.mjs";

export function runFiltering(args, data, writeFunc) {

    /* Make temporary data storage object for filtering results. */
    let filteredResultsStore = new FilteredResults();
    filteredResultsStore.storeRestaurantList(
        data["restaurantData"],
        data["restaurantLength"]
    );
    filteredResultsStore.storeAttractionList(
        data["attractionData"],
        data["attractionLength"]
    );
    filteredResultsStore.storeHotelList(
        data["hotelData"],
        data["hotelLength"]
    );
    
    /* Data for filter logging */
    let initialResultCount = filteredResultsStore.countOfAllResults()
    let ratedFlag = false;
    let reviewedFlag = false;
    let keywordFlag = false;
    let maxDistanceFlag = false;

    /* Check if 'rated' filter needs to be applied */
    if (args["checkbox_rated"] != false) {
        /* Filter for rated results */
        ratedFlag = true;
        let filtResults_rated = filterRated(
        filteredResultsStore.getRestaurantList(),
        filteredResultsStore.getRestaurantLength()
    );
    filteredResultsStore.storeRestaurantList(
        filtResults_rated["filteredData"],
        filtResults_rated["filteredLength"]
    );

    filtResults_rated = filterRated(
        filteredResultsStore.getAttractionList(),
        filteredResultsStore.getAttractionLength()
    );
    filteredResultsStore.storeAttractionList(
        filtResults_rated["filteredData"],
        filtResults_rated["filteredLength"]
    );

    filtResults_rated = filterRated(
        filteredResultsStore.getHotelList(),
        filteredResultsStore.getHotelLength()
    );
    filteredResultsStore.storeHotelList(
        filtResults_rated["filteredData"],
        filtResults_rated["filteredLength"]
    );
    }
    else {};
    
    /* Check if 'reviewed' filter needs to be applied */
    if (args["checkbox_reviewed"] != false) {
        /* Filter for rated results */
        reviewedFlag = true;
        let filtResults_reviewed = filterReviewed(
        filteredResultsStore.getRestaurantList(),
        filteredResultsStore.getRestaurantLength()
    );
    filteredResultsStore.storeRestaurantList(
        filtResults_reviewed["filteredData"],
        filtResults_reviewed["filteredLength"]
    );

    filtResults_reviewed = filterReviewed(
        filteredResultsStore.getAttractionList(),
        filteredResultsStore.getAttractionLength()
    );
    filteredResultsStore.storeAttractionList(
        filtResults_reviewed["filteredData"],
        filtResults_reviewed["filteredLength"]
    );

    filtResults_reviewed = filterReviewed(
        filteredResultsStore.getHotelList(),
        filteredResultsStore.getHotelLength()
    );
    filteredResultsStore.storeHotelList(
        filtResults_reviewed["filteredData"],
        filtResults_reviewed["filteredLength"]
    );
    }
    else {};

    /* Check if 'keyword' filter needs to be applied */
    if (args["inputField_keyword"] != "") {
        /* Filter for keyword results */
        keywordFlag = true;
        let filtResults_keyword = filterKeyword(
        filteredResultsStore.getRestaurantList(),
        filteredResultsStore.getRestaurantLength(),
        args["inputField_keyword"]
        );
        filteredResultsStore.storeRestaurantList(
        filtResults_keyword["filteredData"],
        filtResults_keyword["filteredLength"]
        );

        filtResults_keyword = filterKeyword(
        filteredResultsStore.getAttractionList(),
        filteredResultsStore.getAttractionLength(),
        args["inputField_keyword"]
        
        );
        filteredResultsStore.storeAttractionList(
        filtResults_keyword["filteredData"],
        filtResults_keyword["filteredLength"]
        );

        filtResults_keyword = filterKeyword(
        filteredResultsStore.getHotelList(),
        filteredResultsStore.getHotelLength(),
        args["inputField_keyword"]
        );
        filteredResultsStore.storeHotelList(
        filtResults_keyword["filteredData"],
        filtResults_keyword["filteredLength"]
        );
    }
    else {};

    /* Check if 'keyword' filter needs to be applied */
    if (args["inputField_maxDistance"] != "") {   // "" must be the default value set in the filter function from main script
        /* Filter for keyword results */
        maxDistanceFlag = true;
        let filtResults_distance = filterDistance(
        filteredResultsStore.getRestaurantList(),
        filteredResultsStore.getRestaurantLength(),
        args["inputField_maxDistance"]
        );
        console.log(filtResults_distance);
        filteredResultsStore.storeRestaurantList(
        filtResults_distance["filteredData"],
        filtResults_distance["filteredLength"]
        );

        filtResults_distance = filterDistance(
        filteredResultsStore.getAttractionList(),
        filteredResultsStore.getAttractionLength(),
        args["inputField_maxDistance"]
        );
        filteredResultsStore.storeAttractionList(
        filtResults_distance["filteredData"],
        filtResults_distance["filteredLength"]
        );

        filtResults_distance = filterDistance(
        filteredResultsStore.getHotelList(),
        filteredResultsStore.getHotelLength(),
        args["inputField_maxDistance"]
        );
        filteredResultsStore.storeHotelList(
        filtResults_distance["filteredData"],
        filtResults_distance["filteredLength"]
        );
    }
    else {};

    /* Log filter report */
    console.log(`~~~~~~~~~~~~~~~~~~~~ FILTER FUNCTION RAN ~~~~~~~~~~~~~~~~~~~~
        \tInitial Results: ${initialResultCount}
        \t\tFiltered on "rated":        ${ratedFlag}
        \t\tFiltered on "reviewed:      ${reviewedFlag}
        \t\tFiltered on "keyword":      ${keywordFlag}
        \t\tFiltered on "maxDistance":  ${maxDistanceFlag}
        \tFiltered Results: ${filteredResultsStore.countOfAllResults()}`)

    /* Write the filtered data to the page using passed-in func */
    writeFunc(
        filteredResultsStore.getRestaurantList(), 
        filteredResultsStore.getRestaurantLength(),
        filteredResultsStore.getAttractionList(),
        filteredResultsStore.getAttractionLength(),
        filteredResultsStore.getHotelList(),
        filteredResultsStore.getHotelLength()
    );
}


function filterRated(data, len) {
    let filteredData   = [];
    let filteredLength = len;
    for (let i = 0; i < len; i++) {
        if ("rating" in data[i]) {
            filteredData.push(data[i]);
        }
        else {
            filteredLength--;
        }
    }
    return {
        "filteredData":   filteredData,
        "filteredLength": filteredLength
    };
}

function filterOpen(data, len) {
    let filteredData   = [];
    let filteredLength = len;
    for (let i = 0; i < len; i++) {
        if ("open_now" in data[i]) {
            if (data[i]["open"] == "true") {
                filteredData.push(data[i]);
            }
            else {
                filteredLength--;
            }
        }
        else {
            filteredLength--;
        }
    }
    return {
        "filteredData":   filteredData,
        "filteredLength": filteredLength
    };
}

function filterReviewed(data, len) {
    let filteredData   = [];
    let filteredLength = len;
    for (let i = 0; i < len; i++) {
        if ("reviews" in data[i]) {
            if (data[i]["reviews"] != [null]) {
                filteredData.push(data[i]);
            }
            else {
                filteredLength--;
            }
        }
        else {
            filteredLength--;
        }
    }
    return {
        "filteredData":   filteredData,
        "filteredLength": filteredLength
    };
}

function filterKeyword(data, len, argVal) {
    argVal = argVal.toLowerCase();
    let filteredData   = [];
    let filteredLength = len;
    for (let i = 0; i < len; i++) {
        let dict = data[i];
        let dictKeys = pullStrings(Object.keys(dict));
        let dictValues = pullStrings(Object.values(dict));
        let dictValuesAllWords = allWords(dictValues).map(x => x.toLowerCase());
        if ((isIn(argVal, dictKeys) == true) || (isIn(argVal, dictValues) == true) || isIn(argVal, dictValuesAllWords)) {
            filteredData.push(data[i]);
        }
        else {
            filteredLength--;
        }
    }
    return {
        "filteredData":   filteredData,
        "filteredLength": filteredLength
    };
}

function filterDistance(data, len, argVal) {
    let filteredData   = [];
    let filteredLength = len;
    for (let i = 0; i < len; i++) {
        if ("distance" in data[i]) {
            if (parseFloat(data[i]["distance"]) <= parseFloat(argVal)) {
                
                filteredData.push(data[i]);
            }
            else {
                filteredLength--;
            }
        }
        else {
            filteredLength--;
        }
    }
    return {
        "filteredData":   filteredData,
        "filteredLength": filteredLength
    };
}

function isIn(word, list) {
    for (let i = 0; i < list.length; i++ ) {
        if (list[i] == word) {return true}
    }
    return false;
}

function isInSentence(word, sentence) {
    let list = sentence.split(' ');
    return isIn(word, list);
}

function allWords(sentences) {
    let allWords = []
    for (let i = 0; i < sentences.length; i ++ ) {
        let s = sentences[i];
        if ((typeof s) == 'string') {
            let splitSentence = s.split(' ');
        allWords = allWords.concat(splitSentence);
        }
        else {}
    }
    return allWords;
}

function pullStrings(listStrings) {
    let allStrings = []
    for (let i = 0; i < listStrings.length; i ++) {
        if (typeof listStrings[i] == 'string') {
            allStrings.push(listStrings[i].toLowerCase());
        }
    }
    return allStrings;
}
