"use client";

import { pulseAnimation } from "@/styles/animations";
import { withTransientProps } from "@/styles/theme";
import styled from "@emotion/styled";
import {
  Autocomplete,
  Box,
  Fab,
  FormLabel,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemProps,
  ListItemText,
  TextareaAutosize,
  Tooltip,
  TooltipProps,
  tooltipClasses,
} from "@mui/material";
import Image from "next/image";
import { Error as ErrorIcon } from "@mui/icons-material";

interface IFormAreaWrapperProps {
  $maxFormHeight: boolean;
}

export const FormAreaWrapper = styled(
  Box,
  withTransientProps,
)<IFormAreaWrapperProps>`
  && {
    background-color: white;
    width: ${(p) => p.theme.spacing(50)};
    border-radius: ${(p) => p.theme.spacing(3)};
    ${(p) => !p.$maxFormHeight && "border: 6px solid rgba(0, 0, 0, 0.08);"}
    margin: auto;
    max-height: ${(p) => p.theme.spacing(p.$maxFormHeight ? 68 : 42)};
    height: 100%;
    position: relative;
    top: ${(p) => (!p.$maxFormHeight ? p.theme.spacing(8) : "auto")};
    transition: max-height 0.7s cubic-bezier(0.55, 0.55, 0.55, 0.55);
    padding: ${(p) => p.theme.spacing(0, 1, 3, 2)};
    overflow: ${(p) => (p.$maxFormHeight ? "hidden" : "unset")};
  }
`;

export const StyledUploadBtn = styled(Fab)`
  && {
    animation: ${(p) => (p.size !== "small" ? pulseAnimation : "none")} 1.5s
      infinite cubic-bezier(0.79, 0.62, 0.76, 0.96);
    outline: 1px solid #000;

    ${(p) => p.size === "small" && ` outline-offset: 4px;`}
    margin: ${(p) =>
      p.size === "small"
        ? p.theme.spacing(0, 1, 0, 0)
        : p.theme.spacing(3, "auto")};
    display: flex;
    color: #fff;
    z-index: 10;
  }
` as typeof Fab;

export const NoSelectedStateWrapper = styled(Box)`
  && {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
    margin-top: ${(p) => p.theme.spacing(4)};
    overflow: hidden;
  }
` as typeof Box;

interface IDisplayHandler {
  $displayed?: boolean;
}

export const FormViewWrapper = styled(Box, withTransientProps)<IDisplayHandler>`
  && {
    overflow-y: auto;
    height: inherit;
    display: ${(p) => (p.$displayed ? "block" : "none")};
    padding-right: 8px;
    margin-right: 0;
    scroll-behavior: smooth;
  }
`;

export const VisualImg = styled(Image, withTransientProps)<IDisplayHandler>`
  && {
    position: absolute;
    margin: auto;
    margin-top: -50%;
    left: 0;
    right: 0;
    display: ${(p) => (p.$displayed ? "block" : "none")};
  }
`;

export const FormHeading = styled(Box)`
  && {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: ${(p) => p.theme.spacing(2, 1)};
  }
`;

export const FilesListWrapper = styled(Box)`
  && {
    background-color: #f9f9f9;
    border-radius: ${(p) => p.theme.spacing(2)};
    margin-top: ${(p) => p.theme.spacing(2)};
    /* padding: ${(p) => p.theme.spacing(1, 2)}; */
    margin-bottom: ${(p) => p.theme.spacing(3)};
  }
`;

export const FilesListHeading = styled(Box)`
  && {
    display: flex;
    justify-content: space-between;
    align-items: center;
    /* margin-bottom: ${(p) => p.theme.spacing(1)}; */
    padding: ${(p) => p.theme.spacing(0.5, 0, 0, 0)};
    margin: ${(p) => p.theme.spacing(0, 2)};
    && button {
      text-transform: capitalize;
    }
    && label {
      display: flex;
      height: 40px;
      padding: 6px 0px;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      flex: 1 0 0;
    }
    border-bottom: 1px solid #eee;
  }
`;

interface IStyledFileListItemProps extends ListItemProps {
  $hasError: boolean;
}

export const StyledFileListItem = styled(
  ListItemButton,
  withTransientProps,
)<IStyledFileListItemProps>`
  && {
    padding: 4px 8px 4px 16px;
    cursor: default;
    height: ${(p) => p.theme.spacing(7)};
      ${(p) =>
        p.$hasError &&
        `
      background: rgba(255, 149, 101, 0.12);
    `};
  }
`;
export const StyledFileListItemIcon = styled(ListItemIcon)`
  && {
    min-width: ${(p) => p.theme.spacing(4)};
    margin-right: ${(p) => p.theme.spacing(2)};
  }
`;
export const StyledFileListItemText = styled(ListItemText)`
  && {
    && span,
    && p {
      white-space: nowrap;
      overflow-x: hidden;
      text-overflow: ellipsis;
      padding-right: ${(p) => p.theme.spacing(1)};
    }
    && span {
      font-size: ${(p) => p.theme.typography.labelLg.fontSize};
    }
    && p {
      font-size: ${(p) => p.theme.typography.labelMd.fontSize};
    }

    &.MuiListItemText-multiline {
      margin: 0;
    }
  }
` as typeof ListItemText;

