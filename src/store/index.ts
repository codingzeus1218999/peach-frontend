import {
  PreloadedState,
  combineReducers,
  configureStore,
} from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";

import { ENV_CONSTANTS } from "@/common/constants/env.const";

import senderFormReducer from "./slices/senderForm.slice";
import receiverReducer from "./slices/receiver.slice";
import settingsSlice from "./slices/settings.slice";

const rootReducer = combineReducers({
  senderForm: senderFormReducer,
  receiver: receiverReducer,
  settings: settingsSlice,
});

export const setupStore = (preloadedState?: PreloadedState<RootState>) => {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
    devTools: ENV_CONSTANTS.IS_DEV_MODE || false,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ serializableCheck: false }),
  });
};

const store = setupStore();

export default store;

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore["dispatch"];

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
