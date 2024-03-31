import "@testing-library/jest-dom";
import createSetup, {
  I18nMockedProps,
  SetupFunction,
} from "@/common/utils/testSetup";
import SuccessPage, { getStaticProps } from "@/pages/success/index.page";
import { useRouter } from "next/router";
import { fireEvent, waitFor } from "@testing-library/react";
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



const TEXT = {
  Page_Heading: "success.page.sender.heading",
  Page_Description: "success.page.sender.description",
  Page_Expiration_Date: "success.page.sender.expiration",
  Page_Copy_Link_Text: "success.page.sender.copyLink",
  Page_Copied_Link_Clipboard_Text: "success.page.sender.linkCopied",
  Page_Copied_Link: "Peach Go Mocked Link!",
};

describe("Success Page", () => {
  let setup: SetupFunction;

  const mockRouter = {
    push: jest.fn(),
  } as any;

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  beforeEach(() => {
    setup = createSetup({
      component: SuccessPage,
    });
  });

  it("renders without crash", async() => {
    const { container } = setup();
    await waitFor(()=>{
      expect(container).toBeInTheDocument();
    })
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
    expect(getByText(TEXT.Page_Description)).toBeInTheDocument();
    expect(getByText(TEXT.Page_Expiration_Date)).toBeInTheDocument();
    expect(getByText(TEXT.Page_Copy_Link_Text)).toBeInTheDocument();
    expect(getByTestId("dti-dart-board-img")).toBeInTheDocument();
  });

  it("Given user clicks on the copy link button, then the url should be added to the clipboard", async () => {
    const { getByTestId } = setup();
    fireEvent.click(getByTestId("dti-copyLinkBtn"));
    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        TEXT.Page_Copied_Link,
      );
    });
  });
});
