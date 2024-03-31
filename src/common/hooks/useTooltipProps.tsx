import { TooltipProps } from "@mui/material";
import { useEffect, useRef, useMemo, useCallback } from "react";

interface IuseTooltipProps {
  onHide: () => void;
  timeout?: number;
  showOn: boolean;
}
const useTooltipProps = (props: IuseTooltipProps) => {
  const { showOn, onHide, timeout = 8000 } = props;
  const timeoutRef = useRef<any>(null);
  const tooltipProps: Partial<TooltipProps> = useMemo(()=>({
    open: showOn,
    PopperProps: {
      modifiers: [
        {
          name: "offset",
          options: {
            offset: [10, 10],
          },
        },
      ],
    },
  }),[showOn])

  useEffect(() => {
    if(timeoutRef.current !== null){
      timeoutRef.current = null;
      clearTimeout(timeoutRef.current);
    }
    if (showOn) {
      timeoutRef.current = setTimeout(() => {
        onHide();
      }, timeout);
    }
    return () => clearTimeout(timeoutRef.current);
  }, [showOn, onHide, timeout, timeoutRef]);

  const forceHideAlert = useCallback(() => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
    onHide()
  },[onHide, timeoutRef]);

  return { tooltipProps, forceHideAlert };
};

export default useTooltipProps;
