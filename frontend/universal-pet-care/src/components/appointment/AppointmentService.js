import { api } from "../utils/api";

export async function bookAppointment(
  senderId,
  recipientId,
  appointmentRequest,
) {
  try {
    const token = localStorage.getItem("authToken");
    const response = await api.post(
      `/appointments/book-appointment?senderId=${senderId}&recipientId=${recipientId}`,
      appointmentRequest,
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

export const updateAppointment = async (appointmentId, updatedAppointment) => {
  try {
    const response = await api.put(
      `appointments/appointment/${appointmentId}/update`,
      updatedAppointment,
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export async function cancelAppointment(appointmentId) {
  try {
    const response = await api.put(
      `/appointments/appointment/${appointmentId}/cancel`,
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function approveAppointment(appointmentId) {
  try {
    const response = await api.put(
      `/appointments/appointment/${appointmentId}/approve`,
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function declineAppointment(appointmentId) {
  try {
    const response = await api.put(
      `/appointments/appointment/${appointmentId}/decline`,
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getAppointmentById(appointmentId) {
  try {
    const response = await api.get(
      `/appointments/appointment/${appointmentId}/get`,
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function countAppointments() {
  try {
    const response = await api.get(`/appointments/count/appointments`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getAppointmentSummary() {
  try {
    const response = await api.get(
      `/appointments/summary/appointments-summary`,
    );
    return response;
  } catch (error) {
    throw error;
  }
}
