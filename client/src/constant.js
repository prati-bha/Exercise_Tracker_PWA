// export const API_URL = "https://exercise-tracker-mern-stack.herokuapp.com";
export const API_URL = "http://localhost:2910";

export const ENDPOINTS = {
  LOGIN: `${API_URL}/users/login`,
  SIGN_UP: `${API_URL}/users/signUp`,
  USERS: `${API_URL}/users`,
  CHECK_USERNAME: `${API_URL}/users/username`,
  EXERCISES: `${API_URL}/exercises`,
  ADD_EXERCISE: `${API_URL}/exercises/add`,
  UPDATE_EXERCISE: `${API_URL}/exercises/update/`,
  LOGOUT: `${API_URL}/users/logout`,
  SUBSCRIBE: `${API_URL}/subscribe`,
};

export const getToken = {
  Authorization: `Bearer ${localStorage.getItem("token")}`,
};
