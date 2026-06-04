import json


# set up structure of output JSON (not the most concise but it'll do for this purpose)
outputDict = { "primary": {}, "secondary": {}, "tertiary": {} }

outputDict["primary"]["common"] = {}
outputDict["primary"]["uncommon"] = {}
outputDict["primary"]["limited"] = {}
outputDict["primary"]["rare"] = {}

outputDict["secondary"]["common"] = {}
outputDict["secondary"]["uncommon"] = {}
outputDict["secondary"]["limited"] = {}
outputDict["secondary"]["rare"] = {}

outputDict["tertiary"]["common"] = {}
outputDict["tertiary"]["uncommon"] = {}
outputDict["tertiary"]["limited"] = {}
outputDict["tertiary"]["rare"] = {}


with open("data/all-genes-plaintext.txt", "r") as file:
    allGenesPlaintextFile = file.read().splitlines()

with open("data/modern-prims-html.txt", "r") as file:
    modernPrims = file.read().splitlines()

for x in modernPrims:
    geneID = int(x.split('"')[1])
    # the [:-8] trims "</option" bit from extracted name
    geneName = x.lower().split('>')[1][:-8]
    outputDict[geneName] = {"modern": geneID}

geneNames = []

for x in allGenesPlaintextFile:
    # filters out the stuff from the plaintext file that is not gene names
    if not x.isupper() and x != "":
        geneNames.append( x.lower().split(", ") )
# list contain 12 lists of gene names, first list is primary-common, second is primary-uncommon, and so on


# adds gene names to the JSON (once again janky, but good enough for now)
geneSlots = ["primary", "secondary", "tertiary"]
rarities = ["common", "uncommon", "limited", "rare"]
slot = 0
rar = 0
for x in geneNames:
    for y in x:
        outputDict[geneSlots[slot]][rarities[rar]][y] = {}
        print(y)
    rar += 1
    # cycles thru the 4 rarities, once at the end of that, resets to first rarity, and switches gene slot
    if rar == 4:
        rar = 0
        slot += 1
# this does rely on there being exactly 12 lines of gene data in the plaintext file to work correctly, just keep that in mind



test = json.dumps(outputDict, indent=4)

print(test)