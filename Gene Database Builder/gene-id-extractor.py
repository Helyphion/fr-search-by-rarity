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

geneNames = []

for x in allGenesPlaintextFile:
    # filters out all the stuff that is not gene names
    if not x.isupper() and x != "":
        geneNames.append( x.lower().split(", ") )


for x in geneNames[0]:
    outputDict["primary"]["common"][x] = {}
    print(x)
outputDict["primary"]["uncommon"] = geneNames[1]

print(outputDict)

"""
with open("data/modern-prims-html.txt", "r") as file:
    modernPrims = file.read().splitlines()

for x in modernPrims:
    geneID = int(x.split('"')[1])
    # the [:-8] trims "</option" bit from extracted name
    geneName = x.split('>')[1][:-8]
    outputDict[geneName] = {"modern": geneID}

"""

test = json.dumps(outputDict, indent=4)

print(test)