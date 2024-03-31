import "@testing-library/jest-dom";
import createSetup, { I18nMockedProps, SetupFunction } from "@/common/utils/testSetup";
import UploadPage, { getStaticProps } from "@/pages/upload/index.page";
import { RootState } from "@/store";
import axios from "axios";
import { fireEvent, waitFor } from "@testing-library/react";
import MockAdapter from "axios-mock-adapter";
import { prepareSomeFilesForInput } from "@/components/senderForm/senderForm.utils";
import { useRouter } from "next/router";
import { GetStaticPropsContext } from "next";
import { useTranslation } from "react-i18next";

jest.mock("next/router", () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

jest.mock("react-i18next", () => ({
  Trans: ({ i18nKey }: any) => i18nKey,
  useTranslation: jest.fn(),
}));
const useTranslationSpy: any = useTranslation;
const tSpy = jest.fn((str) => str);
useTranslationSpy.mockReturnValue({
  t: tSpy,
});

const TEXT = {
  Page_Heading: "uploading.page.sender.heading",
  Page_Subheading_Action_Link: "uploading.page.sender.pauseOrEditTransfer",
};

describe("Upload Page", () => {
  let setup: SetupFunction;
  let state: Pick<RootState, "senderForm">;
  let mock: MockAdapter;

  const mockRouter = {
    push: jest.fn(),
  } as any;

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  beforeEach(() => {
    state = {
      senderForm: {
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
        sender: {
          isValid: false,
          value: "test@test.com",
          isAlertDisplayed: false,
        },
        receivers: {
          isValid: false,
          value: ["test@test.com"],
          isAlertDisplayed: false,
        },
        submission: {
          isLoading: false,
          senderInfo: {
            id: "123-321",
            email: "test@peach.com",
            firstname: null,
            lastname: null,
          },
          filesetSession: {
            id: "t-123-123-123",
            files: [
              {
                name: "test.zip",
                size: 12,
                url: "https://peach-go-test-uploads.s3.eu-north-1.amazonaws.com/file0.txt?X-Amz-Expires=517330&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIA5QH4DKE7FNY6DFUO/20230615/eu-north-1/s3/aws4_request&X-Amz-Date=20230615T110249Z&X-Amz-SignedHeaders=content-type;host&X-Amz-Signature=d97cd4c911eeba135c2a13bf398c3dae349e34d5fe160287c6ca4ca92aa9405e",
              },
            ],
          },
          sessionInfo: {
            expirationDate: null,
            shortLink: null,
          },
        },
        qcProgress: {
          status: "",
          fileStatus: {}
        },
      },
    };
    setup = createSetup({
      component: UploadPage,
      state,
    });
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.reset();
  });

  it("renders without crash", () => {
    const { container } = setup();
    expect(container).toBeInTheDocument();
  });

  it("testing getStaticProps", async () => {
    const context = {
      locale: "en",
    };
    const value: any = await getStaticProps(context as GetStaticPropsContext);
    expect(value).toEqual({ props: I18nMockedProps });
  });

  it("rendering the page content", () => {
    const { getByText, getByTestId } = setup();
    expect(getByText(TEXT.Page_Heading)).toBeInTheDocument();
    expect(getByText(TEXT.Page_Heading)).toBeInTheDocument();
    expect(getByTestId("dti-upload-page-img")).toBeInTheDocument();
    expect(getByTestId("dti-progress-indicator")).toBeInTheDocument();
  });

  it("has progress indicator set to 0%", () => {
    const { getByTestId } = setup();
    expect(getByTestId("dti-progress-percentage")).toHaveTextContent("0%");
  });

  //fixme: test is broken
  it.skip("shows progress indicator when file uploaded success", async () => {
    const file = prepareSomeFilesForInput("test.zip");
    state.senderForm.files.count = 1;
    state.senderForm.files.list = [file];
    state.senderForm.files.totalSize = 12;
    mock
      .onPut(
        "https://peach-go-test-uploads.s3.eu-north-1.amazonaws.com/file0.txt?X-Amz-Expires=517330&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIA5QH4DKE7FNY6DFUO/20230615/eu-north-1/s3/aws4_request&X-Amz-Date=20230615T110249Z&X-Amz-SignedHeaders=content-type;host&X-Amz-Signature=d97cd4c911eeba135c2a13bf398c3dae349e34d5fe160287c6ca4ca92aa9405e",
      )
      .reply((config) => {
        const total = file.size; // mocked file size
        const progress = 1;
        if (config.onUploadProgress) {
          config.onUploadProgress({
            loaded: progress * total,
            total,
            bytes: 5,
          });
        }
        return new Promise(() => {});
      });
    const { getByTestId } = setup({ state: state });
    await waitFor(() => {
      expect(getByTestId("dti-progress-percentage")).toHaveTextContent("50%");
    });
  });

  it("redirect to landing page When user clicks on edit transfer", () => {
    const { getByText } = setup();
    fireEvent.click(getByText(TEXT.Page_Subheading_Action_Link));
    expect(mockRouter.push).toHaveBeenCalled();
    expect(mockRouter.push).toHaveBeenCalledWith("/");
  });

  it("cancel file upload When user clicks on edit transfer", () => {
    const file = prepareSomeFilesForInput();
    state.senderForm.files.count = 1;
    state.senderForm.files.list = [file];
    state.senderForm.files.totalSize = 12;
    mock
      .onPut(
        "https://peach-go-test-uploads.s3.eu-north-1.amazonaws.com/file0.txt?X-Amz-Expires=521922&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIA5QH4DKE7FNY6DFUO/20230607/eu-north-1/s3/aws4_request&X-Amz-Date=20230607T154218Z&X-Amz-SignedHeaders=content-type;host&X-Amz-Signature=ccd0f228bab80d4d6adead0cbdc90b4bd4a04e642ed7ec1e0955960e49e28fb3",
      )
      .reply((config) => {
        const total = file.size; // mocked file size
        const progress = 1;
        if (config.onUploadProgress) {
          config.onUploadProgress({
            loaded: progress * total,
            total,
            bytes: 5,
          });
        }
        return new Promise(() => {});
      });

    const abortSpy = jest.spyOn(AbortController.prototype, "abort");

    const { getByText } = setup();
    fireEvent.click(getByText(TEXT.Page_Subheading_Action_Link));
    expect(abortSpy).toHaveBeenCalledTimes(1);
  });
});
