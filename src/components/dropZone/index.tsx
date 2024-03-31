import styled from "@emotion/styled";
import { Typography, Fade } from "@mui/material";
import { useTranslation } from "next-i18next";
import { FC } from "react";

interface FullScreenDropZoneProps {
  isDragActive: boolean;
}

const FullScreenDropZone = styled.div<FullScreenDropZoneProps>`
  && {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-color: ${(p) =>
      p.isDragActive
        ? p.theme.palette.yellow[200]
        : p.theme.palette.green[200]};
    margin: auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: ${(p) => (p.isDragActive ? 9999 : -1)};
  }
`;

const TextWrapper = styled.div`
  && {
    width: 402px;
  }
`;

export interface DropZoneProps {
  isDragActive: boolean;
}

const DropZone: FC<DropZoneProps> = ({ isDragActive }) => {
  const { t } = useTranslation();

  if (isDragActive) {
    return (
      <Fade in timeout={400}>
        <FullScreenDropZone
          data-testid="make-it-rain"
          isDragActive={isDragActive}
        >
          <TextWrapper>
            <Typography variant="displaySm" align="center">
              {t("landing.page.sender.rain.heading")}
            </Typography>
            <Typography
              variant="body2"
              align="center"
              sx={{ paddingTop: "8px" }}
            >
              {t("landing.page.sender.rain.text")}
            </Typography>
          </TextWrapper>
        </FullScreenDropZone>
      </Fade>
    );
  }

  return null;
};

export default DropZone;
