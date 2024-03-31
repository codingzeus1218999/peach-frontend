import { FileSetSessionStatus } from "@/common/constants/enums";
import { prepareSomeFilesForInput } from "@/components/senderForm/senderForm.utils";
import reducer, {
  ISenderFormSliceState,
  clearAllFiles,
  clearQCState,
  clearUploadSubmissionData,
  removeItemFromFileQcState,
  removeSingleFile,
  selectAllFileNames,
  selectErrorMessage,
  selectErrorStatus,
  selectFilesList,
  selectFilesQCStatus,
  selectIsAnyFilesSelected,
  selectMessage,
  selectQCStatus,
  selectReceiversField,
  selectSelectedFilesCount,
  selectSenderField,
  selectSenderSubmissionState,
  selectTotalFileSizesInGB,
  setError,
  setMessage,
  setQCStatus,
  setReceiversEmails,
  setReceiversEmailsAlertState,
  setReceiversEmailsValidity,
  setSelectedFiles,
  setSenderEmail,
  setSenderEmailAlertState,
  setSenderEmailValidity,
  submitSenderForm,
  requestQC,
  getFileSetSessionStatus,
  getCancelQCRequest,
  resetSenderForm,
} from "@/store/slices/senderForm.slice";

import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import store from "@/store";

describe("Redux Slice: SenderForm", () => {
  let AxiosMock: MockAdapter;
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

  beforeEach(() => {
    AxiosMock = new MockAdapter(axios);
  });

  afterEach(() => {
    AxiosMock.reset();
  });

  it("should return the initial state", () => {
    expect(reducer(undefined, { type: undefined })).toEqual(initialState);
  });

  describe("Actions", () => {
    it("Given Action: setSelectedFiles, Then it should fill the files in the reducer", () => {
      const file = prepareSomeFilesForInput();
      expect(reducer(initialState, setSelectedFiles([file])).files).toEqual({
        count: 1,
        isLoading: false,
        list: [file],
        totalSize: 12,
      });
    });

    it("Given Action: clearAllFiles, Then it should removeAllFiles from the reducer", () => {
      expect(reducer(initialState, clearAllFiles()).files).toEqual(
        initialState.files,
      );
    });

    it("Given Action: removeSingleFile, Then it should remove the exact file from the reducer", () => {
      const tempState = { ...initialState };
      const file1: any = prepareSomeFilesForInput();
      const file2: any = prepareSomeFilesForInput();
      tempState.files = {
        isLoading: false,
        count: 2,
        list: [file1, file2],
        totalSize: 24,
      };

      const expectedState = { ...tempState };
      expectedState.files = {
        isLoading: false,
        count: 1,
        list: [file2],
        totalSize: 12,
      };
      expect(reducer(tempState, removeSingleFile(0)).files).toEqual(
        expectedState.files,
      );
    });

    it("Given Action: setError, Then it should set the global form error data to the reducer", () => {
      expect(
        reducer(
          initialState,
          setError({
            status: "visible",
            message: "test",
          }),
        ).errors,
      ).toEqual({
        status: "visible",
        message: "test",
      });
    });

    it("Given Action: setMessage, Then it should set the message to the form data", () => {
      expect(reducer(initialState, setMessage("test Message")).message).toEqual(
        "test Message",
      );
    });

    it("Given Action: setReceiversEmails, Then it should set the receivers emails to the form data", () => {
      expect(
        reducer(initialState, setReceiversEmails(["a@b.com", "c@d.com"]))
          .receivers,
      ).toEqual({
        isValid: false,
        value: ["a@b.com", "c@d.com"],
        isAlertDisplayed: false,
      });
    });

    it("Given Action: setReceiversEmailsValidity, Then it should set the isValid flag to the form data for the receivers", () => {
      expect(
        reducer(initialState, setReceiversEmailsValidity(false)).receivers,
      ).toEqual({
        isValid: false,
        value: [],
        isAlertDisplayed: false,
      });
    });
    it("Given Action: setReceiversEmailsAlertState, Then it should set the isAlertDisplayed flag to the form data for the receivers", () => {
      expect(
        reducer(initialState, setReceiversEmailsAlertState(true)).receivers,
      ).toEqual({
        isValid: false,
        value: [],
        isAlertDisplayed: true,
      });
    });

    it("Given Action: setSenderEmail, Then it should set the sender email to the form data", () => {
      expect(reducer(initialState, setSenderEmail("a@b.com")).sender).toEqual({
        isValid: false,
        value: "a@b.com",
        isAlertDisplayed: false,
      });
    });

    it("Given Action: setSenderEmailValidity, Then it should set the isValid flag to the form data for the sender", () => {
      expect(
        reducer(initialState, setSenderEmailValidity(false)).sender,
      ).toEqual({
        isValid: false,
        value: "",
        isAlertDisplayed: false,
      });
    });

    it("Given Action: setSenderEmailAlertState, Then it should set the isAlertDisplayed flag to the form data for the sender", () => {
      expect(
        reducer(initialState, setSenderEmailAlertState(true)).sender,
      ).toEqual({
        isValid: false,
        value: "",
        isAlertDisplayed: true,
      });
    });

    it("Given Action: clearUploadSubmissionData, Then it should set the submission state with the initial state value", () => {
      expect(
        reducer(initialState, clearUploadSubmissionData()).submission,
      ).toEqual({
        isLoading: false,
        senderInfo: null,
        filesetSession: null,
        sessionInfo: {
          shortLink: null,
          expirationDate: null,
        },
      });
    });

    it("Given Action: setQCStatus, Then it should set the qcProgress state with the input value", () => {
      expect(
        reducer(initialState, setQCStatus(FileSetSessionStatus.IN_PROGRESS))
          .qcProgress,
      ).toEqual({
        status: FileSetSessionStatus.IN_PROGRESS,
        fileStatus: {},
      });
    });

    it("Given Action: removeItemFromFileQcState, Then it should remove that exact file name from the qcProgress state", () => {
      expect(
        reducer(
          {
            ...initialState,
            qcProgress: {
              status: "",
              fileStatus: {
                "a.test": FileSetSessionStatus.FAILED,
                "b.zip": FileSetSessionStatus.IN_PROGRESS,
              },
            },
          },
          removeItemFromFileQcState("a.test"),
        ).qcProgress,
      ).toEqual({
        status: "",
        fileStatus: {
          "b.zip": FileSetSessionStatus.IN_PROGRESS,
        },
      });
    });

    it(`
    Given Action: removeItemFromFileQcState, 
    When there is only one file under fileStatus and the global status is failed, 
    then by removing the only remained file status from the store,
    the QC Status will be cleared too.
    `, () => {
      expect(
        reducer(
          {
            ...initialState,
            qcProgress: {
              status: FileSetSessionStatus.FAILED,
              fileStatus: {
                "b.zip": FileSetSessionStatus.FAILED,
              },
            },
          },
          removeItemFromFileQcState("b.zip"),
        ).qcProgress,
      ).toEqual({
        status: "",
        fileStatus: {},
      });
    });

    it("Given Action: clearQCState, Then it should reset the qcProgress state to the initial value", () => {
      expect(
        reducer(
          {
            ...initialState,
            qcProgress: {
              status: "",
              fileStatus: {
                "a.test": FileSetSessionStatus.FAILED,
                "b.zip": FileSetSessionStatus.IN_PROGRESS,
              },
            },
          },
          clearQCState(),
        ).qcProgress,
      ).toEqual({
        status: "",
        fileStatus: {},
      });
    });

    it("Given Action: resetSenderForm, Then it should reset the whole state to initial state", () => {
      expect(
        reducer(
         initialState,
         resetSenderForm(),
        ),
      ).toEqual(initialState);
    });
  });

  describe("Selectors", () => {
    it("Given Selector: selectFilesList, then it should return the related part from redux slice", () => {
      expect(selectFilesList({ senderForm: initialState })).toEqual(
        initialState.files.list,
      );
    });
    it("Given Selector: selectSelectedFilesCount, then it should return the related part from redux slice", () => {
      expect(selectSelectedFilesCount({ senderForm: initialState })).toEqual(
        initialState.files.count,
      );
    });
    it("Given Selector: selectIsAnyFilesSelected, then it should return the related part from redux slice", () => {
      expect(selectIsAnyFilesSelected({ senderForm: initialState })).toEqual(
        false,
      );
    });
    it("Given Selector: selectTotalFileSizesInGB, then it should return the related part from redux slice", () => {
      expect(selectTotalFileSizesInGB({ senderForm: initialState })).toEqual(
        initialState.files.totalSize,
      );
    });
    it("Given Selector: selectAllFileNames, then it should return the all filenames from the input file list", () => {
      const newList = {
        ...initialState,
        files: {
          isLoading: false,
          count: 2,
          list: [
            prepareSomeFilesForInput("a.js"),
            prepareSomeFilesForInput("B.js"),
          ],
          totalSize: 0,
        },
      };
      expect(selectAllFileNames({ senderForm: newList })).toEqual([
        "a.js",
        "b.js",
      ]);
    });
    it("Given Selector: selectErrorStatus, then it should return the related part from redux slice", () => {
      expect(selectErrorStatus({ senderForm: initialState })).toEqual(
        initialState.errors.status,
      );
    });
    it("Given Selector: selectErrorMessage, then it should return the related part from redux slice", () => {
      expect(selectErrorMessage({ senderForm: initialState })).toEqual(
        initialState.errors.message,
      );
    });
    it("Given Selector: selectMessage, then it should return the related part from redux slice", () => {
      expect(selectMessage({ senderForm: initialState })).toEqual(
        initialState.message,
      );
    });
    it("Given Selector: selectReceiversField, then it should return the related part from redux slice", () => {
      expect(selectReceiversField({ senderForm: initialState })).toEqual(
        initialState.receivers,
      );
    });
    it("Given Selector: selectSenderField, then it should return the related part from redux slice", () => {
      expect(selectSenderField({ senderForm: initialState })).toEqual(
        initialState.sender,
      );
    });
    it("Given Selector: selectSenderSubmissionState, then it should return the related part from redux slice", () => {
      expect(selectSenderSubmissionState({ senderForm: initialState })).toEqual(
        initialState.submission,
      );
    });
    it("Given Selector: selectQCStatus, then it should return the related part from redux slice", () => {
      expect(selectQCStatus({ senderForm: initialState })).toEqual(
        initialState.qcProgress.status,
      );
    });
    it("Given Selector: selectFilesQCStatus, then it should return the related part from redux slice", () => {
      expect(selectFilesQCStatus({ senderForm: initialState })).toEqual(
        initialState.qcProgress.fileStatus,
      );
    });
  });

  describe("Async Thunks", () => {
    it("Thunk call for: submitSenderForm => Success", async () => {
      const fileSetSession = {
        senderEmail: "test@peach.com",
        fileSetSessionData: {
          receivers: ["receiver@peach.com"],
          files: [
            {
              name: "a.zip",
              size: 123,
            },
          ],
          message: "string",
          days_to_expire: 14,
        },
      };
      AxiosMock.onPost("/user/sender", {
        email: "test@peach.com",
      }).reply(200, {
        id: "aa_bb_cc",
        email: "test@peach.com",
        firstname: null,
        lastname: null,
      });
      AxiosMock.onPost(
        "/user/sender/aa_bb_cc/filesetsession",
        {
          sender: { id: "aa_bb_cc" },
          ...fileSetSession.fileSetSessionData,
        },
      ).reply(200, {
        id: "dd_ee_ff",
        files: [
          {
            name: "a.zip",
            size: 123,
            url: "testUpload.peachgo.me",
          },
        ],
      });

      await store.dispatch(submitSenderForm(fileSetSession));

      let state = await store.getState().senderForm;

      expect(state.submission.senderInfo).toEqual({
        id: "aa_bb_cc",
        email: "test@peach.com",
        firstname: null,
        lastname: null,
      });
      expect(state.submission.filesetSession).toEqual({
        id: "dd_ee_ff",
        files: [
          {
            name: "a.zip",
            size: 123,
            url: "testUpload.peachgo.me",
          },
        ],
      });
    });

    it("Thunk call for: submitSenderForm => Reject", async () => {
      const fileSetSession = {
        senderEmail: "test@peach.com",
        fileSetSessionData: {
          receivers: ["receiver@peach.com"],
          files: [
            {
              name: "a.zip",
              size: 123,
            },
          ],
          message: "string",
          days_to_expire: 14,
        },
      };
      AxiosMock.onPost("/user/sender", {
        email: "test@peach.com",
      }).reply(500);
      AxiosMock.onPost(
        "/user/sender/aa_bb_cc/filesetsession",
        {
          sender: { id: "aa_bb_cc" },
          ...fileSetSession.fileSetSessionData,
        },
      ).reply(500);

      await store.dispatch(submitSenderForm(fileSetSession));

      let state = await store.getState().senderForm;

      expect(state.submission).toEqual(initialState.submission);
    });

    it("Thunk call for: requestQC", async () => {
      const reqInfo = {
        senderId: "aa_bb_cc",
        fileSetSessionId: "dd_ee_ff",
      };
      AxiosMock.onPost(
        "/user/sender/aa_bb_cc/filesetsession/dd_ee_ff",
      ).reply(200, {
        status: FileSetSessionStatus.IN_PROGRESS,
      });

      await store.dispatch(requestQC(reqInfo));

      let state = await store.getState().senderForm;

      expect(state.qcProgress).toEqual({
        status: FileSetSessionStatus.IN_PROGRESS,
        fileStatus: {},
      });
    });

    it("Thunk call for: getFileSetSessionStatus", async () => {
      const reqInfo = {
        senderId: "aa_bb_cc",
        fileSetSessionId: "dd_ee_ff",
      };
      AxiosMock.onGet(
        "/user/sender/aa_bb_cc/filesetsession/dd_ee_ff",
      ).reply(200, {
        id: "dd_ee_ff",
        status: FileSetSessionStatus.FAILED,
        files: [
          {
            name: "a.zip",
            size: 123,
            status: FileSetSessionStatus.FAILED,
          },
        ],
      });

      await store.dispatch(getFileSetSessionStatus(reqInfo));

      let state = await store.getState().senderForm;

      expect(state.qcProgress).toEqual({
        status: FileSetSessionStatus.FAILED,
        fileStatus: {
          "a.zip": FileSetSessionStatus.FAILED,
        },
      });
    });

    it("Thunk call for: getCancelQCRequest", async () => {
      const reqInfo = {
        senderId: "aa_bb_cc",
        fileSetSessionId: "dd_ee_ff",
      };
      AxiosMock.onDelete(
        "/user/sender/aa_bb_cc/filesetsession/dd_ee_ff",
      ).reply(200, {
        id: "dd_ee_ff",
        status: FileSetSessionStatus.WAITING,
        files: [
          {
            name: "a.zip",
            size: 123,
            status: FileSetSessionStatus.WAITING,
          },
        ],
      });

      await store.dispatch(getCancelQCRequest(reqInfo));

      let state = await store.getState().senderForm;

      expect(state.qcProgress).toEqual({
        status: FileSetSessionStatus.WAITING,
        fileStatus: {
          "a.zip": FileSetSessionStatus.WAITING,
        },
      });
    });
  });
});
