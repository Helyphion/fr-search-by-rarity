function parseRarity() {
    const primRarityCheckboxes = primRarity.elements;
    console.log(primRarityCheckboxes);

    /*
    for (const input of primRarityCheckboxes) {
        if (input.nodeName === "INPUT" && input.type === "checkbox") {
          console.log(input)
        }
      }
    */

    // ughh I don't know man. I give up. (for now)
    const formData = new FormData(primRarity);

    // 2. Get all values associated with the checkbox name attribute
    const selectedValues = formData.getAll("prim-rarity");
    
    console.log(selectedValues);
}


const primRarity = document.getElementById("prim-rarity");
primRarity.addEventListener("change", parseRarity())





// remember that basic is id 0 lol

// this is just for debugging bc my setup is.. janky rn:
// document.body.style.backgroundColor = "black";