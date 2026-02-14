import { api } from "../utils/api";

export async function addReview(veterinarianId, reviewerId, reviewInfo) {
  try {
    const token = localStorage.getItem("authToken");
    const response = await api.post(
      `/reviews/submit-review?reviewerId=${reviewerId}&veterinarianId=${veterinarianId}`,
      reviewInfo,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}
