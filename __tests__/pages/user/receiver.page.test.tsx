import "@testing-library/jest-dom";
import createSetup, {
  I18nMockedProps,
  SetupFunction,
} from "@/common/utils/testSetup";
import { useTranslation } from "react-i18next";
import ReceiversLanding, {
  IReceiversLandingProps,
  getServerSideProps,
} from "@/pages/user/[...receiver].page";
import { fireEvent, getByTestId, waitFor } from "@testing-library/react";
import { ReceiverSliceStateType } from "@/store/slices/receiver.slice";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";

const TEXT = {
  PAGE_HEADING: "landing.page.receiver.heading",
  PARAGRAPH_TEXT: "landing.page.receiver.paragraph",
  SUB_PARAGRAPH_TEXT: "landing.page.receiver.sub.paragraph",
  IMAGE_ALT_TEXT: "receiver welcome page",
  FORM_HEADING: "landing.page.receiver.form.heading",
  FORM_PARAGRAPH_TEXT: "landing.page.receiver.form.paragraph",
};

jest.mock("react-i18next", () => ({
  ...jest.requireActual("react-i18next"),
  Trans: ({ i18nKey }: any) => i18nKey,
  useTranslation: jest.fn(),
}));

const useTranslationSpy: any = useTranslation;
const tSpy = jest.fn((str) => str);
useTranslationSpy.mockReturnValue({
  t: tSpy,
});

let clipboardContents = "";

Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn((text) => {
      clipboardContents = text;
    }),
    readText: jest.fn(() => clipboardContents),
  },
});
jest.spyOn(navigator.clipboard, "writeText");

describe("Receivers Page", () => {
  let AxiosMock: MockAdapter;
  let setup: SetupFunction;
  let props: IReceiversLandingProps = {
    sessionInfo: {
      id: "125c7404-3458-42ca-873d-b8cba401c6f6",
      senderEmail: "tareq.khan@peach.me",
      message: "Test 29-06",
      isPasswordProtected: false,
      expirationDate: "2023-07-13T07:33:59.482901",
      numberOfFiles: 2,
      totalFilesize: 68,
    },
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

  let state: ReceiverSliceStateType = {
    receiver: {
      isLoading: false,
      sessionInfo: null,
      sessionFiles: null,
      isUserConfirmed: false,
    },
  };

  beforeEach(() => {
    setup = createSetup({
      component: ReceiversLanding,
      props,
      state,
    });
  });

  beforeEach(() => {
    AxiosMock = new MockAdapter(axios);
  });

  afterEach(() => {
    AxiosMock.reset();
  });

  describe("Container", () => {
    it("renders without crash", () => {
      const { container } = setup();
      expect(container).toBeInTheDocument();
    });
    it("testing getServerSideProps: pass", async () => {
      AxiosMock.onGet(
        `/user/receiver/${props.receiverId}/filesetsession/${props.fileSetSessionId}`,
      ).reply(200, props.sessionInfo);
      const context: any = {
        locale: "en",
        params: {
          receiver: [
            "receiver",
            "28f02410-f500-419d-a840-9371f457af03",
            "filesetSession",
            "125c7404-3458-42ca-873d-b8cba401c6f6",
          ],
        },
      };

      const value: any = await getServerSideProps(context);
      expect(value).toEqual({ props: { ...I18nMockedProps, ...props } });
    });
    it("testing getServerSideProps: failed", async () => {
      const context: any = {
        locale: "en",
        params: {
          receiver: ["receiver", "28", "filesetSession", "12"],
        },
      };

      const value: any = await getServerSideProps(context);
      expect(value).toEqual({
        redirect: {
          destination: "/404",
          permanent: true,
        },
      });
    });
  });

  describe("SessionInfo View", () => {
    it("renders heading", () => {
      const { getByText } = setup();
      expect(getByText(TEXT.PAGE_HEADING)).toBeInTheDocument();
    });
    it("renders paragraph and sub paragraph", () => {
      const { getByText } = setup();
      expect(getByText(TEXT.PARAGRAPH_TEXT)).toBeInTheDocument();
      expect(getByText(TEXT.SUB_PARAGRAPH_TEXT)).toBeInTheDocument();
    });
    it("renders receiver visual image", () => {
      const { getByAltText } = setup();
      expect(getByAltText(TEXT.IMAGE_ALT_TEXT)).toBeInTheDocument();
    });
    it("renders form heading", () => {
      const { getByText } = setup();
      expect(getByText(TEXT.FORM_HEADING)).toBeInTheDocument();
    });

    it("receiver form, confirmation button, by clicking should call for files and display the form view", async () => {
      const { getByTestId, newStore } = setup();
      expect(getByTestId("dti-reciever-confirmationBtn")).toBeInTheDocument();
      expect(state.receiver.isUserConfirmed).toEqual(false);
      expect(() => getByTestId("dti-receivers-formView")).toThrowError();
      fireEvent.click(getByTestId("dti-reciever-confirmationBtn"));
      await waitFor(() => {
        const newState = newStore.getState();
        expect(newState.receiver.isUserConfirmed).toEqual(true);
        expect(getByTestId("dti-receivers-formView")).toBeInTheDocument();
      });
    });

    it("when isUserConfirmed is true from the redux part, then it should call for the files", async () => {
      state.receiver.isUserConfirmed = true;
      AxiosMock.onGet(
        `/user/receiver/${props.receiverId}/filesetsession/${props.fileSetSessionId}/files`,
      ).reply(200, filesMockData);

      const { newStore } = setup({ state });
      expect(state.receiver.sessionFiles).toEqual(null);

      await waitFor(() => {
        const newState = newStore.getState();
        expect(newState.receiver.sessionFiles).toEqual(filesMockData);
      });
    });
  });

  describe("FilesView", () => {
    beforeEach(() => {
      state.receiver.sessionFiles = filesMockData;
      state.receiver.sessionInfo = props.sessionInfo;
    });

    it("summery info", async () => {
      const { getByText } = setup({ state });
      await waitFor(() => {
        expect(
          getByText("landing.page.receiver.form.paragraph"),
        ).toBeInTheDocument();
      });
    });

    it("download all button text", async () => {
      const { getByText } = setup({ state });
      await waitFor(() => {
        expect(
          getByText("landing.page.receiver.filesView.ButtonDownloadAll"),
        ).toBeInTheDocument();
        expect(
          getByText(
            "landing.page.receiver.filesView.ButtonDownloadAll.Started",
          ),
        ).toBeInTheDocument();
      });
    });

    it("session share link label and button", async () => {
      const { getByText, getByTestId } = setup({ state });
      await waitFor(() => {
        expect(
          getByText("landing.page.receiver.filesView.CopyLinkButton"),
        ).toBeInTheDocument();
        expect(getByTestId("dti-share-receiver-link-btn")).toBeInTheDocument();
      });
    });

    it("by click on the copy and share link button, it should copy the location link to the clipboard", async () => {
      const { getByTestId } = setup({ state });
      fireEvent.click(getByTestId("dti-share-receiver-link-btn"));
      await waitFor(() => {
        expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
          window.location.href,
        );
      });
    });

    it("when the session has some comments, then the comment box is visible", async () => {
      const { getByTestId } = setup({ state });
      await waitFor(() => {
        expect(
          getByTestId("dti-receiver-formView-messageBox"),
        ).toBeInTheDocument();
      });
    });
  });
});
