import axios from "axios";

const API_BASE_URL = "http://localhost:8000";

export const fetchDocuments = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    console.error("No token found. User not logged in.");
    return [];
  }

  try {
    const response = await axios.get(`${API_BASE_URL}/documents/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;

  } catch (error) {
    console.error("Fetch documents error:", error);
    return [];
  }
};
