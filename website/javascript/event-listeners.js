import { refreshActiveGenes, refreshActiveBreed, refreshUtilities } from "./assemble-link.js";
import { updateCollapsedBreeds, updateParentBoxes, clearAllBoxes } from "./update-checkboxes.js";


function createEventListener(id, type, funct) {
    const element = document.getElementById(id);
    element.addEventListener(type, funct);
}


export function setUpEventListeners() {

    // note: arrow functions are necessary for parameters to work in Event Listeners

    createEventListener("ancient-breed", "change", () => refreshActiveBreed());

    createEventListener("primary", "change", () => refreshActiveGenes("primary"));
    createEventListener("secondary", "change", () => refreshActiveGenes("secondary"));
    createEventListener("tertiary", "change", () => refreshActiveGenes("tertiary"));

    createEventListener("utilities", "change", () => refreshUtilities());


    // refresh breed when switching between modern/ancient tab
    createEventListener("modern-button", "shown.bs.tab", () => refreshActiveBreed());
    createEventListener("ancient-button", "shown.bs.tab", () => refreshActiveBreed());


    // separate Event Listeners for clearing modern/ancient because it's simplest right now
    createEventListener("clear-breed", "click", () => clearAllBoxes("breed-rarity"));
    createEventListener("clear-breed", "click", () => clearAllBoxes("ancient-breed"));

    createEventListener("clear-prim", "click", () => clearAllBoxes("primary"));
    createEventListener("clear-sec", "click", () => clearAllBoxes("secondary"));
    createEventListener("clear-tert", "click", () => clearAllBoxes("tertiary"));

    
    setUpCollapsibleSync();
}


export function setUpCollapsibleSync() {

    const breedRarityBoxes = document.querySelector("#breed-rarity").querySelectorAll('input[name="rarity"]');
    // add separate eventListener for each collapsible
    for (const parentBox of breedRarityBoxes) {

        parentBox.addEventListener("change", () => updateCollapsedBreeds(parentBox));
        
        // add eventListeners for all child boxes to make parent boxes sync if all are selected/unselected
        const childBoxes = parentBox.parentElement.querySelector(".collapse").querySelectorAll("input");
        for (const child of childBoxes) {
            child.addEventListener("change", () => updateParentBoxes(parentBox, childBoxes));
        }

    }

}