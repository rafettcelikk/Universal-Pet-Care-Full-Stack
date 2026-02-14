import { api } from "../utils/api";

export async function getPetTypes() {
  try {
    const response = await api.get("/pets/get-pet-types");
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getPetColors() {
  try {
    const response = await api.get("/pets/get-pet-colors");
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getPetBreeds(petType) {
  try {
    const response = await api.get(`/pets/get-pet-breeds?petType=${petType}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function deletePet(petId) {
  try {
    const response = await api.delete(`/pets/pet/${petId}/delete`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function updatePet(petId, petData) {
  try {
    const response = await api.put(`/pets/pet/${petId}/update`, petData);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function savePet(appointmentId, petData) {
  try {
    const response = await api.post(
      `/pets/pet/${appointmentId}/save-pet`,
      [petData],
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}
