import { api } from "../utils/api";

export async function getVeterinarians() {
  try {
    const response = await api.get("/veterinarians/get-all-veterinarians");
    console.log("Sonuçlar " + response);
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function findAvailableVeterinarians(searchParams) {
  try {
    const queryParams = new URLSearchParams(searchParams);
    const response = await api.get(
      `/veterinarians/search-veterinarian?${queryParams}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const getAllSpecializations = async () => {
  try {
    const response = await api.get("/veterinarians/get-all-specializations");
    return response;
  } catch (error) {
    throw error;
  }
};
