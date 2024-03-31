import reducer, {
  ISettingsSliceState,
  setAnimateTo,
  selectAnimatingToRoute,
} from "@/store/slices/settings.slice";

describe("Redux Slice: Settings", () => {
  const initialState: ISettingsSliceState = {
    route: {
      animateTo: null,
    },
  };

  it("should return the initial state", () => {
    expect(reducer(undefined, { type: undefined })).toEqual(initialState);
  });

  describe("Actions", () => {
    it("Given Action: setAnimateTo, Then it should fill the requested route in the reducer", () => {
      expect(reducer(initialState, setAnimateTo("/test")).route).toEqual({
        animateTo: "/test",
      });
    });
  });

  describe("Selectors", () => {
    it("Given Selector: selectAnimatingToRoute, then it should return the related part from redux slice", () => {
      expect(selectAnimatingToRoute({ settings: initialState })).toEqual(
        initialState.route.animateTo,
      );
    });
  });
});
