import os, random, psycopg2, boto3, json
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from psycopg2 import pool

session = boto3.session.Session()
client = session.client(
    service_name='secretsmanager',
    region_name="eu-west-1"
)

get_secret_value_response = client.get_secret_value(SecretId="RedshiftCon")
secret = get_secret_value_response['SecretString']
secret_dict = json.loads(secret)

connection_pool = psycopg2.pool.SimpleConnectionPool(
    minconn=1,
    maxconn=10,
    database="postgres",
    user=secret_dict['awsRSu'],
    password=secret_dict['awsRSp'],
    host=secret_dict['awsRSep'],
    port='5432'
)
connection = connection_pool.getconn()

app = FastAPI()
origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

## Static Assets
@app.get("/")
def returnIndex():
    return FileResponse('./assets/index.html')

@app.get("/js")
def returnAsset():
    return FileResponse(f'./assets/index.js')

@app.get("/css")
def returnAsset():
    return FileResponse(f'./assets/index.css')

## Python Logic
@app.get("/badge")
def apiReturn(rand,processed,group,cat):
    ## Rand needed to prevent cache being used

    ## Parse array and convert into set
    listOfProcessedPics = processed.split(',')
    processedSet = set(listOfProcessedPics)

    ## Query Database to get list of options to return to user
    allOptions = databaseQuery(cat,group)
    filteredOptionsToSelectFrom = []

    ## Loop through the list and remove options that have already been processed
    for eachOption in allOptions:
        if eachOption[0] not in processedSet:
            filteredOptionsToSelectFrom.append(eachOption)
            continue
 
    ## If there isnt enough pictures remaining to choose from, then make selection from all pictures
    if len(filteredOptionsToSelectFrom) > 0:
        options = filteredOptionsToSelectFrom
    else:
        options = allOptions

    ## get badge (image to show)
    correctAnswer = random.choice(options)
    print(correctAnswer[0])

    ## Remove badge from list (this is where we will select 3 other options to choose from)
    allOptions.remove(correctAnswer)

    ## Choose three random answers to provide as wrong options
    listOfOptions = random.sample(allOptions,3)

    ## Add the actual answer onto this list
    listOfOptions.append(correctAnswer)

    ## Randomise the final list again (to shakeup the order so the correct answer isnt always last)
    finalOutputList = random.sample(listOfOptions,4)

    ## Return ImageUrl, Options and Answer in request
    return (f'./image?img={correctAnswer[1]}',finalOutputList,correctAnswer[0])

@app.get("/image")
def imagereturn(img):
    try:
        return FileResponse(f'{img}.jpg')
    except:
        return False

@app.get("/background")
def test123(type):
    return FileResponse(f'./assets/backgrounds/{type}.jpg')

@app.get("/logo")
def test123():
    return FileResponse(f'./logo.png')

## Database Query Function
def databaseQuery(category,teamgroup):
    cursor = connection.cursor()
    if teamgroup == 'all':
        cursor.execute("""
            SELECT name, filepath
            FROM 
                quizgame
            WHERE 
                category = (%s);
        """, (category,))
    else:
        cursor.execute("""
            SELECT name, filepath 
            FROM 
                quizgame
            WHERE 
                category = (%s)
                AND groupteam = (%s);
        """, (category,teamgroup,))

    data = cursor.fetchall()
    cursor.close()
    return data

# connection_pool.closeall()