export const SendButtonWrapper = styled(Box)`
  && {
    background-color: #fff;
    padding: ${(p) => p.theme.spacing(0.25, 0.5)};
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding-top: ${(p) => p.theme.spacing(2)};
    padding-right: ${(p) => p.theme.spacing(2)};
  }
`;

export const ErrorTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.common.white,
    transform: "none !important",
    top: "45% !important",
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.white,
    color: "rgba(0, 0, 0, 0.87)",
    boxShadow: theme.shadows[1],
    maxWidth: theme.spacing(28),
    borderRadius: theme.spacing(2),
  },
})) as typeof Tooltip;

export const StyledTextarea = styled(TextareaAutosize)`
  && {
    line-height: 1.5;
    border: 0;
    resize: none;
    padding: 0;
    &:focus-visible {
      outline: none;
    }
  }
`;

export const CharCount = styled.p`
  && {
    color: ${(p) => p.theme.palette.grey[600]};
    font-size: ${(p) => p.theme.spacing(1.5)};
    align-self: end;
    padding: ${(p) => p.theme.spacing(0, 0.625)};
  }
`;

export const StyledErrorIcon = styled(ErrorIcon)`
  && {
    color: ${(p) => p.theme.palette.error.main};
    background: radial-gradient(#000 40%, #fff 50%);
    border-radius: 50%;
  }
`;

export const StyledErrorContentWrapper = styled(Box)`
  && {
    padding: ${(p) => p.theme.spacing(2)};
  }
`;

export const StyledFormLabel = styled(FormLabel)`
  & {
    color: ${(p) => p.theme.palette.grey[800]};
    font-size: ${(p) => p.theme.typography.labelMd.fontSize};
    display: block;
    margin-bottom: ${(p) => p.theme.spacing(1)};
  }
`;

export const FieldWrapper = styled(Box)`
  && {
    & .MuiTextField-root {
      width: 100%;
    }
    > label {
      color: ${(p) => p.theme.palette.grey[800]};
      font-size: ${(p) => p.theme.spacing(1.5)};
      display: block;
      margin-bottom: ${(p) => p.theme.spacing(1)};
    }
    margin-bottom: ${(p) => p.theme.spacing(2)};
    & .MuiOutlinedInput-notchedOutline {
      border-radius: ${(p) => p.theme.spacing(1.5)};
      min-height: ${(p) => p.theme.spacing(5)};
    }
    & .MuiOutlinedInput-input {
      font-size: ${(p) => p.theme.typography.body3.fontSize};
      font-weight: ${(p) => p.theme.typography.body3.fontWeight};
      font-family: ${(p) => p.theme.typography.body3.fontFamily};
      line-height: ${(p) => p.theme.typography.body3.lineHeight};
      padding: ${(p) => p.theme.spacing(1.25, 1.75)};
    }
  }
`;

interface IStyledRecieversEmailWrapperProps {
  $isMenuOpen: boolean;
}
export const StyledRecieversEmailWrapper = styled(
  Box,
  withTransientProps,
)<IStyledRecieversEmailWrapperProps>`
  && {
    border: ${(p) =>
      !p.$isMenuOpen ? "1px solid rgba(0, 0, 0, 0.23)" : "2px solid #000"};
    &:hover {
      border: ${(p) => (!p.$isMenuOpen ? "1px solid #000" : "2px solid #000")};
    }
    border-radius: ${(p) => p.theme.spacing(1.5)};
    margin-bottom: ${(p) => p.theme.spacing(2)};
  }
`;

export const StyledRecieversEmailsList = styled(
  Box,
  withTransientProps,
)<IStyledRecieversEmailWrapperProps>`
  && {
    display: ${(p) => (p.$isMenuOpen ? "block" : "none")};
    padding: ${(p) => p.theme.spacing(0, 1.5, 0.5)};
    & .MuiChip-root {
      margin-bottom: ${(p) => p.theme.spacing(0.5)};
      margin-right: ${(p) => p.theme.spacing(0.5)};
    }
  }
`;

interface IStyledRecieversEmailsProps {
  $darkPlaceholder: boolean;
}
export const StyledRecieversEmails = styled(
  Autocomplete,
  withTransientProps,
)<IStyledRecieversEmailsProps>`
  && {
    fieldset {
      border: none;
      outline: none;
    }
    & .MuiOutlinedInput-input {
      font-size: ${(p) => p.theme.typography.body3.fontSize};
      font-weight: ${(p) => p.theme.typography.body3.fontWeight};
      font-family: ${(p) => p.theme.typography.body3.fontFamily};
      line-height: ${(p) => p.theme.typography.body3.lineHeight};
      padding: ${(p) => p.theme.spacing(1.25, 1.75)};
    }
    & .MuiOutlinedInput-root {
      padding-right: ${(p) => p.theme.spacing(1)};
    }
    input {
      &::placeholder {
        color: ${(p) =>
          p.$darkPlaceholder ? "#000" : p.theme.palette.grey[500]};
        opacity: 1;
      }
    }
  }
`;
