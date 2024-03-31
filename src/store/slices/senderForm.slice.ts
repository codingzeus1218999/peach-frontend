import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "..";
import {
  ICreateFilesetSessionRequest,
  ICreateFilesetSessionResponse,
  IRegisterNewSenderResponse,
} from "@/api/types/senderUser.types";
import SenderUserAPIs from "@/api/services/senderUser.api";
import dayjs from "dayjs";
import { FileSetSessionStatus } from "@/common/constants/enums";

export type SenderFormSliceStateType = Pick<RootState, "senderForm">;

interface ISubmissionStruct {
  isLoading: boolean;
  senderInfo: IRegisterNewSenderResponse | null;
  filesetSession: ICreateFilesetSessionResponse | null;
  sessionInfo: {
    expirationDate: string | null;
    shortLink: string | null;
  };
}

interface IQCProgressStruct {
  status: FileSetSessionStatus | string;
  fileStatus: {
    [fileName: string]: FileSetSessionStatus;
  };
}

export interface ISenderFormSliceState {
  files: {
    isLoading: boolean;
    count: number;
    list: File[];
    totalSize: number;
  };
  errors: {
    status: "visible" | "hide";
    message: string;
  };
  message: string;
  receivers: {
    isValid: boolean;
    value: string[];
    isAlertDisplayed: boolean;
  };
  sender: {
    isValid: boolean;
    value: string;
    isAlertDisplayed: boolean;
  };
  submission: ISubmissionStruct;
  qcProgress: IQCProgressStruct;
}

const initialState: ISenderFormSliceState = {
  files: {
    isLoading: false,
    count: 0,
    list: [],
    totalSize: 0,
  },
  errors: {
    status: "hide",
    message: "",
  },
  message: "",
  receivers: {
    isValid: false,
    value: [],
    isAlertDisplayed: false,
  },
  sender: {
    isValid: false,
    value: "",
    isAlertDisplayed: false,
  },
  submission: {
    isLoading: false,
    senderInfo: null,
    filesetSession: null,
    sessionInfo: {
      expirationDate: null,
      shortLink: null,
    },
  },
  qcProgress: {
    status: "",
    fileStatus: {},
  },
};

const sliceClearState = { ...initialState };

export type TSubmitSenderFormProps = {
  senderEmail: string;
  fileSetSessionData: Omit<ICreateFilesetSessionRequest, "sender">;
};

export type TQCProps = {
  senderId: string;
  fileSetSessionId: string;
};

export const submitSenderForm = createAsyncThunk(
  "[senderForm] submitForm",
  async (
    { senderEmail, fileSetSessionData }: TSubmitSenderFormProps,
    { rejectWithValue },
  ) => {
    try {
      const { data: registeredSender } = await SenderUserAPIs.RegisterNewSender(
        {
          email: senderEmail,
        },
      );

      const { data: filesetSessionData } =
        await SenderUserAPIs.CreateFilesetSession(registeredSender.id, {
          sender: { id: registeredSender.id },
          ...fileSetSessionData,
        });

      return {
        isLoading: false,
        filesetSession: filesetSessionData,
        senderInfo: registeredSender,
        sessionInfo: {
          expirationDate: dayjs()
            .add(fileSetSessionData.days_to_expire, "day")
            .format("HH:mm A, DD MMM YYYY"),
          shortLink: null,
        },
      } as ISubmissionStruct;
    } catch (err) {
      return rejectWithValue(err);
    }
  },
);

export const requestQC = createAsyncThunk(
  "[QC]: requestQC",
  async ({ senderId, fileSetSessionId }: TQCProps, { rejectWithValue }) => {
    try {
      await SenderUserAPIs.RequestQC(senderId, fileSetSessionId);
      return {
        status: FileSetSessionStatus.IN_PROGRESS,
      };
    } catch (err) {
      return rejectWithValue(err);
    }
  },
);

