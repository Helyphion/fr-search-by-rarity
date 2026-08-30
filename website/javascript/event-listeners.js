import { refreshActiveGenes, refreshActiveBreed, refreshUtilities } from "./assemble-link.js";
import { updateCollapsedBreeds, updateParentBoxes, clearAllBoxes } from "./update-checkboxes.js";


function createEventListener(id, type, funct) {
    const element = document.getElementById(id);
    element.addEventListener(type, funct);
}


export function setUpEventListeners() {

    // TODO: refacor this first chunk; gotta refactor refreshActiveGenes() to not require the nRarityForm parameter
    // createEventListener("prim-rarity", "change", () => refreshActiveGenes("primary", primRarityForm));
    const primRarityForm = document.getElementById("prim-rarity");
    const secRarityForm = document.getElementById("sec-rarity");
    const tertRarityForm = document.getElementById("tert-rarity");

    // arrow functions are necessary for parameters to work
    primRarityForm.addEventListener("change", () => refreshActiveGenes("primary", primRarityForm));
    secRarityForm.addEventListener("change", () => refreshActiveGenes("secondary", secRarityForm));
    tertRarityForm.addEventListener("change", () => refreshActiveGenes("tertiary", tertRarityForm));
    
    createEventListener("ancient-breed", "change", () => refreshActiveBreed());

    createEventListener("utilities", "change", () => refreshUtilities());


    // refresh breed when switching between modern/ancient tab
    createEventListener("modern-button", "shown.bs.tab", () => refreshActiveBreed());
    createEventListener("ancient-button", "shown.bs.tab", () => refreshActiveBreed());


    // separate Event Listeners for clearing modern/ancient because it's simplest right now
    createEventListener("clear-breed", "click", () => clearAllBoxes("breed-rarity"));
    createEventListener("clear-breed", "click", () => clearAllBoxes("ancient-breed"));

    createEventListener("clear-prim", "click", () => clearAllBoxes("prim-rarity"));
    createEventListener("clear-sec", "click", () => clearAllBoxes("sec-rarity"));
    createEventListener("clear-tert", "click", () => clearAllBoxes("tert-rarity"));
}


export function TEMP() {

    // TODO: refactor this chunk because this is not particularly readable
    const breedRarityBoxes = document.querySelector("#breed-rarity").querySelectorAll('input[name="rarity"]');
    // add separate eventListener for each collapsible
    for (const box of breedRarityBoxes) {
        box.addEventListener("change", () => updateCollapsedBreeds(box));
        
        // add eventListeners for child boxes to sync parent boxes if all are selected/unselected
        const childBoxes = box.parentElement.querySelector(".collapse").querySelectorAll("input");
        for (const child of childBoxes) {
            child.addEventListener("change", () => updateParentBoxes(box, childBoxes));
        }
    }

}