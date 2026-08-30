import { breedDatabase } from "./main.js";


export function populateModernCollapsibles() {

    const modernBreeds = breedDatabase["modern"];
    for (const rarity of Object.keys(modernBreeds)) {

        for (const breed of Object.keys(modernBreeds[rarity])) {

            const parentDiv = document.getElementById(rarity + "-collapse");

            const optionDiv = document.createElement("div");
            optionDiv.className = "option";

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.name = "breed";
            checkbox.value = breed;

            const label = document.createElement("label");
            label.htmlFor = breed;
            label.textContent = breed.charAt(0).toUpperCase() + breed.slice(1);
            // I hate javascript >:[

            optionDiv.appendChild(checkbox);
            optionDiv.append(" ");
            optionDiv.appendChild(label);

            parentDiv.appendChild(optionDiv);
        }

    }

}

export function populateAncientBreeds() {

    const ancientBreeds = breedDatabase["ancient"];
    for (const breed of Object.keys(ancientBreeds)) {

        const parentDiv = document.getElementById("ancient-breed");

        const optionDiv = document.createElement("div");
        optionDiv.className = "option";

        const radioButton = document.createElement("input");
        radioButton.type = "radio";
        radioButton.name = "breed";
        radioButton.value = breed;

        const label = document.createElement("label");
        label.htmlFor = breed;
        label.textContent = breed.charAt(0).toUpperCase() + breed.slice(1);

        optionDiv.appendChild(radioButton);
        optionDiv.append(" ");
        optionDiv.appendChild(label);

        parentDiv.appendChild(optionDiv);
    }

}