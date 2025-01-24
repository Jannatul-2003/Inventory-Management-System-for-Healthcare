import os
import psycopg2
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv
from contextlib import contextmanager
import logging

# Load environment variables from .env file
load_dotenv()

# Database configuration
DB_CONFIG = {
    'dbname': os.getenv('DB_NAME'),
    'user': os.getenv('DB_USER'),
    'password': os.getenv('DB_PASSWORD'),
    'host': os.getenv('DB_HOST', 'localhost'),
    'port': os.getenv('DB_PORT', '5432')
}

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@contextmanager
def get_db_connection():
    """
    Context manager for database connections.
    Ensures that connections are properly closed after use.
    Returns a connection with RealDictCursor for dictionary-like results.
    """
    conn = None
    try:
        conn = psycopg2.connect(
            **DB_CONFIG,
            cursor_factory=RealDictCursor
        )
        yield conn
    except psycopg2.Error as e:
        logger.error(f"Database connection error: {e}")
        raise
    finally:
        if conn is not None:
            conn.close()
            logger.debug("Database connection closed")

@contextmanager
def get_db_cursor():
    """
    Context manager for database cursors.
    Automatically handles connection and cursor cleanup.
    """
    with get_db_connection() as conn:
        cur = conn.cursor()
        try:
            yield cur
            conn.commit()
        except psycopg2.Error as e:
            conn.rollback()
            logger.error(f"Database error: {e}")
            raise
        finally:
            cur.close()

def execute_query(query: str, params: tuple = None):
    """
    Execute a query and return all results.
    
    Args:
        query (str): SQL query to execute
        params (tuple, optional): Parameters for the query
    
    Returns:
        list: Query results as a list of dictionaries
    """
    try:
        with get_db_cursor() as cur:
            cur.execute(query, params)
            if cur.description:  # If the query returns data
                return cur.fetchall()
            return None
    except psycopg2.Error as e:
        logger.error(f"Query execution error: {e}")
        logger.error(f"Query: {query}")
        logger.error(f"Parameters: {params}")
        raise

def execute_batch(query: str, params_list: list):
    """
    Execute a batch operation with multiple sets of parameters.
    
    Args:
        query (str): SQL query to execute
        params_list (list): List of parameter tuples
    """
    try:
        with get_db_cursor() as cur:
            psycopg2.extras.execute_batch(cur, query, params_list)
    except psycopg2.Error as e:
        logger.error(f"Batch execution error: {e}")
        logger.error(f"Query: {query}")
        logger.error(f"Parameters: {params_list}")
        raise

def test_connection():
    """
    Test the database connection and return version info.
    """
    try:
        with get_db_cursor() as cur:
            cur.execute('SELECT version();')
            version = cur.fetchone()
            logger.info(f"Successfully connected to PostgreSQL. Version: {version}")
            return True
    except psycopg2.Error as e:
        logger.error(f"Connection test failed: {e}")
        return False

# Example .env file content (create a .env file with these variables):
"""
DB_NAME=your_database_name
DB_USER=your_username
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
"""

if __name__ == "__main__":
    # Test the connection when the file is run directly
    test_connection()


