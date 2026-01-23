import { createSlice } from "@reduxjs/toolkit";

const stored = localStorage.getItem("auth");
const initialState = stored ? JSON.parse(stored) : { token: null, user: null };

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      localStorage.setItem("auth", JSON.stringify({ token: state.token, user: state.user }));
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      localStorage.removeItem("auth");
    }
  }
});

export const { setCredentials, logout } = slice.actions;
export default slice.reducer;
