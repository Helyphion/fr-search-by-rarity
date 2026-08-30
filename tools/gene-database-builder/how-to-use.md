(If an entirely new gene was added to the site, [look up its rarity](https://www1.flightrising.com/forums/gde/3109561) (check the most recent pages of the thread if the main chart hasn't been updated yet), and add it to the correct list in [`all-genes-plaintext.txt`](https://github.com/Helyphion/fr-search-by-rarity/blob/main/Gene%20Database%20Builder/data/all-genes-plaintext.txt), then continue with the other steps.)


1. Open `view-source:www1.flightrising.com/scrying/predict` and ctrl + F for `name="bodygene"`, `name="winggene"` or `name="tertgene"`, depending on what has been updated.
2. Copy the block of modern genes at the top, or the block of ancient genes below, depending on what was updated. Paste it into the corresponding txt file in the `data` folder. (Using an editor that highlights changes from the previous version helps a ton with ensuring everything is correct.)
4. Run `gene-id-extractor.py`.
5. Copy the contents of the resulting `output.json` to [`gene-rarities.json`](https://github.com/Helyphion/fr-search-by-rarity/blob/main/gene-rarities.json) (and un-indent them once).
6. Make sure everything looks correct, and then push to main!

**! If a new breed has been released, remember to manually add it to [`breed-rarities.json`](https://github.com/Helyphion/fr-search-by-rarity/blob/main/breed-rarities.json).**