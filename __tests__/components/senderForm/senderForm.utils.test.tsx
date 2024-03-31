import {
  FileExtensionSelector,
  isAnySameFileNamseInFileList,
} from "@/components/senderForm/senderForm.utils";

describe("SenderForm Utilities", () => {
  describe("FileExtensionSelector", () => {
    it("returns file extension from file name", () => {
      expect(FileExtensionSelector("ABC.zip")).toEqual("- zip");
    });

    it("returns empty if file has no extension", () => {
      expect(FileExtensionSelector("ABC")).toEqual("");
    });
  });
  describe("Check If there any duplicated file name in the file list", () => {
    it("Should return true, cos there are some duplicated values", () => {
      expect(isAnySameFileNamseInFileList(["a.js", "a.js"])).toEqual(
        true,
      );
    });

    it("Should return false, cos all the values are unique", () => {
      expect(isAnySameFileNamseInFileList(["a.js", "b.js"])).toEqual(false);
    });
  });
});
