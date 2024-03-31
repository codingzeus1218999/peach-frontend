import createSetup, { SetupFunction } from "@/common/utils/testSetup";
import "@testing-library/jest-dom";
import Message from "@/components/senderForm/Message";
import { fireEvent } from "@testing-library/react";
import { RootState } from "@/store";
import { useTranslation } from "react-i18next";

jest.mock("react-i18next", () => ({
  useTranslation: jest.fn(),
}));

const useTranslationSpy: any = useTranslation;
const tSpy = jest.fn((str) => str);
useTranslationSpy.mockReturnValue({
  t: tSpy,
});

describe("<Message />", () => {
  let setup: SetupFunction;
  let state: Pick<RootState, "senderForm">;

  const charLimit = 500;
  const text = "Test";

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
          isValid: true,
          value: [],
          isAlertDisplayed: false,
        },
        sender: {
          isValid: true,
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
      },
    };

    setup = createSetup({
      component: Message,
      props: {
        onMessageChange: jest.fn(),
      },
      state,
    });
  });

  it("renders without crash", () => {
    const { container } = setup();
    expect(container).toBeInTheDocument();
  });

  it("has a textarea", () => {
    const { getByTestId } = setup();
    expect(getByTestId("dti-msg-textarea")).toBeInTheDocument();
  });

  it("has a character count", () => {
    const { getByTestId } = setup();
    expect(getByTestId("char-count")).toBeInTheDocument();
  });

  it("focusing on the textarea by clicking on the wrapper view", () => {
    const { getByTestId } = setup();

    fireEvent.click(getByTestId("dti-msg-textareaWrapper"));

    expect(getByTestId("dti-msg-textarea")).toHaveFocus();
  });

  it.skip("When a user typed in textarea, Then it updates characters count", async () => {
    const { getByTestId, getByText } = setup();
    fireEvent.change(getByTestId("dti-msg-textarea"), {
      target: { value: text },
    });
    expect(getByText(`${text.length}/${charLimit}`)).toBeInTheDocument();
  });
});
