let geneDatabase;
let breedDatabase;
let selectedBreed = "modern";
const searchButton = document.getElementById("testing");

let searchString = "";
const fragmentStorage = {
    d_breed: "",
    d_bodygene: "",
    d_winggene: "",
    d_tertgene: ""
};


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

        const formContents = new FormData(givenForm);
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

        const formContents = new FormData(givenForm);
        selectedBreed = formContents.get("breed");
        console.log(selectedBreed)

        fragmentStorage.d_breed = "";
    }

    assembleSearchLink();
}

function refreshActiveGenes(geneSlot, givenForm) {
    let searchFragment = "";
    console.log(selectedBreed)

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

    assembleSearchLink();
}


function assembleSearchLink() {
    searchString = ""

    for (const [key, value] of Object.entries(fragmentStorage)) {
        if (value !== "") {
            console.log(key)
            searchString += key + "=" + value + "&"
        }
    }
    
    if (searchString !== "") {
        searchButton.textContent = `https://www1.flightrising.com/auction-house/buy/realm/dragons?${searchString}collapse=1`;
    }
}


async function main() {

    geneDatabase = await fetchJsonData("gene-rarities.json");
    breedDatabase = await fetchJsonData("breed-rarities.json");

    const primRarityForm = document.getElementById("prim-rarity");
    primRarityForm.addEventListener("change", () => refreshActiveGenes("primary", primRarityForm))

    const secRarityForm = document.getElementById("sec-rarity");
    secRarityForm.addEventListener("change", () => refreshActiveGenes("secondary", secRarityForm))

    const tertRarityForm = document.getElementById("tert-rarity");
    tertRarityForm.addEventListener("change", () => refreshActiveGenes("tertiary", tertRarityForm))
    // arrow functions are necessary for parameters to work


    const breedRarityForm = document.getElementById("breed-rarity");
    breedRarityForm.addEventListener("change", () => refreshActiveBreed(breedRarityForm))

    const ancientBreedForm = document.getElementById("ancient-breed");
    ancientBreedForm.addEventListener("change", () => refreshActiveBreed(ancientBreedForm))

    // TODO: need event listener for tabs being changed without new boxes being selected!!

    // this is just for debugging bc my setup is.. janky rn:
    // document.body.style.backgroundColor = "black";

}

main();


// example link:
// https://www1.flightrising.com/auction-house/buy/realm/dragons?d_gender=0&d_bodygene=110%2C10%2C213&d_winggene=0%2C213&d_tertgene=22&collapse=1
// "and" combinator for several selections seems to be %2C

// https://www1.flightrising.com/auction-house/buy/realm/dragons?{searchString}collapse=1

// remember that basic is id 0 lol