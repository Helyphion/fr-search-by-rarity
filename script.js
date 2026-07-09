function parseRarity() {
    console.log("TEST")

    const test = new FormData(primRarityForm);
    console.log(test.getAll("prim-rarity"));
    // now if only I had made the json layout make more sense. lmao

}


const primRarityForm = document.getElementById("prim-rarity");

primRarityForm.addEventListener("change", parseRarity)




// remember that basic is id 0 lol

// this is just for debugging bc my setup is.. janky rn:
document.body.style.backgroundColor = "black";