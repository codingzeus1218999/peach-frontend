import SenderForm from "@/components/senderForm/SenderForm";
import "@testing-library/jest-dom";
import createSetup, { SetupFunction } from "@/common/utils/testSetup";
import { RootState } from "@/store";
import { fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  selectSelectedFilesCount,
  selectSenderField,
  submitSenderForm,
} from "@/store/slices/senderForm.slice";
import {
  BytesToGig,
  prepareSomeFilesForInput,
} from "@/components/senderForm/senderForm.utils";
import { useTranslation } from "next-i18next";
import { SizeAndUnitCalc } from "@/common/utils/fileUtils";
import { useRouter } from "next/router";
import { FileSetSessionStatus } from "@/common/constants/enums";

jest.mock("next/router", () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

jest.mock("react-i18next", () => ({
  useTranslation: jest.fn(),
}));

describe("SenderForm", () => {
  let setup: SetupFunction;
  let state: Pick<RootState, "senderForm">;
  const mockRouter = {
    push: jest.fn(),
  } as any;

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
          status: "",
          fileStatus: {},
        },
      },
    };
    setup = createSetup({
      component: SenderForm,
      state,
    });
  });

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  it("renders the form area wrapper without crash", async () => {
    const { container, getByTestId } = setup();
    expect(container).toBeInTheDocument();
    await waitFor(() => {
      expect(getByTestId("dti-FormAreaWrapper")).toBeInTheDocument();
    });
  });

  it("the form area wrapper rendered, then it should contain fileInput, visual image, title, subtitle and upload button", () => {
    const { getByText, getByTestId } = setup();

    expect(getByTestId("dti-fileInput")).toBeInTheDocument();
    expect(getByText("landing.page.sender.form.heading")).toBeInTheDocument();
    expect(
      getByText("landing.page.sender.form.maxUploadSize"),
    ).toBeInTheDocument();
    expect(getByTestId("dti-LargeSelectFileBtn")).toBeInTheDocument();
  });

  describe("Files", () => {
    it("Given Opened File Selector, When we select some files, then it should fill in the redux part", async () => {
      const { newStore, getByTestId } = setup();
      fireEvent.click(getByTestId("dti-LargeSelectFileBtn"));
      const fileInput = getByTestId("dti-fileInput");
      const file = prepareSomeFilesForInput();
      await waitFor(() => {
        userEvent.upload(fileInput, file);
      });

      await waitFor(() => {
        const newState = newStore.getState();
        expect(selectSelectedFilesCount(newState)).toEqual(1);
      });
    });

    it("Given some files are selected, then it should render the files list", async () => {
      const file = prepareSomeFilesForInput();
      state.senderForm.files.count = 1;
      state.senderForm.files.list = [file];
      const { getByText, getByTestId } = setup({ state: state });

      await waitFor(() => {
        expect(getByTestId("dti-FormViewWrapper")).toBeInTheDocument();
        expect(
          getByText("landing.page.sender.form.formHeading"),
        ).toBeInTheDocument();
        expect(
          getByText("landing.page.sender.form.remainingSpace"),
        ).toBeInTheDocument();
        expect(
          getByText("landing.page.sender.form.selectFiles"),
        ).toBeInTheDocument();
        expect(
          getByText("landing.page.sender.form.btn.removeAllFiles"),
        ).toBeInTheDocument();
        expect(
          getByText("landing.page.sender.form.sendBtn"),
        ).toBeInTheDocument();
      });
    });

    it("Given some files are selected, then by click remove all btn, we should go back to landing view", async () => {
      const file = prepareSomeFilesForInput();
      state.senderForm.files.count = 1;
      state.senderForm.files.list = [file];
      const { getByText, getByTestId } = setup({ state: state });

      fireEvent.click(getByText("landing.page.sender.form.btn.removeAllFiles"));
      await waitFor(() => {
        expect(getByTestId("dti-FormViewWrapper")).toBeInTheDocument();
      });
    });

    it("Given some files are selected, then by click remove one of those items, that item should be removed from the list", async () => {
      const file = prepareSomeFilesForInput();
      state.senderForm.files.count = 1;
      state.senderForm.files.list = [file];
      const { getByTestId } = setup({ state: state });

      expect(getByTestId(`dti-FileItem-${file.name}`)).toBeInTheDocument();
      await waitFor(async () => {
        await userEvent.click(getByTestId(`dti-removeFileItem-${file.name}`));
        expect(() => getByTestId(`dti-FileItem-${file.name}`)).toThrowError();
      });
    });
    describe("Remaining size", () => {
      const useTranslationSpy: any = useTranslation;
      const tSpy = jest.fn((str) => str);
      useTranslationSpy.mockReturnValue({
        t: tSpy,
      });
      it.each`
        Input
        ${"120"}
        ${"123456"}
        ${"123456789"}
        ${"1234567891"}
      `(
        "Given some files with total size: $Input, then it should returns the current unit size",
        ({ Input }) => {
          const file = prepareSomeFilesForInput();
          Object.defineProperty(file, "size", {
            value: Input,
          });
          state.senderForm.files.count = 1;
          state.senderForm.files.totalSize = Input;
          state.senderForm.files.list = [file];
          setup({ state: state });

          expect(tSpy).toHaveBeenCalledWith(
            "landing.page.sender.form.remainingSpace",
            { size: `${SizeAndUnitCalc(2 * BytesToGig - Input)}` },
          );
        },
      );
    });
  });

  describe("ErrorTooltip", () => {
    jest.setTimeout(80000);

    it("Given Form is initialized, Then there shouldn't be any Error Tooltip", () => {
      const { getByTestId } = setup();
      expect(() => getByTestId("dti-ErrorTooltip")).toThrowError();
    });

    it(`
      Given there were not selected files yet
      When user tries to add files that have size more than 2GB
      Then there should be the Error Tooltip
    `, async () => {
      const { getByTestId, getByText } = setup();
      fireEvent.click(getByTestId("dti-LargeSelectFileBtn"));
      const fileInput = getByTestId("dti-fileInput");
      const file = prepareSomeFilesForInput();
      Object.defineProperty(file, "size", {
        value: 1024 * 1024 * 1024 * 2 + 1,
      });
      await waitFor(() => {
        userEvent.upload(fileInput, file);
      });

      await waitFor(() => {
        expect(getByTestId("dti-ErrorTooltip")).toBeInTheDocument();
        expect(getByTestId("dti-ErrorTooltip-icon")).toBeInTheDocument();
        expect(
          getByText("landing.page.sender.form.errors.fileSizeExceeds"),
        ).toBeInTheDocument();
      });

      await waitFor(
        () => {
          expect(() => getByTestId("dti-ErrorTooltip")).toThrowError();
          expect(() => getByTestId("dti-ErrorTooltip-icon")).toThrowError();
          expect(() =>
            getByText("landing.page.sender.form.errors.fileSizeExceeds"),
          ).toThrowError();
        },
        { timeout: 8500 },
      );
    });

    it(`
      Given there are some selected files,
      When user tries to add files that increase the total size more than 2GB,
      Then there should be the Error Tooltip, and the new file should not be added
    `, async () => {
      const file1 = prepareSomeFilesForInput();
      const file1Size = 100 * 1000 * 1000 * 5 + 1;
      Object.defineProperty(file1, "size", {
        value: file1Size,
      });
      state.senderForm.files.count = 1;
      state.senderForm.files.list = [file1];
      state.senderForm.files.totalSize = file1Size;
      const { getByTestId, getByText } = setup({ state: state });
      fireEvent.click(getByTestId("dti-LargeSelectFileBtn"));
      const fileInput = getByTestId("dti-fileInput");
      const file = prepareSomeFilesForInput();
      Object.defineProperty(file, "size", {
        value: 1000 * 1000 * 1000 * 1.5 + 1,
      });
      await waitFor(() => {
        userEvent.upload(fileInput, file);
      });

      await waitFor(() => {
        expect(getByTestId("dti-ErrorTooltip")).toBeInTheDocument();
        expect(getByTestId("dti-ErrorTooltip-icon")).toBeInTheDocument();
        expect(
          getByText("landing.page.sender.form.errors.fileSizeExceeds"),
        ).toBeInTheDocument();
      });

      await waitFor(
        () => {
          expect(() => getByTestId("dti-ErrorTooltip")).toThrowError();
          expect(() => getByTestId("dti-ErrorTooltip-icon")).toThrowError();
          expect(() =>
            getByText("landing.page.sender.form.errors.fileSizeExceeds"),
          ).toThrowError();
        },
        { timeout: 8500 },
      );
    });

    it(`
      Given there isn't any selected files,
      When user tries to add 2 files with a same name(no matter if the file name is captalized or not),
      Then there should be the Error Tooltip, and the new file should not be added
    `, async () => {
      const { getByTestId, getByText } = setup();
      fireEvent.click(getByTestId("dti-LargeSelectFileBtn"));
      const fileInput = getByTestId("dti-fileInput");
      const file1 = prepareSomeFilesForInput("A.js");
      const file2 = prepareSomeFilesForInput("a.js");

      await waitFor(() => {
        userEvent.upload(fileInput, [file1, file2]);
      });

      await waitFor(() => {
        expect(getByTestId("dti-ErrorTooltip")).toBeInTheDocument();
        expect(getByTestId("dti-ErrorTooltip-icon")).toBeInTheDocument();
        expect(
          getByText("landing.page.sender.form.errors.sameFileName"),
        ).toBeInTheDocument();
      });

      await waitFor(
        () => {
          expect(() => getByTestId("dti-ErrorTooltip")).toThrowError();
          expect(() => getByTestId("dti-ErrorTooltip-icon")).toThrowError();
          expect(() =>
            getByText("landing.page.sender.form.errors.sameFileName"),
          ).toThrowError();
        },
        { timeout: 8500 },
      );
    });

    it(`
      Given there are some files selected,
      When user tries to add a files that have same name with one of previous selected files(no matter if the file name is captalized or not),
      Then there should be the Error Tooltip, and the new file should not be added
    `, async () => {
      const file1 = prepareSomeFilesForInput("A.js");
      state.senderForm.files.count = 1;
      state.senderForm.files.list = [file1];
      state.senderForm.files.totalSize = 0;
      const { getByTestId, getByText, newStore } = setup({ state: state });
      fireEvent.click(getByTestId("dti-LargeSelectFileBtn"));

      const fileInput = getByTestId("dti-fileInput");
      const file2 = prepareSomeFilesForInput("a.js");

      await waitFor(() => {
        userEvent.upload(fileInput, file2);
      });

      await waitFor(() => {
        const newState = newStore.getState();
        expect(newState.senderForm.errors.status).toEqual("visible");
        expect(newState.senderForm.errors.message).toEqual(
          "landing.page.sender.form.errors.sameFileName",
        );
        expect(getByTestId("dti-ErrorTooltip")).toBeInTheDocument();
        expect(getByTestId("dti-ErrorTooltip-icon")).toBeInTheDocument();
        expect(
          getByText("landing.page.sender.form.errors.sameFileName"),
        ).toBeInTheDocument();
      });

      await waitFor(
        () => {
          const newState = newStore.getState();
          expect(newState.senderForm.errors.status).toEqual("hide");
        },
        { timeout: 8500 },
      );
    });
  });

  describe("ReceiversEmails Field", () => {
    beforeEach(() => {
      // in order to display the form, there should be at least one file in the form.
      const file = prepareSomeFilesForInput();
      state.senderForm.files.count = 1;
      state.senderForm.files.list = [file];
    });

    it("Given user fills the input put with a valid email address, after pressing thr enter button, it should be filled on the redux", async () => {
      const { newStore, getByTestId } = setup({ state: state });
      const inputElement = getByTestId("dti-receivers-emails-input");
      fireEvent.change(inputElement, { target: { value: "valid@peach.me" } });
      fireEvent.keyUp(inputElement, {
        key: "Enter",
        keyCode: 13,
      });
      await waitFor(() => {
        const newState = newStore.getState();
        expect(newState.senderForm.receivers.value).toEqual(
          expect.arrayContaining(["valid@peach.me"]),
        );
      });
    });

    it("Given user fills the input with a valid email address, When the user onfocused from the element, Then the email should be filled on the redux", async () => {
      const { newStore, getByTestId } = setup({ state: state });
      const inputElement = getByTestId("dti-receivers-emails-input");
      fireEvent.change(inputElement, { target: { value: "valid@peach.me" } });
      fireEvent.focusOut(inputElement);
      await waitFor(() => {
        const newState = newStore.getState();
        expect(newState.senderForm.receivers.value).toEqual(
          expect.arrayContaining(["valid@peach.me"]),
        );
      });
    });

    it("Given only one email added for the receivers, Then the view other button should be hidden", () => {
      state.senderForm.receivers.value = ["valid@peach.me"];
      const { getByText } = setup({ state: state });

      expect(() =>
        getByText("landing.page.sender.form.receiversEmails.extraMails.chip"),
      ).toThrowError();
    });

    it("Given there are more than one email added for the receivers, Then the 'view other' button should be displayed", () => {
      state.senderForm.receivers.value = [
        "valid@peach.me",
        "validMail2@peach.me",
      ];
      const { getByText } = setup({ state: state });

      expect(
        getByText("landing.page.sender.form.receiversEmails.extraMails.chip"),
      ).toBeInTheDocument();
    });

    it("Given there are more than one email added for the receivers, When user focused on the input, Then the 'view other' button should be hidden and the chips should be displayd", () => {
      state.senderForm.receivers.value = [
        "valid@peach.me",
        "validMail2@peach.me",
      ];
      const { getByText, getByTestId } = setup({ state: state });
      const inputElement = getByTestId("dti-receivers-emails-input");
      fireEvent.focusIn(inputElement);

      expect(() =>
        getByText("landing.page.sender.form.receiversEmails.extraMails.chip"),
      ).toThrowError();
      expect(
        getByTestId("dti-receiversEmailChips-container"),
      ).toBeInTheDocument();
    });

    it("Given there are more than one email added for the receivers, When user click on the 'view other' button, Then the chips should be displayed", () => {
      state.senderForm.receivers.value = [
        "valid@peach.me",
        "validMail2@peach.me",
      ];
      const { getByText, getByTestId } = setup({ state: state });
      const viewOtherBtn = getByText(
        "landing.page.sender.form.receiversEmails.extraMails.chip",
      );
      fireEvent.click(viewOtherBtn);

      expect(
        getByTestId("dti-receiversEmailChips-container"),
      ).toBeInTheDocument();
    });

    it("Given The chips are displayed, when user unfocused from the input element, then the chips should be hidden", () => {
      state.senderForm.receivers.value = [
        "valid@peach.me",
        "validMail2@peach.me",
      ];
      const { getByText, getByTestId } = setup({ state: state });
      const viewOtherBtn = getByText(
        "landing.page.sender.form.receiversEmails.extraMails.chip",
      );
      fireEvent.click(viewOtherBtn);
      const inputElement = getByTestId("dti-receivers-emails-input");
      fireEvent.focusOut(inputElement);
      expect(getByTestId("dti-receiversEmailChips-container")).toHaveStyle({
        display: "none",
      });
    });

    it("Given user fill in an invalid email address, after pressing the enter button, the tooltip should be displayed and should be hidden after 8 seconds", async () => {
      const { newStore, getByTestId, getByText } = setup({ state: state });
      const inputElement = getByTestId("dti-receivers-emails-input");
      fireEvent.change(inputElement, {
        target: { value: "invalidEmailAddress" },
      });
      fireEvent.keyUp(inputElement, {
        key: "Enter",
        keyCode: 13,
      });
      expect(
        getByTestId("dti-ReceiversEmailsErrorTooltip"),
      ).toBeInTheDocument();
      expect(
        getByTestId("dti-ReceiversEmailsErrorTooltip-icon"),
      ).toBeInTheDocument();
      expect(
        getByText("landing.page.sender.form.receiversEmails.invalid"),
      ).toBeInTheDocument();
      await waitFor(() => {
        const newState = newStore.getState();
        expect(newState.senderForm.receivers.isAlertDisplayed).toEqual(true);
        expect(newState.senderForm.receivers.value).toEqual(
          expect.not.arrayContaining(["invalidEmailAddress"]),
        );
      });
      await waitFor(
        () => {
          const newState = newStore.getState();
          expect(newState.senderForm.receivers.isAlertDisplayed).toEqual(false);
        },
        { timeout: 8500 },
      );
    });

    it("Given user fill in an invalid email address, after unfocusing from the input element, the tooltip should be displayed and should be hidden after 8 seconds", async () => {
      const { newStore, getByTestId, getByText } = setup({ state: state });
      await waitFor(() => {
        const inputElement = getByTestId("dti-receivers-emails-input");
        fireEvent.change(inputElement, {
          target: { value: "invalidEmailAddress" },
        });
        fireEvent.focusOut(inputElement);
      });
      await waitFor(() => {
        expect(
          getByTestId("dti-ReceiversEmailsErrorTooltip"),
        ).toBeInTheDocument();
        expect(
          getByTestId("dti-ReceiversEmailsErrorTooltip-icon"),
        ).toBeInTheDocument();
        expect(
          getByText("landing.page.sender.form.receiversEmails.invalid"),
        ).toBeInTheDocument();
      });

      await waitFor(() => {
        const newState = newStore.getState();
        expect(newState.senderForm.receivers.isAlertDisplayed).toEqual(true);
        expect(newState.senderForm.receivers.value).toEqual(
          expect.not.arrayContaining(["invalidEmailAddress"]),
        );
      });
      await waitFor(
        () => {
          const newState = newStore.getState();
          expect(newState.senderForm.receivers.isAlertDisplayed).toEqual(false);
        },
        { timeout: 8500 },
      );
    });

    it("Given user didn't add any emails, then the text placeholder should be the 'Add emails'", () => {
      const { getByTestId } = setup({ state: state });
      const inputElement = getByTestId("dti-receivers-emails-input");
      expect(inputElement).toHaveAttribute(
        "placeholder",
        "landing.page.sender.form.receiversEmails.input.placeholder",
      );
    });

    it("Given user added some valid emails, and he is not focusing on the element, then the first item of emails array should be the as a placeholder on input", () => {
      state.senderForm.receivers.value = [
        "valid@peach.me",
        "validMail2@peach.me",
      ];
      const { getByTestId } = setup({ state: state });
      const inputElement = getByTestId("dti-receivers-emails-input");
      expect(inputElement).toHaveAttribute("placeholder", "valid@peach.me");
    });

    it("Given user added some valid emails and the chips container is displayed, When we click on the 'X' button, then that chip should be removed", async () => {
      state.senderForm.receivers.value = [
        "valid@peach.me",
        "validMail2@peach.me",
      ];
      const { newStore, getByTestId, getByText } = setup({ state: state });
      const viewOtherBtn = getByText(
        "landing.page.sender.form.receiversEmails.extraMails.chip",
      );
      fireEvent.click(viewOtherBtn);
      const firstEmailChips = getByTestId("dti-valid@peach.me");
      fireEvent.click(firstEmailChips.childNodes[1]);
      await waitFor(() => {
        const newState = newStore.getState();
        expect(newState.senderForm.receivers.value).toEqual(
          expect.not.arrayContaining(["valid@peach.me"]),
        );
      });
    });

    it("Given list of valid comma separated emails, when user press the enter button, then it should combined to the redux", async () => {
      const { newStore, getByTestId, getByText } = setup();
      const inputElement = getByTestId("dti-receivers-emails-input");
      fireEvent.change(inputElement, {
        target: { value: "valid@peach.me,valid_no2@peach.me;valid3@peach.me" },
      });
      fireEvent.keyUp(inputElement, {
        key: "Enter",
        keyCode: 13,
      });
      await waitFor(() => {
        const newState = newStore.getState();
        expect(newState.senderForm.receivers.value).toEqual(
          expect.arrayContaining([
            "valid@peach.me",
            "valid_no2@peach.me",
            "valid3@peach.me",
          ]),
        );
      });
    });

    it("Given validation error is displayed on the receivers field, when user remove the input value, then the tooltip should be disabled immediately", async () => {
      state.senderForm.receivers.isValid = false;
      state.senderForm.receivers.value = ["valid@peach.me"];
      const { newStore, getByTestId } = setup();
      const inputElement = getByTestId("dti-receivers-emails-input");
      fireEvent.change(inputElement, {
        target: { value: "invalid" },
      });
      fireEvent.keyUp(inputElement, {
        key: "Enter",
        keyCode: 13,
      });
      await waitFor(() => {
        const newState = newStore.getState();
        expect(newState.senderForm.receivers.isAlertDisplayed).toEqual(true);
      });
      fireEvent.change(inputElement, {
        target: { value: "" },
      });
      fireEvent.keyUp(inputElement, {
        key: "Enter",
        keyCode: 13,
      });
      await waitFor(() => {
        const newState = newStore.getState();
        expect(newState.senderForm.receivers.isAlertDisplayed).toEqual(false);
        expect(newState.senderForm.receivers.isValid).toEqual(true);
      });
    });
  });

  describe("SenderEmail Field", () => {
    beforeEach(() => {
      // in order to display the form, there should be at least one file in the form.
      const file = prepareSomeFilesForInput();
      state.senderForm.files.count = 1;
      state.senderForm.files.list = [file];
    });

    it("Given user fills the input with a valid email address, Then it should be filled on the redux", async () => {
      const { newStore, getByTestId } = setup({ state: state });
      const inputElement = getByTestId("dti-sender-email-input");
      fireEvent.change(inputElement, {
        target: { value: "validSenderMail@peach.me" },
      });
      await waitFor(() => {
        const newState = newStore.getState();
        expect(selectSenderField(newState).value).toEqual(
          "validSenderMail@peach.me",
        );
        expect(selectSenderField(newState).isValid).toEqual(true);
      });
    });

    it("Given input is filled with an invalid email address, when user remove the whole input, then the alert should be hidden", async () => {
      state.senderForm.sender.isAlertDisplayed = true;
      state.senderForm.sender.value = "invalidEmailAddress";
      const { newStore, getByTestId } = setup({ state: state });

      await waitFor(() => {
        const inputElement = getByTestId("dti-sender-email-input");
        fireEvent.change(inputElement, {
          target: { value: "" },
        });
      });
      await waitFor(() => {
        const newState = newStore.getState();
        expect(selectSenderField(newState).isAlertDisplayed).toEqual(false);
      });
    });
    it("Given input is filled with an invalid email address, when user replace the input value with the valid email, if the alert is opened, then the alert should be hidden immediately ", async () => {
      state.senderForm.sender.isAlertDisplayed = true;
      state.senderForm.sender.value = "invalidEmailAddress";
      const { newStore, getByTestId } = setup({ state: state });

      await waitFor(() => {
        const inputElement = getByTestId("dti-sender-email-input");
        fireEvent.change(inputElement, {
          target: { value: "test@peach.me" },
        });
      });
      await waitFor(() => {
        const newState = newStore.getState();
        expect(selectSenderField(newState).isAlertDisplayed).toEqual(false);
      });
    });

    it("Given user fill in an invalid email address, after unfocusing from the input element, the tooltip should be displayed and should be hidden after 8 seconds", async () => {
      state.senderForm.sender.value = "invalidEmailAddress";
      const { getByTestId, getByText, newStore } = setup({ state: state });
      await waitFor(() => {
        const inputElement = getByTestId("dti-sender-email-input");
        fireEvent.focusOut(inputElement);
      });
      await waitFor(() => {
        const newState = newStore.getState();
        expect(newState.senderForm.sender.isAlertDisplayed).toEqual(true);
        expect(getByTestId("dti-SenderEmailErrorTooltip")).toBeInTheDocument();
        expect(
          getByTestId("dti-SenderEmailErrorTooltip-icon"),
        ).toBeInTheDocument();
        expect(
          getByText("landing.page.sender.form.senderEmail.invalid"),
        ).toBeInTheDocument();
      });
      await waitFor(
        () => {
          const newState = newStore.getState();
          expect(newState.senderForm.sender.isAlertDisplayed).toEqual(false);
        },
        { timeout: 8500 },
      );
    });
  });

  describe("Actions", () => {
    it("when the receivers list length is zero, then the send button should be disabled", () => {
      state.senderForm.receivers.value = [];
      const { getByTestId } = setup({ state: state });

      expect(getByTestId("dti-senderForm-submitBtn")).toHaveAttribute(
        "disabled",
      );
    });
    it("when the sender email is invalid, then the send button should be disabled", () => {
      state.senderForm.sender.value = "abcd";
      const { getByTestId } = setup({ state: state });

      expect(getByTestId("dti-senderForm-submitBtn")).toHaveAttribute(
        "disabled",
      );
    });
    it("when the sender email is valid and the receivers emails list length is more than 0, then the send button should be enabled", async () => {
      state.senderForm.sender.value = "amir.sobhi@peach.me";
      state.senderForm.sender.isValid = true;
      state.senderForm.receivers.value = ["test@peach.me"];
      state.senderForm.receivers.isValid = true;

      const { getByTestId } = setup({ state: state });

      await waitFor(() => {
        expect(getByTestId("dti-senderForm-submitBtn")).not.toHaveAttribute(
          "disabled",
        );
      });
    });

    it("Given send button is enabled, when user click on it, then we should go to the upload page", async () => {
      state.senderForm.sender.value = "amir.sobhi@peach.me";
      state.senderForm.sender.isValid = true;
      state.senderForm.receivers.value = ["test@peach.me"];
      state.senderForm.receivers.isValid = true;
      const file1 = prepareSomeFilesForInput("fileNo1.txt");
      state.senderForm.files.count = 1;
      state.senderForm.files.list = [file1];
      const { getByTestId } = setup({ state: state });

      await waitFor(() => {
        fireEvent.click(getByTestId("dti-senderForm-submitBtn"));
      });

      await waitFor(() => {
        expect(mockRouter.push).toBeCalledWith("/upload");
      });
    });
  });

  describe("QC Check For Files", () => {
    it("Given the QC status is failed, then in the first view, there is a related Error tooltip for it", async () => {
      state.senderForm.qcProgress.status = FileSetSessionStatus.FAILED;
      const { newStore } = setup({ state });

      await waitFor(() => {
        const newState = newStore.getState();
        expect(newState.senderForm.errors.status).toEqual("visible");
        expect(newState.senderForm.errors.message).toEqual(
          "landing.page.sender.form.errors.virusDetected",
        );
      });

      await waitFor(
        () => {
          const newState = newStore.getState();
          expect(newState.senderForm.errors.status).toEqual("hide");
        },
        { timeout: 8500 },
      );
    });

    it("Given the QC status is failed, then if user remove that file, the related status should be removed from redux as well", async () => {
      state.senderForm.qcProgress.status = FileSetSessionStatus.FAILED;
      state.senderForm.qcProgress.fileStatus = {
        "fileNo1.txt": FileSetSessionStatus.FAILED,
        "fileNo2.txt": FileSetSessionStatus.IN_PROGRESS,
        "fileNo3.txt": FileSetSessionStatus.IN_PROGRESS,
      };
      const file1 = prepareSomeFilesForInput("fileNo1.txt");
      const file2 = prepareSomeFilesForInput("fileNo2.txt");
      const file3 = prepareSomeFilesForInput("fileNo3.txt");
      state.senderForm.files.count = 3;
      state.senderForm.files.list = [file1, file2, file3];
      const { newStore, getByTestId } = setup({ state });

      await waitFor(() => {
        const fileWithVirusSelector = getByTestId(
          "dti-removeFileItem-fileNo1.txt",
        );
        fireEvent.click(fileWithVirusSelector);
      });

      await waitFor(() => {
        const newState = newStore.getState();
        expect(newState.senderForm.qcProgress.fileStatus).toEqual({
          "fileNo2.txt": FileSetSessionStatus.IN_PROGRESS,
          "fileNo3.txt": FileSetSessionStatus.IN_PROGRESS,
        });
      });
    });
  });
});
