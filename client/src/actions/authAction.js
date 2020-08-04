import axios from "axios";
import { GET_ERRORS, SET_CURRENT_USER } from "./types";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";

// Register user
export const registerUser = (userData, history) => (dispatch) => {
  axios
    .post("/api/users/register", userData)
    .then((result) => history.push("/login"))
    .catch((err) =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data.errors,
      })
    );
};

// Login - Get User Token
export const loginUser = (userData, history) => (dispatch) => {
  axios
    .post("/api/users/login", userData)
    .then((result) => {
      // Save Token to local storage
      const { token } = result.data;

      // Set Token to local storage
      localStorage.setItem("jwtToken", token);

      // Set Token to auth header
      setAuthToken(token);

      // Decode token to fet user data
      const decoded = jwt_decode(token);

      // Set current user
      dispatch(setCurrentUser(decoded));
      history.push("/dashboard");
    })
    .catch((err) =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data.errors,
      })
    );
};

// Set logged in user
export const setCurrentUser = (decoded) => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded,
  };
};

// Log user out
export const logoutUser = () => (dispatch) => {
  // Remove token from local storage
  localStorage.removeItem("jwtToken");
  // Remove auth header for future requests
  setAuthToken(false);
  // Set the current user to {} which will set isAuthenticated to false
  dispatch(setCurrentUser({}));
};
