import { geneDatabase, breedDatabase } from "./main.js";


const fragmentStorage = {
    d_breed: "",
    d_bodygene: "",
    d_winggene: "",
    d_tertgene: "",

    utils: {
        d_gender: "",
        d_rtb: "",
        d_gen1: ""
    }
};


let selectedBreed = "modern";

export function refreshActiveBreed() {
    let searchFragment = "";

    const activeTab = document.querySelector(".nav-pills .nav-link.active");
    const activeTabName = activeTab.textContent.toLowerCase();

    if (activeTabName === "modern") {
        selectedBreed = "modern";

        const formContents = new FormData( document.getElementById("breed-rarity") );
        const checkedBoxes = formContents.getAll("breed");
        // formContents.getAll() notably only returns *checked* boxes, not all inputs with the name "breed"

        // iterate over modern subtree of breed database
        for (const rarity of Object.values(breedDatabase["modern"])) {
            for (const breed of Object.keys(rarity)) {
                // iterate over list of checked breeds to compare to each entry of the breed database
                // and add to search if they're the same
                for (const chosenBreed of checkedBoxes) {
                    if (breed === chosenBreed) {
                        searchFragment += rarity[breed] + "%2C";
                    }
                }
            }
        }
        // that's a lotta nesting.


        // trim off the trailing "%2C"
        searchFragment = searchFragment.slice(0, -3);

        fragmentStorage.d_breed = searchFragment;
        console.log(searchFragment);


    } else if (activeTabName === "ancient") {

        const formContents = new FormData( document.getElementById("ancient-breed") );
        selectedBreed = formContents.get("breed");

        // scan ancient subtree of breed database for the selected breed
        // (more straightforward bc no rarities + no multiselect)
        for (const breed of Object.keys(breedDatabase["ancient"])) {
            if (breed === selectedBreed) {
                fragmentStorage.d_breed = breedDatabase["ancient"][breed];
                break;
            }
        }

        // TODO: refactor, augh
        const primRarityForm = document.getElementById("prim-rarity");
        const secRarityForm = document.getElementById("sec-rarity");
        const tertRarityForm = document.getElementById("tert-rarity");

        // reload all gene IDs whenever a different ancient breed is selected
        refreshActiveGenes("primary", primRarityForm);
        refreshActiveGenes("secondary", secRarityForm);
        refreshActiveGenes("tertiary", tertRarityForm);
    }
}


export function refreshActiveGenes(geneSlot, givenForm) {
    let searchFragment = "";

    const formContents = new FormData(givenForm);
    const checkedBoxes = formContents.getAll("rarity");
    // formContents.getAll() notably only returns *checked* boxes, not all possible inputs

    // go through all selected boxes
    for (let i = 0; i < checkedBoxes.length; i++) {
        let currentRarity = checkedBoxes[i];
        // Basic gene is always ID 0
        // (and is not in the gene database, so needs to be added to search separately)
        if (currentRarity == "basic") {
            searchFragment += "0%2C";
        }
        else {
            // for each gene in the selected rarity, get list of breeds that have it
            for (const [gene, breedsList] of Object.entries( geneDatabase[geneSlot][currentRarity] )) {
                for (const breed of Object.keys(breedsList)) {
                    // adds the breed-specific ID of a gene, if it has an entry for the currently selected breed
                    if (breed === selectedBreed) {
                        searchFragment += breedsList[breed] + "%2C";
                        // "%2C" is how gene IDs are chained in Flight Rising's search links
                    }
                }
            }
        }

    }

    // trim off the trailing "%2C"
    searchFragment = searchFragment.slice(0, -3);

    // save assembled searchFragment to global storage variables
    switch (geneSlot) {
        case "primary":
            fragmentStorage.d_bodygene = searchFragment;
            break;
        case "secondary":
            fragmentStorage.d_winggene = searchFragment;
            break;
        case "tertiary":
            fragmentStorage.d_tertgene = searchFragment;
            break;
    }

    // refreshing the utils every time is not strictly necessary, 
    // but this way I make sure they're always refreshed when they should be
    refreshUtilities();
}


export function refreshUtilities() {

    const formContents = new FormData( document.getElementById("utilities") );

    const chosenGenders = formContents.getAll("gender");
    const gen1Choice = formContents.get("g1");
    const rtbChoice = formContents.get("breeding-status");

    // if only one is chosen, sets gender id to 0 if male, or 1 if female
    if (chosenGenders.length === 1) {
        chosenGenders[0] === "male" ? fragmentStorage.utils.d_gender = "0" : fragmentStorage.utils.d_gender = "1";
    } else {
        // clears filter if both are selected (functionally equivalent to adding both)
        fragmentStorage.utils.d_gender = "";
    }

    // sets to g2+ only (0) if exclude g1s requested, clears if not
    gen1Choice === "exclude" ? fragmentStorage.utils.d_gen1 = "0" : fragmentStorage.utils.d_gen1 = "";

    rtbChoice === "rtb" ? fragmentStorage.utils.d_rtb = "1" : fragmentStorage.utils.d_rtb = "";

    assembleSearchLink();
}


function assembleSearchLink() {
    
    const searchButton = document.getElementById("search-button");
    let searchString = ""

    for (const [key, value] of Object.entries(fragmentStorage)) {
        // only add fragments whose value has been edited, and skip over "utils" sub-Map
        if (value !== "" && key !== "utils") {
            searchString += key + "=" + value + "&";
        }
    }

    if (searchString !== "") {
        // put together link if any parameters are given
        for (const [key, value] of Object.entries(fragmentStorage.utils)) {
            if (value !== "") {
                searchString += key + "=" + value + "&";
            }
        }
        searchButton.classList.remove("disabled");
        searchButton.href = `https://www1.flightrising.com/auction-house/buy/realm/dragons?${searchString}collapse=1`;

    } else {
        // clear link & disable button if no parameters are selected
        searchButton.href = "";
        searchButton.classList.add("disabled");
    }

}