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

        // that's a lotta nesting.
        for (const rarity of Object.values(breedDatabase["modern"])) {
            for (const breed of Object.keys(rarity)) {
                for (const chosenBreed of checkedBoxes) {
                    if (breed === chosenBreed) {
                        searchFragment += rarity[breed] + "%2C";
                    }
                }
            }
        }

        // trim off trailing "%2C"
        searchFragment = searchFragment.slice(0, -3);

        fragmentStorage.d_breed = searchFragment;
        console.log(searchFragment);


    } else if (activeTabName === "ancient") {

        const formContents = new FormData( document.getElementById("ancient-breed") );
        selectedBreed = formContents.get("breed");

        for (const breed of Object.keys(breedDatabase["ancient"])) {
            if (breed === selectedBreed) {
                fragmentStorage.d_breed = breedDatabase["ancient"][breed];
                break;
            }
        }
    }

    // TODO: refactor, augh
    const primRarityForm = document.getElementById("prim-rarity");
    const secRarityForm = document.getElementById("sec-rarity");
    const tertRarityForm = document.getElementById("tert-rarity");

    // reload all gene IDs when breed is changed
    refreshActiveGenes("primary", primRarityForm);
    refreshActiveGenes("secondary", secRarityForm);
    refreshActiveGenes("tertiary", tertRarityForm);
}


export function refreshActiveGenes(geneSlot, givenForm) {
    let searchFragment = "";

    const formContents = new FormData(givenForm);
    const checkedBoxes = formContents.getAll("rarity");

    for (let i = 0; i < checkedBoxes.length; i++) {

        if (checkedBoxes[i] == "basic") {
            searchFragment += "0%2C";
        }
        else {
            let currentRarity = geneDatabase[geneSlot][checkedBoxes[i]];
            
            for (const [gene, breeds] of Object.entries(currentRarity)) {
                
                // TODO: pls put comments on this wth
                // console.log(gene, breeds);
                for (const breed of Object.keys(breeds)) {

                    if (breed === selectedBreed) {
                        // console.log(breeds[breed]);
                        searchFragment += breeds[breed] + "%2C";
                    }

                }

            }
        }

    }

    searchFragment = searchFragment.slice(0, -3);

    // write assembled searchFragment to global variables
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

    refreshUtilities();
}


export function refreshUtilities() {

    const formContents = new FormData( document.getElementById("utilities") );

    const chosenGenders = formContents.getAll("gender");
    const gen1Choice = formContents.get("g1");
    const rtbChoice = formContents.get("breeding-status");

    if (chosenGenders.length === 1) {
        // if only one is chosen, sets gender id to 0 if male, or 1 if female
        chosenGenders[0] === "male" ? fragmentStorage.utils.d_gender = "0" : fragmentStorage.utils.d_gender = "1";
    } else {
        fragmentStorage.utils.d_gender = "";
    }

    // sets to g2+ only (0) if exclude g1s requested, clears if not
    gen1Choice === "exclude" ? fragmentStorage.utils.d_gen1 = "0" : fragmentStorage.utils.d_gen1 = "";

    // sets 1 if rtb requested, clears if not
    rtbChoice === "rtb" ? fragmentStorage.utils.d_rtb = "1" : fragmentStorage.utils.d_rtb = "";

    assembleSearchLink();
}


function assembleSearchLink() {
    
    const searchButton = document.getElementById("search-button");
    let searchString = ""

    for (const [key, value] of Object.entries(fragmentStorage)) {
        if (value !== "") {
            searchString += key + "=" + value + "&";
        }
    }
    // set link if any parameters are given; clear it if not
    if (searchString !== "") {

        for (const [key, value] of Object.entries(fragmentStorage.utils)) {
            if (value !== "") {
                searchString += key + "=" + value + "&";
            }
        }
        searchButton.classList.remove("disabled");
        searchButton.href = `https://www1.flightrising.com/auction-house/buy/realm/dragons?${searchString}collapse=1`;

    } else {
        searchButton.href = "";
        searchButton.classList.add("disabled");
    }
}