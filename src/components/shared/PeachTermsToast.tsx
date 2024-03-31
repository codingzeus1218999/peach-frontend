"use client";

import { Button, Slide, Typography, styled } from "@mui/material";
import { Trans } from "next-i18next";
import Link from "next/link";
import { useEffect, useState } from "react";

const TermsToastWrapper = styled("div")`
  background-color: #000;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: ${(p) => p.theme.spacing(1.5, 3)};
  gap: ${(p) => p.theme.spacing(0.75)};
  position: fixed;
  width: fit-content;
  height: ${(p) => p.theme.spacing(6.5)};
  color: #fff;
  justify-content: space-between;
  border-radius: ${(p) => p.theme.spacing(3)};
  bottom: ${(p) => p.theme.spacing(4)};
  left: 0;
  right: 0;
  margin: auto;
  & a {
    text-decoration: underline;
  }
  z-index: 1;
`;

const PeachTermsToast = () => {
  const [displayState, setDisplayState] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => {
      setDisplayState(false);
    }, 4000);
  }, []);

  return (
    <Slide direction="up" in={displayState} mountOnEnter unmountOnExit>
      <TermsToastWrapper data-testid="dti-PeachTermsToast">
        <Typography variant="caption">
          <Trans>
            landing.page.sender.terms.toast
            <Link target="_blank" rel="noopener noreferrer" href={`/terms`}>
              link
            </Link>
          </Trans>
        </Typography>
      </TermsToastWrapper>
    </Slide>
  );
};

export default PeachTermsToast;
