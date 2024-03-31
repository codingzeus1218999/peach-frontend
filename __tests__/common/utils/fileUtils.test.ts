import { SizeAndUnitCalc } from "@/common/utils/fileUtils";

describe("File Utils", () => {
  describe("SizeAndUnitCalc", () => {
    it.each`
      Input           | Unit       | Expected
      ${"120"}        | ${"Bytes"} | ${"120"}
      ${"123456"}     | ${"KB"}    | ${"123.45"}
      ${"123456789"}  | ${"MB"}    | ${"123.45"}
      ${"1234567891"} | ${"GB"}    | ${"1.23"}
    `(
      "Given $Input as the input value of the function, then it should returns $Expected $Unit",
      ({ Input, Unit, Expected }) => {
        expect(SizeAndUnitCalc(Input)).toBe(`${Expected} ${Unit}`);
      },
    );
  });
});
