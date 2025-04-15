const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const request = async (url: string, options?: RequestInit) => {
  const response = await fetch(BASE_URL + url, options);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'API request failed');
  }
  return response.json();
};
