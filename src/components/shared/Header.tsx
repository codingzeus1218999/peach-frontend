"use client";

import theme from "@/styles/theme";
import { Box, Button, Container } from "@mui/material";

import dynamic from "next/dynamic";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

const PeachGoLogo = dynamic(() => import("./PeachGoLogo"));

const Header = () => {
  const { t } = useTranslation();
  return (
    <Box
      sx={{
        "&&": {
          height: theme.spacing(11),
          display: "flex",
          alignItems: "center",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
        },
      }}
    >
      <Container maxWidth={false}>
        <Box
          sx={{
            "&&": {
              display: "flex",
              justifyContent: "space-between",
            },
          }}
        >
          <PeachGoLogo />
          <Button
            variant="outlined"
            size="medium"
            sx={{
              "&&": {
                background: "transparent",
              },
            }}
          >
            {t("app.header.buttons.feedback.text")}
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Header;
