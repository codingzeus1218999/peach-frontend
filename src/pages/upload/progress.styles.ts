"use client";

import styled from "@emotion/styled";
import { Box } from "@mui/material";
import Image from "next/image";

export const StyledVisualImg = styled(Image)`
  && {
    margin: auto;
  }
`;

export const PercentWrapper = styled(Box)`
  && {
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #000;
    border-radius: 50%;
    margin: 10px;
  }
`;
