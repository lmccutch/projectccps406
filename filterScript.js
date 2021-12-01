/* 
Module to run filtering algorithms on the data. Will have a function that takes in all data, and all
filtering args pulled in from the page's user input. Will run the algos over the data, and then call
writeToPage (passed in from front-end module?) to write all the results back to the page.
*/

"inputField_keyword":     getInput("input-filter-for", "Filter For", String, "words"),
        "inputField_maxDistance": getInput("input-max-distance", "Maximum Distance Away", Number, "number"),
        "inputField_numRooms":    getInput("input-num-rooms", "Number of Rooms", Number, "number"),
        "inputField_numNights":   getInput("input-num-nights", "Number of Nights", Number, "number"),
        "checkbox_weather":       checkbox_weather.value,
        "checkbox_distance":      checkbox_distance.value,
        "checkbox_rating":        checkbox_rating.value,
        "checkbox_open":          checkbox_open.value

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

    /* Check if 'rated' filter needs to be applied */
    if (args["inputField_rated"] != "") {
        /* Filter for rated results */
    let filtResults_rated = filterRated(
        filteredResultsStore.getRestaurantList(),
        filteredResultsStore.getRestaurantLength()
    );
    filteredResultsStore.storeRestaurantList(
        filtResults_rated["filteredData"],
        filtResults_rated["filteredLength"]
    );

    let filtResults_rated = filterRated(
        filteredResultsStore.getAttractionList(),
        filteredResultsStore.getAttractionLength()
    );
    filteredResultsStore.storeAttractionList(
        filtResults_rated["filteredData"],
        filtResults_rated["filteredLength"]
    );

    let filtResults_rated = filterRated(
        filteredResultsStore.getHotelList(),
        filteredResultsStore.getHotelLength()
    );
    filteredResultsStore.storeHotelList(
        filtResults_rated["filteredData"],
        filtResults_rated["filteredLength"]
    );
    }
    
    /* Check if 'reviewed' filter needs to be applied */
    if (args["inputField_reviewed"] != "") {
        /* Filter for rated results */
    let filtResults_reviewed = filterReviewed(
        filteredResultsStore.getRestaurantList(),
        filteredResultsStore.getRestaurantLength()
    );
    filteredResultsStore.storeRestaurantList(
        filtResults_reviewed["filteredData"],
        filtResults_reviewed["filteredLength"]
    );

    let filtResults_reviewed = filterReviewed(
        filteredResultsStore.getAttractionList(),
        filteredResultsStore.getAttractionLength()
    );
    filteredResultsStore.storeAttractionList(
        filtResults_reviewed["filteredData"],
        filtResults_reviewed["filteredLength"]
    );

    let filtResults_reviewed = filterReviewed(
        filteredResultsStore.getHotelList(),
        filteredResultsStore.getHotelLength()
    );
    filteredResultsStore.storeHotelList(
        filtResults_reviewed["filteredData"],
        filtResults_reviewed["filteredLength"]
    );
    }

    /* Check if 'keyword' filter needs to be applied */
    if (args["inputField_keyword"] != "") {
        /* Filter for keyword results */
    let filtResults_keyword = filterKeyword(
        filteredResultsStore.getRestaurantList(),
        filteredResultsStore.getRestaurantLength(),
        args["inputField_keyword"]
    );
    filteredResultsStore.storeRestaurantList(
        filtResults_keyword["filteredData"],
        filtResults_keyword["filteredLength"]
    );

    let filtResults_keyword = filterKeyword(
        filteredResultsStore.getAttractionList(),
        filteredResultsStore.getAttractionLength(),
        args["inputField_keyword"]
        
    );
    filteredResultsStore.storeAttractionList(
        filtResults_keyword["filteredData"],
        filtResults_keyword["filteredLength"]
    );

    let filtResults_keyword = filterKeyword(
        filteredResultsStore.getHotelList(),
        filteredResultsStore.getHotelLength(),
        args["inputField_keyword"]
    );
    filteredResultsStore.storeHotelList(
        filtResults_keyword["filteredData"],
        filtResults_keyword["filteredLength"]
    );
    }

    /* Check if 'keyword' filter needs to be applied */
    if (args["inputField_maxDistance"] != "") {
        /* Filter for keyword results */
    let filtResults_distance = filterDistance(
        filteredResultsStore.getRestaurantList(),
        filteredResultsStore.getRestaurantLength(),
        args["inputField_maxDistance"]
    );
    filteredResultsStore.storeRestaurantList(
        filtResults_distance["filteredData"],
        filtResults_distance["filteredLength"]
    );

    let filtResults_distance = filterDistance(
        filteredResultsStore.getAttractionList(),
        filteredResultsStore.getAttractionLength(),
        args["inputField_maxDistance"]
    );
    filteredResultsStore.storeAttractionList(
        filtResults_distance["filteredData"],
        filtResults_distance["filteredLength"]
    );

    let filtResults_distance = filterDistance(
        filteredResultsStore.getHotelList(),
        filteredResultsStore.getHotelLength(),
        args["inputField_maxDistance"]
    );
    filteredResultsStore.storeHotelList(
        filtResults_distance["filteredData"],
        filtResults_distance["filteredLength"]
    );
    }

    writeDataToPage(
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
            if (parseFloat(data[i]["distance"]) <= argVal) {
                filteredData.push(data[i]);
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
