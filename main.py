import sys
import os

# Add api_backend to path so we can import app modules
api_backend_path = os.path.abspath("api_backend")
sys.path.append(api_backend_path)

from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
import uvicorn

# Import the actual API router from the cloned repository
try:
    from app.api.api import api_router
except ImportError as e:
    print(f"Error importing api_router: {e}")
    # Fallback or exit
    sys.exit(1)

app = FastAPI(title="DiskiData - Premium Football Insights")

# Include the Transfermarkt API router under /api
app.include_router(api_router, prefix="/api")

@app.get("/", response_class=HTMLResponse)
async def read_root():
    if os.path.exists("static/index.html"):
        with open("static/index.html", "r") as f:
            return f.read()
    return "<h1>DiskiData Frontend</h1><p>Static files not found.</p>"

# Serve static files if they exist
if os.path.exists("static"):
    app.mount("/static", StaticFiles(directory="static"), name="static")

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8008, reload=True)
