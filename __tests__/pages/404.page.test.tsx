import NotFound, { getStaticProps } from "../../src/pages/404.page";
import "@testing-library/jest-dom";
import createSetup, {
  I18nMockedProps,
  SetupFunction,
} from "@/common/utils/testSetup";
import { waitFor } from "@testing-library/react";
import { GetStaticPropsContext } from "next";
import { useTranslation } from "react-i18next";

const TEXT = {
  PARAGRAPH: "notFound.page.sender.paragraph",
  TAKE_ME_HOME: "notFound.page.sender.takeMeHome",
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

describe("NotFound", () => {
  let setup: SetupFunction;
  beforeEach(() => {
    setup = createSetup({
      component: NotFound,
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

  it("renders texts for page-not-found", () => {
    const { getByText } = setup();
    expect(getByText(404)).toBeInTheDocument();
    expect(getByText(TEXT.PARAGRAPH)).toBeInTheDocument();
    expect(getByText(TEXT.TAKE_ME_HOME)).toBeInTheDocument();
  });

  it("renders image", () => {
    const { getByTestId } = setup();
    expect(getByTestId("dti-seeking-eyes-img")).toBeInTheDocument();
  });

  it("renders link button to go back to home", () => {
    const { getByTestId } = setup();
    const link = getByTestId("dti-go-to-home");
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/");
  });
});
