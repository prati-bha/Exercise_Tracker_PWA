// export const API_URL = "https://exercise-tracker-mern-stack.herokuapp.com";
export const API_URL = "http://localhost:2810";

export const ENDPOINTS = {
  LOGIN: `${API_URL}/users/login`,
  SIGN_UP: `${API_URL}/users/signUp`,
  USERS: `${API_URL}/users`,
  CHECK_USERNAME: `${API_URL}/users/username`,
  EXERCISES: `${API_URL}/exercises`,
  ADD_EXERCISE: `${API_URL}/exercises/add`,
  UPDATE_EXERCISE: `${API_URL}/exercises/update/`,
};

export const getToken = {
  Authorization: `Bearer ${localStorage.getItem("token")}`,
};
