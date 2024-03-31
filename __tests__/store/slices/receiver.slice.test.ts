import reducer, {
  IReceiverSlice,
  requestReceiverFiles,
  selectReceiverConfimationState,
  selectReceiverFileSetSession,
  selectReceiverSessionInfo,
  setReceiverSessionInfo,
  setReceiverUserConfimation,
} from "@/store/slices/receiver.slice";

import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import store from "@/store";

describe("Redux Slice: Receiver Slice", () => {
  let AxiosMock: MockAdapter;
  const initialState: IReceiverSlice = {
    isLoading: false,
    sessionInfo: null,
    sessionFiles: null,
    isUserConfirmed: false,
  };

  const mockSessionInfo = {
    id: "125c7404-3458-42ca-873d-b8cba401c6f6",
    senderEmail: "tareq.khan@peach.me",
    message: "Test 29-06",
    isPasswordProtected: false,
    expirationDate: "2023-07-13T07:33:59.482901",
    numberOfFiles: 2,
    totalFilesize: 68,
  };
  const mockProps = {
    receiverId: "28f02410-f500-419d-a840-9371f457af03",
    fileSetSessionId: "125c7404-3458-42ca-873d-b8cba401c6f6",
  };

  const filesMockData = {
    id: "125c7404-3458-42ca-873d-b8cba401c6f6",
    senderEmail: "tareq.khan@peach.me",
    message: "Test 29-06",
    expirationDate: "2023-07-13T07:33:59.482901",
    numberOfFiles: 2,
    totalFilesize: 68,
    files: [
      {
        fileName: "test_upload2.txt",
        fileSize: 34,
        thumbnailUrl: null,
        hasProxy: false,
        proxyUrl: null,
      },
      {
        fileName: "test_upload.txt",
        fileSize: 34,
        thumbnailUrl: null,
        hasProxy: false,
        proxyUrl: null,
      },
    ],
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
    it("Given Action: setReceiverUserConfimation, Then it should fill the files in the reducer", () => {
      expect(
        reducer(initialState, setReceiverUserConfimation(true)).isUserConfirmed,
      ).toEqual(true);
    });
    it("Given Action: setReceiverUserConfimation, Then it should fill the files in the reducer", () => {
      const sessionInfoMockDt = {
        id: "125c7404-3458-42ca-873d-b8cba401c6f6",
        senderEmail: "tareq.khan@peach.me",
        message: "Test 29-06",
        isPasswordProtected: false,
        expirationDate: "2023-07-13T07:33:59.482901",
        numberOfFiles: 2,
        totalFilesize: 68,
      };
      expect(
        reducer(initialState, setReceiverSessionInfo(sessionInfoMockDt))
          .sessionInfo,
      ).toEqual(sessionInfoMockDt);
    });
  });

  describe("Selectors", () => {
    it("Given Selector: selectReceiverConfimationState, then it should return the related part from redux slice", () => {
      expect(
        selectReceiverConfimationState({ receiver: initialState }),
      ).toEqual(initialState.isUserConfirmed);
    });
    it("Given Selector: selectReceiverSessionInfo, then it should return the related part from redux slice", () => {
      expect(selectReceiverSessionInfo({ receiver: initialState })).toEqual(
        initialState.sessionInfo,
      );
    });
    it("Given Selector: selectReceiverFileSetSession, then it should return the related part from redux slice", () => {
      const testDt = {
        ...initialState,
        sessionFiles: filesMockData,
      };
      expect(selectReceiverFileSetSession({ receiver: testDt })).toEqual(
        testDt.sessionFiles,
      );
    });
  });

  describe("Async Thunks", () => {
    it("Thunk call for: requestReceiverFiles => Success", async () => {
      AxiosMock.onGet(
        `/user/receiver/${mockProps.receiverId}/filesetsession/${mockProps.fileSetSessionId}/files`,
      ).reply(200, filesMockData);

      await store.dispatch(requestReceiverFiles(mockProps));

      let state = await store.getState().receiver;

      expect(state.sessionFiles).toEqual(filesMockData);
    });
  });
});
