/*
function parseRarity(givenForm) {

    const formContents = new FormData(givenForm);
    console.log(formContents.getAll("rarity"));
    // howw.. do I get this data out of here 
    // now if only I had made the json layout make more sense. lmao

}
*/

let geneDatabase;
let breed = "modern"; //TODO: implement properly lol


function updatePrim(givenForm) {
    const formContents = new FormData(givenForm);
    const activeRars = formContents.getAll("rarity");
    console.log(formContents.getAll("rarity"));

    for (let i = 0; i < activeRars.length; i++) {
        console.log(activeRars[i])
        console.log(geneDatabase.primary[activeRars[i]])
        let currentGenesList = geneDatabase.primary[activeRars[i]];
        console.log(Object.keys(currentGenesList).length)

        for (let x = 0; x < Object.keys(currentGenesList).length; x++) {
            // console.log(currentGenesList)
        }

        for (const [gene, breeds] of Object.entries(currentGenesList)) {
            console.log(gene, breeds);

            for (const test of Object.entries(breeds)) {
                
                if (test[0] == breed) {
                    console.log(test[1])
                } 
                // don't ask me why this is an array instead of key: value, but hey it works I guess ??
            }
        }
    }

}

async function getGeneIdsJson() {
    const response = await fetch("gene-rarities.json");
    return await response.json();
}


async function main() {

    geneDatabase = await getGeneIdsJson();

    const primRarityForm = document.getElementById("prim-rarity");
    primRarityForm.addEventListener("change", () => updatePrim(primRarityForm))

    // arrow functions are necessary for parameters to work



    // this is just for debugging bc my setup is.. janky rn:
    document.body.style.backgroundColor = "black";

}

main();


// example link:
// https://www1.flightrising.com/auction-house/buy/realm/dragons?d_gender=0&d_bodygene=110%2C10%2C213&d_winggene=0%2C213&d_tertgene=22&collapse=1
// "and" combinator for several selections seems to be %2C

// remember that basic is id 0 lol