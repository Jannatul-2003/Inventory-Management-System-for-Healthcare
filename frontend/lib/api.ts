// API service for interacting with the backend
const API_BASE_URL = "http://localhost:8000/api/v1"

export const fetchData = async <T>(endpoint: string)
: Promise<T> =>
{
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching data from ${endpoint}:`, error)
    throw error
  }
}

export const postData = async <T>(endpoint: string, data: any)
: Promise<T> =>
{
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`)
    }
    return await response.json();
  } catch (error) {
    console.error(`Error posting data to ${endpoint}:`, error)
    throw error
  }
}

export const putData = async <T>(endpoint: string, data: any)
: Promise<T> =>
{
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`)
    }
    return await response.json();
  } catch (error) {
    console.error(`Error updating data at ${endpoint}:`, error)
    throw error
  }
}

export const deleteData = async (endpoint: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`)
    }
  } catch (error) {
    console.error(`Error deleting data at ${endpoint}:`, error)
    throw error
  }
}

