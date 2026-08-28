import os
import json
import datetime
import certifi
import motor.motor_asyncio
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from google.oauth2 import service_account
from googleapiclient.discovery import build
from dotenv import load_dotenv
from urllib.parse import urlparse

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DOCUMENT_ID = os.getenv("DOCUMENT_ID") 
SCOPES = ['https://www.googleapis.com/auth/documents']
SERVICE_ACCOUNT_FILE = 'credentials.json'

MONGODB_URI = os.getenv("MONGODB_URI")
# Pass certifi.where() to fix SSL handshake issues on Windows
client = motor.motor_asyncio.AsyncIOMotorClient(MONGODB_URI, tlsCAFile=certifi.where())
db = client.wallet
collection = db.links

def get_google_docs_service():
    try:
        creds_json = os.getenv("GOOGLE_CREDENTIALS")
        if creds_json:
            creds_dict = json.loads(creds_json)
            creds = service_account.Credentials.from_service_account_info(creds_dict, scopes=SCOPES)
        else:
            creds = service_account.Credentials.from_service_account_file(SERVICE_ACCOUNT_FILE, scopes=SCOPES)
            
        service = build('docs', 'v1', credentials=creds)
        return service
    except Exception as e:
        print(f"Error authenticating: {e}")
        return None

class LinkData(BaseModel):
    title: str
    url: str
    category: str = "Uncategorized"
    description: str = ""

@app.get("/links")
async def get_all_links():
    try:
        cursor = collection.find().sort("_id", -1)
        links = await cursor.to_list(length=100)
        
        result = []
        for row in links:
            result.append({
                "id": str(row["_id"]),
                "title": row.get("title", ""),
                "url": row.get("url", ""),
                "category": row.get("category", "Uncategorized"),
                "description": row.get("description", ""),
                "createdAt": row.get("created_at", "")
            })
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/save-link")
async def save_link_to_doc(data: LinkData):
    if not DOCUMENT_ID or DOCUMENT_ID == "YOUR_DOC_ID_HERE":
        raise HTTPException(status_code=500, detail="Please put your real Document ID in the .env file!")

    url_to_save = data.url
    if not url_to_save.startswith("http"):
        url_to_save = "https://" + url_to_save

    # 1. Save to MongoDB FIRST
    created_at = datetime.datetime.now().isoformat()
    try:
        new_link = {
            "title": data.title,
            "url": url_to_save,
            "category": data.category,
            "description": data.description,
            "created_at": created_at
        }
        await collection.insert_one(new_link)
    except Exception as e:
        print(f"Failed to save to MongoDB: {e}")

    # 2. Save to Google Docs
    service = get_google_docs_service()
    if not service:
        raise HTTPException(status_code=500, detail="Could not connect to Google Docs")

    domain = urlparse(url_to_save).netloc
    logo_url = f"https://www.google.com/s2/favicons?domain={domain}&sz=128"
    screenshot_url = f"https://image.thum.io/get/width/800/crop/800/{url_to_save}"

    req1 = {
        'insertText': {
            'location': {'index': 1},
            'text': "\n----------------------------------------\n\n"
        }
    }
    
    req2 = {
        'insertInlineImage': {
            'location': {'index': 1},
            'uri': screenshot_url,
            'objectSize': {'width': {'magnitude': 400, 'unit': 'PT'}}
        }
    }
    
    req3 = {
        'insertText': {
            'location': {'index': 1},
            'text': "\n\n"
        }
    }
    
    req4 = {
        'insertInlineImage': {
            'location': {'index': 1},
            'uri': logo_url,
            'objectSize': {'width': {'magnitude': 32, 'unit': 'PT'}}
        }
    }
    
    text_info = f"Category: {data.category}\nTitle: {data.title}\nURL: {url_to_save}\n\n"
    req5 = {
        'insertText': {
            'location': {'index': 1},
            'text': text_info
        }
    }

    url_start_idx = 1 + len(f"Category: {data.category}\nTitle: {data.title}\nURL: ")
    url_end_idx = url_start_idx + len(url_to_save)

    req6 = {
        'updateTextStyle': {
            'range': {
                'startIndex': url_start_idx,
                'endIndex': url_end_idx
            },
            'textStyle': {
                'link': {
                    'url': url_to_save
                },
                'foregroundColor': {
                    'color': {'rgbColor': {'blue': 1.0}}
                },
                'underline': True
            },
            'fields': 'link,foregroundColor,underline'
        }
    }

    requests = [req1, req2, req3, req4, req5, req6]

    try:
        service.documents().batchUpdate(documentId=DOCUMENT_ID, body={'requests': requests}).execute()
        return {"status": "success", "message": "Data successfully saved to MongoDB & Google Docs!"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