export const getFileSetSessionStatus = createAsyncThunk(
  "[QC]: filesetSessionStatus",
  async ({ senderId, fileSetSessionId }: TQCProps, { rejectWithValue }) => {
    try {
      const qcProgress: IQCProgressStruct = { status: "", fileStatus: {} };
      const { data: filesetSessionStatus } =
        await SenderUserAPIs.GetFilesetSessionStatus(
          senderId,
          fileSetSessionId,
        );
      qcProgress.status = filesetSessionStatus.status as FileSetSessionStatus;
      filesetSessionStatus.files.forEach((file) => {
        qcProgress.fileStatus = {
          ...qcProgress.fileStatus,
          [file.name]: file.status as FileSetSessionStatus,
        };
      });
      return qcProgress;
    } catch (err) {
      rejectWithValue(err);
    }
  },
);

export const getCancelQCRequest = createAsyncThunk(
  "[QC]: getCancelQCRequest",
  async ({ senderId, fileSetSessionId }: TQCProps, { rejectWithValue }) => {
    try {
      const qcProgress: IQCProgressStruct = { status: "", fileStatus: {} };
      const { data: filesetSessionStatus } =
        await SenderUserAPIs.RequestCancelQC(senderId, fileSetSessionId);
      qcProgress.status = filesetSessionStatus.status as FileSetSessionStatus;
      filesetSessionStatus.files.forEach((file) => {
        qcProgress.fileStatus = {
          ...qcProgress.fileStatus,
          [file.name]: file.status as FileSetSessionStatus,
        };
      });
      return qcProgress;
    } catch (err) {
      rejectWithValue(err);
    }
  },
);

