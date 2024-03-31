import createSetup, { SetupFunction } from "@/common/utils/testSetup";
import "@testing-library/jest-dom";
import PeachLogo from "@/components/shared/PeachLogo";

describe("<PeachLogo/>", () => {
  let setup: SetupFunction;

  beforeEach(() => {
    setup = createSetup({
      component: PeachLogo,
    });
  });

  it("renders without crash", () => {
    const { container } = setup();
    expect(container).toBeInTheDocument();
  });

  it("has href to peach.me", () => {
    const { getByTestId } = setup();
    expect(getByTestId("peach-logo-link")).toHaveAttribute(
      "href",
      "https://www.peach.me/",
    );
  });
});
