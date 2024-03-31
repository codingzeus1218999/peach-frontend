import "@testing-library/jest-dom";
import createSetup, { I18nMockedProps, SetupFunction } from "@/common/utils/testSetup";
import AnalyzePage, { getStaticProps } from "@/pages/upload/analyze.page";
import { useRouter } from "next/router";
import { fireEvent } from "@testing-library/react";
import { RootState } from "@/store";
import { prepareSomeFilesForInput } from "@/components/senderForm/senderForm.utils";
import { FileSetSessionStatus } from "@/common/constants/enums";
import { GetStaticPropsContext } from "next";
import { useTranslation } from "react-i18next";

jest.mock("next/router", () => ({
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
  Page_Heading: "analyzing.page.sender.heading",
  Page_Subheading_Action_Link: "analyzing.page.sender.pauseOrEditTransfer",
  Page_Edit_Transfer_Action_Link: "analyzing.page.virus.editTransferBtn",
};
describe("Analyzing Page", () => {
  let setup: SetupFunction;
  let state: Pick<RootState, "senderForm">;

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
            shortLink: null,
            expirationDate: null,
          },
        },
        qcProgress: {
          status: FileSetSessionStatus.WAITING,
          fileStatus: {}
        },
      },
    };
    setup = createSetup({
      component: AnalyzePage,
      state,
    });
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
    expect(getByText(TEXT.Page_Subheading_Action_Link)).toBeInTheDocument();
    expect(getByTestId("dti-analyze-page-img")).toBeInTheDocument();
    expect(getByTestId("dti-progress-indicator")).toBeInTheDocument();
  });

  it("redirect to landing page When user clicked on edit transfer", async () => {
    const { getByText } = setup();
    fireEvent.click(getByText(TEXT.Page_Subheading_Action_Link));
    expect(mockRouter.push).toHaveBeenCalled();
    expect(mockRouter.push).toHaveBeenCalledWith("/");
  });

  it.skip("redirect to sucess page When qc complete", async () => {
    const file = prepareSomeFilesForInput();
    state.senderForm.files.count = 1;
    state.senderForm.files.list = [file];
    state.senderForm.qcProgress.status = "Complete";
    state.senderForm.qcProgress.fileStatus = {
      [file.name]: FileSetSessionStatus.COMPLETE,
    };
    setup({ state });
    expect(mockRouter.push).toHaveBeenCalled();
    expect(mockRouter.push).toHaveBeenCalledWith("/success");
  });

  it("shows virus detected files When qc failed", async () => {
    const file = prepareSomeFilesForInput("test.txt");
    const file1 = prepareSomeFilesForInput("test_1.txt");
    state.senderForm.files.count = 2;
    state.senderForm.files.list = [file, file1];
    state.senderForm.qcProgress.status = "Failed";
    state.senderForm.qcProgress.fileStatus = {
      [file.name]: FileSetSessionStatus.COMPLETE,
      [file1.name]: FileSetSessionStatus.FAILED,
    };
    const { getByText, queryByText } = setup({ state });
    expect(getByText(file1.name)).toBeInTheDocument();
    expect(queryByText(file.name)).not.toBeInTheDocument();
  });

  it("shows edit transfer When qc failed", async () => {
    const file = prepareSomeFilesForInput("test.txt");
    state.senderForm.files.count = 1;
    state.senderForm.files.list = [file];
    state.senderForm.qcProgress.status = "Failed";
    state.senderForm.qcProgress.fileStatus = {
      [file.name]: FileSetSessionStatus.FAILED,
    };

    const { getByText } = setup({ state });
    expect(getByText(TEXT.Page_Edit_Transfer_Action_Link)).toBeInTheDocument();
    fireEvent.click(getByText(TEXT.Page_Edit_Transfer_Action_Link));
    expect(mockRouter.push).toHaveBeenCalled();
    expect(mockRouter.push).toHaveBeenCalledWith("/");
  });
});
