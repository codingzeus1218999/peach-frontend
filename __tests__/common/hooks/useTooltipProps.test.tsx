import { act, renderHook, waitFor } from "@testing-library/react";
import useTooltipProps from "@/common/hooks/useTooltipProps";

describe("useTooltipProps", () => {
  it(`
    Given useTooltipProps used with 4000ms as hide timeout,
    Then the showOn flag will be false after 4000ms
  `, async () => {
    let showOn = true;
    const onHide = () => {
      showOn = false;
    };
    const hook = renderHook(
      () => useTooltipProps({ onHide, showOn, timeout: 4000 }),
      {
        initialProps: false,
      },
    );

    expect(hook.result.current.tooltipProps.open).toEqual(true);
    await waitFor(
      () => {
        hook.rerender(true);
        expect(hook.result.current.tooltipProps.open).toEqual(false);
      },
      { timeout: 5000 },
    );
  });

  it(`
  Given useTooltipProps used with 5000ms as hide timeout,
  if the user calls forceHideAlert() method before the time reaches to 5000ms,
  then the showOn flag will be immediately false.
  `, async () => {
    let showOn = true;
    const onHide = () => {
      showOn = false;
    };
    const hook = renderHook(
      () => useTooltipProps({ onHide, showOn, timeout: 5000 }),
      {
        initialProps: false,
      },
    );

    expect(hook.result.current.tooltipProps.open).toEqual(true);
    await waitFor(
      () => {
        hook.result.current.forceHideAlert()
        hook.rerender(true);
        expect(hook.result.current.tooltipProps.open).toEqual(false);
      },
      { timeout: 3000 },
    );
  });

});
