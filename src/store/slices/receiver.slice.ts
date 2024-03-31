import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "..";
import {
  IReceiverFileSetSessionInfoResponse,
  IReceiverSessionInfoResponse,
  IRequestReceiverSessionInfo,
} from "@/api/types/receiverUser.types";
import ReceiverUserAPIs from "@/api/services/receiverUser.api";

export type ReceiverSliceStateType = Pick<RootState, "receiver">;

export interface IReceiverSlice {
  isLoading: boolean;
  sessionInfo: null | IReceiverSessionInfoResponse;
  sessionFiles: IReceiverFileSetSessionInfoResponse | null;
  isUserConfirmed: boolean;
}

const initialState: IReceiverSlice = {
  isLoading: false,
  sessionInfo: null,
  sessionFiles: null,
  isUserConfirmed: false
};

export const requestReceiverFiles = createAsyncThunk(
  "[receiverSlice]: requestReceiverFiles",
  async (
    { receiverId, fileSetSessionId }: IRequestReceiverSessionInfo,
    { rejectWithValue },
  ) => {
    try {
      const res = await ReceiverUserAPIs.RequestSessionFiles({
        receiverId,
        fileSetSessionId,
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  },
);

export const receiverSlice = createSlice({
  name: "[receiverSlice]",
  initialState,
  reducers: {
    setReceiverUserConfimation(state, action) {
      state.isUserConfirmed = action.payload;
    },
    setReceiverSessionInfo(state, action) {
      state.sessionInfo = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(requestReceiverFiles.pending, (draftState) => {
      draftState.isLoading = true;
    });

    builder.addCase(requestReceiverFiles.fulfilled, (draftState, action) => {
      draftState.isLoading = false;
      draftState.sessionFiles = action.payload;
    });

    builder.addCase(requestReceiverFiles.rejected, (draftState) => {
      draftState.sessionFiles = initialState.sessionFiles;
    });
  },
});

export const { setReceiverUserConfimation, setReceiverSessionInfo } =
  receiverSlice.actions;

export const selectReceiverConfimationState = (state: ReceiverSliceStateType) =>
  state.receiver.isUserConfirmed;

export const selectReceiverSessionInfo = (state: ReceiverSliceStateType) =>
  state.receiver.sessionInfo;

export const selectReceiverFileSetSession = (state: ReceiverSliceStateType) =>
  state.receiver.sessionFiles;

export default receiverSlice.reducer;
