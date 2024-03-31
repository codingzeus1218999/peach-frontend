import PeachTermsToast from "@/components/shared/PeachTermsToast";
import "@testing-library/jest-dom";
import createSetup, { SetupFunction } from "@/common/utils/testSetup";
import { waitFor } from "@testing-library/react";
import { useTranslation } from "react-i18next";

jest.mock("react-i18next", () => ({
  Trans: ({ i18nKey }: any) => i18nKey,
  useTranslation: jest.fn(),
}));
describe("PeachTermsToast", () => {
  let setup: SetupFunction;

  beforeEach(() => {
    const useTranslationSpy: any = useTranslation;
    const tSpy = jest.fn((str) => str);
    useTranslationSpy.mockReturnValue({
      t: tSpy,
    });
    setup = createSetup({
      component: PeachTermsToast,
    });
  });

  it("renders without crash", () => {
    const { container, getByTestId } = setup();
    expect(container).toBeInTheDocument();
    expect(getByTestId("dti-PeachTermsToast")).toBeInTheDocument();
  });

  it("after 5 seconds, the coumponent will be hidden.", async () => {
    const { container, getByTestId } = setup();
    expect(container).toBeInTheDocument();

    await waitFor(
      () => {
        expect(() => getByTestId("dti-PeachTermsToast")).toThrowError();
      },
      { timeout: 5000 },
    );
  });
});
