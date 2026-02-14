import { api } from "../utils/api";

export async function getPatients() {
  try {
    const response = await api.get("/patients/get-all-patients");
    return response.data;
  } catch (error) {
    throw error;
  }
}
