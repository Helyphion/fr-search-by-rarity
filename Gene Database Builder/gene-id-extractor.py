import json

with open("data/all-genes-plaintext.txt", "r") as file:
    geneNames = file.read().splitlines()

# takes common prims for now (TODO: reformat input file n stuff to make this able to get all yeag)
commonPrims = geneNames[1].split(", ")

dict = {}

for x in commonPrims:
    dict[x] = {}

with open("data/modern-prims-html.txt", "r") as file:
    modernPrims = file.read().splitlines()

test = json.dumps(dict, indent=4)

# print(test)