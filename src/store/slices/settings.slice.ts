import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "..";

export type SettingsFormSliceStateType = Pick<RootState, "settings">;

export interface ISettingsSliceState {
  route: {
    animateTo: null | string
  };
}

const initialState: ISettingsSliceState = {
  route: {
    animateTo: null
  },
};

export const settingsSlice = createSlice({
  name: "[settingSlice]",
  initialState,
  reducers: {
    setAnimateTo(state, action) {
      state.route.animateTo = action.payload;
    },
  },
});

export const { setAnimateTo } = settingsSlice?.actions;

export const selectAnimatingToRoute = (state: SettingsFormSliceStateType) => state.settings.route.animateTo;

export default settingsSlice.reducer;
