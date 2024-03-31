import Home, { getStaticProps } from "../../src/pages/index.page";
import "@testing-library/jest-dom";
import createSetup, {
  I18nMockedProps,
  SetupFunction,
} from "@/common/utils/testSetup";
import { RootState } from "@/store";
import { fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { prepareSomeFilesForInput } from "@/components/senderForm/senderForm.utils";
import { selectSelectedFilesCount } from "@/store/slices/senderForm.slice";
import { GetStaticPropsContext } from "next";
import { useTranslation } from "react-i18next";

const TEXT = {
  HEADING_SHARE_WITH: "landing.page.sender.heading",
  HEADING_SHALLOW: "landing.page.sender.heading.swallowed",
  PARAGRAPH_TEXT: "landing.page.sender.paragraph",
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

describe("Home", () => {
  let setup: SetupFunction;
  let state: Pick<RootState, "senderForm">;
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
          isValid: true,
          value: "test@test.com",
          isAlertDisplayed: false,
        },
        receivers: {
          isValid: true,
          value: ["test@test.com"],
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
      component: Home,
      // state
    });
  });

  it("renders without crash", async () => {
    const { container } = setup();
    await waitFor(() => {
      expect(container).toBeInTheDocument();
    });
  });

  it("testing getStaticProps", async () => {
    const context = {
      locale: "en",
    };
    const value: any = await getStaticProps(context as GetStaticPropsContext);
    expect(value).toEqual({ props: I18nMockedProps });
  });

  it("renders a heading", () => {
    const { getByText } = setup();
    expect(getByText(TEXT.HEADING_SHARE_WITH)).toBeInTheDocument();
    expect(getByText(TEXT.PARAGRAPH_TEXT)).toBeInTheDocument();
  });

  it("renders the second heading", async () => {
    const newState = { ...state };
    newState.senderForm.files.count = 1;
    const { getByText } = setup({ state: newState });
    await waitFor(() => {
      expect(getByText(TEXT.HEADING_SHALLOW)).toBeInTheDocument();
    });
  });
  describe("DnD", () => {
    describe("ErrorTooltip", () => {
      jest.setTimeout(60000);

      it(`
        Given there were not selected files yet
        When user tries to drop some files that have size more than 2GB
        Then there should be the Error Tooltip
      `, async () => {
        const { getByTestId, newStore } = setup();
        const fileInput = getByTestId("drop-input");
        const file = prepareSomeFilesForInput();
        Object.defineProperty(file, "size", {
          value: 1024 * 1024 * 1024 * 2 + 1,
        });

        await waitFor(() => {
          fireEvent.drop(
            getByTestId("dti-landingArea"),
            userEvent.upload(fileInput, file),
          );
        });

        await waitFor(() => {
          const newState = newStore.getState();

          expect(newState.senderForm.errors.status).toEqual("visible");
          expect(newState.senderForm.errors.message).toEqual(
            "landing.page.sender.form.errors.fileSizeExceeds",
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

      it(`
        Given there are some selected files,
        When user tries to drop some files that increase the total size more than 2GB,
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
        const { getByTestId, newStore } = setup({ state: state });
        const file = prepareSomeFilesForInput();
        Object.defineProperty(file, "size", {
          value: 1000 * 1000 * 1000 * 1.5 + 1,
        });
        const fileInput = getByTestId("drop-input");

        await waitFor(() => {
          fireEvent.drop(
            getByTestId("dti-landingArea"),
            userEvent.upload(fileInput, file),
          );
        });

        await waitFor(() => {
          const newState = newStore.getState();

          expect(newState.senderForm.errors.status).toEqual("visible");
          expect(newState.senderForm.errors.message).toEqual(
            "landing.page.sender.form.errors.fileSizeExceeds",
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

      it(`
        Given there isn't any selected files,
        When user tries drop 2 files with a same name(no matter if the file name is captalized or not),
        Then there should be the Error Tooltip, and the new file should not be added
      `, async () => {
        const { getByTestId, newStore } = setup();
        const fileInput = getByTestId("drop-input");
        const file1 = prepareSomeFilesForInput("A.js");
        const file2 = prepareSomeFilesForInput("a.js");

        await waitFor(() => {
          fireEvent.drop(
            getByTestId("dti-landingArea"),
            userEvent.upload(fileInput, [file1, file2]),
          );
        });

        await waitFor(() => {
          const newState = newStore.getState();

          expect(newState.senderForm.errors.status).toEqual("visible");
          expect(newState.senderForm.errors.message).toEqual(
            "landing.page.sender.form.errors.sameFileName",
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

      it(`
        Given there are some files selected,,
        When user tries to drop some files that have same name with one of previous selected files(no matter if the file name is captalized or not),
        Then there should be the Error Tooltip, and the new file should not be added
      `, async () => {
        const file1 = prepareSomeFilesForInput("A.js");
        state.senderForm.files.count = 1;
        state.senderForm.files.list = [file1];
        state.senderForm.files.totalSize = 0;
        const { getByTestId, newStore } = setup({ state: state });
        const fileInput = getByTestId("drop-input");
        const file2 = prepareSomeFilesForInput("a.js");

        await waitFor(() => {
          fireEvent.drop(
            getByTestId("dti-landingArea"),
            userEvent.upload(fileInput, file2),
          );
        });

        await waitFor(() => {
          const newState = newStore.getState();

          expect(newState.senderForm.errors.status).toEqual("visible");
          expect(newState.senderForm.errors.message).toEqual(
            "landing.page.sender.form.errors.sameFileName",
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
    });

    it("User draging some files into the Landing area, then it should be accepted", async () => {
      const { newStore, getByTestId } = setup();
      const fileInput = getByTestId("drop-input");
      const file = prepareSomeFilesForInput();

      await waitFor(() => {
        fireEvent.drop(
          getByTestId("dti-landingArea"),
          userEvent.upload(fileInput, file),
        );
      });

      await waitFor(() => {
        const newState = newStore.getState();
        expect(selectSelectedFilesCount(newState)).toEqual(1);
      });
    });
  });
});
