"use client";

import { useRouter } from "next/router";
import styled from "@emotion/styled";
import { FC, useEffect } from "react";
import { Theme, keyframes } from "@mui/material";
import React from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { setAnimateTo } from "@/store/slices/settings.slice";
import { selectReceiverConfimationState } from "@/store/slices/receiver.slice";
import { withTransientProps } from "@/styles/theme";

//fixme: all hardcoded color will be moved to the theme file when the palette is updated by the design team.
const bgColor: any = (
  theme: Theme,
  route: string,
  path: string,
  isReceiverConfirmed: boolean,
) => {
  if (path?.includes("/user/receiver")) {
    if (isReceiverConfirmed) return "#F3F5F7";

    return "#F9DC8F";
  }
  const mapper: any = {
    "/": theme.palette.green[200],
    "/404": theme.palette.grey["A100"],
    "/test": theme.palette.grey[200],
    "/upload": theme.palette.yellow[200],
    "/upload/analyze": theme.palette.blue[100],
    "/success": theme.palette.pink[100],
    "/expired": "#F9DC8F",
  };

  return mapper[route] || theme.palette.green[200];
};

interface ContainerProps {
  $route: string;
  $path: string;
  $isReceiverConfirmed: boolean;
}

export const Container = styled("div", withTransientProps)<ContainerProps>`
  background-color: ${(p) =>
    bgColor(p.theme, p.$route, p.$path, p.$isReceiverConfirmed)};
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  transition: background-color 2s ease-in-out;
`;

const topAnimation = keyframes({
  "0%": {
    top: "100%",
    borderTopLeftRadius: "0",
    borderTopRightRadius: "0",
  },
  "70%": {
    top: "30%",
    borderTopLeftRadius: "90% 30%",
    borderTopRightRadius: "90% 30%",
  },
  "100%": {
    top: 0,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
});

export const OvelayBg = styled(Container)`
  animation: ${topAnimation} 2s cubic-bezier(0.41, 0.28, 0.87, 0.55);
  z-index: 12;
`;

interface Props {
  children: JSX.Element | JSX.Element[];
}
const BackgroundContainer: FC<Props> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { route, asPath } = useRouter();
  const isReceiverConfirmed = useAppSelector(selectReceiverConfimationState);

  useEffect(() => {
    dispatch(setAnimateTo(null));
  }, [dispatch, route]);

  return (
    <>
      {/** please do not remove the following commented line, will be decided with the design team next time. currently it's disabled */}
      {/* {animateTo !== null && <OvelayBg route={animateTo} />} */}
      <Container
        $route={route}
        $path={asPath}
        $isReceiverConfirmed={isReceiverConfirmed}
      >
        {children}
      </Container>
    </>
  );
};

export default BackgroundContainer;
