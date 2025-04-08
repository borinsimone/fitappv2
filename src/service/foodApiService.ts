// src/services/foodApiService.ts
import axios from 'axios';

const BASE_URL = 'https://world.openfoodfacts.org/api/v0';

export const searchFoodProducts = async (
  query: string,
  page = 1,
  pageSize = 24
) => {
  try {
    const response = await axios.get(`${BASE_URL}/search`, {
      params: {
        search_terms: query,
        page_size: pageSize,
        page,
        json: true,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error searching food products:', error);
    throw error;
  }
};

export const getProductByBarcode = async (barcode: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/product/${barcode}.json`);
    return response.data;
  } catch (error) {
    console.error('Error fetching product details:', error);
    throw error;
  }
};
