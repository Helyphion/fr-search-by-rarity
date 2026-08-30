import { populateModernCollapsibles, populateAncientBreeds } from "./populate-breeds.js";
import { setUpEventListeners, TEMP } from "./event-listeners.js";

async function fetchJsonData(file) {
    const response = await fetch(file);
    return await response.json();
}

const geneDatabase = await fetchJsonData("../data/gene-rarities.json");
const breedDatabase = await fetchJsonData("../data/breed-rarities.json");

function main() {

    populateModernCollapsibles();
    populateAncientBreeds();

    setUpEventListeners();
    TEMP(); // needs to be refactored :[

    // Bootstrap code for initialising tooltips
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
    
}

main();


export { geneDatabase, breedDatabase };