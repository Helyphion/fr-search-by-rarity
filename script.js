let geneDatabase;
let breedDatabase;

let searchString = "";
const fragmentStorage = {
    d_breed: "",
    d_bodygene: "",
    d_winggene: "",
    d_tertgene: ""
};

const utilFragmentStorage = {
    d_gender: "",
    d_rtb: "",
    d_gen1: ""
};

let selectedBreed = "modern";
const searchButton = document.getElementById("search-button");

const primRarityForm = document.getElementById("prim-rarity");
const secRarityForm = document.getElementById("sec-rarity");
const tertRarityForm = document.getElementById("tert-rarity");

const breedRarityForm = document.getElementById("breed-rarity");
const ancientBreedForm = document.getElementById("ancient-breed");

const utilityForm = document.getElementById("utilities");



async function fetchJsonData(file) {
    const response = await fetch(file);
    return await response.json();
}


function refreshActiveBreed(givenForm) {
    let searchFragment = "";

    const activeTab = document.querySelector(".nav-pills .nav-link.active");
    const activeTabName = activeTab.textContent.toLowerCase();

    if (activeTabName === "modern") {
        selectedBreed = "modern";

        const formContents = new FormData(breedRarityForm);
        const checkedBoxes = formContents.getAll("rarity");

        for (let i = 0; i < checkedBoxes.length; i++) {

            let currentRarity = breedDatabase["modern"][checkedBoxes[i]]

            for (const breed of Object.keys(currentRarity)) {
                searchFragment += currentRarity[breed] + "%2C";
            }

        }

        searchFragment = searchFragment.slice(0, -3);
        fragmentStorage.d_breed = searchFragment;


    } else if (activeTabName === "ancient") {

        const formContents = new FormData(ancientBreedForm);
        selectedBreed = formContents.get("breed");
        console.log(selectedBreed)

        fragmentStorage.d_breed = "";
    }

    // reload all gene IDs when breed is changed
    refreshActiveGenes("primary", primRarityForm);
    refreshActiveGenes("secondary", secRarityForm);
    refreshActiveGenes("tertiary", tertRarityForm);
}


function refreshActiveGenes(geneSlot, givenForm) {
    let searchFragment = "";

    const formContents = new FormData(givenForm);
    const checkedBoxes = formContents.getAll("rarity");

    for (let i = 0; i < checkedBoxes.length; i++) {

        if (checkedBoxes[i] == "basic") {
            searchFragment += "0%2C"
        }
        else {
            let currentRarity = geneDatabase[geneSlot][checkedBoxes[i]];
            for (const [gene, breeds] of Object.entries(currentRarity)) {
                
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
    console.log(searchFragment);

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


function refreshUtilities() {

    const formContents = new FormData(utilityForm);

    const chosenGenders = formContents.getAll("gender");
    const gen1Choice = formContents.get("g1");
    const rtbChoice = formContents.get("breeding-status");

    if (chosenGenders.length === 1) {
        // if only one is chosen, sets gender id to 0 if male, or 1 if female
        chosenGenders[0] === "male" ? utilFragmentStorage.d_gender = "0" : utilFragmentStorage.d_gender = "1";
    } else {
        utilFragmentStorage.d_gender = "";
    }

    // sets to g2+ only if exclude g1s requested, clears if not
    gen1Choice === "exclude" ? utilFragmentStorage.d_gen1 = "0" : utilFragmentStorage.d_gen1 = "";
    console.log(utilFragmentStorage.d_gen1)

    // sets 1 if rtb requested, clears if not
    rtbChoice === "rtb" ? utilFragmentStorage.d_rtb = "1" : utilFragmentStorage.d_rtb = "";

    assembleSearchLink()
}


function assembleSearchLink() {
    searchString = ""

    for (const [key, value] of Object.entries(fragmentStorage)) {
        if (value !== "") {
            console.log(key)
            searchString += key + "=" + value + "&"
        }
    }
    // set link if any parameters are given; clear it if not
    if (searchString !== "") {

        for (const [key, value] of Object.entries(utilFragmentStorage)) {
            if (value !== "") {
                console.log(key)
                searchString += key + "=" + value + "&"
            }
        }
        searchButton.classList.remove("disabled");
        searchButton.href = `https://www1.flightrising.com/auction-house/buy/realm/dragons?${searchString}collapse=1`;

    } else {
        searchButton.href = "";
        searchButton.classList.add("disabled");
    }
}

function clearAllBoxes(givenId) {
    const form = document.getElementById(givenId);
    const allBoxes = form.querySelectorAll("input");

    for (const box of allBoxes) {
        box.checked = false;
    }

    refreshActiveBreed()
}


async function main() {

    geneDatabase = await fetchJsonData("gene-rarities.json");
    breedDatabase = await fetchJsonData("breed-rarities.json");

    primRarityForm.addEventListener("change", () => refreshActiveGenes("primary", primRarityForm));
    secRarityForm.addEventListener("change", () => refreshActiveGenes("secondary", secRarityForm));
    tertRarityForm.addEventListener("change", () => refreshActiveGenes("tertiary", tertRarityForm));
    // arrow functions are necessary for parameters to work

    breedRarityForm.addEventListener("change", () => refreshActiveBreed());
    ancientBreedForm.addEventListener("change", () => refreshActiveBreed());

    utilityForm.addEventListener("change", () => refreshUtilities());


    const tabButtons = document.getElementsByClassName("nav-link");
    tabButtons[0].addEventListener("shown.bs.tab", () => refreshActiveBreed());
    tabButtons[1].addEventListener("shown.bs.tab", () => refreshActiveBreed());


    const clearBreedButton = document.getElementById("clear-breed");
    const clearPrimButton = document.getElementById("clear-prim");
    const clearSecButton = document.getElementById("clear-sec");
    const clearTertButton = document.getElementById("clear-tert");
    // separate Event triggers for clearing modern & ancient breeds bc it's the simplest way rn
    clearBreedButton.addEventListener("click", () => clearAllBoxes("breed-rarity"));
    clearBreedButton.addEventListener("click", () => clearAllBoxes("ancient-breed"));
    clearPrimButton.addEventListener("click", () => clearAllBoxes("prim-rarity"));
    clearSecButton.addEventListener("click", () => clearAllBoxes("sec-rarity"));
    clearTertButton.addEventListener("click", () => clearAllBoxes("tert-rarity"));


    // Bootstrap code for initialising tooltips
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))

}

main();


// example link:
// https://www1.flightrising.com/auction-house/buy/realm/dragons?d_gender=0&d_bodygene=110%2C10%2C213&d_winggene=0%2C213&d_tertgene=22&collapse=1
// "and" combinator for several selections seems to be %2C

// https://www1.flightrising.com/auction-house/buy/realm/dragons?{searchString}collapse=1
