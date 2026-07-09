function parseRarity(givenForm) {

    const formContents = new FormData(givenForm);
    console.log(formContents.getAll("rarity"));
    // howw.. do I get this data out of here 
    // now if only I had made the json layout make more sense. lmao

}

async function getGeneIdsJson() {
    const response = await fetch("gene-rarities.json");
    const geneIdsJson = await response.json();
    console.log(geneIdsJson);
}


async function main() {

    const geneIdsJson = await getGeneIdsJson();

    const primRarityForm = document.getElementById("prim-rarity");
    primRarityForm.addEventListener("change", () => parseRarity(primRarityForm))
    // arrow functions are necessary for parameters to work


    
    // this is just for debugging bc my setup is.. janky rn:
    document.body.style.backgroundColor = "black";

}

main();


// example link:
// https://www1.flightrising.com/auction-house/buy/realm/dragons?d_gender=0&d_bodygene=110%2C10%2C213&d_winggene=0%2C213&d_tertgene=22&collapse=1
// "and" combinator for several selections seems to be %2C

// remember that basic is id 0 lol