export const senderFormSlice = createSlice({
  name: "[senderForm]",
  initialState,
  reducers: {
    setSelectedFiles(state, action) {
      let temp: File[] = [];
      if (action.payload.length !== 0) {
        temp = Array.from(action.payload);
      }
      temp = [...temp, ...state.files.list];
      state.files.list = temp;
      state.files.count = temp.length;
      state.files.totalSize = temp.reduce((acc, cur) => acc + cur.size, 0);
    },
    clearAllFiles(state) {
      state.files.list = [];
      state.files.count = 0;
      state.files.totalSize = 0;
    },
    removeSingleFile(state, action) {
      const filteredFiles = state.files.list.filter(
        (_, key) => key !== action.payload,
      );
      state.files.list = filteredFiles;
      state.files.totalSize = filteredFiles.reduce(
        (acc, cur) => acc + cur.size,
        0,
      );
      state.files.count = filteredFiles.length;
    },
    setError(
      state,
      action: { payload: Partial<ISenderFormSliceState["errors"]> },
    ) {
      if (action.payload.status) {
        state.errors.status = action.payload.status;
      }
      if (action.payload.message) state.errors.message = action.payload.message;
    },

    setMessage(state, action) {
      state.message = action.payload;
    },

    setReceiversEmails(state, action) {
      state.receivers.value = action.payload;
    },
    setReceiversEmailsValidity(state, action) {
      state.receivers.isValid = action.payload;
    },
    setReceiversEmailsAlertState(state, action) {
      state.receivers.isAlertDisplayed = action.payload;
    },
    setSenderEmail(state, action) {
      state.sender.value = action.payload;
    },
    setSenderEmailValidity(state, action) {
      state.sender.isValid = action.payload;
    },
    setSenderEmailAlertState(state, action) {
      state.sender.isAlertDisplayed = action.payload;
    },
    clearUploadSubmissionData(state) {
      state.submission = {
        isLoading: false,
        senderInfo: null,
        filesetSession: null,
        sessionInfo: {
          shortLink: null,
          expirationDate: null,
        },
      };
    },
    setQCStatus(state, action) {
      state.qcProgress.status = action.payload;
    },
    removeItemFromFileQcState(state, action) {
      const tempFileStatus: { [x: string]: FileSetSessionStatus } = {};
      let isAllPropsAreSafe = true;
      for (const [key, value] of Object.entries(
        state.qcProgress.fileStatus || {},
      )) {
        if (key !== action.payload) tempFileStatus[key] = value;
      }

      for (const [key, value] of Object.entries(tempFileStatus)) {
        if (tempFileStatus[key] === FileSetSessionStatus.FAILED)
          isAllPropsAreSafe = false;
      }

      if (isAllPropsAreSafe) {
        state.qcProgress.status = "";
      }
      state.qcProgress.fileStatus = tempFileStatus;
    },
    clearQCState(state) {
      state.qcProgress = initialState.qcProgress;
    },
    resetSenderForm(state) {
      state.files = sliceClearState.files;
      state.message = sliceClearState.message;
      state.receivers = sliceClearState.receivers;
      state.sender = sliceClearState.sender;
      state.submission = sliceClearState.submission;
      state.qcProgress = sliceClearState.qcProgress;
      state.errors = sliceClearState.errors;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(submitSenderForm.pending, (draftState) => {
      draftState.submission.isLoading = true;
    });

    builder.addCase(submitSenderForm.fulfilled, (draftState, action) => {
      draftState.submission.isLoading = false;
      if (action.payload) draftState.submission = action.payload;
    });

    builder.addCase(submitSenderForm.rejected, (draftState) => {
      draftState.submission = initialState.submission;
    });

    builder.addCase(requestQC.pending, (draftState) => {
      draftState.qcProgress.status = FileSetSessionStatus.WAITING;
    });

    builder.addCase(requestQC.fulfilled, (draftState, action) => {
      draftState.qcProgress.status = action.payload.status;
    });

    builder.addCase(getFileSetSessionStatus.fulfilled, (draftState, action) => {
      draftState.qcProgress = action.payload || draftState.qcProgress;
    });

    builder.addCase(getCancelQCRequest.fulfilled, (draftState, action) => {
      draftState.qcProgress = action.payload || draftState.qcProgress;
    });
  },
});

export const {
  setSelectedFiles,
  clearAllFiles,
  removeSingleFile,
  setError,
  setMessage,
  setReceiversEmails,
  setReceiversEmailsValidity,
  setReceiversEmailsAlertState,
  setSenderEmail,
  setSenderEmailValidity,
  setSenderEmailAlertState,
  clearUploadSubmissionData,
  setQCStatus,
  removeItemFromFileQcState,
  clearQCState,
  resetSenderForm,
} = senderFormSlice?.actions;

export const selectFilesList = (s: SenderFormSliceStateType) =>
  s.senderForm.files.list;

export const selectSelectedFilesCount = (s: SenderFormSliceStateType) =>
  s.senderForm.files.count;

export const selectIsAnyFilesSelected = (s: SenderFormSliceStateType) =>
  s.senderForm.files.count !== 0;

export const selectAllFileNames = (s: SenderFormSliceStateType) =>
  (s.senderForm.files.list.map((item) =>
    item?.name?.toLocaleLowerCase(),
  ) as string[]) || [];

export const selectTotalFileSizesInGB = (s: SenderFormSliceStateType) =>
  s.senderForm.files.totalSize;

export const selectErrorStatus = (s: SenderFormSliceStateType) =>
  s.senderForm.errors.status;

export const selectErrorMessage = (s: SenderFormSliceStateType) =>
  s.senderForm.errors.message;

export const selectMessage = (s: SenderFormSliceStateType) =>
  s.senderForm.message;

export const selectReceiversField = (s: SenderFormSliceStateType) =>
  s.senderForm.receivers;

export const selectSenderField = (s: SenderFormSliceStateType) =>
  s.senderForm.sender;

export const selectSenderSubmissionState = (s: SenderFormSliceStateType) =>
  s.senderForm.submission;

export const selectQCStatus = (s: SenderFormSliceStateType) =>
  s.senderForm.qcProgress.status;

export const selectFilesQCStatus = (s: SenderFormSliceStateType) => {
  return s.senderForm.qcProgress.fileStatus;
};

export default senderFormSlice.reducer;
