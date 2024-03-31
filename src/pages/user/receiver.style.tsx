import { Box, List, ListItem } from "@mui/material";
import styled from "@emotion/styled";
import Image from "next/image";
import { withTransientProps } from "@/styles/theme";

export const SummeryInfoBox = styled(Box)`
  && {
    display: flex;
    width: 400px;
    height: 368px;
    flex-direction: column;
    align-items: flex-start;
    flex-shrink: 0;
    border-radius: 24px;
    background: #fff;
    padding: 32px 24px;
    justify-content: space-between;
  }
`;

export const MessageBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

export const StyledVisualImg = styled(Image)`
  && {
    position: fixed;
    left: 4%;
    top: auto;
    bottom: -2%;
    margin: auto;
  }
`;

export const ReceiverFilesViewLeftWrapper = styled(Box)`
  && {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    position: fixed;
    max-width: inherit;
    width: inherit;
    padding-bottom: 40px;
    padding-top: 120px;
    top: 0;
  }
`;

export const SenderCommentBox = styled(Box)`
  && {
    padding: ${(p) => p.theme.spacing(3, 2.5, 2.5, 2.5)};
    background-color: #fff;
    border-radius: 24px;
    height: 300px;
    width: 100%;
    max-width: 306px;
    position: relative;
  }
`;

interface ISenderCommentBoxInnerWrapperProps {
  $showBottomLine: boolean;
}
export const SenderCommentBoxInnerWrapper = styled(
  Box,
  withTransientProps,
)<ISenderCommentBoxInnerWrapperProps>`
  && {
    overflow-y: auto;
    overflow-wrap: anywhere;
    height: 100%;
    padding-right: 8px;
    &&:after {
      content: "";
      display: block;
      width: 100%;
      height: 52px;
      background: linear-gradient(
        180deg,
        rgba(255, 255, 255, 0) 0%,
        #fff 91.67%
      );
      position: absolute;
      bottom: 20px;
      left: 0;
      right: 0;
      border-radius: 0 0 24px 24px;
      transition: 0.2s linear all;
      opacity: ${(p) => (p.$showBottomLine ? 0 : 1)};
    }
  }
`;

export const ReceiverFilesViewRightWrapper = styled(Box)`
  && {
    max-width: 590px;
    width: 100%;
  }
`;

export const ReceiverFilesList = styled(List)`
  && {
  }
`;

export const ReceiverFilesListItemExtension = styled(Box)`
  && {
    display: flex;
    width: 40px;
    height: 40px;
    padding: 0px 16px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 10px;
    border-radius: 12px;
    margin-right: 16px;
    & label {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
`;

export const ReceiverFilesListItem = styled(ListItem)`
  && {
    display: flex;
    padding: 0px 12px;
    border-radius: 16px;
    background: #fff;
    margin-bottom: 24px;
    height: 64px;
    &&:nth-of-type(odd) ${ReceiverFilesListItemExtension} {
      background-color: #afeae7;
    }
    &&:nth-of-type(even) ${ReceiverFilesListItemExtension} {
      background-color: #ff9665;
    }
  }
`;
