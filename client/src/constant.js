export const API_URL = "https://pwa-example28.herokuapp.com";
// export const API_URL = "https://74db17a0755e.ngrok.io";

export const ENDPOINTS = {
  USERS: `${API_URL}/users`,
  CHECK_USERNAME: `${API_URL}/users/username`,
  EXERCISES: `${API_URL}/exercises`,
  ADD_EXERCISE: `${API_URL}/exercises/add`,
  ADD_USER: `${API_URL}/users/add`,
  UPDATE_EXERCISE: `${API_URL}/exercises/update/`,
  SUBSCRIBE: `${API_URL}/subscribe`,
};
export const NEW_EXERCISE_OBJECT_STORE = 'sync-new-exercise-logs';
export const EDITED_EXERCISE_OBJECT_STORE = 'sync-edit-exercise-logs';
export const NEW_EXERCISE_SYNC_TAG = 'sync-new-posts';
export const EDITED_EXERCISE_SYNC_TAG = 'sync-edit-posts';
export const SYNCED_DATABASE = 'exercise-store';

