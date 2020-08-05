import axios from "axios";
import {
  CLEAR_CURRENT_PROFILE,
  GET_PROFILE,
  PROFILE_LOADING,
  GET_ERRORS,
  SET_CURRENT_USER,
} from "./types";

// Get current profile
export const getCurrentProfile = () => (dispatch) => {
  dispatch(setProfileLaoding());
  axios
    .get("/api/profile/")
    .then((res) =>
      dispatch({
        type: GET_PROFILE,
        payload: res.data,
      })
    )
    .catch((err) =>
      dispatch({
        type: GET_PROFILE,
        payload: {},
      })
    );
};

// Create profile
export const createProfile = (profileData, history) => (dispatch) => {
  axios
    .post("/api/profile", profileData)
    .then((res) => history.push("/dashboard"))
    .catch((err) =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      })
    );
};

// Delete account & profile
export const deleteAccount = () => (dispatch) => {
  if (window.confirm("Are you sure? This cannot be undone!")) {
    axios
      .delete("/api/profile")
      .then((res) =>
        dispatch({
          type: SET_CURRENT_USER,
          payload: {},
        })
      )
      .catch((err) =>
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data,
        })
      );
  }
};

// Profile loading
export const setProfileLaoding = () => {
  return {
    type: PROFILE_LOADING,
  };
};

// Clear profile
export const clearCurrentProfile = () => {
  return {
    type: CLEAR_CURRENT_PROFILE,
  };
};
