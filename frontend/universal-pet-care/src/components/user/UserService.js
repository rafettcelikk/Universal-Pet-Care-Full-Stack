import { api } from "../utils/api";

export async function getUserById(userId) {
  try {
    const response = await api.get(`/users/user/${userId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function registerUser(user) {
  try {
    const response = await api.post("/users/register", user);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function updateUser(user, userId) {
  try {
    const response = await api.put(`/users/user/${userId}/update`, user);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function deleteUser(userId) {
  try {
    const response = await api.delete(`/users/user/${userId}/delete`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function changeUserPassword(
  userId,
  currentPassword,
  newPassword,
  confirmNewPassword,
) {
  try {
    const requestData = {
      currentPassword,
      newPassword,
      confirmNewPassword,
    };
    const response = await api.put(
      `/users/user/${userId}/change-password`,
      requestData,
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function countVeterinarians() {
  try {
    const response = await api.get("/users/count/veterinarians");
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function countPatients() {
  try {
    const response = await api.get("/users/count/patients");
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function countAllUsers() {
  try {
    const response = await api.get("/users/count/all-users");
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getAggregateUsersByMonthAndType() {
  try {
    const response = await api.get("/users/aggregated-users");
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getAggregateUsersAccountByActiveStatus() {
  try {
    const response = await api.get("/users/account/aggregated-by-status");
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getAggregateVetBySpecialization() {
  try {
    const response = await api.get(
      "/veterinarians/aggregated-by-specialization",
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function lockUserAccount(userId) {
  try {
    const response = await api.put(`/users/user/${userId}/lock-account`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function unlockUserAccount(userId) {
  try {
    const response = await api.put(`/users/user/${userId}/unlock-account`);
    return response.data;
  } catch (error) {
    throw error;
  }
}
