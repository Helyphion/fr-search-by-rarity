import { refreshActiveBreed } from "./assemble-link.js";


export function updateCollapsedBreeds(box) {

    const childBoxes = document.getElementById(box.value + "-collapse").querySelectorAll("input");

    for (const child of childBoxes) {
        box.checked ? child.checked = true : child.checked = false;
    }

    refreshActiveBreed();

}

export function updateParentBoxes(box, childBoxes) {
    if ([...childBoxes].every(x => !x.checked)) {
        box.checked = false;
    } else {
        box.checked = true;
    }

    refreshActiveBreed();
}



export function clearAllBoxes(givenId) {
    const form = document.getElementById(givenId);
    const allBoxes = form.querySelectorAll("input");

    for (const box of allBoxes) {
        box.checked = false;
    }

    refreshActiveBreed();
}