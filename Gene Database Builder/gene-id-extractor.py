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
    rar += 1
    # cycles thru the 4 rarities, once at the end of that, resets to first rarity, and switches gene slot
    if rar == 4:
        rar = 0
        slot += 1
# this does rely on there being exactly 12 lines of gene data in the plaintext file to work correctly, just keep that in mind


def cleanUpInputFile(path):
    with open(path, "r") as file:
        fileContents = file.read().splitlines()

    cleanedFile = ""

    for line in fileContents:
        if 'value="0"' not in line:
            if "selected" in line:
                cleanedFile += line.strip().replace('selected="selected" ', '') + "\n"
            else:
                cleanedFile += line.strip() + "\n"
    
    with open(path, "w") as file:
        file.write(cleanedFile[:-1])


def addModernGeneIDs(slot, geneList):
    rar = 0
    for x in geneList:
        # extracts the gene name and ID from the line of HTML
        geneID = int(x.split('"')[1])
        # the [:-8] trims "</option" bit from extracted name
        geneName = x.lower().split('>')[1][:-8]

        # cycles through rarities to find the entry of the given gene
        for y in range(4):
            if geneName in outputDict[slot][rarities[rar]]:
                outputDict[slot][rarities[rar]][geneName] = {"modern": geneID}
                break
            elif rar < 3:
                rar += 1
            # notifies if a gene from the html input file couldn't be matched to any rarity
            else:
                print(f'{slot} gene "{geneName}" (modern) could not be assigned to a rarity. did you add it to all-genes-plaintext.txt?')
        rar = 0


# trims whitespace, removes Basic, removes "selected" tag before further processing
cleanUpInputFile("data/modern-prims-html.txt")
cleanUpInputFile("data/modern-secs-html.txt")
cleanUpInputFile("data/modern-terts-html.txt")

with open("data/modern-prims-html.txt", "r") as file:
    modernPrims = file.read().splitlines()
with open("data/modern-secs-html.txt", "r") as file:
    modernSecs = file.read().splitlines()
with open("data/modern-terts-html.txt", "r") as file:
    modernTerts = file.read().splitlines()

addModernGeneIDs("primary", modernPrims)
addModernGeneIDs("secondary", modernSecs)
addModernGeneIDs("tertiary", modernTerts)

# ...oof so jank </3

# same thing but modified for ancients (to distinguish by breeds):
def addAncientGeneIDs(slot, geneList):
    rar = 0
    for x in geneList:
        # extracts the gene name and ID from the line of HTML
        geneID = int(x.split('"')[1])
        # this looks so fuckass but I swear it makes sense (it splits the line at spaces to separate info, then trims some characters off the ends to get just the name)
        # the one for geneName now splits differently because fuckin "Eye Spots" has a space in its name so it wasn't getting parsed correctly..
        geneName = x.lower().split('>')[1].split(' (')[0]
        geneBreed = x.lower().split('(')[1][:-10]

        # cycles through rarities to find the entry of the given gene, appends an entry for the given ancient breed
        for y in range(4):
            if geneName in outputDict[slot][rarities[rar]]:
                outputDict[slot][rarities[rar]][geneName][geneBreed] = geneID
                break
            elif rar < 3:
                rar += 1
            # notifies if a gene from the html input file couldn't be matched to any rarity
            else:
                print(f'{slot} gene "{geneName}" ({geneBreed}) could not be assigned to a rarity. did you add it to all-genes-plaintext.txt?')
        rar = 0


# trims whitespace, removes "selected" tag before further processing
cleanUpInputFile("data/ancient-prims-html.txt")
cleanUpInputFile("data/ancient-secs-html.txt")
cleanUpInputFile("data/ancient-terts-html.txt")

with open("data/ancient-prims-html.txt", "r") as file:
    ancientPrims = file.read().splitlines()
with open("data/ancient-secs-html.txt", "r") as file:
    ancientSecs = file.read().splitlines()
with open("data/ancient-terts-html.txt", "r") as file:
    ancientTerts = file.read().splitlines()

addAncientGeneIDs("primary", ancientPrims)
addAncientGeneIDs("secondary", ancientSecs)
addAncientGeneIDs("tertiary", ancientTerts)

jsonOutput = json.dumps(outputDict, indent=4)

with open("output.json", "w") as file:
    file.write(jsonOutput)

print("the json output has been (re)generated! (yay yippie, etc)")