from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.router import router as api_router
from app.config.database import test_connection
import uvicorn
import logging
from fastapi.responses import JSONResponse


# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="Inventory Management System API",
    description="API for managing inventory, orders, customers, and suppliers",
    version="1.0.0"
)

# Configure CORS
origins = [
    "http://localhost:3000",  # React default port
    "http://localhost:8000",  # FastAPI default port
    # Add other origins as needed
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(api_router, prefix="/api/v1")

@app.on_event("startup")
async def startup_event():
    """
    Runs when the application starts.
    Tests database connection and performs any necessary initialization.
    """
    logger.info("Starting up the application...")
    if not test_connection():
        raise HTTPException(
            status_code=500,
            detail="Could not establish database connection"
        )

@app.get("/", tags=["Root"])
async def root():
    """
    Root endpoint to check if API is running
    """
    return {
        "message": "Welcome to Inventory Management System API",
        "status": "active",
        "version": "1.0.0"
    }

@app.get("/health", tags=["Health Check"])
async def health_check():
    """
    Health check endpoint
    """
    return {
        "status": "healthy",
        "database": test_connection()
    }

# # Error handlers
# @app.exception_handler(HTTPException)
# async def http_exception_handler(request, exc):
#     return {
#         "status_code": exc.status_code,
#         "detail": exc.detail,
#         "message": str(exc)
#     }

# @app.exception_handler(Exception)
# async def general_exception_handler(request, exc):
#     logger.error(f"Unhandled exception: {exc}")
#     return {
#         "status_code": 500,
#         "detail": "Internal server error",
#         "message": str(exc)
#     }

# HTTPException handler
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    """
    Custom handler for HTTP exceptions.
    """
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "status_code": exc.status_code,
            "detail": exc.detail,
            "message": str(exc),
        },
    )

# General exception handler
@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    """
    Custom handler for unexpected exceptions.
    """
    logger.error(f"Unhandled exception: {exc}")
    return JSONResponse(
        status_code=500,
        content={
            "status_code": 500,
            "detail": "Internal server error",
            "message": str(exc),
        },
    )

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,  # Enable auto-reload during development
        workers=1
    )