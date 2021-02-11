import os

import requests
from dotenv import load_dotenv

load_dotenv("webapp/.env.local")

API_KEY = os.environ["VUE_APP_API_KEY"]
BASE_URL = "https://bungie.net{}"
MANIFEST_URL = "https://bungie.net/Platform/Destiny2/Manifest"
WANTED_MANIFESTS = [
    "DestinyInventoryItemDefinition",
    "DestinyInventoryItemLiteDefinition",
    "DestinyObjectiveDefinition",
    "DestinyPresentationNodeDefinition",
]
DEST_FILE_PATH = "webapp/src/definitions/{}.json"


manifest_resp = requests.get(MANIFEST_URL, headers={"X-API-Key": API_KEY})
manifest_resp.raise_for_status()
manifest_data = manifest_resp.json()

definition_files = manifest_data["Response"]["jsonWorldComponentContentPaths"]["en"]

for wanted_manifest in WANTED_MANIFESTS:
    print("Downloading {}...".format(wanted_manifest))
    resp = requests.get(BASE_URL.format(definition_files[wanted_manifest]))
    with open(DEST_FILE_PATH.format(wanted_manifest), mode="wb") as f:
        f.write(resp.content)

print("Done")
