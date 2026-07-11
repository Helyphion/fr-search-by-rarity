let geneDatabase;
let selectedBreed = "modern"; //TODO: implement properly lol
const searchButton = document.getElementById("testing");

let primSearchString = "";
let secSearchString = "";
let tertSearchString = "";


function refreshActiveGenes(geneSlot, givenForm) {
    let searchFragment = "";

    const formContents = new FormData(givenForm);
    const checkedBoxes = formContents.getAll("rarity");

    for (let i = 0; i < checkedBoxes.length; i++) {

        if (checkedBoxes[i] == "basic") {
            searchFragment += "0%2C"
        }
        else {
            let currentGenesList = geneDatabase[geneSlot][checkedBoxes[i]];
            for (const [gene, breeds] of Object.entries(currentGenesList)) {
                
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
    // for testing only:
    searchButton.textContent = searchFragment;

    // write assembled searchFragment to global variables
    switch (geneSlot) {
        case "primary":
            primSearchString = searchFragment;
            break;
        case "secondary":
            secSearchString = searchFragment;
            break;
        case "tertiary":
            tertSearchString = searchFragment;
            break;
    }

    // TODO: once implementing properly, make it so it only adds if not blank
    searchButton.textContent = "d_bodygene=" + primSearchString + "&"
                            + "d_winggene=" + secSearchString + "&"
                            + "d_tertgene=" + tertSearchString + "&";

}

async function getGeneIdsJson() {
    const response = await fetch("gene-rarities.json");
    return await response.json();
}


async function main() {

    geneDatabase = await getGeneIdsJson();

    const primRarityForm = document.getElementById("prim-rarity");
    primRarityForm.addEventListener("change", () => refreshActiveGenes("primary", primRarityForm))

    const secRarityForm = document.getElementById("sec-rarity");
    secRarityForm.addEventListener("change", () => refreshActiveGenes("secondary", secRarityForm))

    const tertRarityForm = document.getElementById("tert-rarity");
    tertRarityForm.addEventListener("change", () => refreshActiveGenes("tertiary", tertRarityForm))
    // arrow functions are necessary for parameters to work



    // this is just for debugging bc my setup is.. janky rn:
    // document.body.style.backgroundColor = "black";

}

main();


// example link:
// https://www1.flightrising.com/auction-house/buy/realm/dragons?d_gender=0&d_bodygene=110%2C10%2C213&d_winggene=0%2C213&d_tertgene=22&collapse=1
// "and" combinator for several selections seems to be %2C

// https://www1.flightrising.com/auction-house/buy/realm/dragons?{searchString}collapse=1

// remember that basic is id 0 lol