import "@testing-library/jest-dom";
import createSetup, { SetupFunction } from "@/common/utils/testSetup";
import { useTranslation } from "react-i18next";
import DropZone, { DropZoneProps } from "@/components/dropZone";

jest.mock("react-i18next", () => ({
  useTranslation: jest.fn(),
}));

const useTranslationSpy: any = useTranslation;
const tSpy = jest.fn((str) => str);
useTranslationSpy.mockReturnValue({
  t: tSpy,
});

describe("<DropZone/>", () => {
  let setup: SetupFunction;
  let props: DropZoneProps;
  let files: File[];

  const createFile = (name: string, size: number, type: string) => {
    const file = new File([], name, { type });
    Object.defineProperty(file, "size", {
      get() {
        return size;
      },
    });
    return file;
  };

  beforeEach(() => {
    files = [createFile("file1.pdf", 1111, "application/pdf")];
    props = {
      isDragActive: false,
    };

    setup = createSetup({
      component: DropZone,
      props,
    });
  });

  it("When it renders Then it should not crash", () => {
    const { container } = setup();
    expect(container).toBeInTheDocument();
  });

  it("When a file is not dragged Then it doesn't shows Make It Rain", async () => {
    const { queryByTestId } = setup();

    expect(queryByTestId("make-it-rain")).not.toBeInTheDocument();
  });

  it("When a file is dragged Then it shows Make It Rain", async () => {
    props.isDragActive = true;
    const { queryByTestId } = setup();

    expect(queryByTestId("make-it-rain")).toBeInTheDocument();
  });
});
