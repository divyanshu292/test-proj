from fastapi import FastAPI
import uvicorn
from fastapi.middleware.cors import CORSMiddleware as CORS
from sockets import sio_app

app = FastAPI()
app.mount("/", app=sio_app) #mount the socketio app to the FastAPI app 

app.add_middleware(
    CORS,
   #allow_origins=['*'],
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*']
)
    


@app.get("/")
async def home():
    return {"message": "LOLOLOL"}

# if __name__ == "__main__":
#     uvicorn.run('main:app', reload=True)
if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
