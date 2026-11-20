import sys
import json


# this uses the same JSON file as the website, at fr-search-by-rarity/website/data/ ; that path can be changed below if needed
DATA_PATH = "../../website/data/"


BREED = "modern" # edit here; ex. "modern", "aether"



def findID():

    if line != "":

        for slot in geneRarities.values():
            for rarity, contents in slot.items():

                if line.lower() in contents:

                    for gene, breeds in contents.items():

                        if gene == line.lower() and breed in breeds:
                            print(f"{gene}: {breeds[breed]}")
                            return f"{breeds[breed]}\n"

                        # warns if a listed gene isn't on the specified breed
                        elif gene == line.lower() and breed not in breeds:
                            print(f"{gene} is not available for {breed}")
                            return f"--Not on breed\n"

        # gives a warning if a gene isn't found anywhere in the JSON    
        print(f'gene "{line}" not found')
        return "--Not found\n"

    else:
        return "\n"


try:
    with open("input.txt", "r") as file:
        names = file.read().splitlines()
except:
    # creates input.txt as a blank file
    with open("input.txt", "w") as file:
        pass
    print("input.txt was not found, file has been created\n(pls put your gene names in it)")
    sys.exit()


with open(f"{DATA_PATH}gene-rarities.json", "r") as file:
    geneRarities = json.loads(file.read())


breed = BREED.lower()  # one of the funniest lines I've ever written ngl
output = ""


for line in names:
    output += findID()
# I made it a function to make handling of the different error cases easier
# though there very well might be a better way to do that :P

with open("output.txt", "w") as file:
    file.write(output)