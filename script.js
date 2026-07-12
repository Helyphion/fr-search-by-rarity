let geneDatabase;
let breedDatabase;

let searchString = "";
const fragmentStorage = {
    d_breed: "",
    d_bodygene: "",
    d_winggene: "",
    d_tertgene: ""
};

let selectedBreed = "modern";
const searchButton = document.getElementById("testing"); // wip


const primRarityForm = document.getElementById("prim-rarity");
const secRarityForm = document.getElementById("sec-rarity");
const tertRarityForm = document.getElementById("tert-rarity");

const breedRarityForm = document.getElementById("breed-rarity");
const ancientBreedForm = document.getElementById("ancient-breed");



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

    // TODO: I.. forgot this needs arguments. hm
    // need to unify it.. somehow ?????
    refreshActiveGenes();
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

    primRarityForm.addEventListener("change", () => refreshActiveGenes("primary", primRarityForm))
    secRarityForm.addEventListener("change", () => refreshActiveGenes("secondary", secRarityForm))
    tertRarityForm.addEventListener("change", () => refreshActiveGenes("tertiary", tertRarityForm))
    // arrow functions are necessary for parameters to work

    breedRarityForm.addEventListener("change", () => refreshActiveBreed())
    ancientBreedForm.addEventListener("change", () => refreshActiveBreed())

    
    // TODO: need event listener for tabs being changed without new boxes being selected!!
    const tabButtons = document.getElementsByClassName("nav-link");
    tabButtons[0].addEventListener("change", () => refreshActiveBreed())
    tabButtons[1].addEventListener("change", () => refreshActiveBreed())

    console.log(tabButtons)

    // this is just for debugging bc my setup is.. janky rn:
    // document.body.style.backgroundColor = "black";

}

main();


// example link:
// https://www1.flightrising.com/auction-house/buy/realm/dragons?d_gender=0&d_bodygene=110%2C10%2C213&d_winggene=0%2C213&d_tertgene=22&collapse=1
// "and" combinator for several selections seems to be %2C

// https://www1.flightrising.com/auction-house/buy/realm/dragons?{searchString}collapse=1

// remember that basic is id 0 lol