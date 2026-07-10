let geneDatabase;
let selectedBreed = "modern"; //TODO: implement properly lol


function refreshActiveGenes(geneSlot, givenForm) {
    let searchString = "";

    const formContents = new FormData(givenForm);
    const checkedBoxes = formContents.getAll("rarity");

    for (let i = 0; i < checkedBoxes.length; i++) {

        let currentGenesList = geneDatabase[geneSlot][checkedBoxes[i]];
        for (const [gene, breeds] of Object.entries(currentGenesList)) {
            
            // console.log(gene, breeds);
            for (const breed of Object.keys(breeds)) {

                if (breed === selectedBreed) {
                    // console.log(breeds[breed]);
                    searchString += breeds[breed] + "%2C";
                } 

            }
        }
    }

    searchString = searchString.slice(0, -3);
    console.log(searchString);
    return searchString;
    // TODO: do something with searchString
}

async function getGeneIdsJson() {
    const response = await fetch("gene-rarities.json");
    return await response.json();
}


async function main() {

    geneDatabase = await getGeneIdsJson();

    const primRarityForm = document.getElementById("prim-rarity");
    primRarityForm.addEventListener("change", () => refreshActiveGenes("primary", primRarityForm))

    // arrow functions are necessary for parameters to work



    // this is just for debugging bc my setup is.. janky rn:
    document.body.style.backgroundColor = "black";

}

main();


// example link:
// https://www1.flightrising.com/auction-house/buy/realm/dragons?d_gender=0&d_bodygene=110%2C10%2C213&d_winggene=0%2C213&d_tertgene=22&collapse=1
// "and" combinator for several selections seems to be %2C

// remember that basic is id 0 lol