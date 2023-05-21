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


@app.get("/badge")
def apiReturn(rand,processed,group,cornm,cat):
    #print(imageDict)
    processed = processed.split(',')
    #print(processed)
    ## Remove processed from the list directory, before selecting a random
    s1 = set(processed)
    if group == 'all':
        list1 = []
        path =f"./pics/{cat}"
        for root, dirs, files in os.walk(path):
            for file in files:
                #append the file name to the list
                list1.append(file)
        s2 = set(list1)
    else:
        s2 = set(os.listdir(f'./pics/{cat}/{group}'))
    array1 = list(s2.difference(s1))
    #print(array1)
    if len(array1) < 1:
        array1 = list(s2)
    badge = random.choice(array1)
    print(badge)
    array1.remove(badge)
    try:
        finalist = random.sample(array1,3)
        finalist.append(badge)
    except:
        appendlist = random.sample(processed,(3-len(array1)))
        randlist = random.sample(array1,len(array1))
        finalist = appendlist + randlist
        finalist.append(badge)
    finalistv2 = random.sample(finalist,4)
    answer = badge[:-4]
    return (f'./image?team={badge}',finalistv2,answer)

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