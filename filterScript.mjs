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
    console.log(`First restaurant data: ${filteredResultsStore.getRestaurantList()[0]["distance"]}`);
    console.log(`First hotel data: ${filteredResultsStore.getHotelList()}`);
    console.log(`Original Data from filter, restaurant length: ${filteredResultsStore.getRestaurantLength()}`)

    /* Check if 'rated' filter needs to be applied */
    if (args["checkbox_rated"] != false) {
        /* Filter for rated results */
        console.log("Rated Filter Ran");
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
        console.log("Reviewed Filter Ran");
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
        console.log("Keyword Filter Ran");
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
    if (args["inputField_maxDistance"] != "") {
        /* Filter for keyword results */
        console.log("maxDistance Filter Ran");
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

    console.log(`Filtered Data from filter, restaurant length: ${filteredResultsStore.getRestaurantLength()}`)


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
    let filteredData   = [];
    let filteredLength = len;
    for (let i = 0; i < len; i++) {
        let dict = data[i];
        let dictKeys = Object.keys(dict);
        let dictValues = Object.values(dict);
        let dictValuesAllWords = allWords(dictValues);
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
            console.log(`argVal: ${argVal}, result distance: ${data[i]["distance"]}`);
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
        let splitSentence = s.split(' ');
        allWords = allWords.concat(splitSentence);
    }
    return allWords;
}