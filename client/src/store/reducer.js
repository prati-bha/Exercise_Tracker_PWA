import { act } from "react-dom/test-utils";
import * as actionTypes from "./actions";

const initialState = {
  email: "",
  password: "",
  token: "",
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.LOGIN:
      return {
        ...state,
        email: action.payload.email,
        password: action.payload.password,
        token: action.payload.token,
      };
    default:
      return state;
  }
};

export default reducer;
