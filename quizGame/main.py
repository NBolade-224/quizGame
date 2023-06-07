import os, random
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse

app = FastAPI()
origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def returnIndex():
    return FileResponse('./assets/index.html')

@app.get("/js")
def returnAsset():
    return FileResponse(f'./assets/index.js')

@app.get("/css")
def returnAsset():
    return FileResponse(f'./assets/index.css')

## Dictionary for images
imageDict = {}
path ="./pics"
for root, dirs, files in os.walk(path):
    for file in files:
        #append the file name to the list
        imageDict[file] = os.path.join(root,file)

## All Category Images
CategoryLists = {"Football": set(),
                 "Anime":set(),
                 'Kpop': set()}
for cat in CategoryLists:
    path =f"./pics/{cat}"
    for root, dirs, files in os.walk(path):
        for file in files:
            CategoryLists[cat].add(file)

## Sub Category Images
SubCategoryLists = {}
for mainCat in os.listdir('./pics'):
    for subCat in os.listdir(f'./pics/{mainCat}'):
        path =f"./pics/{mainCat}/{subCat}"
        SubCategoryLists[mainCat+subCat] = set()
        for root, dirs, files in os.walk(path):
            for file in files:
                SubCategoryLists[mainCat+subCat].add(file)

@app.get("/badge")
def apiReturn(rand,processed,group,cornm,cat):
    listOfProcessedPics = processed.split(',')

    ## Remove processed from the list directory, before selecting a random
    setOfProcessedPics = set(listOfProcessedPics)

    ## Find the Pictures Filter/Selection
    if group == 'all':
        setOfAllPictures = CategoryLists[cat]
    else:
        ## Update this as no need to scour the folder for each request
        setOfAllPictures = SubCategoryLists[cat+group]

    ## Find remaining pictures to choose from by getting the difference from the two sets
    remainingPicturesToChooseFrom = list(setOfAllPictures.difference(setOfProcessedPics))

    ## If there isnt enough pictures remaining to choose from, then make selection from all pictures
    if len(remainingPicturesToChooseFrom) < 1:
        remainingPicturesToChooseFrom = list(setOfAllPictures)

    ## get badge (image to show)
    badge = random.choice(remainingPicturesToChooseFrom)
    print(badge)

    ## Remove badge from list (this is where we will select 3 other options to choose from)
    setOfAllPictures.remove(badge)

    ## Choose three random answers to provide as wrong options
    liftOfOptions = random.sample(setOfAllPictures,3)
    print(liftOfOptions)

    ## Add the actual answer onto this list
    liftOfOptions.append(badge)
    print(liftOfOptions)

    ## Randomise the final list again (to shakeup the order so the correct answer isnt always last)
    finalOutputList = random.sample(liftOfOptions,4)
    answer = badge[:-4]

    ## Return ImageUrl, Options and Answer in request
    return (f'./image?team={badge}',finalOutputList,answer)

@app.get("/image")
def imagereturn(team):
    try:
        return FileResponse(f'{imageDict[team]}')
    except:
        return False

@app.get("/background")
def test123(type):
    return FileResponse(f'./assets/backgrounds/{type}.jpg')

@app.get("/logo")
def test123():
    return FileResponse(f'./logo.png')