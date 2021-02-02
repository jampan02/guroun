import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../app/store";

interface USER {
  displayName: string;
  photoUrl: string;
}

interface DOC {
  docName: string;
}
export const userSlice = createSlice({
  name: "user",
  initialState: {
    user: { photoUrl: "", displayName: "" },
    doc: { docName: "" },
  },
  reducers: {
    login: (state, action: PayloadAction<USER>) => {
      state.user.displayName = action.payload.displayName;
      state.user.photoUrl = action.payload.photoUrl;
    },
    logout: (state) => {
      state.user.displayName = "";
      state.user.photoUrl = "";
    },
    updateUserProfile: (state, action: PayloadAction<USER>) => {
      state.user.displayName = action.payload.displayName;
      state.user.photoUrl = action.payload.photoUrl;
    },
    //docnameセット
    setDocName: (state, action: PayloadAction<DOC>) => {
      state.doc.docName = action.payload.docName;
    },
  },
});

export const {
  login,
  logout,
  updateUserProfile,
  setDocName,
} = userSlice.actions;

export const selectUser = (state: RootState) => state.user.user;

export const selectDocName = (state: RootState) => state.user.doc;

export default userSlice.reducer;
