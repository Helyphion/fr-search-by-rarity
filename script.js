function parseRarity() {
    console.log("TEST")

    const test = new FormData(primRarityForm);
    console.log(test.getAll("prim-rarity"));
    // now if only I had made the json layout make more sense. lmao

}


const primRarityForm = document.getElementById("prim-rarity");

primRarityForm.addEventListener("change", parseRarity)


// example link:
// https://www1.flightrising.com/auction-house/buy/realm/dragons?d_gender=0&d_bodygene=110%2C10%2C213&d_winggene=0%2C213&d_tertgene=22&collapse=1
// "and" combinator for several selections seems to be %2C

// remember that basic is id 0 lol

// this is just for debugging bc my setup is.. janky rn:
document.body.style.backgroundColor = "black";