const API_URL = "https://fit-app-backend-babz.onrender.com";
// const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

export const fetchApi = async (
  endpoint: string,
  options: RequestInit
) => {
  const response = await fetch(
    `${API_URL}${endpoint}`,
    options
  );
  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({}));
    console.error("API Error Response:", errorData);
    throw new Error(
      errorData.message ||
        errorData.error ||
        `Error: ${response.statusText}`
    );
  }
  return response.json();
};
